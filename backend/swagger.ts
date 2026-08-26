import swaggerAutogen from "swagger-autogen";

const doc = {
  openapi: "3.0.0",

  info: {
    title: "AFTER API",
    version: "1.0.0",
    description:
      "AFTER is an AI-powered financial decision companion that helps everyday people make better financial decisions.",
  },

  servers: [
    {
      url: "http://localhost:8000",
      description: "Local development server",
    },
  ],

  tags: [
    {
      name: "Authentication",
      description: "User authentication and device management",
    },
    {
      name: "Agent",
      description: "AFTER AI financial decision agent",
    },
  ],
};

const outputFile = "./docs/swagger-output.json";

const endpointsFiles = [
  "./src/app.ts",
];

console.log("[Swagger Gen]: Starting documentation generation...");

swaggerAutogen({
  openapi: "3.0.0",
})(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log(
      "[Swagger Gen]: Documentation successfully generated."
    );

    console.log(
      `[Swagger Gen]: Output: ${outputFile}`
    );
  })
  .catch((error) => {
    console.error(
      "[Swagger Gen]: Documentation generation failed."
    );

    console.error(error);

    process.exit(1);
  });