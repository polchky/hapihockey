'use strict';

const server = require('./server');


// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  Util.log(`Server started on port 8000`);
  // Once started, connect to Mongo through Mongoose
  mongoose.connect(dbUrl, {}, (err) => {
    if (err) {
      throw err;
    }
  });
});