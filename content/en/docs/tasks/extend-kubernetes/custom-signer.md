---
title: Develop a Custom Signer
content_type: task
weight: 40
---

## Third-party signers {#third-party-signers}

You can also introduce your own custom signer, which should have a similar
prefixed name but using your own domain name. For example, if you represent an
open source project that uses the domain `open-fictional.example` then you might
use `issuer.open-fictional.example/service-mesh` as a signer name.

To implement your custom signer, you need to provide a set of controllers that
use the Kubernetes API to interact with CertificateSigningRequests,
PodCertificateRequests, and ClusterTrustBundles that are linked to your signer's
name.

### Useful ClusterRoles {#authorization}

#### CertificateSigningRequests {#useful-cluster-roles-csr}

CertificateSigningRequests have three roles &mdash; requesters, approvers, and
signers.  Depending on the signer's logic around approvals, the approver and
signer role may be shared by the same controller.

Requesters need to be able to create and read CertificateSigningRequests.
Allowing broad read access to CSRs is not a security issue, because the CSRs
only contain public (not private) keys.
* Verbs: **create**, **get**, **list**, **watch**, group: `certificates.k8s.io`,
  resource: `certificatesigningrequests`

If your cluster uses RBAC, here's an example ClusterRole for a CSR requester:

{{% code_sample file="access/certificate-signing-request/clusterrole-create.yaml" %}}

Approvers need to be able to watch CSRs, and approve or deny CSRs addressed to
their signer name:

* Verbs: **get**, **list**, **watch**, group: `certificates.k8s.io`, resource: `certificatesigningrequests`
* Verbs: **update**, group: `certificates.k8s.io`, resource: `certificatesigningrequests/approval`
* Verbs: **approve**, group: `certificates.k8s.io`, resource: `signers`, resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`

If your cluster uses RBAC, here's an example ClusterRole for a CSR approver:

{{% code_sample file="access/certificate-signing-request/clusterrole-approve.yaml" %}}

Issuers need to be able to watch CSRs, and issue or fail CSRs addressed to their
signer name:

* Verbs: **get**, **list**, **watch**, group: `certificates.k8s.io`, resource: `certificatesigningrequests`
* Verbs: **update**, group: `certificates.k8s.io`, resource: `certificatesigningrequests/status`
* Verbs: **sign**, group: `certificates.k8s.io`, resource: `signers`, resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`

If your cluster uses RBAC, here's an example ClusterRole for a CSR issuer:

{{% code_sample file="access/certificate-signing-request/clusterrole-sign.yaml" %}}

#### PodCertificateRequests {#useful-cluster-roles-pcr}

For PodCertificateRequests, the requester role is almost always filled by
`kubelet`, which automatically has the necessary permissions to create and read
PCRs.  There is no approver role.

Issuers need to be able to watch CSRs, and issue or fail CSRs addressed to their
signer name:

* Verbs: **get**, **list**, **watch**, group: `certificates.k8s.io`, resource: `podcertificaterequests`
* Verbs: **update**, group: `certificates.k8s.io`, resource: `podcertificaterequests/status`
* Verbs: **sign**, group: `certificates.k8s.io`, resource: `signers`, resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`

If your cluster uses RBAC, here's an example ClusterRole for a PCR issuer:

{{% code_sample file="access/pod-certificate-request/clusterrole-sign.yaml" %}}

#### ClusterTrustBundles {#useful-cluster-roles-ctb}

ClusterTrustBundles have two broad roles: consumers and attesters.

Consumers need to be able to read ClusterTrustBundles.  In most scenarios, the
consumer will be `kubelet` (automatic permission via the node authorizer, if
enabled) or a service account (automatic permission via an RBAC bootstrap
ClusterRole, if enabled).
* Verbs: **get**, **list**, **watch**, group `certificates.k8s.io`, resource: `clustertrustbundles`

Attesters are typically a signer controller, and will need permission to create
and maintain specific signer-linked ClusterTrustBundles
* Verbs: **create**, **get**, **list**, **watch**, group: `certificates.k8s.io`, resource: `clustertrustbundles`
* Verbs: **attest**, group: `certificates.k8s.io`, resource: `signers`, resourceName: `<signerNameDomain>/<signerNamePath>` or `<signerNameDomain>/*`

### Writing a PodCertificateRequest controller {#write-pcr-controller}

Under the hood, `kubelet` runs the state machine depicted in Figure 1 for each
`podCertificate` projection.  The actions your signer takes on the
PodCertificateRequests that `kubelet` generates control the state transitions.

{{< mermaid >}} 
stateDiagram-v2

direction LR

Initial --> Wait
Wait --> Fresh
Wait --> Failed
Wait --> Denied
Fresh --> WaitRefresh
WaitRefresh --> Failed
WaitRefresh --> Denied

{{< /mermaid >}}
Figure 1.  Kubelet podCertificate lifecycle

1. The projection starts out in `Initial` state.
2. Kubelet generates a private key and holds it in memory.
3. Kubelet creates a
   [PodCertificateRequest](/docs/reference/access-authn-authz/certificate-signing-requests#pod-certificate-requests)
   addressed to the requested signer.  Kubelet then moves the projection into
   the `Wait` state.
4. If the PodCertificateRequest is marked "Denied", move to the `Denied` state.  This is
   a permanent error state, and the container(s) that mount this projection will
   fail to start.
5. If the PodCertificateRequest is marked "Failed", move to the `Failed` state.
   This is a permanent error state, and the container(s) that mount this
   projection will fail to start.
6. If the PodCertificate is marked "Issued", move to the `Fresh` state.  Kubelet
   holds the private key and certificate chain in memory, and will periodically
   write them to the filesystem at the requested location.  The container that
   mounts this projection will start up and run (assuming nothing else blocks
   its execution).
7. The signer indicated an appropriate time to begin refreshing the certificate
   when it issued the PodCertificateRequest.  Once that time has passed Kubelet
   will generate a new private key, create a new PodCertificateRequest, and move
   the projection into `WaitRefresh` state.
8. If the PodCertificateRequest is marked "Denied", move to the `Denied` state.
   This is a permanent error state, and the container(s) will begin to get
   Kubelet volume remount errors.
9. If the PodCertificateRequest is marked "Failed", move to the `Failed` state.
   This is a permanent error state, and the container(s) will begin to get
   Kubelet volume remount errors.
10. If the PodCertificate is marked "Issued", move back to the `Fresh` state. The
  container(s) will continue to run, with the new private key and certificate
  chain written to the filesystem.

## {{% heading "whatsnext" %}}

* Read detailed API references:
  * CertificateSigningRequest: {{< api-reference page="authentication-resources/certificate-signing-request-v1" >}}
  * PodCertificateRequest: {{< api-reference page="authentication-resources/pod-certificate-request-v1alpha1" >}}
  * ClusterTrustBundle: {{< api-reference page="authentication-resources/cluster-trust-bundle-v1beta1" >}}
* Read [Manage TLS Certificates in a Cluster](/docs/tasks/tls/managing-tls-in-a-cluster/)
* Read [Issue a Certificate for a Kubernetes API Client Using A CertificateSigningRequest](/docs/tasks/tls/certificate-issue-client-csr/)
* View the source code for the `kube-controller-manager` built in
  [signer](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/signer/cfssl_signer.go)
* View the source code for the `kube-controller-manager` built in
  [approver](https://github.com/kubernetes/kubernetes/blob/32ec6c212ec9415f604ffc1f4c1f29b782968ff1/pkg/controller/certificates/approver/sarapprove.go)
* For details of X.509 itself, refer to [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1) section 3.1
* For information on the syntax of PKCS#10 certificate signing requests, refer to [RFC 2986](https://tools.ietf.org/html/rfc2986)
