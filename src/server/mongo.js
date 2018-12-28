var mongoose = require("mongoose");

const init = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/judge")
    .then(() => {
      console.log("mongooese connected");
    })
    .catch(err => {
      console.log(`mongooese connection failed with error ${err}`);
    });
};

module.exports = {
  init,
  getdb: () => mongoose
};
