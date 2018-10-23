# BSLanding

BlockSettle's Landing pages static site generator.

## Usage

First, install [Yarn](https://yarnpkg.com/lang/en/docs/install/) package manager.

Then install **npm** dependencies with command:

```sh
yarn install --frozen-lockfile # if it fails, you can retry without `--frozen-lockfile` option
```

Then, to start local dev server, type:

```sh
yarn start
```

...and open http://0.0.0.0:8084 in your browser.

## Build

To build whole project into webserver-ready folder (like Nginx or Apache) run command:

```
yarn build
```

## Codestyle

For JS files we used [Semistandard](https://github.com/Flet/semistandard) rules set.


## Contributors

- Vasiliy Telyatnikov <vtelyatnikov@axmit.com>
- Andrey Cherepanov <acherepanov@axmit.com>
