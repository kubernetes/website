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
automatically sets the value of `ownerReference` for objects created or adopted
by ReplicationController, ReplicaSet, StatefulSet, DaemonSet, and Deployment.

You can also specify relationships between owners and dependents by manually
setting the `ownerReference` field.

Here's a configuration file for a ReplicaSet that has three Pods:

{% include code.html language="yaml" file="my-repset.yaml" ghlink="/docs/concepts/workloads/controllers/my-repset.yaml" %}

If you create the ReplicaSet and then view the Pod metadata, you can see
OwnerReferences field:

```shell
kubectl create -f https://k8s.io/docs/concepts/abstractions/controllers/my-repset.yaml
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

## Controlling how the garbage collector deletes dependents

When you delete an object, you can specify whether the object's dependents are
also deleted automatically. Deleting dependents automatically is called *cascading
deletion*.  There are two modes of *cascading deletion*: *background* and *foreground*.

If you delete an object without deleting its dependents
automatically, the dependents are said to be *orphaned*.

### Background cascading deletion

In *background cascading deletion*, Kubernetes deletes the owner object
immediately and the garbage collector then deletes the dependents in
the background.

### Foreground cascading deletion

In *foreground cascading deletion*, the root object first
enters a "deletion in progress" state. In the "deletion in progress" state,
the following things are true:

 * The object is still visible via the REST API
 * The object's `deletionTimestamp` is set
 * The object's `metadata.finalizers` contains the value "foregroundDeletion".

Once the "deletion in progress" state is set, the garbage
collector deletes the object's dependents. Once the garbage collector has deleted all
"blocking" dependents (objects with `ownerReference.blockOwnerDeletion=true`), it delete
the owner object.

Note that in the "foregroundDeletion", only dependents with
`ownerReference.blockOwnerDeletion` block the deletion of the owner object.
Kubernetes version 1.7 will add an admission controller that controls user access to set
`blockOwnerDeletion` to true based on delete permissions on the owner object, so that
unauthorized dependents cannot delay deletion of an owner object.

If an object's `ownerReferences` field is set by a controller (such as Deployment or ReplicaSet),
blockOwnerDeletion is set automatically and you do not need to manually modify this field.

### Setting the cascading deletion policy

To control the cascading deletion policy, set the `deleteOptions.propagationPolicy`
field on your owner object. Possible values include "Orphan",
"Foreground", or "Background".

The default garbage collection policy for many controller resources is `orphan`,
including ReplicationController, ReplicaSet, StatefulSet, DaemonSet, and
Deployment. So unless you specify otherwise, dependent objects are orphaned.

Here's an example that deletes dependents in background:

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/extensions/v1beta1/namespaces/default/replicasets/my-repset \
-d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Background"}' \
-H "Content-Type: application/json"
```

Here's an example that deletes dependents in foreground:

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/extensions/v1beta1/namespaces/default/replicasets/my-repset \
-d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
-H "Content-Type: application/json"
```

Here's an example that orphans dependents:

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/extensions/v1beta1/namespaces/default/replicasets/my-repset \
-d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
-H "Content-Type: application/json"
```

kubectl also supports cascading deletion.
To delete dependents automatically using kubectl, set `--cascade` to true.  To
orphan dependents, set `--cascade` to false. The default value for `--cascade`
is true.

Here's an example that orphans the dependents of a ReplicaSet:

```shell
kubectl delete replicaset my-repset --cascade=false
```

### Addtional note on Deployments

When using cascading deletes with Deployments you *must* use `propagationPolicy: Foreground`
to delete not only the ReplicaSets created, but also their Pods. If this type of _propagationPolicy_
is not used, only the ReplicaSets will be deleted, and the Pods will be orphaned.
See [kubeadm/#149](https://github.com/kubernetes/kubeadm/issues/149#issuecomment-284766613) for more information.

## Known issues
* As of 1.7, garbage collection does not yet support
  [custom resources](/docs/concepts/api-extension/custom-resources/),
  such as those added through CustomResourceDefinition or aggregated API servers.

[Other known issues](https://github.com/kubernetes/kubernetes/issues/26120)

{% endcapture %}


{% capture whatsnext %}

[Design Doc 1](https://git.k8s.io/community/contributors/design-proposals/garbage-collection.md)

[Design Doc 2](https://git.k8s.io/community/contributors/design-proposals/synchronous-garbage-collection.md)

{% endcapture %}


{% include templates/concept.md %}
