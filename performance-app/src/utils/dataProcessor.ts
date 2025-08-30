import {
  type Co2Data,
  type ProcessedCountry,
  type YearData,
} from '../types/co2Data';

const findLatestPopulation = (
  data: YearData[]
): { year: number; value: number } | null => {
  for (let i = data.length - 1; i >= 0; i--) {
    const yearData = data[i];
    if (yearData.population !== undefined && yearData.population !== null) {
      return { year: yearData.year, value: yearData.population };
    }
  }
  return null;
};

export const processCo2Data = (rawData: Co2Data): ProcessedCountry[] => {
  const processedCountries: ProcessedCountry[] = [];

  for (const countryName in rawData) {
    const countryData = rawData[countryName];

    if (countryData.iso_code) {
      const latestPopulation = findLatestPopulation(countryData.data);

      processedCountries.push({
        name: countryName,
        isoCode: countryData.iso_code,
        latestPopulation,
        data: countryData.data,
      });
    }
  }

  return processedCountries;
};
