---
title: ProbeTerminationGracePeriod
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta
    defaultValue: false
    fromVersion: "1.22"  
    toVersion: "1.24" 
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"  
    toVersion: "1.27" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.28"     

removed: true
---

<!--
Enable [setting probe-level
`terminationGracePeriodSeconds`](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#probe-level-terminationgraceperiodseconds)
on pods. See the [enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2238-liveness-probe-grace-period)
for more details.
-->
在 Pod 上啓用[設置探針級別 `terminationGracePeriodSeconds`](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#probe-level-terminationgraceperiodseconds)。
更多細節請參見[增強提案](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2238-liveness-probe-grace-period)。
