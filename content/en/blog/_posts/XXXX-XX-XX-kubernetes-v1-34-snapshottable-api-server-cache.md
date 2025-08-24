---
layout: blog
title: "Kubernetes v1.34: Snapshottable API server cache"
date: XXX
slug: kubernetes-v1-34-snapshottable-api-server-cache
author: >
  [Marek Siarkowicz](https://github.com/serathius) (Google)
draft: true
---

For years, the Kubernetes community has been on a mission to improve the stability and performance predictability of the API server.
A major focus of this effort has been taming **list** requests, which have historically been a primary source of high memory usage and heavy load on the `etcd` datastore.
With each release, we've chipped away at the problem, and today, we're thrilled to announce the final major piece of this puzzle.

The *snapshottable API server cache* feature has graduated to **Beta** in Kubernetes v1.34,
culminating a multi-release effort to allow virtually all read requests to be served directly from the API server's cache.

## Evolving the cache for performance and stability

The path to the current state involved several key enhancements over recent releases that paved the way for today's announcement.

### Consistent reads from cache (Beta in v1.31)

While the API server has long used a cache for performance, a key milestone was guaranteeing *consistent reads of the latest data* from it. This v1.31 enhancement allowed the watch cache to be used for strongly-consistent read requests for the first time, a huge win as it enabled *filtered collections* (e.g. "a list of pods bound to this node") to be safely served from the cache instead of etcd, dramatically reducing its load for common workloads.

### Taming large responses with streaming (Beta in v1.33)

Another key improvement was tackling the problem of memory spikes when transmitting large responses. The streaming encoder, introduced in v1.33, allowed the API server to send list items one by one, rather than buffering the entire multi-gigabyte response in memory. This made the memory cost of sending a response predictable and minimal, regardless of its size.

### The missing piece

Despite these huge improvements, a critical gap remained. Any request for a historical `LIST`—most commonly used for paginating through large result sets—still had to bypass the cache and query `etcd` directly. This meant that the cost of *retrieving* the data was still unpredictable and could put significant memory pressure on the API server.

## Kubernetes 1.34: snapshots complete the picture

The _snapshottable API server cache_ solves this final piece of the puzzle.
This feature enhances the watch cache, enabling it to generate efficient, point-in-time snapshots of its state.

Here’s how it works: for each update, the cache creates a lightweight snapshot.
These snapshots are "lazy copies," meaning they don't duplicate objects but simply store pointers, making them incredibly memory-efficient.

When a **list** request for a historical `resourceVersion` arrives, the API server now finds the corresponding snapshot and serves the response directly from its memory.
This closes the final major gap, allowing paginated requests to be served entirely from the cache.

## A new era of API Server performance 🚀

With this final piece in place, the synergy of these three features ushers in a new era of API server predictability and performance:

1. **Get Data from Cache**: *Consistent reads* and *snapshottable cache* work together to ensure nearly all read requests—whether for the latest data or a historical snapshot—are served from the API server's memory.
2. **Send data via stream**: *Streaming list responses* ensure that sending this data to the client has a minimal and constant memory footprint.

The result is a system where the resource cost of read operations is almost fully predictable and much more resiliant to spikes in request load.
This means dramatically reduced memory pressure, a lighter load on `etcd`, and a more stable, scalable, and reliable control plane for all Kubernetes clusters.

## How to get started

With its graduation to Beta, the `SnapshottableCache` feature gate is **enabled by default** in Kubernetes v1.34. There are no actions required to start benefiting from these performance and stability improvements.

## Acknowledgements

Special thanks for designing, implementing, and reviewing these critical features go to:
* **Ahmad Zolfaghari** ([@ah8ad3](https://github.com/ah8ad3))
* **Ben Luddy** ([@benluddy](https://github.com/benluddy)) – *Red Hat*
* **Chen Chen** ([@z1cheng](https://github.com/z1cheng)) – *Microsoft*
* **Davanum Srinivas** ([@dims](https://github.com/dims)) – *Nvidia*
* **David Eads** ([@deads2k](https://github.com/deads2k)) – *Red Hat*
* **Han Kang** ([@logicalhan](https://github.com/logicalhan)) – *CoreWeave*
* **haosdent** ([@haosdent](https://github.com/haosdent)) – *Shopee*
* **Joe Betz** ([@jpbetz](https://github.com/jpbetz)) – *Google*
* **Jordan Liggitt** ([@liggitt](https://github.com/liggitt)) – *Google*
* **Łukasz Szaszkiewicz** ([@p0lyn0mial](https://github.com/p0lyn0mial)) – *Red Hat*
* **Maciej Borsz** ([@mborsz](https://github.com/mborsz)) – *Google*
* **Madhav Jivrajani** ([@MadhavJivrajani](https://github.com/MadhavJivrajani)) – *UIUC*
* **Marek Siarkowicz** ([@serathius](https://github.com/serathius)) – *Google*
* **NKeert** ([@NKeert](https://github.com/NKeert))
* **Tim Bannister** ([@lmktfy](https://github.com/lmktfy))
* **Wei Fu** ([@fuweid](https://github.com/fuweid)) - *Microsoft*
* **Wojtek Tyczyński** ([@wojtek-t](https://github.com/wojtek-t)) – *Google*

...and many others in SIG API Machinery. This milestone is a testament to the community's dedication to building a more scalable and robust Kubernetes.
