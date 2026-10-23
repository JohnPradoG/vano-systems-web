// API del panel de John (/panel/): ver prospectos y enviar avances de proyecto por WhatsApp.
import { listarProspectos, guardarProspecto } from "./_lib/store.js";
import { enviarTexto, enviarPlantilla } from "./_lib/whatsapp.js";

function autorizado(request) {
  const token = process.env.PANEL_TOKEN;
  return Boolean(token) && request.headers.get("authorization") === `Bearer ${token}`;
}

const json = (datos, status = 200) =>
  new Response(JSON.stringify(datos), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export async function GET(request) {
  if (!autorizado(request)) return json({ error: "Clave incorrecta" }, 401);
  return json({ prospectos: await listarProspectos() });
}

// Cuerpo: { telefono: "569...", nombre, mensaje, link }
export async function POST(request) {
  if (!autorizado(request)) return json({ error: "Clave incorrecta" }, 401);
  const { telefono, nombre = "", mensaje, link = "" } = await request.json();
  const numero = String(telefono || "").replace(/\D/g, "");
  if (!numero || !mensaje) return json({ error: "Falta el teléfono o el mensaje" }, 400);

  const texto = `Hola${nombre ? " " + nombre : ""} 👋 Novedades de tu proyecto con Vano Systems:\n\n${mensaje}${link ? `\n\n👉 Míralo aquí: ${link}` : ""}`;
  try {
    // Dentro de las 24 horas desde el último mensaje del cliente se puede escribir libremente.
    await enviarTexto(numero, texto);
    await guardarProspecto(numero, { ultimoAvance: mensaje });
    return json({ ok: true, via: "texto" });
  } catch (e) {
    // Fuera de esa ventana WhatsApp exige una plantilla aprobada por Meta.
    if (!process.env.PLANTILLA_AVANCE) return json({ error: `No se pudo enviar: ${e.message}` }, 502);
    try {
      await enviarPlantilla(numero, process.env.PLANTILLA_AVANCE, [nombre || "cliente", mensaje, link || "https://www.vanosystems.com"]);
      await guardarProspecto(numero, { ultimoAvance: mensaje });
      return json({ ok: true, via: "plantilla" });
    } catch (e2) {
      return json({ error: `No se pudo enviar: ${e2.message}` }, 502);
    }
  }
}
