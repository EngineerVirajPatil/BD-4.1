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
  let query = 'SELECT * FROM MOVIES';
  let response = await db.all(query);
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

async function  filterByActor(actor){
  let query='SELECT * FROM MOVIES WHERE actor=?';
  let response=await db.all(query,[actor]);
  return {movies:response};
}

async function filterByDirector(director){
  let query='SELECT * FROM MOVIES WHERE director=?';
  let response=await db.all(query,[director]);
  return {movies:response};
}


app.get('/movies', async (req, res) => {
  try {
    let result = await fetchAllMovies();
    if(result.movies.length===0){
      res.status(404).json({message:'No movies found'});
    }
    else{
      res.status(200).json(result);
    }
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch movies.' });
  }
});

app.get('/movies/genre/:genre',async(req, res)=>{
 let genre=req.params.genre;

 try {
  let result= await fetchMoviesByGenre(genre);
  if(result.movies.length===0){
    res.status(404).json({message:'No movies found with genre: '+genre});
  }
  else{
    res.status(200).json(result);
  }
} catch (error) {
  console.error('Error fetching movies:', error.message);
  res.status(500).json({ error: 'Failed to fetch movies.' });
}
});

app.get('/movies/details/:id',async(req, res)=>{
  let id=req.params.id;
  try {
   let result= await fetchMoviesById(id);
   if(result.movies.length===0){
    res.status(404).json({message:'No movies found with id: '+id});
  }
  else{
    res.status(200).json(result);
  }
 } catch (error) {
   console.error('Error fetching movies:', error.message);
   res.status(500).json({ error: 'Failed to fetch movies.' });
 }
 });


 app.get('/movies/release-year/:year',async(req, res)=>{
  let releaseYear=parseInt(req.params.year);
  try {
   let result= await fetchMoviesByReleaseYear(releaseYear);
   if(result.movies.length===0){
    res.status(404).json({message:'No movies found with year: '+releaseYear});
  }
  else{
    res.status(200).json(result);
  }
 } catch (error) {
   console.error('Error fetching movies:', error.message);
   res.status(500).json({ error: 'Failed to fetch movies.' });
 }
 });

 app.get('/movies/actor/:actor',async(req, res)=>{
  let actor=req.params.actor;
  try {
   let result= await filterByActor(actor);
   if(result.movies.length===0){
    res.status(404).json({message:'No movies found with year: '+actor});
  }
  else{
    res.status(200).json(result);
  }
 } catch (error) {
   console.error('Error fetching movies:', error.message);
   res.status(500).json({ error: 'Failed to fetch movies.' });
 }
 });
 
 app.get('/movies/director/:director',async(req, res)=>{
  let director=req.params.director;
  try {
   let result= await filterByDirector(director);
   if(result.movies.length===0){
    res.status(404).json({message:'No movies found with year: '+director});
  }
  else{
    res.status(200).json(result);
  }
 } catch (error) {
   console.error('Error fetching movies:', error.message);
   res.status(500).json({ error: 'Failed to fetch movies.' });
 }
 });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
