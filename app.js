require('dotenv').config()
const express = require('express')
const unirest = require('unirest')
const bodyParser = require('body-parser')
const request = require('request')


const app = express()

const apiKey = process.env.IMDB_API_KEY

app.set('view engine', 'ejs')

app.use(express.static('./public'))
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', function (req, response) {
    response.render('home.ejs', { movieTitle: null, moviePoster: null, moviePlot: null, error: null })
  })

app.post('/', function(req, response) {

    var req2 = unirest("GET", "https://movie-database-imdb-alternative.p.rapidapi.com/");

    req2.query({
	    "page": "1",
	    "r": "json",
	    "type": "movie",
	    "t": req.body.movieName
    });

    req2.headers({
	    "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
	    "x-rapidapi-key": apiKey
    });

    
    req2.end(function (res) {
        if (res.error) throw new Error(res.error);
        else {
            response.render('home.ejs', { movieTitle: res.body.Title, moviePoster: res.body.Poster, moviePlot: res.body.Plot, error: res.error }) // make error: res.error?
    }
    });
})

app.listen(3000, function() {
    console.log('Server is running on port 3000...')
  })