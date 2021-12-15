require('@js/core')
const Fs = require('fs'), Path = require('path')
const Operation = require('./Operation')

let Operations = {}
Fs.readdirSync(Path.resolve(__dirname, '../Operations'), {withFileTypes: true}).forEach((entry) => {
	if (entry.isFile() && Path.extname(entry.name) == '.js') {
		let o = require(Path.resolve(__dirname, '../Operations', entry.name))
		Operations[o.name] = o
	}
})



module.exports = (list, files) => {
	list = Type(list, 'Array') ? list : [list]

	let data = Clone(files)
	list.forEach(operation => {
		if (Type(operation, 'function')) {
			operation = new Operation('', {}, operation)
		}
		if (Type(operation, 'string')) {
			if (operation.startsWith('this.')) {
				data = data[operation.replace(/^this\./, '')].call(data)
				return
			}
			operation = Operations[operation]
		}
		if (Type(operation, 'Array')) {
			if (operation[0].startsWith('this.')) {
				data = data[operation[0].replace(/^this\./, '')].call(data, operation[1])
				return
			}
			let options = operation[1]
			operation = Operations[operation[0]]
			operation.options = options
		}

		if (Type(data, 'Files')) {
			data.Operation(operation)
		} else {
			let result = operation(data)
			if (typeof result !== 'undefined') {data = result}
		}
	})
	return data
}
