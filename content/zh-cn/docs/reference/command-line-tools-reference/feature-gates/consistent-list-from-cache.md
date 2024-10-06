---
title: ConsistentListFromCache
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
---
<!--
Enhance Kubernetes API server performance by serving consistent **list** requests
directly from its watch cache, improving scalability and response times.
To consistent list from cache Kubernetes requires a newer etcd version (v3.4.31+ or v3.5.13+),
that includes fixes to watch progress request feature.
If older etcd version is provided Kubernetes will automatically detect it and fallback to serving consistent reads from etcd.
Progress notifications ensure watch cache is consistent with etcd while reducing
the need for resource-intensive quorum reads from etcd.

See the Kubernetes documentation on [Semantics for **get** and **list**](/docs/reference/using-api/api-concepts/#semantics-for-get-and-list) for more details.
-->
通过直接从其 watch 缓存中响应一致的 **list** 请求，增强 Kubernetes API 服务器的性能，改善可扩展性和响应时间。
为了从缓存中响应一致的 list，Kubernetes 需要使用较新的 etcd 版本（v3.4.31+ 或 v3.5.13+），
这些版本包含了对监视 watch 进度请求特性的修复。
如果使用的是较旧的 etcd 版本，Kubernetes 将自动检测并回退到使用 etcd 完成一致性读操作。
进度通知确保监视缓存与 etcd 保持一致，同时减少了对 etcd 资源密集的、带仲裁的读取的需求。

有关详细信息，请参阅 Kubernetes 文档中的 [**get** 和 **list** 语义](/zh-cn/docs/reference/using-api/api-concepts/#semantics-for-get-and-list)。
