## ReplicationController v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ReplicationController

> Example yaml coming soon...



ReplicationController represents the configuration of a replication controller.

<aside class="notice">
Appears In  <a href="#replicationcontrollerlist-v1">ReplicationControllerList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | If the Labels of a ReplicationController are empty, they are defaulted to be the same as the Pod(s) that the replication controller manages. Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[ReplicationControllerSpec](#replicationcontrollerspec-v1)* | Spec defines the specification of the desired behavior of the replication controller. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[ReplicationControllerStatus](#replicationcontrollerstatus-v1)* | Status is the most recently observed status of the replication controller. This data may be out of date by some window of time. Populated by the system. Read-only. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status

