---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSIStorageCapacity"
content_type: "api_reference"
description: "CSIStorageCapacity stores the result of one CSI GetCapacity call."
title: "CSIStorageCapacity"
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

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`


## CSIStorageCapacity {#CSIStorageCapacity}

CSIStorageCapacity stores the result of one CSI GetCapacity call. For a given StorageClass, this describes the available capacity in a particular topology segment.  This can be used when considering where to instantiate new PersistentVolumes.

For example this can express things like: - StorageClass "standard" has "1234 GiB" available in "topology.kubernetes.io/zone=us-east1" - StorageClass "localssd" has "10 GiB" available in "kubernetes.io/hostname=knode-abc123"

The following three cases all imply that no capacity is available for a certain combination: - no object exists with suitable topology and storage class name - such an object exists, but the capacity is unset - such an object exists, but the capacity is zero

The producer of these objects can decide which approach is more suitable.

They are consumed by the kube-scheduler when a CSI driver opts into capacity-aware scheduling with CSIDriverSpec.StorageCapacity. The scheduler compares the MaximumVolumeSize against the requested size of pending volumes to filter out unsuitable nodes. If MaximumVolumeSize is unset, it falls back to a comparison against the less precise Capacity. If that is also unset, the scheduler assumes that capacity is insufficient and tries some other node.

<hr>

- **apiVersion**: storage.k8s.io/v1


- **kind**: CSIStorageCapacity


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. The name has no particular meaning. It must be a DNS subdomain (dots allowed, 253 characters). To ensure that there are no conflicts with other CSI drivers on the cluster, the recommendation is to use csisc-\<uuid>, a generated name, or a reverse-domain name which ends with the unique CSI driver name.
  
  Objects are namespaced.
  
  More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **storageClassName** (string), required

  storageClassName represents the name of the StorageClass that the reported capacity applies to. It must meet the same requirements as the name of a StorageClass object (non-empty, DNS subdomain). If that object no longer exists, the CSIStorageCapacity object is obsolete and should be removed by its creator. This field is immutable.

- **capacity** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  capacity is the value reported by the CSI driver in its GetCapacityResponse for a GetCapacityRequest with topology and parameters that match the previous fields.
  
  The semantic is currently (CSI spec 1.2) defined as: The available capacity, in bytes, of the storage that can be used to provision volumes. If not set, that information is currently unavailable.

- **maximumVolumeSize** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  maximumVolumeSize is the value reported by the CSI driver in its GetCapacityResponse for a GetCapacityRequest with topology and parameters that match the previous fields.
  
  This is defined since CSI spec 1.4.0 as the largest size that may be used in a CreateVolumeRequest.capacity_range.required_bytes field to create a volume with the same parameters as those in GetCapacityRequest. The corresponding value in the Kubernetes API is ResourceRequirements.Requests in a volume claim.

- **nodeTopology** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  nodeTopology defines which nodes have access to the storage for which capacity was reported. If not set, the storage is not accessible from any node in the cluster. If empty, the storage is accessible from all nodes. This field is immutable.





## CSIStorageCapacityList {#CSIStorageCapacityList}

CSIStorageCapacityList is a collection of CSIStorageCapacity objects.

<hr>

- **apiVersion**: storage.k8s.io/v1


- **kind**: CSIStorageCapacityList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>), required

  items is the list of CSIStorageCapacity objects.





## Operations {#Operations}



<hr>






### `get` read the specified CSIStorageCapacity

#### HTTP Request

GET /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the CSIStorageCapacity


- ****: 

  


- ****: 

  



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

401: Unauthorized


### `list` list or watch objects of kind CSIStorageCapacity

#### HTTP Request

GET /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities

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


200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacityList" >}}">CSIStorageCapacityList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind CSIStorageCapacity

#### HTTP Request

GET /apis/storage.k8s.io/v1/csistoragecapacities

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


200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacityList" >}}">CSIStorageCapacityList</a>): OK

401: Unauthorized


### `create` create a CSIStorageCapacity

#### HTTP Request

POST /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities

#### Parameters


- ****: 

  


- ****: 

  


- ****: 

  


- **body**: <a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Accepted

401: Unauthorized


### `update` replace the specified CSIStorageCapacity

#### HTTP Request

PUT /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the CSIStorageCapacity


- ****: 

  


- ****: 

  


- ****: 

  


- **body**: <a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Created

401: Unauthorized


### `patch` partially update the specified CSIStorageCapacity

#### HTTP Request

PATCH /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the CSIStorageCapacity


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


200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Created

401: Unauthorized


### `delete` delete a CSIStorageCapacity

#### HTTP Request

DELETE /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the CSIStorageCapacity


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


### `deletecollection` delete collection of CSIStorageCapacity

#### HTTP Request

DELETE /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities

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

