// Muestra la vista previa guardada: /vista/<id> (reescrito a /api/vista?id=<id> en vercel.json).
import { leerVista } from "./_lib/store.js";

// El HTML lo escribe el modelo: sin scripts, formularios ni recursos externos salvo Google Fonts.
const CSP = [
  "default-src 'none'",
  "style-src 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src data:",
  "form-action 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
].join("; ");

export async function GET(request) {
  const id = new URL(request.url).searchParams.get("id") || "";
  const vista = /^[a-f0-9]{12}$/.test(id) ? await leerVista(id) : null;
  if (!vista) {
    return new Response("<!doctype html><meta charset=utf-8><title>Vista no encontrada</title><p style='font-family:sans-serif;padding:24px'>Esta vista previa no existe o expiró. Escríbenos por WhatsApp para crear una nueva.</p>",
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" } });
  }
  return new Response(vista.html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": CSP,
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "private, max-age=300",
    },
  });
}
