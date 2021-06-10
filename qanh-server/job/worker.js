const amqp = require('amqplib');
const config = require('../config');

const assertQueueOptions = { durable: true };
const consumeQueueOptions = { noAck: false };
const { uri, workQueue } = config;

async function listenToQueue() {
  try {
    const connection = await amqp.connect(uri);
    connection.on('close', () => {
      console.log('[Worker] Connection closed. Reconnecting in 10 seconds...');
      return setTimeout(listenToQueue, 10 * 1000);
    });

    const channel = await connection.createChannel();

    console.log('Worker is running! Waiting for new messages...');
    
    const ackMsg = async (msg) => {
      console.log('Received message');
      await doHeavyTask(2000);
      console.log(msg.content.toString())
      return channel.ack(msg);
    }

    return channel.assertQueue(workQueue, assertQueueOptions)
      .then(() => channel.prefetch(1))
      .then(() => channel.consume(workQueue, ackMsg, consumeQueueOptions));
  } catch (e) {
    console.log('[Worker] Connection failed');
    return setTimeout(listenToQueue, 10 * 1000);
  }
}

function doHeavyTask(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

module.exports = listenToQueue;
