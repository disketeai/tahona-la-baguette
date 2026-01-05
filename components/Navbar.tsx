import React from 'react';
import { APP_CONFIG } from '../constants';

const Navbar: React.FC = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm fixed w-full z-50 border-b border-bakery-wheat shadow-sm top-0">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a 
          href="#" 
          onClick={handleScrollToTop}
          className="font-serif text-2xl font-bold text-bakery-brown hover:text-bakery-gold transition flex items-center gap-2"
        >
          <span>Tahona La Baguette</span>
          <span className="text-bakery-gold text-4xl leading-none">.</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a 
            href="#productos" 
            onClick={(e) => handleScroll(e, 'productos')}
            className="hover:text-bakery-gold transition font-medium cursor-pointer"
          >
            Catálogo
          </a>
          <a 
            href="#ubicacion" 
            onClick={(e) => handleScroll(e, 'ubicacion')}
            className="hover:text-bakery-gold transition font-medium cursor-pointer"
          >
            Ubicación
          </a>
          <div className="flex items-center gap-2 bg-bakery-cream px-4 py-2 rounded-full border border-bakery-wheat">
            <svg className="w-4 h-4 text-bakery-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <a href={`tel:+${APP_CONFIG.whatsappNumber}`} className="font-bold text-bakery-brown hover:text-bakery-gold transition">
              {APP_CONFIG.phone}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;