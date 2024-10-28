// start the server
// register the routes
const config = require('../utils/config');
const express = require('express');
const cors = require('cors');
const logger = require('../utils/logger');
const authController = require('../controllers/auth.controller');
const transactionController = require('../controllers/transaction.controller');
const budgetController = require('../controllers/budget.controller');
const goalController = require('../controllers/goal.controller');
const categoryController = require('../controllers/category.controller');
const managementController = require('../controllers/management.controller');
const statusController = require('../controllers/status.controller')
const app = express();
const port = config.SERVER_PORT;
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use((req, res, next) => {
  // Log an info message for each incoming request
  logger.info(`Received a ${req.method} request for ${req.url}`);
  next();
});
// Handle errors using the logger
app.use((err, req, res, next) => {
  // Log the error message at the error level
  logger.error(err.message);
  res.status(500).send();
});

app.use('/auth', authController);
app.use('/transactions', transactionController);
app.use('/budgets', budgetController);
app.use('/goals', goalController);
app.use('/categories', categoryController);
app.use('/manage', managementController);
app.use('/status', statusController);
const startRestServer = ()=>{
  app.listen(port, () => {
    logger.info(`app listening on port ${port}`);
  });
};
module.exports = startRestServer;
