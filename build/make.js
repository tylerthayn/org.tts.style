require('@js/core')
const {Files, Operations } = require('./lib')

module.exports = function(grunt) {

	grunt.registerMultiTask('make', 'Make package outputs', function() {
		let options = this.options({})
		log(this)
		//let files = new Files(options.files, {dir: options.dir})
		//Operations(options.operations, files)

	})

}
