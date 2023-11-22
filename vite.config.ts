import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import commonjs from '@rollup/plugin-commonjs'
import { UnifiedViteWeappTailwindcssPlugin as uvtw } from 'weapp-tailwindcss/vite'
import { WeappTailwindcssDisabled } from './platform'
import { plugins as postcssPlugins } from './postcss.config.cjs'
import Components from '@uni-helper/vite-plugin-uni-components'
import { NutResolver } from 'nutui-uniapp'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()) // mode 为命令中的--mode，用来区分.env[mode]中的配置
  const NODE_ENV = env.VITE_USER_NODE_ENV // 'development' / 'production' 用来区分serve命令还是build命令
  // 图片的路径
  // const imgBase = "/static/images/";
  const _IMG_BASE =
    'https://wx-mini-programe-robin.oss-cn-shenzhen.aliyuncs.com/water'

  return {
    // uvtw 一定要放在 uni 后面
    plugins: [
      commonjs(),
      Components({
        resolvers: [NutResolver()]
      }),
      uni(),
      uvtw({
        disabled: WeappTailwindcssDisabled
      }),
      AutoImport({
        imports: [
          'vue',
          'uni-app',
          'pinia',
          {
            from: '@/utils',
            imports: ['navTo']
          },
          {
            from: '@/http',
            imports: ['httpRequest']
          }
        ],
        dts: './src/auto-imports.d.ts',
        eslintrc: {
          enabled: true
        },
        defaultExportByFilename: true
      })
    ],
    define: {
      // 配置环境变量
      _IMG_BASE: JSON.stringify(_IMG_BASE),
      _MODE: JSON.stringify(mode)
    },
    build: {
      sourcemap: NODE_ENV === 'development', // 源码调试
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: NODE_ENV === 'production' // 发布时删除 console
        }
      }
    },
    // 内联 postcss 注册 tailwindcss
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$_IMG_BASE: "${_IMG_BASE}";@import "nutui-uniapp/styles/variables.scss";`
        }
      },
      postcss: {
        plugins: postcssPlugins
      }
    }
  }
})
