import React from 'react';
import { APP_CONFIG } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const About: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] overflow-y-auto shadow-2xl animate-scaleUp relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 bg-white/80 hover:bg-bakery-brown hover:text-white text-bakery-brown p-2 rounded-full transition-all shadow-md backdrop-blur-sm"
        >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="relative overflow-hidden py-16">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-bakery-wheat/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
              
              {/* Image Column */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 border-2 border-bakery-gold rounded-full transform rotate-6 scale-105 opacity-60"></div>
                  <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10">
                    <img 
                      src="https://i.ibb.co/9HHbCvnF/IMG-4664.png" 
                      alt="El Panadero de Tahona La Baguette" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback a imagen genérica si falla la carga
                        e.currentTarget.src = "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=1000&auto=format&fit=crop";
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                  <div className="absolute bottom-4 -right-4 bg-bakery-brown text-white p-4 rounded-xl shadow-lg z-20 max-w-[200px]">
                    <p className="font-serif italic text-sm">"El buen pan no necesita explicarse demasiado."</p>
                  </div>
                </div>
              </div>

              {/* Text Column */}
              <div className="w-full md:w-1/2 space-y-6">
                <span className="text-bakery-gold font-bold uppercase tracking-widest text-sm">Nuestra Historia</span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-bakery-brown leading-tight">
                  Tahona de Barrio,<br/>
                  <span className="text-bakery-gold">Trato de Casa.</span>
                </h2>
                
                <div className="prose prose-lg text-gray-600 font-light leading-relaxed space-y-4">
                  <p>
                    Soy panadero. No por moda, ni por Instagram. Lo soy porque crecí entre hornos, madrugones y vecinos que entraban diciendo “lo de siempre”.
                  </p>
                  <p>
                    Tengo entre 35 y 45 años, los suficientes para saber que el buen pan no necesita explicarse demasiado. Se nota. En el olor al abrir la puerta, en la corteza que suena, en la cara del cliente cuando vuelve al día siguiente.
                  </p>
                  <p className="font-serif text-bakery-brown text-xl italic border-l-4 border-bakery-gold pl-4 py-2 my-6 bg-bakery-cream/30">
                    Tahona La Baguette nace con una idea sencilla: hacer las cosas bien y tratar mejor aún a la gente del barrio.
                  </p>
                  <p>
                    Aquí no hay prisas por vender más de lo que podemos hacer con cariño. Hay pan del día, roscones cuando toca, tartas por encargo y conversaciones cortas pero honestas al otro lado del mostrador.
                  </p>
                  <p>
                    Conozco a muchos clientes por su nombre. A otros por lo que compran los domingos. Y a algunos por cómo se les alegra la cara cuando les guardo “esa barra que te gusta más tostada”.
                  </p>
                  <p>
                    No hacemos reparto, no somos una franquicia y no pretendemos gustar a todo el mundo. Somos una tahona de barrio, de las que abren temprano y cierran cuando el trabajo está hecho.
                  </p>
                  <p className="font-bold text-bakery-brown">
                    Si buscas pan bien hecho, trato cercano y un sitio donde todavía se cuidan los detalles, esta es tu casa.
                  </p>
                  <p>
                    Nos vemos mañana. El horno ya está encendido.
                  </p>
                </div>

                <div className="pt-4">
                  <a 
                    href={`https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent("Hola, he leído vuestra historia y me gustaría hacer un encargo.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-bakery-gold text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-bakery-brown transition-all transform hover:-translate-y-1"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.589.943 3.111 1.417 4.757 1.418 5.455 0 9.893-4.438 9.895-9.894 0-2.643-1.029-5.127-2.9-7.001-1.869-1.868-4.354-2.896-7.001-2.897-5.454 0-9.892 4.438-9.895 9.896-.001 1.764.469 3.483 1.36 4.992l-.999 3.648 3.743-.982zm11.332-6.853c-.302-.152-1.791-.883-2.068-.984-.277-.101-.479-.152-.681.152-.202.303-.782 1.011-.959 1.213-.177.203-.353.228-.655.076-.301-.151-1.274-.47-2.426-1.498-.897-.8-1.503-1.787-1.68-2.09-.176-.302-.019-.465.132-.614.136-.134.302-.353.453-.53.151-.176.202-.302.302-.505.101-.202.05-.378-.025-.53-.076-.151-.681-1.642-.933-2.248-.245-.592-.493-.513-.68-.522-.176-.008-.378-.01-.58-.01-.202 0-.53.076-.807.379-.277.303-1.061 1.036-1.061 2.527 0 1.491 1.086 2.932 1.237 3.134.152.202 2.137 3.264 5.178 4.572.723.311 1.288.497 1.727.637.726.231 1.387.198 1.91.12.583-.087 1.791-.733 2.043-1.44.253-.707.253-1.314.177-1.44-.077-.126-.278-.202-.58-.354z" /></svg>
                    Encarga Aquí
                  </a>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;