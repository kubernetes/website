---
reviewers:
- vishh
- derekwaynecarr
- dashpole
title: Reserve Compute Resources for System Daemons
---

* TOC
{:toc}

Kubernetes nodes can be scheduled to `Capacity`. Pods can consume all the
available capacity on a node by default. This is an issue because nodes
typically run quite a few system daemons that power the OS and Kubernetes
itself. Unless resources are set aside for these system daemons, pods and system
daemons compete for resources and lead to resource starvation issues on the
node.

The `kubelet` exposes a feature named `Node Allocatable` that helps to reserve
compute resources for system daemons. Kubernetes recommends cluster
administrators to configure `Node Allocatable` based on their workload density
on each node.

## Node Allocatable

```text
      Node Capacity
---------------------------
|     kube-reserved       |
|-------------------------|
|     system-reserved     |
|-------------------------|
|    eviction-threshold   |
|-------------------------|
|                         |
|      allocatable        |
|   (available for pods)  |
|                         |
|                         |
---------------------------
```

`Allocatable` on a Kubernetes node is defined as the amount of compute resources
that are available for pods. The scheduler does not over-subscribe
`Allocatable`. `CPU`, `memory` and `ephemeral-storage` are supported as of now.

Node Allocatable is exposed as part of `v1.Node` object in the API and as part
of `kubectl describe node` in the CLI.

Resources can be reserved for two categories of system daemons in the `kubelet`.

### Enabling QoS and Pod level cgroups

To properly enforce node allocatable constraints on the node, you must
enable the new cgroup hierarchy via the `--cgroups-per-qos` flag. This flag is
enabled by default. When enabled, the `kubelet` will parent all end-user pods
under a cgroup hierarchy managed by the `kubelet`.

### Configuring a cgroup driver

The `kubelet` supports manipulation of the cgroup hierarchy on
the host using a cgroup driver. The driver is configured via the
`--cgroup-driver` flag.

The supported values are the following:

* `cgroupfs` is the default driver that performs direct manipulation of the
cgroup filesystem on the host in order to manage cgroup sandboxes.
* `systemd` is an alternative driver that manages cgroup sandboxes using
transient slices for resources that are supported by that init system.

Depending on the configuration of the associated container runtime,
operators may have to choose a particular cgroup driver to ensure
proper system behavior. For example, if operators use the `systemd`
cgroup driver provided by the `docker` runtime, the `kubelet` must
be configured to use the `systemd` cgroup driver.

### Kube Reserved

- **Kubelet Flag**: `--kube-reserved=[cpu=100m][,][memory=100Mi][,][ephemeral-storage=1Gi]`
- **Kubelet Flag**: `--kube-reserved-cgroup=`

`kube-reserved` is meant to capture resource reservation for kubernetes system
daemons like the `kubelet`, `container runtime`, `node problem detector`, etc.
It is not meant to reserve resources for system daemons that are run as pods.
`kube-reserved` is typically a function of `pod density` on the nodes. [This
performance dashboard](http://node-perf-dash.k8s.io/#/builds) exposes `cpu` and
`memory` usage profiles of `kubelet` and `docker engine` at multiple levels of
pod density. [This blog
post](http://blog.kubernetes.io/2016/11/visualize-kubelet-performance-with-node-dashboard.html)
explains how the dashboard can be interpreted to come up with a suitable
`kube-reserved` reservation.

To optionally enforce `kube-reserved` on system daemons, specify the parent
control group for kube daemons as the value for `--kube-reserved-cgroup` kubelet
flag.

It is recommended that the kubernetes system daemons are placed under a top
level control group (`runtime.slice` on systemd machines for example). Each
system daemon should ideally run within its own child control group. Refer to
[this
doc](https://git.k8s.io/community/contributors/design-proposals/node/node-allocatable.md#recommended-cgroups-setup)
for more details on recommended control group hierarchy.

Note that Kubelet **does not** create `--kube-reserved-cgroup` if it doesn't
exist. Kubelet will fail if an invalid cgroup is specified.

### System Reserved

- **Kubelet Flag**: `--system-reserved=[cpu=100mi][,][memory=100Mi][,][ephemeral-storage=1Gi]`
- **Kubelet Flag**: `--system-reserved-cgroup=`


`system-reserved` is meant to capture resource reservation for OS system daemons
like `sshd`, `udev`, etc. `system-reserved` should reserve `memory` for the
`kernel` too since `kernel` memory is not accounted to pods in Kubernetes at this time.
Reserving resources for user login sessions is also recommended (`user.slice` in
systemd world).

To optionally enforce `system-reserved` on system daemons, specify the parent
control group for OS system daemons as the value for `--system-reserved-cgroup`
kubelet flag.

It is recommended that the OS system daemons are placed under a top level
control group (`system.slice` on systemd machines for example).

Note that Kubelet **does not** create `--system-reserved-cgroup` if it doesn't
exist. Kubelet will fail if an invalid cgroup is specified.

### Eviction Thresholds

- **Kubelet Flag**: `--eviction-hard=[memory.available<500Mi]`

Memory pressure at the node level leads to System OOMs which affects the entire
node and all pods running on it. Nodes can go offline temporarily until memory
has been reclaimed. To avoid (or reduce the probability of) system OOMs kubelet
provides [`Out of Resource`](./out-of-resource.md) management. Evictions are
supported for `memory` and `ephemeral-storage` only. By reserving some memory via
`--eviction-hard` flag, the `kubelet` attempts to `evict` pods whenever memory
availability on the node drops below the reserved value. Hypothetically, if
system daemons did not exist on a node, pods cannot use more than `capacity -
eviction-hard`. For this reason, resources reserved for evictions are not
available for pods.

### Enforcing Node Allocatable

- **Kubelet Flag**: `--enforce-node-allocatable=pods[,][system-reserved][,][kube-reserved]`

The scheduler treats `Allocatable` as the available `capacity` for pods.

`kubelet` enforce `Allocatable` across pods by default. Enforcement is performed
by evicting pods whenever the overall usage across all pods exceeds
`Allocatable`. More details on eviction policy can be found
[here](./out-of-resource.md#eviction-policy). This enforcement is controlled by
specifying `pods` value to the kubelet flag `--enforce-node-allocatable`.


Optionally, `kubelet` can be made to enforce `kube-reserved` and
`system-reserved` by specifying `kube-reserved` & `system-reserved` values in
the same flag. Note that to enforce `kube-reserved` or `system-reserved`,
`--kube-reserved-cgroup` or `--system-reserved-cgroup` needs to be specified
respectively.

## General Guidelines

System daemons are expected to be treated similar to `Guaranteed` pods. System
daemons can burst within their bounding control groups and this behavior needs
to be managed as part of kubernetes deployments. For example, `kubelet` should
have its own control group and share `Kube-reserved` resources with the
container runtime. However, Kubelet cannot burst and use up all available Node
resources if `kube-reserved` is enforced.

Be extra careful while enforcing `system-reserved` reservation since it can lead
to critical system services being CPU starved or OOM killed on the node. The
recommendation is to enforce `system-reserved` only if a user has profiled their
nodes exhaustively to come up with precise estimates and is confident in their
ability to recover if any process in that group is oom_killed.

* To begin with enforce `Allocatable` on `pods`.
* Once adequate monitoring and alerting is in place to track kube system
  daemons, attempt to enforce `kube-reserved` based on usage heuristics.
* If absolutely necessary, enforce `system-reserved` over time.

The resource requirements of kube system daemons may grow over time as more and
more features are added. Over time, kubernetes project will attempt to bring
down utilization of node system daemons, but that is not a priority as of now.
So expect a drop in `Allocatable` capacity in future releases.

## Example Scenario

Here is an example to illustrate Node Allocatable computation:

* Node has `32Gi` of `memory`, `16 CPUs` and `100Gi` of `Storage`
* `--kube-reserved` is set to `cpu=1,memory=2Gi,ephemeral-storage=1Gi`
* `--system-reserved` is set to `cpu=500m,memory=1Gi,ephemeral-storage=1Gi`
* `--eviction-hard` is set to `memory.available<500Mi,nodefs.available<10%`

Under this scenario, `Allocatable` will be `14.5 CPUs`, `28.5Gi` of memory and
`98Gi` of local storage.
Scheduler ensures that the total memory `requests` across all pods on this node does
not exceed `28.5Gi` and storage doesn't exceed `88Gi`.
Kubelet evicts pods whenever the overall memory usage across pods exceeds `28.5Gi`,
or if overall disk usage exceeds `88Gi` If all processes on the node consume as
much CPU as they can, pods together cannot consume more than `14.5 CPUs`.

If `kube-reserved` and/or `system-reserved` is not enforced and system daemons
exceed their reservation, `kubelet` evicts pods whenever the overall node memory
usage is higher than `31.5Gi` or `storage` is greater than `90Gi`

## Feature Availability

As of Kubernetes version 1.2, it has been possible to **optionally** specify
`kube-reserved` and `system-reserved` reservations. The scheduler switched to
using `Allocatable` instead of `Capacity` when available in the same release.

As of Kubernetes version 1.6, `eviction-thresholds` are being considered by
computing `Allocatable`. To revert to the old behavior set
`--experimental-allocatable-ignore-eviction` kubelet flag to `true`.

As of Kubernetes version 1.6, `kubelet` enforces `Allocatable` on pods using
control groups. To revert to the old behavior unset `--enforce-node-allocatable`
kubelet flag. Note that unless `--kube-reserved`, or `--system-reserved` or
`--eviction-hard` flags have non-default values, `Allocatable` enforcement does
not affect existing deployments.

As of Kubernetes version 1.6, `kubelet` launches pods in their own cgroup
sandbox in a dedicated part of the cgroup hierarchy it manages. Operators are
required to drain their nodes prior to upgrade of the `kubelet` from prior
versions in order to ensure pods and their associated containers are launched in
the proper part of the cgroup hierarchy.

As of Kubernetes version 1.7, `kubelet` supports specifying `storage` as a resource
for `kube-reserved` and `system-reserved`.
