// Almacenamiento en Upstash Redis por su API REST (Vercel Marketplace → "Upstash for Redis").
// Acepta los nombres de variables que crea Vercel (KV_*) o los de Upstash (UPSTASH_*).
const URL_REDIS = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_REDIS = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(...comando) {
  const res = await fetch(URL_REDIS, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN_REDIS}`, "Content-Type": "application/json" },
    body: JSON.stringify(comando),
  });
  const data = await res.json();
  if (data.error) throw new Error(`Redis: ${data.error}`);
  return data.result;
}

const DIA = 86400;

// Evita procesar dos veces el mismo mensaje (Meta reintenta los webhooks).
export async function primeraVez(idMensaje) {
  return (await redis("SET", `visto:${idMensaje}`, "1", "NX", "EX", 2 * DIA)) === "OK";
}

// Cuenta usos por teléfono y día; devuelve el total después de sumar.
export async function contar(tipo, telefono) {
  const hoy = new Date().toISOString().slice(0, 10);
  const clave = `cuenta:${tipo}:${telefono}:${hoy}`;
  const n = await redis("INCR", clave);
  if (n === 1) await redis("EXPIRE", clave, DIA);
  return n;
}

// Historial de la conversación: solo texto de usuario y asistente, últimos 30 turnos, 7 días.
export async function leerHistorial(telefono) {
  const items = (await redis("LRANGE", `chat:${telefono}`, 0, -1)) || [];
  return items.map((s) => JSON.parse(s));
}

export async function agregarHistorial(telefono, ...turnos) {
  const clave = `chat:${telefono}`;
  for (const t of turnos) await redis("RPUSH", clave, JSON.stringify(t));
  await redis("LTRIM", clave, -30, -1);
  await redis("EXPIRE", clave, 7 * DIA);
}

export async function guardarVista(id, datos) {
  await redis("SET", `vista:${id}`, JSON.stringify(datos), "EX", 60 * DIA);
}

export async function leerVista(id) {
  const s = await redis("GET", `vista:${id}`);
  return s ? JSON.parse(s) : null;
}

// Prospectos (clientes que pidieron cotización o llamada), para el panel.
export async function guardarProspecto(telefono, datos) {
  const previo = JSON.parse((await redis("HGET", "prospectos", telefono)) || "{}");
  const nuevo = { ...previo, ...datos, telefono, actualizado: new Date().toISOString() };
  await redis("HSET", "prospectos", telefono, JSON.stringify(nuevo));
  return nuevo;
}

export async function listarProspectos() {
  const plano = (await redis("HGETALL", "prospectos")) || [];
  const lista = [];
  for (let i = 0; i < plano.length; i += 2) lista.push(JSON.parse(plano[i + 1]));
  return lista.sort((a, b) => (b.actualizado || "").localeCompare(a.actualizado || ""));
}
