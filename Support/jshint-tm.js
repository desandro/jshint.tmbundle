
var fs = require('fs');
var path = require('path');
var env = process.env;
var jshint = require('./jshint.js').JSHINT;

var outputSrc = fs.readFileSync( `${__dirname}/output.html`, 'utf8');

function getRcFilePath() {
  var filePath = path.resolve( env.TM_FILEPATH, '../.jshintrc'  );

  // walk up directories, looking for .jshintrc
  var exists = fs.existsSync( filePath );
  while ( !exists && filePath != '/.jshintrc' ) {
    filePath = path.resolve( filePath, '../../.jshintrc' );
    exists = fs.existsSync( filePath );
  }

  return exists && filePath;
}

function getOptions( rcFilePath ) {
  var options;
  if ( rcFilePath ) {
    var jshintrcFile = fs.readFileSync( rcFilePath, 'utf8' );
    options = JSON.parse( jshintrcFile );
  }
  return options;
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
      var context = Object.assign( {}, error );
      // link to position in TextMate
      context.href = `txmt://open?url=file://${encodeURI( file )}` +
        `&line=${error.line}&column=${error.character}`;
      context.number = i + 1;

      errorsHTML += getErrorItemHTML( context );
    });
  }

  errorsHTML = errorsHTML || '<div class="no-error">No JSHint errors 😊</div>';

  outputSrc = outputSrc.replace( '{{errors}}', errorsHTML );
  var jshintrcHTML = getJshintrcHTML( outputSrc, rcFilePath, options, globals );
  outputSrc = outputSrc.replace( '{{jshintrc}}', jshintrcHTML );

  console.log( outputSrc );
  process.exit(205); //show_html

};


var errorItemTemplate = fs.readFileSync( `${__dirname}/error-item-template.mustache`, 'utf8' );
var reMustache = /\{\{(([^\}\}])+)\}\}/gi;

function getErrorItemHTML( context ) {
  var html = errorItemTemplate.replace( reMustache, function( match, inner ) {
    return context[ inner ];
  });
  return html;
}

function getJshintrcHTML( outputSrc, rcFilePath, options, globals ) {
  if ( !rcFilePath ) {
    return '';
  }

  if ( options ) {
    delete options.globals;
  }

  var html = `<table class="jshintrc">
       <tr><th>.jshintrc</th><td>${rcFilePath}</td></tr>
       <tr><th>Options</th><td>${prettyObjText( options )}</td></tr>`;
  if ( globals ) {
    html += `<tr><th>Globals</th><td>${prettyObjText( globals )}</td></tr>`;
  }
  html += '</table>';

  return html;
}

function prettyObjText( obj ) {
  var text = '';
  var isFirst = true;
  for ( var key in obj ) {
    text += isFirst ? '' : ', ';
    text += key + ': ' + obj[key];
    isFirst = false;
  }
  return text;
}
