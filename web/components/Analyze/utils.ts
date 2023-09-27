import { handleOApi } from '@ossinsight/widgets-core/src/utils/oapi';

const API_SERVER = 'https://api.ossinsight.io';
const PATH_GET_ORG_INFO = `/q/get-user-by-login`;
const PATH_GET_ORG_OVERVIEW = `/q/orgs/overview`;
const PATH_GET_ORG_STARS_LOCATIONS = `/q/orgs/stars/locations`;
const PATH_GET_ORG_STARS_ORGS = `/q/orgs/stars/organizations`;
const PATH_GET_ORG_PARTICIPANT_LOCATIONS = `/q/orgs/participants/locations`;
const PATH_GET_ORG_PARTICIPANT_ORGS = `/q/orgs/participants/organizations`;
const PATH_GET_USERS = `/gh/users/`;
const PATH_GET_REPO_BY_ID = `/gh/repositories/`;

export interface OwnerInfo {
  type: 'User' | 'Organization' | 'Bot';
  login: string;
  name: string;
  id: number;
  bio: string;
  public_repos: number;
}

export const getOwnerInfo = (owner: string): Promise<OwnerInfo> => {
  return fetch(`${API_SERVER}${PATH_GET_USERS}${encodeURIComponent(owner)}`)
    .then(handleOApi);
};

export const getOrgInfo = (login: string) => {
  return fetch(`${API_SERVER}${PATH_GET_ORG_INFO}?login=${login}`)
    .then(handleOApi);
};

export const getOrgOverview = (id: number) => {
  return fetch(`${API_SERVER}${PATH_GET_ORG_OVERVIEW}?ownerId=${id}`)
    .then(handleOApi);
};

export const params2UrlSearch = (params: {
  [x: string | number]: string | number;
}) => {
  return Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&');
};

export type StarLocationDataType = {
  country_code: string;
  stars: number;
};

export type ParticipantLocationDataType = {
  country_code: string;
  participants: number;
};

export const getOrgActivityLocations = (
  id: number,
  params: { activity: 'stars' | 'participants'; period?: string; role?: string },
): Promise<StarLocationDataType[] | ParticipantLocationDataType[]> => {
  let path = PATH_GET_ORG_STARS_LOCATIONS;

  if (params.activity === 'participants') {
    path = PATH_GET_ORG_PARTICIPANT_LOCATIONS;
  }

  const paramsStr = params2UrlSearch({ ...params, ownerId: id });

  return fetch(`${API_SERVER}${path}?${paramsStr}`)
    .then(handleOApi);
};

export type ParticipateOrgDataType = {
  organization_name: string;
  participants: number;
};

export type StarOrgDataType = {
  organization_name: string;
  stars: number;
};

export const getOrgActivityOrgs = (
  id: number,
  params?: {
    period?: string;
    activity: 'stars' | 'participants';
    role?: string;
  },
): Promise<ParticipateOrgDataType[] | StarOrgDataType[]> => {
  const { activity = 'stars', ...restParams } = params || {};
  const paramsStr = params2UrlSearch({ ...restParams, ownerId: id });

  let path = PATH_GET_ORG_STARS_ORGS;
  if (activity === 'participants') {
    path = PATH_GET_ORG_PARTICIPANT_ORGS;
  }

  return fetch(`${API_SERVER}${path}?${paramsStr}`)
    .then(handleOApi);
};

export const getUserInfo = (login: string | number) => {
  return fetch(`${API_SERVER}${PATH_GET_USERS}${login}`)
    .then(handleOApi);
};

// // ! TODO remove this, use getRepoInfoByOwnerId instead
// export const getRepoInfoById = (repoId: number | string) => {
//   return fetch(`${API_SERVER}${PATH_GET_REPO_BY_ID}${repoId}`)
//     .then(handleOApi)
//     .then((data) => ({
//       id: data.id,
//       fullName: data.full_name,
//       defaultBranch: data.default_branch,
//     }));
// };

export function getRepoListByOrgId(ownerId: number | string) {
  return fetch(
    `https://api.ossinsight.io/q/orgs/repos?ownerId=${ownerId}&format=array`
  )
    .then((res) => res.json())
    .then((res: { data: [number, string][] }) => res.data);
  // .then((res: { data: [number, string][] }) =>
  //   res.data.map(([id, name]) => ({
  //     id,
  //     name: name.split('/')[1],
  //     fullName: name,
  //   }))
  // );
}

export const getRepoInfoByOwnerId = async (ownerId: number | string) => {
  const reposInfo = await getRepoListByOrgId(ownerId);
  return reposInfo.reduce((acc: Record<number, string>, cur) => {
    acc[cur[0]] = cur[1];
    return acc;
  }, {});
};
