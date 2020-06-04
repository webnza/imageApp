'use strict';

const winston       =  require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/app.log', level: 'info' })
    ],
    format:  winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    silent:false
});

module.exports = logger;