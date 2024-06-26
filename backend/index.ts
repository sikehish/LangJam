import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import globalErrHandler from './middleware/errorHandler';
import userRouter from './routes/userRouter';
import adminRouter from './routes/adminRouter';
import entityRouter from './routes/entityRouter';
import "./utils/passport"
import oauthRouter from './routes/oauthRouter';
import cors from 'cors';
import cookieParser from "cookie-parser"
import passport from 'passport';

const app = express();

app.use(passport.initialize());

app.use(cors({
  // origin:"http://localhost:5173",
  methods:"GET,POST,PUT,DELETE",
}))

app.use(cookieParser());

// Set up logger
app.use(morgan('dev'));

//Body parser
app.use(express.json())

// Data sanitization (NoSQL query injection protection)
app.use(mongoSanitize());


// Routes
app.use('/api/oauth', oauthRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/entities', entityRouter) //Getting all entities(categories,subjects,topics,quizzes)

const uri = (process.env.MONGO_URI ?? '').replace('<password>', process.env.MONGO_PW || '');

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
.connect(uri)
.then(() => {
  console.log('Connected to MongoDB Atlas!');
  app.listen(PORT, () => {
    console.log("HAHAHAHAHAHH", process.env.NODE_ENV)
    console.log(`Server is listening at ${PORT}`);
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB Atlas:', err);
  });
