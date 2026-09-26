---
title: 状况（Condition）
id: condition
full_link: /zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions
short_description: >
  状况表示 Kubernetes 资源的当前状态，提供资源某些方面是否为真的信息。

aka:
tags:
- fundamental
---
<!--
title: Condition
id: condition
full_link: /docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions
short_description: >
  A condition represents the current state of a Kubernetes resource, providing information about whether certain aspects of the resource are true.

aka:
tags:
- fundamental
-->

<!--
A condition is a field in a Kubernetes resource's status that describes the current state of that resource.
-->
状况（Condition）是 Kubernetes 资源状态（status）中的一个字段，用于描述该资源的当前状态。

<!--more-->

<!--
Conditions provide a standardized way for Kubernetes components to communicate the status of resources. Each condition has a `type`, a `status` (True, False, or Unknown), and optional fields like `reason` and `message` that provide additional details. For example, a Pod might have conditions like `Ready`, `ContainersReady`, or `PodScheduled`.
-->
状况为 Kubernetes 组件提供了标准化的方式来传达资源的状态。每个状况包含一个 `type`（类型）、
一个 `status`（状态，取值为 True、False 或 Unknown），以及可选的 `reason`（原因）和 `message`（消息）
字段来提供额外细节。例如，Pod 可能拥有 `Ready`、`ContainersReady` 或 `PodScheduled` 等状况。
