import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import {questionNames} from './question-names.js';
import * as visibilityModule from './visibility-options.js';
import {
  copyrightInformationShouldBeRequested,
  licenseChoicesShouldBePresented,
  visibilityIsValid,
  unlicensedConfirmationShouldBePresented
} from './predicates.js';

suite('prompt conditionals', () => {
  let sandbox, visibilityOptionsStub;

  setup(() => {
    sandbox = sinon.createSandbox();
    visibilityOptionsStub = sandbox.stub(visibilityModule, 'visibilityOptions');
  });

  teardown(() => sandbox.restore());

  suite('visibility validation', () => {
    test('that every provided option is considered a valid response', () => {
      const stubbedVisibilityOptions = any.listOf(any.string);
      visibilityOptionsStub.get(() => stubbedVisibilityOptions);

      stubbedVisibilityOptions.forEach(option => assert.isTrue(visibilityIsValid(option)));
    });

    test('that an arbitrary value is considered invalid', () => {
      const stubbedVisibilityOptions = any.listOf(any.string);
      visibilityOptionsStub.get(() => stubbedVisibilityOptions);

      assert.isFalse(visibilityIsValid('not-a-visibility-option'));
    });
  });

  suite('unlicensed confirmation', () => {
    test('that the unlicensed confirmation is shown for an inner-source project', () => {
      assert.isTrue(unlicensedConfirmationShouldBePresented({[questionNames.VISIBILITY]: 'ISS'}));
    });

    test('that the unlicensed confirmation is shown for a closed-source project', () => {
      assert.isTrue(unlicensedConfirmationShouldBePresented({[questionNames.VISIBILITY]: 'CS'}));
    });

    test('that the unlicensed confirmation is not shown for an open-source project', () => {
      assert.isFalse(unlicensedConfirmationShouldBePresented({[questionNames.VISIBILITY]: 'OSS'}));
    });
  });

  suite('license choices', () => {
    test('that the license choices are shown for an open-source project', () => {
      assert.isTrue(licenseChoicesShouldBePresented({[questionNames.VISIBILITY]: 'OSS'}));
    });

    test('that the license choices are shown for a non-open project that is not unlicensed', () => {
      assert.isTrue(licenseChoicesShouldBePresented({
        [questionNames.VISIBILITY]: 'CS',
        [questionNames.UNLICENSED]: false
      }));
    });

    test('that the license choices are not shown for a non-open project that is unlicensed', () => {
      assert.isFalse(licenseChoicesShouldBePresented({
        [questionNames.VISIBILITY]: 'ISS',
        [questionNames.UNLICENSED]: true
      }));
    });
  });

  suite('copyright', () => {
    test('that the copyright information is requested when the project is licensed', () => {
      assert.isTrue(copyrightInformationShouldBeRequested({
        [questionNames.LICENSE]: any.string()
      }));
    });

    test('that the copyright information is not requested when the project is not licensed', () => {
      assert.isFalse(copyrightInformationShouldBeRequested({
        [questionNames.LICENSE]: undefined
      }));
    });
  });
});
