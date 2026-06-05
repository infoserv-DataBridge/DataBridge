// Toutes les appels vers le backend passent par ce fichier.
// BASE vide = URL relative → nginx proxifie /api/* vers le backend.
const BASE = import.meta.env.VITE_API_URL || ''

export async function getImports() {
  const r = await fetch(`${BASE}/api/imports`)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function getImport(id) {
  const r = await fetch(`${BASE}/api/imports/${id}`)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function getImportRows(id, page = 1, limit = 50) {
  const r = await fetch(`${BASE}/api/imports/${id}/rows?page=${page}&limit=${limit}`)
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

export async function uploadFile(file) {
  const form = new FormData()
  form.append('file', file)
  const r = await fetch(`${BASE}/api/imports`, { method: 'POST', body: form })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Erreur upload')
  return data
}
