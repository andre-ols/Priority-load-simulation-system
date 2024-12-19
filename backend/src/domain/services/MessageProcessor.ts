import { logger } from "../../infra/logger";
import { Message } from "../models/Message";

export class MessageProcessor {
  public async processMessage(message: Message): Promise<void> {
    logger.debug(
      `Processando pedido com prioridade [${message.priority}]: ${message.content}`
    );

    // Simula o tempo de processamento
    await new Promise((resolve) => setTimeout(resolve, 500 * 5));

    logger.info(`Pedido processado com sucesso: ${message.content}`);
  }
}
