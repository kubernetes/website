---
title: AtomicFIFO
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"

---

<!--
A client-go implementation of a FIFO queue that uses atomic operations to ensure events that come in
batches, such as those from a ListAndWatch call, are processed in a single chunk. This is in contrast to
the previous implementation which would process these events one by one, potentially causing the internal
cache to become temporarily inconsistent with the API server. This feature gate can be toggled in the
kube-controller-manager and any client-go based controller.
-->
一个 client-go 实现的 FIFO 队列，使用原子操作确保批量传入的事件（例如来自
ListAndWatch 调用的事件）作为单个块处理。
这与之前的实现形成对比，之前的实现会逐个处理这些事件，可能导致内部缓存与 API 服务器暂时不一致。
此特性门控可以在 kube-controller-manager 和任何基于 client-go 的控制器中切换。
