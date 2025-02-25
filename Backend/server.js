require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const {logger} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const { logEvents } = require('./middleware/logger')
const http = require('http')
const server = http.createServer(app)
const PORT = process.env.PORT || 3500
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, 
    sameSite: 'Lax' 
  }  
}));


connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false } // Set to true if using https
// }));

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.use('/uploads', express.static('uploads'));
app.use('/auth', require('./routes/authRoutes'))
app.use('/projects', require('./routes/projectRoutes'))
app.use('/products', require('./routes/productRoutes'))
app.use('/documents', require('./routes/documentRoutes'))
app.use('/designs', require('./routes/designRoutes'))
app.use('/changeRequests', require('./routes/changeRequestRoutes'))
app.use('/tasks', require('./routes/taskRoutes'))
app.use('/reviews', require('./routes/reviewRoutes'))
app.use('/activities', require('./routes/activityRoutes'))
app.use('/items', require('./routes/itemRoutes'))
app.use('/integrations', require('./routes/integrationRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }else if(req.accepts('json')) {
        res.json({message: '404 Not Found'})
    }else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

if (require.main === module) {
  // This will true if file is run directly (e.g., node server.js), but false if required (like in tests)
  mongoose.connection.once('open', () => {
      console.log('Connected to MongoDB');
      server.listen(PORT, () => { 
          console.log(`Server is running on port ${PORT}`);
      });
  });
}

  
  mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
  })

  // At the end of your server.js or app.js
module.exports = app; // Export the Express application instance
