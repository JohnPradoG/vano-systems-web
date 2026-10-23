# Asistente de WhatsApp con IA

El asistente atiende el WhatsApp de Vano Systems las 24 horas:

- Conversa con quien escribe y entiende qué necesita.
- Crea en un par de minutos una **vista previa** de la página o app del cliente y le manda el link (`vanosystems.com/vista/...`).
- Da un **rango de precio y plazo** usando la tabla de `api/_lib/config.js`.
- Registra cada **prospecto**, avisa a John por WhatsApp y lo guarda en el panel `vanosystems.com/panel/`.
- Desde el panel John envía **avances de proyecto** a sus clientes por WhatsApp.

## Piezas

| Archivo | Qué hace |
| --- | --- |
| `api/whatsapp.js` | Webhook que recibe los mensajes de WhatsApp (Meta Cloud API) |
| `api/_lib/asistente.js` | Conversación con Claude, herramientas de vista previa y prospectos |
| `api/_lib/vista-previa.js` | Genera el HTML de la vista previa |
| `api/vista.js` | Muestra la vista previa en `/vista/<id>` (sin scripts, no indexada) |
| `api/panel.js` + `panel/index.html` | Panel de John: prospectos y envío de avances |
| `api/_lib/config.js` | Precios, límites diarios y datos de la empresa |

## Puesta en marcha

### 1. Base de datos (Vercel)
En Vercel → proyecto `vano-systems-web` → **Storage** → **Upstash for Redis** (plan gratis) → conectar al proyecto. Crea solas las variables `KV_REST_API_URL` y `KV_REST_API_TOKEN`.

### 2. Clave de Claude
En [console.anthropic.com](https://console.anthropic.com) crear una API key y cargar saldo. Guardarla en Vercel como `ANTHROPIC_API_KEY`.

### 3. WhatsApp en Meta
1. En [developers.facebook.com](https://developers.facebook.com) crear una app de tipo **Empresa** y agregarle el producto **WhatsApp**.
2. Registrar el número de Vano Systems. Si ese número ya está en la app WhatsApp Business, Meta ofrece la opción de **coexistencia** para seguir usando la app y la API con el mismo número; si no, usar un número nuevo.
3. Crear un **token permanente** con un usuario del sistema (Business Settings → Usuarios del sistema) con permisos `whatsapp_business_messaging` y `whatsapp_business_management`.
4. Webhook: URL `https://www.vanosystems.com/api/whatsapp`, token de verificación = el valor de `WHATSAPP_VERIFY_TOKEN`, suscribirse al campo **messages**.

### 4. Variables en Vercel (Settings → Environment Variables)

| Variable | Valor |
| --- | --- |
| `ANTHROPIC_API_KEY` | Clave de Claude |
| `WHATSAPP_TOKEN` | Token permanente de Meta |
| `WHATSAPP_PHONE_NUMBER_ID` | ID del número (WhatsApp → Configuración de la API) |
| `WHATSAPP_APP_SECRET` | App Secret (Configuración de la app → Básica) |
| `WHATSAPP_VERIFY_TOKEN` | Una palabra secreta inventada, la misma que se pone en el webhook |
| `TELEFONO_JOHN` | Número personal de John para los avisos, ej. `56912345678` |
| `PANEL_TOKEN` | Clave para entrar al panel |
| `PLANTILLA_AVANCE` | (Opcional) nombre de la plantilla de avances aprobada en Meta |

Después de cargar las variables, volver a desplegar el proyecto.

### 5. Plantilla de avances (opcional)
WhatsApp solo deja escribir libremente dentro de las 24 horas desde el último mensaje del cliente. Para avisar avances después de ese plazo, crear en Meta una plantilla de categoría **Utilidad**, por ejemplo `avance_proyecto`, con este cuerpo:

> Hola {{1}}, tenemos novedades de tu proyecto con Vano Systems: {{2}}. Puedes verlo aquí: {{3}}

Cuando Meta la apruebe, poner su nombre en `PLANTILLA_AVANCE`.

## Costos y límites
- Claude cobra por uso (modelo `claude-opus-5-5`). La vista previa es lo más caro de cada conversación; por eso cada número puede pedir 2 al día (`LIMITES` en `config.js`).
- Meta no cobra las respuestas a mensajes que inician los clientes. Las plantillas sí tienen costo.
- Los avisos a John por WhatsApp llegan solo si John escribió al número del asistente en las últimas 24 horas. El panel siempre guarda los prospectos.
