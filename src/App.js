import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const key = "f84fc31d";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const tempquery = "Interstellar";

  function handleMovieSelect(id) {
    if (selectedId && id === selectedId) {
      setSelectedId(null);
      return;
    } else {
      setSelectedId(id);
    }
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  useEffect(
    function () {
      setError("");
      const controller = new AbortController();
      async function FetchData() {
        setIsLoading(true);
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );
          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found!");
          if (!res.ok) throw new Error("something Went Wrong!");
          setMovies(data.Search);
          setError("");
          setIsLoading(false);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query === "") {
        setMovies([]);
        setError("");

        return;
      }
      FetchData();
      setMovies([]);
      return function () {
        controller.abort();
      };
    },

    [query]
  );

  return (
    <>
      <Navbar>
        <Numresults movies={movies} />
        <Search query={query} setQuery={setQuery} />
      </Navbar>
      <Main>
        <Box>
          {/* {!query && <NoQuery />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <Movielist
              movies={movies}
              handleMovieSelect={handleMovieSelect}
              handleCloseMovie={handleCloseMovie}
              selectedId={selectedId}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              handleCloseMovie={handleCloseMovie}
              handleAddMovie={handleAddMovie}
              watched={watched}
            />
          ) : (
            <>
              <Watchedsummary watched={watched} />
              <Watchedmovieslist watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function NoQuery() {
  return <p className="no-query">Search for a movie</p>;
}
function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      {message.includes("not" || "Wrong") && <span>❗</span>} {message}
    </p>
  );
}
function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />

      {children}
    </nav>
  );
}

function Numresults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function Movielist({
  movies,
  handleMovieSelect,
  selectedId,
  handleCloseMovie,
}) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleMovieSelect={handleMovieSelect}
          handleCloseMovie={handleCloseMovie}
          selectedId={selectedId}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleMovieSelect, handleCloseMovie, selectedId }) {
  return (
    <li onClick={() => handleMovieSelect(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// function Watchedbox() {
//   const [watched, setWatched] = useState(tempWatchedData);

//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <Watchedsummary watched={watched} />
//           <Watchedmovieslist watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function MovieDetails({
  selectedId,
  handleCloseMovie,
  handleAddMovie,
  watched,
}) {
  const [movieDetails, setMovieDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  function addToWatchedList() {
    const newWatchedMovie = {
      IMDbID: selectedId,
      title: movieDetails.Title,
      poster: movieDetails.Poster,
      imdbRating: movieDetails.imdbRating,
      runtime: movieDetails.Runtime.split(" ")[0],
      userRating: userRating,
    };
    handleAddMovie(newWatchedMovie);
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );
        const data = await res.json();
        setMovieDetails(data);
        console.log(data);
        setLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!movieDetails.Title) return;
      document.title = "Movie | " + movieDetails.Title;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [movieDetails.Title]
  );

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          handleCloseMovie();
        }
      }
      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [handleCloseMovie]
  );

  return loading ? (
    <Loader />
  ) : (
    <div className="details">
      <button className="btn-back" onClick={handleCloseMovie}>
        &larr;
      </button>
      <header>
        <img src={movieDetails.Poster} alt={`${movieDetails.Title} Poster`} />
        <div className="details-overview">
          <h2>{movieDetails.Title}</h2>
          <p>
            {movieDetails.Released} &bull; {movieDetails.Runtime}
          </p>
          <p>{movieDetails.Genre}</p>

          <p>
            <span>⭐</span>
            {movieDetails.imdbRating} IMDb Rating
          </p>
        </div>
      </header>

      <section>
        {watched.map((movie) => movie.title).includes(movieDetails.Title) ? (
          <div>
            Your Rating: <span>⭐</span>
            {userRating}
          </div>
        ) : (
          <div className="rating">
            <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
            {userRating && (
              <button onClick={addToWatchedList} className="btn-add">
                Add to list
              </button>
            )}
          </div>
        )}
        <p>
          <em>{movieDetails.Plot}</em>
        </p>
        <p>Starring: {movieDetails.Actors}</p>
        <p>Directed by: {movieDetails.Director}</p>
      </section>
    </div>
  );
}

function Watchedsummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function Watchedmovieslist({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Watchedmovie movie={movie} key={movie.IMDbID} />
      ))}
    </ul>
  );
}

function Watchedmovie({ movie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>

      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
