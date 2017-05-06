/**
 * Module that interacts with a RabbitMQ queue
 * and consumes on it, passing parsed messages to
 * the cache module
 */

var amqp = require('amqplib/callback_api');

var config = require('./config/config');
var rk = require('./const/routingKeys');


module.exports = {
    consume: startConsuming
};


/**
 * start a consumer (after connecting to rabbit)
 * that saves messages to an array
 * @param messages
 */
function startConsuming(cache) {

    /* connect to rabbit queue */
    amqp.connect(config.RABBIT_HOST, function(err, conn){
        if(err){ console.log("Rabbit conn FAILED!"); return;}

        /* create channel on previously esatablished connection */
        conn.createChannel(function(err, ch){

            ch.assertExchange(config.RABBIT_EXCHANGE_NAME, 'topic', {durable: false});

            /* create queue */
            ch.assertQueue(config.RABBIT_QUEUE_NAME, {exclusive: false}, function(err,q){

                /**
                 * interate over routing keys and bind each one
                 * to the previously created queue
                 */
                for(var prop in rk){
                    ch.bindQueue(q.queue, config.RABBIT_EXCHANGE_NAME, rk[prop]);
                }

                /* create a client that consumes on the queue
                * and inserts messages in an array */
                ch.consume(q.queue, function(msg){

                    /* insert into REDIS cache  */
                    cache.put(msg)

                }, {noAck : true});
            });

        });
    });
}



