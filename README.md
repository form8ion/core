# core

core logic for [form8ion](https://github.com/form8ion/) tools

<!--status-badges start -->

[![Codecov][coverage-badge]][coverage-link]
[![Node CI Workflow Status][github-actions-ci-badge]][github-actions-ci-link]
![SLSA Level 2][slsa-badge]

<!--status-badges end -->

## Table of Contents

* [Usage](#usage)
  * [Installation](#installation)
  * [Example](#example)
  * [API](#api)
    * [`fileExists`](#fileexists)
    * [`directoryExists`](#directoryexists)
    * [`validateOptions`](#validateoptions)
      * [`schema` (_required_)](#schema-required)
      * [`options` (_required_)](#options-required)
    * [`applyEnhancers`](#applyenhancers)
      * [`results` __object__ (_required_)](#results-object-required)
      * [`enhancers` __array__ (_required_)](#enhancers-array-required)
      * [`options` __object__ (_required_)](#options-object-required)
    * [`writeConfigFile`](#writeconfigfile)
      * [`path` __string__ (_required_)](#path-string-required)
      * [`name` __string__ (_required_)](#name-string-required)
      * [`config` __object__ (_required_)](#config-object-required)
      * [`format` __string__ (_required_)](#format-string-required)
  * [Constants](#constants)
    * [`fileTypes`](#filetypes)
* [Contributing](#contributing)
  * [Dependencies](#dependencies)
  * [Verification](#verification)

## Usage

<!--consumer-badges start -->

[![MIT license][license-badge]][license-link]
[![npm][npm-badge]][npm-link]
[![Try @form8ion/core on RunKit][runkit-badge]][runkit-link]
![node][node-badge]

<!--consumer-badges end -->

### Installation

```sh
$ npm install @form8ion/core --save-prod
```

### Example

```javascript
import {directoryExists, fileExists} from '@form8ion/core';

(async () => {
  await fileExists('path/to/some/expected/file');
  await directoryExists('path/to/some/expected/directory');
})();
```

### API

#### `fileExists`

wrapper around [`fs.promises.stat()`](https://nodejs.org/api/fs.html#fs_fspromises_stat_path_options)
to determine whether a file exists at a given path.

#### `directoryExists`

wrapper around [`fs.promises.stat()`](https://nodejs.org/api/fs.html#fs_fspromises_stat_path_options)
to determine whether a directory exists at a given path.

#### `validateOptions`

Validates provided options against a [joi](https://joi.dev/) schema.

##### `schema` (_required_)

[joi](https://joi.dev/) schema

##### `options` (_required_)

options to compare to the provided schema

#### `applyEnhancers`

Processes scaffolding results by applying a list of enhancers (lifters) as a
chain, returning the enhanced results.
Each enhancer is applied conditionally, based on the results of the predicate
supplied with each enhancer.

Takes a single options object as an argument, containing:

##### `results` __object__ (_required_)

Result object from scaffolder execution

##### `enhancers` __array__ (_required_)

List of plugins with `lift` and `test` properties for processing the provided
`results`.
The `test` property is a predicate that determines if the enhancer is
applicable to the current project.
The `lift` property processes the `results` if the `test` predicate returns
`true`.

##### `options` __object__ (_required_)

Options to be provided to the `test` and `lift` functions of each enhancer.

#### `writeConfigFile`

Writes a config file to the file system in the chosen format

Takes a single options object as an argument, containing:

##### `path` __string__ (_required_)

Path to the folder (without a trailing slash) that will contain the file to be
written

##### `name` __string__ (_required_)

Name of the file (without an extension)

##### `config` __object__ (_required_)

The config details to be written to the file

##### `format` __string__ (_required_)

The format for the config file to be written in. The formats from the
[`fileTypes` constants](#filetypes) that are currently supported include
`fileTypes.JSON` and `fileTypes.YAML`.

An error is thrown for unsupported formats.

### Constants

#### `fileTypes`

Constants defined to describe file types used in various form8ion tools

## Contributing

<!--contribution-badges start -->

[![PRs Welcome][PRs-badge]][PRs-link]
[![Conventional Commits][commit-convention-badge]][commit-convention-link]
[![Commitizen friendly][commitizen-badge]][commitizen-link]
[![semantic-release][semantic-release-badge]][semantic-release-link]
[![Renovate][renovate-badge]][renovate-link]

<!--contribution-badges end -->

### Dependencies

```sh
$ nvm install
$ npm install
```

### Verification

```sh
$ npm test
```

[PRs-link]: http://makeapullrequest.com

[PRs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

[commit-convention-link]: https://conventionalcommits.org

[commit-convention-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg

[commitizen-link]: http://commitizen.github.io/cz-cli/

[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg

[semantic-release-link]: https://github.com/semantic-release/semantic-release

[semantic-release-badge]: https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release

[renovate-link]: https://renovatebot.com

[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=renovatebot

[coverage-link]: https://codecov.io/github/form8ion/core

[coverage-badge]: https://img.shields.io/codecov/c/github/form8ion/core.svg

[license-link]: LICENSE

[license-badge]: https://img.shields.io/github/license/form8ion/core.svg

[npm-link]: https://www.npmjs.com/package/@form8ion/core

[npm-badge]: https://img.shields.io/npm/v/@form8ion/core.svg

[runkit-link]: https://npm.runkit.com/@form8ion/core

[runkit-badge]: https://badge.runkitcdn.com/@form8ion/core.svg

[github-actions-ci-link]: https://github.com/form8ion/core/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster

[github-actions-ci-badge]: https://github.com/form8ion/core/workflows/Node.js%20CI/badge.svg

[node-badge]: https://img.shields.io/node/v/@form8ion/core?logo=node.js

[slsa-badge]: https://slsa.dev/images/gh-badge-level2.svg
