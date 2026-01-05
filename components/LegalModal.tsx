import React, { useEffect } from 'react';
import { LEGAL_CONTENT, LegalPageType } from '../data/legalContent';

interface Props {
    isOpen: boolean;
    type: LegalPageType | null;
    onClose: () => void;
}

const LegalModal: React.FC<Props> = ({ isOpen, type, onClose }) => {
    useEffect(() => {
        // Add noindex meta tag dynamically when modal is open
        if (isOpen) {
            const meta = document.createElement('meta');
            meta.name = "robots";
            meta.content = "noindex";
            document.head.appendChild(meta);

            // Lock scrolling
            document.body.style.overflow = 'hidden';

            return () => {
                document.head.removeChild(meta);
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

    if (!isOpen || !type) return null;

    const { title, content } = LEGAL_CONTENT[type];

    return (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl animate-scaleUp">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                    <h2 className="text-2xl font-serif font-bold text-bakery-brown">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-bakery-brown transition p-1 hover:bg-gray-100 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-8 text-gray-600 leading-relaxed text-sm space-y-4">
                    <div dangerouslySetInnerHTML={{ __html: content }} className="prose prose-brown max-w-none" />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 text-center shrink-0 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="bg-bakery-brown text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-bakery-gold transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalModal;
