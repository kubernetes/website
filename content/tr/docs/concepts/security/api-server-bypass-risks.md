---
title: Kubernetes API Server Bypass Risks
description: >
  Security architecture information relating to the API server and other components
content_type: concept
weight: 90
---

<!-- overview -->

The Kubernetes API server is the main point of entry to a cluster for external parties
(users and services) interacting with it.

As part of this role, the API server has several key built-in security controls, such as
audit logging and {{< glossary_tooltip text="admission controllers" term_id="admission-controller" >}}.
However, there are ways to modify the configuration
or content of the cluster that bypass these controls.

This page describes the ways in which the security controls built into the
Kubernetes API server can be bypassed, so that cluster operators
and security architects can ensure that these bypasses are appropriately restricted.

<!-- body -->

## Static Pods {#static-pods}

The {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} on each node loads and
directly manages any manifests that are stored in a named directory or fetched from
a specific URL as [*static Pods*](/docs/tasks/configure-pod-container/static-pod) in
your cluster. The API server doesn't manage these static Pods. An attacker with write
access to this location could modify the configuration of static pods loaded from that
source, or could introduce new static Pods.

Static Pods are restricted from accessing other objects in the Kubernetes API. For example,
you can't configure a static Pod to mount a Secret from the cluster. However, these Pods can
take other security sensitive actions, such as using `hostPath` mounts from the underlying
node.

By default, the kubelet creates a {{< glossary_tooltip text="mirror pod" term_id="mirror-pod">}}
so that the static Pods are visible in the Kubernetes API. However, if the attacker uses an invalid
namespace name when creating the Pod, it will not be visible in the Kubernetes API and can only
be discovered by tooling that has access to the affected host(s).

If a static Pod fails admission control, the kubelet won't register the Pod with the
API server. However, the Pod still runs on the node. For more information, refer to
[kubeadm issue #1541](https://github.com/kubernetes/kubeadm/issues/1541#issuecomment-487331701).

### Mitigations {#static-pods-mitigations}

- Only [enable the kubelet static Pod manifest functionality](/docs/tasks/configure-pod-container/static-pod/#static-pod-creation)
  if required by the node.
- If a node uses the static Pod functionality, restrict filesystem access to the static Pod manifest directory
  or URL to users who need the access.
- Restrict access to kubelet configuration parameters and files to prevent an attacker setting
  a static Pod path or URL.
- Regularly audit and centrally report all access to directories or web storage locations that host
  static Pod manifests and kubelet configuration files.

## The kubelet API {#kubelet-api}

The kubelet provides an HTTP API that is typically exposed on TCP port 10250 on cluster
worker nodes. The API might also be exposed on control plane nodes depending on the Kubernetes
distribution in use. Direct access to the API allows for disclosure of information about
the pods running on a node, the logs from those pods, and execution of commands in
every container running on the node.

When Kubernetes cluster users have RBAC access to `Node` object sub-resources, that access
serves as authorization to interact with the kubelet API. The exact access depends on
which sub-resource access has been granted, as detailed in
[kubelet authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/#kubelet-authorization).

Direct access to the kubelet API is not subject to admission control and is not logged
by Kubernetes audit logging. An attacker with direct access to this API may be able to
bypass controls that detect or prevent certain actions.

The kubelet API can be configured to authenticate requests in a number of ways.
By default, the kubelet configuration allows anonymous access. Most Kubernetes providers
change the default to use webhook and certificate authentication. This lets the control plane
ensure that the caller is authorized to access the `nodes` API resource or sub-resources.
The default anonymous access doesn't make this assertion with the control plane.

### Mitigations

- Restrict access to sub-resources of the `nodes` API object using mechanisms such as
  [RBAC](/docs/reference/access-authn-authz/rbac/). Only grant this access when required,
  such as by monitoring services.
- Restrict access to the kubelet port. Only allow specified and trusted IP address
  ranges to access the port.
- Ensure that [kubelet authentication](/docs/reference/access-authn-authz/kubelet-authn-authz/#kubelet-authentication).
  is set to webhook or certificate mode.
- Ensure that the unauthenticated "read-only" Kubelet port is not enabled on the cluster.

## The etcd API

Kubernetes clusters use etcd as a datastore. The `etcd` service listens on TCP port 2379.
The only clients that need access are the Kubernetes API server and any backup tooling
that you use. Direct access to this API allows for disclosure or modification of any
data held in the cluster.

Access to the etcd API is typically managed by client certificate authentication.
Any certificate issued by a certificate authority that etcd trusts allows full access
to the data stored inside etcd.

Direct access to etcd is not subject to Kubernetes admission control and is not logged
by Kubernetes audit logging. An attacker who has read access to the API server's
etcd client certificate private key (or can create a new trusted client certificate) can gain
cluster admin rights by accessing cluster secrets or modifying access rules. Even without
elevating their Kubernetes RBAC privileges, an attacker who can modify etcd can retrieve any API object
or create new workloads inside the cluster.

Many Kubernetes providers configure
etcd to use mutual TLS (both client and server verify each other's certificate for authentication).
There is no widely accepted implementation of authorization for the etcd API, although
the feature exists. Since there is no authorization model, any certificate
with client access to etcd can be used to gain full access to etcd. Typically, etcd client certificates
that are only used for health checking can also grant full read and write access.

### Mitigations {#etcd-api-mitigations}

- Ensure that the certificate authority trusted by etcd is used only for the purposes of
  authentication to that service.
- Control access to the private key for the etcd server certificate, and to the API server's
  client certificate and key.
- Consider restricting access to the etcd port at a network level, to only allow access
  from specified and trusted IP address ranges.

## Container runtime socket {#runtime-socket}

On each node in a Kubernetes cluster, access to interact with containers is controlled
by the container runtime (or runtimes, if you have configured more than one). Typically,
the container runtime exposes a Unix socket that the kubelet can access. An attacker with
access to this socket can launch new containers or interact with running containers.

At the cluster level, the impact of this access depends on whether the containers that
run on the compromised node have access to Secrets or other confidential
data that an attacker could use to escalate privileges to other worker nodes or to
control plane components.

### Mitigations {#runtime-socket-mitigations}

- Ensure that you tightly control filesystem access to container runtime sockets.
  When possible, restrict this access to the `root` user.
- Isolate the kubelet from other components running on the node, using
  mechanisms such as Linux kernel namespaces.
- Ensure that you restrict or forbid the use of [`hostPath` mounts](/docs/concepts/storage/volumes/#hostpath)
  that include the container runtime socket, either directly or by mounting a parent
  directory. Also `hostPath` mounts must be set as read-only to mitigate risks
  of attackers bypassing directory restrictions.
- Restrict user access to nodes, and especially restrict superuser access to nodes.
