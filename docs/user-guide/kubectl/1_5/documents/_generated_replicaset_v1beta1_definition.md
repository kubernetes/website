## ReplicaSet v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Extensions | v1beta1 | ReplicaSet

> Example yaml coming soon...



ReplicaSet represents the configuration of a ReplicaSet.

<aside class="notice">
Appears In  <a href="#replicasetlist-v1beta1">ReplicaSetList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | If the Labels of a ReplicaSet are empty, they are defaulted to be the same as the Pod(s) that the ReplicaSet manages. Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[ReplicaSetSpec](#replicasetspec-v1beta1)* | Spec defines the specification of the desired behavior of the ReplicaSet. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[ReplicaSetStatus](#replicasetstatus-v1beta1)* | Status is the most recently observed status of the ReplicaSet. This data may be out of date by some window of time. Populated by the system. Read-only. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status

