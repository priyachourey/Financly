const BudgetModel = require('../models/budget.model');
const TransactionModel = require('../models/transaction.model');
const GoalModel = require('../models/goals.model');
const logger = require('../utils/logger');

// only one budget should be created for the perticular category for the time being
const Management = {
    CalculateBudget : async(username , BudgetId ) => {
        try{
            const budget = await BudgetModel.findOne({ _id: BudgetId, username });
            if(!budget){
                throw new Error("no budget found");
            }

            const transactions =  await TransactionModel.find({
                username,
                category: budget.category, 
                createdAt : {$gte : budget.createdAt}
             });

            const totalexpense = transactions.reduce((total , transaction)=>{
                return transaction.type === 'expense'? total + transaction.amount : total;
            },0);

            const remainingamount = budget.amount - totalexpense;
            const remainingBugetpercent = (remainingamount/ budget.amount)*100;

            return {
                remainingamount,
                totalexpense,
                remainingBugetpercent
            };

        }catch(err){
            logger.error(err);
            throw new Error({messsge: err.messsge});      
        }
    },
   
    calculateGoal : async(goalId) => {
        try{
            const goal =  await GoalModel.findOne(goalId);
            if(!goal){
                throw new Error("no goal fount from this category");
            }
            const transactions =  await TransactionModel.find({
                username,
                createdAt : {$gte : goal.createdAt}
             });
    
            const totalincome = transactions.reduce((total , transaction)=>{
                return transaction.type === 'income'? total + transaction.amount : total;
            },0);

            const remainingamount = 0
            if(totalincome < goal.amount){
                remainingamount  = goal.amount - totalincome;
            }
            const progress = (totalincome/ goal.amount) * 100;
            return {
                totalincome,
                remainingamount,
                progress
            };
        }
        catch(err){
            logger.error(err);
            throw new Error({messsge: err.messsge});   
        }
        
    }
}

module.exports = Management;