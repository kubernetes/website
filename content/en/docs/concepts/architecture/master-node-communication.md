---
reviewers:
- dchen1107
- roberthbailey
- liggitt
title: Master-Node communication
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

This document catalogs the communication paths between the master (really the
apiserver) and the Kubernetes cluster. The intent is to allow users to
customize their installation to harden the network configuration such that
the cluster can be run on an untrusted network (or on fully public IPs on a
cloud provider).

{{% /capture %}}

{{< toc >}}

{{% capture body %}}

## Cluster -> Master

All communication paths from the cluster to the master terminate at the
apiserver (none of the other master components are designed to expose remote
services). In a typical deployment, the apiserver is configured to listen for
remote connections on a secure HTTPS port (443) with one or more forms of
client [authentication](/docs/admin/authentication/) enabled. One or more forms
of [authorization](/docs/admin/authorization/) should be enabled, especially
if [anonymous requests](/docs/admin/authentication/#anonymous-requests) or
[service account tokens](/docs/admin/authentication/#service-account-tokens)
are allowed.

Nodes should be provisioned with the public root certificate for the cluster
such that they can connect securely to the apiserver along with valid client
credentials. For example, on a default GCE deployment, the client credentials
provided to the kubelet are in the form of a client certificate. See
[kubelet TLS bootstrapping](/docs/admin/kubelet-tls-bootstrapping/) for
automated provisioning of kubelet client certificates.

Pods that wish to connect to the apiserver can do so securely by leveraging a
service account so that Kubernetes will automatically inject the public root
certificate and a valid bearer token into the pod when it is instantiated.
The `kubernetes` service (in all namespaces) is configured with a virtual IP
address that is redirected (via kube-proxy) to the HTTPS endpoint on the
apiserver.

The master components also communicate with the cluster apiserver over the secure port.

As a result, the default operating mode for connections from the cluster
(nodes and pods running on the nodes) to the master is secured by default
and can run over untrusted and/or public networks.

## Master -> Cluster

There are two primary communication paths from the master (apiserver) to the
cluster. The first is from the apiserver to the kubelet process which runs on
each node in the cluster. The second is from the apiserver to any node, pod,
or service through the apiserver's proxy functionality.

### apiserver -> kubelet

The connections from the apiserver to the kubelet are used for:

  * Fetching logs for pods.
  * Attaching (through kubectl) to running pods.
  * Providing the kubelet's port-forwarding functionality. 

These connections terminate at the kubelet's HTTPS endpoint. By default, 
the apiserver does not verify the kubelet's serving certificate,
which makes the connection subject to man-in-the-middle attacks, and
**unsafe** to run over untrusted and/or public networks.

To verify this connection, use the `--kubelet-certificate-authority` flag to
provide the apiserver with a root certificate bundle to use to verify the
kubelet's serving certificate.

If that is not possible, use [SSH tunneling](/docs/concepts/architecture/master-node-communication/#ssh-tunnels)
between the apiserver and kubelet if required to avoid connecting over an
untrusted or public network.

Finally, [Kubelet authentication and/or authorization](/docs/admin/kubelet-authentication-authorization/)
should be enabled to secure the kubelet API.

### apiserver -> nodes, pods, and services

The connections from the apiserver to a node, pod, or service default to plain
HTTP connections and are therefore neither authenticated nor encrypted. They
can be run over a secure HTTPS connection by prefixing `https:` to the node,
pod, or service name in the API URL, but they will not validate the certificate
provided by the HTTPS endpoint nor provide client credentials so while the
connection will be encrypted, it will not provide any guarantees of integrity.
These connections **are not currently safe** to run over untrusted and/or
public networks.

{{% /capture %}}
