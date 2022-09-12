---
layout: blog
title: "sig-apps features graduating to stable in 1.25"
date: 2022-07-27
slug: "sig-apps features graduating to stable in 1.25"
---

**Authors:** Ravi Gudimetla (Apple), Filip Křepinský (Red Hat), Maciej Szulik (Red Hat)

This blog describes the two features namely `minReadySeconds` for StatefulSets and `maxSurge` for DaemonSets that sig-apps is happy to graduate to stable in 1.25.

Specifying `minReadySeconds` slows down a rollout of a StatefulSet, when using a `RollingUpdate` value in `.spec.updateStrategy` field, by waiting for each pod for a desired time.
This time can be used for initializing the pod (e.g. warming up the cache) or as a delay before acknowledging the pod.

`maxSurge` allows a DaemonSet workload to run multiple instances of the same pod on a node during a rollout when using a `RollingUpdate` value in `.spec.updateStrategy` field.
This helps to minimize the downtime of the DaemonSet for consumers.

These features are already available in a Deployment and other workloads. This graduation helps to align this functionality across the workloads.

## What problems do these features solve?

### MinReadySeconds for StatefulSets
`minReadySeconds` ensures that the StatefulSet workload is `Ready` for the given number of seconds before reporting the
pod as `Available`. The notion of being `Ready` and `Available` is quite important for workloads. For example, some workloads, like Prometheus with multiple instances of Alertmanager, should be considered `Available` only when the Alertmanager's state transfer is complete. `minReadySeconds` also helps when using loadbalancers with cloud providers. Since the pod should be `Ready` for the given number of seconds, it provides buffer time to prevent killing pods in rotation before new pods show up.


### MaxSurge for DaemonSets
Kubernetes system-level components like CNI, CSI are typically run as DaemonSets. These components can have impact on the availability of the workloads if those DaemonSets go down momentarily during the upgrades. The feature allows DaemonSet pods to temporarily increase their number, thereby ensuring zero-downtime for the DaemonSets.

Please note that the usage of `HostPort` in conjunction with `MaxSurge` in DaemonSets is not allowed as DaemonSet pods are tied to a single node and two active pods cannot share the same port on the same node.


## How does it work?

### MinReadySeconds for StatefulSets

The StatefulSet controller watches for the StatefulSet pods and counts how long a particular pod has been in the `Running` state, if this value is greater than or equal to the time specified in `.spec.minReadySeconds` field of the StatefulSet, the StatefulSet controller updates the `AvailableReplicas` field in the StatefulSet's status.


### MaxSurge for DaemonSets

The DaemonSet controller creates the additional pods (above the desired number resulting from DaemonSet spec) based on the value given in `.spec.strategy.rollingUpdate.maxSurge`. The additional pods would run on the same node where the old DaemonSet pod is running till the old pod gets killed.

- The default value is 0.
- The value cannot be `0` when `MaxUnavailable` is 0.
- The value can be specified either as an absolute number of pods, or a percentage (rounded up) of desired pods.

## How do I use it?

### MinReadySeconds for StatefulSets

Specify a value for `minReadySeconds` for any StatefulSet and check if pods are available or not by inspecting
`AvailableReplicas` field using:

`kubectl get statefulset/<name_of_the_statefulset> -o yaml`

Please note that the default value of `minReadySeconds` is 0.

### MaxSurge for DaemonSets

Specify a value for `.spec.updateStrategy.rollingUpdate.maxSurge` and set `.spec.updateStrategy.rollingUpdate.maxUnavailable` to `0`. 

Then observe a faster rollout and higher number of pods running at the same time in the next rollout.

```
kubectl rollout restart daemonset <name_of_the_daemonset>
kubectl get pods -w
```

## How can I learn more?

### MinReadySeconds for StatefulSets

- KEP: https://github.com/kubernetes/enhancements/issues/2599
- API Changes: https://github.com/kubernetes/kubernetes/pull/100842

### MaxSurge for DaemonSets

- KEP: https://github.com/kubernetes/enhancements/issues/1591
- API Changes: https://github.com/kubernetes/kubernetes/pull/96375

## How do I get involved?

Please reach out to us on [#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9) channel on slack, sig-apps mailing list-kubernetes-sig-apps@googlegroups.com