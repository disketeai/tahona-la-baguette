import React from 'react';

interface Props {
  onOpenAbout: () => void;
}

const Hero: React.FC<Props> = ({ onOpenAbout }) => {
  return (
    <header className="relative h-[80vh] min-h-[500px] flex items-center justify-center pt-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/p/AF1QipPiBsYJ9jAHUhKXuKlqh3eLe8aSBsxt5HJxC6dn=s1920" 
          className="w-full h-full object-cover brightness-[0.45] scale-105"
          alt="Bakery background"
        />
      </div>
      <div className="relative z-10 text-center text-white px-4 max-w-3xl animate-fadeIn">
        <span className="text-bakery-wheat font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Desde 1985</span>
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 drop-shadow-xl">Pasión por lo Artesano</h1>
        <p className="text-xl md:text-2xl mb-10 text-bakery-wheat font-light">
          Harinas de piedra, postres y el calor del horno tradicional en el corazón de Valdezarza.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#productos" className="bg-bakery-gold hover:bg-white hover:text-bakery-brown text-white py-4 px-10 rounded-full font-bold transition-all shadow-lg transform hover:-translate-y-1">
            Explorar Catálogo
          </a>
          <button 
            onClick={onOpenAbout}
            className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white py-4 px-10 rounded-full font-bold transition-all"
          >
            Nuestra Historia
          </button>
        </div>
      </div>
    </header>
  );
};

export default Hero;