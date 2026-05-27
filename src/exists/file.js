import exists from './exists.js';

export default async function fileExists(path) {
  const stats = await exists(path);

  if (stats) {
    return stats.isFile();
  }

  return stats;
}
