---
# Removed from Kubernetes
title: WindowsRunAsUserName
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.16"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.17"
  - stage: stable
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.20"

removed: true
---
Enable support for running applications in Windows containers with as a
non-default user. See [Configuring RunAsUserName](/docs/tasks/configure-pod-container/configure-runasusername)
for more details.
