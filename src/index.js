import Notiflix from 'notiflix';
import { Report } from 'notiflix/build/notiflix-report-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.css';
import axios from 'axios';

const form = document.querySelector('#search-form');
const gallary = document.querySelector('.js-gallery');

form.addEventListener('submit', handlerSearch);

function handlerSearch(evt) {
  evt.preventDefault();
  search(form.elements.searchQuery.value)
    .then(data => {
      if (data.hits.length === 0) {
        throw new Error('Error');
      }

      gallary.innerHTML = createMarkup(data.hits);
      let lightbox = new SimpleLightbox('.photo-card a', {
        captionsData: 'alt',
        captionDelay: 250,
      });
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
        if (data) {
            
        }
        observer
    })
    .catch(err => {
      console.log(err);
      gallary.innerHTML = '';
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

async function search(searchUser) {
  const resp = await axios('https://pixabay.com/api/', {
    params: {
      method: 'GET',
      key: '39312014-788d6a707d683cf983edb84a2',
      q: `${searchUser}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
    },
  });
  console.log(resp);

  return resp.data;
}

function createMarkup(arr) {
  const markup = arr
    .map(
      item => `<div class="photo-card">
        <a href="${item.largeImageURL}" class="gallery_link"><img class="gallary-img" src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/></a>
        <div class="info">
        <p class="info-item">
            <b>Likes: ${item.likes}</b>
        </p>
        <p class="info-item">
            <b>Views: ${item.views}</b>
        </p>
        <p class="info-item">
            <b>Comments: ${item.comments}</b>
        </p>
        <p class="info-item">
            <b>Downloads: ${item.downloads}</b>
        </p>
        </div></div>`
    )
    .join('');

  return markup;
}

let observer = new IntersectionObserver(callback, options);
let options = {
  root: document.querySelector('#scrollArea'),
  rootMargin: '300px',
 
};
