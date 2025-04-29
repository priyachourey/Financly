const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");
const logger = require("../utils/logger");
const mongoose = require("mongoose");

const accountServices = {
  createAccount: async (accountData) => {
    try {
      const AD = accountData;
      // 🔹 Find the user by username to get their ObjectId
      const user = await userModel.findOne({ username: accountData.owner });

      if (!user) {
        throw new Error("User not found");
      }

      accountData.owner = user._id;

      const Account = new accountModel({
        name: accountData.name,
        members: [user._id],
      });

      // 🔹 Store the ObjectId in the members array
      Account.members = [user._id];

      const saved = await Account.save(); //saved includes extra fields added by MongoDB

      //  Update the user's sharedIds field with the newly created account's ID
      await userModel.findByIdAndUpdate(
        user._id,
        { $push: { sharedIds: saved._id } },
        { new: true }
      );
      const updated = saved;
      console.log(updated);
      return saved; // Return the saved account
    } catch (err) {
      logger.error(err);
      throw new Error("Some error occurred while creating shared account");
    }
  },

  searchMember: async (email, username) => {
    try {
      const filters = [];
  
      if (username) {
        filters.push({ username: { $regex: new RegExp(username, "i") } });
      }
  
      if (email) {
        filters.push({ email: { $regex: new RegExp(email, "i") } });
      }
  
      if (filters.length === 0) return []; 
  
      const user = await userModel
        .find({ $or: filters })
        .select("email username");
  
      return user;
    } catch (err) {
      logger.error(err);
      throw new Error("some error occurred while searching member");
    }
  },

  addMember: async (accountId, members) => {
    try {
      const account = await accountModel.findById(accountId);
      if (!account) throw new Error("account not found");
  
      const existingMembers = account.members.map((id) => id.toString());
      const newMembers = members.filter(
        (member) => !existingMembers.includes(member._id.toString())
      );
  
      newMembers.forEach((member) => {
        account.members.push(member._id); // ✅ Only ObjectId
      });
  
      await account.save();
  
      await Promise.all(
        newMembers.map((member) =>
          userModel.findByIdAndUpdate(
            member._id,
            { $push: { sharedIds: accountId } },
            { new: true }
          )
        )
      );
    } catch (err) {
      logger.error(err);
      throw new Error(err.message);
    }
  },
  
  getAccount: async (Accountid) => {
    try {
      const Account = await accountModel.findById(Accountid);
      return Account;
    } catch (err) {
      logger.error(err);
      throw new Error("some error occured while fetching Account");
    }
  },

  getAccountList: async (username) => {
    try {
      // 🟢 Step 1: Fetch user and ensure they exist
      const user = await userModel.findOne({ username }).lean();
      if (!user) {
        return { success: false, message: "User not found", accounts: [] };
      }

      console.log(user.sharedIds);
      // 🟢 Step 2: Extract shared account IDs
      if (!user.sharedIds || user.sharedIds.length === 0) {
        return {
          success: false,
          message: "No shared accounts found",
          accounts: [],
        };
      }

      // Ensure IDs are in correct format for querying
      const sharedAccountIds = user.sharedIds.map(
        (obj) => new mongoose.Types.ObjectId(obj._id)
      );

      // 🟢 Step 3: Fetch accounts using sharedIds
      const accounts = await accountModel
        .find({ _id: { $in: sharedAccountIds } })
        .select("name _id");

      if (!accounts.length) {
        return {
          success: false,
          message: "No shared accounts found",
          accounts: [],
        };
      }

      return { success: true, accounts };
    } catch (error) {
      console.error("❌ Error fetching shared accounts:", error.message);
      return { 
        success: false, 
        message: error.message,
        accounts: [] };
    }
  },
};

module.exports = accountServices;
