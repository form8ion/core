import {directoryExists, fileExists} from './lib/index.js';

(async () => {
  await fileExists('path/to/some/expected/file');
  await directoryExists('path/to/some/expected/directory');
})();
