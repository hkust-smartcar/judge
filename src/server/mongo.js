var mongoose = require("mongoose");
const logger = require("./logger")("mongo");

const init = async () => {
  await mongoose
    .connect(
      "mongodb://localhost:27017/judge",
      { useNewUrlParser: true }
    )
    .then(() => {
      logger.info("mongooese connected");
    })
    .catch(err => {
      logger.error(`mongooese connection failed with error ${err}`);
    });
};

module.exports = {
  init,
  getdb: () => mongoose
};
