const BASE_URL = 'https://restcountries.com/';

function fetchCountriesByName(countryName) {
  return fetch(
    `${BASE_URL}v3.1/name/${countryName}?fields=name,capital,population,flags,languages`,
  );
}

export { fetchCountriesByName };
