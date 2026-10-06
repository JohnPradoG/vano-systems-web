# Sitio web de Vano Systems

Sitio estático (un solo `index.html`, sin compilación). Listo para Vercel o Cloudflare Pages.

## Archivos
- `index.html`: la página, con SEO (título, descripción, Open Graph, datos estructurados de empresa).
- `favicon.svg`: ícono de la pestaña.
- `og-image.png`: imagen que aparece al compartir el enlace en WhatsApp, LinkedIn, etc.
- `robots.txt` y `sitemap.xml`: para que Google indexe el sitio.

## Publicar en Vercel
1. Subir esta carpeta a un repositorio de GitHub (por ejemplo `vano-systems-web`).
2. En vercel.com: Add New → Project → elegir el repositorio → Deploy (sin configurar nada).
3. Dominio: Settings → Domains → agregar `vanosystems.com` y seguir las instrucciones de DNS.

## Publicar en Cloudflare Pages (sin GitHub)
Workers & Pages → Create → Pages → Upload assets → arrastrar esta carpeta.

## Después de publicar con el dominio
- Google Search Console: agregar `vanosystems.com` y enviar `https://vanosystems.com/sitemap.xml`.
- Perfil de Empresa en Google: negocio de área de servicio (sin dirección visible), zona: Chile.
- Si el dominio final no es `vanosystems.com`, cambiarlo en `index.html`, `robots.txt` y `sitemap.xml`.
