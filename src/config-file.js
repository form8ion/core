import {promises as fs} from 'fs';
import {dump} from 'js-yaml';

import {fileTypes, fileTypeExtensions} from './file-types';

export function write({format, config, path, name}) {
  const filePath = `${path}/${name}.${fileTypeExtensions[format]}`;

  if (fileTypes.JSON === format) {
    return fs.writeFile(filePath, JSON.stringify(config, null, 2));
  }

  if (fileTypes.YAML === format) {
    return fs.writeFile(filePath, dump(config));
  }

  throw new Error('The requested format for the config file is unsupported');
}
