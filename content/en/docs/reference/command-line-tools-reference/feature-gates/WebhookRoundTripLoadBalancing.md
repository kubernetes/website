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
Use a load balancing algorithm to select where to send admission webhook traffic,
for admission webhooks that are defined using a Service.

The feature gate only
affects behavior of the API server if it is run with `--enable-aggregator-routing=true`.
When that flag is set and the feature gate is enabled, the API server queries EndpointSlices for the service and balancer traffic over the available set of endpoints.
This improves on the legacy behavior, which was to use naive connection cache that could
send all (admission) webhook traffic to a single backend.
