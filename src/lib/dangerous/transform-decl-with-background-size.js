export default function transformWordWithBackgroundSize(node) {
	if (node.type === 'decl' && backgroundSizeRegExp.test(node.prop) && singleAxisValueRegExp.test(node.value) && !ignoredValuesRegExp.test(node.value)) {
		node.value = node.value.replace(singleAxisValueRegExp, '$& $&');
	}
}

const backgroundSizeRegExp = /^background-size$/i;
const ignoredValuesRegExp = /^(contain|cover)$/i;
const singleAxisValueRegExp = /^[^\s]+$/;
