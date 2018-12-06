'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var valueParser = _interopDefault(require('postcss-values-parser'));
var selectorParser = _interopDefault(require('postcss-selector-parser'));
var postcss = _interopDefault(require('postcss'));

function parseSelector(selector) {
  let selectorAST;
  selectorParser(selectors => {
    selectorAST = selectors;
  }).processSync(selector);
  return selectorAST;
}

function prependBoxSizingBorderBox(root) {
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
  anyRule.append(borderBoxDecl); // get the last import at-rule

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

function transformDeclWithBackgroundPosition(node) {
  if (node.type === 'decl' && backgroundPositionRegExp.test(node.prop) && doubleAxisValue.test(node.value)) {
    node.value = node.value.replace(doubleAxisValue, '$3$2$1');
  }
}
const backgroundPositionRegExp = /^(background-position|border-spacing)$/i;
const doubleAxisValue = /^([^\s]+)(\s+)([^\s]+)$/;

function transformWordWithBackgroundSize(node) {
  if (node.type === 'decl' && backgroundSizeRegExp.test(node.prop) && singleAxisValueRegExp.test(node.value) && !ignoredValuesRegExp.test(node.value)) {
    node.value = node.value.replace(singleAxisValueRegExp, '$& $&');
  }
}
const backgroundSizeRegExp = /^background-size$/i;
const ignoredValuesRegExp = /^(contain|cover)$/i;
const singleAxisValueRegExp = /^[^\s]+$/;

function transformDeclWithCornerRadius(node) {
  if (node.type === 'decl' && cornerRadiusRegExp.test(node.prop)) {
    node.prop = 'border-radius';
  }
}
const cornerRadiusRegExp = /^corner-radius$/i;

function transformDeclWithDepthOrZOrder(node) {
  if (node.type === 'decl' && depthOrZOrderRegExp.test(node.prop)) {
    node.prop = 'z-index';
  }
}
const depthOrZOrderRegExp = /^(depth|z-order)$/i;

function transformDeclWithDisplayType(node) {
  if (node.type === 'decl' && displayTypeRegExp.test(node.prop)) {
    node.prop = 'display';
  }
}
const displayTypeRegExp = /^display-type$/i;

function transformDeclWithLineHeight(node) {
  if (node.type === 'decl' && lineHeightRegExp.test(node.prop) && percentageHeight.test(node.value)) {
    node.value = String(node.value.replace(percentageHeight, '$1') / 100);
  }
}
const lineHeightRegExp = /^line-height$/i;
const percentageHeight = /^(\d+)%$/;

function transformDeclWithMarkerStyle(node) {
  if (node.type === 'decl' && markerStyleRegExp.test(node.prop)) {
    node.prop = 'list-style';
  }
}
const markerStyleRegExp = /^marker-style$/i;

function transformDeclWithVerticalAlignTextMiddle(node) {
  if (node.type === 'decl' && verticalAlignRegExp.test(node.prop) && textMiddleRegExp.test(node.value)) {
    node.value = 'middle';
  }
}
const verticalAlignRegExp = /^vertical-align$/i;
const textMiddleRegExp = /^text-middle$/i;

function transformDeclWithWhiteSpaceNoWrap(node) {
  if (node.type === 'decl' && whiteSpaceRegExp.test(node.prop) && noWrapRegExp.test(node.value)) {
    node.value = 'nowrap';
  }
}
const whiteSpaceRegExp = /^white-space$/i;
const noWrapRegExp = /^no-wrap$/i;

function transformDeclWithWhiteSpaceOverflowWrap(node) {
  if (node.type === 'decl' && whiteSpaceRegExp$1.test(node.prop) && overflowWrapRegExp.test(node.value)) {
    node.prop = 'word-wrap';
    node.value = 'break-word';
  }
}
const whiteSpaceRegExp$1 = /^white-space$/i;
const overflowWrapRegExp = /^overflow-wrap$/i;

function transformFunctionWithRgbOrHslAndFourthValue(node) {
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

function transformSelectorWithLink(node) {
  if (node.type === 'pseudo' && linkRegExp.test(node.value)) {
    node.value = ':visited';
    const selector = node.parent;
    const list = selector.parent;
    const index = list.nodes.indexOf(selector) + 1;
    list.nodes.splice(index, 0, selector.clone());
    node.value = ':link';
  }
}
const linkRegExp = /^:link$/i;

function transformWordWithNoWrap(node) {
  if (node.type === 'word' && currentColorRegExp.test(node.value)) {
    node.value = 'currentColor';
  }
}
const currentColorRegExp = /^current-color$/i;

const features = {
  'background-position': {
    isSafe: false,
    type: 'declaration',
    transform: transformDeclWithBackgroundPosition
  },
  'background-size': {
    isSafe: false,
    type: 'declaration',
    transform: transformWordWithBackgroundSize
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
    transform: transformWordWithNoWrap
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
var index = postcss.plugin('postcss-time-machine', rawopts => {
  const opts = {
    fixes: Object(Object(rawopts).fixes),
    useUnsafeFixes: 'useUnsafeFixes' in Object(rawopts) ? Boolean(rawopts.useUnsafeFixes) : true
  };
  return root => {
    root.walk(node => {
      if (node.type === 'rule') {
        // transform by rule selector
        const selectorAST = parseSelector(node.selector);
        selectorAST.walk(selectorNode => {
          transformNode(selectorNode, 'selector', opts);
        });
        const modifiedSelector = String(selectorAST);

        if (node.selector !== modifiedSelector) {
          node.selector = modifiedSelector;
        }
      } else if (node.type === 'decl') {
        // transform by decl prop
        transformNode(node, 'declaration', opts); // transform by decl value

        const valueAST = valueParser(node.value).parse();
        valueAST.walk(valueNode => {
          transformNode(valueNode, 'value', opts);
        });
        const modifiedValue = String(valueAST);

        if (node.value !== modifiedValue) {
          node.value = modifiedValue;
        }
      }
    }); // prepend box-sizing

    transformNode(root, 'root', opts);
  };
});

function transformNode(node, type, opts) {
  featuresKeys.forEach(key => {
    const feature = features[key];
    const shouldRunTransfrom = feature.type === type && (Boolean(opts.fixes[key]) || !(key in opts.fixes) && (feature.isSafe || opts.useUnsafeFixes));

    if (shouldRunTransfrom) {
      feature.transform(node);
    }
  });
}

module.exports = index;
//# sourceMappingURL=index.js.map
