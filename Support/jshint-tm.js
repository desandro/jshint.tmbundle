
var fs = require('fs');
var path = require('path');
var env = process.env;
var jshint = require('./jshint.js').JSHINT;

var outputSrc = fs.readFileSync( __dirname + '/output.html', 'utf8');

function getRcFilePath() {
  var filePath = path.resolve( env.TM_FILEPATH, '../.jshintrc'  );

  // walk up directories, looking for .jshintrc
  var exists = fs.existsSync( filePath );
  while ( !exists && filePath !== '/.jshintrc' ) {
    filePath = path.resolve( filePath, '../../.jshintrc' );
    exists = fs.existsSync( filePath );
  }

  return exists && filePath;
}

function getOptions( rcFilePath ) {
  var options;
  if ( rcFilePath ) {
    // body += '<div class="rc">Using options from ' + rcFilePath + '</div>';
    var jshintrcFile = fs.readFileSync( rcFilePath, 'utf8' );
    options = JSON.parse( jshintrcFile );
  }
  return options;
}

function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

module.exports = function() {

  var file = env.TM_FILEPATH;
  var input = fs.readFileSync( file, 'utf8' );
  // remove shebang
  input = input.replace(/^\#\!.*/, '');

  // get options from .jshintrc
  var rcFilePath = getRcFilePath();
  var options = getOptions( rcFilePath );
  var globals = options && options.globals;

  var errorsHTML = '';

  if ( !jshint( input, options, globals ) ) {
    jshint.errors.forEach( function( error, i ) {
      if ( !error ) {
        return;
      }
      var context = extend( {}, error );
      // link to position in TextMate
      context.href = 'txmt://open?url=file://' + encodeURI( file ) +
        '&line=' + error.line + '&column=' + error.character;
      context.number = i + 1;

      errorsHTML += getErrorItemHTML( context );
    });
  }

  errorsHTML = errorsHTML || 'No JSHint errors :)';
  if ( options ) {
    delete options.globals;
  }
  outputSrc = outputSrc.replace( '{{errors}}', errorsHTML )
    .replace( '{{jshintrc}}', rcFilePath || 'no .jshintrc' )
    .replace( '{{options}}', JSON.stringify( options ) )
    .replace( '{{globals}}', JSON.stringify( globals ) );

  console.log( outputSrc );
  process.exit(205); //show_html

};


var errorItemTemplate = fs.readFileSync( __dirname + '/error-item-template.mustache', 'utf8' );
var reMustache = /\{\{(([^\}\}])+)\}\}/gi;

function getErrorItemHTML( context ) {
  var html = errorItemTemplate.replace( reMustache, function( match, inner ) {
    return context[ inner ];
  });
  return html;
}
