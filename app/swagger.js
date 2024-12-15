const swaggerJSDoc = require("swagger-jsdoc");

// Swagger definition object
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Billing Application API", // Title of the API
    version: "1.0.0", // Version of the API
    description: "API documentation for the Billing Application", // Description
  },
  servers: [
    {
      url: "http://localhost:8080", // Base URL for the API
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for Swagger
const options = {
  swaggerDefinition,
  apis: ["./app/routes/*.js"], // Adjust this path to include all your route files
};

// Generate Swagger specification
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
