import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton
} from './js/render-functions.js';

let currentPage = 1;
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

  currentPage = 1;
  loadedImages = 0;

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalImages = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'Oops',
        message: 'No images found',
        position: 'topRight',
      });
      hideLoadMoreButton();
      return;
    }

    createGallery(data.hits);
    loadedImages = data.hits.length;
    showLoadMoreButton();
    currentPage++;
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
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (data.hits.length === 0) {
      hideLoadMoreButton();
      return;
    }

    createGallery(data.hits);
    loadedImages += data.hits.length;

    if (loadedImages >= totalImages) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

    currentPage++;
  } catch (error) {
    console.error(error);
  } finally {
    hideLoader();
  }
});