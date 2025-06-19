import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import {
  getImagesByQuery,
  resetPage,
  getCurrentPage,
  incrementPage
} from './js/pixabay-api.js';

import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton
} from './js/render-functions.js';

let currentQuery = '';
let totalImages = 0;
let loadedImages = 0;

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-btn');

hideLoadMoreButton();

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  clearGallery();
  showLoader();
  hideLoadMoreButton();

  currentQuery = event.currentTarget.elements['search-text'].value.trim();

  if (!currentQuery) {
    iziToast.error({
      title: 'Warning',
      message: 'Please enter a search term',
      position: 'topRight',
      backgroundColor: 'orange',
    });
    form.reset();
    hideLoader();
    return;
  }

  resetPage();
  loadedImages = 0;

  try {
    const data = await getImagesByQuery(currentQuery, getCurrentPage());
    totalImages = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'Oops',
        message: 'No images found',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);
    loadedImages = data.hits.length;

    if (loadedImages < totalImages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

    incrementPage();
  } catch (error) {
    console.error(error);
  } finally {
    hideLoader();
    form.reset();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, getCurrentPage());

    if (data.hits.length === 0) {
      hideLoadMoreButton();
      return;
    }

    createGallery(data.hits);
    loadedImages += data.hits.length;

    const { height: cardHeight } = document
      .querySelector('.gallery-item')
      .getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (loadedImages < totalImages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

    incrementPage();
  } catch (error) {
    console.error(error);
  } finally {
    hideLoader();
  }
});