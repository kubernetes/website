

-----------
# PodStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PodStatus







PodStatus represents information about the status of a pod. Status may trail the actual state of a system.

<aside class="notice">
Appears In <a href="#pod-v1">Pod</a> </aside>

Field        | Description
------------ | -----------
conditions <br /> *[PodCondition](#podcondition-v1) array*  | Current service state of pod. More info: http://kubernetes.io/docs/user-guide/pod-states#pod-conditions
containerStatuses <br /> *[ContainerStatus](#containerstatus-v1) array*  | The list has one entry per container in the manifest. Each entry is currently the output of `docker inspect`. More info: http://kubernetes.io/docs/user-guide/pod-states#container-statuses
hostIP <br /> *string*  | IP address of the host to which the pod is assigned. Empty if not yet scheduled.
message <br /> *string*  | A human readable message indicating details about why the pod is in this condition.
phase <br /> *string*  | Current condition of the pod. More info: http://kubernetes.io/docs/user-guide/pod-states#pod-phase
podIP <br /> *string*  | IP address allocated to the pod. Routable at least within the cluster. Empty if not yet allocated.
reason <br /> *string*  | A brief CamelCase message indicating details about why the pod is in this state. e.g. 'OutOfDisk'
startTime <br /> *[Time](#time-unversioned)*  | RFC 3339 date and time at which the object was acknowledged by the Kubelet. This is before the Kubelet pulled the container image(s) for the pod.






