`use strict`;
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});
const galleryContainer = document.querySelector('.gallery');
export function createGallery(images) {
    const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {  
      return `
        <li class="gallery-item">
          <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" />
          </a>
          <div class="info">
            <p>Likes: <span>${likes}</span></p>
            <p>Views: <span>${views}</span></p>
            <p>Comments: <span>${comments}</span></p>
            <p>Downloads: <span>${downloads}</span></p>
          </div>
        </li>
      `;
    }).join('');

galleryContainer.insertAdjacentHTML('beforeend', markup);
lightbox.refresh();
}

export function clearGallery() {
    galleryContainer.innerHTML = '';
}

export function showLoader() {
  const loader = document.querySelector('.loader');
  loader.classList.remove('hidden');
  requestAnimationFrame(() => {
    loader.classList.add('show'); 
  });
}

export function hideLoader() {
  const loader = document.querySelector('.loader');
  loader.classList.remove('show');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 400); 
}

export function showLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-btn');
    loadMoreBtn.classList.remove('hidden');
  }
  
  export function hideLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-btn');
    loadMoreBtn.classList.add('hidden');
  }
