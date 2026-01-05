
import Papa from 'papaparse';
import { Product } from '../types';

export const fetchProductsFromSheet = async (url: string): Promise<Product[]> => {
  if (!url) return [];

  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const products: Product[] = results.data.map((item: any, index: number) => ({
          id: index.toString(),
          titulo: item.Titulo || item.titulo,
          imagen: item.Imagen || item.imagen,
          etiqueta: item.Etiqueta || item.etiqueta,
          descripcion: item.Descripcion || item.descripcion,
          precio: item.Precio || item.precio,
          boton: item.Boton || item.boton || 'Pedir',
          categoria: item.Categoria || item.categoria || 'Panadería',
        }));
        resolve(products);
      },
      error: (err) => {
        reject(err);
      }
    });
  });
};