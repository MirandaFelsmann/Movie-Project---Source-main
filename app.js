import express from 'express';
import fetch from 'node-fetch';
import flash from 'connect-flash';
import dotenv from 'dotenv'; 
import mongoose from 'mongoose';
import session from 'express-session'; // Import express-session
import routes from './routes/routes.js';


dotenv.config({ path: 'process.env' });

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.APIKEY, // Change this to a strong secret
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


app.use('/', routes);



const PORT = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
