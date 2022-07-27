---
layout: blog
title: "sig-apps features graduating to stable in 1.25"
date: 2022-07-27
slug: "sig-apps features graduating to stable in 1.25"
---

**Authors:** Ravi Gudimetla (Apple), Filip Krepensky (Red Hat), Maciej Szulik (Red Hat)

This blog describes the two features namely `minReadySeconds for StatefulSets` and `maxSurge for Daemonsets` that sig-apps is happy to graduate to stable in 1.25

## What problems does these features solve?

### MinReadySeconds for StatefulSets
`minReadySeconds` ensures that the statefulset workload is `Ready` for the given number of seconds before calling the
pod `Available`. The notion of being `Ready` and `Available` is quiet important for workloads. For example, some workloads like Prometheus with multiple instances of Alertmanager should be considered `Available` only when the Alertmanager's state transfer is complete. `minReadySeconds` also helps when using loadbalancers with cloud providers. Since the pod should be `Ready` for the given number of seconds, it provides buffer time to prevent killing pods in rotation before new pods show up.


### MaxSurge for DaemonSets
`MaxSurge` allows a daemonset workload to run multiple instances of the same pod on a node during rollout to minimize the downtime of the daemonset to other consumers. Kubernetes system-level components like CNI, CSI are typically run as daemonsets. These components can have impact on the availablity of the workloads if those daemonsets go down momentarily during the upgrades. The feature allows daemonset pods to surge, there by ensuring zero-downtime for the daemonsets.

Please note that the usage of `HostPort` in conjunction with `MaxSurge` in daemonsets is not allowed as daemonset pods are tied to a single node and two active pods cannot share the same port on the same node.


## How does it work?

### MinReadySeconds for StatefulSets

The statefulSet controller watches for the statefulset pods and counts how long a particular pod has been in the `Running` state, if this value is greater than or equal to the time specified in `.spec.minReadySeconds` field of the statefulset, the statefulset controller updates the `AvailableReplicas` field in the statefulset's status.


### MaxSurge for DaemonSets

The `DaemonSet` controller creates the additional pods based on the value given in `.spec.strategy.rollingUpdate.maxSurge`. The additional pods would run on the same node where the old daemonset pod is running till the old pod gets killed. This value cannot be `0` when `MaxUnavailable` is 0. The default value is 0.

## How do I use it?

### MinReadySeconds for StatefulSets

You are required to download and install a kubectl greater than v1.22.0 version

Specify a value for `minReadySeconds` for any StatefulSet and you check if pods are available or not by checking
`AvailableReplicas` field using:

`kubectl get statefulset/<name_of_the_statefulset> -o yaml

Please note that the default value of `minReadySeconds` is 0

### MaxSurge for DaemonSets

Specify the update strategy to `RollingUpdate` and set `.spec.updateStrategy.rollingUpdate.maxSurge`


## How can I learn more?

### MinReadySeconds for StatefulSets
KEP: https://github.com/kubernetes/enhancements/issues/2599
API Changes: https://github.com/kubernetes/kubernetes/pull/100842

### MaxSurge for DaemonSets
KEP: https://github.com/kubernetes/enhancements/issues/1591
API Changes: https://github.com/kubernetes/kubernetes/pull/96375

## How do I get involved?

Please reach out to us on [#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9) channel on slack, sig-apps mailing list-kubernetes-sig-apps@googlegroups.com