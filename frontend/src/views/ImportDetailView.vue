<template>
  <div>
    <div class="back-link">
      <RouterLink to="/imports">← Retour aux imports</RouterLink>
    </div>

    <div v-if="loading" class="loading">Chargement…</div>
    <div v-else-if="error" class="alert alert-error">{{ error }}</div>

    <template v-else-if="meta">
      <!-- En-tête -->
      <div class="card meta-card">
        <div class="meta-header">
          <div>
            <h1 class="page-title">{{ meta.original_filename }}</h1>
            <p class="meta-sub">Import #{{ meta.id }} · {{ meta.file_type }} · {{ formatDate(meta.created_at) }}</p>
          </div>
          <span :class="`badge badge-${meta.status}`" style="font-size:.9rem;padding:6px 14px">{{ meta.status }}</span>
        </div>
        <div class="meta-stats">
          <div class="stat"><span class="stat-val">{{ meta.row_count }}</span><span class="stat-lbl">lignes</span></div>
          <div class="stat"><span class="stat-val">{{ meta.columns?.length }}</span><span class="stat-lbl">colonnes</span></div>
          <div class="stat-cols">
            <span v-for="col in meta.columns" :key="col" class="col-chip">{{ col }}</span>
          </div>
        </div>
      </div>

      <!-- Tableau données -->
      <div class="card" style="padding:0;margin-top:20px">
        <div class="table-toolbar">
          <span class="table-info">{{ total }} lignes · page {{ page }}/{{ pages }}</span>
          <div class="limit-select">
            Lignes par page :
            <select v-model.number="limit" @change="fetchRows(1)">
              <option>25</option><option>50</option><option>100</option>
            </select>
          </div>
        </div>

        <div v-if="rowsLoading" class="loading">Chargement des données…</div>
        <div v-else class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th v-for="col in meta.columns" :key="col">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in rows" :key="i">
                <td style="color:#94a3b8;font-size:.85rem">{{ (page - 1) * limit + i + 1 }}</td>
                <td v-for="col in meta.columns" :key="col">{{ row[col] ?? '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination" v-if="pages > 1">
          <button class="btn btn-secondary" :disabled="page === 1" @click="fetchRows(page - 1)">← Précédent</button>
          <span>{{ page }} / {{ pages }}</span>
          <button class="btn btn-secondary" :disabled="page === pages" @click="fetchRows(page + 1)">Suivant →</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getImport, getImportRows } from '../api'

const route      = useRoute()
const meta       = ref(null)
const rows       = ref([])
const page       = ref(1)
const pages      = ref(1)
const total      = ref(0)
const limit      = ref(50)
const loading    = ref(true)
const rowsLoading = ref(false)
const error      = ref('')

onMounted(async () => {
  try {
    meta.value = await getImport(route.params.id)
    await fetchRows(1)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

async function fetchRows(p) {
  rowsLoading.value = true
  try {
    const data = await getImportRows(route.params.id, p, limit.value)
    rows.value  = data.rows
    page.value  = data.page
    pages.value = data.pages
    total.value = data.total
  } catch (e) {
    error.value = e.message
  } finally {
    rowsLoading.value = false
  }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
}
</script>

<style scoped>
.back-link   { margin-bottom: 20px; }
.page-title  { font-size: 1.4rem; font-weight: 700; }
.meta-card   { margin-bottom: 0; }
.meta-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.meta-sub    { color: #64748b; margin-top: 4px; }
.meta-stats  { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.stat        { display: flex; flex-direction: column; align-items: center; }
.stat-val    { font-size: 1.6rem; font-weight: 700; color: #2563eb; }
.stat-lbl    { font-size: .8rem; color: #64748b; }
.stat-cols   { display: flex; gap: 6px; flex-wrap: wrap; }
.col-chip    { background: #f1f5f9; color: #475569; padding: 3px 10px; border-radius: 4px; font-size: .83rem; }

.table-toolbar { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-bottom: 1px solid #e2e8f0; }
.table-info    { color: #64748b; font-size: .9rem; }
.limit-select  { display: flex; align-items: center; gap: 8px; color: #64748b; font-size: .9rem; }
.limit-select select { padding: 4px 8px; border: 1px solid #e2e8f0; border-radius: 4px; }

.pagination { padding: 16px; display: flex; justify-content: center; align-items: center; gap: 16px; border-top: 1px solid #e2e8f0; }
.pagination span { color: #64748b; }
.btn:disabled { opacity: .4; cursor: not-allowed; }
</style>
