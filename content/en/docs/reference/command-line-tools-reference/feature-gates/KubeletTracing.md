---
title: KubeletTracing
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
---
Add support for distributed tracing in the kubelet.
When enabled, kubelet CRI interface and authenticated http servers are instrumented to generate
OpenTelemetry trace spans.
See [Traces for Kubernetes System Components](/docs/concepts/cluster-administration/system-traces) for more details.
