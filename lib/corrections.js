export default {
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