export default function transformDeclWithBackgroundPosition(node) {
	if (node.type === 'decl' && backgroundPositionRegExp.test(node.prop) && doubleAxisValue.test(node.value)) {
		node.value = node.value.replace(doubleAxisValue, '$3$2$1');
	}
}

const backgroundPositionRegExp = /^(background-position|border-spacing)$/i;
const doubleAxisValue = /^([^\s]+)(\s+)([^\s]+)$/;
