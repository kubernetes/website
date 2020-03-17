---
reviewers:
- liggitt
- mikedanese
- munnerz
title: Certificate Signing Requests
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

The Certificates API enables automation of
[X.509](https://www.itu.int/rec/T-REC-X.509) credential provisioning by providing
a programmatic interface for clients of the Kubernetes API to request and obtain
X.509 {{< glossary_tooltip term_id="certificate" text="certificates" >}} from a Certificate Authority (CA).
A CertificateSigningRequest (CSR) resource is used to request that a certificate be signed
by a denoted signer, after which the request may be approved or denied before
finally being signed.

{{% /capture %}}

{{% capture body %}}
## Request signing process

The _CertificateSigningRequest_ resource type allows a client to submit an x509 CSR (`spec.request`)
and request it be signed by a specific _signer_, denoted by the `spec.signerName` field.

Once created, a CertificateSigningRequest must be approved before it can be signed.
Depending on the signer requested, a CertificateSigningRequest may be auto-approved by a
{{< glossary_tooltip text="controller" term_id="controller" >}}.
Otherwise, a CertificateSigningRequest must be manually approved either via the REST API (or client-go)
or via `kubectl certificate approve`. Likewise, a CertificateSigningRequest may also be denied,
which tells the configured signer that it must not sign the request.

Once approved, a signing controller must attempt to sign the request. A signer should apply its own policy
restrictions, similar to the approval process, on the request to ensure it never signs an invalid request.
Once the signer has determined that a request should be signed, it must sign the request and store the
resulting certificate (and if appropriate, certificate chain) in the `status.certificate` field as PEM-encoded
certificates.

Once the `status.certificate` field has been populated, the request has been completed and clients can now
fetch the signed certificate PEM data from the CertificateSigningRequest resource.
Signers can instead deny certificate signing if the approval conditions are not met.

In order to reduce the number of old CertificateSigningRequest resources left in a cluster, a garbage collection
controller runs periodically. The garbage collection removes CertificateSigningRequests that have not changed
state for some duration:

* Approved requests: automatically deleted after 1 hour
* Denied requests: automatically deleted after 1 hour
* Pending requests: automatically deleted after 1 hour

## Signers

### Signers should define...

All signers should provide information about how they work so that clients can predict what will happen to their CSRs.
This includes:

1. **Trust distribution**: how trust (CA bundles) are distributed.
1. **Permitted subjects**: any restrictions on and behavior when a disallowed subject is requested.
1. **Permitted x509 extensions**: including IP subjectAltNames, DNS subjectAltNames, Email subjectAltNames, URI subjectAltNames etc, and behavior when a disallowed extension is requested.
1. **Permitted key usages / extended key usages**: any restrictions on and behavior when usages different than the signer-determined usages are specified in the CSR.
1. **Expiration/certificate lifetime**: whether it is fixed by the signer, configurable by the admin, determined by the CSR object etc and behavior if an expiration different than the signer-determined expiration is specified in the CSR.
1. **CA bit allowed/disallowed**: and behavior if a CSR contains a request a for a CA cert when the signer does not permit it.
1. **optional**: Information about the meaning of additional `CERTIFICATE` PEM blocks in `status.certificate`, if different from the standard behavior of treating the additional certificates as intermediates, and presenting them in TLS handshakes.

### Kubernetes signers

Kubernetes provides built-in signers that each have a well-known `signerName`:

1. `kubernetes.io/kube-apiserver-client`: signs certificates that will be honored as client-certs by the kube-apiserver.
  Never auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
    1. Trust distribution: signed certificates must be honored as client-certificates by the kube-apiserver. The CA bundle is not distributed by any other means.
    1. Permitted subjects - no subject restrictions, but approvers and signers may choose not to approve or sign. Certain subjects like cluster-admin level users or groups vary between distributions and installations, but deserve additional scrutiny before approval and signing. The `CertificateSubjectRestriction` admission plugin is available and enabled by default to restrict `system:masters`, but it is often not the only cluster-admin subject in a cluster.
    1. Permitted x509 extensions - honors subjectAltName and key usage extensions and discards other extensions.
    1. Permitted key usages - must include []string{"client auth"}. Must not include key usages beyond []string{"digital signature", "key encipherment", "client auth"}
    1. Expiration/cert lifetime - minimum of CSR signer or request. Sanity of the time is the concern of the signer.
    1. CA bit allowed/disallowed - not allowed.

1. `kubernetes.io/kube-apiserver-client-kubelet`: signs client certificates that will be honored as client-certs by the
  kube-apiserver.
  May be auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
    1. Trust distribution: signed certificates must be honored as client-certificates by the kube-apiserver.  The CA bundle
       is not distributed by any other means.
    1. Permitted subjects - organizations are exactly `[]string{"system:nodes"}`, common name starts with `"system:node:"`
    1. Permitted x509 extensions - honors key usage extensions, forbids subjectAltName extensions, drops other extensions.
    1. Permitted key usages - exactly `[]string{"key encipherment", "digital signature", "client auth"}`
    1. Expiration/cert lifetime - minimum of CSR signer or request.  Sanity of the time is the concern of the signer.
    1. CA bit allowed/disallowed - not allowed.

1. `kubernetes.io/kubelet-serving`: signs serving certificates that are honored as a valid kubelet serving certificate
  by the kube-apiserver, but has no other guarantees.
  Never auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
    1. Trust distribution: signed certificates must be honored by the kube-apiserver as valid to terminate connections to a kubelet.
       The CA bundle is not distributed by any other means.
    1. Permitted subjects - organizations are exactly `[]string{"system:nodes"}`, common name starts with `"system:node:"`
    1. Permitted x509 extensions - honors key usage and DNSName/IPAddress subjectAltName extensions, forbids EmailAddress and URI subjectAltName extensions, drops other extensions. At least one DNS or IP subjectAltName must be present.
    1. Permitted key usages - exactly `[]string{"key encipherment", "digital signature", "server auth"}`
    1. Expiration/cert lifetime - minimum of CSR signer or request.
    1. CA bit allowed/disallowed - not allowed.

1. `kubernetes.io/legacy-unknown`:  has no guarantees for trust at all. Some distributions may honor these as client
  certs, but that behavior is not standard kubernetes behavior.
  Never auto-approved by {{< glossary_tooltip term_id="kube-controller-manager" >}}.
    1. Trust distribution: None.  There is no standard trust or distribution for this signer in a kubernetes cluster.
    1. Permitted subjects - any
    1. Permitted x509 extensions - honors subjectAltName and key usage extensions and discards other extensions.
    1. Permitted key usages - any
    1. Expiration/cert lifetime - minimum of CSR signer or request.  Sanity of the time is the concern of the signer.
    1. CA bit allowed/disallowed - not allowed.

{{< note >}}
Failures for all of these are only reported in kube-controller-manager logs.
{{< /note >}}

Distribution of trust happens out of band for these signers.  Any trust outside of those described above are strictly
coincidental. For instance, some distributions may honor `kubernetes.io/legacy-unknown` as client certificates for the
kube-apiserver, but this is not a standard.
None of these usages are related to ServiceAccount token secrets `.data[ca.crt]` in any way.  That CA bundle is only
guaranteed to verify a connection to the kube-apiserver using the default service (`kubernetes.default.svc`).

## Authorization

To allow creating a CertificateSigningRequest and retrieving any CertificateSigningRequest:

* Verbs: `create`, `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`

For example:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: csr-creator
rules:
- apiGroups:
  - certificates.k8s.io
  resources:
  - certificatesigningrequests
  verbs:
  - create
  - get
  - list
  - watch
```

To allow approving a CertificateSigningRequest:

* Verbs: `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`
* Verbs: `update`, group: `certificates.k8s.io`, resource: `certificatesigningrequests/approval`
* Verbs: `approve`, group: `certificates.k8s.io`, resource: `signers`, resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`

For example:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: csr-approver
rules:
- apiGroups:
  - certificates.k8s.io
  resources:
  - certificatesigningrequests
  verbs:
  - get
  - list
  - watch
- apiGroups:
  - certificates.k8s.io
  resources:
  - certificatesigningrequests/approval
  verbs:
  - update
- apiGroups:
  - certificates.k8s.io
  resources:
  - signers
  resourceName:
  - example.com/my-signer-name # example.com/* can be used to authorize for all signers in the 'example.com' domain
  verbs:
  - approve
```

To allow signing a CertificateSigningRequest:

* Verbs: `get`, `list`, `watch`, group: `certificates.k8s.io`, resource: `certificatesigningrequests`
* Verbs: `update`, group: `certificates.k8s.io`, resource: `certificatesigningrequests/status`
* Verbs: `sign`, group: `certificates.k8s.io`, resource: `signers`, resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: csr-signer
rules:
- apiGroups:
  - certificates.k8s.io
  resources:
  - certificatesigningrequests
  verbs:
  - get
  - list
  - watch
- apiGroups:
  - certificates.k8s.io
  resources:
  - certificatesigningrequests/status
  verbs:
  - update
- apiGroups:
  - certificates.k8s.io
  resources:
  - signers
  resourceName:
  - example.com/my-signer-name # example.com/* can be used to authorize for all signers in the 'example.com' domain
  verbs:
  - sign
```

## Approval & rejection

### kube-controller-manager auto-approval

The kube-controller-manager ships with a built-in approver for certificates with
a signerName of `kubernetes.io/kube-apiserver-client-kubelet` that delegates various
permissions on CSRs for node credentials to authorization.
It does this by posting SubjectAccessReview resources to the API server.

### kubectl-based approver

A Kubernetes administrator (with appropriate permissions) can manually approve
(or deny) CertificateSigningRequests by using the `kubectl certificate
approve` and `kubectl certificate deny` commands.

To approve a CSR with kubectl:

```bash
kubectl certificate approve <certificate-signing-request-name>
```

Likewise, to deny a CSR:

```bash
kubectl certificate deny <certificate-signing-request-name>
```

### API-based approver

Users of the REST API can approve CSRs by submitting an UPDATE request to the `approval`
subresource of the CSR to be approved. For example, you could write an
{{< glossary_tooltip term_id="operator-pattern" text="operator" >}} that watches for a particular
kind of CSR and then sends an UPDATE to approve them.

As part of this request, the `Approved` or `Denied` status condition should be set to the
desired state:

For `Approved` CSRs:

```yaml
apiVersion: certificates.k8s.io/v1beta1
kind: CertificateSigningRequest
...
status:
  conditions:
  - lastUpdateTime: "2020-02-08T11:37:35Z"
    message: Approved by my custom approver controller
    reason: ApprovedByMyPolicy # this can be set to anything
    type: Approved
```

For `Denied` CSRs:

```yaml
apiVersion: certificates.k8s.io/v1beta1
kind: CertificateSigningRequest
...
status:
  conditions:
  - lastUpdateTime: "2020-02-08T11:37:35Z"
    message: Denied by my custom approver controller
    reason: DeniedByMyPolicy # this can be set to anything
    type: Denied
```

## Signing

### Control plane signer

The Kubernetes control plane implements each of the [Kubernetes signers](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers),
as part of the kube-controller-manager.

{{< note >}}
Prior to Kubernetes v1.18, the kube-controller-manager would sign any CSRs that
were marked as approved.
{{< /note >}}

### API-based signers

Users of the REST API can sign CSRs by submitting an UPDATE request to the `status`
subresource of the CSR to be signed.

As part of this request, the `status.certificate` field should be set to contain the
signed certificate.

{{% /capture %}}

{{% capture whatsnext %}}

* kube-controller-manager built in [signer](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/signer/cfssl_signer.go)
* kube-controller-manager built in [approver](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/approver/sarapprove.go)
* [Manage TLS Certificates in a Cluster](https://kubernetes.io/docs/tasks/tls/managing-tls-in-a-cluster/)

{{% /capture %}}
