import deepmerge from 'deepmerge';

async function pluginAppliesToProject(pluginName, test, lift, options, dependencies) {
  const {logger} = dependencies;

  if (!test) {
    logger.warn(`Plugin ${pluginName} does not provide a 'test' predicate`);

    return false;
  }

  if (!lift) {
    logger.warn(`Plugin ${pluginName} does not provide a 'lift' function`);

    return false;
  }

  return test(options, dependencies);
}

export default async function applyEnhancer({results = {}, enhancers = {}, options, dependencies}) {
  const {logger} = dependencies;

  logger.info('Applying Enhancers');

  return Object.entries(enhancers)
    .reduce(async (accPromise, [pluginName, {test, lift}]) => {
      const previousResults = await accPromise;

      if (await pluginAppliesToProject(pluginName, test, lift, options, dependencies)) {
        return deepmerge(
          previousResults,
          await lift({results: previousResults, ...options}, dependencies)
        );
      }

      return previousResults;
    }, Promise.resolve(results));
}
