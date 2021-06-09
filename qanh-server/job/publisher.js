const amqp = require('amqplib');
const { resolve } = require('bluebird');
const config = require('../config');

const assertQueueOptions = { durable: true };
const sendToQueueOptions = { persistent: true };

const { uri, workQueue } = config;
const exchange = "send_with_delay_new";


async function publish(eventName, eventData, delayInMilliSeconds) {
  const connection = await amqp.connect(uri);
  const channel = await connection.createChannel();

  const bufferedData = Buffer.from(JSON.stringify({
    eventName,
    eventData,
  }));

  channel.assertExchange(exchange, "x-delayed-message", {
    durable: true,
    arguments: {
      'x-delayed-type': "direct",
    },
  });

  channel.bindQueue(workQueue, exchange, workQueue);

  channel.publish(exchange, workQueue, bufferedData, {
    headers: {
      "x-delay": delayInMilliSeconds,
    },
    persistent: true,
  });

  // return channel.assertQueue(workQueue, assertQueueOptions)
  //   .then(() => channel.sendToQueue(workQueue, bufferedData, sendToQueueOptions))
  //   .then(() => channel.close());
}

module.exports = publish;
