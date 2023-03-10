const request = require('supertest');
const Code = require('../Code');
const app = require('../app');

const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync();
});

describe('API health check', () => {
    jest.setTimeout(60000);
    test('test /api/health endpoint', async () => {
        const response = await request(app).get('/api/health');
        expect(response.statusCode).toEqual(Code.OK.httpCode);
        expect(response.body).toEqual(Code.messageCommon(Code.OK));
    });
});
