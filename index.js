"use strict";

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const PORT = process.env.PORT || 3000;
const server = express();
const { getVideoById, getVideos, createVideo } = require("./src/data");
const {
  connectionDefinitions,
  connectionFromPromisedArray,
  connectionArgs,
  mutationWithClientMutationId,
} = require("graphql-relay");
const { videoType, nodeField } = require("./src/node");

const videoMutation = mutationWithClientMutationId({
  name: "AddVideo",
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The title of the video.",
    },
    duration: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "The duration of the video (in seconds)",
    },
    released: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "Whether or not the video is released",
    },
  },
  outputFields: {
    video: {
      type: videoType,
    },
  },
  mutateAndGetPayload: (args) =>
    new Promise((resolve, reject) => {
      Promise.resolve(createVideo(args))
        .then((video) => resolve({ video }))
        .catch(reject);
    }),
});
const mutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "The root mutation type.",
  fields: {
    createVideo: videoMutation,
  },
});

const { connectionType: VideoConnection } = connectionDefinitions({
  nodeType: videoType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      description: "A count of the total number of objects in this connection",
      resolve: (conn) => {
        return conn.edges.length;
      },
    },
  }),
});

const queryType = new GraphQLObjectType({
  name: "QueryType",
  description: "The root query type",
  fields: {
    node: nodeField,
    videos: {
      type: VideoConnection,
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(getVideos(), args),
    },
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: "The ID of the video",
        },
      },
      resolve: (_, args) => {
        return getVideoById(args.id);
      },
    },
  },
  videos: {},
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

server.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
