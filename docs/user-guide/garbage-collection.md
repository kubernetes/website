---
assignees:
- caesarxuchao
title: Garbage Collection (Beta)
---

* TOC
{:toc}

## Garbage Collection

Note: the Garbage Collection is a beta feature and is enabled by default in Kubernetes version 1.4.

### What does Garbage Collector do

When you delete, for example, a ReplicaSet, it is often desirable for the server to automatically garbage collect all the Pods that the ReplicaSet creates. The Garbage Collector (GC) implements this. In general, when you delete an owner object, GC deletes that owner's dependent objects.

### How to establish an owner-dependent relationship between objects

Kubernetes 1.3 added a metadata.ownerReferences field to every Kubernetes API object. If an API object is a dependent of another object, ownerReference should point to the owning API object.

When you create a ReplicationController or a ReplicaSet in Kubernetes 1.4, the Kubernetes control plane automatically sets the ownerReference field in each created pod to point to the owning ReplicationController or ReplicaSet.

You can set up owner-dependent relationships among other objects by manually setting the ownerReference field on dependent objects.

### Controlling whether Garbage Collector deletes dependents

When deleting an object, you can request the GC to ***asynchronously*** delete its dependents by ***explicitly*** specifying `deleteOptions.orphanDependents=false` in the deletion request that you send to the API server. A 200 OK response from the API server indicates the owner is deleted.

In Kubernetes version 1.5, synchronous garbage collection is under active development. See the [tracking [issue](https://github.com/kubernetes/kubernetes/issues/29891) for more details.

If you specify `deleteOptions.orphanDependents=true`, or leave it blank, then the GC will first reset the `ownerReferences` in the dependents, then delete the owner. Note that the deletion of the owner object is asynchronous, that is, a 200 OK response will be sent by the API server before the owner object gets deleted.

### Other references

[Design Doc](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/garbage-collection.md)

[Known issues](https://github.com/kubernetes/kubernetes/issues/26120)
