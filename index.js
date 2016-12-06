const postcss        = require('postcss');
const selectorParser = require('postcss-selector-parser');
const valueParser    = require('postcss-value-parser');

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
				if (node.type === 'word' && node.value === 'no-wrap') {
					node.value = 'nowrap';
				}

				if (node.type === 'word' && node.value === 'overflow-wrap') {
					decl.cloneAfter({
						prop:  'word-wrap',
						value: 'break-word'
					});

					decl.remove();
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
module.exports = postcss.plugin('postcss-time-machine', (opts) => (css) => {
	css.walkRules((rule) => {
		rule.selector = selectorParser((selectors) => {
			selectors.walk((node) => {
				const key = node.value;

				if (key in corrections.selectors && (!opts || !(key in opts) || opts[key])) {
					corrections.selectors[key](node, rule);
				}
			});
		}).process(rule.selector).result;
	});

	let declRaws;

	css.walkDecls((decl) => {
		declRaws = declRaws || decl.raws;

		const prop   = decl.prop;
		const values = valueParser(decl.value);

		if (prop in corrections.properties && (!opts || !(prop in opts) || opts[prop])) {
			corrections.properties[prop](decl, values);
		}

		decl.value = values.walk((value) => {
			const key = value.value;

			if (key in corrections.values && (!opts || !(key in opts) || opts[key])) {
				corrections.values[key](value, decl);
			}
		}).toString();
	});

	if (!opts || !('box-sizing' in opts) || opts['box-sizing']) {
		const rules = [];

		css.walkAtRules('import', (rule) => {
			rules.push(rule);
			rule.remove();
		});

		rules.push(
			postcss.rule({
				nodes: [postcss.decl({
					prop:  'box-sizing',
					raws:  declRaws,
					value: 'border-box'
				})],
				selector: '*'
			})
		);

		css.prepend(rules);
	}
});
