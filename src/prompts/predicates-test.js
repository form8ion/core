import {assert} from 'chai';
import any from '@travi/any';
import {questionNames} from './question-names';
import {
  copyrightInformationShouldBeRequested,
  licenseChoicesShouldBePresented,
  unlicensedConfirmationShouldBePresented
} from './predicates';

suite('prompt predicates', () => {
  const decisions = any.simpleObject();

  suite('unlicensed confirmation', () => {
    test('that the unlicensed confirmation is shown for a private project', () => {
      assert.isTrue(unlicensedConfirmationShouldBePresented(decisions)({[questionNames.VISIBILITY]: 'Private'}));
    });

    test('that the unlicensed confirmation is not shown for a public project', () => {
      assert.isFalse(unlicensedConfirmationShouldBePresented(decisions)({[questionNames.VISIBILITY]: 'Public'}));
    });

    test('that the unlicensed confirmation is shown for a programmatically private project', () => {
      assert.isTrue(unlicensedConfirmationShouldBePresented({...decisions, [questionNames.VISIBILITY]: 'Private'})({}));
    });

    test('that the unlicensed confirmation is not shown for a programmatically public project', () => {
      assert.isFalse(unlicensedConfirmationShouldBePresented({...decisions, [questionNames.VISIBILITY]: 'Public'})({}));
    });
  });

  suite('license choices', () => {
    test('that the license choices are shown for a public project', () => {
      assert.isTrue(licenseChoicesShouldBePresented(decisions)({[questionNames.VISIBILITY]: 'Public'}));
    });

    test('that the license choices are shown for a private project that is not unlicensed', () => {
      assert.isTrue(licenseChoicesShouldBePresented(decisions)({
        [questionNames.VISIBILITY]: 'Private',
        [questionNames.UNLICENSED]: false
      }));
    });

    test('that the license choices are not shown for a private project that is unlicensed', () => {
      assert.isFalse(licenseChoicesShouldBePresented(decisions)({
        [questionNames.VISIBILITY]: 'Private',
        [questionNames.UNLICENSED]: true
      }));
    });

    test('that the license choices are shown for a programmatically public project', () => {
      assert.isTrue(licenseChoicesShouldBePresented({...decisions, [questionNames.VISIBILITY]: 'Public'})({}));
    });

    test('that the license choices are shown for a programmatically private project that is not unlicensed', () => {
      assert.isTrue(licenseChoicesShouldBePresented({
        ...decisions,
        [questionNames.VISIBILITY]: 'Private',
        [questionNames.UNLICENSED]: false
      })({}));
    });

    test('that the license choices are not shown for a programmatically private project that is unlicensed', () => {
      assert.isFalse(licenseChoicesShouldBePresented({
        ...decisions,
        [questionNames.VISIBILITY]: 'Private',
        [questionNames.UNLICENSED]: true
      })({}));
    });
  });

  suite('copyright', () => {
    test('that the copyright information is requested when the project is licensed', () => {
      assert.isTrue(copyrightInformationShouldBeRequested(decisions)({
        [questionNames.LICENSE]: any.string()
      }));
    });

    test('that the copyright information is not requested when the project is not licensed', () => {
      assert.isFalse(copyrightInformationShouldBeRequested(decisions)({
        [questionNames.LICENSE]: undefined
      }));
    });
    test('that the copyright information is requested when the project is programmatically licensed', () => {
      assert.isTrue(copyrightInformationShouldBeRequested({...decisions, [questionNames.LICENSE]: any.string()})({}));
    });

    test('that the copyright information is not requested when the project is programmatically not licensed', () => {
      assert.isFalse(copyrightInformationShouldBeRequested({...decisions, [questionNames.LICENSE]: undefined})({}));
    });
  });
});
