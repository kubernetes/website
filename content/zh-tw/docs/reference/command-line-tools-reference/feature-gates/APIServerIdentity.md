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
使用 [Lease（租約）](/zh-cn/docs/concepts/architecture/leases)爲叢集中的每個
API 伺服器賦予一個 ID。
