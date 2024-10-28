const TransactionModel = require('../models/transaction.model')
const logger = require('../utils/logger');

const StatService = {
  getStatus: async (username) => {
    try {
      const transactions = await TransactionModel.find({ username: username });
      if (!transactions) {
        throw new Error("error retriving tramsaction");
      } else {
        const aggregateAmount = await TransactionModel.aggregate([
          {
            $group: {
              _id: "$category",
              totalamount: { $sum: "$amount" },
            },
          },
        ]);

        return aggregateAmount;
      }
    } catch (err) {
      logger.error(err);
      throw new Error({ message: err.message });
    }
  }
}

module.exports = StatService


