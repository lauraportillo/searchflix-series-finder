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
    const id = shows[i].show.id;
    html += `<li class="serieList__card js-show" id="${id}">`;
    html += `<h3 class="serieList__card--title">`;
    html += `${name}`;
    html += `</h3>`;
    if (image === null) {
      html += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?"
         class="card__img" alt="no image">`;
    } else {
      html += `<img src="${image.medium}" class="card__img" alt="Imagen de ${name}">`;
    }
    html += `</li>`;
  }
  showsContainer.innerHTML = html;
  handleAddCardListeners();
}

//funcion paint favorites parecida a paintshows que pinte el array de favoritos en favotite conteiners casi igual

function handleAddCardListeners() {
  const showListener = document.querySelectorAll('.js-show');
  for (const show of showListener) {
    show.addEventListener('click', handleClickShow);
  }
}

function handleClickShow(ev) {
  const selectedId = parseInt(ev.currentTarget.id); // id lo pasamos a numero
  const selectedObjet = shows.find((object) => object.show.id === selectedId); // busca el objeto que tiene ese id
  favorites.push(selectedObjet); // guarda el objeto en let favorites
  console.log(selectedObjet);
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
