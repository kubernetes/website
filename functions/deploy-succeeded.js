"use strict";

const https = require('https');

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
        } else {
          const headerValue = headers[]

          callback(`WARNING: X-Robots-Tag header with the value ${xRobotsTagHeaderValue} present.`, { statusCode: 200 });
        }
      } else {
        callback("INFO: X-Robots-Tag headers not present; all clear", { statusCode: 200 });
      }
    });
  });
}
