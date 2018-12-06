export default function transformFunctionWithRgbOrHslAndFourthValue(node) {
	if (node.type === 'func' && rgbOrHslRegExp.test(node.value) && Object(node.nodes).length === 9) {
		node.value += 'a';

		node.nodes[7].value = node.nodes[7].value.replace(/^(\d+)$/, ($0, value) => {
			if (node.nodes[7].unit === '%') {
				node.nodes[7].unit = '';

				return value / 100;
			} else if (node.nodes[7].unit === '') {
				return value / 255;
			}

			return $0;
		});
	}
}

const rgbOrHslRegExp = /^(rgb|hsl)$/i;
