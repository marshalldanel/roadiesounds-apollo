const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type Query {
    city (location: String!, genre: String!, start_date: String!, end_date: String!): CityType
    spotify: String
  }

  type CityType {
    location: String!
    totalEvents: String
    events: [EventType]
  }

  type EventType {
    city: String
    date: String
    event_url: String
    performer: String
    performer_pic: String
    performer_url: String
    title: String
    spotify: SpotifyType
    venue_address: String
    venue_name: String
    venue_url: String
  }

  type SpotifyType {
    id: String
    tracks_arr: TracksArrType
  }

  type TracksArrType {
    tracks: [TracksType]
  }

  type TracksType {
    name: String
    track_id: String
    preview_url: String
  }
`

module.exports = makeExecutableSchema({ typeDefs, resolvers });
