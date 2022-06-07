---
layout: blog
title: "QoS-class resources introduced"
date: 2022-06-07
slug: qos-class-resources
---

**Author:** Markus Lehtonen (Intel)

QoS-class resources is an [enhancement proposal][kep] to improve the quality of
service of applications by reducing contention on resources that have
traditionally been out of control in a Kubernetes environment, such as cache
allocation, memory, and I/O bandwidth. This blog post introduces the concept of
QoS-class resources, talks about the plan to integrate them into Kubernetes,
and describes what is already possible with the latest container runtimes.

## What are QoS-class resources

There are some resources that applications are forced to share, such as cache,
memory bandwidth, and disk I/O. There are technologies for managing those
resources–making it possible to prioritize or isolate applications–but
currently Kubernetes support for them is missing. The “QoS-class resources”
concept aims at changing this in a generalized way: enabling support for cache,
memory, and disk I/O, and making it easy to enable other QoS resource types in
the future.

The properties of QoS-class resources are:

- multiple containers can be assigned to the same class
- non-accountable (“infinite”) resources or resources where capacity can’t be
  determined
- each type of QoS-class resource has its own set of classes, i.e. a set of
  allowed values for that resource

In the sections below, we discuss two types of QoS-class resources that are
already supported by container runtimes (CRI-O and containerd).

### Cache and memory bandwidth

Intel® Resource Director Technology (Intel® RDT) is a technology for
controlling the cache and memory bandwidth allocation of applications. It
provides in hardware a class-based approach for QoS control of these shared
resources. Other hardware vendors and architectures have corresponding
technologies. Intel RDT allows a limited number of classes to be configured and
processes to be assigned to them. All processes in the same class share the
same portion of cache lines and memory bandwidth.

In Linux, control happens via the [resctrlfs][resctrlfs] pseudo-filesystem,
making it virtually agnostic of the hardware architecture. We have implemented
support for Intel RDT in the CRI-O and containerd runtimes.

### Block I/O

The Linux [blockio cgroup controller][linux-blkio] parameters depend very
heavily on the underlying hardware and system configuration (device naming and
numbering, I/O scheduler configuration, etc.) which would make it very
impractical to control these directly from the Pod spec level. To hide the
complexity we have implemented a concept of blockio classes in the container
runtimes (CRI-O and containerd). A cluster administrator is able to configure
blockio controller parameters on a per-node and per-class basis and the classes
are then made available for users to assign their workloads to.

## Proposal and implementation plan

One key concept of the proposal is simplicity from the perspective of
Kubernetes. QoS-class resources would be opaque (as much as possible) with all
detailed resource management (e.g. configuration and control) handled by the
container runtimes. Conceptually, they would be somewhat similar to Kubernetes
extended resources, but for non-accountable resources. For example, in
Kubernetes resource assignments would be simple `<resource-type>=<class>`
key-value pairs.

For example, Kubernetes could see the following types of QoS-class resources
(and the classes within):

| QoS-class resource type | Classes |   |   |   |
| ----------------------- | ------- | - | - | - |
| **rdt**     | platinum  | gold   | silver | bronze
| **blockio** | high-prio | normal | low-prio

Containers could have the following assignments (note that multiple containers
can be assigned to the same class):

|             | container-1 | container-2 | container-3
| ----------- | ----------- | ----------- | -----------
| **rdt**     | gold        | gold        | platinum
| **blockio** | high-prio   | low-prio    | normal

See the [enhancement proposal][kep] for more more technical details.

### Implementation phases

We are planning to split the full implementation into multiple phases, building
functionality gradually, step-by-step. The goal is to make discussions easier
and also get feedback and learn on the way.

#### Phase 1

The goal of the first phase is to enable a bare minimum environment for users
to use and experiment with QoS-class resources in Kubernetes:

- extend the CRI protocol to allow QoS-class resource assignment and updates
- implement pod annotations as an initial user interface in Kubernetes

Our target for the first phase is Kubernetes v1.26, and from the end-users
point of view, it is functionally equivalent to what is currently available in
the container runtimes.

#### Future phases

It is important to think about the future steps to see the proposal in a
broader context and understand what the full solution would look like.

- Pod Spec: replace pod annotations with proper user interface in the PodSpec.
- Resource discovery: a mechanism for the runtime to communicate available
  QoS-class resource types and the available classes within each resource type
  to kubelet
- Resource status/capacity: hold the information of discovered resources (e.g.
  in node status) e.g. for users to see what is available
- Scheduler support: with resource discovery and status/capacity (above) in
  place it is possible to handle QoS-class resource assignments in the
  Kubernetes scheduler
- Access control: mechanism to control which QoS-class resource types (and
  classes within) are available for different users

More details about the future steps are available in the [KEP][kep].

## Early access with container runtimes

There is already some level of support for QoS-class resources in the container
runtimes. Recent versions of CRI-O and containerd runtimes have support for
configuring Intel RDT and blockio classes and controlling resource assignment
via pod annotations. This allows early access and experimentation already
before the Kubernetes support is there.

Requirements:

- Intel RDT
  - CRI-O [v1.22][crio-release] (or later) or containerd
    [v1.6][containerd-release] (or later)
  - runc [v1.1][runc-release-11] (or later)
  - hardware that supports that supports cache/memory bandwidth allocation
    through the Linux resctrlfs interface
- blockio
  - CRI-O [v1.22][crio-release] (or later) or containerd mainline (no release
    with blockio support is available, yet)
  - runc [v1.0][runc-release-10] (or later)

Pod annotations used for assigning the QoS-class resources:

| Annotation  | Description
| :---------- | :----------
| `rdt.resources.beta.kubernetes.io/pod` | set a Pod-level default RDT class for all containers
| `rdt.resources.beta.kubernetes.io/container.<container-name>` | set ‘RDT class of one container
| `blockio.resources.beta.kubernetes.io/pod` | set a Pod-level default blockio class for all containers
| `blockio.resources.beta.kubernetes.io/container.<container-name>` | set blockio class of one container

Configuration file format is described in detail with more examples
[here for RDT][rdt-config-doc], and [here for blockio][blockio-config-doc].

### An example

The following example demonstrates the configuration of RDT and blockio
QoS-class resources with CRI-O runtime

#### RDT configuration

The following simple RDT configuration specifies four classes with different
amount of L3 cache reserved for each.

`/etc/crio/rdt.conf.yaml`:

```yaml
partitions:
  default:
    l3Allocation: 100%
    classes:
      unlimited:
        l3Allocation: 100%
      normal:
        l3Allocation: 66%
      limited:
        l3Allocation: 33%
      worsteffort:
        l3Allocation: 10%
```

#### Blockio configuration

The following blockio configuration specifies three classes with high-prio
getting higher I/O scheduler weight over other classes, normal having throttled
write bandwidth and low-prio having reduced scheduler weight and both read and
write bandwidth throttled.

`/etc/crio/blockio.conf.yaml`:

```yaml
Classes:
  high-prio:
    - Weight: 500
  normal:
    - Devices:
        - "/dev/sd[a-z]"
      throttleWriteBps: "60M"
  low-prio:
    - Weight: 50
    - Devices:
        - "/dev/sd[a-z]"
      throttleReadBps: "50M"
      throttleWriteBps: "10M"
```

#### Starting CRI-O

CRI-O needs to be configured to use the rdt and blockio configuration specified
above which can be done with `rdt_config_file` and `blockio_config_file` config
file options or with the `--rdt-config-file` and `-–blockio-config-file`
command line options.

`/etc/crio/crio.conf`:

```toml
...
rdt_config_file = "/etc/crio/rdt.conf.yaml"

blockio_config_file = "/etc/crio/blockio.conf.yaml"
...
```

#### Assigning QoS-class resources

Below is a referential example leveraging both RDT and blockio resources. It
creates a Pod of three containers with:

- all containers are assigned to the “limited” RDT class by default, except for
  “data-path” container getting assigned to “unlimited” class allowing full
  cache usage
- all containers are assigned to the “normal” blockio class by default, except
  for the “logger” container getting assigned to the “low-prio” class
  throttling its disk usage more strictly

`demo-pod.yaml:`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: demo
  annotations:
    rdt.resources.beta.kubernetes.io/pod: limited
    rdt.resources.beta.kubernetes.io/container.data-path: unlimited
    blockio.resources.beta.kubernetes.io/pod: normal
    blockio.resources.beta.kubernetes.io/container.looger: low-prio
spec:
  containers:
  - name: data-path
    image: k8s.gcr.io/pause
  - name: control-path
    image: k8s.gcr.io/pause
  - name: logger
    image: k8s.gcr.io/pause
```

```bash
kubectl apply -f demo-pod.yaml
```

Note that the containers are minimal pause images, doing nothing in practice,
but just demonstrating how different containers are assigned to different
classes.

### Limitations of the runtime-only approach

The biggest limitations in this runtime-only approach probably lies in the user
interface. Users have no visibility what QoS-class resource types (or classes
within) are available on the nodes and there is no support in Kubernetes
scheduler.

## How to participate

The enhancement proposal includes more details of the feature and the planned
implementation.

Please join SIG Node to get involved in the design and development. You can
participate for example by commenting the [KEP][kep] directly, in
[#sig-node][sig-node-slack] slack or replying to the
[discussion thread in google groups][google-groups-thread]. We’d be delighted
to hear more opinions and ideas how and where QoS-class resources could be used
and how the support should be implemented.

<!-- References -->
[kep]: https://github.com/kubernetes/enhancements/pull/3004
[resctrlfs]: https://docs.kernel.org/x86/resctrl.html
[linux-blkio]: https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v1/blkio-controller.html
[crio-release]: https://github.com/cri-o/cri-o/releases/tag/v1.22.0
[containerd-release]: https://github.com/containerd/containerd/releases/tag/v1.6.0
[runc-release-10]: https://github.com/opencontainers/runc/releases/tag/v1.0.0
[runc-release-11]: https://github.com/opencontainers/runc/releases/tag/v1.1.0
[rdt-config-doc]: https://github.com/intel/goresctrl/blob/main/doc/rdt.md
[blockio-config-doc]: https://github.com/intel/goresctrl/blob/main/doc/blockio.md
[sig-node-slack]: https://kubernetes.slack.com/messages/sig-node
[google-groups-thread]: https://groups.google.com/g/kubernetes-sig-node/c/UoxYzZ7gCbg
