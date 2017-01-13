

-----------
# ReplicationController v1

>bdocs-tab:example ReplicationController Config to run 3 nginx instances.

```bdocs-tab:example_yaml

apiVersion: v1
kind: ReplicationController
metadata:
  # Unique key of the ReplicationController instance
  name: replicationcontroller-example
spec:
  # 3 Pods should exist at all times.
  replicas: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      # Run the nginx image
      - name: nginx
        image: nginx:1.10


```


Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ReplicationController

<aside class="warning">In many cases it is recommended to create a <a href="#deployment-v1beta1">Deployment</a> instead of a ReplicationController.</aside>





ReplicationController represents the configuration of a replication controller.

<aside class="notice">
Appears In <a href="#replicationcontrollerlist-v1">ReplicationControllerList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | If the Labels of a ReplicationController are empty, they are defaulted to be the same as the Pod(s) that the replication controller manages. Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[ReplicationControllerSpec](#replicationcontrollerspec-v1)*  | Spec defines the specification of the desired behavior of the replication controller. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[ReplicationControllerStatus](#replicationcontrollerstatus-v1)*  | Status is the most recently observed status of the replication controller. This data may be out of date by some window of time. Populated by the system. Read-only. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status


### ReplicationControllerSpec v1

<aside class="notice">
Appears In <a href="#replicationcontroller-v1">ReplicationController</a> </aside>

Field        | Description
------------ | -----------
minReadySeconds <br /> *integer*  | Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)
replicas <br /> *integer*  | Replicas is the number of desired replicas. This is a pointer to distinguish between explicit zero and unspecified. Defaults to 1. More info: http://kubernetes.io/docs/user-guide/replication-controller#what-is-a-replication-controller
selector <br /> *object*  | Selector is a label query over pods that should match the Replicas count. If Selector is empty, it is defaulted to the labels present on the Pod template. Label keys and values that must match in order to be controlled by this replication controller, if empty defaulted to labels on Pod template. More info: http://kubernetes.io/docs/user-guide/labels#label-selectors
template <br /> *[PodTemplateSpec](#podtemplatespec-v1)*  | Template is the object that describes the pod that will be created if insufficient replicas are detected. This takes precedence over a TemplateRef. More info: http://kubernetes.io/docs/user-guide/replication-controller#pod-template

### ReplicationControllerStatus v1

<aside class="notice">
Appears In <a href="#replicationcontroller-v1">ReplicationController</a> </aside>

Field        | Description
------------ | -----------
availableReplicas <br /> *integer*  | The number of available replicas (ready for at least minReadySeconds) for this replication controller.
conditions <br /> *[ReplicationControllerCondition](#replicationcontrollercondition-v1) array*  | Represents the latest available observations of a replication controller's current state.
fullyLabeledReplicas <br /> *integer*  | The number of pods that have labels matching the labels of the pod template of the replication controller.
observedGeneration <br /> *integer*  | ObservedGeneration reflects the generation of the most recently observed replication controller.
readyReplicas <br /> *integer*  | The number of ready replicas for this replication controller.
replicas <br /> *integer*  | Replicas is the most recently oberved number of replicas. More info: http://kubernetes.io/docs/user-guide/replication-controller#what-is-a-replication-controller

### ReplicationControllerList v1



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[ReplicationController](#replicationcontroller-v1) array*  | List of replication controllers. More info: http://kubernetes.io/docs/user-guide/replication-controller
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds





