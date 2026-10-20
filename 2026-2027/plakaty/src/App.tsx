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
import './App.css'


var movies: MovieProps[] = [
  { poster: wolf, title: "The Wolf of Wall Street", year: 2013, rating: 8.0 },
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
    title: "yes",
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
    <div style={{ border: '1px solid red' }}>
      {rating > 8.5 ? <p>Recomended!</p> : null}
      <img src={poster} alt="Poster" />
      <h1>{title}</h1>
      <h4>Release: {year}</h4>
      <h4>Rating: {rating}</h4>
    </div>
  )
}

interface BookProps {
  cover: string;
  title: string;
  year: number;
  pages: number;
}

function Book({ cover, title, year, pages }: BookProps) {
  return (
    <div style={{ border: '1px solid red' }}>
      {year < 2000 ? <p>Classic</p> : null}
      <img src={cover} alt="Cover" />
      <h1>{title}</h1>
      <h4>Release: {year}</h4>
      <h4>Num. of pages: {pages}</h4>
    </div>
  )
}

interface TrackProps {
  index?: number;
  title: string;
  duration: string;
}

function Track({ index, title, duration }: TrackProps) {
  return (
    <li key={index}>
      {title} - {duration}
    </li>
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

function Album({ cover, title, artist, year, tracklist }: AlbumProps) {
  return (
    <div style={{ border: '1px solid red' }}>
      <img src={cover} alt="Cover" />
      <h1>{title}</h1>
      <h4>Artist: {artist}</h4>
      <h4>Release: {year}</h4>
      <ul>
        {tracklist != undefined ? tracklist.map((track, index) => (
          <Track index={track.index ?? index} title={track.title} duration={track.duration} />
        )) : <h5>No tracks</h5>}
      </ul>
    </div>
  )
}

function App() {
  const sortedMovies = [...movies].sort((a, b) => a.title.localeCompare(b.title));
  const sortedBooks = [...books].sort((a, b) => b.year - a.year);
  const sortedAlbums = [...albums].sort((a, b) => (b.tracklist ? b.tracklist.length : 0) - (a.tracklist ? a.tracklist.length : 0));

  return (
    <>
      {sortedMovies.filter(movie => movie.year <= 2010).map((movie, index) => (
        <Movie key={index} {...movie} />
      ))}
      
      {sortedMovies.filter(movie => movie.year > 2010).map((movie, index) => (
        <Movie key={index} {...movie} />
      ))}

      {books.map((book, index) => (
        <Book key={index} {...book} />
      ))}

      {albums.map((album, index) => (
        <Album key={index} {...album} />
      ))}

      {sortedBooks.map((book, index) => (
        <Book key={index} {...book} />
      ))}

      <Album {...sortedAlbums[0]} />
    </>
  );
}

export default App
