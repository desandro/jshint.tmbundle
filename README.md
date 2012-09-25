# JSHint TextMate Bundle

TextMate bundle for [JSHint](http://jshint.com/), the (Gentler) JavaScript Code Quality Tool.

![Screenshot](https://github.com/downloads/fgnass/fgnass.github.com/jslint.png)

Features:

* Pretty UI
* Hint with ⌘K
* Auto-updates itself to the latest version of JSHint
* use options from `.jshintrc`
* Based on Node.js

## Installation

Download the [zip file](http://github.com/desandro/jshint.tmbundle/zipball/master) and rename the
extracted folder to `jshint.tmbundle`. Double-click.

## Prerequisites

You need [Node.js](http://nodejs.org/) and TextMate, that's all.

If you don't have Node.js installed on your system you can also use [Pierre Bertet's fork](https://github.com/bpierre/jshint.tmbundle) which uses [WebKit's JavaScriptCore](http://trac.webkit.org/wiki/JSC) instead.

This bundle uses `#!/bin/env node` to launch the node process. If you get a *node - not found* error,the `PATH` variable is probably not setup in TextMate (this happens when you start TextMate via the Finder rather than from the command-line).

You can set the PATH either via Preferences → Advanced → Shell Variables or by editing `~/.MacOSX/environment.plist`.

## .jshintrc

For project-wide options, you can save a `.jshintrc` file. The bundle will crawl up your directory tree and use the first `.jshintrc` it finds as its options.
