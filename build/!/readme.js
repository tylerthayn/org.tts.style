'use strict'
require('@js/core')
const Doctrine = require('doctrine'), ExtractComments = require('esprima-extract-comments'), Fs = require('fs'), Path = require('path')
//Template = require('@js/Template')
const Template = require('../build/Template.js')

module.exports = function(grunt) {

	grunt.registerMultiTask('readme', 'Generate package readme', function() {
		let options = this.options({}), contents = []

		this.files.forEach(function(f) {
			let doclets = []
			f.src.forEach((src) => {
				log(src)
				let code = Fs.readFileSync(src, 'utf-8')
				let comments = ExtractComments(code)
				comments.forEach((comment) => {
					let d = new Doclet(comment.value, src.replace(process.cwd(), ''))
					if (d.Label != '') {
						contents.push('* '+d.Label+'  ')
					}
					doclets.push(d)
				})
			})
			let template = new Template(Path.resolve(__dirname, 'templates/README.tpl'))
			template.pkg = require(Path.resolve('./package.json'))
			template.contents = contents.sort().join('\n')
			Fs.writeFileSync(Path.resolve(f.dest), template.Render(), 'utf-8')
		})

	})

}


function Doclet (comment, file) {
	let doclet = Doctrine.parse(comment, {unwrap: true, recoverable: true, sloppy: true})

	Define(doclet, 'Tag', function (name) {
		let tags = []
		this.tags.forEach((tag) => {
			if (tag.title == name) {
				tags.push(tag)
			}
		})
		return tags.length == 0 ? null : tags.length == 1 ? tags[0] : tags
	})

	Define(doclet, 'Tags', {get: function () {
		let tags = []
		this.tags.forEach((tag) => {
			tags.push(tag.title)
		})
		return tags
	}})


	Define(doclet, 'Label', {get: function () {
		let label = ''
		if (this.Tags.includes('memberof')) {
			label = this.Tag('memberof').description
		}

		if (this.Tags.includes('name')) {
			label += this.Tag('name').name
		}

		if (this.Tags.includes('function')) {
			let params = this.Tag('param'), args = []
			if (params != null) {
				params = Type(params, 'array') ? params : [params]
				params.forEach((param) => {
					args.push(param.name)
				})
			}
			label += this.Tag('function').name + (args.length > 0 ? '('+args.join(', ')+')' : '()')
		}
		return label
	}})
	return doclet
}

