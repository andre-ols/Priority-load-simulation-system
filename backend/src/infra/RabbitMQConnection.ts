import amqp, { Channel, Connection } from "amqplib";

export class RabbitMQConnection {
  private static instance: RabbitMQConnection;
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private constructor() {}

  public static getInstance(): RabbitMQConnection {
    if (!RabbitMQConnection.instance) {
      RabbitMQConnection.instance = new RabbitMQConnection();
    }
    return RabbitMQConnection.instance;
  }

  public async connect(): Promise<Channel> {
    if (!this.connection) {
      this.connection = await amqp.connect("amqp://user:password@localhost");
      console.info("Conectado ao RabbitMQ com sucesso!");
    }

    if (!this.channel) {
      this.channel = await this.connection.createChannel();
    }

    return this.channel;
  }

  public async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}
