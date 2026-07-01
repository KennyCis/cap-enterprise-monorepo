const request = require('supertest');
const { app } = require('../src/server'); 

describe('Healthcheck API', () => {
  it('debería responder con status 200 y decir que el servicio está UP', async () => {
     ej: /api/auth/health
    const response = await request(app).get('/api/auth/health'); 
    
    expect(response.status).toBe(200);
   
    expect(response.body).toHaveProperty('status', 'UP'); 
  });
});