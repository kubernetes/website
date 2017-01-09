## ReplicationControllerSpec v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ReplicationControllerSpec

> Example yaml coming soon...



ReplicationControllerSpec is the specification of a replication controller.

<aside class="notice">
Appears In  <a href="#replicationcontroller-v1">ReplicationController</a> </aside>

Field        | Description
------------ | -----------
minReadySeconds <br /> *integer* | Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)
replicas <br /> *integer* | Replicas is the number of desired replicas. This is a pointer to distinguish between explicit zero and unspecified. Defaults to 1. More info: http://kubernetes.io/docs/user-guide/replication-controller#what-is-a-replication-controller
selector <br /> *object* | Selector is a label query over pods that should match the Replicas count. If Selector is empty, it is defaulted to the labels present on the Pod template. Label keys and values that must match in order to be controlled by this replication controller, if empty defaulted to labels on Pod template. More info: http://kubernetes.io/docs/user-guide/labels#label-selectors
template <br /> *[PodTemplateSpec](#podtemplatespec-v1)* | Template is the object that describes the pod that will be created if insufficient replicas are detected. This takes precedence over a TemplateRef. More info: http://kubernetes.io/docs/user-guide/replication-controller#pod-template

