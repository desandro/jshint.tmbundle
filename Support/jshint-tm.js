
'use strict';

var fs = require('fs');
var path = require('path');
var env = process.env || process.ENV;
var jshint = require('./jshint.js').JSHINT;
var entities = {
  '&': '&amp;',
  '"': '&quot;',
  '<': '&lt;',
  '>': '&gt;'
};

function html(s) {
  return (s || '').replace(/[&"<>]/g, function(c) {return entities[c] || c;});
}

var existsSync = fs.existsSync || path.existsSync;

function getRcFilePath() {
  var filePath = path.resolve( env.TM_FILEPATH, '../.jshintrc'  );

  // walk up directories, looking for .jshintrc
  var exists = existsSync( filePath );
  while ( !exists && filePath !== '/.jshintrc' ) {
    filePath = path.resolve( filePath, '../../.jshintrc' );
    exists = existsSync( filePath );
  }

  return exists && filePath;
}

module.exports = function(options) {

  var body = '';

  var rcFilePath = getRcFilePath();

  if ( rcFilePath ) {
    body += '<div class="rc">Using options from ' + rcFilePath + '</div>';
    var jshintrcFile = fs.readFileSync( rcFilePath, 'utf8' );
    options = JSON.parse( jshintrcFile );
  }

  var file = env.TM_FILEPATH;
  var input = fs.readFileSync(file, 'utf8');

  //remove shebang
  input = input.replace(/^\#\!.*/, '');

  if (!jshint(input, options)) {
    jshint.errors.forEach(function(e, i) {
      if (e) {
        var link = 'txmt://open?url=file://' + encodeURI(file) + '&line=' + e.line + '&column=' + e.character;
        body += ('<a class="txmt" href="' + link + '" id="e' + (i+1) + '">');
        if (i < 9) {
          body += '<b>'+(i+1)+'</b>';
        }
        body += e.reason;
        if (e.evidence && !isNaN(e.character)) {
          body += '<tt>';
          body += html(e.evidence.substring(0, e.character-1));
          body += '<em>';
          body += (e.character <= e.evidence.length) ? html(e.evidence.substring(e.character-1, e.character)) : '&nbsp;';
          body += '</em>';
          body += html(e.evidence.substring(e.character));
          body += '</tt>';
        }
        body += '</a>';
      }
    });
  }


  if (body.length > 0) {
    fs.readFile(__dirname + '/output.html', 'utf8', function(e, html) {
      console.log(html.replace('{body}', body));
      process.exit(205); //show_html
    });
  }

};
