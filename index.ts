import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import express, { Request, Response } from "express";
import {ProfilingIntegration} from "@sentry/profiling-node";

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
    environment: 'development',
});

app.get('/ping', (req:Request, res:Response) => {
    res.send('Sentry test')
});

app.listen(port, () => {
    console.log('Server is running!!!')
})