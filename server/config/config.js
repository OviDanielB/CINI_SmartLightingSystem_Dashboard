/**
 * Configuration file for REDIS
 * and RABBITMQ connection parameters
 */


module.exports = {
    REDIS_HOST: "localhost",
    REDIS_PORT: 6379,
    RABBIT_HOST: "amqp://localhost:5673",
    RABBIT_QUEUE_NAME: "dashboard",
    RABBIT_EXCHANGE_NAME: "dashboard_exchange"
};