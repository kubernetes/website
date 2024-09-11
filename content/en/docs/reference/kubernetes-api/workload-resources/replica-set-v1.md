---
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "ReplicaSet"
content_type: "api_reference"
description: "ReplicaSet ensures that a specified number of pod replicas are running at any given time."
title: "ReplicaSet"
weight: 5
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

`apiVersion: apps/v1`

`import "k8s.io/api/apps/v1"`


## ReplicaSet {#ReplicaSet}

ReplicaSet ensures that a specified number of pod replicas are running at any given time.

<hr>

- **apiVersion**: apps/v1


- **kind**: ReplicaSet


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  If the Labels of a ReplicaSet are empty, they are defaulted to be the same as the Pod(s) that the ReplicaSet manages. Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSetSpec" >}}">ReplicaSetSpec</a>)

  Spec defines the specification of the desired behavior of the ReplicaSet. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSetStatus" >}}">ReplicaSetStatus</a>)

  Status is the most recently observed status of the ReplicaSet. This data may be out of date by some window of time. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status





## ReplicaSetSpec {#ReplicaSetSpec}

ReplicaSetSpec is the specification of a ReplicaSet.

<hr>

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), required

  Selector is a label query over pods that should match the replica count. Label keys and values that must match in order to be controlled by this replica set. It must match the pod template's labels. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)

  Template is the object that describes the pod that will be created if insufficient replicas are detected. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#pod-template

- **replicas** (int32)

  Replicas is the number of desired replicas. This is a pointer to distinguish between explicit zero and unspecified. Defaults to 1. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/#what-is-a-replicationcontroller

- **minReadySeconds** (int32)

  Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)





## ReplicaSetStatus {#ReplicaSetStatus}

ReplicaSetStatus represents the current status of a ReplicaSet.

<hr>

- **replicas** (int32), required

  Replicas is the most recently observed number of replicas. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/#what-is-a-replicationcontroller

- **availableReplicas** (int32)

  The number of available replicas (ready for at least minReadySeconds) for this replica set.

- **readyReplicas** (int32)

  readyReplicas is the number of pods targeted by this ReplicaSet with a Ready Condition.

- **fullyLabeledReplicas** (int32)

  The number of pods that have labels matching the labels of the pod template of the replicaset.

- **conditions** ([]ReplicaSetCondition)

  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  Represents the latest available observations of a replica set's current state.

  <a name="ReplicaSetCondition"></a>
  *ReplicaSetCondition describes the state of a replica set at a certain point.*

  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    Type of replica set condition.

  - **conditions.lastTransitionTime** (Time)

    The last time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **conditions.message** (string)

    A human readable message indicating details about the transition.

  - **conditions.reason** (string)

    The reason for the condition's last transition.

- **observedGeneration** (int64)

  ObservedGeneration reflects the generation of the most recently observed ReplicaSet.





## ReplicaSetList {#ReplicaSetList}

ReplicaSetList is a collection of ReplicaSets.

<hr>

- **apiVersion**: apps/v1


- **kind**: ReplicaSetList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>), required

  List of ReplicaSets. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller





## Operations {#Operations}



<hr>






### `get` read the specified ReplicaSet

#### HTTP Request

GET /apis/apps/v1/namespaces/{namespace}/replicasets/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ReplicaSet


- ****: 

  


- ****: 

  



#### Response


200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

401: Unauthorized


### `get` read status of the specified ReplicaSet

#### HTTP Request

GET /apis/apps/v1/namespaces/{namespace}/replicasets/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ReplicaSet


- ****: 

  


- ****: 

  



#### Response


200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ReplicaSet

#### HTTP Request

GET /apis/apps/v1/namespaces/{namespace}/replicasets

#### Parameters


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  



#### Response


200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSetList" >}}">ReplicaSetList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ReplicaSet

#### HTTP Request

GET /apis/apps/v1/replicasets

#### Parameters


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  



#### Response


200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSetList" >}}">ReplicaSetList</a>): OK

401: Unauthorized


### `create` create a ReplicaSet

#### HTTP Request

POST /apis/apps/v1/namespaces/{namespace}/replicasets

#### Parameters


- ****: 

  


- ****: 

  


- ****: 

  


- **body**: <a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

202 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Accepted

401: Unauthorized


### `update` replace the specified ReplicaSet

#### HTTP Request

PUT /apis/apps/v1/namespaces/{namespace}/replicasets/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ReplicaSet


- ****: 

  


- ****: 

  


- ****: 

  


- **body**: <a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

401: Unauthorized


### `update` replace status of the specified ReplicaSet

#### HTTP Request

PUT /apis/apps/v1/namespaces/{namespace}/replicasets/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ReplicaSet


- ****: 

  


- ****: 

  


- ****: 

  


- **body**: <a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

401: Unauthorized


### `patch` partially update the specified ReplicaSet

#### HTTP Request

PATCH /apis/apps/v1/namespaces/{namespace}/replicasets/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ReplicaSet


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

401: Unauthorized


### `patch` partially update status of the specified ReplicaSet

#### HTTP Request

PATCH /apis/apps/v1/namespaces/{namespace}/replicasets/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the ReplicaSet


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

401: Unauthorized


### `delete` delete a ReplicaSet

#### HTTP Request

DELETE /apis/apps/v1/namespaces/{namespace}/replicasets/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ReplicaSet


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>



#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of ReplicaSet

#### HTTP Request

DELETE /apis/apps/v1/namespaces/{namespace}/replicasets

#### Parameters


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- ****: 

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>



#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

