require('dotenv').config();
const sequelize = require('./db');
const express = require('express');
const cors = require('cors');
const personRouter = require('./routes/personRouter');
const ErrorHandlingMiddleware = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use('/', personRouter);

// Обработчик ошибок, последний Middleware
app.use(ErrorHandlingMiddleware);

const start = async () => {
   try {
      await sequelize.authenticate();
      await sequelize.sync();
      app.listen(PORT, () => console.log(`Server start on PORT ${PORT}`));
   } catch (e) {
      console.log(e);
   }
}

start();

