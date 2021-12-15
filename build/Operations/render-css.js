require('@js/Core')
const Operation = require('../lib/Operation')
const Deasync = require('deasync'), sass = require('sass')

module.exports = new Operation('render-css', function (data) {
	return Deasync(sass.render)({data: data}).css.toString()
})
