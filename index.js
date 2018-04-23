import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import valueParser from 'postcss-value-parser';
import boxSizing from './lib/box-sizing';
import corrections from './lib/corrections';

export default postcss.plugin('postcss-time-machine', rawopts => css => {
	const opts = Object(rawopts);

	// walk each rule
	css.walkRules(rule => {
		rule.selector = selectorParser(selectors => {
			selectors.walk(node => {
				const key = node.value;

				if (key in corrections.selectors && (!(key in opts) || opts[key])) {
					corrections.selectors[key](node, rule);
				}
			});
		}).processSync(rule.selector);
	});

	// walk each declaration
	css.walkDecls(decl => {
		const prop   = decl.prop;
		const values = valueParser(decl.value);

		if (prop in corrections.properties && (!(prop in opts) || opts[prop])) {
			corrections.properties[prop](decl, values);
		}

		values.walk(value => {
			const key = value.value;

			if (key in corrections.values && (!(key in opts) || opts[key])) {
				corrections.values[key](value, decl);
			}
		})
		
		decl.value = values.toString();
	});

	boxSizing(css, opts)
});
