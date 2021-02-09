'use strict';

const inputElement = document.querySelector('.js-input');
const valueElement = inputElement.value; //lo que escriba la usuaria está aqui
const resetElement = document.querySelector('.js-reset');
const searchElement = document.querySelector('.js-search');
const showsContainer = document.querySelector('.js-showsContainer');
const favoritesContainer = document.querySelector('.js-favoritesContainer');
const showCardColor = document.querySelector('.js-favoriteBg');

// variables globales
let shows = [];
let favorites = [];
console.log(favorites);

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
      setInLocalStorage();
    });
  // paintFavorites();
}
// getDataFromApi();

// local storage
function setInLocalStorage() {
  const stringFavorites = JSON.stringify(favorites);
  localStorage.setItem('favorites', stringFavorites); //setItem cuyo primer parámetro es el nombre que le ponemos a los datos y luego los datos que queremos guardar
}

function getFromLocalStorage() {
  const localStorageFavorites = localStorage.getItem('favorites');
  if (localStorageFavorites === null) {
    getDataFromApi();
  } else {
    const arrayFavorites = JSON.parse(localStorageFavorites);
    favorites = arrayFavorites;
    paintFavorites();
  }
}

// paint

function paintShows() {
  let html = '';
  for (let i = 0; i < shows.length; i++) {
    const name = shows[i].show.name;
    const image = shows[i].show.image;
    const id = shows[i].show.id;
    html += `<li class="background js-show js-card js-favoriteBg" id="${id}">`; //identifico cada li por su id
    html += `<h3 class="cardTitle">`;
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
  handleAddShowListeners();
}

function paintFavorites() {
  let htmlfav = '';
  for (let i = 0; i < favorites.length; i++) {
    const nameFav = favorites[i].show.name;
    const imageFav = favorites[i].show.image;
    const idFav = favorites[i].show.id;
    htmlfav += `<li class="background" id="${idFav}">`; //identifico cada li por su id
    htmlfav += `<h3 class="cardTitle">`;
    htmlfav += `${nameFav}`;
    htmlfav += `</h3>`;
    if (imageFav === null) {
      html += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?"
         class="card__img" alt="no image">`;
    } else {
      htmlfav += `<img src="${imageFav.medium}" class="card__img" alt="Imagen de ${nameFav}">`;
    }
    htmlfav += `</li>`;
  }
  favoritesContainer.innerHTML = htmlfav;
  handleAddShowListeners();
}

function handleAddShowListeners() {
  const showListener = document.querySelectorAll('.js-show');
  for (const show of showListener) {
    show.addEventListener('click', handleClickShow);
  }
}

function handleClickShow(ev) {
  const selectedId = parseInt(ev.currentTarget.id); // id lo pasamos a numero
  const selectedObject = shows.find((object) => object.show.id === selectedId); // busca el objeto que tiene ese id
  favorites.push(selectedObject); // guarda el objeto en let favorites
  console.log(selectedObject);
  paintFavorites();
}

//CAMBIO DE COLOR DE LA TARJETA

// function changeCardColorsListeners() {
//   const cardColorsListener = document.querySelectorAll('.js-card');
//   for (const cardColors of cardColorsListener) {
//     cardColors.addEventListener('click', handleChangeCardColors);
//   }
// }
// function handleChangeCardColors() {
//   showCardColor.classList.remove('background');
//   showCardColor.classList.add('backgroundFavorite');
//   paintShows();
// }

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

getFromLocalStorage();
