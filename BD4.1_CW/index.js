const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

let db;


(async () => {
  db = await sqlite.open({ filename: './BD4.1_CW/database.sqlite', driver: sqlite3.Database });
  console.log('Connected to SQLite database.');
})();



async function fetchAllMovies() {
  const query = 'SELECT * FROM MOVIES';
  const response = await db.all(query);
  return { movies: response };
}

async function fetchMoviesByGenre(genre){
  let query='SELECT * FROM MOVIES WHERE GENRE=?';
  let response=await db.all(query,[genre]);
  return {movies:response};
}

async function fetchMoviesById(id){
  let query='SELECT * FROM MOVIES WHERE id=?';
  let response=await db.all(query,[id]);
  return {movies:response};
}

async function fetchMoviesByReleaseYear(releaseYear){
  let query='SELECT * FROM MOVIES WHERE release_year=?';
  let response=await db.all(query,[releaseYear]);
  return {movies:response};
}


app.get('/movies', async (req, res) => {
  try {
    const result = await fetchAllMovies();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch movies.' });
  }
});

app.get('/movies/genre/:genre',async(req, res)=>{
 let genre=req.params.genre;

 try {
  const result= await fetchMoviesByGenre(genre);
  res.status(200).json(result);
} catch (error) {
  console.error('Error fetching movies:', error.message);
  res.status(500).json({ error: 'Failed to fetch movies.' });
}
});

app.get('/movies/details/:id',async(req, res)=>{
  let id=req.params.id;
 
  try {
   const result= await fetchMoviesById(id);
   res.status(200).json(result);
 } catch (error) {
   console.error('Error fetching movies:', error.message);
   res.status(500).json({ error: 'Failed to fetch movies.' });
 }
 });


 app.get('/movies/release-year/:year',async(req, res)=>{
  let releaseYear=parseInt(req.params.year);
  try {
   const result= await fetchMoviesByReleaseYear(releaseYear);
   res.status(200).json(result);
 } catch (error) {
   console.error('Error fetching movies:', error.message);
   res.status(500).json({ error: 'Failed to fetch movies.' });
 }
 });
 


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
