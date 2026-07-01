const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
try { require('dotenv').config(); } catch {}
const { connectConsumer, setNotifyCallback } = require('./kafkaConsumer');

const app = express();
const server = http.createServer(app);

// ── WebSocket Server ──────────────────────────────────────
const wss = new WebSocketServer({ server, path: '/ws' });

// Active clients map: email → websocket connection
const clients = new Map();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://localhost`);
  const email = url.searchParams.get('email');

  if (!email) {
    ws.close();
    return;
  }

  clients.set(email, ws);
  console.log(`✅ WebSocket connected: ${email} | Total clients: ${clients.size}`);

  ws.send(JSON.stringify({
    type: 'connected',
    message: `Welcome ${email} — live notifications are active`,
  }));

  ws.on('close', () => {
    clients.delete(email);
    console.log(`❌ WebSocket disconnected: ${email} | Remaining: ${clients.size}`);
  });

  ws.on('error', (err) => {
    console.error(`WebSocket error for ${email}:`, err.message);
    clients.delete(email);
  });
});

// Send notification to a specific user by email
const notifyUser = (email, payload) => {
  const ws = clients.get(email);
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify(payload));
    console.log(`📨 Notification sent to: ${email}`);
  } else {
    console.warn(`⚠️ User ${email} is not connected — notification skipped`);
  }
};

// Broadcast notification to all connected clients
const broadcastAll = (payload) => {
  let count = 0;
  clients.forEach((ws) => {
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(payload));
      count++;
    }
  });
  console.log(`📢 Broadcast sent to ${count} client(s)`);
};

// Inject callbacks into Kafka consumer
setNotifyCallback(notifyUser, broadcastAll);
connectConsumer();

// ── Health Check ──────────────────────────────────────────
app.get('/api/notifications/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'Notification Service',
    websocket_clients_connected: clients.size,
    timestamp: new Date().toISOString(),
  });
});

// ── Start Server ──────────────────────────────────────────
const PORT = process.env.PORT || 3003;
if (process.env.NODE_ENV !== 'test') {

  setNotifyCallback(notifyUser, broadcastAll);
  connectConsumer();
  
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Notification Service + WebSocket running on port ${PORT}`);
  });

}
module.exports = { app, server };