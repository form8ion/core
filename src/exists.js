import {promises as fs} from 'fs';

export default async function (path) {
  try {
    return await fs.stat(path);
  } catch (e) {
    if ('ENOENT' === e.code) return false;

    throw e;
  }
}
