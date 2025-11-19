---
# Removed from Kubernetes
title: ResourceLimitsPriorityFunction
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.18"
  - stage: deprecated
    fromVersion: "1.19"
    toVersion: "1.19"

removed: true
---

<!--
Enable a scheduler priority function that
assigns a lowest possible score of 1 to a node that satisfies at least one of
the input Pod's cpu and memory limits. The intent is to break ties between
nodes with same scores.
-->
啓用某調度器優先級函數，此函數將最低得分 1 指派給至少滿足輸入 Pod 的 CPU 和內存限制之一的節點，
目的是打破得分相同的節點之間的關聯。
