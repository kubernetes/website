---
layout: blog
title: "Kubernetes v1.36：服务端分片 List 与 Watch"
date: 2026-05-06T10:35:00-08:00
slug: kubernetes-v1-36-server-side-sharded-list-and-watch
author: >
  [Jeffrey Ying](https://github.com/Jefftree) (Google)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.36: Server-Side Sharded List and Watch"
date: 2026-05-06T10:35:00-08:00
slug: kubernetes-v1-36-server-side-sharded-list-and-watch
author: >
  [Jeffrey Ying](https://github.com/Jefftree) (Google)
-->

<!--
As Kubernetes clusters grow to tens of thousands of nodes, controllers that watch
high-cardinality resources like Pods face a scaling wall. Every replica of a
horizontally scaled controller receives the full stream of events from the API
server, paying the CPU, memory, and network cost to deserialize everything, only
to discard the objects it is not responsible for. Scaling out the controller
does not reduce per-replica cost; it multiplies it.
-->
随着 Kubernetes 集群规模增长到数万个节点，监视（watch）像 Pod 这样高基数资源的控制器会遇到扩展瓶颈。
每个水平扩展后的控制器副本都会从 API 服务器接收完整的事件流，并为反序列化所有对象付出 CPU、内存和网络开销，
最终却丢弃掉那些不属于自身负责范围的对象。扩展控制器副本数量并不会降低单个副本的成本；反而会将成本成倍放大。

<!--
Kubernetes v1.36 introduces **server-side sharded list and watch** as an alpha
feature ([KEP-5866](https://github.com/kubernetes/enhancements/issues/5866)).
With this feature enabled, the API server filters events at the source so that
each controller replica receives only the slice of the resource collection it
owns.
-->
Kubernetes v1.36 引入了**服务端分片 List 与 Watch** 这一 Alpha 特性
（[KEP-5866](https://github.com/kubernetes/enhancements/issues/5866)）。
启用此特性后，API 服务器在源头过滤事件，使每个控制器副本只接收到其负责的那部分资源集合。

<!--
## The problem with client-side sharding

Some controllers, such as [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics),
already support horizontal sharding. Each replica is assigned a portion of the
keyspace and discards objects that do not belong to it. While this works
functionally, it does not reduce the volume of data flowing from the API server:
-->
## 使用客户端分片的问题

诸如 [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)
这些控制器已经支持水平分片。每个副本会被分配一部分键空间，并丢弃不属于自己的对象。
虽然这种方式在功能上可行，但并不能减少从 API 服务器流出的数据量：

<!--
- **N replicas x full event stream**: every replica deserializes and processes
  every event, then throws away what it does not need.
- **Network bandwidth scales with replicas**, not with shard size.
- **CPU spent on deserialization** is wasted for the discarded fraction.
-->
- **N 个副本 × 完整事件流**：每个副本都会反序列化并处理所有事件，然后丢弃自己不需要的部分。
- **网络带宽消耗会随着副本数量扩缩容**，而不是随着分片大小扩缩容。
- **用于反序列化的 CPU 开销**，会浪费在最终被丢弃的数据上。

<!--
Server-side sharded list and watch solves this by moving the filtering upstream
into the API server. Each replica tells the API server which hash range it owns,
and the API server only sends matching events.

## How it works

The feature adds a `shardSelector` field to `ListOptions`. Clients specify a
hash range using the `shardRange()` function:
-->
服务端分片 List 与 Watch 通过将过滤逻辑前移到 API 服务器来解决这个问题。
每个副本告诉 API 服务器自己负责的哈希范围，而 API 服务器只发送匹配的事件。

## 工作原理

此特性为 `ListOptions` 新增了一个 `shardSelector` 字段。客户端通过 `shardRange()` 函数指定一个哈希范围：

```
shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')
```

<!--
The API server computes a deterministic 64-bit
[FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function)
hash of the specified field and returns only objects whose hash falls within the
range `[start, end)`. This applies to both list responses and watch event
streams. The hash function produces the same result across all API server
instances, so the feature is safe to use with multiple API server replicas.
-->
API 服务器基于指定字段计算一个确定性的 64 位
[FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function)
哈希值，并仅返回哈希值落在 `[start, end)` 范围内的对象。此机制同时适用于 List 响应和 Watch 事件流。
由于此哈希函数在所有 API 服务器实例上都会生成相同的结果，因此该特性可以安全地用于多个 API 服务器副本的场景。

<!--
Currently supported field paths are `object.metadata.uid` and
`object.metadata.namespace`.

## Using sharded watches in controllers

Controllers typically use informers to list and watch resources. To shard the
workload, each replica injects the `shardSelector` into the `ListOptions` used
by its informers via `WithTweakListOptions`:
-->
目前支持的字段路径包括 `object.metadata.uid` 和 `object.metadata.namespace`。

## 在控制器中使用分片 Watch

控制器通常使用 Informer 对资源执行 List 和 Watch。
为了对工作负载进行分片，每个副本会通过 `WithTweakListOptions` 向
Informer 使用的 `ListOptions` 注入 `shardSelector`：

```go
import (
    metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
    "k8s.io/client-go/informers"
)

shardSelector := "shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')"

factory := informers.NewSharedInformerFactoryWithOptions(client, resyncPeriod,
    informers.WithTweakListOptions(func(opts *metav1.ListOptions) {
        opts.ShardSelector = shardSelector
    }),
)
```

<!--
For a 2-replica deployment, the selectors split the hash space in half:

```go
// Replica 0: lower half of the hash space
"shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')"

// Replica 1: upper half of the hash space
"shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')"
```

A single replica can also cover non-contiguous ranges using `||`:
-->
对于包含 2 个副本的 Deployment，选择算符将哈希空间平均分成两半：

```go
// 副本 0：哈希空间的下半部分
"shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')"

// 副本 1：哈希空间的上半部分
"shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')"
```

单个副本也可以使用 `||` 来涵盖多个不连续的范围：

```go
"shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000') || " +
    "shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')"
```

<!--
## Verifying server support

When the API server honors a shard selector, the list response includes a
`shardInfo` field in the response metadata that echoes back the applied
selector:
-->
## 验证服务端支持情况

当 API 服务器正确处理分片选择算符时，List 响应在响应元数据中包含一个 `shardInfo` 字段，用于回显实际应用的选择算符：

```json
{
  "kind": "PodList",
  "apiVersion": "v1",
  "metadata": {
    "resourceVersion": "10245",
    "shardInfo": {
      "selector": "shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')"
    }
  },
  "items": [...]
}
```

<!--
If `shardInfo` is absent, the server did not honor the shard selector and the
client received the complete, unfiltered collection. In this case, the client
should be prepared to handle the full result set, for example by applying
client-side filtering to discard objects outside its assigned shard range.
-->
如果 `shardInfo` 不存在，则表示服务端没有处理该分片选择算符，客户端接收到的是完整、未过滤的资源集合。
在这种情况下，客户端应能够处理完整结果集，例如通过客户端侧过滤来丢弃不属于其分片范围的对象。

<!--
## Getting involved

This feature is in alpha and requires enabling the `ShardedListAndWatch` feature
gate on the API server. We are looking for feedback from controller authors and
operators running large clusters.
-->
## 参与其中

此特性目前处于 Alpha 阶段，需要在 API 服务器上启用 `ShardedListAndWatch` 特性门控。
我们正在征集来自控制器开发者以及运行大规模集群的运维人员的反馈。

<!--
- [KEP-5866: Server-Side Sharded List and Watch](https://github.com/kubernetes/enhancements/issues/5866)
- [API Concepts: Sharded list and watch](/docs/reference/using-api/api-concepts/#sharded-list-and-watch)
- [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery)

If you have questions or feedback, join the `#sig-api-machinery` channel on
[Kubernetes Slack](https://slack.k8s.io/).
-->
- [KEP-5866：服务端分片 List 与 Watch](https://github.com/kubernetes/enhancements/issues/5866)
- [API 概念：分片 List 与 Watch](/docs/reference/using-api/api-concepts/#sharded-list-and-watch)
- [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery)

如果你有问题或反馈，欢迎加入 [Kubernetes Slack](https://slack.k8s.io/)
中的 `#sig-api-machinery` 频道。
