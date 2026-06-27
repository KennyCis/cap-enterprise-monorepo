// backend/auth-service/tests/auth.test.js
const request = require('supertest');
const app = require('../src/server'); 

describe('Auth Service API', () => {
  test('POST /api/auth/login should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login/')
      .send({ email: 'wrong@uce.edu.ec', password: 'wrong' });
    
    expect(response.statusCode).toBe(401);
  });
});