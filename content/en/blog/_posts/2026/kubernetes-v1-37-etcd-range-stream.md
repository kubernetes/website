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

## What changed

The API server does not go to etcd for every list and watch request. It serves
most of them from an in-memory cache, and to build that cache it periodically reads
a resource's full state out of etcd. For something like Pods or Events on a busy
cluster, that is a large read.

Until now, the whole read was buffered in memory. etcd assembled the entire
response before sending it, and the API server held the entire response while it
processed it, so the same large payload sat in memory on both sides at once. The
cost grew with the size of your data instead of staying flat, and on big clusters
it showed up as a real memory spike.

With RangeStream, etcd streams the response back in chunks instead of building it
all up front. The API server handles each chunk as it arrives, so neither side ever
holds the whole collection. On the largest reads this drops peak memory by about an
order of magnitude, and it keeps the memory profile steady as your data grows.

## Requirements

- Kubernetes v1.37 or later
- etcd v3.7 or later

RangeStream is on by default. If your etcd is older than v3.7, the API server falls
back to the previous behavior, so mixed-version clusters keep working while you
upgrade.

## Learn more

- [KEP-5966: etcd RangeStream](https://github.com/kubernetes/enhancements/issues/5966)
- [Announcing etcd v3.7](https://etcd.io/blog/2026/announcing-etcd-3.7/)
- [SIG etcd](https://github.com/kubernetes/community/tree/master/sig-etcd)

If you have questions or feedback, join the `#sig-etcd` channel on
[Kubernetes Slack](https://slack.k8s.io/).
