<template>
  <div>
    <h1 class="page-title">Importer un fichier</h1>
    <p class="page-sub">Formats acceptés : Excel (.xlsx, .xls) et CSV — Taille max : 10 Mo</p>

    <div class="card upload-card"
         :class="{ 'drag-over': dragging }"
         @dragover.prevent="dragging = true"
         @dragleave="dragging = false"
         @drop.prevent="onDrop">

      <div v-if="!uploading && !result" class="drop-zone" @click="$refs.fileInput.click()">
        <div class="drop-icon">📂</div>
        <p class="drop-text">Glissez votre fichier ici</p>
        <p class="drop-sub">ou cliquez pour choisir</p>
        <input ref="fileInput" type="file" accept=".xlsx,.xls,.csv" hidden @change="onFileChange" />
        <button class="btn btn-primary" style="margin-top:16px">Choisir un fichier</button>
      </div>

      <div v-if="uploading" class="loading">
        <div class="spinner"></div>
        <p>Traitement en cours…</p>
      </div>

      <div v-if="result" class="result">
        <div class="result-icon">✅</div>
        <h2>Import réussi !</h2>
        <div class="result-details">
          <span><strong>Fichier :</strong> {{ result.filename }}</span>
          <span><strong>Lignes importées :</strong> {{ result.rowCount }}</span>
          <span><strong>Colonnes :</strong> {{ result.columns.join(', ') }}</span>
        </div>
        <div class="result-actions">
          <RouterLink :to="`/imports/${result.importId}`" class="btn btn-primary">Voir les données</RouterLink>
          <button class="btn btn-secondary" @click="reset">Nouvel import</button>
        </div>
      </div>
    </div>

    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <div class="recent-section">
      <div class="recent-header">
        <h2>Imports récents</h2>
        <RouterLink to="/imports">Voir tout →</RouterLink>
      </div>
      <div v-if="loading" class="loading">Chargement…</div>
      <div v-else-if="imports.length === 0" class="empty-state">Aucun import pour l'instant.</div>
      <div v-else class="card" style="padding:0">
        <table>
          <thead><tr><th>Fichier</th><th>Lignes</th><th>Statut</th><th>Date</th><th></th></tr></thead>
          <tbody>
            <tr v-for="imp in imports.slice(0,5)" :key="imp.id">
              <td>{{ imp.original_filename }}</td>
              <td>{{ imp.row_count ?? '—' }}</td>
              <td><span :class="`badge badge-${imp.status}`">{{ imp.status }}</span></td>
              <td>{{ formatDate(imp.created_at) }}</td>
              <td><RouterLink :to="`/imports/${imp.id}`">Voir →</RouterLink></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getImports, uploadFile } from '../api'

const dragging  = ref(false)
const uploading = ref(false)
const result    = ref(null)
const error     = ref('')
const imports   = ref([])
const loading   = ref(true)

onMounted(async () => {
  try { imports.value = await getImports() } catch { /* silencieux */ } finally { loading.value = false }
})

async function processFile(file) {
  if (!file) return
  error.value = ''
  result.value = null
  uploading.value = true
  try {
    result.value = await uploadFile(file)
    imports.value = await getImports()
  } catch (e) {
    error.value = e.message
  } finally {
    uploading.value = false
  }
}

function onDrop(e)       { dragging.value = false; processFile(e.dataTransfer.files[0]) }
function onFileChange(e) { processFile(e.target.files[0]) }
function reset()         { result.value = null; error.value = '' }

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
}
</script>

<style scoped>
.page-title { font-size: 1.6rem; font-weight: 700; margin-bottom: 6px; }
.page-sub   { color: #64748b; margin-bottom: 24px; }

.upload-card { border: 2px dashed #cbd5e1; cursor: pointer; transition: border-color .2s; }
.upload-card.drag-over { border-color: #2563eb; background: #eff6ff; }

.drop-zone  { display: flex; flex-direction: column; align-items: center; padding: 48px 20px; }
.drop-icon  { font-size: 3rem; margin-bottom: 12px; }
.drop-text  { font-size: 1.1rem; font-weight: 600; }
.drop-sub   { color: #64748b; margin-top: 4px; }

.spinner { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin .7s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg) } }

.result { text-align: center; padding: 24px 0; }
.result-icon { font-size: 2.5rem; margin-bottom: 8px; }
.result h2 { margin-bottom: 16px; }
.result-details { display: flex; flex-direction: column; gap: 6px; margin-bottom: 24px; color: #475569; }
.result-actions { display: flex; gap: 12px; justify-content: center; }

.recent-section { margin-top: 36px; }
.recent-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.recent-header h2 { font-size: 1.1rem; }
.empty-state { color: #94a3b8; padding: 20px 0; }
</style>
