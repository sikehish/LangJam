import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import globalErrHandler from './middleware/errorHandler';
import userRouter from './routes/userRouter';
import langRouter from './routes/langRouter';

const app = express();

// Set up logger
app.use(morgan('dev'));

// Data sanitization (NoSQL query injection protection)
app.use(mongoSanitize());

// Routes
app.use('/api/users', userRouter);
app.use('/api/lang', langRouter);

const uri = process.env.MONGO_URI.replace('<password>', process.env.MONGO_PW || '');

const PORT = process.env.PORT || 3000;

// Middleware for unhandled routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `The API endpoint ${req.url} does not exist!`,
  });
});

// Global error handler to handle all errors thrown in the controllers
app.use(globalErrHandler);

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
    app.listen(PORT, () => {
      console.log(`Server is listening at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });
