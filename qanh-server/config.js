const rabbitConfig = {
  uri: process.env.rabbbitUri || 'amqp://rabbitmq:rabbitmq@rabbitmq:5672',
  workQueue: process.env.workQueue || 'workQueue',
};

module.exports = rabbitConfig;