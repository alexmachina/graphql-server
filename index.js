'use strict';

const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLID } = require('graphql');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'A video on Egghead.io',
  fields: {
    id: {
      type: GraphQLID,
      description: 'The id of the video.',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the video.',
    },
    duration: {
      type: GraphQLInt,
      description: 'The duration of the video (in seconds)',
    },
    watched: {
      type: GraphQLBoolean,
      description: 'Whether or not the viewer has watched the video',
    },
  },
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root query type',
  fields: {
    video: {
      type: videoType,
      resolve: () =>
        Promise.resolve({
          id: 'a',
          title: 'GraphQL',
          duration: 180,
          watched: false,
        }),
    },
  },
});

const schema = new GraphQLSchema({
  query: queryType,
});

const videoA = {
  id: 'a',
  title: 'Create a GraphQL Schema',
  duration: 120,
  watched: true,
};

const videoB = {
  id: 'b',
  title: 'Ember.js CLI',
  duration: 240,
  watched: false,
};

server.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
