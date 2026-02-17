const global = {
    currentPage: window.location.pathname
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
async function displayMovieDetails() {
    const movieId = window.location.search.slice(4);
    const movie = await fetchDatafromTMDB(`movie/${movieId}`);
    displayBackgroundImage('movie', movie.backdrop_path);
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="details-top">
          <div>
            <img
              src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'images/no-image.jpg'}"
              class="card-img-top"
              alt="${movie.title}"
            />
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${Math.round(movie.vote_average)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>${movie.overview}</p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map(genre => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a ${movie.homepage ? `href="${movie.homepage}" target="blank"` : 'href="#"'} class="btn">Visit Movie Homepage</a>
          </div>
        </div>  
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${movie.budget.toLocaleString()}</li>
            <li><span class="text-secondary">Revenue:</span> $${movie.revenue.toLocaleString()}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map(company => `<span>${company.name}</span>`).join(', ')}</div>
        </div>
        `;
    document.querySelector('#movie-details').appendChild(div);
}
async function displayShowDetails() {
    const showId = window.location.search.slice(4);
    const show = await fetchDatafromTMDB(`tv/${showId}`);
    displayBackgroundImage('show', show.backdrop_path);
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="details-top">
          <div>
            <img
              src="${show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : 'images/no-image.jpg'}"
              class="card-img-top"
              alt="${show.name}"
            />
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${Math.round(show.vote_average)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>${show.overview}</p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${show.genres.map(genre => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a ${show.homepage ? `href="${show.homepage}" target="_blank"` : 'href="#"'} class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
            <li><span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}</li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map(company => `<span>${company.name}</span>`).join(', ')}</div>
        </div>
    `;
    document.querySelector('#show-details').appendChild(div);
}
async function displayBackgroundImage(type, backgroundPath) {
    const div = document.createElement('div');
    div.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    div.classList.add('background-image');
    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(div);
    } else if (type === 'show') {
        document.querySelector('#show-details').appendChild(div);
    }
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
    const moviesLink = navContainer.querySelector('li:nth-child(1) a');
    const showsLink = navContainer.querySelector('li:nth-child(2) a');
    if (global.currentPage === '/' || global.currentPage === '/index.html' || global.currentPage === '/movies-details.html') {
        moviesLink.classList.add('active');
        showsLink.classList.remove('active');
    } else if (global.currentPage === '/shows.html' || global.currentPage === '/tv-details.html') {
        showsLink.classList.add('active');
        moviesLink.classList.remove('active');
    } else {
        moviesLink.classList.remove('active');
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
            displayMovieDetails();
            break;
        case '/tv-details.html':
            displayShowDetails();
            break;
        case '/search.html':
            break;
    }
    highlightCurrentPage();
}

document.addEventListener("DOMContentLoaded", init);