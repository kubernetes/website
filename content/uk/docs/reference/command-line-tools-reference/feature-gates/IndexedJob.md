---
# Removed from Kubernetes
title: IndexedJob
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"

removed: true
---
Дозволяє контролеру [Job](/docs/concepts/workloads/controllers/job/) керувати завершенням Pod за індексом завершення.
