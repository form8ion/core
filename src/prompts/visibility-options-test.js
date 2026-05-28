import {assert} from 'chai';

import {visibilityOptions} from './visibility-options.js';

suite('visibility options', () => {
  test('that the abbreviations map to descriptions', () => {
    assert.equal(visibilityOptions.OSS, 'Open Source');
    assert.equal(visibilityOptions.ISS, 'Inner Source');
    assert.equal(visibilityOptions.CS, 'Closed Source');
  });
});
