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
پشتیبانی از اجرای kubelet را در یک {{<glossary_tooltip text="user namespace" term_id="userns">}} فعال می‌کند.
به [Running Kubernetes Node Components as a Non-root User](/docs/tasks/administer-cluster/kubelet-in-userns/).
مراجعه کنید.