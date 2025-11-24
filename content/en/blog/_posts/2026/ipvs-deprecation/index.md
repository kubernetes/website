---
layout: blog
title: "Deprecation of kube-proxy IPVS backend"
date: 2026-xx-xx
slug: ipvs-deprecation
author: >
  Dan Winship (Red Hat)
---

The `ipvs` backend for kube-proxy was an experiment in providing a
service proxy implementation with better performance than the
`iptables` backend. While it succeeded in that goal, the kernel IPVS
API has turned out to be a bad match for the Kubernetes Services API,
and the `ipvs` backend was never able to implement all of the edge
cases of Kubernetes Service functionality correctly.

In Kubernetes 1.29, we introduced the `nftables` backend for
kube-proxy, which became GA in 1.33. Part of the plan behind adding
the `nftables` backend was the idea that it would eventually replace
both the `iptables` and `ipvs` backends. Because the `ipvs` backend in
particular is complex, not 100% feature complete, and architecturally
quite different from the other two backends (and thus more work to
maintain), we decided to officially deprecate it as of Kubernetes
1.35. Although it currently remains available in kube-proxy (with a
warning about its deprecation), we now plan to remove it as of
Kubernetes 1.40. All `ipvs` users should therefore be planning to
migrate to either the `nftables` or `iptables` backends.

## Why was the `ipvs` backend written?

The `ipvs` backend was originally designed to fix two different kinds
of performance problems in the `iptables` backend:

- First, `iptables` had problems with _data plane_ latency (the speed
  at which clients could establish new connections to services),
  because kube-proxy would write a separate iptables rule to match
  each service IP, so every new connection would need to be matched
  against a long series of rules that was **O(n)** in the number of
  services in the cluster.

- Second, it had an even larger problem with _control plane_ latency
  (the speed at which kube-proxy could process changes to services and
  endpoints and update the data plane rules), because kube-proxy would
  rewrite the entire iptables ruleset every time any service or
  endpoint changed. While the list of rules itself was only **O(n)**
  in the total number of endpoints, the amount of time, RAM, and CPU
  that it took to process the updated ruleset grew faster than that.
  In very large clusters, kube-proxy would use 100% of one CPU all the
  time just to process iptables updates. (In fact, the control plane
  scaling problem was bad enough that for most users it was not even
  possible to grow the cluster to the size where the data plane
  scaling problem became noticeable.)

The `ipvs` backend solved both of these scaling problems. The data
plane problem was solved mostly automatically, because the kernel IPVS
subsystem uses hash tables rather than linear lookup. The
control-plane problem was solved by _not_ rewriting the entire ruleset
on every update. (The kernel IPVS API doesn’t have a way of doing
batch updates anyway, so this was essentially forced.)

## Why is the `ipvs` backend now being deprecated?

Almost from the start, the `ipvs` backend also had problems.

The first version didn’t have 100% compatibility with the `iptables`
backend, but it was assumed that this would be fixed over time.
Unfortunately, the original authors moved on to other things outside
the Kubernetes ecosystem (as inevitably sometimes happens in open
source), and it took a while to find new people interested in
maintaining the code.

Meanwhile, as people began using the `ipvs` backend in larger and
larger clusters, its own scaling problems started to emerge. In
particular, the lack of batch update operations in the IPVS API meant
that while the `ipvs` backend was faster than `iptables` when making a
few small changes, it was potentially slower when making a large
number of changes at once. And because the IPVS API is fairly limited
in what it can do, kube-proxy's `ipvs` backend needed to fall back to
using iptables to implement various features of Kubernetes Services
beyond basic "load balancing", making it run into some of the same
scaling problems the `iptables` backend has. While the `ipvs` backend
tried to mitigate this by using `ipset` for some of its rules, this
again ran into the problem of not having a batch update API.
Additionally, the fact that the `ipvs` backend uses iptables means
that it has the same long-term support problem as the `iptables`
backend, with the kernel iptables API being deprecated in the latest
version of Red Hat Enterprise Linux.

### What about IPVS schedulers?

Beyond performance, the other reason some users were excited about the
`ipvs` backend was the ability to pick from among various IPVS
"schedulers" for distributing traffic to endpoints, rather than
relying on the simple random selection used by `iptables` (and
`nftables`).

Unfortunately, the way IPVS is used by kube-proxy prevents it from
being able to use most of the IPVS schedulers in a _useful_ way. The
problem is that kube-proxy is a distributed service that runs on all
nodes in the cluster, but the kube-proxy processes on different nodes
do not share their IPVS scheduler state, so each node picks endpoints
without knowing what is happening with clients on any other node. Even
the schedulers that are designed to work in a distributed way
generally don't work better than random selection in the context of
kube-proxy. For example, the `mh` scheduler uses Maglev Hashing to
select endpoints, which theoretically allows for extremely efficient
distributed load balancing. But that efficiency is only in the context
of[a specific sort of two-layer load-balancer design], and kube-proxy
does not have the right architecture to be able to act as _either_ of
the two layers in that design.

[a specific sort of two-layer load-balancer design]: https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/44824.pdf

## Switching away from `ipvs`

### Switching to `nftables` {#switching-to-nftables}

If you are running Kubernetes 1.36 or later, and your nodes are
running a Linux distribution with kernel 5.13 or later, then we
recommend switching from `ipvs` to `nftables`. (The `nftables` backend
is GA, and fully usable, as of Kubernetes 1.33, but there have been
some performance- and scaline-related fixes since then that that
weren't backported.)

The `nftables` backend is fully supported, feature-complete, and even
has _very slightly_ better performance than `ipvs`:

{{< figure src="ipvs-vs-nftables.svg" alt="kube-proxy ipvs-vs-nftables first packet latency, at various percentiles, in clusters of various sizes" >}}

(Taller bars represent longer latency. The "p50" group is the average
connection establishment latency. Note that even the largest numbers
in this graph are quite tiny; the point is not to claim that
`nftables` is (noticeably) faster than `ipvs`, just to show that,
unlike `iptables`, it's not _slower_.)

Switching is as easy as changing the kube-proxy configuration and
restarting kube-proxy. For example, in clusters deployed via kubeadm,
change `mode: ipvs` to `mode: nftables` in the `kube-proxy` ConfigMap
and then restart the kube-proxy pods, as described in the
documentation on [reconfiguring a kubeadm cluster]. (If you are
overriding other `ipvs`-specific kube-proxy configuration, you will
also need to change those options to [the corresponding `nftables`
ones].)

[reconfiguring a kubeadm cluster]: https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure/#applying-kube-proxy-configuration-changes
[the corresponding `nftables` ones]: https://kubernetes.io/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyNFTablesConfiguration

### Switching to `iptables`: "It's Not As Slow As You Think!" {#switching-to-iptables}

If you can't switch to `nftables`, either because you are on an older
version of Kubernetes, or because your cluster runs on an older Linux
distribution that isn't new enough to support the `nftables` backend,
you may be able to just switch to the `iptables` backend, which has
improved greatly since the original creation of the `ipvs` backend in
2017:

- The generated ruleset has been optimized to remove redundant and
  irrelevant rules ([#57461], [#60306], [#96959], [#108251]), reducing
  data plane latency.

- The code that generates the ruleset has been optimized to do fewer
  allocations, and to avoid unnecessarily recomputing the same
  information multiple times ([#65755], [#65902], [#67948], [#85617],
  [#90103], [#97238]), reducing CPU and memory usage when resyncing.

- Rather than doing “check the current state of the rules, then update
  them to the new state”, `iptables` kube-proxy now does “assume the
  current state is correct, update to the new state based on that
  assumption, and only explicitly check the current state if that
  update fails”. This greatly improves the resyncing speed, because it
  turns out that even _reading_ the iptables ruleset is extremely slow
  in large clusters ([#81517], [#110334], [#114181]).

- To the extent possible within the constraints of the iptables APIs,
  kube-proxy’s iptables backend now only updates iptables rules for
  services/endpoints that have changed since the last sync, rather
  than rewriting the entire ruleset every time ([#110268] /
  [KEP-3453]).

[#57461]: https://github.com/kubernetes/kubernetes/pull/57461
[#60306]: https://github.com/kubernetes/kubernetes/pull/60306
[#96959]: https://github.com/kubernetes/kubernetes/pull/96959
[#108251]: https://github.com/kubernetes/kubernetes/pull/108251/changes/37ada4b04f4a21daf0e3628c63226531b51ee6bf
[#65755]: https://github.com/kubernetes/kubernetes/pull/65755
[#65902]: https://github.com/kubernetes/kubernetes/pull/65902
[#67948]: https://github.com/kubernetes/kubernetes/pull/67948
[#85617]: https://github.com/kubernetes/kubernetes/pull/85617
[#90103]: https://github.com/kubernetes/kubernetes/pull/90103
[#97238]: https://github.com/kubernetes/kubernetes/pull/97238/changes/4c8b190372aaf6eb6ccce07d1763d2d4e26eb98d
[#81517]: https://github.com/kubernetes/kubernetes/pull/81517
[#110334]: https://github.com/kubernetes/kubernetes/pull/110334
[#114181]: https://github.com/kubernetes/kubernetes/pull/114181
[#110268]: https://github.com/kubernetes/kubernetes/pull/110268
[KEP-3453]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/3453-minimize-iptables-restore/README.md

The net result of this is that the `iptables` backend of 2026, while
still not as good as the `ipvs` backend, is at least _much_ better
than the `iptables` backend of 2017 was, and many people who found
`iptables` unusable in the past would not have problems with it now.

As with switching to `nftables`, switching to `iptables` is mostly
just a matter of updating your kube-proxy configuration, although for
technical reasons, in this case we recommend that you reboot each node
after changing the kube-proxy configuration, rather than merely
restarting kube-proxy. **FIXME I'm not sure how to do this**

## Learn more

- [KEP-5495] gives the full timeline and plan for kube-proxy IPVS
  deprecation.

- The blog post "[NFTables mode for kube-proxy]" has more information
  about `nftables` mode and its performance relative to `ipvs` and
  `iptables`.

[NFTables mode for kube-proxy]: /blog/2025/02/28/nftables-kube-proxy/
[KEP-5495]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/5495-deprecate-ipvs-mode-in-kube-proxy/README.md
