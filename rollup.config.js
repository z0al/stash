// Packages
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

// Ours
import pkg from './package.json';

export default {
	input: 'src/index.js',
	output: [
		{
			file: pkg.browser,
			format: 'umd',
			name: 'statedX'
		},
		{
			file: pkg.module,
			format: 'es'
		},
		{
			file: pkg.main,
			format: 'cjs'
		}
	],
	plugins: [
		resolve(),
		babel({ exclude: 'node_modules/**' }),
		commonjs(),
		terser()
	]
};
