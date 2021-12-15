require('@js/core')
const Fs = require('fs'), Path = require('path')

module.exports = function(grunt) {
	grunt.registerMultiTask('clean', 'Clean package contents', function() {
		let options = this.options({})

		options.files && options.files.forEach(file => {
			Fs.unlinkSync(Path.resolve(file))
		})

		options.dirs && options.dirs.forEach(dir => {
			Fs.rmdirSync(Path.resolve(dir), {recursive: true})
		})
	})
}
