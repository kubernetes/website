---
title: 控制面到節點通訊
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
This document catalogs the communication paths between the control plane (apiserver) and the Kubernetes cluster. The intent is to allow users to customize their installation to harden the network configuration such that the cluster can be run on an untrusted network (or on fully public IPs on a cloud provider).
-->
本文列舉控制面節點（確切說是 API 伺服器）和 Kubernetes 叢集之間的通訊路徑。
目的是為了讓使用者能夠自定義他們的安裝，以實現對網路配置的加固，使得叢集能夠在不可信的網路上
（或者在一個雲服務商完全公開的 IP 上）執行。

<!-- body -->
<!--
## Node to Control Plane
Kubernetes has a "hub-and-spoke" API pattern. All API usage from nodes (or the pods they run) terminates at the apiserver. None of the other control plane components are designed to expose remote services. The apiserver is configured to listen for remote connections on a secure HTTPS port (typically 443) with one or more forms of client [authentication](/docs/reference/access-authn-authz/authentication/) enabled.
One or more forms of [authorization](/docs/reference/access-authn-authz/authorization/) should be enabled, especially if [anonymous requests](/docs/reference/access-authn-authz/authentication/#anonymous-requests) or [service account tokens](/docs/reference/access-authn-authz/authentication/#service-account-tokens) are allowed.
-->
## 節點到控制面

Kubernetes 採用的是中心輻射型（Hub-and-Spoke）API 模式。
所有從叢集（或所執行的 Pods）發出的 API 呼叫都終止於 API 伺服器。
其它控制面元件都沒有被設計為可暴露遠端服務。
API 伺服器被配置為在一個安全的 HTTPS 埠（通常為 443）上監聽遠端連線請求，
並啟用一種或多種形式的客戶端[身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/)機制。
一種或多種客戶端[鑑權機制](/zh-cn/docs/reference/access-authn-authz/authorization/)應該被啟用，
特別是在允許使用[匿名請求](/zh-cn/docs/reference/access-authn-authz/authentication/#anonymous-requests)
或[服務賬號令牌](/zh-cn/docs/reference/access-authn-authz/authentication/#service-account-tokens)的時候。

<!--
Nodes should be provisioned with the public root certificate for the cluster such that they can connect securely to the apiserver along with valid client credentials. A good approach is that the client credentials provided to the kubelet are in the form of a client certificate. See [kubelet TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/) for automated provisioning of kubelet client certificates.
-->
應該使用叢集的公共根證書開通節點，這樣它們就能夠基於有效的客戶端憑據安全地連線 API 伺服器。
一種好的方法是以客戶端證書的形式將客戶端憑據提供給 kubelet。
請檢視 [kubelet TLS 啟動引導](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
以瞭解如何自動提供 kubelet 客戶端證書。

<!--
Pods that wish to connect to the apiserver can do so securely by leveraging a service account so that Kubernetes will automatically inject the public root certificate and a valid bearer token into the pod when it is instantiated.
The `kubernetes` service (in `default` namespace) is configured with a virtual IP address that is redirected (via kube-proxy) to the HTTPS endpoint on the apiserver.

The control plane components also communicate with the cluster apiserver over the secure port.
-->
想要連線到 API 伺服器的 Pod 可以使用服務賬號安全地進行連線。
當 Pod 被例項化時，Kubernetes 自動把公共根證書和一個有效的持有者令牌注入到 Pod 裡。
`kubernetes` 服務（位於 `default` 名字空間中）配置了一個虛擬 IP 地址，用於（透過 kube-proxy）轉發
請求到 API 伺服器的 HTTPS 末端。

控制面元件也透過安全埠與叢集的 API 伺服器通訊。

<!--
As a result, the default operating mode for connections from the nodes and pods running on the nodes to the control plane is secured by default and can run over untrusted and/or public networks.
-->
這樣，從叢集節點和節點上執行的 Pod 到控制面的連線的預設操作模式即是安全的，
能夠在不可信的網路或公網上執行。

<!--
## Control Plane to node

There are two primary communication paths from the control plane (apiserver) to the nodes. The first is from the apiserver to the kubelet process which runs on each node in the cluster. The second is from the apiserver to any node, pod, or service through the apiserver's proxy functionality.
-->
## 控制面到節點

從控制面（API 伺服器）到節點有兩種主要的通訊路徑。
第一種是從 API 伺服器到叢集中每個節點上執行的 kubelet 程序。
第二種是從 API 伺服器透過它的代理功能連線到任何節點、Pod 或者服務。

<!--
### apiserver to kubelet

The connections from the apiserver to the kubelet are used for:

* Fetching logs for pods.
* Attaching (through kubectl) to running pods.
* Providing the kubelet's port-forwarding functionality.

These connections terminate at the kubelet's HTTPS endpoint. By default, the apiserver does not verify the kubelet's serving certificate, which makes the connection subject to man-in-the-middle attacks and **unsafe** to run over untrusted and/or public networks.
-->
### API 伺服器到 kubelet

從 API 伺服器到 kubelet 的連線用於：

* 獲取 Pod 日誌
* 掛接（透過 kubectl）到執行中的 Pod
* 提供 kubelet 的埠轉發功能。

這些連線終止於 kubelet 的 HTTPS 末端。
預設情況下，API 伺服器不檢查 kubelet 的服務證書。這使得此類連線容易受到中間人攻擊，
在非受信網路或公開網路上執行也是 **不安全的**。

<!--
To verify this connection, use the `--kubelet-certificate-authority` flag to provide the apiserver with a root certificate bundle to use to verify the kubelet's serving certificate.

If that is not possible, use [SSH tunneling](#ssh-tunnels) between the apiserver and kubelet if required to avoid connecting over an
untrusted or public network.

Finally, [Kubelet authentication and/or authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/) should be enabled to secure the kubelet API.
-->
為了對這個連線進行認證，使用 `--kubelet-certificate-authority` 標誌給 API
伺服器提供一個根證書包，用於 kubelet 的服務證書。

如果無法實現這點，又要求避免在非受信網路或公共網路上進行連線，可在 API 伺服器和
kubelet 之間使用 [SSH 隧道](#ssh-tunnels)。

最後，應該啟用
[kubelet 使用者認證和/或鑑權](/zh-cn/docs/reference/access-authn-authz/kubelet-authn-authz/)
來保護 kubelet API。

<!--
### apiserver to nodes, pods, and services

The connections from the apiserver to a node, pod, or service default to plain HTTP connections and are therefore neither authenticated nor encrypted. They can be run over a secure HTTPS connection by prefixing `https:` to the node, pod, or service name in the API URL, but they will not validate the certificate provided by the HTTPS endpoint nor provide client credentials. So while the connection will be encrypted, it will not provide any guarantees of integrity. These connections **are not currently safe** to run over untrusted or public networks.
-->
### API 伺服器到節點、Pod 和服務

從 API 伺服器到節點、Pod 或服務的連線預設為純 HTTP 方式，因此既沒有認證，也沒有加密。
這些連線可透過給 API URL 中的節點、Pod 或服務名稱新增字首 `https:` 來執行在安全的 HTTPS 連線上。
不過這些連線既不會驗證 HTTPS 末端提供的證書，也不會提供客戶端證書。
因此，雖然連線是加密的，仍無法提供任何完整性保證。
這些連線 **目前還不能安全地** 在非受信網路或公共網路上執行。

<!--
### SSH tunnels

Kubernetes supports SSH tunnels to protect the control plane to nodes communication paths. In this configuration, the apiserver initiates an SSH tunnel to each node in the cluster (connecting to the ssh server listening on port 22) and passes all traffic destined for a kubelet, node, pod, or service through the tunnel.
This tunnel ensures that the traffic is not exposed outside of the network in which the nodes are running.

SSH tunnels are currently deprecated, so you shouldn't opt to use them unless you know what you are doing. The Konnectivity service is a replacement for this communication channel.
-->
### SSH 隧道 {#ssh-tunnels}

Kubernetes 支援使用 SSH 隧道來保護從控制面到節點的通訊路徑。在這種配置下，API
伺服器建立一個到叢集中各節點的 SSH 隧道（連線到在 22 埠監聽的 SSH 服務）
並透過這個隧道傳輸所有到 kubelet、節點、Pod 或服務的請求。
這一隧道保證通訊不會被暴露到叢集節點所執行的網路之外。

SSH 隧道目前已被廢棄。除非你瞭解箇中細節，否則不應使用。
Konnectivity 服務是對此通訊通道的替代品。

<!--
### Konnectivity service

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

As a replacement to the SSH tunnels, the Konnectivity service provides TCP level proxy for the control plane to cluster communication. The Konnectivity service consists of two parts: the Konnectivity server in the control plane network and the Konnectivity agents in the nodes network. The Konnectivity agents initiate connections to the Konnectivity server and maintain the network connections.
After enabling the Konnectivity service, all control plane to nodes traffic goes through these connections.

Follow the [Konnectivity service task](/docs/tasks/extend-kubernetes/setup-konnectivity/) to set up the Konnectivity service in your cluster.
-->
### Konnectivity 服務

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

作為 SSH 隧道的替代方案，Konnectivity 服務提供 TCP 層的代理，以便支援從控制面到叢集的通訊。
Konnectivity 服務包含兩個部分：Konnectivity 伺服器和 Konnectivity 代理，分別執行在
控制面網路和節點網路中。Konnectivity 代理建立並維持到 Konnectivity 伺服器的網路連線。
啟用 Konnectivity 服務之後，所有控制面到節點的通訊都透過這些連線傳輸。

請瀏覽 [Konnectivity 服務任務](/zh-cn/docs/tasks/extend-kubernetes/setup-konnectivity/)
在你的叢集中配置 Konnectivity 服務。

