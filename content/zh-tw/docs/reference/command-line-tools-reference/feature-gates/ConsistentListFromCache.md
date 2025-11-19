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
通過直接使用監視緩存來爲 **list** 請求提供一致性的數據，提升 Kubernetes API 服務器的性能，
從而改善可擴展性和響應時間。爲了從緩存獲取一致的列表，Kubernetes 需要使用較新的
Etcd 版本（v3.4.31+ 或 v3.5.13+），這些版本包含了對監視進度請求特性的修復。
如果使用較舊的 Etcd 版本，Kubernetes 會自動檢測到並回退到從 Etcd 提供一致的讀取操作。
進度通知能夠確保監視緩存與 Etcd 保持一致，同時減少對 Etcd 進行資源密集型仲裁讀取的需求。

更多細節請參閱 Kubernetes 文檔
[**get** 和 **list** 語義](/zh-cn/docs/reference/using-api/api-concepts/#semantics-for-get-and-list)。
