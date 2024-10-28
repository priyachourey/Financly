const statusService = require("../services/status.service")
const router = require("express").Router();
const logger = require("../utils/logger");
const jwtUtils = require("../utils/jwt-utils");

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

router.get('/state' , async(req,res)=>{

    try{
        const token = req.headers.authorization;
        const userinfo = jwtUtils.validateToken(token);
        const username = userinfo.data;
        expenseStatus = await statusService.getStatus(username)
        return json(expenseStatus)
    }
   catch(err){
    logger.error(err);
    res.status(500).send({ message: err.message });
   }
});