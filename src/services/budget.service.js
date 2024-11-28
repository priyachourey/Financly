const BudgetModel = require('../models/budget.model');
const logger = require('../utils/logger');

const BudgetService = {

    createBudget: async (Budgetdata) => {
        try {
            Budgetdata.expiry = new Date(Budgetdata.expiry)
            let budgetData = new BudgetModel(Budgetdata);
            await budgetData.save();
        }
        catch (err) {
            logger.error(err);
            throw new Error("some error occured while saving the Budget");
        }
    },

    getBudget: async (Budgetid) => {
        try {
            const Budget = await BudgetModel.findById(Budgetid);
            return Budget;
        } catch(err) {
            logger.error(err);
            throw new Error("some error occured while fetching Budget");
        }

    },

    getBudgetList: async (username) => {
        try {
            const BudgetList = await BudgetModel.find({ username: username });
            return BudgetList;
        } catch (err) {
            logger.error(err);
            throw new Error("some error occured while fetching Budget");
        }
    },

    removeBudget : async(Budgetid)=>{
        try{
            await BudgetModel.findOneAndDelete(Budgetid);
        }catch(err){
            logger.error(err);
            throw new Error("some error occured while deleting Budget");
        }
    }


}

module.exports = BudgetService;