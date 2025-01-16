---
# Removed from Kubernetes
title: GenericEphemeralVolume
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.20"
  - stage: beta
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"
  - stage: stable
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.24"

removed: true
---
Дозволяє створювати ефемерні, вбудовані томи, які підтримують усі функції звичайних томів (можуть надаватися сторонніми постачальниками сховищ, відстеження ємності сховища, відновлення зі знімка тощо). Див. статтю [Ефемерні томи](/docs/concepts/storage/ephemeral-volumes/).
