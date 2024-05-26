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
---

<!--
Allows setting `ipMode` for Services where `type` is set to `LoadBalancer`.
See [Specifying IPMode of load balancer status](/docs/concepts/services-networking/service/#load-balancer-ip-mode)
for more information.
-->
当 Service 的 `type` 为 `LoadBalancer` 时，可设置该 Service 的 `ipMode`。
更多细节请参阅[指定负载均衡器状态的 IPMode](/zh-cn/docs/concepts/services-networking/service/#load-balancer-ip-mode)。
