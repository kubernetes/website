---
title: RequestCostAggregation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables the `kube-apiserver` to report Open Request Cost Aggregation (ORCA)
endpoint load metrics (`cpu_utilization` and `rps_fractional`) via HTTP
response headers when `--enable-endpoint-load-metrics` is set and the upstream
load balancer negotiates them. See
[Weighted Load Balancing for kube-apiserver](/docs/concepts/cluster-administration/weighted-load-balancing/)
for more details.
