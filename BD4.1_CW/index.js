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

async function fetchMoviesWithSpecificColumns(){
  let query= 'SELECT id,title,release_year FROM MOVIES';
  let response=await db.all(query,[]);
  return {movies:response};
}

async function fetchMoviesWithSpecificColumnsByActor(actor){
  let query= 'SELECT id,title,actor, release_year FROM MOVIES WHERE actor=? ';
  let response=await db.all(query,[actor]);
  return {movies:response};
}

async function fetchMoviesWithSpecificColumnsByDirector(director){
  let query= 'SELECT id,title,director, release_year FROM MOVIES WHERE director=? ';
  let response=await db.all(query,[director]);
  return {movies:response};
}

async function filterMoviesByReleaseYearAndActor(releaseYear,actor){
  let query='SELECT * FROM MOVIES WHERE release_year=? AND actor=? ';
  let response=await db.all(query,[releaseYear, actor]);
  return {movies:response};
}

async function filterMoviesByAwardWinning(){
  let query='SELECT * FROM MOVIES WHERE rating>= 4.5 ORDER BY rating ASC ';
  let response=await db.all(query,[]);
  return {movies:response};
}

async function filterMoviesByBoxOfficeCollection(){
  let query='SELECT * FROM MOVIES WHERE box_office_collection>= 100 ORDER BY box_office_collection DESC ';
  let response=await db.all(query,[]);
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

// /movies/genre/Comedy
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

// /movies/details/1
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

// /movies/release-year/2016
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

// /movies/actor/Ayushmann Khurrana
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
 
 // /movies/director/Amit Sharma
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

 app.get('/movies/select-specific-columns',async(req, res)=>{
  try{
    let result=await fetchMoviesWithSpecificColumns();
    if(result.movies.length===0){
      res.status(404).json({message: 'No movies found'});
    }
    else{
      res.status(200).json(result);
    }
  }
  catch(error){
    res.status(500).json({ error: 'Failed to fetch movies.' });
  } 
 })

 // /movies/select-specific-columns-by-actor/Rajkummar Rao
 app.get('/movies/select-specific-columns-by-actor/:actor',async(req, res)=>{
  try{
    let actor=req.params.actor;
    let result=await fetchMoviesWithSpecificColumnsByActor(actor);
    if(result.movies.length===0){
      res.status(404).json({message: 'No movies found'});
    }
    else{
      res.status(200).json(result);
    }
  }
  catch(error){
    res.status(500).json({ error: 'Failed to fetch movies.' });
  } 
 })

 // /movies/select-specific-columns-by-director/Anubhav Sinha
 app.get('/movies/select-specific-columns-by-director/:director',async(req, res)=>{
  try{
    let director=req.params.director;
    let result=await fetchMoviesWithSpecificColumnsByDirector(director);
    if(result.movies.length===0){
      res.status(404).json({message: 'No movies found'});
    }
    else{
      res.status(200).json(result);
    }
  }
  catch(error){
    res.status(500).json({ error: 'Failed to fetch movies.' });
  } 
 })

 // /movies/year-actor?releaseYear=2016&actor=Aamir Khan
 app.get('/movies/year-actor',async(req, res)=>{
  try{
    let releaseYear=req.query.releaseYear;
    let actor=req.query.actor;
    let result=await filterMoviesByReleaseYearAndActor(releaseYear,actor);
    if(result.movies.length===0){
      res.status(404).json({message: 'No movies found with year: '+releaseYear+'AND actor: '+actor});
    }
    else{
      res.status(200).json(result);
    }
  }
  catch(error){
    res.status(500).json({ error: 'Failed to fetch movies.' });
  }
 })

  // /movies/award-winning
  app.get('/movies/award-winning',async(req, res)=>{
    try{

      let result=await filterMoviesByAwardWinning();
      if(result.movies.length===0){
        res.status(404).json({message: 'No Award Winning movies found'});
      }
      else{
        res.status(200).json(result);
      }
    }
    catch(error){
      res.status(500).json({ error: 'Failed to fetch movies.' });
    }
   })

// /movies/box-office-collection
   app.get('/movies/box-office-collection',async(req, res)=>{
    try{
      let result=await filterMoviesByBoxOfficeCollection();
      if(result.movies.length===0){
        res.status(404).json({message: 'No movies found with Bocx Office Collection more than 100 Cr'});
      }
      else{
        res.status(200).json(result);
      }
    }
    catch(error){
      res.status(500).json({ error: 'Failed to fetch movies.' });
    }
   })



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
