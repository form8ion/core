import {resolve} from 'path';
import {promises as fs} from 'fs';
import {load} from 'js-yaml';
// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import {writeConfigFile} from '@form8ion/core';

import {After, Before, Given, Then, When} from '@cucumber/cucumber';
import {assert} from 'chai';
import stubbedFs from 'mock-fs';
import any from '@travi/any';

import {fileTypeExtensions, fileTypes} from '../../../../src/file-types.js';

const pathToProjectRoot = [__dirname, '..', '..', '..', '..'];
const pathToNodeModules = [...pathToProjectRoot, 'node_modules'];
const stubbedNodeModules = stubbedFs.load(resolve(...pathToNodeModules));

function parseConfigFileContent(fileContents, format) {
  if (fileTypes.JSON === format) return JSON.parse(fileContents);
  if (fileTypes.YAML === format) return load(fileContents);

  throw new Error('desired file format is unsupported, so not parsing');
}

Before(function () {
  stubbedFs({
    node_modules: stubbedNodeModules
  });
});

After(function () {
  stubbedFs.restore();
});

Given('the desired config file format is {string}', async function (format) {
  this.desiredConfigFileFormat = format;
});

When('the config file is written', async function () {
  this.config = any.simpleObject();
  this.configName = any.word();

  await writeConfigFile({
    format: this.desiredConfigFileFormat,
    config: this.config,
    path: process.cwd(),
    name: this.configName
  });
});

Then('the config is defined in the file', async function () {
  const {desiredConfigFileFormat} = this;
  const fileContents = await fs.readFile(
    `${process.cwd()}/${this.configName}.${fileTypeExtensions[desiredConfigFileFormat]}`,
    'utf-8'
  );
  const config = parseConfigFileContent(fileContents, desiredConfigFileFormat);

  assert.equal(fileContents.slice(-1), '\n');
  assert.deepEqual(config, this.config);
});
