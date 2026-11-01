---
title: ManifestBasedAdmissionControlConfig
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

<!--
Enable loading admission webhooks and CEL-based admission policies from
static manifest files on disk via the `staticManifestsDir` field in
`AdmissionConfiguration`. These policies are active from API server startup,
survive etcd unavailability, and can protect API-based admission resources
from modification.
-->
启用通过 `AdmissionConfiguration` 中的 `staticManifestsDir`
字段从磁盘上的静态清单文件加载准入 Webhook 和基于 CEL 的准入策略。
这些策略从 API 服务器启动时开始生效，在 etcd 不可用时仍然有效，
并且可以保护基于 API 的准入资源不被修改。

