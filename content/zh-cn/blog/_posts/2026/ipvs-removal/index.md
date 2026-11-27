---
layout: blog
title: "kube-proxy IPVS 后端的移除计划"
date: 2026-11-16T10:35:00-08:00
slug: ipvs-removal
author: >
  Dan Winship (Red Hat)
translator: >
  [Qifeng Guo](https://github.com/cyclinder) (DaoCloud)
---
<!--
layout: blog
title: "Scheduling the removal of the kube-proxy IPVS backend"
date: 2026-11-16T10:35:00-08:00
slug: ipvs-removal
author: >
  Dan Winship (Red Hat)
-->

<!--
The `ipvs` backend for kube-proxy was an experiment in providing a
service proxy implementation with better performance than the
`iptables` backend. While it succeeded in that goal, the kernel IPVS
API has turned out to be a bad match for the Kubernetes Services API,
and the `ipvs` backend was never able to implement all of the edge
cases of Kubernetes Service functionality correctly.
-->
kube-proxy 的 `ipvs` 后端最初是一次尝试，目的是提供一个比 `iptables`
后端性能更好的服务代理实现。虽然它达成了这个目标，但事实证明，内核 IPVS API
与 Kubernetes Service API 并不契合，`ipvs` 后端也始终没能正确实现
Kubernetes Service 功能的所有边界情况。

<!--
In Kubernetes 1.29, the project introduced the `nftables` backend for
kube-proxy, which became GA in 1.33. Part of the plan behind adding
the `nftables` backend was the idea that it would eventually replace
both the `iptables` and `ipvs` backends. Because the `ipvs` backend in
particular is complex, not 100% feature complete, and architecturally
quite different from the other two backends (and thus more work to
maintain), Kubernetes SIG Network decided to officially [deprecate it
as of Kubernetes 1.35]. Although it currently remains available in
kube-proxy (with a warning about its deprecation), we (Kubernetes SIG
Network) now plan to remove it in Kubernetes 1.40. All `ipvs` users
should therefore be planning to migrate to either the `nftables` or
`iptables` backends.
-->
Kubernetes 1.29 为 kube-proxy 引入了 `nftables` 后端，该后端在 1.33 中进阶至 GA。
添加 `nftables` 后端的初衷之一，就是让它最终同时取代 `iptables` 和 `ipvs` 两个后端。
尤其是 `ipvs` 后端，它实现复杂、功能并不完整，而且在架构上与另外两个后端差异很大
（因此维护成本更高），所以 Kubernetes SIG Network 决定[自 Kubernetes 1.35 起正式弃用它][deprecate it as of Kubernetes 1.35]。
虽然目前 kube-proxy 中仍然可以使用它（会输出弃用警告），但我们（Kubernetes SIG Network）
现在计划在 Kubernetes 1.40 中将其移除。因此，所有 `ipvs` 用户都应着手规划迁移到
`nftables` 或 `iptables` 后端。

[deprecate it as of Kubernetes 1.35]: /zh-cn/blog/2025/12/17/kubernetes-v1-35-release/#deprecation-of-ipvs-mode-in-kube-proxy

<!--
## Why was the `ipvs` backend written?
-->
## 当初为什么要编写 `ipvs` 后端？ {#why-was-the-ipvs-backend-written}

<!--
The `ipvs` backend was originally designed to fix two different kinds
of performance problems in the `iptables` backend:
-->
`ipvs` 后端最初是为了解决 `iptables` 后端的两类性能问题而设计的：

<!--
- First, `iptables` had problems with _data plane_ latency (the speed
  at which clients could establish new connections to services),
  because kube-proxy would write a separate iptables rule to match
  each service IP, so every new connection would need to be matched
  against a long series of rules that was **O(n)** in the number of
  services in the cluster.
-->
- 第一，`iptables` 存在**数据面**延迟问题（即客户端与 Service 建立新连接的速度）。
  这是因为 kube-proxy 会为每个 Service IP 单独写一条 iptables 规则来匹配，
  所以每个新连接都要逐条匹配一长串规则，其复杂度与集群中 Service 的数量成 **O(n)** 关系。

<!--
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
-->
- 第二，它在**控制面**延迟上的问题更严重（即 kube-proxy 处理 Service 和端点变更、
  并更新数据面规则的速度）。这是因为只要任何 Service 或端点发生变化，
  kube-proxy 就会重写整个 iptables 规则集。虽然规则列表本身与端点总数只是 **O(n)** 关系，
  但处理更新后的规则集所需的时间、内存和 CPU 的增长速度要比这快得多。
  在超大规模集群中，kube-proxy 会一直占满一个 CPU 核，仅仅用来处理 iptables 更新。
  （事实上，控制面的扩展性问题严重到对大多数用户来说，集群规模根本长不到让数据面扩展性问题显现出来的程度。）

<!--
The `ipvs` backend solved both of these scaling problems. The data
plane problem was solved mostly automatically, because the kernel IPVS
subsystem uses hash tables rather than linear lookup. The
control-plane problem was solved by **not** rewriting the entire
ruleset on every update. (The kernel IPVS API doesn’t have a way of
doing batch updates anyway, so this was essentially forced.)
-->
`ipvs` 后端解决了这两个扩展性问题。数据面问题基本上是自然而然解决的，
因为内核 IPVS 子系统使用哈希表而不是线性查找。控制面问题的解决方式则是每次更新时**不**重写整个规则集。
（反正内核 IPVS API 也没有批量更新的方式，所以这基本上是被迫如此。）

<!--
## Why is the `ipvs` backend now being deprecated?
-->
## 为什么现在要弃用 `ipvs` 后端？ {#why-is-the-ipvs-backend-now-being-deprecated}

<!--
Almost from the start, the `ipvs` backend also had problems.
-->
几乎从一开始，`ipvs` 后端就有它自己的问题。

<!--
The first version didn’t have 100% compatibility with the `iptables`
backend, but it was assumed that this would be fixed over time.
Unfortunately, the original authors moved on to other things outside
the Kubernetes ecosystem (as inevitably sometimes happens in open
source), and it took a while to find new people interested in
maintaining the code.
-->
最初的版本并没有与 `iptables` 后端做到 100% 兼容，当时大家以为这会随着时间推移逐步修复。
遗憾的是，原作者后来转向了 Kubernetes 生态之外的其他工作（这在开源世界中难免会发生），
过了好一阵子才找到有兴趣维护这部分代码的新人。

<!--
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
backend: Red Hat's plan to remove the iptables API entirely from Red
Hat Enterprise Linux means the `ipvs` kube-proxy backend will also no
longer be available to Kubernetes users on RHEL.
-->
与此同时，随着人们在越来越大的集群中使用 `ipvs` 后端，它自身的扩展性问题也开始显现。
特别是 IPVS API 缺少批量更新操作，这意味着虽然 `ipvs` 后端在做少量小改动时比 `iptables` 快，
但在一次性做大量改动时反而可能更慢。而且由于 IPVS API 能做的事情相当有限，
kube-proxy 的 `ipvs` 后端在实现基本“负载均衡”之外的各种 Kubernetes Service 特性时，
需要回退到使用 iptables，这让它也碰上了 `iptables` 后端的一部分扩展性问题。
虽然 `ipvs` 后端尝试在部分规则中使用 `ipset` 来缓解这个问题，但这又一次撞上了没有批量更新 API 的问题。
此外，`ipvs` 后端依赖 iptables，这意味着它与 `iptables` 后端面临同样的长期支持问题：
Red Hat 计划从 Red Hat Enterprise Linux 中彻底移除 iptables API，
届时 RHEL 上的 Kubernetes 用户也将无法再使用 kube-proxy 的 `ipvs` 后端。

<!--
### What about IPVS schedulers?
-->
### IPVS 调度器怎么办？ {#what-about-ipvs-schedulers}

<!--
Beyond performance, the other reason some users were excited about the
`ipvs` backend was the ability to pick from among various IPVS
"schedulers" for distributing traffic to endpoints, rather than
relying on the simple random selection used by `iptables` (and
`nftables`).
-->
除了性能之外，一些用户看好 `ipvs` 后端的另一个原因，是它可以从多种 IPVS
“调度器”中选择一种来将流量分发到端点，而不必依赖 `iptables`（以及 `nftables`）所使用的简单随机选择。

<!--
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
of [a specific sort of two-layer load-balancer design], and kube-proxy
does not have the right architecture to be able to act as _either_ of
the two layers in that design.
-->
遗憾的是，kube-proxy 使用 IPVS 的方式，使它无法以**有意义**的方式使用大多数 IPVS 调度器。
问题在于 kube-proxy 是运行在集群所有节点上的分布式服务，但不同节点上的 kube-proxy
进程并不共享 IPVS 调度器状态，所以每个节点在选择端点时，并不知道其他节点上的客户端是什么情况。
即使是那些专为分布式场景设计的调度器，在 kube-proxy 的场景下通常也不比随机选择更好。
例如，`mh` 调度器使用 Maglev 哈希来选择端点，理论上可以实现极其高效的分布式负载均衡。
但这种高效只在[一种特定的两层负载均衡器设计][a specific sort of two-layer load-balancer design]中才成立，
而 kube-proxy 的架构**无法**充当该设计中的任意一层。

[a specific sort of two-layer load-balancer design]: https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/44824.pdf

<!--
## Switching away from `ipvs`
-->
## 从 `ipvs` 迁移出去 {#switching-away-from-ipvs}

<!--
### Switching to `nftables` {#switching-to-nftables}
-->
### 切换到 `nftables` {#switching-to-nftables}

<!--
If you are running Kubernetes 1.36 or later, and your nodes are
running a Linux distribution with kernel 5.13 or later, and you use
the `ipvs` proxy mode, then Kubernetes recommends switching to the
`nftables` mode of kube-proxy. (Although the `nftables` backend is GA
—and fully usable—as of Kubernetes 1.33, there have been some
performance- and scaling-related fixes since then that that weren't
backported to releases earlier than 1.36.)
-->
如果你运行的是 Kubernetes 1.36 或更高版本，节点上运行的是内核 5.13 或更高版本的 Linux 发行版，
并且你使用的是 `ipvs` 代理模式，那么 Kubernetes 建议你切换到 kube-proxy 的 `nftables` 模式。
（虽然 `nftables` 后端自 Kubernetes 1.33 起已经 GA 并且完全可用，
但此后有一些与性能和扩展性相关的修复并没有被回溯移植到 1.36 之前的版本。）

<!--
The `nftables` backend is fully supported, feature-complete, and even
has _very slightly_ better performance than `ipvs`:
-->
`nftables` 后端得到完全支持、功能完整，性能甚至比 `ipvs` 还要**略好一点点**：

<!--
{{< figure src="ipvs-vs-nftables.svg" alt="kube-proxy ipvs-vs-nftables first packet latency, at various percentiles, in clusters of various sizes" >}}
-->
{{< figure src="ipvs-vs-nftables.svg" alt="不同规模集群中 kube-proxy ipvs 与 nftables 在各百分位上的首包延迟对比" >}}

<!--
(Taller bars represent longer latency. The "p50" group is the average
connection establishment latency. Note that even the largest numbers
in this graph are quite tiny; the point is not to claim that
`nftables` is (noticeably) faster than `ipvs`, just to show that,
unlike `iptables`, it's not _slower_.)
-->
（柱子越高表示延迟越长。“p50”这一组是平均建连延迟。注意，即使是图中最大的数值也非常小；
这张图的重点不是要说明 `nftables` 比 `ipvs`（明显）更快，而只是想表明，
与 `iptables` 不同，它并**不会更慢**。）

<!--
Switching is as easy as changing the kube-proxy configuration and
restarting kube-proxy. For example, in clusters deployed via kubeadm,
change `mode: ipvs` to `mode: nftables` in the `kube-proxy` ConfigMap
and then restart the kube-proxy pods, as described in the
documentation on [reconfiguring a kubeadm cluster]. (If you are
overriding other `ipvs`-specific kube-proxy configuration, you will
also need to change those options to [the corresponding `nftables`
ones].)
-->
切换非常简单，只需修改 kube-proxy 配置并重启 kube-proxy 即可。例如，在通过 kubeadm 部署的集群中，
按照[重新配置 kubeadm 集群][reconfiguring a kubeadm cluster]文档中的说明，
将 `kube-proxy` ConfigMap 中的 `mode: ipvs` 改为 `mode: nftables`，然后重启 kube-proxy Pod。
（如果你还覆盖了其他 `ipvs` 特有的 kube-proxy 配置，
也需要将这些选项改成[对应的 `nftables` 选项][the corresponding `nftables` ones]。）

[reconfiguring a kubeadm cluster]: /zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure/#应用-kube-proxy-配置更改
[the corresponding `nftables` ones]: /zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-KubeProxyNFTablesConfiguration

<!--
### Switching to `iptables`: "It's Not As Slow As You Think!" {#switching-to-iptables}
-->
### 切换到 `iptables`：“它没你想的那么慢！” {#switching-to-iptables}

<!--
If you can't switch to `nftables`, either because you are on an older
version of Kubernetes, or because your cluster runs on an older Linux
distribution that isn't new enough to support the `nftables` backend,
you may be able to just switch to the `iptables` backend, which has
improved greatly since the original creation of the `ipvs` backend in
2017:
-->
如果你因为使用的 Kubernetes 版本较旧，或者集群运行在版本较旧、不足以支持 `nftables`
后端的 Linux 发行版上，而无法切换到 `nftables`，那么你也许可以直接切换到 `iptables` 后端。
自 2017 年 `ipvs` 后端诞生以来，`iptables` 后端已经有了很大的改进：

<!--
- The generated ruleset has been optimized to remove redundant and
  irrelevant rules ([#57461], [#60306], [#96959], [#108251]), reducing
  data plane latency.
-->
- 对生成的规则集做了优化，去掉了冗余和无关的规则（[#57461]、[#60306]、[#96959]、[#108251]），
  降低了数据面延迟。

<!--
- The code that generates the ruleset has been optimized to do fewer
  allocations, and to avoid unnecessarily recomputing the same
  information multiple times ([#65755], [#65902], [#67948], [#85617],
  [#90103], [#97238]), reducing CPU and memory usage when resyncing.
-->
- 对生成规则集的代码做了优化，减少内存分配，并避免不必要地重复计算相同的信息
  （[#65755]、[#65902]、[#67948]、[#85617]、[#90103]、[#97238]），
  降低了重新同步时的 CPU 和内存占用。

<!--
- Rather than doing “check the current state of the rules, then update
  them to the new state”, `iptables` kube-proxy now does “assume the
  current state is correct, update to the new state based on that
  assumption, and only explicitly check the current state if that
  update fails”. This greatly improves the resyncing speed, because it
  turns out that even _reading_ the iptables ruleset is extremely slow
  in large clusters ([#81517], [#110334], [#114181]).
-->
- `iptables` 模式的 kube-proxy 不再“先检查规则的当前状态，再将其更新到新状态”，
  而是“假定当前状态是正确的，基于这个假设更新到新状态，只有在更新失败时才显式检查当前状态”。
  这大大提高了重新同步的速度，因为事实证明，在大规模集群中，
  哪怕只是**读取** iptables 规则集都极其缓慢（[#81517]、[#110334]、[#114181]）。

<!--
- To the extent possible within the constraints of the iptables APIs,
  kube-proxy’s iptables backend now only updates iptables rules for
  services/endpoints that have changed since the last sync, rather
  than rewriting the entire ruleset every time ([#110268] /
  [KEP-3453]).
-->
- 在 iptables API 限制允许的范围内，kube-proxy 的 iptables 后端现在只更新自上次同步以来发生变化的
  Service/端点所对应的 iptables 规则，而不是每次都重写整个规则集（[#110268] / [KEP-3453]）。

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

<!--
The net result of this is that the `iptables` backend of 2026, while
still not as good as the `ipvs` backend, is at least **much** better
than the `iptables` backend of 2017 was, and many people who found
`iptables` unusable in the past would not have problems with it now.
-->
最终结果是，2026 年的 `iptables` 后端虽然仍不如 `ipvs` 后端，但至少比 2017 年的
`iptables` 后端**好得多**。许多过去觉得 `iptables` 没法用的人，现在用起来应该不会有问题了。

<!--
As with switching to `nftables`, switching to `iptables` is mostly
just a matter of updating your kube-proxy configuration, although for
technical reasons, in this case we recommend that you reboot each node
after changing the kube-proxy configuration, rather than merely
restarting kube-proxy.
-->
与切换到 `nftables` 一样，切换到 `iptables` 基本上也只需要更新 kube-proxy 配置。
不过出于技术原因，这种情况下我们建议你在修改 kube-proxy 配置后重启每个节点，而不仅仅是重启 kube-proxy。

<!--
## Learn more
-->
## 了解更多 {#learn-more}

<!--
- [KEP-5495] gives the full timeline and plan for kube-proxy IPVS
  deprecation.

- The blog post "[NFTables mode for kube-proxy]" has more information
  about `nftables` mode and its performance relative to `ipvs` and
  `iptables`.
-->
- [KEP-5495] 给出了 kube-proxy IPVS 弃用的完整时间线和计划。

- 博客文章《[kube-proxy 的 NFTables 模式][NFTables mode for kube-proxy]》提供了更多关于
  `nftables` 模式及其与 `ipvs` 和 `iptables` 性能对比的信息。

[NFTables mode for kube-proxy]: /zh-cn/blog/2025/02/28/nftables-kube-proxy/
[KEP-5495]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/5495-deprecate-ipvs-mode-in-kube-proxy/README.md
