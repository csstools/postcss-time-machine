module.exports = {
	'postcss-time-machine': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:current-color': {
			message: 'supports { "current-color": false }',
			options: {
				'current-color': false
			}
		},
		'basic:link': {
			message: 'supports { ":link": false }',
			options: {
				':link': false
			}
		},
		'basic:box-sizing': {
			message: 'supports { "box-sizing": false }',
			options: {
				'box-sizing': false
			}
		}
	}
};
