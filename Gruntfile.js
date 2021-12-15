'use strict'


module.exports = function(grunt) {
	let clean = {
		default: {
			options: {
				dirs: ['./dist']
			}
		}
	}
	let make = {
		default: {
			options: {
				dir: './src/@style',
				files: [
					'material-icons.css',
					'font-awesome.css',
					'open-sans.css',
					'bootstrap.tts.scss',
					'tts-bootstrap.scss'
				],
				operations: [
					'render-css',
					'beautify-css',
					'this.Join',
					['export', {file: './dist/'+grunt.package.version+'/org.tts.css'}],
					['export', {file: './dist/org.tts.css'}],
					'minify-css',
					['export', {file: './dist/'+grunt.package.version+'/org.tts.min.css'}],
					['export', {file: './dist/org.tts.min.css'}]
				]
			}
		},
		'material-icons': {
			options: {}
		}
	}


	grunt.initConfig({clean: clean, make: make})
	grunt.loadTasks('build')

}
