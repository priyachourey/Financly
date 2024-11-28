const GoalModel = require('../models/goals.model');
const logger = require('../utils/logger');

const GoalService = {

    createGoal: async (Goaldata) => {
        try {
            Goaldata.expiry = new Date(Goaldata.expiry)
            let GoalData = new GoalModel(Goaldata);
            await GoalData.save();
        }
        catch (err) {
            logger.error(err);
            throw new Error("some error occured while saving the Goal");
        }
    },

    getGoal: async (Goalid) => {
        try {
            const Goal = await GoalModel.findOne(Goalid);
            return Goal;
        } catch {
            logger.error(err);
            throw new Error("some error occured while fetching Goal");
        }

    },

    getGoalList: async (username) => {
        try {
            const GoalList = await GoalModel.find({ username: username });
            return GoalList;
        } catch {
            logger.error(err);
            throw new Error("some error occured while fetching Goal");
        }
    },

    removeGoal : async (GoalId)=>{
        try{
             await GoalModel.findOneAndDelete(GoalId);
        }catch{
            logger.error(err);
            throw new Error("some error occured while deleting Goal");
        }
    }


}

module.exports = GoalService;