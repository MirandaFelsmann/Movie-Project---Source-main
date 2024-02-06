import mongoose from 'mongoose';

const savedMovieSchema = new mongoose.Schema({
    movieTitle: {
        type: String,
        required: true,
        trim: true
    },
    movieYear: {
        type: Number,
        required: true
    },
    movieRelease: {
        type: String,
        required: true
    },
    movieRuntime: {
        type: String,
        required: true
    },
    movieDirector: {
        type: String,
        required: true
    },
    imdbRating: {
        type: Number,
        required: true
    },
    boxOffice: {
        type: String,
        required: true
    },
    posterImage: {
        type: String,
        required: true,
        trim: true,
    },
    myRating: {
        type: String,
        default: "-"
    }
});

const SavedMovie = mongoose.model('SavedMovie', savedMovieSchema);

export default SavedMovie;
