// TODO use as a checklist
import { GithubCfg } from './github.model';
import { T } from '../../../../t.const';
import {
  ConfigFormSection,
  LimitedFormlyFieldConfig,
} from '../../../config/global-config.model';
import { IssueProviderGithub } from '../../issue.model';
import { ISSUE_PROVIDER_COMMON_FORM_FIELDS } from '../../common-issue-form-stuff.const';

export const DEFAULT_GITHUB_CFG: GithubCfg = {
  isEnabled: false,
  repo: null,
  token: null,
  filterUsername: null,
  filterIssuesAssignedToMe: false,
};

// NOTE: we need a high limit because git has low usage limits :(
// export const GITHUB_POLL_INTERVAL = 10 * 60 * 1000;
// export const GITHUB_INITIAL_POLL_DELAY = 8 * 1000;
export const GITHUB_POLL_INTERVAL = 10 * 60 * 1000;
export const GITHUB_INITIAL_POLL_DELAY = 8 * 1000;

// export const GITHUB_POLL_INTERVAL = 15 * 1000;
export const GITHUB_API_BASE_URL = 'https://api.github.com/';

export const GITHUB_CONFIG_FORM: LimitedFormlyFieldConfig<IssueProviderGithub>[] = [
  {
    key: 'repo',
    type: 'input',
    props: {
      label: T.F.GITHUB.FORM.REPO,
      required: true,
      type: 'text',
      pattern: /^.+\/.+?$/i,
    },
  },
  {
    key: 'token',
    type: 'input',
    props: {
      label: T.F.GITHUB.FORM.TOKEN,
      required: true,
      description: T.F.GITHUB.FORM.TOKEN_DESCRIPTION,
      type: 'password',
    },
  },
  {
    type: 'link',
    props: {
      url: 'https://github.com/johannesjo/super-productivity/blob/master/docs/github-access-token-instructions.md',
      txt: T.F.ISSUE.HOW_TO_GET_A_TOKEN,
    },
  },
  {
    type: 'collapsible',
    // todo translate
    props: { label: 'Advanced Config' },
    fieldGroup: [
      ...ISSUE_PROVIDER_COMMON_FORM_FIELDS,
      {
        key: 'filterUsername',
        type: 'input',
        props: {
          label: T.F.GITHUB.FORM.FILTER_USER,
        },
      },
      {
        key: 'filterIssuesAssignedToMe',
        type: 'checkbox',
        expressions: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          // 'props.disabled': '!model.filterUsername',
          hide: '!model.filterUsername',
        },
        props: {
          label: T.F.GITHUB.FORM.IS_ASSIGNEE_FILTER,
        },
      },
    ],
  },
];

export const GITHUB_CONFIG_FORM_SECTION: ConfigFormSection<IssueProviderGithub> = {
  title: 'GitHub',
  key: 'GITHUB',
  items: GITHUB_CONFIG_FORM,
  help: T.F.GITHUB.FORM_SECTION.HELP,
};
