---
title: Kubernetes API server bypass risks
description: >
  Security architecture information relating to the API server and other components
content_type: concept
---

<!-- overview -->

The Kubernetes API server is the main point of entry to a cluster for external parties 
(users and services) interacting with it. 

As part of this role, several key security controls are present in the API server;
for example: audit logging and admission control. However there are other ways in which 
the configuration or content of the cluster may be modified, which will bypass those controls.

This page documents the ways that such a bypass could occur, so that cluster operators
and security architects can ensure that they are appropriately restricted.

<!-- body -->

## Static Pods

The kubelet has [functionality](/docs/tasks/configure-pod-container/static-pod) which will load any manifests stored in a named directory,
or fetched from a specific URL, as workloads in your cluster. An attacker with write access
to this location could modify the configuration of static pods loaded from that source,
or could introduce new static pods.

Static pods have certain restrictions in place which prevent them from accessing other
objects in the Kubernetes API (for example they can't be configured to mount a Secret from the cluster);
however they can take other security sensitive actions, like using `hostPath` mounts
from the underlying node.

In the general case static pods are visible in the Kubernetes API as a {{< glossary_tooltip text="mirror pod" term_id="mirror-pod">}}
is created by the kubelet, however if the attacker uses an invalid namespace name when
creating the pod, it will not be visible via the Kubernetes API and can only be discovered
by tooling which has access to the affected host(s).

Creation of static pods is not subject to admission control, however if pod creation 
fails admission control it will prevent the pod being registered by the API server, 
although the pod will still run ([reference](https://github.com/kubernetes/kubeadm/issues/1541#issuecomment-487331701)). 

### Mitigations

- The static pod manifest feature should only be enabled on nodes where this is 
  required for operation of the cluster.
- Where it is used, access to the static pod manifest directory and/or URL should
  be restricted to administrative staff only.
- Access to kubelet configuration parameters and files should be restricted to prevent
  an attacker setting a static pod path/URL.
- All access to directories or web storage that hosts static manifests and Kubelet
  configuration files should be audited and centrally reported.

## Kubelet API

The kubelet provides an HTTP API that is typically exposed on TCP port 10250 on cluster
worker nodes, and potentially on control-plane nodes depending on the Kubernetes
distribution in use. Direct access to the API allows for disclosure of information about
the pods running on a node, the logs from those pods, and also execution of commands in
every container running on the node.

When Kubernetes cluster users have RBAC rights to Node object sub-resources, that access
serves as authorization to interact with the kubelet API. The exact access will depend on
which sub-resource access has been granted, as detailed in [kubelet authorization](https://kubernetes.io/docs/reference/access-authn-authz/kubelet-authn-authz/#kubelet-authorization).

Direct access to the kubelet API is not subject to admission control and is not logged
by Kubernetes audit logging. As such, an attacker who can use this API may be able to
controls otherwise intended to detect/prevent certain actions.

The kubelet API can be configured to authenticate requests in a number of ways. 
By default the kubelet configuration is to allow anonymous access. Most Kubernetes providers
set configuration to use webhook and certificate authentication. This would enable the
control plane to ensure that the caller is authorized to access the `nodes` API or its
subresource. If set to anonymous access, there is no such assertion. 



### Mitigations

- Minimize access to subresources of the `nodes` API, using mechanisms such as RBAC.
  This access is likely to be needed for some services (for example: monitoring services)
  , but should not be provided where not needed.
- Consider restricting access to the kubelet port, to only allow access from specified
  and trusted IP address ranges.
- Ensure that kubelet authentication is set to webhook or certificate mode. 

## Etcd API

Kubernetes clusters use etcd as a datastore. The etcd service listens on TCP port 2379;
the only clients that need access are the Kubernetes API server and any backup tooling
that you use. Direct access to this API allows for disclosure or modification of any
data held in the cluster.

Access to the etcd API is typically managed by client certificate authentication.
Any certificate issued by a certificate authority that etcd trusts will allow full access
to the data stored inside etcd.

Direct access to etcd is not subject to Kubernetes admission control and is not logged
by Kubernetes audit logging. An attacker who is able to gain read access to the API server's
etcd client certificate (or is able create a new trusted client certificate) can gain
cluster admin rights by accessing cluster secrets or modifying access rules. Even without
elevating their privileges, an attacker who can modify etcd can retrieve any API object
or create new workloads inside the cluster.

You can configure etcd in a number of ways. For the most part Kubernetes providers configure 
etcd to use mutual TLS (both client and server verify each other's certificate for authentication).
There is not a widely accepted implementation of authorization for the etcd API, although
the feature does exist. Since there is no authorization model, this means that any certificate
with client access can be used to gain full access to etcd. Typically, client certificates
that are only used for health checksing can also grant full read and write access.

One way in which an attacker can make use of stolen etcd credentials is to create a 
special-purpose API server to manipulate resources in a cluster. All audit events would
stay with the API server that handled the request and would therefore not be present
in the audit log for the target cluster. This particular attack would be very difficult
to detect, and easier to execute than creating data in etcd directly.

### Mitigations

- Ensure that the certificate authority trusted by etcd is used only for the purposes of
  authentication to that service.
- Control access to the private key for the etcd server certificate, and to the API server's
  client certificate and key.
- Consider restricting access to the the etcd port at a network level, to only allow access
  from specified and trusted IP address ranges.


## Container runtime socket

On each node in a Kubernetes cluster, access to interact with containers is controlled 
via the container runtime (or runtimes, if you have configured more than one). Typically,
the container runtime exposes a Unix socket that the kubelet can access. An attacker with
access to this socket can launch new containers or interact with running containers.

The impact of this, at a cluster level, is likely to depend on whether there are containers
running on the compromised node which have Secrets, or other confidential data, that
could be used to escalate privileges to other nodes or cluster control plane components.

### Mitigations

- Ensure that access permissions to container runtime sockets are tightly defined. 
  Typically, you restrict this access to the `root` user.
- Isolate the kubelet from other components running on the node, using container-like
  mechanisms such as Linux kernel namespaces.
- Ensure that `hostPath` mounts which include the container runtime socket are restricted
  (or even forbidden).
- Restrict user access to nodes, and especially restrict superuser access to nodes.