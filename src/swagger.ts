import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Service API",
      version: "1.0.0",
      description: "API for user management with JWT authentication",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            fullName: { type: "string", example: "Name" },
            email: { type: "string", example: "test@test.com" },
            role: { type: "string", example: "USER" },
            isActive: { type: "boolean", example: true },
          },
        },
        RegisterInput: {
          type: "object",
          required: ["fullName", "birthDate", "email", "password"],
          properties: {
            fullName: { type: "string", example: "Name" },
            birthDate: { type: "string", example: "2000-01-01" },
            email: { type: "string", example: "test@test.com" },
            password: { type: "string", example: "123456" },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "test@test.com" },
            password: { type: "string", example: "123456" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"],
});