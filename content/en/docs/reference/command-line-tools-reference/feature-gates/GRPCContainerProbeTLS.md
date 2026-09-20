---
title: GRPCContainerProbeTLS
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Enables TLS support for gRPC container probes. When enabled,
you can add the `mode` field to the `grpc` field in gRPC probes. Setting
`mode: TLS` on a liveness, readiness, or startup probe causes the kubelet
to connect over TLS (with `InsecureSkipVerify`).
See [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#grpc-probe-tls).
