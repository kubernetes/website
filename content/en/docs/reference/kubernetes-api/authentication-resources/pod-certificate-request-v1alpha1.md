---
api_metadata:
  apiVersion: "certificates.k8s.io/v1alpha1"
  import: "k8s.io/api/certificates/v1alpha1"
  kind: "PodCertificateRequest"
content_type: "api_reference"
description: "PodCertificateRequest encodes a pod requesting a certificate from a given signer."
title: "PodCertificateRequest v1alpha1"
weight: 7
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


## PodCertificateRequest {#PodCertificateRequest}

PodCertificateRequest encodes a pod requesting a certificate from a given signer.

Kubelets use this API to implement podCertificate projected volumes

<hr>

- **apiVersion**: certificates.k8s.io/v1alpha1


- **kind**: PodCertificateRequest


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  metadata contains the object metadata.

- **spec** (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequestSpec" >}}">PodCertificateRequestSpec</a>), required

  spec contains the details about the certificate being requested.

- **status** (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequestStatus" >}}">PodCertificateRequestStatus</a>)

  status contains the issued certificate, and a standard set of conditions.





## PodCertificateRequestSpec {#PodCertificateRequestSpec}

PodCertificateRequestSpec describes the certificate request.  All fields are immutable after creation.

<hr>

- **nodeName** (string), required

  nodeName is the name of the node the pod is assigned to.

- **nodeUID** (string), required

  nodeUID is the UID of the node the pod is assigned to.

- **pkixPublicKey** ([]byte), required

  pkixPublicKey is the PKIX-serialized public key the signer will issue the certificate to.
  
  The key must be one of RSA3072, RSA4096, ECDSAP256, ECDSAP384, ECDSAP521, or ED25519. Note that this list may be expanded in the future.
  
  Signer implementations do not need to support all key types supported by kube-apiserver and kubelet.  If a signer does not support the key type used for a given PodCertificateRequest, it must deny the request by setting a status.conditions entry with a type of "Denied" and a reason of "UnsupportedKeyType". It may also suggest a key type that it does support in the message field.

- **podName** (string), required

  podName is the name of the pod into which the certificate will be mounted.

- **podUID** (string), required

  podUID is the UID of the pod into which the certificate will be mounted.

- **proofOfPossession** ([]byte), required

  proofOfPossession proves that the requesting kubelet holds the private key corresponding to pkixPublicKey.
  
  It is contructed by signing the ASCII bytes of the pod's UID using `pkixPublicKey`.
  
  kube-apiserver validates the proof of possession during creation of the PodCertificateRequest.
  
  If the key is an RSA key, then the signature is over the ASCII bytes of the pod UID, using RSASSA-PSS from RFC 8017 (as implemented by the golang function crypto/rsa.SignPSS with nil options).
  
  If the key is an ECDSA key, then the signature is as described by [SEC 1, Version 2.0](https://www.secg.org/sec1-v2.pdf) (as implemented by the golang library function crypto/ecdsa.SignASN1)
  
  If the key is an ED25519 key, the the signature is as described by the [ED25519 Specification](https://ed25519.cr.yp.to/) (as implemented by the golang library crypto/ed25519.Sign).

- **serviceAccountName** (string), required

  serviceAccountName is the name of the service account the pod is running as.

- **serviceAccountUID** (string), required

  serviceAccountUID is the UID of the service account the pod is running as.

- **signerName** (string), required

  signerName indicates the requested signer.
  
  All signer names beginning with `kubernetes.io` are reserved for use by the Kubernetes project.  There is currently one well-known signer documented by the Kubernetes project, `kubernetes.io/kube-apiserver-client-pod`, which will issue client certificates understood by kube-apiserver.  It is currently unimplemented.

- **maxExpirationSeconds** (int32)

  maxExpirationSeconds is the maximum lifetime permitted for the certificate.
  
  If omitted, kube-apiserver will set it to 86400(24 hours). kube-apiserver will reject values shorter than 3600 (1 hour).  The maximum allowable value is 7862400 (91 days).
  
  The signer implementation is then free to issue a certificate with any lifetime *shorter* than MaxExpirationSeconds, but no shorter than 3600 seconds (1 hour).  This constraint is enforced by kube-apiserver. `kubernetes.io` signers will never issue certificates with a lifetime longer than 24 hours.





## PodCertificateRequestStatus {#PodCertificateRequestStatus}

PodCertificateRequestStatus describes the status of the request, and holds the certificate data if the request is issued.

<hr>

- **beginRefreshAt** (Time)

  beginRefreshAt is the time at which the kubelet should begin trying to refresh the certificate.  This field is set via the /status subresource, and must be set at the same time as certificateChain.  Once populated, this field is immutable.
  
  This field is only a hint.  Kubelet may start refreshing before or after this time if necessary.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

- **certificateChain** (string)

  certificateChain is populated with an issued certificate by the signer. This field is set via the /status subresource. Once populated, this field is immutable.
  
  If the certificate signing request is denied, a condition of type "Denied" is added and this field remains empty. If the signer cannot issue the certificate, a condition of type "Failed" is added and this field remains empty.
  
  Validation requirements:
   1. certificateChain must consist of one or more PEM-formatted certificates.
   2. Each entry must be a valid PEM-wrapped, DER-encoded ASN.1 Certificate as
      described in section 4 of RFC5280.
  
  If more than one block is present, and the definition of the requested spec.signerName does not indicate otherwise, the first block is the issued certificate, and subsequent blocks should be treated as intermediate certificates and presented in TLS handshakes.  When projecting the chain into a pod volume, kubelet will drop any data in-between the PEM blocks, as well as any PEM block headers.

- **conditions** ([]Condition)

  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  conditions applied to the request.
  
  The types "Issued", "Denied", and "Failed" have special handling.  At most one of these conditions may be present, and they must have status "True".
  
  If the request is denied with `Reason=UnsupportedKeyType`, the signer may suggest a key type that will work in the message field.

  <a name="Condition"></a>
  *Condition contains details for one aspect of the current state of this API Resource.*

  - **conditions.lastTransitionTime** (Time), required

    lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **conditions.message** (string), required

    message is a human readable message indicating details about the transition. This may be an empty string.

  - **conditions.reason** (string), required

    reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty.

  - **conditions.status** (string), required

    status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    type of condition in CamelCase or in foo.example.com/CamelCase.

  - **conditions.observedGeneration** (int64)

    observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance.

- **notAfter** (Time)

  notAfter is the time at which the certificate expires.  The value must be the same as the notAfter value in the leaf certificate in certificateChain.  This field is set via the /status subresource.  Once populated, it is immutable.  The signer must set this field at the same time it sets certificateChain.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

- **notBefore** (Time)

  notBefore is the time at which the certificate becomes valid.  The value must be the same as the notBefore value in the leaf certificate in certificateChain.  This field is set via the /status subresource.  Once populated, it is immutable. The signer must set this field at the same time it sets certificateChain.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*





## PodCertificateRequestList {#PodCertificateRequestList}

PodCertificateRequestList is a collection of PodCertificateRequest objects

<hr>

- **apiVersion**: certificates.k8s.io/v1alpha1


- **kind**: PodCertificateRequestList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata contains the list metadata.

- **items** ([]<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>), required

  items is a collection of PodCertificateRequest objects





## Operations {#Operations}



<hr>






### `get` read the specified PodCertificateRequest

#### HTTP Request

GET /apis/certificates.k8s.io/v1alpha1/namespaces/{namespace}/podcertificaterequests/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodCertificateRequest


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>): OK

401: Unauthorized


### `get` read status of the specified PodCertificateRequest

#### HTTP Request

GET /apis/certificates.k8s.io/v1alpha1/namespaces/{namespace}/podcertificaterequests/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodCertificateRequest


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>): OK

401: Unauthorized


### `list` list or watch objects of kind PodCertificateRequest

#### HTTP Request

GET /apis/certificates.k8s.io/v1alpha1/namespaces/{namespace}/podcertificaterequests

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


200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequestList" >}}">PodCertificateRequestList</a>): OK

401: Unauthorized


### `list` list or watch objects of kind PodCertificateRequest

#### HTTP Request

GET /apis/certificates.k8s.io/v1alpha1/podcertificaterequests

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


200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequestList" >}}">PodCertificateRequestList</a>): OK

401: Unauthorized


### `create` create a PodCertificateRequest

#### HTTP Request

POST /apis/certificates.k8s.io/v1alpha1/namespaces/{namespace}/podcertificaterequests

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>): Created

202 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>): Accepted

401: Unauthorized


### `update` replace the specified PodCertificateRequest

#### HTTP Request

PUT /apis/certificates.k8s.io/v1alpha1/namespaces/{namespace}/podcertificaterequests/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodCertificateRequest


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>): Created

401: Unauthorized


### `update` replace status of the specified PodCertificateRequest

#### HTTP Request

PUT /apis/certificates.k8s.io/v1alpha1/namespaces/{namespace}/podcertificaterequests/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodCertificateRequest


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>): Created

401: Unauthorized


### `patch` partially update the specified PodCertificateRequest

#### HTTP Request

PATCH /apis/certificates.k8s.io/v1alpha1/namespaces/{namespace}/podcertificaterequests/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodCertificateRequest


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


200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>): Created

401: Unauthorized


### `patch` partially update status of the specified PodCertificateRequest

#### HTTP Request

PATCH /apis/certificates.k8s.io/v1alpha1/namespaces/{namespace}/podcertificaterequests/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the PodCertificateRequest


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


200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1alpha1#PodCertificateRequest" >}}">PodCertificateRequest</a>): Created

401: Unauthorized


### `delete` delete a PodCertificateRequest

#### HTTP Request

DELETE /apis/certificates.k8s.io/v1alpha1/namespaces/{namespace}/podcertificaterequests/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the PodCertificateRequest


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


### `deletecollection` delete collection of PodCertificateRequest

#### HTTP Request

DELETE /apis/certificates.k8s.io/v1alpha1/namespaces/{namespace}/podcertificaterequests

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

