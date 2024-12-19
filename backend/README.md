# Sistema de Simulação de Carga e Processamento com Prioridade

Este projeto simula uma aplicação com alto volume de mensagens, processadas de acordo com a sua prioridade. Desenvolvido com **Node.js** e **TypeScript**, o sistema é composto por dois componentes principais:

- **Producer**: Simula o envio contínuo de mensagens ao **broker** (RabbitMQ), imitando um cenário de pico de carga na aplicação.
- **Consumer**: Processa as mensagens recebidas, levando em consideração a **prioridade** das mensagens, e não a ordem de chegada.

## Vantagens da Prioridade no Processamento

Processar as mensagens com base na prioridade oferece várias vantagens para sistemas que exigem alta performance e eficiência:

- **Redução de Latência**: Mensagens de alta prioridade são processadas mais rapidamente, garantindo que as operações mais críticas sejam atendidas primeiro.
- **Otimização de Recursos**: Ao processar as mensagens mais urgentes primeiro, o sistema pode minimizar a sobrecarga e evitar que mensagens menos importantes sobrecarreguem os recursos.
- **Melhoria na Experiência do Usuário**: Processar e responder mais rapidamente às mensagens prioritárias melhora a eficiência geral do sistema e a experiência do usuário.
- **Escalabilidade**: A priorização permite que o sistema seja mais escalável, já que as mensagens de alta prioridade podem ser tratadas primeiro, garantindo que a infraestrutura não fique sobrecarregada.

## Tecnologias Utilizadas

- **Node.js** com **TypeScript**
- **RabbitMQ** como broker de mensagens
- **faker.js** para gerar mensagens aleatórias
- **winston** para logging
- **amqplib** para comunicação com o RabbitMQ
- **Docker Compose** para orquestração de containers

## Arquitetura

A arquitetura do sistema é composta por três principais componentes:

1. **Producer**: Envia mensagens continuamente para o RabbitMQ. As mensagens são geradas aleatoriamente usando a biblioteca `faker.js` e publicadas no broker sem interrupções.
2. **Consumer**: Consome as mensagens do RabbitMQ, processando-as em grupos de 10. A principal característica é que ele processa as mensagens **com base na prioridade** e não pela ordem de chegada.

3. **RabbitMQ**: O broker de mensagens usado para gerenciar a fila de mensagens entre o Producer e o Consumer.

4. **Prometheus e Grafana**: Usados para monitoramento e observabilidade. O Prometheus coleta métricas sobre a quantidade de mensagens publicadas e processadas, enquanto o Grafana fornece dashboards para visualização dessas métricas.

## Docker Compose

O projeto vem com um arquivo **docker-compose.yml** que configura o ambiente com os seguintes serviços:

- **RabbitMQ**: Broker de mensagens
- **Prometheus**: Sistema de monitoramento
- **Grafana**: Plataforma de visualização de dados

Basta executar o seguinte comando para levantar todos os containers:

```bash
docker-compose up -d
```

## Executando o Projeto

Para executar o projeto, siga as instruções abaixo:

1. Entre na pasta `backend` e instale as dependências:

```bash
cd backend
yarn install
```

2. Execute o Producer e o Consumer em terminais separados:

```bash
yarn start:producer
```

```bash
yarn start:consumer
```

3. Acompanhe os logs para verificar o envio e processamento das mensagens.

4. Acesse o Grafana em `http://localhost:3001` e faça login com as credenciais padrão (usuário: `admin`, senha: `admin`). Importe o dashboard localizado em `backend/grafana/dashboard.json` para visualizar as métricas.

## Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para obter detalhes.
