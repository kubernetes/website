---
title: 節點與控制面之間的通信
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
本文列舉控制面節點（確切地說是 {{< glossary_tooltip term_id="kube-apiserver" text="API 伺服器" >}}）和
Kubernetes {{< glossary_tooltip text="叢集" term_id="cluster" length="all" >}}之間的通信路徑。
目的是爲了讓使用者能夠自定義他們的安裝，以實現對網路設定的加固，
使得叢集能夠在不可信的網路上（或者在一個雲服務商完全公開的 IP 上）運行。

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
## 節點到控制面   {#node-to-control-plane}

Kubernetes 採用的是中心輻射型（Hub-and-Spoke）API 模式。
所有從節點（或運行於其上的 Pod）發出的 API 調用都終止於 API 伺服器。
其它控制面組件都沒有被設計爲可暴露遠程服務。
API 伺服器被設定爲在一個安全的 HTTPS 端口（通常爲 443）上監聽遠程連接請求，
並啓用一種或多種形式的客戶端[身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/)機制。
一種或多種客戶端[鑑權機制](/zh-cn/docs/reference/access-authn-authz/authorization/)應該被啓用，
特別是在允許使用[匿名請求](/zh-cn/docs/reference/access-authn-authz/authentication/#anonymous-requests)
或[服務賬戶令牌](/zh-cn/docs/reference/access-authn-authz/authentication/#service-account-tokens)的時候。

<!--
Nodes should be provisioned with the public root {{< glossary_tooltip text="certificate" term_id="certificate" >}} for the cluster such that they can
connect securely to the API server along with valid client credentials. A good approach is that the
client credentials provided to the kubelet are in the form of a client certificate. See
[kubelet TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
for automated provisioning of kubelet client certificates.
-->
應該使用叢集的公共根{{< glossary_tooltip text="證書" term_id="certificate" >}}開通節點，
這樣它們就能夠基於有效的客戶端憑據安全地連接 API 伺服器。
一種好的方法是以客戶端證書的形式將客戶端憑據提供給 kubelet。
請查看 [kubelet TLS 啓動引導](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
以瞭解如何自動提供 kubelet 客戶端證書。

<!--
{{< glossary_tooltip text="Pods" term_id="pod" >}} that wish to connect to the API server can do so securely by leveraging a service account so
that Kubernetes will automatically inject the public root certificate and a valid bearer token
into the pod when it is instantiated.
The `kubernetes` service (in `default` namespace) is configured with a virtual IP address that is
redirected (via `{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}`) to the HTTPS endpoint on the API server.

The control plane components also communicate with the API server over the secure port.
-->
想要連接到 API 伺服器的 {{< glossary_tooltip text="Pod" term_id="pod" >}}
可以使用服務賬號安全地進行連接。
當 Pod 被實例化時，Kubernetes 自動把公共根證書和一個有效的持有者令牌注入到 Pod 裏。
`kubernetes` 服務（位於 `default` 名字空間中）設定了一個虛擬 IP 地址，
用於（通過 `{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}`）轉發請求到
API 伺服器的 HTTPS 末端。

控制面組件也通過安全端口與叢集的 API 伺服器通信。

<!--
As a result, the default operating mode for connections from the nodes and pod running on the
nodes to the control plane is secured by default and can run over untrusted and/or public
networks.
-->
這樣，從叢集節點和節點上運行的 Pod 到控制面的連接的缺省操作模式即是安全的，
能夠在不可信的網路或公網上運行。

<!--
## Control plane to node

There are two primary communication paths from the control plane (the API server) to the nodes.
The first is from the API server to the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} process which runs on each node in the cluster.
The second is from the API server to any node, pod, or service through the API server's _proxy_
functionality.
-->
## 控制面到節點  {#control-plane-to-node}

從控制面（API 伺服器）到節點有兩種主要的通信路徑。
第一種是從 API 伺服器到叢集中每個節點上運行的
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 進程。
第二種是從 API 伺服器通過它的**代理**功能連接到任何節點、Pod 或者服務。

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
### API 伺服器到 kubelet  {#api-server-to-kubelet}

從 API 伺服器到 kubelet 的連接用於：

* 獲取 Pod 日誌。
* 掛接（通過 kubectl）到運行中的 Pod。
* 提供 kubelet 的端口轉發功能。

這些連接終止於 kubelet 的 HTTPS 末端。
預設情況下，API 伺服器不檢查 kubelet 的服務證書。這使得此類連接容易受到中間人攻擊，
在非受信網路或公開網路上運行也是 **不安全的**。

<!--
To verify this connection, use the `--kubelet-certificate-authority` flag to provide the API
server with a root certificate bundle to use to verify the kubelet's serving certificate.

If that is not possible, use [SSH tunneling](#ssh-tunnels) between the API server and kubelet if
required to avoid connecting over an
untrusted or public network.

Finally, [Kubelet authentication and/or authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/)
should be enabled to secure the kubelet API.
-->
爲了對這個連接進行認證，使用 `--kubelet-certificate-authority` 標誌給
API 伺服器提供一個根證書包，用於 kubelet 的服務證書。

如果無法實現這點，又要求避免在非受信網路或公共網路上進行連接，可在 API 伺服器和
kubelet 之間使用 [SSH 隧道](#ssh-tunnels)。

最後，應該啓用
[Kubelet 認證/鑑權](/zh-cn/docs/reference/access-authn-authz/kubelet-authn-authz/)
來保護 kubelet API。

<!--
### API server to nodes, pods, and services

The connections from the API server to a node, pod, or service default to plain HTTP connections
and are therefore neither authenticated nor encrypted. They can be run over a secure HTTPS
connection by prefixing `https:` to the node, pod, or service name in the API URL, but they will
not validate the certificate provided by the HTTPS endpoint nor provide client credentials. So
while the connection will be encrypted, it will not provide any guarantees of integrity. These
connections **are not currently safe** to run over untrusted or public networks.
-->
### API 伺服器到節點、Pod 和服務  {#api-server-to-nodes-pods-and-services}

從 API 伺服器到節點、Pod 或服務的連接預設爲純 HTTP 方式，因此既沒有認證，也沒有加密。
這些連接可通過給 API URL 中的節點、Pod 或服務名稱添加前綴 `https:` 來運行在安全的 HTTPS 連接上。
不過這些連接既不會驗證 HTTPS 末端提供的證書，也不會提供客戶端證書。
因此，雖然連接是加密的，仍無法提供任何完整性保證。
這些連接 **目前還不能安全地** 在非受信網路或公共網路上運行。

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
[SSH 隧道](https://www.ssh.com/academy/ssh/tunneling)來保護從控制面到節點的通信路徑。
在這種設定下，API 伺服器建立一個到叢集中各節點的 SSH 隧道（連接到在 22 端口監聽的 SSH 伺服器）
並通過這個隧道傳輸所有到 kubelet、節點、Pod 或服務的請求。
這一隧道保證通信不會被暴露到叢集節點所運行的網路之外。

{{< note >}}
<!--
SSH tunnels are currently deprecated, so you shouldn't opt to use them unless you know what you
are doing. The [Konnectivity service](#konnectivity-service) is a replacement for this
communication channel.
-->
SSH 隧道目前已被廢棄。除非你瞭解箇中細節，否則不應使用。
[Konnectivity 服務](#konnectivity-service)是 SSH 隧道的替代方案。
{{< /note >}}

<!--
### Konnectivity service
-->
### Konnectivity 服務   {#konnectivity-service}

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
作爲 SSH 隧道的替代方案，Konnectivity 服務提供 TCP 層的代理，以便支持從控制面到叢集的通信。
Konnectivity 服務包含兩個部分：Konnectivity 伺服器和 Konnectivity 代理，
分別運行在控制面網路和節點網路中。
Konnectivity 代理建立並維持到 Konnectivity 伺服器的網路連接。
啓用 Konnectivity 服務之後，所有控制面到節點的通信都通過這些連接傳輸。

請瀏覽 [Konnectivity 服務任務](/zh-cn/docs/tasks/extend-kubernetes/setup-konnectivity/)
在你的叢集中設定 Konnectivity 服務。

## {{% heading "whatsnext" %}}

<!--
* Read about the [Kubernetes control plane components](/docs/concepts/architecture/#control-plane-components)
* Learn more about [Hubs and Spoke model](https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html#hubs-spokes-and-other-wheel-metaphors)
* Learn how to [Secure a Cluster](/docs/tasks/administer-cluster/securing-a-cluster/) 
* Learn more about the [Kubernetes API](/docs/concepts/overview/kubernetes-api/)
* [Set up Konnectivity service](/docs/tasks/extend-kubernetes/setup-konnectivity/)
* [Use Port Forwarding to Access Applications in a Cluster](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* Learn how to [Fetch logs for Pods](/docs/tasks/debug/debug-application/debug-running-pod/#examine-pod-logs), [use kubectl port-forward](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod)
-->
* 閱讀 [Kubernetes 控制面組件](/zh-cn/docs/concepts/architecture/#control-plane-components)
* 進一步瞭解 [Hubs and Spoke model](https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html#hubs-spokes-and-other-wheel-metaphors)
* 進一步瞭解如何[保護叢集](/zh-cn/docs/tasks/administer-cluster/securing-a-cluster/)
* 進一步瞭解 [Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/)
* [設置 Konnectivity 服務](/zh-cn/docs/tasks/extend-kubernetes/setup-konnectivity/)
* [使用端口轉發來訪問叢集中的應用](/zh-cn/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* 學習如何[檢查 Pod 的日誌](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/#examine-pod-logs)
  以及如何[使用 kubectl 端口轉發](/zh-cn/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod)
