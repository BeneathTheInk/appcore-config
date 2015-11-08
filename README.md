# Appcore Config

Pulls configuration into an [Appcore](http://ghub.io/appcore) instance from the environment, the CLI and the file system.

```js
process.env.CAKE = "yum!";

var app = Appcore();

app.use(require("@beneaththeink/appcore-config")({
	env: { CAKE: "foods.cake" }
}));

app.use(function() {
	console.log(this.get("foods.cake"));
});
```

Available options:

- __`files`__ - List of files to import as configuration. Currently accepted file types are [HJSON](http://hjson.org/), JavaScript and YAML.
- __`filesKey`__ - A key in the Appcore instance's options that will be merged with the files list. Useful if wanting to allow the end user to specify a config file.
- __`cli`__ - [Minimist](http://ghub.io/minimist) options for parsing the CLI. Set to `false` to disable CLI parsing.
- __`env`__ - An object of `process.env` properties mapped to Appcore option keys.
