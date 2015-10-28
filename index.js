var minimist = require("minimist");
var extend = require("extend-object");
var path = require("path");
var hasOwn = Object.prototype.hasOwnProperty;
var fs = require("fs");
var HJSON = require("hjson");
var yaml = require("js-yaml");

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
		if (fs.statSync && (options.files || options.filesKey)) {
			[].concat(options.files)
			.concat(options.filesKey ? this.get(options.filesKey) : null)
			.filter(Boolean)
			.forEach(function(c) {
				var f = path.resolve(options.process.cwd(), c);
				var ext = path.extname(f);
				var read = fs.readFileSync.bind(fs, f, { encoding: "utf-8" });
				var stat, data;

				try { stat = fs.statSync(f); }
				catch(e) {}

				if (stat && stat.isFile()) {
					switch(ext) {
					case ".js":
						data = require(f);
						break;
					case ".hjson":
					case ".json":
						data = HJSON.parse(read());
						break;
					case ".yml":
					case ".yaml":
						data = yaml.safeLoad(read());
						break;
					}
				}

				if (data) this.set(data);
			}, this);
		}
	};
};
