import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// @ts-expect-error: 'rollup-plugin-terser' 타입 관련 임시 해결
import { terser } from 'rollup-plugin-terser'

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'IBSheetReact',
      fileName: (format) => `ibsheet-react.${format}.js`,
    },
    outDir: 'dist/ibsheet-react',
    sourcemap: false,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: [
        {
          format: 'es',
          entryFileNames: 'ibsheet-react.es.js',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
        {
          format: 'es',
          entryFileNames: 'ibsheet-react.es.min.js',
          plugins: [terser()],
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
        {
          format: 'cjs',
          entryFileNames: 'ibsheet-react.cjs.js',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
        // CJS - 압축
        {
          format: 'cjs',
          entryFileNames: 'ibsheet-react.cjs.min.js',
          plugins: [terser()],
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
        // UMD - 비압축
        {
          format: 'umd',
          name: 'IBSheetReact',
          entryFileNames: 'ibsheet-react.umd.js',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      ],
    },
  },
  plugins: [react()],
})
