---
layout: blog
title: "Kubernetes v1.37: Streaming Large List Responses from etcd with RangeStream"
date: 2026-XX-XX
draft: true
slug: kubernetes-v1-37-etcd-range-stream
author: >
  [Jeffrey Ying](https://github.com/Jefftree) (Google)
---

Kubernetes v1.37 and etcd v3.7 together make one of the control plane's heaviest
operations cheaper: reading a large collection out of etcd. If you run both, the
API server and etcd use less, and more predictable, memory when serving big reads,
and there is nothing to configure.

This is an internal improvement enabled by
[KEP-5966](https://github.com/kubernetes/enhancements/issues/5966). You do not need
to change your workloads, clients, or manifests to benefit from it.

## What changed

Every so often the API server has to read the full state of a resource out of etcd,
for example when it builds the in-memory cache it uses to serve list and watch
requests. On a large cluster that single read can be big, and it used to load the
entire response into memory on both etcd and the API server at once.

With **RangeStream**, etcd now streams that result back in chunks instead, and the
API server processes each chunk as it arrives, so neither side has to hold the
whole collection. This lowers peak memory on both, by up to roughly an order of
magnitude on the largest reads.

## What you need

- Kubernetes v1.37 or later
- etcd v3.7 or later

That is all. The feature is on by default. If etcd is older than v3.7, the API
server automatically uses the previous behavior, so mixed-version clusters keep
working while you upgrade.

## Learn more

- [KEP-5966: etcd RangeStream](https://github.com/kubernetes/enhancements/issues/5966)
- [Announcing etcd v3.7](https://etcd.io/blog/2026/announcing-etcd-3.7/)
- [SIG etcd](https://github.com/kubernetes/community/tree/master/sig-etcd)

If you have questions or feedback, join the `#sig-etcd` channel on
[Kubernetes Slack](https://slack.k8s.io/).
