---
layout: blog
title: "Deprecation of kube-proxy IPVS backend"
date: 2026-xx-xx
slug: ipvs-kube-proxy-deprecation
author: >
  Dan Winship (Red Hat)
---

The `ipvs` backend for kube-proxy was an experiment in providing a
kube-proxy backend with better rule-synchronizing performance and
higher network-traffic throughput than the `iptables` mode. While it
succeeded in those goals, the kernel IPVS API has turned out to be a
bad match for the Kubernetes Services API, and the `ipvs` backend was
never able to implement all of the edge cases of Kubernetes Service
functionality correctly.

In Kubernetes 1.29, we introduced the `nftables` backend for
kube-proxy, which become GA in 1.33. This started out as a simple port
of the `iptables` mode (and all of its unit tests) over to the newer
nftables API, and was then improved from there by taking advantage of
new nftables features like sets and verdict maps.

Part of the plan behind adding the `nftables` backend was the idea
that it would eventually replace both the `iptables` and `ipvs`
backends. Because the `ipvs` backend in particular is complex, not
100% feature complete, and architecturally quite different from the
other two backends (and thus more work to maintain), we decided to
officially deprecate it as of Kubernetes 1.35. Although it currently
remains available in kube-proxy (with a warning about its
deprecation), we plan to remove it as of Kubernetes 1.40. All `ipvs`
users should therefore be planning to migrate to either the `nftables`
or `iptables` backends.

## Why `iptables` was slow, and how `ipvs` and `nftables` fixed it

FIXME

control plane

data plane

 The `ipvs` backend improved on this
    by figuring out which services and endpoints had changed, and only
    updating the kernel IPVS "server" entries for the ones that had
    changed.

 The `ipvs` backend was mostly able to avoid
    this problem because the kernel IPVS subsystem uses hash tables
    internally, and in the places where the `ipvs` backend needed to
    use iptables rules as well, it made use of the "ipset"
    functionality to do hash-table matching in iptables.

## IPVS schedulers: The Little Feature That Couldn't {#ipvs-schedulers}

Beyond performance, another reason many users were excited about the
`ipvs` backend was the ability to pick from among various IPVS
"schedulers" for distributing traffic to endpoints, rather than
relying on the simple random distribution used by `iptables` and
`nftables`.

Unfortunately, the way IPVS is used by kube-proxy prevents it from
being able to use kernel IPVS schedulers in a _useful_ way, because
kube-proxy is a distributed service that runs on all nodes in the
cluster, but the kube-proxy processes (and kernel IPVS servers) on
different nodes do not share information directly with each other.
This limits how effective different IPVS schedulers can be; for
example, the goal of the `rr` ("round robin") scheduler is to ensure
that incoming connections are distributed evenly across all endpoints.
But since each node manages its IPVS state separately, if a new
Service comes up with 3 endpoints, and then 3 clients on 3 different
nodes each attempt to connect to it, all 3 clients will be connected
to the _same_ endpoint, since each node's kube-proxy will send its
first connection to the first endpoint.

Some schedulers are designed to work in a distributed way, but they
generally don't fare much better. For example, IPVS supports Maglev
Hashing, which theoretically allows for extremely efficient
distributed load balancing. But that efficiency involves using a
specific sort of two-layer load-balancer design, and kube-proxy does
not have the right architecture to be able to act as either of the two
layers.

## Switching away from `ipvs`

### Switching to `nftables` {#switching-to-nftables}

The `nftables` backend is GA as of Kubernetes 1.33. If you are running
Kubernetes 1.33 or later, and your nodes are running a Linux
distribution with kernel 5.13 or later, then we recommend switching
from `ipvs` to `nftables`. The `nftables` backend is fully supported,
feature-complete, and even has slightly better performance than
`ipvs`:

FIXME INSERT GRAPHS

FIXME docs links on migrating

FIXME control plane performance and 1.36 fixes

### Switching to `iptables`: "It's Not As Slow As You Think!" {#switching-to-iptables}

If you can't switch to `nftables`, either because you are on an older
version of Kubernetes, or because your cluster runs on an older Linux
distribution that isn't new enough to support the `nftables` backend,
you should consider whether it is possible to switch to the `iptables`
backend.

At the time the `ipvs` backend was first written, the `iptables`
backend had substantial performance problems in large clusters, which
manifested in two different ways:

  - Processing updates to Services and endpoint Pods was slow, because
    on every update, kube-proxy would first read the list of existing
    iptables rules from the kernel (an operation which is _much_
    slower than you would expect, in large clusters), and then write
    back the entire updated set of service/endpoint iptables rules
    (which is even slower).

  - The number of iptables rules that `iptables` kube-proxy creates
    grows linearly with the total number of Services, and the first
    packet of each new Service connection has to be tested against
    half of those rules, on average, before matching, which means
    connection establishment latency increases linearly with the
    number of Services.




history of the `ipvs` backend

iptables sucked

ipvs was cool

later improvements to iptables (but not ipvs)
  - https://github.com/kubernetes/kubernetes/pull/110328 and
    https://github.com/kubernetes/kubernetes/pull/110334 got rid of
    unnecessary `iptables-save` calls. (graph at
    https://github.com/kubernetes/kubernetes/pull/110268#issuecomment-1206214513 )

  - https://github.com/kubernetes/kubernetes/pull/110268 switched
    iptables over to (partly) incremental updates.
    (graph at
    https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/3453-minimize-iptables-restore/README.md#what-are-the-reasonable-slos-service-level-objectives-for-the-enhancement
    )

  - https://github.com/kubernetes/kubernetes/pull/114181 improved that
    slightly more (also in the second graph)

  - makes it possible to drop `min-sync-period` (graph at
    https://github.com/kubernetes/kubernetes/pull/114229#issuecomment-1346566684)

nftables

pix

recommendations
