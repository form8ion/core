import {promises as fs} from 'fs';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import exists from './exists';

suite('exists', () => {
  let sandbox;
  const path = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'stat');
  });

  teardown(() => sandbox.restore());

  test('that the file stats are returned if the `stat` promise resolves', async () => {
    const stats = any.simpleObject();
    fs.stat.withArgs(path).resolves(stats);

    assert.equal(await exists(path), stats);
  });

  test('that `false` is returned if `stat` throws a not-found error', async () => {
    const error = new Error();
    error.code = 'ENOENT';
    fs.stat.withArgs(path).rejects(error);

    assert.isFalse(await exists(path));
  });

  test('that the error is thrown if `stat` throws an error other than not-found', async () => {
    const error = new Error();
    error.code = any.word();
    fs.stat.withArgs(path).rejects(error);

    try {
      await exists(path);

      throw new Error('an error should have been thrown');
    } catch (e) {
      assert.equal(e, error);
    }
  });
});
