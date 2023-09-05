import { RemoteRepoInfo } from '../GHRepoSelector';
import { RemoteUserInfo } from '../GHUserSelector';

export type UserTuple = {
  type: 'user'
  value: RemoteUserInfo | undefined
}
export type RepoTuple = {
  type: 'repo'
  value: RemoteRepoInfo | undefined
}

export type OrgTuple = {
  type: 'org'
  value: RemoteUserInfo | undefined // TODO - Change to RemoteOrgInfo
}

export type AnalyzeTuple = UserTuple | RepoTuple | OrgTuple;
