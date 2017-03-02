// tooling
const postcss        = require('postcss');
const selectorParser = require('postcss-selector-parser');
const valueParser    = require('postcss-value-parser');

// corrections
const corrections = {
	values: {
		'current-color': (value) => {
			if (value.type === 'word') {
				value.value = 'currentColor';
			}
		},
		'hsl': (value) => {
			if (value.type === 'function' && value.nodes.length === 7) {
				value.value = 'hsla';

				value.nodes[6].value = parseFloat(value.nodes[6].value) / 100;
			}
		},
		'rgb': (value) => {
			if (value.type === 'function' && value.nodes.length === 7) {
				value.value = 'rgba';

				value.nodes[6].value = parseFloat(value.nodes[6].value) / 255;
			}
		}
	},
	properties: {
		'background-position': (decl, values) => {
			if (values.nodes.length === 3) {
				values.nodes.splice(0, 3, values.nodes[2], values.nodes[1], values.nodes[0]);
			}
		},
		'background-size': (decl, values) => {
			if (values.nodes.length === 1) {
				const first = values.nodes[0];

				if (!(/^(contain|cover)$/i).test(first.value)) {
					values.nodes.push({
						type: 'space',
						value: ' '
					}, first);
				}
			}
		},
		'border-spacing': (decl, values) => {
			if (values.nodes.length === 3) {
				values.nodes.splice(0, 3, values.nodes[2], values.nodes[1], values.nodes[0]);
			}
		},
		'corner-radius': (decl) => {
			decl.prop = 'border-radius';
		},
		'display-type': (decl) => {
			decl.prop = 'display';
		},
		'depth': (decl) => {
			decl.prop = 'z-index';
		},
		'line-height': (decl, values) => {
			values.walk((node) => {
				if (node.type === 'word' && node.value.slice(-1) === '%') {
					node.value = node.value.slice(0, -1) / 100;
				}
			});
		},
		'marker-style': (decl) => {
			decl.prop = 'list-style';
		},
		'vertical-align': (decl, values) => {
			values.walk((node) => {
				if (node.type === 'word' && node.value === 'text-middle') {
					node.value = 'middle';
				}
			});
		},
		'white-space': (decl, values) => {
			values.walk((node) => {
				if (node.type === 'word') {
					if (node.value === 'no-wrap') {
						node.value = 'nowrap';
					} else if (node.value === 'overflow-wrap') {
						decl.prop = 'word-wrap';
						node.value = 'break-word';
					}
				}
			});
		},
		'z-order': (decl) => {
			decl.prop = 'z-index';
		}
	},
	selectors: {
		':link': (pseudo) => {
			pseudo.value = ':visited';

			const selector = pseudo.parent;
			const list     = selector.parent;
			const index    = list.nodes.indexOf(selector) + 1;

			list.nodes.splice(index, 0, selector.clone());

			pseudo.value = ':link';
		}
	}
};

// plugin
module.exports = postcss.plugin('postcss-time-machine', (opts = {}) => (css) => {
	// walk each rule
	css.walkRules((rule) => {
		rule.selector = selectorParser((selectors) => {
			selectors.walk((node) => {
				const key = node.value;

				if (key in corrections.selectors && (!(key in opts) || opts[key])) {
					corrections.selectors[key](node, rule);
				}
			});
		}).process(rule.selector).result;
	});

	// walk each declaration
	css.walkDecls((decl) => {
		const prop   = decl.prop;
		const values = valueParser(decl.value);

		if (prop in corrections.properties && (!(prop in opts) || opts[prop])) {
			corrections.properties[prop](decl, values);
		}

		decl.value = values.walk((value) => {
			const key = value.value;

			if (key in corrections.values && (!(key in opts) || opts[key])) {
				corrections.values[key](value, decl);
			}
		}).toString();
	});

	if (!('box-sizing' in opts) || opts['box-sizing']) {
		// postcss rule source input
		const input = {
			css: '* { box-sizing: border-box }',
			file: 'postcss-time-machine'
		};

		// postcss rule
		const rule = postcss.rule({
			nodes: [postcss.decl({
				prop:  'box-sizing',
				raws: {
					between: ':'
				},
				source: {
					input: input,
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
				input: input,
				start: {
					line: 1,
					column: 1
				}
			}
		});

		// get the last import at-rule
		let lastImport;

		css.walkAtRules('import', (rule) => {
			lastImport = rule;
		});

		if (lastImport) {
			// insert the rule after last import at-rule
			lastImport.parent.insertAfter(lastImport, rule);
		} else {
			// otherwise, add the rule first to the tree
			css.prepend(rule);
		}
	}
});

// override plugin#process
module.exports.process = function (cssString, pluginOptions, processOptions) {
	return postcss([
		0 in arguments ? module.exports(pluginOptions) : module.exports()
	]).process(cssString, processOptions);
};
