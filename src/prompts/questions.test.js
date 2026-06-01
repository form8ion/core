import {basename} from 'node:path';

import {describe, expect, it, vi, beforeEach} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import {questionNames as coreQuestionNames} from './question-names.js';
import * as predicates from './predicates.js';
import {visibilityOptions} from './visibility-options.js';
import mapOptionsToChoices from './options-to-choices-mapper.js';
import buildLicenseChoices from './license-choices-builder.js';
import {questionsForBaseDetails} from './questions.js';

vi.mock('node:path');
vi.mock('./options-to-choices-mapper.js');

describe('base project questions', () => {
  const projectPath = any.string();
  const decisions = any.simpleObject();
  const visibilityChoices = any.listOf(any.simpleObject);

  beforeEach(() => {
    when(mapOptionsToChoices).calledWith(visibilityOptions).thenReturn(visibilityChoices);
  });

  it('should define the questions for gathering base details about a project', async () => {
    const directoryName = any.string();
    const copyrightHolder = any.string();
    when(basename).calledWith(projectPath).thenReturn(directoryName);

    expect(await questionsForBaseDetails(decisions, projectPath, copyrightHolder)).toEqual([
      {name: coreQuestionNames.PROJECT_NAME, message: 'What is the name of this project?', default: directoryName},
      {
        name: coreQuestionNames.DESCRIPTION,
        message: 'How should this project be described?'
      },
      {
        name: coreQuestionNames.VISIBILITY,
        message: 'What is the contribution model for this project?',
        type: 'list',
        validate: predicates.visibilityIsValid,
        choices: visibilityChoices
      },
      {
        name: coreQuestionNames.UNLICENSED,
        message: 'Since this is a private project, should it be unlicensed?',
        type: 'confirm',
        when: predicates.unlicensedConfirmationShouldBePresented,
        default: true
      },
      {
        name: coreQuestionNames.LICENSE,
        message: 'How should this this project be licensed (https://choosealicense.com/)?',
        type: 'list',
        when: predicates.licenseChoicesShouldBePresented,
        choices: buildLicenseChoices,
        default: 'MIT'
      },
      {
        name: coreQuestionNames.COPYRIGHT_HOLDER,
        message: 'Who is the copyright holder of this project?',
        when: predicates.copyrightInformationShouldBeRequested,
        default: copyrightHolder
      },
      {
        name: coreQuestionNames.COPYRIGHT_YEAR,
        message: 'What is the copyright year?',
        when: predicates.copyrightInformationShouldBeRequested,
        default: new Date().getFullYear()
      }
    ]);
  });

  it('should not require `projectPath`', async () => {
    const copyrightHolder = any.string();
    when(basename)
      .calledWith(undefined)
      .thenThrow(new Error('The "path" argument must be of type string. Received undefined'));

    expect(await questionsForBaseDetails(decisions, undefined, copyrightHolder)).toEqual([
      {name: coreQuestionNames.PROJECT_NAME, message: 'What is the name of this project?', default: undefined},
      {
        name: coreQuestionNames.DESCRIPTION,
        message: 'How should this project be described?'
      },
      {
        name: coreQuestionNames.VISIBILITY,
        message: 'What is the contribution model for this project?',
        type: 'list',
        validate: predicates.visibilityIsValid,
        choices: visibilityChoices
      },
      {
        name: coreQuestionNames.UNLICENSED,
        message: 'Since this is a private project, should it be unlicensed?',
        type: 'confirm',
        when: predicates.unlicensedConfirmationShouldBePresented,
        default: true
      },
      {
        name: coreQuestionNames.LICENSE,
        message: 'How should this this project be licensed (https://choosealicense.com/)?',
        type: 'list',
        when: predicates.licenseChoicesShouldBePresented,
        choices: buildLicenseChoices,
        default: 'MIT'
      },
      {
        name: coreQuestionNames.COPYRIGHT_HOLDER,
        message: 'Who is the copyright holder of this project?',
        when: predicates.copyrightInformationShouldBeRequested,
        default: copyrightHolder
      },
      {
        name: coreQuestionNames.COPYRIGHT_YEAR,
        message: 'What is the copyright year?',
        when: predicates.copyrightInformationShouldBeRequested,
        default: new Date().getFullYear()
      }
    ]);
  });
});
