module.exports = {
	'basic': {
		message: 'supports basic usage'
	},
	'basic:no-unsafe-fixes': {
		message: 'supports { useUnsafeFixes: false }',
		options: {
			useUnsafeFixes: false
		}
	},
	'basic:no-unsafe-fixes-with-an-exception': {
		message: 'supports { useUnsafeFixes: false }',
		options: {
			useUnsafeFixes: false,
			fixes: {
				'link-pseudo': true
			}
		}
	},
	'basic:current-color': {
		message: 'supports { fixes: { "current-color": false } }',
		options: {
			fixes: {
				'current-color': false
			}
		}
	},
	'basic:link': {
		message: 'supports { fixes: { "link-pseudo": false } }',
		options: {
			fixes: {
				'link-pseudo': false
			}
		}
	},
	'basic:box-sizing': {
		message: 'supports { fixes: { "border-box": false } }',
		options: {
			fixes: {
				'border-box': false
			}
		}
	},
	'no-import': {
		message: 'supports basic usage ( without import )'
	}
};
