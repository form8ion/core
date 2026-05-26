import path from 'path';
import spdxLicenseList from 'spdx-license-list/simple';

import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';

import {questionNames as coreQuestionNames} from './question-names.js';
import * as predicates from './predicates.js';
import {questionsForBaseDetails} from './questions.js';
import * as visibilityModule from './visibility-options.js';

suite('project scaffolder prompts', () => {
  let sandbox, visibilityChoicesStub;
  const projectPath = any.string();
  const decisions = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(path, 'basename');
    visibilityChoicesStub = sandbox.stub(visibilityModule, 'visibilityChoices');
  });

  teardown(() => sandbox.restore());

  suite('base details', () => {
    test('that the user is prompted for the necessary details', async () => {
      const directoryName = any.string();
      const copyrightHolder = any.string();
      const stubbedVisibilityChoices = any.listOf(() => ({
        name: any.string(),
        value: any.string()
      }));
      visibilityChoicesStub.get(() => stubbedVisibilityChoices);
      path.basename.withArgs(projectPath).returns(directoryName);

      assert.deepEqual(
        await questionsForBaseDetails(decisions, projectPath, copyrightHolder),
        [
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
            choices: visibilityModule.visibilityChoices
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
            choices: Array.from(spdxLicenseList),
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
        ]
      );
    });

    test('that projectPath is optional', async () => {
      const copyrightHolder = any.string();
      const stubbedVisibilityChoices = any.listOf(() => ({
        name: any.string(),
        value: any.string()
      }));
      visibilityChoicesStub.get(() => stubbedVisibilityChoices);
      path.basename
        .withArgs(undefined)
        .throws(new Error('The "path" argument must be of type string. Received undefined'));

      assert.deepEqual(
        await questionsForBaseDetails(decisions, undefined, copyrightHolder),
        [
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
            choices: visibilityModule.visibilityChoices
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
            choices: Array.from(spdxLicenseList),
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
        ]
      );
    });
  });
});
