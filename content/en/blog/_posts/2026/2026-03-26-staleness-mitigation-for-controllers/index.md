---
layout: blog
title: "Kubernetes v1.36: Staleness Mitigation and Observability for Controllers"
date: 2026-xx-xx
slug: kubernetes-v1-36-staleness-mitigation-for-controllers
author: >
  [Michael Aspinwall](https://github.com/michaelasp) (Google)
---

Staleness in Kubernetes controllers is a problem that affects many controllers, and is something may affect controller behavior
in subtle ways. It is usually not until it is too late, when a controller in production has already taken incorrect action, that
staleness is found to be an issue due to some underlying assumption made by the controller author. Some issues caused by staleness
include controllers taking incorrect actions, controllers not taking action when they should, and controllers taking too long to
take action. We are excited to announce that Kubernetes v1.36 includes new features that help mitigate staleness in controllers
and provide better observability into controller behavior.

## What is staleness?

Staleness in controllers comes from an outdated view of the world inside of the controller cache. In order to provide a fast user
experience, controllers typically maintain a local cache of the state of the cluster. This cache is populated by watching the
Kubernetes API server for changes to objects that the controller cares about. When the controller needs to take action, it will
first check its cache to see if it has the latest information. If it does not, it will then update its cache by watching the API
server for changes to objects that the controller cares about. This process is known as "reconciliation".

However, there are some cases where the controller's cache may be outdated. For example, if the controller is restarted, it will
need to rebuild its cache by watching the API server for changes to objects that the controller cares about. During this time, the
controller's cache will be outdated, and it will not be able to take action. Additionally, if the API server is down, the controller's
cache will not be updated, and it will not be able to take action. These are just a few examples of cases where the controller's
cache may be outdated.

## Improvements in 1.36

Kubernetes v1.36 includes improvements in both client-go as well as implementations of highly contended controllers in
kube-controller-manager, using those client-go improvements.

### client-go improvements

In client-go, we have added the `AtomicFIFO` feature on top of the existing RealFIFO queue implementation. Doing so allows for
the queue to atomically handle operations that batch events such as the List portion of the ListWatch operation. This ensures
that the queue is always in a consistent state, even when events come out of order. Prior to this, events were added to the queue
in the order that they were received, which could lead to an inconsistent state in the cache that does not accurately reflect
the state of the cluster.

With this change, we can now ensure that the queue is always in a consistent state, even when events come out of order. To take
advantage of this, we can now introspect into the cache to determine the latest resource version that the controller cache has seen.
This is done with the newly added function `LastStoreSyncResourceVersion()` implemented on the `Store` interface [here](https://pkg.go.dev/k8s.io/client-go@v0.36.0/tools/cache#Store). This function is the basis for the staleness mitigation features in
kube-controller-manager.

### kube-controller-manager improvements

In kube-controller-manager, we have added the ability for 4 different controllers to use this new capability. The controllers are:

1. DaemonSet controller
2. StatefulSet controller
3. ReplicaSet controller
4. Job controller

These controllers all act on pods, which in most cases are under the highest amount of contention in a cluster. The changes are
on by default for these controllers, and can be disabled by setting the feature gates `StaleControllerConsistencyControllerName`
to `false` for the specific controller you wish to disable it for. For example, to disable the feature for the DaemonSet controller,
you would set the feature gate `StaleControllerConsistencyDaemonSetController` to `false`.

When the feature is enabled, the controller will first check the latest resource version of the cache before taking action. If the
latest resource version of the cache is lower than what the controller has written to the API server for the object it is trying to
reconcile, the controller will not take action. This is because the controller's cache is outdated, and it does not have the latest
information about the state of the cluster.

## Observability

In addition to the staleness mitigation features, we have also added observability features to kube-controller-manager. These
features are enabled by default when the staleness mitigation features are enabled.

### Metrics

We have added the following alpha metrics to kube-controller-manager:

`stale_sync_skips_total`: The number of times the controller has skipped a sync due to stale cache. This metric is exposed
for each controller that uses the staleness mitigation feature with the subsystem of the controller.

This metric is exposed by the kube-controller-manager metrics endpoint, and can be used to monitor the health of the controller.

Along with this metric, we have also added metrics to client-go that expose the latest resource version of every shared informer,
with the subsystem of the informer. This allows you to see the latest resource version of each informer, and use that to determine
if the controller's cache is stale, especially great for comparing against the resource version of the apiserver.

This metric is named `store_resource_version` and has the Group, Version, and Resource as labels.

## What's Next?

We are excited to continue working on this feature and hope to bring it to more controllers in the future. We are also interested
in hearing your feedback on this feature. Please let us know what you think in the comments below or by opening an issue on the
Kubernetes GitHub repository.

We are also working with [controller-runtime](https://github.com/kubernetes-sigs/controller-runtime/pull/3473) to enable this set of
semantics for all controllers built with controller-runtime. This will allow any controller built with controller-runtime to gain
the benefits of read your own writes, without having to implement the logic themselves.
