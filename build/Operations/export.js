require('@js/Core')
const Operation = require('../lib/Operation')
const Fs = require('fs'), Path = require('path')

module.exports = new Operation('export', {file: ''}, function (data) {
	Fs.mkdirSync(Path.dirname(Path.resolve(this.options.file)), {recursive: true})
	Fs.writeFileSync(Path.resolve(this.options.file), data, 'utf-8')
})
