
export interface Product {
  id: string;
  titulo: string;
  imagen: string;
  etiqueta?: string;
  descripcion: string;
  precio: string;
  boton?: string;
  categoria?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AppConfig {
  sheetUrl: string;
  whatsappNumber: string;
}