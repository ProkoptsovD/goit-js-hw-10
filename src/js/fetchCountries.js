const BASE_URL = 'https://restcountries.com/v3.1/';
const NAME_END_POINT = 'name';

export default function fetchCountries(countryName, endPoint = NAME_END_POINT) {
  return fetch(
    `${BASE_URL}${endPoint}/${countryName}?fields=name,capital,population,flags,languages`,
  );
}
