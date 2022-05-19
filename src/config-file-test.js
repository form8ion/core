import {promises as fs} from 'fs';

import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';

import {fileTypes} from './file-types';
import {write} from './config-file';

suite('config file', () => {
  let sandbox;
  const filePath = any.string();
  const fileName = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'writeFile');
  });

  teardown(() => sandbox.restore());

  suite('write', () => {
    test('that an error is thrown for an unsupported file type', async () => {
      try {
        await write({format: any.word()});

        throw new Error('An error should have been thrown due to the unsupported format');
      } catch (e) {
        assert.equal(e.message, 'The requested format for the config file is unsupported');
      }
    });

    test('that a json file is written when the JSON file type is chosen', async () => {
      const config = any.simpleObject();

      await write({format: fileTypes.JSON, config, path: filePath, name: fileName});

      assert.calledWith(fs.writeFile, `${filePath}/${fileName}.json`, JSON.stringify(config, null, 2));
    });
  });
});
