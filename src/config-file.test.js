import {promises as fs} from 'node:fs';
import {dump} from 'js-yaml';
import {stringify} from 'ini';

import {describe, it, vi, expect} from 'vitest';
import any from '@travi/any';

import {fileTypeExtensions, fileTypes} from './file-types.js';
import {write} from './config-file.js';

vi.mock('node:fs');

describe('config-file', () => {
  const filePath = any.string();
  const fileName = any.word();

  describe('write', () => {
    it('should throw an error for an unsupported file type', async () => {
      expect(() => write({format: any.word()}))
        .toThrowError('The requested format for the config file is unsupported');
    });

    it('should write to a json file when the JSON file type is chosen', async () => {
      const config = any.simpleObject();

      await write({format: fileTypes.JSON, config, path: filePath, name: fileName});

      expect(fs.writeFile).toHaveBeenCalledWith(
        `${filePath}/${fileName}.${fileTypeExtensions[fileTypes.JSON]}`,
        `${JSON.stringify(config, null, 2)}
`
      );
    });

    it('should write to a yaml file when the YAML file type is chosen', async () => {
      const config = any.simpleObject();

      await write({format: fileTypes.YAML, config, path: filePath, name: fileName});

      expect(fs.writeFile).toHaveBeenCalledWith(
        `${filePath}/${fileName}.${fileTypeExtensions[fileTypes.YAML]}`,
        dump(config)
      );
    });

    it('should write to an ini file when the INI file type is chosen', async () => {
      const config = any.simpleObject();

      await write({format: fileTypes.INI, config, path: filePath, name: fileName});

      expect(fs.writeFile).toHaveBeenCalledWith(
        `${filePath}/${fileName}.${fileTypeExtensions[fileTypes.INI]}`,
        stringify(config)
      );
    });
  });
});
