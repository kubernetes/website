---
reviewers:
- liggitt
- mikedanese
- munnerz
- enj
title: Certificates and Certificate Signing Requests
api_metadata:
- apiVersion: "certificates.k8s.io/v1"
  kind: "CertificateSigningRequest"
  override_link_text: "CSR v1"
- apiVersion: "certificates.k8s.io/v1alpha1"
  kind: "ClusterTrustBundle"  
content_type: concept
weight: 60
---

<!-- overview -->

Kubernetes certificate and trust bundle APIs enable automation of
[X.509](https://www.itu.int/rec/T-REC-X.509) credential provisioning by providing
a programmatic interface for clients of the Kubernetes API to request and obtain
X.509 {{< glossary_tooltip term_id="certificate" text="certificates" >}} from a Certificate Authority (CA).

There is also experimental (alpha) support for distributing [trust bundles](#cluster-trust-bundles).

<!-- body -->

## Certificate signing requests

{{< feature-state for_k8s_version="v1.19" state="stable" >}}


A [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)
(CSR) resource is used to request that a certificate be signed
by a denoted signer, after which the request may be approved or denied before
finally being signed.


### Request signing process

The CertificateSigningRequest resource type allows a client to ask for an X.509 certificate
be issued, based on a signing request.
The CertificateSigningRequest object includes a PEM-encoded PKCS#10 signing request in
the `spec.request` field. The CertificateSigningRequest denotes the signer (the
recipient that the request is being made to) using the `spec.signerName` field.
Note that `spec.signerName` is a required key after API version `certificates.k8s.io/v1`.
In Kubernetes v1.22 and later, clients may optionally set the `spec.expirationSeconds`
field to request a particular lifetime for the issued certificate. The minimum valid
value for this field is `600`, i.e. ten minutes.

Once created, a CertificateSigningRequest must be approved before it can be signed.
Depending on the signer selected, a CertificateSigningRequest may be automatically approved
by a {{< glossary_tooltip text="controller" term_id="controller" >}}.
Otherwise, a CertificateSigningRequest must be manually approved either via the REST API (or client-go)
or by running `kubectl certificate approve`. Likewise, a CertificateSigningRequest may also be denied,
which tells the configured signer that it must not sign the request.

For certificates that have been approved, the next step is signing. The relevant signing controller
first validates that the signing conditions are met and then creates a certificate.
The signing controller then updates the CertificateSigningRequest, storing the new certificate into
the `status.certificate` field of the existing CertificateSigningRequest object. The
`status.certificate` field is either empty or contains a X.509 certificate, encoded in PEM format.
The CertificateSigningRequest `status.certificate` field is empty until the signer does this.

Once the `status.certificate` field has been populated, the request has been completed and clients can now
fetch the signed certificate PEM data from the CertificateSigningRequest resource.
The signers can instead deny certificate signing if the approval conditions are not met.

In order to reduce the number of old CertificateSigningRequest resources left in a cluster, a garbage collection
controller runs periodically. The garbage collection removes CertificateSigningRequests that have not changed
state for some duration:

* Approved requests: automatically deleted after 1 hour
* Denied requests: automatically deleted after 1 hour
* Failed requests: automatically deleted after 1 hour
* Pending requests: automatically deleted after 24 hours
* All requests: automatically deleted after the issued certificate has expired

### Certificate signing authorization {#authorization}

To allow creating a CertificateSigningRequest and retrieving any CertificateSigningRequest:

* Verbs: `create`, `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`

For example:

{{% code_sample file="access/certificate-signing-request/clusterrole-create.yaml" %}}

To allow approving a CertificateSigningRequest:

* Verbs: `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`
* Verbs: `update`, group: `certificates.k8s.io`, resource: `certificatesigningrequests/approval`
* Verbs: `approve`, group: `certificates.k8s.io`, resource: `signers`, resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`

For example:

{{% code_sample file="access/certificate-signing-request/clusterrole-approve.yaml" %}}

To allow signing a CertificateSigningRequest:

* Verbs: `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`
* Verbs: `update`, group: `certificates.k8s.io`, resource: `certificatesigningrequests/status`
* Verbs: `sign`, group: `certificates.k8s.io`, resource: `signers`, resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`

{{% code_sample file="access/certificate-signing-request/clusterrole-sign.yaml" %}}


## Signers

Signers abstractly represent the entity or entities that might sign, or have
signed, a security certificate.

Any signer that is made available for outside a particular cluster should provide information
about how the signer works, so that consumers can understand what that means for CertifcateSigningRequests
and (if enabled) [ClusterTrustBundles](#cluster-trust-bundles).
This includes:

1. **Trust distribution**: how trust anchors (CA certificates or certificate bundles) are distributed.
1. **Permitted subjects**: any restrictions on and behavior when a disallowed subject is requested.
1. **Permitted x509 extensions**: including IP subjectAltNames, DNS subjectAltNames,
   Email subjectAltNames, URI subjectAltNames etc, and behavior when a disallowed extension is requested.
1. **Permitted key usages / extended key usages**: any restrictions on and behavior
   when usages different than the signer-determined usages are specified in the CSR.
1. **Expiration/certificate lifetime**: whether it is fixed by the signer, configurable by the admin, determined by the CSR `spec.expirationSeconds` field, etc
   and the behavior when the signer-determined expiration is different from the CSR `spec.expirationSeconds` field.
1. **CA bit allowed/disallowed**: and behavior if a CSR contains a request a for a CA certificate when the signer does not permit it.

Commonly, the `status.certificate` field of a CertificateSigningRequest contains a
single PEM-encoded X.509 certificate once the CSR is approved and the certificate is issued.
Some signers store multiple certificates into the `status.certificate` field. In
that case, the documentation for the signer should specify the meaning of
additional certificates; for example, this might be the certificate plus
intermediates to be presented during TLS handshakes.

If you want to make the _trust anchor_ (root certificate) available, this should be done
separately from a CertificateSigningRequest and its `status.certificate` field. For example,
you could use a ClusterTrustBundle.

The PKCS#10 signing request format does not have a standard mechanism to specify a
certificate expiration or lifetime. The expiration or lifetime therefore has to be set
through the `spec.expirationSeconds` field of the CSR object. The built-in signers
use the `ClusterSigningDuration` configuration option, which defaults to 1 year,
(the `--cluster-signing-duration` command-line flag of the kube-controller-manager)
as the default when no `spec.expirationSeconds` is specified. When `spec.expirationSeconds`
is specified, the minimum of `spec.expirationSeconds` and `ClusterSigningDuration` is
used.

{{< note >}}
The `spec.expirationSeconds` field was added in Kubernetes v1.22. Earlier versions of Kubernetes do not honor this field.
Kubernetes API servers prior to v1.22 will silently drop this field when the object is created.
{{< /note >}}

### Kubernetes signers

Kubernetes provides built-in signers that each have a well-known `signerName`:

1. `kubernetes.io/kube-apiserver-client`: signs certificates that will be honored as client certificates by the API server.
   Never auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
   1. Trust distribution: signed certificates must be honored as client certificates by the API server. The CA bundle is not distributed by any other means.
   1. Permitted subjects - no subject restrictions, but approvers and signers may choose not to approve or sign.
      Certain subjects like cluster-admin level users or groups vary between distributions and installations,
      but deserve additional scrutiny before approval and signing.
      The `CertificateSubjectRestriction` admission plugin is enabled by default to restrict `system:masters`,
      but it is often not the only cluster-admin subject in a cluster.
   1. Permitted x509 extensions - honors subjectAltName and key usage extensions and discards other extensions.
   1. Permitted key usages - must include `["client auth"]`. Must not include key usages beyond `["digital signature", "key encipherment", "client auth"]`.
   1. Expiration/certificate lifetime - for the kube-controller-manager implementation of this signer, set to the minimum
      of the `--cluster-signing-duration` option or, if specified, the `spec.expirationSeconds` field of the CSR object.
   1. CA bit allowed/disallowed - not allowed.

1. `kubernetes.io/kube-apiserver-client-kubelet`: signs client certificates that will be honored as client certificates by the
   API server.
   May be auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
   1. Trust distribution: signed certificates must be honored as client certificates by the API server. The CA bundle
      is not distributed by any other means.
   1. Permitted subjects - organizations are exactly `["system:nodes"]`, common name is "`system:node:${NODE_NAME}`".
   1. Permitted x509 extensions - honors key usage extensions, forbids subjectAltName extensions and drops other extensions.
   1. Permitted key usages - `["key encipherment", "digital signature", "client auth"]` or `["digital signature", "client auth"]`.
   1. Expiration/certificate lifetime - for the kube-controller-manager implementation of this signer, set to the minimum
      of the `--cluster-signing-duration` option or, if specified, the `spec.expirationSeconds` field of the CSR object.
   1. CA bit allowed/disallowed - not allowed.

1. `kubernetes.io/kubelet-serving`: signs serving certificates that are honored as a valid kubelet serving certificate
   by the API server, but has no other guarantees.
   Never auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
   1. Trust distribution: signed certificates must be honored by the API server as valid to terminate connections to a kubelet.
      The CA bundle is not distributed by any other means.
   1. Permitted subjects - organizations are exactly `["system:nodes"]`, common name is "`system:node:${NODE_NAME}`".
   1. Permitted x509 extensions - honors key usage and DNSName/IPAddress subjectAltName extensions, forbids EmailAddress and
      URI subjectAltName extensions, drops other extensions. At least one DNS or IP subjectAltName must be present.
   1. Permitted key usages - `["key encipherment", "digital signature", "server auth"]` or `["digital signature", "server auth"]`.
   1. Expiration/certificate lifetime - for the kube-controller-manager implementation of this signer, set to the minimum
      of the `--cluster-signing-duration` option or, if specified, the `spec.expirationSeconds` field of the CSR object.
   1. CA bit allowed/disallowed - not allowed.

1. `kubernetes.io/legacy-unknown`: has no guarantees for trust at all. Some third-party distributions of Kubernetes
   may honor client certificates signed by it. The stable CertificateSigningRequest API (version `certificates.k8s.io/v1` and later)
   does not allow to set the `signerName` as `kubernetes.io/legacy-unknown`.
   Never auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
   1. Trust distribution: None. There is no standard trust or distribution for this signer in a Kubernetes cluster.
   1. Permitted subjects - any
   1. Permitted x509 extensions - honors subjectAltName and key usage extensions and discards other extensions.
   1. Permitted key usages - any
   1. Expiration/certificate lifetime - for the kube-controller-manager implementation of this signer, set to the minimum
      of the `--cluster-signing-duration` option or, if specified, the `spec.expirationSeconds` field of the CSR object.
   1. CA bit allowed/disallowed - not allowed.

The kube-controller-manager implements [control plane signing](#signer-control-plane) for each of the built in
signers. Failures for all of these are only reported in kube-controller-manager logs.

{{< note >}}
The `spec.expirationSeconds` field was added in Kubernetes v1.22. Earlier versions of Kubernetes do not honor this field.
Kubernetes API servers prior to v1.22 will silently drop this field when the object is created.
{{< /note >}}

Distribution of trust happens out of band for these signers. Any trust outside of those described above are strictly
coincidental. For instance, some distributions may honor `kubernetes.io/legacy-unknown` as client certificates for the
kube-apiserver, but this is not a standard.
None of these usages are related to ServiceAccount token secrets `.data[ca.crt]` in any way. That CA bundle is only
guaranteed to verify a connection to the API server using the default service (`kubernetes.default.svc`).

### Custom signers

You can also introduce your own custom signer, which should have a similar prefixed name but using your
own domain name. For example, if you represent an open source project that uses the domain `open-fictional.example`
then you might use `issuer.open-fictional.example/service-mesh` as a signer name.

A custom signer uses the Kubernetes API to issue a certificate. See [API-based signers](#signer-api).

## Signing

### Control plane signer {#signer-control-plane}

The Kubernetes control plane implements each of the
[Kubernetes signers](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers),
as part of the kube-controller-manager.

{{< note >}}
Prior to Kubernetes v1.18, the kube-controller-manager would sign any CSRs that
were marked as approved.
{{< /note >}}

{{< note >}}
The `spec.expirationSeconds` field was added in Kubernetes v1.22.
Earlier versions of Kubernetes do not honor this field.
Kubernetes API servers prior to v1.22 will silently drop this field when the object is created.
{{< /note >}}

### API-based signers {#signer-api}

Users of the REST API can sign CSRs by submitting an UPDATE request to the `status`
subresource of the CSR to be signed.

As part of this request, the `status.certificate` field should be set to contain the
signed certificate. This field contains one or more PEM-encoded certificates.

All PEM blocks must have the "CERTIFICATE" label, contain no headers,
and the encoded data must be a BER-encoded ASN.1 Certificate structure
as described in [section 4 of RFC5280](https://tools.ietf.org/html/rfc5280#section-4.1).

Example certificate content:

```
-----BEGIN CERTIFICATE-----
MIIDgjCCAmqgAwIBAgIUC1N1EJ4Qnsd322BhDPRwmg3b/oAwDQYJKoZIhvcNAQEL
BQAwXDELMAkGA1UEBhMCeHgxCjAIBgNVBAgMAXgxCjAIBgNVBAcMAXgxCjAIBgNV
BAoMAXgxCjAIBgNVBAsMAXgxCzAJBgNVBAMMAmNhMRAwDgYJKoZIhvcNAQkBFgF4
MB4XDTIwMDcwNjIyMDcwMFoXDTI1MDcwNTIyMDcwMFowNzEVMBMGA1UEChMMc3lz
dGVtOm5vZGVzMR4wHAYDVQQDExVzeXN0ZW06bm9kZToxMjcuMC4wLjEwggEiMA0G
CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDne5X2eQ1JcLZkKvhzCR4Hxl9+ZmU3
+e1zfOywLdoQxrPi+o4hVsUH3q0y52BMa7u1yehHDRSaq9u62cmi5ekgXhXHzGmm
kmW5n0itRECv3SFsSm2DSghRKf0mm6iTYHWDHzUXKdm9lPPWoSOxoR5oqOsm3JEh
Q7Et13wrvTJqBMJo1GTwQuF+HYOku0NF/DLqbZIcpI08yQKyrBgYz2uO51/oNp8a
sTCsV4OUfyHhx2BBLUo4g4SptHFySTBwlpRWBnSjZPOhmN74JcpTLB4J5f4iEeA7
2QytZfADckG4wVkhH3C2EJUmRtFIBVirwDn39GXkSGlnvnMgF3uLZ6zNAgMBAAGj
YTBfMA4GA1UdDwEB/wQEAwIFoDATBgNVHSUEDDAKBggrBgEFBQcDAjAMBgNVHRMB
Af8EAjAAMB0GA1UdDgQWBBTREl2hW54lkQBDeVCcd2f2VSlB1DALBgNVHREEBDAC
ggAwDQYJKoZIhvcNAQELBQADggEBABpZjuIKTq8pCaX8dMEGPWtAykgLsTcD2jYr
L0/TCrqmuaaliUa42jQTt2OVsVP/L8ofFunj/KjpQU0bvKJPLMRKtmxbhXuQCQi1
qCRkp8o93mHvEz3mTUN+D1cfQ2fpsBENLnpS0F4G/JyY2Vrh19/X8+mImMEK5eOy
o0BMby7byUj98WmcUvNCiXbC6F45QTmkwEhMqWns0JZQY+/XeDhEcg+lJvz9Eyo2
aGgPsye1o3DpyXnyfJWAWMhOz7cikS5X2adesbgI86PhEHBXPIJ1v13ZdfCExmdd
M1fLPhLyR54fGaY+7/X8P9AZzPefAkwizeXwe9ii6/a08vWoiE4=
-----END CERTIFICATE-----
```

Non-PEM content may appear before or after the CERTIFICATE PEM blocks and is unvalidated,
to allow for explanatory text as described in [section 5.2 of RFC7468](https://www.rfc-editor.org/rfc/rfc7468#section-5.2).

When encoded in JSON or YAML, this field is base-64 encoded.
A CertificateSigningRequest containing the example certificate above would look like this:

```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
...
status:
  certificate: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JS..."
```

## Approval or rejection  {#approval-rejection}

Before a [signer](#signers) issues a certificate based on a CertificateSigningRequest,
the signer typically checks that the issuance for that CSR has been _approved_.

### Control plane automated approval {#approval-rejection-control-plane}

The kube-controller-manager ships with a built-in approver for certificates with
a signerName of `kubernetes.io/kube-apiserver-client-kubelet` that delegates various
permissions on CSRs for node credentials to authorization.
The kube-controller-manager POSTs SubjectAccessReview resources to the API server
in order to check authorization for certificate approval.

### Approval or rejection using `kubectl` {#approval-rejection-kubectl}

A Kubernetes administrator (with appropriate permissions) can manually approve
(or deny) CertificateSigningRequests by using the `kubectl certificate
approve` and `kubectl certificate deny` commands.

To approve a CSR with kubectl:

```shell
kubectl certificate approve <certificate-signing-request-name>
```

Likewise, to deny a CSR:

```shell
kubectl certificate deny <certificate-signing-request-name>
```

### Approval or rejection using the Kubernetes API {#approval-rejection-api-client}

Users of the REST API can approve CSRs by submitting an UPDATE request to the `approval`
subresource of the CSR to be approved. For example, you could write an
{{< glossary_tooltip term_id="operator-pattern" text="operator" >}} that watches for a particular
kind of CSR and then sends an UPDATE to approve them.

When you make an approval or rejection request, set either the `Approved` or `Denied`
status condition based on the state you determine:

For `Approved` CSRs:

```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
...
status:
  conditions:
  - lastUpdateTime: "2020-02-08T11:37:35Z"
    lastTransitionTime: "2020-02-08T11:37:35Z"
    message: Approved by my custom approver controller
    reason: ApprovedByMyPolicy # You can set this to any string
    type: Approved
```

For `Denied` CSRs:

```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
...
status:
  conditions:
  - lastUpdateTime: "2020-02-08T11:37:35Z"
    lastTransitionTime: "2020-02-08T11:37:35Z"
    message: Denied by my custom approver controller
    reason: DeniedByMyPolicy # You can set this to any string
    type: Denied
```

It's usual to set `status.conditions.reason` to a machine-friendly reason
code using TitleCase; this is a convention but you can set it to anything
you like. If you want to add a note for human consumption, use the
`status.conditions.message` field.


## Cluster trust bundles {#cluster-trust-bundles}

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

{{< note >}}
In Kubernetes {{< skew currentVersion >}}, you must enable the `ClusterTrustBundle`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
_and_ the `certificates.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} in order to use
this API.
{{< /note >}}

A ClusterTrustBundles is a cluster-scoped object for distributing X.509 trust
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
apiVersion: certificates.k8s.io/v1alpha1
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
apiVersion: certificates.k8s.io/v1alpha1
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

{{<feature-state for_k8s_version="v1.29" state="alpha" >}}

The contents of ClusterTrustBundles can be injected into the container filesystem, similar to ConfigMaps and Secrets.
See the [clusterTrustBundle projected volume source](/docs/concepts/storage/projected-volumes#clustertrustbundle) for more details.

<!-- TODO this should become a task page -->
## How to issue a certificate for a user {#normal-user}

A few steps are required in order to get a normal user to be able to
authenticate and invoke an API. First, this user must have a certificate issued
by the Kubernetes cluster, and then present that certificate to the Kubernetes API.

### Create private key

The following scripts show how to generate PKI private key and CSR. It is
important to set CN and O attribute of the CSR. CN is the name of the user and
O is the group that this user will belong to. You can refer to
[RBAC](/docs/reference/access-authn-authz/rbac/) for standard groups.

```shell
openssl genrsa -out myuser.key 2048
openssl req -new -key myuser.key -out myuser.csr -subj "/CN=myuser"
```

### Create a CertificateSigningRequest {#create-certificatessigningrequest}

Create a [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)
and submit it to a Kubernetes Cluster via kubectl. Below is a script to generate the
CertificateSigningRequest.

```shell
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: myuser
spec:
  request: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQ1ZqQ0NBVDRDQVFBd0VURVBNQTBHQTFVRUF3d0dZVzVuWld4aE1JSUJJakFOQmdrcWhraUc5dzBCQVFFRgpBQU9DQVE4QU1JSUJDZ0tDQVFFQTByczhJTHRHdTYxakx2dHhWTTJSVlRWMDNHWlJTWWw0dWluVWo4RElaWjBOCnR2MUZtRVFSd3VoaUZsOFEzcWl0Qm0wMUFSMkNJVXBGd2ZzSjZ4MXF3ckJzVkhZbGlBNVhwRVpZM3ExcGswSDQKM3Z3aGJlK1o2MVNrVHF5SVBYUUwrTWM5T1Nsbm0xb0R2N0NtSkZNMUlMRVI3QTVGZnZKOEdFRjJ6dHBoaUlFMwpub1dtdHNZb3JuT2wzc2lHQ2ZGZzR4Zmd4eW8ybmlneFNVekl1bXNnVm9PM2ttT0x1RVF6cXpkakJ3TFJXbWlECklmMXBMWnoyalVnald4UkhCM1gyWnVVV1d1T09PZnpXM01LaE8ybHEvZi9DdS8wYk83c0x0MCt3U2ZMSU91TFcKcW90blZtRmxMMytqTy82WDNDKzBERHk5aUtwbXJjVDBnWGZLemE1dHJRSURBUUFCb0FBd0RRWUpLb1pJaHZjTgpBUUVMQlFBRGdnRUJBR05WdmVIOGR4ZzNvK21VeVRkbmFjVmQ1N24zSkExdnZEU1JWREkyQTZ1eXN3ZFp1L1BVCkkwZXpZWFV0RVNnSk1IRmQycVVNMjNuNVJsSXJ3R0xuUXFISUh5VStWWHhsdnZsRnpNOVpEWllSTmU3QlJvYXgKQVlEdUI5STZXT3FYbkFvczFqRmxNUG5NbFpqdU5kSGxpT1BjTU1oNndLaTZzZFhpVStHYTJ2RUVLY01jSVUyRgpvU2djUWdMYTk0aEpacGk3ZnNMdm1OQUxoT045UHdNMGM1dVJVejV4T0dGMUtCbWRSeEgvbUNOS2JKYjFRQm1HCkkwYitEUEdaTktXTU0xMzhIQXdoV0tkNjVoVHdYOWl4V3ZHMkh4TG1WQzg0L1BHT0tWQW9FNkpsYWFHdTlQVmkKdjlOSjVaZlZrcXdCd0hKbzZXdk9xVlA3SVFjZmg3d0drWm89Ci0tLS0tRU5EIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLQo=
  signerName: kubernetes.io/kube-apiserver-client
  expirationSeconds: 86400  # one day
  usages:
  - client auth
EOF
```

Some points to note:

- `usages` has to be '`client auth`'
- `expirationSeconds` could be made longer (i.e. `864000` for ten days) or shorter (i.e. `3600` for one hour)
- `request` is the base64 encoded value of the CSR file content.
  You can get the content using this command: 

  ```shell
  cat myuser.csr | base64 | tr -d "\n"
  ```


### Approve the CertificateSigningRequest {#approve-certificate-signing-request}

Use kubectl to create a CSR and approve it.

Get the list of CSRs:

```shell
kubectl get csr
```

Approve the CSR:

```shell
kubectl certificate approve myuser
```

### Get the certificate

Retrieve the certificate from the CSR:

```shell
kubectl get csr/myuser -o yaml
```

The certificate value is in Base64-encoded format under `status.certificate`.

Export the issued certificate from the CertificateSigningRequest.

```shell
kubectl get csr myuser -o jsonpath='{.status.certificate}'| base64 -d > myuser.crt
```

### Create Role and RoleBinding

With the certificate created it is time to define the Role and RoleBinding for
this user to access Kubernetes cluster resources.

This is a sample command to create a Role for this new user:

```shell
kubectl create role developer --verb=create --verb=get --verb=list --verb=update --verb=delete --resource=pods
```

This is a sample command to create a RoleBinding for this new user:

```shell
kubectl create rolebinding developer-binding-myuser --role=developer --user=myuser
```

### Add to kubeconfig

The last step is to add this user into the kubeconfig file.

First, you need to add new credentials:

```shell
kubectl config set-credentials myuser --client-key=myuser.key --client-certificate=myuser.crt --embed-certs=true

```

Then, you need to add the context:

```shell
kubectl config set-context myuser --cluster=kubernetes --user=myuser
```

To test it, change the context to `myuser`:

```shell
kubectl config use-context myuser
```

## {{% heading "whatsnext" %}}

* Read [Manage TLS Certificates in a Cluster](/docs/tasks/tls/managing-tls-in-a-cluster/)
* View the source code for the kube-controller-manager built in
  [signer](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/signer/cfssl_signer.go)
* View the source code for the kube-controller-manager built in
  [approver](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/approver/sarapprove.go)
* For details of X.509 itself, refer to [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1) section 3.1
* For information on the syntax of PKCS#10 certificate signing requests, refer to [RFC 2986](https://tools.ietf.org/html/rfc2986)
* Read about the ClusterTrustBundle API:
  * {{< page-api-reference kind="ClusterTrustBundle" >}}
