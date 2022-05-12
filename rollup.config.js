/* eslint import/no-extraneous-dependencies: ['error', {'devDependencies': true}] */
import autoExternal from 'rollup-plugin-auto-external';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  plugins: [
    autoExternal(),
    babel({
      babelrc: false,
      exclude: ['./node_modules/**'],
      presets: [['@form8ion', {targets: {node: '10'}, modules: false}]]
    })
  ],
  external: 'spdx-license-list/simple',
  output: [
    {file: 'lib/index.js', format: 'cjs', sourcemap: true},
    {file: 'lib/index.mjs', format: 'es', sourcemap: true}
  ]
};
