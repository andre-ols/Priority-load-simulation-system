import winston from "winston";

// Configuração do logger
export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      // format date to [Wed, 30 Aug 2023 14:01:17 GMT]

      const date = new Date(timestamp as string).toUTCString();

      const msg = `${level} [${date}]: ${message}`;

      if (typeof meta === "object" && Object.keys(meta).length) {
        return `${msg}\n${JSON.stringify(meta, null, 2)}`;
      }

      return msg;
    })
  ),
  transports: [new winston.transports.Console()],
});
