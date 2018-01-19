const fetch = require('node-fetch');
require('dotenv').config();

// Spotify //
const SpotifyWebApi = require('spotify-web-api-node');
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
});

const resolvers = {
  Query: {
    city: (root, args) => {
      // For when we have mulitiple cities?
      // return Promise.all(city.map(({location, genre, start_date, end_date}) => {
        return fetch(`http://api.eventful.com/json/events/search?app_key=${process.env.EVENTFUL_KEY}&categories=music_${args.genre}&location=${args.location}&date=${args.start_date}00-${args.end_date}00&page_size=25`)
          .then(res => res.json())
          .then(data => {
            return Object.assign({}, data, {location: args.location});
          });
        // }));
    },
    spotify: () => {
      spotifyApi.clientCredentialsGrant()
        .then((data) => {
          spotifyApi.setAccessToken(data.body.access_token);
          console.log('our spotify info is: ', spotifyApi);
        }, (err) => {
          console.log('something went wrong :( >>> ', err);
          process.exit(-1); // if we don't have a working spotify credentials grant, all is lost.
        });
      }
  },

  CityType: {
    location: data => data.location,
    totalEvents: data => data.total_items,
    events: data => data.events.event 
  },

  EventType: {
    city: event => event.city_name,
    date: event => event.start_time,
    event_url: event => event.url,
    performer: event => { return (event.performers.performer.name || event.performers.performer[0].name) },
    performer_pic: event => event.image.medium.url,
    performer_url: event => { return (event.performers.performer.url || event.performers.performer[0].url) },
    title: event => event.title,
    spotify: event => {
      const artist = event.performers.performer.name;
      return fetch(`https://api.spotify.com/v1/search?q=${artist}&type=artist&access_token=${process.env.ACCESS_TOKEN}&limit=1`)
      .then(response => { return response.json() })
    },
    venue_address:  event => event.venue_address,
    venue_name: event => event.venue_name,
    venue_url: event => event.venue_url
  },

  SpotifyType: {
    id: data => data.artists.items[0].id,
    tracks_arr: data => {
      const id = data.artists.items[0].id
      return fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?country=US&access_token=${process.env.ACCESS_TOKEN}`)
      .then(response => { return response.json()} )
      .then(data => { 
        let tracks = data.tracks.slice(0, 3);
        return { tracks };
      })
    }
  },

  TracksArrType: {
    tracks: data => data.tracks
  },

  TracksType: {
    name: data => data.name,
    track_id: data => data.id,
    preview_url: data => data.preview_url
  }
}

module.exports = resolvers;