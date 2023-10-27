import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import * as exists from './exists.js';
import fileExists from './file-exists.js';

suite('file exists', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(exists, 'default');
  });

  teardown(() => sandbox.restore());

  test('that `true` is returned if the resolved stats describe a file', async () => {
    const path = any.string();
    exists.default.withArgs(path).resolves({isFile: () => true});

    assert.isTrue(await fileExists(path));
  });

  test('that `false` is returned if the resolved stats do not describe a file', async () => {
    const path = any.string();
    exists.default.withArgs(path).resolves({isFile: () => false});

    assert.isFalse(await fileExists(path));
  });

  test('that `false` is returned if the resolved stats are the `false` boolean', async () => {
    const path = any.string();
    exists.default.withArgs(path).resolves(false);

    assert.isFalse(await fileExists(path));
  });
});
