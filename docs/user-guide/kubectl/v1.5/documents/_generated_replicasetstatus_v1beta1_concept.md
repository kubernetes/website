

-----------
# ReplicaSetStatus v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | ReplicaSetStatus







ReplicaSetStatus represents the current status of a ReplicaSet.

<aside class="notice">
Appears In <a href="#replicaset-v1beta1">ReplicaSet</a> </aside>

Field        | Description
------------ | -----------
availableReplicas <br /> *integer*  | The number of available replicas (ready for at least minReadySeconds) for this replica set.
conditions <br /> *[ReplicaSetCondition](#replicasetcondition-v1beta1) array*  | Represents the latest available observations of a replica set's current state.
fullyLabeledReplicas <br /> *integer*  | The number of pods that have labels matching the labels of the pod template of the replicaset.
observedGeneration <br /> *integer*  | ObservedGeneration reflects the generation of the most recently observed ReplicaSet.
readyReplicas <br /> *integer*  | The number of ready replicas for this replica set.
replicas <br /> *integer*  | Replicas is the most recently oberved number of replicas. More info: http://kubernetes.io/docs/user-guide/replication-controller#what-is-a-replication-controller






