---
title: 控制面到节点通信
content_type: concept
weight: 20
---

<!--
title: Control Plane-Node Communication
content_type: concept
weight: 20
aliases:
- master-node-communication
-->

<!-- overview -->

<!--
This document catalogs the communication paths between the control plane (really the apiserver) and the Kubernetes cluster. The intent is to allow users to customize their installation to harden the network configuration such that the cluster can be run on an untrusted network (or on fully public IPs on a cloud provider).
-->
本文列举控制面节点（确切说是 API 服务器）和 Kubernetes 集群之间的通信路径。
目的是为了让用户能够自定义他们的安装，以实现对网络配置的加固，使得集群能够在不可信的网络上
（或者在一个云服务商完全公开的 IP 上）运行。

<!-- body -->
<!--
## Node to Control Plane
Kubernetes has a "hub-and-spoke" API pattern. All API usage from nodes (or the pods they run) terminate at the apiserver (none of the other control plane components are designed to expose remote services). The apiserver is configured to listen for remote connections on a secure HTTPS port (typically 443) with one or more forms of client [authentication](/docs/reference/access-authn-authz/authentication/) enabled.
One or more forms of [authorization](/docs/reference/access-authn-authz/authorization/) should be enabled, especially if [anonymous requests](/docs/reference/access-authn-authz/authentication/#anonymous-requests) or [service account tokens](/docs/reference/access-authn-authz/authentication/#service-account-tokens) are allowed.
-->
## 节点到控制面

Kubernetes 采用的是中心辐射型（Hub-and-Spoke）API 模式。
所有从集群（或所运行的 Pods）发出的 API 调用都终止于 apiserver（其它控制面组件都没有被设计为可暴露远程服务）。
apiserver 被配置为在一个安全的 HTTPS 端口（443）上监听远程连接请求，
并启用一种或多种形式的客户端[身份认证](/zh/docs/reference/access-authn-authz/authentication/)机制。
一种或多种客户端[鉴权机制](/zh/docs/reference/access-authn-authz/authorization/)应该被启用，
特别是在允许使用[匿名请求](/zh/docs/reference/access-authn-authz/authentication/#anonymous-requests)
或[服务账号令牌](/zh/docs/reference/access-authn-authz/authentication/#service-account-tokens)的时候。

<!--
Nodes should be provisioned with the public root certificate for the cluster such that they can connect securely to the apiserver along with valid client credentials. A good approach is that the client credentials provided to the kubelet are in the form of a client certificate. See [kubelet TLS bootstrapping](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/) for automated provisioning of kubelet client certificates.
-->
应该使用集群的公共根证书开通节点，这样它们就能够基于有效的客户端凭据安全地连接 apiserver。
一种好的方法是以客户端证书的形式将客户端凭据提供给 kubelet。
请查看 [kubelet TLS 启动引导](/zh/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
以了解如何自动提供 kubelet 客户端证书。

<!--
Pods that wish to connect to the apiserver can do so securely by leveraging a service account so that Kubernetes will automatically inject the public root certificate and a valid bearer token into the pod when it is instantiated.
The `kubernetes` service (in all namespaces) is configured with a virtual IP address that is redirected (via kube-proxy) to the HTTPS endpoint on the apiserver.

The control plane components also communicate with the cluster apiserver over the secure port.
-->
想要连接到 apiserver 的 Pod 可以使用服务账号安全地进行连接。
当 Pod 被实例化时，Kubernetes 自动把公共根证书和一个有效的持有者令牌注入到 Pod 里。
`kubernetes` 服务（位于所有名字空间中）配置了一个虚拟 IP 地址，用于（通过 kube-proxy）转发
请求到 apiserver 的 HTTPS 末端。

控制面组件也通过安全端口与集群的 apiserver 通信。

<!--
As a result, the default operating mode for connections from the nodes and pods running on the nodes to the control plane is secured by default and can run over untrusted and/or public networks.
-->
这样，从集群节点和节点上运行的 Pod 到控制面的连接的缺省操作模式即是安全的，
能够在不可信的网络或公网上运行。

<!--
## Control Plane to node

There are two primary communication paths from the control plane (apiserver) to the nodes. The first is from the apiserver to the kubelet process which runs on each node in the cluster. The second is from the apiserver to any node, pod, or service through the apiserver's proxy functionality.
-->
## 控制面到节点

从控制面（apiserver）到节点有两种主要的通信路径。
第一种是从 apiserver 到集群中每个节点上运行的 kubelet 进程。
第二种是从 apiserver 通过它的代理功能连接到任何节点、Pod 或者服务。

<!--
### apiserver to kubelet

The connections from the apiserver to the kubelet are used for:

* Fetching logs for pods.
* Attaching (through kubectl) to running pods.
* Providing the kubelet's port-forwarding functionality.

These connections terminate at the kubelet's HTTPS endpoint. By default, the apiserver does not verify the kubelet's serving certificate, which makes the connection subject to man-in-the-middle attacks, and **unsafe** to run over untrusted and/or public networks.
-->
### API 服务器到 kubelet

从 apiserver 到 kubelet 的连接用于：

* 获取 Pod 日志
* 挂接（通过 kubectl）到运行中的 Pod
* 提供 kubelet 的端口转发功能。

这些连接终止于 kubelet 的 HTTPS 末端。
默认情况下，apiserver 不检查 kubelet 的服务证书。这使得此类连接容易受到中间人攻击，
在非受信网络或公开网络上运行也是 **不安全的**。

<!--
To verify this connection, use the `--kubelet-certificate-authority` flag to provide the apiserver with a root certificate bundle to use to verify the kubelet's serving certificate.

If that is not possible, use [SSH tunneling](/docs/concepts/architecture/master-node-communication/#ssh-tunnels) between the apiserver and kubelet if required to avoid connecting over an
untrusted or public network.

Finally, [Kubelet authentication and/or authorization](/docs/reference/command-line-tools-reference/kubelet-authentication-authorization/) should be enabled to secure the kubelet API.
-->
为了对这个连接进行认证，使用 `--kubelet-certificate-authority` 标志给 apiserver 
提供一个根证书包，用于 kubelet 的服务证书。

如果无法实现这点，又要求避免在非受信网络或公共网络上进行连接，可在 apiserver 和
kubelet 之间使用 [SSH 隧道](#ssh-tunnels)。

最后，应该启用
[kubelet 用户认证和/或鉴权](/zh/docs/reference/command-line-tools-reference/kubelet-authentication-authorization/)
来保护 kubelet API。

<!--
### apiserver to nodes, pods, and services

The connections from the apiserver to a node, pod, or service default to plain HTTP connections and are therefore neither authenticated nor encrypted. They can be run over a secure HTTPS connection by prefixing `https:` to the node, pod, or service name in the API URL, but they will not validate the certificate provided by the HTTPS endpoint nor provide client credentials so while the connection will be encrypted, it will not provide any guarantees of integrity. These connections **are not currently safe** to run over untrusted and/or public networks.
-->

### apiserver 到节点、Pod 和服务

从 apiserver 到节点、Pod 或服务的连接默认为纯 HTTP 方式，因此既没有认证，也没有加密。
这些连接可通过给 API URL 中的节点、Pod 或服务名称添加前缀 `https:` 来运行在安全的 HTTPS 连接上。
不过这些连接既不会验证 HTTPS 末端提供的证书，也不会提供客户端证书。
因此，虽然连接是加密的，仍无法提供任何完整性保证。
这些连接 **目前还不能安全地** 在非受信网络或公共网络上运行。

<!--
### SSH tunnels

Kubernetes supports SSH tunnels to protect the control plane to nodes communication paths. In this configuration, the apiserver initiates an SSH tunnel to each node in the cluster (connecting to the ssh server listening on port 22) and passes all traffic destined for a kubelet, node, pod, or service through the tunnel.
This tunnel ensures that the traffic is not exposed outside of the network in which the nodes are running.

SSH tunnels are currently deprecated so you shouldn't opt to use them unless you know what you are doing. The Konnectivity service is a replacement for this communication channel.
-->
### SSH 隧道 {#ssh-tunnels}

Kubernetes 支持使用 SSH 隧道来保护从控制面到节点的通信路径。在这种配置下，apiserver
建立一个到集群中各节点的 SSH 隧道（连接到在 22 端口监听的 SSH 服务）
并通过这个隧道传输所有到 kubelet、节点、Pod 或服务的请求。
这一隧道保证通信不会被暴露到集群节点所运行的网络之外。

SSH 隧道目前已被废弃。除非你了解个中细节，否则不应使用。
Konnectivity 服务是对此通信通道的替代品。

<!--
### Konnectivity service

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

As a replacement to the SSH tunnels, the Konnectivity service provides TCP level proxy for the control plane to cluster communication. The Konnectivity service consists of two parts: the Konnectivity server and the Konnectivity agents, running in the control plane network and the nodes network respectively. The Konnectivity agents initiate connections to the Konnectivity server and maintain the network connections.
After enabling the Konnectivity service, all control plane to nodes traffic goes through these connections.

Follow the [Konnectivity service task](/docs/tasks/extend-kubernetes/setup-konnectivity/) to set up the Konnectivity service in your cluster.
-->
### Konnectivity 服务

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

作为 SSH 隧道的替代方案，Konnectivity 服务提供 TCP 层的代理，以便支持从控制面到集群的通信。
Konnectivity 服务包含两个部分：Konnectivity 服务器和 Konnectivity 代理，分别运行在
控制面网络和节点网络中。Konnectivity 代理建立并维持到 Konnectivity 服务器的网络连接。
启用 Konnectivity 服务之后，所有控制面到节点的通信都通过这些连接传输。

请浏览 [Konnectivity 服务任务](/zh/docs/tasks/extend-kubernetes/setup-konnectivity/)
在你的集群中配置 Konnectivity 服务。

