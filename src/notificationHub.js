/**
 * Very small in-memory pub/sub store that lets the backend
 * push Server-Sent Events (SSE) to any number of open tabs
 * for the same logged-in user.
 */

const clients = new Map(); // userId → Set<res> (SSE responses)

/** add a new SSE client */
function addClient(userId, res) {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(res);

  /* remove on disconnect */
  res.on("close", () => {
    const set = clients.get(userId);
    if (!set) return;
    set.delete(res);
    if (set.size === 0) clients.delete(userId);
  });
}

/** push a JSON payload to every open tab for a single user */
function publish(userId, payload) {
  if (!clients.has(userId)) return;
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  for (const res of clients.get(userId)) res.write(data);
}

/** broadcast to everyone (not used here but handy) */
function broadcast(payload) {
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  for (const set of clients.values()) for (const res of set) res.write(data);
}

module.exports = { addClient, publish, broadcast };
