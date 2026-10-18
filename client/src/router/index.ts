import { createRouter, createWebHistory } from 'vue-router'

import RecipePage from '@/pages/RecipePage.vue'
import ErrorPage from '@/pages/ErrorPage.vue'
import SearchPage from '@/pages/SearchPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: SearchPage },
    { path: '/:slug', name: 'recipePage', component: RecipePage },
    { path: '/:errorCode(.*)', name: 'error', component: ErrorPage },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return { left: 0, top: 0 }
  },
})

export default router
