---
layout: blog
title: 'Minimum Ready Seconds for StatefulSets'
date: 2021-08-27
slug: minreadyseconds-statefulsets
author: >
  Ravi Gudimetla (Red Hat),
  Maciej Szulik (Red Hat)
---

This blog describes the notion of Availability for `StatefulSet` workloads, and a new alpha feature in Kubernetes 1.22 which adds `minReadySeconds` configuration for `StatefulSets`.

## What problems does this solve?

Prior to Kubernetes 1.22 release, once a `StatefulSet` `Pod` is in the `Ready` state it is considered `Available` to receive traffic. For some of the `StatefulSet` workloads, it may not be the case. For example, a workload like Prometheus with multiple instances of Alertmanager, it should be considered `Available` only when Alertmanager's state transfer is complete, not when the `Pod` is in `Ready` state. Since `minReadySeconds` adds buffer, the state transfer may be complete before the `Pod` becomes `Available`. While this is not a fool proof way of identifying if the state transfer is complete or not, it gives a way to the end user to express their intention of waiting for sometime before the `Pod` is considered `Available` and it is ready to serve requests. 

Another case, where `minReadySeconds` helps is when using `LoadBalancer` `Services` with cloud providers. Since `minReadySeconds` adds latency after a `Pod` is `Ready`, it provides buffer time to prevent killing pods in rotation before new pods show up. Imagine a load balancer in unhappy path taking 10-15s to propagate. If you have 2 replicas then, you'd kill the second replica only after the first one is up but in reality, first replica cannot be seen because it is not yet ready to serve requests.

So, in general, the notion of `Availability` in `StatefulSets` is pretty useful and this feature helps in solving the above problems. This is a feature that already exists for `Deployments` and `DaemonSets` and we now have them for `StatefulSets` too to give users consistent workload experience.


## How does it work?

The statefulSet controller watches for both `StatefulSets` and the `Pods` associated with them. When the feature gate associated with this feature is enabled, the statefulSet controller identifies how long a particular `Pod` associated with a `StatefulSet` has been in the `Running` state.

If this value is greater than or equal to the time specified by the end user in `.spec.minReadySeconds` field, the statefulSet controller updates a field called `availableReplicas` in the `StatefulSet`'s status subresource to include this `Pod`. The `status.availableReplicas` in `StatefulSet`'s status is an integer field which tracks the number of pods that are `Available`.

## How do I use it?

You are required to prepare the following things in order to try out the feature:

   - Download and install a kubectl greater than v1.22.0 version
   - Switch on the feature gate with the command line flag `--feature-gates=StatefulSetMinReadySeconds=true` on `kube-apiserver` and `kube-controller-manager`

After successfully starting `kube-apiserver` and `kube-controller-manager`, you will see `AvailableReplicas` in the status and `minReadySeconds` of spec (with a default value of 0). 

Specify a value for `minReadySeconds` for any StatefulSet and you can check if `Pods` are available or not by checking `AvailableReplicas` field using:
`kubectl get statefulset/<name_of_the_statefulset> -o yaml`

## How can I learn more?

- Read the KEP: [minReadySeconds for StatefulSets](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/2599-minreadyseconds-for-statefulsets#readme)
- Read the documentation: [Minimum ready seconds](/docs/concepts/workloads/controllers/statefulset/#minimum-ready-seconds) for StatefulSet
- Review the [API definition](/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/) for StatefulSet

## How do I get involved?

Please reach out to us in the [#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9) channel on Slack (visit https://slack.k8s.io/ for an invitation if you need one), or on the SIG Apps mailing list: kubernetes-sig-apps@googlegroups.com

