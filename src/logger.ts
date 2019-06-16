import winston from 'winston';

export default winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console()
  ]
});