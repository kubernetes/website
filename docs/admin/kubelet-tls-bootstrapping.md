---
assignees:
- mikedanese
title: TLS bootstrapping
---

* TOC
{:toc}

## Overview

This document describes how to set up TLS client certificate bootstrapping for kubelets.
Kubernetes 1.4 introduces an experimental API for requesting certificates from a cluster-level 
Certificate Authority (CA). The first supported use of this API is the provisioning of TLS client 
certificates for kubelets. The proposal can be found [here](https://github.com/kubernetes/kubernetes/pull/20439)
and progress on the feature is being tracked as [feature #43](https://github.com/kubernetes/features/issues/43). 

## apiserver configuration

You must provide a token file which specifies at least one "bootstrap token" assigned to a kubelet bootstrap-specific group.
This group will later be used in the controller-manager configuration to scope approvals in the default approval
controller. As this feature matures, you should ensure tokens are bound to an RBAC policy which limits requests
using the bootstrap token to only be able to make requests related to certificate provisioning. When RBAC policy
is in place, scoping the tokens to a group will allow great flexibility (e.g. you could disable a particular
bootstrap group's access when you are done provisioning the nodes). 

### Token auth file 
Tokens are arbitrary but should represent at least 128 bits of entropy derived from a secure random number 
generator (such as /dev/urandom on most modern systems). There are multiple ways you can generate a token. For example: 

`head -c 16 /dev/urandom | od -An -t x | tr -d ' '` 

will generate tokens that look like `02b50b05283e98dd0fd71db496ef01e8` 

The token file will look like the following example, where the first three values can be anything and the quoted group 
name should be as depicted: 

```
02b50b05283e98dd0fd71db496ef01e8,kubelet-bootstrap,10001,"system:kubelet-bootstrap"
``` 

Add the `--token-auth-file=FILENAME` flag to the apiserver command to enable the token file. 
See docs at http://kubernetes.io/docs/admin/authentication/#static-token-file for further details.

### Client certificate CA bundle

Add the `--client-ca-file=FILENAME` flag to the apiserver command to enable client certificate authentication,
referencing a certificate authority bundle containing the signing certificate.

## controller-manager configuration
The API for requesting certificates adds a certificate-issuing control loop to the KCM. This takes the form of a 
[cfssl](https://blog.cloudflare.com/introducing-cfssl/) local signer using assets on disk. 
Currently, all certificates issued have one year validity and a default set of key usages. 

### Signing assets 
You must provide a Certificate Authority in order to provide the cryptographic materials necessary to issue certificates. 
This CA should be trusted by the apiserver for authentication with the `--client-ca-file=SOMEFILE` flag. The management
of the CA is beyond the scope of this document but it is recommended that you generate a dedicated CA for Kubernetes.
Both certificate and key are assumed to be PEM-encoded. 

The new controller-manager flags are: 
```
--cluster-signing-cert-file="/etc/path/to/kubernetes/ca/ca.crt" --cluster-signing-key-file="/etc/path/to/kubernetes/ca/ca.key"
``` 

### Auto-approval 
To ease deployment and testing, the alpha version of the certificate request API includes a flag to approve all certificate 
requests made by users in a certain group. The intended use of this is to whitelist only the group corresponding to the bootstrap
token in the token file above. Use of this flag circumvents makes the "approval" process described below and is not recommended
for production use. 

The flag is: 
```
--insecure-experimental-approve-all-kubelet-csrs-for-group="system:kubelet-bootstrap"
``` 

## kubelet configuration 
To use request a client cert from the certificate request API, the kubelet needs a path to a kubeconfig file that contains the
bootstrap auth token. If the file specified by `--kubeconfig` does not exist, the bootstrap kubeconfig is used to request a
client certificate from the API server. On success, a kubeconfig file referencing the generated key and obtained certificate
is written to the path specified by `--kubeconfig`. The certificate and key file will be stored in the directory pointed 
by `--cert-dir`.  The new flag is: 

```
--experimental-bootstrap-kubeconfig="/path/to/bootstrap/kubeconfig"
``` 

## kubectl approval 
The signing controller does not immediately sign all certificate requests. Instead, it waits until they have been flagged with an 
"Approved" status by an appropriately-privileged user. This is intended to eventually be an automated process handled by an external
approval controller, but for the alpha version of the API it can be done manually by a cluster administrator using kubectl. 
An administrator can list CSRs with `kubectl get csr`, describe one in detail with `kubectl describe <name>`. There are 
[currently no direct approve/deny commands](https://github.com/kubernetes/kubernetes/issues/30163) so an approver will need to update
the Status field directly. A rough example of how to do this in bash which should only be used until the porcelain merges is available
at [https://github.com/gtank/csrctl](https://github.com/gtank/csrctl).

