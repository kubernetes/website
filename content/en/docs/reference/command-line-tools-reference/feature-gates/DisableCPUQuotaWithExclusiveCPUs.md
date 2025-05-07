---
title: DisableCPUQuotaWithExclusiveCPUs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.33"

---
This gate disables CPU Quota for containers which have exclusive CPUs allocated.
The gate also disables Pod-Level CPU Quota for pods containing at least one container with exclusive CPUs allocated.
Exclusive CPUs for a container (init, application, sidecar) are allocated when:

1. the CPU manager policy is 'static',
1. the Pod has QoS Guaranteed,
1. the container has integer cpu request.

The expected behavior is that CPU Quota for containers having exclusive CPUs allocated is disabled.
Because this fix changes a long-established (but incorrect) behavior, users observing
any regressions can use the DisableCPUQuotaWithExclusiveCPUs feature gate (default on) to
restore the old behavior.

Please file issues if you hit issues and have to use this Feature Gate.
The Feature Gate will be locked to true and then removed in +2 releases (1.35) if there are no bug reported
 
