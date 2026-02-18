//Initializing global variables and objects
const global = {
	currentPage: '/' + window.location.pathname.split('/').pop(), // Extract filename from path to work on both local and GitHub Pages
	search: {
		term: '',
		type: '',
		page: '1',
		totalPages: '1',
		totalResults: '1',
	},
	api: {
		apiKey: '96f9248317abd4c0efe9ff22686562ff',
		apiUrl: 'https://api.themoviedb.org/3/',
	},
};

//All the functions for searching
async function search() {
	//Get details from URL
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	global.search.type = urlParams.get('type');
	global.search.term = urlParams.get('search-term');
	//Verify search input
	if (global.search.term === '' || global.search.term === null) {
		showAlert('Please enter a search term');
		return;
	}
	//Fetch data from API and asign response to variables
	const { results, total_pages, page, total_results } = await searchDatafromTMDB();
	global.search.page = page;
	global.search.totalPages = total_pages;
	global.search.totalResults = total_results;
	//Check for results
	if (results.length === 0) {
		showAlert('No results found');
		return;
	}
	//Update DOM
	displaySearchResults(results);
	//Clear search input box
	document.querySelector('#search-term').value = '';
}

function displaySearchResults(results) {
	//Clear previous results from DOM
	document.querySelector('#search-results').innerHTML = '';
	document.querySelector('#search-results-heading').innerHTML = '';
	document.querySelector('#pagination').innerHTML = '';
	//Variable assignment
	const type = global.search.type;
	//Add search results to DOM
	results.forEach((result) => {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
      <a href="${type}-details.html?id=${result.id}">
        <img
        src="${posterPath(result)}"
          class="card-img-top"
          alt="${type === 'movie' ? result.title : result.name}"
        />
      </a>
      <div class="card-body">
        <h5 class="card-title">${type === 'movie' ? result.title : result.name}</h5>
        <p class="card-text">
          <small class="text-muted">
          ${type === 'movie' ? `Released: ${localDate(result.release_date)}` : `Aired: ${localDate(result.first_air_date)}`}
          </small>
        </p>
      </div>      
    `;
		document.querySelector('#search-results').appendChild(div);
	});
	//Output search results heading
	document.querySelector('#search-results-heading').innerHTML = `
      <h2>${results.length} out of ${global.search.totalResults} results for ${global.search.term}.</h2>
    `;
	//Radio buttons checked state remains the same after searching
	if (type === 'tv') {
		document.querySelector('#tv').checked = true;
	} else {
		document.querySelector('#movie').checked = true;
	}

	displayPagination();
}

function displayPagination() {
	//Load pagination buttons and text to DOM
	const div = document.createElement('div');
	div.classList.add('pagination');
	div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;
	document.querySelector('#pagination').appendChild(div);
	//Disable prev on first page and next on last page
	if (global.search.page === 1) {
		document.querySelector('#prev').disabled = true;
	}
	if (global.search.page === global.search.totalPages) {
		document.querySelector('#next').disabled = true;
	}
	//Next and Prev buttons are dynamic
	document.querySelector('#next').addEventListener('click', async () => {
		global.search.page++;
		const { results, total_pages } = await searchDatafromTMDB();
		displaySearchResults(results);
	});
	document.querySelector('#prev').addEventListener('click', async () => {
		global.search.page--;
		const { results, total_pages } = await searchDatafromTMDB();
		displaySearchResults(results);
	});
}

async function searchDatafromTMDB() {
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;
	showSpinner();
	const response = await fetch(
		`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
	);
	const data = await response.json();
	hideSpinner();
	return data;
}

//The following functions are for the rest of the movie and tv pages
//Setting shell url and making the fetch request
async function fetchDatafromTMDB(endpoint) {
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;
	showSpinner();
	const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
	const data = await response.json();
	hideSpinner();
	return data;
}

async function displayNowPlaying() {
	//Fetching results from API and assigning to a variable
	const { results } = await fetchDatafromTMDB('movie/now_playing');
	//Add to DOM the results
	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('swiper-slide');
		div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="${posterPath(movie)}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
      </h4>
    `;
		document.querySelector('.swiper-wrapper').appendChild(div);
	});
	//Calling function to initiate all the swiper styles and options for the Now Playing swiper
	initSwiper();
}

function initSwiper() {
	const swiper = new Swiper('.swiper', {
		slidesPerView: 1,
		spaceBetween: 30,
		freeMode: true,
		speed: 800,
		loop: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		breakpoints: {
			500: {
				slidesPerView: 2,
			},
			700: {
				slidesPerView: 3,
			},
			1200: {
				slidesPerView: 4,
			},
		},
	});
}

async function displayPopularMovies() {
	//Fetching results from API and assigning to a variable
	const movies = await fetchDatafromTMDB('movie/popular');
	const { results } = await movies;
	//Creating an HTML div for each result and adding to the DOM
	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            <img
            src="${posterPath(movie)}"
              class="card-img-top"
              alt="${movie.title}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Released: ${localDate(movie.release_date)}</small>
            </p>
          </div>      
        `;
		document.querySelector('#popular-movies').appendChild(div);
	});
}

async function displayPopularshows() {
	//Fetching results from the API and assigning to a variable
	const shows = await fetchDatafromTMDB('tv/popular');
	const { results } = await shows;
	//Creating an HTML div for each result and adding to the DOM
	results.forEach((show) => {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            <img
              src="${posterPath(show)}"
              class="card-img-top"
              alt="${show.name}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${localDate(show.first_air_date)}</small>
            </p>
          </div>      
        `;
		document.querySelector('#popular-shows').appendChild(div);
	});
}

async function displayMovieDetails() {
	//Get Movie Id from URL and use that to make a Fetch request
	const movieId = window.location.search.slice(4);
	const movie = await fetchDatafromTMDB(`movie/${movieId}`);
	//Create an HTML div and populate using the response values
	const div = document.createElement('div');
	div.innerHTML = `
        <div class="details-top">
          <div>
            <img
              src="${posterPath(movie)}"
              class="card-img-top"
              alt="${movie.title}"
            />
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${localDate(movie.release_date)}</p>
            <p>${movie.overview}</p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a ${homepageLink(movie)} class="btn">Visit Movie Homepage</a>
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
          <div class="list-group">
            ${movie.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}
          </div>
        </div>
        `;
	//Add the new element to the DOM
	document.querySelector('#movie-details').appendChild(div);

	displayBackgroundImage('movie', movie.backdrop_path);
}

async function displayShowDetails() {
	//Get Show Id from URL and use that to fetch data from API
	const showId = window.location.search.slice(4);
	const show = await fetchDatafromTMDB(`tv/${showId}`);
	//Create elements and add to the DOM
	const div = document.createElement('div');
	div.innerHTML = `
        <div class="details-top">
          <div>
            <img
              src="${posterPath(show)}"
              class="card-img-top"
              alt="${show.name}"
            />
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">First Aired: ${localDate(show.first_air_date)}</p>
            <p>${show.overview}</p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a ${homepageLink(show)} class="btn">Visit Show Homepage</a>
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
          <div class="list-group">
            ${show.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}
          </div>
        </div>
    `;
	document.querySelector('#show-details').appendChild(div);

	displayBackgroundImage('show', show.backdrop_path);
}

//Verifying poster and link, for use in template literals
function posterPath(type) {
	return type.poster_path
		? `https://image.tmdb.org/t/p/w500${type.poster_path}`
		: 'images/no-image.jpg';
}
function homepageLink(type) {
	return type.homepage ? `href="${type.homepage}" target="blank"` : 'href="#"';
}

function localDate(result) {
	return result ? new Date(result).toLocaleDateString() : 'No info available';
}

//Display background image of that movie or show
async function displayBackgroundImage(type, backgroundPath) {
	const div = document.createElement('div');
	div.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
	div.classList.add('background-image');
	document.querySelector(`#${type}-details`).appendChild(div);
}

function showSpinner() {
	document.querySelector('.spinner').classList.add('show');
}
function hideSpinner() {
	document.querySelector('.spinner').classList.remove('show');
}

function highlightCurrentPage() {
	//Asigning HTML anchor tags in the header to variables
	const moviesLink = document.querySelectorAll('.nav-link')[0];
	const showsLink = document.querySelectorAll('.nav-link')[1];
	//Changing active class of the anchor tags based on current page
	if (
		global.currentPage === '/' ||
		global.currentPage === '/index.html' ||
		global.currentPage === '/movie-details.html'
	) {
		moviesLink.classList.add('active');
		showsLink.classList.remove('active');
	} else if (
		global.currentPage === '/shows.html' ||
		global.currentPage === '/tv-details.html'
	) {
		showsLink.classList.add('active');
		moviesLink.classList.remove('active');
	} else {
		moviesLink.classList.remove('active');
		showsLink.classList.remove('active');
	}
}

function showAlert(message, className = 'alert-error') {
	//Custom alert message, created and added to the DOM
	const alertElement = document.createElement('div');
	alertElement.classList.add('alert', className);
	alertElement.appendChild(document.createTextNode(message));
	document.querySelector('#alert').appendChild(alertElement);
	//Removed from the DOM on timeout
	setTimeout(() => alertElement.remove(), 3000);
}

function init() {
	//Main switchboard to determine which functions to run based on which webpage is active
	switch (global.currentPage) {
		case '/':
		case '/index.html':
			displayPopularMovies();
			displayNowPlaying();
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
			search();
			break;
	}

	highlightCurrentPage();
}

document.addEventListener('DOMContentLoaded', init);
