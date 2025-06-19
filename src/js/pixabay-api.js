'use strict';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '50743656-f34c73b2fc7295c80e7e7c3d4';


let currentPage = 1;
const perPage = 15;
let currentQuery = '';


export async function getImagesByQuery(query, page = 1) {
  try {
    const response = await axios.get('', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });

    return response.data;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Sorry, there are no images matching your search query. Please try again!`,
      position: 'topRight',
    });
    throw error;
  }
}


export function resetPage(newQuery) {
  if (newQuery !== currentQuery) {
    currentQuery = newQuery;
    currentPage = 1;
  }
}

export function getCurrentPage() {
  return currentPage;
}

export function incrementPage() {
  currentPage += 1;
}