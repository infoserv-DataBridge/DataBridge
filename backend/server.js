require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const Minio = require('minio');

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

// Connexion PostgreSQL
const db = new Pool({
  host:     process.env.POSTGRES_HOST     || 'localhost',
  port:     parseInt(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB,
  user:     process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// Connexion MinIO
const minio = new Minio.Client({
  endPoint:  process.env.MINIO_ENDPOINT || 'localhost',
  port:      parseInt(process.env.MINIO_PORT) || 9000,
  useSSL:    false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

app.use(cors());
app.use(express.json());

// Health check : vérifie que l'API, PostgreSQL et MinIO répondent
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'ok',
    version: '0.2.0',
    timestamp: new Date().toISOString(),
    services: {
      postgres: 'checking',
      minio:    'checking',
    },
  };

  try {
    await db.query('SELECT 1');
    health.services.postgres = 'ok';
  } catch (err) {
    health.services.postgres = 'error';
    health.status = 'degraded';
  }

  try {
    await minio.bucketExists(process.env.MINIO_BUCKET || 'databridge-files');
    health.services.minio = 'ok';
  } catch (err) {
    health.services.minio = 'error';
    health.status = 'degraded';
  }

  res.status(health.status === 'ok' ? 200 : 503).json(health);
});

app.listen(PORT, () => {
  console.log(`DataBridge API demarree sur le port ${PORT}`);
});
