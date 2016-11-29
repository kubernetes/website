## ReplicationControllerStatus v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ReplicationControllerStatus

> Example yaml coming soon...



ReplicationControllerStatus represents the current status of a replication controller.

<aside class="notice">
Appears In  <a href="#replicationcontroller-v1">ReplicationController</a> </aside>

Field        | Description
------------ | -----------
availableReplicas <br /> *integer* | The number of available replicas (ready for at least minReadySeconds) for this replication controller.
conditions <br /> *[ReplicationControllerCondition](#replicationcontrollercondition-v1) array* | Represents the latest available observations of a replication controller's current state.
fullyLabeledReplicas <br /> *integer* | The number of pods that have labels matching the labels of the pod template of the replication controller.
observedGeneration <br /> *integer* | ObservedGeneration reflects the generation of the most recently observed replication controller.
readyReplicas <br /> *integer* | The number of ready replicas for this replication controller.
replicas <br /> *integer* | Replicas is the most recently oberved number of replicas. More info: http://kubernetes.io/docs/user-guide/replication-controller#what-is-a-replication-controller

