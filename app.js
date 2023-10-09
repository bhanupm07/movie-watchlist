const searchButton = document.querySelector(".fa-magnifying-glass");
const inputEl = document.querySelector("#search-input");
const moviesContainer = document.querySelector(".movies-container");
const notAvailableText = document.querySelector(".not-available");
const movie = document.querySelector(".movie");
const exploreDiv = document.querySelector(".explore");
const notAvailableDiv = document.querySelector(".not-available-div");

async function getApiData(input) {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=3f0c49d3&plot=full&i=tt3896198&s=${input}`
  );
  const data = await res.json();
  console.log(data.Search);
  let html = "";
  exploreDiv.style.display = "none";
  //case when movie is not available in the api
  if (data.Search === undefined) {
    document.querySelector(".not-available-div").style.height = "90vh";
    moviesContainer.textContent = "";
    notAvailableDiv.style.display = "flex";
    notAvailableText.textContent =
      "Unable to find what you’re looking for. Please try another search.";
    // console.log("unable to find the data");
  } else {
    document.querySelector(".not-available-div").style.height = "0";
    notAvailableDiv.style.display = "none";
    data.Search.forEach(async (movie) => {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=3f0c49d3&i=tt3896198&t=${movie.Title}`
      );
      const fullData = await res.json(); // detailed data for each movie
      //   console.log(fullData);
      let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []; // getting the array from local storage to add movies
      html += `
              <div class="movie">
                  <img src="${fullData.Poster}" class="movie-poster"/>
                  <div class="movie-info">
                      <div class="title">
                          <h2 class="movie-title">${fullData.Title}</h2>
                          <div class="star-img"><img src="./images/star.png"></div>
                          <span class="imdb-rating">${
                            fullData.imdbRating
                          }</span>
                      </div>
                      <div class="time-genre">
                          <span class="runtime">${fullData.Runtime}</span>
                          <span class="genre">${fullData.Genre}</span>
                          <div class=${
                            watchlist.find(
                              (obj) => obj.Title === fullData.Title
                            )
                              ? "hide"
                              : "watchlist-btn"
                          }>
                              <div class="plus-img"><img src="./images/plus.png" /></div>
                              <span>Watchlist</span>
                          </div>
                          <div class=${
                            watchlist.find(
                              (obj) => obj.Title === fullData.Title
                            )
                              ? "remove-btn"
                              : "hide"
                          }>
                                <div class="remove-img"><img src="./images/minus.png" /></div>
                                <span>Remove</span>
                          </div>
                      </div>
                      <p class="movie-plot">${fullData.Plot}</p>
                  </div>
              </div>
          `;
      moviesContainer.innerHTML = html;
    });
  }
}

searchButton.addEventListener("click", function async() {
  // handling search button clicks
  //   console.log("searching...");
  getApiData(inputEl.value);
});

inputEl.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    searchButton.click();
  }
});

moviesContainer.addEventListener("click", function (event) {
  const clickedElement = event.target.parentElement.parentElement;
  console.log(clickedElement);

  if (clickedElement.classList.contains("watchlist-btn")) {
    // handling plus button to add to local storage
    const watchlistButton = clickedElement;
    const removeButton = watchlistButton.nextElementSibling;
    watchlistButton.classList.add("hide");
    watchlistButton.classList.remove("watchlist-btn");
    removeButton.classList.add("remove-btn");
    removeButton.classList.remove("hide");

    const movieContainer = clickedElement.closest(".movie");
    const movieObj = {
      // making movie objects to add in the array in local storage
      Title: movieContainer.querySelector(".movie-title").textContent,
      Poster: movieContainer.querySelector(".movie-poster").src,
      imdbRating: movieContainer.querySelector(".imdb-rating").textContent,
      Runtime: movieContainer.querySelector(".runtime").textContent,
      Genre: movieContainer.querySelector(".genre").textContent,
      Plot: movieContainer.querySelector(".movie-plot").textContent,
    };
    addToLocalStorage(movieObj);
  } else if (clickedElement.classList.contains("remove-btn")) {
    // handling minus button to remove movies from local storage
    clickedElement.previousElementSibling.classList.add("watchlist-btn");
    clickedElement.previousElementSibling.classList.remove("hide");
    clickedElement.classList.add("hide");
    clickedElement.classList.remove("remove-btn");

    const movieContainer = clickedElement.closest(".movie");
    const movieTitle = movieContainer.querySelector(".movie-title").textContent;

    // Remove the movie from local storage
    removeFromLocalStorage(movieTitle);
  }
});

// Function to add a movie to local storage
function addToLocalStorage(movieData) {
  // Check if there are any movies already in local storage
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  // Add the new movie to the watchlist array
  watchlist.push(movieData);

  // Store the updated watchlist back in local storage
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

// Function to remove a movie from local storage
function removeFromLocalStorage(movieTitle) {
  // Get the current watchlist from local storage
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  // Find the index of the movie to remove
  const indexToRemove = watchlist.findIndex(
    (movie) => movie.Title === movieTitle
  );

  if (indexToRemove !== -1) {
    // Remove the movie from the watchlist array
    watchlist.splice(indexToRemove, 1);

    // Store the updated watchlist back in local storage
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }
}
