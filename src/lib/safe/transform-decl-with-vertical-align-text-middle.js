export default function transformDeclWithVerticalAlignTextMiddle(node) {
	if (node.type === 'decl' && verticalAlignRegExp.test(node.prop) && textMiddleRegExp.test(node.value)) {
		node.value = 'middle';
	}
}

const verticalAlignRegExp = /^vertical-align$/i;
const textMiddleRegExp = /^text-middle$/i;
