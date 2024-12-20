import { faker } from "@faker-js/faker";
import { logger } from "../../infra/logger";
import { RabbitMQConnection } from "../../infra/RabbitMQConnection";
import { Message } from "../models/Message";

// Função para gerar uma prioridade aleatória (Alta, Média, Baixa)
function getRandomPriority(): number {
  const priorities = [10, 5, 0]; // Alta, Média, Baixa
  return priorities[Math.floor(Math.random() * priorities.length)];
}

export class MessageService {
  private static readonly queueName = "priority_queue";

  public static async generateMessage(): Promise<Message> {
    return {
      content: faker.commerce.productName(),
      priority: getRandomPriority(),
      timestamp: new Date().toISOString(),
    };
  }

  public static async sendMessageToQueue(message: Message): Promise<void> {
    try {
      const channel = await RabbitMQConnection.getInstance().connect();

      await channel.assertQueue(MessageService.queueName, {
        durable: true,
        arguments: {
          "x-max-priority": 10, // Define a prioridade máxima como 10
        },
      });

      const stringMessage = JSON.stringify(message);
      channel.sendToQueue(
        MessageService.queueName,
        Buffer.from(stringMessage),
        {
          persistent: true, // A mensagem será persistente
          priority: message.priority, // Define a prioridade da mensagem
        }
      );

      logger.debug(
        `Enviado pedido com prioridade ${message.priority}: ${message.content}`
      );
    } catch (err) {
      logger.error("Erro ao enviar mensagem para a fila:", err);
    }
  }
}
