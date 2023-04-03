---
layout: blog
title: "Kubernetes 1.27: More fine-grained pod topology spread policies reached beta"
date: 2023-04-11
slug: fine-grained-pod-topology-spread-features-beta
evergreen: true
---

**Authors:** [Alex Wang](https://github.com/denkensk)(Shopee), [Kante Yin](https://github.com/kerthcet)(DaoCloud), [Kensei Nakada](https://github.com/sanposhiho)(Mercari)

In Kubernetes v1.19, [Pod Topology Spread Constraints](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/) went to GA.
It is the feature to control how Pods are spread to each failure-domain (regions, zones, nodes etc).

As time passes, we've got further feedbacks from users,
and we're actively working on improving the Topology Spread via three KEPs from v1.25.
All of these features have reached beta in Kubernetes v1.27 and been enabled by default.

This blog post is going to introduce each feature and the usecase/issue behind them.

## KEP-3022: min domains in Pod Topology Spread

Pod Topology Spread has the `maxSkew` parameter to define the degree to which Pods may be unevenly distributed. 

But, there wasn't a way to control the number of domains over which we should spread. 
Some users want to force spreading Pods over a minimum number of domains, and if there aren't enough already present, make the cluster-autoscaler provision them.

Then, we introduced the `minDomains` parameter in the Pod Topology Spread. 
Via `minDomains` parameter, you can define the minimum number of domains. 

For example, there are 3 Nodes with the enough capacity, 
and newly created replicaset has the following `topologySpreadConstraints` in template.

```yaml
topologySpreadConstraints:
- maxSkew: 1
  minDomains: 5 # requires 5 Nodes at least.
  whenUnsatisfiable: DoNotSchedule # minDomains is valid only when DoNotSchedule is used.
  topologyKey: kubernetes.io/hostname 
  labelSelector:
    matchLabels:
        foo: bar
```

This case, 3 Pods will be scheduled to those 3 Nodes,
but other 2 Pods from this replicaset will be unschedulable until more Nodes join the cluster.

The cluster autoscaler provisions new Nodes based on these unschedulable Pods,
and as a result, the replicas are finally spread over 5 Nodes.

## Take taints/tolerations into consideration when calculating PodTopologySpread skew

Before this, when we deploy a pod with `podTopologySpread` configured, we'll take all
affinity nodes(satisfied with pod nodeAffinity and nodeSelector) into consideration
in filtering and scoring, but a node with pod untolerated taint may also be a candidate
because we didn't take care of node taints, which will lead to the pod pending.

To avoid this and make a more fine-gained decision in scheduling, we introduced two new fields in
`TopologySpreadConstraint` to define node inclusion policies including nodeAffinity and nodeTaint.

It mostly looks like:

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

**nodeAffinityPolicy** indicates how we'll treat Pod's nodeAffinity/nodeSelector in pod topology spreading.
If `Honor`, we'll filter out nodes not matching nodeAffinity/nodeSelector in calculation.
If `Ignore`, these nodes will be included instead.

For backwards-compatibility, nodeAffinityPolicy is default to `Honor`.

**nodeTaintsPolicy** indicates how we'll treat node taints in pod topology spreading.
If `Honor`, only tainted nodes for which the incoming pod has a toleration, will be included in calculation.
If `Ignore`, we'll not consider the node taints at all in calculation, so a node with pod untolerated taint
will also be included.

For backwards-compatibility, nodeTaintsPolicy is default to the `Ignore`.

The feature was introduced in v1.25 as alpha level. By default, it was disabled, so if you want to use this feature in v1.25,
you have to enable the feature gate `NodeInclusionPolicyInPodTopologySpread` actively. In the following v1.26, we graduated
this feature to beta and it was enabled by default since.

## KEP-3243: Respect PodTopologySpread after rolling upgrades

Pod Topology Spread uses the fields `topologyKey` or `labelSelector` to identify the group of pods over which
spreading will be calculated. But it applies to all pods in a Deployment irrespective of their owning
ReplicaSet. As a result, when a new revision is rolled out, spreading will apply across pods from both the
old and new ReplicaSets, and so by the time the new ReplicaSet is completely rolled out and the old one is
rolled back, the actual spreading we are left with may not match expectations because the deleted pods from
the older ReplicaSet will cause skewed distribution for the remaining pods.

In order to solve this problem and to make more accurate decisions in scheduling, we added a new named
`matchLabelKeys` to `topologySpreadConstraints`. `matchLabelKeys` is a list of pod label keys to select
the pods over which spreading will be calculated. The keys are used to lookup values from the pod labels,
those key-value labels are ANDed with `labelSelector` to select the group of existing pods over
which spreading will be calculated for the incoming pod.

With `matchLabelKeys`, you don't need to update the `pod.spec` between different revisions.
The controller/operator just needs to set different values to the same label key for different revisions.
The scheduler will assume the values automatically based on `matchLabelKeys`.
For example, if you are configuring a Deployment, you can use the label keyed with
[pod-template-hash](https://kubernetes.io//docs/concepts/workloads/controllers/deployment/#pod-template-hash-label),
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

These features are managed by the [SIG/Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling).

Please join us and share your feedback. We look forward to hearing from you!

## How can I learn more?

- [Pod Topology Spread Constraints | Kubernetes](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics)
- [KEP-3022: min domains in Pod Topology Spread](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3022-min-domains-in-pod-topology-spread)
- [KEP-3094: Take taints/tolerations into consideration when calculating PodTopologySpread skew](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3094-pod-topology-spread-considering-taints)
- [KEP-3243: Respect PodTopologySpread after rolling upgrades](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3243-respect-pod-topology-spread-after-rolling-upgrades)