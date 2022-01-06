const app = require("./server/app");
const debug = require("debug")("node-angular");
const http = require("http");

// Makes sure that when we try to set up a port, make sure it's a valid number
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// Checks which type of error occured and logs something different based on the error
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Logs that we are listening to incoming requests
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

// Setting up the port
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);


const server = http.createServer(app);
// Listener for errors
server.on("error", onError);
// Listener for when the server starts
server.on("listening", onListening);
// Starts the server
server.listen(port);
