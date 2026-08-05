---
api_metadata:
  apiVersion: "scheduling.k8s.io/v1alpha1"
  import: "k8s.io/api/scheduling/v1alpha1"
  kind: "Workload"
content_type: "api_reference"
description: "Workload allows for expressing scheduling constraints that should be used when managing lifecycle of workloads from scheduling perspective, including scheduling, preemption, eviction and other phases."
title: "Workload v1alpha1"
weight: 19
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

`apiVersion: scheduling.k8s.io/v1alpha1`

`import "k8s.io/api/scheduling/v1alpha1"`


## Workload {#Workload}

Workload allows for expressing scheduling constraints that should be used when managing lifecycle of workloads from scheduling perspective, including scheduling, preemption, eviction and other phases.

<hr>

- **apiVersion**: scheduling.k8s.io/v1alpha1


- **kind**: Workload


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. Name must be a DNS subdomain.

- **spec** (<a href="{{< ref "../workload-resources/workload-v1alpha1#WorkloadSpec" >}}">WorkloadSpec</a>), required

  Spec defines the desired behavior of a Workload.





## WorkloadSpec {#WorkloadSpec}

WorkloadSpec defines the desired state of a Workload.

<hr>

- **podGroups** ([]PodGroup), required

  *Map: unique values on key name will be kept during a merge*
  
  PodGroups is the list of pod groups that make up the Workload. The maximum number of pod groups is 8. This field is immutable.

  <a name="PodGroup"></a>
  *PodGroup represents a set of pods with a common scheduling policy.*

  - **podGroups.name** (string), required

    Name is a unique identifier for the PodGroup within the Workload. It must be a DNS label. This field is immutable.

  - **podGroups.policy** (PodGroupPolicy), required

    Policy defines the scheduling policy for this PodGroup.

    <a name="PodGroupPolicy"></a>
    *PodGroupPolicy defines the scheduling configuration for a PodGroup.*

    - **podGroups.policy.basic** (BasicSchedulingPolicy)

      Basic specifies that the pods in this group should be scheduled using standard Kubernetes scheduling behavior.

      <a name="BasicSchedulingPolicy"></a>
      *BasicSchedulingPolicy indicates that standard Kubernetes scheduling behavior should be used.*

    - **podGroups.policy.gang** (GangSchedulingPolicy)

      Gang specifies that the pods in this group should be scheduled using all-or-nothing semantics.

      <a name="GangSchedulingPolicy"></a>
      *GangSchedulingPolicy defines the parameters for gang scheduling.*

      - **podGroups.policy.gang.minCount** (int32), required

        MinCount is the minimum number of pods that must be schedulable or scheduled at the same time for the scheduler to admit the entire group. It must be a positive integer.

- **controllerRef** (TypedLocalObjectReference)

  ControllerRef is an optional reference to the controlling object, such as a Deployment or Job. This field is intended for use by tools like CLIs to provide a link back to the original workload definition. When set, it cannot be changed.

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

- **apiVersion**: scheduling.k8s.io/v1alpha1


- **kind**: WorkloadList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata.

- **items** ([]<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>), required

  Items is the list of Workloads.





## Operations {#Operations}



<hr>






### `get` read the specified Workload

#### HTTP Request

GET /apis/scheduling.k8s.io/v1alpha1/namespaces/{namespace}/workloads/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Workload


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): OK

401: Unauthorized


### `list` list or watch objects of kind Workload

#### HTTP Request

GET /apis/scheduling.k8s.io/v1alpha1/namespaces/{namespace}/workloads

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


200 (<a href="{{< ref "../workload-resources/workload-v1alpha1#WorkloadList" >}}">WorkloadList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind Workload

#### HTTP Request

GET /apis/scheduling.k8s.io/v1alpha1/workloads

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


200 (<a href="{{< ref "../workload-resources/workload-v1alpha1#WorkloadList" >}}">WorkloadList</a>): OK

401: Unauthorized


### `create` create a Workload

#### HTTP Request

POST /apis/scheduling.k8s.io/v1alpha1/namespaces/{namespace}/workloads

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): OK

201 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): Created

202 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): Accepted

401: Unauthorized


### `update` replace the specified Workload

#### HTTP Request

PUT /apis/scheduling.k8s.io/v1alpha1/namespaces/{namespace}/workloads/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Workload


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): OK

201 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): Created

401: Unauthorized


### `patch` partially update the specified Workload

#### HTTP Request

PATCH /apis/scheduling.k8s.io/v1alpha1/namespaces/{namespace}/workloads/{name}

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


200 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): OK

201 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): Created

401: Unauthorized


### `delete` delete a Workload

#### HTTP Request

DELETE /apis/scheduling.k8s.io/v1alpha1/namespaces/{namespace}/workloads/{name}

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

DELETE /apis/scheduling.k8s.io/v1alpha1/namespaces/{namespace}/workloads

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


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>



#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

