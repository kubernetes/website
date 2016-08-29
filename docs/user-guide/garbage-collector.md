---
assignees:
- caesarxuchao
- mikedanese

---

* TOC
{:toc}

## WARNING: Garbage Collector is an alpha feature and is disabled by default. Use it at your own risk!

### What is garbage collector for

The garbage collector (GC) cascadingly deletes dependent API objects when the owner is deleted. One use case is if two objects have functional dependency, you can specify the dependency in their configuration file when creating them, and if one of them is deleted, the GC will delete the other one automatically. The other use case is if there is logical dependency among API objects, e.g., the pods created by a replicaset depending on the replicaset, Kubernetes will automatically set the dependency (this will be implemented in release 1.4) and the GC will delete the pods when the replicaset is deleted.

### How does the garbage collector work

In release 1.3, there is a new `ownerReferences` field in the `metadata` of every Kubernetes API objects. The GC monitors the cluster and checks the `metadata.ownerReferences` field of each object. If none of the owners present in `metadata.ownerReferences` exists in the cluster, the GC will request the API server to delete the object.

Currently a user needs to manually set the `metadata.ownerReferences`. In release 1.4, controllers will automatically set the field for the objects it controls. For example, when the replicaset controller creates or adopts pods, it will automatically add the replicaset to the `metadata.ownerReferences` fields of the pods.

### How to request the garbage collector to not delete dependents

When deleting an object, you can prevent the GC from deleting that object's dependents by specifying `deleteOptions.orphanDependents=true` in the deletion request. It prevents garbage collection by removing the object from its dependents' metadata.ownerReferences field.

### How to enable the garbage collector

The garbage collector is an alpha feature so it is disabled by default. To enable it, you need to start the kube-apiserver and kube-controller-manager with flag `--enable-garbage-collector`.

