const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const jwt = require('jsonwebtoken');
const ChaosEngine = require('./chaos-engine');
const AIEngine = require('./ai-engine');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// JWT Secret
const JWT_SECRET = 'social_sandbox_secret';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/game.html'));
});

// Authentication endpoint
app.post('/api/auth', (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// WebSocket for real-time features
io.on('connection', (socket) => {
  console.log('New user connected');

  // Handle authentication
  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      socket.emit('authenticated', { username: decoded.username });
      io.emit('user-connected', { username: decoded.username });
    } catch (err) {
      socket.emit('auth-error', { message: 'Invalid token' });
    }
  });

  // Handle player actions
  socket.on('player-action', (data) => {
    if (!socket.user) return;
    const actionData = {
      ...data,
      username: socket.user.username,
      timestamp: new Date().toISOString()
    };
    io.emit('action-update', actionData);
  });

  // Handle chaos events
  socket.on('request-chaos', () => {
    const chaosEvent = ChaosEngine.generateChaos();
    io.emit('chaos-event', chaosEvent);
  });

  // Handle AI responses
  socket.on('player-response', (data) => {
    const { action, personalityType, difficulty } = data;
    const aiResponse = AIEngine.generateResponse(action, personalityType, difficulty);
    socket.emit('ai-response', aiResponse);
    
    if (data.isChaosEvent) {
      const points = ChaosEngine.calculateImpact(
        data.chaosEvent,
        data.responseTime,
        data.responseQuality
      );
      io.emit('points-update', { 
        username: socket.user.username,
        points, 
        skill: 'adaptability' 
      });
    }
  });

  // Handle AR scenario requests
  socket.on('start-ar-scenario', (scenarioId) => {
    const scenario = require('./ar-scenarios.json').find(s => s.id === scenarioId);
    if (scenario) {
      socket.emit('ar-scene-data', scenario);
    }
  });

  socket.on('disconnect', () => {
    if (socket.user) {
      io.emit('user-disconnected', { username: socket.user.username });
    }
    console.log('User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };