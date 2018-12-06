export default function transformDeclWithWhiteSpaceOverflowWrap(node) {
	if (node.type === 'decl' && whiteSpaceRegExp.test(node.prop) && overflowWrapRegExp.test(node.value)) {
		node.prop = 'word-wrap';
		node.value = 'break-word';
	}
}

const whiteSpaceRegExp = /^white-space$/i;
const overflowWrapRegExp = /^overflow-wrap$/i;
