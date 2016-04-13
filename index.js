var postcss        = require('postcss');
var selectorParser = require('postcss-selector-parser');
var valueParser    = require('postcss-value-parser');

var corrections = {
	values: {
		'current-color': function (value) {
			if (value.type === 'word') {
				value.value = 'currentColor';
			}
		},
		'hsl': function (value) {
			if (value.type === 'function' && value.nodes.length === 7) {
				value.value = 'hsla';

				value.nodes[6].value = parseFloat(value.nodes[6].value) / 100;
			}
		},
		'rgb': function (value) {
			if (value.type === 'function' && value.nodes.length === 7) {
				value.value = 'rgba';

				value.nodes[6].value = parseFloat(value.nodes[6].value) / 255;
			}
		}
	},
	properties: {
		'background-position': function (decl, values) {
			if (values.nodes.length === 3) {
				values.nodes.splice(0, 3, values.nodes[2], values.nodes[1], values.nodes[0]);
			}
		},
		'background-size': function (decl, values) {
			if (values.nodes.length === 1) {
				var first = values.nodes[0];

				values.nodes.push({ type: 'space', value: ' ' }, first);
			}
		},
		'border-spacing': function (decl, values) {
			if (values.nodes.length === 3) {
				values.nodes.splice(0, 3, values.nodes[2], values.nodes[1], values.nodes[0]);
			}
		},
		'corner-radius': function (decl) {
			decl.prop = 'border-radius';
		},
		'vertical-align': function (decl, values) {
			values.walk(function (node) {
				if (node.type === 'word' && node.value === 'text-middle') {
					node.value = 'middle';
				}
			});
		},
		'white-space': function (decl, values) {
			values.walk(function (node) {
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
		'z-order': function (decl) {
			decl.prop = 'z-index';
		}
	},
	selectors: {
		':link': function (pseudo) {
			pseudo.value = ':visited';

			var selector = pseudo.parent;
			var list     = selector.parent;
			var index    = list.nodes.indexOf(selector) + 1;

			list.nodes.splice(index, 0, selector.clone());

			pseudo.value = ':link';
		}
	}
};

module.exports = postcss.plugin('postcss-time-machine', function (opts) {
	return function (css) {
		css.walkRules(function (rule) {
			rule.selector = selectorParser(function (selectors) {
				selectors.eachInside(function (node) {
					var key = node.value;

					if (key in corrections.selectors && (!opts || !(key in opts) || opts[key])) {
						corrections.selectors[key](node, rule);
					}
				});
			}).process(rule.selector).result;
		});

		var declRaws;

		css.walkDecls(function (decl) {
			declRaws = declRaws || decl.raws;

			var prop   = decl.prop;
			var values = valueParser(decl.value);

			if (prop in corrections.properties && (!opts || !(prop in opts) || opts[prop])) {
				corrections.properties[prop](decl, values);
			}

			decl.value = values.walk(function (value) {
				var key = value.value;

				if (key in corrections.values && (!opts || !(key in opts) || opts[key])) {
					corrections.values[key](value, decl);
				}
			}).toString();
		});

		if (!opts || !('box-sizing' in opts) || opts['box-sizing']) {
			var rules = [];
			css.walkAtRules('import', function(rule) {
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
	};
});
