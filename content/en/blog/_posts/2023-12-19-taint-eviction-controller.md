---
layout: blog
title: "Kubernetes 1.29: Decoupling taint-manager from node-lifecycle-controller"
date: 2023-12-19
slug: kubernetes-1-29-taint-eviction-controller
author: >
  Yuan Chen (Apple),
  Andrea Tosatto (Apple)
---

This blog discusses a new feature in Kubernetes 1.29 to improve the handling of taint-based pod eviction.

## Background

In Kubernetes 1.29, an improvement has been introduced to enhance the taint-based pod eviction handling on nodes.
This blog discusses the changes made to node-lifecycle-controller
to separate its responsibilities and improve overall code maintainability.

## Summary of changes

node-lifecycle-controller previously combined two independent functions:

- Adding a pre-defined set of `NoExecute` taints to Node based on Node's condition.
- Performing pod eviction on `NoExecute` taint.

With the Kubernetes 1.29 release, the taint-based eviction implementation has been
moved out of node-lifecycle-controller into a separate and independent component called taint-eviction-controller.
This separation aims to disentangle code, enhance code maintainability,
and facilitate future extensions to either component.

As part of the change, additional metrics were introduced to help you monitor taint-based pod evictions:

- `pod_deletion_duration_seconds` measures the latency between the time when a taint effect
has been activated for the Pod and its deletion via taint-eviction-controller.
- `pod_deletions_total` reports the total number of Pods deleted by taint-eviction-controller since its start.

## How to use the new feature?

A new feature gate, `SeparateTaintEvictionController`, has been added. The feature is enabled by default as Beta in Kubernetes 1.29.
Please refer to the [feature gate document](/docs/reference/command-line-tools-reference/feature-gates/).
 

When this feature is enabled, users can optionally disable taint-based eviction by setting `--controllers=-taint-eviction-controller`
in kube-controller-manager.

To disable the new feature and use the old taint-manager within node-lifecylecycle-controller , users can set the feature gate `SeparateTaintEvictionController=false`.

## Use cases

This new feature will allow cluster administrators to extend and enhance the default
taint-eviction-controller and even replace the default taint-eviction-controller with a
custom implementation to meet different needs. An example is to better support
stateful workloads that use PersistentVolume on local disks.

## FAQ

**Does this feature change the existing behavior of taint-based pod evictions?**

No, the taint-based pod eviction behavior remains unchanged. If the feature gate
`SeparateTaintEvictionController` is turned off, the legacy node-lifecycle-controller with taint-manager will continue to be used.

**Will enabling/using this feature result in an increase in the time taken by any operations covered by existing SLIs/SLOs?**

No.

**Will enabling/using this feature result in an increase in resource usage (CPU, RAM, disk, IO, ...)?**

The increase in resource usage by running a separate `taint-eviction-controller` will be negligible.

## Learn more

For more details, refer to the [KEP](http://kep.k8s.io/3902).

## Acknowledgments

As with any Kubernetes feature, multiple community members have contributed, from
writing the KEP to implementing the new controller and reviewing the KEP and code. Special thanks to:

- Aldo Culquicondor (@alculquicondor)
- Maciej Szulik (@soltysh)
- Filip Křepinský (@atiratree)
- Han Kang (@logicalhan)
- Wei Huang (@Huang-Wei)
- Sergey Kanzhelevi (@SergeyKanzhelev)
- Ravi Gudimetla (@ravisantoshgudimetla)
- Deep Debroy (@ddebroy)
