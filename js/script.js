const global = {
    currentPage:window.location.pathname
}
async function fetchDatafromTMDB(endpoint) {
    const API_KEY = '96f9248317abd4c0efe9ff22686562ff';
    const API_URL = 'https://api.themoviedb.org/3/';
    showSpinner();
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    hideSpinner();    
    return data;
}
async function displayPopularMovies() {
    const movies = await fetchDatafromTMDB('movie/popular');
    const {results} = await movies;
    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            <img
              src="${
                movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : images/no-image.jpg
              }"
              class="card-img-top"
              alt="${movie.title}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>      
        `;
        document.querySelector('#popular-movies').appendChild(div);
    });
}
async function displayPopularshows() {
    const shows = await fetchDatafromTMDB('tv/popular');
    const {results} = await shows;
    results.forEach(show => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            <img
              src="${
                show.poster_path
                ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                : images/no-image.jpg
              }"
              class="card-img-top"
              alt="${show.name}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${show.first_air_date}</small>
            </p>
          </div>      
        `;
        document.querySelector('#popular-shows').appendChild(div);
    });
}
function showSpinner() {
    const spinner = document.querySelector('.spinner');
    spinner.classList.add('show');
}
function hideSpinner() {
    const spinner = document.querySelector('.spinner');
    spinner.classList.remove('show');
}
function highlightCurrentPage() {
    const navContainer = document.querySelector('nav ul');
    const movieLink = navContainer.querySelector('li:nth-child(1) a');
    const showsLink = navContainer.querySelector('li:nth-child(2) a');
    if (global.currentPage === '/' || global.currentPage === '/index.html' || global.currentPage === '/movie-details.html') {
        movieLink.classList.add('active');
        showsLink.classList.remove('active');
    } else if (global.currentPage === '/shows.html' || global.currentPage === '/tv-details.html') {
        showsLink.classList.add('active');
        movieLink.classList.remove('active');
    } else {
        movieLink.classList.remove('active');
        showsLink.classList.remove('active');
    }
}
function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displayPopularMovies();
            break;
        case '/shows.html':
            displayPopularshows();
            break;
        case '/movie-details.html':
            break;
        case '/tv-details.html':
            break;
        case '/search.html':
            break;
    }
    highlightCurrentPage();
}

document.addEventListener("DOMContentLoaded", init);