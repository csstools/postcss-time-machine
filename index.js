var parser  = require('postcss-value-parser');
var postcss = require('postcss');

var values = {
	'current-color': function (node) {
		if (node.type === 'word' && node.value === 'current-color') {
			node.value = 'currentColor';
		}
	},
	'hsl': function (node) {
		if (node.type === 'function' && node.value === 'hsl' && node.nodes.length === 7) {
			node.value = 'hsla';
			node.nodes[6].value = parseFloat(node.nodes[6].value) / 100;
		}
	},
	'rgb': function (node) {
		if (node.type === 'function' && node.value === 'rgb' && node.nodes.length === 7) {
			node.value = 'rgba';
			node.nodes[6].value = parseFloat(node.nodes[6].value) / 255;
		}
	}
};

var properties = {
	'background-position': function (decl, value) {
		if (value.nodes.length === 3) {
			value.nodes.splice(0, 3, value.nodes[2], value.nodes[1], value.nodes[0]);
		}
	},
	'background-size': function (decl, value) {
		if (value.nodes.length === 1) {
			var first = value.nodes[0];

			value.nodes.push({ type: 'space', value: ' ' }, first);
		}
	},
	'border-spacing': function (decl, value) {
		if (value.nodes.length === 3) {
			value.nodes.splice(0, 3, value.nodes[2], value.nodes[1], value.nodes[0]);
		}
	},
	'corner-radius': function (decl) {
		decl.prop = 'border-radius';
	},
	'vertical-align': function (decl, value) {
		value.walk(function (node) {
			if (node.type === 'word' && node.value === 'text-middle') {
				node.value = 'middle';
			}
		});
	},
	'white-space': function (decl, value) {
		value.walk(function (node) {
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
};

module.exports = postcss.plugin('postcss-time-machine', function (opts) {
	return function (css) {
		css.walkDecls(function (node) {
			var prop  = node.prop;
			var value = parser(node.value);

			if (prop in properties && (!opts || !(prop in opts) || opts[prop])) properties[prop](node, value);

			value.walk(function (subvalue) {
				for (var subprop in values) {
					if (!opts || !(subprop in opts) || opts[subprop]) values[subprop](subvalue);
				}
			});

			node.value = value.toString();
		});
	};
});
