import fetchData from "./fetchImg";
import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formRef = document.querySelector('#search-form')
const galleryRef = document.querySelector('.gallery');
const inputRef = document.querySelector('input[name="searchQuery"]');
console.log(inputRef);

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
      // let pageNumber = 1;
    fetchImg(searchQuery, pageNumber);
    pageNumber += 1; 
    } else  {
      Notiflix.Notify.failure("Sorry, your search query is empty. Please try again.")
    }
    // pageNumber += 1; 
    document.getElementById('search-form').reset();
}

async function fetchImg(searchQuery, pageNumber) {
  // pageNumber += 1; 
        try {
          let images = await fetchData(searchQuery, pageNumber) 
            if (images !== []) {
               renderImg(images);
              lightBox.refresh();
            } else {
              Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            }
        } catch (error) {
            console.error(error);
        }
}

 function renderImg(response) {
  const images = response.data.hits;
  const totalHits = response.data.totalHits;
  const delta = totalHits - images.length * pageNumber;

    if (images.length !== 0) {
      renderMarkup(images);
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    } else if (images.length < delta) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        loadMoreBtnRef.disabled = true;}
       else {
       Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
 }

    function renderMarkup(images) {
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
        observer.observe(loadMoreBtnRef);
        // loadMoreBtnRef.style.visibility = 'visible';
    }

// loadMoreBtnRef.addEventListener('click', () => {
//   pageNumber += 1;
//   fetchImg(searchQuery, pageNumber);
//       const { height: cardHeight } = document
//               .querySelector(".gallery")
//               .firstElementChild.getBoundingClientRect();

//               window.scrollBy({
//               top: cardHeight * 2,
//               behavior: "smooth",});
// });

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




