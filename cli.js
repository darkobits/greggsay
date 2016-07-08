#!/usr/bin/env node
'use strict';
var pkg = require('./package.json');
var greggsay = require('./');

require('taketalk')({
  init: function (input, options) {
    console.log(greggsay(input, options));
  },
  help: function () {
    console.log([
      '',
      '  ' + pkg.description,
      '',
      '  Usage',
      '    greggsay <string>',
      '    greggsay <string> --maxLength 8',
      '    echo <string> | greggsay',
      '',
      '  Example',
      '    greggsay "I like turtles."',
      greggsay('I like turtles.')
    ].join('\n'));
  },
  version: pkg.version
});
