var client;

const init = async () => {
  let MongoClient = require("mongodb").MongoClient;
  let uri = "mongodb://localhost:27017/judge";
  client = new MongoClient(uri, { useNewUrlParser: true });
  await new Promise((resolve, reject) => {
    client.connect(err => {
      console.log(err || "no error connecting mongo");
      resolve(client);
    });
  });
  return client;
};

module.exports = {
  init,
  getdb: () => client
};
