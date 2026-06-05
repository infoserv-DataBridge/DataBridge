require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DataBridge API',
    version: '0.1.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`DataBridge API demarree sur le port ${PORT}`);
});
