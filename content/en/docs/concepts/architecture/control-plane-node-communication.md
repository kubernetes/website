---
reviewers:
- dchen1107
- liggitt
title: Control Plane-Node Communication
content_type: concept
weight: 20
aliases:
- master-node-communication
---

<!-- overview -->

This document catalogs the communication paths between the control plane (apiserver) and the Kubernetes cluster. The intent is to allow users to customize their installation to harden the network configuration such that the cluster can be run on an untrusted network (or on fully public IPs on a cloud provider).



<!-- body -->

## Node to Control Plane
Kubernetes has a "hub-and-spoke" API pattern. All API usage from nodes (or the pods they run) terminates at the apiserver. None of the other control plane components are designed to expose remote services. The apiserver is configured to listen for remote connections on a secure HTTPS port (typically 443) with one or more forms of client [authentication](/docs/reference/access-authn-authz/authentication/) enabled.
One or more forms of [authorization](/docs/reference/access-authn-authz/authorization/) should be enabled, especially if [anonymous requests](/docs/reference/access-authn-authz/authentication/#anonymous-requests) or [service account tokens](/docs/reference/access-authn-authz/authentication/#service-account-tokens) are allowed.

Nodes should be provisioned with the public root certificate for the cluster such that they can connect securely to the apiserver along with valid client credentials. A good approach is that the client credentials provided to the kubelet are in the form of a client certificate. See [kubelet TLS bootstrapping](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/) for automated provisioning of kubelet client certificates.

Pods that wish to connect to the apiserver can do so securely by leveraging a service account so that Kubernetes will automatically inject the public root certificate and a valid bearer token into the pod when it is instantiated.
The `kubernetes` service (in all namespaces) is configured with a virtual IP address that is redirected (via kube-proxy) to the HTTPS endpoint on the apiserver.

The control plane components also communicate with the cluster apiserver over the secure port.

As a result, the default operating mode for connections from the nodes and pods running on the nodes to the control plane is secured by default and can run over untrusted and/or public networks.

## Control Plane to node

There are two primary communication paths from the control plane (apiserver) to the nodes. The first is from the apiserver to the kubelet process which runs on each node in the cluster. The second is from the apiserver to any node, pod, or service through the apiserver's proxy functionality.

### apiserver to kubelet

The connections from the apiserver to the kubelet are used for:

* Fetching logs for pods.
* Attaching (through kubectl) to running pods.
* Providing the kubelet's port-forwarding functionality.

These connections terminate at the kubelet's HTTPS endpoint. By default, the apiserver does not verify the kubelet's serving certificate, which makes the connection subject to man-in-the-middle attacks and **unsafe** to run over untrusted and/or public networks.

To verify this connection, use the `--kubelet-certificate-authority` flag to provide the apiserver with a root certificate bundle to use to verify the kubelet's serving certificate.

If that is not possible, use [SSH tunneling](#ssh-tunnels) between the apiserver and kubelet if required to avoid connecting over an
untrusted or public network.

Finally, [Kubelet authentication and/or authorization](/docs/reference/command-line-tools-reference/kubelet-authentication-authorization/) should be enabled to secure the kubelet API.

### apiserver to nodes, pods, and services

The connections from the apiserver to a node, pod, or service default to plain HTTP connections and are therefore neither authenticated nor encrypted. They can be run over a secure HTTPS connection by prefixing `https:` to the node, pod, or service name in the API URL, but they will not validate the certificate provided by the HTTPS endpoint nor provide client credentials. So while the connection will be encrypted, it will not provide any guarantees of integrity. These connections **are not currently safe** to run over untrusted or public networks.

### SSH tunnels

Kubernetes supports SSH tunnels to protect the control plane to nodes communication paths. In this configuration, the apiserver initiates an SSH tunnel to each node in the cluster (connecting to the ssh server listening on port 22) and passes all traffic destined for a kubelet, node, pod, or service through the tunnel.
This tunnel ensures that the traffic is not exposed outside of the network in which the nodes are running.

SSH tunnels are currently deprecated, so you shouldn't opt to use them unless you know what you are doing. The Konnectivity service is a replacement for this communication channel.

### Konnectivity service

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

As a replacement to the SSH tunnels, the Konnectivity service provides TCP level proxy for the control plane to cluster communication. The Konnectivity service consists of two parts: the Konnectivity server in the control plane network and the Konnectivity agents in the nodes network. The Konnectivity agents initiate connections to the Konnectivity server and maintain the network connections.
After enabling the Konnectivity service, all control plane to nodes traffic goes through these connections.

Follow the [Konnectivity service task](/docs/tasks/extend-kubernetes/setup-konnectivity/) to set up the Konnectivity service in your cluster.
