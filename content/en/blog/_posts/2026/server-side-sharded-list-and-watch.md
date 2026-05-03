---
layout: blog
title: "Kubernetes v1.36: Server-Side Sharded List and Watch"
date: 2026-04-23
slug: kubernetes-v1-36-server-side-sharded-list-and-watch
author: >
  [Jeffrey Ying](https://github.com/Jefftree) (Google)
draft: true
---

As Kubernetes clusters grow to tens of thousands of nodes, controllers that watch
high-cardinality resources like Pods face a scaling wall. Every replica of a
horizontally scaled controller receives the full stream of events from the API
server, paying the CPU, memory, and network cost to deserialize everything, only
to discard the objects it is not responsible for. Scaling out the controller
does not reduce per-replica cost; it multiplies it.

Kubernetes v1.36 introduces **server-side sharded list and watch** as an alpha
feature ([KEP-5866](https://github.com/kubernetes/enhancements/issues/5866)).
With this feature enabled, the API server filters events at the source so that
each controller replica receives only the slice of the resource collection it
owns.

## The problem with client-side sharding

Some controllers, such as [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics),
already support horizontal sharding. Each replica is assigned a portion of the
keyspace and discards objects that do not belong to it. While this works
functionally, it does not reduce the volume of data flowing from the API server:

- **N replicas x full event stream**: every replica deserializes and processes
  every event, then throws away what it does not need.
- **Network bandwidth scales with replicas**, not with shard size.
- **CPU spent on deserialization** is wasted for the discarded fraction.

Server-side sharded list and watch solves this by moving the filtering upstream
into the API server. Each replica tells the API server which hash range it owns,
and the API server only sends matching events.

## How it works

The feature adds a `shardSelector` field to `ListOptions`. Clients specify a
hash range using the `shardRange()` function:

```
shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')
```

The API server computes a deterministic 64-bit
[FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function)
hash of the specified field and returns only objects whose hash falls within the
range `[start, end)`. This applies to both list responses and watch event
streams. The hash function produces the same result across all API server
instances, so the feature is safe to use with multiple API server replicas.

Currently supported field paths are `object.metadata.uid` and
`object.metadata.namespace`.

## Using sharded watches in controllers

Controllers typically use informers to list and watch resources. To shard the
workload, each replica injects the `shardSelector` into the `ListOptions` used
by its informers via `WithTweakListOptions`:

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

For a 2-replica deployment, the selectors split the hash space in half:

```go
// Replica 0: lower half of the hash space
"shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')"

// Replica 1: upper half of the hash space
"shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')"
```

A single replica can also cover non-contiguous ranges using `||`:

```go
"shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000') || " +
    "shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')"
```

## Verifying server support

When the API server honors a shard selector, the list response includes a
`shardInfo` field in the response metadata that echoes back the applied
selector:

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

If `shardInfo` is absent, the server did not honor the shard selector and the
client received the complete, unfiltered collection. In this case, the client
should be prepared to handle the full result set, for example by applying
client-side filtering to discard objects outside its assigned shard range.

## Getting involved

This feature is in alpha and requires enabling the `ShardedListAndWatch` feature
gate on the API server. We are looking for feedback from controller authors and
operators running large clusters.

- [KEP-5866: Server-Side Sharded List and Watch](https://github.com/kubernetes/enhancements/issues/5866)
- [API Concepts: Sharded list and watch](/docs/reference/using-api/api-concepts/#sharded-list-and-watch)
- [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery)

If you have questions or feedback, join the `#sig-api-machinery` channel on
[Kubernetes Slack](https://slack.k8s.io/).
