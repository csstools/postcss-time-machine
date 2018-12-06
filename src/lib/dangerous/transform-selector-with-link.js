export default function transformSelectorWithLink(node) {
	if (node.type === 'pseudo' && linkRegExp.test(node.value)) {
		node.value = ':visited';

		const selector = node.parent;
		const list     = selector.parent;
		const index    = list.nodes.indexOf(selector) + 1;

		list.nodes.splice(index, 0, selector.clone());

		node.value = ':link';
	}
}

const linkRegExp = /^:link$/i;
