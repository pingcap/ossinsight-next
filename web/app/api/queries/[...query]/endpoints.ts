import {EndpointConfig} from "@/types/EndpointConfig.schema";

export interface Endpoint {
  config: EndpointConfig,
  templateSQL: string,
}

export const endpoints: Record<string, Endpoint> = {
    
  'orgs/commits/code-changes/top-repos': {
    config: require('@/configs/endpoints/orgs/commits/code-changes/top-repos/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/commits/code-changes/top-repos/template.sql').default,
  },
    
  'orgs/commits/time-distribution': {
    config: require('@/configs/endpoints/orgs/commits/time-distribution/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/commits/time-distribution/template.sql').default,
  },
    
  'orgs/commits/total': {
    config: require('@/configs/endpoints/orgs/commits/total/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/commits/total/template.sql').default,
  },
    
  'orgs/commits/trends': {
    config: require('@/configs/endpoints/orgs/commits/trends/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/commits/trends/template.sql').default,
  },
    
  'orgs/issues/actions/trends': {
    config: require('@/configs/endpoints/orgs/issues/actions/trends/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/issues/actions/trends/template.sql').default,
  },
    
  'orgs/issues/closed-ratio': {
    config: require('@/configs/endpoints/orgs/issues/closed-ratio/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/issues/closed-ratio/template.sql').default,
  },
    
  'orgs/issues/issue-comments/top-repos': {
    config: require('@/configs/endpoints/orgs/issues/issue-comments/top-repos/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/issues/issue-comments/top-repos/template.sql').default,
  },
    
  'orgs/issues/open-to-close-duration/medium': {
    config: require('@/configs/endpoints/orgs/issues/open-to-close-duration/medium/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/issues/open-to-close-duration/medium/template.sql').default,
  },
    
  'orgs/issues/open-to-close-duration/top-repos': {
    config: require('@/configs/endpoints/orgs/issues/open-to-close-duration/top-repos/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/issues/open-to-close-duration/top-repos/template.sql').default,
  },
    
  'orgs/issues/open-to-first-response-duration/medium': {
    config: require('@/configs/endpoints/orgs/issues/open-to-first-response-duration/medium/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/issues/open-to-first-response-duration/medium/template.sql').default,
  },
    
  'orgs/issues/open-to-first-response-duration/top-repos': {
    config: require('@/configs/endpoints/orgs/issues/open-to-first-response-duration/top-repos/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/issues/open-to-first-response-duration/top-repos/template.sql').default,
  },
    
  'orgs/issues/total': {
    config: require('@/configs/endpoints/orgs/issues/total/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/issues/total/template.sql').default,
  },
    
  'orgs/issues/trends': {
    config: require('@/configs/endpoints/orgs/issues/trends/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/issues/trends/template.sql').default,
  },
    
  'orgs/overview': {
    config: require('@/configs/endpoints/orgs/overview/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/overview/template.sql').default,
  },
    
  'orgs/participants/active/ranking': {
    config: require('@/configs/endpoints/orgs/participants/active/ranking/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/participants/active/ranking/template.sql').default,
  },
    
  'orgs/participants/active/total': {
    config: require('@/configs/endpoints/orgs/participants/active/total/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/participants/active/total/template.sql').default,
  },
    
  'orgs/participants/active/trends': {
    config: require('@/configs/endpoints/orgs/participants/active/trends/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/participants/active/trends/template.sql').default,
  },
    
  'orgs/participants/engagements': {
    config: require('@/configs/endpoints/orgs/participants/engagements/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/participants/engagements/template.sql').default,
  },
    
  'orgs/participants/locations': {
    config: require('@/configs/endpoints/orgs/participants/locations/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/participants/locations/template.sql').default,
  },
    
  'orgs/participants/locations/completion-rate': {
    config: require('@/configs/endpoints/orgs/participants/locations/completion-rate/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/participants/locations/completion-rate/template.sql').default,
  },
    
  'orgs/participants/new/ranking': {
    config: require('@/configs/endpoints/orgs/participants/new/ranking/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/participants/new/ranking/template.sql').default,
  },
    
  'orgs/participants/new/total': {
    config: require('@/configs/endpoints/orgs/participants/new/total/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/participants/new/total/template.sql').default,
  },
    
  'orgs/participants/new/trends': {
    config: require('@/configs/endpoints/orgs/participants/new/trends/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/participants/new/trends/template.sql').default,
  },
    
  'orgs/participants/organizations': {
    config: require('@/configs/endpoints/orgs/participants/organizations/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/participants/organizations/template.sql').default,
  },
    
  'orgs/participants/organizations/completion-rate': {
    config: require('@/configs/endpoints/orgs/participants/organizations/completion-rate/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/participants/organizations/completion-rate/template.sql').default,
  },
    
  'orgs/participants/roles': {
    config: require('@/configs/endpoints/orgs/participants/roles/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/participants/roles/template.sql').default,
  },
    
  'orgs/participants/trends': {
    config: require('@/configs/endpoints/orgs/participants/trends/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/participants/trends/template.sql').default,
  },
    
  'orgs/pull-requests/actions/trends': {
    config: require('@/configs/endpoints/orgs/pull-requests/actions/trends/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/pull-requests/actions/trends/template.sql').default,
  },
    
  'orgs/pull-requests/merged-ratio': {
    config: require('@/configs/endpoints/orgs/pull-requests/merged-ratio/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/pull-requests/merged-ratio/template.sql').default,
  },
    
  'orgs/pull-requests/open-to-close-duration/medium': {
    config: require('@/configs/endpoints/orgs/pull-requests/open-to-close-duration/medium/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/pull-requests/open-to-close-duration/medium/template.sql').default,
  },
    
  'orgs/pull-requests/open-to-close-duration/top-repos': {
    config: require('@/configs/endpoints/orgs/pull-requests/open-to-close-duration/top-repos/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/pull-requests/open-to-close-duration/top-repos/template.sql').default,
  },
    
  'orgs/pull-requests/open-to-first-response-duration/medium': {
    config: require('@/configs/endpoints/orgs/pull-requests/open-to-first-response-duration/medium/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/pull-requests/open-to-first-response-duration/medium/template.sql').default,
  },
    
  'orgs/pull-requests/open-to-first-response-duration/top-repos': {
    config: require('@/configs/endpoints/orgs/pull-requests/open-to-first-response-duration/top-repos/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/pull-requests/open-to-first-response-duration/top-repos/template.sql').default,
  },
    
  'orgs/pull-requests/self-merged-ratio': {
    config: require('@/configs/endpoints/orgs/pull-requests/self-merged-ratio/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/pull-requests/self-merged-ratio/template.sql').default,
  },
    
  'orgs/pull-requests/total': {
    config: require('@/configs/endpoints/orgs/pull-requests/total/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/pull-requests/total/template.sql').default,
  },
    
  'orgs/pull-requests/trends': {
    config: require('@/configs/endpoints/orgs/pull-requests/trends/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/pull-requests/trends/template.sql').default,
  },
    
  'orgs/repos': {
    config: require('@/configs/endpoints/orgs/repos/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/repos/template.sql').default,
  },
    
  'orgs/repos/active/ranking': {
    config: require('@/configs/endpoints/orgs/repos/active/ranking/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/repos/active/ranking/template.sql').default,
  },
    
  'orgs/repos/active/total': {
    config: require('@/configs/endpoints/orgs/repos/active/total/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/repos/active/total/template.sql').default,
  },
    
  'orgs/reviews/open-to-first-review-duration/medium': {
    config: require('@/configs/endpoints/orgs/reviews/open-to-first-review-duration/medium/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/reviews/open-to-first-review-duration/medium/template.sql').default,
  },
    
  'orgs/reviews/open-to-first-review-duration/top-repos': {
    config: require('@/configs/endpoints/orgs/reviews/open-to-first-review-duration/top-repos/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/reviews/open-to-first-review-duration/top-repos/template.sql').default,
  },
    
  'orgs/reviews/review-comments/top-repos': {
    config: require('@/configs/endpoints/orgs/reviews/review-comments/top-repos/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/reviews/review-comments/top-repos/template.sql').default,
  },
    
  'orgs/reviews/review-prs/trends': {
    config: require('@/configs/endpoints/orgs/reviews/review-prs/trends/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/reviews/review-prs/trends/template.sql').default,
  },
    
  'orgs/reviews/reviewed-ratio': {
    config: require('@/configs/endpoints/orgs/reviews/reviewed-ratio/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/reviews/reviewed-ratio/template.sql').default,
  },
    
  'orgs/reviews/total': {
    config: require('@/configs/endpoints/orgs/reviews/total/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/reviews/total/template.sql').default,
  },
    
  'orgs/reviews/trends': {
    config: require('@/configs/endpoints/orgs/reviews/trends/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/reviews/trends/template.sql').default,
  },
    
  'orgs/stars/locations': {
    config: require('@/configs/endpoints/orgs/stars/locations/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/stars/locations/template.sql').default,
  },
    
  'orgs/stars/locations/completion-rate': {
    config: require('@/configs/endpoints/orgs/stars/locations/completion-rate/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/stars/locations/completion-rate/template.sql').default,
  },
    
  'orgs/stars/organizations': {
    config: require('@/configs/endpoints/orgs/stars/organizations/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/stars/organizations/template.sql').default,
  },
    
  'orgs/stars/organizations/completion-rate': {
    config: require('@/configs/endpoints/orgs/stars/organizations/completion-rate/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/stars/organizations/completion-rate/template.sql').default,
  },
    
  'orgs/stars/top-repos': {
    config: require('@/configs/endpoints/orgs/stars/top-repos/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/stars/top-repos/template.sql').default,
  },
    
  'orgs/stars/total': {
    config: require('@/configs/endpoints/orgs/stars/total/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/stars/total/template.sql').default,
  },
    
  'orgs/stars/trends': {
    config: require('@/configs/endpoints/orgs/stars/trends/params.json'),
    templateSQL: require('@/configs/endpoints/orgs/stars/trends/template.sql').default,
  },
    
}
