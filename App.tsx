import React, { useState, useEffect, useMemo } from 'react';
// Final build trigger with correct Supabase Anon Key: 2026-01-05 16:08
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import About from './components/About';
import AIAssistant from './components/AIAssistant';
import AdminPanel from './components/AdminPanel';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';
import { Product } from './types';
import { LegalPageType } from './data/legalContent';
import { APP_CONFIG, MOCK_PRODUCTS } from './constants';
import { fetchProductsFromSheet } from './services/csvService';
import { supabase } from './lib/supabase';

const STORAGE_KEY = 'tahona_products_data';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalPageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 1. Intentar cargar desde Supabase (Si está configurado)
        if (supabase) {
          try {
            // Try to fetch with 'orden' column first
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .order('orden', { ascending: true }); // Ordered by custom order

            if (error) {
              // If orden column doesn't exist, try without ordering or with created_at
              if (error.code === '42703') {
                console.warn('⚠️ Column "orden" not found, fetching without ordering...');
                const fallbackQuery = await supabase
                  .from('products')
                  .select('*')
                  .order('created_at', { ascending: false });

                if (fallbackQuery.error) throw fallbackQuery.error;
                if (fallbackQuery.data) {
                  setProducts(fallbackQuery.data);
                  setError("⚠️ Nota: La base de datos necesita actualización (falta columna 'orden'). Ver URGENT_FIX.md");
                  setLoading(false);
                  return;
                }
              } else {
                throw error;
              }
            }

            if (data) {
              setProducts(data);
              setLoading(false);
              return;
            }
          } catch (supabaseError) {
            console.error("Supabase error:", supabaseError);
            throw supabaseError;
          }
        }

        // 2. Fallback: LocalStorage (persistencia local si no hay DB)
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const products = JSON.parse(savedData);
          const sorted = Array.isArray(products)
            ? [...products].sort((a, b) => (a.orden || 0) - (b.orden || 0))
            : [];
          setProducts(sorted);
          setLoading(false);
          return;
        }

        // 3. Fallback: CSV o Mock
        if (APP_CONFIG.sheetUrl) {
          const sheetProducts = await fetchProductsFromSheet(APP_CONFIG.sheetUrl);
          const finalProducts = sheetProducts.length > 0 ? sheetProducts : MOCK_PRODUCTS;
          const sorted = [...finalProducts].sort((a, b) => (a.orden || 0) - (b.orden || 0));
          setProducts(sorted);
        } else {
          const sorted = [...MOCK_PRODUCTS].sort((a, b) => (a.orden || 0) - (b.orden || 0));
          setProducts(sorted);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Error conectando con la base de datos. Mostrando modo offline.");
        // Fallback a mock en caso de error de conexión
        const savedData = localStorage.getItem(STORAGE_KEY);
        setProducts(savedData ? JSON.parse(savedData) : MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Función auxiliar para guardar (Solo LocalStorage como backup local, la escritura real va en AdminPanel)
  const saveToStorage = (updatedProducts: Product[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    } catch (e) {
      console.error("Error guardando en local:", e);
    }
  };

  const handleAddLocalProduct = (newProduct: Product) => {
    setProducts(prev => {
      const updated = [newProduct, ...prev];
      saveToStorage(updated);
      return updated;
    });
    // Feedback visual
    setTimeout(() => alert("✅ Producto añadido correctamente."), 100);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === updatedProduct.id ? updatedProduct : p);
      // Sort by orden if available
      const sorted = [...updated].sort((a, b) => (a.orden || 0) - (b.orden || 0));
      saveToStorage(sorted);
      return sorted;
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("¿Estás seguro de que quieres borrar este producto?")) {
      setProducts(prev => {
        const updated = prev.filter(p => String(p.id) !== String(productId));
        saveToStorage(updated);
        return updated;
      });
    }
  };

  const categories = ['Todos', 'Panadería', 'Postres', 'Sin Gluten', 'Sin Lactosa'];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return products;
    return products.filter(p => {
      const prodCat = p.categoria || 'Panadería';
      return prodCat === activeCategory;
    });
  }, [products, activeCategory]);

  return (
    <div className="min-h-screen bg-bakery-cream text-bakery-dark selection:bg-bakery-wheat selection:text-bakery-brown">
      <Navbar />
      <Hero onOpenAbout={() => setIsAboutOpen(true)} />

      {/* About Modal - Rendered conditionally */}
      <About isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Products Section */}
      <main id="productos" className="py-24 hero-pattern relative border-t border-bakery-wheat">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-bakery-gold font-bold uppercase tracking-[0.2em] text-xs mb-3 block">Del Horno a tu Mesa</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-bakery-brown mb-6">Nuestras Especialidades</h2>
            <div className="w-24 h-1 bg-bakery-wheat mx-auto mb-6"></div>
            {error && <p className="text-amber-700 bg-amber-50 p-3 rounded-lg text-sm mb-4">{error}</p>}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${activeCategory === cat
                  ? 'bg-bakery-brown text-white border-bakery-brown shadow-lg transform scale-105'
                  : 'bg-white text-bakery-brown border-bakery-wheat hover:bg-bakery-cream hover:border-bakery-brown'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-bakery-wheat border-t-bakery-gold rounded-full animate-spin"></div>
              <p className="mt-6 text-bakery-brown font-serif italic">Calentando el horno...</p>
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-bakery-brown text-lg font-serif italic">No hay productos en esta categoría por el momento.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              )}
            </>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="bg-bakery-brown/5 hover:bg-bakery-brown hover:text-white text-bakery-brown border border-bakery-brown px-6 py-2 rounded-full text-xs font-bold transition-all"
            >
              ⚙️ Gestionar Catálogo
            </button>
          </div>
        </div>
      </main>

      {/* Location Section */}
      <section id="ubicacion" className="bg-white py-24 border-t border-bakery-wheat">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-4xl font-bold text-bakery-brown mb-4">¿Vienes a por pan?</h2>
                <p className="text-gray-600 text-lg">Te esperamos en nuestra tahona de Moncloa-Aravaca con el mejor aroma a pan recién horneado.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-bakery-cream p-3 rounded-xl border border-bakery-wheat text-bakery-gold">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-bakery-brown">Dirección</h4>
                    <p className="text-gray-500">{APP_CONFIG.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-bakery-cream p-3 rounded-xl border border-bakery-wheat text-bakery-gold">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-bakery-brown">Horario</h4>
                    <p className="text-gray-500">Lun - Vie: 08:30 – 17:30</p>
                    <p className="text-gray-500">Sáb - Dom: 08:15 – 15:00</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <a href={`https://wa.me/${APP_CONFIG.whatsappNumber}`} className="flex items-center gap-2 bg-whatsapp-green text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-whatsapp-dark transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.589.943 3.111 1.417 4.757 1.418 5.455 0 9.893-4.438 9.895-9.894 0-2.643-1.029-5.127-2.9-7.001-1.869-1.868-4.354-2.896-7.001-2.897-5.454 0-9.892 4.438-9.895 9.896-.001 1.764.469 3.483 1.36 4.992l-.999 3.648 3.743-.982zm11.332-6.853c-.302-.152-1.791-.883-2.068-.984-.277-.101-.479-.152-.681.152-.202.303-.782 1.011-.959 1.213-.177.203-.353.228-.655.076-.301-.151-1.274-.47-2.426-1.498-.897-.8-1.503-1.787-1.68-2.09-.176-.302-.019-.465.132-.614.136-.134.302-.353.453-.53.151-.176.202-.302.302-.505.101-.202.05-.378-.025-.53-.076-.151-.681-1.642-.933-2.248-.245-.592-.493-.513-.68-.522-.176-.008-.378-.01-.58-.01-.202 0-.53.076-.807.379-.277.303-1.061 1.036-1.061 2.527 0 1.491 1.086 2.932 1.237 3.134.152.202 2.137 3.264 5.178 4.572.723.311 1.288.497 1.727.637.726.231 1.387.198 1.91.12.583-.087 1.791-.733 2.043-1.44.253-.707.253-1.314.177-1.44-.077-.126-.278-.202-.58-.354z" /></svg>
                  Escríbenos
                </a>
                <a href={`tel:+${APP_CONFIG.whatsappNumber}`} className="bg-bakery-cream border border-bakery-wheat text-bakery-brown px-8 py-3 rounded-full font-bold hover:bg-white transition-all">
                  Llamar
                </a>
              </div>
            </div>

            <div className="h-[450px] bg-bakery-wheat rounded-3xl overflow-hidden shadow-2xl relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3035.7983635957383!2d-3.7196014!3d40.4571026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4229ca2391039b%3A0xc3f3a09335f68b3d!2sCalle%20de%20Valdevarnes%2C%203%2C%2028039%20Madrid!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <AIAssistant />

      {isAdminOpen && (
        <AdminPanel
          products={products}
          onAddProduct={handleAddLocalProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      <CookieBanner />
      <Footer onOpenLegal={(type) => setLegalModalType(type)} />

      <LegalModal
        isOpen={!!legalModalType}
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
};

export default App;