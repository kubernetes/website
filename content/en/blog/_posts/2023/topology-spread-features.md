---
layout: blog
title: "Kubernetes 1.27: More fine-grained pod topology spread policies reached beta"
date: 2023-04-17
slug: fine-grained-pod-topology-spread-features-beta
author: >
   [Alex Wang](https://github.com/denkensk) (Shopee),
   [Kante Yin](https://github.com/kerthcet) (DaoCloud),
   [Kensei Nakada](https://github.com/sanposhiho) (Mercari)
---

In Kubernetes v1.19, [Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
went to general availability (GA).

As time passed, we - SIG Scheduling - received feedback from users,
and, as a result, we're actively working on improving the Topology Spread feature via three KEPs.
All of these features have reached beta in Kubernetes v1.27 and are enabled by default.

This blog post introduces each feature and the use case behind each of them.

## KEP-3022: min domains in Pod Topology Spread

Pod Topology Spread has the `maxSkew` parameter to define the degree to which Pods may be unevenly distributed.

But, there wasn't a way to control the number of domains over which we should spread.
Some users want to force spreading Pods over a minimum number of domains, and if there aren't enough already present, make the cluster-autoscaler provision them.

Kubernetes v1.24 introduced the `minDomains` parameter for pod topology spread constraints,
as an alpha feature.
Via `minDomains` parameter, you can define the minimum number of domains.

For example, assume there are 3 Nodes with the enough capacity,
and a newly created ReplicaSet has the following `topologySpreadConstraints` in its Pod template.

```yaml
...
topologySpreadConstraints:
- maxSkew: 1
  minDomains: 5 # requires 5 Nodes at least (because each Node has a unique hostname).
  whenUnsatisfiable: DoNotSchedule # minDomains is valid only when DoNotSchedule is used.
  topologyKey: kubernetes.io/hostname
  labelSelector:
    matchLabels:
        foo: bar
```

In this case, 3 Pods will be scheduled to those 3 Nodes,
but other 2 Pods from this replicaset will be unschedulable until more Nodes join the cluster.

You can imagine that the cluster autoscaler provisions new Nodes based on these unschedulable Pods,
and as a result, the replicas are finally spread over 5 Nodes.

## KEP-3094: Take taints/tolerations into consideration when calculating podTopologySpread skew

Before this enhancement, when you deploy a pod with `podTopologySpread` configured, kube-scheduler would
take the Nodes that satisfy the Pod's nodeAffinity and nodeSelector into consideration
in filtering and scoring, but would not care about whether the node taints are tolerated by the incoming pod or not.
This may lead to a node with untolerated taint as the only candidate for spreading, and as a result,
the pod will stuck in Pending if it doesn't tolerate the taint.

To allow more fine-gained decisions about which Nodes to account for when calculating spreading skew,
Kubernetes 1.25 introduced two new fields within `topologySpreadConstraints` to define node inclusion policies:
`nodeAffinityPolicy` and `nodeTaintPolicy`.

A manifest that applies these policies looks like the following:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  # Configure a topology spread constraint
  topologySpreadConstraints:
    - maxSkew: <integer>
      # ...
      nodeAffinityPolicy: [Honor|Ignore]
      nodeTaintsPolicy: [Honor|Ignore]
  # other Pod fields go here
```

The `nodeAffinityPolicy` field indicates how Kubernetes treats a Pod's `nodeAffinity` or `nodeSelector` for
pod topology spreading.
If `Honor`, kube-scheduler filters out nodes not matching `nodeAffinity`/`nodeSelector` in the calculation of
spreading skew.
If `Ignore`, all nodes will be included, regardless of whether they match the Pod's `nodeAffinity`/`nodeSelector`
or not.

For backwards compatibility, `nodeAffinityPolicy` defaults to `Honor`.

The `nodeTaintsPolicy` field defines how Kubernetes considers node taints for pod topology spreading.
If `Honor`, only tainted nodes for which the incoming pod has a toleration, will be included in the calculation of spreading skew.
If `Ignore`, kube-scheduler will not consider the node taints at all in the calculation of spreading skew, so a node with
pod untolerated taint will also be included.

For backwards compatibility, `nodeTaintsPolicy` defaults to `Ignore`.

The feature was introduced in v1.25 as alpha. By default, it was disabled, so if you want to use this feature in v1.25,
you had to explictly enable the feature gate `NodeInclusionPolicyInPodTopologySpread`. In the following v1.26
release, that associated feature graduated to beta and is enabled by default.

## KEP-3243: Respect Pod topology spread after rolling upgrades

Pod Topology Spread uses the field `labelSelector` to identify the group of pods over which
spreading will be calculated. When using topology spreading with Deployments, it is common
practice to use the `labelSelector` of the Deployment as the `labelSelector` in the topology
spread constraints. However, this implies that all pods of a Deployment are part of the spreading
calculation, regardless of whether they belong to different revisions. As a result, when a new revision
is rolled out, spreading will apply across pods from both the old and new ReplicaSets, and so by the
time the new ReplicaSet is completely rolled out and the old one is rolled back, the actual spreading
we are left with may not match expectations because the deleted pods from the older ReplicaSet will cause
skewed distribution for the remaining pods. To avoid this problem, in the past users needed to add a
revision label to Deployment and update it manually at each rolling upgrade (both the label on the
pod template and the `labelSelector` in the `topologySpreadConstraints`).

To solve this problem with a simpler API, Kubernetes v1.25 introduced a new field named
`matchLabelKeys` to `topologySpreadConstraints`. `matchLabelKeys` is a list of pod label keys to select
the pods over which spreading will be calculated. The keys are used to lookup values from the labels of
the Pod being scheduled, those key-value labels are ANDed with `labelSelector` to select the group of
existing pods over which spreading will be calculated for the incoming pod.

With `matchLabelKeys`, you don't need to update the `pod.spec` between different revisions.
The controller or operator managing rollouts just needs to set different values to the same label key for different revisions.
The scheduler will assume the values automatically based on `matchLabelKeys`.
For example, if you are configuring a Deployment, you can use the label keyed with
[pod-template-hash](/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label),
which is added automatically by the Deployment controller, to distinguish between different
revisions in a single Deployment.

```yaml
topologySpreadConstraints:
    - maxSkew: 1
      topologyKey: kubernetes.io/hostname
      whenUnsatisfiable: DoNotSchedule
      labelSelector:
        matchLabels:
          app: foo
      matchLabelKeys:
        - pod-template-hash
```

## Getting involved

These features are managed by Kubernetes [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling).

Please join us and share your feedback. We look forward to hearing from you!

## How can I learn more?

- [Pod Topology Spread Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/) in the Kubernetes documentation
- [KEP-3022: min domains in Pod Topology Spread](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3022-min-domains-in-pod-topology-spread)
- [KEP-3094: Take taints/tolerations into consideration when calculating PodTopologySpread skew](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3094-pod-topology-spread-considering-taints)
- [KEP-3243: Respect PodTopologySpread after rolling upgrades](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3243-respect-pod-topology-spread-after-rolling-upgrades)