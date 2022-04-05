import { fetchCountriesByName } from './js/fetchCountries';
import createMarkupFromTemplate from './templates/country-info-tmpl.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { warningOptn, notificationMessages } from './js/notifyOptions';
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

  if (!userQuery) {
    destroyRenderedMarkup();
    return;
  }

  fetchCountriesByName(userQuery.trim())
    .then(response => response.json())
    .then(handleData)
    .catch(error => {
      console.log(error);
      Notify.warning(notificationMessages.warning, warningOptn);
    });
}

function handleData(data) {
  try {
    const countriesReturned = getQuantatyOfCountries(data);
    const markup = createMarkupFromTemplate({ data, countriesReturned });

    if (countriesReturned.nothingFound) {
      Notify.failure(notificationMessages.failure);
      console.clear();
      return;
    }

    if (countriesReturned.moreThanTen) {
      Notify.info(notificationMessages.info);
      return;
    }

    destroyRenderedMarkup();

    countriesReturned.fromTwoToTen
      ? inserMarkupTo(refs.countryList, markup)
      : inserMarkupTo(refs.countryInfo, markup);
  } catch (error) {
    console.log(error);
  }
}

function getQuantatyOfCountries(data) {
  return {
    fromTwoToTen: data?.length > 2 && data?.length < 10,
    moreThanTen: data?.length > 10,
    nothingFound: data?.status,
  };
}

function inserMarkupTo(elem, markup) {
  elem.insertAdjacentHTML('beforeend', markup);
}

function destroyRenderedMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
