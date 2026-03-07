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
    toVersion: "1.33"
  - stage: stable
    defaultValue: true
    fromVersion: "1.34"
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
通过直接使用监视缓存来为 **list** 请求提供一致性的数据，提升 Kubernetes API 服务器的性能，
从而改善可扩展性和响应时间。为了从缓存获取一致的列表，Kubernetes 需要使用较新的
Etcd 版本（v3.4.31+ 或 v3.5.13+），这些版本包含了对监视进度请求特性的修复。
如果使用较旧的 Etcd 版本，Kubernetes 会自动检测到并回退到从 Etcd 提供一致的读取操作。
进度通知能够确保监视缓存与 Etcd 保持一致，同时减少对 Etcd 进行资源密集型仲裁读取的需求。

更多细节请参阅 Kubernetes 文档
[**get** 和 **list** 语义](/zh-cn/docs/reference/using-api/api-concepts/#semantics-for-get-and-list)。
