const request = require('supertest');
const { app } = require('../src/server');

describe('Healthcheck API', () => {
  it('debería responder con status 200 y decir que el servicio está UP', async () => {
    // Cambia la ruta si la tuya es distinta, ej: /api/auth/health
    const response = await request(app).get('/api/reservations/health'); 
    
    expect(response.status).toBe(200);
    // Valida lo que devuelva tu servicio
    expect(response.body).toHaveProperty('status', 'UP'); 
  });
});