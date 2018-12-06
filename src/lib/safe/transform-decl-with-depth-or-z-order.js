export default function transformDeclWithDepthOrZOrder(node) {
	if (node.type === 'decl' && depthOrZOrderRegExp.test(node.prop)) {
		node.prop = 'z-index';
	}
}

const depthOrZOrderRegExp = /^(depth|z-order)$/i;
