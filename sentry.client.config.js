import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://b502942945f299257887f91fa371f282@o4509558722068480.ingest.us.sentry.io/4509558723117056',
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
})
