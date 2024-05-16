require("dotenv").config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const startServer = async () => {
  const app = express();
  const port = process.env.PORT || 3001;

  // Middlewares
  app.use(cors());
  app.options('*', cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Routes and middlewares dependencies
  const nationalityRoutes = require("./routes/nationalityRoutes");

  // Bind App Routes
  app.use("/nationalities", nationalityRoutes);

  try {
    // DB connections
    await mongoose.connect(process.env.DB_URL);

    // Server configuration
    const server = app.listen(port, () =>
      console.log(`Server started at port ${port}!`),
    );    
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas');
    console.error(error);
  }
};

startServer();
