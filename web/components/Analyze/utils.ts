const API_SERVER = 'https://api.ossinsight.io';
const PATH_GET_ORG_INFO = `/q/get-user-by-login`;
const PATH_GET_ORG_OVERVIEW = `/q/orgs/overview`;
const PATH_GET_ORG_STARS_LOCATIONS = `/q/orgs/stars/locations`;

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

export type StarLocationDataType = {
  country_code: string;
  stars: number;
};

export const getOrgStarsLocations = (
  id: number
): Promise<StarLocationDataType[]> => {
  return fetch(`${API_SERVER}${PATH_GET_ORG_STARS_LOCATIONS}?ownerId=${id}`)
    .then((res) => res.json())
    .then((data) => data.data);
};
