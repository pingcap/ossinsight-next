import parseRepoId from './repo-id';

const parsers: Record<string, (value: string) => unknown> = {
  'repo-id': parseRepoId,
  'user-id': parseRepoId,
};

export default parsers;
