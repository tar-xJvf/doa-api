// src/config/env.js
require('dotenv').config();

module.exports = {
  // Server
  PORT: process.env.PORT || 3000,

  // Database
  DB_USER: process.env.DB_USER || 'amrilhs',
  DB_PASS: process.env.DB_PASS || 'amril123',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || 'doadatabase',

  // API Keys
  MOBILE_API_KEY: process.env.MOBILE_API_KEY || 'AUiR3ZYS5Xyl3RbSGxKeKmaFK39gFrPsLBbfnsLe8wDLkakiu1QjyQNlgGTvtpIxy',
  ADMIN_SECRET: process.env.ADMIN_SECRET || 'qlFvLMZ7RSshs6ECXC6dNeT2gBmhjw7zIgzC3WI0rhpOJnHJBKg4MliXSiJQrCXj',
};
