import * as Sentry from '@sentry/node';
import express, {NextFunction, Request, Response} from "express";
import {ProfilingIntegration} from "@sentry/profiling-node";
import routes from "./routes";
import logger from "./logger";

const app = express();
const port = 3002;

Sentry.init({
    dsn: 'DSN',
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
       // Add our Profiling integration
        new ProfilingIntegration(),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    environment: 'test',
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());

app.use((req:Request, res:Response, next: NextFunction) => {
    // Create transaction
    const transaction = Sentry.startTransaction({
        op: 'http.server',
        name: `${req.method} ${req.originalUrl}`
    });

    Sentry.configureScope((scope) => {
        scope.setSpan(transaction);
    });

    res.on('finish', () => {
        transaction.setHttpStatus(res.statusCode);
        transaction.finish();
    })

    next()
})

app.use(routes);

app.get('/ping', (req:Request, res:Response) => {
    try {
        logger.info('Sentry test')
        res.send('Sentry test')
    } catch (err) {
        Sentry.captureException(err);
    }
});

// Create transaction
const transaction = Sentry.startTransaction({
    op: 'transaction2', name: 'Transaction for ping2'
});

Sentry.configureScope((scope) => {
    scope.setSpan(transaction);
});


app.get('/ping2', (req:Request, res:Response) => {
    try {
        logger.info('Sentry test for ping 2')
        res.send('Sentry test for ping 2')
    } catch (err) {
        Sentry.captureException(err);
    }

    res.on('close', () => {
        transaction.finish();
    });
});

app.listen(port, () => {
    logger.info('Test server is running!!!')
})