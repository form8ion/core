import deepmerge from 'deepmerge';
import {info, warn} from '@travi/cli-messages';

async function pluginAppliesToProject(pluginName, test, lift, options) {
  if (!test) {
    warn(`Plugin ${pluginName} does not provide a 'test' predicate`);

    return false;
  }

  if (!lift) {
    warn(`Plugin ${pluginName} does not provide a 'lift' function`);

    return false;
  }

  return test(options);
}

export default async function ({results = {}, enhancers = {}, options, dependencies = {}}) {
  info('Applying Enhancers');

  return Object.entries(enhancers)
    .reduce(async (acc, [pluginName, {test, lift}]) => {
      if (await pluginAppliesToProject(pluginName, test, lift, options)) {
        const previousResults = await acc;

        return deepmerge(
          previousResults,
          await lift({results: previousResults, ...options}, dependencies)
        );
      }

      return acc;
    }, results);
}
