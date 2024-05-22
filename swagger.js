const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Momo Api",
    description: "Simple momo api for paying and check status",
  },
  host: "momo-backend-1r3y.onrender.com",
};

const outputFile = "./swagger-output.json";
const routes = ["./server.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
