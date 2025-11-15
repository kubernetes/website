---
title: CloudControllerManagerWebhook
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"
---

<!--
Enable webhooks in cloud controller manager.
-->
启用在云控制器管理器中的 Webhook。
