import {assert} from 'chai';
import any from '@travi/any';

import {questionNames} from './question-names.js';
import {
  copyrightInformationShouldBeRequested,
  licenseChoicesShouldBePresented,
  visibilityIsValid,
  unlicensedConfirmationShouldBePresented
} from './predicates.js';

suite('prompt conditionals', () => {
  suite('visibility validation', () => {
    test('that oss is considered a valid response', () => {
      assert.isTrue(visibilityIsValid('OSS'));
    });

    test('that iss is considered a valid response', () => {
      assert.isTrue(visibilityIsValid('ISS'));
    });

    test('that cs is considered a valid response', () => {
      assert.isTrue(visibilityIsValid('CS'));
    });

    test('that an arbitrary value is considered invalid', () => {
      assert.isFalse(visibilityIsValid(any.string()));
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
