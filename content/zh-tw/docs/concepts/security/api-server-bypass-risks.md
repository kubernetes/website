---
title: Kubernetes API 伺服器旁路風險
description: >
  與 API 伺服器及其他組件相關的安全架構資訊
content_type: concept
weight: 90
---

<!--
title: Kubernetes API Server Bypass Risks
description: >
  Security architecture information relating to the API server and other components
content_type: concept
weight: 90
-->

<!-- overview -->
<!--
The Kubernetes API server is the main point of entry to a cluster for external parties
(users and services) interacting with it.
 -->
Kubernetes API 伺服器是外部（使用者和服務）與叢集交互的主要入口。

<!--
As part of this role, the API server has several key built-in security controls, such as
audit logging and {{< glossary_tooltip text="admission controllers" term_id="admission-controller" >}}.
However, there are ways to modify the configuration
or content of the cluster that bypass these controls.
-->
API 伺服器作爲交互的主要入口，還提供了幾種關鍵的內置安全控制，
例如審計日誌和{{< glossary_tooltip text="准入控制器" term_id="admission-controller" >}}。
但有一些方式可以繞過這些安全控制從而修改叢集的設定或內容。

<!--
This page describes the ways in which the security controls built into the
Kubernetes API server can be bypassed, so that cluster operators
and security architects can ensure that these bypasses are appropriately restricted.
 -->
本頁描述了繞過 Kubernetes API 伺服器中內置安全控制的幾種方式，
以便叢集運維人員和安全架構師可以確保這些繞過方式被適當地限制。

<!-- body -->
<!--
## Static Pods {#static-pods}
 -->
## 靜態 Pod {#static-pods}

<!--
The {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} on each node loads and
directly manages any manifests that are stored in a named directory or fetched from
a specific URL as [*static Pods*](/docs/tasks/configure-pod-container/static-pod) in
your cluster. The API server doesn't manage these static Pods. An attacker with write
access to this location could modify the configuration of static pods loaded from that
source, or could introduce new static Pods.
 -->
每個節點上的 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
會加載並直接管理叢集中儲存在指定目錄中或從特定 URL
獲取的[**靜態 Pod**](/zh-cn/docs/tasks/configure-pod-container/static-pod) 清單。
API 伺服器不管理這些靜態 Pod。對該位置具有寫入權限的攻擊者可以修改從該位置加載的靜態 Pod 的設定，或引入新的靜態 Pod。

<!--
Static Pods are restricted from accessing other objects in the Kubernetes API. For example,
you can't configure a static Pod to mount a Secret from the cluster. However, these Pods can
take other security sensitive actions, such as using `hostPath` mounts from the underlying
node.
 -->
靜態 Pod 被限制訪問 Kubernetes API 中的其他對象。例如，你不能將靜態 Pod 設定爲從叢集掛載 Secret。
但是，這些 Pod 可以執行其他安全敏感的操作，例如掛載來自下層節點的 `hostPath` 卷。

<!--
By default, the kubelet creates a {{< glossary_tooltip text="mirror pod" term_id="mirror-pod">}}
so that the static Pods are visible in the Kubernetes API. However, if the attacker uses an invalid
namespace name when creating the Pod, it will not be visible in the Kubernetes API and can only
be discovered by tooling that has access to the affected host(s).
 -->
預設情況下，kubelet 會創建一個{{< glossary_tooltip text="映像檔 Pod（Mirror Pod）" term_id="mirror-pod">}}，
以便靜態 Pod 在 Kubernetes API 中可見。但是，如果攻擊者在創建 Pod 時使用了無效的名字空間名稱，
則該 Pod 將在 Kubernetes API 中不可見，只能通過對受影響主機有訪問權限的工具發現。

<!--
If a static Pod fails admission control, the kubelet won't register the Pod with the
API server. However, the Pod still runs on the node. For more information, refer to
[kubeadm issue #1541](https://github.com/kubernetes/kubeadm/issues/1541#issuecomment-487331701).
 -->
如果靜態 Pod 無法通過准入控制，kubelet 不會將 Pod 註冊到 API 伺服器。但該 Pod 仍然在節點上運行。
有關更多資訊，請參閱 [kubeadm issue #1541](https://github.com/kubernetes/kubeadm/issues/1541#issuecomment-487331701)。

<!--
### Mitigations {#static-pods-mitigations}
 -->
### 緩解措施 {#static-pods-mitigations}

<!--
- Only [enable the kubelet static Pod manifest functionality](/docs/tasks/configure-pod-container/static-pod/#static-pod-creation)
  if required by the node.
- If a node uses the static Pod functionality, restrict filesystem access to the static Pod manifest directory
  or URL to users who need the access.
- Restrict access to kubelet configuration parameters and files to prevent an attacker setting
  a static Pod path or URL.
- Regularly audit and centrally report all access to directories or web storage locations that host
  static Pod manifests and kubelet configuration files.
 -->
- 僅在節點需要時[啓用 kubelet 靜態 Pod 清單功能](/zh-cn/docs/tasks/configure-pod-container/static-pod/#static-pod-creation)。
- 如果節點使用靜態 Pod 功能，請將對靜態 Pod 清單目錄或 URL 的檔案系統的訪問權限限制爲需要訪問的使用者。
- 限制對 kubelet 設定參數和檔案的訪問，以防止攻擊者設置靜態 Pod 路徑或 URL。
- 定期審計並集中報告所有對託管靜態 Pod 清單和 kubelet 設定檔案的目錄或 Web 儲存位置的訪問。

<!--
## The kubelet API {#kubelet-api}
 -->
## kubelet API {#kubelet-api}

<!--
The kubelet provides an HTTP API that is typically exposed on TCP port 10250 on cluster
worker nodes. The API might also be exposed on control plane nodes depending on the Kubernetes
distribution in use. Direct access to the API allows for disclosure of information about
the pods running on a node, the logs from those pods, and execution of commands in
every container running on the node.
-->
kubelet 提供了一個 HTTP API，通常暴露在叢集工作節點上的 TCP 端口 10250 上。
在某些 Kubernetes 發行版中，API 也可能暴露在控制平面節點上。
對 API 的直接訪問允許公開有關運行在節點上的 Pod、這些 Pod 的日誌以及在節點上運行的每個容器中執行命令的資訊。

<!--
When Kubernetes cluster users have RBAC access to `Node` object sub-resources, that access
serves as authorization to interact with the kubelet API. The exact access depends on
which sub-resource access has been granted, as detailed in
[kubelet authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/#kubelet-authorization).
 -->
當 Kubernetes 叢集使用者具有對 `Node` 對象子資源 RBAC 訪問權限時，該訪問權限可用作與 kubelet API 交互的授權。
實際的訪問權限取決於授予了哪些子資源訪問權限，詳見
[kubelet 鑑權](/zh-cn/docs/reference/access-authn-authz/kubelet-authn-authz/#kubelet-authorization)。

<!--
Direct access to the kubelet API is not subject to admission control and is not logged
by Kubernetes audit logging. An attacker with direct access to this API may be able to
bypass controls that detect or prevent certain actions.
 -->
對 kubelet API 的直接訪問不受准入控制影響，也不會被 Kubernetes 審計日誌記錄。
能直接訪問此 API 的攻擊者可能會繞過能檢測或防止某些操作的控制機制。

<!--
The kubelet API can be configured to authenticate requests in a number of ways.
By default, the kubelet configuration allows anonymous access. Most Kubernetes providers
change the default to use webhook and certificate authentication. This lets the control plane
ensure that the caller is authorized to access the `nodes` API resource or sub-resources.
The default anonymous access doesn't make this assertion with the control plane.
 -->
kubelet API 可以設定爲以多種方式驗證請求。
預設情況下，kubelet 的設定允許匿名訪問。大多數 Kubernetes 提供商將預設值更改爲使用 Webhook 和證書身份認證。
這使得控制平面能夠確保調用者訪問 `nodes` API 資源或子資源是經過授權的。但控制平面不能確保預設的匿名訪問也是如此。

<!--
### Mitigations
 -->
### 緩解措施 {#mitigations}

<!--
- Restrict access to sub-resources of the `nodes` API object using mechanisms such as
  [RBAC](/docs/reference/access-authn-authz/rbac/). Only grant this access when required,
  such as by monitoring services.
- Restrict access to the kubelet port. Only allow specified and trusted IP address
  ranges to access the port.
- Ensure that [kubelet authentication](/docs/reference/access-authn-authz/kubelet-authn-authz/#kubelet-authentication).
  is set to webhook or certificate mode.
- Ensure that the unauthenticated "read-only" Kubelet port is not enabled on the cluster.
 -->
- 使用 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 等機制限制對 `nodes` API 對象的子資源的訪問。
  只在有需要時才授予此訪問權限，例如監控服務。
- 限制對 kubelet 端口的訪問。只允許指定和受信任的 IP 地址段訪問該端口。
- 確保將
  [kubelet 身份驗證](/zh-cn/docs/reference/access-authn-authz/kubelet-authn-authz/#kubelet-authentication)
  設置爲 Webhook 或證書模式。
- 確保叢集上未啓用不作身份認證的“只讀” Kubelet 端口。

<!--
## The etcd API
 -->
## etcd API {#the-etcd-api}

<!--
Kubernetes clusters use etcd as a datastore. The `etcd` service listens on TCP port 2379.
The only clients that need access are the Kubernetes API server and any backup tooling
that you use. Direct access to this API allows for disclosure or modification of any
data held in the cluster.
 -->
Kubernetes 叢集使用 etcd 作爲資料儲存。`etcd` 服務監聽 TCP 端口 2379。
只有 Kubernetes API 伺服器和你所使用的備份工具需要訪問此儲存。對該 API 的直接訪問允許公開或修改叢集中保存的資料。

<!--
Access to the etcd API is typically managed by client certificate authentication.
Any certificate issued by a certificate authority that etcd trusts allows full access
to the data stored inside etcd.
 -->
對 etcd API 的訪問通常通過客戶端證書身份認證來管理。
由 etcd 信任的證書頒發機構所頒發的任何證書都可以完全訪問 etcd 中儲存的資料。

<!--
Direct access to etcd is not subject to Kubernetes admission control and is not logged
by Kubernetes audit logging. An attacker who has read access to the API server's
etcd client certificate private key (or can create a new trusted client certificate) can gain
cluster admin rights by accessing cluster secrets or modifying access rules. Even without
elevating their Kubernetes RBAC privileges, an attacker who can modify etcd can retrieve any API object
or create new workloads inside the cluster.
 -->
對 etcd 的直接訪問不受 Kubernetes 准入控制的影響，也不會被 Kubernetes 審計日誌記錄。
具有對 API 伺服器的 etcd 客戶端證書私鑰的讀取訪問權限（或可以創建一個新的受信任的客戶端證書）
的攻擊者可以通過訪問叢集 Secret 或修改訪問規則來獲得叢集管理員權限。
即使不提升其 Kubernetes RBAC 權限，可以修改 etcd 的攻擊者也可以在叢集內檢索所有 API 對象或創建新的工作負載。

<!--
Many Kubernetes providers configure
etcd to use mutual TLS (both client and server verify each other's certificate for authentication).
There is no widely accepted implementation of authorization for the etcd API, although
the feature exists. Since there is no authorization model, any certificate
with client access to etcd can be used to gain full access to etcd. Typically, etcd client certificates
that are only used for health checking can also grant full read and write access.
 -->
許多 Kubernetes 提供商設定 etcd 爲使用雙向 TLS（客戶端和伺服器都驗證彼此的證書以進行身份驗證）。
儘管存在該特性，但目前還沒有被廣泛接受的 etcd API 鑑權實現。
由於缺少鑑權模型，任何具有對 etcd 的客戶端訪問權限的證書都可以用於獲得對 etcd 的完全訪問權限。
通常，僅用於健康檢查的 etcd 客戶端證書也可以授予完全讀寫訪問權限。

<!--
### Mitigations {#etcd-api-mitigations}
 -->
### 緩解措施 {#etcd-api-mitigations}

<!--
- Ensure that the certificate authority trusted by etcd is used only for the purposes of
  authentication to that service.
- Control access to the private key for the etcd server certificate, and to the API server's
  client certificate and key.
- Consider restricting access to the etcd port at a network level, to only allow access
  from specified and trusted IP address ranges.
 -->
- 確保 etcd 所信任的證書頒發機構僅用於該服務的身份認證。
- 控制對 etcd 伺服器證書的私鑰以及 API 伺服器的客戶端證書和密鑰的訪問。
- 考慮在網路層面限制對 etcd 端口的訪問，僅允許來自特定和受信任的 IP 地址段的訪問。

<!--
## Container runtime socket {#runtime-socket}
 -->
## 容器運行時套接字 {#runtime-socket}

<!--
On each node in a Kubernetes cluster, access to interact with containers is controlled
by the container runtime (or runtimes, if you have configured more than one). Typically,
the container runtime exposes a Unix socket that the kubelet can access. An attacker with
access to this socket can launch new containers or interact with running containers.
 -->
在 Kubernetes 叢集中的每個節點上，與容器交互的訪問都由容器運行時控制。
通常，容器運行時會公開一個 kubelet 可以訪問的 UNIX 套接字。
具有此套接字訪問權限的攻擊者可以啓動新容器或與正在運行的容器進行交互。

<!--
At the cluster level, the impact of this access depends on whether the containers that
run on the compromised node have access to Secrets or other confidential
data that an attacker could use to escalate privileges to other worker nodes or to
control plane components.
 -->
在叢集層面，這種訪問造成的影響取決於在受威脅節點上運行的容器是否可以訪問 Secret 或其他機密資料，
攻擊者可以使用這些機密資料將權限提升到其他工作節點或控制平面組件。

<!--
### Mitigations {#runtime-socket-mitigations}
 -->
### 緩解措施 {#runtime-socket-mitigations}

<!--
- Ensure that you tightly control filesystem access to container runtime sockets.
  When possible, restrict this access to the `root` user.
- Isolate the kubelet from other components running on the node, using
  mechanisms such as Linux kernel namespaces.
- Ensure that you restrict or forbid the use of [`hostPath` mounts](/docs/concepts/storage/volumes/#hostpath)
  that include the container runtime socket, either directly or by mounting a parent
  directory. Also `hostPath` mounts must be set as read-only to mitigate risks
  of attackers bypassing directory restrictions.
- Restrict user access to nodes, and especially restrict superuser access to nodes.
-->
- 確保嚴格控制對容器運行時套接字所在的檔案系統訪問。如果可能，限制爲僅 `root` 使用者可訪問。
- 使用 Linux 內核命名空間等機制將 kubelet 與節點上運行的其他組件隔離。
- 確保限制或禁止使用包含容器運行時套接字的 [`hostPath` 掛載](/zh-cn/docs/concepts/storage/volumes/#hostpath)，
  無論是直接掛載還是通過掛載父目錄掛載。此外，`hostPath` 掛載必須設置爲只讀，以降低攻擊者繞過目錄限制的風險。
- 限制使用者對節點的訪問，特別是限制超級使用者對節點的訪問。
