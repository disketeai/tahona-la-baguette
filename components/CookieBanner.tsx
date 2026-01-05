import React, { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'tahona_cookie_consent';

const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            // Show with a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-bakery-wheat shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 md:p-6 animate-slideUp">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">🍪</span>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Utilizamos cookies propias y de terceros para mejorar tu experiencia en nuestra tahona digital,
                        analizar el tráfico y recordar tus preferencias de panadería.
                        Al continuar navegando, aceptas su uso.
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={handleAccept}
                        className="bg-bakery-brown text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-bakery-gold transition shadow-md whitespace-nowrap"
                    >
                        Aceptar todas
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
