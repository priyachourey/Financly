const budgetService = require('../services/budget.service');
const router = require('express').Router();
const logger = require('../utils/logger');
const jwtUtils = require('../utils/jwt-utils');

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

router.post('/budget', async (req, res) => {
    try {
        const budgetinfo = req.body;
        await budgetService.createBudget(budgetinfo);
        res.status(201).send({ message: "budget created successfully" })
    } catch (err) {
        logger.error(err);
        res.status(500).send(err.message)
    }
})

router.get('/budget', async (req, res) => {
    try {
        const budgetId = req.query.budgetId;
        if (budgetId) {
            const budget = await budgetService.getBudget(budgetId);
            res.json(budget);
        }else{
            const token = req.headers.authorization;
            const userinfo = jwtUtils.validateToken(token);
            const username = userinfo.data;
            const budgetList = await budgetService.getBudgetList(username);
            res.json(budgetList);
        }
    }catch(err){
        logger.error(err);
        res.status(500).send({message : err.message})
    }
})

router.delete('/budget', async(req, res)=>{
    try{
      const budgetid = req.query.budgetId;
      if (budgetid){
        await budgetService.removeBudget(budgetid)
        res.status(201).send({message : "budget deleted successfully" })
      }
    }catch(err){
      logger.error(err);
      res.status(500).send({message : err.message})
    }
})

module.exports = router;