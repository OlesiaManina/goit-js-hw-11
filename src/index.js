import fetchData from "./fetchImg";
import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formRef = document.querySelector('#search-form')
const galleryRef = document.querySelector('.gallery');
const inputRef = document.querySelector('input[name="searchQuery"]');

const loadMoreBtnRef = document.querySelector('button[type="button"]');
loadMoreBtnRef.style.visibility = 'hidden';
let lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let searchQuery = '';
let pageNumber = 1;
let images = [];
let isIntersecting = false;

formRef.addEventListener('submit', onSearch);

async function onSearch(event) {
    event.preventDefault();
    galleryRef.innerHTML = '';
    
    searchQuery = event.currentTarget.elements.searchQuery.value.trim();
    if (searchQuery !== '') {
     pageNumber = 1;
    fetchImg(searchQuery, pageNumber);
    pageNumber += 1; 
    } else  {
      Notiflix.Notify.failure("Sorry, your search query is empty. Please try again.")
    }
    document.getElementById('search-form').reset();
}

async function fetchImg(searchQuery, pageNumber) {
        try {
          let images = await fetchData(searchQuery, pageNumber) 

            if (images.data.hits.length !== 0) {
             renderImg(images, pageNumber);
              lightBox.refresh();
          
            } else {
             return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            }
        } catch (error) {
            console.error(error);
        }
}

 function renderImg(response, pageNumber) {
  const images = response.data.hits;
  const totalHits = response.data.totalHits;
  const lastPage = Math.ceil(totalHits / 40);
 
    renderMarkup(images);
    if (pageNumber === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (lastPage === pageNumber) {
    loadMoreBtnRef.style.visibility = 'hidden';
     Notiflix.Notify.info("We're sorry, but you've reached the end of search results.") 
    }
 }

    function renderMarkup(images) {
      console.log(images.length);
        const markup = images.map((image) => {
            const {webformatURL, largeImageURL, tags, likes, views, comments, downloads} = image;
          return `<a href="${largeImageURL}">
          <div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" class="info-img"/>
          <div class="info">
            <p class="info-item">
              <b>Likes: ${likes}</b>
            </p>
            <p class="info-item">
              <b>Views: ${views}</b>
            </p>
            <p class="info-item">
              <b>Comments: ${comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads: ${downloads}</b>
            </p>
          </div>
        </div>
        </a>`;
        })
        .join("");
        galleryRef.insertAdjacentHTML('beforeend', markup);
  
        // observer.observe(loadMoreBtnRef);
        loadMoreBtnRef.style.visibility = 'visible';
    }

loadMoreBtnRef.addEventListener('click', () => {
  fetchImg(searchQuery, pageNumber);
      const { height: cardHeight } = document
              .querySelector(".gallery")
              .firstElementChild.getBoundingClientRect();

              window.scrollBy({
              top: cardHeight * 2,
              behavior: "smooth",});
      pageNumber += 1;
});

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          fetchImg(searchQuery, pageNumber);
          pageNumber += 1;
        }
      }
    },
    { rootMargin: '400px' },
  );




