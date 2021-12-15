/********************************************************************
*** Configurations **************************************************
********************************************************************/
let downloadUrls = {
	//'@js/jquery.js': 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',
	'@js/jquery-mobile.js': 'https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.js',
	'@style/jquery-mobile.css': 'https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.css',
	'@js/jquery-ui.js': 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js',
	'@style/jquery-ui.css': 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css',
	'@js/popper.js': 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
	//'@js/bootstrap.js': 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
	//'@style/bootstrap.css': 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
}

let assets = {
	'@style/bootstrap.css': 'node_modules/bootstrap/dist/css/bootstrap.min.css',
	'@js/jquery.js': 'node_modules/jquery/dist/jquery.min.js',
	//'@js/popper.js': 'node_modules/popper.js/dist/popper.min.js',
	'@js/bootstrap.js': 'node_modules/bootstrap/dist/js/bootstrap.min.js',
	'@js/notify.js': 'node_modules/@jpillora/notifyjs-browser/dist/notify.js',
	'@js/org.tts.js.core.js': 'node_modules/@js/Core/dist/org.tts.js.core.min.js'
}

let sources = {
	css: ['src/@style/material-icons.css', 'src/@style/font-awesome.css', 'src/@style/open-sans.css', 'src/@style/bootstrap.tts.scss', 'src/@style/tts-bootstrap.scss']
}
/*******************************************************************/

/********************************************************************
*** 
/*******************************************************************/
require('@js/Core')
const Fs = require('fs'), http = require('http'), https = require('https'), Path = require('path')
const beautify = require('beautify'), cheerio = require('cheerio'), csso = require('csso'), sass = require('sass'), uglify = require('uglify-es')

// Download external files
downloadUrls.Keys().forEach((key) => {Download(downloadUrls[key], Path.resolve('dist', key))})

// Copy assets
assets.Keys().forEach((distFile) => {Fs.copyFileSync(Path.resolve(assets[distFile]), Path.resolve('dist', distFile))})

BuildStyles(sources.css)

let loader = []
loader.push('(function() {')
loader.push('\t'+uglify.minify(Fs.readFileSync(Path.resolve('src/assets.js'), 'utf-8'),{compress:{booleans:false,join_vars:false,keep_classnames:true,keep_fnames:true,loops:false,dead_code:false,reduce_funcs:false,reduce_vars:false,sequences:false,typeofs:false},mangle:false,output:{quote_style:1}}).code)
loader.push('\t'+uglify.minify(Fs.readFileSync(Path.resolve('src/Loader.js'), 'utf-8'),{compress:{booleans:false,join_vars:false,keep_classnames:true,keep_fnames:true,loops:false,dead_code:false,reduce_funcs:false,reduce_vars:false,sequences:false,typeofs:false},mangle:false,output:{quote_style:1}}).code)
loader.push('}())')
Fs.writeFileSync(Path.resolve('dist/TTS.Loader.js'), loader.join('\n'), 'utf-8')


function BuildStyles (sources) {
	let _source = []

	sources.forEach((source) => {
		_source.push(Fs.readFileSync(Path.resolve(source), 'utf-8'))
	})

	sass.render({data: _source.join('\n')}, function(err, result) { 
		if (err) {throw err}
		let css = beautify(result.css.toString(), {format: 'css'})
		//Fs.writeFileSync(Path.resolve('dist/@style', 'org.tts.css'), css, 'utf-8')
		Fs.writeFileSync(Path.resolve('dist/@style', 'org.tts.css'), csso.minify(css).css, 'utf-8')
	})
} 



function Download (url, path) {
	try {Fs.mkdirSync(Path.dirname(path), {recursive: true})} catch(e) {}

	return new Promise((resolve, reject) => {
		let file = Fs.createWriteStream(path)
		file.on('close', () => {
			resolve()
		})
		let proto = url.startsWith('https') ? https : http
		proto.get(url, (res) => {
			res.pipe(file)
		}).on('error', reject)
	})
}


function Get (url, cb) {
	url = url.toString()

	let proto = url.startsWith('https') ? https : http
	proto.get(url, (response) => {
		response.setEncoding('utf8')
		let rawData = ''
		response.on('data',chunk=>{rawData+=chunk})
		response.on('end', () => {
			cb(false, cheerio.load(rawData))
		})
	}).on('error', cb)
}




