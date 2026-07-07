const request = require('supertest');
const app = require('../src/server');

describe('Healthcheck API', () => {
  it('should respond with status 200 and indicate service is UP', async () => {
    const response = await request(app).get('/api/reservations/health'); 
    
    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('status', 'UP'); 
  });
});