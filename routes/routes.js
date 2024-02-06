// Importing necessary modules
import express from 'express';
//import * as controller from '../controllers/mainController.js';
import * as controller from '../controllers/mainController.js';

// Create a router object
const router = express.Router();

// Home page route
router.get('/', controller.home);

router.get('/search', controller.searchMovie);

router.post('/save-movie', controller.saveMovie);
router.get('/movie/:id', controller.getMovieDetails);
router.get('/rate/:id', controller.updateRating);
router.get('/delete/:id', controller.deleteMovie);
router.post('/sortalpha', controller.sortMoviesAlpha);
router.post('/clearsort', controller.clearSortMovies);
router.post('/sortboxoffice', controller.sortMoviesMoney);
router.post('/sortrating', controller.sortMoviesRate);
router.post('/listview', controller.toggleListView);


router.get('/testing', controller.testing);

//router.post('/movie/:id/rate', controller.submitUserRating);

// Export the router
export default router;
