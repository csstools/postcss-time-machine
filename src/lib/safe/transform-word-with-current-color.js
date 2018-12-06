export default function transformWordWithNoWrap(node) {
	if (node.type === 'word' && currentColorRegExp.test(node.value)) {
		node.value = 'currentColor';
	}
}

const currentColorRegExp = /^current-color$/i;
