/*
* Simple Hello Wold Application that will reply with a welcome message when endpoint is hit
*
*/

// Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// Initialize server
const server = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// Start the http server
server.listen(3000, () => {
  console.log("The server is listening on port " + 3000);
});

// Logic processing server request
const unifiedServer = (req, res) => {
  // Get URL and parse it
  const parsedUrl = url.parse(req.url, true);
  // Get path from URL
  const rawPath = parsedUrl.pathname;
  const path = rawPath.replace(/^\/+|\/+$/g, "");
  console.log("PATH: ", path);
  // Get http method
  const method = req.method.toUpperCase();

  // router to correct handler
  const chosenHandler =
    typeof router[path] !== "undefined" ? router[path] : handlers.notFound;

  //construct the data object that we pass to the handler
  const data = {
    path,
    method
  };

  chosenHandler(data, (statusCode, payload) => {
    // use the status code called back by the handler or default to 200
    statusCode = typeof statusCode == "number" ? statusCode : 200;

    // use the payload called back by the handler, or use an empty object
    payload = typeof payload === "object" ? payload : {};

    // Conver the payload to a string
    const payloadString = JSON.stringify(payload);

    //return the response
    res.setHeader("Content-Type", "application/json");
    res.writeHead(statusCode);
    res.end(payloadString);
    // Log the request path that the user was asking for
    console.log("Returning this response: ", payloadString, method);
  });
};

// Define handlers
const handlers = {};

// Hello handler
handlers.hello = (data, callback) => {
  // 0 -> 4
  const randomNumber = Math.floor(Math.random() * 5);
  // Messages from which to choose
  const messages = ["Hello", "Kon'nichiwa", "Zdravstvuyte", "Hola"];
  // The message that will be send along with response
  let randomMessage = "";

  // Check if method was a post and send greeting if it was else return method not allowed
  if (data.method === "POST") {
    randomMessage = messages[randomNumber];
    callback(200, { message: randomMessage });
  } else {
    callback(405, { message: "Good day sir! I said good day!!!" });
  }
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// Define a request router
const router = {
  hello: handlers.hello
};
