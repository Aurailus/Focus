import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';

export default function() {
	return {
		mode: 'production',
		stats: 'errors-warnings',

		entry: { main: './src/Main.ts' },
		resolve: {
			extensions: [ '.ts', '.js' ]
		},
		output: {
			path: __dirname + '/build',
			filename: 'main.js'
		},

		plugins: [
			new ForkTsCheckerPlugin({
				typescript: {
					configFile: './tsconfig.json',
				},
				eslint: {
					files: './src/**/*.ts',
					options: {
						configFile: './.eslintrc.js',
						emitErrors: true,
						failOnHint: true,
						typeCheck: true
					}
				}
			})
		],
		module: {
			rules: [{
				test: /\.[t|j]s$/,
				loader: 'babel-loader',
				options: {
					babelrc: false,
					cacheDirectory: true,
					presets: [
						[ '@babel/preset-typescript' ],
						[ '@babel/preset-env', { targets: { browsers: [ 'Chrome 90' ]} }]
					],
					plugins: [
						// ['@babel/transform-react-jsx', { pragma: 'h' }],
						// ['@babel/plugin-proposal-class-properties', { loose: true }],
						// ['@babel/plugin-proposal-private-methods', { loose: true }]
					]
				}
			}]
		}
	}
}
