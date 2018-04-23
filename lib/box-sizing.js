import postcss from 'postcss';

export default function (css, opts) {
	if (!('box-sizing' in opts) || opts['box-sizing']) {
		// postcss rule source input
		const input = {
			css: '* { box-sizing: border-box }',
			file: 'postcss-time-machine'
		};

		// postcss rule
		const rule = postcss.rule({
			nodes: [postcss.decl({
				prop: 'box-sizing',
				raws: {
					between: ':'
				},
				source: {
					input,
					start: {
						line: 1,
						column: 4
					}
				},
				value: 'border-box'
			})],
			raws: {
				after: '',
				between: '',
				semicolon: false
			},
			selector: '*',
			source: {
				input,
				start: {
					line: 1,
					column: 1
				}
			}
		});

		// get the last import at-rule
		let lastImport;

		css.walkAtRules('import', atRule => {
			lastImport = atRule;
		});

		if (lastImport) {
			// insert the rule after last import at-rule
			lastImport.parent.insertAfter(lastImport, rule);
		} else {
			// otherwise, add the rule first to the tree
			css.prepend(rule);
		}
	}
}
