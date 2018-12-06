import selectorParser from 'postcss-selector-parser';

export default function parseSelector(selector) {
	let selectorAST;

	selectorParser(selectors => {
		selectorAST = selectors;
	}).processSync(selector);

	return selectorAST
}
