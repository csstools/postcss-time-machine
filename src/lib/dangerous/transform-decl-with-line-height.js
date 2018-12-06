export default function transformDeclWithLineHeight(node) {
	if (node.type === 'decl' && lineHeightRegExp.test(node.prop) && percentageHeight.test(node.value)) {
		node.value = String(node.value.replace(percentageHeight, '$1') / 100);
	}
}

const lineHeightRegExp = /^line-height$/i;
const percentageHeight = /^(\d+)%$/;
