import { useState } from "react";
import wolf from './assets/wolf.png'
import airplane from './assets/airplane.png'
import rocky from './assets/rocky.png'
import ubik from './assets/ubik.png'
import leagues from './assets/leagues.png'
import mars from './assets/mars.png'
import dragon from './assets/dragon.png'
import animals from './assets/animals.png'
import name from './assets/name.png'


var movies: MovieProps[] = [
  { poster: wolf, title: "The Wolf of Wall Street", year: 2013, rating: 8.0 },
  { poster: airplane, title: "Airplane!", year: 1980, rating: 8.6 },
  { poster: airplane, title: "Airplane!", year: 1980, rating: 8.6 },
  { poster: name, title: "Call Me by Your Name", year: 2017, rating: 8.4 },
  { poster: rocky, title: "The Rocky Horror Picture Show", year: 1975, rating: 8.2 },
];

var books: BookProps[] = [
  { cover: ubik, title: "Ubik", year: 1970, pages: 227 },
  { cover: leagues, title: "20,000 Leagues Under the Seas", year: 1871, pages: 249 },
  { cover: mars, title: "The Man from Mars", year: 1946, pages: 140 },
];

var albums: AlbumProps[] = [
  {
    cover: animals,
    title: "Animals",
    artist: "Pink Floyd",
    genre: "Progressive rock",
    year: 1977,
    tracklist: [
      { title: "Pigs on the Wing (Part One)", duration: "1:24" },
      { title: "Dogs", duration: "17:04" },
      { title: "Pigs (Three Different Ones)", duration: "11:28" },
      { title: "Sheep", duration: "10:20" },
      { title: "Pigs on the Wing (Part Two)", duration: "1:24" },
    ],
  },
  {
    cover: dragon,
    title: "Petrodragonic apocalypse; or, Dawn of Eternal Night: Anihilation of Planet Earth and Beggining of Merciless Damnation",
    artist: "King Gizzard and the Lizzard Wizard",
    genre: "Progressive metal",
    year: 2023,
    tracklist: [
      { title: "Motor Spirit", duration: "8:33" },
      { title: "Supercell", duration: "5:06" },
      { title: "Converge", duration: "6:16" },
      { title: "Witchcraft", duration: "5:04" },
      { title: "Gila Monster", duration: "4:36" },
      { title: "Dragon", duration: "9:45" },
      { title: "Flamethrower", duration: "9:21" },
    ],
  },
  {
    cover: dragon,
    title: "Test",
    artist: "yes",
    genre: "yesy",
    year: 2000,
  },
];

interface MovieProps {
  poster: string;
  title: string;
  year: number;
  rating: number;
}

function Movie({ poster, title, year, rating }: MovieProps) {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card h-100 shadow">
        {rating > 8.5 ? (<b style={{ position: "absolute", left: "40%", top: "10px" }}>Recommended!</b>) : null}
        <img className="card-img-top" style={{ width: "100%", height: "600px", objectFit: "cover" }} src={poster} alt="Poster" />
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <p className="card-text">Release: {year}</p>
          <p className="card-text">Rating: {rating}</p>
        </div>
      </div>
    </div>
  );
}

interface BookProps {
  cover: string;
  title: string;
  year: number;
  pages: number;
}

function Book({ cover, title, year, pages }: BookProps) {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card h-100 shadow">
        {year < 2000 ? (<b style={{ position: "absolute", left: "40%", top: "10px" }}>Classic</b>) : null}
        <img className="card-img-top" style={{ width: "100%", height: "600px", objectFit: "cover" }} src={cover} alt="Cover" />
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <p className="card-text">Release: {year}</p>
          <p className="card-text">Num. of pages: {pages}</p>
        </div>
      </div>
    </div>
  );
}

interface TrackProps {
  index?: number;
  title: string;
  duration: string;
}

function Track({ index, title, duration }: TrackProps) {
  return (
    <tr key={index}>
      <td scope="row">{title}</td>
      <td className="text-end">{duration}</td>
    </tr>
  )
}

interface AlbumProps {
  cover: string;
  title: string;
  artist: string;
  genre: string;
  year: number;
  tracklist?: TrackProps[];
}

function Album({ cover, title, artist, year, genre, tracklist }: AlbumProps) {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card h-100 shadow">
        <img className="card-img-top" style={{ width: "100%", objectFit: "cover" }} src={cover} alt="Cover" />
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <h5 className="card-text">{artist}</h5>
          <p className="card-text">{year} / {genre}</p>

          {tracklist != undefined ? (
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Duration</th>
                </tr>
              </thead>
              <tbody>
                {tracklist.map((track, index) => (
                  <Track key={track.index ?? index} index={track.index ?? index} title={track.title} duration={track.duration}
                  />
                ))}
              </tbody>
            </table>
          ) : (<div className="alert alert-light" role="alert"> No songs </div>)}
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="card m-4 shadow">
      <h2 className="card-header" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "▾" : "▸"} {title}
      </h2>

      {isOpen && (
        <div className="card-body row g-3">
          {children}
        </div>
      )}
    </div>
  )
}

function App() {
  const sortedMovies = [...movies].sort((a, b) => a.title.localeCompare(b.title));
  const sortedBooks = [...books].sort((a, b) => b.year - a.year);
  const sortedAlbums = [...albums].sort((a, b) => (b.tracklist ? b.tracklist.length : 0) - (a.tracklist ? a.tracklist.length : 0));

  return (
    <main className="container p-5">
      <Card title="Old Movies">
        {sortedMovies.filter(movie => movie.year <= 2010).map((movie, index) => (
          <Movie key={index} {...movie} />
        ))}
      </Card>

      <Card title="New Movies">
        {sortedMovies.filter(movie => movie.year > 2010).map((movie, index) => (
          <Movie key={index} {...movie} />
        ))}
      </Card>

      <Card title="Books">
        {books.map((book, index) => (
          <Book key={index} {...book} />
        ))}
      </Card>

      <Card title="Albums">
        {albums.map((album, index) => (
          <Album key={index} {...album} />
        ))}
      </Card>

      <Card title="Sorted Books">
        {sortedBooks.map((book, index) => (
          <Book key={index} {...book} />
        ))}
      </Card>

      <Card title="Longest Album">
        <Album {...sortedAlbums[0]} />
      </Card>
    </main>
  );
}

export default App
