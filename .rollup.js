import babel from 'rollup-plugin-babel';

const isCLI = String(process.env.NODE_ENV).includes('cli');

const input = `src/${isCLI ? 'cli' : 'index'}.js`;
const output = isCLI ? { file: 'cli.js', format: 'cjs' } : [
	{ file: 'index.js', format: 'cjs', sourcemap: true },
	{ file: 'index.mjs', format: 'esm', sourcemap: true }
]

export default {
	input,
	output,
	plugins: [
		babel({
			presets: [
				['@babel/env', { modules: false, targets: { node: 6 } }]
			]
		})
	]
};
