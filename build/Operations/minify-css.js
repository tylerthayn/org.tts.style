require('@js/Core')
const Operation = require('../lib/Operation')
const csso = require('csso')

module.exports = new Operation('minify-css', function (data) {
	return csso.minify(data).css
})

/*
let name = 'minify-css', defaults = {}

exports[name] = (data, opts) => {
	return new Promise((resolve, reject) => {
		csso.minify(css).css
	})
}

Define(exports[name],'defaults',{get:function(){return defaults},set:function(v){defaults=v}},true);

Fs.writeFileSync(Path.resolve('dist/@style', 'org.tts.css'), csso.minify(css).css, 'utf-8')
*/
