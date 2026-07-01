// backend/reservation-service/tests/reservation.test.js
const request = require('supertest');
const app = require('../src/server'); // Asegúrate de exportar la instancia de tu app Express

describe('Reservation Service API', () => {
  
  // Test para verificar que no se pueden crear reservas sin token (Seguridad)
  test('POST /api/reservations/ should return 401 if no token is provided', async () => {
    const response = await request(app)
      .post('/api/reservations/')
      .send({
        room_id: 'A-101',
        reservation_date: '2026-06-30',
        start_time: '08:00:00',
        end_time: '10:00:00'
      });
    
    expect(response.statusCode).toBe(401);
  });

  // Test para verificar que el servicio valida datos incompletos
  test('POST /api/reservations/ should return 400 for missing fields', async () => {
    const response = await request(app)
      .post('/api/reservations/')
      .set('Authorization', 'Bearer dummy_token') // Simulamos un token
      .send({
        room_id: 'A-101'
        // Falta la fecha y las horas
      });
    
    expect(response.statusCode).toBe(400);
  });
});