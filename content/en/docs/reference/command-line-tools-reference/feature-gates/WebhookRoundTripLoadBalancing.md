---
title: WebhookRoundTripLoadBalancing
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Make the API server load-balance admission webhook requests across the endpoints
of the webhook Service, using a resolving RoundTripper, instead of caching
connections by Service name.
