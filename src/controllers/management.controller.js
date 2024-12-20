const router = require("express").Router();
const logger = require("../utils/logger");
const jwtUtils = require("../utils/jwt-utils");
const manageService = require("../services/budgetGoalmanagement.service");

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

router.get("/budget", async (req, res) => {
  try {
    const budgetId = req.query.BudgetId.trim();
    const token = req.headers.authorization;
    const userinfo = jwtUtils.validateToken(token);
    const username = userinfo.data;
    const budgetdata = await manageService.CalculateBudget(username, budgetId);
    res.json({
      status : budgetdata.status,
      remainingamount: budgetdata.remainingamount,
      totalexpense: budgetdata.totalexpense,
      remainingBudget: budgetdata.remainingBugetpercent,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err.message });
  }
});

router.get("/goal", async (req, res) => {
  try {
    const goalId = req.query.GoalId.trim();
    const token = req.headers.authorization;
    const userinfo = jwtUtils.validateToken(token);
    const username = userinfo.data;
    const goaldata = await manageService.calculateGoal(goalId , username);
    res.json({
      savings: goaldata.savings,
      remainingamount: goaldata.remainingamount,
      goalprogress: goaldata.progress,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
