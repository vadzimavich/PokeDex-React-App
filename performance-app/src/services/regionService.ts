interface CountryRegionInfo {
  cca3: string;
  region: string;
}

export type RegionMap = Map<string, string>;

let regionMapPromise: Promise<RegionMap> | null = null;

export const getRegionMap = (): Promise<RegionMap> => {
  if (regionMapPromise) {
    return regionMapPromise;
  }

  regionMapPromise = fetch(
    'https://restcountries.com/v3.1/all?fields=cca3,region'
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch region data');
      }
      return response.json();
    })
    .then((countries: CountryRegionInfo[]) => {
      const regionMap: RegionMap = new Map();
      for (const country of countries) {
        if (country.cca3 && country.region) {
          regionMap.set(country.cca3, country.region);
        }
      }
      return regionMap;
    })
    .catch((_error) => {
      regionMapPromise = null;
      return new Map();
    });

  return regionMapPromise;
};
