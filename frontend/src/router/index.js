import { createRouter, createWebHistory } from 'vue-router'
import ImportView    from '../views/ImportView.vue'
import ImportsView   from '../views/ImportsView.vue'
import ImportDetail  from '../views/ImportDetailView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',            component: ImportView,  meta: { title: 'Importer' } },
    { path: '/imports',     component: ImportsView, meta: { title: 'Mes imports' } },
    { path: '/imports/:id', component: ImportDetail, meta: { title: 'Données' } },
  ],
})
