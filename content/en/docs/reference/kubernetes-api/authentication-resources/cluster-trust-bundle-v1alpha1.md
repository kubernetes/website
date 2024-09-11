---
api_metadata:
  apiVersion: "certificates.k8s.io/v1alpha1"
  import: "k8s.io/api/certificates/v1alpha1"
  kind: "ClusterTrustBundle"
content_type: "api_reference"
description: "ClusterTrustBundle is a cluster-scoped container for X."
title: "ClusterTrustBundle v1alpha1"
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

`apiVersion: certificates.k8s.io/v1alpha1`

`import "k8s.io/api/certificates/v1alpha1"`


## ClusterTrustBundle {#ClusterTrustBundle}

ClusterTrustBundle is a cluster-scoped container for X.509 trust anchors (root certificates).

ClusterTrustBundle objects are considered to be readable by any authenticated user in the cluster, because they can be mounted by pods using the `clusterTrustBundle` projection.  All service accounts have read access to ClusterTrustBundles by default.  Users who only have namespace-level access to a cluster can read ClusterTrustBundles by impersonating a serviceaccount that they have access to.

It can be optionally associated with a particular assigner, in which case it contains one valid set of trust anchors for that signer. Signers may have multiple associated ClusterTrustBundles; each is an independent set of trust anchors for that signer. Admission control is used to enforce that only users with permissions on the signer can create or modify the corresponding bundle.

<hr>

- **apiVersion**: certificates.k8s.io/v1alpha1


- **kind**: ClusterTrustBundle


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  metadata contains the object metadata.

- **spec** (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundleSpec" >}}">ClusterTrustBundleSpec</a>), required

  spec contains the signer (if any) and trust anchors.





## ClusterTrustBundleSpec {#ClusterTrustBundleSpec}

ClusterTrustBundleSpec contains the signer and trust anchors.

<hr>

- **trustBundle** (string), required

  trustBundle contains the individual X.509 trust anchors for this bundle, as PEM bundle of PEM-wrapped, DER-formatted X.509 certificates.
  
  The data must consist only of PEM certificate blocks that parse as valid X.509 certificates.  Each certificate must include a basic constraints extension with the CA bit set.  The API server will reject objects that contain duplicate certificates, or that use PEM block headers.
  
  Users of ClusterTrustBundles, including Kubelet, are free to reorder and deduplicate certificate blocks in this file according to their own logic, as well as to drop PEM block headers and inter-block data.

- **signerName** (string)

  signerName indicates the associated signer, if any.
  
  In order to create or update a ClusterTrustBundle that sets signerName, you must have the following cluster-scoped permission: group=certificates.k8s.io resource=signers resourceName=\<the signer name> verb=attest.
  
  If signerName is not empty, then the ClusterTrustBundle object must be named with the signer name as a prefix (translating slashes to colons). For example, for the signer name `example.com/foo`, valid ClusterTrustBundle object names include `example.com:foo:abc` and `example.com:foo:v1`.
  
  If signerName is empty, then the ClusterTrustBundle object's name must not have such a prefix.
  
  List/watch requests for ClusterTrustBundles can filter on this field using a `spec.signerName=NAME` field selector.





## ClusterTrustBundleList {#ClusterTrustBundleList}

ClusterTrustBundleList is a collection of ClusterTrustBundle objects

<hr>

- **apiVersion**: certificates.k8s.io/v1alpha1


- **kind**: ClusterTrustBundleList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata contains the list metadata.

- **items** ([]<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>), required

  items is a collection of ClusterTrustBundle objects





## Operations {#Operations}



<hr>






### `get` read the specified ClusterTrustBundle

#### HTTP Request

GET /apis/certificates.k8s.io/v1alpha1/clustertrustbundles/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ClusterTrustBundle


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

401: Unauthorized


### `list` list or watch objects of kind ClusterTrustBundle

#### HTTP Request

GET /apis/certificates.k8s.io/v1alpha1/clustertrustbundles

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


200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundleList" >}}">ClusterTrustBundleList</a>): OK

401: Unauthorized


### `create` create a ClusterTrustBundle

#### HTTP Request

POST /apis/certificates.k8s.io/v1alpha1/clustertrustbundles

#### Parameters


- **body**: <a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

202 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Accepted

401: Unauthorized


### `update` replace the specified ClusterTrustBundle

#### HTTP Request

PUT /apis/certificates.k8s.io/v1alpha1/clustertrustbundles/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ClusterTrustBundle


- **body**: <a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

401: Unauthorized


### `patch` partially update the specified ClusterTrustBundle

#### HTTP Request

PATCH /apis/certificates.k8s.io/v1alpha1/clustertrustbundles/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ClusterTrustBundle


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


200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

401: Unauthorized


### `delete` delete a ClusterTrustBundle

#### HTTP Request

DELETE /apis/certificates.k8s.io/v1alpha1/clustertrustbundles/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the ClusterTrustBundle


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


### `deletecollection` delete collection of ClusterTrustBundle

#### HTTP Request

DELETE /apis/certificates.k8s.io/v1alpha1/clustertrustbundles

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

