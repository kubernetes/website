---
title: APIServerIdentity
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.25"
  - stage: beta
    defaultValue: true
    fromVersion: "1.26"  
---

<!--
Assign each API server an ID in a cluster, using a [Lease](/docs/concepts/architecture/leases).
-->
使用 [Lease（租约）](/zh-cn/docs/concepts/architecture/leases)为集群中的每个
API 服务器赋予一个 ID。
