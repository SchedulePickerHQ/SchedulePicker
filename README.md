# SchedulePicker3

<div align="center">
    <img src="https://github.com/SchedulePicker/SchedulePicker3/blob/main/static/icons/logo_128.png" alt="SchedulePicker" width="96" height="96" />
  </a>
</div>

<div align="center">
  <img alt="ci" src="https://github.com/SchedulePicker/SchedulePicker3/actions/workflows/ci.yml/badge.svg"/>
  <a href="https://github.com/SchedulePicker/SchedulePicker3/blob/main/LICENSE">
    <img alt="GitHub license" src="https://img.shields.io/github/license/SchedulePicker/SchedulePicker3">
  </a>
</div>

SchedulePicker is browser extension what can easily insert schedule events of the Garoon to a textarea. Please read [wiki](https://github.com/SchedulePicker/SchedulePicker3/wiki) if you want to know it usage.

## Getting Started

```
cd SchedulePicker3
npm install
npm run watch:(chrome|firefox)
```

## Development scripts

#### `npm run build`

> It generate package of this extensions.

- `npm run build:chrome` - package is generated to `dist/chrome`.
- `npm run build:firefox` - package is generated to `dist/firefox`.

#### `npm run watch`

> Runtime detection of code changes.

- `npm run watch:chrome` - script for chrome.
- `npm run watch:firefox` - script for firefox.

#### `npm run lint`

> Boolean check if code conforms to linting rules - uses xo

#### `npm run test`

> Boolean check if unit tests all pass - uses jest

- `npm run test -- --watch` - will run core tests in watch-mode

#### `npm run pack`

> Generate a zip file for distribution

## LICENSE

[MIT](LICENSE)

## Disclaimer

This OSS is my own personal work and does not have any relationship with Cybozu, Inc. or any other organization which I belong to.
