'use strict';

const inputElement = document.querySelector('.js-input');
const valueElement = inputElement.value; //lo que escriba la usuaria está aqui
const resetElement = document.querySelector('.js-reset');
const searchElement = document.querySelector('.js-search');
const showsContainer = document.querySelector('.js-showsContainer');

// variables globales
let shows = [];
let favorites = [];

// api
function getDataFromApi() {
  const valueElement = inputElement.value; //lo que escriba la usuaria está aqui
  console.log(valueElement);
  fetch(`http://api.tvmaze.com/search/shows?q=${valueElement}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      shows = data;
      paintShows();
    });
}
getDataFromApi();

// paint

function paintShows() {
  let html = '';
  for (let i = 0; i < shows.length; i++) {
    const name = shows[i].show.name;
    const image = shows[i].show.image;
    html += `<li class="card">`;
    html += `${name}`;
    if (image === null) {
      html += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?"
         class="card__img" alt="no image">`;
    } else {
      html += `<img src="${image.medium}" class="card__img" alt="Imagen de ${name}">`;
    }
    html += `</li>`;
  }
  showsContainer.innerHTML = html;
}

// como el ejercicio de star wars
function resetInfo() {
  location.reload();
}
function start(ev) {
  ev.preventDefault();
  getDataFromApi();
}
resetElement.addEventListener('click', resetInfo);
searchElement.addEventListener('click', start); // sin preventDefault no me funcionaba la web porque se "enviaba" y me recargaba la página
