const Minio = require('minio');

const client = new Minio.Client({
  endPoint:  process.env.MINIO_ENDPOINT || 'localhost',
  port:      parseInt(process.env.MINIO_PORT) || 9000,
  useSSL:    false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const BUCKET = process.env.MINIO_BUCKET || 'databridge-files';

async function uploadFile(buffer, filename, mimetype) {
  const now = new Date();
  const prefix = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  const key = `${prefix}/${Date.now()}-${filename}`;
  await client.putObject(BUCKET, key, buffer, buffer.length, { 'Content-Type': mimetype });
  return key;
}

async function isReady() {
  return client.bucketExists(BUCKET);
}

module.exports = { uploadFile, isReady };
