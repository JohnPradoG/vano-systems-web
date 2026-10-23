// Envío de mensajes con la API oficial de WhatsApp (Meta Cloud API).
const VERSION = "v21.0";
const BASE = process.env.WHATSAPP_API_BASE || "https://graph.facebook.com"; // reemplazable en pruebas

async function llamar(cuerpo) {
  const res = await fetch(`${BASE}/${VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", ...cuerpo }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`WhatsApp ${res.status}: ${JSON.stringify(data.error || data)}`);
  return data;
}

// WhatsApp corta los textos sobre 4096 caracteres: se envían en partes.
export async function enviarTexto(para, texto) {
  const partes = [];
  let resto = texto.trim();
  while (resto.length > 4000) {
    const corte = resto.lastIndexOf("\n", 4000) > 2000 ? resto.lastIndexOf("\n", 4000) : 4000;
    partes.push(resto.slice(0, corte));
    resto = resto.slice(corte).trim();
  }
  if (resto) partes.push(resto);
  for (const body of partes) await llamar({ to: para, type: "text", text: { body, preview_url: true } });
}

// Marca el mensaje como leído y muestra "escribiendo…" mientras el asistente responde.
export async function marcarLeido(idMensaje) {
  await llamar({ status: "read", message_id: idMensaje, typing_indicator: { type: "text" } }).catch(() => {});
}

// Plantilla aprobada por Meta: necesaria para escribir a alguien fuera de la ventana de 24 horas.
export async function enviarPlantilla(para, nombre, parametros, idioma = "es") {
  return llamar({
    to: para,
    type: "template",
    template: {
      name: nombre,
      language: { code: idioma },
      components: [{ type: "body", parameters: parametros.map((text) => ({ type: "text", text })) }],
    },
  });
}

// Comprueba la firma X-Hub-Signature-256 con el App Secret de Meta.
export async function firmaValida(cuerpoCrudo, firma) {
  if (!process.env.WHATSAPP_APP_SECRET || !firma?.startsWith("sha256=")) return false;
  const clave = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(process.env.WHATSAPP_APP_SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", clave, new TextEncoder().encode(cuerpoCrudo)));
  const esperado = "sha256=" + Array.from(mac, (b) => b.toString(16).padStart(2, "0")).join("");
  if (esperado.length !== firma.length) return false;
  let diff = 0;
  for (let i = 0; i < esperado.length; i++) diff |= esperado.charCodeAt(i) ^ firma.charCodeAt(i);
  return diff === 0;
}
