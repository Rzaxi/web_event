console.log('=== Starting debug process ===');

try {
  console.log('1. Loading dotenv...');
  const dotenv = require('dotenv');
  dotenv.config();
  console.log('   ✓ dotenv loaded');

  console.log('2. Loading basic modules...');
  const express = require('express');
  const path = require('path');
  const cookieParser = require('cookie-parser');
  const logger = require('morgan');
  console.log('   ✓ basic modules loaded');

  console.log('3. Testing database connection...');
  const sequelize = require('./config/database');
  
  sequelize.authenticate()
    .then(() => {
      console.log('   ✓ Database connected successfully');
      return sequelize.sync({ alter: true });
    })
    .then(() => {
      console.log('   ✓ Database synced successfully');
      
      console.log('4. Loading routes...');
      const indexRouter = require('./routes/index');
      const usersRouter = require('./routes/users');
      const apiRouter = require('./routes/api');
      console.log('   ✓ routes loaded');

      console.log('5. Creating Express app...');
      const app = express();
      
      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'pug');
      
      app.use(logger('dev'));
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      app.use(cookieParser());
      app.use(express.static(path.join(__dirname, 'public')));

      app.use('/', indexRouter);
      app.use('/users', usersRouter);
      app.use('/api', apiRouter);

      console.log('   ✓ Express app configured');

      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`🚀 Server running successfully on port ${port}`);
      });

    })
    .catch((err) => {
      console.error('❌ Database error:', err);
    });

} catch (error) {
  console.error('❌ Critical error during startup:', error);
}
