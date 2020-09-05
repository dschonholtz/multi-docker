const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
  let i = 1;
  let prev_cum = 1;
  let cumulative = 1;
  if (index < 2) return 1;
  for(; i<index; i++) {
    temp = prev_cum;
    prev_cum = cumulative;
    cumulative = cumulative + temp;
  }
  return cumulative
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
