const router  = require('express').Router();
const multer  = require('multer');
const db      = require('../services/database');
const storage = require('../services/storage');
const parser  = require('../services/parser');

const ALLOWED_EXT  = ['xlsx', 'xls', 'csv'];
const MAX_SIZE_MB   = 10;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    ALLOWED_EXT.includes(ext)
      ? cb(null, true)
      : cb(new Error(`Format non supporté. Acceptés : ${ALLOWED_EXT.join(', ')}`));
  },
});

// ── POST /api/imports ─────────────────────────────────────
// Upload + traitement complet d'un fichier Excel ou CSV
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier. Champ attendu : "file".' });
  }

  const { originalname, buffer, mimetype } = req.file;
  const ext      = originalname.split('.').pop().toLowerCase();
  const fileType = ['xlsx', 'xls'].includes(ext) ? 'excel' : 'csv';
  let importId;

  try {
    // 1 — Stocker le fichier original dans MinIO
    const minioKey = await storage.uploadFile(buffer, originalname, mimetype);

    // 2 — Parser le fichier
    const { rows, columns } = await parser.parseFile(buffer, originalname);

    // 3 — Créer l'entrée import en base
    const { rows: dbRows } = await db.query(
      `INSERT INTO imports (original_filename, file_type, minio_key, row_count, columns, status)
       VALUES ($1, $2, $3, $4, $5, 'processing') RETURNING id`,
      [originalname, fileType, minioKey, rows.length, JSON.stringify(columns)]
    );
    importId = dbRows[0].id;

    // 4 — Insérer les lignes par batch de 100
    const BATCH = 100;
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      const placeholders = batch.map((_, j) => `($1, $${j * 2 + 2}, $${j * 2 + 3})`).join(', ');
      const values = [importId, ...batch.flatMap((row, j) => [i + j + 1, JSON.stringify(row)])];
      await db.query(
        `INSERT INTO import_rows (import_id, row_index, data) VALUES ${placeholders}`,
        values
      );
    }

    // 5 — Marquer comme terminé
    await db.query("UPDATE imports SET status = 'done' WHERE id = $1", [importId]);

    res.status(201).json({ importId, filename: originalname, fileType, rowCount: rows.length, columns });

  } catch (err) {
    if (importId) {
      await db.query(
        "UPDATE imports SET status = 'error', error_message = $1 WHERE id = $2",
        [err.message, importId]
      ).catch(() => {});
    }
    console.error('[import]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/imports ──────────────────────────────────────
// Liste tous les imports (sans les données)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, original_filename, file_type, row_count, columns, status, error_message, created_at
       FROM imports ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/imports/:id ──────────────────────────────────
// Détail d'un import spécifique
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, original_filename, file_type, minio_key, row_count, columns, status, error_message, created_at
       FROM imports WHERE id = $1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Import introuvable.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/imports/:id/rows ─────────────────────────────
// Données paginées d'un import
router.get('/:id/rows', async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(500, Math.max(1, parseInt(req.query.limit) || 50));
  const offset = (page - 1) * limit;

  try {
    const [rowsRes, countRes] = await Promise.all([
      db.query(
        'SELECT row_index, data FROM import_rows WHERE import_id = $1 ORDER BY row_index LIMIT $2 OFFSET $3',
        [req.params.id, limit, offset]
      ),
      db.query('SELECT COUNT(*) FROM import_rows WHERE import_id = $1', [req.params.id]),
    ]);

    const total = parseInt(countRes.rows[0].count);
    res.json({
      importId: parseInt(req.params.id),
      page, limit, total,
      pages: Math.ceil(total / limit),
      rows: rowsRes.rows.map(r => r.data),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
