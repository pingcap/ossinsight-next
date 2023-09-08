const API_SERVER = 'https://api.ossinsight.io';
const PATH_GET_ORG_INFO = `/q/get-user-by-login`;
const PATH_GET_ORG_OVERVIEW = `/q/orgs/overview`;
const PATH_GET_ORG_STARS_LOCATIONS = `/q/orgs/stars/locations`;
const PATH_GET_ORG_PARTICIPANT_LOCATIONS = `/q/orgs/participants/locations`;
const PATH_GET_ORG_PARTICIPANT_ORGS = `/q/orgs/participants/organizations`;

export const getOrgInfo = (login: string) => {
  return fetch(`${API_SERVER}${PATH_GET_ORG_INFO}?login=${login}`)
    .then((res) => res.json())
    .then((data) => data.data);
};

export const getOrgOverview = (id: number) => {
  return fetch(`${API_SERVER}${PATH_GET_ORG_OVERVIEW}?ownerId=${id}`).then(
    (res) => res.json()
  );
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
  params: { activity: 'stars' | 'participants'; period?: string }
): Promise<StarLocationDataType[] | ParticipantLocationDataType[]> => {
  let path = PATH_GET_ORG_STARS_LOCATIONS;

  if (params.activity === 'participants') {
    path = PATH_GET_ORG_PARTICIPANT_LOCATIONS;
  }

  const paramsStr = params2UrlSearch({ ...params, ownerId: id });

  return fetch(`${API_SERVER}${path}?${paramsStr}`)
    .then((res) => res.json())
    .then((data) => data.data);
};

export type ParticipateOrgDataType = {
  organization_name: string;
  participants: number;
};

export const getOrgParticipateOrgs = (
  id: number,
  params?: { period?: string }
): Promise<ParticipateOrgDataType[]> => {
  const paramsStr = params2UrlSearch({ ...params, ownerId: id });

  return fetch(`${API_SERVER}${PATH_GET_ORG_PARTICIPANT_ORGS}?${paramsStr}`)
    .then((res) => res.json())
    .then((data) => data.data);
};
