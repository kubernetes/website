"use strict";

const
  { IncomingWebhook } = require('@slack/client'),
  kubernetesSiteRoot = 'https://kubernetes.io',
  fetch = require('node-fetch').default,
  { SLACK_WEBHOOK_URL } = process.env;

const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

// A random smattering of Kubernetes documentation pages
// We can add as many pages here as we'd like
const kubernetesEndpoints = [
  'docs/home',
  'docs/tutorials/configuration/configure-redis-using-configmap',

]

// Ensure that the SLACK_WEBHOOK_URL environment variable is set
const checkEnv = () => {
  if (!SLACK_WEBHOOK_URL) {
    return {
      statusCode: 422,
      body: "[FAILURE] The Slack webhook URL must be set via the SLACK_WEBHOOK_URL environment variable"
    }
  }
}

// This function posts a warning message to Slack
const sendSlackMessage = (msg) => {
  const slackMessageObject = {
    username: "noindex checker",
    text: msg
  }

  // Send the message to the webhook
  webhook.send(slackMessageObject, (err, res) => {
    return (err) ? { statusCode: 422, body: `[ERROR] Slack webhook error: ${err}` } :
      { statusCode: 200, body: `[SUCCESS] Response received from Slack: ${JSON.stringify(res)}` };
  });
}

// Iterate through each Kubernetes endpoint to check for noindex headers
const checkEndpoints = () => {
  kubernetesEndpoints.forEach((endpoint) => {
    const url = `${kubernetesSiteRoot}/${endpoint}`;

    fetch(url)
      .then(res => {
        const headers = res.headers;

        if ('x-robots-tag' in headers.raw() && (headers.get('x-robots-tag') == 'noindex')) {
          const msg = `[WARNING] "X-Robots-Tag: noindex" header found on the following page: ${url}`;

          // Send Slack notification
          sendSlackMessage(msg);

          return { statusCode: 404, body: msg };
        } else {
          const msg = `[SUCCESS] No improper X-Robots-Tag: noindex headers found on ${url}`;
          
          return { statusCode: 200, body: msg };
        }
      })
      .catch(err => {
        return { statusCode: 422, body: err };
      });
  });
}

// The handler function
exports.handler = async (event, context) => {
  checkEnv();

  // Below are the various deploy succeeded checks
  checkEndpoints();
}
