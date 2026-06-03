import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import validateOptions from '../options-validator.js';
import pluginSchema from './form8ion-plugin.js';

describe('form8ion plugin schema', () => {
  it('should require options to be provided', async () => {
    expect(() => validateOptions(pluginSchema)).toThrow('"value" is required');
  });

  it('should require scaffold to be a function', () => {
    expect(() => validateOptions(pluginSchema, {scaffold: any.word()}))
      .toThrow('"scaffold" must be of type function');
  });

  it('should require the `scaffold` function to take an options object', () => {
    expect(() => validateOptions(pluginSchema, {scaffold: () => undefined}))
      .toThrow('"scaffold" must have an arity greater or equal to 1');
  });

  it('should be valid when `scaffold` is provided with an options object', () => {
    const plugin = {scaffold: options => options};

    expect(validateOptions(pluginSchema, plugin)).toEqual(plugin);
  });

  it('should allow `scaffold` to take a dependencies object', () => {
    const plugin = {scaffold: (options, dependencies) => ([options, dependencies])};

    expect(validateOptions(pluginSchema, plugin)).toEqual(plugin);
  });

  it('should allow a plugin to include a `lift` function', () => {
    const plugin = {
      scaffold: options => options,
      lift: options => options
    };

    expect(validateOptions(pluginSchema, plugin)).toEqual(plugin);
  });

  it('should require `lift` to be a function', () => {
    expect(() => validateOptions(pluginSchema, {scaffold: options => options, lift: any.word()}))
      .toThrow('"lift" must be of type function');
  });

  it('should require the `lift` function to take an options object', () => {
    expect(() => validateOptions(pluginSchema, {scaffold: options => options, lift: () => undefined}))
      .toThrow('"lift" must have an arity greater or equal to 1');
  });

  it('should allow the `lift` function to take a dependencies object', () => {
    const plugin = {scaffold: options => options, lift: (options, dependencies) => ([options, dependencies])};

    expect(validateOptions(pluginSchema, plugin)).toEqual(plugin);
  });

  it('should allow a plugin to include a `test` function', () => {
    const plugin = {
      scaffold: options => options,
      test: options => options
    };

    expect(validateOptions(pluginSchema, plugin)).toEqual(plugin);
  });

  it('should require `test` to be a function', () => {
    expect(() => validateOptions(pluginSchema, {scaffold: options => options, test: any.word()}))
      .toThrow('"test" must be of type function');
  });

  it('should require the `test` function to take an options object', () => {
    expect(() => validateOptions(pluginSchema, {scaffold: options => options, test: () => undefined}))
      .toThrow('"test" must have an arity greater or equal to 1');
  });

  it('should allow additional properties', async () => {
    const plugin = {
      scaffold: options => options,
      [any.word()]: any.word()
    };

    expect(validateOptions(pluginSchema, plugin)).toEqual(plugin);
  });
});
