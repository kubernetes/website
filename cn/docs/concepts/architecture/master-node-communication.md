---
approvers:
- dchen1107
- roberthbailey
- liggitt
title: Master 节点通信
---

<!--
title: Master-Node communication
-->

* TOC
{:toc}

<!--
## Overview
-->
## 概览

<!--
This document catalogs the communication paths between the master (really the
apiserver) and the Kubernetes cluster. The intent is to allow users to
customize their installation to harden the network configuration such that
the cluster can be run on an untrusted network (or on fully public IPs on a
cloud provider).
-->
本文对 Master 节点（确切说是 apiserver）和 Kubernetes 集群之间的通信路径进行了分类。目的是为了让用户能够自定义他们的安装，对网络配置进行加固，使得集群能够在不可信的网络上（或者在一个云服务商完全公共的 IP 上）运行。

<!--
## Cluster -> Master
-->
## Cluster -> Master

<!--
All communication paths from the cluster to the master terminate at the
apiserver (none of the other master components are designed to expose remote
services). In a typical deployment, the apiserver is configured to listen for
remote connections on a secure HTTPS port (443) with one or more forms of
client [authentication](/docs/admin/authentication/) enabled. One or more forms
of [authorization](/docs/admin/authorization/) should be enabled, especially
if [anonymous requests](/docs/admin/authentication/#anonymous-requests) or
[service account tokens](/docs/admin/authentication/#service-account-tokens)
are allowed.
-->
所有从集群到 master 的通信路径都终止于 apiserver（其它 master 组件没有被设计为可暴露远程服务）。在一个典型的部署中，apiserver 被配置为在一个安全的 HTTPS 端口（443）上监听远程连接并启用一种或多种形式的客户端[身份认证](/docs/admin/authentication/)机制。一种或多种客户端[身份认证](/docs/admin/authentication/)机制应该被启用，特别是在允许使用 [匿名请求](/docs/admin/authentication/#anonymous-requests) 或 [service account tokens](/docs/admin/authentication/#service-account-tokens) 的时候。

<!--
Nodes should be provisioned with the public root certificate for the cluster
such that they can connect securely to the apiserver along with valid client
credentials. For example, on a default GCE deployment, the client credentials
provided to the kubelet are in the form of a client certificate. See
[kubelet TLS bootstrapping](/docs/admin/kubelet-tls-bootstrapping/) for
automated provisioning of kubelet client certificates.
-->
应该使用集群的公共根证书开通节点，如此它们就能够基于有效的客户端凭据安全的连接 apiserver。例如：在一个默认的 GCE 部署中，客户端凭据以客户端证书的形式提供给 kubelet。请查看 [kubelet TLS bootstrapping](/docs/admin/kubelet-tls-bootstrapping/) 获取如何自动提供 kubelet 客户端证书。

<!--
Pods that wish to connect to the apiserver can do so securely by leveraging a
service account so that Kubernetes will automatically inject the public root
certificate and a valid bearer token into the pod when it is instantiated.
The `kubernetes` service (in all namespaces) is configured with a virtual IP
address that is redirected (via kube-proxy) to the HTTPS endpoint on the
apiserver.
-->
想要连接到 apiserver 的 Pod 可以使用一个 service account 安全的进行连接。这种情况下，当 Pod 被实例化时 Kubernetes 将自动的把公共根证书和一个有效的不记名令牌注入到 pod 里。`kubernetes` service （所有 namespaces 中）都配置了一个虚拟 IP 地址，用于转发（通过 kube-proxy）请求到 apiserver 的 HTTPS endpoint。

<!--
The master components communicate with the cluster apiserver over the
insecure (not encrypted or authenticated) port. This port is typically only
exposed on the localhost interface of the master machine, so that the master
components, all running on the same machine, can communicate with the
cluster apiserver. Over time, the master components will be migrated to use
the secure port with authentication and authorization (see
[#13598](https://github.com/kubernetes/kubernetes/issues/13598)).
-->
Master 组件通过非安全（没有加密或认证）端口和集群的 apiserver 通信。这个端口通常只在 master 节点的 localhost 接口暴露，这样，所有在相同机器上运行的 master 组件就能和集群的 apiserver 通信。一段时间以后，master 组件将变为使用带身份认证和权限验证的安全端口（查看[#13598](https://github.com/kubernetes/kubernetes/issues/13598)）。

<!--
As a result, the default operating mode for connections from the cluster
(nodes and pods running on the nodes) to the master is secured by default
and can run over untrusted and/or public networks.
-->
这样的结果使得从集群（在节点上运行的 node 和 pod）到 master 的缺省连接操作模式默认被保护，能够在不可信或公网中运行。

<!--
## Master -> Cluster
-->
## Master -> Cluster

<!--
There are two primary communication paths from the master (apiserver) to the
cluster. The first is from the apiserver to the kubelet process which runs on
each node in the cluster. The second is from the apiserver to any node, pod,
or service through the apiserver's proxy functionality.
-->
从 master（apiserver）到集群有两种主要的通信路径。第一种是从 apiserver 到集群中每个节点上运行的 kubelet 进程。第二种是从 apiserver 通过它的代理功能到任何 node、pod 或者 service。

<!--
### apiserver -> kubelet
-->
### apiserver -> kubelet

<!--
The connections from the apiserver to the kubelet are used for fetching logs
for pods, attaching (through kubectl) to running pods, and using the kubelet's
port-forwarding functionality. These connections terminate at the kubelet's
HTTPS endpoint.
-->
从 apiserver 到 kubelet 的连接用于获取 pod 日志、连接（通过 kubectl）运行中的 pod，以及使用 kubele 的端口转发功能。这些连接终止于 kubelet 的 HTTPS endpoint。

<!--
By default, the apiserver does not verify the kubelet's serving certificate,
which makes the connection subject to man-in-the-middle attacks, and
**unsafe** to run over untrusted and/or public networks.
-->
默认的，apiserver 不会验证 kubelet 的服务证书，这会导致连接遭到中间人攻击，因而在不可信或公共网络上是不安全的。

<!--
To verify this connection, use the `--kubelet-certificate-authority` flag to
provide the apiserver with a root certificates bundle to use to verify the
kubelet's serving certificate.
-->
为了对这个连接进行认证，请使用 `--kubelet-certificate-authority` 标记给 apiserver 提供一个根证书捆绑，用于 kubelet 的服务证书。

<!--
If that is not possible, use [SSH tunneling](/docs/concepts/architecture/master-node-communication/#ssh-tunnels)
between the apiserver and kubelet if required to avoid connecting over an
untrusted or public network.
-->
如果这样不可能，又要求避免在不可信的或公共的网络上进行连接，请在 apiserver 和 kubelet 之间使用 [SSH 隧道](/docs/concepts/architecture/master-node-communication/#ssh-tunnels)。

<!--
Finally, [Kubelet authentication and/or authorization](/docs/admin/kubelet-authentication-authorization/)
should be enabled to secure the kubelet API.
-->
最后，应该启用[Kubelet 用户认证和/或权限认证](/docs/admin/kubelet-authentication-authorization/)来保护 kubelet API。

<!--
### apiserver -> nodes, pods, and services
-->
### apiserver -> nodes, pods, and services

<!--
The connections from the apiserver to a node, pod, or service default to plain
HTTP connections and are therefore neither authenticated nor encrypted. They
can be run over a secure HTTPS connection by prefixing `https:` to the node,
pod, or service name in the API URL, but they will not validate the certificate
provided by the HTTPS endpoint nor provide client credentials so while the
connection will be encrypted, it will not provide any guarantees of integrity.
These connections **are not currently safe** to run over untrusted and/or
public networks.
-->
从 apiserver 到 node、pod 或者 service 的连接默认为纯 HTTP 方式，因此既没有认证，也没有加密。它们能够通过给 API URL 中的 node、pod 或 service 名称添加前缀 `https:` 来运行在安全的 HTTPS 连接上。但它们即不会认证 HTTPS endpoint 提供的证书，也不会提供客户端证书。这样虽然连接是加密的，但它不会提供任何完整性保证。这些连接**目前还不能安全的**在不可信的或公共的网络上运行。

<!--
### SSH Tunnels
-->
### SSH 隧道

<!--
[Google Container Engine](https://cloud.google.com/container-engine/docs/) uses
SSH tunnels to protect the Master -> Cluster communication paths. In this
configuration, the apiserver initiates an SSH tunnel to each node in the
cluster (connecting to the ssh server listening on port 22) and passes all
traffic destined for a kubelet, node, pod, or service through the tunnel.
This tunnel ensures that the traffic is not exposed outside of the private
GCE network in which the cluster is running.
-->
[Google Container Engine](https://cloud.google.com/container-engine/docs/) 使用 SSH 隧道保护 Master -> Cluster 通信路径。在这种配置下，apiserver 发起一个到集群中每个节点的 SSH 隧道（连接到在 22 端口监听的 ssh 服务）并通过这个隧道传输所有到 kubelet、node、pod 或者 service 的流量。这个隧道保证流量不会在集群运行的私有 GCE 网络之外暴露。
