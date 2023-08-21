import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import Sentry from 'winston-transport-sentry-node';

const options = {
  console: {
    // all log levels abode debug will be send to console (error,warn,info,http,verbose,debug,silly)
    level: 'silly',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
  sentry: {
    config: {
      dsn: process.env.SENTRY_DNS,
    },
    // all log levels abode debug will be send to sentry (error,warn,info,http,verbose,debug)
    level: 'debug',
    filename: './logs/sentry-%DATE%.log',
    json: true,
    colorize: false,
  },
};

const loggerFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'ddd MMM DD h:mm:ss',
  }),
  winston.format.colorize({
    level: true,
    colors: {
      info: 'bold cyan',
      warn: 'yellow',
      debug: 'green',
      error: 'bold red',
      verbose: 'bold magenta',
    },
  }),
  winston.format.printf(
    info => `[${info.timestamp}] ${info.level} : ${info.message} `,
  ),
);

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: loggerFormat,
  transports: [
    new winston.transports.Console(options.console),
    new Sentry(options.sentry),
    new DailyRotateFile({
      filename: `./logs/errors-%DATE%.log`,
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '90d',
      format: format.combine(format.uncolorize()),
    }),
    new DailyRotateFile({
      filename: `./logs/messages-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '90d',
      format: format.combine(format.uncolorize()),
    }),
  ],
  exitOnError: false,
  exceptionHandlers: [
    new DailyRotateFile({
      filename: `./logs/exceptions-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '90d',
      format: format.combine(format.uncolorize()),
    }),
  ],
});

export default logger;
