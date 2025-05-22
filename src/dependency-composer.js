export default function composeDependenciesInto(functionToEnhance, dependencies) {
  return options => functionToEnhance(options, dependencies);
}
