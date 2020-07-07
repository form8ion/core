import {fileExists} from './lib/index.cjs';

(async () => {
  await fileExists('path/to/some/expected/file');
})();
