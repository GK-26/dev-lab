#!/usr/bin/env node

const amqp = require('amqplib');

async function main() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel();

  const queue = 'task-queue'

  await channel.assertQueue(queue, {
    durable: true,
    arguments: {'x-queue-type': 'quorum'}
  })

  console.log(" [*] waiting for messages in %s. To exit press CTRL+C], queue")

channel.consume(queue, function(msg) {
  const secs = msg.content.toString().split('.').length - 1    

  console.log(" [X] Received %s", msg.content.toString())

  setTimeout(function() {
    console.log(" [X] Done")
  }, secs * 1000)
  }, {
    noAck: true
  })
}

main()

