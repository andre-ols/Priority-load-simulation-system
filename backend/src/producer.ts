import { MessageGenerator } from "./domain/services/MessageGenerator";

async function main() {
  const messageRate = 10; // Enviar 10 mensagens por segundo
  MessageGenerator.startGeneratingMessages(messageRate);
}

main().catch((err) => {
  console.error("Erro na aplicação:", err);
});
