
import React from 'react';
import { Product } from '../types';
import { APP_CONFIG } from '../constants';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const whatsappMsg = encodeURIComponent(`Hola Tahona La Baguette, me gustaría encargar: ${product.titulo}`);
  const whatsappUrl = `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${whatsappMsg}`;

  const isDietary = product.categoria === 'Sin Gluten' || product.categoria === 'Sin Lactosa';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-bakery-wheat/30 overflow-hidden group hover:shadow-xl hover:border-bakery-wheat transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={product.imagen} 
          alt={product.titulo} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/bakery/800/600';
          }}
        />
        {product.etiqueta && (
          <div className="absolute top-4 right-4 bg-bakery-gold text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
            {product.etiqueta}
          </div>
        )}
        {isDietary && (
           <div className="absolute bottom-4 left-4 bg-green-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
             <span>🌱</span> {product.categoria}
           </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-2xl font-bold text-bakery-brown leading-tight">
            {product.titulo}
          </h3>
          <span className="text-xl font-bold text-bakery-gold whitespace-nowrap ml-2">
            {product.precio}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2 h-10">
          {product.descripcion}
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
          {product.boton || 'Pedir'}
        </a>
      </div>
    </div>
  );
};

export default ProductCard;