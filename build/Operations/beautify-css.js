require('@js/Core')
const Operation = require('../lib/Operation')
const beautify = require('beautify')

module.exports = new Operation('beautify-css', function (data) {
	return beautify(data.toString(), {format: 'css'})
})
