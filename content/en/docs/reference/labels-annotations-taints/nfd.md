---
title: NFD labels and annotations
content_type: concept
weight: 74
---

## NFD annotations

### nfd.node.kubernetes.io/extended-resources

Example: `nfd.node.kubernetes.io/extended-resources: "accelerator.acme.example/q500,example.com/coprocessor-fx5"`

Used on: Nodes

This annotation records a comma-separated list of
[extended resources](/docs/concepts/configuration/manage-resources-containers/#extended-resources)
managed by [Node Feature Discovery](https://kubernetes-sigs.github.io/node-feature-discovery/) (NFD).
NFD uses this for an internal mechanism. You should not edit this annotation yourself.


### nfd.node.kubernetes.io/feature-labels

Example: `nfd.node.kubernetes.io/feature-labels: "cpu-cpuid.ADX,cpu-cpuid.AESNI,cpu-hardware_multithreading,kernel-version.full"`

Used on: Nodes

This annotation records a comma-separated list of node feature labels managed by
[Node Feature Discovery](https://kubernetes-sigs.github.io/node-feature-discovery/) (NFD).
NFD uses this for an internal mechanism. You should not edit this annotation yourself.


### nfd.node.kubernetes.io/master.version

Example: `nfd.node.kubernetes.io/master.version: "v0.6.0"`

Used on: Node

For node(s) where the Node Feature Discovery (NFD)
[master](https://kubernetes-sigs.github.io/node-feature-discovery/stable/usage/nfd-master.html)
is scheduled, this annotation records the version of the NFD master.
It is used for informative use only.

### nfd.node.kubernetes.io/worker.version

Example: `nfd.node.kubernetes.io/worker.version: "v0.4.0"`

Used on: Nodes

This annotation records the version for a Node Feature Discovery's
[worker](https://kubernetes-sigs.github.io/node-feature-discovery/stable/usage/nfd-worker.html)
if there is one running on a node. It's used for informative use only.

## NFD labels

### feature.node.kubernetes.io/*

Example: `feature.node.kubernetes.io/network-sriov.capable: "true"`

Used on: Node

These labels are used by the Node Feature Discovery (NFD) component to advertise
features on a node.
All built-in labels use the `feature.node.kubernetes.io` label namespace and
have the format `feature.node.kubernetes.io/<feature-name>: "true"`.
NFD has many extension points for creating vendor and application-specific labels.
For details, see the
[customization guide](https://kubernetes-sigs.github.io/node-feature-discovery/v0.12/usage/customization-guide).

### nfd.node.kubernetes.io/node-name

Example: `nfd.node.kubernetes.io/node-name: node-1`

Used on: Node

It specifies which node the NodeFeature object is targeting.
Creators of NodeFeature objects must set this label and 
consumers of the objects are supposed to use the label for 
filtering features designated for a certain node.

{{< note >}}
These Node Feature Discovery (NFD) labels only apply to 
the nodes where NFD is running. To learn more about NFD and 
its components go to its official
[documentation](https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/).
{{< /note >}}


