---
title: NodeLifecycleConditions
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
Enables well-known Node conditions that report drain, maintenance, and
[Graceful Node Shutdown](/docs/concepts/cluster-administration/node-shutdown/)
lifecycle state. See
[Node lifecycle conditions](/docs/reference/node/node-lifecycle-conditions/).
-->
启用报告排空、维护和[节点体面关闭](/zh-cn/docs/concepts/cluster-administration/node-shutdown/)生命周期状态的众所周知
Node 状况。请参阅[节点生命周期状况](/zh-cn/docs/reference/node/node-lifecycle-conditions/)。
