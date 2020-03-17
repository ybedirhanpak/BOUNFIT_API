require('dotenv').config();

export default {
  port: process.env.PORT,
  databaseURL: process.env.DATABASE_CONNECTION,
  jwtSecret: process.env.SECRET,
  api: {
    prefix: '/api',
  },
  isTesting: () => (process.env.NODE_ENV === 'test'),
};
