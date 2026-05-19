---
layout: blog
title: "Kubernetes v1.36: Staleness Mitigation and Observability for Controllers"
date: 2026-04-28T10:35:00-08:00
slug: kubernetes-v1-36-staleness-mitigation-for-controllers
author: >
  [Michael Aspinwall](https://github.com/michaelasp) (Google)
---

Staleness in Kubernetes controllers is a problem that affects many controllers, and is something may affect controller behavior
in subtle ways. It is usually not until it is too late, when a controller in production has already taken incorrect action, that
staleness is found to be an issue due to some underlying assumption made by the controller author. Some issues caused by staleness
include controllers taking incorrect actions, controllers not taking action when they should, and controllers taking too long to
take action. I am excited to announce that Kubernetes v1.36 includes new features that help mitigate staleness in controllers
and provide better observability into controller behavior.

## What is staleness?

Staleness in controllers comes from an outdated view of the world inside of the controller cache. In order to provide a fast user
experience, controllers typically maintain a local cache of the state of the cluster. This cache is populated by watching the
Kubernetes API server for changes to objects that the controller cares about. When the controller needs to take action, it will
first check its cache to see if it has the latest information. If it does not, it will then update its cache by watching the API
server for changes to objects that the controller cares about. This process is known as _reconciliation_.

However, there are some cases where the controller's cache may be outdated. For example, if the controller is restarted, it will
need to rebuild its cache by watching the API server for changes to objects that the controller cares about. During this time, the
controller's cache will be outdated, and it will not be able to take action. Additionally, if the API server is down, the controller's
cache will not be updated, and it will not be able to take action. These are just a few examples of cases where the controller's
cache may be outdated.

## Improvements in 1.36

Kubernetes v1.36 includes improvements in both client-go as well as implementations of highly contended controllers in
kube-controller-manager, using those client-go improvements. 

### client-go improvements

In client-go, the project added _atomic FIFO processing_ (feature gate
name `AtomicFIFO`), which is on top of the existing FIFO queue implementation. The new approach allows for
the queue to atomically handle operations that are recieved in batches, such as the initial set of objects from a 
_list_ operation that an informer uses to populate its cache. This ensures that the queue is always in a consistent state,
even when events come out of order. Prior to this, events were added to the queue
in the order that they were received, which could lead to an inconsistent state in the cache that does not accurately reflect
the state of the cluster.

With this change, you can now ensure that the queue is always in a consistent state, even when events come out of order. To take
advantage of this, clients using client-go can now introspect into the cache to determine the latest resource version that the
controller cache has seen. This is done with the newly added function `LastStoreSyncResourceVersion()` implemented on the `Store`
interface [here](https://pkg.go.dev/k8s.io/client-go@v0.36.0/tools/cache#Store). This function is the basis for the staleness mitigation 
features in kube-controller-manager.

### kube-controller-manager improvements

In kube-controller-manager, the v1.36 release has added the ability for 4 different controllers to use this new capability. The controllers are:

1. DaemonSet controller
2. StatefulSet controller
3. ReplicaSet controller
4. Job controller

These controllers all act on pods, which in most cases are under the highest amount of contention in a cluster. The changes are
on by default for these controllers, and can be disabled by setting the feature gates `StaleControllerConsistency<API type>`
to `false` for the specific controller you wish to disable it for. For example, to disable the feature for the DaemonSet controller,
you would set the feature gate `StaleControllerConsistencyDaemonSet` to `false`.

When the relevant feature gate is enabled, the controller will first check the latest 
[resource version](/docs/reference/using-api/api-concepts/#resource-versions) of the cache before taking action. If the
latest resource version of the cache is lower than what the controller has written to the API server for the object it is trying to
reconcile, the controller will not take action. This is because the controller's cache is outdated, and it does not have the latest
information about the state of the cluster.

### Use for informer authors

Informer authors using client-go can also immediately take advantage of these improvements. See an example of how to use this feature 
in the [ReplicaSet informer](https://github.com/kubernetes/kubernetes/pull/137212). This PR shows how to use the new feature to check 
if the informer's cache is stale before taking action. The client-go library provides a `ConsistencyStore` data structure that queries the store
and compares the latest resource version of the cache with the written resource version of the object. 

The ReplicaSet controller tracks both the ReplicaSet's resource version and the resource version of the pods that the ReplicaSet 
manages. For a specific ReplicaSet, it tracks the latest written resource version of the pods that the ReplicaSet owns as well as
any writes to the ReplicaSet itself. If the latest resource version of the cache is lower than what the controller has
written to the API server for the object it is trying to reconcile, the controller will not take action. This is because the
controller's cache is outdated, and it does not have the latest information about the state of the cluster.

An informer author can use the `ConsistencyStore` to track the latest resource version of the objects that the informer cares about.
It provides 3 main functions:

```go
type ConsistencyStore interface {
	// WroteAt records that the given object was written at the given resource version.
	WroteAt(owningObj runtime.Object, uid types.UID, groupResource schema.GroupResource, resourceVersion string)

	// EnsureReady returns true if the cache is up to date for the given object.
	// It is used prior to reconciliation to decide whether to reconcile or not.
	EnsureReady(namespacedName types.NamespacedName) bool

	// Clear removes the given object from the consistency store.
	// It is used when an object is deleted.
	Clear(namespacedName types.NamespacedName, uid types.UID)
}
```

1. `WroteAt`: This function is called by the controller when it writes to the API server for an object. It is used to record the 
latest resource version of the object that the controller has written to the API server. The `owningObj` is the object that the 
controller is reconciling, and the `uid` is the UID of that object. The resource version and GroupResource are the resource version 
and GroupResource of the object that the controller has written to the API server. The object is not explicitly tracked, since the 
controller only cares about waiting to catch up to the latest resource version of the written object.
2. `EnsureReady`: This function is called by the controller to ensure that the cache is up to date for the object. It is used prior 
to reconciliation to decide whether to reconcile or not. It returns true if the cache is up to date for the object, and false 
otherwise. It will use the information provided by `WroteAt` to determine if the cache is up to date.
3. `Clear`: This function is called by the controller when an object is deleted. It is used to remove the object from the consistency 
store. This is mostly used for cleanup when an object is deleted to prevent the consistency store from growing indefinitely.

The UID is used to distinguish between different objects that have the same name, such as when an object is deleted and then 
recreated. It is not needed for EnsureReady because the consistency store is only concerned with catching up to the latest resource 
version of the object, not the specific object. It is primarily used to ensure that the controller doesn't delete the entry for 
an object when it is recreated with a new UID.

With these 3 functions, an informer author can implement staleness mitigation in their controller.

## Observability

In addition to the staleness mitigation features, the Kubernetes project has also added related instrumentation to kube-controller-manager
in 1.36. These metrics are also enabled by default, and are controlled using the same set of feature gates.

### Metrics

The following [alpha metrics](/docs/reference/instrumentation/metrics/#list-of-alpha-kubernetes-metrics) have been added to kube-controller-manager in 1.36:

`stale_sync_skips_total`: The number of times the controller has skipped a sync due to stale cache. This metric is exposed
for each controller that uses the staleness mitigation feature with the subsystem of the controller.

This metric is exposed by the kube-controller-manager metrics endpoint, and can be used to monitor the health of the controller.

Along with this metric, client-go also emits metrics that expose the latest resource version of every shared informer
with the subsystem of the informer. This allows you to see the latest resource version of each informer, and use that to
determine if the controller's cache is stale, especially great for comparing against the resource version of the API server.

This metric is named `store_resource_version` and has the Group, Version, and Resource as labels.

## What's next?

Kubernetes SIG API Machinery is excited to continue working on this feature and hope to bring it to more controllers in the future. 
We are also interested in hearing your feedback on this feature. Please let us know what you think in the comments
below or by opening an [issue](https://github.com/kubernetes/kubernetes/issues) on the Kubernetes GitHub repository.

We are also working with [controller-runtime](https://github.com/kubernetes-sigs/controller-runtime/pull/3473) to enable this set of
semantics for all controllers built with controller-runtime. This will allow any controller built with controller-runtime to gain
the benefits of read your own writes, without having to implement the logic themselves.
