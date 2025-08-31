import {
  type Co2Data,
  type ProcessedCountry,
  type YearData,
} from '../types/co2Data';

const findPopulationByYear = (
  data: YearData[],
  year: number
): { year: number; value: number } | null => {
  const yearData = data.find((d) => d.year === year);
  if (
    yearData &&
    yearData.population !== undefined &&
    yearData.population !== null
  ) {
    return { year: yearData.year, value: yearData.population };
  }
  return null;
};

export const processCo2Data = (
  rawData: Co2Data,
  selectedYear: number
): ProcessedCountry[] => {
  const processedCountries: ProcessedCountry[] = [];

  for (const countryName in rawData) {
    const countryData = rawData[countryName];

    if (countryData.iso_code) {
      const populationForYear = findPopulationByYear(
        countryData.data,
        selectedYear
      );

      processedCountries.push({
        name: countryName,
        isoCode: countryData.iso_code,
        populationForYear,
        data: countryData.data,
      });
    }
  }

  return processedCountries;
};

export const getAllYears = (rawData: Co2Data): number[] => {
  const yearSet = new Set<number>();
  for (const countryName in rawData) {
    const countryData = rawData[countryName];
    if (countryData.iso_code) {
      for (const yearData of countryData.data) {
        yearSet.add(yearData.year);
      }
    }
  }
  return Array.from(yearSet).sort((a, b) => b - a);
};
