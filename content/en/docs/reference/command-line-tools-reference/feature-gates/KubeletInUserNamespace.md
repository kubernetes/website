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
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Enables support for running kubelet in a
{{<glossary_tooltip text="user namespace" term_id="userns">}}.
 See [Running Kubernetes Node Components as a Non-root User](/docs/tasks/administer-cluster/kubelet-in-userns/).
