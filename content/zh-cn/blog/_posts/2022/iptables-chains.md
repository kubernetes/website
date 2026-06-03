---
layout: blog
title: "Kubernetes 的 iptables 链不是 API"
date: 2022-09-07
slug: iptables-chains-not-api
---

<!--
layout: blog
title: "Kubernetes’s IPTables Chains Are Not API"
date: 2022-09-07
slug: iptables-chains-not-api
-->

<!--
**Author:** Dan Winship (Red Hat)
-->
**作者：** Dan Winship (Red Hat)

**译者：** Xin Li (DaoCloud)

<!--
Some Kubernetes components (such as kubelet and kube-proxy) create
iptables chains and rules as part of their operation. These chains
were never intended to be part of any Kubernetes API/ABI guarantees,
but some external components nonetheless make use of some of them (in
particular, using `KUBE-MARK-MASQ` to mark packets as needing to be
masqueraded).
-->
一些 Kubernetes 组件（例如 kubelet 和 kube-proxy）在执行操作时，会创建特定的 iptables 链和规则。
这些链从未被计划使其成为任何 Kubernetes API/ABI 保证的一部分，
但一些外部组件仍然使用其中的一些链（特别是使用 `KUBE-MARK-MASQ` 将数据包标记为需要伪装）。

<!--
As a part of the v1.25 release, SIG Network made this declaration
explicit: that (with one exception), the iptables chains that
Kubernetes creates are intended only for Kubernetes’s own internal
use, and third-party components should not assume that Kubernetes will
create any specific iptables chains, or that those chains will contain
any specific rules if they do exist.
-->
作为 v1.25 版本的一部分，SIG Network 明确声明：
Kubernetes 创建的 iptables 链仅供 Kubernetes 内部使用（有一个例外），
第三方组件不应假定 Kubernetes 会创建任何特定的 iptables 链，
或者这些链将包含任何特定的规则（即使它们确实存在）。

<!--
Then, in future releases, as part of [KEP-3178], we will begin phasing
out certain chains that Kubernetes itself no longer needs. Components
outside of Kubernetes itself that make use of `KUBE-MARK-MASQ`,
`KUBE-MARK-DROP`, or other Kubernetes-generated iptables chains should
start migrating away from them now.
-->
然后，在未来的版本中，作为 [KEP-3178] 的一部分，我们将开始逐步淘汰 Kubernetes
本身不再需要的某些链。Kubernetes 自身之外且使用了 `KUBE-MARK-MASQ`、`KUBE-MARK-DROP`
或 Kubernetes 所生成的其它 iptables 链的组件应当开始迁移。

[KEP-3178]: https://github.com/kubernetes/enhancements/issues/3178

<!--
## Background

In addition to various service-specific iptables chains, kube-proxy
creates certain general-purpose iptables chains that it uses as part
of service proxying. In the past, kubelet also used iptables for a few
features (such as setting up `hostPort` mapping for pods) and so it
also redundantly created some of the same chains.
-->
## 背景   {#background}

除了各种为 Service 创建的 iptables 链之外，kube-proxy 还创建了某些通用 iptables 链，
用作服务代理的一部分。 过去，kubelet 还使用 iptables
来实现一些功能（例如为 Pod 设置 `hostPort` 映射），因此它也冗余地创建了一些重复的链。

<!--
However, with [the removal of dockershim] in Kubernetes in 1.24,
kubelet now no longer ever uses any iptables rules for its own
purposes; the things that it used to use iptables for are now always
the responsibility of the container runtime or the network plugin, and
there is no reason for kubelet to be creating any iptables rules.

Meanwhile, although `iptables` is still the default kube-proxy backend
on Linux, it is unlikely to remain the default forever, since the
associated command-line tools and kernel APIs are essentially
deprecated, and no longer receiving improvements. (RHEL 9
[logs a warning] if you use the iptables API, even via
`iptables-nft`.)
-->
然而，随着 1.24 版本 Kubernetes 中 [dockershim 的移除]，
kubelet 现在不再为某种目的使用任何 iptables 规则；
过去使用 iptables 来完成的事情现在总是由容器运行时或网络插件负责，
现在 kubelet 没有理由创建任何 iptables 规则。

同时，虽然 iptables 仍然是 Linux 上默认的 kube-proxy 后端，
但它不会永远是默认选项，因为相关的命令行工具和内核 API 基本上已被弃用，
并且不再得到改进。（RHEL 9 [记录警告] 如果你使用 iptables API，即使是通过 `iptables-nft`。）

<!--
Although as of Kubernetes 1.25 iptables kube-proxy remains popular,
and kubelet continues to create the iptables rules that it
historically created (despite no longer _using_ them), third party
software cannot assume that core Kubernetes components will keep
creating these rules in the future.

[the removal of dockershim]: https://kubernetes.io/blog/2022/02/17/dockershim-faq/
[logs a warning]: https://access.redhat.com/solutions/6739041
-->
尽管在 Kubernetes 1.25，iptables kube-proxy 仍然很流行，
并且 kubelet 继续创建它过去创建的 iptables 规则（尽管不再**使用**它们），
第三方软件不能假设核心 Kubernetes 组件将来会继续创建这些规则。

[移除 dockershim]: https://kubernetes.io/zh-cn/blog/2022/02/17/dockershim-faq/
[记录警告]: https://access.redhat.com/solutions/6739041

<!--
## Upcoming changes

Starting a few releases from now, kubelet will no longer create the
following iptables chains in the `nat` table:

  - `KUBE-MARK-DROP`
  - `KUBE-MARK-MASQ`
  - `KUBE-POSTROUTING`

Additionally, the `KUBE-FIREWALL` chain in the `filter` table will no
longer have the functionality currently associated with
`KUBE-MARK-DROP` (and it may eventually go away entirely).
-->
## 即将发生的变化

从现在开始的几个版本中，kubelet 将不再在 `nat` 表中创建以下 iptables 链：

  - `KUBE-MARK-DROP`
  - `KUBE-MARK-MASQ`
  - `KUBE-POSTROUTING`

此外，`filter` 表中的 `KUBE-FIREWALL` 链将不再具有当前与
`KUBE-MARK-DROP` 关联的功能（并且它最终可能会完全消失）。

<!--
This change will be phased in via the `IPTablesOwnershipCleanup`
feature gate.  That feature gate is available and can be manually
enabled for testing in Kubernetes 1.25. The current plan is that it
will become enabled-by-default in Kubernetes 1.27, though this may be
delayed to a later release. (It will not happen sooner than Kubernetes
1.27.)
-->
此更改将通过 `IPTablesOwnershipCleanup` 特性门控逐步实施。
你可以手动在 Kubernetes 1.25 中开启此特性进行测试。
目前的计划是将其在 Kubernetes 1.27 中默认启用，
尽管这可能会延迟到以后的版本。（不会在 Kubernetes 1.27 版本之前调整。）

<!--
## What to do if you use Kubernetes’s iptables chains

(Although the discussion below focuses on short-term fixes that are
still based on iptables, you should probably also start thinking about
eventually migrating to nftables or another API).
-->
## 如果你使用 Kubernetes 的 iptables 链怎么办

（尽管下面的讨论侧重于仍然基于 iptables 的短期修复，
但你可能也应该开始考虑最终迁移到 nftables 或其他 API。）

<!--
### If you use `KUBE-MARK-MASQ`... {#use-case-kube-mark-masq}

If you are making use of the `KUBE-MARK-MASQ` chain to cause packets
to be masqueraded, you have two options: (1) rewrite your rules to use
`-j MASQUERADE` directly, (2) create your own alternative “mark for
masquerade” chain.
-->
### 如果你使用 `KUBE-MARK-MASQ` 链...  {#use-case-kube-mark-drop}

如果你正在使用 `KUBE-MARK-MASQ` 链来伪装数据包，
你有两个选择：（1）重写你的规则以直接使用 `-j MASQUERADE`，
（2）创建你自己的替代链，完成“为伪装而设标记”的任务。

<!--
The reason kube-proxy uses `KUBE-MARK-MASQ` is because there are lots
of cases where it needs to call both `-j DNAT` and `-j MASQUERADE` on
a packet, but it’s not possible to do both of those at the same time
in iptables; `DNAT` must be called from the `PREROUTING` (or `OUTPUT`)
chain (because it potentially changes where the packet will be routed
to) while `MASQUERADE` must be called from `POSTROUTING` (because the
masqueraded source IP that it picks depends on what the final routing
decision was).
-->
kube-proxy 使用 `KUBE-MARK-MASQ` 的原因是因为在很多情况下它需要在数据包上同时调用 
`-j DNAT` 和 `-j MASQUERADE`，但不可能同时在 iptables 中调用这两种方法；
`DNAT` 必须从 `PREROUTING`（或 `OUTPUT`）链中调用（因为它可能会改变数据包将被路由到的位置）而
`MASQUERADE` 必须从 `POSTROUTING` 中调用（因为它伪装的源 IP 地址取决于最终的路由）。

<!--
In theory, kube-proxy could have one set of rules to match packets in
`PREROUTING`/`OUTPUT` and call `-j DNAT`, and then have a second set
of rules to match the same packets in `POSTROUTING` and call `-j
MASQUERADE`. But instead, for efficiency, it only matches them once,
during `PREROUTING`/`OUTPUT`, at which point it calls `-j DNAT` and
then calls `-j KUBE-MARK-MASQ` to set a bit on the kernel packet mark
as a reminder to itself. Then later, during `POSTROUTING`, it has a
single rule that matches all previously-marked packets, and calls `-j
MASQUERADE` on them.
-->
理论上，kube-proxy 可以有一组规则来匹配 `PREROUTING`/`OUTPUT`
中的数据包并调用 `-j DNAT`，然后有第二组规则来匹配 `POSTROUTING`
中的相同数据包并调用 `-j MASQUERADE`。
但是，为了提高效率，kube-proxy 只匹配了一次，在 `PREROUTING`/`OUTPUT` 期间调用 `-j DNAT`，
然后调用 `-j KUBE-MARK-MASQ` 在内核数据包标记属性上设置一个比特，作为对自身的提醒。
然后，在 `POSTROUTING` 期间，通过一条规则来匹配所有先前标记的数据包，并对它们调用 `-j MASQUERADE`。

<!--
If you have _a lot_ of rules where you need to apply both DNAT and
masquerading to the same packets like kube-proxy does, then you may
want a similar arrangement. But in many cases, components that use
`KUBE-MARK-MASQ` are only doing it because they copied kube-proxy’s
behavior without understanding why kube-proxy was doing it that way.
Many of these components could easily be rewritten to just use
separate DNAT and masquerade rules. (In cases where no DNAT is
occurring then there is even less point to using `KUBE-MARK-MASQ`;
just move your rules from `PREROUTING` to `POSTROUTING` and call `-j
MASQUERADE` directly.)
-->
如果你有**很多**规则需要像 kube-proxy 一样对同一个数据包同时执行 DNAT 和伪装操作，
那么你可能需要类似的安排。但在许多情况下，使用 `KUBE-MARK-MASQ` 的组件之所以这样做，
只是因为它们复制了 kube-proxy 的行为，而不理解 kube-proxy 为何这样做。
许多这些组件可以很容易地重写为仅使用单独的 DNAT 和伪装规则。
（在没有发生 DNAT 的情况下，使用 `KUBE-MARK-MASQ` 的意义就更小了；
只需将你的规则从 `PREROUTING` 移至 `POSTROUTING` 并直接调用 `-j MASQUERADE`。）

<!--
### If you use `KUBE-MARK-DROP`... {#use-case-kube-mark-drop}

The rationale for `KUBE-MARK-DROP` is similar to the rationale for
`KUBE-MARK-MASQ`: kube-proxy wanted to make packet-dropping decisions
alongside other decisions in the `nat` `KUBE-SERVICES` chain, but you
can only call `-j DROP` from the `filter` table. So instead, it uses
`KUBE-MARK-DROP` to mark packets to be dropped later on.
-->
### 如果你使用 `KUBE-MARK-DROP`... {#use-case-kube-mark-drop}

`KUBE-MARK-DROP` 的基本原理与 `KUBE-MARK-MASQ` 类似：
kube-proxy 想要在 `nat` `KUBE-SERVICES` 链中做出丢包决定以及其他决定，
但你只能从 `filter` 表中调用 `-j DROP`。

<!--
In general, the approach for removing a dependency on `KUBE-MARK-DROP`
is the same as for removing a dependency on `KUBE-MARK-MASQ`. In
kube-proxy’s case, it is actually quite easy to replace the usage of
`KUBE-MARK-DROP` in the `nat` table with direct calls to `DROP` in the
`filter` table, because there are no complicated interactions between
DNAT rules and drop rules, and so the drop rules can simply be moved
from `nat` to `filter`.

In more complicated cases, it might be necessary to “re-match” the
same packets in both `nat` and `filter`.
-->
通常，删除对 `KUBE-MARK-DROP` 的依赖的方法与删除对 `KUBE-MARK-MASQ` 的依赖的方法相同。
在 kube-proxy 的场景中，很容易将 `nat` 表中的 `KUBE-MARK-DROP`
的用法替换为直接调用 `filter` 表中的 `DROP`，因为 DNAT 规则和 DROP 规则之间没有复杂的交互关系，
因此 DROP 规则可以简单地从 `nat` 移动到 `filter`。
更复杂的场景中，可能需要在 `nat` 和 `filter` 表中“重新匹配”相同的数据包。

<!--
### If you use Kubelet’s iptables rules to figure out `iptables-legacy` vs `iptables-nft`... {#use-case-iptables-mode}

Components that manipulate host-network-namespace iptables rules from
inside a container need some way to figure out whether the host is
using the old `iptables-legacy` binaries or the newer `iptables-nft`
binaries (which talk to a different kernel API underneath).
-->
### 如果你使用 Kubelet 的 iptables 规则来确定 `iptables-legacy` 与 `iptables-nft`... {#use-case-iptables-mode}

对于从容器内部操纵主机网络命名空间 iptables 规则的组件而言，需要一些方法来确定主机是使用旧的
`iptables-legacy` 二进制文件还是新的 `iptables-nft` 二进制文件（与不同的内核 API 交互）下。

<!--
The [`iptables-wrappers`] module provides a way for such components to
autodetect the system iptables mode, but in the past it did this by
assuming that Kubelet will have created “a bunch” of iptables rules
before any containers start, and so it can guess which mode the
iptables binaries in the host filesystem are using by seeing which
mode has more rules defined.

In future releases, Kubelet will no longer create many iptables rules,
so heuristics based on counting the number of rules present may fail.
-->
[`iptables-wrappers`] 模块为此类组件提供了一种自动检测系统 iptables 模式的方法，
但在过去，它通过假设 kubelet 将在任何容器启动之前创建“一堆” iptables
规则来实现这一点，因此它可以通过查看哪种模式定义了更多规则来猜测主机文件系统中的
iptables 二进制文件正在使用哪种模式。

在未来的版本中，kubelet 将不再创建许多 iptables 规则，
因此基于计算存在的规则数量的启发式方法可能会失败。

<!--
However, as of 1.24, Kubelet always creates a chain named
`KUBE-IPTABLES-HINT` in the `mangle` table of whichever iptables
subsystem it is using. Components can now look for this specific chain
to know which iptables subsystem Kubelet (and thus, presumably, the
rest of the system) is using.

(Additionally, since Kubernetes 1.17, kubelet has created a chain
called `KUBE-KUBELET-CANARY` in the `mangle` table. While this chain
may go away in the future, it will of course still be there in older
releases, so in any recent version of Kubernetes, at least one of
`KUBE-IPTABLES-HINT` or `KUBE-KUBELET-CANARY` will be present.)
-->
然而，从 1.24 开始，kubelet 总是在它使用的任何 iptables 子系统的
`mangle` 表中创建一个名为 `KUBE-IPTABLES-HINT` 的链。
组件现在可以查找这个特定的链，以了解 kubelet（以及系统的其余部分）正在使用哪个 iptables 子系统。

（此外，从 Kubernetes 1.17 开始，kubelet 在 `mangle` 表中创建了一个名为 `KUBE-KUBELET-CANARY` 的链。
虽然这条链在未来可能会消失，但它仍然会在旧版本中存在，因此在任何最新版本的 Kubernetes 中，
至少会包含 `KUBE-IPTABLES-HINT` 或 `KUBE-KUBELET-CANARY` 两条链的其中一个。）

<!--
The `iptables-wrappers` package has [already been updated] with this new
heuristic, so if you were previously using that, you can rebuild your
container images with an updated version of that.

[`iptables-wrappers`]: https://github.com/kubernetes-sigs/iptables-wrappers/
[already been updated]: https://github.com/kubernetes-sigs/iptables-wrappers/pull/3
-->
`iptables-wrappers` 包[已经被更新]，以提供这个新的启发式逻辑，
所以如果你以前使用过它，你可以用它的更新版本重建你的容器镜像。

[`iptables-wrappers`]: https://github.com/kubernetes-sigs/iptables-wrappers/
[已经更新]: https://github.com/kubernetes-sigs/iptables-wrappers/pull/3

<!--
## Further reading

The project to clean up iptables chain ownership and deprecate the old
chains is tracked by [KEP-3178].

[KEP-3178]: https://github.com/kubernetes/enhancements/issues/3178
-->
## 延伸阅读

[KEP-3178] 跟踪了清理 iptables 链所有权和弃用旧链的项目。

[KEP-3178]: https://github.com/kubernetes/enhancements/issues/3178