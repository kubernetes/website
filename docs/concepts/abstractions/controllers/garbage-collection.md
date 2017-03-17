---
title: Garbage Collection
---

{% capture overview %}

The role of the Kubernetes garbage collector is to delete certain objects
that once had an owner, but no longer have an owner.

**Note**: Garbage collection is a beta feature and is enabled by default in
Kubernetes version 1.4 and later.

{% endcapture %}


{% capture body %}

## Owners and dependents

Some Kubernetes objects are owners of other objects. For example, a ReplicaSet
is the owner of a set of Pods. The owned objects are called *dependents* of the
owner object. Every dependent object has a `metadata.ownerReferences` field that
points to the owning object.

Sometimes, Kubernetes sets the value of `ownerReference` automatically. For
example, when you create a ReplicaSet, Kubernetes automatically sets the
`ownerReference` field of each Pod in the ReplicaSet. In 1.6, Kubernetes
automatically sets the value of `ownerReference` for objects created by
ReplicationController, Replicaset, StatefulSet, DaemonSet, and Deployment.

You can also specify relationships between owners and dependents by manually
setting the `ownerReference` field.

Here's a configuration file for a ReplicaSet that has three Pods:

{% include code.html language="yaml" file="my-repset.yaml" ghlink="/docs/concepts/abstractions/controllers/my-repset.yaml" %}

If you create the ReplicaSet and then view the Pod metadata, you can see
OwnerReferences field:

```shell
kubectl create -f http://k8s.io/docs/concepts/abstractions/controllers/my-repset.yaml
kubectl get pods --output=yaml
```

The output shows that the Pod owner is a ReplicaSet named my-repset:

```shell
apiVersion: v1
kind: Pod
metadata:
  ...
  ownerReferences:
  - apiVersion: extensions/v1beta1
    controller: true
    blockOwnerDeletion: true
    kind: ReplicaSet
    name: my-repset
    uid: d9607e19-f88f-11e6-a518-42010a800195
  ...
```

## Controlling whether and how the garbage collector deletes dependents

When you delete object, you can specify whether the object's dependents are
deleted automatically. If you delete an object without deleting its dependents
automatically, the dependents are said to be *orphaned*. Deleting dependents
automatically is called *cascading deletion*. Further, there are two modes of
*cascading deletion*: if the object is deleted immediately and the garbage
collector then deletes the dependents in the background, it is called
*background cascading deletion*. In contrast, in *foreground cascading
deletion*, the object first enters a "deletion in progress" state, where the
object is still visible via the REST API, its `deletionTimestamp` is set, and
its metadata.finalizers contains "foregroundDeletion". Then the garbage
collector deletes the dependents. Once the garbage collector has deleted all
dependents whose ownerReferences.blockOwnerDeletion=true, it will finally delete
the object.

To control whether delete dependent objects or delete them in
foreground/background, set the deleteOptions.propagationPolicy to "Orphan",
"Foregound", or "Background" respectively.

The default garbage collection policy for controller resources is `orphan`. So unless you specify
otherwise, dependent objects are orphaned.

Here's an example that deletes dependents in background:

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/extensions/v1beta1/namespaces/default/replicasets/my-repset -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Background"}' -H "Content-Type: application/json"
```

Here's an example that deletes dependents in foreground:

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/extensions/v1beta1/namespaces/default/replicasets/my-repset -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' -H "Content-Type: application/json"
```

Here's an example that orphans dependents:

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/extensions/v1beta1/namespaces/default/replicasets/my-repset -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' -H "Content-Type: application/json"
```

kubectl also supports cascading deletion, though implemented in a different way.
To delete dependents automatically using kubectl, set `--cascade` to true.  To
orphan dependents, set `--cascade` to false. The default value for `--cascade`
is true.

Here's an example that orphans the dependents of a ReplicaSet:

```shell
kubectl delete replicaset my-repset --cascade=false
```

{% endcapture %}


{% capture whatsnext %}

[Design Doc 1](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/garbage-collection.md)

[Design Doc 2](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/synchronous-garbage-collection.md)

[Known issues](https://github.com/kubernetes/kubernetes/issues/26120)

{% endcapture %}


{% include templates/concept.md %}
