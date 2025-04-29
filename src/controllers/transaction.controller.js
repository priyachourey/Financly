const transactionService = require('../services/transaction.service')
const router = require('express').Router();
const logger = require('../utils/logger');
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


router.post('/transaction', async (req, res) => {
    try {
        const transactioninfo = req.body;
        await transactionService.createTransaction(transactioninfo);
        res.status(201).send({ message: 'Transaction noted successfully' });
    }
    catch (err) {
        logger.error(err);
        res.status(500).send({ message: err.message });
    }

})

router.get('/transaction', async(req,res)=>{
    try{
        const transactionid = req.query.transactionid;
        const accountId = req.query.accountId;
        console.log (accountId);
        if(transactionid){
            const transaction = await transactionService.getTransaction(transactionid);
            res.json(transaction); 
        }else if(accountId){
            const AccountTransaction = await transactionService.getAccountTransactionList(accountId);
            res.json(AccountTransaction);
        }else{
            const token = req.headers.authorization;
            const userinfo = jwtUtils.validateToken(token);
            const username = userinfo.data;
            const transactionList = await transactionService.getTransactionList(username);
            res.json(transactionList);
        }
    }
    catch (err) {
        logger.error(err);
        res.status(500).send({ message: err.message });
    }
})

router.get('/users/:userId/private-total', async (req, res) => {
  try {
    const userId = req.params.userId;

    const total = await transactionModel.aggregate([
      { $match: { createdBy: new ObjectId(userId), type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.send({ total: total[0]?.total || 0 });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;