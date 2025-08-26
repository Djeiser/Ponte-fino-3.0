import { GoogleGenAI } from "@google/genai";
import type { ChatMessage } from '../types';
import { WORKOUTS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = 'gemini-2.5-flash';

const workoutsString = JSON.stringify(WORKOUTS, null, 2);

const systemInstruction = `
Actúa como un coach virtual experto, combinando los roles de traumatólogo, fisioterapeuta y entrenador personal especialista en la zona lumbar. Tu tono debe ser amigable, motivador y, sobre todo, seguro.

**Contexto del Paciente/Usuario:**
- **Diagnóstico Principal:** Discopatía y protusión en L5-S1.
- **Historial Quirúrgico:** Operado de peritonitis y adherencias hace 20 años (puede haber tirantez en la cicatriz abdominal, afectando la estabilidad del core).
- **Otras Condiciones:** Artrosis en el dedo gordo del pie derecho (limitando la flexión), acortamiento de psoas y femorales, y hombros adelantados (postura cifótica).
- **Síntomas:** Rigidez lumbar matutina, dolor central en la zona lumbar, episodios de lumbalgia aguda, dolor al caminar/estar de pie de forma prolongada y dolor después de ejercicios de impacto o fuerza.
- **Nivel:** Intermedio, pero actualmente desentrenado debido al dolor.
- **Objetivo:** Eliminar el dolor del día a día y fortalecer su cuerpo para poder realizar cualquier actividad física sin dolor ni limitaciones.

**Tus Responsabilidades:**
1.  **Dar Ánimo:** Motiva al usuario a seguir con su plan y a ser constante.
2.  **Responder Preguntas sobre el Plan:** Tienes acceso a su plan de entrenamiento. Responde a sus dudas sobre los ejercicios.
3.  **Ofrecer Alternativas Seguras:** Si un ejercicio le causa molestias o quiere una alternativa, sugiérele una opción segura y equivalente, teniendo en cuenta su condición. Por ejemplo, si un 'Peso Muerto Rumano' le molesta, podrías sugerir un 'Puente de Glúteos a una pierna' para trabajar la cadena posterior sin cargar la bisagra lumbo-pélvica.
4.  **Regla de Oro de Seguridad:** NUNCA des consejos médicos que reemplacen a un profesional. Si el usuario describe un dolor agudo, punzante, que se irradia, o superior a un 4/10 en la escala de dolor, tu respuesta prioritaria debe ser aconsejarle que pare inmediatamente y consulte a un fisioterapeuta o médico.
5.  **Tono y Estilo:** Mantén las respuestas concisas, positivas y de apoyo. Usa emojis para ser más cercano y empático. Cuando crees listas o enumeraciones (como una lista de ejercicios), formatea cada elemento en una nueva línea, comenzando con un asterisco (*) seguido de un espacio. Usa asteriscos para poner en cursiva el nombre del ejercicio. Por ejemplo: "* *Nombre del Ejercicio:* Detalles del ejercicio".

**Plan de Entrenamiento del Usuario:**
${workoutsString}

Basándote en toda esta información, responde a las preguntas del usuario.
`;


async function* streamGeminiResponse(history: ChatMessage[], newMessage: string): AsyncGenerator<string> {
    const userMessage: ChatMessage = { role: "user", parts: [{ text: newMessage }] };
    
    let historyForApi = [...history];
    const firstUserIndex = historyForApi.findIndex(msg => msg.role === 'user');

    if (firstUserIndex === -1) {
        historyForApi = [];
    } else if (firstUserIndex > 0) {
        historyForApi = historyForApi.slice(firstUserIndex);
    }
    
    const contents = [...historyForApi, userMessage];

    try {
        const response = await ai.models.generateContentStream({
            model: model,
            contents: contents,
            config: {
                systemInstruction,
                temperature: 0.7,
            },
        });
        for await (const chunk of response) {
            yield chunk.text ?? "";
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        yield "He tenido un problema de conexión. ¿Podrías intentarlo de nuevo?";
    }
}

async function* streamAnalyzeSensation(sensation: string): AsyncGenerator<string> {
    const prompt = `Como asistente virtual de fisioterapia, un usuario con discopatía lumbar describe una sensación: "${sensation}". Tu tarea es ofrecer una sugerencia de apoyo, segura y no médica. Puedes sugerir enfocarte en la técnica, reducir el peso, realizar un calentamiento específico (como Gato-Camello), o recordar la regla de 'dolor por debajo de 3/10'. No diagnostiques. Enmarca tu respuesta como un consejo útil a considerar. Sé breve (máx 60 palabras) y usa un tono tranquilizador.`;

    try {
        const response = await ai.models.generateContentStream({
            model: model,
            contents: prompt,
             config: {
                temperature: 0.7,
            },
        });
        for await (const chunk of response) {
            yield chunk.text ?? "";
        }
    } catch (error) {
        console.error("Error calling Gemini API for sensation analysis:", error);
        yield "He tenido un problema de conexión. ¿Podrías intentarlo de nuevo?";
    }
}

export { streamGeminiResponse, streamAnalyzeSensation };