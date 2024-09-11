---
api_metadata:
  apiVersion: "storage.k8s.io/v1beta1"
  import: "k8s.io/api/storage/v1beta1"
  kind: "VolumeAttributesClass"
content_type: "api_reference"
description: "VolumeAttributesClass represents a specification of mutable volume attributes defined by the CSI driver."
title: "VolumeAttributesClass v1beta1"
weight: 12
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

`apiVersion: storage.k8s.io/v1beta1`

`import "k8s.io/api/storage/v1beta1"`


## VolumeAttributesClass {#VolumeAttributesClass}

VolumeAttributesClass represents a specification of mutable volume attributes defined by the CSI driver. The class can be specified during dynamic provisioning of PersistentVolumeClaims, and changed in the PersistentVolumeClaim spec after provisioning.

<hr>

- **apiVersion**: storage.k8s.io/v1beta1


- **kind**: VolumeAttributesClass


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **driverName** (string), required

  Name of the CSI driver This field is immutable.

- **parameters** (map[string]string)

  parameters hold volume attributes defined by the CSI driver. These values are opaque to the Kubernetes and are passed directly to the CSI driver. The underlying storage provider supports changing these attributes on an existing volume, however the parameters field itself is immutable. To invoke a volume update, a new VolumeAttributesClass should be created with new parameters, and the PersistentVolumeClaim should be updated to reference the new VolumeAttributesClass.
  
  This field is required and must contain at least one key/value pair. The keys cannot be empty, and the maximum number of parameters is 512, with a cumulative max size of 256K. If the CSI driver rejects invalid parameters, the target PersistentVolumeClaim will be set to an "Infeasible" state in the modifyVolumeStatus field.





## VolumeAttributesClassList {#VolumeAttributesClassList}

VolumeAttributesClassList is a collection of VolumeAttributesClass objects.

<hr>

- **apiVersion**: storage.k8s.io/v1beta1


- **kind**: VolumeAttributesClassList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>), required

  items is the list of VolumeAttributesClass objects.





## Operations {#Operations}



<hr>






### `get` read the specified VolumeAttributesClass

#### HTTP Request

GET /apis/storage.k8s.io/v1beta1/volumeattributesclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the VolumeAttributesClass


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

401: Unauthorized


### `list` list or watch objects of kind VolumeAttributesClass

#### HTTP Request

GET /apis/storage.k8s.io/v1beta1/volumeattributesclasses

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


200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClassList" >}}">VolumeAttributesClassList</a>): OK

401: Unauthorized


### `create` create a VolumeAttributesClass

#### HTTP Request

POST /apis/storage.k8s.io/v1beta1/volumeattributesclasses

#### Parameters


- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Accepted

401: Unauthorized


### `update` replace the specified VolumeAttributesClass

#### HTTP Request

PUT /apis/storage.k8s.io/v1beta1/volumeattributesclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the VolumeAttributesClass


- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Created

401: Unauthorized


### `patch` partially update the specified VolumeAttributesClass

#### HTTP Request

PATCH /apis/storage.k8s.io/v1beta1/volumeattributesclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the VolumeAttributesClass


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


200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Created

401: Unauthorized


### `delete` delete a VolumeAttributesClass

#### HTTP Request

DELETE /apis/storage.k8s.io/v1beta1/volumeattributesclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the VolumeAttributesClass


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


200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of VolumeAttributesClass

#### HTTP Request

DELETE /apis/storage.k8s.io/v1beta1/volumeattributesclasses

#### Parameters


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

