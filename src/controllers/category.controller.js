const categoryService = require('../services/category.service');
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

router.post('/category', async (req, res) => {
    try {
        const categoryinfo = req.body;
        await categoryService.createCategory(categoryinfo);
        res.status(201).send({ message: 'category noted successfully' });
    }
    catch (err) {
        logger.error(err);
        res.status(500).send({ message: err.message });
    }

})

router.get('/category', async(req,res)=>{
    try{
        const categoryid = req.query.categoryid;
        if(categoryid){
            const category = await categoryService.getCategory(categoryid);
            res.json(category); 
        }else{
            const token = req.headers.authorization;
            const userinfo = jwtUtils.validateToken(token);
            const username = userinfo.data;
            const categoryList = await categoryService.getCategoryList(username);
            res.json(categoryList);
        }
    }
    catch (err) {
        logger.error(err);
        res.status(500).send({ message: err.message });
    }
})

module.exports = router;