---
layout: blog
title: "TBD" // TODO: have a cool title.
date: 2023-04-11
slug: topology-spread-new-features
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

## KEP-3094: Take taints/tolerations into consideration when calculating PodTopologySpread skew

TODO(kerthcet): write it

## KEP-3243: Respect PodTopologySpread after rolling upgrades

TODO(denkensk): write it

## Getting involved 

These features are managed by the [SIG/Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling). 

Please join us and share your feedback. We look forward to hearing from you!

## How can I learn more?

- [Pod Topology Spread Constraints | Kubernetes](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics)
- [KEP-3022: min domains in Pod Topology Spread](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3022-min-domains-in-pod-topology-spread)
- [KEP-3094: Take taints/tolerations into consideration when calculating PodTopologySpread skew](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3094-pod-topology-spread-considering-taints)
- [KEP-3243: Respect PodTopologySpread after rolling upgrades](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3243-respect-pod-topology-spread-after-rolling-upgrades)