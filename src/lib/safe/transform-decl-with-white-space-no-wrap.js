export default function transformDeclWithWhiteSpaceNoWrap(node) {
	if (node.type === 'decl' && whiteSpaceRegExp.test(node.prop) && noWrapRegExp.test(node.value)) {
		node.value = 'nowrap';
	}
}

const whiteSpaceRegExp = /^white-space$/i;
const noWrapRegExp = /^no-wrap$/i;
