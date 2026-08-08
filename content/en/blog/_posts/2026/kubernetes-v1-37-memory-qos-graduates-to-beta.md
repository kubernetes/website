---
layout: blog
title: "Kubernetes v1.37: Memory QoS Graduates to Beta"
draft: true
slug: kubernetes-v1-37-memory-qos-graduates-to-beta
author: >
  Qi Wang (Red Hat),
  Sohan Kunkerkar (Red Hat)
---

Memory QoS has graduated to beta in Kubernetes v1.37 and is now enabled by
default. The feature uses the cgroup v2 memory controller to give the kernel
better guidance on how to treat container memory. It was first introduced as
alpha in v1.22, and expanded in v1.36 with tiered memory reservation.

This post covers what changed in v1.37, what the beta promotion means for
cluster operators, and how to configure the feature.

## What changed in v1.37

### Memory QoS is beta and enabled by default

The `MemoryQoS` feature gate is now beta in v1.37.
This means every v1.37 kubelet has the feature gate turned on without any
configuration change. Turning on the feature by default is safe because the
default kubelet configuration does not enable memory throttling or memory
reservation. No `memory.high`, `memory.min`, or `memory.low` values are
written to cgroups unless you explicitly configure them.

You can opt into specific behaviors through kubelet configuration fields:

1. Set `memoryThrottlingFactor` (for example, `0.9`) to enable `memory.high` throttling on Burstable and BestEffort containers. The default is `null`, which means no throttling.
2. Set `memoryReservationPolicy` to `TieredReservation`  to enable tiered memory protection via `memory.min` and `memory.low`. The default is `None`, which means no memory reservation.

### Default `memoryThrottlingFactor` changed to null

In earlier alpha releases, `memoryThrottlingFactor` defaulted to `0.9`, which
meant enabling the feature gate caused the kubelet to set
`memory.high` on containers. In v1.37, the default is `null`, so the kubelet
does not set `memory.high` unless you configure a value.

This change was made because, with the feature gate now on by default, an
automatic `memory.high` could throttle workloads that were previously running
without throttling. Making it `null` ensures that upgrading to v1.37 does not
change runtime behavior for existing clusters.

If your kubelet configuration file already contains an explicit
`memoryThrottlingFactor` value, that value is preserved during the upgrade and
throttling continues to work as before. If your configuration file does not
include `memoryThrottlingFactor`, the kubelet will use the new `null` default and
stop setting `memory.high`. To keep throttling in that case, add
`memoryThrottlingFactor` explicitly:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
memoryThrottlingFactor: 0.9
```

## How to configure MemoryQoS in v1.37

For full details on configuring Memory QoS, see [Memory QoS with cgroup v2](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2).

### Enable memory throttling only

Set `memoryThrottlingFactor` to a value between 0 and 1. The kubelet uses this
factor to calculate `memory.high` for Burstable and BestEffort containers. See
[Memory throttling](/docs/concepts/workloads/pods/pod-qos/#memory-throttling)
for how `memory.high` is calculated for each QoS class.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
memoryThrottlingFactor: 0.9
```

### Enable memory throttling and tiered reservation

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
memoryThrottlingFactor: 0.9
memoryReservationPolicy: TieredReservation
```

### Enable tiered reservation without throttling

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
memoryReservationPolicy: TieredReservation
```

### Disable Memory QoS entirely

If you need to disable the feature after upgrading, set the feature gate to
false and remove `memoryThrottlingFactor` and `memoryReservationPolicy` from
your kubelet configuration. The kubelet validates that these fields are not set
when the feature gate is disabled and will reject the configuration otherwise.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: false
```

At startup the kubelet sets `memory.min=0` on the root kubepods cgroup and
`memory.low=0` on the Burstable QoS cgroup. For containers, stale
`memory.high` values are reset to `max` on reconciliation paths such as restart
or resize.

## What to expect next

The next milestone for Memory QoS is graduation to GA. Feedback from beta
users will shape any remaining adjustments before that step. If you run into
issues, please file bugs at
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/issues).

## How can I learn more?

1. [KEP-2570: Memory QoS](https://www.kubernetes.dev/resources/keps/2570/)
2. [Pod Quality of Service Classes](/docs/concepts/workloads/pods/pod-qos/)
3. [Memory QoS with cgroup v2](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2)
4. [Managing Resources for Containers](/docs/concepts/configuration/manage-resources-containers/)
5. [Kubernetes cgroups v2 support](/docs/concepts/architecture/cgroups/)
6. [Linux kernel cgroups v2 documentation](https://docs.kernel.org/admin-guide/cgroup-v2.html)

## Getting involved

This feature is driven by
[SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/). If
you are interested in contributing or have feedback, you can reach out through:

1. Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
2. [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
3. [SIG Node meetings](https://www.kubernetes.dev/community/community-groups/sigs/node/#meetings)
