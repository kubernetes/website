---
title: H2CContainerProbe
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Enables HTTP/2 cleartext (h2c) support for HTTP container probes. When enabled,
you can add the `protocol` field to the `httpGet` field in HTTP probes. Setting
`protocol: HTTP2` on a liveness, readiness, or startup probe causes the `kubelet` to
probe over h2c instead of HTTP/1.1.
See [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#use-h2c-with-http-probes).
