# Appcore Config

Pulls configuration into an Appcore instance from the environment, the CLI and the file system.

```js
app.use(require("@beneaththeink/appcore-config")({
	files: [ __dirname + "config.json" ]
}));
```
