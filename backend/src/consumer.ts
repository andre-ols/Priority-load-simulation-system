import amqp from "amqplib";
import { logger } from "./logger";

async function connectToRabbitMQ() {
  try {
    // Conectar ao RabbitMQ
    const conn = await amqp.connect("amqp://user:password@localhost");

    logger.info("Conectado ao RabbitMQ com sucesso!");
    logger.info("Iniciando o consumidor de mensagens...");
    const ch = await conn.createChannel();

    const queue = "priority_queue";

    // Declara a fila com prioridade
    await ch.assertQueue(queue, {
      durable: true,
      arguments: {
        "x-max-priority": 10, // Define a prioridade máxima como 10
      },
    });

    logger.info("Fila de prioridade configurada com sucesso!");

    // Definir o prefetchCount para limitar a quantidade de mensagens que o consumidor pode pegar ao mesmo tempo
    const prefetchCount = 10;
    await ch.prefetch(prefetchCount); // Limita a 10 mensagens não confirmadas
    logger.info(`Prefetch count definido para ${prefetchCount}`);

    // Consumir mensagens da fila
    await ch.consume(
      queue,
      async (msg) => {
        if (msg !== null) {
          await processMessage(msg, ch);
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error("Erro ao conectar ou consumir do RabbitMQ:", err);
  }
}

// Função para processar as mensagens
async function processMessage(msg: amqp.ConsumeMessage, ch: amqp.Channel) {
  const parsedMsg = JSON.parse(msg.content.toString());
  logger.debug(
    `Recebido pedido com prioridade [${parsedMsg.priority}]: ${parsedMsg.content}`
  );

  // Simula o processamento do pedido com um setTimeout
  await new Promise((resolve) => setTimeout(resolve, 500 * 5)); // Simula o tempo de processamento

  logger.info(`Pedido processado com sucesso: ${parsedMsg.content}`);
  ch.ack(msg); // Confirma que a mensagem foi processada com sucesso
}

// Iniciar a conexão com o RabbitMQ e consumir mensagens
connectToRabbitMQ();
