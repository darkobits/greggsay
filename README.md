# greggsay

> Tell Gregg what to say.

Like [yosay](https://github.com/yeoman/yosay), but less yo.

![](https://cloud.githubusercontent.com/assets/441546/16679695/632fef94-449e-11e6-8956-1c5d9fd943df.png)


## Install

```
$ npm install --save https://github.com/darkobits/greggsay.git
```


## Usage

```js
const greggsay = require('greggsay');

console.log(greggsay('What does the Gregg say? Squee squee!'));

/*
    ____                       ____
   /    \  ___-----------___  /    \
  /     /--                 --\     \    ╭──────────────────────────╮
 /     /                       \     \   │ What does the Gregg say? │
/     /  /---\           /---\  \     \ /│       Squee squee!       │
\____/   | C |           | C |   \____/  ╰──────────────────────────╯
     |   \---/  _______  \---/   |
     |         /  ___  \         |
     |         |  \ /  |         |
     |_        | \_|_/ |        _|
    /  \        \_____/        /  \
    \   \--___           ___--/   /
     \   \    -----------    /   /
      \__/                   \__/
 */
```

*You can style your text with [chalk](https://github.com/sindresorhus/chalk) before passing it to `greggsay`.*


## CLI

```
$ npm install --global https://github.com/darkobits/greggsay.git
```

```
$ greggsay --help

  Usage
    greggsay <string>
    greggsay <string> --maxLength 8
    echo <string> | greggsay

  Example
    greggsay 'My spoon is too big!'

        ____                       ____
       /    \  ___-----------___  /    \
      /     /--                 --\     \
     /     /                       \     \   ╭────────────────────────────────╮
    /     /  /---\           /---\  \     \ /│      My spoon is too big!      │
    \____/   | C |           | C |   \____/  ╰────────────────────────────────╯
         |   \---/  _______  \---/   |
         |         /  ___  \         |
         |         |  \ /  |         |
         |_        | \_|_/ |        _|
        /  \        \_____/        /  \
        \   \--___           ___--/   /
         \   \    -----------    /   /
          \__/                   \__/
```


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
