---
layout: blog
title: "Kubernetes’s IPTables Chains Are Not API"
date: 2022-09-07
slug: iptables-chains-not-api
author: >
  Dan Winship (Red Hat)
---

Some Kubernetes components (such as kubelet and kube-proxy) create
iptables chains and rules as part of their operation. These chains
were never intended to be part of any Kubernetes API/ABI guarantees,
but some external components nonetheless make use of some of them (in
particular, using `KUBE-MARK-MASQ` to mark packets as needing to be
masqueraded).

As a part of the v1.25 release, SIG Network made this declaration
explicit: that (with one exception), the iptables chains that
Kubernetes creates are intended only for Kubernetes’s own internal
use, and third-party components should not assume that Kubernetes will
create any specific iptables chains, or that those chains will contain
any specific rules if they do exist.

Then, in future releases, as part of [KEP-3178], we will begin phasing
out certain chains that Kubernetes itself no longer needs. Components
outside of Kubernetes itself that make use of `KUBE-MARK-MASQ`,
`KUBE-MARK-DROP`, or other Kubernetes-generated iptables chains should
start migrating away from them now.

[KEP-3178]: https://github.com/kubernetes/enhancements/issues/3178

## Background

In addition to various service-specific iptables chains, kube-proxy
creates certain general-purpose iptables chains that it uses as part
of service proxying. In the past, kubelet also used iptables for a few
features (such as setting up `hostPort` mapping for pods) and so it
also redundantly created some of the same chains.

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

Although as of Kubernetes 1.25 iptables kube-proxy remains popular,
and kubelet continues to create the iptables rules that it
historically created (despite no longer _using_ them), third party
software cannot assume that core Kubernetes components will keep
creating these rules in the future.

[the removal of dockershim]: https://kubernetes.io/blog/2022/02/17/dockershim-faq/
[logs a warning]: https://access.redhat.com/solutions/6739041

## Upcoming changes

Starting a few releases from now, kubelet will no longer create the
following iptables chains in the `nat` table:

  - `KUBE-MARK-DROP`
  - `KUBE-MARK-MASQ`
  - `KUBE-POSTROUTING`

Additionally, the `KUBE-FIREWALL` chain in the `filter` table will no
longer have the functionality currently associated with
`KUBE-MARK-DROP` (and it may eventually go away entirely).

This change will be phased in via the `IPTablesOwnershipCleanup`
feature gate.  That feature gate is available and can be manually
enabled for testing in Kubernetes 1.25. The current plan is that it
will become enabled-by-default in Kubernetes 1.27, though this may be
delayed to a later release. (It will not happen sooner than Kubernetes
1.27.)

## What to do if you use Kubernetes’s iptables chains

(Although the discussion below focuses on short-term fixes that are
still based on iptables, you should probably also start thinking about
eventually migrating to nftables or another API).

### If you use `KUBE-MARK-MASQ`... {#use-case-kube-mark-masq}

If you are making use of the `KUBE-MARK-MASQ` chain to cause packets
to be masqueraded, you have two options: (1) rewrite your rules to use
`-j MASQUERADE` directly, (2) create your own alternative “mark for
masquerade” chain.

The reason kube-proxy uses `KUBE-MARK-MASQ` is because there are lots
of cases where it needs to call both `-j DNAT` and `-j MASQUERADE` on
a packet, but it’s not possible to do both of those at the same time
in iptables; `DNAT` must be called from the `PREROUTING` (or `OUTPUT`)
chain (because it potentially changes where the packet will be routed
to) while `MASQUERADE` must be called from `POSTROUTING` (because the
masqueraded source IP that it picks depends on what the final routing
decision was).

In theory, kube-proxy could have one set of rules to match packets in
`PREROUTING`/`OUTPUT` and call `-j DNAT`, and then have a second set
of rules to match the same packets in `POSTROUTING` and call `-j
MASQUERADE`. But instead, for efficiency, it only matches them once,
during `PREROUTING`/`OUTPUT`, at which point it calls `-j DNAT` and
then calls `-j KUBE-MARK-MASQ` to set a bit on the kernel packet mark
as a reminder to itself. Then later, during `POSTROUTING`, it has a
single rule that matches all previously-marked packets, and calls `-j
MASQUERADE` on them.

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

### If you use `KUBE-MARK-DROP`... {#use-case-kube-mark-drop}

The rationale for `KUBE-MARK-DROP` is similar to the rationale for
`KUBE-MARK-MASQ`: kube-proxy wanted to make packet-dropping decisions
alongside other decisions in the `nat` `KUBE-SERVICES` chain, but you
can only call `-j DROP` from the `filter` table. So instead, it uses
`KUBE-MARK-DROP` to mark packets to be dropped later on.

In general, the approach for removing a dependency on `KUBE-MARK-DROP`
is the same as for removing a dependency on `KUBE-MARK-MASQ`. In
kube-proxy’s case, it is actually quite easy to replace the usage of
`KUBE-MARK-DROP` in the `nat` table with direct calls to `DROP` in the
`filter` table, because there are no complicated interactions between
DNAT rules and drop rules, and so the drop rules can simply be moved
from `nat` to `filter`.

In more complicated cases, it might be necessary to “re-match” the
same packets in both `nat` and `filter`.

### If you use Kubelet’s iptables rules to figure out `iptables-legacy` vs `iptables-nft`... {#use-case-iptables-mode}

Components that manipulate host-network-namespace iptables rules from
inside a container need some way to figure out whether the host is
using the old `iptables-legacy` binaries or the newer `iptables-nft`
binaries (which talk to a different kernel API underneath).

The [`iptables-wrappers`] module provides a way for such components to
autodetect the system iptables mode, but in the past it did this by
assuming that Kubelet will have created “a bunch” of iptables rules
before any containers start, and so it can guess which mode the
iptables binaries in the host filesystem are using by seeing which
mode has more rules defined.

In future releases, Kubelet will no longer create many iptables rules,
so heuristics based on counting the number of rules present may fail.

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

The `iptables-wrappers` package has [already been updated] with this new
heuristic, so if you were previously using that, you can rebuild your
container images with an updated version of that.

[`iptables-wrappers`]: https://github.com/kubernetes-sigs/iptables-wrappers/
[already been updated]: https://github.com/kubernetes-sigs/iptables-wrappers/pull/3

## Further reading

The project to clean up iptables chain ownership and deprecate the old
chains is tracked by [KEP-3178].

[KEP-3178]: https://github.com/kubernetes/enhancements/issues/3178