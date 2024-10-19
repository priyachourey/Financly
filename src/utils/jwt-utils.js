const jwt = require('jsonwebtoken');
const config = require('./config');

const jwtUtils = {
  createToken: (data) => {
    return jwt.sign({
      data: data,
    }, config.SECRET_KEY, {expiresIn: 60 * 60});
  },

  validateToken: (token) => {
    return jwt.verify(token, config.SECRET_KEY);
  },
};

module.exports = jwtUtils;
