
import React from 'react';
import { Product } from '../types';
import { APP_CONFIG } from '../constants';

const ProductCard: React.FC<Product> = ({ titulo, descripcion, precio, imagen, imagenes, etiqueta, boton, categoria }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // Usar el array de imágenes si existe y tiene elementos, sino usar imagen simple
  const gallery = (imagenes && imagenes.length > 0) ? imagenes : [imagen];
  const hasMultiple = gallery.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const whatsappMsg = encodeURIComponent(`Hola Tahona La Baguette, me gustaría encargar: ${titulo}`);
  const whatsappUrl = `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${whatsappMsg}`;

  const isDietary = categoria === 'Sin Gluten' || categoria === 'Sin Lactosa';

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-amber-50 h-full flex flex-col">
      <div className="relative h-64 overflow-hidden">
        {hasMultiple && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">‹</button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">›</button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {gallery.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
        <img
          src={gallery[currentImageIndex] || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'}
          alt={titulo}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500';
          }}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        {etiqueta && (
          <div className="absolute top-4 right-4 bg-bakery-gold text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
            {etiqueta}
          </div>
        )}
        {isDietary && (
          <div className="absolute bottom-4 left-4 bg-green-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <span>🌱</span> {categoria}
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-2xl font-bold text-bakery-brown leading-tight">
            {titulo}
          </h3>
          <span className="text-xl font-bold text-bakery-gold whitespace-nowrap ml-2">
            {precio}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2 h-10">
          {descripcion}
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-whatsapp-green hover:bg-whatsapp-dark text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.589.943 3.111 1.417 4.757 1.418 5.455 0 9.893-4.438 9.895-9.894 0-2.643-1.029-5.127-2.9-7.001-1.869-1.868-4.354-2.896-7.001-2.897-5.454 0-9.892 4.438-9.895 9.896-.001 1.764.469 3.483 1.36 4.992l-.999 3.648 3.743-.982zm11.332-6.853c-.302-.152-1.791-.883-2.068-.984-.277-.101-.479-.152-.681.152-.202.303-.782 1.011-.959 1.213-.177.203-.353.228-.655.076-.301-.151-1.274-.47-2.426-1.498-.897-.8-1.503-1.787-1.68-2.09-.176-.302-.019-.465.132-.614.136-.134.302-.353.453-.53.151-.176.202-.302.302-.505.101-.202.05-.378-.025-.53-.076-.151-.681-1.642-.933-2.248-.245-.592-.493-.513-.68-.522-.176-.008-.378-.01-.58-.01-.202 0-.53.076-.807.379-.277.303-1.061 1.036-1.061 2.527 0 1.491 1.086 2.932 1.237 3.134.152.202 2.137 3.264 5.178 4.572.723.311 1.288.497 1.727.637.726.231 1.387.198 1.91.12.583-.087 1.791-.733 2.043-1.44.253-.707.253-1.314.177-1.44-.077-.126-.278-.202-.58-.354z" />
          </svg>
          {boton || 'Pedir'}
        </a>
      </div>
    </div>
  );
};

export default ProductCard;