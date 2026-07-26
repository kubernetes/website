---
title: PodGroup
id: podgroup
full_link: /zh-cn/docs/concepts/workloads/podgroup-api/
short_description: >
  PodGroup 表示一组具有共同调度策略和约束的 Pod。

aka:
tags:
- core-object
- workload
---

<!--
A PodGroup is a runtime object that represents a group of Pods scheduled
together as a single unit. While the
[Workload API](/docs/concepts/workloads/workload-api/) defines scheduling policy
templates, PodGroups are the runtime counterparts that carry both the policy and
the scheduling status for a specific instance of that group.
-->
PodGroup 是一个运行时对象，代表作为单个单元一起调度的一组 Pod。
虽然 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/) 定义了调度策略模板，
但 PodGroup 是运行时对应物，承载该组特定实例的策略和调度状态。
