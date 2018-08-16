"use strict";

const https = require('https');
const { WebClient } = require('@slack/client');
const SLACK_TOKEN = process.env.SLACK_TOKEN || '';

if (!SLACK_TOKEN) {
  console.log("You need to specify a Slack token via the SLACK_TOKEN environment variable");
  process.exitCode = 1;
  return;
}

const slack = new WebClient(SLACK_TOKEN);

const slackChannel = "#sig-docs-maintainers";

// A handful of randomly selected pages to check
const endpointsToCheck = [
  "docs/concepts",
  "docs/reference",
  "docs/reference/setup-tools/kubeadm/kubeadm"
]

exports.handler = (event, context, callback) => {
  endpointsToCheck.forEach((endpoint) => {
    const url = `https://kubernetes.io/${endpoint}`;
    https.get(url, (res) => {
      const headers = res.headers;

      if ("X-Robots-Tag" in headers) {
        const xRobotsTagHeaderValue = headers["X-Robots-Tag"];

        if (xRobotsTagHeaderValue == "noindex") {
          callback(`PANIC: noindex headers present on ${url}`, { statusCode: 500 });

          const slackMsg = `noindex headers found in the production build at: ${url}`;

          slack.chat.postMessage({ channel: slackChannel, text: slackMsg })
            .then((slackResponse) => {
              console.log(`Message sent: ${slackResponse}`);
            })
            .catch(console.error);
        } else {
          callback(`WARNING: X-Robots-Tag header with the value ${xRobotsTagHeaderValue} present.`, { statusCode: 200 });
        }
      } else {
        callback("INFO: X-Robots-Tag headers not present; all clear", { statusCode: 200 });
      }
    });
  });
}
