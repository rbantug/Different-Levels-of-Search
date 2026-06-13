import { createRouter, createWebHistory } from 'vue-router'

import SearchPage from '@/pages/SearchPage.vue'
import RecipePage from '@/pages/RecipePage.vue'
import ErrorPage from '@/pages/ErrorPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: SearchPage },
    { path: '/:id', component: RecipePage },
    { path: '/:anything(.*)', component: ErrorPage },
  ],
})

export default router
