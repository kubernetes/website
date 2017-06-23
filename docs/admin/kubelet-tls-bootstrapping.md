---
assignees:
- mikedanese
title: TLS bootstrapping
---

* TOC
{:toc}

## Overview

This document describes how to set up TLS client certificate bootstrapping for kubelets.
Kubernetes 1.4 introduced an API for requesting certificates from a cluster-level Certificate Authority (CA). The original intent of this API is to enable provisioning of TLS client certificates for kubelets. The proposal can be found [here](https://github.com/kubernetes/kubernetes/pull/20439)
and progress on the feature is being tracked as [feature #43](https://github.com/kubernetes/features/issues/43).

## kube-apiserver configuration

You must provide a token file which specifies at least one "bootstrap token" assigned to a kubelet bootstrap-specific group.
This group will later be used in the controller-manager configuration to scope approvals in the default approval
controller. As this feature matures, you should ensure tokens are bound to a Role-Based Access Control (RBAC) policy which limits requests
(using the bootstrap token) strictly to client requests related to certificate provisioning. With RBAC in place, scoping the tokens to a group allows for great flexibility (e.g. you could disable a particular bootstrap group's access when you are done provisioning the nodes).

### Token authentication file
Tokens are arbitrary but should represent at least 128 bits of entropy derived from a secure random number
generator (such as /dev/urandom on most modern systems). There are multiple ways you can generate a token. For example:

`head -c 16 /dev/urandom | od -An -t x | tr -d ' '`

will generate tokens that look like `02b50b05283e98dd0fd71db496ef01e8`

The token file should look like the following example, where the first three values can be anything and the quoted group
name should be as depicted:

```
02b50b05283e98dd0fd71db496ef01e8,kubelet-bootstrap,10001,"system:kubelet-bootstrap"
```

Add the `--token-auth-file=FILENAME` flag to the kube-apiserver command (in your systemd unit file perhaps) to enable the token file.
See docs [here](http://kubernetes.io/docs/admin/authentication/#static-token-file) for further details.

### Client certificate CA bundle

Add the `--client-ca-file=FILENAME` flag to the kube-apiserver command to enable client certificate authentication,
referencing a certificate authority bundle containing the signing certificate (e.g. `--client-ca-file=/var/lib/kubernetes/ca.pem`).

## kube-controller-manager configuration
The API for requesting certificates adds a certificate-issuing control loop to the Kubernetes Controller Manager. This takes the form of a
[cfssl](https://blog.cloudflare.com/introducing-cfssl/) local signer using assets on disk. Currently, all certificates issued have one year validity and a default set of key usages.

### Signing assets
You must provide a Certificate Authority in order to provide the cryptographic materials necessary to issue certificates.
This CA should be trusted by kube-apiserver for authentication with the `--client-ca-file=FILENAME` flag. The management
of the CA is beyond the scope of this document but it is recommended that you generate a dedicated CA for Kubernetes.
Both certificate and key are assumed to be PEM-encoded.

The kube-controller-manager flags are:

```
--cluster-signing-cert-file="/etc/path/to/kubernetes/ca/ca.crt" --cluster-signing-key-file="/etc/path/to/kubernetes/ca/ca.key"
```

### Automatic approval
To ease deployment and testing, there is an experimental flag in the certificate bootstrapping API to approve all certificate
requests made by users in a certain group. The intended use of this is to whitelist only the group corresponding to the bootstrap
token in the token file above. Use of this flag circumvents the approval process described below and is not recommended
for production use.

The flag is:

```
--insecure-experimental-approve-all-kubelet-csrs-for-group="system:kubelet-bootstrap"
```

## kubelet configuration
To request a client certificate from kube-apiserver, the kubelet first needs a path to a kubeconfig file that contains the
bootstrap authentication token. You can use `kubectl config set-cluster`, `set-credentials`, and `set-context` to build this kubeconfig. Provide the name `kubelet-bootstrap` to `kubectl config set-credentials` and include `--token=<token-value>` as follows:

```
kubectl config set-credentials kubelet-bootstrap --token=${BOOTSTRAP_TOKEN} --kubeconfig=bootstrap.kubeconfig
```

When starting the kubelet, if the file specified by `--kubeconfig` does not exist, the bootstrap kubeconfig is used to request a client certificate from the API server. On approval of the certificate request and receipt back by the kubelet, a kubeconfig file referencing the generated key and obtained certificate is written to the path specified by `--kubeconfig`. The certificate and key file will be placed in the directory specified by `--cert-dir`.

The flag to enable this bootstrapping when starting the kubelet is:

```
--experimental-bootstrap-kubeconfig="/path/to/bootstrap/kubeconfig"
```

## kubectl approval
The signing controller does not immediately sign all certificate requests. Instead, it waits until they have been flagged with an
"Approved" status by an appropriately-privileged user. This is intended to eventually be an automated process handled by an external
approval controller, but for the alpha version of the API it can be done manually by a cluster administrator using kubectl.
An administrator can list CSRs with `kubectl get csr` and describe one in detail with `kubectl describe csr <name>`. Before the 1.6 release there were
[no direct approve/deny commands](https://github.com/kubernetes/kubernetes/issues/30163) so an approver had to update
the Status field directly ([rough how-to](https://github.com/gtank/csrctl)). Later versions of Kubernetes offer `kubectl certificate approve <name>` and `kubectl certificate deny <name>` commands.
