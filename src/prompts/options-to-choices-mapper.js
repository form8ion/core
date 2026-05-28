export default function mapOptionsToChoices(options) {
  return Object.entries(options).map(([key, description]) => ({name: description, value: key}));
}
