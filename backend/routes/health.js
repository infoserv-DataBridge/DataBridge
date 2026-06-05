const router  = require('express').Router();
const db      = require('../services/database');
const storage = require('../services/storage');

router.get('/', async (req, res) => {
  const health = {
    status: 'ok',
    version: '0.3.0',
    timestamp: new Date().toISOString(),
    services: { postgres: 'checking', minio: 'checking' },
  };

  try {
    await db.query('SELECT 1');
    health.services.postgres = 'ok';
  } catch {
    health.services.postgres = 'error';
    health.status = 'degraded';
  }

  try {
    await storage.isReady();
    health.services.minio = 'ok';
  } catch {
    health.services.minio = 'error';
    health.status = 'degraded';
  }

  res.status(health.status === 'ok' ? 200 : 503).json(health);
});

module.exports = router;
