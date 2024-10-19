const CategoryModel = require('../models/categories.model');
const logger = require('../utils/logger');

const CategoryService = {

    createCategory: async (Categorydata) => {
        try {
            const CategoryData = new CategoryModel(Categorydata);
            await CategoryData.save();
        }
        catch (err) {
            logger.error(err);
            throw new Error("some error occured while saving the Category");
        }
    },

    getCategory: async (Categoryid) => {
        try {
            const Category = await CategoryModel.findById(Categoryid);
            return Category;
        } catch {
            logger.error(err);
            throw new Error("some error occured while fetching Category");
        }

    },

    getCategoryList: async (username) => {
        try {
            const CategoryList = await CategoryModel.find({ username: username });
            return CategoryList;
        } catch {
            logger.error(err);
            throw new Error("some error occured while fetching Category");
        }
    }


}

module.exports = CategoryService;