---
title: Node Declared Features
content_type: concept
weight: 160
---

<!-- overview -->

{{< feature-state feature_gate_name="NodeDeclaredFeatures" >}}

Kubernetes nodes use _declared features_ to report the availability of specific
features that are new or feature-gated. Control plane components
use this information to make better decisions. The kube-scheduler, via the
`NodeDeclaredFeatures` plugin, ensures Pods are only placed on nodes that
explicitly support the features the Pod requires. Additionally, the
`NodeDeclaredFeatureValidator` admission controller validates Pod updates
against a node's declared features.

This mechanism helps manage version skew and improve cluster stability,
especially during cluster upgrades or in mixed-version environments where nodes
might not all have the same features enabled. This is intended for Kubernetes
feature developers introducing new node-level features and works in the
background; application developers deploying Pods do not need to interact with
this framework directly.

<!-- body -->

## How it works

A declared feature is a string that a node lists in the
`.status.declaredFeatures` field of the Node object. Each declarable feature
identifies a node-level feature that is still graduating through the
Kubernetes feature stages.

1.  **Kubelet Feature Reporting:** At startup, the kubelet on each node detects
    which managed Kubernetes features are currently enabled and reports them
    in the `.status.declaredFeatures` field of the Node. Only features
    under active development are included in this field.
2.  **Scheduler Filtering:** The default kube-scheduler uses the
    `NodeDeclaredFeatures` plugin. This plugin:
    * In the `PreFilter` stage, checks the `PodSpec` to infer the set of node
      features required by the Pod.
    * In the `Filter` stage, checks if the features listed in the node's
      `.status.declaredFeatures` satisfy the requirements inferred for the Pod.
      Pods are not scheduled onto nodes that lack the required features.

    Custom schedulers can also use the
    `.status.declaredFeatures` field to enforce similar constraints.
3.  **Admission Control:** The
    [`NodeDeclaredFeatureValidator`](/docs/reference/access-authn-authz/admission-controllers/#nodedeclaredfeaturevalidator)
    admission controller can reject Pods that require features not declared by
    the node they are bound to, preventing issues during Pod updates.
4.  **Kubelet Admission:** As a final safeguard, the kubelet re-checks a Pod's
    feature requirements against the features available on its node before
    running the Pod, and rejects the Pod if a required feature is missing.
5.  **Post-GA Cleanup:** Once a feature is available on all nodes of a
    cluster (after the feature graduates to GA and the supported version skew
    between the control plane and nodes has passed), nodes stop declaring the
    feature. This is achieved by setting a maximum version (`MaxVersion`) for
    each declared feature: kubelets newer than this version stop listing
    the feature in `.status.declaredFeatures`, and the scheduler and the
    admission controller treat the feature as universally available and stop
    checking for it. The feature is eventually removed from the set of declared
    features as part of the standard post-GA feature cleanup.

## Example of a declared feature

The `RestartAllContainersOnContainerExits` declared feature indicates that a
node supports
[in-place restarts of all containers in a Pod](/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers).
When the
[`RestartAllContainersOnContainerExits`](/docs/reference/command-line-tools-reference/feature-gates/#RestartAllContainersOnContainerExits)
feature gate is enabled for the kubelet, the kubelet declares this feature in
the status of its Node:

```yaml
apiVersion: v1
kind: Node
metadata:
  name: example-node
status:
  declaredFeatures:
  - RestartAllContainersOnContainerExits
```

A Pod requires this feature if one of its containers specifies a restart rule
with the `RestartAllContainers` action:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  containers:
  - name: main
    image: registry.k8s.io/busybox:1.27.2
    restartPolicy: Never     # Container restart policy must be specified if rules are specified
    restartPolicyRules:      # Restart the whole Pod in place on exit code 42
    - action: RestartAllContainers
      exitCodes:
        operator: In
        values: [42]
```

When scheduling this Pod, the kube-scheduler only considers nodes that list
`RestartAllContainersOnContainerExits` in their `.status.declaredFeatures`.
In a cluster where only some nodes have that feature gate enabled (for
example, part way through a cluster upgrade), this prevents the Pod from being
assigned to a node whose kubelet would ignore the restart rule.

Declared features also gate updates to running Pods. For example, the
`InPlacePodVerticalScalingInitContainers` declared feature indicates that a
node supports resizing the resources of init containers in place. 
If there is an attempt to resize an init container in a running Pod, the
`NodeDeclaredFeatureValidator` admission controller rejects the update unless
the node running that Pod declares this feature.

## {{% heading "whatsnext" %}}

* Read about the [`NodeDeclaredFeatureValidator` admission controller](/docs/reference/access-authn-authz/admission-controllers/#nodedeclaredfeaturevalidator).
* Read the KEP for more details:
    [KEP-5328: Node Declared Features](https://github.com/kubernetes/enhancements/blob/6d3210f7dd5d547c8f7f6a33af6a09eb45193cd7/keps/sig-node/5328-node-declared-features/README.md)
