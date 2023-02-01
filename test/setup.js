/**
 * setup script for jest test
 */
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: `${path.join(__dirname, '../config/.env')}`,
});
