import React from 'react';
import { LegalPageType } from '../data/legalContent';

interface Props {
    onOpenLegal: (type: LegalPageType) => void;
}

const Footer: React.FC<Props> = ({ onOpenLegal }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-bakery-dark text-bakery-wheat py-12 border-t border-bakery-brown/30">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 mb-8 text-center md:text-left">

                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-2xl text-white font-bold">Tahona La Baguette</h3>
                        <p className="text-sm opacity-70">
                            Artesanía y tradición en cada hornada. Elaboramos pan de verdad desde hace más de 20 años.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-white mb-2">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button
                                    onClick={() => onOpenLegal('aviso-legal')}
                                    className="hover:text-bakery-gold transition text-left"
                                >
                                    Aviso Legal
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onOpenLegal('privacidad')}
                                    className="hover:text-bakery-gold transition text-left"
                                >
                                    Política de Privacidad
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onOpenLegal('cookies')}
                                    className="hover:text-bakery-gold transition text-left"
                                >
                                    Política de Cookies
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Contacto Simple */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-white mb-2">Contacto</h4>
                        <p className="text-sm opacity-70">Calle de Valdevarnes, 3, 28039 Madrid</p>
                        <p className="text-sm opacity-70">912 34 56 78</p>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-xs opacity-50">
                    <p>© {currentYear} Tahona La Baguette. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
