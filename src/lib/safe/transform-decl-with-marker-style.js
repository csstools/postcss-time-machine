export default function transformDeclWithMarkerStyle(node) {
	if (node.type === 'decl' && markerStyleRegExp.test(node.prop)) {
		node.prop = 'list-style';
	}
}

const markerStyleRegExp = /^marker-style$/i;
