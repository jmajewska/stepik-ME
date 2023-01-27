const { MongoClient } = require('mongodb');

const connectionString = "mongodb://localhost:27017/";


const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

function connectToServer(callback) {
  client.connect(function (err, db) {
    if (err || !db) {
      return callback(err);
    }

    dbConnection = db.db("db3");
    console.log("Successfully connected to MongoDB.");

    return callback();
  });
}

function getDb() {
  return dbConnection;
}

module.exports = {
  connectToServer,
  getDb,
};