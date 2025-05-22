import {describe, it, vi, expect} from 'vitest';
import any from '@travi/any';

import composeDependenciesInto from './dependency-composer.js';

describe('dependency composer', () => {
  it('should inject the provided dependencies into the function', async () => {
    const dependencies = any.simpleObject();
    const options = any.simpleObject();
    const functionToEnhance = vi.fn();

    composeDependenciesInto(functionToEnhance, dependencies)(options);

    expect(functionToEnhance).toHaveBeenCalledWith(options, dependencies);
  });
});
