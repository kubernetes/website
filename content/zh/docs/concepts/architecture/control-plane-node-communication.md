---
title: 控制平面节点通信
content_template: templates/concept
weight: 20
aliases:
- master-node-communication
---

{{% capture overview %}}

<!--
This document catalogs the communication paths between the control plane (really the apiserver) and the Kubernetes cluster. The intent is to allow users to customize their installation to harden the network configuration such that the cluster can be run on an untrusted network (or on fully public IPs on a cloud provider).
-->
本文档对控制平面（实际上是 apiserver）和 Kubernetes 集群间的通信路径进行了分类。
目的是允许用户自定义 Kubernetes 环境来加强网络配置，以便在非受信网络（或云提供商的完全公共 IP）上运行集群。

{{% /capture %}}

{{% capture body %}}

<!--
## Node to Control Plane
All communication paths from the nodes to the control plane terminate at the apiserver (none of the other master components are designed to expose remote services). In a typical deployment, the apiserver is configured to listen for remote connections on a secure HTTPS port (443) with one or more forms of client [authentication](/docs/reference/access-authn-authz/authentication/) enabled.
One or more forms of [authorization](/docs/reference/access-authn-authz/authorization/) should be enabled, especially if [anonymous requests](/docs/reference/access-authn-authz/authentication/#anonymous-requests) or [service account tokens](/docs/reference/access-authn-authz/authentication/#service-account-tokens) are allowed.

Nodes should be provisioned with the public root certificate for the cluster such that they can connect securely to the apiserver along with valid client credentials. For example, on a default GKE deployment, the client credentials provided to the kubelet are in the form of a client certificate. See [kubelet TLS bootstrapping](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/) for automated provisioning of kubelet client certificates.
-->
## 节点到控制平面

所有从节点到控制平面的通信路径都终止于 apiserver（其他 master 组件均未设计为公开远程服务）。在典型的部署中，apiserver 被配置为监听启用了一种或多种形式的客户端[身份验证](/docs/reference/access-authn-authz/authentication/)的安全 HTTPS 端口（443）上的远程连接。

应该启用一种或多种形式的[授权](/docs/reference/access-authn-authz/authorization/)，尤其是在允许[匿名请求](/docs/reference/access-authn-authz/authentication/#anonymous-requests)或者[服务账户令牌](/docs/reference/access-authn-authz/authentication/#service-account-tokens)的情况下。

应该为节点配置集群的公共根证书，这样它们就可以和 apiserver 通过有效的客户端凭据来进行安全的通信。比如，在默认的 GKE 部署中，使用客户端证书的方式给 kubelet 提供客户端凭据。有关自动配置 kubelet 客户端证书的信息，清查阅 [kubelet TLS 引导](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)。

<!--
Pods that wish to connect to the apiserver can do so securely by leveraging a service account so that Kubernetes will automatically inject the public root certificate and a valid bearer token into the pod when it is instantiated.
The `kubernetes` service (in all namespaces) is configured with a virtual IP address that is redirected (via kube-proxy) to the HTTPS endpoint on the apiserver.

The control plane components also communicate with the cluster apiserver over the secure port.

As a result, the default operating mode for connections from the nodes and pods running on the nodes to the control plane is secured by default and can run over untrusted and/or public networks.
-->
希望连接到 apiserver 的 Pod 可以利用服务账户来安全地这样做，以便 Kubernetes 在实例化 Pod 的时候会自动将公共根证书和有效的承载令牌注入 Pod。

`kubernetes` 服务（在所有命名空间中）都配有虚拟的 IP 地址，该地址被重定向（通过 kube-proxy）到 apiserver 的 HTTPS 端点上。

控制平面组件还通过安全端口与集群的 apiserver 通信。

因此，从节点和节点上运行的 Pod 到控制平面的连接的默认操作模式在默认情况下是安全的，并且可以在不受信任和/或公共的网络上运行。

<!--
## Control Plane to node
There are two primary communication paths from the control plane (apiserver) to the nodes. The first is from the apiserver to the kubelet process which runs on each node in the cluster. The second is from the apiserver to any node, pod, or service through the apiserver's proxy functionality.
-->
## 控制平面到节点

从控制平面（apiserver）到节点有两个主要的通信路径。第一个是从 apiserver 连接到运行在集群中每个节点上的 kubelet 进程。第二个是通过 apiserver 代理功能从 apiserver 连接到所有节点、Pod 或者服务。

<!--
### apiserver to kubelet
The connections from the apiserver to the kubelet are used for:

* Fetching logs for pods.
* Attaching (through kubectl) to running pods.
* Providing the kubelet's port-forwarding functionality.

These connections terminate at the kubelet's HTTPS endpoint. By default, the apiserver does not verify the kubelet's serving certificate, which makes the connection subject to man-in-the-middle attacks, and **unsafe** to run over untrusted and/or public networks.

To verify this connection, use the `--kubelet-certificate-authority` flag to provide the apiserver with a root certificate bundle to use to verify the kubelet's serving certificate.

If that is not possible, use [SSH tunneling](/docs/concepts/architecture/master-node-communication/#ssh-tunnels) between the apiserver and kubelet if required to avoid connecting over an
untrusted or public network.

Finally, [Kubelet authentication and/or authorization](/docs/admin/kubelet-authentication-authorization/) should be enabled to secure the kubelet API.
-->
### apiserver 到 kubelet

从 apiserver 到 kubelet 的连接通常用于：

* 获取 Pod 的日志。
* 通过 kubectl 附加到正在运行的 Pod 上。
* 提供 kubelet 的端口转发功能。

这些连接会在 kubelet 的 HTTPS 端点处终止。默认情况下，apiserver 不会验证 kubelet 的证书，该证书会使链接收到中间人的攻击，并且在不信任和/或公共网络下运行时 **不安全** 的。

要验证这个链接，需要使用 `--kubelet-certificate-authority` 参数来给 apiserver 提供一个根证书的捆绑包，以用于 kubelet 的服务证书。

如果这点无法实现，那就在 apiserver 和 kubelet 之间使用 [SSH 隧道](/docs/concepts/architecture/master-node-communication/#ssh-tunnels)来避免通过不可信或者公共网络。

最后，应该启用 [kubelet 身份验证和/或授权](/docs/admin/kubelet-authentication-authorization/)以保护kubelet API。

<!--
### apiserver to nodes, pods, and services

The connections from the apiserver to a node, pod, or service default to plain HTTP connections and are therefore neither authenticated nor encrypted. They can be run over a secure HTTPS connection by prefixing `https:` to the node, pod, or service name in the API URL, but they will not validate the certificate provided by the HTTPS endpoint nor provide client credentials so while the connection will be encrypted, it will not provide any guarantees of integrity. These connections **are not currently safe** to run over untrusted and/or public networks.
-->
### apiserver 到节点、Pod 和服务

从 apiserver 到节点、Pod和服务的连接默认为纯 HTTP 连接，因此未经身份验证和加密。也可以通过在连接节点、Pod和服务的 API URL 前面加上 `https` 来建立安全的 HTTPS 连接，但是它们不会验证 HTTPS 端点提供的证书，也不会提供客户端凭证，因此当连接加密时，将无法提供数据一致性的保证。在不受信任和/或公共网络上，这些连接 **目前尚不安全** 。

<!--
### SSH tunnels

Kubernetes supports SSH tunnels to protect the control plane to nodes communication paths. In this configuration, the apiserver initiates an SSH tunnel to each node in the cluster (connecting to the ssh server listening on port 22) and passes all traffic destined for a kubelet, node, pod, or service through the tunnel.
This tunnel ensures that the traffic is not exposed outside of the network in which the nodes are running.

SSH tunnels are currently deprecated so you shouldn't opt to use them unless you know what you are doing. The Konnectivity service is a replacement for this communication channel.
-->
### SSH 隧道

Kubernetes 提供 SSH 隧道来保护控制平面到节点通信路径。在这个配置里，apiserver 启动到集群中每个节点的 SSH 隧道（连接到监听 22 端口的 ssh 服务），并通过隧道传递发往 kubelet、节点、Pod或者服务的流量。该隧道确保流量不会暴露在运行节点的网络外部。

SSH 隧道目前已被弃用，因此除非您知道自己该做什么，否则不应该选择使用它。Konnectivity 服务是此通信渠道的替代品。

<!--
### Konnectivity service
{{< feature-state for_k8s_version="v1.18" state="beta" >}}

As a replacement to the SSH tunnels, the Konnectivity service provides TCP level proxy for the control plane to Cluster communication. The Konnectivity consists of two parts, the Konnectivity server and the Konnectivity agents, running in the control plane network and the nodes network respectively. The Konnectivity agents initiate connections to the Konnectivity server and maintain the connections.
All control plane to nodes traffic then goes through these connections.

See [Konnectivity Service Setup](/docs/tasks/setup-konnectivity/) on how to set it up in your cluster.
-->
### Konnectivity 服务
{{< feature-state for_k8s_version="v1.18" state="beta" >}}

作为 SSH 隧道的替代者，Konnectivity 服务为控制面到集群的通信提供了 TCP 级别的代理。Konnectivity 由两部分组成，即在控制平面网络和节点网络中运行的 Konnectivity 服务和 Konnectivity 代理。Konnectivity 代理发起到 Konnectivity 服务的连接并来维护这些连接。所有控制面到节点的流量都通过这些连接完成。