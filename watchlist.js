const watchlistContainer = document.querySelector(".watchlist-container");

// Function to display movie elements
function displayWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  console.log(watchlist);
  let html = ``;
  if (watchlist.length > 0) {
    watchlist.forEach((movie) => {
      html += `
                <div class="movie">
                    <img src="${movie.Poster}" class="movie-poster"/>
                    <div class="movie-info">
                        <div class="title">
                            <h2 class="movie-title">${movie.Title}</h2>
                            <div class="star-img"><img src="./images/star.png"></div>
                            <span class="imdb-rating">${movie.imdbRating}</span>
                        </div>
                        <div class="time-genre">
                            <span class="runtime">${movie.Runtime}</span>
                            <span class="genre">${movie.Genre}</span>
                            <div class="remove-btn">
                                <div class="remove-img"><img src="./images/minus.png" /></div>
                                <span>Remove</span>
                            </div>
                        </div>
                        <p class="movie-plot">${movie.Plot}</p>
                    </div>
                </div>
            `;
    });
    watchlistContainer.innerHTML = html;
  } else {
    // case when there is no movie elements in watchlist i.e., in local storage.
    document.querySelector(".watchlist-empty-div").style.height = "80vh";
    document.querySelector(".watchlist-empty-div").innerHTML = `
    <h3 class="watchlist-empty">Your watchlist is looking a little empty...</h3>
    <div class="add-some">
        <a class="plus-img" id="watchlist-plus" href="./index.html"><img src="./images/plus.png" /></a>
        <span>Let's add some movies!</span>
    </div>
    `;
  }
}
// localStorage.clear();
displayWatchlist();

watchlistContainer.addEventListener("click", function (event) {
  // handling minus button clicks to remove movie elements from watchlist
  const clickedElement = event.target.parentElement.parentElement;
  console.log(clickedElement);

  if (clickedElement.classList.contains("remove-btn")) {
    const movieContainer = clickedElement.closest(".movie");
    const movieTitle = movieContainer.querySelector(".movie-title").textContent;

    // Remove the movie from local storage
    removeFromLocalStorage(movieTitle);

    movieContainer.remove();
    displayWatchlist();
  }
});

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
