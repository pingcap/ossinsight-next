import geo from './geo.json';
import code from './code.json';

const geoMap: Record<string, { long: number; lat: number }> = geo.reduce(
  (p, { code, long, lat }) => {
    p[code] = { long, lat };
    return p;
  },
  {}
);

export const alpha2ToTitle = (alpha2: string) => {
  if (alpha2 === "UND") return "Unknown";
  return code[alpha2];
};

export const alpha2ToGeo = (alpha2: string) => {
  return geoMap[alpha2];
};
