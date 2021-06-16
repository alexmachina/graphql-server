const videoA = {
  id: "a",
  title: "Create a GraphQL Schema",
  duration: 120,
  watched: true,
};

const videoB = {
  id: "b",
  title: "Ember.js CLI",
  duration: 240,
  watched: false,
};

const videos = [videoA, videoB];

const getVideoById = (id) =>
  new Promise((resolve) => {
    const [video] = videos.filter((video) => {
      return video.id === id;
    });

    resolve(video);
  });

const getVideos = () => Promise.resolve(videos);
const createVideo = ({ title, duration, released }) => {
  const video = {
    id: new Buffer.from(title, "utf-8").toString("base64"),
    title,
    duration,
    released,
  };
  videos.push(video);
  return video;
};
exports.getVideos = getVideos;
exports.getVideoById = getVideoById;
exports.createVideo = createVideo;
