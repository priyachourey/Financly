const config = {
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017',
  DATABASE_USER: process.env.DATABASE_USER || 'admin',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'root',
  DATABASE_AUTH_SOURCE: process.env.DATABASE_AUTH_SOURCE || 'admin',
  DATABASE_NAME: process.env.DATABASE_NAME || 'financly',
  SERVER_PORT: process.env.PORT || 8000,
  SECRET_KEY: process.env.SECRET_KEY || 'JAI__MATA__DI',
};

module.exports = config;
