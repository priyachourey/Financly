const router = require('express').Router();
const logger = require('../utils/logger');
const accountService = require('../services/account.service');
const jwtUtils = require('../utils/jwt-utils');
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


router.post('/account', async(req,res)=> {
  try{
    const accountData = req.body;

    if (!req.body.name || req.body.name.trim() === "") {
      console.error("🚨 Account name is empty!");
      return res.status(400).json({ error: "Account name is required" });
  }
    console.log(accountData);
    await accountService.createAccount(accountData);
    res.status(200).send({message:"account created successfully"})
  }catch (err) {
    logger.error(err);
    res.status(500).send({ message: err.message });
}

});

router.get('/account', async (req, res) => {
  try {
      const accountId = req.query.accountId;
      if (accountId) {
          const account = await accountService.getAccount(accountId);
          res.json(account);
      }else{
          const token = req.headers.authorization;
          const userinfo = jwtUtils.validateToken(token);
          const username = userinfo.data;
          const accountList = await accountService.getAccountList(username);
          res.json(accountList);
      }
  }catch(err){
      logger.error(err);
      res.status(500).send({message : err.message})
  }
})

router.post('/members/:accountId', async(req , res)=>{
  try{
      const accountid = req.params.accountId;
      const members = req.body.memberList;
      await accountService.addMember(accountid , members)
      res.status(200).send({message:  "members added successfully"})
  }catch(err){
    logger.error(err);
    res.status(500).send({message : err.message})
  }
})

router.get('/searchmember', async(req,res)=>{
    try{
    const  { query = ''} =  req.query;
      const results = await accountService.searchMember(query);
      res.json(results);
    }catch(err){
      logger.error(err);
      res.status(500).send({message : err.message})
    }
})

module.exports = router