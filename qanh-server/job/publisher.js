const amqp = require('amqplib');
const config = require('../config');

const { uri, workQueue } = config;
const exchange = "send_with_delay_new";

async function publish(eventName, eventData, delayInMilliSeconds) {
  try {
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
  
    const isSuccess = channel.publish(exchange, workQueue, bufferedData, {
      headers: {
        "x-delay": delayInMilliSeconds,
      },
      persistent: true,
    });
    console.log(isSuccess);
    return isSuccess;
  } catch (e) {
    console.log('[Publisher] Connectioned failed');
    return setTimeout(() => publish(eventName, eventData, delayInMilliSeconds), 500);
  }
  // return channel.assertQueue(workQueue, assertQueueOptions)
  //   .then(() => channel.sendToQueue(workQueue, bufferedData, sendToQueueOptions))
  //   .then(() => channel.close());
}

module.exports = publish;
