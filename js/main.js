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
    const favoriteIndex = favorites.findIndex((object) => object.show.id === id);
    if (favoriteIndex === -1) {
      html += `<li class="background js-show js-card js-favoriteBg" id="${id}">`;
      html += `<h3 class="cardTitle">`;
    } else {
      html += `<li class="backgroundFavorite js-show js-card js-favoriteBg" id="${id}">`; //identifico cada li por su id
      html += `<h3 class="cardTitleFavorite">`;
    }
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
  listenAddShow();
}

function paintFavorites() {
  let htmlfav = '';
  for (let i = 0; i < favorites.length; i++) {
    const nameFav = favorites[i].show.name;
    const imageFav = favorites[i].show.image;
    const idFav = favorites[i].show.id;
    htmlfav += `<li class="container" id="${idFav}">`; //identifico cada li por su id
    htmlfav += `<div class= "card">`;
    htmlfav += `<button class="btn js-delete" id="${idFav}"> x </button>`;
    htmlfav += `<div class="background">`;
    htmlfav += `<h3 class="cardTitle">`;
    htmlfav += `${nameFav}`;
    htmlfav += `</h3>`;
    if (imageFav === null) {
      html += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?"
         class="card__img" alt="no image">`;
    } else {
      htmlfav += `<img src="${imageFav.medium}" class="card__img" alt="Imagen de ${nameFav}">`;
    }
    htmlfav += `</div>`;
    htmlfav += `</div>`;
    htmlfav += `</li>`;
  }
  htmlfav += `<button class="button js-deleteAll" type="reset">Delete all</button>`; //SOPORTE LAURA js-reset id="${idFav}" no puedo usar este id porque deja de funcionar lo demás
  favoritesContainer.innerHTML = htmlfav;
  listenAddShow();
  listenDeleteButtons(); //ejecutar la función
  setInLocalStorage(); // después de haber hecho click
  listenDeleteAllButtons();
}

function listenAddShow() {
  const showListener = document.querySelectorAll('.js-show');
  for (const show of showListener) {
    show.addEventListener('click', handleClickShow);
  }
}

function handleClickShow(ev) {
  const selectedId = parseInt(ev.currentTarget.id); // id lo pasamos a numero
  const selectedObject = shows.find((object) => object.show.id === selectedId); // busca el objeto que tiene ese id
  const noRepeatObjet = favorites.findIndex((object) => object.show.id === selectedId); // con un cambio aqui se hace solo el ultimo paso
  if (noRepeatObjet === -1) {
    favorites.push(selectedObject); // guarda el objeto en let favorites
  } else {
    favorites.splice(selectedObject, 1); // borra el objeto de favoritos
  }
  paintFavorites();
  paintShows();
  setInLocalStorage(); // después de haber hecho click
}

// borrar cada botón

function listenDeleteButtons() {
  const deleteButtons = document.querySelectorAll('.js-delete');
  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener('click', handleDelete);
  }
}

function handleDelete(ev) {
  const clickedId = parseInt(ev.currentTarget.id); //el id tiene que estar tb en el boton de cerrar
  const favoriteIndex = favorites.findIndex((object) => object.show.id === clickedId);
  if (favoriteIndex !== -1) {
    favorites.splice(favoriteIndex, 1);
    paintFavorites();
    paintShows();
  }
}

// delete all favorite shows SOPORTE LAURA

function listenDeleteAllButtons() {
  const deleteAllButtons = document.querySelector('.js-deleteAll'); // solo escucha un botón
  deleteAllButtons.addEventListener('click', handleDeleteAll);
}

function handleDeleteAll() {
  localStorage.removeItem('favorites'); //vaciar el array de favoritos
  favorites = []; // array vacio
  paintFavorites(); // repintar
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

getFromLocalStorage();
