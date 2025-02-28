---
reviewers:
- liggitt
- mikedanese
- munnerz
- enj
title: Certificate Provisioning and Trust Distribution
api_metadata:
- apiVersion: "certificates.k8s.io/v1"
  kind: "CertificateSigningRequest"
  override_link_text: "CSR v1"
- apiVersion: "certificates.k8s.io/v1beta1"
  kind: "ClusterTrustBundle"
- apiVersion: "certificates.k8s.io/v1alpha1"
  kind: "PodCertificateRequest"  
content_type: concept
weight: 60
---

<!-- overview -->

Kubernetes certificate and trust bundle APIs enable automation of
[X.509](https://www.itu.int/rec/T-REC-X.509) credential provisioning by
providing a programmatic interface for clients of the Kubernetes API to request
and obtain X.509 {{< glossary_tooltip term_id="certificate" text="certificates"
>}} from a Certificate Authority (CA).

The three API types for requesting and trusting certificates are:
* CertificateSigningRequest: An API type that lets you request an arbitrary
  certificate from a signer.
* PodCertificateRequest: (alpha) An API type that lets `kubelet` request
  certificates to inject into a Pod.
* ClusterTrustBundle: (beta) A group of certificates (typically CA root
  certificates) that should be used as roots of trust for verifying a server or
  client certificate.

<!-- body -->


## Signers {#signers}

Kubernetes organizes its certificate provisioning features around the concept of
a signer.

Each signer is identified by a qualified name built from a DNS name (for
example, `kubernetes.io/foo`).  Each signer uniquely identifies a category of
certificates that can be issued within the scope of a particular cluster.
Kubernetes offers some [built-in signers](#kubernetes-signers), and third-party
signers may also be freely installed into a cluster.

Note that signers are not a concrete concept in the Kubernetes API &mdash; there
is no Signer object that you create.  Instead, several types in the
`certificates.k8s.io` API group have a `signerName` field, and there is special
authorization logic that lets signers handle all objects that are addressed to a
particular signer.

Each signer is backed by a set of {{< glossary_tooltip text="controllers"
term_id="controller" >}} that do one or more of the following things to let
pods, users, and external workloads provision and verify certificates issued by
the signer.
* Certificate issuance: The signer responds to CertificateSigningRequests and
  PodCertificateRequests addressed to the signer's name.
* Trust anchor distribution: The controller publishes the trust anchors (root
  certificates) of the signer for consumption by workloads using either
  signer-linked ClusterTrustBundles or ConfigMaps

The Kubernetes project provides a set of [built-in signers](#kubernetes-signers)
that are available in every cluster.  It is also possible to install (or build
your own) [third-party signers](#third-party-signers).


## Certificate signing requests {#certificate-signing-requests}

A
[CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)
(CSR) is used to request a certificate from a particular signer.

The CSR flow begins when a requester creates a CSR object:
* `spec.signerName` says which signer should process the CSR.
* `spec.request` contains a PEM-wrapped PKCS#10 signing request.
* `spec.expirationSeconds` (optional) allows the requester to ask for a specific
  lifetime for the issued certificate.
* `spec.usages` contains the key usages that the requester wants on the issued
  certificate. 

Once created, a CSR must be approved before it can be signed. Approval is
indicated by adding an `Approved` entry to `status.conditions`.  Denial is
indicated by adding a `Denied` entry to `status.conditions`.  Both of these
conditions must always have `status` set to `True`. These conditions are
mutually-exclusive.

Different signers have different expectations around their approval workflows,
so signer authors are encouraged to document whether and how they expect CSRs to
be approved.  Broadly speaking:
* Some signers automatically approve conforming CSRs, and will refuse to issue a
  certificate to a non-conforming CSR.  These signers will move an approved, but
  non-conforming CSR into the `Failed` terminal state, rather than issuing it.
  For example, a signer might only want to issue SPIFFE certificates, and so
  will fail any CSR that requests a non-SPIFFE-formatted CSR.
* Some signers expect a human reviewer to inspect and approve all
  CSRs.  The `kubectl certificate approve/deny`
  convenience commands may be used for this purpose.
* Some signers operate in a blended mode, where some CSRs are automatically
  approved and issued, but the signer will also issue certificates to
  manually-approved CSRs.

Special permissions are required to approve or deny a CSR:
* Verbs: **update**, group: `certificates.k8s.io`, resource:
  `certificatesigningrequests/approval`
* Verbs: **approve**, group: `certificates.k8s.io`, resource: `signers`,
  resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`

Once a CSR is approved, the next step is for the signer's controller to either
issue a certificate or fail the CSR.

To issue a certificate to a CSR, the controller creates an X.509 certificate
chain and stores it in the `status.certificate` field of the CSR, encoded as a
series of PEM `CERTIFICATE` blocks. The signer implementation may, but does not
have to, consider the CSR's `spec.request` field.  It is free to issue an
entirely different certificate.

{{< note >}}
When encoded in JSON or YAML, `status.certificate` field is base-64 encoded, so
it is not directly readable.  This is handled transparently when using a client
library.
{{< /note >}}

Signer implementations are encouraged to:
* Document whether or not they consider manual approval decisions on
  CertificateSigningRequests.
* Document which parts, if any, of the PKCS#10 request they consider.
* Document the concrete format of the certificates they issue.

Once the `status.certificate` field has been populated, the request has been
completed and clients can now fetch the signed certificate PEM data from the
CSR.

If the signer controller does not wish to issue the certificate, even if it has
been approved, then it can add the `Failed` condition to the CSR, which is a
terminal state. 

Special permissions are required to sign or fail a CSR:
* Verbs: **update**, group: `certificates.k8s.io`, resource:
  `certificatesigningrequests/status`
* Verbs: **sign**, group: `certificates.k8s.io`, resource: `signers`,
  resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`

Like all conditions, the `status.conditions[].reason` field is meant to contain
a machine-readable code describing the condition in TitleCase.  The
`status.conditions[].message` field is meant for a free-form explanation for
human consumption.

In order to reduce the number of old CSR objects left in a cluster, a garbage
collection controller runs periodically. The garbage collection removes CSRs
that have not changed state for some duration:

* Approved requests: automatically deleted after 1 hour
* Denied requests: automatically deleted after 1 hour
* Failed requests: automatically deleted after 1 hour
* Pending requests: automatically deleted after 24 hours
* All requests: automatically deleted after the issued certificate has expired


## PodCertificateRequests {#pod-certificate-requests}

{{< feature-state feature_gate_name="PodCertificateRequest" >}}

{{< note >}}
In Kubernetes {{< skew currentVersion >}}, you must enable support for Pod
Certificates using the `PodCertificateRequest` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) and the
`--runtime-config=certificates.k8s.io/v1alpha1/podcertificaterequests=true`
kube-apiserver flag.
{{< /note >}}

PodCertificateRequests are API objects tailored to provisioning certificates to
workloads running as Pods within a cluster.  The user typically does not
interact with PodCertificateRequests directly, but uses [podCertificate
projected volume sources](
/docs/concepts/storage/projected-volumes#podcertificate), which are a `kubelet`
feature that handles secure key provisioning and automatic certificate refresh.
The application inside the pod only needs to know how to read the certificates
from the filesystem.

PodCertificateRequests are similar to CertificateSigningRequests, but have a
simpler format enabled by their narrower use case.

A PodCertificateRequest has the following spec fields:
* `signerName`: The signer to which this request is addressed.
* `podName` and `podUID`: The Pod that Kubelet is requesting a certificate for.
* `serviceAccountName` and `serviceAccountUID`: The ServiceAccount corresponding to the Pod.
* `nodeName` and `nodeUID`: The Node corresponding to the Pod.
* `maxExpirationSeconds`: The maximum lifetime that the workload author will
  accept for this certificate.  Defaults to 24 hours if not specified.
* `pkixPublicKey`: The public key for which the certificate should be issued.
* `proofOfPossession`: A signature demonstrating that the requester controls the
  private key corresponding to `pkixPublicKey`.

Nodes automatically receive permissions to create PodCertificateRequests and
read PodCertificateRequests related to them (as determined by the
`spec.nodeName` field).  The [NodeRestriction admission
plugin](/docs/reference/access-authn-authz/admission-controllers#noderestriction),
if enabled, ensures that nodes can only create PodCertificateRequests that
correspond to a real pod that is currently running on the node.

After creation, the `spec` of a PodCertificateRequest is immutable.

Unlike CSRs, PodCertificateRequests do not have an
approval phase.  Once the PodCertificateRequest is created, the signer's
controller directly decides to issue or deny the request.  It also has the
option to mark the request as failed, if it encountered a permanent error when
attempting to issue the request.

To take any of these actions, the signing controller needs to have the
appropriate permissions on both the PodCertificateRequest type, as well as on
the signer name:
* Verbs: **update**, group: `certificates.k8s.io`, resource:
  `podcertificaterequests/status`
* Verbs: **sign**, group: `certificates.k8s.io`, resource: `signers`,
  resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`

The signing controller is free to consider other information beyond what's
contained in the request, but it can rely on the information in the request to
be accurate.  For example, the signing controller might load the Pod and read
annotations set on it, or perform a SubjectAccessReview on the ServiceAccount.  

To issue a certificate in response to a request, the signing controller:
* Adds an `Issued` condition to `status.conditions`.
* Puts the issued certificate in `status.certificateChain`
* Puts the `NotBefore` and `NotAfter` fields of the certificate in the
  `status.notBefore` and `status.notAfter` fields &mdash; these fields are
  denormalized into the Kubernetes API in order to aid debugging
* Suggests a time to begin attempting to refresh the certificate using
  `status.beginRefreshAt`.

To deny a request, the signing controller adds a "Denied" condition to
`status.conditions[]`.

To mark a request failed, the signing controller adds a "Failed" condition to
`status.conditions[]`.

All of these conditions are mutually-exclusive, and must have status "True".  No
other condition types are permitted on PodCertificateRequests.  In addition,
once any of these conditions are set, the `status` field becomes immutable.

Like all conditions, the `status.conditions[].reason` field is meant to contain
a machine-readable code describing the condition in TitleCase.  The
`status.conditions[].message` field is meant for a free-form explanation for
human consumption.

To ensure that terminal PodCertificateRequests do not build up in the cluster, a
`kube-controller-manager` controller deletes all PodCertificateRequests older
than 15 minutes.  All certificate issuance flows are expected to complete within
this 15-minute limit.


## ClusterTrustBundles {#cluster-trust-bundles}

{{< feature-state feature_gate_name="ClusterTrustBundle" >}}

{{< note >}}
In Kubernetes {{< skew currentVersion >}}, you must enable the `ClusterTrustBundle`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
_and_ the `certificates.k8s.io/v1beta1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} in order to use
this API.
{{< /note >}}

A ClusterTrustBundle is a cluster-scoped object for distributing X.509 trust
anchors (root certificates) to workloads within the cluster. They're designed
to work well with the [signer](#signers) concept from CertificateSigningRequests.

ClusterTrustBundles can be used in two modes:
[signer-linked](#ctb-signer-linked) and [signer-unlinked](#ctb-signer-unlinked).

### Common properties and validation {#ctb-common}

All ClusterTrustBundle objects have strong validation on the contents of their
`trustBundle` field. That field must contain one or more X.509 certificates,
DER-serialized, each wrapped in a PEM `CERTIFICATE` block. The certificates
must parse as valid X.509 certificates.

Esoteric PEM features like inter-block data and intra-block headers are either
rejected during object validation, or can be ignored by consumers of the object.
Additionally, consumers are allowed to reorder the certificates in
the bundle with their own arbitrary but stable ordering.

ClusterTrustBundle objects should be considered world-readable within the
cluster. If your cluster uses [RBAC](/docs/reference/access-authn-authz/rbac/)
authorization, all ServiceAccounts have a default grant that allows them to
**get**, **list**, and **watch** all ClusterTrustBundle objects.
If you use your own authorization mechanism and you have enabled
ClusterTrustBundles in your cluster, you should set up an equivalent rule to
make these objects public within the cluster, so that they work as intended.

If you do not have permission to list cluster trust bundles by default in your
cluster, you can impersonate a service account you have access to in order to
see available ClusterTrustBundles:

```bash
kubectl get clustertrustbundles --as='system:serviceaccount:mynamespace:default'
```

### Signer-linked ClusterTrustBundles {#ctb-signer-linked}

Signer-linked ClusterTrustBundles are associated with a _signer name_, like this:

```yaml
apiVersion: certificates.k8s.io/v1beta1
kind: ClusterTrustBundle
metadata:
  name: example.com:mysigner:foo
spec:
  signerName: example.com/mysigner
  trustBundle: "<... PEM data ...>"
```

These ClusterTrustBundles are intended to be maintained by a signer-specific
controller in the cluster, so they have several security features:

* To create or update a signer-linked ClusterTrustBundle, you must be permitted
  to **attest** on the signer (custom authorization verb `attest`,
  API group `certificates.k8s.io`; resource path `signers`). You can configure
  authorization for the specific resource name
  `<signerNameDomain>/<signerNamePath>` or match a pattern such as
  `<signerNameDomain>/*`.
* Signer-linked ClusterTrustBundles **must** be named with a prefix derived from
  their `spec.signerName` field. Slashes (`/`) are replaced with colons (`:`),
  and a final colon is appended. This is followed by an arbitrary name. For
  example, the signer `example.com/mysigner` can be linked to a
  ClusterTrustBundle `example.com:mysigner:<arbitrary-name>`.

Signer-linked ClusterTrustBundles will typically be consumed in workloads
by a combination of a
[field selector](/docs/concepts/overview/working-with-objects/field-selectors/) on the signer name, and a separate
[label selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors).

### Signer-unlinked ClusterTrustBundles {#ctb-signer-unlinked}

Signer-unlinked ClusterTrustBundles have an empty `spec.signerName` field, like this:

```yaml
apiVersion: certificates.k8s.io/v1beta1
kind: ClusterTrustBundle
metadata:
  name: foo
spec:
  # no signerName specified, so the field is blank
  trustBundle: "<... PEM data ...>"
```

They are primarily intended for cluster configuration use cases.
Each signer-unlinked ClusterTrustBundle is an independent object, in contrast to the
customary grouping behavior of signer-linked ClusterTrustBundles.

Signer-unlinked ClusterTrustBundles have no `attest` verb requirement.
Instead, you control access to them directly using the usual mechanisms,
such as role-based access control.

To distinguish them from signer-linked ClusterTrustBundles, the names of
signer-unlinked ClusterTrustBundles **must not** contain a colon (`:`).

### Accessing ClusterTrustBundles from pods {#ctb-projection}

{{< feature-state feature_gate_name="ClusterTrustBundleProjection" >}}

The contents of ClusterTrustBundles can be injected into the container filesystem, similar to ConfigMaps and Secrets.
See the [clusterTrustBundle projected volume source](/docs/concepts/storage/projected-volumes#clustertrustbundle) for more details.


## Kubernetes built-in signers {#kubernetes-signers}

Kubernetes provides some built-in signers that should be present in every
cluster.

{{< caution >}}
Signer names with domain prefix `kubernetes.io` (including any subdomains) are
reserved by the Kubernetes project.
{{< /caution >}}

### `kubernetes.io/kube-apiserver-client` {#built-in-signer-kube-apiserver-client}

This signer issues certificates that will be honored as client certificates by
the API server.

This signer responds only to CertificateSigningRequests, not
PodCertificateRequests.

There is no built-in auto-approval controller for this signer; all certificates
must be manually approved, or a third-party auto-approval controller must be
installed.

This signer does not distribute its trust bundle, since no party besides the API
server is intended to verify the certificates it issues.

When this signer's signing controller sees an approved
CertificateSigningRequest, it will check the following conditions:
* The `spec.usages` field includes at least "client auth" and at most "client auth", "digital
  signature", and "key encipherment".

If the conditions are true, the signing controller will issue the certificate.
Otherwise it will mark the CSR as failed.

The issued certificate has the following properties:
* The X.509 Subject field Subject Alternate Names extension are copied verbatim
  from `spec.request`.
* The "Key Usage" and "Extended Key Usage" extensions are set according to the key
  usages named in `spec.usages`.
* No other extensions are included.
* NotBefore is set to the present time, with reasonable backdating to
  account for clock skew.
* NotAfter is set to the present time plus the minimum of `spec.expirationSeconds`
  and the certificate TTL configured for `kube-controller-manager` (365 days, by
  default), with reasonable backdating to account for clock skew.
* The CA bit to false.

{{< caution >}}

Because the API server treats `Subject.CommonName` and `Subject.Organization` as
the username and groups of the user, you must take care  when approving CSRs
addressed to this signer.  If you approve CSRs that request identities that are
internal to the function of your Kubernetes distribution, the user that gets the
certificate can compromise your cluster.

The `CertificateSubjectRestriction` admission plugin (enabled by default)
prevents creation of CSRs that would assert membership in the `system:masters`
group, but this is typically not the only highly-privileged identity present in
a cluster.

{{</ caution >}}

### `kubernetes.io/kube-apiserver-client-kubelet` {#built-in-signer-kube-apiserver-client-kubelet}

This signer issues certificates that will be honored as `kubelet` client
certificates by the API server.  It offers no further guarantees on what the
certificates may be used for.

This signer responds only to CertificateSigningRequests, not
PodCertificateRequests.

There is a built-in auto-approval controller for this signer.

This signer does not distribute its trust bundle, since no party besides the API
server is intended to verify the certificates it issues.

When this signer's signing controller sees an approved
CertificateSigningRequest, it will check the following conditions:
* The `Subject.CommonName` field has the prefix `system:node:`
* There is one `Subject.Organization` entry, exactly equal to `system:nodes`
* There are no entries in the Subject Alternate Name extension
* The CSR `spec.usages` field is either:
  * `digital signature` and `client auth`, or
  * `digital signature`, `client auth`, and `key encipherment`. 

If the conditions are true, the signing controller will issue the certificate.
Otherwise it will mark the CSR as failed.

The issued certificate has the following properties:
* The X.509 Subject field Subject Alternate Names extension are copied verbatim
  from `spec.request`.
* The "Key Usage" and "Extended Key Usage" extensions are set according to the key
  usages named in `spec.usages`.
* No other extensions are included.
* NotBefore is set to the present time, with reasonable backdating to
  account for clock skew.
* NotAfter is set to the present time plus the minimum of `spec.expirationSeconds`
  and the certificate TTL configured for `kube-controller-manager` (365 days, by
  default), with reasonable backdating to account for clock skew.
* The CA bit to false.

### `kubernetes.io/kubelet-serving` {#built-in-signer-kube-apiserver-client-kubelet-serving}

This signer issues certificates that the API server will honor as valid
`kubelet` serving certificates.  It offers no further guarantees on what the
certificates may be used for.

This signer responds only to CertificateSigningRequests, not
PodCertificateRequests.

There is no built-in auto-approval controller for this signer.

This signer does not distribute its trust bundle, since no party besides the API
server is intended to verify the certificates it issues.

When this signer's signing controller sees an approved
CertificateSigningRequest, it will check the following conditions:
* The `Subject.CommonName` field has the prefix `system:node:`
* There is one `Subject.Organization` entry, exactly equal to `system:nodes`
* There is at least one DNS or IP entry in Subject Alternate Name extension.
* There are no Email or URI entries in the Subject Alternate Name extension.
* The CSR `spec.usages` field is either:
  * `digital signature` and `server auth`, or
  * `digital signature`, `server auth`, and `key encipherment`. 

If the conditions are true, the signing controller will issue the certificate.
Otherwise it will mark the CSR as failed.

The issued certificate has the following properties:
* The X.509 Subject field Subject Alternate Names extension are copied verbatim
  from `spec.request`.
* The "Key Usage" and "Extended Key Usage" extensions are set according to the key
  usages named in `spec.usages`.
* No other extensions are included.
* NotBefore is set to the present time, with reasonable backdating to
  account for clock skew.
* NotAfter is set to the present time plus the minimum of `spec.expirationSeconds`
  and the certificate TTL configured for `kube-controller-manager` (365 days, by
  default), with reasonable backdating to account for clock skew.
* The CA bit to false.

### `kubernetes.io/kube-apiserver-serving` {#built-in-signer-kube-apiserver-serving}

{{< feature-state feature_gate_name="ClusterTrustBundle" >}}

This signer does not issue any certificates.  It purely serves to distribute the
trust anchors that allow workloads within the cluster to verify the API server's
server certificate when they connect to `kubernetes.default.svc`.

There are three built-in distribution mechanisms for these trust anchors:
* A built-in controller writes them into the `.data[ca.crt]` field of
  ServiceAccount token secrets.
* A built-in controller creates a ConfigMap named `kube-root-ca.crt` in each
  namespace.  The `.data["ca.crt"]` field of this configmap contains the trust
  anchors of this signer.
* (Only when ClusterTrustBundles are enabled) A built-in controller creates a
  set of signer-linked ClusterTrustBundles for this signer.  Workloads can
  access them directly, or using `clusterTrustBundle` projected volumes sources
  (`signerName="kubernetes.io/kube-apiserver-serving"` and
  `labelSelector.matchLabels={}`).

### `kubernetes.io/legacy-unknown` {#built-in-signer-legacy-unknown}

This signer issues certificates that are not guaranteed to be suitable for any
purpose.  In some third-party distributions of Kubernetes, the API server may
accept certificates it issues as client certificates, but this is not a
standard.

This signer only responds to CertificateSigningRequests, not
PodCertificateRequests.

There is not built-in auto-approval controller for this signer.

The stable CertificateSigningRequest API (version `certificates.k8s.io/v1` and
later) does not allow to set the `signerName` as `kubernetes.io/legacy-unknown`.

This signer does not distribute its trust bundle.

When this signer's signing controller sees an approved
CertificateSigningRequest, it will immediately attempt to issue the certificate
with no further checks.

The issued certificate has the following properties:
* The X.509 Subject field Subject Alternate Names extension are copied verbatim
  from `spec.request`.
* The "Key Usage" and "Extended Key Usage" extensions are set according to the key
  usages named in `spec.usages`.
* No other extensions are included.
* NotBefore is set to the present time, with reasonable backdating to
  account for clock skew.
* NotAfter is set to the present time plus the minimum of `spec.expirationSeconds`
  and the certificate TTL configured for `kube-controller-manager` (365 days, by
  default), with reasonable backdating to account for clock skew.
* The CA bit to false.


## Third-party signers {#third-party-signers}

You can also introduce your own custom signer, which should have a similar
prefixed name but using your own domain name. For example, if you represent an
open source project that uses the domain `open-fictional.example` then you might
use `issuer.open-fictional.example/service-mesh` as a signer name.

To implement your custom signer, you need to provide a set of controllers that
use the Kubernetes API to interact with CertificateSigningRequests,
PodCertificateRequests, and ClusterTrustBundles that are linked to your signer's
name.

See [Develop a Custom Signer](/docs/tasks/tls/extend-kubernetes/custom-signer) for more details.
