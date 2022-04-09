---
api_metadata:
  apiVersion: "networking.k8s.io/v1alpha1"
  import: "k8s.io/api/networking/v1alpha1"
  kind: "ClusterCIDRConfig"
content_type: "api_reference"
description: "ClusterCIDRConfig is the Schema for the clustercidrconfigs API."
title: "ClusterCIDRConfig v1alpha1"
weight: 11
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

`apiVersion: networking.k8s.io/v1alpha1`

`import "k8s.io/api/networking/v1alpha1"`


## ClusterCIDRConfig {#ClusterCIDRConfig}

ClusterCIDRConfig is the Schema for the clustercidrconfigs API.

<hr>

- **apiVersion**: networking.k8s.io/v1alpha1


- **kind**: ClusterCIDRConfig


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/cluster-cidr-config-v1alpha1#ClusterCIDRConfigSpec" >}}">ClusterCIDRConfigSpec</a>)

  Spec is the desired state of the ClusterCIDRConfig. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../cluster-resources/cluster-cidr-config-v1alpha1#ClusterCIDRConfigStatus" >}}">ClusterCIDRConfigStatus</a>)

  Status is the current state of the ClusterCIDRConfig. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status





## ClusterCIDRConfigSpec {#ClusterCIDRConfigSpec}

ClusterCIDRConfigSpec defines the desired state of ClusterCIDRConfig.

<hr>

- **ipv4CIDR** (string)

  IPv4CIDR defines an IPv4 IP block in CIDR notation(e.g. "10.0.0.0/8"). This field is immutable.

- **ipv6CIDR** (string)

  IPv6CIDR defines an IPv6 IP block in CIDR notation(e.g. "fd12:3456:789a:1::/64"). This field is immutable.

- **nodeSelector** (NodeSelector)

  NodeSelector defines which nodes the config is applicable to. An empty or nil NodeSelector functions as a default that applies to all nodes. This field is immutable.

  <a name="NodeSelector"></a>
  *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*

  - **nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm), required

    Required. A list of node selector terms. The terms are ORed.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*

    - **nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's labels.

    - **nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's fields.

- **perNodeHostBits** (int32)

  PerNodeHostBits defines the number of host bits to be configured per node. A subnet mask determines how much of the address is used for network bits and host bits. For example and IPv4 address of 192.168.0.0/24, splits the address into 24 bits for the network portion and 8 bits for the host portion. For a /24 mask for IPv4 or a /120 for IPv6, configure PerNodeHostBits=8 This field is immutable.





## ClusterCIDRConfigStatus {#ClusterCIDRConfigStatus}

ClusterCIDRConfigStatus defines the observed state of ClusterCIDRConfig.

<hr>





## ClusterCIDRConfigList {#ClusterCIDRConfigList}

ClusterCIDRConfigList contains a list of ClusterCIDRConfig.

<hr>

- **apiVersion**: networking.k8s.io/v1alpha1


- **kind**: ClusterCIDRConfigList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/cluster-cidr-config-v1alpha1#ClusterCIDRConfig" >}}">ClusterCIDRConfig</a>), required

  Items is the list of ClusterCIDRConfigs.





## Operations {#Operations}



<hr>






### `get` read the specified ClusterCIDRConfig

#### HTTP Request

GET /apis/networking.k8s.io/v1alpha1/clustercidrconfigs/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ClusterCIDRConfig


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/cluster-cidr-config-v1alpha1#ClusterCIDRConfig" >}}">ClusterCIDRConfig</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ClusterCIDRConfig

#### HTTP Request

GET /apis/networking.k8s.io/v1alpha1/clustercidrconfigs

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


200 (<a href="{{< ref "../cluster-resources/cluster-cidr-config-v1alpha1#ClusterCIDRConfigList" >}}">ClusterCIDRConfigList</a>): OK

401: Unauthorized


### `create` create a ClusterCIDRConfig

#### HTTP Request

POST /apis/networking.k8s.io/v1alpha1/clustercidrconfigs

#### Parameters


- **body**: <a href="{{< ref "../cluster-resources/cluster-cidr-config-v1alpha1#ClusterCIDRConfig" >}}">ClusterCIDRConfig</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/cluster-cidr-config-v1alpha1#ClusterCIDRConfig" >}}">ClusterCIDRConfig</a>): OK

201 (<a href="{{< ref "../cluster-resources/cluster-cidr-config-v1alpha1#ClusterCIDRConfig" >}}">ClusterCIDRConfig</a>): Created

202 (<a href="{{< ref "../cluster-resources/cluster-cidr-config-v1alpha1#ClusterCIDRConfig" >}}">ClusterCIDRConfig</a>): Accepted

401: Unauthorized


### `update` replace the specified ClusterCIDRConfig

#### HTTP Request

PUT /apis/networking.k8s.io/v1alpha1/clustercidrconfigs/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ClusterCIDRConfig


- **body**: <a href="{{< ref "../cluster-resources/cluster-cidr-config-v1alpha1#ClusterCIDRConfig" >}}">ClusterCIDRConfig</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../cluster-resources/cluster-cidr-config-v1alpha1#ClusterCIDRConfig" >}}">ClusterCIDRConfig</a>): OK

201 (<a href="{{< ref "../cluster-resources/cluster-cidr-config-v1alpha1#ClusterCIDRConfig" >}}">ClusterCIDRConfig</a>): Created

401: Unauthorized


### `patch` partially update the specified ClusterCIDRConfig

#### HTTP Request

PATCH /apis/networking.k8s.io/v1alpha1/clustercidrconfigs/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ClusterCIDRConfig


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


200 (<a href="{{< ref "../cluster-resources/cluster-cidr-config-v1alpha1#ClusterCIDRConfig" >}}">ClusterCIDRConfig</a>): OK

201 (<a href="{{< ref "../cluster-resources/cluster-cidr-config-v1alpha1#ClusterCIDRConfig" >}}">ClusterCIDRConfig</a>): Created

401: Unauthorized


### `delete` delete a ClusterCIDRConfig

#### HTTP Request

DELETE /apis/networking.k8s.io/v1alpha1/clustercidrconfigs/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ClusterCIDRConfig


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


### `deletecollection` delete collection of ClusterCIDRConfig

#### HTTP Request

DELETE /apis/networking.k8s.io/v1alpha1/clustercidrconfigs

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

