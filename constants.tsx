
import { Product } from './types';

export const APP_CONFIG = {
  sheetUrl: '', 
  whatsappNumber: '34913860724',
  storeName: 'Tahona La Baguette',
  address: 'C. de Valdevarnes, 3, Moncloa - Aravaca, 28039 Madrid',
  phone: '913 86 07 24'
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    titulo: 'Roscón de Reyes',
    imagen: 'https://i.ibb.co/m5DkZqnJ/Captura-de-pantalla-2026-01-04-a-las-23-55-31.png',
    etiqueta: 'Más Vendido',
    descripcion: 'Nuestro tradicional roscón artesano con agua de azahar, fermentación lenta y frutas confitadas.',
    precio: '15,00€',
    boton: 'Encargar',
    categoria: 'Postres'
  },
  {
    id: '2',
    titulo: 'Croissant Artesano',
    imagen: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    etiqueta: 'Crujiente',
    descripcion: 'Capas infinitas de mantequilla pura y un aroma irresistible.',
    precio: '1,80€',
    boton: 'WhatsApp',
    categoria: 'Panadería'
  },
  {
    id: '3',
    titulo: 'Pasteles variados',
    imagen: 'https://i.ibb.co/gbKYHpfC/Captura-de-pantalla-2026-01-04-a-las-23-56-00.png',
    etiqueta: 'Para Compartir',
    descripcion: 'Surtido selección de nuestros mejores bocados dulces, ideal para celebraciones.',
    precio: '18,00€/Kg',
    boton: 'Reservar',
    categoria: 'Postres'
  }
];