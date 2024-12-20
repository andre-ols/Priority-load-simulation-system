import { logger } from "../../infra/logger";
import { MessageService } from "./MessageProducer";

export class MessageGenerator {
  public static startGeneratingMessages(messageRate: number): void {
    const interval = 1000 / messageRate;

    setInterval(async () => {
      try {
        const message = await MessageService.generateMessage(); // Gera um pedido com prioridade aleatória
        await MessageService.sendMessageToQueue(message);
      } catch (err) {
        logger.error("Erro ao gerar e enviar pedido:", err);
      }
    }, interval);
  }
}
