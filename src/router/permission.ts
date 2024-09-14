import type { Router } from 'vue-router'
import { ss } from '@/utils/storage/index'
export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    if(to.name !== 'login') {
      const token = ss.get('token')
      if(!token) {
        return next({ name: 'login' })
      }
    }

    next()
  })
}
