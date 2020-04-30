import * as Sentry from "@sentry/browser";

const sentryDsn = process.env.REACT_APP_SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
  });
}
