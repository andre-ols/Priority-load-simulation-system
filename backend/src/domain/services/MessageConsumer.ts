import { logger } from "../../infra/logger";
import { RabbitMQConnection } from "../../infra/RabbitMQConnection";
import { Message } from "../models/Message";
import { MessageProcessor } from "./MessageProcessor";

export class MessageConsumer {
  private messageProcessor: MessageProcessor;
  private channel: any;

  constructor() {
    this.messageProcessor = new MessageProcessor();
    this.channel = null;
  }

  public async initialize(): Promise<void> {
    try {
      this.channel = await RabbitMQConnection.getInstance().connect();

      const queue = "priority_queue";
      await this.channel.assertQueue(queue, {
        durable: true,
        arguments: {
          "x-max-priority": 10,
        },
      });

      logger.info("Fila de prioridade configurada com sucesso!");

      const prefetchCount = 10;
      await this.channel.prefetch(prefetchCount);
      logger.info(`Prefetch count definido para ${prefetchCount}`);

      await this.channel.consume(
        queue,
        async (msg: any) => {
          if (msg !== null) {
            const parsedMsg: Message = JSON.parse(msg.content.toString());
            await this.messageProcessor.processMessage(parsedMsg);
            this.channel.ack(msg); // Confirma a mensagem
          }
        },
        { noAck: false }
      );
    } catch (err) {
      logger.error("Erro ao conectar ou consumir do RabbitMQ:", err);
    }
  }
}
