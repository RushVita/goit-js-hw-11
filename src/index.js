import Notiflix from 'notiflix';
import { Report } from 'notiflix/build/notiflix-report-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.css';
import axios from 'axios';

const form = document.querySelector('#search-form');
const gallary = document.querySelector('.js-gallery');
const guard = document.querySelector('.js-guard');
const endSearch = document.querySelector('.js-end-search');

form.addEventListener('submit', handlerSearch);

function handlerSearch(evt) {
  evt.preventDefault();
  search(1, form.elements.searchQuery.value)
    .then(data => {
      if (form.elements.searchQuery.value.trim() === '') {
        throw new Error('Error');
      }
      if (data.hits.length === 0) {
        throw new Error('Error');
      }
      gallary.innerHTML = '';
      observer.observe(guard);
      gallary.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      gallerybBox.refresh();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(err => {
      form.reset();
      gallary.innerHTML = '';
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

async function search(page, searchUser) {
  const resp = await axios('https://pixabay.com/api/', {
    params: {
      method: 'GET',
      key: '39312014-788d6a707d683cf983edb84a2',
      q: `${searchUser}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
      page: page,
    },
  });

  return resp.data;
}
let page = 1;

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
const options = {
  root: null,
  rootMargin: '700px',
};
const observer = new IntersectionObserver(handlerMorePages, options);

function handlerMorePages(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;

      search(page, form.elements.searchQuery.value)
        .then(data => {
          gallary.insertAdjacentHTML('beforeend', createMarkup(data.hits));
          gallerybBox.refresh();
          if (page * 40 >= data.totalHits) {
            page = 1;
            observer.unobserve(guard);
            endSearch.style.display = 'block';
          }
        })
        .catch(err => {
          return Notiflix.Notify.info(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        });
    }
  });
}

let gallerybBox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});
