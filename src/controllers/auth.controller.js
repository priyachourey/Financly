// eslint-disable-next-line new-cap
const router = require('express').Router();
const logger = require('../utils/logger');
const authService = require('../services/auth.service');
router.post('/register', async (req, res)=>{
  try {
    const userinfo = req.body;
    await authService.createAccount(userinfo);
    res.status(201).send({message:"account created successfully"});
  } catch (err) {
    logger.error(err);
    res.status(500).send({message: err.message});
  }
});

router.post('/login', async (req, res)=>{
  try {
    const userinfo = req.body;
    result = await authService.login(userinfo);
    res.send({message: result, username:userinfo.username});
  } catch (err) {
    logger.error(err);
    res.status(500).send({message: err.message});
  }
});

module.exports = router;
