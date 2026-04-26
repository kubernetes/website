---
api_metadata:
  apiVersion: "scheduling.k8s.io/v1alpha2"
  import: "k8s.io/api/scheduling/v1alpha2"
  kind: "Workload"
content_type: "api_reference"
description: "Workload allows for expressing scheduling constraints that should be used when managing the lifecycle of workloads from the scheduling perspective, including scheduling, preemption, eviction and other phases."
title: "Workload v1alpha2"
weight: 20
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


## Workload {#Workload}

Workload allows for expressing scheduling constraints that should be used when managing the lifecycle of workloads from the scheduling perspective, including scheduling, preemption, eviction and other phases. Workload API enablement is toggled by the GenericWorkload feature gate.

<hr>

- **apiVersion**: scheduling.k8s.io/v1alpha2


- **kind**: Workload


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/workload-v1alpha2#WorkloadSpec" >}}">WorkloadSpec</a>), required

  Spec defines the desired behavior of a Workload.





## WorkloadSpec {#WorkloadSpec}

WorkloadSpec defines the desired state of a Workload.

<hr>

- **podGroupTemplates** ([]PodGroupTemplate), required

  *Map: unique values on key name will be kept during a merge*
  
  PodGroupTemplates is the list of templates that make up the Workload. The maximum number of templates is 8. This field is immutable.

  <a name="PodGroupTemplate"></a>
  *PodGroupTemplate represents a template for a set of pods with a scheduling policy.*

  - **podGroupTemplates.name** (string), required

    Name is a unique identifier for the PodGroupTemplate within the Workload. It must be a DNS label. This field is immutable.

  - **podGroupTemplates.schedulingPolicy** (PodGroupSchedulingPolicy), required

    SchedulingPolicy defines the scheduling policy for this PodGroupTemplate.

    <a name="PodGroupSchedulingPolicy"></a>
    *PodGroupSchedulingPolicy defines the scheduling configuration for a PodGroup. Exactly one policy must be set.*

    - **podGroupTemplates.schedulingPolicy.basic** (BasicSchedulingPolicy)

      Basic specifies that the pods in this group should be scheduled using standard Kubernetes scheduling behavior.

      <a name="BasicSchedulingPolicy"></a>
      *BasicSchedulingPolicy indicates that standard Kubernetes scheduling behavior should be used.*

    - **podGroupTemplates.schedulingPolicy.gang** (GangSchedulingPolicy)

      Gang specifies that the pods in this group should be scheduled using all-or-nothing semantics.

      <a name="GangSchedulingPolicy"></a>
      *GangSchedulingPolicy defines the parameters for gang scheduling.*

      - **podGroupTemplates.schedulingPolicy.gang.minCount** (int32), required

        MinCount is the minimum number of pods that must be schedulable or scheduled at the same time for the scheduler to admit the entire group. It must be a positive integer.

  - **podGroupTemplates.disruptionMode** (string)

    DisruptionMode defines the mode in which a given PodGroup can be disrupted. One of Pod, PodGroup. This field is available only when the WorkloadAwarePreemption feature gate is enabled.

  - **podGroupTemplates.priority** (int32)

    Priority is the value of priority of pod groups created from this template. Various system components use this field to find the priority of the pod group. When Priority Admission Controller is enabled, it prevents users from setting this field. The admission controller populates this field from PriorityClassName. The higher the value, the higher the priority. This field is available only when the WorkloadAwarePreemption feature gate is enabled.

  - **podGroupTemplates.priorityClassName** (string)

    PriorityClassName indicates the priority that should be considered when scheduling a pod group created from this template. If no priority class is specified, admission control can set this to the global default priority class if it exists. Otherwise, pod groups created from this template will have the priority set to zero. This field is available only when the WorkloadAwarePreemption feature gate is enabled.

  - **podGroupTemplates.resourceClaims** ([]PodGroupResourceClaim)

    *Patch strategies: retainKeys, merge on key `name`*
    
    *Map: unique values on key name will be kept during a merge*
    
    ResourceClaims defines which ResourceClaims may be shared among Pods in the group. Pods consume the devices allocated to a PodGroup's claim by defining a claim in its own Spec.ResourceClaims that matches the PodGroup's claim exactly. The claim must have the same name and refer to the same ResourceClaim or ResourceClaimTemplate.
    
    This is an alpha-level field and requires that the DRAWorkloadResourceClaims feature gate is enabled.
    
    This field is immutable.

    <a name="PodGroupResourceClaim"></a>
    *PodGroupResourceClaim references exactly one ResourceClaim, either directly or by naming a ResourceClaimTemplate which is then turned into a ResourceClaim for the PodGroup.
    
    It adds a name to it that uniquely identifies the ResourceClaim inside the PodGroup. Pods that need access to the ResourceClaim define a matching reference in its own Spec.ResourceClaims. The Pod's claim must match all fields of the PodGroup's claim exactly.*

    - **podGroupTemplates.resourceClaims.name** (string), required

      Name uniquely identifies this resource claim inside the PodGroup. This must be a DNS_LABEL.

    - **podGroupTemplates.resourceClaims.resourceClaimName** (string)

      ResourceClaimName is the name of a ResourceClaim object in the same namespace as this PodGroup. The ResourceClaim will be reserved for the PodGroup instead of its individual pods.
      
      Exactly one of ResourceClaimName and ResourceClaimTemplateName must be set.

    - **podGroupTemplates.resourceClaims.resourceClaimTemplateName** (string)

      ResourceClaimTemplateName is the name of a ResourceClaimTemplate object in the same namespace as this PodGroup.
      
      The template will be used to create a new ResourceClaim, which will be bound to this PodGroup. When this PodGroup is deleted, the ResourceClaim will also be deleted. The PodGroup name and resource name, along with a generated component, will be used to form a unique name for the ResourceClaim, which will be recorded in podgroup.status.resourceClaimStatuses.
      
      This field is immutable and no changes will be made to the corresponding ResourceClaim by the control plane after creating the ResourceClaim.
      
      Exactly one of ResourceClaimName and ResourceClaimTemplateName must be set.

  - **podGroupTemplates.schedulingConstraints** (PodGroupSchedulingConstraints)

    SchedulingConstraints defines optional scheduling constraints (e.g. topology) for this PodGroupTemplate. This field is only available when the TopologyAwareWorkloadScheduling feature gate is enabled.

    <a name="PodGroupSchedulingConstraints"></a>
    *PodGroupSchedulingConstraints defines scheduling constraints (e.g. topology) for a PodGroup.*

    - **podGroupTemplates.schedulingConstraints.topology** ([]TopologyConstraint)

      *Atomic: will be replaced during a merge*
      
      Topology defines the topology constraints for the pod group. Currently only a single topology constraint can be specified. This may change in the future.

      <a name="TopologyConstraint"></a>
      *TopologyConstraint defines a topology constraint for a PodGroup.*

      - **podGroupTemplates.schedulingConstraints.topology.key** (string), required

        Key specifies the key of the node label representing the topology domain. All pods within the PodGroup must be colocated within the same domain instance. Different PodGroups can land on different domain instances even if they derive from the same PodGroupTemplate. Examples: "topology.kubernetes.io/rack"

- **controllerRef** (TypedLocalObjectReference)

  ControllerRef is an optional reference to the controlling object, such as a Deployment or Job. This field is intended for use by tools like CLIs to provide a link back to the original workload definition. This field is immutable.

  <a name="TypedLocalObjectReference"></a>
  *TypedLocalObjectReference allows to reference typed object inside the same namespace.*

  - **controllerRef.kind** (string), required

    Kind is the type of resource being referenced. It must be a path segment name.

  - **controllerRef.name** (string), required

    Name is the name of resource being referenced. It must be a path segment name.

  - **controllerRef.apiGroup** (string)

    APIGroup is the group for the resource being referenced. If APIGroup is empty, the specified Kind must be in the core API group. For any other third-party types, setting APIGroup is required. It must be a DNS subdomain.





## WorkloadList {#WorkloadList}

WorkloadList contains a list of Workload resources.

<hr>

- **apiVersion**: scheduling.k8s.io/v1alpha2


- **kind**: WorkloadList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata.

- **items** ([]<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>), required

  Items is the list of Workloads.





## Operations {#Operations}



<hr>






### `get` read the specified Workload

#### HTTP Request

GET /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/workloads/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Workload


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): OK

401: Unauthorized


### `list` list or watch objects of kind Workload

#### HTTP Request

GET /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/workloads

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


200 (<a href="{{< ref "../workload-resources/workload-v1alpha2#WorkloadList" >}}">WorkloadList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind Workload

#### HTTP Request

GET /apis/scheduling.k8s.io/v1alpha2/workloads

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


200 (<a href="{{< ref "../workload-resources/workload-v1alpha2#WorkloadList" >}}">WorkloadList</a>): OK

401: Unauthorized


### `create` create a Workload

#### HTTP Request

POST /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/workloads

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): OK

201 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): Created

202 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): Accepted

401: Unauthorized


### `update` replace the specified Workload

#### HTTP Request

PUT /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/workloads/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Workload


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): OK

201 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): Created

401: Unauthorized


### `patch` partially update the specified Workload

#### HTTP Request

PATCH /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/workloads/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Workload


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


200 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): OK

201 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): Created

401: Unauthorized


### `delete` delete a Workload

#### HTTP Request

DELETE /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/workloads/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Workload


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


### `deletecollection` delete collection of Workload

#### HTTP Request

DELETE /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/workloads

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

