---
api_metadata:
  apiVersion: "apiextensions.k8s.io/v1"
  import: "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
  kind: "CustomResourceDefinition"
content_type: "api_reference"
description: "CustomResourceDefinition represents a resource that should be exposed on the API server."
title: "CustomResourceDefinition"
weight: 1
---

`apiVersion: apiextensions.k8s.io/v1`

`import "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"`


## CustomResourceDefinition {#CustomResourceDefinition}

CustomResourceDefinition represents a resource that should be exposed on the API server.  Its name MUST be in the format \<.spec.name>.\<.spec.group>.

<hr>

- **apiVersion**: apiextensions.k8s.io/v1


- **kind**: CustomResourceDefinition


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)


- **spec** (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinitionSpec" >}}">CustomResourceDefinitionSpec</a>), required

  spec describes how the user wants the resources to appear

- **status** (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinitionStatus" >}}">CustomResourceDefinitionStatus</a>)

  status indicates the actual state of the CustomResourceDefinition





## CustomResourceDefinitionSpec {#CustomResourceDefinitionSpec}

CustomResourceDefinitionSpec describes how a user wants their resource to appear

<hr>

- **group** (string), required

  group is the API group of the defined custom resource. The custom resources are served under `/apis/\<group>/...`. Must match the name of the CustomResourceDefinition (in the form `\<names.plural>.\<group>`).

- **names** (CustomResourceDefinitionNames), required

  names specify the resource and kind names for the custom resource.

  <a name="CustomResourceDefinitionNames"></a>
  *CustomResourceDefinitionNames indicates the names to serve this CustomResourceDefinition*

  - **names.kind** (string), required

    kind is the serialized kind of the resource. It is normally CamelCase and singular. Custom resource instances will use this value as the `kind` attribute in API calls.

  - **names.plural** (string), required

    plural is the plural name of the resource to serve. The custom resources are served under `/apis/\<group>/\<version>/.../\<plural>`. Must match the name of the CustomResourceDefinition (in the form `\<names.plural>.\<group>`). Must be all lowercase.

  - **names.categories** ([]string)

    categories is a list of grouped resources this custom resource belongs to (e.g. 'all'). This is published in API discovery documents, and used by clients to support invocations like `kubectl get all`.

  - **names.listKind** (string)

    listKind is the serialized kind of the list for this resource. Defaults to "`kind`List".

  - **names.shortNames** ([]string)

    shortNames are short names for the resource, exposed in API discovery documents, and used by clients to support invocations like `kubectl get \<shortname>`. It must be all lowercase.

  - **names.singular** (string)

    singular is the singular name of the resource. It must be all lowercase. Defaults to lowercased `kind`.

- **scope** (string), required

  scope indicates whether the defined custom resource is cluster- or namespace-scoped. Allowed values are `Cluster` and `Namespaced`.

- **versions** ([]CustomResourceDefinitionVersion), required

  versions is the list of all API versions of the defined custom resource. Version names are used to compute the order in which served versions are listed in API discovery. If the version string is "kube-like", it will sort above non "kube-like" version strings, which are ordered lexicographically. "Kube-like" versions start with a "v", then are followed by a number (the major version), then optionally the string "alpha" or "beta" and another number (the minor version). These are sorted first by GA > beta > alpha (where GA is a version with no suffix such as beta or alpha), and then by comparing major version, then minor version. An example sorted list of versions: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10.

  <a name="CustomResourceDefinitionVersion"></a>
  *CustomResourceDefinitionVersion describes a version for CRD.*

  - **versions.name** (string), required

    name is the version name, e.g. “v1”, “v2beta1”, etc. The custom resources are served under this version at `/apis/\<group>/\<version>/...` if `served` is true.

  - **versions.served** (boolean), required

    served is a flag enabling/disabling this version from being served via REST APIs

  - **versions.storage** (boolean), required

    storage indicates this version should be used when persisting custom resources to storage. There must be exactly one version with storage=true.

  - **versions.additionalPrinterColumns** ([]CustomResourceColumnDefinition)

    additionalPrinterColumns specifies additional columns returned in Table output. See https://kubernetes.io/docs/reference/using-api/api-concepts/#receiving-resources-as-tables for details. If no columns are specified, a single column displaying the age of the custom resource is used.

    <a name="CustomResourceColumnDefinition"></a>
    *CustomResourceColumnDefinition specifies a column for server side printing.*

  - **versions.additionalPrinterColumns.jsonPath** (string), required

    jsonPath is a simple JSON path (i.e. with array notation) which is evaluated against each custom resource to produce the value for this column.

  - **versions.additionalPrinterColumns.name** (string), required

    name is a human readable name for the column.

  - **versions.additionalPrinterColumns.type** (string), required

    type is an OpenAPI type definition for this column. See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types for details.

  - **versions.additionalPrinterColumns.description** (string)

    description is a human readable description of this column.

  - **versions.additionalPrinterColumns.format** (string)

    format is an optional OpenAPI type definition for this column. The 'name' format is applied to the primary identifier column to assist in clients identifying column is the resource name. See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types for details.

  - **versions.additionalPrinterColumns.priority** (int32)

    priority is an integer defining the relative importance of this column compared to others. Lower numbers are considered higher priority. Columns that may be omitted in limited space scenarios should be given a priority greater than 0.

  - **versions.deprecated** (boolean)

    deprecated indicates this version of the custom resource API is deprecated. When set to true, API requests to this version receive a warning header in the server response. Defaults to false.

  - **versions.deprecationWarning** (string)

    deprecationWarning overrides the default warning returned to API clients. May only be set when `deprecated` is true. The default warning indicates this version is deprecated and recommends use of the newest served version of equal or greater stability, if one exists.

  - **versions.schema** (CustomResourceValidation)

    schema describes the schema used for validation, pruning, and defaulting of this version of the custom resource.

    <a name="CustomResourceValidation"></a>
    *CustomResourceValidation is a list of validation methods for CustomResources.*

  - **versions.schema.openAPIV3Schema** (<a href="{{< ref "../common-definitions/json-schema-props#JSONSchemaProps" >}}">JSONSchemaProps</a>)

    openAPIV3Schema is the OpenAPI v3 schema to use for validation and pruning.

  - **versions.subresources** (CustomResourceSubresources)

    subresources specify what subresources this version of the defined custom resource have.

    <a name="CustomResourceSubresources"></a>
    *CustomResourceSubresources defines the status and scale subresources for CustomResources.*

  - **versions.subresources.scale** (CustomResourceSubresourceScale)

    scale indicates the custom resource should serve a `/scale` subresource that returns an `autoscaling/v1` Scale object.

    <a name="CustomResourceSubresourceScale"></a>
    *CustomResourceSubresourceScale defines how to serve the scale subresource for CustomResources.*

  - **versions.subresources.scale.specReplicasPath** (string), required

    specReplicasPath defines the JSON path inside of a custom resource that corresponds to Scale `spec.replicas`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.spec`. If there is no value under the given path in the custom resource, the `/scale` subresource will return an error on GET.

  - **versions.subresources.scale.statusReplicasPath** (string), required

    statusReplicasPath defines the JSON path inside of a custom resource that corresponds to Scale `status.replicas`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.status`. If there is no value under the given path in the custom resource, the `status.replicas` value in the `/scale` subresource will default to 0.

  - **versions.subresources.scale.labelSelectorPath** (string)

    labelSelectorPath defines the JSON path inside of a custom resource that corresponds to Scale `status.selector`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.status` or `.spec`. Must be set to work with HorizontalPodAutoscaler. The field pointed by this JSON path must be a string field (not a complex selector struct) which contains a serialized label selector in string form. More info: https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions#scale-subresource If there is no value under the given path in the custom resource, the `status.selector` value in the `/scale` subresource will default to the empty string.

  - **versions.subresources.status** (CustomResourceSubresourceStatus)

    status indicates the custom resource should serve a `/status` subresource. When enabled: 1. requests to the custom resource primary endpoint ignore changes to the `status` stanza of the object. 2. requests to the custom resource `/status` subresource ignore changes to anything other than the `status` stanza of the object.

    <a name="CustomResourceSubresourceStatus"></a>
    *CustomResourceSubresourceStatus defines how to serve the status subresource for CustomResources. Status is represented by the `.status` JSON path inside of a CustomResource. When set, * exposes a /status subresource for the custom resource * PUT requests to the /status subresource take a custom resource object, and ignore changes to anything except the status stanza * PUT/POST/PATCH requests to the custom resource ignore changes to the status stanza*

- **conversion** (CustomResourceConversion)

  conversion defines conversion settings for the CRD.

  <a name="CustomResourceConversion"></a>
  *CustomResourceConversion describes how to convert different versions of a CR.*

  - **conversion.strategy** (string), required

    strategy specifies how custom resources are converted between versions. Allowed values are: - `None`: The converter only change the apiVersion and would not touch any other field in the custom resource. - `Webhook`: API Server will call to an external webhook to do the conversion. Additional information
      is needed for this option. This requires spec.preserveUnknownFields to be false, and spec.conversion.webhook to be set.

  - **conversion.webhook** (WebhookConversion)

    webhook describes how to call the conversion webhook. Required when `strategy` is set to `Webhook`.

    <a name="WebhookConversion"></a>
    *WebhookConversion describes how to call a conversion webhook*

  - **conversion.webhook.conversionReviewVersions** ([]string), required

    conversionReviewVersions is an ordered list of preferred `ConversionReview` versions the Webhook expects. The API server will use the first version in the list which it supports. If none of the versions specified in this list are supported by API server, conversion will fail for the custom resource. If a persisted Webhook configuration specifies allowed versions and does not include any versions known to the API Server, calls to the webhook will fail.

  - **conversion.webhook.clientConfig** (WebhookClientConfig)

    clientConfig is the instructions for how to call the webhook if strategy is `Webhook`.

    <a name="WebhookClientConfig"></a>
    *WebhookClientConfig contains the information to make a TLS connection with the webhook.*

  - **conversion.webhook.clientConfig.caBundle** ([]byte)

    caBundle is a PEM encoded CA bundle which will be used to validate the webhook's server certificate. If unspecified, system trust roots on the apiserver are used.

  - **conversion.webhook.clientConfig.service** (ServiceReference)

    service is a reference to the service for this webhook. Either service or url must be specified.
    
    If the webhook is running within the cluster, then you should use `service`.

    <a name="ServiceReference"></a>
    *ServiceReference holds a reference to Service.legacy.k8s.io*

  - **conversion.webhook.clientConfig.service.name** (string), required

    name is the name of the service. Required

  - **conversion.webhook.clientConfig.service.namespace** (string), required

    namespace is the namespace of the service. Required

  - **conversion.webhook.clientConfig.service.path** (string)

    path is an optional URL path at which the webhook will be contacted.

  - **conversion.webhook.clientConfig.service.port** (int32)

    port is an optional service port at which the webhook will be contacted. `port` should be a valid port number (1-65535, inclusive). Defaults to 443 for backward compatibility.

  - **conversion.webhook.clientConfig.url** (string)

    url gives the location of the webhook, in standard URL form (`scheme://host:port/path`). Exactly one of `url` or `service` must be specified.

    The `host` should not refer to a service running in the cluster; use the `service` field instead. The host might be resolved via external DNS in some apiservers (e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would be a layering violation). `host` may also be an IP address.

    Please note that using `localhost` or `127.0.0.1` as a `host` is risky unless you take great care to run this webhook on all hosts which run an apiserver which might need to make calls to this webhook. Such installations are likely to be non-portable or not readily run in a new cluster.

    The scheme must be "https"; the URL must begin with "https://".

    A path is optional, and if present may be any string permissible in a URL. You may use the path to pass an arbitrary string to the webhook, for example, a cluster identifier.

    Attempting to use a user or basic auth e.g. "user:password@" is not allowed. Fragments ("#...") and query parameters ("?...") are not allowed, either.

- **preserveUnknownFields** (boolean)

  preserveUnknownFields indicates that object fields which are not specified in the OpenAPI schema should be preserved when persisting to storage. apiVersion, kind, metadata and known fields inside metadata are always preserved. This field is deprecated in favor of setting `x-preserve-unknown-fields` to true in `spec.versions[*].schema.openAPIV3Schema`. See https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/#pruning-versus-preserving-unknown-fields for details.





## CustomResourceDefinitionStatus {#CustomResourceDefinitionStatus}

CustomResourceDefinitionStatus indicates the state of the CustomResourceDefinition

<hr>

- **acceptedNames** (CustomResourceDefinitionNames)

  acceptedNames are the names that are actually being used to serve discovery. They may be different than the names in spec.

  <a name="CustomResourceDefinitionNames"></a>
  *CustomResourceDefinitionNames indicates the names to serve this CustomResourceDefinition*

  - **acceptedNames.kind** (string), required

    kind is the serialized kind of the resource. It is normally CamelCase and singular. Custom resource instances will use this value as the `kind` attribute in API calls.

  - **acceptedNames.plural** (string), required

    plural is the plural name of the resource to serve. The custom resources are served under `/apis/\<group>/\<version>/.../\<plural>`. Must match the name of the CustomResourceDefinition (in the form `\<names.plural>.\<group>`). Must be all lowercase.

  - **acceptedNames.categories** ([]string)

    categories is a list of grouped resources this custom resource belongs to (e.g. 'all'). This is published in API discovery documents, and used by clients to support invocations like `kubectl get all`.

  - **acceptedNames.listKind** (string)

    listKind is the serialized kind of the list for this resource. Defaults to "`kind`List".

  - **acceptedNames.shortNames** ([]string)

    shortNames are short names for the resource, exposed in API discovery documents, and used by clients to support invocations like `kubectl get \<shortname>`. It must be all lowercase.

  - **acceptedNames.singular** (string)

    singular is the singular name of the resource. It must be all lowercase. Defaults to lowercased `kind`.

- **conditions** ([]CustomResourceDefinitionCondition)

  conditions indicate state for particular aspects of a CustomResourceDefinition

  <a name="CustomResourceDefinitionCondition"></a>
  *CustomResourceDefinitionCondition contains details for the current condition of this pod.*

  - **conditions.status** (string), required

    status is the status of the condition. Can be True, False, Unknown.

  - **conditions.type** (string), required

    type is the type of the condition. Types include Established, NamesAccepted and Terminating.

  - **conditions.lastTransitionTime** (Time)

    lastTransitionTime last time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **conditions.message** (string)

    message is a human-readable message indicating details about last transition.

  - **conditions.reason** (string)

    reason is a unique, one-word, CamelCase reason for the condition's last transition.

- **storedVersions** ([]string)

  storedVersions lists all versions of CustomResources that were ever persisted. Tracking these versions allows a migration path for stored versions in etcd. The field is mutable so a migration controller can finish a migration to another version (ensuring no old objects are left in storage), and then remove the rest of the versions from this list. Versions may not be removed from `spec.versions` while they exist in this list.





## CustomResourceDefinitionList {#CustomResourceDefinitionList}

CustomResourceDefinitionList is a list of CustomResourceDefinition objects.

<hr>

- **apiVersion**: apiextensions.k8s.io/v1


- **kind**: CustomResourceDefinitionList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)


- **items** ([]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>), required

  items list individual CustomResourceDefinition objects





## Operations {#Operations}



<hr>






### `get` read the specified CustomResourceDefinition

#### HTTP Request

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the CustomResourceDefinition


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

401: Unauthorized


### `get` read status of the specified CustomResourceDefinition

#### HTTP Request

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the CustomResourceDefinition


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

401: Unauthorized


### `list` list or watch objects of kind CustomResourceDefinition

#### HTTP Request

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions

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


200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinitionList" >}}">CustomResourceDefinitionList</a>): OK

401: Unauthorized


### `create` create a CustomResourceDefinition

#### HTTP Request

POST /apis/apiextensions.k8s.io/v1/customresourcedefinitions

#### Parameters


- **body**: <a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

202 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Accepted

401: Unauthorized


### `update` replace the specified CustomResourceDefinition

#### HTTP Request

PUT /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the CustomResourceDefinition


- **body**: <a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

401: Unauthorized


### `update` replace status of the specified CustomResourceDefinition

#### HTTP Request

PUT /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the CustomResourceDefinition


- **body**: <a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

401: Unauthorized


### `patch` partially update the specified CustomResourceDefinition

#### HTTP Request

PATCH /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the CustomResourceDefinition


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


200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

401: Unauthorized


### `patch` partially update status of the specified CustomResourceDefinition

#### HTTP Request

PATCH /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the CustomResourceDefinition


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


200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

401: Unauthorized


### `delete` delete a CustomResourceDefinition

#### HTTP Request

DELETE /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the CustomResourceDefinition


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


### `deletecollection` delete collection of CustomResourceDefinition

#### HTTP Request

DELETE /apis/apiextensions.k8s.io/v1/customresourcedefinitions

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

