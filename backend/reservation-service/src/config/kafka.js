const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'reservation-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();

const connectProducer = async () => {
    try {
        await producer.connect();
        console.log('✅ Kafka Producer connected to broker');
    } catch (error) {
        console.error('❌ Error connecting Kafka Producer:', error);
    }
};

const sendReservationEvent = async (reservationData) => {
    try {
        await producer.send({
            topic: 'reservations',
            messages: [
                { 
                    key: reservationData.room_id, 
                    value: JSON.stringify({
                        event: 'RESERVATION_CREATED',
                        data: reservationData
                    }) 
                }
            ],
        });
        console.log(`📢 Event sent to Kafka for room: ${reservationData.room_id}`);
    } catch (error) {
        console.error('❌ Error sending event to Kafka:', error);
    }
};

module.exports = { connectProducer, sendReservationEvent };