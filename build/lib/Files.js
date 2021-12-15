require('@js/core')
const Fs = require('fs'), Path = require('Path')

let defaults = {
	dir: './',
	joiner: '\n\n',
	loaded: false
}

function Files (list, opts) {
	let options = Extend({}, defaults, opts)

	list.forEach((file) => {
		this[file] = Fs.readFileSync(Path.resolve(options.dir, file), 'utf-8')
	})

	Define(this, 'Operation', function (fn) {
		list.forEach((file) => {
			let result = fn(this[file])
			if (typeof result !== 'undefined') {this[file] = result}
		}, this)
	}, true)

	Define(this, 'Join', function (joiner) {
		let data = []
		list.forEach((file) => {data.push(this[file])}, this)
		return data.join(joiner || options.joiner)
	}, true)


	/*
	Define(this, 'Load', function (cb) {
		let p = new Promise((resolve, reject) => {
			let promises = []
			list.forEach((file) => {
				promises.push(new Promise((resolve, reject) => {
					Fs.readFile(Path.resolve(options.dir, file), 'utf-8', (error, data) => {
						if (error) {reject(error)}
						else {
							this[file] = data
							resolve()
						}
					})
				}))
			}, this)
			Promise.all(promises).then(() => {
				options.loaded = true
				resolve(this)
			}).catch(reject)
		})

		if (typeof cb === 'undefined') {return p}
		else {p.then(() => {cb(this)}).catch((error) => {throw error})}
	}, true)
	*/

	return this
}

module.exports = Files
