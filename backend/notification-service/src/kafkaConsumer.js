const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'notification-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

// The groupId ensures multiple instances of this service don't read the same message twice
const consumer = kafka.consumer({ groupId: 'notification-group' });

const connectConsumer = async () => {
    try {
        await consumer.connect();
        console.log('✅ Kafka Consumer connected to broker');
        
        // Subscribe to the reservations topic
        await consumer.subscribe({ topic: 'reservations', fromBeginning: true });
        
        // Listen for new messages
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const event = JSON.parse(message.value.toString());
                
                if (event.event === 'RESERVATION_CREATED') {
                    const { teacher_email, room_id, reservation_date } = event.data;
                    
                    console.log('\n--------------------------------------------------');
                    console.log(`📧 SENDING EMAIL TO: ${teacher_email}`);
                    console.log(`📝 SUBJECT: Reservation Confirmed for Room ${room_id}`);
                    console.log(`📅 DATE: ${reservation_date}`);
                    console.log('--------------------------------------------------\n');
                }
            },
        });
    } catch (error) {
        console.error('❌ Error in Kafka Consumer:', error);
    }
};

module.exports = { connectConsumer };