<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Mes imports</h1>
      <RouterLink to="/" class="btn btn-primary">+ Nouvel import</RouterLink>
    </div>

    <div v-if="loading" class="loading">Chargement…</div>

    <div v-else-if="imports.length === 0" class="card empty">
      <p>Aucun import pour l'instant.</p>
      <RouterLink to="/" class="btn btn-primary" style="margin-top:16px">Importer mon premier fichier</RouterLink>
    </div>

    <div v-else class="card" style="padding:0">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Fichier</th>
            <th>Type</th>
            <th>Lignes</th>
            <th>Colonnes</th>
            <th>Statut</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="imp in imports" :key="imp.id">
            <td style="color:#94a3b8">{{ imp.id }}</td>
            <td><strong>{{ imp.original_filename }}</strong></td>
            <td><span class="file-type">{{ imp.file_type }}</span></td>
            <td>{{ imp.row_count ?? '—' }}</td>
            <td style="color:#64748b;font-size:.85rem">{{ formatCols(imp.columns) }}</td>
            <td><span :class="`badge badge-${imp.status}`">{{ imp.status }}</span></td>
            <td style="color:#64748b;font-size:.88rem">{{ formatDate(imp.created_at) }}</td>
            <td><RouterLink :to="`/imports/${imp.id}`">Voir →</RouterLink></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getImports } from '../api'

const imports = ref([])
const loading = ref(true)

onMounted(async () => {
  try { imports.value = await getImports() } catch (e) { console.error(e) } finally { loading.value = false }
})

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

function formatCols(cols) {
  if (!cols?.length) return '—'
  return cols.length <= 3 ? cols.join(', ') : `${cols.slice(0,3).join(', ')} +${cols.length - 3}`
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-title  { font-size: 1.6rem; font-weight: 700; }
.empty       { text-align: center; padding: 48px; color: #64748b; }
.file-type   { background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: .8rem; font-weight: 600; text-transform: uppercase; }
</style>
