---
api_metadata:
  apiVersion: "coordination.k8s.io/v1alpha1"
  import: "k8s.io/api/coordination/v1alpha1"
  kind: "LeaseCandidate"
content_type: "api_reference"
description: "LeaseCandidate defines a candidate for a Lease object."
title: "LeaseCandidate v1alpha1"
weight: 6
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

`apiVersion: coordination.k8s.io/v1alpha1`

`import "k8s.io/api/coordination/v1alpha1"`


## LeaseCandidate {#LeaseCandidate}

LeaseCandidate defines a candidate for a Lease object. Candidates are created such that coordinated leader election will pick the best leader from the list of candidates.

<hr>

- **apiVersion**: coordination.k8s.io/v1alpha1


- **kind**: LeaseCandidate


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/lease-candidate-v1alpha1#LeaseCandidateSpec" >}}">LeaseCandidateSpec</a>)

  spec contains the specification of the Lease. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status





## LeaseCandidateSpec {#LeaseCandidateSpec}

LeaseCandidateSpec is a specification of a Lease.

<hr>

- **leaseName** (string), required

  LeaseName is the name of the lease for which this candidate is contending. This field is immutable.

- **preferredStrategies** ([]string), required

  *Atomic: will be replaced during a merge*
  
  PreferredStrategies indicates the list of strategies for picking the leader for coordinated leader election. The list is ordered, and the first strategy supersedes all other strategies. The list is used by coordinated leader election to make a decision about the final election strategy. This follows as - If all clients have strategy X as the first element in this list, strategy X will be used. - If a candidate has strategy [X] and another candidate has strategy [Y, X], Y supersedes X and strategy Y
    will be used.
  - If a candidate has strategy [X, Y] and another candidate has strategy [Y, X], this is a user error and leader
    election will not operate the Lease until resolved.
  (Alpha) Using this field requires the CoordinatedLeaderElection feature gate to be enabled.

- **binaryVersion** (string)

  BinaryVersion is the binary version. It must be in a semver format without leading `v`. This field is required when strategy is "OldestEmulationVersion"

- **emulationVersion** (string)

  EmulationVersion is the emulation version. It must be in a semver format without leading `v`. EmulationVersion must be less than or equal to BinaryVersion. This field is required when strategy is "OldestEmulationVersion"

- **pingTime** (MicroTime)

  PingTime is the last time that the server has requested the LeaseCandidate to renew. It is only done during leader election to check if any LeaseCandidates have become ineligible. When PingTime is updated, the LeaseCandidate will respond by updating RenewTime.

  <a name="MicroTime"></a>
  *MicroTime is version of Time with microsecond level precision.*

- **renewTime** (MicroTime)

  RenewTime is the time that the LeaseCandidate was last updated. Any time a Lease needs to do leader election, the PingTime field is updated to signal to the LeaseCandidate that they should update the RenewTime. Old LeaseCandidate objects are also garbage collected if it has been hours since the last renew. The PingTime field is updated regularly to prevent garbage collection for still active LeaseCandidates.

  <a name="MicroTime"></a>
  *MicroTime is version of Time with microsecond level precision.*





## LeaseCandidateList {#LeaseCandidateList}

LeaseCandidateList is a list of Lease objects.

<hr>

- **apiVersion**: coordination.k8s.io/v1alpha1


- **kind**: LeaseCandidateList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/lease-candidate-v1alpha1#LeaseCandidate" >}}">LeaseCandidate</a>), required

  items is a list of schema objects.





## Operations {#Operations}



<hr>






### `get` read the specified LeaseCandidate

#### HTTP Request

GET /apis/coordination.k8s.io/v1alpha1/namespaces/{namespace}/leasecandidates/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the LeaseCandidate


- ****: 

  


- ****: 

  



#### Response


200 (<a href="{{< ref "../cluster-resources/lease-candidate-v1alpha1#LeaseCandidate" >}}">LeaseCandidate</a>): OK

401: Unauthorized


### `list` list or watch objects of kind LeaseCandidate

#### HTTP Request

GET /apis/coordination.k8s.io/v1alpha1/namespaces/{namespace}/leasecandidates

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


200 (<a href="{{< ref "../cluster-resources/lease-candidate-v1alpha1#LeaseCandidateList" >}}">LeaseCandidateList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind LeaseCandidate

#### HTTP Request

GET /apis/coordination.k8s.io/v1alpha1/leasecandidates

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


200 (<a href="{{< ref "../cluster-resources/lease-candidate-v1alpha1#LeaseCandidateList" >}}">LeaseCandidateList</a>): OK

401: Unauthorized


### `create` create a LeaseCandidate

#### HTTP Request

POST /apis/coordination.k8s.io/v1alpha1/namespaces/{namespace}/leasecandidates

#### Parameters


- ****: 

  


- ****: 

  


- ****: 

  


- **body**: <a href="{{< ref "../cluster-resources/lease-candidate-v1alpha1#LeaseCandidate" >}}">LeaseCandidate</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/lease-candidate-v1alpha1#LeaseCandidate" >}}">LeaseCandidate</a>): OK

201 (<a href="{{< ref "../cluster-resources/lease-candidate-v1alpha1#LeaseCandidate" >}}">LeaseCandidate</a>): Created

202 (<a href="{{< ref "../cluster-resources/lease-candidate-v1alpha1#LeaseCandidate" >}}">LeaseCandidate</a>): Accepted

401: Unauthorized


### `update` replace the specified LeaseCandidate

#### HTTP Request

PUT /apis/coordination.k8s.io/v1alpha1/namespaces/{namespace}/leasecandidates/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the LeaseCandidate


- ****: 

  


- ****: 

  


- ****: 

  


- **body**: <a href="{{< ref "../cluster-resources/lease-candidate-v1alpha1#LeaseCandidate" >}}">LeaseCandidate</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/lease-candidate-v1alpha1#LeaseCandidate" >}}">LeaseCandidate</a>): OK

201 (<a href="{{< ref "../cluster-resources/lease-candidate-v1alpha1#LeaseCandidate" >}}">LeaseCandidate</a>): Created

401: Unauthorized


### `patch` partially update the specified LeaseCandidate

#### HTTP Request

PATCH /apis/coordination.k8s.io/v1alpha1/namespaces/{namespace}/leasecandidates/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the LeaseCandidate


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


200 (<a href="{{< ref "../cluster-resources/lease-candidate-v1alpha1#LeaseCandidate" >}}">LeaseCandidate</a>): OK

201 (<a href="{{< ref "../cluster-resources/lease-candidate-v1alpha1#LeaseCandidate" >}}">LeaseCandidate</a>): Created

401: Unauthorized


### `delete` delete a LeaseCandidate

#### HTTP Request

DELETE /apis/coordination.k8s.io/v1alpha1/namespaces/{namespace}/leasecandidates/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the LeaseCandidate


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


### `deletecollection` delete collection of LeaseCandidate

#### HTTP Request

DELETE /apis/coordination.k8s.io/v1alpha1/namespaces/{namespace}/leasecandidates

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

