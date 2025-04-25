---
title: JobSuccessPolicy
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    fromVersion: "1.33"
---

<!--
Allow users to specify when a Job can be declared as succeeded based on the set of succeeded pods.
-->
允许用户基于一组成功的 Pod 来声明这组 Pod 所属的 Job 为成功。
