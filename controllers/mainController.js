//import Player from '../Models/MainModel.js';

// controllers/mainController.js

//xxx

import SavedMovie from '../models/SavedMovies.js';

import fetch from 'node-fetch';
let movieDetails = {};
let movieSchemaDetails = {};
let movies = {};
let sortedMovies;
let totalMovies = 0;
let totalRatings = 0;
let avgRatings = 0;
let isListView = false;


export const home = async (req, res) => {
    await aggregateMoviesData(); //make sure aggregate data shows up on load
    movies = await SavedMovie.find(); //loads saved movies
    res.render('index', { title: "movie", movieDetails, movies, totalRatings, totalMovies, avgRatings, isListView } );
};



export const searchMovie = async (req, res) => {
    const title = req.query.title;

    try {
        const response = await fetch(`http://www.omdbapi.com/?t=${title}&apikey=73144de7`);
         movieDetails = await response.json();

        res.render('index', {
            title: "Search Results",
            movieDetails: {
                Title: movieDetails.Title,
                Director: movieDetails.Director,
                Released: movieDetails.Released,
                Year: movieDetails.Year,
                Runtime: movieDetails.Runtime,
                imdbRating: movieDetails.imdbRating,
                BoxOffice: movieDetails.BoxOffice,
                Poster: movieDetails.Poster,
                myRating: ""
            },
            movies,
            totalRatings, 
            totalMovies, 
            avgRatings,
            isListView
        }); //renders index with info from search result
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
};

export const saveMovie = async (req, res) => {
    
    try {
        const existingMovie = await SavedMovie.findOne({ movieTitle: req.body.title });

        if (existingMovie) {
            req.flash('error', 'You have already saved this movie');
            res.redirect('/');
            return;
        }
        
        const newMovie = new SavedMovie({
            movieTitle: req.body.title,
            movieYear: req.body.year,
            movieRuntime: req.body.runtime,
            movieDirector: req.body.director,
            imdbRating: req.body.imdbRating,
            boxOffice: req.body.boxOffice,
            myRating: req.body.myRating,
            movieRelease: req.body.releaseDate,
            posterImage: req.body.poster
        }); //populates Mongo model with API data
        
        
            await newMovie.save();
            console.log("saved");
            res.redirect('/');
        

        
    }  
    catch (error) {
        res.status(500).json({ error: 'Error saving movie' });
    }
    

};

export const getMovieDetails = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movieDetails = await SavedMovie.findById(movieId); //readies the movie data for that specific movie

        if (!movieDetails) {
            return res.status(404).send('Movie not found');
        }

        res.render('movieDetails', { title: "Movie Details", movieDetails });
    } catch (error) {
        res.status(500).send('Error fetching movie details');
    }
};


export const updateRating = async (req, res) => {
    try {
        const movieId = req.params.id;
        const currMovie = await SavedMovie.findById(movieId);
        if (currMovie.myRating === "-") {
            currMovie.myRating = 1;
        }
        
        else if (1 <= parseInt(currMovie.myRating) && parseInt(currMovie.myRating) < 5) {
            currMovie.myRating++;
        } //ratings update between 1 and 5
        else {
            return;
        } //if already at 5, no result
        await currMovie.save(); //make sure new rating is saved
        const updatedMovies = await SavedMovie.find(); //make sure new info is echoed in database
        res.redirect(`/movie/${movieId}`);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating movie' });
    }
    
};

export const deleteMovie = async (req, res) => {
  const movieId = req.params.id;

  try {
    const result = await SavedMovie.findByIdAndDelete(movieId);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing request');
  }
};

export const sortMoviesAlpha = async (req, res) => {
    try {
        sortedMovies = await SavedMovie.find().sort({ movieTitle: 1 }); // Sort by movie title in ascending order
        res.render('index', { title: "Sorted Movies", movieDetails, movies: sortedMovies, totalMovies, totalRatings, avgRatings, isListView });
    } catch (error) {
        res.status(500).send('Error sorting movies');
    }
};

export const clearSortMovies = async (req, res) => {
    try {
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error sorting movies');
    }
};


export const sortMoviesMoney = async (req, res) => {
    try {
        let sortedMovies = await SavedMovie.find().sort({ boxOffice: -1 }).lean();

        sortedMovies.forEach(movie => {
            const cleanedBoxOffice = movie.boxOffice.replace(/\$|,/g, '');
            movie.parsedBoxOffice = parseInt(cleanedBoxOffice, 10);
        }); //box office numbers originally stored as string, so this turns it into a number

        sortedMovies.sort((a, b) => b.parsedBoxOffice - a.parsedBoxOffice);

        res.render('index', { title: "Sorted Movies", movieDetails, movies: sortedMovies, totalMovies, totalRatings, avgRatings, isListView });
    } catch (error) {
        res.status(500).send('Error sorting movies');
    }
};



export const sortMoviesRate = async (req, res) => {
    try {
        sortedMovies = await SavedMovie.find().sort({ myRating: -1 });
        res.render('index', { title: "Sorted Movies", movieDetails, movies: sortedMovies, totalMovies, totalRatings, avgRatings, isListView });
    } catch (error) {
        res.status(500).send('Error sorting movies');
    }
};



export const aggregateMoviesData = async () => {
    try {
        totalMovies = 0;
        totalRatings = 0;
        avgRatings = 0;
        // Fetch all saved movies
        const allMovies = await SavedMovie.find();

        allMovies.forEach(movie => {
            if (movie) {
                totalMovies++;
            }
            
            if (movie.myRating !== '-') {
                totalRatings += parseInt(movie.myRating);
                
            }
        });
        avgRatings = Math.round(10*(totalRatings/totalMovies))/10;

    } catch (error) {
        res.status(500).send('Error aggregating ratings');
    }
};

export const toggleListView = (req, res) => {
    isListView = !isListView;
    res.redirect('/');
};


export const testing = async (req, res) => {
    await aggregateMoviesData();
    movies = await SavedMovie.find();
    res.render('testing');
};

