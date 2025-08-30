export interface YearData {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  methane?: number;
  nitrous_oxide?: number;
  gdp?: number;
  [key: string]: number | undefined;
}

export interface CountryEntry {
  iso_code?: string;
  data: YearData[];
}

export type Co2Data = Record<string, CountryEntry>;
