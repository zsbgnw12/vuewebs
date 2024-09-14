import path from 'path'
import type { PluginOption } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

function setupPlugins(env: ImportMetaEnv): PluginOption[] {
  return [
    vue(),
    env.VITE_GLOB_APP_PWA === 'true' && VitePWA({
      injectRegister: 'auto',
    }),
  ]
}

export default defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, process.cwd()) as unknown as ImportMetaEnv

  return {
    base: './',
		resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    plugins: setupPlugins(viteEnv),
    server: {
      host: '0.0.0.0',
      port: 1002,
      open: false,
      proxy: {
        '/ws/chat': {
          target: 'ws://23.102.226.8:8000',
          changeOrigin: true
        },
        '/news': {
          target: 'http://23.102.226.8:8080/',
          changeOrigin: true
        },
				'/scrape': {
          target: 'http://23.102.226.8:8080/',
          changeOrigin: true
        },
        '/data': {
          target: 'http://23.102.226.8:8080/',
          changeOrigin: true
        },
        '/api/sysAuth': {
          target: 'https://webiip-e9cdewemcycyahfx.australiaeast-01.azurewebsites.net/',
          changeOrigin: true
        },

      },
    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  }
})
