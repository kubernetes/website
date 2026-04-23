---
api_metadata:
  apiVersion: "scheduling.k8s.io/v1alpha2"
  import: "k8s.io/api/scheduling/v1alpha2"
  kind: "PodGroup"
content_type: "api_reference"
description: "PodGroup represents a runtime instance of pods grouped together."
title: "PodGroup v1alpha2"
weight: 4
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

`apiVersion: scheduling.k8s.io/v1alpha2`

`import "k8s.io/api/scheduling/v1alpha2"`


## PodGroup {#PodGroup}

PodGroup represents a runtime instance of pods grouped together. PodGroups are created by workload controllers (Job, LWS, JobSet, etc...) from Workload.podGroupTemplates. PodGroup API enablement is toggled by the GenericWorkload feature gate.

<hr>

- **apiVersion**: scheduling.k8s.io/v1alpha2


- **kind**: PodGroup


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroupSpec" >}}">PodGroupSpec</a>), required

  Spec defines the desired state of the PodGroup.

- **status** (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroupStatus" >}}">PodGroupStatus</a>)

  Status represents the current observed state of the PodGroup.





## PodGroupSpec {#PodGroupSpec}

PodGroupSpec defines the desired state of a PodGroup.

<hr>

- **schedulingPolicy** (PodGroupSchedulingPolicy), required

  SchedulingPolicy defines the scheduling policy for this instance of the PodGroup. Controllers are expected to fill this field by copying it from a PodGroupTemplate. This field is immutable.

  <a name="PodGroupSchedulingPolicy"></a>
  *PodGroupSchedulingPolicy defines the scheduling configuration for a PodGroup. Exactly one policy must be set.*

  - **schedulingPolicy.basic** (BasicSchedulingPolicy)

    Basic specifies that the pods in this group should be scheduled using standard Kubernetes scheduling behavior.

    <a name="BasicSchedulingPolicy"></a>
    *BasicSchedulingPolicy indicates that standard Kubernetes scheduling behavior should be used.*

  - **schedulingPolicy.gang** (GangSchedulingPolicy)

    Gang specifies that the pods in this group should be scheduled using all-or-nothing semantics.

    <a name="GangSchedulingPolicy"></a>
    *GangSchedulingPolicy defines the parameters for gang scheduling.*

    - **schedulingPolicy.gang.minCount** (int32), required

      MinCount is the minimum number of pods that must be schedulable or scheduled at the same time for the scheduler to admit the entire group. It must be a positive integer.

- **disruptionMode** (string)

  DisruptionMode defines the mode in which a given PodGroup can be disrupted. Controllers are expected to fill this field by copying it from a PodGroupTemplate. One of Pod, PodGroup. Defaults to Pod if unset. This field is immutable. This field is available only when the WorkloadAwarePreemption feature gate is enabled.

- **podGroupTemplateRef** (PodGroupTemplateReference)

  PodGroupTemplateRef references an optional PodGroup template within other object (e.g. Workload) that was used to create the PodGroup. This field is immutable.

  <a name="PodGroupTemplateReference"></a>
  *PodGroupTemplateReference references a PodGroup template defined in some object (e.g. Workload). Exactly one reference must be set.*

  - **podGroupTemplateRef.workload** (WorkloadPodGroupTemplateReference)

    Workload references the PodGroupTemplate within the Workload object that was used to create the PodGroup.

    <a name="WorkloadPodGroupTemplateReference"></a>
    *WorkloadPodGroupTemplateReference references the PodGroupTemplate within the Workload object.*

    - **podGroupTemplateRef.workload.podGroupTemplateName** (string), required

      PodGroupTemplateName defines the PodGroupTemplate name within the Workload object.

    - **podGroupTemplateRef.workload.workloadName** (string), required

      WorkloadName defines the name of the Workload object.

- **priority** (int32)

  Priority is the value of priority of this pod group. Various system components use this field to find the priority of the pod group. When Priority Admission Controller is enabled, it prevents users from setting this field. The admission controller populates this field from PriorityClassName. The higher the value, the higher the priority. This field is immutable. This field is available only when the WorkloadAwarePreemption feature gate is enabled.

- **priorityClassName** (string)

  PriorityClassName defines the priority that should be considered when scheduling this pod group. Controllers are expected to fill this field by copying it from a PodGroupTemplate. Otherwise, it is validated and resolved similarly to the PriorityClassName on PodGroupTemplate (i.e. if no priority class is specified, admission control can set this to the global default priority class if it exists. Otherwise, the pod group's priority will be zero). This field is immutable. This field is available only when the WorkloadAwarePreemption feature gate is enabled.

- **resourceClaims** ([]PodGroupResourceClaim)

  *Patch strategies: retainKeys, merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
  
  ResourceClaims defines which ResourceClaims may be shared among Pods in the group. Pods consume the devices allocated to a PodGroup's claim by defining a claim in its own Spec.ResourceClaims that matches the PodGroup's claim exactly. The claim must have the same name and refer to the same ResourceClaim or ResourceClaimTemplate.
  
  This is an alpha-level field and requires that the DRAWorkloadResourceClaims feature gate is enabled.
  
  This field is immutable.

  <a name="PodGroupResourceClaim"></a>
  *PodGroupResourceClaim references exactly one ResourceClaim, either directly or by naming a ResourceClaimTemplate which is then turned into a ResourceClaim for the PodGroup.
  
  It adds a name to it that uniquely identifies the ResourceClaim inside the PodGroup. Pods that need access to the ResourceClaim define a matching reference in its own Spec.ResourceClaims. The Pod's claim must match all fields of the PodGroup's claim exactly.*

  - **resourceClaims.name** (string), required

    Name uniquely identifies this resource claim inside the PodGroup. This must be a DNS_LABEL.

  - **resourceClaims.resourceClaimName** (string)

    ResourceClaimName is the name of a ResourceClaim object in the same namespace as this PodGroup. The ResourceClaim will be reserved for the PodGroup instead of its individual pods.
    
    Exactly one of ResourceClaimName and ResourceClaimTemplateName must be set.

  - **resourceClaims.resourceClaimTemplateName** (string)

    ResourceClaimTemplateName is the name of a ResourceClaimTemplate object in the same namespace as this PodGroup.
    
    The template will be used to create a new ResourceClaim, which will be bound to this PodGroup. When this PodGroup is deleted, the ResourceClaim will also be deleted. The PodGroup name and resource name, along with a generated component, will be used to form a unique name for the ResourceClaim, which will be recorded in podgroup.status.resourceClaimStatuses.
    
    This field is immutable and no changes will be made to the corresponding ResourceClaim by the control plane after creating the ResourceClaim.
    
    Exactly one of ResourceClaimName and ResourceClaimTemplateName must be set.

- **schedulingConstraints** (PodGroupSchedulingConstraints)

  SchedulingConstraints defines optional scheduling constraints (e.g. topology) for this PodGroup. Controllers are expected to fill this field by copying it from a PodGroupTemplate. This field is immutable. This field is only available when the TopologyAwareWorkloadScheduling feature gate is enabled.

  <a name="PodGroupSchedulingConstraints"></a>
  *PodGroupSchedulingConstraints defines scheduling constraints (e.g. topology) for a PodGroup.*

  - **schedulingConstraints.topology** ([]TopologyConstraint)

    *Atomic: will be replaced during a merge*
    
    Topology defines the topology constraints for the pod group. Currently only a single topology constraint can be specified. This may change in the future.

    <a name="TopologyConstraint"></a>
    *TopologyConstraint defines a topology constraint for a PodGroup.*

    - **schedulingConstraints.topology.key** (string), required

      Key specifies the key of the node label representing the topology domain. All pods within the PodGroup must be colocated within the same domain instance. Different PodGroups can land on different domain instances even if they derive from the same PodGroupTemplate. Examples: "topology.kubernetes.io/rack"





## PodGroupStatus {#PodGroupStatus}

PodGroupStatus represents information about the status of a pod group.

<hr>

- **conditions** ([]Condition)

  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  Conditions represent the latest observations of the PodGroup's state.
  
  Known condition types: - "PodGroupScheduled": Indicates whether the scheduling requirement has been satisfied. - "DisruptionTarget": Indicates whether the PodGroup is about to be terminated
    due to disruption such as preemption.
  
  Known reasons for the PodGroupScheduled condition: - "Unschedulable": The PodGroup cannot be scheduled due to resource constraints,
    affinity/anti-affinity rules, or insufficient capacity for the gang.
  - "SchedulerError": The PodGroup cannot be scheduled due to some internal error
    that happened during scheduling, for example due to nodeAffinity parsing errors.
  
  Known reasons for the DisruptionTarget condition: - "PreemptionByScheduler": The PodGroup was preempted by the scheduler to make room for
    higher-priority PodGroups or Pods.

  <a name="Condition"></a>
  *Condition contains details for one aspect of the current state of this API Resource.*

  - **conditions.lastTransitionTime** (Time), required

    lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **conditions.message** (string), required

    message is a human readable message indicating details about the transition. This may be an empty string.

  - **conditions.reason** (string), required

    reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty.

  - **conditions.status** (string), required

    status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    type of condition in CamelCase or in foo.example.com/CamelCase.

  - **conditions.observedGeneration** (int64)

    observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance.

- **resourceClaimStatuses** ([]PodGroupResourceClaimStatus)

  *Patch strategies: retainKeys, merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
  
  Status of resource claims.

  <a name="PodGroupResourceClaimStatus"></a>
  *PodGroupResourceClaimStatus is stored in the PodGroupStatus for each PodGroupResourceClaim which references a ResourceClaimTemplate. It stores the generated name for the corresponding ResourceClaim.*

  - **resourceClaimStatuses.name** (string), required

    Name uniquely identifies this resource claim inside the PodGroup. This must match the name of an entry in podgroup.spec.resourceClaims, which implies that the string must be a DNS_LABEL.

  - **resourceClaimStatuses.resourceClaimName** (string)

    ResourceClaimName is the name of the ResourceClaim that was generated for the PodGroup in the namespace of the PodGroup. If this is unset, then generating a ResourceClaim was not necessary. The podgroup.spec.resourceClaims entry can be ignored in this case.





## PodGroupList {#PodGroupList}

PodGroupList contains a list of PodGroup resources.

<hr>

- **apiVersion**: scheduling.k8s.io/v1alpha2


- **kind**: PodGroupList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata.

- **items** ([]<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>), required

  Items is the list of PodGroups.





## Operations {#Operations}



<hr>






### `get` read the specified PodGroup

#### HTTP Request

GET /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodGroup


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): OK

401: Unauthorized


### `get` read status of the specified PodGroup

#### HTTP Request

GET /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodGroup


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): OK

401: Unauthorized


### `list` list or watch objects of kind PodGroup

#### HTTP Request

GET /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups

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


- **shardSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#shardSelector" >}}">shardSelector</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroupList" >}}">PodGroupList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind PodGroup

#### HTTP Request

GET /apis/scheduling.k8s.io/v1alpha2/podgroups

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


- **shardSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#shardSelector" >}}">shardSelector</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroupList" >}}">PodGroupList</a>): OK

401: Unauthorized


### `create` create a PodGroup

#### HTTP Request

POST /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): Created

202 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): Accepted

401: Unauthorized


### `update` replace the specified PodGroup

#### HTTP Request

PUT /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodGroup


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): Created

401: Unauthorized


### `update` replace status of the specified PodGroup

#### HTTP Request

PUT /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodGroup


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): Created

401: Unauthorized


### `patch` partially update the specified PodGroup

#### HTTP Request

PATCH /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodGroup


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


200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): Created

401: Unauthorized


### `patch` partially update status of the specified PodGroup

#### HTTP Request

PATCH /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodGroup


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


200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): Created

401: Unauthorized


### `delete` delete a PodGroup

#### HTTP Request

DELETE /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodGroup


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>



#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of PodGroup

#### HTTP Request

DELETE /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups

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


- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>


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


- **shardSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#shardSelector" >}}">shardSelector</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>



#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

