export default function transformDeclWithCornerRadius(node) {
	if (node.type === 'decl' && cornerRadiusRegExp.test(node.prop)) {
		node.prop = 'border-radius';
	}
}

const cornerRadiusRegExp = /^corner-radius$/i;
