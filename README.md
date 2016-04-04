# pwr

> Save power by quitting apps at low battery

Lol this name thooo...needs work

## Installation

Rn, there's no release so just clone the repo and install dependencies:

```
$ git clone https://github.com/ajay-gandhi/pwr.git
$ cd pwr/
$ npm install
```

Make sure you have `electron-prebuilt` installed from the NPM repository, then:

```
$ electron .
```

## TODO

* Quit apps by full path rather than name, maybe
* Probably want to add the option of multiple thresholds, e.g. close W at X% and
  Y at Z%.
* Finish right side styling, I'm thinking make the selection smaller. Both
  buttons should remain far from each other to prevent accidental clicking.
