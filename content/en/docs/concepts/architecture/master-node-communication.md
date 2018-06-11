---
reviewers:
- dchen1107
- roberthbailey
- liggitt
title: Master-Node communication
weight: 20
---

{{< toc >}}

## Overview

This document catalogs the communication paths between the master (really the
apiserver) and the Kubernetes cluster. The intent is to allow users to
customize their installation to harden the network configuration such that
the cluster can be run on an untrusted network (or on fully public IPs on a
cloud provider).

![](/images/docs/master-node-communication.png)

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

### SSH Tunnels

[Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) uses
SSH tunnels to protect the Master -> Cluster communication paths. In this
configuration, the apiserver initiates an SSH tunnel to each node in the
cluster (connecting to the ssh server listening on port 22) and passes all
traffic destined for a kubelet, node, pod, or service through the tunnel.
This tunnel ensures that the traffic is not exposed outside of the private
GCE network in which the cluster is running.



## Configuring communication ports
{{< note >}}
**Note:** The difference between specifying *0.0.0.0* or *127.0.0.1* as a bind `--address` : *0.0.0.0* will bind to ALL interfaces on the host. *127.0.0.1* will ONLY bind to localhost.
{{< /note >}}


### kube-apiserver

| Argument                       | Default           | Description                              |
| ------------------------------ | ----------------- | ---------------------------------------- |
| `--advertise-address`            | `--bind-address`  | The IP address on which to advertise the apiserver to members of the cluster. This address must be reachable by the rest of the cluster |
| `--bind-address`                 | default interface | The IP address on which to listen for the `--secure-port` port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. |
| `--etcd-servers`                 |                   | List of etcd servers to connect with (*scheme://ip:port*), comma separated. |
| `--insecure-bind-address`        | 127.0.0.1         | The IP address on which to serve the `--insecure-port` |
| `--insecure-port`                | 8080              | The port on which to serve unsecured, unauthenticated access. It is assumed that firewall rules are set up such that this port is not reachable from outside of the cluster and that port 443 on the cluster's public address is proxied to this port. This is performed by nginx in the default setup. |
| `--kubernetes-service-node-port` |                   | If non-zero, the Kubernetes master service (which apiserver creates/maintains) will be of type NodePort, using this as the value of the port. If zero, the Kubernetes master service will be of type ClusterIP. |
| `--secure-port`                  | 6443              | The port on which to serve HTTPS with authentication and authorization. Set to 0 to disable |
| `--service-node-port-range`      | 30000-32767       | A port range to reserve for services with NodePort visibility. |


### kube-controller-manager

| Argument  | Default | Description |
| --------- | ------- | --------- |
| `--master`     |                             | The address of the Kubernetes API server (overrides any value in kubeconfig) |
| `--kubeconfig` | /var/lib/kubelet/kubeconfig | Path to a kubeconfig file, specifying how to connect / authenticate to the API server. |
| `--address` | 0.0.0.0 |  |
| `--port`    | 10252   |    |

### cloud-controller-manager

| Argument  | Default | Description |
| --------- | ------- | ------- |
| `--master`     |                             | The address of the Kubernetes API server (overrides any value in kubeconfig) |
| `--kubeconfig` | /var/lib/kubelet/kubeconfig | Path to a kubeconfig file, specifying how to connect / authenticate to the API server. |
| `--address` | 0.0.0.0 |  |
| `--port`    | 10253   |    |


### kube-scheduler

| Argument  | Default | Description |
| --------- | ------- | ------- |
| `--master`     |                             | The address of the Kubernetes API server (overrides any value in kubeconfig) |
| `--kubeconfig` | /var/lib/kubelet/kubeconfig | Path to a kubeconfig file, specifying how to connect / authenticate to the API server. |
| `--address` |         |         |
| `--port`    | 10251   |    |


### kubelet

| Argument               | Default                     | Description                              |
| ---------------------- | --------------------------- | ---------------------------------------- |
| `--master`     |                             | The address of the Kubernetes API server (overrides any value in kubeconfig) |
| `--kubeconfig` | /var/lib/kubelet/kubeconfig | Path to a kubeconfig file, specifying how to connect / authenticate to the API server. |
| `--address`              | 0.0.0.0                     | The IP address for the Kubelet to serve on |
| `--cadvisor-port`        | 4194                        | Set to `0` to disable                 |
| `--docker-endpoint`      | unix:///var/run/docker.sock |                                          |
| `--healthz-bind-address` | 127.0.0.1                   | Set to `0.0.0.0` for all interfaces |
| `--healthz-port`         | 10248                       | Set to `0` to disable                |
| `--pod-manifest-path`    |                             | Path to the directory containing pod manifest files to run, or the path to a single pod manifest file. Files starting with dots will be ignored. |
| `--port`                 | 10250                       | The port for the Kubelet to serve on.    |
| `--read-only-port`       | 10255                       | The read-only port for the Kubelet to serve on with no authentication/authorization. Set to `0` to disable |

### kube-proxy

| Argument               | Default         | Description                              |
| ---------------------- | --------------- | ---------------------------------------- |
| `--master`     |                             | The address of the Kubernetes API server (overrides any value in kubeconfig) |
| `--kubeconfig` | /var/lib/kubelet/kubeconfig | Path to a kubeconfig file, specifying how to connect / authenticate to the API server. |
| `--bind-address`         | 0.0.0.0         |                                          |
| `--healthz-bind-address` | 0.0.0.0         |                                          |
| `--healthz-port`         | 10256           |                                          |
| `--metrics-bind-address` | 127.0.0.1:10249 | The `IP:PORT` for the metrics server to serve on. |
| `--proxy-port-range`     | 0-0             | Range of host ports (`beginPort-endPort`, inclusive) that may be consumed in order to proxy service traffic. If unspecified (`0-0`) then ports will be randomly chosen. |


