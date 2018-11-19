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

This document describes how to set up TLS client certificate bootstrapping for
kubelets. Kubernetes 1.4 introduced an API for requesting certificates from a
cluster-level Certificate Authority (CA). The original intent of this API is to
enable provisioning of TLS client certificates for kubelets. The proposal can be
found [here](https://github.com/kubernetes/kubernetes/pull/20439).

{{% /capture %}}

{{% capture body %}}

## kube-apiserver configuration

The API server should be configured with an
[authenticator](/docs/reference/access-authn-authz/authentication/) that can
authenticate tokens as a user in the `system:bootstrappers` group.

This group will later be used in the controller-manager configuration to scope
approvals in the default approval controller. As this feature matures, you
should ensure tokens are bound to a Role Based Access Control (RBAC) policy
which limits requests (using the [bootstrap
token](/docs/reference/access-authn-authz/bootstrap-tokens/)) strictly to client
requests related to certificate provisioning. With RBAC in place, scoping the
tokens to a group allows for great flexibility (e.g. you could disable a
particular bootstrap group's access when you are done provisioning the nodes).

While any authentication strategy can be used for the kubelet's initial
bootstrap credentials, the following two authenticators are recommended for ease
of provisioning.

1. [Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) - __beta__
2. [Token authentication file](#token-authentication-file)

Using bootstrap tokens is currently __beta__ and will simplify the management of
bootstrap token management especially in a HA scenario.

### Token authentication file

Tokens are arbitrary but should represent at least 128 bits of entropy derived
from a secure random number generator (such as /dev/urandom on most modern Linux
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

### Client certificate CA bundle

Add the `--client-ca-file=FILENAME` flag to the kube-apiserver command to enable
client certificate authentication, referencing a certificate authority bundle
containing the signing certificate (e.g.
`--client-ca-file=/var/lib/kubernetes/ca.pem`).

## kube-controller-manager configuration

The API for requesting certificates adds a certificate-issuing control loop to
the Kubernetes Controller Manager. This takes the form of a
[cfssl](https://blog.cloudflare.com/introducing-cfssl/) local signer using
assets on disk. Currently, all certificates issued have one year validity and a
default set of key usages.

### Signing assets

You must provide a Certificate Authority in order to provide the cryptographic
materials necessary to issue certificates.  This CA should be trusted by
kube-apiserver for authentication with the `--client-ca-file=FILENAME` flag. The
management of the CA is beyond the scope of this document but it is recommended
that you generate a dedicated CA for Kubernetes.  Both certificate and key are
assumed to be PEM-encoded.

The kube-controller-manager flags are:

```
--cluster-signing-cert-file="/etc/path/to/kubernetes/ca/ca.crt" --cluster-signing-key-file="/etc/path/to/kubernetes/ca/ca.key"
```

The validity duration of signed certificates can be configured with flag:

```
--experimental-cluster-signing-duration
```

### SubjectAccessReview Approval Controller

The `csrapproving` controller that ships as part of
[kube-controller-manager](/docs/admin/kube-controller-manager/) and is enabled
by default. The controller uses the [`SubjectAccessReview`
API](/docs/reference/access-authn-authz/authorization/#checking-api-access) to
determine if a given user is authorized to request a CSR, then approves based on
the authorization outcome. To prevent conflicts with other approvers, the
builtin approver doesn't explicitly deny CSRs. It only ignores unauthorized
requests. The controller also prunes expired certificates as part of garbage
collection.

The controller categorizes CSRs into three subresources:

1. `nodeclient` - a request by a user for a client certificate with `O=system:nodes` and `CN=system:node:(node name)`.
2. `selfnodeclient` - a node renewing a client certificate with the same `O` and `CN`. A node can use its existing client certificate to authenticate this request.

The following RBAC `ClusterRoles` represent the `nodeclient` and
`selfnodeclient`, capabilities.

```yml
# A ClusterRole which instructs the CSR approver to approve a user requesting
# node client credentials.
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: approve-node-client-csr
rules:
- apiGroups: ["certificates.k8s.io"]
  resources: ["certificatesigningrequests/nodeclient"]
  verbs: ["create"]
---
# A ClusterRole which instructs the CSR approver to approve a node renewing its
# own client credentials.
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: approve-node-client-renewal-csr
rules:
- apiGroups: ["certificates.k8s.io"]
  resources: ["certificatesigningrequests/selfnodeclient"]
  verbs: ["create"]
```

As of 1.8, equivalent roles to the ones listed above are automatically created
as part of the default RBAC roles. For 1.8 clusters admins are recommended to
bind node bootstrap identities to the following roles instead of creating their
own:

* `system:certificates.k8s.io:certificatesigningrequests:nodeclient`
    - Automatically approve CSRs for client certs bound to this role.
* `system:certificates.k8s.io:certificatesigningrequests:selfnodeclient`
    - Automatically approve CSRs when a client bound to its role renews its own certificate.

For example, to grant these permissions to identities attached to bootstrap
tokens, an admin would create a `ClusterRoleBinding` targeting the
`system:bootstrappers` group:

```yml
# Approve all CSRs for the group "system:bootstrappers"
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: auto-approve-csrs-for-group
subjects:
- kind: Group
  name: system:bootstrappers
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: approve-node-client-csr
  apiGroup: rbac.authorization.k8s.io
```

To let all nodes renew their own credentials, an admin can create a
`ClusterRoleBinding` targeting node identities:

```yml
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: node1-client-cert-renewal
subjects:
- kind: Group
  name: system:nodes
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: approve-node-client-renewal-csr
  apiGroup: rbac.authorization.k8s.io
```

## kubelet configuration

To request a client certificate from kube-apiserver, the kubelet first needs a
path to a kubeconfig file that contains the credentials for the identity that it
will use to bootstrap its individual node identity.

If you are using a bootstrap token, you can use `kubectl config set-cluster`,
`set-credentials`, and `set-context` to build this kubeconfig.  Provide the name
`kubelet-bootstrap` to `kubectl config set-credentials` and include
`--token=<token-value>` as follows:

```
kubectl config set-credentials kubelet-bootstrap --token=${BOOTSTRAP_TOKEN} --kubeconfig=bootstrap.kubeconfig
```

When starting the kubelet, if the file specified via `--kubeconfig` does not
exist, the bootstrap kubeconfig specified via `--bootstrap-kubeconfig` is used
to request a client certificate from the API server. On approval of the
certificate request and receipt back by the kubelet, a kubeconfig file
referencing the generated key and obtained certificate is written to the path
specified by `--kubeconfig`. The certificate and key file will be placed in the
directory specified by `--cert-dir`.

{{< note >}}
The following flags are required to enable this bootstrapping when starting the kubelet:

```
--bootstrap-kubeconfig="/path/to/bootstrap/kubeconfig"
```
{{< /note >}}

Additionally, in 1.7 the kubelet implements __beta__ features for enabling
rotation of both its client and/or serving certs.  These can be enabled through
the respective `RotateKubeletClientCertificate` and
`RotateKubeletServerCertificate` feature flags on the kubelet and are enabled by
default.

`RotateKubeletClientCertificate` causes the kubelet to rotate its client
certificates by creating new CSRs as its existing credentials expire. To enable
this feature pass the following flag to the kubelet:

```
--rotate-certificates
```

`RotateKubeletServerCertificate` causes the kubelet to both request a serving
certificate after bootstrapping its client credentials and to rotate that
certificate. To enable this feature pass the following flag to the kubelet:

```
--rotate-server-certificates
```

{{< note >}}
The CSR approving controllers implemented in core Kubernetes do not
approve node serving certificates for [security
reasons](https://github.com/kubernetes/community/pull/1982). To use
`RotateKubeletServerCertificate` operators need to run a custom approving
controller, or manually approve the serving certificate requests.
{{< /note >}}

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

{{% /capture %}}
