import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 如果编辑器提示 path 模块找不到，则可以安装一下 @types/node -> npm i @types/node -D
import { resolve } from 'path'
import svgLoader from './plugins/svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader('./src/icons/svg/')],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 设置 `@` 指向 `src` 目录，
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@images': resolve(__dirname, 'src/assets/images'),
      '@views': resolve(__dirname, 'src/views'),
      '@store': resolve(__dirname, 'src/store')
    }
  },
  base: './', // 设置打包路径
  // assetsInclude: ['.svg')], // 这里已经将src/icons/svg/下的svg全部导入，无需再单独导入
  assetsInclude: ['.svg', '.json'],
  server: {
    port: 9527, // 设置服务启动端口号
    open: true, // 设置服务启动时是否自动打开浏览器
    cors: true, // 允许跨域

    // 设置代理，根据我们项目实际情况配置
    proxy: {
      '/api': {
        target: 'https://api.github.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace('/api/', '/')
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/styles/element-variables.scss";`
      }
    }
  }
})
