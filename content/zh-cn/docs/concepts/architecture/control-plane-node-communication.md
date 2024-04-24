---
title: 节点与控制面之间的通信
content_type: concept
weight: 20
---
<!--
reviewers:
- dchen1107
- liggitt
title: Communication between Nodes and the Control Plane
content_type: concept
weight: 20
aliases:
- master-node-communication
-->

<!-- overview -->

<!--
This document catalogs the communication paths between the {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}}
and the Kubernetes {{< glossary_tooltip text="cluster" term_id="cluster" length="all" >}}.
The intent is to allow users to customize their installation to harden the network configuration
such that the cluster can be run on an untrusted network (or on fully public IPs on a cloud
provider).
-->
本文列举控制面节点（确切地说是 {{< glossary_tooltip term_id="kube-apiserver" text="API 服务器" >}}）和
Kubernetes {{< glossary_tooltip text="集群" term_id="cluster" length="all" >}}之间的通信路径。
目的是为了让用户能够自定义他们的安装，以实现对网络配置的加固，
使得集群能够在不可信的网络上（或者在一个云服务商完全公开的 IP 上）运行。

<!-- body -->

<!--
## Node to Control Plane

Kubernetes has a "hub-and-spoke" API pattern. All API usage from nodes (or the pods they run)
terminates at the API server. None of the other control plane components are designed to expose
remote services. The API server is configured to listen for remote connections on a secure HTTPS
port (typically 443) with one or more forms of client
[authentication](/docs/reference/access-authn-authz/authentication/) enabled.
One or more forms of [authorization](/docs/reference/access-authn-authz/authorization/) should be
enabled, especially if [anonymous requests](/docs/reference/access-authn-authz/authentication/#anonymous-requests)
or [service account tokens](/docs/reference/access-authn-authz/authentication/#service-account-tokens)
are allowed.
-->
## 节点到控制面   {#node-to-control-plane}

Kubernetes 采用的是中心辐射型（Hub-and-Spoke）API 模式。
所有从节点（或运行于其上的 Pod）发出的 API 调用都终止于 API 服务器。
其它控制面组件都没有被设计为可暴露远程服务。
API 服务器被配置为在一个安全的 HTTPS 端口（通常为 443）上监听远程连接请求，
并启用一种或多种形式的客户端[身份认证](/zh-cn/docs/reference/access-authn-authz/authentication/)机制。
一种或多种客户端[鉴权机制](/zh-cn/docs/reference/access-authn-authz/authorization/)应该被启用，
特别是在允许使用[匿名请求](/zh-cn/docs/reference/access-authn-authz/authentication/#anonymous-requests)
或[服务账户令牌](/zh-cn/docs/reference/access-authn-authz/authentication/#service-account-tokens)的时候。

<!--
Nodes should be provisioned with the public root {{< glossary_tooltip text="certificate" term_id="certificate" >}} for the cluster such that they can
connect securely to the API server along with valid client credentials. A good approach is that the
client credentials provided to the kubelet are in the form of a client certificate. See
[kubelet TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
for automated provisioning of kubelet client certificates.
-->
应该使用集群的公共根{{< glossary_tooltip text="证书" term_id="certificate" >}}开通节点，
这样它们就能够基于有效的客户端凭据安全地连接 API 服务器。
一种好的方法是以客户端证书的形式将客户端凭据提供给 kubelet。
请查看 [kubelet TLS 启动引导](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
以了解如何自动提供 kubelet 客户端证书。

<!--
{{< glossary_tooltip text="Pods" term_id="pod" >}} that wish to connect to the API server can do so securely by leveraging a service account so
that Kubernetes will automatically inject the public root certificate and a valid bearer token
into the pod when it is instantiated.
The `kubernetes` service (in `default` namespace) is configured with a virtual IP address that is
redirected (via `{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}`) to the HTTPS endpoint on the API server.

The control plane components also communicate with the API server over the secure port.
-->
想要连接到 API 服务器的 {{< glossary_tooltip text="Pod" term_id="pod" >}}
可以使用服务账号安全地进行连接。
当 Pod 被实例化时，Kubernetes 自动把公共根证书和一个有效的持有者令牌注入到 Pod 里。
`kubernetes` 服务（位于 `default` 名字空间中）配置了一个虚拟 IP 地址，
用于（通过 `{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}`）转发请求到
API 服务器的 HTTPS 末端。

控制面组件也通过安全端口与集群的 API 服务器通信。

<!--
As a result, the default operating mode for connections from the nodes and pod running on the
nodes to the control plane is secured by default and can run over untrusted and/or public
networks.
-->
这样，从集群节点和节点上运行的 Pod 到控制面的连接的缺省操作模式即是安全的，
能够在不可信的网络或公网上运行。

<!--
## Control plane to node

There are two primary communication paths from the control plane (the API server) to the nodes.
The first is from the API server to the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} process which runs on each node in the cluster.
The second is from the API server to any node, pod, or service through the API server's _proxy_
functionality.
-->
## 控制面到节点  {#control-plane-to-node}

从控制面（API 服务器）到节点有两种主要的通信路径。
第一种是从 API 服务器到集群中每个节点上运行的
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 进程。
第二种是从 API 服务器通过它的**代理**功能连接到任何节点、Pod 或者服务。

<!--
### API server to kubelet

The connections from the API server to the kubelet are used for:

* Fetching logs for pods.
* Attaching (usually through `kubectl`) to running pods.
* Providing the kubelet's port-forwarding functionality.

These connections terminate at the kubelet's HTTPS endpoint. By default, the API server does not
verify the kubelet's serving certificate, which makes the connection subject to man-in-the-middle
attacks and **unsafe** to run over untrusted and/or public networks.
-->
### API 服务器到 kubelet  {#api-server-to-kubelet}

从 API 服务器到 kubelet 的连接用于：

* 获取 Pod 日志。
* 挂接（通过 kubectl）到运行中的 Pod。
* 提供 kubelet 的端口转发功能。

这些连接终止于 kubelet 的 HTTPS 末端。
默认情况下，API 服务器不检查 kubelet 的服务证书。这使得此类连接容易受到中间人攻击，
在非受信网络或公开网络上运行也是 **不安全的**。

<!--
To verify this connection, use the `--kubelet-certificate-authority` flag to provide the API
server with a root certificate bundle to use to verify the kubelet's serving certificate.

If that is not possible, use [SSH tunneling](#ssh-tunnels) between the API server and kubelet if
required to avoid connecting over an
untrusted or public network.

Finally, [Kubelet authentication and/or authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/)
should be enabled to secure the kubelet API.
-->
为了对这个连接进行认证，使用 `--kubelet-certificate-authority` 标志给
API 服务器提供一个根证书包，用于 kubelet 的服务证书。

如果无法实现这点，又要求避免在非受信网络或公共网络上进行连接，可在 API 服务器和
kubelet 之间使用 [SSH 隧道](#ssh-tunnels)。

最后，应该启用
[Kubelet 认证/鉴权](/zh-cn/docs/reference/access-authn-authz/kubelet-authn-authz/)
来保护 kubelet API。

<!--
### API server to nodes, pods, and services

The connections from the API server to a node, pod, or service default to plain HTTP connections
and are therefore neither authenticated nor encrypted. They can be run over a secure HTTPS
connection by prefixing `https:` to the node, pod, or service name in the API URL, but they will
not validate the certificate provided by the HTTPS endpoint nor provide client credentials. So
while the connection will be encrypted, it will not provide any guarantees of integrity. These
connections **are not currently safe** to run over untrusted or public networks.
-->
### API 服务器到节点、Pod 和服务  {#api-server-to-nodes-pods-and-services}

从 API 服务器到节点、Pod 或服务的连接默认为纯 HTTP 方式，因此既没有认证，也没有加密。
这些连接可通过给 API URL 中的节点、Pod 或服务名称添加前缀 `https:` 来运行在安全的 HTTPS 连接上。
不过这些连接既不会验证 HTTPS 末端提供的证书，也不会提供客户端证书。
因此，虽然连接是加密的，仍无法提供任何完整性保证。
这些连接 **目前还不能安全地** 在非受信网络或公共网络上运行。

<!--
### SSH tunnels

Kubernetes supports [SSH tunnels](https://www.ssh.com/academy/ssh/tunneling) to protect the control plane to nodes communication paths. In this
configuration, the API server initiates an SSH tunnel to each node in the cluster (connecting to
the SSH server listening on port 22) and passes all traffic destined for a kubelet, node, pod, or
service through the tunnel.
This tunnel ensures that the traffic is not exposed outside of the network in which the nodes are
running.
-->
### SSH 隧道 {#ssh-tunnels}

Kubernetes 支持使用
[SSH 隧道](https://www.ssh.com/academy/ssh/tunneling)来保护从控制面到节点的通信路径。
在这种配置下，API 服务器建立一个到集群中各节点的 SSH 隧道（连接到在 22 端口监听的 SSH 服务器）
并通过这个隧道传输所有到 kubelet、节点、Pod 或服务的请求。
这一隧道保证通信不会被暴露到集群节点所运行的网络之外。

{{< note >}}
<!--
SSH tunnels are currently deprecated, so you shouldn't opt to use them unless you know what you
are doing. The [Konnectivity service](#konnectivity-service) is a replacement for this
communication channel.
-->
SSH 隧道目前已被废弃。除非你了解个中细节，否则不应使用。
[Konnectivity 服务](#konnectivity-service)是 SSH 隧道的替代方案。
{{< /note >}}

<!--
### Konnectivity service
-->
### Konnectivity 服务   {#konnectivity-service}

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

<!--
As a replacement to the SSH tunnels, the Konnectivity service provides TCP level proxy for the
control plane to cluster communication. The Konnectivity service consists of two parts: the
Konnectivity server in the control plane network and the Konnectivity agents in the nodes network.
The Konnectivity agents initiate connections to the Konnectivity server and maintain the network
connections.
After enabling the Konnectivity service, all control plane to nodes traffic goes through these
connections.

Follow the [Konnectivity service task](/docs/tasks/extend-kubernetes/setup-konnectivity/) to set
up the Konnectivity service in your cluster.
-->
作为 SSH 隧道的替代方案，Konnectivity 服务提供 TCP 层的代理，以便支持从控制面到集群的通信。
Konnectivity 服务包含两个部分：Konnectivity 服务器和 Konnectivity 代理，
分别运行在控制面网络和节点网络中。
Konnectivity 代理建立并维持到 Konnectivity 服务器的网络连接。
启用 Konnectivity 服务之后，所有控制面到节点的通信都通过这些连接传输。

请浏览 [Konnectivity 服务任务](/zh-cn/docs/tasks/extend-kubernetes/setup-konnectivity/)
在你的集群中配置 Konnectivity 服务。

## {{% heading "whatsnext" %}}

<!--
* Read about the [Kubernetes control plane components](/docs/concepts/overview/components/#control-plane-components)
* Learn more about [Hubs and Spoke model](https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html#hubs-spokes-and-other-wheel-metaphors)
* Learn how to [Secure a Cluster](/docs/tasks/administer-cluster/securing-a-cluster/) 
* Learn more about the [Kubernetes API](/docs/concepts/overview/kubernetes-api/)
* [Set up Konnectivity service](/docs/tasks/extend-kubernetes/setup-konnectivity/)
* [Use Port Forwarding to Access Applications in a Cluster](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* Learn how to [Fetch logs for Pods](/docs/tasks/debug/debug-application/debug-running-pod/#examine-pod-logs), [use kubectl port-forward](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod)
-->
* 阅读 [Kubernetes 控制面组件](/zh-cn/docs/concepts/overview/components/#control-plane-components)
* 进一步了解 [Hubs and Spoke model](https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html#hubs-spokes-and-other-wheel-metaphors)
* 进一步了解如何[保护集群](/zh-cn/docs/tasks/administer-cluster/securing-a-cluster/)
* 进一步了解 [Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/)
* [设置 Konnectivity 服务](/zh-cn/docs/tasks/extend-kubernetes/setup-konnectivity/)
* [使用端口转发来访问集群中的应用](/zh-cn/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* 学习如何[检查 Pod 的日志](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/#examine-pod-logs)
  以及如何[使用 kubectl 端口转发](/zh-cn/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod)
