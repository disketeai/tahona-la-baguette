
export interface Product {
  id: string;
  titulo: string;
  descripcion: string;
  precio: string;
  etiqueta?: string | null;
  imagen: string;
  categoria: string;
  boton?: string;
  // New fields
  orden?: number;
  imagenes?: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AppConfig {
  sheetUrl: string;
  whatsappNumber: string;
}