import postcss from 'postcss';
import valueParser from 'postcss-values-parser';
import selectorParser from './lib/parse-selector';

import prependBoxSizingBorderBox from './lib/safe/prepend-box-sizing-border-box';

import transformDeclWithBackgroundPositionOrBorderSpacing from './lib/dangerous/transform-decl-with-background-position-or-border-spacing';
import transformDeclWithBackgroundSize from './lib/dangerous/transform-decl-with-background-size';
import transformDeclWithCornerRadius from './lib/safe/transform-decl-with-corner-radius';
import transformDeclWithDepthOrZOrder from './lib/safe/transform-decl-with-depth-or-z-order';
import transformDeclWithDisplayType from './lib/safe/transform-decl-with-display-type';
import transformDeclWithLineHeight from './lib/dangerous/transform-decl-with-line-height';
import transformDeclWithMarkerStyle from './lib/safe/transform-decl-with-marker-style';
import transformDeclWithVerticalAlignTextMiddle from './lib/safe/transform-decl-with-vertical-align-text-middle';
import transformDeclWithWhiteSpaceNoWrap from './lib/safe/transform-decl-with-white-space-no-wrap';
import transformDeclWithWhiteSpaceOverflowWrap from './lib/safe/transform-decl-with-white-space-overflow-wrap';
import transformFunctionWithRgbOrHslAndFourthValue from './lib/safe/transform-function-with-rgb-or-hsl-and-fourth-value';
import transformSelectorWithLink from './lib/dangerous/transform-selector-with-link';
import transformWordWithCurrentColor from './lib/safe/transform-word-with-current-color';

const features = {
	'background-position': {
		isSafe: false,
		type: 'declaration',
		transform: transformDeclWithBackgroundPositionOrBorderSpacing
	},
	'background-size': {
		isSafe: false,
		type: 'declaration',
		transform: transformDeclWithBackgroundSize
	},
	'border-box': {
		isSafe: true,
		type: 'root',
		transform: prependBoxSizingBorderBox
	},
	'corner-radius': {
		isSafe: true,
		type: 'declaration',
		transform: transformDeclWithCornerRadius
	},
	'current-color': {
		isSafe: true,
		type: 'value',
		transform: transformWordWithCurrentColor
	},
	'display-type': {
		isSafe: true,
		type: 'declaration',
		transform: transformDeclWithDisplayType
	},
	'line-height': {
		isSafe: false,
		type: 'declaration',
		transform: transformDeclWithLineHeight
	},
	'link-pseudo': {
		isSafe: false,
		type: 'selector',
		transform: transformSelectorWithLink
	},
	'marker-style': {
		isSafe: true,
		type: 'declaration',
		transform: transformDeclWithMarkerStyle
	},
	'no-wrap': {
		isSafe: true,
		type: 'declaration',
		transform: transformDeclWithWhiteSpaceNoWrap
	},
	'overflow-wrap': {
		isSafe: true,
		type: 'declaration',
		transform: transformDeclWithWhiteSpaceOverflowWrap
	},
	'rgb-hsl': {
		isSafe: true,
		type: 'value',
		transform: transformFunctionWithRgbOrHslAndFourthValue
	},
	'text-middle': {
		isSafe: true,
		type: 'declaration',
		transform: transformDeclWithVerticalAlignTextMiddle
	},
	'z-order': {
		isSafe: true,
		type: 'declaration',
		transform: transformDeclWithDepthOrZOrder
	}
};
const featuresKeys = Object.keys(features);

export default postcss.plugin('postcss-time-machine', rawopts => {
	const opts = {
		fixes: Object(Object(rawopts).fixes),
		useUnsafeFixes: 'useUnsafeFixes' in Object(rawopts) ? Boolean(rawopts.useUnsafeFixes) : true
	};

	return root => {
		root.walk(node => {
			if (node.type === 'rule') {
				// transform by rule selector
				const selectorAST = selectorParser(node.selector);

				selectorAST.walk(selectorNode => {
					transformNode(selectorNode, 'selector', opts);
				});

				const modifiedSelector = String(selectorAST);

				if (node.selector !== modifiedSelector) {
					node.selector = modifiedSelector;
				}
			} else if (node.type === 'decl') {
				// transform by decl prop
				transformNode(node, 'declaration', opts);

				// transform by decl value
				const valueAST = valueParser(node.value).parse();

				valueAST.walk(valueNode => {
					transformNode(valueNode, 'value', opts);
				});

				const modifiedValue = String(valueAST);

				if (node.value !== modifiedValue) {
					node.value = modifiedValue;
				}
			}
		});

		// prepend box-sizing
		transformNode(root, 'root', opts);
	};
});

function transformNode(node, type, opts) {
	featuresKeys.forEach(key => {
		const feature = features[key];
		const shouldRunTransfrom =
			feature.type === type &&
			(
				Boolean(opts.fixes[key]) ||
				!(key in opts.fixes) &&
				(feature.isSafe || opts.useUnsafeFixes)
			);

		if (shouldRunTransfrom) {
			feature.transform(node);
		}
	});
}
