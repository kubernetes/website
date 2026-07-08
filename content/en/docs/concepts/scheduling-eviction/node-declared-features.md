---
title: Node Declared Features
weight: 160
---

{{< feature-state feature_gate_name="NodeDeclaredFeatures" >}}

Kubernetes nodes use _declared features_ to report the availability of specific
features that are new or feature-gated. Control plane components
utilize this information to make better decisions. The kube-scheduler, via the
`NodeDeclaredFeatures` plugin, ensures pods are only placed on nodes that
explicitly support the features the pod requires. Additionally, the
`NodeDeclaredFeatureValidator` admission controller validates pod updates
against a node's declared features.

This mechanism helps manage version skew and improve cluster stability,
especially during cluster upgrades or in mixed-version environments where nodes
might not all have the same features enabled. This is intended for Kubernetes
feature developers introducing new node-level features and works in the
background; application developers deploying Pods do not need to interact with
this framework directly.

## How it Works

1.  **Kubelet Feature Reporting:** At startup, the kubelet on each node detects
    which managed Kubernetes features are currently enabled and reports them
    in the `.status.declaredFeatures` field of the Node. Only features
    under active development are included in this field.
2.  **Scheduler Filtering:** The default kube-scheduler uses the
    `NodeDeclaredFeatures` plugin. This plugin:
    * In the `PreFilter` stage, checks the `PodSpec` to infer the set of node
      features required by the pod.
    * In the `Filter` stage, checks if the features listed in the node's
      `.status.declaredFeatures` satisfy the requirements inferred for the Pod.
      Pods will not be scheduled on nodes lacking the required features.
    Custom schedulers can also utilize the
    `.status.declaredFeatures` field to enforce similar constraints.
3.  **Admission Control:** The `nodedeclaredfeaturevalidator` admission controller
    can reject Pods that require features not declared by the node they are
    bound to, preventing issues during pod updates.

## Enabling node declared features

To use Node Declared Features, the `NodeDeclaredFeatures`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/#NodeDeclaredFeatures)
must be enabled on the `kube-apiserver`, `kube-scheduler`, and `kubelet`
components.

## {{% heading "whatsnext" %}}

* Read the KEP for more details:
    [KEP-5328: Node Declared Features](https://github.com/kubernetes/enhancements/blob/6d3210f7dd5d547c8f7f6a33af6a09eb45193cd7/keps/sig-node/5328-node-declared-features/README.md)
* Read about the [`NodeDeclaredFeatureValidator` admission controller](/docs/reference/access-authn-authz/admission-controllers/#nodedeclaredfeaturevalidator).