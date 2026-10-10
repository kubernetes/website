---
title: ShardedListAndWatch
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

<!--
Enable support for the `shardSelector` parameter on **list** and **watch** requests,
allowing clients to receive a filtered subset of objects based on hash ranges of
metadata fields (such as UID). See
[Sharded list and watch](/docs/reference/using-api/api-concepts/#sharded-list-and-watch)
for more details.
-->
启用对 **list** 和 **watch** 请求上的 `shardSelector` 参数的支持，
允许客户端基于元数据字段（如 UID）的哈希范围接收过滤的对象子集。
有关详细信息，请参阅
[分片列表和监视](/zh-cn/docs/reference/using-api/api-concepts/#sharded-list-and-watch)。
