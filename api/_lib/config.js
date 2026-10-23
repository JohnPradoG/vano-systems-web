// Datos que John puede editar sin tocar la lógica del asistente.

export const EMPRESA = {
  nombre: "Vano Systems",
  web: "https://www.vanosystems.com",
  correo: "contacto@vanosystems.com",
  telefono: "+56 9 7331 4909",
  director: "John Andres Prado",
};

// Precios referenciales "desde", en pesos chilenos. El asistente los da SOLO después de reunir la información
// del cliente, eligiendo la categoría que corresponde, y aclara que el precio final se ajusta en la propuesta.
// Una categoría con desde: null no se cotiza: el asistente dice que John enviará el precio en la propuesta.
export const PRECIOS = [
  { categoria: "Página web de presentación (1 página: servicios, contacto y WhatsApp)", desde: null },
  { categoria: "Sitio web corporativo (varias páginas, SEO básico)", desde: null },
  { categoria: "Sitio web con funciones (reservas, blog, panel para editar contenido)", desde: null },
  { categoria: "Tienda en línea (catálogo, carrito y pagos)", desde: null },
  { categoria: "App sencilla (pocas pantallas, sin usuarios ni pagos)", desde: null },
  { categoria: "App intermedia (usuarios, panel de administración, notificaciones)", desde: null },
  { categoria: "App compleja (pagos, mapas, chat, integraciones, Android y iPhone)", desde: null },
  { categoria: "App o sistema de cotización (cálculo, PDF de cotización, clientes)", desde: null },
  { categoria: "Software a medida (inventario, ventas, reportes)", desde: null },
  { categoria: "Automatización, bots e IA", desde: null },
];

// Preguntas por tipo de proyecto. El asistente las hace de a una o dos y omite lo que el cliente ya contó.
export const PREGUNTAS_COTIZACION = {
  "Todos los proyectos": [
    "Nombre de la persona y de su empresa o negocio",
    "Rubro y a qué se dedica el negocio",
    "Qué quiere lograr o qué problema quiere resolver",
    "Para cuándo lo necesita",
    "Si tiene un presupuesto aproximado en mente (opcional, no insistir)",
    "Correo para enviarle la propuesta formal",
  ],
  "Página web": [
    "Si ya tiene página web o dominio (ej. minegocio.cl)",
    "Qué secciones o páginas necesita (inicio, servicios, nosotros, contacto, blog…)",
    "Funciones especiales: formulario, botón de WhatsApp, reservas o agenda, pagos en línea, varios idiomas",
    "Si tiene listos el logo, los textos y las fotos, o necesita ayuda con eso",
    "Páginas web que le gusten como referencia",
  ],
  "Tienda en línea": [
    "Cuántos productos venderá aproximadamente",
    "Medios de pago que quiere (Webpay, Mercado Pago, transferencia)",
    "Cómo hará los despachos o retiros",
    "Si necesita control de inventario o conexión con otro sistema",
  ],
  "Aplicación móvil": [
    "Qué hará la app y quién la usará (clientes, trabajadores, ambos)",
    "Si la necesita para Android, iPhone o ambos",
    "Si los usuarios se registrarán con cuenta",
    "Funciones: pagos, notificaciones, mapas, chat, reservas, fotos",
    "Si necesita un panel de administración o versión web",
    "Apps parecidas que le sirvan de referencia",
  ],
  "Software a medida": [
    "Cómo hace hoy ese trabajo (Excel, papel, otro sistema)",
    "Cuántas personas lo usarán y con qué roles o permisos",
    "Qué módulos necesita: inventario, ventas, cotizaciones, clientes, reportes, facturación",
    "Si debe conectarse con otros sistemas (facturación electrónica, contabilidad, tienda)",
    "Si lo usarán desde el celular, el computador o ambos",
  ],
  "Automatización, bots e IA": [
    "Qué tarea quiere automatizar y cuánto tiempo le toma hoy",
    "Qué herramientas usa hoy (WhatsApp, correo, Excel, un sistema)",
    "Cuántas veces al día o al mes ocurre esa tarea",
  ],
  "Integraciones y nube": [
    "Qué sistemas o servicios quiere conectar",
    "Si ya tiene servidores, hosting o cuentas en la nube",
  ],
};

// Preguntas frecuentes de la web: el asistente responde con esta misma información.
export const PREGUNTAS_FRECUENTES = [
  ["¿Trabajan con empresas de todo Chile?", "Sí. Somos un estudio 100% remoto: nos reunimos por videollamada o WhatsApp y trabajamos con empresas de cualquier ciudad de Chile."],
  ["¿Cómo cotizo un proyecto?", "Contándonos qué necesitas. Conversamos sobre tu negocio y te enviamos una propuesta con alcance, precio y plazo antes de empezar."],
  ["¿Cuánto cuesta una página web o una app?", "Depende de lo que necesites: no cuesta lo mismo una página informativa que una app con usuarios y pagos. Por eso cotizamos cada proyecto y damos un precio claro antes de comenzar."],
  ["¿Qué pasa después de la entrega?", "Seguimos contigo con soporte, ajustes y nuevas funciones, y medimos cómo funciona para seguir mejorándolo."],
  ["¿Cómo es el proceso?", "1) Descubrimos: entendemos tu negocio y lo que necesitas. 2) Diseñamos la experiencia antes de programar. 3) Construimos por etapas, con avances reales cada semana. 4) Acompañamos: lanzamos, medimos y seguimos mejorando."],
];

export const LIMITES = {
  mensajesPorDia: 80,     // mensajes que el asistente responde a un mismo número por día
  vistasPorDia: 2,        // vistas previas que puede pedir un mismo número por día
  audioMaxMB: 16,         // audios más pesados no se transcriben
};

export const MODELO = "claude-opus-5-5";
