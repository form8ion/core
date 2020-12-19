import {directoryExists, fileExists} from './lib/index.cjs';

(async () => {
  await fileExists('path/to/some/expected/file');
  await directoryExists('path/to/some/expected/directory');
})();
