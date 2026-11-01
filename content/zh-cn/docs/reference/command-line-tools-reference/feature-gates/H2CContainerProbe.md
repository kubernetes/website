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

<!--
Enables HTTP/2 cleartext (h2c) support for HTTP container probes. When enabled,
you can add the `protocol` field to the `httpGet` field in HTTP probes. Setting
`protocol: HTTP2` on a liveness, readiness, or startup probe causes the `kubelet` to
probe over h2c instead of HTTP/1.1.
See [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#use-h2c-with-http-probes).
-->
为 HTTP 容器探针启用 HTTP/2 明文（h2c）支持。启用后，
你可以在 HTTP 探针的 `httpGet` 字段中添加 `protocol` 字段。在存活、就绪或启动探针上设置
`protocol: HTTP2` 会使 `kubelet` 通过 h2c 而非 HTTP/1.1 进行探测。
请参阅[配置存活、就绪和启动探针](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#use-h2c-with-http-probes)。
