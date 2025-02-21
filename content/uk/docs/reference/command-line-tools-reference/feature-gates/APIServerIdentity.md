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
Присвоює кожному серверу API ідентифікатор у кластері, використовуючи [Lease](/docs/concepts/architecture/leases).
