---
title: KubeletInUserNamespace
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.22"
---

<!--
Enables support for running kubelet in a
{{<glossary_tooltip text="user namespace" term_id="userns">}}.
 See [Running Kubernetes Node Components as a Non-root User](/docs/tasks/administer-cluster/kubelet-in-userns/).
-->
支持在{{<glossary_tooltip text="使用者名字空間" term_id="userns">}}裏運行 kubelet。
請參見[以非 root 使用者身份運行 Kubernetes 節點組件](/zh-cn/docs/tasks/administer-cluster/kubelet-in-userns/)。
