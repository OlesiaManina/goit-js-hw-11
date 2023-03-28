import fetchData from "./fetchImg";
import Notiflix from 'notiflix';
import './css/styles.css'

const formRef = document.querySelector('#search-form')
const galleryRef = document.querySelector('.gallery');
const inputRef = document.querySelector('input[name="searchQuery"]');
const searchBtnRef = document.querySelector('button[type="submit"]');
const loadMoreBtnRef = document.querySelector('button[type="button"]');

let searchQuery = '';
// galleryRef.innerHTML = '';
let images = [];
loadMoreBtnRef.style.visibility = 'hidden';
const pageNumber = 1;
let inputValue = null;
let previousImg = [];


formRef.addEventListener('submit', onSearch);

async function onSearch(event) {
    event.preventDefault();
    galleryRef.innerHTML = '';
    
    searchQuery = event.currentTarget.elements.searchQuery.value;

    fetchImg(searchQuery, pageNumber);
}

async function fetchImg(searchQuery, pageNumber) {
    if (searchQuery) {
        try {
          
             await fetchData(searchQuery, pageNumber).then((images) => {
              // const images = response.data.hits;
              // const imagesData = images.data.hits;
              // previousImg = [...imagesData];
              // console.log(previousImg);
              // pageNumber += 1;
             return renderImg(images)})
            
        } catch (error) {
            console.error(error);
            
        }
  
    }
}

// console.log(searchQuery);

 function renderImg(response) {
  const images = response.data.hits;
    if (images !== []) {
      console.log(images);
        const markup = images.map((image) => {
            const {webformatURL, largeImageURL, tags, likes, views, comments, downloads} = image;
          return `<div class="photo-card">
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
        </div>`;
        })
        .join("");
        galleryRef.innerHTML = markup;
        loadMoreBtnRef.style.visibility = 'visible';
    } else if (images.length === 0) {
       return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
}

loadMoreBtnRef.addEventListener('click', (searchQuery, pageNumber) => {
  // pageNumber += 1;
  // const previousImg = [...images];
  fetchImg(searchQuery, pageNumber);

});
