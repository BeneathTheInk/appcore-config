var minimist = require("minimist");
var  extend = require("extend-object");
var resolve = require("path").resolve;
var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function(options) {
	options = extend({
		process: process,
		cli: {},
		env: {}
	}, options);

	return function() {
		var k, val;

		// set options from environment vars
		if (options.env) {
			for (k in options.process.env) {
				if (!hasOwn.call(options.process.env, k)) continue;
				val = options.process.env[k];

				if (typeof options.env === "function") {
					k = options.env(k);
				} else if (typeof options.env === "object") {
					if (options.env[k]) k = options.env[k];
				}

				if (k) this.set(k, val);
			}
		}

		// set options from the cli
		if (options.cli) this.set(minimist(options.process.argv.slice(2), options.cli));

		// extract from files the user has specified
		if (options.files || options.filesKey) {
			[].concat(options.files)
			.concat(options.filesKey ? this.get(options.filesKey) : null)
			.filter(Boolean)
			.forEach(function(c) {
				try { this.set(require(resolve(options.process.cwd(), c))); }
				catch(e) {}
			}, this);
		}
	};
};
