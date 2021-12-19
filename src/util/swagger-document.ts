import path from "path";
import { SWAGGER_URL } from "@config/secret";

const SwaggerDocument = {
  swaggerDefinition: {
    info: {
      title: "REST API for Press Wash & Go Application",
      version: "1.0.0",
      description: "This is the REST API for Press Wash & Go Application",
    },
    host: `${SWAGGER_URL}`,
    basePath: "/",
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "x-auth-token",
        scheme: "bearer",
        in: "header",
      },
    },
    schemes: ["https", "http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
  explorer: true,
  apis: [path.join(__dirname, "..", "..", "swagger-doc", "*.yaml")],
};

export default SwaggerDocument;
