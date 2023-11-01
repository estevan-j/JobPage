require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connect')
const AuthRouter = require('./routes/auth')
const JobsRouter = require('./routes/jobs')

// Security Packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


const app = express();


const authenticateUser = require('./middleware/authentication');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/jobs', authenticateUser,JobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// security middleware

app.use(rateLimiter({
  windows: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 request per windowMS
}))
app.use(helmet())
app.use(cors())
app.use(xss())



const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
