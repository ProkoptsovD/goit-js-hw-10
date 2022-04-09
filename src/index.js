//==================libs==================================//
const debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { warningOptn, notificationMessages } from './js/notifyOptions';

//==================handlebars tmpls=============================//
import createMarkupCountryInfo from './templates/country-info-tmpl.hbs';
import createMarkupCountryList from './templates/country-list-tmpl.hbs';

// =================function to reach API=============================//
import { fetchCountriesByName } from './js/fetchCountries';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onSearchBoxInput, DEBOUNCE_DELAY));

function onSearchBoxInput(e) {
  const { value } = e.target;
  const userQuery = value.trim();

  if (!userQuery) {
    destroyRenderedMarkup();
    return;
  }

  fetchCountriesByName(userQuery)
    .then(response => response.json())
    .then(handleData)
    .catch(handleError);
}

function handleData(data) {
  const countriesReturned = {
    zero: data?.status == 404,
    fromTwoToTen: data?.length > 2 && data?.length < 10,
    moreThanTen: data?.length > 10,
  };

  destroyRenderedMarkup();

  if (countriesReturned.zero) {
    Notify.failure(notificationMessages.failure);
    console.clear();
    return;
  }

  if (countriesReturned.moreThanTen) {
    Notify.info(notificationMessages.info);
    return;
  }

  countriesReturned.fromTwoToTen
    ? inserMarkupTo(refs.countryList, createMarkupCountryList(data))
    : inserMarkupTo(refs.countryInfo, createMarkupCountryInfo(data));
}

function inserMarkupTo(elem, markup) {
  elem.insertAdjacentHTML('beforeend', markup);
}

function destroyRenderedMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function handleError(error) {
  console.log(error);
  Notify.warning(notificationMessages.warning, warningOptn);
}
