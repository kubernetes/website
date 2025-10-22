---
title: Node Declared Features
weight: 160
---

{{< feature-state feature_gate_name="NodeDeclaredFeatures" >}}

The Node Declared Features framework provides a standardized way for nodes to
declare the availability of specific, feature-gated Kubernetes features. This
allows the control plane, primarily the kube-scheduler, to make scheduling
decisions that account for version skew, ensuring pods are only placed on nodes
that support the features they require. This scheduler plugin is enabled when
the `NodeDeclaredFeatures` feature gate is set.

## Why Node Declared Features?

During cluster upgrades or in mixed-version environments, nodes might not have
the same set of features enabled as the control plane. This can lead to pods
being scheduled on nodes that cannot actually run them (for example, because
the kubelet on that node doesn't support a feature the pod's configuration
requires). Node Declared Features aims to prevent such scenarios. This
framework is specifically designed for managing the lifecycle of **new
Kubernetes features** and addressing version skew.

## How it Works

1.  **Kubelet Feature Reporting:** At startup, the kubelet on each node
    determines the set of managed Kubernetes features it supports and has
    enabled (based on its configuration and feature gates).
2.  **Node API Update:** The kubelet reports these features to the API server
    by populating the `declaredFeatures` field within the `NodeStatus` section of the
    Node API object.
3.  **Scheduler Filtering:** The kube-scheduler uses the `NodeDeclaredFeatures`
    plugin. This plugin:
    * In the `PreFilter` stage, checks the `PodSpec` to infer the set of node
      features required by the pod.
    * In the `Filter` stage, checks if the features listed in the node's
      `status.declaredFeatures` satisfy the requirements inferred for the Pod. Pods
      will not be scheduled on nodes lacking the required features.

## Enabling Node Declared Features

To use this feature, the `NodeDeclaredFeatures`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
must be enabled on the `kube-apiserver`, `kube-scheduler`, and `kubelet`
components.

## {{% heading "whatsnext" %}}

* Read the KEP for more details:
    [KEP-5328: Node Declared Features](https://github.com/kubernetes/enhancements/blob/6d3210f7dd5d547c8f7f6a33af6a09eb45193cd7/keps/sig-node/5328-node-declared-features/README.md)