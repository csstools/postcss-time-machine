export default function transformDeclWithDisplayType(node) {
	if (node.type === 'decl' && displayTypeRegExp.test(node.prop)) {
		node.prop = 'display';
	}
}

const displayTypeRegExp = /^display-type$/i;
