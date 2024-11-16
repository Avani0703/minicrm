import { defineConfig } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';

export default defineConfig({
  input: 'src/main.jsx',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
  },
  plugins: [
    nodeResolve({
      extensions: ['.js', '.jsx'],
      preferBuiltins: false,
    }),
    commonjs(),
    json(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    babel({
      presets: ['@babel/preset-react'],
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx'],
    }),
  ],
});
