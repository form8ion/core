import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';

export default async function ({results = {}, enhancers = {}, options, dependencies = {}}) {
  info('Applying Enhancers');

  return Object.values(enhancers)
    .reduce(async (acc, {test, lift}) => {
      if (test && lift && await test(options)) {
        const previousResults = await acc;

        return deepmerge(
          previousResults,
          await lift({results: previousResults, ...options}, dependencies)
        );
      }

      return acc;
    }, results);
}
