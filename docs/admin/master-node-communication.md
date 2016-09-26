---
assignees:
- dchen1107
- roberthbailey

---

* TOC
{:toc}

## Summary

This document catalogs the communication paths between the master (really the
apiserver) and the Kubernetes cluster. The intent is to allow users to
customize their installation to harden the network configuration such that
the cluster can be run on an untrusted network (or on fully public IPs on a
cloud provider).

## Cluster -> Master

All communication paths from the cluster to the master terminate at the
apiserver (none of the other master components are designed to expose remote
services). In a typical deployment, the apiserver is configured to listen for
remote connections on a secure HTTPS port (443) with one or more forms of
client [authentication](/docs/admin/authentication/) enabled.

Nodes should be provisioned with the public root certificate for the cluster
such that they can connect securely to the apiserver along with valid client
credentials. For example, on a default GCE deployment, the client credentials
provided to the kubelet are in the form of a client certificate. Pods that
wish to connect to the apiserver can do so securely by leveraging a service
account so that Kubernetes will automatically inject the public root
certificate and a valid bearer token into the pod when it is instantiated.
The `kubernetes` service (in all namespaces) is configured with a virtual IP
address that is redirected (via kube-proxy) to the HTTPS endpoint on the
apiserver.

The master components communicate with the cluster apiserver over the
insecure (not encrypted or authenticated) port. This port is typically only
exposed on the localhost interface of the master machine, so that the master
components, all running on the same machine, can communicate with the
cluster apiserver. Over time, the master components will be migrated to use
the secure port with authentication and authorization (see
[#13598](https://github.com/kubernetes/kubernetes/issues/13598)).

As a result, the default operating mode for connections from the cluster
(nodes and pods running on the nodes) to the master is secured by default
and can run over untrusted and/or public networks.

## Master -> Cluster

There are two primary communication paths from the master (apiserver) to the
cluster. The first is from the apiserver to the kubelet process which runs on
each node in the cluster. The second is from the apiserver to any node, pod,
or service through the apiserver's proxy functionality.

The connections from the apiserver to the kubelet are used for fetching logs
for pods, attaching (through kubectl) to running pods, and using the kubelet's
port-forwarding functionality. These connections terminate at the kubelet's
HTTPS endpoint, which is typically using a self-signed certificate, and
ignore the certificate presented by the kubelet (although you can override this
behavior by specifying the `--kubelet-certificate-authority`,
`--kubelet-client-certificate`, and `--kubelet-client-key` flags when starting
the cluster apiserver). By default, these connections **are not currently safe**
to run over untrusted and/or public networks as they are subject to
man-in-the-middle attacks.

The connections from the apiserver to a node, pod, or service default to plain
HTTP connections and are therefore neither authenticated nor encrypted. They
can be run over a secure HTTPS connection by prefixing `https:` to the node,
pod, or service name in the API URL, but they will not validate the certificate
provided by the HTTPS endpoint nor provide client credentials so while the
connection will by encrypted, it will not provide any guarantees of integrity.
These connections **are not currently safe** to run over untrusted and/or
public networks.

### SSH Tunnels

[Google Container Engine](https://cloud.google.com/container-engine/docs/) uses
SSH tunnels to protect the Master -> Cluster communication paths. In this
configuration, the apiserver initiates an SSH tunnel to each node in the
cluster (connecting to the ssh server listening on port 22) and passes all
traffic destined for a kubelet, node, pod, or service through the tunnel.
This tunnel ensures that the traffic is not exposed outside of the private
GCE network in which the cluster is running.

### Kubelet TLS Bootstrap 

Kubernetes 1.4 introduces an experimental API for requesting certificates from a cluster-level 
Certificate Authority (CA). The first supported use of this API is the provisioning of TLS client 
certificates for kubelets. The proposal can be found [here](https://github.com/kubernetes/kubernetes/pull/20439)
and progress on the feature is being tracked as [feature #43](https://github.com/kubernetes/features/issues/43). 

##### apiserver configuration
You must provide a token file which specifies at least one "bootstrap token" assigned to a kubelet boostrap-specific group.
This group will later be used in the controller-manager configuration to scope approvals in the default approval
controller. As this feature matures, you should ensure tokens are bound to an RBAC policy which limits requests
using the bootstrap token to only be able to make requests related to certificate provisioning. When RBAC policy
is in place, scoping the tokens to a group will allow great flexibility (e.g. you could disable a particular
bootstrap group's access when you are done provisioning the nodes). 

##### Token auth file 
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

#### controller-manager configuration
The API for requesting certificates adds a certificate-issuing control loop to the KCM. This takes the form of a 
[cfssl](https://blog.cloudflare.com/introducing-cfssl/) local signer using assets on disk. 
Currently, all certificates issued have one year validity and a default set of key usages. 

##### Signing assets 
You must provide a Certificate Authority in order to provide the cryptographic materials necessary to issue certificates. 
This CA should be trusted by the apiserver for authentication with the `--client-ca-file=SOMEFILE` flag. The management
of the CA is beyond the scope of this document but it is recommended that you generate a dedicated CA for Kubernetes.
Both certificate and key are assumed to be PEM-encoded. 

The new controller-manager flags are: 
```
--cluster-signing-cert-file="/etc/path/to/kubernetes/ca/ca.crt" --cluster-signing-key-file="/etc/path/to/kubernetes/ca/ca.key"
``` 

##### Auto-approval 
To ease deployment and testing, the alpha version of the certificate request API includes a flag to approve all certificate 
requests made by users in a certain group. The intended use of this is to whitelist only the group corresponding to the bootstrap
token in the token file above. Use of this flag circumvents makes the "approval" process described below and is not recommended
for production use. 

The flag is: 
```
--insecure-experimental-approve-all-kubelet-csrs-for-group="system:kubelet-bootstrap"
``` 

#### kubelet configuration 
To use request a client cert from the certificate request API, the kubelet needs a path to a kubeconfig file that contains the
bootstrap auth token. If the file specified by `--kubeconfig` does not exist, the bootstrap kubeconfig is used to request a
client certificate from the API server. On success, a kubeconfig file referencing the generated key and obtained certificate
is written to the path specified by `--kubeconfig`. The certificate and key file will be stored in the directory pointed 
by `--cert-dir`.  The new flag is: 

```
--experimental-bootstrap-kubeconfig="/path/to/bootstrap/kubeconfig"
``` 

#### kubectl approval 
The signing controller does not immediately sign all certificate requests. Instead, it waits until they have been flagged with an 
"Approved" status by an appropriately-privileged user. This is intended to eventually be an automated process handled by an external
approval controller, but for the alpha version of the API it can be done manually by a cluster administrator using kubectl. 
An administrator can list CSRs with `kubectl get csr`, describe one in detail with `kubectl describe <name>`. There are 
[currently no direct approve/deny commands](https://github.com/kubernetes/kubernetes/issues/30163) so an approver will need to update
the Status field directly. A rough example of how to do this in bash which should only be used until the porcelain merges is available
at https://github.com/gtank/csrctl.
