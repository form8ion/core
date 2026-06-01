import spdxLicenseList from 'spdx-license-list';

import {questionNames as coreQuestionNames} from './question-names.js';

export default function buildLicenseChoices({[coreQuestionNames.VISIBILITY]: visibility}) {
  if ('OSS' === visibility) {
    return Object.entries(spdxLicenseList)
      .filter(([, details]) => details.osiApproved)
      .map(([identifier]) => identifier);
  }
  return [];
}
