---
layout: blog
title: "TBD" // TODO: have a cool title.
date: 2023-04-11
slug: topology-spread-new-features
evergreen: true
---

**Authors:** [Alex Wang](https://github.com/denkensk)(), [Kante Yin](https://github.com/kerthcet)(), [Kensei Nakada](https://github.com/sanposhiho)(Mercari)

In Kubernetes v1.19, [Pod Topology Spread Constraints](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/) went to GA. 
It is the feature to control how Pods are spread to each failure-domain (regions, zones, nodes etc).

As time passes, we've got further feedbacks from users,
and we're actively working on improving the Topology Spread via three KEPs from v1.25.
All of these features have reached beta in Kubernetes v1.27 and been enabled by default.

This blog post is going to introduce each feature and the usecase/issue behind them.

## KEP-3022: min domains in Pod Topology Spread

TODO(sanposhiho): write it

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