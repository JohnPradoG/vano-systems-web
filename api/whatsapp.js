// Webhook de WhatsApp (Meta Cloud API). Meta llama a /api/whatsapp con cada mensaje recibido.
import { waitUntil } from "@vercel/functions";
import { firmaValida, marcarLeido, enviarTexto } from "./_lib/whatsapp.js";
import { primeraVez, contar } from "./_lib/store.js";
import { responder } from "./_lib/asistente.js";
import { LIMITES } from "./_lib/config.js";

// Verificación inicial del webhook desde el panel de Meta.
export function GET(request) {
  const p = new URL(request.url).searchParams;
  if (p.get("hub.mode") === "subscribe" && p.get("hub.verify_token") === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(p.get("hub.challenge"), { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(request) {
  const crudo = await request.text();
  if (!(await firmaValida(crudo, request.headers.get("x-hub-signature-256")))) {
    return new Response("Firma inválida", { status: 401 });
  }
  const evento = JSON.parse(crudo);
  for (const entrada of evento.entry || []) {
    for (const cambio of entrada.changes || []) {
      const v = cambio.value || {};
      for (const m of v.messages || []) {
        const nombre = v.contacts?.find((c) => c.wa_id === m.from)?.profile?.name || "";
        // Meta espera un 200 rápido; la respuesta del asistente se procesa después.
        waitUntil(atender(m, nombre));
      }
    }
  }
  return new Response("OK", { status: 200 });
}

async function atender(m, nombre) {
  try {
    if (!(await primeraVez(m.id))) return;
    await marcarLeido(m.id);
    if ((await contar("mensaje", m.from)) > LIMITES.mensajesPorDia) return;

    let texto;
    if (m.type === "text") texto = m.text.body;
    else if (m.type === "interactive") texto = m.interactive?.button_reply?.title || m.interactive?.list_reply?.title;
    else if (m.type === "button") texto = m.button?.text;
    else texto = `[El cliente envió un mensaje de tipo ${m.type}, que el asistente no puede leer]`;

    const respuesta = await responder({ telefono: m.from, nombre, texto });
    if (respuesta) await enviarTexto(m.from, respuesta);
  } catch (e) {
    console.error("Error atendiendo mensaje", m.id, e);
    await enviarTexto(m.from, "Tuve un problema para responderte. Inténtalo de nuevo en un momento o escríbenos a contacto@vanosystems.com.").catch(() => {});
  }
}
