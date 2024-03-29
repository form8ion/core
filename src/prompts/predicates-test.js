import {assert} from 'chai';
import any from '@travi/any';

import {questionNames} from './question-names.js';
import {
  copyrightInformationShouldBeRequested,
  licenseChoicesShouldBePresented,
  unlicensedConfirmationShouldBePresented
} from './predicates.js';

suite('prompt conditionals', () => {
  suite('unlicensed confirmation', () => {
    test('that the unlicensed confirmation is shown for a private project', () => {
      assert.isTrue(unlicensedConfirmationShouldBePresented({[questionNames.VISIBILITY]: 'Private'}));
    });

    test('that the unlicensed confirmation is not shown for a public project', () => {
      assert.isFalse(unlicensedConfirmationShouldBePresented({[questionNames.VISIBILITY]: 'Public'}));
    });
  });

  suite('license choices', () => {
    test('that the license choices are shown for a public project', () => {
      assert.isTrue(licenseChoicesShouldBePresented({[questionNames.VISIBILITY]: 'Public'}));
    });

    test('that the license choices are shown for a private project that is not unlicensed', () => {
      assert.isTrue(licenseChoicesShouldBePresented({
        [questionNames.VISIBILITY]: 'Private',
        [questionNames.UNLICENSED]: false
      }));
    });

    test('that the license choices are not shown for a private project that is unlicensed', () => {
      assert.isFalse(licenseChoicesShouldBePresented({
        [questionNames.VISIBILITY]: 'Private',
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
