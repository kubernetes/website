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
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
    toVersion: "1.34"

removed: true
---
Allows setting `ipMode` for Services where `type` is set to `LoadBalancer`.
See [Specifying IPMode of load balancer status](/docs/concepts/services-networking/service/#load-balancer-ip-mode)
for more information.
