import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';

export default async function ({results = {}, enhancers = {}, options, dependencies = {}}) {
  info('Applying Enhancers');

  return Object.values(enhancers)
    .reduce(async (acc, enhancer) => {
      if (await enhancer.test(options)) {
        const previousResults = await acc;

        return deepmerge(
          previousResults,
          await enhancer.lift({results: previousResults, ...options}, dependencies)
        );
      }

      return acc;
    }, results);
}
