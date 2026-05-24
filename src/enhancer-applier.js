import deepmerge from 'deepmerge';

async function pluginAppliesToProject(pluginName, test, lift, options, {logger}) {
  if (!test) {
    logger.warn(`Plugin ${pluginName} does not provide a 'test' predicate`);

    return false;
  }

  if (!lift) {
    logger.warn(`Plugin ${pluginName} does not provide a 'lift' function`);

    return false;
  }

  return test(options);
}

export default async function applyEnhancer({results = {}, enhancers = {}, options, dependencies}) {
  const {logger} = dependencies;

  logger.info('Applying Enhancers');

  return Object.entries(enhancers)
    .reduce(async (acc, [pluginName, {test, lift}]) => {
      if (await pluginAppliesToProject(pluginName, test, lift, options, dependencies)) {
        const previousResults = await acc;

        return deepmerge(
          previousResults,
          await lift({results: previousResults, ...options}, dependencies)
        );
      }

      return acc;
    }, results);
}
