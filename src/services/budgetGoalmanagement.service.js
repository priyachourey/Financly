const BudgetModel = require("../models/budget.model");
const TransactionModel = require("../models/transaction.model");
const GoalModel = require("../models/goals.model");
const logger = require("../utils/logger");

// only one budget should be created for the perticular category for the time being
const Management = {
  CalculateBudget: async (username, BudgetId) => {
    try {
      let budget = await BudgetModel.findById(BudgetId);
      if (!budget) {
        throw new Error("no budget found");
      }

      const transactions = await TransactionModel.find({
        username,
        category: budget.category,
        createdAt: { $gte: budget.createdAt },
      });

      const totalexpense = transactions.reduce((total, transaction) => {
        return transaction.type === "expense"
          ? total + transaction.amount
          : total;
      }, 0);

      let status = ''
      if(totalexpense > budget.amount){
        status = "over Budget"
      }else{
        status = "under Budget"
      }
      const remainingamount = budget.amount - totalexpense;
      const remainingBugetpercent = (remainingamount / budget.amount) * 100;

      return {
        status,
        remainingamount,
        totalexpense,
        remainingBugetpercent,
      };
    } catch (err) {
      logger.error(err);
      throw new Error({ messsge: err.messsge });
    }
  },

  calculateGoal: async (goalId, username) => {
    try {
      const goal = await GoalModel.findById(goalId);
      if (!goal) {
        throw new Error("no goal found");
      }
      const transactions = await TransactionModel.find({
        username,
        createdAt: { $gte: goal.createdAt },
      });

      const totalincome = transactions.reduce((total, transaction) => {
        return transaction.type === "income"
          ? total + transaction.amount
          : total;
      }, 0);

      const totalexpense = transactions.reduce((total, transaction) => {
        return transaction.type === "expense"
          ? total + transaction.amount
          : total;
      }, 0);

      let savings = totalincome - totalexpense;

      if (savings <= 0) {
        savings = 0;
      }

      let progress = (savings / goal.amount) * 100;

      if (progress <= 0) {
        progress = 0;
      }else if(progress > 100){
        progress = 100;
      }

      let remainingamount = 0;
      if (totalincome < goal.amount) {
        remainingamount = goal.amount - savings;
      }

      return {
        savings,
        remainingamount,
        progress,
      };
    } catch (err) {
      logger.error(err);
      throw new Error({ messsge: err.messsge });
    }
  },
};

module.exports = Management;
