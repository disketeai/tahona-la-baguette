import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const SYSTEM_INSTRUCTION = `
Eres el asistente virtual de "Tahona La Baguette", una panadería artesanal de alta calidad ubicada en Moncloa-Aravaca, Madrid.
Tu tono debe ser amable, profesional y apasionado por el pan artesano.

Información clave:
- Ubicación: C. de Valdevarnes, 3, Moncloa - Aravaca, 28039 Madrid.
- Teléfono: 913 86 07 24.
- Horario: 
  * Lunes a Viernes: 08:30 – 17:30.
  * Sábados y Domingos: 08:15 – 15:00.
- Especialidades: Pan de masa madre, croissants de mantequilla, tartas caseras y repostería tradicional.
- Pedidos: Se pueden hacer por WhatsApp directamente desde el catálogo de la web.

Responde de forma concisa y en español.
`;

export const getChatResponse = async (history: { role: string; content: string }[]) => {
  try {
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      })),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Lo siento, no he podido procesar tu solicitud.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ups, algo ha salido mal con mi horno digital. Por favor, verifica tu conexión o la clave API.";
  }
};

/**
 * Analiza una imagen de un producto de panadería y devuelve un objeto JSON con sugerencias
 */
export const analyzeProductImage = async (base64Image: string) => {
  try {
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1],
            },
          },
          {
            text: "Analiza esta foto de un producto de panadería. Genera un título atractivo, una descripción artesanal (máx 100 caracteres), un precio estimado y una etiqueta comercial.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titulo: { type: Type.STRING },
            descripcion: { type: Type.STRING },
            precio: { type: Type.STRING },
            etiqueta: { type: Type.STRING },
          },
          required: ["titulo", "descripcion", "precio", "etiqueta"],
        },
      },
    });

    // Con responseMimeType y responseSchema, el texto siempre es JSON válido.
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error analizando imagen:", error);
    return null;
  }
};