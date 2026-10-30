# Flixx — Movie and TV Discovery

A vanilla JavaScript application for browsing movies and TV shows with data from The Movie Database (TMDB). Explore popular titles, search by name, and open dedicated detail pages.

[Live demo](https://ymk-coder-star.github.io/flixx-app/)

## Features

- Popular movie and TV show grids with poster artwork
- Responsive, autoplaying now-playing carousel using Swiper
- Movie or TV search with previous/next pagination
- Detail pages with ratings, overviews, genres, and production companies
- Movie budget, revenue, runtime, and release information
- TV episode counts and programme status
- Loading spinners, empty-search alerts, and fallback poster images

## Technology

HTML, CSS, vanilla JavaScript, the Fetch API, TMDB API, Swiper, and Font Awesome. No application framework or build step is required.

## Run locally

```bash
git clone https://github.com/ymk-coder-star/flixx-app.git
cd flixx-app
```

Serve the project directory with a local static server, such as the VS Code Live Server extension, and open `index.html` through that server. An internet connection is needed for API data and remote images.

For your own deployment, configure your own TMDB API key in `global.api.apiKey` in `js/script.js`. The current implementation makes requests directly from the browser, so that value is visible to visitors.

## Project layout

- `index.html` — popular and now-playing movies
- `shows.html` — popular TV shows
- `search.html` — search results and pagination
- `movie-details.html` and `tv-details.html` — individual title pages
- `js/script.js` — routing, API requests, and DOM updates
- `css`, `images`, `lib`, and `webfonts` — styling and interface assets

## Data source

Movie information and artwork are supplied by [TMDB](https://www.themoviedb.org/). This project is not endorsed or certified by TMDB.
