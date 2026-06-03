---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Pod"
content_type: "api_reference"
description: "Pod is a collection of containers that can run on a host. This resource is created by clients and scheduled onto hosts."
title: "Pod"
weight: 100
auto_generated: true
---

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`


## Pod {#Pod}

Pod is a collection of containers that can run on a host. This resource is created by clients and scheduled onto hosts.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</td>
    </tr>
    <tr>
      <td><code>spec</code><br/><em><a href="{{< ref "#PodSpec" >}}">PodSpec</a></em></td>
      <td>Specification of the desired behavior of the pod. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#PodStatus" >}}">PodStatus</a></em></td>
      <td>Most recently observed status of the pod. This data may not be up to date. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status</td>
    </tr>
  </tbody>
</table>


## PodSpec {#PodSpec}

PodSpec is a description of a pod.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>activeDeadlineSeconds</code><br/><em>integer</em></td>
      <td>Optional duration in seconds the pod may be active on the node relative to StartTime before the system will actively try to mark it failed and kill associated containers. Value must be a positive integer.</td>
    </tr>
    <tr>
      <td><code>affinity</code><br/><em><a href="{{< ref "#Affinity" >}}">Affinity</a></em></td>
      <td>If specified, the pod's scheduling constraints</td>
    </tr>
    <tr>
      <td><code>automountServiceAccountToken</code><br/><em>boolean</em></td>
      <td>AutomountServiceAccountToken indicates whether a service account token should be automatically mounted.</td>
    </tr>
    <tr>
      <td><code>containers</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#Container" >}}">Container array</a></em><br/><em>patch strategy: merge on key <code>name</code></em></td>
      <td>List of containers belonging to the pod. Containers cannot currently be added or removed. There must be at least one container in a Pod. Cannot be updated.</td>
    </tr>
    <tr>
      <td><code>dnsConfig</code><br/><em><a href="{{< ref "#PodDNSConfig" >}}">PodDNSConfig</a></em></td>
      <td>Specifies the DNS parameters of a pod. Parameters specified here will be merged to the generated DNS configuration based on DNSPolicy.</td>
    </tr>
    <tr>
      <td><code>dnsPolicy</code><br/><em>string</em></td>
      <td>Set DNS policy for the pod. Defaults to "ClusterFirst". Valid values are 'ClusterFirstWithHostNet', 'ClusterFirst', 'Default' or 'None'. DNS parameters given in DNSConfig will be merged with the policy selected with DNSPolicy. To have DNS options set along with hostNetwork, you have to specify DNS policy explicitly to 'ClusterFirstWithHostNet'.<br/><br/>Possible enum values:<br/> - `"ClusterFirst"` indicates that the pod should use cluster DNS first unless hostNetwork is true, if it is available, then fall back on the default (as determined by kubelet) DNS settings.<br/> - `"ClusterFirstWithHostNet"` indicates that the pod should use cluster DNS first, if it is available, then fall back on the default (as determined by kubelet) DNS settings.<br/> - `"Default"` indicates that the pod should use the default (as determined by kubelet) DNS settings.<br/> - `"None"` indicates that the pod should use empty DNS settings. DNS parameters such as nameservers and search paths should be defined via DNSConfig.</td>
    </tr>
    <tr>
      <td><code>enableServiceLinks</code><br/><em>boolean</em></td>
      <td>EnableServiceLinks indicates whether information about services should be injected into pod's environment variables, matching the syntax of Docker links. Optional: Defaults to true.</td>
    </tr>
    <tr>
      <td><code>ephemeralContainers</code><br/><em><a href="{{< ref "#EphemeralContainer" >}}">EphemeralContainer array</a></em><br/><em>patch strategy: merge on key <code>name</code></em></td>
      <td>List of ephemeral containers run in this pod. Ephemeral containers may be run in an existing pod to perform user-initiated actions such as debugging. This list cannot be specified when creating a pod, and it cannot be modified by updating the pod spec. In order to add an ephemeral container to an existing pod, use the pod's ephemeralcontainers subresource.</td>
    </tr>
    <tr>
      <td><code>hostAliases</code><br/><em><a href="{{< ref "#HostAlias" >}}">HostAlias array</a></em><br/><em>patch strategy: merge on key <code>ip</code></em></td>
      <td>HostAliases is an optional list of hosts and IPs that will be injected into the pod's hosts file if specified.</td>
    </tr>
    <tr>
      <td><code>hostIPC</code><br/><em>boolean</em></td>
      <td>Use the host's ipc namespace. Optional: Default to false.</td>
    </tr>
    <tr>
      <td><code>hostNetwork</code><br/><em>boolean</em></td>
      <td>Host networking requested for this pod. Use the host's network namespace. When using HostNetwork you should specify ports so the scheduler is aware. When `hostNetwork` is true, specified `hostPort` fields in port definitions must match `containerPort`, and unspecified `hostPort` fields in port definitions are defaulted to match `containerPort`. Default to false.</td>
    </tr>
    <tr>
      <td><code>hostPID</code><br/><em>boolean</em></td>
      <td>Use the host's pid namespace. Optional: Default to false.</td>
    </tr>
    <tr>
      <td><code>hostUsers</code><br/><em>boolean</em></td>
      <td>Use the host's user namespace. Optional: Default to true. If set to true or not present, the pod will be run in the host user namespace, useful for when the pod needs a feature only available to the host user namespace, such as loading a kernel module with CAP_SYS_MODULE. When set to false, a new userns is created for the pod. Setting false is useful for mitigating container breakout vulnerabilities even allowing users to run their containers as root without actually having root privileges on the host.</td>
    </tr>
    <tr>
      <td><code>hostname</code><br/><em>string</em></td>
      <td>Specifies the hostname of the Pod If not specified, the pod's hostname will be set to a system-defined value.</td>
    </tr>
    <tr>
      <td><code>hostnameOverride</code><br/><em>string</em></td>
      <td>HostnameOverride specifies an explicit override for the pod's hostname as perceived by the pod. This field only specifies the pod's hostname and does not affect its DNS records. When this field is set to a non-empty string: - It takes precedence over the values set in `hostname` and `subdomain`. - The Pod's hostname will be set to this value.<br/> - `setHostnameAsFQDN` must be nil or set to false.<br/> - `hostNetwork` must be set to false.  This field must be a valid DNS subdomain as defined in RFC 1123 and contain at most 64 characters. Requires the HostnameOverride feature gate to be enabled.</td>
    </tr>
    <tr>
      <td><code>imagePullSecrets</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference array</a></em><br/><em>patch strategy: merge on key <code>name</code></em></td>
      <td>ImagePullSecrets is an optional list of references to secrets in the same namespace to use for pulling any of the images used by this PodSpec. If specified, these secrets will be passed to individual puller implementations for them to use. More info: https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod</td>
    </tr>
    <tr>
      <td><code>initContainers</code><br/><em><a href="{{< ref "#Container" >}}">Container array</a></em><br/><em>patch strategy: merge on key <code>name</code></em></td>
      <td>List of initialization containers belonging to the pod. Init containers are executed in order prior to containers being started. If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy. The name for an init container or normal container must be unique among all containers. Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes. The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit for each resource type, and then using the max of that value or the sum of the normal containers. Limits are applied to init containers in a similar fashion. Init containers cannot currently be added or removed. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/init-containers/</td>
    </tr>
    <tr>
      <td><code>nodeName</code><br/><em>string</em></td>
      <td>NodeName indicates in which node this pod is scheduled. If empty, this pod is a candidate for scheduling by the scheduler defined in schedulerName. Once this field is set, the kubelet for this node becomes responsible for the lifecycle of this pod. This field should not be used to express a desire for the pod to be scheduled on a specific node. https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodename</td>
    </tr>
    <tr>
      <td><code>nodeSelector</code><br/><em>object</em></td>
      <td>NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node's labels for the pod to be scheduled on that node. More info: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</td>
    </tr>
    <tr>
      <td><code>os</code><br/><em><a href="{{< ref "#PodOS" >}}">PodOS</a></em></td>
      <td>Specifies the OS of the containers in the pod. Some pod and container fields are restricted if this is set.  If the OS field is set to linux, the following fields must be unset: -securityContext.windowsOptions  If the OS field is set to windows, following fields must be unset: - spec.hostPID - spec.hostIPC - spec.hostUsers - spec.resources - spec.securityContext.appArmorProfile - spec.securityContext.seLinuxOptions - spec.securityContext.seccompProfile - spec.securityContext.fsGroup - spec.securityContext.fsGroupChangePolicy - spec.securityContext.sysctls - spec.shareProcessNamespace - spec.securityContext.runAsUser - spec.securityContext.runAsGroup - spec.securityContext.supplementalGroups - spec.securityContext.supplementalGroupsPolicy - spec.containers[*].securityContext.appArmorProfile - spec.containers[*].securityContext.seLinuxOptions - spec.containers[*].securityContext.seccompProfile - spec.containers[*].securityContext.capabilities - spec.containers[*].securityContext.readOnlyRootFilesystem - spec.containers[*].securityContext.privileged - spec.containers[*].securityContext.allowPrivilegeEscalation - spec.containers[*].securityContext.procMount - spec.containers[*].securityContext.runAsUser - spec.containers[*].securityContext.runAsGroup</td>
    </tr>
    <tr>
      <td><code>overhead</code><br/><em>object</em></td>
      <td>Overhead represents the resource overhead associated with running a pod for a given RuntimeClass. This field will be autopopulated at admission time by the RuntimeClass admission controller. If the RuntimeClass admission controller is enabled, overhead must not be set in Pod create requests. The RuntimeClass admission controller will reject Pod create requests which have the overhead already set. If RuntimeClass is configured and selected in the PodSpec, Overhead will be set to the value defined in the corresponding RuntimeClass, otherwise it will remain unset and treated as zero. More info: https://git.k8s.io/enhancements/keps/sig-node/688-pod-overhead/README.md</td>
    </tr>
    <tr>
      <td><code>preemptionPolicy</code><br/><em>string</em></td>
      <td>PreemptionPolicy is the Policy for preempting pods with lower priority. One of Never, PreemptLowerPriority. Defaults to PreemptLowerPriority if unset.<br/><br/>Possible enum values:<br/> - `"Never"` means that pod never preempts other pods with lower priority.<br/> - `"PreemptLowerPriority"` means that pod can preempt other pods with lower priority.</td>
    </tr>
    <tr>
      <td><code>priority</code><br/><em>integer</em></td>
      <td>The priority value. Various system components use this field to find the priority of the pod. When Priority Admission Controller is enabled, it prevents users from setting this field. The admission controller populates this field from PriorityClassName. The higher the value, the higher the priority.</td>
    </tr>
    <tr>
      <td><code>priorityClassName</code><br/><em>string</em></td>
      <td>If specified, indicates the pod's priority. "system-node-critical" and "system-cluster-critical" are two special keywords which indicate the highest priorities with the former being the highest priority. Any other name must be defined by creating a PriorityClass object with that name. If not specified, the pod priority will be default or zero if there is no default.</td>
    </tr>
    <tr>
      <td><code>readinessGates</code><br/><em><a href="{{< ref "#PodReadinessGate" >}}">PodReadinessGate array</a></em></td>
      <td>If specified, all readiness gates will be evaluated for pod readiness. A pod is ready when all its containers are ready AND all conditions specified in the readiness gates have status equal to "True" More info: https://git.k8s.io/enhancements/keps/sig-network/580-pod-readiness-gates</td>
    </tr>
    <tr>
      <td><code>resourceClaims</code><br/><em><a href="{{< ref "#PodResourceClaim" >}}">PodResourceClaim array</a></em><br/><em>patch strategy: merge,retainKeys on key <code>name</code></em></td>
      <td>ResourceClaims defines which ResourceClaims must be allocated and reserved before the Pod is allowed to start. The resources will be made available to those containers which consume them by name.  This is a stable field but requires that the DynamicResourceAllocation feature gate is enabled.  This field is immutable.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em><a href="{{< ref "#ResourceRequirements" >}}">ResourceRequirements</a></em></td>
      <td>Resources is the total amount of CPU and Memory resources required by all containers in the pod. It supports specifying Requests and Limits for "cpu", "memory" and "hugepages-" resource names only. ResourceClaims are not supported.  This field enables fine-grained control over resource allocation for the entire pod, allowing resource sharing among containers in a pod.  This is an alpha field and requires enabling the PodLevelResources feature gate.</td>
    </tr>
    <tr>
      <td><code>restartPolicy</code><br/><em>string</em></td>
      <td>Restart policy for all containers within the pod. One of Always, OnFailure, Never. In some contexts, only a subset of those values may be permitted. Default to Always. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy<br/><br/>Possible enum values:<br/> - `"Always"`<br/> - `"Never"`<br/> - `"OnFailure"`</td>
    </tr>
    <tr>
      <td><code>runtimeClassName</code><br/><em>string</em></td>
      <td>RuntimeClassName refers to a RuntimeClass object in the node.k8s.io group, which should be used to run this pod.  If no RuntimeClass resource matches the named class, the pod will not be run. If unset or empty, the "legacy" RuntimeClass will be used, which is an implicit class with an empty definition that uses the default runtime handler. More info: https://git.k8s.io/enhancements/keps/sig-node/585-runtime-class</td>
    </tr>
    <tr>
      <td><code>schedulerName</code><br/><em>string</em></td>
      <td>If specified, the pod will be dispatched by specified scheduler. If not specified, the pod will be dispatched by default scheduler.</td>
    </tr>
    <tr>
      <td><code>schedulingGates</code><br/><em><a href="{{< ref "#PodSchedulingGate" >}}">PodSchedulingGate array</a></em><br/><em>patch strategy: merge on key <code>name</code></em></td>
      <td>SchedulingGates is an opaque list of values that if specified will block scheduling the pod. If schedulingGates is not empty, the pod will stay in the SchedulingGated state and the scheduler will not attempt to schedule the pod.  SchedulingGates can only be set at pod creation time, and be removed only afterwards.</td>
    </tr>
    <tr>
      <td><code>schedulingGroup</code><br/><em><a href="{{< ref "#PodSchedulingGroup" >}}">PodSchedulingGroup</a></em></td>
      <td>SchedulingGroup provides a reference to the immediate scheduling runtime grouping object that this Pod belongs to. This field is used by the scheduler to identify the group and apply the correct group scheduling policies. The association with a group also impacts other lifecycle aspects of a Pod that are relevant in a wider context of scheduling like preemption, resource attachment, etc. If not specified, the Pod is treated as a single unit in all of these aspects. The group object referenced by this field may not exist at the time the Pod is created. This field is immutable, but a group object with the same name may be recreated with different policies. Doing this during pod scheduling may result in the placement not conforming to the expected policies.</td>
    </tr>
    <tr>
      <td><code>securityContext</code><br/><em><a href="{{< ref "#PodSecurityContext" >}}">PodSecurityContext</a></em></td>
      <td>SecurityContext holds pod-level security attributes and common container settings. Optional: Defaults to empty.  See type description for default values of each field.</td>
    </tr>
    <tr>
      <td><code>serviceAccount</code><br/><em>string</em></td>
      <td>DeprecatedServiceAccount is a deprecated alias for ServiceAccountName. Deprecated: Use serviceAccountName instead.</td>
    </tr>
    <tr>
      <td><code>serviceAccountName</code><br/><em>string</em></td>
      <td>ServiceAccountName is the name of the ServiceAccount to use to run this pod. More info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/</td>
    </tr>
    <tr>
      <td><code>setHostnameAsFQDN</code><br/><em>boolean</em></td>
      <td>If true the pod's hostname will be configured as the pod's FQDN, rather than the leaf name (the default). In Linux containers, this means setting the FQDN in the hostname field of the kernel (the nodename field of struct utsname). In Windows containers, this means setting the registry value of hostname for the registry key HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters to FQDN. If a pod does not have FQDN, this has no effect. Default to false.</td>
    </tr>
    <tr>
      <td><code>shareProcessNamespace</code><br/><em>boolean</em></td>
      <td>Share a single process namespace between all of the containers in a pod. When this is set containers will be able to view and signal processes from other containers in the same pod, and the first process in each container will not be assigned PID 1. HostPID and ShareProcessNamespace cannot both be set. Optional: Default to false.</td>
    </tr>
    <tr>
      <td><code>subdomain</code><br/><em>string</em></td>
      <td>If specified, the fully qualified Pod hostname will be "\<hostname>.\<subdomain>.\<pod namespace>.svc.\<cluster domain>". If not specified, the pod will not have a domainname at all.</td>
    </tr>
    <tr>
      <td><code>terminationGracePeriodSeconds</code><br/><em>integer</em></td>
      <td>Optional duration in seconds the pod needs to terminate gracefully. May be decreased in delete request. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). If this value is nil, the default grace period will be used instead. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. Defaults to 30 seconds.</td>
    </tr>
    <tr>
      <td><code>tolerations</code><br/><em><a href="{{< ref "../definitions/toleration-v1#Toleration" >}}">Toleration array</a></em></td>
      <td>If specified, the pod's tolerations.</td>
    </tr>
    <tr>
      <td><code>topologySpreadConstraints</code><br/><em><a href="{{< ref "#TopologySpreadConstraint" >}}">TopologySpreadConstraint array</a></em><br/><em>patch strategy: merge on key <code>topologyKey</code></em></td>
      <td>TopologySpreadConstraints describes how a group of pods ought to spread across topology domains. Scheduler will schedule pods in a way which abides by the constraints. All topologySpreadConstraints are ANDed.</td>
    </tr>
    <tr>
      <td><code>volumes</code><br/><em><a href="{{< ref "#Volume" >}}">Volume array</a></em><br/><em>patch strategy: merge,retainKeys on key <code>name</code></em></td>
      <td>List of volumes that can be mounted by containers belonging to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes</td>
    </tr>
  </tbody>
</table>


## PodStatus {#PodStatus}

PodStatus represents information about the status of a pod. Status may trail the actual state of a system, especially if the node that hosts the pod cannot contact the control plane.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allocatedResources</code><br/><em>object</em></td>
      <td>AllocatedResources is the total requests allocated for this pod by the node. If pod-level requests are not set, this will be the total requests aggregated across containers in the pod.</td>
    </tr>
    <tr>
      <td><code>conditions</code><br/><em><a href="{{< ref "#PodCondition" >}}">PodCondition array</a></em><br/><em>patch strategy: merge on key <code>type</code></em></td>
      <td>Current service state of pod. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions</td>
    </tr>
    <tr>
      <td><code>containerStatuses</code><br/><em>ContainerStatus array</em></td>
      <td>Statuses of containers in this pod. Each container in the pod should have at most one status in this list, and all statuses should be for containers in the pod. However this is not enforced. If a status for a non-existent container is present in the list, or the list has duplicate names, the behavior of various Kubernetes components is not defined and those statuses might be ignored. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status</td>
    </tr>
    <tr>
      <td><code>ephemeralContainerStatuses</code><br/><em>ContainerStatus array</em></td>
      <td>Statuses for any ephemeral containers that have run in this pod. Each ephemeral container in the pod should have at most one status in this list, and all statuses should be for containers in the pod. However this is not enforced. If a status for a non-existent container is present in the list, or the list has duplicate names, the behavior of various Kubernetes components is not defined and those statuses might be ignored. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status</td>
    </tr>
    <tr>
      <td><code>extendedResourceClaimStatus</code><br/><em><a href="{{< ref "#PodExtendedResourceClaimStatus" >}}">PodExtendedResourceClaimStatus</a></em></td>
      <td>Status of extended resource claim backed by DRA.</td>
    </tr>
    <tr>
      <td><code>hostIP</code><br/><em>string</em></td>
      <td>hostIP holds the IP address of the host to which the pod is assigned. Empty if the pod has not started yet. A pod can be assigned to a node that has a problem in kubelet which in turns mean that HostIP will not be updated even if there is a node is assigned to pod</td>
    </tr>
    <tr>
      <td><code>hostIPs</code><br/><em><a href="{{< ref "#HostIP" >}}">HostIP array</a></em><br/><em>patch strategy: merge on key <code>ip</code></em></td>
      <td>hostIPs holds the IP addresses allocated to the host. If this field is specified, the first entry must match the hostIP field. This list is empty if the pod has not started yet. A pod can be assigned to a node that has a problem in kubelet which in turns means that HostIPs will not be updated even if there is a node is assigned to this pod.</td>
    </tr>
    <tr>
      <td><code>initContainerStatuses</code><br/><em>ContainerStatus array</em></td>
      <td>Statuses of init containers in this pod. The most recent successful non-restartable init container will have ready = true, the most recently started container will have startTime set. Each init container in the pod should have at most one status in this list, and all statuses should be for containers in the pod. However this is not enforced. If a status for a non-existent container is present in the list, or the list has duplicate names, the behavior of various Kubernetes components is not defined and those statuses might be ignored. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-and-container-status</td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>A human readable message indicating details about why the pod is in this condition.</td>
    </tr>
    <tr>
      <td><code>nodeAllocatableResourceClaimStatuses</code><br/><em><a href="{{< ref "#NodeAllocatableResourceClaimStatus" >}}">NodeAllocatableResourceClaimStatus array</a></em></td>
      <td>NodeAllocatableResourceClaimStatuses contains the status of node-allocatable resources that were allocated for this pod through DRA claims. This includes resources currently reported in v1.Node `status.allocatable` that are not extended resources (see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#extended-resources). Examples include "cpu", "memory", "ephemeral-storage", and hugepages.</td>
    </tr>
    <tr>
      <td><code>nominatedNodeName</code><br/><em>string</em></td>
      <td>nominatedNodeName is set only when this pod preempts other pods on the node, but it cannot be scheduled right away as preemption victims receive their graceful termination periods. This field does not guarantee that the pod will be scheduled on this node. Scheduler may decide to place the pod elsewhere if other nodes become available sooner. Scheduler may also decide to give the resources on this node to a higher priority pod that is created after preemption. As a result, this field may be different than PodSpec.nodeName when the pod is scheduled.</td>
    </tr>
    <tr>
      <td><code>observedGeneration</code><br/><em>integer</em></td>
      <td>If set, this represents the .metadata.generation that the pod status was set based upon. The PodObservedGenerationTracking feature gate must be enabled to use this field.</td>
    </tr>
    <tr>
      <td><code>phase</code><br/><em>string</em></td>
      <td>The phase of a Pod is a simple, high-level summary of where the Pod is in its lifecycle. The conditions array, the reason and message fields, and the individual container status arrays contain more detail about the pod's status. There are five possible phase values:  Pending: The pod has been accepted by the Kubernetes system, but one or more of the container images has not been created. This includes time before being scheduled as well as time spent downloading images over the network, which could take a while. Running: The pod has been bound to a node, and all of the containers have been created. At least one container is still running, or is in the process of starting or restarting. Succeeded: All containers in the pod have terminated in success, and will not be restarted. Failed: All containers in the pod have terminated, and at least one container has terminated in failure. The container either exited with non-zero status or was terminated by the system. Unknown: For some reason the state of the pod could not be obtained, typically due to an error in communicating with the host of the pod.  More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-phase<br/><br/>Possible enum values:<br/> - `"Failed"` means that all containers in the pod have terminated, and at least one container has terminated in a failure (exited with a non-zero exit code or was stopped by the system).<br/> - `"Pending"` means the pod has been accepted by the system, but one or more of the containers has not been started. This includes time before being bound to a node, as well as time spent pulling images onto the host.<br/> - `"Running"` means the pod has been bound to a node and all of the containers have been started. At least one container is still running or is in the process of being restarted.<br/> - `"Succeeded"` means that all containers in the pod have voluntarily terminated with a container exit code of 0, and the system is not going to restart any of these containers.<br/> - `"Unknown"` means that for some reason the state of the pod could not be obtained, typically due to an error in communicating with the host of the pod. Deprecated: It isn't being set since 2015 (74da3b14b0c0f658b3bb8d2def5094686d0e9095)</td>
    </tr>
    <tr>
      <td><code>podIP</code><br/><em>string</em></td>
      <td>podIP address allocated to the pod. Routable at least within the cluster. Empty if not yet allocated.</td>
    </tr>
    <tr>
      <td><code>podIPs</code><br/><em><a href="{{< ref "#PodIP" >}}">PodIP array</a></em><br/><em>patch strategy: merge on key <code>ip</code></em></td>
      <td>podIPs holds the IP addresses allocated to the pod. If this field is specified, the 0th entry must match the podIP field. Pods may be allocated at most 1 value for each of IPv4 and IPv6. This list is empty if no IPs have been allocated yet.</td>
    </tr>
    <tr>
      <td><code>qosClass</code><br/><em>string</em></td>
      <td>The Quality of Service (QOS) classification assigned to the pod based on resource requirements See PodQOSClass type for available QOS classes More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#quality-of-service-classes<br/><br/>Possible enum values:<br/> - `"BestEffort"` is the BestEffort qos class.<br/> - `"Burstable"` is the Burstable qos class.<br/> - `"Guaranteed"` is the Guaranteed qos class.</td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>A brief CamelCase message indicating details about why the pod is in this state. e.g. 'Evicted'</td>
    </tr>
    <tr>
      <td><code>resize</code><br/><em>string</em></td>
      <td>Status of resources resize desired for pod's containers. It is empty if no resources resize is pending. Any changes to container resources will automatically set this to "Proposed" Deprecated: Resize status is moved to two pod conditions PodResizePending and PodResizeInProgress. PodResizePending will track states where the spec has been resized, but the Kubelet has not yet allocated the resources. PodResizeInProgress will track in-progress resizes, and should be present whenever allocated resources != acknowledged resources.</td>
    </tr>
    <tr>
      <td><code>resourceClaimStatuses</code><br/><em>PodResourceClaimStatus array</em><br/><em>patch strategy: merge,retainKeys on key <code>name</code></em></td>
      <td>Status of resource claims.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em><a href="{{< ref "#ResourceRequirements" >}}">ResourceRequirements</a></em></td>
      <td>Resources represents the compute resource requests and limits that have been applied at the pod level if pod-level requests or limits are set in PodSpec.Resources</td>
    </tr>
    <tr>
      <td><code>startTime</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>RFC 3339 date and time at which the object was acknowledged by the Kubelet. This is before the Kubelet pulled the container image(s) for the pod.</td>
    </tr>
  </tbody>
</table>


## PodList {#PodList}

PodList is a list of Pods.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</td>
    </tr>
    <tr>
      <td><code>items</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "pod-v1#Pod" >}}">Pod array</a></em></td>
      <td>List of pods. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/list-meta-v1-meta#ListMeta" >}}">ListMeta</a></em></td>
      <td>Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</td>
    </tr>
  </tbody>
</table>


## Affinity {#Affinity}

Affinity is a group of affinity scheduling rules.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>nodeAffinity</code><br/><em><a href="{{< ref "#NodeAffinity" >}}">NodeAffinity</a></em></td>
      <td>Describes node affinity scheduling rules for the pod.</td>
    </tr>
    <tr>
      <td><code>podAffinity</code><br/><em><a href="{{< ref "#PodAffinity" >}}">PodAffinity</a></em></td>
      <td>Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)).</td>
    </tr>
    <tr>
      <td><code>podAntiAffinity</code><br/><em><a href="{{< ref "#PodAntiAffinity" >}}">PodAntiAffinity</a></em></td>
      <td>Describes pod anti-affinity scheduling rules (e.g. avoid putting this pod in the same node, zone, etc. as some other pod(s)).</td>
    </tr>
  </tbody>
</table>


## AppArmorProfile {#AppArmorProfile}

AppArmorProfile defines a pod or container&#39;s AppArmor settings.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>localhostProfile</code><br/><em>string</em></td>
      <td>localhostProfile indicates a profile loaded on the node that should be used. The profile must be preconfigured on the node to work. Must match the loaded name of the profile. Must be set if and only if type is "Localhost".</td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>type indicates which kind of AppArmor profile will be applied. Valid options are:   Localhost - a profile pre-loaded on the node.   RuntimeDefault - the container runtime's default profile.   Unconfined - no AppArmor enforcement.<br/><br/>Possible enum values:<br/> - `"Localhost"` indicates that a profile pre-loaded on the node should be used.<br/> - `"RuntimeDefault"` indicates that the container runtime's default AppArmor profile should be used.<br/> - `"Unconfined"` indicates that no AppArmor profile should be enforced.</td>
    </tr>
  </tbody>
</table>


## AzureFileVolumeSource {#AzureFileVolumeSource}

AzureFile represents an Azure File Service mount on the host and bind mount to the pod.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.</td>
    </tr>
    <tr>
      <td><code>secretName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>secretName is the  name of secret that contains Azure Storage Account Name and Key</td>
    </tr>
    <tr>
      <td><code>shareName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>shareName is the azure share Name</td>
    </tr>
  </tbody>
</table>


## CSIVolumeSource {#CSIVolumeSource}

Represents a source location of a volume to mount, managed by an external CSI driver

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>driver</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>driver is the name of the CSI driver that handles this volume. Consult with your admin for the correct name as registered in the cluster.</td>
    </tr>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType to mount. Ex. "ext4", "xfs", "ntfs". If not provided, the empty value is passed to the associated CSI driver which will determine the default filesystem to apply.</td>
    </tr>
    <tr>
      <td><code>nodePublishSecretRef</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>nodePublishSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodePublishVolume and NodeUnpublishVolume calls. This field is optional, and  may be empty if no secret is required. If the secret object contains more than one secret, all secret references are passed.</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly specifies a read-only configuration for the volume. Defaults to false (read/write).</td>
    </tr>
    <tr>
      <td><code>volumeAttributes</code><br/><em>object</em></td>
      <td>volumeAttributes stores driver-specific properties that are passed to the CSI driver. Consult your driver's documentation for supported values.</td>
    </tr>
  </tbody>
</table>


## Capabilities {#Capabilities}

Adds and removes POSIX capabilities from running containers.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>add</code><br/><em>string array</em></td>
      <td>Added capabilities</td>
    </tr>
    <tr>
      <td><code>drop</code><br/><em>string array</em></td>
      <td>Removed capabilities</td>
    </tr>
  </tbody>
</table>


## CephFSVolumeSource {#CephFSVolumeSource}

Represents a Ceph Filesystem mount that lasts the lifetime of a pod Cephfs volumes do not support ownership management or SELinux relabeling.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>monitors</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>monitors is Required: Monitors is a collection of Ceph monitors More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</td>
    </tr>
    <tr>
      <td><code>path</code><br/><em>string</em></td>
      <td>path is Optional: Used as the mounted root, rather than the full Ceph tree, default is /</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly is Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</td>
    </tr>
    <tr>
      <td><code>secretFile</code><br/><em>string</em></td>
      <td>secretFile is Optional: SecretFile is the path to key ring for User, default is /etc/ceph/user.secret More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>secretRef is Optional: SecretRef is reference to the authentication secret for User, default is empty. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</td>
    </tr>
    <tr>
      <td><code>user</code><br/><em>string</em></td>
      <td>user is optional: User is the rados user name, default is admin More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it</td>
    </tr>
  </tbody>
</table>


## CinderVolumeSource {#CinderVolumeSource}

Represents a cinder volume resource in Openstack. A Cinder volume must exist before mounting to a container. The volume must also be in the same region as the kubelet. Cinder volumes support ownership management and SELinux relabeling.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://examples.k8s.io/mysql-cinder-pd/README.md</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/mysql-cinder-pd/README.md</td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>secretRef is optional: points to a secret object containing parameters used to connect to OpenStack.</td>
    </tr>
    <tr>
      <td><code>volumeID</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>volumeID used to identify the volume in cinder. More info: https://examples.k8s.io/mysql-cinder-pd/README.md</td>
    </tr>
  </tbody>
</table>


## ClusterTrustBundleProjection {#ClusterTrustBundleProjection}

ClusterTrustBundleProjection describes how to select a set of ClusterTrustBundle objects and project their contents into the pod filesystem.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>labelSelector</code><br/><em><a href="{{< ref "../definitions/label-selector-v1-meta#LabelSelector" >}}">LabelSelector</a></em></td>
      <td>Select all ClusterTrustBundles that match this label selector.  Only has effect if signerName is set.  Mutually-exclusive with name.  If unset, interpreted as "match nothing".  If set but empty, interpreted as "match everything".</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Select a single ClusterTrustBundle by object name.  Mutually-exclusive with signerName and labelSelector.</td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>If true, don't block pod startup if the referenced ClusterTrustBundle(s) aren't available.  If using name, then the named ClusterTrustBundle is allowed not to exist.  If using signerName, then the combination of signerName and labelSelector is allowed to match zero ClusterTrustBundles.</td>
    </tr>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Relative path from the volume root to write the bundle.</td>
    </tr>
    <tr>
      <td><code>signerName</code><br/><em>string</em></td>
      <td>Select all ClusterTrustBundles that match this signer name. Mutually-exclusive with name.  The contents of all selected ClusterTrustBundles will be unified and deduplicated.</td>
    </tr>
  </tbody>
</table>


## ConfigMapEnvSource {#ConfigMapEnvSource}

ConfigMapEnvSource selects a ConfigMap to populate the environment variables with.

The contents of the target ConfigMap&#39;s Data field will represent the key-value pairs as environment variables.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>Specify whether the ConfigMap must be defined</td>
    </tr>
  </tbody>
</table>


## ConfigMapKeySelector {#ConfigMapKeySelector}

Selects a key from a ConfigMap.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>The key to select.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>Specify whether the ConfigMap or its key must be defined</td>
    </tr>
  </tbody>
</table>


## ConfigMapProjection {#ConfigMapProjection}

Adapts a ConfigMap into a projected volume.

The contents of the target ConfigMap&#39;s Data field will be presented in a projected volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. Note that this is identical to a configmap volume source without the default mode.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>items</code><br/><em><a href="{{< ref "#KeyToPath" >}}">KeyToPath array</a></em></td>
      <td>items if unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>optional specify whether the ConfigMap or its keys must be defined</td>
    </tr>
  </tbody>
</table>


## ConfigMapVolumeSource {#ConfigMapVolumeSource}

Adapts a ConfigMap into a volume.

The contents of the target ConfigMap&#39;s Data field will be presented in a volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. ConfigMap volumes support ownership management and SELinux relabeling.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>defaultMode</code><br/><em>integer</em></td>
      <td>defaultMode is optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.</td>
    </tr>
    <tr>
      <td><code>items</code><br/><em><a href="{{< ref "#KeyToPath" >}}">KeyToPath array</a></em></td>
      <td>items if unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>optional specify whether the ConfigMap or its keys must be defined</td>
    </tr>
  </tbody>
</table>


## Container {#Container}

A single application container that you want to run within a pod.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>args</code><br/><em>string array</em></td>
      <td>Arguments to the entrypoint. The container image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell</td>
    </tr>
    <tr>
      <td><code>command</code><br/><em>string array</em></td>
      <td>Entrypoint array. Not executed within a shell. The container image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell</td>
    </tr>
    <tr>
      <td><code>env</code><br/><em><a href="{{< ref "#EnvVar" >}}">EnvVar array</a></em><br/><em>patch strategy: merge on key <code>name</code></em></td>
      <td>List of environment variables to set in the container. Cannot be updated.</td>
    </tr>
    <tr>
      <td><code>envFrom</code><br/><em><a href="{{< ref "#EnvFromSource" >}}">EnvFromSource array</a></em></td>
      <td>List of sources to populate environment variables in the container. The keys defined within a source may consist of any printable ASCII characters except '='. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.</td>
    </tr>
    <tr>
      <td><code>image</code><br/><em>string</em></td>
      <td>Container image name. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets.</td>
    </tr>
    <tr>
      <td><code>imagePullPolicy</code><br/><em>string</em></td>
      <td>Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images<br/><br/>Possible enum values:<br/> - `"Always"` means that kubelet always attempts to pull the latest image. Container will fail If the pull fails.<br/> - `"IfNotPresent"` means that kubelet pulls if the image isn't present on disk. Container will fail if the image isn't present and the pull fails.<br/> - `"Never"` means that kubelet never pulls an image, but only uses a local image. Container will fail if the image isn't present</td>
    </tr>
    <tr>
      <td><code>lifecycle</code><br/><em><a href="{{< ref "#Lifecycle" >}}">Lifecycle</a></em></td>
      <td>Actions that the management system should take in response to container lifecycle events. Cannot be updated.</td>
    </tr>
    <tr>
      <td><code>livenessProbe</code><br/><em><a href="{{< ref "#Probe" >}}">Probe</a></em></td>
      <td>Periodic probe of container liveness. Container will be restarted if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name of the container specified as a DNS_LABEL. Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.</td>
    </tr>
    <tr>
      <td><code>ports</code><br/><em><a href="{{< ref "#ContainerPort" >}}">ContainerPort array</a></em><br/><em>patch strategy: merge on key <code>containerPort</code></em></td>
      <td>List of ports to expose from the container. Not specifying a port here DOES NOT prevent that port from being exposed. Any port which is listening on the default "0.0.0.0" address inside a container will be accessible from the network. Modifying this array with strategic merge patch may corrupt the data. For more information See https://github.com/kubernetes/kubernetes/issues/108255. Cannot be updated.</td>
    </tr>
    <tr>
      <td><code>readinessProbe</code><br/><em><a href="{{< ref "#Probe" >}}">Probe</a></em></td>
      <td>Periodic probe of container service readiness. Container will be removed from service endpoints if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes</td>
    </tr>
    <tr>
      <td><code>resizePolicy</code><br/><em><a href="{{< ref "#ContainerResizePolicy" >}}">ContainerResizePolicy array</a></em></td>
      <td>Resources resize policy for the container. This field cannot be set on ephemeral containers.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em><a href="{{< ref "#ResourceRequirements" >}}">ResourceRequirements</a></em></td>
      <td>Compute Resources required by this container. Cannot be updated. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/</td>
    </tr>
    <tr>
      <td><code>restartPolicy</code><br/><em>string</em></td>
      <td>RestartPolicy defines the restart behavior of individual containers in a pod. This overrides the pod-level restart policy. When this field is not specified, the restart behavior is defined by the Pod's restart policy and the container type. Additionally, setting the RestartPolicy as "Always" for the init container will have the following effect: this init container will be continually restarted on exit until all regular containers have terminated. Once all regular containers have completed, all init containers with restartPolicy "Always" will be shut down. This lifecycle differs from normal init containers and is often referred to as a "sidecar" container. Although this init container still starts in the init container sequence, it does not wait for the container to complete before proceeding to the next init container. Instead, the next init container starts immediately after this init container is started, or after any startupProbe has successfully completed.</td>
    </tr>
    <tr>
      <td><code>restartPolicyRules</code><br/><em><a href="{{< ref "#ContainerRestartRule" >}}">ContainerRestartRule array</a></em></td>
      <td>Represents a list of rules to be checked to determine if the container should be restarted on exit. The rules are evaluated in order. Once a rule matches a container exit condition, the remaining rules are ignored. If no rule matches the container exit condition, the Container-level restart policy determines the whether the container is restarted or not. Constraints on the rules: - At most 20 rules are allowed. - Rules can have the same action. - Identical rules are not forbidden in validations. When rules are specified, container MUST set RestartPolicy explicitly even it if matches the Pod's RestartPolicy.</td>
    </tr>
    <tr>
      <td><code>securityContext</code><br/><em><a href="{{< ref "#SecurityContext" >}}">SecurityContext</a></em></td>
      <td>SecurityContext defines the security options the container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext. More info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/</td>
    </tr>
    <tr>
      <td><code>startupProbe</code><br/><em><a href="{{< ref "#Probe" >}}">Probe</a></em></td>
      <td>StartupProbe indicates that the Pod has successfully initialized. If specified, no other probes are executed until this completes successfully. If this probe fails, the Pod will be restarted, just as if the livenessProbe failed. This can be used to provide different probe parameters at the beginning of a Pod's lifecycle, when it might take a long time to load data or warm a cache, than during steady-state operation. This cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes</td>
    </tr>
    <tr>
      <td><code>stdin</code><br/><em>boolean</em></td>
      <td>Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.</td>
    </tr>
    <tr>
      <td><code>stdinOnce</code><br/><em>boolean</em></td>
      <td>Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false</td>
    </tr>
    <tr>
      <td><code>terminationMessagePath</code><br/><em>string</em></td>
      <td>Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.</td>
    </tr>
    <tr>
      <td><code>terminationMessagePolicy</code><br/><em>string</em></td>
      <td>Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.<br/><br/>Possible enum values:<br/> - `"FallbackToLogsOnError"` will read the most recent contents of the container logs for the container status message when the container exits with an error and the terminationMessagePath has no contents.<br/> - `"File"` is the default behavior and will set the container status message to the contents of the container's terminationMessagePath when the container exits.</td>
    </tr>
    <tr>
      <td><code>tty</code><br/><em>boolean</em></td>
      <td>Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.</td>
    </tr>
    <tr>
      <td><code>volumeDevices</code><br/><em><a href="{{< ref "#VolumeDevice" >}}">VolumeDevice array</a></em><br/><em>patch strategy: merge on key <code>devicePath</code></em></td>
      <td>volumeDevices is the list of block devices to be used by the container.</td>
    </tr>
    <tr>
      <td><code>volumeMounts</code><br/><em><a href="{{< ref "#VolumeMount" >}}">VolumeMount array</a></em><br/><em>patch strategy: merge on key <code>mountPath</code></em></td>
      <td>Pod volumes to mount into the container's filesystem. Cannot be updated.</td>
    </tr>
    <tr>
      <td><code>workingDir</code><br/><em>string</em></td>
      <td>Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.</td>
    </tr>
  </tbody>
</table>


## ContainerExtendedResourceRequest {#ContainerExtendedResourceRequest}

ContainerExtendedResourceRequest has the mapping of container name, extended resource name to the device request name.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>containerName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>The name of the container requesting resources.</td>
    </tr>
    <tr>
      <td><code>requestName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>The name of the request in the special ResourceClaim which corresponds to the extended resource.</td>
    </tr>
    <tr>
      <td><code>resourceName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>The name of the extended resource in that container which gets backed by DRA.</td>
    </tr>
  </tbody>
</table>


## ContainerPort {#ContainerPort}

ContainerPort represents a network port in a single container.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>containerPort</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>Number of port to expose on the pod's IP address. This must be a valid port number, 0 \< x \< 65536.</td>
    </tr>
    <tr>
      <td><code>hostIP</code><br/><em>string</em></td>
      <td>What host IP to bind the external port to.</td>
    </tr>
    <tr>
      <td><code>hostPort</code><br/><em>integer</em></td>
      <td>Number of port to expose on the host. If specified, this must be a valid port number, 0 \< x \< 65536. If HostNetwork is specified, this must match ContainerPort. Most containers do not need this.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services.</td>
    </tr>
    <tr>
      <td><code>protocol</code><br/><em>string</em></td>
      <td>Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP".<br/><br/>Possible enum values:<br/> - `"SCTP"` is the SCTP protocol.<br/> - `"TCP"` is the TCP protocol.<br/> - `"UDP"` is the UDP protocol.</td>
    </tr>
  </tbody>
</table>


## ContainerResizePolicy {#ContainerResizePolicy}

ContainerResizePolicy represents resource resize policy for the container.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>resourceName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name of the resource to which this resource resize policy applies. Supported values: cpu, memory.</td>
    </tr>
    <tr>
      <td><code>restartPolicy</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Restart policy to apply when specified resource is resized. If not specified, it defaults to NotRequired.</td>
    </tr>
  </tbody>
</table>


## ContainerRestartRule {#ContainerRestartRule}

ContainerRestartRule describes how a container exit is handled.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>action</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Specifies the action taken on a container exit if the requirements are satisfied. The only possible value is "Restart" to restart the container.</td>
    </tr>
    <tr>
      <td><code>exitCodes</code><br/><em><a href="{{< ref "#ContainerRestartRuleOnExitCodes" >}}">ContainerRestartRuleOnExitCodes</a></em></td>
      <td>Represents the exit codes to check on container exits.</td>
    </tr>
  </tbody>
</table>


## ContainerRestartRuleOnExitCodes {#ContainerRestartRuleOnExitCodes}

ContainerRestartRuleOnExitCodes describes the condition for handling an exited container based on its exit codes.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>operator</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Represents the relationship between the container exit code(s) and the specified values. Possible values are: - In: the requirement is satisfied if the container exit code is in the   set of specified values. - NotIn: the requirement is satisfied if the container exit code is   not in the set of specified values.</td>
    </tr>
    <tr>
      <td><code>values</code><br/><em>integer array</em></td>
      <td>Specifies the set of values to check for container exit codes. At most 255 elements are allowed.</td>
    </tr>
  </tbody>
</table>


## ContainerState {#ContainerState}

ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>running</code><br/><em><a href="{{< ref "#ContainerStateRunning" >}}">ContainerStateRunning</a></em></td>
      <td>Details about a running container</td>
    </tr>
    <tr>
      <td><code>terminated</code><br/><em><a href="{{< ref "#ContainerStateTerminated" >}}">ContainerStateTerminated</a></em></td>
      <td>Details about a terminated container</td>
    </tr>
    <tr>
      <td><code>waiting</code><br/><em><a href="{{< ref "#ContainerStateWaiting" >}}">ContainerStateWaiting</a></em></td>
      <td>Details about a waiting container</td>
    </tr>
  </tbody>
</table>


## ContainerStateRunning {#ContainerStateRunning}

ContainerStateRunning is a running state of a container.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>startedAt</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>Time at which the container was last (re-)started</td>
    </tr>
  </tbody>
</table>


## ContainerStateTerminated {#ContainerStateTerminated}

ContainerStateTerminated is a terminated state of a container.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>containerID</code><br/><em>string</em></td>
      <td>Container's ID in the format '\<type>://\<container_id>'</td>
    </tr>
    <tr>
      <td><code>exitCode</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>Exit status from the last termination of the container</td>
    </tr>
    <tr>
      <td><code>finishedAt</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>Time at which the container last terminated</td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>Message regarding the last termination of the container</td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>(brief) reason from the last termination of the container</td>
    </tr>
    <tr>
      <td><code>signal</code><br/><em>integer</em></td>
      <td>Signal from the last termination of the container</td>
    </tr>
    <tr>
      <td><code>startedAt</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>Time at which previous execution of the container started</td>
    </tr>
  </tbody>
</table>


## ContainerStateWaiting {#ContainerStateWaiting}

ContainerStateWaiting is a waiting state of a container.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>Message regarding why the container is not yet running.</td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>(brief) reason the container is not yet running.</td>
    </tr>
  </tbody>
</table>


## ContainerUser {#ContainerUser}

ContainerUser represents user identity information

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>linux</code><br/><em><a href="{{< ref "#LinuxContainerUser" >}}">LinuxContainerUser</a></em></td>
      <td>Linux holds user identity information initially attached to the first process of the containers in Linux. Note that the actual running identity can be changed if the process has enough privilege to do so.</td>
    </tr>
  </tbody>
</table>


## DownwardAPIProjection {#DownwardAPIProjection}

Represents downward API info for projecting into a projected volume. Note that this is identical to a downwardAPI volume source without the default mode.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>items</code><br/><em><a href="{{< ref "#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile array</a></em></td>
      <td>Items is a list of DownwardAPIVolume file</td>
    </tr>
  </tbody>
</table>


## DownwardAPIVolumeFile {#DownwardAPIVolumeFile}

DownwardAPIVolumeFile represents information to create the file containing the pod field

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fieldRef</code><br/><em><a href="{{< ref "#ObjectFieldSelector" >}}">ObjectFieldSelector</a></em></td>
      <td>Required: Selects a field of the pod: only annotations, labels, name, namespace and uid are supported.</td>
    </tr>
    <tr>
      <td><code>mode</code><br/><em>integer</em></td>
      <td>Optional: mode bits used to set permissions on this file, must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.</td>
    </tr>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Required: Path is  the relative path name of the file to be created. Must not be absolute or contain the '..' path. Must be utf-8 encoded. The first item of the relative path must not start with '..'</td>
    </tr>
    <tr>
      <td><code>resourceFieldRef</code><br/><em><a href="{{< ref "#ResourceFieldSelector" >}}">ResourceFieldSelector</a></em></td>
      <td>Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, requests.cpu and requests.memory) are currently supported.</td>
    </tr>
  </tbody>
</table>


## DownwardAPIVolumeSource {#DownwardAPIVolumeSource}

DownwardAPIVolumeSource represents a volume containing downward API info. Downward API volumes support ownership management and SELinux relabeling.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>defaultMode</code><br/><em>integer</em></td>
      <td>Optional: mode bits to use on created files by default. Must be a Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.</td>
    </tr>
    <tr>
      <td><code>items</code><br/><em><a href="{{< ref "#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile array</a></em></td>
      <td>Items is a list of downward API volume file</td>
    </tr>
  </tbody>
</table>


## EmptyDirVolumeSource {#EmptyDirVolumeSource}

Represents an empty directory for a pod. Empty directory volumes support ownership management and SELinux relabeling.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>medium</code><br/><em>string</em></td>
      <td>medium represents what type of storage medium should back this directory. The default is "" which means to use the node's default medium. Must be an empty string (default) or Memory. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir</td>
    </tr>
    <tr>
      <td><code>sizeLimit</code><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td>sizeLimit is the total amount of local storage required for this EmptyDir volume. The size limit is also applicable for memory medium. The maximum usage on memory medium EmptyDir would be the minimum value between the SizeLimit specified here and the sum of memory limits of all containers in a pod. The default is nil which means that the limit is undefined. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir</td>
    </tr>
  </tbody>
</table>


## EnvFromSource {#EnvFromSource}

EnvFromSource represents the source of a set of ConfigMaps or Secrets

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>configMapRef</code><br/><em><a href="{{< ref "#ConfigMapEnvSource" >}}">ConfigMapEnvSource</a></em></td>
      <td>The ConfigMap to select from</td>
    </tr>
    <tr>
      <td><code>prefix</code><br/><em>string</em></td>
      <td>Optional text to prepend to the name of each environment variable. May consist of any printable ASCII characters except '='.</td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "#SecretEnvSource" >}}">SecretEnvSource</a></em></td>
      <td>The Secret to select from</td>
    </tr>
  </tbody>
</table>


## EnvVar {#EnvVar}

EnvVar represents an environment variable present in a Container.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name of the environment variable. May consist of any printable ASCII characters except '='.</td>
    </tr>
    <tr>
      <td><code>value</code><br/><em>string</em></td>
      <td>Variable references $(VAR_NAME) are expanded using the previously defined environment variables in the container and any service environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "".</td>
    </tr>
    <tr>
      <td><code>valueFrom</code><br/><em><a href="{{< ref "#EnvVarSource" >}}">EnvVarSource</a></em></td>
      <td>Source for the environment variable's value. Cannot be used if value is not empty.</td>
    </tr>
  </tbody>
</table>


## EnvVarSource {#EnvVarSource}

EnvVarSource represents a source for the value of an EnvVar.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>configMapKeyRef</code><br/><em><a href="{{< ref "#ConfigMapKeySelector" >}}">ConfigMapKeySelector</a></em></td>
      <td>Selects a key of a ConfigMap.</td>
    </tr>
    <tr>
      <td><code>fieldRef</code><br/><em><a href="{{< ref "#ObjectFieldSelector" >}}">ObjectFieldSelector</a></em></td>
      <td>Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['\<KEY>']`, `metadata.annotations['\<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs.</td>
    </tr>
    <tr>
      <td><code>fileKeyRef</code><br/><em><a href="{{< ref "#FileKeySelector" >}}">FileKeySelector</a></em></td>
      <td>FileKeyRef selects a key of the env file. Requires the EnvFiles feature gate to be enabled.</td>
    </tr>
    <tr>
      <td><code>resourceFieldRef</code><br/><em><a href="{{< ref "#ResourceFieldSelector" >}}">ResourceFieldSelector</a></em></td>
      <td>Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and requests.ephemeral-storage) are currently supported.</td>
    </tr>
    <tr>
      <td><code>secretKeyRef</code><br/><em><a href="{{< ref "#SecretKeySelector" >}}">SecretKeySelector</a></em></td>
      <td>Selects a key of a secret in the pod's namespace</td>
    </tr>
  </tbody>
</table>


## EphemeralContainer {#EphemeralContainer}

An EphemeralContainer is a temporary container that you may add to an existing Pod for user-initiated activities such as debugging. Ephemeral containers have no resource or scheduling guarantees, and they will not be restarted when they exit or when a Pod is removed or restarted. The kubelet may evict a Pod if an ephemeral container causes the Pod to exceed its resource allocation.

To add an ephemeral container, use the ephemeralcontainers subresource of an existing Pod. Ephemeral containers may not be removed or restarted.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>args</code><br/><em>string array</em></td>
      <td>Arguments to the entrypoint. The image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell</td>
    </tr>
    <tr>
      <td><code>command</code><br/><em>string array</em></td>
      <td>Entrypoint array. Not executed within a shell. The image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell</td>
    </tr>
    <tr>
      <td><code>env</code><br/><em><a href="{{< ref "#EnvVar" >}}">EnvVar array</a></em><br/><em>patch strategy: merge on key <code>name</code></em></td>
      <td>List of environment variables to set in the container. Cannot be updated.</td>
    </tr>
    <tr>
      <td><code>envFrom</code><br/><em><a href="{{< ref "#EnvFromSource" >}}">EnvFromSource array</a></em></td>
      <td>List of sources to populate environment variables in the container. The keys defined within a source may consist of any printable ASCII characters except '='. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.</td>
    </tr>
    <tr>
      <td><code>image</code><br/><em>string</em></td>
      <td>Container image name. More info: https://kubernetes.io/docs/concepts/containers/images</td>
    </tr>
    <tr>
      <td><code>imagePullPolicy</code><br/><em>string</em></td>
      <td>Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images<br/><br/>Possible enum values:<br/> - `"Always"` means that kubelet always attempts to pull the latest image. Container will fail If the pull fails.<br/> - `"IfNotPresent"` means that kubelet pulls if the image isn't present on disk. Container will fail if the image isn't present and the pull fails.<br/> - `"Never"` means that kubelet never pulls an image, but only uses a local image. Container will fail if the image isn't present</td>
    </tr>
    <tr>
      <td><code>lifecycle</code><br/><em><a href="{{< ref "#Lifecycle" >}}">Lifecycle</a></em></td>
      <td>Lifecycle is not allowed for ephemeral containers.</td>
    </tr>
    <tr>
      <td><code>livenessProbe</code><br/><em><a href="{{< ref "#Probe" >}}">Probe</a></em></td>
      <td>Probes are not allowed for ephemeral containers.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name of the ephemeral container specified as a DNS_LABEL. This name must be unique among all containers, init containers and ephemeral containers.</td>
    </tr>
    <tr>
      <td><code>ports</code><br/><em><a href="{{< ref "#ContainerPort" >}}">ContainerPort array</a></em><br/><em>patch strategy: merge on key <code>containerPort</code></em></td>
      <td>Ports are not allowed for ephemeral containers.</td>
    </tr>
    <tr>
      <td><code>readinessProbe</code><br/><em><a href="{{< ref "#Probe" >}}">Probe</a></em></td>
      <td>Probes are not allowed for ephemeral containers.</td>
    </tr>
    <tr>
      <td><code>resizePolicy</code><br/><em><a href="{{< ref "#ContainerResizePolicy" >}}">ContainerResizePolicy array</a></em></td>
      <td>Resources resize policy for the container.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em><a href="{{< ref "#ResourceRequirements" >}}">ResourceRequirements</a></em></td>
      <td>Resources are not allowed for ephemeral containers. Ephemeral containers use spare resources already allocated to the pod.</td>
    </tr>
    <tr>
      <td><code>restartPolicy</code><br/><em>string</em></td>
      <td>Restart policy for the container to manage the restart behavior of each container within a pod. You cannot set this field on ephemeral containers.</td>
    </tr>
    <tr>
      <td><code>restartPolicyRules</code><br/><em><a href="{{< ref "#ContainerRestartRule" >}}">ContainerRestartRule array</a></em></td>
      <td>Represents a list of rules to be checked to determine if the container should be restarted on exit. You cannot set this field on ephemeral containers.</td>
    </tr>
    <tr>
      <td><code>securityContext</code><br/><em><a href="{{< ref "#SecurityContext" >}}">SecurityContext</a></em></td>
      <td>Optional: SecurityContext defines the security options the ephemeral container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext.</td>
    </tr>
    <tr>
      <td><code>startupProbe</code><br/><em><a href="{{< ref "#Probe" >}}">Probe</a></em></td>
      <td>Probes are not allowed for ephemeral containers.</td>
    </tr>
    <tr>
      <td><code>stdin</code><br/><em>boolean</em></td>
      <td>Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.</td>
    </tr>
    <tr>
      <td><code>stdinOnce</code><br/><em>boolean</em></td>
      <td>Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false</td>
    </tr>
    <tr>
      <td><code>targetContainerName</code><br/><em>string</em></td>
      <td>If set, the name of the container from PodSpec that this ephemeral container targets. The ephemeral container will be run in the namespaces (IPC, PID, etc) of this container. If not set then the ephemeral container uses the namespaces configured in the Pod spec.  The container runtime must implement support for this feature. If the runtime does not support namespace targeting then the result of setting this field is undefined.</td>
    </tr>
    <tr>
      <td><code>terminationMessagePath</code><br/><em>string</em></td>
      <td>Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.</td>
    </tr>
    <tr>
      <td><code>terminationMessagePolicy</code><br/><em>string</em></td>
      <td>Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.<br/><br/>Possible enum values:<br/> - `"FallbackToLogsOnError"` will read the most recent contents of the container logs for the container status message when the container exits with an error and the terminationMessagePath has no contents.<br/> - `"File"` is the default behavior and will set the container status message to the contents of the container's terminationMessagePath when the container exits.</td>
    </tr>
    <tr>
      <td><code>tty</code><br/><em>boolean</em></td>
      <td>Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.</td>
    </tr>
    <tr>
      <td><code>volumeDevices</code><br/><em><a href="{{< ref "#VolumeDevice" >}}">VolumeDevice array</a></em><br/><em>patch strategy: merge on key <code>devicePath</code></em></td>
      <td>volumeDevices is the list of block devices to be used by the container.</td>
    </tr>
    <tr>
      <td><code>volumeMounts</code><br/><em><a href="{{< ref "#VolumeMount" >}}">VolumeMount array</a></em><br/><em>patch strategy: merge on key <code>mountPath</code></em></td>
      <td>Pod volumes to mount into the container's filesystem. Subpath mounts are not allowed for ephemeral containers. Cannot be updated.</td>
    </tr>
    <tr>
      <td><code>workingDir</code><br/><em>string</em></td>
      <td>Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.</td>
    </tr>
  </tbody>
</table>


## EphemeralVolumeSource {#EphemeralVolumeSource}

Represents an ephemeral volume that is handled by a normal storage driver.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>volumeClaimTemplate</code><br/><em><a href="{{< ref "#PersistentVolumeClaimTemplate" >}}">PersistentVolumeClaimTemplate</a></em></td>
      <td>Will be used to create a stand-alone PVC to provision the volume. The pod in which this EphemeralVolumeSource is embedded will be the owner of the PVC, i.e. the PVC will be deleted together with the pod.  The name of the PVC will be `\<pod name>-\<volume name>` where `\<volume name>` is the name from the `PodSpec.Volumes` array entry. Pod validation will reject the pod if the concatenated name is not valid for a PVC (for example, too long).  An existing PVC with that name that is not owned by the pod will *not* be used for the pod to avoid using an unrelated volume by mistake. Starting the pod is then blocked until the unrelated PVC is removed. If such a pre-created PVC is meant to be used by the pod, the PVC has to updated with an owner reference to the pod once the pod exists. Normally this should not be necessary, but it may be useful when manually reconstructing a broken cluster.  This field is read-only and no changes will be made by Kubernetes to the PVC after it has been created.  Required, must not be nil.</td>
    </tr>
  </tbody>
</table>


## ExecAction {#ExecAction}

ExecAction describes a &#34;run in container&#34; action.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>command</code><br/><em>string array</em></td>
      <td>Command is the command line to execute inside the container, the working directory for the command  is root ('/') in the container's filesystem. The command is simply exec'd, it is not run inside a shell, so traditional shell instructions ('|', etc) won't work. To use a shell, you need to explicitly call out to that shell. Exit status of 0 is treated as live/healthy and non-zero is unhealthy.</td>
    </tr>
  </tbody>
</table>


## FileKeySelector {#FileKeySelector}

FileKeySelector selects a key of the env file.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>The key within the env file. An invalid key will prevent the pod from starting. The keys defined within a source may consist of any printable ASCII characters except '='. During Alpha stage of the EnvFiles feature gate, the key size is limited to 128 characters.</td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>Specify whether the file or its key must be defined. If the file or key does not exist, then the env var is not published. If optional is set to true and the specified key does not exist, the environment variable will not be set in the Pod's containers.  If optional is set to false and the specified key does not exist, an error will be returned during Pod creation.</td>
    </tr>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>The path within the volume from which to select the file. Must be relative and may not contain the '..' path or start with '..'.</td>
    </tr>
    <tr>
      <td><code>volumeName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>The name of the volume mount containing the env file.</td>
    </tr>
  </tbody>
</table>


## FlexVolumeSource {#FlexVolumeSource}

FlexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>driver</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>driver is the name of the driver to use for this volume.</td>
    </tr>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". The default filesystem depends on FlexVolume script.</td>
    </tr>
    <tr>
      <td><code>options</code><br/><em>object</em></td>
      <td>options is Optional: this field holds extra command options if any.</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly is Optional: defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.</td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>secretRef is Optional: secretRef is reference to the secret object containing sensitive information to pass to the plugin scripts. This may be empty if no secret object is specified. If the secret object contains more than one secret, all secrets are passed to the plugin scripts.</td>
    </tr>
  </tbody>
</table>


## GRPCAction {#GRPCAction}

GRPCAction specifies an action involving a GRPC service.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>port</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>Port number of the gRPC service. Number must be in the range 1 to 65535.</td>
    </tr>
    <tr>
      <td><code>service</code><br/><em>string</em></td>
      <td>Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).  If this is not specified, the default behavior is defined by gRPC.</td>
    </tr>
  </tbody>
</table>


## GitRepoVolumeSource {#GitRepoVolumeSource}

Represents a volume that is populated with the contents of a git repository. Git repo volumes do not support ownership management. Git repo volumes support SELinux relabeling.

DEPRECATED: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod&#39;s container.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>directory</code><br/><em>string</em></td>
      <td>directory is the target directory name. Must not contain or start with '..'.  If '.' is supplied, the volume directory will be the git repository.  Otherwise, if specified, the volume will contain the git repository in the subdirectory with the given name.</td>
    </tr>
    <tr>
      <td><code>repository</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>repository is the URL</td>
    </tr>
    <tr>
      <td><code>revision</code><br/><em>string</em></td>
      <td>revision is the commit hash for the specified revision.</td>
    </tr>
  </tbody>
</table>


## GlusterfsVolumeSource {#GlusterfsVolumeSource}

Represents a Glusterfs mount that lasts the lifetime of a pod. Glusterfs volumes do not support ownership management or SELinux relabeling.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>endpoints</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>endpoints is the endpoint name that details Glusterfs topology.</td>
    </tr>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>path is the Glusterfs volume path. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly here will force the Glusterfs volume to be mounted with read-only permissions. Defaults to false. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod</td>
    </tr>
  </tbody>
</table>


## HTTPGetAction {#HTTPGetAction}

HTTPGetAction describes an action based on HTTP Get requests.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>host</code><br/><em>string</em></td>
      <td>Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.</td>
    </tr>
    <tr>
      <td><code>httpHeaders</code><br/><em><a href="{{< ref "#HTTPHeader" >}}">HTTPHeader array</a></em></td>
      <td>Custom headers to set in the request. HTTP allows repeated headers.</td>
    </tr>
    <tr>
      <td><code>path</code><br/><em>string</em></td>
      <td>Path to access on the HTTP server.</td>
    </tr>
    <tr>
      <td><code>port</code>&nbsp;<strong>*</strong><br/><em></em></td>
      <td>Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.</td>
    </tr>
    <tr>
      <td><code>scheme</code><br/><em>string</em></td>
      <td>Scheme to use for connecting to the host. Defaults to HTTP.<br/><br/>Possible enum values:<br/> - `"HTTP"` means that the scheme used will be http://<br/> - `"HTTPS"` means that the scheme used will be https://</td>
    </tr>
  </tbody>
</table>


## HTTPHeader {#HTTPHeader}

HTTPHeader describes a custom header to be used in HTTP probes

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>The header field name. This will be canonicalized upon output, so case-variant names will be understood as the same header.</td>
    </tr>
    <tr>
      <td><code>value</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>The header field value</td>
    </tr>
  </tbody>
</table>


## HostAlias {#HostAlias}

HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod&#39;s hosts file.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>hostnames</code><br/><em>string array</em></td>
      <td>Hostnames for the above IP address.</td>
    </tr>
    <tr>
      <td><code>ip</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>IP address of the host file entry.</td>
    </tr>
  </tbody>
</table>


## HostIP {#HostIP}

HostIP represents a single IP address allocated to the host.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>ip</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>IP is the IP address assigned to the host</td>
    </tr>
  </tbody>
</table>


## ISCSIVolumeSource {#ISCSIVolumeSource}

Represents an ISCSI disk. ISCSI volumes can only be mounted as read/write once. ISCSI volumes support ownership management and SELinux relabeling.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>chapAuthDiscovery</code><br/><em>boolean</em></td>
      <td>chapAuthDiscovery defines whether support iSCSI Discovery CHAP authentication</td>
    </tr>
    <tr>
      <td><code>chapAuthSession</code><br/><em>boolean</em></td>
      <td>chapAuthSession defines whether support iSCSI Session CHAP authentication</td>
    </tr>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#iscsi</td>
    </tr>
    <tr>
      <td><code>initiatorName</code><br/><em>string</em></td>
      <td>initiatorName is the custom iSCSI Initiator Name. If initiatorName is specified with iscsiInterface simultaneously, new iSCSI interface \<target portal>:\<volume name> will be created for the connection.</td>
    </tr>
    <tr>
      <td><code>iqn</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>iqn is the target iSCSI Qualified Name.</td>
    </tr>
    <tr>
      <td><code>iscsiInterface</code><br/><em>string</em></td>
      <td>iscsiInterface is the interface Name that uses an iSCSI transport. Defaults to 'default' (tcp).</td>
    </tr>
    <tr>
      <td><code>lun</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>lun represents iSCSI Target Lun number.</td>
    </tr>
    <tr>
      <td><code>portals</code><br/><em>string array</em></td>
      <td>portals is the iSCSI Target Portal List. The portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false.</td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>secretRef is the CHAP Secret for iSCSI target and initiator authentication</td>
    </tr>
    <tr>
      <td><code>targetPortal</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>targetPortal is iSCSI Target Portal. The Portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).</td>
    </tr>
  </tbody>
</table>


## ImageVolumeSource {#ImageVolumeSource}

ImageVolumeSource represents a image volume resource.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pullPolicy</code><br/><em>string</em></td>
      <td>Policy for pulling OCI objects. Possible values are: Always: the kubelet always attempts to pull the reference. Container creation will fail If the pull fails. Never: the kubelet never pulls the reference and only uses a local image or artifact. Container creation will fail if the reference isn't present. IfNotPresent: the kubelet pulls if the reference isn't already present on disk. Container creation will fail if the reference isn't present and the pull fails. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise.<br/><br/>Possible enum values:<br/> - `"Always"` means that kubelet always attempts to pull the latest image. Container will fail If the pull fails.<br/> - `"IfNotPresent"` means that kubelet pulls if the image isn't present on disk. Container will fail if the image isn't present and the pull fails.<br/> - `"Never"` means that kubelet never pulls an image, but only uses a local image. Container will fail if the image isn't present</td>
    </tr>
    <tr>
      <td><code>reference</code><br/><em>string</em></td>
      <td>Required: Image or artifact reference to be used. Behaves in the same way as pod.spec.containers[*].image. Pull secrets will be assembled in the same way as for the container image by looking up node credentials, SA image pull secrets, and pod spec image pull secrets. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets.</td>
    </tr>
  </tbody>
</table>


## ImageVolumeStatus {#ImageVolumeStatus}

ImageVolumeStatus represents the image-based volume status.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>imageRef</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>ImageRef is the digest of the image used for this volume. It should have a value that's similar to the pod's status.containerStatuses[i].imageID. The ImageRef length should not exceed 256 characters.</td>
    </tr>
  </tbody>
</table>


## KeyToPath {#KeyToPath}

Maps a string key to a path within a volume.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>key is the key to project.</td>
    </tr>
    <tr>
      <td><code>mode</code><br/><em>integer</em></td>
      <td>mode is Optional: mode bits used to set permissions on this file. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.</td>
    </tr>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>path is the relative path of the file to map the key to. May not be an absolute path. May not contain the path element '..'. May not start with the string '..'.</td>
    </tr>
  </tbody>
</table>


## Lifecycle {#Lifecycle}

Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>postStart</code><br/><em><a href="{{< ref "#LifecycleHandler" >}}">LifecycleHandler</a></em></td>
      <td>PostStart is called immediately after a container is created. If the handler fails, the container is terminated and restarted according to its restart policy. Other management of the container blocks until the hook completes. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks</td>
    </tr>
    <tr>
      <td><code>preStop</code><br/><em><a href="{{< ref "#LifecycleHandler" >}}">LifecycleHandler</a></em></td>
      <td>PreStop is called immediately before a container is terminated due to an API request or management event such as liveness/startup probe failure, preemption, resource contention, etc. The handler is not called if the container crashes or exits. The Pod's termination grace period countdown begins before the PreStop hook is executed. Regardless of the outcome of the handler, the container will eventually terminate within the Pod's termination grace period (unless delayed by finalizers). Other management of the container blocks until the hook completes or until the termination grace period is reached. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks</td>
    </tr>
    <tr>
      <td><code>stopSignal</code><br/><em>string</em></td>
      <td>StopSignal defines which signal will be sent to a container when it is being stopped. If not specified, the default is defined by the container runtime in use. StopSignal can only be set for Pods with a non-empty .spec.os.name<br/><br/>Possible enum values:<br/> - `"SIGABRT"`<br/> - `"SIGALRM"`<br/> - `"SIGBUS"`<br/> - `"SIGCHLD"`<br/> - `"SIGCLD"`<br/> - `"SIGCONT"`<br/> - `"SIGFPE"`<br/> - `"SIGHUP"`<br/> - `"SIGILL"`<br/> - `"SIGINT"`<br/> - `"SIGIO"`<br/> - `"SIGIOT"`<br/> - `"SIGKILL"`<br/> - `"SIGPIPE"`<br/> - `"SIGPOLL"`<br/> - `"SIGPROF"`<br/> - `"SIGPWR"`<br/> - `"SIGQUIT"`<br/> - `"SIGRTMAX"`<br/> - `"SIGRTMAX-1"`<br/> - `"SIGRTMAX-10"`<br/> - `"SIGRTMAX-11"`<br/> - `"SIGRTMAX-12"`<br/> - `"SIGRTMAX-13"`<br/> - `"SIGRTMAX-14"`<br/> - `"SIGRTMAX-2"`<br/> - `"SIGRTMAX-3"`<br/> - `"SIGRTMAX-4"`<br/> - `"SIGRTMAX-5"`<br/> - `"SIGRTMAX-6"`<br/> - `"SIGRTMAX-7"`<br/> - `"SIGRTMAX-8"`<br/> - `"SIGRTMAX-9"`<br/> - `"SIGRTMIN"`<br/> - `"SIGRTMIN+1"`<br/> - `"SIGRTMIN+10"`<br/> - `"SIGRTMIN+11"`<br/> - `"SIGRTMIN+12"`<br/> - `"SIGRTMIN+13"`<br/> - `"SIGRTMIN+14"`<br/> - `"SIGRTMIN+15"`<br/> - `"SIGRTMIN+2"`<br/> - `"SIGRTMIN+3"`<br/> - `"SIGRTMIN+4"`<br/> - `"SIGRTMIN+5"`<br/> - `"SIGRTMIN+6"`<br/> - `"SIGRTMIN+7"`<br/> - `"SIGRTMIN+8"`<br/> - `"SIGRTMIN+9"`<br/> - `"SIGSEGV"`<br/> - `"SIGSTKFLT"`<br/> - `"SIGSTOP"`<br/> - `"SIGSYS"`<br/> - `"SIGTERM"`<br/> - `"SIGTRAP"`<br/> - `"SIGTSTP"`<br/> - `"SIGTTIN"`<br/> - `"SIGTTOU"`<br/> - `"SIGURG"`<br/> - `"SIGUSR1"`<br/> - `"SIGUSR2"`<br/> - `"SIGVTALRM"`<br/> - `"SIGWINCH"`<br/> - `"SIGXCPU"`<br/> - `"SIGXFSZ"`</td>
    </tr>
  </tbody>
</table>


## LifecycleHandler {#LifecycleHandler}

LifecycleHandler defines a specific action that should be taken in a lifecycle hook. One and only one of the fields, except TCPSocket must be specified.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>exec</code><br/><em><a href="{{< ref "#ExecAction" >}}">ExecAction</a></em></td>
      <td>Exec specifies a command to execute in the container.</td>
    </tr>
    <tr>
      <td><code>httpGet</code><br/><em><a href="{{< ref "#HTTPGetAction" >}}">HTTPGetAction</a></em></td>
      <td>HTTPGet specifies an HTTP GET request to perform.</td>
    </tr>
    <tr>
      <td><code>sleep</code><br/><em><a href="{{< ref "#SleepAction" >}}">SleepAction</a></em></td>
      <td>Sleep represents a duration that the container should sleep.</td>
    </tr>
    <tr>
      <td><code>tcpSocket</code><br/><em><a href="{{< ref "#TCPSocketAction" >}}">TCPSocketAction</a></em></td>
      <td>Deprecated. TCPSocket is NOT supported as a LifecycleHandler and kept for backward compatibility. There is no validation of this field and lifecycle hooks will fail at runtime when it is specified.</td>
    </tr>
  </tbody>
</table>


## LinuxContainerUser {#LinuxContainerUser}

LinuxContainerUser represents user identity information in Linux containers

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>gid</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>GID is the primary gid initially attached to the first process in the container</td>
    </tr>
    <tr>
      <td><code>supplementalGroups</code><br/><em>integer array</em></td>
      <td>SupplementalGroups are the supplemental groups initially attached to the first process in the container</td>
    </tr>
    <tr>
      <td><code>uid</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>UID is the primary uid initially attached to the first process in the container</td>
    </tr>
  </tbody>
</table>


## NodeAffinity {#NodeAffinity}

Node affinity is a group of node affinity scheduling rules.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>preferredDuringSchedulingIgnoredDuringExecution</code><br/><em><a href="{{< ref "#PreferredSchedulingTerm" >}}">PreferredSchedulingTerm array</a></em></td>
      <td>The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node matches the corresponding matchExpressions; the node(s) with the highest sum are the most preferred.</td>
    </tr>
    <tr>
      <td><code>requiredDuringSchedulingIgnoredDuringExecution</code><br/><em><a href="{{< ref "../definitions/node-selector-v1#NodeSelector" >}}">NodeSelector</a></em></td>
      <td>If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to an update), the system may or may not try to eventually evict the pod from its node.</td>
    </tr>
  </tbody>
</table>


## NodeAllocatableResourceClaimStatus {#NodeAllocatableResourceClaimStatus}

NodeAllocatableResourceClaimStatus describes the status of node allocatable resources allocated via DRA.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>containers</code><br/><em>string array</em></td>
      <td>Containers lists the names of all containers in this pod that reference the claim.</td>
    </tr>
    <tr>
      <td><code>resourceClaimName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>ResourceClaimName is the resource claim referenced by the pod that resulted in this node allocatable resource allocation.</td>
    </tr>
    <tr>
      <td><code>resources</code>&nbsp;<strong>*</strong><br/><em>object</em></td>
      <td>Resources is a map of the node-allocatable resource name to the aggregate quantity allocated to the claim.</td>
    </tr>
  </tbody>
</table>


## ObjectFieldSelector {#ObjectFieldSelector}

ObjectFieldSelector selects an APIVersioned field of an object.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>Version of the schema the FieldPath is written in terms of, defaults to "v1".</td>
    </tr>
    <tr>
      <td><code>fieldPath</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Path of the field to select in the specified API version.</td>
    </tr>
  </tbody>
</table>


## PersistentVolumeClaimTemplate {#PersistentVolumeClaimTemplate}

PersistentVolumeClaimTemplate is used to produce PersistentVolumeClaim objects as part of an EphemeralVolumeSource.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>May contain labels and annotations that will be copied into the PVC when creating it. No other fields are allowed and will be rejected during validation.</td>
    </tr>
    <tr>
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "persistent-volume-claim-v1#PersistentVolumeClaimSpec" >}}">PersistentVolumeClaimSpec</a></em></td>
      <td>The specification for the PersistentVolumeClaim. The entire content is copied unchanged into the PVC that gets created from this template. The same fields as in a PersistentVolumeClaim are also valid here.</td>
    </tr>
  </tbody>
</table>


## PersistentVolumeClaimVolumeSource {#PersistentVolumeClaimVolumeSource}

PersistentVolumeClaimVolumeSource references the user&#39;s PVC in the same namespace. This volume finds the bound PV and mounts that volume for the pod. A PersistentVolumeClaimVolumeSource is, essentially, a wrapper around another type of volume that is owned by someone else (the system).

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>claimName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>claimName is the name of a PersistentVolumeClaim in the same namespace as the pod using this volume. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly Will force the ReadOnly setting in VolumeMounts. Default false.</td>
    </tr>
  </tbody>
</table>


## PodAffinity {#PodAffinity}

Pod affinity is a group of inter pod affinity scheduling rules.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>preferredDuringSchedulingIgnoredDuringExecution</code><br/><em><a href="{{< ref "#WeightedPodAffinityTerm" >}}">WeightedPodAffinityTerm array</a></em></td>
      <td>The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.</td>
    </tr>
    <tr>
      <td><code>requiredDuringSchedulingIgnoredDuringExecution</code><br/><em><a href="{{< ref "#PodAffinityTerm" >}}">PodAffinityTerm array</a></em></td>
      <td>If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.</td>
    </tr>
  </tbody>
</table>


## PodAffinityTerm {#PodAffinityTerm}

Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key &lt;topologyKey&gt; matches that of any node on which a pod of the set of pods is running

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>labelSelector</code><br/><em><a href="{{< ref "../definitions/label-selector-v1-meta#LabelSelector" >}}">LabelSelector</a></em></td>
      <td>A label query over a set of resources, in this case pods. If it's null, this PodAffinityTerm matches with no Pods.</td>
    </tr>
    <tr>
      <td><code>matchLabelKeys</code><br/><em>string array</em></td>
      <td>MatchLabelKeys is a set of pod label keys to select which pods will be taken into consideration. The keys are used to lookup values from the incoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)` to select the group of existing pods which pods will be taken into consideration for the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming pod labels will be ignored. The default value is empty. The same key is forbidden to exist in both matchLabelKeys and labelSelector. Also, matchLabelKeys cannot be set when labelSelector isn't set.</td>
    </tr>
    <tr>
      <td><code>mismatchLabelKeys</code><br/><em>string array</em></td>
      <td>MismatchLabelKeys is a set of pod label keys to select which pods will be taken into consideration. The keys are used to lookup values from the incoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)` to select the group of existing pods which pods will be taken into consideration for the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming pod labels will be ignored. The default value is empty. The same key is forbidden to exist in both mismatchLabelKeys and labelSelector. Also, mismatchLabelKeys cannot be set when labelSelector isn't set.</td>
    </tr>
    <tr>
      <td><code>namespaceSelector</code><br/><em><a href="{{< ref "../definitions/label-selector-v1-meta#LabelSelector" >}}">LabelSelector</a></em></td>
      <td>A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.</td>
    </tr>
    <tr>
      <td><code>namespaces</code><br/><em>string array</em></td>
      <td>namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".</td>
    </tr>
    <tr>
      <td><code>topologyKey</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.</td>
    </tr>
  </tbody>
</table>


## PodAntiAffinity {#PodAntiAffinity}

Pod anti affinity is a group of inter pod anti affinity scheduling rules.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>preferredDuringSchedulingIgnoredDuringExecution</code><br/><em><a href="{{< ref "#WeightedPodAffinityTerm" >}}">WeightedPodAffinityTerm array</a></em></td>
      <td>The scheduler will prefer to schedule pods to nodes that satisfy the anti-affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling anti-affinity expressions, etc.), compute a sum by iterating through the elements of this field and subtracting "weight" from the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.</td>
    </tr>
    <tr>
      <td><code>requiredDuringSchedulingIgnoredDuringExecution</code><br/><em><a href="{{< ref "#PodAffinityTerm" >}}">PodAffinityTerm array</a></em></td>
      <td>If the anti-affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the anti-affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.</td>
    </tr>
  </tbody>
</table>


## PodCertificateProjection {#PodCertificateProjection}

PodCertificateProjection provides a private key and X.509 certificate in the pod filesystem.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>certificateChainPath</code><br/><em>string</em></td>
      <td>Write the certificate chain at this path in the projected volume.  Most applications should use credentialBundlePath.  When using keyPath and certificateChainPath, your application needs to check that the key and leaf certificate are consistent, because it is possible to read the files mid-rotation.</td>
    </tr>
    <tr>
      <td><code>credentialBundlePath</code><br/><em>string</em></td>
      <td>Write the credential bundle at this path in the projected volume.  The credential bundle is a single file that contains multiple PEM blocks. The first PEM block is a PRIVATE KEY block, containing a PKCS#8 private key.  The remaining blocks are CERTIFICATE blocks, containing the issued certificate chain from the signer (leaf and any intermediates).  Using credentialBundlePath lets your Pod's application code make a single atomic read that retrieves a consistent key and certificate chain.  If you project them to separate files, your application code will need to additionally check that the leaf certificate was issued to the key.</td>
    </tr>
    <tr>
      <td><code>keyPath</code><br/><em>string</em></td>
      <td>Write the key at this path in the projected volume.  Most applications should use credentialBundlePath.  When using keyPath and certificateChainPath, your application needs to check that the key and leaf certificate are consistent, because it is possible to read the files mid-rotation.</td>
    </tr>
    <tr>
      <td><code>keyType</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>The type of keypair Kubelet will generate for the pod.  Valid values are "RSA3072", "RSA4096", "ECDSAP256", "ECDSAP384", "ECDSAP521", and "ED25519".</td>
    </tr>
    <tr>
      <td><code>maxExpirationSeconds</code><br/><em>integer</em></td>
      <td>maxExpirationSeconds is the maximum lifetime permitted for the certificate.  Kubelet copies this value verbatim into the PodCertificateRequests it generates for this projection.  If omitted, kube-apiserver will set it to 86400(24 hours). kube-apiserver will reject values shorter than 3600 (1 hour).  The maximum allowable value is 7862400 (91 days).  The signer implementation is then free to issue a certificate with any lifetime *shorter* than MaxExpirationSeconds, but no shorter than 3600 seconds (1 hour).  This constraint is enforced by kube-apiserver. `kubernetes.io` signers will never issue certificates with a lifetime longer than 24 hours.</td>
    </tr>
    <tr>
      <td><code>signerName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Kubelet's generated CSRs will be addressed to this signer.</td>
    </tr>
    <tr>
      <td><code>userAnnotations</code><br/><em>object</em></td>
      <td>userAnnotations allow pod authors to pass additional information to the signer implementation.  Kubernetes does not restrict or validate this metadata in any way.  These values are copied verbatim into the `spec.unverifiedUserAnnotations` field of the PodCertificateRequest objects that Kubelet creates.  Entries are subject to the same validation as object metadata annotations, with the addition that all keys must be domain-prefixed. No restrictions are placed on values, except an overall size limitation on the entire field.  Signers should document the keys and values they support. Signers should deny requests that contain keys they do not recognize.</td>
    </tr>
  </tbody>
</table>


## PodCondition {#PodCondition}

PodCondition contains details for the current condition of this pod.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>lastProbeTime</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>Last time we probed the condition.</td>
    </tr>
    <tr>
      <td><code>lastTransitionTime</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>Last time the condition transitioned from one status to another.</td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>Human-readable message indicating details about last transition.</td>
    </tr>
    <tr>
      <td><code>observedGeneration</code><br/><em>integer</em></td>
      <td>If set, this represents the .metadata.generation that the pod condition was set based upon.</td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>Unique, one-word, CamelCase reason for the condition's last transition.</td>
    </tr>
    <tr>
      <td><code>status</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Status is the status of the condition. Can be True, False, Unknown. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions</td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Type is the type of the condition. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions</td>
    </tr>
  </tbody>
</table>


## PodDNSConfig {#PodDNSConfig}

PodDNSConfig defines the DNS parameters of a pod in addition to those generated from DNSPolicy.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>nameservers</code><br/><em>string array</em></td>
      <td>A list of DNS name server IP addresses. This will be appended to the base nameservers generated from DNSPolicy. Duplicated nameservers will be removed.</td>
    </tr>
    <tr>
      <td><code>options</code><br/><em><a href="{{< ref "#PodDNSConfigOption" >}}">PodDNSConfigOption array</a></em></td>
      <td>A list of DNS resolver options. This will be merged with the base options generated from DNSPolicy. Duplicated entries will be removed. Resolution options given in Options will override those that appear in the base DNSPolicy.</td>
    </tr>
    <tr>
      <td><code>searches</code><br/><em>string array</em></td>
      <td>A list of DNS search domains for host-name lookup. This will be appended to the base search paths generated from DNSPolicy. Duplicated search paths will be removed.</td>
    </tr>
  </tbody>
</table>


## PodDNSConfigOption {#PodDNSConfigOption}

PodDNSConfigOption defines DNS resolver options of a pod.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Name is this DNS resolver option's name. Required.</td>
    </tr>
    <tr>
      <td><code>value</code><br/><em>string</em></td>
      <td>Value is this DNS resolver option's value.</td>
    </tr>
  </tbody>
</table>


## PodExtendedResourceClaimStatus {#PodExtendedResourceClaimStatus}

PodExtendedResourceClaimStatus is stored in the PodStatus for the extended resource requests backed by DRA. It stores the generated name for the corresponding special ResourceClaim created by the scheduler.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>requestMappings</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#ContainerExtendedResourceRequest" >}}">ContainerExtendedResourceRequest array</a></em></td>
      <td>RequestMappings identifies the mapping of \<container, extended resource backed by DRA> to  device request in the generated ResourceClaim.</td>
    </tr>
    <tr>
      <td><code>resourceClaimName</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>ResourceClaimName is the name of the ResourceClaim that was generated for the Pod in the namespace of the Pod.</td>
    </tr>
  </tbody>
</table>


## PodIP {#PodIP}

PodIP represents a single IP address allocated to the pod.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>ip</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>IP is the IP address assigned to the pod</td>
    </tr>
  </tbody>
</table>


## PodOS {#PodOS}

PodOS defines the OS parameters of a pod.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name is the name of the operating system. The currently supported values are linux and windows. Additional value may be defined in future and can be one of: https://github.com/opencontainers/runtime-spec/blob/master/config.md#platform-specific-configuration Clients should expect to handle additional values and treat unrecognized values in this field as os: null</td>
    </tr>
  </tbody>
</table>


## PodReadinessGate {#PodReadinessGate}

PodReadinessGate contains the reference to a pod condition

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>conditionType</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>ConditionType refers to a condition in the pod's condition list with matching type.</td>
    </tr>
  </tbody>
</table>


## PodResourceClaim {#PodResourceClaim}

PodResourceClaim references exactly one ResourceClaim, either directly or by naming a ResourceClaimTemplate which is then turned into a ResourceClaim for the pod.

It adds a name to it that uniquely identifies the ResourceClaim inside the Pod. Containers that need access to the ResourceClaim reference it with this name.

When the DRAWorkloadResourceClaims feature gate is enabled and this Pod belongs to a PodGroup, a PodResourceClaim is matched to a PodGroupResourceClaim if all of their fields are equal (Name, ResourceClaimName, and ResourceClaimTemplateName). A matched claim references a single ResourceClaim shared across all Pods in the PodGroup, reserved for the PodGroup in ResourceClaimStatus.ReservedFor rather than for individual Pods.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name uniquely identifies this resource claim inside the pod. This must be a DNS_LABEL.</td>
    </tr>
    <tr>
      <td><code>resourceClaimName</code><br/><em>string</em></td>
      <td>ResourceClaimName is the name of a ResourceClaim object in the same namespace as this pod.  Exactly one of ResourceClaimName and ResourceClaimTemplateName must be set.</td>
    </tr>
    <tr>
      <td><code>resourceClaimTemplateName</code><br/><em>string</em></td>
      <td>ResourceClaimTemplateName is the name of a ResourceClaimTemplate object in the same namespace as this pod.  The template will be used to create a new ResourceClaim, which will be bound to this pod. When this pod is deleted, the ResourceClaim will also be deleted. The pod name and resource name, along with a generated component, will be used to form a unique name for the ResourceClaim, which will be recorded in pod.status.resourceClaimStatuses.  When the DRAWorkloadResourceClaims feature gate is enabled and the pod belongs to a PodGroup that defines a PodGroupResourceClaim with the same Name and ResourceClaimTemplateName, this PodResourceClaim resolves to the ResourceClaim generated for the PodGroup. All pods in the group that define an equivalent PodResourceClaim matching the PodGroupResourceClaim's Name and ResourceClaimTemplateName share the same generated ResourceClaim. ResourceClaims generated for a PodGroup are owned by the PodGroup and their lifecycles are tied to the PodGroup instead of any individual pod.  This field is immutable and no changes will be made to the corresponding ResourceClaim by the control plane after creating the ResourceClaim.  Exactly one of ResourceClaimName and ResourceClaimTemplateName must be set.</td>
    </tr>
  </tbody>
</table>


## PodSchedulingGate {#PodSchedulingGate}

PodSchedulingGate is associated to a Pod to guard its scheduling.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name of the scheduling gate. Each scheduling gate must have a unique name field.</td>
    </tr>
  </tbody>
</table>


## PodSchedulingGroup {#PodSchedulingGroup}

PodSchedulingGroup identifies the runtime scheduling group instance that a Pod belongs to. The scheduler uses this information to apply workload-aware scheduling semantics. Exactly one field must be specified.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>podGroupName</code><br/><em>string</em></td>
      <td>PodGroupName specifies the name of the standalone PodGroup object that represents the runtime instance of this group. Must be a DNS subdomain.</td>
    </tr>
  </tbody>
</table>


## PodSecurityContext {#PodSecurityContext}

PodSecurityContext holds pod-level security attributes and common container settings. Some fields are also present in container.securityContext.  Field values of container.securityContext take precedence over field values of PodSecurityContext.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>appArmorProfile</code><br/><em><a href="{{< ref "#AppArmorProfile" >}}">AppArmorProfile</a></em></td>
      <td>appArmorProfile is the AppArmor options to use by the containers in this pod. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>fsGroup</code><br/><em>integer</em></td>
      <td>A special supplemental group that applies to all containers in a pod. Some volume types allow the Kubelet to change the ownership of that volume to be owned by the pod:  1. The owning GID will be the FSGroup 2. The setgid bit is set (new files created in the volume will be owned by FSGroup) 3. The permission bits are OR'd with rw-rw----  If unset, the Kubelet will not modify the ownership and permissions of any volume. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>fsGroupChangePolicy</code><br/><em>string</em></td>
      <td>fsGroupChangePolicy defines behavior of changing ownership and permission of the volume before being exposed inside Pod. This field will only apply to volume types which support fsGroup based ownership(and permissions). It will have no effect on ephemeral volume types such as: secret, configmaps and emptydir. Valid values are "OnRootMismatch" and "Always". If not specified, "Always" is used. Note that this field cannot be set when spec.os.name is windows.<br/><br/>Possible enum values:<br/> - `"Always"` indicates that volume's ownership and permissions should always be changed whenever volume is mounted inside a Pod. This the default behavior.<br/> - `"OnRootMismatch"` indicates that volume's ownership and permissions will be changed only when permission and ownership of root directory does not match with expected permissions on the volume. This can help shorten the time it takes to change ownership and permissions of a volume.</td>
    </tr>
    <tr>
      <td><code>runAsGroup</code><br/><em>integer</em></td>
      <td>The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>runAsNonRoot</code><br/><em>boolean</em></td>
      <td>Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.</td>
    </tr>
    <tr>
      <td><code>runAsUser</code><br/><em>integer</em></td>
      <td>The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>seLinuxChangePolicy</code><br/><em>string</em></td>
      <td>seLinuxChangePolicy defines how the container's SELinux label is applied to all volumes used by the Pod. It has no effect on nodes that do not support SELinux or to volumes does not support SELinux. Valid values are "MountOption" and "Recursive".  "Recursive" means relabeling of all files on all Pod volumes by the container runtime. This may be slow for large volumes, but allows mixing privileged and unprivileged Pods sharing the same volume on the same node.  "MountOption" mounts all eligible Pod volumes with `-o context` mount option. This requires all Pods that share the same volume to use the same SELinux label. It is not possible to share the same volume among privileged and unprivileged Pods. Eligible volumes are in-tree FibreChannel and iSCSI volumes, and all CSI volumes whose CSI driver announces SELinux support by setting spec.seLinuxMount: true in their CSIDriver instance. Other volumes are always re-labelled recursively. "MountOption" value is allowed only when SELinuxMount feature gate is enabled.  If not specified and SELinuxMount feature gate is enabled, "MountOption" is used. If not specified and SELinuxMount feature gate is disabled, "MountOption" is used for ReadWriteOncePod volumes and "Recursive" for all other volumes.  This field affects only Pods that have SELinux label set, either in PodSecurityContext or in SecurityContext of all containers.  All Pods that use the same volume should use the same seLinuxChangePolicy, otherwise some pods can get stuck in ContainerCreating state. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>seLinuxOptions</code><br/><em><a href="{{< ref "#SELinuxOptions" >}}">SELinuxOptions</a></em></td>
      <td>The SELinux context to be applied to all containers. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>seccompProfile</code><br/><em><a href="{{< ref "#SeccompProfile" >}}">SeccompProfile</a></em></td>
      <td>The seccomp options to use by the containers in this pod. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>supplementalGroups</code><br/><em>integer array</em></td>
      <td>A list of groups applied to the first process run in each container, in addition to the container's primary GID and fsGroup (if specified).  If the SupplementalGroupsPolicy feature is enabled, the supplementalGroupsPolicy field determines whether these are in addition to or instead of any group memberships defined in the container image. If unspecified, no additional groups are added, though group memberships defined in the container image may still be used, depending on the supplementalGroupsPolicy field. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>supplementalGroupsPolicy</code><br/><em>string</em></td>
      <td>Defines how supplemental groups of the first container processes are calculated. Valid values are "Merge" and "Strict". If not specified, "Merge" is used. (Alpha) Using the field requires the SupplementalGroupsPolicy feature gate to be enabled and the container runtime must implement support for this feature. Note that this field cannot be set when spec.os.name is windows.<br/><br/>Possible enum values:<br/> - `"Merge"` means that the container's provided SupplementalGroups and FsGroup (specified in SecurityContext) will be merged with the primary user's groups as defined in the container image (in /etc/group).<br/> - `"Strict"` means that the container's provided SupplementalGroups and FsGroup (specified in SecurityContext) will be used instead of any groups defined in the container image.</td>
    </tr>
    <tr>
      <td><code>sysctls</code><br/><em><a href="{{< ref "#Sysctl" >}}">Sysctl array</a></em></td>
      <td>Sysctls hold a list of namespaced sysctls used for the pod. Pods with unsupported sysctls (by the container runtime) might fail to launch. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>windowsOptions</code><br/><em><a href="{{< ref "#WindowsSecurityContextOptions" >}}">WindowsSecurityContextOptions</a></em></td>
      <td>The Windows specific settings applied to all containers. If unspecified, the options within a container's SecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.</td>
    </tr>
  </tbody>
</table>


## PreferredSchedulingTerm {#PreferredSchedulingTerm}

An empty preferred scheduling term matches all objects with implicit weight 0 (i.e. it&#39;s a no-op). A null preferred scheduling term matches no objects (i.e. is also a no-op).

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>preference</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "../definitions/node-selector-term-v1#NodeSelectorTerm" >}}">NodeSelectorTerm</a></em></td>
      <td>A node selector term, associated with the corresponding weight.</td>
    </tr>
    <tr>
      <td><code>weight</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100.</td>
    </tr>
  </tbody>
</table>


## Probe {#Probe}

Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>exec</code><br/><em><a href="{{< ref "#ExecAction" >}}">ExecAction</a></em></td>
      <td>Exec specifies a command to execute in the container.</td>
    </tr>
    <tr>
      <td><code>failureThreshold</code><br/><em>integer</em></td>
      <td>Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.</td>
    </tr>
    <tr>
      <td><code>grpc</code><br/><em><a href="{{< ref "#GRPCAction" >}}">GRPCAction</a></em></td>
      <td>GRPC specifies a GRPC HealthCheckRequest.</td>
    </tr>
    <tr>
      <td><code>httpGet</code><br/><em><a href="{{< ref "#HTTPGetAction" >}}">HTTPGetAction</a></em></td>
      <td>HTTPGet specifies an HTTP GET request to perform.</td>
    </tr>
    <tr>
      <td><code>initialDelaySeconds</code><br/><em>integer</em></td>
      <td>Number of seconds after the container has started before liveness probes are initiated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes</td>
    </tr>
    <tr>
      <td><code>periodSeconds</code><br/><em>integer</em></td>
      <td>How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1.</td>
    </tr>
    <tr>
      <td><code>successThreshold</code><br/><em>integer</em></td>
      <td>Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup. Minimum value is 1.</td>
    </tr>
    <tr>
      <td><code>tcpSocket</code><br/><em><a href="{{< ref "#TCPSocketAction" >}}">TCPSocketAction</a></em></td>
      <td>TCPSocket specifies a connection to a TCP port.</td>
    </tr>
    <tr>
      <td><code>terminationGracePeriodSeconds</code><br/><em>integer</em></td>
      <td>Optional duration in seconds the pod needs to terminate gracefully upon probe failure. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. If this value is nil, the pod's terminationGracePeriodSeconds will be used. Otherwise, this value overrides the value provided by the pod spec. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). This is a beta field and requires enabling ProbeTerminationGracePeriod feature gate. Minimum value is 1. spec.terminationGracePeriodSeconds is used if unset.</td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code><br/><em>integer</em></td>
      <td>Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes</td>
    </tr>
  </tbody>
</table>


## ProjectedVolumeSource {#ProjectedVolumeSource}

Represents a projected volume source

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>defaultMode</code><br/><em>integer</em></td>
      <td>defaultMode are the mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.</td>
    </tr>
    <tr>
      <td><code>sources</code><br/><em><a href="{{< ref "#VolumeProjection" >}}">VolumeProjection array</a></em></td>
      <td>sources is the list of volume projections. Each entry in this list handles one source.</td>
    </tr>
  </tbody>
</table>


## RBDVolumeSource {#RBDVolumeSource}

Represents a Rados Block Device mount that lasts the lifetime of a pod. RBD volumes support ownership management and SELinux relabeling.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#rbd</td>
    </tr>
    <tr>
      <td><code>image</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>image is the rados image name. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</td>
    </tr>
    <tr>
      <td><code>keyring</code><br/><em>string</em></td>
      <td>keyring is the path to key ring for RBDUser. Default is /etc/ceph/keyring. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</td>
    </tr>
    <tr>
      <td><code>monitors</code>&nbsp;<strong>*</strong><br/><em>string array</em></td>
      <td>monitors is a collection of Ceph monitors. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</td>
    </tr>
    <tr>
      <td><code>pool</code><br/><em>string</em></td>
      <td>pool is the rados pool name. Default is rbd. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>secretRef is name of the authentication secret for RBDUser. If provided overrides keyring. Default is nil. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</td>
    </tr>
    <tr>
      <td><code>user</code><br/><em>string</em></td>
      <td>user is the rados user name. Default is admin. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it</td>
    </tr>
  </tbody>
</table>


## ResourceClaim {#ResourceClaim}

ResourceClaim references one entry in PodSpec.ResourceClaims.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name must match the name of one entry in pod.spec.resourceClaims of the Pod where this field is used. It makes that resource available inside a container.</td>
    </tr>
    <tr>
      <td><code>request</code><br/><em>string</em></td>
      <td>Request is the name chosen for a request in the referenced claim. If empty, everything from the claim is made available, otherwise only the result of this request.</td>
    </tr>
  </tbody>
</table>


## ResourceFieldSelector {#ResourceFieldSelector}

ResourceFieldSelector represents container resources (cpu, memory) and their output format

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>containerName</code><br/><em>string</em></td>
      <td>Container name: required for volumes, optional for env vars</td>
    </tr>
    <tr>
      <td><code>divisor</code><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td>Specifies the output format of the exposed resources, defaults to "1"</td>
    </tr>
    <tr>
      <td><code>resource</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Required: resource to select</td>
    </tr>
  </tbody>
</table>


## ResourceHealth {#ResourceHealth}

ResourceHealth represents the health of a resource. It has the latest device health information. This is a part of KEP https://kep.k8s.io/4680.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>health</code><br/><em>string</em></td>
      <td>Health of the resource. can be one of:  - Healthy: operates as normal  - Unhealthy: reported unhealthy. We consider this a temporary health issue               since we do not have a mechanism today to distinguish               temporary and permanent issues.  - Unknown: The status cannot be determined.             For example, Device Plugin got unregistered and hasn't been re-registered since.  In future we may want to introduce the PermanentlyUnhealthy Status.</td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>Message provides human-readable context for Health (e.g. "ECC error count exceeded threshold"). This field is populated by the kubelet when ResourceHealthStatusMessage is enabled if the DRA plugin returns a message, and is null otherwise.</td>
    </tr>
    <tr>
      <td><code>resourceID</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>ResourceID is the unique identifier of the resource. See the ResourceID type for more information.</td>
    </tr>
  </tbody>
</table>


## ResourceRequirements {#ResourceRequirements}

ResourceRequirements describes the compute resource requirements.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>claims</code><br/><em><a href="{{< ref "#ResourceClaim" >}}">ResourceClaim array</a></em></td>
      <td>Claims lists the names of resources, defined in spec.resourceClaims, that are used by this container.  This field depends on the DynamicResourceAllocation feature gate.  This field is immutable. It can only be set for containers.</td>
    </tr>
    <tr>
      <td><code>limits</code><br/><em>object</em></td>
      <td>Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/</td>
    </tr>
    <tr>
      <td><code>requests</code><br/><em>object</em></td>
      <td>Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/</td>
    </tr>
  </tbody>
</table>


## ResourceStatus {#ResourceStatus}

ResourceStatus represents the status of a single resource allocated to a Pod.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name of the resource. Must be unique within the pod and in case of non-DRA resource, match one of the resources from the pod spec. For DRA resources, the value must be "claim:\<claim_name>/\<request>". When this status is reported about a container, the "claim_name" and "request" must match one of the claims of this container.</td>
    </tr>
    <tr>
      <td><code>resources</code><br/><em><a href="{{< ref "#ResourceHealth" >}}">ResourceHealth array</a></em></td>
      <td>List of unique resources health. Each element in the list contains an unique resource ID and its health. At a minimum, for the lifetime of a Pod, resource ID must uniquely identify the resource allocated to the Pod on the Node. If other Pod on the same Node reports the status with the same resource ID, it must be the same resource they share. See ResourceID type definition for a specific format it has in various use cases.</td>
    </tr>
  </tbody>
</table>


## SELinuxOptions {#SELinuxOptions}

SELinuxOptions are the labels to be applied to the container

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>level</code><br/><em>string</em></td>
      <td>Level is SELinux level label that applies to the container.</td>
    </tr>
    <tr>
      <td><code>role</code><br/><em>string</em></td>
      <td>Role is a SELinux role label that applies to the container.</td>
    </tr>
    <tr>
      <td><code>type</code><br/><em>string</em></td>
      <td>Type is a SELinux type label that applies to the container.</td>
    </tr>
    <tr>
      <td><code>user</code><br/><em>string</em></td>
      <td>User is a SELinux user label that applies to the container.</td>
    </tr>
  </tbody>
</table>


## ScaleIOVolumeSource {#ScaleIOVolumeSource}

ScaleIOVolumeSource represents a persistent ScaleIO volume

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Default is "xfs".</td>
    </tr>
    <tr>
      <td><code>gateway</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>gateway is the host address of the ScaleIO API Gateway.</td>
    </tr>
    <tr>
      <td><code>protectionDomain</code><br/><em>string</em></td>
      <td>protectionDomain is the name of the ScaleIO Protection Domain for the configured storage.</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.</td>
    </tr>
    <tr>
      <td><code>secretRef</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>secretRef references to the secret for ScaleIO user and other sensitive information. If this is not provided, Login operation will fail.</td>
    </tr>
    <tr>
      <td><code>sslEnabled</code><br/><em>boolean</em></td>
      <td>sslEnabled Flag enable/disable SSL communication with Gateway, default false</td>
    </tr>
    <tr>
      <td><code>storageMode</code><br/><em>string</em></td>
      <td>storageMode indicates whether the storage for a volume should be ThickProvisioned or ThinProvisioned. Default is ThinProvisioned.</td>
    </tr>
    <tr>
      <td><code>storagePool</code><br/><em>string</em></td>
      <td>storagePool is the ScaleIO Storage Pool associated with the protection domain.</td>
    </tr>
    <tr>
      <td><code>system</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>system is the name of the storage system as configured in ScaleIO.</td>
    </tr>
    <tr>
      <td><code>volumeName</code><br/><em>string</em></td>
      <td>volumeName is the name of a volume already created in the ScaleIO system that is associated with this volume source.</td>
    </tr>
  </tbody>
</table>


## SeccompProfile {#SeccompProfile}

SeccompProfile defines a pod/container&#39;s seccomp profile settings. Only one profile source may be set.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>localhostProfile</code><br/><em>string</em></td>
      <td>localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must be set if type is "Localhost". Must NOT be set for any other type.</td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>type indicates which kind of seccomp profile will be applied. Valid options are:  Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.<br/><br/>Possible enum values:<br/> - `"Localhost"` indicates a profile defined in a file on the node should be used. The file's location relative to \<kubelet-root-dir>/seccomp.<br/> - `"RuntimeDefault"` represents the default container runtime seccomp profile.<br/> - `"Unconfined"` indicates no seccomp profile is applied (A.K.A. unconfined).</td>
    </tr>
  </tbody>
</table>


## SecretEnvSource {#SecretEnvSource}

SecretEnvSource selects a Secret to populate the environment variables with.

The contents of the target Secret&#39;s Data field will represent the key-value pairs as environment variables.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>Specify whether the Secret must be defined</td>
    </tr>
  </tbody>
</table>


## SecretKeySelector {#SecretKeySelector}

SecretKeySelector selects a key of a Secret.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>key</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>The key of the secret to select from.  Must be a valid secret key.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>Specify whether the Secret or its key must be defined</td>
    </tr>
  </tbody>
</table>


## SecretProjection {#SecretProjection}

Adapts a secret into a projected volume.

The contents of the target Secret&#39;s Data field will be presented in a projected volume as files using the keys in the Data field as the file names. Note that this is identical to a secret volume source without the default mode.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>items</code><br/><em><a href="{{< ref "#KeyToPath" >}}">KeyToPath array</a></em></td>
      <td>items if unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>optional field specify whether the Secret or its key must be defined</td>
    </tr>
  </tbody>
</table>


## SecretVolumeSource {#SecretVolumeSource}

Adapts a Secret into a volume.

The contents of the target Secret&#39;s Data field will be presented in a volume as files using the keys in the Data field as the file names. Secret volumes support ownership management and SELinux relabeling.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>defaultMode</code><br/><em>integer</em></td>
      <td>defaultMode is Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.</td>
    </tr>
    <tr>
      <td><code>items</code><br/><em><a href="{{< ref "#KeyToPath" >}}">KeyToPath array</a></em></td>
      <td>items If unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.</td>
    </tr>
    <tr>
      <td><code>optional</code><br/><em>boolean</em></td>
      <td>optional field specify whether the Secret or its keys must be defined</td>
    </tr>
    <tr>
      <td><code>secretName</code><br/><em>string</em></td>
      <td>secretName is the name of the secret in the pod's namespace to use. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret</td>
    </tr>
  </tbody>
</table>


## SecurityContext {#SecurityContext}

SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext.  When both are set, the values in SecurityContext take precedence.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowPrivilegeEscalation</code><br/><em>boolean</em></td>
      <td>AllowPrivilegeEscalation controls whether a process can gain more privileges than its parent process. This bool directly controls if the no_new_privs flag will be set on the container process. AllowPrivilegeEscalation is true always when the container is: 1) run as Privileged 2) has CAP_SYS_ADMIN Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>appArmorProfile</code><br/><em><a href="{{< ref "#AppArmorProfile" >}}">AppArmorProfile</a></em></td>
      <td>appArmorProfile is the AppArmor options to use by this container. If set, this profile overrides the pod's appArmorProfile. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>capabilities</code><br/><em><a href="{{< ref "#Capabilities" >}}">Capabilities</a></em></td>
      <td>The capabilities to add/drop when running containers. Defaults to the default set of capabilities granted by the container runtime. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>privileged</code><br/><em>boolean</em></td>
      <td>Run container in privileged mode. Processes in privileged containers are essentially equivalent to root on the host. Defaults to false. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>procMount</code><br/><em>string</em></td>
      <td>procMount denotes the type of proc mount to use for the containers. The default value is Default which uses the container runtime defaults for readonly paths and masked paths. Note that this field cannot be set when spec.os.name is windows.<br/><br/>Possible enum values:<br/> - `"Default"` uses the container runtime defaults for readonly and masked paths for /proc. Most container runtimes mask certain paths in /proc to avoid accidental security exposure of special devices or information.<br/> - `"Unmasked"` bypasses the default masking behavior of the container runtime and ensures the newly created /proc the container stays in tact with no modifications.</td>
    </tr>
    <tr>
      <td><code>readOnlyRootFilesystem</code><br/><em>boolean</em></td>
      <td>Whether this container has a read-only root filesystem. Default is false. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>runAsGroup</code><br/><em>integer</em></td>
      <td>The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>runAsNonRoot</code><br/><em>boolean</em></td>
      <td>Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.</td>
    </tr>
    <tr>
      <td><code>runAsUser</code><br/><em>integer</em></td>
      <td>The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>seLinuxOptions</code><br/><em><a href="{{< ref "#SELinuxOptions" >}}">SELinuxOptions</a></em></td>
      <td>The SELinux context to be applied to the container. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>seccompProfile</code><br/><em><a href="{{< ref "#SeccompProfile" >}}">SeccompProfile</a></em></td>
      <td>The seccomp options to use by this container. If seccomp options are provided at both the pod & container level, the container options override the pod options. Note that this field cannot be set when spec.os.name is windows.</td>
    </tr>
    <tr>
      <td><code>windowsOptions</code><br/><em><a href="{{< ref "#WindowsSecurityContextOptions" >}}">WindowsSecurityContextOptions</a></em></td>
      <td>The Windows specific settings applied to all containers. If unspecified, the options from the PodSecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.</td>
    </tr>
  </tbody>
</table>


## ServiceAccountTokenProjection {#ServiceAccountTokenProjection}

ServiceAccountTokenProjection represents a projected service account token volume. This projection can be used to insert a service account token into the pods runtime filesystem for use against APIs (Kubernetes API Server or otherwise).

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>audience</code><br/><em>string</em></td>
      <td>audience is the intended audience of the token. A recipient of a token must identify itself with an identifier specified in the audience of the token, and otherwise should reject the token. The audience defaults to the identifier of the apiserver.</td>
    </tr>
    <tr>
      <td><code>expirationSeconds</code><br/><em>integer</em></td>
      <td>expirationSeconds is the requested duration of validity of the service account token. As the token approaches expiration, the kubelet volume plugin will proactively rotate the service account token. The kubelet will start trying to rotate the token if the token is older than 80 percent of its time to live or if the token is older than 24 hours.Defaults to 1 hour and must be at least 10 minutes.</td>
    </tr>
    <tr>
      <td><code>path</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>path is the path relative to the mount point of the file to project the token into.</td>
    </tr>
  </tbody>
</table>


## SleepAction {#SleepAction}

SleepAction describes a &#34;sleep&#34; action.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>seconds</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>Seconds is the number of seconds to sleep.</td>
    </tr>
  </tbody>
</table>


## StorageOSVolumeSource {#StorageOSVolumeSource}

Represents a StorageOS persistent volume resource.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>fsType</code><br/><em>string</em></td>
      <td>fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.</td>
    </tr>
    <tr>
      <td><code>secretRef</code><br/><em><a href="{{< ref "../definitions/local-object-reference-v1#LocalObjectReference" >}}">LocalObjectReference</a></em></td>
      <td>secretRef specifies the secret to use for obtaining the StorageOS API credentials.  If not specified, default values will be attempted.</td>
    </tr>
    <tr>
      <td><code>volumeName</code><br/><em>string</em></td>
      <td>volumeName is the human-readable name of the StorageOS volume.  Volume names are only unique within a namespace.</td>
    </tr>
    <tr>
      <td><code>volumeNamespace</code><br/><em>string</em></td>
      <td>volumeNamespace specifies the scope of the volume within StorageOS.  If no namespace is specified then the Pod's namespace will be used.  This allows the Kubernetes name scoping to be mirrored within StorageOS for tighter integration. Set VolumeName to any name to override the default behaviour. Set to "default" if you are not using namespaces within StorageOS. Namespaces that do not pre-exist within StorageOS will be created.</td>
    </tr>
  </tbody>
</table>


## Sysctl {#Sysctl}

Sysctl defines a kernel parameter to be set

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name of a property to set</td>
    </tr>
    <tr>
      <td><code>value</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Value of a property to set</td>
    </tr>
  </tbody>
</table>


## TCPSocketAction {#TCPSocketAction}

TCPSocketAction describes an action based on opening a socket

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>host</code><br/><em>string</em></td>
      <td>Optional: Host name to connect to, defaults to the pod IP.</td>
    </tr>
    <tr>
      <td><code>port</code>&nbsp;<strong>*</strong><br/><em></em></td>
      <td>Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.</td>
    </tr>
  </tbody>
</table>


## TopologySpreadConstraint {#TopologySpreadConstraint}

TopologySpreadConstraint specifies how to spread matching pods among the given topology.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>labelSelector</code><br/><em><a href="{{< ref "../definitions/label-selector-v1-meta#LabelSelector" >}}">LabelSelector</a></em></td>
      <td>LabelSelector is used to find matching pods. Pods that match this label selector are counted to determine the number of pods in their corresponding topology domain.</td>
    </tr>
    <tr>
      <td><code>matchLabelKeys</code><br/><em>string array</em></td>
      <td>MatchLabelKeys is a set of pod label keys to select the pods over which spreading will be calculated. The keys are used to lookup values from the incoming pod labels, those key-value labels are ANDed with labelSelector to select the group of existing pods over which spreading will be calculated for the incoming pod. The same key is forbidden to exist in both MatchLabelKeys and LabelSelector. MatchLabelKeys cannot be set when LabelSelector isn't set. Keys that don't exist in the incoming pod labels will be ignored. A null or empty list means only match against labelSelector.  This is a beta field and requires the MatchLabelKeysInPodTopologySpread feature gate to be enabled (enabled by default).</td>
    </tr>
    <tr>
      <td><code>maxSkew</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>MaxSkew describes the degree to which pods may be unevenly distributed. When `whenUnsatisfiable=DoNotSchedule`, it is the maximum permitted difference between the number of matching pods in the target topology and the global minimum. The global minimum is the minimum number of matching pods in an eligible domain or zero if the number of eligible domains is less than MinDomains. For example, in a 3-zone cluster, MaxSkew is set to 1, and pods with the same labelSelector spread as 2/2/1: In this case, the global minimum is 1. | zone1 | zone2 | zone3 | |  P P  |  P P  |   P   | - if MaxSkew is 1, incoming pod can only be scheduled to zone3 to become 2/2/2; scheduling it onto zone1(zone2) would make the ActualSkew(3-1) on zone1(zone2) violate MaxSkew(1). - if MaxSkew is 2, incoming pod can be scheduled onto any zone. When `whenUnsatisfiable=ScheduleAnyway`, it is used to give higher precedence to topologies that satisfy it. It's a required field. Default value is 1 and 0 is not allowed.</td>
    </tr>
    <tr>
      <td><code>minDomains</code><br/><em>integer</em></td>
      <td>MinDomains indicates a minimum number of eligible domains. When the number of eligible domains with matching topology keys is less than minDomains, Pod Topology Spread treats "global minimum" as 0, and then the calculation of Skew is performed. And when the number of eligible domains with matching topology keys equals or greater than minDomains, this value has no effect on scheduling. As a result, when the number of eligible domains is less than minDomains, scheduler won't schedule more than maxSkew Pods to those domains. If value is nil, the constraint behaves as if MinDomains is equal to 1. Valid values are integers greater than 0. When value is not nil, WhenUnsatisfiable must be DoNotSchedule.  For example, in a 3-zone cluster, MaxSkew is set to 2, MinDomains is set to 5 and pods with the same labelSelector spread as 2/2/2: | zone1 | zone2 | zone3 | |  P P  |  P P  |  P P  | The number of domains is less than 5(MinDomains), so "global minimum" is treated as 0. In this situation, new pod with the same labelSelector cannot be scheduled, because computed skew will be 3(3 - 0) if new Pod is scheduled to any of the three zones, it will violate MaxSkew.</td>
    </tr>
    <tr>
      <td><code>nodeAffinityPolicy</code><br/><em>string</em></td>
      <td>NodeAffinityPolicy indicates how we will treat Pod's nodeAffinity/nodeSelector when calculating pod topology spread skew. Options are: - Honor: only nodes matching nodeAffinity/nodeSelector are included in the calculations. - Ignore: nodeAffinity/nodeSelector are ignored. All nodes are included in the calculations.  If this value is nil, the behavior is equivalent to the Honor policy.<br/><br/>Possible enum values:<br/> - `"Honor"` means use this scheduling directive when calculating pod topology spread skew.<br/> - `"Ignore"` means ignore this scheduling directive when calculating pod topology spread skew.</td>
    </tr>
    <tr>
      <td><code>nodeTaintsPolicy</code><br/><em>string</em></td>
      <td>NodeTaintsPolicy indicates how we will treat node taints when calculating pod topology spread skew. Options are: - Honor: nodes without taints, along with tainted nodes for which the incoming pod has a toleration, are included. - Ignore: node taints are ignored. All nodes are included.  If this value is nil, the behavior is equivalent to the Ignore policy.<br/><br/>Possible enum values:<br/> - `"Honor"` means use this scheduling directive when calculating pod topology spread skew.<br/> - `"Ignore"` means ignore this scheduling directive when calculating pod topology spread skew.</td>
    </tr>
    <tr>
      <td><code>topologyKey</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>TopologyKey is the key of node labels. Nodes that have a label with this key and identical values are considered to be in the same topology. We consider each \<key, value> as a "bucket", and try to put balanced number of pods into each bucket. We define a domain as a particular instance of a topology. Also, we define an eligible domain as a domain whose nodes meet the requirements of nodeAffinityPolicy and nodeTaintsPolicy. e.g. If TopologyKey is "kubernetes.io/hostname", each Node is a domain of that topology. And, if TopologyKey is "topology.kubernetes.io/zone", each zone is a domain of that topology. It's a required field.</td>
    </tr>
    <tr>
      <td><code>whenUnsatisfiable</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>WhenUnsatisfiable indicates how to deal with a pod if it doesn't satisfy the spread constraint. - DoNotSchedule (default) tells the scheduler not to schedule it. - ScheduleAnyway tells the scheduler to schedule the pod in any location,   but giving higher precedence to topologies that would help reduce the   skew. A constraint is considered "Unsatisfiable" for an incoming pod if and only if every possible node assignment for that pod would violate "MaxSkew" on some topology. For example, in a 3-zone cluster, MaxSkew is set to 1, and pods with the same labelSelector spread as 3/1/1: | zone1 | zone2 | zone3 | | P P P |   P   |   P   | If WhenUnsatisfiable is set to DoNotSchedule, incoming pod can only be scheduled to zone2(zone3) to become 3/2/1(3/1/2) as ActualSkew(2-1) on zone2(zone3) satisfies MaxSkew(1). In other words, the cluster can still be imbalanced, but scheduler won't make it *more* imbalanced. It's a required field.<br/><br/>Possible enum values:<br/> - `"DoNotSchedule"` instructs the scheduler not to schedule the pod when constraints are not satisfied.<br/> - `"ScheduleAnyway"` instructs the scheduler to schedule the pod even if constraints are not satisfied.</td>
    </tr>
  </tbody>
</table>


## Volume {#Volume}

Volume represents a named volume in a pod that may be accessed by any container in the pod.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>awsElasticBlockStore</code><br/><em><a href="{{< ref "persistent-volume-v1#AWSElasticBlockStoreVolumeSource" >}}">AWSElasticBlockStoreVolumeSource</a></em></td>
      <td>awsElasticBlockStore represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Deprecated: AWSElasticBlockStore is deprecated. All operations for the in-tree awsElasticBlockStore type are redirected to the ebs.csi.aws.com CSI driver. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore</td>
    </tr>
    <tr>
      <td><code>azureDisk</code><br/><em><a href="{{< ref "persistent-volume-v1#AzureDiskVolumeSource" >}}">AzureDiskVolumeSource</a></em></td>
      <td>azureDisk represents an Azure Data Disk mount on the host and bind mount to the pod. Deprecated: AzureDisk is deprecated. All operations for the in-tree azureDisk type are redirected to the disk.csi.azure.com CSI driver.</td>
    </tr>
    <tr>
      <td><code>azureFile</code><br/><em><a href="{{< ref "#AzureFileVolumeSource" >}}">AzureFileVolumeSource</a></em></td>
      <td>azureFile represents an Azure File Service mount on the host and bind mount to the pod. Deprecated: AzureFile is deprecated. All operations for the in-tree azureFile type are redirected to the file.csi.azure.com CSI driver.</td>
    </tr>
    <tr>
      <td><code>cephfs</code><br/><em><a href="{{< ref "#CephFSVolumeSource" >}}">CephFSVolumeSource</a></em></td>
      <td>cephFS represents a Ceph FS mount on the host that shares a pod's lifetime. Deprecated: CephFS is deprecated and the in-tree cephfs type is no longer supported.</td>
    </tr>
    <tr>
      <td><code>cinder</code><br/><em><a href="{{< ref "#CinderVolumeSource" >}}">CinderVolumeSource</a></em></td>
      <td>cinder represents a cinder volume attached and mounted on kubelets host machine. Deprecated: Cinder is deprecated. All operations for the in-tree cinder type are redirected to the cinder.csi.openstack.org CSI driver. More info: https://examples.k8s.io/mysql-cinder-pd/README.md</td>
    </tr>
    <tr>
      <td><code>configMap</code><br/><em><a href="{{< ref "#ConfigMapVolumeSource" >}}">ConfigMapVolumeSource</a></em></td>
      <td>configMap represents a configMap that should populate this volume</td>
    </tr>
    <tr>
      <td><code>csi</code><br/><em><a href="{{< ref "#CSIVolumeSource" >}}">CSIVolumeSource</a></em></td>
      <td>csi (Container Storage Interface) represents ephemeral storage that is handled by certain external CSI drivers.</td>
    </tr>
    <tr>
      <td><code>downwardAPI</code><br/><em><a href="{{< ref "#DownwardAPIVolumeSource" >}}">DownwardAPIVolumeSource</a></em></td>
      <td>downwardAPI represents downward API about the pod that should populate this volume</td>
    </tr>
    <tr>
      <td><code>emptyDir</code><br/><em><a href="{{< ref "#EmptyDirVolumeSource" >}}">EmptyDirVolumeSource</a></em></td>
      <td>emptyDir represents a temporary directory that shares a pod's lifetime. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir</td>
    </tr>
    <tr>
      <td><code>ephemeral</code><br/><em><a href="{{< ref "#EphemeralVolumeSource" >}}">EphemeralVolumeSource</a></em></td>
      <td>ephemeral represents a volume that is handled by a cluster storage driver. The volume's lifecycle is tied to the pod that defines it - it will be created before the pod starts, and deleted when the pod is removed.  Use this if: a) the volume is only needed while the pod runs, b) features of normal volumes like restoring from snapshot or capacity    tracking are needed, c) the storage driver is specified through a storage class, and d) the storage driver supports dynamic volume provisioning through    a PersistentVolumeClaim (see EphemeralVolumeSource for more    information on the connection between this volume type    and PersistentVolumeClaim).  Use PersistentVolumeClaim or one of the vendor-specific APIs for volumes that persist for longer than the lifecycle of an individual pod.  Use CSI for light-weight local ephemeral volumes if the CSI driver is meant to be used that way - see the documentation of the driver for more information.  A pod can use both types of ephemeral volumes and persistent volumes at the same time.</td>
    </tr>
    <tr>
      <td><code>fc</code><br/><em><a href="{{< ref "persistent-volume-v1#FCVolumeSource" >}}">FCVolumeSource</a></em></td>
      <td>fc represents a Fibre Channel resource that is attached to a kubelet's host machine and then exposed to the pod.</td>
    </tr>
    <tr>
      <td><code>flexVolume</code><br/><em><a href="{{< ref "#FlexVolumeSource" >}}">FlexVolumeSource</a></em></td>
      <td>flexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin. Deprecated: FlexVolume is deprecated. Consider using a CSIDriver instead.</td>
    </tr>
    <tr>
      <td><code>flocker</code><br/><em><a href="{{< ref "persistent-volume-v1#FlockerVolumeSource" >}}">FlockerVolumeSource</a></em></td>
      <td>flocker represents a Flocker volume attached to a kubelet's host machine. This depends on the Flocker control service being running. Deprecated: Flocker is deprecated and the in-tree flocker type is no longer supported.</td>
    </tr>
    <tr>
      <td><code>gcePersistentDisk</code><br/><em><a href="{{< ref "persistent-volume-v1#GCEPersistentDiskVolumeSource" >}}">GCEPersistentDiskVolumeSource</a></em></td>
      <td>gcePersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Deprecated: GCEPersistentDisk is deprecated. All operations for the in-tree gcePersistentDisk type are redirected to the pd.csi.storage.gke.io CSI driver. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk</td>
    </tr>
    <tr>
      <td><code>gitRepo</code><br/><em><a href="{{< ref "#GitRepoVolumeSource" >}}">GitRepoVolumeSource</a></em></td>
      <td>gitRepo represents a git repository at a particular revision. Deprecated: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container.</td>
    </tr>
    <tr>
      <td><code>glusterfs</code><br/><em><a href="{{< ref "#GlusterfsVolumeSource" >}}">GlusterfsVolumeSource</a></em></td>
      <td>glusterfs represents a Glusterfs mount on the host that shares a pod's lifetime. Deprecated: Glusterfs is deprecated and the in-tree glusterfs type is no longer supported.</td>
    </tr>
    <tr>
      <td><code>hostPath</code><br/><em><a href="{{< ref "persistent-volume-v1#HostPathVolumeSource" >}}">HostPathVolumeSource</a></em></td>
      <td>hostPath represents a pre-existing file or directory on the host machine that is directly exposed to the container. This is generally used for system agents or other privileged things that are allowed to see the host machine. Most containers will NOT need this. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath</td>
    </tr>
    <tr>
      <td><code>image</code><br/><em><a href="{{< ref "#ImageVolumeSource" >}}">ImageVolumeSource</a></em></td>
      <td>image represents an OCI object (a container image or artifact) pulled and mounted on the kubelet's host machine. The volume is resolved at pod startup depending on which PullPolicy value is provided:  - Always: the kubelet always attempts to pull the reference. Container creation will fail If the pull fails. - Never: the kubelet never pulls the reference and only uses a local image or artifact. Container creation will fail if the reference isn't present. - IfNotPresent: the kubelet pulls if the reference isn't already present on disk. Container creation will fail if the reference isn't present and the pull fails.  The volume gets re-resolved if the pod gets deleted and recreated, which means that new remote content will become available on pod recreation. A failure to resolve or pull the image during pod startup will block containers from starting and may add significant latency. Failures will be retried using normal volume backoff and will be reported on the pod reason and message. The types of objects that may be mounted by this volume are defined by the container runtime implementation on a host machine and at minimum must include all valid types supported by the container image field. The OCI object gets mounted in a single directory (spec.containers[*].volumeMounts.mountPath) by merging the manifest layers in the same way as for container images. The volume will be mounted read-only (ro). Sub path mounts for containers are not supported (spec.containers[*].volumeMounts.subpath) before 1.33. The field spec.securityContext.fsGroupChangePolicy has no effect on this volume type.</td>
    </tr>
    <tr>
      <td><code>iscsi</code><br/><em><a href="{{< ref "#ISCSIVolumeSource" >}}">ISCSIVolumeSource</a></em></td>
      <td>iscsi represents an ISCSI Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes/#iscsi</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name of the volume. Must be a DNS_LABEL and unique within the pod. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</td>
    </tr>
    <tr>
      <td><code>nfs</code><br/><em><a href="{{< ref "persistent-volume-v1#NFSVolumeSource" >}}">NFSVolumeSource</a></em></td>
      <td>nfs represents an NFS mount on the host that shares a pod's lifetime More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs</td>
    </tr>
    <tr>
      <td><code>persistentVolumeClaim</code><br/><em><a href="{{< ref "#PersistentVolumeClaimVolumeSource" >}}">PersistentVolumeClaimVolumeSource</a></em></td>
      <td>persistentVolumeClaimVolumeSource represents a reference to a PersistentVolumeClaim in the same namespace. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims</td>
    </tr>
    <tr>
      <td><code>photonPersistentDisk</code><br/><em><a href="{{< ref "persistent-volume-v1#PhotonPersistentDiskVolumeSource" >}}">PhotonPersistentDiskVolumeSource</a></em></td>
      <td>photonPersistentDisk represents a PhotonController persistent disk attached and mounted on kubelets host machine. Deprecated: PhotonPersistentDisk is deprecated and the in-tree photonPersistentDisk type is no longer supported.</td>
    </tr>
    <tr>
      <td><code>portworxVolume</code><br/><em><a href="{{< ref "persistent-volume-v1#PortworxVolumeSource" >}}">PortworxVolumeSource</a></em></td>
      <td>portworxVolume represents a portworx volume attached and mounted on kubelets host machine. Deprecated: PortworxVolume is deprecated. All operations for the in-tree portworxVolume type are redirected to the pxd.portworx.com CSI driver.</td>
    </tr>
    <tr>
      <td><code>projected</code><br/><em><a href="{{< ref "#ProjectedVolumeSource" >}}">ProjectedVolumeSource</a></em></td>
      <td>projected items for all in one resources secrets, configmaps, and downward API</td>
    </tr>
    <tr>
      <td><code>quobyte</code><br/><em><a href="{{< ref "persistent-volume-v1#QuobyteVolumeSource" >}}">QuobyteVolumeSource</a></em></td>
      <td>quobyte represents a Quobyte mount on the host that shares a pod's lifetime. Deprecated: Quobyte is deprecated and the in-tree quobyte type is no longer supported.</td>
    </tr>
    <tr>
      <td><code>rbd</code><br/><em><a href="{{< ref "#RBDVolumeSource" >}}">RBDVolumeSource</a></em></td>
      <td>rbd represents a Rados Block Device mount on the host that shares a pod's lifetime. Deprecated: RBD is deprecated and the in-tree rbd type is no longer supported.</td>
    </tr>
    <tr>
      <td><code>scaleIO</code><br/><em><a href="{{< ref "#ScaleIOVolumeSource" >}}">ScaleIOVolumeSource</a></em></td>
      <td>scaleIO represents a ScaleIO persistent volume attached and mounted on Kubernetes nodes. Deprecated: ScaleIO is deprecated and the in-tree scaleIO type is no longer supported.</td>
    </tr>
    <tr>
      <td><code>secret</code><br/><em><a href="{{< ref "#SecretVolumeSource" >}}">SecretVolumeSource</a></em></td>
      <td>secret represents a secret that should populate this volume. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret</td>
    </tr>
    <tr>
      <td><code>storageos</code><br/><em><a href="{{< ref "#StorageOSVolumeSource" >}}">StorageOSVolumeSource</a></em></td>
      <td>storageOS represents a StorageOS volume attached and mounted on Kubernetes nodes. Deprecated: StorageOS is deprecated and the in-tree storageos type is no longer supported.</td>
    </tr>
    <tr>
      <td><code>vsphereVolume</code><br/><em><a href="{{< ref "persistent-volume-v1#VsphereVirtualDiskVolumeSource" >}}">VsphereVirtualDiskVolumeSource</a></em></td>
      <td>vsphereVolume represents a vSphere volume attached and mounted on kubelets host machine. Deprecated: VsphereVolume is deprecated. All operations for the in-tree vsphereVolume type are redirected to the csi.vsphere.vmware.com CSI driver.</td>
    </tr>
  </tbody>
</table>


## VolumeDevice {#VolumeDevice}

volumeDevice describes a mapping of a raw block device within a container.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>devicePath</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>devicePath is the path inside of the container that the device will be mapped to.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name must match the name of a persistentVolumeClaim in the pod</td>
    </tr>
  </tbody>
</table>


## VolumeMount {#VolumeMount}

VolumeMount describes a mounting of a Volume within a container.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>mountPath</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Path within the container at which the volume should be mounted.  Must not contain ':'.</td>
    </tr>
    <tr>
      <td><code>mountPropagation</code><br/><em>string</em></td>
      <td>mountPropagation determines how mounts are propagated from the host to container and the other way around. When not set, MountPropagationNone is used. This field is beta in 1.10. When RecursiveReadOnly is set to IfPossible or to Enabled, MountPropagation must be None or unspecified (which defaults to None).<br/><br/>Possible enum values:<br/> - `"Bidirectional"` means that the volume in a container will receive new mounts from the host or other containers, and its own mounts will be propagated from the container to the host or other containers. Note that this mode is recursively applied to all mounts in the volume ("rshared" in Linux terminology).<br/> - `"HostToContainer"` means that the volume in a container will receive new mounts from the host or other containers, but filesystems mounted inside the container won't be propagated to the host or other containers. Note that this mode is recursively applied to all mounts in the volume ("rslave" in Linux terminology).<br/> - `"None"` means that the volume in a container will not receive new mounts from the host or other containers, and filesystems mounted inside the container won't be propagated to the host or other containers. Note that this mode corresponds to "private" in Linux terminology.</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>This must match the Name of a Volume.</td>
    </tr>
    <tr>
      <td><code>readOnly</code><br/><em>boolean</em></td>
      <td>Mounted read-only if true, read-write otherwise (false or unspecified). Defaults to false.</td>
    </tr>
    <tr>
      <td><code>recursiveReadOnly</code><br/><em>string</em></td>
      <td>RecursiveReadOnly specifies whether read-only mounts should be handled recursively.  If ReadOnly is false, this field has no meaning and must be unspecified.  If ReadOnly is true, and this field is set to Disabled, the mount is not made recursively read-only.  If this field is set to IfPossible, the mount is made recursively read-only, if it is supported by the container runtime.  If this field is set to Enabled, the mount is made recursively read-only if it is supported by the container runtime, otherwise the pod will not be started and an error will be generated to indicate the reason.  If this field is set to IfPossible or Enabled, MountPropagation must be set to None (or be unspecified, which defaults to None).  If this field is not specified, it is treated as an equivalent of Disabled.</td>
    </tr>
    <tr>
      <td><code>subPath</code><br/><em>string</em></td>
      <td>Path within the volume from which the container's volume should be mounted. Defaults to "" (volume's root).</td>
    </tr>
    <tr>
      <td><code>subPathExpr</code><br/><em>string</em></td>
      <td>Expanded path within the volume from which the container's volume should be mounted. Behaves similarly to SubPath but environment variable references $(VAR_NAME) are expanded using the container's environment. Defaults to "" (volume's root). SubPathExpr and SubPath are mutually exclusive.</td>
    </tr>
  </tbody>
</table>


## VolumeProjection {#VolumeProjection}

Projection that may be projected along with other supported volume types. Exactly one of these fields must be set.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>clusterTrustBundle</code><br/><em><a href="{{< ref "#ClusterTrustBundleProjection" >}}">ClusterTrustBundleProjection</a></em></td>
      <td>ClusterTrustBundle allows a pod to access the `.spec.trustBundle` field of ClusterTrustBundle objects in an auto-updating file.  Alpha, gated by the ClusterTrustBundleProjection feature gate.  ClusterTrustBundle objects can either be selected by name, or by the combination of signer name and a label selector.  Kubelet performs aggressive normalization of the PEM contents written into the pod filesystem.  Esoteric PEM features such as inter-block comments and block headers are stripped.  Certificates are deduplicated. The ordering of certificates within the file is arbitrary, and Kubelet may change the order over time.</td>
    </tr>
    <tr>
      <td><code>configMap</code><br/><em><a href="{{< ref "#ConfigMapProjection" >}}">ConfigMapProjection</a></em></td>
      <td>configMap information about the configMap data to project</td>
    </tr>
    <tr>
      <td><code>downwardAPI</code><br/><em><a href="{{< ref "#DownwardAPIProjection" >}}">DownwardAPIProjection</a></em></td>
      <td>downwardAPI information about the downwardAPI data to project</td>
    </tr>
    <tr>
      <td><code>podCertificate</code><br/><em><a href="{{< ref "#PodCertificateProjection" >}}">PodCertificateProjection</a></em></td>
      <td>Projects an auto-rotating credential bundle (private key and certificate chain) that the pod can use either as a TLS client or server.  Kubelet generates a private key and uses it to send a PodCertificateRequest to the named signer.  Once the signer approves the request and issues a certificate chain, Kubelet writes the key and certificate chain to the pod filesystem.  The pod does not start until certificates have been issued for each podCertificate projected volume source in its spec.  Kubelet will begin trying to rotate the certificate at the time indicated by the signer using the PodCertificateRequest.Status.BeginRefreshAt timestamp.  Kubelet can write a single file, indicated by the credentialBundlePath field, or separate files, indicated by the keyPath and certificateChainPath fields.  The credential bundle is a single file in PEM format.  The first PEM entry is the private key (in PKCS#8 format), and the remaining PEM entries are the certificate chain issued by the signer (typically, signers will return their certificate chain in leaf-to-root order).  Prefer using the credential bundle format, since your application code can read it atomically.  If you use keyPath and certificateChainPath, your application must make two separate file reads. If these coincide with a certificate rotation, it is possible that the private key and leaf certificate you read may not correspond to each other.  Your application will need to check for this condition, and re-read until they are consistent.  The named signer controls chooses the format of the certificate it issues; consult the signer implementation's documentation to learn how to use the certificates it issues.</td>
    </tr>
    <tr>
      <td><code>secret</code><br/><em><a href="{{< ref "#SecretProjection" >}}">SecretProjection</a></em></td>
      <td>secret information about the secret data to project</td>
    </tr>
    <tr>
      <td><code>serviceAccountToken</code><br/><em><a href="{{< ref "#ServiceAccountTokenProjection" >}}">ServiceAccountTokenProjection</a></em></td>
      <td>serviceAccountToken is information about the serviceAccountToken data to project</td>
    </tr>
  </tbody>
</table>


## WeightedPodAffinityTerm {#WeightedPodAffinityTerm}

The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>podAffinityTerm</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#PodAffinityTerm" >}}">PodAffinityTerm</a></em></td>
      <td>Required. A pod affinity term, associated with the corresponding weight.</td>
    </tr>
    <tr>
      <td><code>weight</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>weight associated with matching the corresponding podAffinityTerm, in the range 1-100.</td>
    </tr>
  </tbody>
</table>


## WindowsSecurityContextOptions {#WindowsSecurityContextOptions}

WindowsSecurityContextOptions contain Windows-specific options and credentials.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>gmsaCredentialSpec</code><br/><em>string</em></td>
      <td>GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.</td>
    </tr>
    <tr>
      <td><code>gmsaCredentialSpecName</code><br/><em>string</em></td>
      <td>GMSACredentialSpecName is the name of the GMSA credential spec to use.</td>
    </tr>
    <tr>
      <td><code>hostProcess</code><br/><em>boolean</em></td>
      <td>HostProcess determines if a container should be run as a 'Host Process' container. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers). In addition, if HostProcess is true then HostNetwork must also be set to true.</td>
    </tr>
    <tr>
      <td><code>runAsUserName</code><br/><em>string</em></td>
      <td>The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.</td>
    </tr>
  </tbody>
</table>



## Operations {#Operations}

<hr>


### `post` Create

#### HTTP Request

POST /api/v1/namespaces/{namespace}/pods


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed</td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.</td>
    </tr>
  </tbody>
</table>


#### Body Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>


#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>


### `post` Create Eviction

#### HTTP Request

POST /api/v1/namespaces/{namespace}/pods/{name}/eviction


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Eviction</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed</td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
  </tbody>
</table>


#### Body Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/eviction-v1-policy#Eviction" >}}">Eviction</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>


#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/eviction-v1-policy#Eviction" >}}">Eviction</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "../definitions/eviction-v1-policy#Eviction" >}}">Eviction</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "../definitions/eviction-v1-policy#Eviction" >}}">Eviction</a></em></td>
    </tr>
  </tbody>
</table>


### `patch` Patch

#### HTTP Request

PATCH /api/v1/namespaces/{namespace}/pods/{name}


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed</td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint. This field is required for apply requests (application/apply-patch) but optional for non-apply patch types (JsonPatch, MergePatch, StrategicMergePatch).</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.</td>
    </tr>
    <tr>
      <td><code>force</code></td>
      <td><em>boolean</em></td>
      <td>Force is going to "force" Apply requests. It means user will re-acquire conflicting fields owned by other people. Force flag must be unset for non-apply patch requests.</td>
    </tr>
  </tbody>
</table>


#### Body Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/patch-v1-meta#Patch" >}}">Patch</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>


#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>


### `put` Replace

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/pods/{name}


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed</td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.</td>
    </tr>
  </tbody>
</table>


#### Body Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>


#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>


### `delete` Delete

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/pods/{name}


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed</td>
    </tr>
    <tr>
      <td><code>gracePeriodSeconds</code></td>
      <td><em>integer</em></td>
      <td>The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.</td>
    </tr>
    <tr>
      <td><code>ignoreStoreReadErrorWithClusterBreakingPotential</code></td>
      <td><em>boolean</em></td>
      <td>if set to true, it will trigger an unsafe deletion of the resource in case the normal deletion flow fails with a corrupt object error. A resource is considered corrupt if it can not be retrieved from the underlying storage successfully because of a) its data can not be transformed e.g. decryption failure, or b) it fails to decode into an object. NOTE: unsafe deletion ignores finalizer constraints, skips precondition checks, and removes the object from the storage. WARNING: This may potentially break the cluster if the workload associated with the resource being unsafe-deleted relies on normal deletion flow. Use only if you REALLY know what you are doing. The default value is false, and the user must opt in to enable it</td>
    </tr>
    <tr>
      <td><code>orphanDependents</code></td>
      <td><em>boolean</em></td>
      <td>Deprecated: please use the PropagationPolicy, this field will be deprecated in 1.7. Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object's finalizers list. Either this field or PropagationPolicy may be set, but not both.</td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code></td>
      <td><em>string</em></td>
      <td>Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground.</td>
    </tr>
  </tbody>
</table>


#### Body Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/delete-options-v1-meta#DeleteOptions" >}}">DeleteOptions</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>


#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>


### `delete` Delete Collection

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/pods


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key".  This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>A selector to restrict the list of returned objects by their fields. Defaults to everything.</td>
    </tr>
    <tr>
      <td><code>gracePeriodSeconds</code></td>
      <td><em>integer</em></td>
      <td>The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.</td>
    </tr>
    <tr>
      <td><code>ignoreStoreReadErrorWithClusterBreakingPotential</code></td>
      <td><em>boolean</em></td>
      <td>if set to true, it will trigger an unsafe deletion of the resource in case the normal deletion flow fails with a corrupt object error. A resource is considered corrupt if it can not be retrieved from the underlying storage successfully because of a) its data can not be transformed e.g. decryption failure, or b) it fails to decode into an object. NOTE: unsafe deletion ignores finalizer constraints, skips precondition checks, and removes the object from the storage. WARNING: This may potentially break the cluster if the workload associated with the resource being unsafe-deleted relies on normal deletion flow. Use only if you REALLY know what you are doing. The default value is false, and the user must opt in to enable it</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>A selector to restrict the list of returned objects by their labels. Defaults to everything.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.  The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.</td>
    </tr>
    <tr>
      <td><code>orphanDependents</code></td>
      <td><em>boolean</em></td>
      <td>Deprecated: please use the PropagationPolicy, this field will be deprecated in 1.7. Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object's finalizers list. Either this field or PropagationPolicy may be set, but not both.</td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code></td>
      <td><em>string</em></td>
      <td>Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground.</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>`sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event  will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched.  When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following:<br/> - `resourceVersionMatch` = NotOlderThan   is interpreted as "data at least as new as the provided `resourceVersion`"   and the bookmark event is send when the state is synced   to a `resourceVersion` at least as fresh as the one provided by the ListOptions.   If `resourceVersion` is unset, this is interpreted as "consistent read" and the   bookmark event is send when the state is synced at least to the moment   when request started being processed.<br/> - `resourceVersionMatch` set to any other value or unset   Invalid error is returned.  Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths:   - object.metadata.uid   - object.metadata.namespace  hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64.  Examples:   2-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   4-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  This is an alpha field and requires enabling the ShardedListAndWatch feature gate.</td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.</td>
    </tr>
  </tbody>
</table>


#### Body Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/delete-options-v1-meta#DeleteOptions" >}}">DeleteOptions</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>


#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
  </tbody>
</table>


### `get` Read

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>


### `get` List

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key".  This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>A selector to restrict the list of returned objects by their fields. Defaults to everything.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>A selector to restrict the list of returned objects by their labels. Defaults to everything.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.  The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>`sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event  will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched.  When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following:<br/> - `resourceVersionMatch` = NotOlderThan   is interpreted as "data at least as new as the provided `resourceVersion`"   and the bookmark event is send when the state is synced   to a `resourceVersion` at least as fresh as the one provided by the ListOptions.   If `resourceVersion` is unset, this is interpreted as "consistent read" and the   bookmark event is send when the state is synced at least to the moment   when request started being processed.<br/> - `resourceVersionMatch` set to any other value or unset   Invalid error is returned.  Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths:   - object.metadata.uid   - object.metadata.namespace  hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64.  Examples:   2-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   4-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  This is an alpha field and requires enabling the ShardedListAndWatch feature gate.</td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#PodList" >}}">PodList</a></em></td>
    </tr>
  </tbody>
</table>


### `get` List All Namespaces

#### HTTP Request

GET /api/v1/pods



#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key".  This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>A selector to restrict the list of returned objects by their fields. Defaults to everything.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>A selector to restrict the list of returned objects by their labels. Defaults to everything.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.  The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>`sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event  will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched.  When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following:<br/> - `resourceVersionMatch` = NotOlderThan   is interpreted as "data at least as new as the provided `resourceVersion`"   and the bookmark event is send when the state is synced   to a `resourceVersion` at least as fresh as the one provided by the ListOptions.   If `resourceVersion` is unset, this is interpreted as "consistent read" and the   bookmark event is send when the state is synced at least to the moment   when request started being processed.<br/> - `resourceVersionMatch` set to any other value or unset   Invalid error is returned.  Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths:   - object.metadata.uid   - object.metadata.namespace  hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64.  Examples:   2-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   4-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  This is an alpha field and requires enabling the ShardedListAndWatch feature gate.</td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#PodList" >}}">PodList</a></em></td>
    </tr>
  </tbody>
</table>


### `get` Watch

#### HTTP Request

GET /api/v1/watch/namespaces/{namespace}/pods/{name}


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key".  This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>A selector to restrict the list of returned objects by their fields. Defaults to everything.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>A selector to restrict the list of returned objects by their labels. Defaults to everything.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.  The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>`sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event  will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched.  When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following:<br/> - `resourceVersionMatch` = NotOlderThan   is interpreted as "data at least as new as the provided `resourceVersion`"   and the bookmark event is send when the state is synced   to a `resourceVersion` at least as fresh as the one provided by the ListOptions.   If `resourceVersion` is unset, this is interpreted as "consistent read" and the   bookmark event is send when the state is synced at least to the moment   when request started being processed.<br/> - `resourceVersionMatch` set to any other value or unset   Invalid error is returned.  Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths:   - object.metadata.uid   - object.metadata.namespace  hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64.  Examples:   2-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   4-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  This is an alpha field and requires enabling the ShardedListAndWatch feature gate.</td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>


### `get` Watch List

#### HTTP Request

GET /api/v1/watch/namespaces/{namespace}/pods


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key".  This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>A selector to restrict the list of returned objects by their fields. Defaults to everything.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>A selector to restrict the list of returned objects by their labels. Defaults to everything.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.  The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>`sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event  will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched.  When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following:<br/> - `resourceVersionMatch` = NotOlderThan   is interpreted as "data at least as new as the provided `resourceVersion`"   and the bookmark event is send when the state is synced   to a `resourceVersion` at least as fresh as the one provided by the ListOptions.   If `resourceVersion` is unset, this is interpreted as "consistent read" and the   bookmark event is send when the state is synced at least to the moment   when request started being processed.<br/> - `resourceVersionMatch` set to any other value or unset   Invalid error is returned.  Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths:   - object.metadata.uid   - object.metadata.namespace  hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64.  Examples:   2-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   4-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  This is an alpha field and requires enabling the ShardedListAndWatch feature gate.</td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>


### `get` Watch List All Namespaces

#### HTTP Request

GET /api/v1/watch/pods



#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key".  This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>A selector to restrict the list of returned objects by their fields. Defaults to everything.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>A selector to restrict the list of returned objects by their labels. Defaults to everything.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true.  The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details.  Defaults to unset</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>`sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event  will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched.  When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following:<br/> - `resourceVersionMatch` = NotOlderThan   is interpreted as "data at least as new as the provided `resourceVersion`"   and the bookmark event is send when the state is synced   to a `resourceVersion` at least as fresh as the one provided by the ListOptions.   If `resourceVersion` is unset, this is interpreted as "consistent read" and the   bookmark event is send when the state is synced at least to the moment   when request started being processed.<br/> - `resourceVersionMatch` set to any other value or unset   Invalid error is returned.  Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths:   - object.metadata.uid   - object.metadata.namespace  hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64.  Examples:   2-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   4-shard split:     shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  This is an alpha field and requires enabling the ShardedListAndWatch feature gate.</td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>


### `patch` Patch Status

#### HTTP Request

PATCH /api/v1/namespaces/{namespace}/pods/{name}/status


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed</td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint. This field is required for apply requests (application/apply-patch) but optional for non-apply patch types (JsonPatch, MergePatch, StrategicMergePatch).</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.</td>
    </tr>
    <tr>
      <td><code>force</code></td>
      <td><em>boolean</em></td>
      <td>Force is going to "force" Apply requests. It means user will re-acquire conflicting fields owned by other people. Force flag must be unset for non-apply patch requests.</td>
    </tr>
  </tbody>
</table>


#### Body Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/patch-v1-meta#Patch" >}}">Patch</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>


#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>


### `get` Read Status

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}/status


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>


### `put` Replace Status

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/pods/{name}/status


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed</td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.</td>
    </tr>
  </tbody>
</table>


#### Body Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>


#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>


### `get` Read Resize

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}/resize


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>


### `patch` Patch Resize

#### HTTP Request

PATCH /api/v1/namespaces/{namespace}/pods/{name}/resize


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed</td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint. This field is required for apply requests (application/apply-patch) but optional for non-apply patch types (JsonPatch, MergePatch, StrategicMergePatch).</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.</td>
    </tr>
    <tr>
      <td><code>force</code></td>
      <td><em>boolean</em></td>
      <td>Force is going to "force" Apply requests. It means user will re-acquire conflicting fields owned by other people. Force flag must be unset for non-apply patch requests.</td>
    </tr>
  </tbody>
</table>


#### Body Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/patch-v1-meta#Patch" >}}">Patch</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>


#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>


### `put` Replace Resize

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/pods/{name}/resize


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed</td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.</td>
    </tr>
  </tbody>
</table>


#### Body Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>


#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>


### `patch` Patch EphemeralContainers

#### HTTP Request

PATCH /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed</td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint. This field is required for apply requests (application/apply-patch) but optional for non-apply patch types (JsonPatch, MergePatch, StrategicMergePatch).</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.</td>
    </tr>
    <tr>
      <td><code>force</code></td>
      <td><em>boolean</em></td>
      <td>Force is going to "force" Apply requests. It means user will re-acquire conflicting fields owned by other people. Force flag must be unset for non-apply patch requests.</td>
    </tr>
  </tbody>
</table>


#### Body Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/patch-v1-meta#Patch" >}}">Patch</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>


#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>


### `get` Read EphemeralContainers

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>


### `put` Replace EphemeralContainers

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed</td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered.</td>
    </tr>
  </tbody>
</table>


#### Body Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>


#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "pod-v1#Pod" >}}">Pod</a></em></td>
    </tr>
  </tbody>
</table>


### `post` Create Connect Portforward

#### HTTP Request

POST /api/v1/namespaces/{namespace}/pods/{name}/portforward


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodPortForwardOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>ports</code></td>
      <td><em>integer</em></td>
      <td>List of ports to forward Required when using WebSockets</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `post` Create Connect Proxy

#### HTTP Request

POST /api/v1/namespaces/{namespace}/pods/{name}/proxy


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path is the URL path to use for the current proxy request to pod.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `post` Create Connect Proxy Path

#### HTTP Request

POST /api/v1/namespaces/{namespace}/pods/{name}/proxy/{path}


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>path to the resource</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path is the URL path to use for the current proxy request to pod.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `delete` Delete Connect Proxy

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/pods/{name}/proxy


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path is the URL path to use for the current proxy request to pod.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `delete` Delete Connect Proxy Path

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/pods/{name}/proxy/{path}


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>path to the resource</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path is the URL path to use for the current proxy request to pod.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `get` Get Connect Portforward

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}/portforward


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodPortForwardOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>ports</code></td>
      <td><em>integer</em></td>
      <td>List of ports to forward Required when using WebSockets</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `get` Get Connect Proxy

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}/proxy


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path is the URL path to use for the current proxy request to pod.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `get` Get Connect Proxy Path

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}/proxy/{path}


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>path to the resource</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path is the URL path to use for the current proxy request to pod.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `head` Head Connect Proxy

#### HTTP Request

HEAD /api/v1/namespaces/{namespace}/pods/{name}/proxy


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path is the URL path to use for the current proxy request to pod.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `head` Head Connect Proxy Path

#### HTTP Request

HEAD /api/v1/namespaces/{namespace}/pods/{name}/proxy/{path}


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>path to the resource</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path is the URL path to use for the current proxy request to pod.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `put` Replace Connect Proxy

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/pods/{name}/proxy


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path is the URL path to use for the current proxy request to pod.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `put` Replace Connect Proxy Path

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/pods/{name}/proxy/{path}


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodProxyOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>path to the resource</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>path</code></td>
      <td><em>string</em></td>
      <td>Path is the URL path to use for the current proxy request to pod.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `get` Read Log

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}/log


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the Pod</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>container</code></td>
      <td><em>string</em></td>
      <td>The container for which to stream logs. Defaults to only container if there is one container in the pod.</td>
    </tr>
    <tr>
      <td><code>follow</code></td>
      <td><em>boolean</em></td>
      <td>Follow the log stream of the pod. Defaults to false.</td>
    </tr>
    <tr>
      <td><code>insecureSkipTLSVerifyBackend</code></td>
      <td><em>boolean</em></td>
      <td>insecureSkipTLSVerifyBackend indicates that the apiserver should not confirm the validity of the serving certificate of the backend it is connecting to.  This will make the HTTPS connection between the apiserver and the backend insecure. This means the apiserver cannot verify the log data it is receiving came from the real kubelet.  If the kubelet is configured to verify the apiserver's TLS credentials, it does not mean the connection to the real kubelet is vulnerable to a man in the middle attack (e.g. an attacker could not intercept the actual log data coming from the real kubelet).</td>
    </tr>
    <tr>
      <td><code>limitBytes</code></td>
      <td><em>integer</em></td>
      <td>If set, the number of bytes to read from the server before terminating the log output. This may not display a complete final line of logging, and may return slightly more or slightly less than the specified limit.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget).</td>
    </tr>
    <tr>
      <td><code>previous</code></td>
      <td><em>boolean</em></td>
      <td>Return previous terminated container logs. Defaults to false.</td>
    </tr>
    <tr>
      <td><code>sinceSeconds</code></td>
      <td><em>integer</em></td>
      <td>A relative time in seconds before the current time from which to show logs. If this value precedes the time a pod was started, only logs since the pod start will be returned. If this value is in the future, no logs will be returned. Only one of sinceSeconds or sinceTime may be specified.</td>
    </tr>
    <tr>
      <td><code>stream</code></td>
      <td><em>string</em></td>
      <td>Specify which container log stream to return to the client. Acceptable values are "All", "Stdout" and "Stderr". If not specified, "All" is used, and both stdout and stderr are returned interleaved. Note that when "TailLines" is specified, "Stream" can only be set to nil or "All".</td>
    </tr>
    <tr>
      <td><code>tailLines</code></td>
      <td><em>integer</em></td>
      <td>If set, the number of lines from the end of the logs to show. If not specified, logs are shown from the creation of the container or sinceSeconds or sinceTime. Note that when "TailLines" is specified, "Stream" can only be set to nil or "All".</td>
    </tr>
    <tr>
      <td><code>timestamps</code></td>
      <td><em>boolean</em></td>
      <td>If true, add an RFC3339 or RFC3339Nano timestamp at the beginning of every line of log output. Defaults to false.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `get` Get Connect Exec

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}/exec


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodExecOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>command</code></td>
      <td><em>string</em></td>
      <td>Command is the remote command to execute. argv array. Not executed within a shell.</td>
    </tr>
    <tr>
      <td><code>container</code></td>
      <td><em>string</em></td>
      <td>Container in which to execute the command. Defaults to only container if there is only one container in the pod.</td>
    </tr>
    <tr>
      <td><code>stderr</code></td>
      <td><em>boolean</em></td>
      <td>Redirect the standard error stream of the pod for this call.</td>
    </tr>
    <tr>
      <td><code>stdin</code></td>
      <td><em>boolean</em></td>
      <td>Redirect the standard input stream of the pod for this call. Defaults to false.</td>
    </tr>
    <tr>
      <td><code>stdout</code></td>
      <td><em>boolean</em></td>
      <td>Redirect the standard output stream of the pod for this call.</td>
    </tr>
    <tr>
      <td><code>tty</code></td>
      <td><em>boolean</em></td>
      <td>TTY if true indicates that a tty will be allocated for the exec call. Defaults to false.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `post` Create Connect Exec

#### HTTP Request

POST /api/v1/namespaces/{namespace}/pods/{name}/exec


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodExecOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>command</code></td>
      <td><em>string</em></td>
      <td>Command is the remote command to execute. argv array. Not executed within a shell.</td>
    </tr>
    <tr>
      <td><code>container</code></td>
      <td><em>string</em></td>
      <td>Container in which to execute the command. Defaults to only container if there is only one container in the pod.</td>
    </tr>
    <tr>
      <td><code>stderr</code></td>
      <td><em>boolean</em></td>
      <td>Redirect the standard error stream of the pod for this call.</td>
    </tr>
    <tr>
      <td><code>stdin</code></td>
      <td><em>boolean</em></td>
      <td>Redirect the standard input stream of the pod for this call. Defaults to false.</td>
    </tr>
    <tr>
      <td><code>stdout</code></td>
      <td><em>boolean</em></td>
      <td>Redirect the standard output stream of the pod for this call.</td>
    </tr>
    <tr>
      <td><code>tty</code></td>
      <td><em>boolean</em></td>
      <td>TTY if true indicates that a tty will be allocated for the exec call. Defaults to false.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `get` Get Connect Attach

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}/attach


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodAttachOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>container</code></td>
      <td><em>string</em></td>
      <td>The container in which to execute the command. Defaults to only container if there is only one container in the pod.</td>
    </tr>
    <tr>
      <td><code>stderr</code></td>
      <td><em>boolean</em></td>
      <td>Stderr if true indicates that stderr is to be redirected for the attach call. Defaults to true.</td>
    </tr>
    <tr>
      <td><code>stdin</code></td>
      <td><em>boolean</em></td>
      <td>Stdin if true, redirects the standard input stream of the pod for this call. Defaults to false.</td>
    </tr>
    <tr>
      <td><code>stdout</code></td>
      <td><em>boolean</em></td>
      <td>Stdout if true indicates that stdout is to be redirected for the attach call. Defaults to true.</td>
    </tr>
    <tr>
      <td><code>tty</code></td>
      <td><em>boolean</em></td>
      <td>TTY if true indicates that a tty will be allocated for the attach call. This is passed through the container runtime so the tty is allocated on the worker node by the container runtime. Defaults to false.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>


### `post` Create Connect Attach

#### HTTP Request

POST /api/v1/namespaces/{namespace}/pods/{name}/attach


#### Path Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>name of the PodAttachOptions</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>object name and auth scope, such as for teams and projects</td>
    </tr>
  </tbody>
</table>


#### Query Parameters

<table>
  <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>container</code></td>
      <td><em>string</em></td>
      <td>The container in which to execute the command. Defaults to only container if there is only one container in the pod.</td>
    </tr>
    <tr>
      <td><code>stderr</code></td>
      <td><em>boolean</em></td>
      <td>Stderr if true indicates that stderr is to be redirected for the attach call. Defaults to true.</td>
    </tr>
    <tr>
      <td><code>stdin</code></td>
      <td><em>boolean</em></td>
      <td>Stdin if true, redirects the standard input stream of the pod for this call. Defaults to false.</td>
    </tr>
    <tr>
      <td><code>stdout</code></td>
      <td><em>boolean</em></td>
      <td>Stdout if true indicates that stdout is to be redirected for the attach call. Defaults to true.</td>
    </tr>
    <tr>
      <td><code>tty</code></td>
      <td><em>boolean</em></td>
      <td>TTY if true indicates that a tty will be allocated for the attach call. This is passed through the container runtime so the tty is allocated on the worker node by the container runtime. Defaults to false.</td>
    </tr>
  </tbody>
</table>



#### Response

<table>
  <thead><tr><th>Status</th><th>Description</th><th>Response</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em>string</em></td>
    </tr>
  </tbody>
</table>








