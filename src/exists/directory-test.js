import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';

import * as exists from './exists.js';
import directoryExists from './directory.js';

suite('directory exists', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(exists, 'default');
  });

  teardown(() => sandbox.restore());

  test('that `true` is returned if the resolved stats describe a directory', async () => {
    const path = any.string();
    exists.default.withArgs(path).resolves({isDirectory: () => true});

    assert.isTrue(await directoryExists(path));
  });

  test('that `false` is returned if the resolved stats do not describe a directory', async () => {
    const path = any.string();
    exists.default.withArgs(path).resolves({isDirectory: () => false});

    assert.isFalse(await directoryExists(path));
  });

  test('that `false` is returned if the resolved stats are the `false` boolean', async () => {
    const path = any.string();
    exists.default.withArgs(path).resolves(false);

    assert.isFalse(await directoryExists(path));
  });
});
