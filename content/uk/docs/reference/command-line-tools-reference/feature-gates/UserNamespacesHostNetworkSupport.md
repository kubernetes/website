---
title: UserNamespacesHostNetworkSupport
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Коли ця опція увімкнена, поди можуть одночасно використовувати як `hostNetwork`, так і [Простори імен користувачів](/docs/concepts/workloads/pods/user-namespaces).
