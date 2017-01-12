

-----------
# StatefulSet v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | StatefulSet







StatefulSet represents a set of pods with consistent identities. Identities are defined as:
 - Network: A single stable DNS and hostname.
 - Storage: As many VolumeClaims as requested.
The StatefulSet guarantees that a given network identity will always map to the same storage identity.

<aside class="notice">
Appears In <a href="#statefulsetlist-v1beta1">StatefulSetList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | 
spec <br /> *[StatefulSetSpec](#statefulsetspec-v1beta1)*  | Spec defines the desired identities of pods in this set.
status <br /> *[StatefulSetStatus](#statefulsetstatus-v1beta1)*  | Status is the current status of Pods in this StatefulSet. This data may be out of date by some window of time.


### StatefulSetSpec v1beta1

<aside class="notice">
Appears In <a href="#statefulset-v1beta1">StatefulSet</a> </aside>

Field        | Description
------------ | -----------
replicas <br /> *integer*  | Replicas is the desired number of replicas of the given Template. These are replicas in the sense that they are instantiations of the same Template, but individual replicas also have a consistent identity. If unspecified, defaults to 1.
selector <br /> *[LabelSelector](#labelselector-unversioned)*  | Selector is a label query over pods that should match the replica count. If empty, defaulted to labels on the pod template. More info: http://kubernetes.io/docs/user-guide/labels#label-selectors
serviceName <br /> *string*  | ServiceName is the name of the service that governs this StatefulSet. This service must exist before the StatefulSet, and is responsible for the network identity of the set. Pods get DNS/hostnames that follow the pattern: pod-specific-string.serviceName.default.svc.cluster.local where "pod-specific-string" is managed by the StatefulSet controller.
template <br /> *[PodTemplateSpec](#podtemplatespec-v1)*  | Template is the object that describes the pod that will be created if insufficient replicas are detected. Each pod stamped out by the StatefulSet will fulfill this Template, but have a unique identity from the rest of the StatefulSet.
volumeClaimTemplates <br /> *[PersistentVolumeClaim](#persistentvolumeclaim-v1) array*  | VolumeClaimTemplates is a list of claims that pods are allowed to reference. The StatefulSet controller is responsible for mapping network identities to claims in a way that maintains the identity of a pod. Every claim in this list must have at least one matching (by name) volumeMount in one container in the template. A claim in this list takes precedence over any volumes in the template, with the same name.

### StatefulSetStatus v1beta1

<aside class="notice">
Appears In <a href="#statefulset-v1beta1">StatefulSet</a> </aside>

Field        | Description
------------ | -----------
observedGeneration <br /> *integer*  | most recent generation observed by this autoscaler.
replicas <br /> *integer*  | Replicas is the number of actual replicas.

### StatefulSetList v1beta1



Field        | Description
------------ | -----------
items <br /> *[StatefulSet](#statefulset-v1beta1) array*  | 
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | 





