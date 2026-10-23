// Transcribe a texto los audios de WhatsApp. Claude no recibe audio, así que se usa un servicio de voz a texto
// con la API estándar de transcripciones (OpenAI por defecto; Groq u otro compatible cambiando la URL y el modelo).
const URL_TRANSCRIPCION = process.env.TRANSCRIPCION_URL || "https://api.openai.com/v1/audio/transcriptions";
const MODELO_TRANSCRIPCION = process.env.TRANSCRIPCION_MODELO || "gpt-4o-mini-transcribe";
const CLAVE = () => process.env.TRANSCRIPCION_API_KEY || process.env.OPENAI_API_KEY;

export const transcripcionActiva = () => Boolean(CLAVE());

export async function transcribir({ datos, tipo }) {
  const ext = tipo.includes("ogg") ? "ogg" : tipo.includes("mpeg") ? "mp3" : tipo.includes("mp4") || tipo.includes("aac") ? "m4a" : tipo.includes("amr") ? "amr" : "ogg";
  const form = new FormData();
  form.append("file", new Blob([datos], { type: tipo.split(";")[0] || "audio/ogg" }), `audio.${ext}`);
  form.append("model", MODELO_TRANSCRIPCION);
  form.append("language", "es");
  const res = await fetch(URL_TRANSCRIPCION, { method: "POST", headers: { Authorization: `Bearer ${CLAVE()}` }, body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Transcripción ${res.status}: ${JSON.stringify(data.error || data)}`);
  return (data.text || "").trim();
}
