---
title: LoadBalancerIPMode
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
---
Allows setting `ipMode` for Services where `type` is set to `LoadBalancer`.
See [Specifying IPMode of load balancer status](/docs/concepts/services-networking/service/#load-balancer-ip-mode)
for more information.
