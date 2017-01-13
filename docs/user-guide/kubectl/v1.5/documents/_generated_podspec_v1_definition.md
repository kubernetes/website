## PodSpec v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PodSpec

> Example yaml coming soon...



PodSpec is a description of a pod.

<aside class="notice">
Appears In  <a href="#pod-v1">Pod</a>  <a href="#podtemplatespec-v1">PodTemplateSpec</a> </aside>

Field        | Description
------------ | -----------
activeDeadlineSeconds <br /> *integer* | Optional duration in seconds the pod may be active on the node relative to StartTime before the system will actively try to mark it failed and kill associated containers. Value must be a positive integer.
containers <br /> *[Container](#container-v1) array* | List of containers belonging to the pod. Containers cannot currently be added or removed. There must be at least one container in a Pod. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/containers
dnsPolicy <br /> *string* | Set DNS policy for containers within the pod. One of 'ClusterFirst' or 'Default'. Defaults to "ClusterFirst".
hostIPC <br /> *boolean* | Use the host's ipc namespace. Optional: Default to false.
hostNetwork <br /> *boolean* | Host networking requested for this pod. Use the host's network namespace. If this option is set, the ports that will be used must be specified. Default to false.
hostPID <br /> *boolean* | Use the host's pid namespace. Optional: Default to false.
hostname <br /> *string* | Specifies the hostname of the Pod If not specified, the pod's hostname will be set to a system-defined value.
imagePullSecrets <br /> *[LocalObjectReference](#localobjectreference-v1) array* | ImagePullSecrets is an optional list of references to secrets in the same namespace to use for pulling any of the images used by this PodSpec. If specified, these secrets will be passed to individual puller implementations for them to use. For example, in the case of docker, only DockerConfig type secrets are honored. More info: http://kubernetes.io/docs/user-guide/images#specifying-imagepullsecrets-on-a-pod
nodeName <br /> *string* | NodeName is a request to schedule this pod onto a specific node. If it is non-empty, the scheduler simply schedules this pod onto that node, assuming that it fits resource requirements.
nodeSelector <br /> *object* | NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node's labels for the pod to be scheduled on that node. More info: http://kubernetes.io/docs/user-guide/node-selection/README
restartPolicy <br /> *string* | Restart policy for all containers within the pod. One of Always, OnFailure, Never. Default to Always. More info: http://kubernetes.io/docs/user-guide/pod-states#restartpolicy
securityContext <br /> *[PodSecurityContext](#podsecuritycontext-v1)* | SecurityContext holds pod-level security attributes and common container settings. Optional: Defaults to empty.  See type description for default values of each field.
serviceAccount <br /> *string* | DeprecatedServiceAccount is a depreciated alias for ServiceAccountName. Deprecated: Use serviceAccountName instead.
serviceAccountName <br /> *string* | ServiceAccountName is the name of the ServiceAccount to use to run this pod. More info: http://releases.k8s.io/HEAD/docs/design/service_accounts.md
subdomain <br /> *string* | If specified, the fully qualified Pod hostname will be "<hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>". If not specified, the pod will not have a domainname at all.
terminationGracePeriodSeconds <br /> *integer* | Optional duration in seconds the pod needs to terminate gracefully. May be decreased in delete request. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period will be used instead. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. Defaults to 30 seconds.
volumes <br /> *[Volume](#volume-v1) array* | List of volumes that can be mounted by containers belonging to the pod. More info: http://kubernetes.io/docs/user-guide/volumes

