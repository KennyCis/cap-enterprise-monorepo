const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:29092'],
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

// Callbacks injected by index.js
let notifyUser = null;
let broadcastAll = null;

/**
 * Injects the notification callbacks from index.js
 * Must be called before connectConsumer()
 */
const setNotifyCallback = (notifyFn, broadcastFn) => {
  notifyUser = notifyFn;
  broadcastAll = broadcastFn;
};

/**
 * Connects to Kafka and starts consuming events.
 * Retries automatically every 5 seconds on failure.
 */
const connectConsumer = async () => {
  try {
    await consumer.connect();

    await consumer.subscribe({
      topics: ['booking.created', 'booking.cancelled', 'room.emergency'],
      fromBeginning: false,
    });

    console.log('✅ Kafka consumer connected and listening');

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        let data;

        try {
          data = JSON.parse(message.value.toString());
        } catch {
          console.error(`❌ Failed to parse Kafka message on topic [${topic}]`);
          return;
        }

        console.log(`📥 Kafka event received [${topic}]:`, data);

        // ── booking.created ───────────────────────────────────
        if (topic === 'booking.created') {
          const payload = {
            type: 'booking_confirmed',
            title: '✅ Booking Confirmed',
            message: `Room ${data.room_id} booked on ${data.reservation_date} from ${data.start_time} to ${data.end_time}`,
            data,
            timestamp: new Date().toISOString(),
          };
          if (notifyUser) notifyUser(data.teacher_email, payload);
        }

        // ── booking.cancelled ─────────────────────────────────
        if (topic === 'booking.cancelled') {
          const payload = {
            type: 'booking_cancelled',
            title: '❌ Booking Cancelled',
            message: `Your booking for room ${data.room_id} on ${data.reservation_date} has been cancelled`,
            data,
            timestamp: new Date().toISOString(),
          };
          if (notifyUser) notifyUser(data.teacher_email, payload);
        }

        // ── room.emergency — broadcast to all clients ─────────
        if (topic === 'room.emergency') {
          const payload = {
            type: 'emergency',
            title: '🚨 EMERGENCY ALERT',
            message: `Room ${data.room_id} is out of service — ${data.reason || 'Check immediately'}`,
            data,
            timestamp: new Date().toISOString(),
          };
          if (broadcastAll) broadcastAll(payload);
        }
      },
    });
  } catch (err) {
    console.error('❌ Kafka connection failed:', err.message);
    console.log('🔄 Retrying Kafka connection in 5 seconds...');
    setTimeout(connectConsumer, 5000);
  }
};

module.exports = { connectConsumer, setNotifyCallback };