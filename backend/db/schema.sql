-- ============================================================
-- Schema DataBridge
-- ============================================================

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(50)  NOT NULL DEFAULT 'user',
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des imports (un import = un fichier déposé)
CREATE TABLE IF NOT EXISTS imports (
    id                SERIAL PRIMARY KEY,
    user_id           INTEGER REFERENCES users(id) ON DELETE SET NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_type         VARCHAR(10)  NOT NULL,        -- 'excel' ou 'csv'
    minio_key         VARCHAR(500) NOT NULL,         -- chemin du fichier dans MinIO
    row_count         INTEGER,                       -- nombre de lignes importées
    columns           JSONB,                         -- noms des colonnes détectées
    status            VARCHAR(20) NOT NULL DEFAULT 'pending',
    error_message     TEXT,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des données importées
-- data est en JSONB car chaque fichier a ses propres colonnes
-- Exemple : { "nom": "Dupont", "age": "42", "ville": "Paris" }
CREATE TABLE IF NOT EXISTS import_rows (
    id         BIGSERIAL PRIMARY KEY,
    import_id  INTEGER NOT NULL REFERENCES imports(id) ON DELETE CASCADE,
    row_index  INTEGER NOT NULL,
    data       JSONB   NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour accélérer les recherches
CREATE INDEX IF NOT EXISTS idx_imports_user_id    ON imports(user_id);
CREATE INDEX IF NOT EXISTS idx_imports_status     ON imports(status);
CREATE INDEX IF NOT EXISTS idx_rows_import_id     ON import_rows(import_id);
CREATE INDEX IF NOT EXISTS idx_rows_data          ON import_rows USING GIN(data);
