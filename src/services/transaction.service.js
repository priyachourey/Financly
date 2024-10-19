const TransactionModel = require('../models/transaction.model');
const logger = require('../utils/logger');

const transactionService = {

    createTransaction: async (transactiondata) => {
        try {
            const TransactionData = new TransactionModel(transactiondata);
            await TransactionData.save();
        }
        catch (err) {
            logger.error(err);
            throw new Error({messsge: err.messsge});
        }
    },

    getTransaction: async (transactionid) => {
        try {
            const Transaction = await TransactionModel.findOne(transactionid);
            return Transaction;
        } catch {
            logger.error(err);
            throw new Error("some error occured while fetching transaction");
        }

    },

    getTransactionList: async (username) => {
        try {
            const TransactionList = await TransactionModel.find({ username: username });
            return TransactionList;
        } catch(err) {
            logger.error(err);
            throw new Error("some error occured while fetching transaction");
        }
    }


}

module.exports = transactionService