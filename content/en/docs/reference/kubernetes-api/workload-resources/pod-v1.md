---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Pod"
content_type: "api_reference"
description: "Pod is a collection of containers that can run on a host."
title: "Pod"
weight: 1
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

- **apiVersion**: v1


- **kind**: Pod


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/pod-v1#PodSpec" >}}">PodSpec</a>)

  Specification of the desired behavior of the pod. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../workload-resources/pod-v1#PodStatus" >}}">PodStatus</a>)

  Most recently observed status of the pod. This data may not be up to date. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status





## PodSpec {#PodSpec}

PodSpec is a description of a pod.

<hr>



### Containers


- **containers** ([]<a href="{{< ref "../workload-resources/pod-v1#Container" >}}">Container</a>), required

  *Patch strategy: merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
  
  List of containers belonging to the pod. Containers cannot currently be added or removed. There must be at least one container in a Pod. Cannot be updated.

- **initContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#Container" >}}">Container</a>)

  *Patch strategy: merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
  
  List of initialization containers belonging to the pod. Init containers are executed in order prior to containers being started. If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy. The name for an init container or normal container must be unique among all containers. Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes. The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit for each resource type, and then using the max of of that value or the sum of the normal containers. Limits are applied to init containers in a similar fashion. Init containers cannot currently be added or removed. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/init-containers/

- **ephemeralContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#EphemeralContainer" >}}">EphemeralContainer</a>)

  *Patch strategy: merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
  
  List of ephemeral containers run in this pod. Ephemeral containers may be run in an existing pod to perform user-initiated actions such as debugging. This list cannot be specified when creating a pod, and it cannot be modified by updating the pod spec. In order to add an ephemeral container to an existing pod, use the pod's ephemeralcontainers subresource.

- **imagePullSecrets** ([]<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

  *Patch strategy: merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
  
  ImagePullSecrets is an optional list of references to secrets in the same namespace to use for pulling any of the images used by this PodSpec. If specified, these secrets will be passed to individual puller implementations for them to use. More info: https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod

- **enableServiceLinks** (boolean)

  EnableServiceLinks indicates whether information about services should be injected into pod's environment variables, matching the syntax of Docker links. Optional: Defaults to true.

- **os** (PodOS)

  Specifies the OS of the containers in the pod. Some pod and container fields are restricted if this is set.
  
  If the OS field is set to linux, the following fields must be unset: -securityContext.windowsOptions
  
  If the OS field is set to windows, following fields must be unset: - spec.hostPID - spec.hostIPC - spec.hostUsers - spec.securityContext.appArmorProfile - spec.securityContext.seLinuxOptions - spec.securityContext.seccompProfile - spec.securityContext.fsGroup - spec.securityContext.fsGroupChangePolicy - spec.securityContext.sysctls - spec.shareProcessNamespace - spec.securityContext.runAsUser - spec.securityContext.runAsGroup - spec.securityContext.supplementalGroups - spec.securityContext.supplementalGroupsPolicy - spec.containers[*].securityContext.appArmorProfile - spec.containers[*].securityContext.seLinuxOptions - spec.containers[*].securityContext.seccompProfile - spec.containers[*].securityContext.capabilities - spec.containers[*].securityContext.readOnlyRootFilesystem - spec.containers[*].securityContext.privileged - spec.containers[*].securityContext.allowPrivilegeEscalation - spec.containers[*].securityContext.procMount - spec.containers[*].securityContext.runAsUser - spec.containers[*].securityContext.runAsGroup

  <a name="PodOS"></a>
  *PodOS defines the OS parameters of a pod.*

  - **os.name** (string), required

    Name is the name of the operating system. The currently supported values are linux and windows. Additional value may be defined in future and can be one of: https://github.com/opencontainers/runtime-spec/blob/master/config.md#platform-specific-configuration Clients should expect to handle additional values and treat unrecognized values in this field as os: null

### Volumes


- **volumes** ([]<a href="{{< ref "../config-and-storage-resources/volume#Volume" >}}">Volume</a>)

  *Patch strategies: retainKeys, merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
  
  List of volumes that can be mounted by containers belonging to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes

### Scheduling


- **nodeSelector** (map[string]string)

  NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node's labels for the pod to be scheduled on that node. More info: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/

- **nodeName** (string)

  NodeName indicates in which node this pod is scheduled. If empty, this pod is a candidate for scheduling by the scheduler defined in schedulerName. Once this field is set, the kubelet for this node becomes responsible for the lifecycle of this pod. This field should not be used to express a desire for the pod to be scheduled on a specific node. https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodename

- **affinity** (Affinity)

  If specified, the pod's scheduling constraints

  <a name="Affinity"></a>
  *Affinity is a group of affinity scheduling rules.*

  - **affinity.nodeAffinity** (<a href="{{< ref "../workload-resources/pod-v1#NodeAffinity" >}}">NodeAffinity</a>)

    Describes node affinity scheduling rules for the pod.

  - **affinity.podAffinity** (<a href="{{< ref "../workload-resources/pod-v1#PodAffinity" >}}">PodAffinity</a>)

    Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)).

  - **affinity.podAntiAffinity** (<a href="{{< ref "../workload-resources/pod-v1#PodAntiAffinity" >}}">PodAntiAffinity</a>)

    Describes pod anti-affinity scheduling rules (e.g. avoid putting this pod in the same node, zone, etc. as some other pod(s)).

- **tolerations** ([]Toleration)

  *Atomic: will be replaced during a merge*
  
  If specified, the pod's tolerations.

  <a name="Toleration"></a>
  *The pod this Toleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.*

  - **tolerations.key** (string)

    Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys.

  - **tolerations.operator** (string)

    Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a pod can tolerate all taints of a particular category.

  - **tolerations.value** (string)

    Value is the taint value the toleration matches to. If the operator is Exists, the value should be empty, otherwise just a regular string.

  - **tolerations.effect** (string)

    Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.

  - **tolerations.tolerationSeconds** (int64)

    TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system.

- **schedulerName** (string)

  If specified, the pod will be dispatched by specified scheduler. If not specified, the pod will be dispatched by default scheduler.

- **runtimeClassName** (string)

  RuntimeClassName refers to a RuntimeClass object in the node.k8s.io group, which should be used to run this pod.  If no RuntimeClass resource matches the named class, the pod will not be run. If unset or empty, the "legacy" RuntimeClass will be used, which is an implicit class with an empty definition that uses the default runtime handler. More info: https://git.k8s.io/enhancements/keps/sig-node/585-runtime-class

- **priorityClassName** (string)

  If specified, indicates the pod's priority. "system-node-critical" and "system-cluster-critical" are two special keywords which indicate the highest priorities with the former being the highest priority. Any other name must be defined by creating a PriorityClass object with that name. If not specified, the pod priority will be default or zero if there is no default.

- **priority** (int32)

  The priority value. Various system components use this field to find the priority of the pod. When Priority Admission Controller is enabled, it prevents users from setting this field. The admission controller populates this field from PriorityClassName. The higher the value, the higher the priority.

- **preemptionPolicy** (string)

  PreemptionPolicy is the Policy for preempting pods with lower priority. One of Never, PreemptLowerPriority. Defaults to PreemptLowerPriority if unset.

- **topologySpreadConstraints** ([]TopologySpreadConstraint)

  *Patch strategy: merge on key `topologyKey`*
  
  *Map: unique values on keys `topologyKey, whenUnsatisfiable` will be kept during a merge*
  
  TopologySpreadConstraints describes how a group of pods ought to spread across topology domains. Scheduler will schedule pods in a way which abides by the constraints. All topologySpreadConstraints are ANDed.

  <a name="TopologySpreadConstraint"></a>
  *TopologySpreadConstraint specifies how to spread matching pods among the given topology.*

  - **topologySpreadConstraints.maxSkew** (int32), required

    MaxSkew describes the degree to which pods may be unevenly distributed. When `whenUnsatisfiable=DoNotSchedule`, it is the maximum permitted difference between the number of matching pods in the target topology and the global minimum. The global minimum is the minimum number of matching pods in an eligible domain or zero if the number of eligible domains is less than MinDomains. For example, in a 3-zone cluster, MaxSkew is set to 1, and pods with the same labelSelector spread as 2/2/1: In this case, the global minimum is 1. | zone1 | zone2 | zone3 | |  P P  |  P P  |   P   | - if MaxSkew is 1, incoming pod can only be scheduled to zone3 to become 2/2/2; scheduling it onto zone1(zone2) would make the ActualSkew(3-1) on zone1(zone2) violate MaxSkew(1). - if MaxSkew is 2, incoming pod can be scheduled onto any zone. When `whenUnsatisfiable=ScheduleAnyway`, it is used to give higher precedence to topologies that satisfy it. It's a required field. Default value is 1 and 0 is not allowed.

  - **topologySpreadConstraints.topologyKey** (string), required

    TopologyKey is the key of node labels. Nodes that have a label with this key and identical values are considered to be in the same topology. We consider each \<key, value> as a "bucket", and try to put balanced number of pods into each bucket. We define a domain as a particular instance of a topology. Also, we define an eligible domain as a domain whose nodes meet the requirements of nodeAffinityPolicy and nodeTaintsPolicy. e.g. If TopologyKey is "kubernetes.io/hostname", each Node is a domain of that topology. And, if TopologyKey is "topology.kubernetes.io/zone", each zone is a domain of that topology. It's a required field.

  - **topologySpreadConstraints.whenUnsatisfiable** (string), required

    WhenUnsatisfiable indicates how to deal with a pod if it doesn't satisfy the spread constraint. - DoNotSchedule (default) tells the scheduler not to schedule it. - ScheduleAnyway tells the scheduler to schedule the pod in any location,
      but giving higher precedence to topologies that would help reduce the
      skew.
    A constraint is considered "Unsatisfiable" for an incoming pod if and only if every possible node assignment for that pod would violate "MaxSkew" on some topology. For example, in a 3-zone cluster, MaxSkew is set to 1, and pods with the same labelSelector spread as 3/1/1: | zone1 | zone2 | zone3 | | P P P |   P   |   P   | If WhenUnsatisfiable is set to DoNotSchedule, incoming pod can only be scheduled to zone2(zone3) to become 3/2/1(3/1/2) as ActualSkew(2-1) on zone2(zone3) satisfies MaxSkew(1). In other words, the cluster can still be imbalanced, but scheduler won't make it *more* imbalanced. It's a required field.

  - **topologySpreadConstraints.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    LabelSelector is used to find matching pods. Pods that match this label selector are counted to determine the number of pods in their corresponding topology domain.

  - **topologySpreadConstraints.matchLabelKeys** ([]string)

    *Atomic: will be replaced during a merge*
    
    MatchLabelKeys is a set of pod label keys to select the pods over which spreading will be calculated. The keys are used to lookup values from the incoming pod labels, those key-value labels are ANDed with labelSelector to select the group of existing pods over which spreading will be calculated for the incoming pod. The same key is forbidden to exist in both MatchLabelKeys and LabelSelector. MatchLabelKeys cannot be set when LabelSelector isn't set. Keys that don't exist in the incoming pod labels will be ignored. A null or empty list means only match against labelSelector.
    
    This is a beta field and requires the MatchLabelKeysInPodTopologySpread feature gate to be enabled (enabled by default).

  - **topologySpreadConstraints.minDomains** (int32)

    MinDomains indicates a minimum number of eligible domains. When the number of eligible domains with matching topology keys is less than minDomains, Pod Topology Spread treats "global minimum" as 0, and then the calculation of Skew is performed. And when the number of eligible domains with matching topology keys equals or greater than minDomains, this value has no effect on scheduling. As a result, when the number of eligible domains is less than minDomains, scheduler won't schedule more than maxSkew Pods to those domains. If value is nil, the constraint behaves as if MinDomains is equal to 1. Valid values are integers greater than 0. When value is not nil, WhenUnsatisfiable must be DoNotSchedule.
    
    For example, in a 3-zone cluster, MaxSkew is set to 2, MinDomains is set to 5 and pods with the same labelSelector spread as 2/2/2: | zone1 | zone2 | zone3 | |  P P  |  P P  |  P P  | The number of domains is less than 5(MinDomains), so "global minimum" is treated as 0. In this situation, new pod with the same labelSelector cannot be scheduled, because computed skew will be 3(3 - 0) if new Pod is scheduled to any of the three zones, it will violate MaxSkew.

  - **topologySpreadConstraints.nodeAffinityPolicy** (string)

    NodeAffinityPolicy indicates how we will treat Pod's nodeAffinity/nodeSelector when calculating pod topology spread skew. Options are: - Honor: only nodes matching nodeAffinity/nodeSelector are included in the calculations. - Ignore: nodeAffinity/nodeSelector are ignored. All nodes are included in the calculations.
    
    If this value is nil, the behavior is equivalent to the Honor policy. This is a beta-level feature default enabled by the NodeInclusionPolicyInPodTopologySpread feature flag.

  - **topologySpreadConstraints.nodeTaintsPolicy** (string)

    NodeTaintsPolicy indicates how we will treat node taints when calculating pod topology spread skew. Options are: - Honor: nodes without taints, along with tainted nodes for which the incoming pod has a toleration, are included. - Ignore: node taints are ignored. All nodes are included.
    
    If this value is nil, the behavior is equivalent to the Ignore policy. This is a beta-level feature default enabled by the NodeInclusionPolicyInPodTopologySpread feature flag.

- **overhead** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Overhead represents the resource overhead associated with running a pod for a given RuntimeClass. This field will be autopopulated at admission time by the RuntimeClass admission controller. If the RuntimeClass admission controller is enabled, overhead must not be set in Pod create requests. The RuntimeClass admission controller will reject Pod create requests which have the overhead already set. If RuntimeClass is configured and selected in the PodSpec, Overhead will be set to the value defined in the corresponding RuntimeClass, otherwise it will remain unset and treated as zero. More info: https://git.k8s.io/enhancements/keps/sig-node/688-pod-overhead/README.md

### Lifecycle


- **restartPolicy** (string)

  Restart policy for all containers within the pod. One of Always, OnFailure, Never. In some contexts, only a subset of those values may be permitted. Default to Always. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

- **terminationGracePeriodSeconds** (int64)

  Optional duration in seconds the pod needs to terminate gracefully. May be decreased in delete request. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). If this value is nil, the default grace period will be used instead. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. Defaults to 30 seconds.

- **activeDeadlineSeconds** (int64)

  Optional duration in seconds the pod may be active on the node relative to StartTime before the system will actively try to mark it failed and kill associated containers. Value must be a positive integer.

- **readinessGates** ([]PodReadinessGate)

  *Atomic: will be replaced during a merge*
  
  If specified, all readiness gates will be evaluated for pod readiness. A pod is ready when all its containers are ready AND all conditions specified in the readiness gates have status equal to "True" More info: https://git.k8s.io/enhancements/keps/sig-network/580-pod-readiness-gates

  <a name="PodReadinessGate"></a>
  *PodReadinessGate contains the reference to a pod condition*

  - **readinessGates.conditionType** (string), required

    ConditionType refers to a condition in the pod's condition list with matching type.

### Hostname and Name resolution


- **hostname** (string)

  Specifies the hostname of the Pod If not specified, the pod's hostname will be set to a system-defined value.

- **setHostnameAsFQDN** (boolean)

  If true the pod's hostname will be configured as the pod's FQDN, rather than the leaf name (the default). In Linux containers, this means setting the FQDN in the hostname field of the kernel (the nodename field of struct utsname). In Windows containers, this means setting the registry value of hostname for the registry key HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters to FQDN. If a pod does not have FQDN, this has no effect. Default to false.

- **subdomain** (string)

  If specified, the fully qualified Pod hostname will be "\<hostname>.\<subdomain>.\<pod namespace>.svc.\<cluster domain>". If not specified, the pod will not have a domainname at all.

- **hostAliases** ([]HostAlias)

  *Patch strategy: merge on key `ip`*
  
  *Map: unique values on key ip will be kept during a merge*
  
  HostAliases is an optional list of hosts and IPs that will be injected into the pod's hosts file if specified.

  <a name="HostAlias"></a>
  *HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.*

  - **hostAliases.ip** (string), required

    IP address of the host file entry.

  - **hostAliases.hostnames** ([]string)

    *Atomic: will be replaced during a merge*
    
    Hostnames for the above IP address.

- **dnsConfig** (PodDNSConfig)

  Specifies the DNS parameters of a pod. Parameters specified here will be merged to the generated DNS configuration based on DNSPolicy.

  <a name="PodDNSConfig"></a>
  *PodDNSConfig defines the DNS parameters of a pod in addition to those generated from DNSPolicy.*

  - **dnsConfig.nameservers** ([]string)

    *Atomic: will be replaced during a merge*
    
    A list of DNS name server IP addresses. This will be appended to the base nameservers generated from DNSPolicy. Duplicated nameservers will be removed.

  - **dnsConfig.options** ([]PodDNSConfigOption)

    *Atomic: will be replaced during a merge*
    
    A list of DNS resolver options. This will be merged with the base options generated from DNSPolicy. Duplicated entries will be removed. Resolution options given in Options will override those that appear in the base DNSPolicy.

    <a name="PodDNSConfigOption"></a>
    *PodDNSConfigOption defines DNS resolver options of a pod.*

    - **dnsConfig.options.name** (string)

      Required.

    - **dnsConfig.options.value** (string)


  - **dnsConfig.searches** ([]string)

    *Atomic: will be replaced during a merge*
    
    A list of DNS search domains for host-name lookup. This will be appended to the base search paths generated from DNSPolicy. Duplicated search paths will be removed.

- **dnsPolicy** (string)

  Set DNS policy for the pod. Defaults to "ClusterFirst". Valid values are 'ClusterFirstWithHostNet', 'ClusterFirst', 'Default' or 'None'. DNS parameters given in DNSConfig will be merged with the policy selected with DNSPolicy. To have DNS options set along with hostNetwork, you have to specify DNS policy explicitly to 'ClusterFirstWithHostNet'.

### Hosts namespaces


- **hostNetwork** (boolean)

  Host networking requested for this pod. Use the host's network namespace. If this option is set, the ports that will be used must be specified. Default to false.

- **hostPID** (boolean)

  Use the host's pid namespace. Optional: Default to false.

- **hostIPC** (boolean)

  Use the host's ipc namespace. Optional: Default to false.

- **shareProcessNamespace** (boolean)

  Share a single process namespace between all of the containers in a pod. When this is set containers will be able to view and signal processes from other containers in the same pod, and the first process in each container will not be assigned PID 1. HostPID and ShareProcessNamespace cannot both be set. Optional: Default to false.

### Service account


- **serviceAccountName** (string)

  ServiceAccountName is the name of the ServiceAccount to use to run this pod. More info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/

- **automountServiceAccountToken** (boolean)

  AutomountServiceAccountToken indicates whether a service account token should be automatically mounted.

### Security context


- **securityContext** (PodSecurityContext)

  SecurityContext holds pod-level security attributes and common container settings. Optional: Defaults to empty.  See type description for default values of each field.

  <a name="PodSecurityContext"></a>
  *PodSecurityContext holds pod-level security attributes and common container settings. Some fields are also present in container.securityContext.  Field values of container.securityContext take precedence over field values of PodSecurityContext.*

  - **securityContext.appArmorProfile** (AppArmorProfile)

    appArmorProfile is the AppArmor options to use by the containers in this pod. Note that this field cannot be set when spec.os.name is windows.

    <a name="AppArmorProfile"></a>
    *AppArmorProfile defines a pod or container's AppArmor settings.*

    - **securityContext.appArmorProfile.type** (string), required

      type indicates which kind of AppArmor profile will be applied. Valid options are:
        Localhost - a profile pre-loaded on the node.
        RuntimeDefault - the container runtime's default profile.
        Unconfined - no AppArmor enforcement.

    - **securityContext.appArmorProfile.localhostProfile** (string)

      localhostProfile indicates a profile loaded on the node that should be used. The profile must be preconfigured on the node to work. Must match the loaded name of the profile. Must be set if and only if type is "Localhost".

  - **securityContext.fsGroup** (int64)

    A special supplemental group that applies to all containers in a pod. Some volume types allow the Kubelet to change the ownership of that volume to be owned by the pod:
    
    1. The owning GID will be the FSGroup 2. The setgid bit is set (new files created in the volume will be owned by FSGroup) 3. The permission bits are OR'd with rw-rw----
    
    If unset, the Kubelet will not modify the ownership and permissions of any volume. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.fsGroupChangePolicy** (string)

    fsGroupChangePolicy defines behavior of changing ownership and permission of the volume before being exposed inside Pod. This field will only apply to volume types which support fsGroup based ownership(and permissions). It will have no effect on ephemeral volume types such as: secret, configmaps and emptydir. Valid values are "OnRootMismatch" and "Always". If not specified, "Always" is used. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.runAsUser** (int64)

    The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.runAsNonRoot** (boolean)

    Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.

  - **securityContext.runAsGroup** (int64)

    The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.seccompProfile** (SeccompProfile)

    The seccomp options to use by the containers in this pod. Note that this field cannot be set when spec.os.name is windows.

    <a name="SeccompProfile"></a>
    *SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set.*

    - **securityContext.seccompProfile.type** (string), required

      type indicates which kind of seccomp profile will be applied. Valid options are:
      
      Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.

    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must be set if type is "Localhost". Must NOT be set for any other type.

  - **securityContext.seLinuxOptions** (SELinuxOptions)

    The SELinux context to be applied to all containers. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.

    <a name="SELinuxOptions"></a>
    *SELinuxOptions are the labels to be applied to the container*

    - **securityContext.seLinuxOptions.level** (string)

      Level is SELinux level label that applies to the container.

    - **securityContext.seLinuxOptions.role** (string)

      Role is a SELinux role label that applies to the container.

    - **securityContext.seLinuxOptions.type** (string)

      Type is a SELinux type label that applies to the container.

    - **securityContext.seLinuxOptions.user** (string)

      User is a SELinux user label that applies to the container.

  - **securityContext.supplementalGroups** ([]int64)

    *Atomic: will be replaced during a merge*
    
    A list of groups applied to the first process run in each container, in addition to the container's primary GID and fsGroup (if specified).  If the SupplementalGroupsPolicy feature is enabled, the supplementalGroupsPolicy field determines whether these are in addition to or instead of any group memberships defined in the container image. If unspecified, no additional groups are added, though group memberships defined in the container image may still be used, depending on the supplementalGroupsPolicy field. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.supplementalGroupsPolicy** (string)

    Defines how supplemental groups of the first container processes are calculated. Valid values are "Merge" and "Strict". If not specified, "Merge" is used. (Alpha) Using the field requires the SupplementalGroupsPolicy feature gate to be enabled and the container runtime must implement support for this feature. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.sysctls** ([]Sysctl)

    *Atomic: will be replaced during a merge*
    
    Sysctls hold a list of namespaced sysctls used for the pod. Pods with unsupported sysctls (by the container runtime) might fail to launch. Note that this field cannot be set when spec.os.name is windows.

    <a name="Sysctl"></a>
    *Sysctl defines a kernel parameter to be set*

    - **securityContext.sysctls.name** (string), required

      Name of a property to set

    - **securityContext.sysctls.value** (string), required

      Value of a property to set

  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    The Windows specific settings applied to all containers. If unspecified, the options within a container's SecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions contain Windows-specific options and credentials.*

    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      GMSACredentialSpecName is the name of the GMSA credential spec to use.

    - **securityContext.windowsOptions.hostProcess** (boolean)

      HostProcess determines if a container should be run as a 'Host Process' container. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers). In addition, if HostProcess is true then HostNetwork must also be set to true.

    - **securityContext.windowsOptions.runAsUserName** (string)

      The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.

### Alpha level


- **hostUsers** (boolean)

  Use the host's user namespace. Optional: Default to true. If set to true or not present, the pod will be run in the host user namespace, useful for when the pod needs a feature only available to the host user namespace, such as loading a kernel module with CAP_SYS_MODULE. When set to false, a new userns is created for the pod. Setting false is useful for mitigating container breakout vulnerabilities even allowing users to run their containers as root without actually having root privileges on the host. This field is alpha-level and is only honored by servers that enable the UserNamespacesSupport feature.

- **resourceClaims** ([]PodResourceClaim)

  *Patch strategies: retainKeys, merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
  
  ResourceClaims defines which ResourceClaims must be allocated and reserved before the Pod is allowed to start. The resources will be made available to those containers which consume them by name.
  
  This is an alpha field and requires enabling the DynamicResourceAllocation feature gate.
  
  This field is immutable.

  <a name="PodResourceClaim"></a>
  *PodResourceClaim references exactly one ResourceClaim, either directly or by naming a ResourceClaimTemplate which is then turned into a ResourceClaim for the pod.
  
  It adds a name to it that uniquely identifies the ResourceClaim inside the Pod. Containers that need access to the ResourceClaim reference it with this name.*

  - **resourceClaims.name** (string), required

    Name uniquely identifies this resource claim inside the pod. This must be a DNS_LABEL.

  - **resourceClaims.resourceClaimName** (string)

    ResourceClaimName is the name of a ResourceClaim object in the same namespace as this pod.
    
    Exactly one of ResourceClaimName and ResourceClaimTemplateName must be set.

  - **resourceClaims.resourceClaimTemplateName** (string)

    ResourceClaimTemplateName is the name of a ResourceClaimTemplate object in the same namespace as this pod.
    
    The template will be used to create a new ResourceClaim, which will be bound to this pod. When this pod is deleted, the ResourceClaim will also be deleted. The pod name and resource name, along with a generated component, will be used to form a unique name for the ResourceClaim, which will be recorded in pod.status.resourceClaimStatuses.
    
    This field is immutable and no changes will be made to the corresponding ResourceClaim by the control plane after creating the ResourceClaim.
    
    Exactly one of ResourceClaimName and ResourceClaimTemplateName must be set.

- **schedulingGates** ([]PodSchedulingGate)

  *Patch strategy: merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
  
  SchedulingGates is an opaque list of values that if specified will block scheduling the pod. If schedulingGates is not empty, the pod will stay in the SchedulingGated state and the scheduler will not attempt to schedule the pod.
  
  SchedulingGates can only be set at pod creation time, and be removed only afterwards.

  <a name="PodSchedulingGate"></a>
  *PodSchedulingGate is associated to a Pod to guard its scheduling.*

  - **schedulingGates.name** (string), required

    Name of the scheduling gate. Each scheduling gate must have a unique name field.

### Deprecated


- **serviceAccount** (string)

  DeprecatedServiceAccount is a deprecated alias for ServiceAccountName. Deprecated: Use serviceAccountName instead.



## Container {#Container}

A single application container that you want to run within a pod.

<hr>

- **name** (string), required

  Name of the container specified as a DNS_LABEL. Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.



### Image


- **image** (string)

  Container image name. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets.

- **imagePullPolicy** (string)

  Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images

### Entrypoint


- **command** ([]string)

  *Atomic: will be replaced during a merge*
  
  Entrypoint array. Not executed within a shell. The container image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

- **args** ([]string)

  *Atomic: will be replaced during a merge*
  
  Arguments to the entrypoint. The container image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

- **workingDir** (string)

  Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.

### Ports


- **ports** ([]ContainerPort)

  *Patch strategy: merge on key `containerPort`*
  
  *Map: unique values on keys `containerPort, protocol` will be kept during a merge*
  
  List of ports to expose from the container. Not specifying a port here DOES NOT prevent that port from being exposed. Any port which is listening on the default "0.0.0.0" address inside a container will be accessible from the network. Modifying this array with strategic merge patch may corrupt the data. For more information See https://github.com/kubernetes/kubernetes/issues/108255. Cannot be updated.

  <a name="ContainerPort"></a>
  *ContainerPort represents a network port in a single container.*

  - **ports.containerPort** (int32), required

    Number of port to expose on the pod's IP address. This must be a valid port number, 0 \< x \< 65536.

  - **ports.hostIP** (string)

    What host IP to bind the external port to.

  - **ports.hostPort** (int32)

    Number of port to expose on the host. If specified, this must be a valid port number, 0 \< x \< 65536. If HostNetwork is specified, this must match ContainerPort. Most containers do not need this.

  - **ports.name** (string)

    If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services.

  - **ports.protocol** (string)

    Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP".

### Environment variables


- **env** ([]EnvVar)

  *Patch strategy: merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
  
  List of environment variables to set in the container. Cannot be updated.

  <a name="EnvVar"></a>
  *EnvVar represents an environment variable present in a Container.*

  - **env.name** (string), required

    Name of the environment variable. Must be a C_IDENTIFIER.

  - **env.value** (string)

    Variable references $(VAR_NAME) are expanded using the previously defined environment variables in the container and any service environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "".

  - **env.valueFrom** (EnvVarSource)

    Source for the environment variable's value. Cannot be used if value is not empty.

    <a name="EnvVarSource"></a>
    *EnvVarSource represents a source for the value of an EnvVar.*

    - **env.valueFrom.configMapKeyRef** (ConfigMapKeySelector)

      Selects a key of a ConfigMap.

      <a name="ConfigMapKeySelector"></a>
      *Selects a key from a ConfigMap.*

      - **env.valueFrom.configMapKeyRef.key** (string), required

        The key to select.

      - **env.valueFrom.configMapKeyRef.name** (string)

        Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.configMapKeyRef.optional** (boolean)

        Specify whether the ConfigMap or its key must be defined

    - **env.valueFrom.fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

      Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['\<KEY>']`, `metadata.annotations['\<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs.

    - **env.valueFrom.resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

      Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and requests.ephemeral-storage) are currently supported.

    - **env.valueFrom.secretKeyRef** (SecretKeySelector)

      Selects a key of a secret in the pod's namespace

      <a name="SecretKeySelector"></a>
      *SecretKeySelector selects a key of a Secret.*

      - **env.valueFrom.secretKeyRef.key** (string), required

        The key of the secret to select from.  Must be a valid secret key.

      - **env.valueFrom.secretKeyRef.name** (string)

        Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.secretKeyRef.optional** (boolean)

        Specify whether the Secret or its key must be defined

- **envFrom** ([]EnvFromSource)

  *Atomic: will be replaced during a merge*
  
  List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.

  <a name="EnvFromSource"></a>
  *EnvFromSource represents the source of a set of ConfigMaps*

  - **envFrom.configMapRef** (ConfigMapEnvSource)

    The ConfigMap to select from

    <a name="ConfigMapEnvSource"></a>
    *ConfigMapEnvSource selects a ConfigMap to populate the environment variables with.
    
    The contents of the target ConfigMap's Data field will represent the key-value pairs as environment variables.*

    - **envFrom.configMapRef.name** (string)

      Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.configMapRef.optional** (boolean)

      Specify whether the ConfigMap must be defined

  - **envFrom.prefix** (string)

    An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER.

  - **envFrom.secretRef** (SecretEnvSource)

    The Secret to select from

    <a name="SecretEnvSource"></a>
    *SecretEnvSource selects a Secret to populate the environment variables with.
    
    The contents of the target Secret's Data field will represent the key-value pairs as environment variables.*

    - **envFrom.secretRef.name** (string)

      Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.secretRef.optional** (boolean)

      Specify whether the Secret must be defined

### Volumes


- **volumeMounts** ([]VolumeMount)

  *Patch strategy: merge on key `mountPath`*
  
  *Map: unique values on key mountPath will be kept during a merge*
  
  Pod volumes to mount into the container's filesystem. Cannot be updated.

  <a name="VolumeMount"></a>
  *VolumeMount describes a mounting of a Volume within a container.*

  - **volumeMounts.mountPath** (string), required

    Path within the container at which the volume should be mounted.  Must not contain ':'.

  - **volumeMounts.name** (string), required

    This must match the Name of a Volume.

  - **volumeMounts.mountPropagation** (string)

    mountPropagation determines how mounts are propagated from the host to container and the other way around. When not set, MountPropagationNone is used. This field is beta in 1.10. When RecursiveReadOnly is set to IfPossible or to Enabled, MountPropagation must be None or unspecified (which defaults to None).

  - **volumeMounts.readOnly** (boolean)

    Mounted read-only if true, read-write otherwise (false or unspecified). Defaults to false.

  - **volumeMounts.recursiveReadOnly** (string)

    RecursiveReadOnly specifies whether read-only mounts should be handled recursively.
    
    If ReadOnly is false, this field has no meaning and must be unspecified.
    
    If ReadOnly is true, and this field is set to Disabled, the mount is not made recursively read-only.  If this field is set to IfPossible, the mount is made recursively read-only, if it is supported by the container runtime.  If this field is set to Enabled, the mount is made recursively read-only if it is supported by the container runtime, otherwise the pod will not be started and an error will be generated to indicate the reason.
    
    If this field is set to IfPossible or Enabled, MountPropagation must be set to None (or be unspecified, which defaults to None).
    
    If this field is not specified, it is treated as an equivalent of Disabled.

  - **volumeMounts.subPath** (string)

    Path within the volume from which the container's volume should be mounted. Defaults to "" (volume's root).

  - **volumeMounts.subPathExpr** (string)

    Expanded path within the volume from which the container's volume should be mounted. Behaves similarly to SubPath but environment variable references $(VAR_NAME) are expanded using the container's environment. Defaults to "" (volume's root). SubPathExpr and SubPath are mutually exclusive.

- **volumeDevices** ([]VolumeDevice)

  *Patch strategy: merge on key `devicePath`*
  
  *Map: unique values on key devicePath will be kept during a merge*
  
  volumeDevices is the list of block devices to be used by the container.

  <a name="VolumeDevice"></a>
  *volumeDevice describes a mapping of a raw block device within a container.*

  - **volumeDevices.devicePath** (string), required

    devicePath is the path inside of the container that the device will be mapped to.

  - **volumeDevices.name** (string), required

    name must match the name of a persistentVolumeClaim in the pod

### Resources


- **resources** (ResourceRequirements)

  Compute Resources required by this container. Cannot be updated. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  <a name="ResourceRequirements"></a>
  *ResourceRequirements describes the compute resource requirements.*

  - **resources.claims** ([]ResourceClaim)

    *Map: unique values on key name will be kept during a merge*
    
    Claims lists the names of resources, defined in spec.resourceClaims, that are used by this container.
    
    This is an alpha field and requires enabling the DynamicResourceAllocation feature gate.
    
    This field is immutable. It can only be set for containers.

    <a name="ResourceClaim"></a>
    *ResourceClaim references one entry in PodSpec.ResourceClaims.*

    - **resources.claims.name** (string), required

      Name must match the name of one entry in pod.spec.resourceClaims of the Pod where this field is used. It makes that resource available inside a container.

    - **resources.claims.request** (string)

      Request is the name chosen for a request in the referenced claim. If empty, everything from the claim is made available, otherwise only the result of this request.

  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

- **resizePolicy** ([]ContainerResizePolicy)

  *Atomic: will be replaced during a merge*
  
  Resources resize policy for the container.

  <a name="ContainerResizePolicy"></a>
  *ContainerResizePolicy represents resource resize policy for the container.*

  - **resizePolicy.resourceName** (string), required

    Name of the resource to which this resource resize policy applies. Supported values: cpu, memory.

  - **resizePolicy.restartPolicy** (string), required

    Restart policy to apply when specified resource is resized. If not specified, it defaults to NotRequired.

### Lifecycle


- **lifecycle** (Lifecycle)

  Actions that the management system should take in response to container lifecycle events. Cannot be updated.

  <a name="Lifecycle"></a>
  *Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted.*

  - **lifecycle.postStart** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PostStart is called immediately after a container is created. If the handler fails, the container is terminated and restarted according to its restart policy. Other management of the container blocks until the hook completes. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

  - **lifecycle.preStop** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PreStop is called immediately before a container is terminated due to an API request or management event such as liveness/startup probe failure, preemption, resource contention, etc. The handler is not called if the container crashes or exits. The Pod's termination grace period countdown begins before the PreStop hook is executed. Regardless of the outcome of the handler, the container will eventually terminate within the Pod's termination grace period (unless delayed by finalizers). Other management of the container blocks until the hook completes or until the termination grace period is reached. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

- **terminationMessagePath** (string)

  Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.

- **terminationMessagePolicy** (string)

  Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.

- **livenessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Periodic probe of container liveness. Container will be restarted if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

- **readinessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Periodic probe of container service readiness. Container will be removed from service endpoints if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

- **startupProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  StartupProbe indicates that the Pod has successfully initialized. If specified, no other probes are executed until this completes successfully. If this probe fails, the Pod will be restarted, just as if the livenessProbe failed. This can be used to provide different probe parameters at the beginning of a Pod's lifecycle, when it might take a long time to load data or warm a cache, than during steady-state operation. This cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

- **restartPolicy** (string)

  RestartPolicy defines the restart behavior of individual containers in a pod. This field may only be set for init containers, and the only allowed value is "Always". For non-init containers or when this field is not specified, the restart behavior is defined by the Pod's restart policy and the container type. Setting the RestartPolicy as "Always" for the init container will have the following effect: this init container will be continually restarted on exit until all regular containers have terminated. Once all regular containers have completed, all init containers with restartPolicy "Always" will be shut down. This lifecycle differs from normal init containers and is often referred to as a "sidecar" container. Although this init container still starts in the init container sequence, it does not wait for the container to complete before proceeding to the next init container. Instead, the next init container starts immediately after this init container is started, or after any startupProbe has successfully completed.

### Security Context


- **securityContext** (SecurityContext)

  SecurityContext defines the security options the container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext. More info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/

  <a name="SecurityContext"></a>
  *SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext.  When both are set, the values in SecurityContext take precedence.*

  - **securityContext.allowPrivilegeEscalation** (boolean)

    AllowPrivilegeEscalation controls whether a process can gain more privileges than its parent process. This bool directly controls if the no_new_privs flag will be set on the container process. AllowPrivilegeEscalation is true always when the container is: 1) run as Privileged 2) has CAP_SYS_ADMIN Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.appArmorProfile** (AppArmorProfile)

    appArmorProfile is the AppArmor options to use by this container. If set, this profile overrides the pod's appArmorProfile. Note that this field cannot be set when spec.os.name is windows.

    <a name="AppArmorProfile"></a>
    *AppArmorProfile defines a pod or container's AppArmor settings.*

    - **securityContext.appArmorProfile.type** (string), required

      type indicates which kind of AppArmor profile will be applied. Valid options are:
        Localhost - a profile pre-loaded on the node.
        RuntimeDefault - the container runtime's default profile.
        Unconfined - no AppArmor enforcement.

    - **securityContext.appArmorProfile.localhostProfile** (string)

      localhostProfile indicates a profile loaded on the node that should be used. The profile must be preconfigured on the node to work. Must match the loaded name of the profile. Must be set if and only if type is "Localhost".

  - **securityContext.capabilities** (Capabilities)

    The capabilities to add/drop when running containers. Defaults to the default set of capabilities granted by the container runtime. Note that this field cannot be set when spec.os.name is windows.

    <a name="Capabilities"></a>
    *Adds and removes POSIX capabilities from running containers.*

    - **securityContext.capabilities.add** ([]string)

      *Atomic: will be replaced during a merge*
      
      Added capabilities

    - **securityContext.capabilities.drop** ([]string)

      *Atomic: will be replaced during a merge*
      
      Removed capabilities

  - **securityContext.procMount** (string)

    procMount denotes the type of proc mount to use for the containers. The default value is Default which uses the container runtime defaults for readonly paths and masked paths. This requires the ProcMountType feature flag to be enabled. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.privileged** (boolean)

    Run container in privileged mode. Processes in privileged containers are essentially equivalent to root on the host. Defaults to false. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.readOnlyRootFilesystem** (boolean)

    Whether this container has a read-only root filesystem. Default is false. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.runAsUser** (int64)

    The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.runAsNonRoot** (boolean)

    Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.

  - **securityContext.runAsGroup** (int64)

    The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.seLinuxOptions** (SELinuxOptions)

    The SELinux context to be applied to the container. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.

    <a name="SELinuxOptions"></a>
    *SELinuxOptions are the labels to be applied to the container*

    - **securityContext.seLinuxOptions.level** (string)

      Level is SELinux level label that applies to the container.

    - **securityContext.seLinuxOptions.role** (string)

      Role is a SELinux role label that applies to the container.

    - **securityContext.seLinuxOptions.type** (string)

      Type is a SELinux type label that applies to the container.

    - **securityContext.seLinuxOptions.user** (string)

      User is a SELinux user label that applies to the container.

  - **securityContext.seccompProfile** (SeccompProfile)

    The seccomp options to use by this container. If seccomp options are provided at both the pod & container level, the container options override the pod options. Note that this field cannot be set when spec.os.name is windows.

    <a name="SeccompProfile"></a>
    *SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set.*

    - **securityContext.seccompProfile.type** (string), required

      type indicates which kind of seccomp profile will be applied. Valid options are:
      
      Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.

    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must be set if type is "Localhost". Must NOT be set for any other type.

  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    The Windows specific settings applied to all containers. If unspecified, the options from the PodSecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions contain Windows-specific options and credentials.*

    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      GMSACredentialSpecName is the name of the GMSA credential spec to use.

    - **securityContext.windowsOptions.hostProcess** (boolean)

      HostProcess determines if a container should be run as a 'Host Process' container. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers). In addition, if HostProcess is true then HostNetwork must also be set to true.

    - **securityContext.windowsOptions.runAsUserName** (string)

      The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.

### Debugging


- **stdin** (boolean)

  Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.

- **stdinOnce** (boolean)

  Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false

- **tty** (boolean)

  Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.



## EphemeralContainer {#EphemeralContainer}

An EphemeralContainer is a temporary container that you may add to an existing Pod for user-initiated activities such as debugging. Ephemeral containers have no resource or scheduling guarantees, and they will not be restarted when they exit or when a Pod is removed or restarted. The kubelet may evict a Pod if an ephemeral container causes the Pod to exceed its resource allocation.

To add an ephemeral container, use the ephemeralcontainers subresource of an existing Pod. Ephemeral containers may not be removed or restarted.

<hr>

- **name** (string), required

  Name of the ephemeral container specified as a DNS_LABEL. This name must be unique among all containers, init containers and ephemeral containers.

- **targetContainerName** (string)

  If set, the name of the container from PodSpec that this ephemeral container targets. The ephemeral container will be run in the namespaces (IPC, PID, etc) of this container. If not set then the ephemeral container uses the namespaces configured in the Pod spec.
  
  The container runtime must implement support for this feature. If the runtime does not support namespace targeting then the result of setting this field is undefined.



### Image


- **image** (string)

  Container image name. More info: https://kubernetes.io/docs/concepts/containers/images

- **imagePullPolicy** (string)

  Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images

### Entrypoint


- **command** ([]string)

  *Atomic: will be replaced during a merge*
  
  Entrypoint array. Not executed within a shell. The image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

- **args** ([]string)

  *Atomic: will be replaced during a merge*
  
  Arguments to the entrypoint. The image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

- **workingDir** (string)

  Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.

### Environment variables


- **env** ([]EnvVar)

  *Patch strategy: merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
  
  List of environment variables to set in the container. Cannot be updated.

  <a name="EnvVar"></a>
  *EnvVar represents an environment variable present in a Container.*

  - **env.name** (string), required

    Name of the environment variable. Must be a C_IDENTIFIER.

  - **env.value** (string)

    Variable references $(VAR_NAME) are expanded using the previously defined environment variables in the container and any service environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "".

  - **env.valueFrom** (EnvVarSource)

    Source for the environment variable's value. Cannot be used if value is not empty.

    <a name="EnvVarSource"></a>
    *EnvVarSource represents a source for the value of an EnvVar.*

    - **env.valueFrom.configMapKeyRef** (ConfigMapKeySelector)

      Selects a key of a ConfigMap.

      <a name="ConfigMapKeySelector"></a>
      *Selects a key from a ConfigMap.*

      - **env.valueFrom.configMapKeyRef.key** (string), required

        The key to select.

      - **env.valueFrom.configMapKeyRef.name** (string)

        Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.configMapKeyRef.optional** (boolean)

        Specify whether the ConfigMap or its key must be defined

    - **env.valueFrom.fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

      Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['\<KEY>']`, `metadata.annotations['\<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs.

    - **env.valueFrom.resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

      Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and requests.ephemeral-storage) are currently supported.

    - **env.valueFrom.secretKeyRef** (SecretKeySelector)

      Selects a key of a secret in the pod's namespace

      <a name="SecretKeySelector"></a>
      *SecretKeySelector selects a key of a Secret.*

      - **env.valueFrom.secretKeyRef.key** (string), required

        The key of the secret to select from.  Must be a valid secret key.

      - **env.valueFrom.secretKeyRef.name** (string)

        Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.secretKeyRef.optional** (boolean)

        Specify whether the Secret or its key must be defined

- **envFrom** ([]EnvFromSource)

  *Atomic: will be replaced during a merge*
  
  List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.

  <a name="EnvFromSource"></a>
  *EnvFromSource represents the source of a set of ConfigMaps*

  - **envFrom.configMapRef** (ConfigMapEnvSource)

    The ConfigMap to select from

    <a name="ConfigMapEnvSource"></a>
    *ConfigMapEnvSource selects a ConfigMap to populate the environment variables with.
    
    The contents of the target ConfigMap's Data field will represent the key-value pairs as environment variables.*

    - **envFrom.configMapRef.name** (string)

      Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.configMapRef.optional** (boolean)

      Specify whether the ConfigMap must be defined

  - **envFrom.prefix** (string)

    An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER.

  - **envFrom.secretRef** (SecretEnvSource)

    The Secret to select from

    <a name="SecretEnvSource"></a>
    *SecretEnvSource selects a Secret to populate the environment variables with.
    
    The contents of the target Secret's Data field will represent the key-value pairs as environment variables.*

    - **envFrom.secretRef.name** (string)

      Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.secretRef.optional** (boolean)

      Specify whether the Secret must be defined

### Volumes


- **volumeMounts** ([]VolumeMount)

  *Patch strategy: merge on key `mountPath`*
  
  *Map: unique values on key mountPath will be kept during a merge*
  
  Pod volumes to mount into the container's filesystem. Subpath mounts are not allowed for ephemeral containers. Cannot be updated.

  <a name="VolumeMount"></a>
  *VolumeMount describes a mounting of a Volume within a container.*

  - **volumeMounts.mountPath** (string), required

    Path within the container at which the volume should be mounted.  Must not contain ':'.

  - **volumeMounts.name** (string), required

    This must match the Name of a Volume.

  - **volumeMounts.mountPropagation** (string)

    mountPropagation determines how mounts are propagated from the host to container and the other way around. When not set, MountPropagationNone is used. This field is beta in 1.10. When RecursiveReadOnly is set to IfPossible or to Enabled, MountPropagation must be None or unspecified (which defaults to None).

  - **volumeMounts.readOnly** (boolean)

    Mounted read-only if true, read-write otherwise (false or unspecified). Defaults to false.

  - **volumeMounts.recursiveReadOnly** (string)

    RecursiveReadOnly specifies whether read-only mounts should be handled recursively.
    
    If ReadOnly is false, this field has no meaning and must be unspecified.
    
    If ReadOnly is true, and this field is set to Disabled, the mount is not made recursively read-only.  If this field is set to IfPossible, the mount is made recursively read-only, if it is supported by the container runtime.  If this field is set to Enabled, the mount is made recursively read-only if it is supported by the container runtime, otherwise the pod will not be started and an error will be generated to indicate the reason.
    
    If this field is set to IfPossible or Enabled, MountPropagation must be set to None (or be unspecified, which defaults to None).
    
    If this field is not specified, it is treated as an equivalent of Disabled.

  - **volumeMounts.subPath** (string)

    Path within the volume from which the container's volume should be mounted. Defaults to "" (volume's root).

  - **volumeMounts.subPathExpr** (string)

    Expanded path within the volume from which the container's volume should be mounted. Behaves similarly to SubPath but environment variable references $(VAR_NAME) are expanded using the container's environment. Defaults to "" (volume's root). SubPathExpr and SubPath are mutually exclusive.

- **volumeDevices** ([]VolumeDevice)

  *Patch strategy: merge on key `devicePath`*
  
  *Map: unique values on key devicePath will be kept during a merge*
  
  volumeDevices is the list of block devices to be used by the container.

  <a name="VolumeDevice"></a>
  *volumeDevice describes a mapping of a raw block device within a container.*

  - **volumeDevices.devicePath** (string), required

    devicePath is the path inside of the container that the device will be mapped to.

  - **volumeDevices.name** (string), required

    name must match the name of a persistentVolumeClaim in the pod

### Resources


- **resizePolicy** ([]ContainerResizePolicy)

  *Atomic: will be replaced during a merge*
  
  Resources resize policy for the container.

  <a name="ContainerResizePolicy"></a>
  *ContainerResizePolicy represents resource resize policy for the container.*

  - **resizePolicy.resourceName** (string), required

    Name of the resource to which this resource resize policy applies. Supported values: cpu, memory.

  - **resizePolicy.restartPolicy** (string), required

    Restart policy to apply when specified resource is resized. If not specified, it defaults to NotRequired.

### Lifecycle


- **terminationMessagePath** (string)

  Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.

- **terminationMessagePolicy** (string)

  Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.

- **restartPolicy** (string)

  Restart policy for the container to manage the restart behavior of each container within a pod. This may only be set for init containers. You cannot set this field on ephemeral containers.

### Debugging


- **stdin** (boolean)

  Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.

- **stdinOnce** (boolean)

  Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false

- **tty** (boolean)

  Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.

### Security context


- **securityContext** (SecurityContext)

  Optional: SecurityContext defines the security options the ephemeral container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext.

  <a name="SecurityContext"></a>
  *SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext.  When both are set, the values in SecurityContext take precedence.*

  - **securityContext.allowPrivilegeEscalation** (boolean)

    AllowPrivilegeEscalation controls whether a process can gain more privileges than its parent process. This bool directly controls if the no_new_privs flag will be set on the container process. AllowPrivilegeEscalation is true always when the container is: 1) run as Privileged 2) has CAP_SYS_ADMIN Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.appArmorProfile** (AppArmorProfile)

    appArmorProfile is the AppArmor options to use by this container. If set, this profile overrides the pod's appArmorProfile. Note that this field cannot be set when spec.os.name is windows.

    <a name="AppArmorProfile"></a>
    *AppArmorProfile defines a pod or container's AppArmor settings.*

    - **securityContext.appArmorProfile.type** (string), required

      type indicates which kind of AppArmor profile will be applied. Valid options are:
        Localhost - a profile pre-loaded on the node.
        RuntimeDefault - the container runtime's default profile.
        Unconfined - no AppArmor enforcement.

    - **securityContext.appArmorProfile.localhostProfile** (string)

      localhostProfile indicates a profile loaded on the node that should be used. The profile must be preconfigured on the node to work. Must match the loaded name of the profile. Must be set if and only if type is "Localhost".

  - **securityContext.capabilities** (Capabilities)

    The capabilities to add/drop when running containers. Defaults to the default set of capabilities granted by the container runtime. Note that this field cannot be set when spec.os.name is windows.

    <a name="Capabilities"></a>
    *Adds and removes POSIX capabilities from running containers.*

    - **securityContext.capabilities.add** ([]string)

      *Atomic: will be replaced during a merge*
      
      Added capabilities

    - **securityContext.capabilities.drop** ([]string)

      *Atomic: will be replaced during a merge*
      
      Removed capabilities

  - **securityContext.procMount** (string)

    procMount denotes the type of proc mount to use for the containers. The default value is Default which uses the container runtime defaults for readonly paths and masked paths. This requires the ProcMountType feature flag to be enabled. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.privileged** (boolean)

    Run container in privileged mode. Processes in privileged containers are essentially equivalent to root on the host. Defaults to false. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.readOnlyRootFilesystem** (boolean)

    Whether this container has a read-only root filesystem. Default is false. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.runAsUser** (int64)

    The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.runAsNonRoot** (boolean)

    Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.

  - **securityContext.runAsGroup** (int64)

    The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.seLinuxOptions** (SELinuxOptions)

    The SELinux context to be applied to the container. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.

    <a name="SELinuxOptions"></a>
    *SELinuxOptions are the labels to be applied to the container*

    - **securityContext.seLinuxOptions.level** (string)

      Level is SELinux level label that applies to the container.

    - **securityContext.seLinuxOptions.role** (string)

      Role is a SELinux role label that applies to the container.

    - **securityContext.seLinuxOptions.type** (string)

      Type is a SELinux type label that applies to the container.

    - **securityContext.seLinuxOptions.user** (string)

      User is a SELinux user label that applies to the container.

  - **securityContext.seccompProfile** (SeccompProfile)

    The seccomp options to use by this container. If seccomp options are provided at both the pod & container level, the container options override the pod options. Note that this field cannot be set when spec.os.name is windows.

    <a name="SeccompProfile"></a>
    *SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set.*

    - **securityContext.seccompProfile.type** (string), required

      type indicates which kind of seccomp profile will be applied. Valid options are:
      
      Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.

    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must be set if type is "Localhost". Must NOT be set for any other type.

  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    The Windows specific settings applied to all containers. If unspecified, the options from the PodSecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions contain Windows-specific options and credentials.*

    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      GMSACredentialSpecName is the name of the GMSA credential spec to use.

    - **securityContext.windowsOptions.hostProcess** (boolean)

      HostProcess determines if a container should be run as a 'Host Process' container. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers). In addition, if HostProcess is true then HostNetwork must also be set to true.

    - **securityContext.windowsOptions.runAsUserName** (string)

      The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.

### Not allowed


- **ports** ([]ContainerPort)

  *Patch strategy: merge on key `containerPort`*
  
  *Map: unique values on keys `containerPort, protocol` will be kept during a merge*
  
  Ports are not allowed for ephemeral containers.

  <a name="ContainerPort"></a>
  *ContainerPort represents a network port in a single container.*

  - **ports.containerPort** (int32), required

    Number of port to expose on the pod's IP address. This must be a valid port number, 0 \< x \< 65536.

  - **ports.hostIP** (string)

    What host IP to bind the external port to.

  - **ports.hostPort** (int32)

    Number of port to expose on the host. If specified, this must be a valid port number, 0 \< x \< 65536. If HostNetwork is specified, this must match ContainerPort. Most containers do not need this.

  - **ports.name** (string)

    If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services.

  - **ports.protocol** (string)

    Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP".

- **resources** (ResourceRequirements)

  Resources are not allowed for ephemeral containers. Ephemeral containers use spare resources already allocated to the pod.

  <a name="ResourceRequirements"></a>
  *ResourceRequirements describes the compute resource requirements.*

  - **resources.claims** ([]ResourceClaim)

    *Map: unique values on key name will be kept during a merge*
    
    Claims lists the names of resources, defined in spec.resourceClaims, that are used by this container.
    
    This is an alpha field and requires enabling the DynamicResourceAllocation feature gate.
    
    This field is immutable. It can only be set for containers.

    <a name="ResourceClaim"></a>
    *ResourceClaim references one entry in PodSpec.ResourceClaims.*

    - **resources.claims.name** (string), required

      Name must match the name of one entry in pod.spec.resourceClaims of the Pod where this field is used. It makes that resource available inside a container.

    - **resources.claims.request** (string)

      Request is the name chosen for a request in the referenced claim. If empty, everything from the claim is made available, otherwise only the result of this request.

  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

- **lifecycle** (Lifecycle)

  Lifecycle is not allowed for ephemeral containers.

  <a name="Lifecycle"></a>
  *Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted.*

  - **lifecycle.postStart** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PostStart is called immediately after a container is created. If the handler fails, the container is terminated and restarted according to its restart policy. Other management of the container blocks until the hook completes. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

  - **lifecycle.preStop** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PreStop is called immediately before a container is terminated due to an API request or management event such as liveness/startup probe failure, preemption, resource contention, etc. The handler is not called if the container crashes or exits. The Pod's termination grace period countdown begins before the PreStop hook is executed. Regardless of the outcome of the handler, the container will eventually terminate within the Pod's termination grace period (unless delayed by finalizers). Other management of the container blocks until the hook completes or until the termination grace period is reached. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

- **livenessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Probes are not allowed for ephemeral containers.

- **readinessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Probes are not allowed for ephemeral containers.

- **startupProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Probes are not allowed for ephemeral containers.



## LifecycleHandler {#LifecycleHandler}

LifecycleHandler defines a specific action that should be taken in a lifecycle hook. One and only one of the fields, except TCPSocket must be specified.

<hr>

- **exec** (ExecAction)

  Exec specifies the action to take.

  <a name="ExecAction"></a>
  *ExecAction describes a "run in container" action.*

  - **exec.command** ([]string)

    *Atomic: will be replaced during a merge*
    
    Command is the command line to execute inside the container, the working directory for the command  is root ('/') in the container's filesystem. The command is simply exec'd, it is not run inside a shell, so traditional shell instructions ('|', etc) won't work. To use a shell, you need to explicitly call out to that shell. Exit status of 0 is treated as live/healthy and non-zero is unhealthy.

- **httpGet** (HTTPGetAction)

  HTTPGet specifies the http request to perform.

  <a name="HTTPGetAction"></a>
  *HTTPGetAction describes an action based on HTTP Get requests.*

  - **httpGet.port** (IntOrString), required

    Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*

  - **httpGet.host** (string)

    Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.

  - **httpGet.httpHeaders** ([]HTTPHeader)

    *Atomic: will be replaced during a merge*
    
    Custom headers to set in the request. HTTP allows repeated headers.

    <a name="HTTPHeader"></a>
    *HTTPHeader describes a custom header to be used in HTTP probes*

    - **httpGet.httpHeaders.name** (string), required

      The header field name. This will be canonicalized upon output, so case-variant names will be understood as the same header.

    - **httpGet.httpHeaders.value** (string), required

      The header field value

  - **httpGet.path** (string)

    Path to access on the HTTP server.

  - **httpGet.scheme** (string)

    Scheme to use for connecting to the host. Defaults to HTTP.

- **sleep** (SleepAction)

  Sleep represents the duration that the container should sleep before being terminated.

  <a name="SleepAction"></a>
  *SleepAction describes a "sleep" action.*

  - **sleep.seconds** (int64), required

    Seconds is the number of seconds to sleep.

- **tcpSocket** (TCPSocketAction)

  Deprecated. TCPSocket is NOT supported as a LifecycleHandler and kept for the backward compatibility. There are no validation of this field and lifecycle hooks will fail in runtime when tcp handler is specified.

  <a name="TCPSocketAction"></a>
  *TCPSocketAction describes an action based on opening a socket*

  - **tcpSocket.port** (IntOrString), required

    Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*

  - **tcpSocket.host** (string)

    Optional: Host name to connect to, defaults to the pod IP.





## NodeAffinity {#NodeAffinity}

Node affinity is a group of node affinity scheduling rules.

<hr>

- **preferredDuringSchedulingIgnoredDuringExecution** ([]PreferredSchedulingTerm)

  *Atomic: will be replaced during a merge*
  
  The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node matches the corresponding matchExpressions; the node(s) with the highest sum are the most preferred.

  <a name="PreferredSchedulingTerm"></a>
  *An empty preferred scheduling term matches all objects with implicit weight 0 (i.e. it's a no-op). A null preferred scheduling term matches no objects (i.e. is also a no-op).*

  - **preferredDuringSchedulingIgnoredDuringExecution.preference** (NodeSelectorTerm), required

    A node selector term, associated with the corresponding weight.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*

    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: will be replaced during a merge*
      
      A list of node selector requirements by node's labels.

    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: will be replaced during a merge*
      
      A list of node selector requirements by node's fields.

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), required

    Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100.

- **requiredDuringSchedulingIgnoredDuringExecution** (NodeSelector)

  If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to an update), the system may or may not try to eventually evict the pod from its node.

  <a name="NodeSelector"></a>
  *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*

  - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms** ([]NodeSelectorTerm), required

    *Atomic: will be replaced during a merge*
    
    Required. A list of node selector terms. The terms are ORed.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*

    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: will be replaced during a merge*
      
      A list of node selector requirements by node's labels.

    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: will be replaced during a merge*
      
      A list of node selector requirements by node's fields.





## PodAffinity {#PodAffinity}

Pod affinity is a group of inter pod affinity scheduling rules.

<hr>

- **preferredDuringSchedulingIgnoredDuringExecution** ([]WeightedPodAffinityTerm)

  *Atomic: will be replaced during a merge*
  
  The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.

  <a name="WeightedPodAffinityTerm"></a>
  *The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)*

  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm), required

    Required. A pod affinity term, associated with the corresponding weight.

    <a name="PodAffinityTerm"></a>
    *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey** (string), required

      This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      A label query over a set of resources, in this case pods. If it's null, this PodAffinityTerm matches with no Pods.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.matchLabelKeys** ([]string)

      *Atomic: will be replaced during a merge*
      
      MatchLabelKeys is a set of pod label keys to select which pods will be taken into consideration. The keys are used to lookup values from the incoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)` to select the group of existing pods which pods will be taken into consideration for the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming pod labels will be ignored. The default value is empty. The same key is forbidden to exist in both matchLabelKeys and labelSelector. Also, matchLabelKeys cannot be set when labelSelector isn't set. This is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.mismatchLabelKeys** ([]string)

      *Atomic: will be replaced during a merge*
      
      MismatchLabelKeys is a set of pod label keys to select which pods will be taken into consideration. The keys are used to lookup values from the incoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)` to select the group of existing pods which pods will be taken into consideration for the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming pod labels will be ignored. The default value is empty. The same key is forbidden to exist in both mismatchLabelKeys and labelSelector. Also, mismatchLabelKeys cannot be set when labelSelector isn't set. This is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** ([]string)

      *Atomic: will be replaced during a merge*
      
      namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), required

    weight associated with matching the corresponding podAffinityTerm, in the range 1-100.

- **requiredDuringSchedulingIgnoredDuringExecution** ([]PodAffinityTerm)

  *Atomic: will be replaced during a merge*
  
  If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.

  <a name="PodAffinityTerm"></a>
  *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*

  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey** (string), required

    This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.

  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over a set of resources, in this case pods. If it's null, this PodAffinityTerm matches with no Pods.

  - **requiredDuringSchedulingIgnoredDuringExecution.matchLabelKeys** ([]string)

    *Atomic: will be replaced during a merge*
    
    MatchLabelKeys is a set of pod label keys to select which pods will be taken into consideration. The keys are used to lookup values from the incoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)` to select the group of existing pods which pods will be taken into consideration for the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming pod labels will be ignored. The default value is empty. The same key is forbidden to exist in both matchLabelKeys and labelSelector. Also, matchLabelKeys cannot be set when labelSelector isn't set. This is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).

  - **requiredDuringSchedulingIgnoredDuringExecution.mismatchLabelKeys** ([]string)

    *Atomic: will be replaced during a merge*
    
    MismatchLabelKeys is a set of pod label keys to select which pods will be taken into consideration. The keys are used to lookup values from the incoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)` to select the group of existing pods which pods will be taken into consideration for the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming pod labels will be ignored. The default value is empty. The same key is forbidden to exist in both mismatchLabelKeys and labelSelector. Also, mismatchLabelKeys cannot be set when labelSelector isn't set. This is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** ([]string)

    *Atomic: will be replaced during a merge*
    
    namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".





## PodAntiAffinity {#PodAntiAffinity}

Pod anti affinity is a group of inter pod anti affinity scheduling rules.

<hr>

- **preferredDuringSchedulingIgnoredDuringExecution** ([]WeightedPodAffinityTerm)

  *Atomic: will be replaced during a merge*
  
  The scheduler will prefer to schedule pods to nodes that satisfy the anti-affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling anti-affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.

  <a name="WeightedPodAffinityTerm"></a>
  *The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)*

  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm), required

    Required. A pod affinity term, associated with the corresponding weight.

    <a name="PodAffinityTerm"></a>
    *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey** (string), required

      This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      A label query over a set of resources, in this case pods. If it's null, this PodAffinityTerm matches with no Pods.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.matchLabelKeys** ([]string)

      *Atomic: will be replaced during a merge*
      
      MatchLabelKeys is a set of pod label keys to select which pods will be taken into consideration. The keys are used to lookup values from the incoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)` to select the group of existing pods which pods will be taken into consideration for the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming pod labels will be ignored. The default value is empty. The same key is forbidden to exist in both matchLabelKeys and labelSelector. Also, matchLabelKeys cannot be set when labelSelector isn't set. This is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.mismatchLabelKeys** ([]string)

      *Atomic: will be replaced during a merge*
      
      MismatchLabelKeys is a set of pod label keys to select which pods will be taken into consideration. The keys are used to lookup values from the incoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)` to select the group of existing pods which pods will be taken into consideration for the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming pod labels will be ignored. The default value is empty. The same key is forbidden to exist in both mismatchLabelKeys and labelSelector. Also, mismatchLabelKeys cannot be set when labelSelector isn't set. This is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** ([]string)

      *Atomic: will be replaced during a merge*
      
      namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), required

    weight associated with matching the corresponding podAffinityTerm, in the range 1-100.

- **requiredDuringSchedulingIgnoredDuringExecution** ([]PodAffinityTerm)

  *Atomic: will be replaced during a merge*
  
  If the anti-affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the anti-affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.

  <a name="PodAffinityTerm"></a>
  *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*

  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey** (string), required

    This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.

  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over a set of resources, in this case pods. If it's null, this PodAffinityTerm matches with no Pods.

  - **requiredDuringSchedulingIgnoredDuringExecution.matchLabelKeys** ([]string)

    *Atomic: will be replaced during a merge*
    
    MatchLabelKeys is a set of pod label keys to select which pods will be taken into consideration. The keys are used to lookup values from the incoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)` to select the group of existing pods which pods will be taken into consideration for the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming pod labels will be ignored. The default value is empty. The same key is forbidden to exist in both matchLabelKeys and labelSelector. Also, matchLabelKeys cannot be set when labelSelector isn't set. This is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).

  - **requiredDuringSchedulingIgnoredDuringExecution.mismatchLabelKeys** ([]string)

    *Atomic: will be replaced during a merge*
    
    MismatchLabelKeys is a set of pod label keys to select which pods will be taken into consideration. The keys are used to lookup values from the incoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)` to select the group of existing pods which pods will be taken into consideration for the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming pod labels will be ignored. The default value is empty. The same key is forbidden to exist in both mismatchLabelKeys and labelSelector. Also, mismatchLabelKeys cannot be set when labelSelector isn't set. This is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** ([]string)

    *Atomic: will be replaced during a merge*
    
    namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".





## Probe {#Probe}

Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.

<hr>

- **exec** (ExecAction)

  Exec specifies the action to take.

  <a name="ExecAction"></a>
  *ExecAction describes a "run in container" action.*

  - **exec.command** ([]string)

    *Atomic: will be replaced during a merge*
    
    Command is the command line to execute inside the container, the working directory for the command  is root ('/') in the container's filesystem. The command is simply exec'd, it is not run inside a shell, so traditional shell instructions ('|', etc) won't work. To use a shell, you need to explicitly call out to that shell. Exit status of 0 is treated as live/healthy and non-zero is unhealthy.

- **httpGet** (HTTPGetAction)

  HTTPGet specifies the http request to perform.

  <a name="HTTPGetAction"></a>
  *HTTPGetAction describes an action based on HTTP Get requests.*

  - **httpGet.port** (IntOrString), required

    Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*

  - **httpGet.host** (string)

    Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.

  - **httpGet.httpHeaders** ([]HTTPHeader)

    *Atomic: will be replaced during a merge*
    
    Custom headers to set in the request. HTTP allows repeated headers.

    <a name="HTTPHeader"></a>
    *HTTPHeader describes a custom header to be used in HTTP probes*

    - **httpGet.httpHeaders.name** (string), required

      The header field name. This will be canonicalized upon output, so case-variant names will be understood as the same header.

    - **httpGet.httpHeaders.value** (string), required

      The header field value

  - **httpGet.path** (string)

    Path to access on the HTTP server.

  - **httpGet.scheme** (string)

    Scheme to use for connecting to the host. Defaults to HTTP.

- **tcpSocket** (TCPSocketAction)

  TCPSocket specifies an action involving a TCP port.

  <a name="TCPSocketAction"></a>
  *TCPSocketAction describes an action based on opening a socket*

  - **tcpSocket.port** (IntOrString), required

    Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*

  - **tcpSocket.host** (string)

    Optional: Host name to connect to, defaults to the pod IP.

- **initialDelaySeconds** (int32)

  Number of seconds after the container has started before liveness probes are initiated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

- **terminationGracePeriodSeconds** (int64)

  Optional duration in seconds the pod needs to terminate gracefully upon probe failure. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. If this value is nil, the pod's terminationGracePeriodSeconds will be used. Otherwise, this value overrides the value provided by the pod spec. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). This is a beta field and requires enabling ProbeTerminationGracePeriod feature gate. Minimum value is 1. spec.terminationGracePeriodSeconds is used if unset.

- **periodSeconds** (int32)

  How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1.

- **timeoutSeconds** (int32)

  Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

- **failureThreshold** (int32)

  Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.

- **successThreshold** (int32)

  Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup. Minimum value is 1.

- **grpc** (GRPCAction)

  GRPC specifies an action involving a GRPC port.

  <a name="GRPCAction"></a>
  **

  - **grpc.port** (int32), required

    Port number of the gRPC service. Number must be in the range 1 to 65535.

  - **grpc.service** (string)

    Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).
    
    If this is not specified, the default behavior is defined by gRPC.





## PodStatus {#PodStatus}

PodStatus represents information about the status of a pod. Status may trail the actual state of a system, especially if the node that hosts the pod cannot contact the control plane.

<hr>

- **nominatedNodeName** (string)

  nominatedNodeName is set only when this pod preempts other pods on the node, but it cannot be scheduled right away as preemption victims receive their graceful termination periods. This field does not guarantee that the pod will be scheduled on this node. Scheduler may decide to place the pod elsewhere if other nodes become available sooner. Scheduler may also decide to give the resources on this node to a higher priority pod that is created after preemption. As a result, this field may be different than PodSpec.nodeName when the pod is scheduled.

- **hostIP** (string)

  hostIP holds the IP address of the host to which the pod is assigned. Empty if the pod has not started yet. A pod can be assigned to a node that has a problem in kubelet which in turns mean that HostIP will not be updated even if there is a node is assigned to pod

- **hostIPs** ([]HostIP)

  *Patch strategy: merge on key `ip`*
  
  *Atomic: will be replaced during a merge*
  
  hostIPs holds the IP addresses allocated to the host. If this field is specified, the first entry must match the hostIP field. This list is empty if the pod has not started yet. A pod can be assigned to a node that has a problem in kubelet which in turns means that HostIPs will not be updated even if there is a node is assigned to this pod.

  <a name="HostIP"></a>
  *HostIP represents a single IP address allocated to the host.*

  - **hostIPs.ip** (string), required

    IP is the IP address assigned to the host

- **startTime** (Time)

  RFC 3339 date and time at which the object was acknowledged by the Kubelet. This is before the Kubelet pulled the container image(s) for the pod.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

- **phase** (string)

  The phase of a Pod is a simple, high-level summary of where the Pod is in its lifecycle. The conditions array, the reason and message fields, and the individual container status arrays contain more detail about the pod's status. There are five possible phase values:
  
  Pending: The pod has been accepted by the Kubernetes system, but one or more of the container images has not been created. This includes time before being scheduled as well as time spent downloading images over the network, which could take a while. Running: The pod has been bound to a node, and all of the containers have been created. At least one container is still running, or is in the process of starting or restarting. Succeeded: All containers in the pod have terminated in success, and will not be restarted. Failed: All containers in the pod have terminated, and at least one container has terminated in failure. The container either exited with non-zero status or was terminated by the system. Unknown: For some reason the state of the pod could not be obtained, typically due to an error in communicating with the host of the pod.
  
  More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-phase

- **message** (string)

  A human readable message indicating details about why the pod is in this condition.

- **reason** (string)

  A brief CamelCase message indicating details about why the pod is in this state. e.g. 'Evicted'

- **podIP** (string)

  podIP address allocated to the pod. Routable at least within the cluster. Empty if not yet allocated.

- **podIPs** ([]PodIP)

  *Patch strategy: merge on key `ip`*
  
  *Map: unique values on key ip will be kept during a merge*
  
  podIPs holds the IP addresses allocated to the pod. If this field is specified, the 0th entry must match the podIP field. Pods may be allocated at most 1 value for each of IPv4 and IPv6. This list is empty if no IPs have been allocated yet.

  <a name="PodIP"></a>
  *PodIP represents a single IP address allocated to the pod.*

  - **podIPs.ip** (string), required

    IP is the IP address assigned to the pod

- **conditions** ([]PodCondition)

  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  Current service state of pod. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  <a name="PodCondition"></a>
  *PodCondition contains details for the current condition of this pod.*

  - **conditions.status** (string), required

    Status is the status of the condition. Can be True, False, Unknown. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  - **conditions.type** (string), required

    Type is the type of the condition. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  - **conditions.lastProbeTime** (Time)

    Last time we probed the condition.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **conditions.lastTransitionTime** (Time)

    Last time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **conditions.message** (string)

    Human-readable message indicating details about last transition.

  - **conditions.reason** (string)

    Unique, one-word, CamelCase reason for the condition's last transition.

- **qosClass** (string)

  The Quality of Service (QOS) classification assigned to the pod based on resource requirements See PodQOSClass type for available QOS classes More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#quality-of-service-classes

- **initContainerStatuses** ([]ContainerStatus)

  *Atomic: will be replaced during a merge*
  
  The list has one entry per init container in the manifest. The most recent successful init container will have ready = true, the most recently started container will have startTime set. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

  <a name="ContainerStatus"></a>
  *ContainerStatus contains details for the current status of this container.*

  - **initContainerStatuses.allocatedResources** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    AllocatedResources represents the compute resources allocated for this container by the node. Kubelet sets this value to Container.Resources.Requests upon successful pod admission and after successfully admitting desired pod resize.

  - **initContainerStatuses.allocatedResourcesStatus** ([]ResourceStatus)

    *Patch strategy: merge on key `name`*
    
    *Map: unique values on key name will be kept during a merge*
    
    AllocatedResourcesStatus represents the status of various resources allocated for this Pod.

    <a name="ResourceStatus"></a>
    **

    - **initContainerStatuses.allocatedResourcesStatus.name** (string), required

      Name of the resource. Must be unique within the pod and match one of the resources from the pod spec.

    - **initContainerStatuses.allocatedResourcesStatus.resources** ([]ResourceHealth)

      *Map: unique values on key resourceID will be kept during a merge*
      
      List of unique Resources health. Each element in the list contains an unique resource ID and resource health. At a minimum, ResourceID must uniquely identify the Resource allocated to the Pod on the Node for the lifetime of a Pod. See ResourceID type for it's definition.

      <a name="ResourceHealth"></a>
      *ResourceHealth represents the health of a resource. It has the latest device health information. This is a part of KEP https://kep.k8s.io/4680 and historical health changes are planned to be added in future iterations of a KEP.*

      - **initContainerStatuses.allocatedResourcesStatus.resources.resourceID** (string), required

        ResourceID is the unique identifier of the resource. See the ResourceID type for more information.

      - **initContainerStatuses.allocatedResourcesStatus.resources.health** (string)

        Health of the resource. can be one of:
         - Healthy: operates as normal
         - Unhealthy: reported unhealthy. We consider this a temporary health issue
                      since we do not have a mechanism today to distinguish
                      temporary and permanent issues.
         - Unknown: The status cannot be determined.
                    For example, Device Plugin got unregistered and hasn't been re-registered since.
        
        In future we may want to introduce the PermanentlyUnhealthy Status.

  - **initContainerStatuses.containerID** (string)

    ContainerID is the ID of the container in the format '\<type>://\<container_id>'. Where type is a container runtime identifier, returned from Version call of CRI API (for example "containerd").

  - **initContainerStatuses.image** (string), required

    Image is the name of container image that the container is running. The container image may not match the image used in the PodSpec, as it may have been resolved by the runtime. More info: https://kubernetes.io/docs/concepts/containers/images.

  - **initContainerStatuses.imageID** (string), required

    ImageID is the image ID of the container's image. The image ID may not match the image ID of the image used in the PodSpec, as it may have been resolved by the runtime.

  - **initContainerStatuses.lastState** (ContainerState)

    LastTerminationState holds the last termination state of the container to help debug container crashes and restarts. This field is not populated if the container is still running and RestartCount is 0.

    <a name="ContainerState"></a>
    *ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.*

    - **initContainerStatuses.lastState.running** (ContainerStateRunning)

      Details about a running container

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning is a running state of a container.*

      - **initContainerStatuses.lastState.running.startedAt** (Time)

        Time at which the container was last (re-)started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

    - **initContainerStatuses.lastState.terminated** (ContainerStateTerminated)

      Details about a terminated container

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated is a terminated state of a container.*

      - **initContainerStatuses.lastState.terminated.containerID** (string)

        Container's ID in the format '\<type>://\<container_id>'

      - **initContainerStatuses.lastState.terminated.exitCode** (int32), required

        Exit status from the last termination of the container

      - **initContainerStatuses.lastState.terminated.startedAt** (Time)

        Time at which previous execution of the container started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **initContainerStatuses.lastState.terminated.finishedAt** (Time)

        Time at which the container last terminated

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **initContainerStatuses.lastState.terminated.message** (string)

        Message regarding the last termination of the container

      - **initContainerStatuses.lastState.terminated.reason** (string)

        (brief) reason from the last termination of the container

      - **initContainerStatuses.lastState.terminated.signal** (int32)

        Signal from the last termination of the container

    - **initContainerStatuses.lastState.waiting** (ContainerStateWaiting)

      Details about a waiting container

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting is a waiting state of a container.*

      - **initContainerStatuses.lastState.waiting.message** (string)

        Message regarding why the container is not yet running.

      - **initContainerStatuses.lastState.waiting.reason** (string)

        (brief) reason the container is not yet running.

  - **initContainerStatuses.name** (string), required

    Name is a DNS_LABEL representing the unique name of the container. Each container in a pod must have a unique name across all container types. Cannot be updated.

  - **initContainerStatuses.ready** (boolean), required

    Ready specifies whether the container is currently passing its readiness check. The value will change as readiness probes keep executing. If no readiness probes are specified, this field defaults to true once the container is fully started (see Started field).
    
    The value is typically used to determine whether a container is ready to accept traffic.

  - **initContainerStatuses.resources** (ResourceRequirements)

    Resources represents the compute resource requests and limits that have been successfully enacted on the running container after it has been started or has been successfully resized.

    <a name="ResourceRequirements"></a>
    *ResourceRequirements describes the compute resource requirements.*

    - **initContainerStatuses.resources.claims** ([]ResourceClaim)

      *Map: unique values on key name will be kept during a merge*
      
      Claims lists the names of resources, defined in spec.resourceClaims, that are used by this container.
      
      This is an alpha field and requires enabling the DynamicResourceAllocation feature gate.
      
      This field is immutable. It can only be set for containers.

      <a name="ResourceClaim"></a>
      *ResourceClaim references one entry in PodSpec.ResourceClaims.*

      - **initContainerStatuses.resources.claims.name** (string), required

        Name must match the name of one entry in pod.spec.resourceClaims of the Pod where this field is used. It makes that resource available inside a container.

      - **initContainerStatuses.resources.claims.request** (string)

        Request is the name chosen for a request in the referenced claim. If empty, everything from the claim is made available, otherwise only the result of this request.

    - **initContainerStatuses.resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

    - **initContainerStatuses.resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  - **initContainerStatuses.restartCount** (int32), required

    RestartCount holds the number of times the container has been restarted. Kubelet makes an effort to always increment the value, but there are cases when the state may be lost due to node restarts and then the value may be reset to 0. The value is never negative.

  - **initContainerStatuses.started** (boolean)

    Started indicates whether the container has finished its postStart lifecycle hook and passed its startup probe. Initialized as false, becomes true after startupProbe is considered successful. Resets to false when the container is restarted, or if kubelet loses state temporarily. In both cases, startup probes will run again. Is always true when no startupProbe is defined and container is running and has passed the postStart lifecycle hook. The null value must be treated the same as false.

  - **initContainerStatuses.state** (ContainerState)

    State holds details about the container's current condition.

    <a name="ContainerState"></a>
    *ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.*

    - **initContainerStatuses.state.running** (ContainerStateRunning)

      Details about a running container

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning is a running state of a container.*

      - **initContainerStatuses.state.running.startedAt** (Time)

        Time at which the container was last (re-)started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

    - **initContainerStatuses.state.terminated** (ContainerStateTerminated)

      Details about a terminated container

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated is a terminated state of a container.*

      - **initContainerStatuses.state.terminated.containerID** (string)

        Container's ID in the format '\<type>://\<container_id>'

      - **initContainerStatuses.state.terminated.exitCode** (int32), required

        Exit status from the last termination of the container

      - **initContainerStatuses.state.terminated.startedAt** (Time)

        Time at which previous execution of the container started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **initContainerStatuses.state.terminated.finishedAt** (Time)

        Time at which the container last terminated

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **initContainerStatuses.state.terminated.message** (string)

        Message regarding the last termination of the container

      - **initContainerStatuses.state.terminated.reason** (string)

        (brief) reason from the last termination of the container

      - **initContainerStatuses.state.terminated.signal** (int32)

        Signal from the last termination of the container

    - **initContainerStatuses.state.waiting** (ContainerStateWaiting)

      Details about a waiting container

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting is a waiting state of a container.*

      - **initContainerStatuses.state.waiting.message** (string)

        Message regarding why the container is not yet running.

      - **initContainerStatuses.state.waiting.reason** (string)

        (brief) reason the container is not yet running.

  - **initContainerStatuses.user** (ContainerUser)

    User represents user identity information initially attached to the first process of the container

    <a name="ContainerUser"></a>
    *ContainerUser represents user identity information*

    - **initContainerStatuses.user.linux** (LinuxContainerUser)

      Linux holds user identity information initially attached to the first process of the containers in Linux. Note that the actual running identity can be changed if the process has enough privilege to do so.

      <a name="LinuxContainerUser"></a>
      *LinuxContainerUser represents user identity information in Linux containers*

      - **initContainerStatuses.user.linux.gid** (int64), required

        GID is the primary gid initially attached to the first process in the container

      - **initContainerStatuses.user.linux.uid** (int64), required

        UID is the primary uid initially attached to the first process in the container

      - **initContainerStatuses.user.linux.supplementalGroups** ([]int64)

        *Atomic: will be replaced during a merge*
        
        SupplementalGroups are the supplemental groups initially attached to the first process in the container

  - **initContainerStatuses.volumeMounts** ([]VolumeMountStatus)

    *Patch strategy: merge on key `mountPath`*
    
    *Map: unique values on key mountPath will be kept during a merge*
    
    Status of volume mounts.

    <a name="VolumeMountStatus"></a>
    *VolumeMountStatus shows status of volume mounts.*

    - **initContainerStatuses.volumeMounts.mountPath** (string), required

      MountPath corresponds to the original VolumeMount.

    - **initContainerStatuses.volumeMounts.name** (string), required

      Name corresponds to the name of the original VolumeMount.

    - **initContainerStatuses.volumeMounts.readOnly** (boolean)

      ReadOnly corresponds to the original VolumeMount.

    - **initContainerStatuses.volumeMounts.recursiveReadOnly** (string)

      RecursiveReadOnly must be set to Disabled, Enabled, or unspecified (for non-readonly mounts). An IfPossible value in the original VolumeMount must be translated to Disabled or Enabled, depending on the mount result.

- **containerStatuses** ([]ContainerStatus)

  *Atomic: will be replaced during a merge*
  
  The list has one entry per container in the manifest. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

  <a name="ContainerStatus"></a>
  *ContainerStatus contains details for the current status of this container.*

  - **containerStatuses.allocatedResources** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    AllocatedResources represents the compute resources allocated for this container by the node. Kubelet sets this value to Container.Resources.Requests upon successful pod admission and after successfully admitting desired pod resize.

  - **containerStatuses.allocatedResourcesStatus** ([]ResourceStatus)

    *Patch strategy: merge on key `name`*
    
    *Map: unique values on key name will be kept during a merge*
    
    AllocatedResourcesStatus represents the status of various resources allocated for this Pod.

    <a name="ResourceStatus"></a>
    **

    - **containerStatuses.allocatedResourcesStatus.name** (string), required

      Name of the resource. Must be unique within the pod and match one of the resources from the pod spec.

    - **containerStatuses.allocatedResourcesStatus.resources** ([]ResourceHealth)

      *Map: unique values on key resourceID will be kept during a merge*
      
      List of unique Resources health. Each element in the list contains an unique resource ID and resource health. At a minimum, ResourceID must uniquely identify the Resource allocated to the Pod on the Node for the lifetime of a Pod. See ResourceID type for it's definition.

      <a name="ResourceHealth"></a>
      *ResourceHealth represents the health of a resource. It has the latest device health information. This is a part of KEP https://kep.k8s.io/4680 and historical health changes are planned to be added in future iterations of a KEP.*

      - **containerStatuses.allocatedResourcesStatus.resources.resourceID** (string), required

        ResourceID is the unique identifier of the resource. See the ResourceID type for more information.

      - **containerStatuses.allocatedResourcesStatus.resources.health** (string)

        Health of the resource. can be one of:
         - Healthy: operates as normal
         - Unhealthy: reported unhealthy. We consider this a temporary health issue
                      since we do not have a mechanism today to distinguish
                      temporary and permanent issues.
         - Unknown: The status cannot be determined.
                    For example, Device Plugin got unregistered and hasn't been re-registered since.
        
        In future we may want to introduce the PermanentlyUnhealthy Status.

  - **containerStatuses.containerID** (string)

    ContainerID is the ID of the container in the format '\<type>://\<container_id>'. Where type is a container runtime identifier, returned from Version call of CRI API (for example "containerd").

  - **containerStatuses.image** (string), required

    Image is the name of container image that the container is running. The container image may not match the image used in the PodSpec, as it may have been resolved by the runtime. More info: https://kubernetes.io/docs/concepts/containers/images.

  - **containerStatuses.imageID** (string), required

    ImageID is the image ID of the container's image. The image ID may not match the image ID of the image used in the PodSpec, as it may have been resolved by the runtime.

  - **containerStatuses.lastState** (ContainerState)

    LastTerminationState holds the last termination state of the container to help debug container crashes and restarts. This field is not populated if the container is still running and RestartCount is 0.

    <a name="ContainerState"></a>
    *ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.*

    - **containerStatuses.lastState.running** (ContainerStateRunning)

      Details about a running container

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning is a running state of a container.*

      - **containerStatuses.lastState.running.startedAt** (Time)

        Time at which the container was last (re-)started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

    - **containerStatuses.lastState.terminated** (ContainerStateTerminated)

      Details about a terminated container

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated is a terminated state of a container.*

      - **containerStatuses.lastState.terminated.containerID** (string)

        Container's ID in the format '\<type>://\<container_id>'

      - **containerStatuses.lastState.terminated.exitCode** (int32), required

        Exit status from the last termination of the container

      - **containerStatuses.lastState.terminated.startedAt** (Time)

        Time at which previous execution of the container started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **containerStatuses.lastState.terminated.finishedAt** (Time)

        Time at which the container last terminated

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **containerStatuses.lastState.terminated.message** (string)

        Message regarding the last termination of the container

      - **containerStatuses.lastState.terminated.reason** (string)

        (brief) reason from the last termination of the container

      - **containerStatuses.lastState.terminated.signal** (int32)

        Signal from the last termination of the container

    - **containerStatuses.lastState.waiting** (ContainerStateWaiting)

      Details about a waiting container

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting is a waiting state of a container.*

      - **containerStatuses.lastState.waiting.message** (string)

        Message regarding why the container is not yet running.

      - **containerStatuses.lastState.waiting.reason** (string)

        (brief) reason the container is not yet running.

  - **containerStatuses.name** (string), required

    Name is a DNS_LABEL representing the unique name of the container. Each container in a pod must have a unique name across all container types. Cannot be updated.

  - **containerStatuses.ready** (boolean), required

    Ready specifies whether the container is currently passing its readiness check. The value will change as readiness probes keep executing. If no readiness probes are specified, this field defaults to true once the container is fully started (see Started field).
    
    The value is typically used to determine whether a container is ready to accept traffic.

  - **containerStatuses.resources** (ResourceRequirements)

    Resources represents the compute resource requests and limits that have been successfully enacted on the running container after it has been started or has been successfully resized.

    <a name="ResourceRequirements"></a>
    *ResourceRequirements describes the compute resource requirements.*

    - **containerStatuses.resources.claims** ([]ResourceClaim)

      *Map: unique values on key name will be kept during a merge*
      
      Claims lists the names of resources, defined in spec.resourceClaims, that are used by this container.
      
      This is an alpha field and requires enabling the DynamicResourceAllocation feature gate.
      
      This field is immutable. It can only be set for containers.

      <a name="ResourceClaim"></a>
      *ResourceClaim references one entry in PodSpec.ResourceClaims.*

      - **containerStatuses.resources.claims.name** (string), required

        Name must match the name of one entry in pod.spec.resourceClaims of the Pod where this field is used. It makes that resource available inside a container.

      - **containerStatuses.resources.claims.request** (string)

        Request is the name chosen for a request in the referenced claim. If empty, everything from the claim is made available, otherwise only the result of this request.

    - **containerStatuses.resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

    - **containerStatuses.resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  - **containerStatuses.restartCount** (int32), required

    RestartCount holds the number of times the container has been restarted. Kubelet makes an effort to always increment the value, but there are cases when the state may be lost due to node restarts and then the value may be reset to 0. The value is never negative.

  - **containerStatuses.started** (boolean)

    Started indicates whether the container has finished its postStart lifecycle hook and passed its startup probe. Initialized as false, becomes true after startupProbe is considered successful. Resets to false when the container is restarted, or if kubelet loses state temporarily. In both cases, startup probes will run again. Is always true when no startupProbe is defined and container is running and has passed the postStart lifecycle hook. The null value must be treated the same as false.

  - **containerStatuses.state** (ContainerState)

    State holds details about the container's current condition.

    <a name="ContainerState"></a>
    *ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.*

    - **containerStatuses.state.running** (ContainerStateRunning)

      Details about a running container

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning is a running state of a container.*

      - **containerStatuses.state.running.startedAt** (Time)

        Time at which the container was last (re-)started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

    - **containerStatuses.state.terminated** (ContainerStateTerminated)

      Details about a terminated container

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated is a terminated state of a container.*

      - **containerStatuses.state.terminated.containerID** (string)

        Container's ID in the format '\<type>://\<container_id>'

      - **containerStatuses.state.terminated.exitCode** (int32), required

        Exit status from the last termination of the container

      - **containerStatuses.state.terminated.startedAt** (Time)

        Time at which previous execution of the container started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **containerStatuses.state.terminated.finishedAt** (Time)

        Time at which the container last terminated

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **containerStatuses.state.terminated.message** (string)

        Message regarding the last termination of the container

      - **containerStatuses.state.terminated.reason** (string)

        (brief) reason from the last termination of the container

      - **containerStatuses.state.terminated.signal** (int32)

        Signal from the last termination of the container

    - **containerStatuses.state.waiting** (ContainerStateWaiting)

      Details about a waiting container

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting is a waiting state of a container.*

      - **containerStatuses.state.waiting.message** (string)

        Message regarding why the container is not yet running.

      - **containerStatuses.state.waiting.reason** (string)

        (brief) reason the container is not yet running.

  - **containerStatuses.user** (ContainerUser)

    User represents user identity information initially attached to the first process of the container

    <a name="ContainerUser"></a>
    *ContainerUser represents user identity information*

    - **containerStatuses.user.linux** (LinuxContainerUser)

      Linux holds user identity information initially attached to the first process of the containers in Linux. Note that the actual running identity can be changed if the process has enough privilege to do so.

      <a name="LinuxContainerUser"></a>
      *LinuxContainerUser represents user identity information in Linux containers*

      - **containerStatuses.user.linux.gid** (int64), required

        GID is the primary gid initially attached to the first process in the container

      - **containerStatuses.user.linux.uid** (int64), required

        UID is the primary uid initially attached to the first process in the container

      - **containerStatuses.user.linux.supplementalGroups** ([]int64)

        *Atomic: will be replaced during a merge*
        
        SupplementalGroups are the supplemental groups initially attached to the first process in the container

  - **containerStatuses.volumeMounts** ([]VolumeMountStatus)

    *Patch strategy: merge on key `mountPath`*
    
    *Map: unique values on key mountPath will be kept during a merge*
    
    Status of volume mounts.

    <a name="VolumeMountStatus"></a>
    *VolumeMountStatus shows status of volume mounts.*

    - **containerStatuses.volumeMounts.mountPath** (string), required

      MountPath corresponds to the original VolumeMount.

    - **containerStatuses.volumeMounts.name** (string), required

      Name corresponds to the name of the original VolumeMount.

    - **containerStatuses.volumeMounts.readOnly** (boolean)

      ReadOnly corresponds to the original VolumeMount.

    - **containerStatuses.volumeMounts.recursiveReadOnly** (string)

      RecursiveReadOnly must be set to Disabled, Enabled, or unspecified (for non-readonly mounts). An IfPossible value in the original VolumeMount must be translated to Disabled or Enabled, depending on the mount result.

- **ephemeralContainerStatuses** ([]ContainerStatus)

  *Atomic: will be replaced during a merge*
  
  Status for any ephemeral containers that have run in this pod.

  <a name="ContainerStatus"></a>
  *ContainerStatus contains details for the current status of this container.*

  - **ephemeralContainerStatuses.allocatedResources** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    AllocatedResources represents the compute resources allocated for this container by the node. Kubelet sets this value to Container.Resources.Requests upon successful pod admission and after successfully admitting desired pod resize.

  - **ephemeralContainerStatuses.allocatedResourcesStatus** ([]ResourceStatus)

    *Patch strategy: merge on key `name`*
    
    *Map: unique values on key name will be kept during a merge*
    
    AllocatedResourcesStatus represents the status of various resources allocated for this Pod.

    <a name="ResourceStatus"></a>
    **

    - **ephemeralContainerStatuses.allocatedResourcesStatus.name** (string), required

      Name of the resource. Must be unique within the pod and match one of the resources from the pod spec.

    - **ephemeralContainerStatuses.allocatedResourcesStatus.resources** ([]ResourceHealth)

      *Map: unique values on key resourceID will be kept during a merge*
      
      List of unique Resources health. Each element in the list contains an unique resource ID and resource health. At a minimum, ResourceID must uniquely identify the Resource allocated to the Pod on the Node for the lifetime of a Pod. See ResourceID type for it's definition.

      <a name="ResourceHealth"></a>
      *ResourceHealth represents the health of a resource. It has the latest device health information. This is a part of KEP https://kep.k8s.io/4680 and historical health changes are planned to be added in future iterations of a KEP.*

      - **ephemeralContainerStatuses.allocatedResourcesStatus.resources.resourceID** (string), required

        ResourceID is the unique identifier of the resource. See the ResourceID type for more information.

      - **ephemeralContainerStatuses.allocatedResourcesStatus.resources.health** (string)

        Health of the resource. can be one of:
         - Healthy: operates as normal
         - Unhealthy: reported unhealthy. We consider this a temporary health issue
                      since we do not have a mechanism today to distinguish
                      temporary and permanent issues.
         - Unknown: The status cannot be determined.
                    For example, Device Plugin got unregistered and hasn't been re-registered since.
        
        In future we may want to introduce the PermanentlyUnhealthy Status.

  - **ephemeralContainerStatuses.containerID** (string)

    ContainerID is the ID of the container in the format '\<type>://\<container_id>'. Where type is a container runtime identifier, returned from Version call of CRI API (for example "containerd").

  - **ephemeralContainerStatuses.image** (string), required

    Image is the name of container image that the container is running. The container image may not match the image used in the PodSpec, as it may have been resolved by the runtime. More info: https://kubernetes.io/docs/concepts/containers/images.

  - **ephemeralContainerStatuses.imageID** (string), required

    ImageID is the image ID of the container's image. The image ID may not match the image ID of the image used in the PodSpec, as it may have been resolved by the runtime.

  - **ephemeralContainerStatuses.lastState** (ContainerState)

    LastTerminationState holds the last termination state of the container to help debug container crashes and restarts. This field is not populated if the container is still running and RestartCount is 0.

    <a name="ContainerState"></a>
    *ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.*

    - **ephemeralContainerStatuses.lastState.running** (ContainerStateRunning)

      Details about a running container

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning is a running state of a container.*

      - **ephemeralContainerStatuses.lastState.running.startedAt** (Time)

        Time at which the container was last (re-)started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

    - **ephemeralContainerStatuses.lastState.terminated** (ContainerStateTerminated)

      Details about a terminated container

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated is a terminated state of a container.*

      - **ephemeralContainerStatuses.lastState.terminated.containerID** (string)

        Container's ID in the format '\<type>://\<container_id>'

      - **ephemeralContainerStatuses.lastState.terminated.exitCode** (int32), required

        Exit status from the last termination of the container

      - **ephemeralContainerStatuses.lastState.terminated.startedAt** (Time)

        Time at which previous execution of the container started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **ephemeralContainerStatuses.lastState.terminated.finishedAt** (Time)

        Time at which the container last terminated

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **ephemeralContainerStatuses.lastState.terminated.message** (string)

        Message regarding the last termination of the container

      - **ephemeralContainerStatuses.lastState.terminated.reason** (string)

        (brief) reason from the last termination of the container

      - **ephemeralContainerStatuses.lastState.terminated.signal** (int32)

        Signal from the last termination of the container

    - **ephemeralContainerStatuses.lastState.waiting** (ContainerStateWaiting)

      Details about a waiting container

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting is a waiting state of a container.*

      - **ephemeralContainerStatuses.lastState.waiting.message** (string)

        Message regarding why the container is not yet running.

      - **ephemeralContainerStatuses.lastState.waiting.reason** (string)

        (brief) reason the container is not yet running.

  - **ephemeralContainerStatuses.name** (string), required

    Name is a DNS_LABEL representing the unique name of the container. Each container in a pod must have a unique name across all container types. Cannot be updated.

  - **ephemeralContainerStatuses.ready** (boolean), required

    Ready specifies whether the container is currently passing its readiness check. The value will change as readiness probes keep executing. If no readiness probes are specified, this field defaults to true once the container is fully started (see Started field).
    
    The value is typically used to determine whether a container is ready to accept traffic.

  - **ephemeralContainerStatuses.resources** (ResourceRequirements)

    Resources represents the compute resource requests and limits that have been successfully enacted on the running container after it has been started or has been successfully resized.

    <a name="ResourceRequirements"></a>
    *ResourceRequirements describes the compute resource requirements.*

    - **ephemeralContainerStatuses.resources.claims** ([]ResourceClaim)

      *Map: unique values on key name will be kept during a merge*
      
      Claims lists the names of resources, defined in spec.resourceClaims, that are used by this container.
      
      This is an alpha field and requires enabling the DynamicResourceAllocation feature gate.
      
      This field is immutable. It can only be set for containers.

      <a name="ResourceClaim"></a>
      *ResourceClaim references one entry in PodSpec.ResourceClaims.*

      - **ephemeralContainerStatuses.resources.claims.name** (string), required

        Name must match the name of one entry in pod.spec.resourceClaims of the Pod where this field is used. It makes that resource available inside a container.

      - **ephemeralContainerStatuses.resources.claims.request** (string)

        Request is the name chosen for a request in the referenced claim. If empty, everything from the claim is made available, otherwise only the result of this request.

    - **ephemeralContainerStatuses.resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

    - **ephemeralContainerStatuses.resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  - **ephemeralContainerStatuses.restartCount** (int32), required

    RestartCount holds the number of times the container has been restarted. Kubelet makes an effort to always increment the value, but there are cases when the state may be lost due to node restarts and then the value may be reset to 0. The value is never negative.

  - **ephemeralContainerStatuses.started** (boolean)

    Started indicates whether the container has finished its postStart lifecycle hook and passed its startup probe. Initialized as false, becomes true after startupProbe is considered successful. Resets to false when the container is restarted, or if kubelet loses state temporarily. In both cases, startup probes will run again. Is always true when no startupProbe is defined and container is running and has passed the postStart lifecycle hook. The null value must be treated the same as false.

  - **ephemeralContainerStatuses.state** (ContainerState)

    State holds details about the container's current condition.

    <a name="ContainerState"></a>
    *ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.*

    - **ephemeralContainerStatuses.state.running** (ContainerStateRunning)

      Details about a running container

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning is a running state of a container.*

      - **ephemeralContainerStatuses.state.running.startedAt** (Time)

        Time at which the container was last (re-)started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

    - **ephemeralContainerStatuses.state.terminated** (ContainerStateTerminated)

      Details about a terminated container

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated is a terminated state of a container.*

      - **ephemeralContainerStatuses.state.terminated.containerID** (string)

        Container's ID in the format '\<type>://\<container_id>'

      - **ephemeralContainerStatuses.state.terminated.exitCode** (int32), required

        Exit status from the last termination of the container

      - **ephemeralContainerStatuses.state.terminated.startedAt** (Time)

        Time at which previous execution of the container started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **ephemeralContainerStatuses.state.terminated.finishedAt** (Time)

        Time at which the container last terminated

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **ephemeralContainerStatuses.state.terminated.message** (string)

        Message regarding the last termination of the container

      - **ephemeralContainerStatuses.state.terminated.reason** (string)

        (brief) reason from the last termination of the container

      - **ephemeralContainerStatuses.state.terminated.signal** (int32)

        Signal from the last termination of the container

    - **ephemeralContainerStatuses.state.waiting** (ContainerStateWaiting)

      Details about a waiting container

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting is a waiting state of a container.*

      - **ephemeralContainerStatuses.state.waiting.message** (string)

        Message regarding why the container is not yet running.

      - **ephemeralContainerStatuses.state.waiting.reason** (string)

        (brief) reason the container is not yet running.

  - **ephemeralContainerStatuses.user** (ContainerUser)

    User represents user identity information initially attached to the first process of the container

    <a name="ContainerUser"></a>
    *ContainerUser represents user identity information*

    - **ephemeralContainerStatuses.user.linux** (LinuxContainerUser)

      Linux holds user identity information initially attached to the first process of the containers in Linux. Note that the actual running identity can be changed if the process has enough privilege to do so.

      <a name="LinuxContainerUser"></a>
      *LinuxContainerUser represents user identity information in Linux containers*

      - **ephemeralContainerStatuses.user.linux.gid** (int64), required

        GID is the primary gid initially attached to the first process in the container

      - **ephemeralContainerStatuses.user.linux.uid** (int64), required

        UID is the primary uid initially attached to the first process in the container

      - **ephemeralContainerStatuses.user.linux.supplementalGroups** ([]int64)

        *Atomic: will be replaced during a merge*
        
        SupplementalGroups are the supplemental groups initially attached to the first process in the container

  - **ephemeralContainerStatuses.volumeMounts** ([]VolumeMountStatus)

    *Patch strategy: merge on key `mountPath`*
    
    *Map: unique values on key mountPath will be kept during a merge*
    
    Status of volume mounts.

    <a name="VolumeMountStatus"></a>
    *VolumeMountStatus shows status of volume mounts.*

    - **ephemeralContainerStatuses.volumeMounts.mountPath** (string), required

      MountPath corresponds to the original VolumeMount.

    - **ephemeralContainerStatuses.volumeMounts.name** (string), required

      Name corresponds to the name of the original VolumeMount.

    - **ephemeralContainerStatuses.volumeMounts.readOnly** (boolean)

      ReadOnly corresponds to the original VolumeMount.

    - **ephemeralContainerStatuses.volumeMounts.recursiveReadOnly** (string)

      RecursiveReadOnly must be set to Disabled, Enabled, or unspecified (for non-readonly mounts). An IfPossible value in the original VolumeMount must be translated to Disabled or Enabled, depending on the mount result.

- **resourceClaimStatuses** ([]PodResourceClaimStatus)

  *Patch strategies: retainKeys, merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
  
  Status of resource claims.

  <a name="PodResourceClaimStatus"></a>
  *PodResourceClaimStatus is stored in the PodStatus for each PodResourceClaim which references a ResourceClaimTemplate. It stores the generated name for the corresponding ResourceClaim.*

  - **resourceClaimStatuses.name** (string), required

    Name uniquely identifies this resource claim inside the pod. This must match the name of an entry in pod.spec.resourceClaims, which implies that the string must be a DNS_LABEL.

  - **resourceClaimStatuses.resourceClaimName** (string)

    ResourceClaimName is the name of the ResourceClaim that was generated for the Pod in the namespace of the Pod. If this is unset, then generating a ResourceClaim was not necessary. The pod.spec.resourceClaims entry can be ignored in this case.

- **resize** (string)

  Status of resources resize desired for pod's containers. It is empty if no resources resize is pending. Any changes to container resources will automatically set this to "Proposed"





## PodList {#PodList}

PodList is a list of Pods.

<hr>

- **items** ([]<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>), required

  List of pods. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md

- **apiVersion** (string)

  APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (string)

  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds





## Operations {#Operations}



<hr>






### `get` read the specified Pod

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Pod


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized


### `get` read ephemeralcontainers of the specified Pod

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

#### Parameters


- **name** (*in path*): string, required

  name of the Pod


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized


### `get` read log of the specified Pod

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}/log

#### Parameters


- **name** (*in path*): string, required

  name of the Pod


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **container** (*in query*): string

  The container for which to stream logs. Defaults to only container if there is one container in the pod.


- **follow** (*in query*): boolean

  Follow the log stream of the pod. Defaults to false.


- **insecureSkipTLSVerifyBackend** (*in query*): boolean

  insecureSkipTLSVerifyBackend indicates that the apiserver should not confirm the validity of the serving certificate of the backend it is connecting to.  This will make the HTTPS connection between the apiserver and the backend insecure. This means the apiserver cannot verify the log data it is receiving came from the real kubelet.  If the kubelet is configured to verify the apiserver's TLS credentials, it does not mean the connection to the real kubelet is vulnerable to a man in the middle attack (e.g. an attacker could not intercept the actual log data coming from the real kubelet).


- **limitBytes** (*in query*): integer

  If set, the number of bytes to read from the server before terminating the log output. This may not display a complete final line of logging, and may return slightly more or slightly less than the specified limit.


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **previous** (*in query*): boolean

  Return previous terminated container logs. Defaults to false.


- **sinceSeconds** (*in query*): integer

  A relative time in seconds before the current time from which to show logs. If this value precedes the time a pod was started, only logs since the pod start will be returned. If this value is in the future, no logs will be returned. Only one of sinceSeconds or sinceTime may be specified.


- **tailLines** (*in query*): integer

  If set, the number of lines from the end of the logs to show. If not specified, logs are shown from the creation of the container or sinceSeconds or sinceTime


- **timestamps** (*in query*): boolean

  If true, add an RFC3339 or RFC3339Nano timestamp at the beginning of every line of log output. Defaults to false.



#### Response


200 (string): OK

401: Unauthorized


### `get` read status of the specified Pod

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the Pod


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized


### `list` list or watch objects of kind Pod

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-v1#PodList" >}}">PodList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind Pod

#### HTTP Request

GET /api/v1/pods

#### Parameters


- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-v1#PodList" >}}">PodList</a>): OK

401: Unauthorized


### `create` create a Pod

#### HTTP Request

POST /api/v1/namespaces/{namespace}/pods

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

202 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Accepted

401: Unauthorized


### `update` replace the specified Pod

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/pods/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Pod


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized


### `update` replace ephemeralcontainers of the specified Pod

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

#### Parameters


- **name** (*in path*): string, required

  name of the Pod


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized


### `update` replace status of the specified Pod

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/pods/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the Pod


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized


### `patch` partially update the specified Pod

#### HTTP Request

PATCH /api/v1/namespaces/{namespace}/pods/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Pod


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized


### `patch` partially update ephemeralcontainers of the specified Pod

#### HTTP Request

PATCH /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

#### Parameters


- **name** (*in path*): string, required

  name of the Pod


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized


### `patch` partially update status of the specified Pod

#### HTTP Request

PATCH /api/v1/namespaces/{namespace}/pods/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the Pod


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized


### `delete` delete a Pod

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/pods/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Pod


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

202 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of Pod

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/pods

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

  


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>



#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

