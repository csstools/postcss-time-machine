import postcss from 'postcss';

export default function prependBoxSizingBorderBox(root) {
	const input = {
		css: '* { box-sizing: border-box }',
		file: 'postcss-time-machine'
	};

	const anyRule = postcss.rule({
		selector: '*',
		source: {
			input: input,
			start: {
				line: 1,
				column: 1
			}
		}
	});
	const borderBoxDecl = postcss.decl({
		prop: 'box-sizing',
		value: 'border-box',
		source: {
			input: input,
			start: {
				line: 1,
				column: 4
			}
		}
	});

	anyRule.append(borderBoxDecl);

	// get the last import at-rule
	let lastImport;

	root.nodes.forEach(node => {
		if (node.type === 'atrule') {
			lastImport = node;
		}
	});

	if (lastImport) {
		// insert the rule after last import at-rule
		lastImport.after(anyRule);
	} else {
		// otherwise, add the rule first to the tree
		root.prepend(anyRule);
	}
}
