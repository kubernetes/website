---
title: KubeletServiceAccountTokenForCredentialProviders
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
Дозволяє kubelet надсилати токен службового облікового запису, привʼязаного до podʼа, для якого отримується образ, до втулка постачальника облікових даних.
