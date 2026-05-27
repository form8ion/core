export default function ungroupPlugins(groupedPlugins) {
  return Object.values(groupedPlugins).reduce((acc, pluginGroup) => ({...acc, ...pluginGroup}), {});
}
