import {questionNames} from './question-names.js';

const visibilityOptions = ['OSS', 'ISS', 'CS'];

export function visibilityIsValid(visibility) {
  return visibilityOptions.includes(visibility);
}

export function unlicensedConfirmationShouldBePresented(answers) {
  return ['ISS', 'CS'].includes(answers[questionNames.VISIBILITY]);
}

export function licenseChoicesShouldBePresented(answers) {
  return 'OSS' === answers[questionNames.VISIBILITY] || !answers[questionNames.UNLICENSED];
}

export function copyrightInformationShouldBeRequested(answers) {
  return !!answers[questionNames.LICENSE];
}
