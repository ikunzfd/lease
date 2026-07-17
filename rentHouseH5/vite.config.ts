import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import svgLoader from 'vite-svg-loader'

export default defineConfig((config) => {
  const { mode } = config
  const env = loadEnv(mode, process.cwd())

  return {
    base: '/',
    plugins: [
      vue(),
      vueJsx(),
      Components({
        resolvers: [VantResolver({ importStyle: false })],
      }),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      svgLoader(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "@/styles/variables.less";`,
        },
      },
    },
    server: {
      host: 'localhost',
      port: 5174,
      proxy: {
        '/app': {
          target: env.VITE_APP_BASE_URL || 'http://localhost:8081',
          changeOrigin: true,
        },
      },
    },
  }
})
