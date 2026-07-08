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
支持在{{<glossary_tooltip text="用户名字空间" term_id="userns">}}里运行 kubelet。
请参见[以非 root 用户身份运行 Kubernetes 节点组件](/zh-cn/docs/tasks/administer-cluster/kubelet-in-userns/)。
