---
title: Garbage Collection
redirect_from:
- "/docs/concepts/abstractions/controllers/garbage-collection/"
- "/docs/concepts/abstractions/controllers/garbage-collection.html"
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
`ownerReference` field of each Pod in the ReplicaSet. You can also specify
relationships between owners and dependents by manually setting the
`ownerReference` field.

Here's a configuration file for a ReplicaSet that has three Pods:

{% include code.html language="yaml" file="my-repset.yaml" ghlink="/docs/concepts/workloads/controllers/my-repset.yaml" %}

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
    kind: ReplicaSet
    name: my-repset
    uid: d9607e19-f88f-11e6-a518-42010a800195
  ...
```

## Controlling whether the garbage collector deletes dependents

When you delete object, you can specify whether the object's dependents
are deleted automatically. Deleting dependents automatically is called
*cascading deletion*. If you delete an object without deleting its
dependents automatically, the dependents are said to be *orphaned*.

To delete dependent objects automatically, set the `orphanDependents` query
parameter to false in your request to delete the owner object.

To orphan the dependents of an owner object, set the `orphanDependents` query
parameter to true in your request to delete the owner object.

The default value for `orphanDependents` is true. So unless you specify
otherwise, dependent objects are orphaned.

Here's an example that deletes dependents automatically:

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/extensions/v1beta1/namespaces/default/replicasets/my-repset?orphanDependents=false
```

To delete dependents automatically using kubectl, set `--cascade` to true.
To orphan dependents, set `--cascade` to false. The default value for
`--cascade` is true.

Here's an example that orphans the dependents of a ReplicaSet:

```shell
kubectl delete replicaset my-repset --cascade=false
```

## Ongoing development

In Kubernetes version 1.5, synchronous garbage collection is under active
development. See the tracking
[issue](https://github.com/kubernetes/kubernetes/issues/29891) for more details.

{% endcapture %}


{% capture whatsnext %}

[Design Doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/garbage-collection.md)

[Known issues](https://github.com/kubernetes/kubernetes/issues/26120)

{% endcapture %}


{% include templates/concept.md %}
