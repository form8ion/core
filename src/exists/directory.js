import exists from './exists.js';

export default async function directoryExists(path) {
  const stats = await exists(path);

  if (stats) {
    return stats.isDirectory();
  }

  return stats;
}
