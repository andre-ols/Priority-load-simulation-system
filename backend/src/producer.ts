import { faker } from "@faker-js/faker";
import * as amqp from "amqplib";
import { logger } from "./infra/logger";

// Função para gerar uma prioridade aleatória (Alta, Média, Baixa)
function getRandomPriority() {
  const priorities = [10, 5, 0]; // Alta, Média, Baixa
  return priorities[Math.floor(Math.random() * priorities.length)];
}

// Função para gerar um pedido com dados aleatórios
function generateOrder() {
  return {
    content: faker.commerce.productName(), // Gera um nome de cor aleatório
    priority: getRandomPriority(),
    timestamp: new Date().toISOString(),
  };
}

async function sendMessageToQueue(
  channel: amqp.Channel,
  queue: string,
  order: any
) {
  try {
    const message = JSON.stringify(order);
    channel.sendToQueue(queue, Buffer.from(message), {
      persistent: true, // A mensagem será persistente
      priority: order.priority, // Define a prioridade da mensagem
    });
    logger.debug(
      `Enviado pedido com prioridade ${order.priority}: ${order.content}`
    );
  } catch (err) {
    logger.error("Erro ao enviar mensagem para a fila:", err);
  }
}

async function generateLoad() {
  try {
    // Conectar ao RabbitMQ
    const connection = await amqp.connect("amqp://user:password@localhost");
    const channel = await connection.createChannel();
    const queue = "priority_queue";

    // Declara a fila com prioridade
    await channel.assertQueue(queue, {
      durable: true,
      arguments: {
        "x-max-priority": 10, // Define a prioridade máxima como 10
      },
    });

    console.log("Fila de prioridade configurada com sucesso!");

    // Enviar mensagens periodicamente
    const messageRate = 10; // Enviar 10 mensagens por segundo
    const interval = 1000 / messageRate; // Intervalo entre cada mensagem

    setInterval(() => {
      const order = generateOrder(); // Gera um pedido com prioridade aleatória
      sendMessageToQueue(channel, queue, order);
    }, interval);
  } catch (err) {
    console.error("Erro ao conectar ou enviar para o RabbitMQ:", err);
  }
}

// Iniciar o gerador de carga
generateLoad();
