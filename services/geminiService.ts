
import { GoogleGenAI, Type } from "@google/genai";
import type { CourseData } from '../types';

const PROMPT = `
Actúa como un catedrático de ética médica y literatura, experto en la obra de A.J. Cronin. Tu tarea es crear el contenido para un curso interactivo sobre "La Ciudadela", dirigido a estudiantes de una maestría en pediatría. El curso debe estar completamente en español.

Genera el contenido del curso en formato JSON, siguiendo estrictamente el esquema que te proporciono. El curso debe constar de 6 módulos de aprendizaje. Cada módulo debe ser extenso, profundo y académicamente riguroso, conectando los temas de la novela con los desafíos contemporáneos en la pediatría.

Los 6 módulos deben cubrir los siguientes temas en orden:
1.  **Vocación vs. Comercialización:** Analiza el dilema central de Andrew Manson entre el idealismo y la práctica lucrativa, aplicándolo a la pediatría moderna.
2.  **Medicina Basada en la Evidencia:** Explora la lucha de Manson contra prácticas obsoletas y su dedicación a la investigación, como su trabajo sobre la antracosis, y su relevancia para la pediatría actual.
3.  **Conflictos con el Sistema de Salud:** Examina las frustraciones de Manson con la burocracia y la ineficiencia del sistema, un desafío perenne para los pediatras.
4.  **La Relación Médico-Paciente-Familia:** Profundiza en la importancia de la empatía y la comunicación con las familias, un pilar de la práctica pediátrica, a través de los éxitos y fracasos de Manson.
5.  **La Importancia de la Formación Continua:** Utiliza el arco de Manson, desde su ávido interés inicial por la investigación hasta su posterior complacencia, para enfatizar la obligación ética del estudio y la actualización constante en un campo tan dinámico como la pediatría.
6.  **El Deber Profesional por Encima del Interés Personal:** Analiza los sacrificios de Manson y las tentaciones que enfrenta. Discute la primacía del bienestar del paciente sobre la conveniencia o el deseo de ocio, abordando el concepto de "guardia" y la responsabilidad ineludible del médico hasta completar su servicio.


Para cada uno de los 6 módulos, proporciona:
1.  **title**: Un título claro y conciso para el módulo.
2.  **summary**: Un resumen breve (2-3 frases) del contenido del módulo.
3.  **content**: El contenido principal del módulo. Debe ser un texto extenso y detallado (varios párrafos).
4.  **quiz**: Un test de autoevaluación con exactamente 5 preguntas de opción múltiple. Cada pregunta debe tener:
    a. **question**: El texto de la pregunta, relevante al contenido del módulo.
    b. **options**: Un array de 4 strings con las posibles respuestas.
    c. **correctAnswer**: El índice (0 a 3) de la respuesta correcta en el array 'options'.

Asegúrate de que el lenguaje sea apropiado para un nivel de posgrado, utilizando terminología médica y ética precisa, pero manteniendo la claridad y el enfoque pedagógico. La calidad y profundidad del contenido son primordiales.
`;

const courseSchema = {
    type: Type.OBJECT,
    properties: {
        modules: {
            type: Type.ARRAY,
            description: "Una lista de módulos de aprendizaje.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Título del módulo." },
                    summary: { type: Type.STRING, description: "Resumen breve del módulo." },
                    content: { type: Type.STRING, description: "Contenido extenso y detallado del módulo." },
                    quiz: {
                        type: Type.ARRAY,
                        description: "Test de autoevaluación para el módulo.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING, description: "Texto de la pregunta." },
                                options: {
                                    type: Type.ARRAY,
                                    description: "Array de 4 posibles respuestas.",
                                    items: { type: Type.STRING }
                                },
                                correctAnswer: { type: Type.INTEGER, description: "Índice de la respuesta correcta (0-3)." }
                            },
                            required: ["question", "options", "correctAnswer"]
                        }
                    }
                },
                required: ["title", "summary", "content", "quiz"]
            }
        }
    },
    required: ["modules"]
};

export const generateCourseContent = async (): Promise<CourseData> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY no encontrada. Asegúrate de que la variable de entorno está configurada.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: PROMPT,
      config: {
        responseMimeType: "application/json",
        responseSchema: courseSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const courseData = JSON.parse(jsonText) as CourseData;

    // Basic validation
    if (!courseData.modules || courseData.modules.length === 0) {
      throw new Error("La respuesta de la API no contiene módulos válidos.");
    }

    return courseData;
  } catch (error) {
    console.error("Error al generar el contenido del curso:", error);
    throw new Error("No se pudo generar el contenido del curso. Por favor, inténtalo de nuevo más tarde.");
  }
};
