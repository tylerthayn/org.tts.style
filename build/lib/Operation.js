require('@js/Core')

function Operation (name, defaults, fn) {
	if (Type(defaults, 'Function')) {
		fn = defaults
		defaults = {}
	}

	let Operation = {}
	Operation[name] = function () {
		return fn.apply({name: name, options: defaults}, arguments)
	}

	Define(Operation[name], 'name', {get: function () {return name}}, true)
	Define(Operation[name], 'options', {set: function (v) {Extend(defaults, v)}}, true)
	Define(Operation[name], 'Options', {get: function () {return defaults}}, true)
	return Operation[name]
}

module.exports = Operation

