require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = process.env.BACKEND_PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/health',  require('./routes/health'));
app.use('/api/imports', require('./routes/imports'));

// Gestionnaire d'erreurs global (multer + autres)
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Fichier trop volumineux (max 10 Mo).' });
  }
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`DataBridge API demarree sur le port ${PORT}`);
});
