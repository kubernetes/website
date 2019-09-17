---
reviewers:
- mikedanese
- liggitt
- smarterclayton
- awly
title: TLS bootstrapping
content_template: templates/concept
---

{{% capture overview %}}

In a Kubernetes cluster, the components on the worker nodes - kubelet and kube-proxy - need to communicate with Kubernetes master components, specifically kube-apiserver.
In order to ensure that communication is kept private, not interfered with, and ensure that each component of the cluster is talking to another trusted component, we strongly
recommend using client TLS certificates on nodes.

The normal process of bootstrapping these components, especially worker nodes that need certificates so they can communicate safely with kube-apiserver, 
can be a challenging process as it is often outside of the scope of Kubernetes and requires significant additional work. 
This in turn, can make it challenging to initialize or scale a cluster.

In order to simplify the process, beginning in version 1.4, Kubernetes introduced a certificate request and signing API to simplify the process. The proposal can be
found [here](https://github.com/kubernetes/kubernetes/pull/20439).

This document describes the process of node initialization, how to set up TLS client certificate bootstrapping for
kubelets, and how it works. 

{{% /capture %}}

{{% capture body %}}

## Initialization Process
When a worker node starts up, the kubelet does the following:

1. Look for its `kubeconfig` file
2. Retrieve the URL of the API server and credentials, normally a TLS key and signed certificate from the `kubeconfig` file
3. Attempt to communicate with the API server using the credentials.

Assuming that the kube-apiserver successfully validates the kubelet's credentials, it will treat the kubelet as a valid node, and begin to assign pods to it.

Note that the above process depends upon:

* Existence of a key and certificate on the local host in the `kubeconfig`
* The certificate having been signed by a Certificate Authority (CA) trusted by the kube-apiserver

All of the following are responsibilities of whoever sets up and manages the cluster:

1. Creating the CA key and certificate
2. Distributing the CA certificate to the master nodes, where kube-apiserver is running
3. Creating a key and certificate for each kubelet; strongly recommended to have a unique one, with a unique CN, for each kubelet
4. Signing the kubelet certificate using the CA key
5. Distributing the kubelet key and signed certificate to the specific node on which the kubelet is running

The TLS Bootstrapping described in this document is intended to simplify, and partially or even completely automate, steps 3 onwards, as these are the most common when initializing or scaling
a cluster.

### Bootstrap Initialization
In the bootstrap initialization process, the following occurs:

1. kubelet begins
2. kubelet sees that it does _not_ have a `kubeconfig` file
3. kubelet searches for and finds a `bootstrap-kubeconfig` file
4. kubelet reads its bootstrap file, retrieving the URL of the API server and a limited usage "token"
5. kubelet connects to the API server, authenticates using the token
6. kubelet now has limited credentials to create and retrieve a certificate signing request (CSR)
7. kubelet creates a CSR for itself
8. CSR is approved in one of two ways:
  * If configured, kube-controller-manager automatically approves the CSR
  * If configured, an outside process, possibly a person, approves the CSR using the Kubernetes API or via `kubectl`
9. Certificate is created for the kubelet
10. Certificate is issued to the kubelet
11. kubelet retrieves the certificate
12. kubelet creates a proper `kubeconfig` with the key and signed certificate
13. kubelet begins normal operation
14. Optional: if configured, kubelet automatically requests renewal of the certificate when it is close to expiry
15. The renewed certificate is approved and issued, either automatically or manually, depending on configuration.

The rest of this document describes the necessary steps to configure TLS Bootstrapping, and its limitations.

## Configuration
To configure for TLS bootstrapping and optional automatic approval, you must configure options on the following components:

* kube-apiserver
* kube-controller-manager
* kubelet
* in-cluster resources: `ClusterRoleBinding` and potentially `ClusterRole`

In addition, you need your Kubernetes Certificate Authority (CA).

## Certificate Authority
As without bootstrapping, you will need a Certificate Authority (CA) key and certificate. As without bootstrapping, these will be used
to sign the kubelet certificate. As before, it is your responsibility to distribute them to master nodes.

For the purposes of this document, we will assume these have been distributed to master nodes at `/var/lib/kubernetes/ca.pem` (certificate) and `/var/lib/kubernetes/ca-key.pem` (key). 
We will refer to these as "Kubernetes CA certificate and key".

All Kubernetes components that use these certificates - kubelet, kube-apiserver, kube-controller-manager - assume the key and certificate to be PEM-encoded.

## kube-apiserver configuration
The kube-apiserver has several requirements to enable TLS bootstrapping:

* Recognizing CA that signs the client certificate 
* Authenticating the bootstrapping kubelet to the `system:bootstrappers` group
* Authorize the bootstrapping kubelet to create a certificate signing request (CSR)

### Recognizing client certificates
This is normal for all client certificate authentication.
If not already set, add the `--client-ca-file=FILENAME` flag to the kube-apiserver command to enable
client certificate authentication, referencing a certificate authority bundle
containing the signing certificate, for example
`--client-ca-file=/var/lib/kubernetes/ca.pem`.

### Initial bootstrap authentication
In order for the bootstrapping kubelet to connect to kube-apiserver and request a certificate, it must first authenticate to the server.
You can use any [authenticator](/docs/reference/access-authn-authz/authentication/) that can authenticate the kubelet.

While any authentication strategy can be used for the kubelet's initial
bootstrap credentials, the following two authenticators are recommended for ease
of provisioning.

1. [Bootstrap Tokens](#bootstrap-tokens) - __beta__
2. [Token authentication file](#token-authentication-file)

Bootstrap tokens are a simpler and more easily managed method to authenticate kubelets, and do not require any additional flags when starting kube-apiserver. 
Using bootstrap tokens is currently __beta__ as of Kubernetes version 1.12.

Whichever method you choose, the requirement is that the kubelet be able to authenticate as a user with the rights to:

1. create and retrieve CSRs
2. be automatically approved to request node client certificates, if automatic approval is enabled. 

A kubelet authenticating using bootstrap tokens is authenticated as a user in the group `system:bootstrappers`, which is the standard method to use.

As this feature matures, you
should ensure tokens are bound to a Role Based Access Control (RBAC) policy
which limits requests (using the [bootstrap
token](/docs/reference/access-authn-authz/bootstrap-tokens/)) strictly to client
requests related to certificate provisioning. With RBAC in place, scoping the
tokens to a group allows for great flexibility. For example, you could disable a
particular bootstrap group's access when you are done provisioning the nodes.

#### Bootstrap tokens
Bootstrap tokens are described in detail [here](/docs/reference/access-authn-authz/bootstrap-tokens/). These are tokens that are stored as secrets in the Kubernetes cluster,
and then issued to the individual kubelet. You can use a single token for an entire cluster, or issue one per worker node.

The process is two-fold:

1. Create a Kubernetes secret with the token ID, secret and scope(s).
2. Issue the token to the kubelet

From the kubelet's perspective, one token is like another and has no special meaning.
From the kube-apiserver's perspective, however, the bootstrap token is special. Due to its `Type`, `namespace` and `name`, kube-apiserver recognizes it as a special token,
and grants anyone authenticating with that token special bootstrap rights, notably treating them as a member of the `system:bootstrappers` group. This fulfills a basic requirement
for TLS bootstrapping.

The details for creating the secret are available [here](/docs/reference/access-authn-authz/bootstrap-tokens/). 

If you want to use bootstrap tokens, you must enable it on kube-apiserver with the flag:

```
--enable-bootstrap-token-auth=true
```

#### Token authentication file
kube-apiserver has an ability to accept tokens as authentication. 
These tokens are arbitrary but should represent at least 128 bits of entropy derived
from a secure random number generator (such as `/dev/urandom` on most modern Linux
systems). There are multiple ways you can generate a token. For example:

```
head -c 16 /dev/urandom | od -An -t x | tr -d ' '
```

will generate tokens that look like `02b50b05283e98dd0fd71db496ef01e8`.

The token file should look like the following example, where the first three
values can be anything and the quoted group name should be as depicted:

```
02b50b05283e98dd0fd71db496ef01e8,kubelet-bootstrap,10001,"system:bootstrappers"
```

Add the `--token-auth-file=FILENAME` flag to the kube-apiserver command (in your
systemd unit file perhaps) to enable the token file.  See docs
[here](/docs/reference/access-authn-authz/authentication/#static-token-file) for
further details.

### Authorize kubelet to create CSR
Now that the bootstrapping node is _authenticated_ as part of the `system:bootstrappers` group, it needs to be _authorized_ to create a certificate signing request (CSR) as well as retrieve it when done. Fortunately, Kubernetes ships with a `ClusterRole` with precisely these (and just these) permissions, `system:node-bootstrapper`.

To do this, you just need to create a `ClusterRoleBinding` that binds the `system:bootstrappers` group to the cluster role `system:node-bootstrapper`.

```
# enable bootstrapping nodes to create CSR
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: create-csrs-for-bootstrapping
subjects:
- kind: Group
  name: system:bootstrappers
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: system:node-bootstrapper
  apiGroup: rbac.authorization.k8s.io
```

## kube-controller-manager configuration
While the apiserver receives the requests for certificates from the kubelet and authenticates those requests,
the controller-manager is responsible for issuing actual signed certificates.

The controller-manager performs this function via a certificate-issuing control loop.
This takes the form of a
[cfssl](https://blog.cloudflare.com/introducing-cfssl/) local signer using
assets on disk. Currently, all certificates issued have one year validity and a
default set of key usages.

In order for the controller-manager to sign certificates, it needs the following:

* access to the "Kubernetes CA key and certificate" that you created and distributed
* enabling CSR signing

### Access to key and certificate
As described earlier, you need to create a Kubernetes CA key and certificate, and distribute it to the master nodes.
These will be used by the controller-manager to sign the kubelet certificates.

Since these signed certificates will, in turn, be used by the kubelet to authenticate as a regular kubelet to kube-apiserver, it is important that the CA
provided to the controller-manager at this stage also be trusted by kube-apiserver for authentication. This is provided to kube-apiserver
with the flag `--client-ca-file=FILENAME` (for example, `--client-ca-file=/var/lib/kubernetes/ca.pem`), as described in the kube-apiserver configuration section.

To provide the Kubernetes CA key and certificate to kube-controller-manager, use the following flags:

```
--cluster-signing-cert-file="/etc/path/to/kubernetes/ca/ca.crt" --cluster-signing-key-file="/etc/path/to/kubernetes/ca/ca.key"
```

for example:

```
--cluster-signing-cert-file="/var/lib/kubernetes/ca.pem" --cluster-signing-key-file="/var/lib/kubernetes/ca-key.pem"
```

The validity duration of signed certificates can be configured with flag:

```
--experimental-cluster-signing-duration
```

### Approval
In order to approve CSRs, you need to tell the controller-manager that it is acceptable to approve them. This is done by granting
RBAC permissions to the correct group.

There are two distinct sets of permissions:

* `nodeclient`: If a node is creating a new certificate for a node, then it does not have a certificate yet. It is authenticating using one of the tokens listed above, and thus is part of the group `system:bootstrappers`. 
* `selfnodeclient`: If a node is renewing its certificate, then it already has a certificate (by definition), which it uses continuously to authenticate as part of the group `system:nodes`.  

To enable the kubelet to request and receive a new certificate, create a `ClusterRoleBinding` that binds the group in which the bootstrapping node is a member `system:bootstrappers` to the `ClusterRole` that grants it permission, `system:certificates.k8s.io:certificatesigningrequests:nodeclient`:

```yml
# Approve all CSRs for the group "system:bootstrappers"
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: auto-approve-csrs-for-group
subjects:
- kind: Group
  name: system:bootstrappers
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: system:certificates.k8s.io:certificatesigningrequests:nodeclient
  apiGroup: rbac.authorization.k8s.io
```

To enable the kubelet to renew its own client certificate, create a `ClusterRoleBinding` that binds the group in which the fully functioning node is a member `system:nodes` to the `ClusterRole` that 
grants it permission, `system:certificates.k8s.io:certificatesigningrequests:selfnodeclient`:

```yml
# Approve renewal CSRs for the group "system:nodes"
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: auto-approve-renewals-for-nodes
subjects:
- kind: Group
  name: system:nodes
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: system:certificates.k8s.io:certificatesigningrequests:selfnodeclient
  apiGroup: rbac.authorization.k8s.io
```

**Note: Kubernetes Below 1.8**: If you are running an earlier version of Kubernetes, notably a version below 1.8, then the cluster roles referenced above do not ship by default. You will have to create them yourself _in addition to_ the `ClusterRoleBindings` listed.

To create the `ClusterRole`s:

```yml
# A ClusterRole which instructs the CSR approver to approve a user requesting
# node client credentials.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: system:certificates.k8s.io:certificatesigningrequests:nodeclient
rules:
- apiGroups: ["certificates.k8s.io"]
  resources: ["certificatesigningrequests/nodeclient"]
  verbs: ["create"]
---
# A ClusterRole which instructs the CSR approver to approve a node renewing its
# own client credentials.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: system:certificates.k8s.io:certificatesigningrequests:selfnodeclient
rules:
- apiGroups: ["certificates.k8s.io"]
  resources: ["certificatesigningrequests/selfnodeclient"]
  verbs: ["create"]
```


The `csrapproving` controller that ships as part of
[kube-controller-manager](/docs/admin/kube-controller-manager/) and is enabled
by default. The controller uses the [`SubjectAccessReview`
API](/docs/reference/access-authn-authz/authorization/#checking-api-access) to
determine if a given user is authorized to request a CSR, then approves based on
the authorization outcome. To prevent conflicts with other approvers, the
builtin approver doesn't explicitly deny CSRs. It only ignores unauthorized
requests. The controller also prunes expired certificates as part of garbage
collection.


## kubelet configuration
Finally, with the master nodes properly set up and all of the necessary authentication and authorization in place, we can configure the kubelet.

The kubelet requires the following configuration to bootstrap:

* A path to store the key and certificate it generates (optional, can use default)
* A path to a `kubeconfig` file that does not yet exist; it will place the bootstrapped config file here
* A path to a bootstrap `kubeconfig` file to provide the URL for the server and bootstrap credentials, e.g. a bootstrap token
* Optional: instructions to rotate certificates

The bootstrap `kubeconfig` should be in a path available to the kubelet, for example `/var/lib/kubelet/bootstrap-kubeconfig`.

Its format is identical to a normal `kubeconfig` file. A sample file might look as follows:

```yml
apiVersion: v1
kind: Config
clusters:
- cluster:
    certificate-authority: /var/lib/kubernetes/ca.pem
    server: https://my.server.example.com:6443
  name: bootstrap
contexts:
- context:
    cluster: bootstrap
    user: kubelet-bootstrap
  name: bootstrap
current-context: bootstrap
preferences: {}
users:
- name: kubelet-bootstrap
  user:
    token: 07401b.f395accd246ae52d
```

The important elements to note are:

* `certificate-authority`: path to a CA file, used to validate the server certificate presented by kube-apiserver
* `server`: URL to kube-apiserver
* `token`: the token to use

The format of the token does not matter, as long as it matches what kube-apiserver expects. In the above example, we used a bootstrap token.
As stated earlier, _any_ valid authentication method can be used, not just tokens.

Because the bootstrap `kubeconfig` _is_ a standard `kubeconfig`, you can use `kubectl` to generate it. To create the above example file:

```
kubectl config --kubeconfig=/var/lib/kubelet/bootstrap-kubeconfig set-cluster bootstrap --server='https://my.server.example.com:6443' --certificate-authority=/var/lib/kubernetes/ca.pem
kubectl config --kubeconfig=/var/lib/kubelet/bootstrap-kubeconfig set-credentials kubelet-bootstrap --token=07401b.f395accd246ae52d
kubectl config --kubeconfig=/var/lib/kubelet/bootstrap-kubeconfig set-context bootstrap --user=kubelet-bootstrap --cluster=bootstrap
kubectl config --kubeconfig=/var/lib/kubelet/bootstrap-kubeconfig use-context bootstrap
```

To indicate to the kubelet to use the bootstrap `kubeconfig`, use the following kubelet flag:

```
--bootstrap-kubeconfig="/var/lib/kubelet/bootstrap-kubeconfig" --kubeconfig="/var/lib/kubelet/kubeconfig"
```

When starting the kubelet, if the file specified via `--kubeconfig` does not
exist, the bootstrap kubeconfig specified via `--bootstrap-kubeconfig` is used
to request a client certificate from the API server. On approval of the
certificate request and receipt back by the kubelet, a kubeconfig file
referencing the generated key and obtained certificate is written to the path
specified by `--kubeconfig`. The certificate and key file will be placed in the
directory specified by `--cert-dir`.

### Client and Serving Certificates
All of the above relate to kubelet _client_ certificates, specifically, the certificates a kubelet
uses to authenticate to kube-apiserver.

A kubelet also can use _serving_ certificates. The kubelet itself exposes an https endpoint for certain features.
To secure these, the kubelet can do one of:

* use provided key and certificate, via the `--tls-private-key-file` and `--tls-cert-file` flags
* create self-signed key and certificate, if a key and certificate are not provided
* request serving certificates from the cluster server, via the CSR API

The client certificate provided by TLS bootstrapping is signed, by default, for `client auth` only, and thus cannot
be used as serving certificates, or `server auth`. 

However, you _can_ enable its server certificate, at least partially, via certificate rotation.

### Certificate Rotation
Kubernetes v1.8 and higher kubelet implements __beta__ features for enabling
rotation of its client and/or serving certficates.  These can be enabled through
the respective `RotateKubeletClientCertificate` and
`RotateKubeletServerCertificate` feature flags on the kubelet and are enabled by
default.

`RotateKubeletClientCertificate` causes the kubelet to rotate its client
certificates by creating new CSRs as its existing credentials expire. To enable
this feature pass the following flag to the kubelet:

```
--rotate-certificates
```

`RotateKubeletServerCertificate` causes the kubelet **both** to request a serving
certificate after bootstrapping its client credentials **and** to rotate that
certificate. To enable this feature pass the following flag to the kubelet:

```
--rotate-server-certificates
```

{{< note >}}
The CSR approving controllers implemented in core Kubernetes do not
approve node _serving_ certificates for [security
reasons](https://github.com/kubernetes/community/pull/1982). To use
`RotateKubeletServerCertificate` operators need to run a custom approving
controller, or manually approve the serving certificate requests.
{{< /note >}}

## Other authenticating components
All of TLS bootstrapping described in this document relates to the kubelet. However,
other components may need to communicate directly with kube-apiserver. Notable is kube-proxy, which
is part of the Kubernetes control plane and runs on every node, but may also include other components such as monitoring or networking.

Like the kubelet, these other components also require a method of authenticating to kube-apiserver.
You have several options for generating these credentials:

* The old way: Create and distribute certificates the same way you did for kubelet before TLS bootstrapping
* DaemonSet: Since the kubelet itself is loaded on each node, and is sufficient to start base services, you can run kube-proxy and other node-specific services not as a standalone process, but rather as a daemonset in the `kube-system` namespace. Since it will be in-cluster, you can give it a proper service account with appropriate permissions to perform its activities. This may be the simplest way to configure such services.


## kubectl approval

CSRs can be approved outside of the approval flows builtin to the controller
manager.

The signing controller does not immediately sign all certificate requests.
Instead, it waits until they have been flagged with an "Approved" status by an
appropriately-privileged user. This flow is intended to allow for automated
approval handled by an external approval controller or the approval controller
implemented in the core controller-manager. However cluster administrators can
also manually approve certificate requests using kubectl. An administrator can
list CSRs with `kubectl get csr` and describe one in detail with `kubectl
describe csr <name>`. An administrator can approve or deny a CSR with `kubectl
certificate approve <name>` and `kubectl certificate deny <name>`.


## Limits
Although Kubernetes supports running control plane master components like kube-apiserver and kube-controller-manager in containers, and even as `Pod`s in a kubelet, as of this writing, you cannot both TLS Bootstrap a kubelet and run master plane components on it.

The reason for this limitation is that the kubelet attempts to bootstrap communication with kube-apiserver _before_ starting any pods, even static ones define on disk and referenced via the kubelet option `--pod-manifest-path=<PATH>`. Trying to do both TLS Bootstrapping and master components in kubelet leads to a race condition: kubelet needs to communicate to kube-apiserver to request certificates, yet requires those certificates to be available to start kube-apiserver.

An issue is open referencing this [here](https://github.com/kubernetes/kubernetes/issues/68686).



{{% /capture %}}
