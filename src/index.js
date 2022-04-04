import fetchCountries from './js/fetchCountries';
import countryTemplateMarkup from './templates/country-info-tmpl.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onSearchBoxInput, DEBOUNCE_DELAY));

function onSearchBoxInput(e) {
  const { value: userQuery } = e.target;

  fetchCountries(userQuery)
    .then(response => response.json())
    .then(renderCountryInfo);
}

function renderCountryInfo(countryArr) {
  const countriesReturned = getQuantatyOfCountries(countryArr);

  if (countriesReturned.moreThanTen) {
    alertNotification();
    return;
  }

  refs.countryList.insertAdjacentHTML(
    'beforeend',
    countryTemplateMarkup({ countryArr, countriesReturned }),
  );
}

function getQuantatyOfCountries(data) {
  return {
    fromTwoToTen: data.length > 2 && data.length < 10,
    moreThanTen: data.length > 10,
  };
}

function alertNotification() {
  Notify.info('To many matches found. Please enter more specific name');
}
