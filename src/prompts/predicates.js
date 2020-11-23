import {questionNames} from './question-names';

export function unlicensedConfirmationShouldBePresented(decisions) {
  return answers => {
    const values = {...decisions, ...answers};

    return 'Private' === values[questionNames.VISIBILITY];
  };
}

export function licenseChoicesShouldBePresented(decisions) {
  return answers => {
    const values = {...decisions, ...answers};

    return 'Public' === values[questionNames.VISIBILITY] || !values[questionNames.UNLICENSED];
  };
}

export function copyrightInformationShouldBeRequested(decisions) {
  return answers => {
    const values = {...decisions, ...answers};

    return !!values[questionNames.LICENSE];
  };
}
