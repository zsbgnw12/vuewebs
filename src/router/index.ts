import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ChatLayout } from '@/components/layout'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/main',
    name: 'main',
    redirect: {name: 'home'},
    component: () => import('@/views/main/index.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: 'chat',
        name: 'chat',
        component: ChatLayout,
				meta: {
					KeepAlive: true
				},
        children: [
          {
            path: ':uuid?',
            name: 'chatdetail',
            component: () => import('@/views/chat/index.vue'),
          },
        ],
      },
      {
        path: 'detail',
        name: 'detail',
        component: () => import('@/views/detail/index.vue'),
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
