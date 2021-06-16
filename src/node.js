"use strict";
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInterfaceType,
} = require("graphql");
const {
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
} = require("graphql-relay");
const { getObjectById } = require("./data");

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    return getObjectById(type.toLowerCase(), id);
  },
  (object) => {
    if (object.title) {
      return videoType;
    }

    return null;
  }
);

exports.nodeField = nodeField;

const videoType = new GraphQLObjectType({
  name: "Video",
  description: "A video on Egghead.io",
  fields: {
    id: globalIdField(),
    title: {
      type: GraphQLString,
      description: "The title of the video.",
    },
    duration: {
      type: GraphQLInt,
      description: "The duration of the video (in seconds)",
    },
    watched: {
      type: GraphQLBoolean,
      description: "Whether or not the viewer has watched the video",
    },
  },
  interfaces: [nodeInterface],
});

exports.videoType = videoType;
