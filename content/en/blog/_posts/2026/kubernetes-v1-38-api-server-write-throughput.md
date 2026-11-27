---
layout: blog
title: "Kubernetes v1.38: Scaling API Server Write Throughput by Cutting Allocations"
date: 2026-12-15T10:30:00-08:00
slug: kubernetes-v1-38-api-server-write-throughput
author: >
  [Marek Siarkowicz](https://github.com/serathius) (Google),
  [Jeffrey Ying](https://github.com/Jefftree) (Google)
---

Whenever a large Kubernetes cluster slows down, `etcd` usually takes the blame. This however has not been the case for many years as Kubernetes [stopped requesting multi-gigabyte unpaginated reads] from `etcd`. Closing this gap exposed a very different bottleneck. With enough disk performance headroom, `etcd` is able to sustain very large clusters, while `kube-apiserver` hits a hard Go garbage collection wall. Updating an object in Kubernetes requires decoding, converting, merging, and encoding the whole object, allocating up to 150x more bytes than the original object size. As a result, even a small update to Pod status can require `kube-apiserver` to allocate megabytes of data. In large clusters, this easily pushes Go's garbage collector against a contention ceiling and overloads the control plane during traffic bursts.

Kubernetes v1.38 begins a community-wide push across SIG API Machinery and SIG Scalability to measure and cut allocations on every request path. Since last release, contributors reduced overall per-request bytes allocated by 30%, with `PUT` and `PATCH` allocations down 40% and `WATCH` allocations down 73%. Write throughput scaled in direct proportion without changing `etcd`, lifting the healthy write ceiling of Pod objects 2.7x from 1,800 QPS to 4,800 QPS while cutting API server CPU at 1,000 QPS by 54%. Those write-path gains also unlocked the next resource-size scalability milestone, enabling Kubernetes to continue pushing scale tests and validate 3 GB of total `Pod` resources in v1.38, up from 1.5 GB in v1.37.

## Propagating tiny changes through a whole-object API

Most work in a running Kubernetes cluster is propagating small incremental changes, such as a scheduler setting `spec.nodeName` or a kubelet updating a container status condition. Because Kubernetes was designed around reconciling desired and observed state, it almost always propagates the whole object. Even a tiny Pod status patch forces `kube-apiserver` to decode, merge, validate, and re-encode the entire object on both the storage write path and the watch broadcast path.

This was not a problem when most applications were simple web servers, but objects grew as Kubernetes workloads and features diversified. While a bare single-container Pod YAML is only a few hundred bytes, real production Pods routinely reach tens of kilobytes ([kubernetes/kubernetes#138415]). Sidecars, volumes, scheduling rules, Dynamic Resource Allocation (DRA), status tracking, and Server-Side Apply metadata naturally compound the stored footprint, while init containers, probes, and readiness gates multiply the number of patches required just to start a Pod.

As a result, the main bottleneck for large Kubernetes clusters became how fast the Kubernetes API can propagate changes. Kubernetes v1.38 takes the first major steps toward addressing it.

## Why memory allocations cap write throughput

### The Go GC allocation ceiling

Applying a small status patch to a Pod allocates memory at every stage of the request pipeline. `kube-apiserver` decodes the incoming payload, parses and merges it, validates the result, serializes the full object to Protobuf for `etcd`, decodes the resulting watch event back into the watch cache, and serializes it out to watchers. Regardless of core count, the Go runtime hits a hard ceiling around 6 to 8 GB/s of sustained allocations. At that rate, atomic Compare-And-Swap (CAS) contention inside the garbage collector's sweep phase consumes the majority of CPU. Raising `GOGC` only buys temporary headroom at the cost of much larger heaps, so scaling write QPS requires cutting the bytes allocated per write.

### Sticky degradation under bursts and conflicts

High per-request allocations explain the steady-state throughput ceiling, but a separate reliability hazard sits outside the happy path. Hitting the allocation limit slows down all in-flight operations in the Go runtime, tripping time-based and conflict-driven fallbacks within `kube-apiserver`. During a traffic burst or transient slowdown, `kube-apiserver` falls back onto recovery paths that allocate far more memory than normal operation, cutting throughput in half right at the ceiling and trapping the server in sticky degradation until external client traffic drops by 2x to 3x.

Three fallback paths amplify work on an already strained API server:

1. Direct `etcd` list fallbacks: When the watch cache lags more than 3 seconds behind `etcd` or lacks a historical pagination snapshot, `LIST` bypasses the cache and deserializes every object per client request instead of once per write.
2. Optimistic concurrency conflict retries: When watch cache lag causes stale reads, `GuaranteedUpdate` conflicts repeatedly fetch and decode raw objects, doing two, three, or even ten times more work and allocations than a clean write.
3. Forced watcher terminations: When slow or stalled watch channels exhaust their dispatch budget, `kube-apiserver` drops the streams, forcing clients and built-in informers into costly watch retries or full re-lists.

As clusters push to higher scale, peak QPS matters less than predictable behavior. A strained control plane needs to degrade gracefully without amplifying its own load.

## Community work on improving write throughput

Addressing the API server bottleneck required two complementary tracks:

1. Directly reducing allocations on the happy path.
2. Eliminating expensive API server fallbacks so performance stays stable under bursty traffic.

Most of this work landed across independent SIG API Machinery and SIG Scalability efforts alongside [KEP-6404].

## Direct improvements to allocations

### Watch allocation reductions

Streaming initial state via `WatchList` finally exceeds the raw `List` performance, allowing [KEP-3157] to graduate to GA in v1.38. Reaching that bar included safely removing defensive `DeepCopy` calls on watch event delivery, streaming watch cache iterators, using indexed lookups for filtered initial events, and disabling `WithPrevKV` on storage watches to eliminate redundant previous-object decoding on `DELETE`.

Contributors: [Jeffrey Ying], [Jordan Liggitt], [Łukasz Szaszkiewicz], [Marek Siarkowicz], [Ryan Brewster], [Stefan Schimanski], [Wojciech Tyczyński], [ying.s].

### Server-Side Apply optimization

Server-Side Apply field-management tracking previously accounted for more than half of write-path allocations. Skipping live conversions on `Update` saved nearly 20% of `PUT` allocations, and converting only patched top-level fields in Strategic Merge Patch saved nearly 30% on `PATCH`. In v1.38, `managedFields` strings are shared across objects in memory via Go string interning, and [KEP-5958] allows clients and control-plane informers to opt out of fetching them from `kube-apiserver` altogether. Together, string interning cut another 30% off Protobuf `WATCH` bytes and up to 15% off mutating requests.

Contributors: [Jeffrey Ying], [Jordan Liggitt], [Yongrui Lin].

### Declarative validation and CEL admission

Validation and admission run on every mutating request. Switching declarative validation to zero-copy unsafe struct conversions cut `PUT` and `PATCH` bytes by 10%, removing scalar boxing allocations cut `PUT` `allocs/op` by 10%, and deprecating unnecessary `resource.Quantity.DeepCopy` calls removed redundant value copies. For CEL-based admission and selectors, fixing CEL `ObjectVal` cut `ValidatingAdmissionPolicy` allocated bytes by 20% and `LIST` filtering bytes by 10%.

Contributors: [Cici Huang], [Jeffrey Ying], [Joe Betz], [Patrick Ohly], [Triston Swadell].

## Measuring every byte with new benchmark harnesses

You cannot systematically cut allocations across hundreds of contributors without fast, deterministic feedback. In v1.38, contributors built two complementary harnesses that track allocations from single endpoints up to full-cluster saturation.

### Per-request allocation tracking in `BenchmarkRequestCost`

The new integration benchmark [`BenchmarkRequestCost`] spins up an in-process `kube-apiserver` backed by `etcd`, warms reflection and informer caches, alternates request payloads so `GuaranteedUpdate` never short-circuits, and terminates watch streams deterministically by frame count. It records exact `B/op`, `allocs/op`, wire bytes, server setup allocations, and retained heap across 132 JSON and Protobuf scenarios (plus CBOR and Table encodings), covering `GET`, `LIST`, `WATCH`, `POST`, `PUT`, `PATCH`, `DELETE`, and `DELETECOLLECTION` across indexed selectors and CEL admission policies, with results exported directly to [PerfDash].

### End-to-end per-method allocation reductions

Running the latest `BenchmarkRequestCost` suite shows broad reductions:

| HTTP Method        | Format     | `v1.37` B/op | `v1.38` B/op | `B/op` Change |
| :----------------- | :--------- | ------------ | ------------ | ------------: |
| `WATCH`            | `protobuf` | 2,217.2 KiB  | 593.8 KiB    | -73.2%        |
| `WATCH`            | `json`     | 2,337.0 KiB  | 1,317.0 KiB  | -43.6%        |
| `DELETECOLLECTION` | `protobuf` | 240.65 MiB   | 130.00 MiB   | -46.0%        |
| `DELETE`           | `protobuf` | 307.7 KiB    | 180.6 KiB    | -41.3%        |
| `PATCH`            | `protobuf` | 1,234.5 KiB  | 758.2 KiB    | -38.6%        |
| `PATCH`            | `json`     | 1,278.4 KiB  | 799.0 KiB    | -37.5%        |
| `PUT`              | `protobuf` | 958.5 KiB    | 601.1 KiB    | -37.3%        |
| `PUT`              | `json`     | 1,022.5 KiB  | 644.8 KiB    | -36.9%        |
| `POST`             | `protobuf` | 704.3 KiB    | 586.9 KiB    | -16.7%        |
| `GET`              | `protobuf` | 129.8 KiB    | 78.1 KiB     | -39.8%        |
| `LIST`             | `protobuf` | 538.3 KiB    | 502.9 KiB    | -6.6%         |

### Write throughput benchmark

To verify how per-request savings translate into sustained cluster QPS, the ClusterLoader2 [`write-throughput`] suite in `kubernetes/perf-tests` seeds 10,000 realistic 10 KB Pods, attaches continuous cluster-wide watchers, and drives configurable `PATCH` load while scraping Go allocation rate, GC mark-assist CPU, `etcd` latency, watch cache lag, and watcher terminations or stalls.

### Resource cost at 1,000 writes/s (30 KB Pods, 10 cluster-wide watchers)

| Release | Achieved Writes/s | Memory Alloc Rate | Alloc per Write (vs 30 KB Pod) | API Server CPU    | Patch Latency P50 / P99 | Watch Throughput |
| :------ | ----------------: | ----------------: | -----------------------------: | ----------------: | ----------------------: | ---------------: |
| `v1.36` | 991/s             | 4.66 GB/s         | 4,550 KiB (152x)               | 15.6 cores        | 33 ms / 98 ms           | 289 MB/s         |
| `v1.37` | 995/s             | 2.88 GB/s (-38%)  | 2,776 KiB (93x)                | 10.6 cores (-32%) | 23 ms / 92 ms           | 290 MB/s         |
| `v1.38` | 1,020/s           | 1.69 GB/s (-64%)  | 1,627 KiB (54x)                | 7.1 cores (-54%)  | 14 ms / 51 ms           | 298 MB/s         |

## Eliminating degradations

All the performance improvements would not be worth it, if we also didn't ensure that `kube-apiserver` cannot reliably sustain the QPS. Even a short trafic burst could push us over GC threshold into fallback degradation halfing out performance. Here are the 2 efforts that are critical that apiserver degrades gracefully and maintains QPS:

### Serving conflict retries from cache

When a a write `TXN` conflicts, `kube-apiserver` now waits on for the watch cache to reach the required revision and reads the already-decoded object from its immutable B-tree snapshot. Thus avoiding decoding whole object multiple times per read. This overall increases the latency of TXN operations, but as a tradeoff for much higher sustainable throughput by allowing `kube-apiserver` overload protection mechanism to properly throttle conflicts. Before this change `kube-apiserver` required slow gradual increase of QPS and was fragile to short burst. Percent of conflicting requests jumped between tests from 5% to 100% resulting in halfing the sustained QPS. After the change was made, benchmark show predictable rate of 15% of conflicts even after further increasing the QPS.

Contributors: [Marek Siarkowicz], [Wojciech Tyczyński].

### Handling stalled watchers reconnection storm

Previously, `kube-apiserver` dispatched watch events through bounded per-watcher channels under a shared time budget. Whenever a traffic burst, a brief GC pause, or a slow consumer filled a watcher's channel, the dispatcher briefly stalled healthy watchers and then force-closed the lagging stream. Disconnected clients reconnected immediately without backoff, replaying a wider history gap without shared serialization caching and spiraling into a reconnect and re-list storm. This meant that in our benchmarks there was always constant rate of watcher terminations generating allocations in background.

In v1.38, `WatchCacheStallResume` ([KEP-6268]) adopts `etcd`'s synced and unsynced watcher model. When a watcher's buffer fills, `kube-apiserver` marks it unsynced without delaying healthy watchers, catches lagging watchers up in the background from watch cache history while sharing serialized events across watchers on the same snapshot, and rejoins them to the live stream on the same connection once caught up. Watchers only receive `410 Gone` when their resume position ages out of the history window. After the change the rate of watcher terminations was reduced by 100x.

Contributors: [Marek Siarkowicz], [Nami Nasserazad], [Ryan Brewster], [Wojciech Tyczyński].

## How lower allocations translate into higher write throughput

Because `kube-apiserver` saturates on the Go runtime's ~8 GB/s GC sweep ceiling, maximum healthy write QPS is inversely proportional to bytes allocated per write (`Max QPS ≈ Alloc Ceiling / Alloc per Write`). We validated that relationship using the OSS [`write-throughput`] benchmark on a `c4d-standard-96` GCE VM with `GOGC=100`, 10,000 stored 30 KB Pods, 10 continuous cluster-wide Protobuf Pod watchers, and sustained Pod status patches.

### Healthy write-throughput ceiling at GC saturation

| Release | Healthy QPS Ceiling | Achieved Writes/s | Memory Alloc Rate at Ceiling | Alloc per Write | API Server CPU | Patch Latency P50 / P99 | Watch Throughput | 
| :------ | ------------------- | ----------------: | ---------------------------: | --------------: | -------------: | ----------------------: | ---------------: | 
| `v1.36` | 1,800 QPS           | 1,787/s           | 8.23 GB/s                    | 4,472 KiB       | 27.1 cores     | 35 ms / 98 ms           | 523 MB/s         |
| `v1.37` | 3,000 QPS (+67%)    | 2,983/s           | 8.41 GB/s                    | 2,724 KiB       | 33.4 cores     | 29 ms / 97 ms           | 874 MB/s         |
| `v1.38` | 4,800 QPS (+60%)    | 4,753/s           | 7.77 GB/s                    | 1,586 KiB       | 32.3 cores     | 16 ms / 49 ms           | 1,390 MB/s       |

Every release hits its limit near the same ~8 GB/s Go GC allocation wall. Cutting per-write allocations from 4,550 KiB in v1.36 to 2,776 KiB in v1.37 and 1,627 KiB in mid-cycle v1.38 translated almost 1-for-1 into raising healthy throughput from 1,800 QPS to 3,000 QPS and 4,800 QPS, while streaming 1.39 GB/s of watch events at sub-50 ms P99 patch latency.

### Reaching the 3 GB Pod resource-size milestone in scale tests

Raising write throughput and cutting per-object memory churn directly unlocked the next milestone in SIG Scalability's resource-size roadmap ([kubernetes/kubernetes#134375]). In v1.37, introducing realistic Pod specs pushed 5,000-node scale tests to 1.5 GB of total `Pod` resources, where write-path allocation rates and GC pressure during pod churn limited further growth. With v1.38's allocation reductions, Kubernetes scale tests now continuously exercise 3 GB of total `Pod` resources (double the v1.37 footprint) within all API latency and watch health SLOs.

At 3 GB of `Pod` state, our primary scaling bottlenecks in CI are now coming from optimizing [`clusterloader2`], the Kubernetes scalability test framework itself, rather than `kube-apiserver`.

## How to get started and what comes next

With its graduation to Beta in Kubernetes v1.38, the `ConsistentGetFromCache` feature gate (alongside `WatchCacheStallResume`) is enabled by default in `kube-apiserver`. Cluster operators benefit from the lower memory pressure, lower CPU usage, and higher write ceiling automatically on upgrade.

A substantial headroom remains because `kube-apiserver` still decodes and encodes whole objects for small delta updates. Future work in SIG API Machinery and SIG Scalability ([KEP-6404 Potential Future Extensions]) focuses on moving away from whole-object `O(object size)` decoding and re-encoding when only small subtrees like `status` or `spec.nodeName` change and eliminating `managedFields`.

If you want to contribute or run `BenchmarkRequestCost` against your own API server changes, join us in [`#sig-api-machinery`] and [`#sig-scalability`] on [Kubernetes Slack].

## Acknowledgements

Special thanks to everyone across SIG API Machinery, SIG Scalability, and SIG etcd who designed, implemented, benchmarked, and reviewed the work in this area:

* **Cici Huang** ([@cici37]) – *Google*
* **David Eads** ([@deads2k]) – *Red Hat*
* **Franciszek Balcerak** ([@supahero1]) – *Google*
* **Jeffrey Ying** ([@Jefftree]) – *Google*
* **Joe Betz** ([@jpbetz]) – *Google*
* **Jordan Liggitt** ([@liggitt]) – *Google*
* **Łukasz Szaszkiewicz** ([@p0lyn0mial]) – *Red Hat*
* **Marek Siarkowicz** ([@serathius]) – *Google*
* **Mauricio Poppe** ([@mauriciopoppe]) – *Google*
* **Nami Nasserazad** ([@nami-ant]) – *Anthropic*
* **Patrick Ohly** ([@pohly]) – *Intel*
* **Ryan Brewster** ([@rpb-ant]) – *Anthropic*
* **Stefan Schimanski** ([@sttts])
* **Triston Swadell** ([@TristonianJones]) – *Google*
* **Wojciech Tyczyński** ([@wojtek-t]) – *Google*
* **ying.s** ([@shadowofs])
* **Yongrui Lin** ([@yongruilin]) – *Google*

[KEP-3157]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/3157-watch-list
[KEP-5958]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/5958-client-opt-out-managedfields
[KEP-6268]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/6268-watch-cache-stall-resume
[KEP-6404]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/6404-apiserver-write-throughput
[KEP-6404 Potential Future Extensions]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/6404-apiserver-write-throughput#potential-future-extensions
[stopped requesting multi-gigabyte unpaginated reads]: https://kubernetes.io/blog/2025/09/09/kubernetes-v1-34-snapshottable-api-server-cache/
[kubernetes/kubernetes#134375]: https://github.com/kubernetes/kubernetes/issues/134375
[kubernetes/kubernetes#137109]: https://github.com/kubernetes/kubernetes/issues/137109
[kubernetes/kubernetes#138415]: https://github.com/kubernetes/kubernetes/issues/138415
[kubernetes/kubernetes#141652]: https://github.com/kubernetes/kubernetes/issues/141652
[kubernetes/kubernetes#142228]: https://github.com/kubernetes/kubernetes/issues/142228
[`v1.37`]: https://github.com/kubernetes/kubernetes/releases/tag/v1.37.0
[539fda3eec6]: https://github.com/kubernetes/kubernetes/commit/539fda3eec6
[`BenchmarkRequestCost`]: https://github.com/kubernetes/kubernetes/tree/master/test/integration/apiserver/flowcontrol/cost
[PerfDash]: https://perf-dash.k8s.io/#/?jobname=apiserver-request-cost-benchmark&metriccategoryname=GenericMeasurements&metricname=BenchmarkRequestCostV3
[`write-throughput`]: https://github.com/kubernetes/perf-tests/tree/master/clusterloader2/testing/write-throughput
[`clusterloader2`]: https://github.com/kubernetes/perf-tests/tree/master/clusterloader2
[`#sig-api-machinery`]: https://kubernetes.slack.com/messages/sig-api-machinery
[`#sig-scalability`]: https://kubernetes.slack.com/messages/sig-scalability
[Kubernetes Slack]: https://slack.k8s.io/

[Cici Huang]: https://github.com/cici37
[@cici37]: https://github.com/cici37
[@deads2k]: https://github.com/deads2k
[Franciszek Balcerak]: https://github.com/supahero1
[@supahero1]: https://github.com/supahero1
[Jeffrey Ying]: https://github.com/Jefftree
[@Jefftree]: https://github.com/Jefftree
[Joe Betz]: https://github.com/jpbetz
[@jpbetz]: https://github.com/jpbetz
[Jordan Liggitt]: https://github.com/liggitt
[@liggitt]: https://github.com/liggitt
[Łukasz Szaszkiewicz]: https://github.com/p0lyn0mial
[@p0lyn0mial]: https://github.com/p0lyn0mial
[Marek Siarkowicz]: https://github.com/serathius
[@serathius]: https://github.com/serathius
[Mauricio Poppe]: https://github.com/mauriciopoppe
[@mauriciopoppe]: https://github.com/mauriciopoppe
[Nami Nasserazad]: https://github.com/nami-ant
[@nami-ant]: https://github.com/nami-ant
[Patrick Ohly]: https://github.com/pohly
[@pohly]: https://github.com/pohly
[Ryan Brewster]: https://github.com/rpb-ant
[@rpb-ant]: https://github.com/rpb-ant
[Stefan Schimanski]: https://github.com/sttts
[@sttts]: https://github.com/sttts
[Triston Swadell]: https://github.com/TristonianJones
[@TristonianJones]: https://github.com/TristonianJones
[Wojciech Tyczyński]: https://github.com/wojtek-t
[@wojtek-t]: https://github.com/wojtek-t
[ying.s]: https://github.com/shadowofs
[@shadowofs]: https://github.com/shadowofs
[Yongrui Lin]: https://github.com/yongruilin
[@yongruilin]: https://github.com/yongruilin
