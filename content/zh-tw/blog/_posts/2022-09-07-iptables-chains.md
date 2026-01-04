---
layout: blog
title: "Kubernetes 的 iptables 鏈不是 API"
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

**譯者：** Xin Li (DaoCloud)

<!--
Some Kubernetes components (such as kubelet and kube-proxy) create
iptables chains and rules as part of their operation. These chains
were never intended to be part of any Kubernetes API/ABI guarantees,
but some external components nonetheless make use of some of them (in
particular, using `KUBE-MARK-MASQ` to mark packets as needing to be
masqueraded).
-->
一些 Kubernetes 組件（例如 kubelet 和 kube-proxy）在執行操作時，會創建特定的 iptables 鏈和規則。
這些鏈從未被計劃使其成爲任何 Kubernetes API/ABI 保證的一部分，
但一些外部組件仍然使用其中的一些鏈（特別是使用 `KUBE-MARK-MASQ` 將資料包標記爲需要僞裝）。

<!--
As a part of the v1.25 release, SIG Network made this declaration
explicit: that (with one exception), the iptables chains that
Kubernetes creates are intended only for Kubernetes’s own internal
use, and third-party components should not assume that Kubernetes will
create any specific iptables chains, or that those chains will contain
any specific rules if they do exist.
-->
作爲 v1.25 版本的一部分，SIG Network 明確聲明：
Kubernetes 創建的 iptables 鏈僅供 Kubernetes 內部使用（有一個例外），
第三方組件不應假定 Kubernetes 會創建任何特定的 iptables 鏈，
或者這些鏈將包含任何特定的規則（即使它們確實存在）。

<!--
Then, in future releases, as part of [KEP-3178], we will begin phasing
out certain chains that Kubernetes itself no longer needs. Components
outside of Kubernetes itself that make use of `KUBE-MARK-MASQ`,
`KUBE-MARK-DROP`, or other Kubernetes-generated iptables chains should
start migrating away from them now.
-->
然後，在未來的版本中，作爲 [KEP-3178] 的一部分，我們將開始逐步淘汰 Kubernetes
本身不再需要的某些鏈。Kubernetes 自身之外且使用了 `KUBE-MARK-MASQ`、`KUBE-MARK-DROP`
或 Kubernetes 所生成的其它 iptables 鏈的組件應當開始遷移。

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

除了各種爲 Service 創建的 iptables 鏈之外，kube-proxy 還創建了某些通用 iptables 鏈，
用作服務代理的一部分。 過去，kubelet 還使用 iptables
來實現一些功能（例如爲 Pod 設置 `hostPort` 映射），因此它也冗餘地創建了一些重複的鏈。

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
然而，隨着 1.24 版本 Kubernetes 中 [dockershim 的移除]，
kubelet 現在不再爲某種目的使用任何 iptables 規則；
過去使用 iptables 來完成的事情現在總是由容器運行時或網路插件負責，
現在 kubelet 沒有理由創建任何 iptables 規則。

同時，雖然 iptables 仍然是 Linux 上預設的 kube-proxy 後端，
但它不會永遠是預設選項，因爲相關的命令列工具和內核 API 基本上已被棄用，
並且不再得到改進。（RHEL 9 [記錄警告] 如果你使用 iptables API，即使是通過 `iptables-nft`。）

<!--
Although as of Kubernetes 1.25 iptables kube-proxy remains popular,
and kubelet continues to create the iptables rules that it
historically created (despite no longer _using_ them), third party
software cannot assume that core Kubernetes components will keep
creating these rules in the future.

[the removal of dockershim]: https://kubernetes.io/blog/2022/02/17/dockershim-faq/
[logs a warning]: https://access.redhat.com/solutions/6739041
-->
儘管在 Kubernetes 1.25，iptables kube-proxy 仍然很流行，
並且 kubelet 繼續創建它過去創建的 iptables 規則（儘管不再**使用**它們），
第三方軟體不能假設核心 Kubernetes 組件將來會繼續創建這些規則。

[移除 dockershim]: https://kubernetes.io/zh-cn/blog/2022/02/17/dockershim-faq/
[記錄警告]: https://access.redhat.com/solutions/6739041

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
## 即將發生的變化

從現在開始的幾個版本中，kubelet 將不再在 `nat` 表中創建以下 iptables 鏈：

  - `KUBE-MARK-DROP`
  - `KUBE-MARK-MASQ`
  - `KUBE-POSTROUTING`

此外，`filter` 表中的 `KUBE-FIREWALL` 鏈將不再具有當前與
`KUBE-MARK-DROP` 關聯的功能（並且它最終可能會完全消失）。

<!--
This change will be phased in via the `IPTablesOwnershipCleanup`
feature gate.  That feature gate is available and can be manually
enabled for testing in Kubernetes 1.25. The current plan is that it
will become enabled-by-default in Kubernetes 1.27, though this may be
delayed to a later release. (It will not happen sooner than Kubernetes
1.27.)
-->
此更改將通過 `IPTablesOwnershipCleanup` 特性門控逐步實施。
你可以手動在 Kubernetes 1.25 中開啓此特性進行測試。
目前的計劃是將其在 Kubernetes 1.27 中預設啓用，
儘管這可能會延遲到以後的版本。（不會在 Kubernetes 1.27 版本之前調整。）

<!--
## What to do if you use Kubernetes’s iptables chains

(Although the discussion below focuses on short-term fixes that are
still based on iptables, you should probably also start thinking about
eventually migrating to nftables or another API).
-->
## 如果你使用 Kubernetes 的 iptables 鏈怎麼辦

（儘管下面的討論側重於仍然基於 iptables 的短期修復，
但你可能也應該開始考慮最終遷移到 nftables 或其他 API。）

<!--
### If you use `KUBE-MARK-MASQ`... {#use-case-kube-mark-masq}

If you are making use of the `KUBE-MARK-MASQ` chain to cause packets
to be masqueraded, you have two options: (1) rewrite your rules to use
`-j MASQUERADE` directly, (2) create your own alternative “mark for
masquerade” chain.
-->
### 如果你使用 `KUBE-MARK-MASQ` 鏈...  {#use-case-kube-mark-drop}

如果你正在使用 `KUBE-MARK-MASQ` 鏈來僞裝資料包，
你有兩個選擇：（1）重寫你的規則以直接使用 `-j MASQUERADE`，
（2）創建你自己的替代鏈，完成“爲僞裝而設標記”的任務。

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
kube-proxy 使用 `KUBE-MARK-MASQ` 的原因是因爲在很多情況下它需要在資料包上同時調用 
`-j DNAT` 和 `-j MASQUERADE`，但不可能同時在 iptables 中調用這兩種方法；
`DNAT` 必須從 `PREROUTING`（或 `OUTPUT`）鏈中調用（因爲它可能會改變資料包將被路由到的位置）而
`MASQUERADE` 必須從 `POSTROUTING` 中調用（因爲它僞裝的源 IP 地址取決於最終的路由）。

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
理論上，kube-proxy 可以有一組規則來匹配 `PREROUTING`/`OUTPUT`
中的資料包並調用 `-j DNAT`，然後有第二組規則來匹配 `POSTROUTING`
中的相同資料包並調用 `-j MASQUERADE`。
但是，爲了提高效率，kube-proxy 只匹配了一次，在 `PREROUTING`/`OUTPUT` 期間調用 `-j DNAT`，
然後調用 `-j KUBE-MARK-MASQ` 在內核資料包標記屬性上設置一個比特，作爲對自身的提醒。
然後，在 `POSTROUTING` 期間，通過一條規則來匹配所有先前標記的資料包，並對它們調用 `-j MASQUERADE`。

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
如果你有**很多**規則需要像 kube-proxy 一樣對同一個資料包同時執行 DNAT 和僞裝操作，
那麼你可能需要類似的安排。但在許多情況下，使用 `KUBE-MARK-MASQ` 的組件之所以這樣做，
只是因爲它們複製了 kube-proxy 的行爲，而不理解 kube-proxy 爲何這樣做。
許多這些組件可以很容易地重寫爲僅使用單獨的 DNAT 和僞裝規則。
（在沒有發生 DNAT 的情況下，使用 `KUBE-MARK-MASQ` 的意義就更小了；
只需將你的規則從 `PREROUTING` 移至 `POSTROUTING` 並直接調用 `-j MASQUERADE`。）

<!--
### If you use `KUBE-MARK-DROP`... {#use-case-kube-mark-drop}

The rationale for `KUBE-MARK-DROP` is similar to the rationale for
`KUBE-MARK-MASQ`: kube-proxy wanted to make packet-dropping decisions
alongside other decisions in the `nat` `KUBE-SERVICES` chain, but you
can only call `-j DROP` from the `filter` table. So instead, it uses
`KUBE-MARK-DROP` to mark packets to be dropped later on.
-->
### 如果你使用 `KUBE-MARK-DROP`... {#use-case-kube-mark-drop}

`KUBE-MARK-DROP` 的基本原理與 `KUBE-MARK-MASQ` 類似：
kube-proxy 想要在 `nat` `KUBE-SERVICES` 鏈中做出丟包決定以及其他決定，
但你只能從 `filter` 表中調用 `-j DROP`。

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
通常，刪除對 `KUBE-MARK-DROP` 的依賴的方法與刪除對 `KUBE-MARK-MASQ` 的依賴的方法相同。
在 kube-proxy 的場景中，很容易將 `nat` 表中的 `KUBE-MARK-DROP`
的用法替換爲直接調用 `filter` 表中的 `DROP`，因爲 DNAT 規則和 DROP 規則之間沒有複雜的交互關係，
因此 DROP 規則可以簡單地從 `nat` 移動到 `filter`。
更復雜的場景中，可能需要在 `nat` 和 `filter` 表中“重新匹配”相同的資料包。

<!--
### If you use Kubelet’s iptables rules to figure out `iptables-legacy` vs `iptables-nft`... {#use-case-iptables-mode}

Components that manipulate host-network-namespace iptables rules from
inside a container need some way to figure out whether the host is
using the old `iptables-legacy` binaries or the newer `iptables-nft`
binaries (which talk to a different kernel API underneath).
-->
### 如果你使用 Kubelet 的 iptables 規則來確定 `iptables-legacy` 與 `iptables-nft`... {#use-case-iptables-mode}

對於從容器內部操縱主機網路命名空間 iptables 規則的組件而言，需要一些方法來確定主機是使用舊的
`iptables-legacy` 二進制檔案還是新的 `iptables-nft` 二進制檔案（與不同的內核 API 交互）下。

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
[`iptables-wrappers`] 模塊爲此類組件提供了一種自動檢測系統 iptables 模式的方法，
但在過去，它通過假設 kubelet 將在任何容器啓動之前創建“一堆” iptables
規則來實現這一點，因此它可以通過查看哪種模式定義了更多規則來猜測主機檔案系統中的
iptables 二進制檔案正在使用哪種模式。

在未來的版本中，kubelet 將不再創建許多 iptables 規則，
因此基於計算存在的規則數量的啓發式方法可能會失敗。

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
然而，從 1.24 開始，kubelet 總是在它使用的任何 iptables 子系統的
`mangle` 表中創建一個名爲 `KUBE-IPTABLES-HINT` 的鏈。
組件現在可以查找這個特定的鏈，以瞭解 kubelet（以及系統的其餘部分）正在使用哪個 iptables 子系統。

（此外，從 Kubernetes 1.17 開始，kubelet 在 `mangle` 表中創建了一個名爲 `KUBE-KUBELET-CANARY` 的鏈。
雖然這條鏈在未來可能會消失，但它仍然會在舊版本中存在，因此在任何最新版本的 Kubernetes 中，
至少會包含 `KUBE-IPTABLES-HINT` 或 `KUBE-KUBELET-CANARY` 兩條鏈的其中一個。）

<!--
The `iptables-wrappers` package has [already been updated] with this new
heuristic, so if you were previously using that, you can rebuild your
container images with an updated version of that.

[`iptables-wrappers`]: https://github.com/kubernetes-sigs/iptables-wrappers/
[already been updated]: https://github.com/kubernetes-sigs/iptables-wrappers/pull/3
-->
`iptables-wrappers` 包[已經被更新]，以提供這個新的啓發式邏輯，
所以如果你以前使用過它，你可以用它的更新版本重建你的容器映像檔。

[`iptables-wrappers`]: https://github.com/kubernetes-sigs/iptables-wrappers/
[已經更新]: https://github.com/kubernetes-sigs/iptables-wrappers/pull/3

<!--
## Further reading

The project to clean up iptables chain ownership and deprecate the old
chains is tracked by [KEP-3178].

[KEP-3178]: https://github.com/kubernetes/enhancements/issues/3178
-->
## 延伸閱讀

[KEP-3178] 跟蹤了清理 iptables 鏈所有權和棄用舊鏈的項目。

[KEP-3178]: https://github.com/kubernetes/enhancements/issues/3178