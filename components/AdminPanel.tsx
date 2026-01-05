import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

interface Props {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onClose: () => void;
}

const CATEGORIES = ['Panadería', 'Postres', 'Sin Gluten', 'Sin Lactosa'];
const ADMIN_PASSWORD = "tahona"; // Hardcoded simple password

const AdminPanel: React.FC<Props> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    etiqueta: '',
    imagenUrl: '',
    categoria: 'Panadería'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const [editingId, setEditingId] = useState<string | null>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('No canvas context');

          // Max dimensions
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.height = height;
          canvas.width = width;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.6)); // Compress to 0.6 quality to save DB space
        };
        img.onerror = reject;
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setLoadingImage(true);

      const fileCompressions: Promise<string>[] = Array.from(files).map(file => compressImage(file));

      Promise.all(fileCompressions).then(base64Images => {
        // Append new images to existing ones (or create new array if empty)
        const currentImages = (form as any).imagenes || [];
        const newImagesList = [...currentImages, ...base64Images];

        // Update form state
        setForm(prev => ({
          ...prev,
          imagenUrl: newImagesList[0], // Keep first as main
          imagenes: newImagesList
        }));

        // Update display image if it was empty
        if (!image) setImage(base64Images[0]);

        setLoadingImage(false);
      }).catch(err => {
        console.error("Error processing images", err);
        setLoadingImage(false);
        alert("Error al procesar las imágenes.");
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    const existingImages = product.imagenes && product.imagenes.length > 0
      ? product.imagenes
      : (product.imagen ? [product.imagen] : []);

    setForm({
      titulo: product.titulo,
      descripcion: product.descripcion,
      precio: product.precio,
      etiqueta: product.etiqueta || '',
      imagenUrl: product.imagen,
      categoria: product.categoria || 'Panadería',
      ...(product as any)
    });

    // Force set internal form state for images
    (form as any).imagenes = existingImages;
    setImage(existingImages[0] || product.imagen);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ titulo: '', descripcion: '', precio: '', etiqueta: '', imagenUrl: '', categoria: 'Panadería' });
    setImage(null);
    (form as any).imagenes = [];
  };

  const handleMove = async (e: React.MouseEvent, product: Product, direction: 'up' | 'down') => {
    e.stopPropagation();

    const currentIndex = products.findIndex(p => p.id === product.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    const targetProduct = products[targetIndex];
    if (!targetProduct) return;

    const currentOrder = product.orden ?? currentIndex;
    const targetOrder = targetProduct.orden ?? targetIndex;

    // Optimistic / Offline update
    const updatedProduct = { ...product, orden: targetOrder };
    const updatedTarget = { ...targetProduct, orden: currentOrder };
    onUpdateProduct(updatedProduct);
    onUpdateProduct(updatedTarget);

    if (supabase) {
      await supabase.from('products').update({ orden: targetOrder }).eq('id', product.id);
      await supabase.from('products').update({ orden: currentOrder }).eq('id', targetProduct.id);
      // We should ideally reload data here, but for now we rely on page reload or optimistic updates in a real app
      // A quick hack for this demo: reload page
      window.location.reload();
    }
  };

  const handleSave = async () => {
    // Validation
    if (!form.titulo || !form.precio) {
      alert("Por favor, rellena al menos el título y el precio.");
      return;
    }

    const imgs = (form as any).imagenes && (form as any).imagenes.length > 0
      ? (form as any).imagenes
      : (form.imagenUrl ? [form.imagenUrl] : ['https://picsum.photos/seed/bread/800/600']);

    // Ensure main image is always the first one
    const mainImg = imgs[0];

    const productData = {
      ...form,
      imagen: mainImg,
      imagenes: imgs,
      boton: form.boton || 'Pedir'
    };

    // Clean undefined fields
    if (productData.etiqueta === undefined) delete (productData as any).etiqueta;

    try {
      if (editingId) {
        // UPDATE
        // 1. Optimistic/Offline
        const updatedProduct = { id: editingId, ...productData, orden: products.find(p => p.id === editingId)?.orden };
        onUpdateProduct(updatedProduct as Product);

        // 2. Cloud
        if (supabase) {
          const { error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', editingId);

          if (error) throw error;

          alert("✅ Producto actualizado en la nube");
          window.location.reload();
        } else {
          alert("⚠️ Editado solo localmente (Modo Offline)");
          handleCancelEdit();
        }
      } else {
        // CREATE
        const optimisticProduct: Product = {
          id: Date.now().toString(),
          ...productData
        };
        onAddProduct(optimisticProduct);

        if (supabase) {
          const { error } = await supabase
            .from('products')
            .insert([productData]);

          if (error) throw error;

          alert("✅ Producto creado en la nube");
        } else {
          alert("⚠️ Creado solo localmente (Modo Offline)");
        }
      }

      if (!supabase || !editingId) handleCancelEdit();

    } catch (error: any) {
      console.error("Supabase Error:", error);
      alert(`❌ Error al guardar en la base de datos: ${error.message || JSON.stringify(error)}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-scaleUp relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">🔒</span>
            <h2 className="text-2xl font-serif font-bold text-bakery-brown">Acceso Restringido</h2>
            <p className="text-gray-500 text-sm mt-2">Introduce la contraseña de administrador</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Contraseña"
                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all ${loginError ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-bakery-gold'}`}
                autoFocus
              />
              {loginError && <p className="text-red-500 text-xs mt-2 ml-1">Contraseña incorrecta</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-bakery-brown text-white py-3 rounded-xl font-bold hover:bg-bakery-gold transition shadow-lg"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] overflow-hidden shadow-2xl animate-scaleUp flex flex-col">
        {/* Header */}
        <div className="bg-bakery-brown p-5 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="text-2xl font-serif font-bold">Panel de Administración</h2>
            <p className="text-bakery-wheat text-xs">Añade nuevos productos o elimina los existentes</p>
          </div>
          <button onClick={onClose} className="hover:text-bakery-gold transition p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden grid md:grid-cols-2">
          {/* Columna Izquierda: Añadir Producto */}
          <div className="p-6 overflow-y-auto border-r border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-bakery-brown mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-bakery-gold text-white rounded-full flex items-center justify-center text-sm">{editingId ? '✏️' : '1'}</span>
              {editingId ? 'Editar Producto' : 'Añadir Nuevo Producto'}
            </h3>

            <div className="space-y-4">
              {/* Image Upload */}
              <div
                className={`border-2 border-dashed rounded-2xl ${((form as any).imagenes && (form as any).imagenes.length > 0) ? 'min-h-[12rem] h-auto p-4' : 'h-48'} flex flex-col items-center justify-center transition-all cursor-pointer bg-white relative overflow-hidden ${(image || ((form as any).imagenes && (form as any).imagenes.length > 0)) ? 'border-bakery-gold' : 'border-gray-300 hover:border-bakery-wheat'}`}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                {loadingImage ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-bakery-gold border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-xs text-bakery-brown">Procesando imágenes...</span>
                  </div>
                ) : ((form as any).imagenes && (form as any).imagenes.length > 0) ? (
                  <div className="grid grid-cols-3 gap-2 w-full p-2">
                    {(form as any).imagenes.map((img: string, idx: number) => (
                      <div key={idx} className="relative group">
                        <img src={img} className="w-full h-24 object-cover rounded-lg shadow-sm" alt={`Preview ${idx}`} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                          {idx > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newImages = [...(form as any).imagenes];
                                [newImages[idx - 1], newImages[idx]] = [newImages[idx], newImages[idx - 1]];
                                setForm({ ...form, imagenes: newImages } as any);
                                if (idx === 0) setImage(newImages[0]); // Update main image if first changed
                              }}
                              className="bg-white/90 p-1 rounded-full hover:bg-white text-xs"
                              title="Mover izquierda"
                            >
                              ⬅️
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newImages = (form as any).imagenes.filter((_: any, i: number) => i !== idx);
                              setForm({ ...form, imagenes: newImages } as any);
                              if (newImages.length > 0) setImage(newImages[0]);
                              else setImage(null);
                            }}
                            className="bg-red-500/90 p-1 rounded-full hover:bg-red-600 text-white text-xs"
                            title="Eliminar foto"
                          >
                            🗑️
                          </button>
                          {idx < (form as any).imagenes.length - 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newImages = [...(form as any).imagenes];
                                [newImages[idx], newImages[idx + 1]] = [newImages[idx + 1], newImages[idx]];
                                setForm({ ...form, imagenes: newImages } as any);
                                if (idx === 0) setImage(newImages[0]);
                              }}
                              className="bg-white/90 p-1 rounded-full hover:bg-white text-xs"
                              title="Mover derecha"
                            >
                              ➡️
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : image ? (
                  <img src={image} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-3xl mb-2 block">📸</span>
                    <p className="text-sm font-bold text-bakery-brown">Subir fotos (selección múltiple)</p>
                    <p className="text-xs text-gray-400">Haz clic para elegir una o varias</p>
                  </div>
                )}
                <input id="fileInput" type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>

              {/* Form Fields */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={e => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Pan de Centeno"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bakery-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Categoría</label>
                  <select
                    value={form.categoria}
                    onChange={e => setForm({ ...form, categoria: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bakery-gold outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Precio</label>
                  <input
                    type="text"
                    value={form.precio}
                    onChange={e => setForm({ ...form, precio: e.target.value })}
                    placeholder="Ej: 2.50€"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bakery-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Ingredientes, proceso, sabor..."
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm h-20 focus:ring-2 focus:ring-bakery-gold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Etiqueta (Opcional)</label>
                <input
                  type="text"
                  value={form.etiqueta}
                  onChange={e => setForm({ ...form, etiqueta: e.target.value })}
                  placeholder="Ej: Oferta"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-bakery-gold outline-none"
                />
              </div>

              <div className="flex gap-2 mt-4">
                {editingId && (
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={!form.titulo || !form.precio || loadingImage}
                  className={`flex-1 bg-bakery-brown text-white py-3 rounded-xl font-bold hover:bg-bakery-gold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {editingId ? 'Guardar Cambios' : '+ Añadir al Catálogo'}
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Lista de Productos */}
          <div className="p-6 overflow-y-auto bg-white">
            <h3 className="text-lg font-bold text-bakery-brown mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-bakery-gold text-white rounded-full flex items-center justify-center text-sm">2</span>
              Gestionar Catálogo Actual ({products.length})
            </h3>

            <div className="space-y-3">
              {products.length === 0 ? (
                <p className="text-gray-400 text-center italic py-10">No hay productos en el catálogo.</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:shadow-md transition bg-white group relative">
                    <img
                      src={product.imagen}
                      alt={product.titulo}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-bakery-brown text-sm truncate">{product.titulo}</h4>
                        <span className="text-[10px] bg-bakery-cream text-bakery-brown px-2 py-0.5 rounded-full border border-bakery-wheat">{product.categoria || 'Panadería'}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{product.precio}</p>
                    </div>
                    <div className="flex flex-col gap-1 mr-2">
                      <button
                        onClick={(e) => handleMove(e, product, 'up')}
                        className="p-1 text-gray-400 hover:text-bakery-brown hover:bg-gray-100 rounded"
                        title="Subir"
                      >
                        ▲
                      </button>
                      <button
                        onClick={(e) => handleMove(e, product, 'down')}
                        className="p-1 text-gray-400 hover:text-bakery-brown hover:bg-gray-100 rounded"
                        title="Bajar"
                      >
                        ▼
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 mr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(product);
                        }}
                        className="text-gray-400 hover:text-bakery-gold bg-transparent hover:bg-orange-50 p-2 rounded-lg transition-all mb-1"
                        title="Editar producto"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm('¿Seguro que quieres eliminar este producto?')) {
                            onDeleteProduct(product.id);
                            if (supabase) {
                              await supabase.from('products').delete().eq('id', product.id);
                            }
                          }
                        }}
                        className="text-gray-400 hover:text-red-600 bg-transparent hover:bg-red-50 p-2 rounded-lg transition-all"
                        title="Eliminar producto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default AdminPanel;