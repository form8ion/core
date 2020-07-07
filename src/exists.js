import {promises as fs} from 'fs';

export default async function (path) {
  try {
    await fs.stat(path);

    return true;
  } catch (e) {
    if ('ENOENT' === e.code) return false;

    throw e;
  }
}
