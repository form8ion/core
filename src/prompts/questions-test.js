import path from 'path';
import spdxLicenseList from 'spdx-license-list/simple';
import * as prompts from '@form8ion/overridable-prompts';
import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import {questionNames as coreQuestionNames} from './question-names';
import * as conditionals from './conditionals';
import {questionsForBaseDetails} from './questions';

suite('project scaffolder prompts', () => {
  let sandbox;
  const projectPath = any.string();
  const decisions = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(path, 'basename');
    sandbox.stub(prompts, 'questionHasDecision');

    prompts.questionHasDecision.returns(false);
  });

  teardown(() => sandbox.restore());

  suite('base details', () => {
    test('that the user is prompted for the necessary details', async () => {
      const directoryName = any.string();
      const copyrightHolder = any.string();
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
            message: 'Should this project be public or private?',
            type: 'list',
            choices: ['Public', 'Private'],
            default: 'Private'
          },
          {
            name: coreQuestionNames.UNLICENSED,
            message: 'Since this is a private project, should it be unlicensed?',
            type: 'confirm',
            when: conditionals.unlicensedConfirmationShouldBePresented,
            default: true
          },
          {
            name: coreQuestionNames.LICENSE,
            message: 'How should this this project be licensed (https://choosealicense.com/)?',
            type: 'list',
            when: conditionals.licenseChoicesShouldBePresented,
            choices: Array.from(spdxLicenseList),
            default: 'MIT'
          },
          {
            name: coreQuestionNames.COPYRIGHT_HOLDER,
            message: 'Who is the copyright holder of this project?',
            when: conditionals.copyrightInformationShouldBeRequested,
            default: copyrightHolder
          },
          {
            name: coreQuestionNames.COPYRIGHT_YEAR,
            message: 'What is the copyright year?',
            when: conditionals.copyrightInformationShouldBeRequested,
            default: new Date().getFullYear()
          }
        ]
      );
    });

    test('that license questions are skipped when a visibility decision is provided', async () => {
      const directoryName = any.string();
      const copyrightHolder = any.string();
      path.basename.withArgs(projectPath).returns(directoryName);
      prompts.questionHasDecision.withArgs(coreQuestionNames.VISIBILITY, decisions).returns(true);

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
            message: 'Should this project be public or private?',
            type: 'list',
            choices: ['Public', 'Private'],
            default: 'Private'
          }
        ]
      );
    });

    test('that projectPath is optional', async () => {
      const copyrightHolder = any.string();
      path.basename
        .withArgs(undefined)
        .throws(new Error('The "path" argument must be of type string. Received undefined'));
      prompts.questionHasDecision.withArgs(coreQuestionNames.VISIBILITY, decisions).returns(true);

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
            message: 'Should this project be public or private?',
            type: 'list',
            choices: ['Public', 'Private'],
            default: 'Private'
          }
        ]
      );
    });
  });
});
