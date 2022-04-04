const BASE_URL = 'https://restcountries.com/v3.1/';

export default class SearchFormAPI {
  constructor(searchBarElem) {
    this.refs = this.getElementsRefs(searchBarElem);
  }

  getElementsRefs(targetElement) {
    const input = document.querySelector(targetElement);
    const countryList = input.nextElementSibling;
    const countryInfo = countryList.nextElementSibling;

    return { input, countryList, countryInfo };
  }

  fetchCountries(country) {
    return fetch(`${BASE_URL}name/${country}`);
  }
}
