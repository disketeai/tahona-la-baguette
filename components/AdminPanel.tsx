import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

interface Props {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onClose: () => void;
}

const CATEGORIES = ['Panadería', 'Postres', 'Sin Gluten', 'Sin Lactosa'];
const ADMIN_PASSWORD = "tahona"; // Hardcoded simple password

const AdminPanel: React.FC<Props> = ({ products, onAddProduct, onDeleteProduct, onClose }) => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setLoadingImage(true);
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;

      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Comprimir a JPEG calidad 0.7
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

        setImage(compressedBase64);
        setForm(prev => ({ ...prev, imagenUrl: compressedBase64 }));
        setLoadingImage(false);
      }
    };
    img.src = event.target?.result as string;
  };

  reader.readAsDataURL(file);
}
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

  if (supabase) {
    await supabase.from('products').update({ orden: targetOrder }).eq('id', product.id);
    await supabase.from('products').update({ orden: currentOrder }).eq('id', targetProduct.id);
    // We should ideally reload data here, but for now we rely on page reload or optimistic updates in a real app
    // A quick hack for this demo: reload page
    window.location.reload();
  }
};

const handleAdd = async () => {
  const newProductData = {
    ...form,
    imagen: form.imagenUrl || 'https://picsum.photos/seed/bread/800/600',
    imagenes: (form as any).imagenes || [form.imagenUrl || 'https://picsum.photos/seed/bread/800/600'], // Fallback a array con 1 foto
    boton: 'Pedir'
  };

  // Optimistic Update (Local)
  const optimisticProduct: Product = {
    id: Date.now().toString(),
    ...newProductData
  };
  onAddProduct(optimisticProduct);

  // Supabase Insert
  if (supabase) {
    const { error } = await supabase
      .from('products')
      .insert([newProductData]);

    if (error) {
      console.error("Error inserting into Supabase:", error);
      alert("Error guardando en la nube. Se guardará solo localmente.");
    }
  }

  // Reiniciar form
  setForm({ titulo: '', descripcion: '', precio: '', etiqueta: '', imagenUrl: '', categoria: 'Panadería' });
  setImage(null);
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
            <span className="w-8 h-8 bg-bakery-gold text-white rounded-full flex items-center justify-center text-sm">1</span>
            Añadir Nuevo Producto
          </h3>

          <div className="space-y-4">
            {/* Image Upload */}
            <div
              className={`border-2 border-dashed rounded-2xl h-48 flex flex-col items-center justify-center transition-all cursor-pointer bg-white relative overflow-hidden ${image ? 'border-bakery-gold' : 'border-gray-300 hover:border-bakery-wheat'}`}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              {loadingImage ? (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-bakery-gold border-t-transparent rounded-full animate-spin mb-2"></div>
                  <span className="text-xs text-bakery-brown">Optimizando imagen...</span>
                </div>
              ) : image ? (
                <img src={image} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="text-center p-4">
                  <span className="text-3xl mb-2 block">📸</span>
                  <p className="text-sm font-bold text-bakery-brown">Subir foto</p>
                  <p className="text-xs text-gray-400">Se optimizará automáticamente</p>
                </div>
              )}
              <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen (o selección múltiple)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-bakery-gold file:text-white hover:file:bg-orange-600"
                />
              </div>
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

            <button
              onClick={handleAdd}
              disabled={!form.titulo || !form.precio || loadingImage}
              className="w-full mt-4 bg-bakery-brown text-white py-3 rounded-xl font-bold hover:bg-bakery-gold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Añadir al Catálogo
            </button>
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
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      onDeleteProduct(product.id);
                      if (supabase) {
                        await supabase.from('products').delete().eq('id', product.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-600 bg-transparent hover:bg-red-50 p-2 rounded-lg transition-all"
                    title="Eliminar producto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default AdminPanel;