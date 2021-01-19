---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "IngressClass"
content_type: "api_reference"
description: "IngressClass represents the class of the Ingress, referenced by the Ingress Spec."
title: "IngressClass"
weight: 5
---

`apiVersion: networking.k8s.io/v1`

`import "k8s.io/api/networking/v1"`


## IngressClass {#IngressClass}

IngressClass represents the class of the Ingress, referenced by the Ingress Spec. The `ingressclass.kubernetes.io/is-default-class` annotation can be used to indicate that an IngressClass should be considered default. When a single IngressClass resource has this annotation set to true, new Ingress resources without a class specified will be assigned this default class.

<hr>

- **apiVersion**: networking.k8s.io/v1


- **kind**: IngressClass


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../services-resources/ingress-class-v1#IngressClassSpec" >}}">IngressClassSpec</a>)

  Spec is the desired state of the IngressClass. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status





## IngressClassSpec {#IngressClassSpec}

IngressClassSpec provides information about the class of an Ingress.

<hr>

- **controller** (string)

  Controller refers to the name of the controller that should handle this class. This allows for different "flavors" that are controlled by the same controller. For example, you may have different Parameters for the same implementing controller. This should be specified as a domain-prefixed path no more than 250 characters in length, e.g. "acme.io/ingress-controller". This field is immutable.

- **parameters** (<a href="{{< ref "../common-definitions/typed-local-object-reference#TypedLocalObjectReference" >}}">TypedLocalObjectReference</a>)

  Parameters is a link to a custom resource containing additional configuration for the controller. This is optional if the controller does not require extra parameters.





## IngressClassList {#IngressClassList}

IngressClassList is a collection of IngressClasses.

<hr>

- **apiVersion**: networking.k8s.io/v1


- **kind**: IngressClassList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata.

- **items** ([]<a href="{{< ref "../services-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>), required

  Items is the list of IngressClasses.





## Operations {#Operations}



<hr>






### `get` read the specified IngressClass

#### HTTP Request

GET /apis/networking.k8s.io/v1/ingressclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the IngressClass


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../services-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

401: Unauthorized


### `list` list or watch objects of kind IngressClass

#### HTTP Request

GET /apis/networking.k8s.io/v1/ingressclasses

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


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>



#### Response


200 (<a href="{{< ref "../services-resources/ingress-class-v1#IngressClassList" >}}">IngressClassList</a>): OK

401: Unauthorized


### `create` create an IngressClass

#### HTTP Request

POST /apis/networking.k8s.io/v1/ingressclasses

#### Parameters


- **body**: <a href="{{< ref "../services-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../services-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

201 (<a href="{{< ref "../services-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

202 (<a href="{{< ref "../services-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Accepted

401: Unauthorized


### `update` replace the specified IngressClass

#### HTTP Request

PUT /apis/networking.k8s.io/v1/ingressclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the IngressClass


- **body**: <a href="{{< ref "../services-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../services-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

201 (<a href="{{< ref "../services-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

401: Unauthorized


### `patch` partially update the specified IngressClass

#### HTTP Request

PATCH /apis/networking.k8s.io/v1/ingressclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the IngressClass


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../services-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

401: Unauthorized


### `delete` delete an IngressClass

#### HTTP Request

DELETE /apis/networking.k8s.io/v1/ingressclasses/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the IngressClass


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


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of IngressClass

#### HTTP Request

DELETE /apis/networking.k8s.io/v1/ingressclasses

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


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>



#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

