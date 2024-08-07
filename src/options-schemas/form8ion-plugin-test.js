import {assert} from 'chai';
import any from '@travi/any';

import validateOptions from '../options-validator.js';
import pluginSchema from './form8ion-plugin.js';

suite('form8ion plugin schema', () => {
  test('that options are required', async () => {
    assert.throws(() => validateOptions(pluginSchema), '"value" is required');
  });

  test('that scaffold is required', () => {
    assert.throws(() => validateOptions(pluginSchema, {}), '"scaffold" is required');
  });

  test('that scaffold is required to be a function', () => {
    assert.throws(() => validateOptions(pluginSchema, {scaffold: any.word()}), '"scaffold" must be of type function');
  });

  test('that the `scaffold` function is required to take an options object', () => {
    assert.throws(
      () => validateOptions(pluginSchema, {scaffold: () => undefined}),
      '"scaffold" must have an arity greater or equal to 1'
    );
  });

  test('that `scaffold` is considered valid if an options object is provided', () => {
    const plugin = {scaffold: options => options};

    assert.deepEqual(validateOptions(pluginSchema, plugin), plugin);
  });

  test('that `scaffold` can take a dependencies object', () => {
    const plugin = {scaffold: (options, dependencies) => ([options, dependencies])};

    assert.deepEqual(validateOptions(pluginSchema, plugin), plugin);
  });

  test('that a plugin can include a `lift` function', () => {
    const plugin = {
      scaffold: options => options,
      lift: options => options
    };

    assert.deepEqual(
      validateOptions(pluginSchema, plugin),
      plugin
    );
  });

  test('that `lift` must be a function', () => {
    assert.throws(
      () => validateOptions(pluginSchema, {scaffold: options => options, lift: any.word()}),
      '"lift" must be of type function'
    );
  });

  test('that the `lift` function must take an options object', () => {
    assert.throws(
      () => validateOptions(pluginSchema, {scaffold: options => options, lift: () => undefined}),
      '"lift" must have an arity greater or equal to 1'
    );
  });

  test('that the `lift` function can take a dependencies object', () => {
    const plugin = {scaffold: options => options, lift: (options, dependencies) => ([options, dependencies])};

    assert.deepEqual(validateOptions(pluginSchema, plugin), plugin);
  });

  test('that a plugin can include a `test` function', () => {
    const plugin = {
      scaffold: options => options,
      test: options => options
    };

    assert.deepEqual(
      validateOptions(pluginSchema, plugin),
      plugin
    );
  });

  test('that `test` must be a function', () => {
    assert.throws(
      () => validateOptions(pluginSchema, {scaffold: options => options, test: any.word()}),
      '"test" must be of type function'
    );
  });

  test('that the `test` function must take an options object', () => {
    assert.throws(
      () => validateOptions(pluginSchema, {scaffold: options => options, test: () => undefined}),
      '"test" must have an arity of 1'
    );
  });

  test('that additional properties are allowed', async () => {
    const plugin = {
      scaffold: options => options,
      [any.word()]: any.word()
    };

    assert.deepEqual(
      validateOptions(pluginSchema, plugin),
      plugin
    );
  });
});
