# JSHint TextMate Bundle

TextMate bundle for [JSHint](https://jshint.com/), the (Gentler) JavaScript Code Quality Tool.

![jshint.tmbundle screenshot](https://user-images.githubusercontent.com/85566/55125934-c9804080-50e1-11e9-84f8-9ebe0d40daaf.png)

## Installation

Download the [zip file](https://github.com/desandro/jshint.tmbundle/archive/master.zip), un-zip, and rename the extracted folder to `jshint.tmbundle`. Double-click to install the bundle.

You need [Node.js](https://nodejs.org/) installed.

This bundle uses `#!/bin/env node` to launch the node process. If you get a **env: node: No such file or directory** or **node - not found** error, the `PATH` variable is probably not setup in TextMate.

In Terminal, enter `echo $PATH`. You'll see a string of file paths. One will likely be pointing to a `bin` path with `node/`. For example, if you're using [nvm](https://github.com/creationix/nvm), it will look like:

```
/Users/username/.nvm/versions/node/v10.15.3/bin
```

Copy this path. Open TextMate's **Preferences**. Select **Variables**. Enable **PATH**. Edit the Value for **PATH** by double clicking it. Add the node `bin` path to the paths, separated by a colon.

``` 
$PATH:/opt/local/bin:/usr/local/bin:/usr/texbin:/Users/username/.nvm/versions/node/v10.15.3/bin
```

Hit Enter to confirm your changes. If all is well, you'll see the hint window appear with **⌘K**.

## .jshintrc

For project-wide options, you can save a `.jshintrc` file. The bundle will crawl up your directory tree and use the first `.jshintrc` it finds as its options.
