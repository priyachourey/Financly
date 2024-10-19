const router = require('express').Router();
const logger = require('../utils/logger');
const jwtUtils = require('../utils/jwt-utils')
const manageService = require('../services/budgetGoalmanagement.service');

router.use((req, res, next) => {
    try {
      const token = req.headers.authorization;
      const userinfo = jwtUtils.validateToken(token);
      if (userinfo) {
        // Log an info message for each incoming request
        logger.info(`Received a request for ${req.url} from ${userinfo.data}`);
        next();
      } else {
        res.status(401).send();
      }
    } catch (err) {
      res.status(401).send(err.message);
    }
  });

router.get('/budget' , async(req,res)=>{
    try{
        const budgetinfo = req.query;
        console.log(budgetinfo);
        const budgetdata = await manageService.CalculateBudget(budgetinfo);
        res.json({
            remainingamount : budgetdata.remainingamount,
            totalexpense : budgetdata.totalexpense,
            remainingBudget : budgetdata.remainingBugetpercent
        });
    }
    catch(err){
        logger.error(err);
        res.status(500).send({ message: err.message });
    }

});

router.get('/goal', async(req, res)=>{
    try{
        const goalinfo = req.query;
        const goaldata = await manageService.calculateGoal(goalinfo);
        res.json({
            totalincome : goaldata.totalincome,
            remainingamount : goaldata.remainingamount,
            progress : goaldata.progress
        });
    }
    catch(err){
        logger.error(err);
        res.status(500).send({ message: err.message });
    }
});

module.exports = router