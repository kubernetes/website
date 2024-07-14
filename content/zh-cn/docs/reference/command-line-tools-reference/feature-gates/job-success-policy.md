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
---

<!--
Allow users to specify when a Job can be declared as succeeded based on the set of succeeded pods.
-->
允许用户基于一组成功的 Pod 来声明这组 Pod 所属的 Job 为成功。
