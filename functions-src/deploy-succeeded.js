"use strict";

const
  { IncomingWebhook } = require('@slack/client'),
  kubernetesSiteRoot = 'https://kubernetes.io',
  fetch = require('node-fetch').default,
  slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

const webhook = new IncomingWebhook(slackWebhookUrl);

// A random smattering of Kubernetes documentation pages
const kubernetesEndpoints = [
  'docs/home',
  'docs/tutorials/configuration/configure-redis-using-configmap',
  ''
]

const success = (callback, msg) => {
  callback(null, { statusCode: 200, body: msg });
}

const failure = (callback, msg) => {
  callback(null, { statusCode: 404, body: msg });
}

const sendSlackMessage = (callback, msg) => {
  const slackMessageObject = {
    username: "nondex checker",
    text: msg
  }

  webhook.send(slackMessageObject, (err, res) => {
    if (err) {
      console.error(`[ERROR] Slack webhook error: ${err}`);
    } else {
      const msg = JSON.stringify(res);
      console.log(`[SUCCESS] Response received from Slack: ${msg}`);
    }
  });
}

exports.handler = (event, context, callback) => {
  kubernetesEndpoints.forEach((endpoint) => {
    const url = `${kubernetesSiteRoot}/${endpoint}`;

    fetch(url)
      .then(res => {
        const headers = res.headers;

        if ('x-robots-tag' in headers.raw() && (headers.get('x-robots-tag') == 'noindex')) {
          const msg = `[WARNING] X-Robots-Tag: noindex found on the following page: ${url}`;
          sendSlackMessage(callback, msg);

          failure(callback, `Improper noindex header found at ${url}`);
        } else {
          const msg = `[SUCCESS] No improper X-Robots-Tag: noindex headers found on ${url}`;
          success(callback. msg);
        }
      });
  });
}
