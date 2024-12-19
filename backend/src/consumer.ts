import { MessageConsumer } from "./domain/services/MessageConsumer";

async function main() {
  const messageConsumer = new MessageConsumer();
  await messageConsumer.initialize();
}

main().catch((err) => {
  console.error("Erro na aplicação:", err);
});
