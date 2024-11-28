const router = require('express').Router();
const logger = require('../utils/logger');
const goalService = require('../services/goal.service');
const jwtUtils = require('../utils/jwt-utils')

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


router.post('/goal', async (req, res) => {
    try {
        const goalinfo = req.body;
        await goalService.createGoal(goalinfo);
        res.status(201).send({ message: 'goal noted successfully' });
    }
    catch (err) {
        logger.error(err);
        res.status(500).send({ message: err.message });
    }

})

router.get('/goal', async(req,res)=>{
    try{
        const goalid = req.query.goalid;
        if(goalid){
            const goal = await goalService.getgoal(goalid);
            res.json(goal); 
        }else{
            const token = req.headers.authorization;
            const userinfo = jwtUtils.validateToken(token);
            const username = userinfo.data;
            const goalList = await goalService.getGoalList(username);
            res.json(goalList);
        }
    }
    catch (err) {
        logger.error(err);
        res.status(500).send({ message: err.message });
    }
})

router.delete('/goal', async(req,res)=>{
  try{
      const goalid = req.query.goalid;
      if(goalid){
        await goalService.removeGoal(goalid);
        res.status(201).send({ message: 'Goal removed successfully' });
      }
  }catch(err){
    logger.error(err);
    res.status(500).send({ message: err.message });
  }
})

module.exports = router;