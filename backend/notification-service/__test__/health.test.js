// backend/notification-service/__tests__/health.test.js
const request = require('supertest');
const { app, server } = require('../src/server');

describe('Notification Service API', () => {
  

  describe('GET /api/notifications/health', () => {
    it('should respond with status 200 and indicate service is UP', async () => {
      
      const response = await request(app).get('/api/notifications/health');
      
    
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'UP');
      expect(response.body).toHaveProperty('service', 'Notification Service');
    });
  });
});