import {promises as fs} from 'fs';
import {dump, load} from 'js-yaml';
import deepmerge from 'deepmerge';

import {fileTypes, fileTypeExtensions} from './file-types.js';

function buildFilePathFrom(path, name, format) {
  return `${path}/${name}.${fileTypeExtensions[format]}`;
}

export async function loadExistingConfig(path, name, format) {
  const filePath = buildFilePathFrom(path, name, format);

  if (fileTypes.JSON === format) {
    return JSON.parse(await fs.readFile(filePath, 'utf-8'));
  }

  if (fileTypes.YAML === format) {
    return load(await fs.readFile(filePath, 'utf-8'));
  }

  throw new Error('The requested format for the config file is unsupported');
}

export function write({format, config, path, name}) {
  const filePath = buildFilePathFrom(path, name, format);

  if (fileTypes.JSON === format) {
    return fs.writeFile(filePath, `${JSON.stringify(config, null, 2)}\n`);
  }

  if (fileTypes.YAML === format) {
    return fs.writeFile(filePath, dump(config));
  }

  throw new Error('The requested format for the config file is unsupported');
}

export async function mergeIntoExisting({format, config, path, name}) {
  const existingConfig = await loadExistingConfig(path, name, format);

  return write({format, config: deepmerge.all([existingConfig, config]), path, name});
}
