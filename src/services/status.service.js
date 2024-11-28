const TransactionModel = require('../models/transaction.model')
const logger = require('../utils/logger');

const StatService = {
  getStatus: async (username) => {
    try {
      const transactions =  await TransactionModel.find({
        username,
        type : 'expense'
     });
      if (!transactions) {
        throw new Error("error retriving tramsaction");
      } else {
        const aggregateAmount = await TransactionModel.aggregate([
          {
            $lookup: {
              from: "categorys", // Collection name for categories
              localField: "category", // Field in TransactionModel referencing categories
              foreignField: "_id", // Field in CategoryModel
              as: "category_info", // Output array containing category details
            },
          },
          {
            $unwind: "$category_info", // Flatten category_info array to access fields
          },
          {
            $group: {
              _id: "$category_info.name", // Group by category name
              totalamount: { $sum: "$amount" }, // Sum the amount field
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


