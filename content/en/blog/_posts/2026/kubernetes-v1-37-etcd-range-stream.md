---
layout: blog
title: "Kubernetes v1.37: Streaming Large List Responses from etcd with RangeStream"
draft: true
slug: kubernetes-v1-37-etcd-range-stream
author: >
  [Jeffrey Ying](https://github.com/Jefftree) (Google)
---

Kubernetes v1.37 and etcd v3.7 together cut the memory cost of reading a large
collection out of etcd. If you run both, the API server and etcd use less memory
on these reads, and the memory they do use is steadier. There is nothing to
configure.

This is an internal improvement, enabled by
[KEP-5966](https://github.com/kubernetes/enhancements/issues/5966). Your workloads
and clients do not change.

## How it works

The API server does not go to etcd for every list and watch request. It serves
most of them from an in-memory cache, and to build that cache it reads a resource's
full state out of etcd, on startup and whenever the cache reconnects. For something
like Pods or Events on a busy cluster, that can be a lot of data to pull at once.

Until now, the whole read was buffered in memory. etcd's unary `Range` RPC
assembled the entire response before sending it, and the API server held the entire
response while it decoded it, so the same large payload sat in memory on both sides
at once. The cost grew with the size of your data instead of staying flat, and on
big clusters it showed up as a real memory spike.

etcd v3.7 adds a streaming version of that read, the `RangeStream` RPC. Instead of
building the whole response up front, etcd sends it back in bounded chunks. When
the feature is enabled, the API server uses `RangeStream` to initialize the watch
cache: it decodes each chunk as it arrives and releases it before pulling the next
one, so neither side ever holds the whole collection. In etcd's testing, listing a
million small keys dropped peak memory from roughly 1.6 GB to 0.6 GB, and the
savings grow with the size and concurrency of the read.

## Verifying it is working

The API server records streamed reads under their own operation label on its etcd
metrics. A non-zero count here means `RangeStream` is in use:

```
etcd_request_duration_seconds_count{operation="listStream"}
```

If it stays at zero, the API server is using the old buffered path. The usual
reason is an etcd older than v3.7. Check the etcd version, and look for a log line
(at verbosity 4) noting that the etcd server does not support RangeStream and that
the API server is falling back to a paginated list.

## Requirements

- Kubernetes v1.37 or later
- etcd v3.7 or later

RangeStream is controlled by the `EtcdRangeStream` feature gate on the
kube-apiserver, which is beta and on by default in v1.37. If your etcd is older
than v3.7, the API server falls back to the previous behavior automatically, so
mixed-version clusters keep working while you upgrade. To turn it off, disable the
gate:

```
--feature-gates=EtcdRangeStream=false
```

## Learn more

- [KEP-5966: etcd RangeStream](https://github.com/kubernetes/enhancements/issues/5966)
- [Announcing etcd v3.7](https://etcd.io/blog/2026/announcing-etcd-3.7/)
- [SIG etcd](https://github.com/kubernetes/community/tree/master/sig-etcd)

If you have questions or feedback, join the `#sig-etcd` channel on
[Kubernetes Slack](https://slack.k8s.io/).
