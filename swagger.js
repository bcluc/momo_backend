const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Momo Api",
    description: "Simple momo api for paying and check status",
  },
  host: "localhost:3000",
};

const outputFile = "./swagger-output.json";
const routes = ["./server.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
