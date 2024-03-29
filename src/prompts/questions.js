import {basename} from 'path';
/* eslint-disable-next-line import/extensions -- needed for the esm bundle */
import spdxLicenseList from 'spdx-license-list/simple.js';

import {questionNames} from './question-names.js';
import {
  copyrightInformationShouldBeRequested,
  licenseChoicesShouldBePresented,
  unlicensedConfirmationShouldBePresented
} from './predicates.js';

function includeLicenseQuestions(copyrightHolder) {
  return [
    {
      name: questionNames.UNLICENSED,
      message: 'Since this is a private project, should it be unlicensed?',
      type: 'confirm',
      when: unlicensedConfirmationShouldBePresented,
      default: true
    },
    {
      name: questionNames.LICENSE,
      message: 'How should this this project be licensed (https://choosealicense.com/)?',
      type: 'list',
      when: licenseChoicesShouldBePresented,
      choices: Array.from(spdxLicenseList),
      default: 'MIT'
    },
    {
      name: questionNames.COPYRIGHT_HOLDER,
      message: 'Who is the copyright holder of this project?',
      when: copyrightInformationShouldBeRequested,
      default: copyrightHolder
    },
    {
      name: questionNames.COPYRIGHT_YEAR,
      message: 'What is the copyright year?',
      when: copyrightInformationShouldBeRequested,
      default: new Date().getFullYear()
    }
  ];
}

export function questionsForBaseDetails(decisions, projectRoot, copyrightHolder) {
  return [
    {
      name: questionNames.PROJECT_NAME,
      message: 'What is the name of this project?',
      default: projectRoot && basename(projectRoot)
    },
    {name: questionNames.DESCRIPTION, message: 'How should this project be described?'},
    {
      name: questionNames.VISIBILITY,
      message: 'Should this project be public or private?',
      type: 'list',
      choices: ['Public', 'Private'],
      default: 'Private'
    },
    ...includeLicenseQuestions(copyrightHolder)
  ];
}
