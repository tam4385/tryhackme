export type Hotel = { _id: string, chain_name: string; hotel_name: string; city: string, country: string };
export type Country = { country: string, _id: string };
export type City = { name: string, _id: string };
export type Results = { hotels: Hotel[], countries: Country[], cities: City[] }
