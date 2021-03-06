'use strict';
var chalk = require('chalk');
var pad = require('pad-component');
var wrap = require('wrap-ansi');
var stringWidth = require('string-width');
var stripAnsi = require('strip-ansi');
var ansiStyles = require('ansi-styles');
var ansiRegex = require('ansi-regex')();
var repeating = require('repeating');
var cliBoxes = require('cli-boxes');

var border = cliBoxes.round;
var topOffset = 4;
var leftOffset = 42;

var defaultGreeting = [
  chalk.bold.yellow('     ____                       ____      '),
  chalk.bold.yellow('    /    \\  ___-----------___  /    \\     '),
  chalk.bold.yellow('   /     /--                 --\\     \\    '),
  chalk.bold.yellow('  /     /                       \\     \\   '),
  chalk.bold.yellow(' /     /') + '  /---\\           /---\\' + chalk.bold.yellow('  \\     \\') + ' /',
  chalk.bold.yellow(' \\____/') + '   |' + chalk.gray(' C ') + '|           |' + chalk.gray(' C ') + '|   ' + chalk.bold.yellow('\\____/  '),
  chalk.bold.yellow('      |') + '   \\---/' + chalk.bold.magenta('  _______  ') + '\\---/' + chalk.bold.yellow('   |       '),
  chalk.bold.yellow('      |') + chalk.bold.magenta('         / ') + chalk.bold.gray(' ___  ') + chalk.bold.magenta('\\') + chalk.bold.yellow('         |       '),
  chalk.bold.yellow('      |') + chalk.bold.magenta('         |') + chalk.bold.gray('  \\ /  ') + chalk.bold.magenta('|') + chalk.bold.yellow('         |       '),
  chalk.bold.yellow('      |_') + chalk.bold.magenta('        | \\_') + chalk.bold.gray('|') + chalk.bold.magenta('_/ |') + chalk.bold.yellow('        _|       '),
  chalk.bold.yellow('     /  \\') + chalk.bold.magenta('        \\_____/') + chalk.bold.yellow('        /  \\      '),
  chalk.bold.yellow('     \\   \\--___           ___--/   /      '),
  chalk.bold.yellow('      \\   \\    -----------    /   /       '),
  chalk.bold.yellow('       \\__/                   \\__/        ')
].join('\n');

// A total line with 45 characters consists of:
// 28 chars for the top frame of the speech bubble → `╭──────────────────────────╮`
// 17 chars for the yeoman character »column«      → `    /___A___\   /`
var TOTAL_CHARACTERS_PER_LINE = 28 + leftOffset;

// The speech bubble will overflow the Yeoman character if the message is too long.
var MAX_MESSAGE_LINES_BEFORE_OVERFLOW = 7;

module.exports = function (message, options) {
  message = (message || 'What does the Gregg say?\n' + chalk.magenta('Squee squee!')).trim();
  options = options || {};

  /*
   * What you're about to see may confuse you. And rightfully so. Here's an
   * explanation.
   *
   * When greggsay is given a string, we create a duplicate with the ansi
   * styling sucked out. This way, the true length of the string is read by
   * `pad` and `wrap`, so they can correctly do their job without getting
   * tripped up by the "invisible" ansi. Along with the duplicated, non-ansi
   * string, we store the character position of where the ansi was, so that when
   * we go back over each line that will be printed out in the message box, we
   * check the character position to see if it needs any styling, then re-insert
   * it if necessary.
   *
   * Better implementations welcome :)
   */

  var maxLength = 24;
  var frame;
  var styledIndexes = {};
  var completedString = '';
  var regExNewLine;

  if (options.maxLength) {
    maxLength = stripAnsi(message).toLowerCase().split(' ').sort()[0].length;

    if (maxLength < options.maxLength) {
      maxLength = options.maxLength;
    }
  }

  regExNewLine = new RegExp('\\s{' + maxLength + '}');

  var borderHorizontal = repeating(border.horizontal, maxLength + 2);

  frame = {
    top: border.topLeft + borderHorizontal + border.topRight,
    side: ansiStyles.reset.open + border.vertical + ansiStyles.reset.open,
    bottom: ansiStyles.reset.open + border.bottomLeft + borderHorizontal + border.bottomRight
  };

  message.replace(ansiRegex, function (match, offset) {
    Object.keys(styledIndexes).forEach(function (key) {
      offset -= styledIndexes[key].length;
    });

    styledIndexes[offset] = styledIndexes[offset] ? styledIndexes[offset] + match : match;
  });

  return wrap(stripAnsi(message), maxLength, {hard: true})
    .split(/\n/)
    .reduce(function (greeting, str, index, array) {
      var paddedString;

      if (!regExNewLine.test(str)) {
        str = str.trim();
      }

      completedString += str;

      str = completedString
        .substr(completedString.length - str.length)
        .replace(/./g, function (char, charIndex) {
          if (index > 0) {
            charIndex += completedString.length - str.length + index;
          }

          var hasContinuedStyle = 0;
          var continuedStyle;

          Object.keys(styledIndexes).forEach(function (offset) {
            if (charIndex > offset) {
              hasContinuedStyle++;
              continuedStyle = styledIndexes[offset];
            }

            if (hasContinuedStyle === 1 && charIndex < offset) {
              hasContinuedStyle++;
            }
          });

          if (styledIndexes[charIndex]) {
            return styledIndexes[charIndex] + char;
          } else if (hasContinuedStyle >= 2) {
            return continuedStyle + char;
          }

          return char;
        })
        .trim();

      paddedString = pad({
        length: stringWidth(str),
        valueOf: function () {
          return ansiStyles.reset.open + str + ansiStyles.reset.open;
        }
      }, maxLength);

      if (index === 0) {
        // Need to adjust the top position of the speech bubble depending on the
        // amount of lines of the message.
        if (array.length === 2) {
          topOffset -= 1;
        }

        if (array.length >= 3) {
          topOffset -= 2;
        }

        // The speech bubble will overflow the Yeoman character if the message
        // is too long. So we vertically center the bubble by adding empty lines
        // on top of the greeting.
        if (array.length > MAX_MESSAGE_LINES_BEFORE_OVERFLOW) {
          var emptyLines = Math.ceil((array.length - MAX_MESSAGE_LINES_BEFORE_OVERFLOW) / 2);

          for (var i = 0; i < emptyLines; i++) {
            greeting.unshift('');
          }

          frame.top = pad.left(frame.top, TOTAL_CHARACTERS_PER_LINE);
        }

        greeting[topOffset - 1] += frame.top;
      }

      greeting[index + topOffset] =
        (greeting[index + topOffset] || pad.left('', leftOffset)) +
        frame.side + ' ' + paddedString + ' ' + frame.side;

      if (array.length === index + 1) {
        greeting[index + topOffset + 1] =
          (greeting[index + topOffset + 1] || pad.left('', leftOffset)) +
          frame.bottom;
      }

      return greeting;
    }, defaultGreeting.split(/\n/))
    .join('\n') + '\n';
};
