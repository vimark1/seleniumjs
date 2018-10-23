# seleniumjs

Transforms Selenium IDE test output into javascript tests and more.

[![Build Status](https://travis-ci.com/vimark1/seleniumjs.svg?branch=master)](https://travis-ci.com/vimark1/seleniumjs) [![Greenkeeper badge](https://badges.greenkeeper.io/vimark1/seleniumjs.svg)](https://greenkeeper.io/)

## Features

## Documentation

A set of helpers for working with selenium IDE output.

The goal of this project is to be able to compile code from one format to
another.

In the compilation process there are 3 main building blocks that is used through
out:

1. Parsers
2. Transformers
3. Wrappers

## Parsers

A parser can handle input and extract information from them in order to
transform this data.

A parser will always deal with the input from a consumer of this library, this
could be a user or another library.  The input is usually a `String`.

The core parsers are: `html`, `json` and `markdown`

The output of a parser is always passed on to a transformer, because the output
of a parser does not generate any useful information to the end user.

## Transformers

This set of functions take the result from the parsing step and transforms it
into something new.

A transformer will **always** work with an output from a parser, without a
parser a transformer will not know how to deal with its data.

In this step is where we perform things like converting `open` command from
selenium IDE into the `visit` command of zombie for example.

The core transformers are: `zombie`, `markdown`

A transformer can also output code at this stage.  For example, we 

## Wrappers

A wrapper will wrap the code that is produced by the transformer and it will
produce the last step of the whole compilation process.

A common use-case for wrappers are the testing framework chosen.

The core wrappers are: `mocha` and `jasmine-node`

# Development

This project uses `npm scripts`.

## Testing

To run the tests for this project:

    npm run test:unit

Or in watch mode:

    npm run test:unit -- -w

We also have some generated tests, these can be called integration test and is
mostly intended to run on CI.

    npm test

## Contributing

Contributions welcome; Please submit all pull requests the against master
branch. If your pull request contains JavaScript patches or features, you should
include relevant unit tests. Thanks!

## License

 - **MIT** : http://opensource.org/licenses/MIT
