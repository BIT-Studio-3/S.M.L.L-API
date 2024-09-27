import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./routes/v1/user.js";
import authRoutes from "./routes/v1/authRoutes.js";
import journalRoutes from "./routes/v1/journal.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Create an Express application
const app = express();

// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: ["https://s-m-l-l.netlify.app", "http://localhost:3000/"], // Include https://
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use the PORT environment variable or 3000
const PORT = process.env.PORT || 3000;

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Management System API",
      version: "1.0.0",
      description: "A student management system API",
      contact: {
        name: "l",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
  },
  apis: ["./routes/v1/*.js"],
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Use the routes module

app.use("/api/v1/journals", journalRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth/", authRoutes);

// Setup swagger-ui after swaggerDocs is initialized
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/api/v1/users", function (_req, res) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

// Start the server on port 3000
app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}/api-docs`,
  );
});

// Export the Express application. May be used by other modules. For example, API testing
export default app;
