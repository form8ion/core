import {describe, it, expect} from 'vitest';
import any from '@travi/any';
import zip from 'lodash.zip';

import mapOptionsToChoices from './options-to-choices-mapper.js';

describe('options to choices mapper', () => {
  it('should map the options to the shape inquirer expects for choices', async () => {
    const keys = any.listOf(any.word);
    const descriptions = keys.map(() => any.string());

    expect(mapOptionsToChoices(Object.fromEntries(zip(keys, descriptions))))
      .toEqual(keys.map((key, index) => ({name: descriptions[index], value: key})));
  });
});
