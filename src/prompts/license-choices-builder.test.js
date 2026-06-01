import spdxLicenseList from 'spdx-license-list';

import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import {questionNames as coreQuestionNames} from './question-names.js';
import buildLicenseChoices from './license-choices-builder.js';

describe('license choices builder', () => {
  it('should filter the spdx license options to OSI approved licenses for OSS projects', async () => {
    expect(buildLicenseChoices({[coreQuestionNames.VISIBILITY]: 'OSS'}))
      .toEqual(Object.entries(spdxLicenseList).reduce((acc, [identifier, details]) => {
        if (details.osiApproved) return [...acc, identifier];

        return acc;
      }, []));
  });

  it('should return an empty list for non-OSS projects', async () => {
    expect(buildLicenseChoices(any.word())).toEqual([]);
  });
});
