// Datos que John puede editar sin tocar la lógica del asistente.

export const EMPRESA = {
  nombre: "Vano Systems",
  web: "https://www.vanosystems.com",
  correo: "contacto@vanosystems.com",
  telefono: "+56 9 7331 4909",
  director: "John Andres Prado",
};

// Rangos referenciales en pesos chilenos. POR CONFIRMAR CON JOHN antes de activar el asistente.
export const PRECIOS = [
  { servicio: "Página web de presentación (landing, 1 página)", desde: 250000, hasta: 450000, plazo: "1 a 2 semanas" },
  { servicio: "Sitio web corporativo (3 a 8 páginas, SEO incluido)", desde: 450000, hasta: 900000, plazo: "2 a 4 semanas" },
  { servicio: "Tienda en línea", desde: 800000, hasta: 1800000, plazo: "3 a 6 semanas" },
  { servicio: "Aplicación móvil (Android y iPhone)", desde: 1500000, hasta: 5000000, plazo: "6 a 12 semanas" },
  { servicio: "Software a medida (inventario, cotizador, gestión)", desde: 1200000, hasta: 4000000, plazo: "4 a 10 semanas" },
  { servicio: "Automatización, bots e inteligencia artificial", desde: 400000, hasta: 1500000, plazo: "2 a 5 semanas" },
];

export const LIMITES = {
  mensajesPorDia: 80,     // mensajes que el asistente responde a un mismo número por día
  vistasPorDia: 2,        // vistas previas que puede pedir un mismo número por día
};

export const MODELO = "claude-opus-5-5";
