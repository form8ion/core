import exists from './exists.js';

export default async function (path) {
  const stats = await exists(path);

  if (stats) {
    return stats.isFile();
  }

  return stats;
}
