import {assert} from 'chai';

import {visibilityChoices, visibilityOptions} from './visibility-options.js';

suite('visibility options', () => {
  test('that user-facing choices map to expected saved values', () => {
    assert.deepEqual(visibilityChoices, [
      {name: 'Open Source', value: 'OSS'},
      {name: 'Inner Source', value: 'ISS'},
      {name: 'Closed Source', value: 'CS'}
    ]);
  });

  test('that visibility options are derived from the defined choices', () => {
    assert.deepEqual(visibilityOptions, ['OSS', 'ISS', 'CS']);
    assert.deepEqual(visibilityOptions, visibilityChoices.map(({value}) => value));
  });
});
