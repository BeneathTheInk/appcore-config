var test = require("tape");
var Appcore = require("@beneaththeink/appcore");
var config = require("./");

test("parses cli", function(t) {
	t.plan(2);
	var app = Appcore();
	app.use(config({
		process: {
			argv: process.argv.concat([ "--foo", "bar" ]),
			env: {}
		}
	}));
	t.equal(app.get("foo"), "bar", "has cli option");
	t.deepEqual(app.get("_"), [], "has cli values");
});

test("copies process.env keys, with aliases", function(t) {
	t.plan(3);

	var app = Appcore();
	app.use(config({
		env: { bar: "foo" },
		process: {
			argv: process.argv.slice(0),
			env: {
				bar: "test",
				hello: "world"
			}
		}
	}));

	t.equal(app.get("foo"), "test", "set the alias key");
	t.equal(app.get("bar"), void 0, "did not set original key");
	t.equal(app.get("hello"), "world", "has other env keys");
});

test("accepts env key function", function(t) {
	t.plan(2);

	var app = Appcore();

	app.use(config({
		env: function(key) {
			t.equal(key, "foo", "passed the key through");
			return false;
		},
		process: {
			argv: process.argv.slice(0),
			env: { foo: "bar" }
		}
	}));

	t.equal(app.get("foo"), void 0, "did not set env key");
});

test("uses key return from env key function", function(t) {
	t.plan(3);

	var app = Appcore();

	app.use(config({
		env: function(key) {
			t.equal(key, "foo", "passed the key through");
			return "bar";
		},
		process: {
			argv: process.argv.slice(0),
			env: { foo: "test" }
		}
	}));

	t.equal(app.get("foo"), void 0, "did not set original key");
	t.equal(app.get("bar"), "test", "set alias key");
});

test("loads config files", function(t) {
	t.plan(1);

	var app = Appcore();
	var pkg = require("./package.json");

	app.use(config({
		process: {
			argv: process.argv.slice(0),
			env: {},
			cwd: function() { return __dirname; }
		},
		files: [ "./package.json" ]
	}));

	var o = {};
	Object.keys(pkg).forEach(function(k) {
		o[k] = app.get(k);
	});

	t.deepEqual(o, pkg, "has all the data in the config");
});

test("loads user specified config files", function(t) {
	t.plan(1);

	var app = Appcore();
	var pkg = require("./package.json");

	app.use(config({
		process: {
			argv: process.argv.concat("--config", "package.json"),
			env: {},
			cwd: function() { return __dirname; }
		},
		filesKey: "config"
	}));

	var o = {};
	Object.keys(pkg).forEach(function(k) {
		o[k] = app.get(k);
	});

	t.deepEqual(o, pkg, "has all the data in the config");
});
