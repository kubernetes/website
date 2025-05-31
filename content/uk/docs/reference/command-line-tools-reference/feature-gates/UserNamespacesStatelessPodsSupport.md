---
title: UserNamespacesStatelessPodsSupport
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.27"

removed: true
---
Увімкніть підтримку простору імен користувачів для stateless Podʼів. Ці функціональні можливості були замінені на `UserNamespacesSupport` у випуску Kubernetes v1.28.
