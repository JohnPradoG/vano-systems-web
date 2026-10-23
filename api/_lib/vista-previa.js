// Genera el borrador visual (una página HTML) del proyecto que describe el cliente.
import Anthropic from "@anthropic-ai/sdk";
import { EMPRESA, MODELO } from "./config.js";

const client = new Anthropic();

const SISTEMA = `Eres el diseñador web senior de ${EMPRESA.nombre}, una empresa chilena de desarrollo de software.
Recibes la idea de un cliente potencial y entregas un borrador visual de alta calidad que le muestre cómo podría verse su proyecto. Es la primera impresión que el cliente tendrá de nuestro trabajo: tiene que verse profesional, moderna y hecha para su negocio.

Responde SOLO con un documento HTML completo, desde <!doctype html> hasta </html>, sin texto antes ni después y sin bloques de código.

Reglas técnicas (la página se sirve con una política de seguridad estricta):
- Todo el CSS va en una etiqueta <style>. Sin JavaScript: no uses <script>, atributos on* ni formularios que envíen datos.
- Sin imágenes externas. Para fotos usa composiciones con degradados, formas CSS, SVG en línea o emojis grandes bien integrados.
- Fuentes: puedes cargar Google Fonts con <link> (fonts.googleapis.com). Elige una pareja tipográfica acorde al rubro.
- Diseño adaptable: debe verse impecable en celular (la mayoría lo abrirá desde WhatsApp) y en computador.
- Textos en español de Chile, con contenido realista para ese negocio (nada de lorem ipsum). Precios, direcciones y teléfonos del negocio son de ejemplo: no inventes datos que parezcan reales del cliente.
- Si es una app móvil o un sistema, muestra 2 o 3 pantallas dentro de marcos de teléfono o de ventana, con una breve descripción de cada una.
- Usa los colores que pidió el cliente; si no pidió, elige una paleta adecuada a su rubro.
- Incluye arriba una franja discreta: "Vista previa creada por ${EMPRESA.nombre} · Borrador de diseño" con un enlace a ${EMPRESA.web}.`;

export async function generarVistaPrevia(pedido) {
  const mensaje = await client.beta.messages
    .stream({
      model: MODELO,
      max_tokens: 32000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium" },
      system: SISTEMA,
      messages: [{
        role: "user",
        content: `Proyecto a diseñar:
- Negocio: ${pedido.nombre_negocio}
- Rubro: ${pedido.rubro}
- Tipo de proyecto: ${pedido.tipo}
- Colores o estilo: ${pedido.colores || "a tu criterio"}
- Lo que el cliente quiere: ${pedido.descripcion}`,
      }],
    })
    .finalMessage();

  if (mensaje.stop_reason === "refusal") throw new Error("El modelo no generó la vista previa (refusal)");
  const texto = mensaje.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const inicio = texto.search(/<!doctype html/i);
  const fin = texto.toLowerCase().lastIndexOf("</html>");
  if (inicio < 0 || fin < 0) throw new Error("La respuesta no trae un HTML completo");
  return texto.slice(inicio, fin + "</html>".length);
}
