---
title: Garbage Collection
---

{% capture overview %}

When you delete a Kubernetes object, the garbage collector deletes all
of the objects' dependents. For example suppose you delete a ReplicaSet
that owns several Pods. When you delete the ReplicaSet, the garbage collector
deletes all Pods owned by the ReplicaSet.

**Note**: Garbage collection is a beta feature and is enabled by default in
Kubernetes version 1.4 and later.

{% endcapture %}


{% capture body %}

## Owners and dependents

Some Kubernetes objects are owners of other objects. For example, a ReplicaSet
is the owner of a set of Pods. The owned objects are called *dependents* of the
owner object. Every dependent object has a `metadata.ownerReferences` field that
points to the owning API object.

Sometimes, Kubernetes sets the value of `ownerReference` automatically. For
example, when you create a ReplicaSet, Kubernetes automatically sets the
`ownerReference` field of each Pod created for the ReplicaSet. You can also
specify relationships between owners and dependents by manually setting the
`ownerReference` field.

## Controlling whether the garbage collector deletes dependents

When you delete object, you can specify that its dependents
should be deleted asynchronously. In your deletion request, include
`deleteOptions.orphanDependents=false`. A 200 OK response from the API
server indicates the owner, but not necessarily the dependents, has been deleted.
Here's an example:

```shell
kubectl delete replicaset my-repset --deleteOptions.orphanDependents=false
```

If you specify `deleteOptions.orphanDependents=true`, or leave it blank,
then the garbage collector first resets the `ownerReferences` in the
dependents, and then delete the owner. In this case, the deletion of the owner
object is asynchronous. That is, the API server sends a 200 OK response before
the owner object gets deleted.

## Ongoing development

In Kubernetes version 1.5, synchronous garbage collection is under active
development. See the tracking
[issue](https://github.com/kubernetes/kubernetes/issues/29891) for more details.

{% endcapture %}


{% capture whatsnext %}

[Design Doc](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/garbage-collection.md)

[Known issues](https://github.com/kubernetes/kubernetes/issues/26120)

{% endcapture %}


{% include templates/concept.md %}

