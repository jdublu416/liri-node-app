require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var request = require("request");
var Spotify = require("node-spotify-api");

var nodeArgs = process.argv;
var selection = nodeArgs[2];
var songName = "";
var movieName = "";

// `my-tweets`
if (selection === "my-tweets") {
  myTweets();
} else if (selection === "spotify-this-song") {
  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      songName += " " + nodeArgs[i];
    } else {
      songName += nodeArgs[i];
    }
  }

  spotifyThisSong(songName);    
} else if (selection === "movie-this") {
  // * `movie-this`

  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      movieName = movieName + "+" + nodeArgs[i];
    } else {
      movieName += nodeArgs[i];
    }
  }

  movieThis(movieName);
} else if (selection === "do-what-it-says") {
  var fs = require("fs");
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    console.log(data);

    var dataArray = data.split(",");

    console.log(dataArray);

    if (dataArray[0] === "my_tweets") {
      myTweets();
    } else if (dataArray[0] === "spotify-this-song") {
      songName = dataArray[1];
      console.log(songName);
      spotifyThisSong(songName);
    }else if (dataArray[0]==="movie-this"){
movieName = dataArray[1];
movieThis(movieName);
    }
  });
}

function spotifyThisSong(songName) {
  if (songName === "") {
    songName = "The Sign";
  }
  console.log(songName);
  var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });

  spotify
    .search({ type: "track", query: songName })
    .then(function(response) {
      // console.log(response.tracks.items[0].album);
      for (var i = 0; i < 20; i++) {
        
        var data = response.tracks.items[i];
        // console.log(data);
        var artist = data.artists[0].name;
        var resultName = data.name;
        var preview = data.preview_url;
        var album = data.album.name;
        if (preview !== null) {
          console.log(`
       Artist(s):    ${artist}
       Song Name:    ${resultName}
       Album:        ${album}
       Preview Link: ${preview}
         `);
        }
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

function myTweets() {
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  client.get("favorites/list", function(error, tweets, response) {
    if (!error) {
      // console.log(JSON.stringify(data, null, 2));
      //   console.log(tweets[0].created_at);
      // console.log(tweets);
      for (var i = 0; i < 20; i++) {
        var origin = tweets[i].created_at;
        var tweetContent = tweets[i].text;
        console.log(`
        Origin date:  ${origin} 
        Tweet text:   ${tweetContent}
        `);
      }
    }
  });
}

function movieThis(movieName) {
  if (movieName === "") {
    movieName = "Mr+Nobody";
  }
  var queryUrl =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  //check query, troubleshoot url
  console.log(queryUrl);
  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200 && movieName !== "") {
      // console.log(JSON.parse(body));

      var movName = JSON.parse(body).Title;
      var movYear = JSON.parse(body).Year;
      var movRating = JSON.parse(body).Rated;
      var movRTomR = JSON.parse(body).Ratings[1].Value;
      var movCountry = JSON.parse(body).Country;
      var movLanguage = JSON.parse(body).Language;
      var movPlot = JSON.parse(body).Plot;
      var movActors = JSON.parse(body).Actors;
      console.log(`
      
      Name of Movie:    ${movName};
      Release Year:     ${movYear};
      Rating:           ${movRating};
      Rotten Tomato Rating:  ${movRTomR};
      Release Country:       ${movCountry};
      Release Language(s):   ${movLanguage};
      Actors:         ${movActors};
      Plot:           ${movPlot};

      `);
    }
  });
}
