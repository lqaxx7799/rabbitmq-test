const amqp = require('amqplib');
const { resolve } = require('bluebird');
const config = require('../config');

const assertQueueOptions = { durable: true };
const consumeQueueOptions = { noAck: false };
const { uri, workQueue } = config;

async function listenToQueue() {
  const connection = await amqp.connect(uri);
  const channel = await connection.createChannel();

  console.log('Worker is running! Waiting for new messages...');
  
  const ackMsg = async (msg) => {
    console.log('Received message');
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(msg.content.toString())
        resolve();
      }, 2000);
    });
    return channel.ack(msg);
  }

  return channel.assertQueue(workQueue, assertQueueOptions)
    .then(() => channel.prefetch(1))
    .then(() => channel.consume(workQueue, ackMsg, consumeQueueOptions));
}

module.exports = listenToQueue;
