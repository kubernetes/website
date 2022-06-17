---
title: 實現細節
content_type: concept
weight: 100
---
<!--  
reviewers:
- luxas
- jbeda
title: Implementation details
content_type: concept
weight: 100
-->
<!-- overview -->

{{< feature-state for_k8s_version="v1.10" state="stable" >}}

<!--  
`kubeadm init` and `kubeadm join` together provides a nice user experience for creating a best-practice but bare Kubernetes cluster from scratch.
However, it might not be obvious _how_ kubeadm does that.
-->
`kubeadm init` 和 `kubeadm join` 結合在一起提供了良好的使用者體驗，因為從頭開始建立實踐最佳而配置最基本的 Kubernetes 叢集。
但是，kubeadm _如何_ 做到這一點可能並不明顯。

<!-- 
This document provides additional details on what happen under the hood, 
with the aim of sharing knowledge on Kubernetes cluster best practices. 
-->
本文件提供了更多幕後的詳細資訊，旨在分享有關 Kubernetes 叢集最佳實踐的知識。

<!-- body -->
<!--
## Core design principles
-->
## 核心設計原則    {#core-design-principles}

<!-- The cluster that `kubeadm init` and `kubeadm join` set up should be: -->
`kubeadm init` 和 `kubeadm join` 設定的叢集該是：

<!-- 
 - **Secure**: It should adopt latest best-practices like:
   - enforcing RBAC
   - using the Node Authorizer
   - using secure communication between the control plane components
   - using secure communication between the API server and the kubelets
   - lock-down the kubelet API
   - locking down access to the API for system components like the kube-proxy and CoreDNS
   - locking down what a Bootstrap Token can access
 - **User-friendly**: The user should not have to run anything more than a couple of commands:
   - `kubeadm init`
   - `export KUBECONFIG=/etc/kubernetes/admin.conf`
   - `kubectl apply -f <network-of-choice.yaml>`
   - `kubeadm join --token <token> <endpoint>:<port>`
 - **Extendable**:
   - It should _not_ favor any particular network provider. Configuring the cluster network is out-of-scope
   - It should provide the possibility to use a config file for customizing various parameters
-->
- **安全的**：它應採用最新的最佳實踐，例如：
  - 實施 RBAC 訪問控制
  - 使用節點鑑權機制（Node Authorizer）
  - 在控制平面元件之間使用安全通訊
  - 在 API 伺服器和 kubelet 之間使用安全通訊
  - 鎖定 kubelet API
  - 鎖定對系統元件（例如 kube-proxy 和 CoreDNS）的 API 的訪問
  - 鎖定啟動引導令牌（Bootstrap Token）可以訪問的內容
- **使用者友好**：使用者只需要執行幾個命令即可：
  - `kubeadm init`
  - `export KUBECONFIG=/etc/kubernetes/admin.conf`
  - `kubectl apply -f <所選網路.yaml>`
  - `kubeadm join --token <令牌> <端點>:<埠>`
- **可擴充套件的**：
  - _不_ 應偏向任何特定的網路提供商。不涉及配置叢集網路
  - 應該可以使用配置檔案來自定義各種引數

<!--
## Constants and well-known values and paths
-->
## 常量以及眾所周知的值和路徑  {#constants-and-well-known-values-and-paths}

<!-- 
In order to reduce complexity and to simplify development of higher level tools that build on top of kubeadm, it uses a
limited set of constant values for well-known paths and file names.
-->
為了降低複雜性並簡化基於 kubeadm 的高階工具的開發，對於眾所周知的路徑和檔名，
kubeadm 使用了一組有限的常量值。

<!--  
The Kubernetes directory `/etc/kubernetes` is a constant in the application, since it is clearly the given path
in a majority of cases, and the most intuitive location; other constants paths and file names are:
-->
Kubernetes 目錄 `/etc/kubernetes` 在應用程式中是一個常量，因為在大多數情況下
它顯然是給定的路徑，並且是最直觀的位置；其他路徑常量和檔名有：

<!--  
- `/etc/kubernetes/manifests` as the path where kubelet should look for static Pod manifests. Names of static Pod manifests are:
    - `etcd.yaml`
    - `kube-apiserver.yaml`
    - `kube-controller-manager.yaml`
    - `kube-scheduler.yaml`
- `/etc/kubernetes/` as the path where kubeconfig files with identities for control plane components are stored. Names of kubeconfig files are:
    - `kubelet.conf` (`bootstrap-kubelet.conf` during TLS bootstrap)
    - `controller-manager.conf`
    - `scheduler.conf`
    - `admin.conf` for the cluster admin and kubeadm itself
- Names of certificates and key files :
    - `ca.crt`, `ca.key` for the Kubernetes certificate authority
    - `apiserver.crt`, `apiserver.key` for the API server certificate
    - `apiserver-kubelet-client.crt`, `apiserver-kubelet-client.key` for the client certificate used by the API server to connect to the kubelets securely
    - `sa.pub`, `sa.key` for the key used by the controller manager when signing ServiceAccount
    - `front-proxy-ca.crt`, `front-proxy-ca.key` for the front proxy certificate authority
    - `front-proxy-client.crt`, `front-proxy-client.key` for the front proxy client
-->
- `/etc/kubernetes/manifests` 作為 kubelet 查詢靜態 Pod 清單的路徑。靜態 Pod 清單的名稱為：
  - `etcd.yaml`
  - `kube-apiserver.yaml`
  - `kube-controller-manager.yaml`
  - `kube-scheduler.yaml`
- `/etc/kubernetes/` 作為帶有控制平面元件身份標識的 kubeconfig 檔案的路徑。kubeconfig 檔案的名稱為：
  - `kubelet.conf` (在 TLS 引導時名稱為 `bootstrap-kubelet.conf` )
  - `controller-manager.conf`
  - `scheduler.conf`
  - `admin.conf` 用於叢集管理員和 kubeadm 本身
- 證書和金鑰檔案的名稱：
  - `ca.crt`, `ca.key` 用於 Kubernetes 證書頒發機構
  - `apiserver.crt`, `apiserver.key` 用於 API 伺服器證書
  - `apiserver-kubelet-client.crt`, `apiserver-kubelet-client.key`
    用於 API 伺服器安全地連線到 kubelet 的客戶端證書
  - `sa.pub`, `sa.key` 用於控制器管理器簽署 ServiceAccount 時使用的金鑰
  - `front-proxy-ca.crt`, `front-proxy-ca.key` 用於前端代理證書頒發機構
  - `front-proxy-client.crt`, `front-proxy-client.key` 用於前端代理客戶端

<!--
## kubeadm init workflow internal design
-->
## kubeadm init 工作流程內部設計  {#kubeadm-init-workflow-internal-design}

<!--  
The `kubeadm init` [internal workflow](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow) consists of a sequence of atomic work tasks to perform,
as described in `kubeadm init`.
-->
`kubeadm init` [內部工作流程](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow)
包含一系列要執行的原子性工作任務，如 `kubeadm init` 中所述。

<!--  
The [`kubeadm init phase`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/) command allows users to invoke each task individually, and ultimately offers a reusable and composable API/toolbox that can be used by other Kubernetes bootstrap tools, by any IT automation tool or by an advanced user for creating custom clusters.
-->
[`kubeadm init phase`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/)
命令允許使用者分別呼叫每個任務，並最終提供可重用且可組合的 API 或工具箱，
其他 Kubernetes 引導工具、任何 IT 自動化工具和高階使用者都可以使用它來
建立自定義叢集。

<!--
### Preflight checks
-->
### 預檢  {#preflight-checks}

<!-- 
Kubeadm executes a set of preflight checks before starting the init, with the aim to verify preconditions and avoid common cluster startup problems.
The user can skip specific preflight checks or all of them with the `--ignore-preflight-errors` option. 
-->
Kubeadm 在啟動 init 之前執行一組預檢，目的是驗證先決條件並避免常見的叢集啟動問題。
使用者可以使用 `--ignore-preflight-errors` 選項跳過特定的預檢查或全部檢查。

<!--  
- [warning] If the Kubernetes version to use (specified with the `--kubernetes-version` flag) is at least one minor version higher than the kubeadm CLI version.
- Kubernetes system requirements:
  - if running on linux:
    - [error] if Kernel is older than the minimum required version
    - [error] if required cgroups subsystem aren't set up
- [error] if the CRI endpoint does not answer
-->
- [警告] 如果要使用的 Kubernetes 版本（由 `--kubernetes-version` 標誌指定）比 kubeadm CLI
  版本至少高一個小版本。
- Kubernetes 系統要求：
  - 如果在 linux上執行：
    - [錯誤] 如果核心早於最低要求的版本
    - [錯誤] 如果未設定所需的 cgroups 子系統
- [錯誤] 如果 CRI 端點未應答
<!--  
- [error] if user is not root
- [error] if the machine hostname is not a valid DNS subdomain
- [warning] if the host name cannot be reached via network lookup
- [error] if kubelet version is lower that the minimum kubelet version supported by kubeadm (current minor -1)
- [error] if kubelet version is at least one minor higher than the required controlplane version (unsupported version skew)
- [warning] if kubelet service does not exist or if it is disabled
- [warning] if firewalld is active
- [error] if API server bindPort or ports 10250/10251/10252 are used
- [Error] if `/etc/kubernetes/manifest` folder already exists and it is not empty
- [Error] if `/proc/sys/net/bridge/bridge-nf-call-iptables` file does not exist/does not contain 1
- [Error] if advertise address is ipv6 and `/proc/sys/net/bridge/bridge-nf-call-ip6tables` does not exist/does not contain 1.
- [Error] if swap is on
- [Error] if `conntrack`, `ip`, `iptables`,  `mount`, `nsenter` commands are not present in the command path
- [warning] if `ebtables`, `ethtool`, `socat`, `tc`, `touch`, `crictl` commands are not present in the command path
- [warning] if extra arg flags for API server, controller manager,  scheduler contains some invalid options
- [warning] if connection to https://API.AdvertiseAddress:API.BindPort goes through proxy
- [warning] if connection to services subnet goes through proxy (only first address checked)
- [warning] if connection to Pods subnet goes through proxy (only first address checked)
-->
- [錯誤] 如果使用者不是 root 使用者
- [錯誤] 如果機器主機名不是有效的 DNS 子域
- [警告] 如果透過網路查詢無法訪問主機名
- [錯誤] 如果 kubelet 版本低於 kubeadm 支援的最低 kubelet 版本（當前小版本 -1）
- [錯誤] 如果 kubelet 版本比所需的控制平面板版本至少高一個小（不支援的版本偏斜）
- [警告] 如果 kubelet 服務不存在或已被禁用
- [警告] 如果 firewalld 處於活動狀態
- [錯誤] 如果 API   伺服器繫結的埠或 10250/10251/10252 埠已被佔用
- [錯誤] 如果 `/etc/kubernetes/manifest` 資料夾已經存在並且不為空
- [錯誤] 如果 `/proc/sys/net/bridge/bridge-nf-call-iptables` 檔案不存在或不包含 1
- [錯誤] 如果建議地址是 ipv6，並且 `/proc/sys/net/bridge/bridge-nf-call-ip6tables` 不存在或不包含 1
- [錯誤] 如果啟用了交換分割槽
- [錯誤] 如果命令路徑中沒有 `conntrack`、`ip`、`iptables`、`mount`、`nsenter` 命令
- [警告] 如果命令路徑中沒有 `ebtables`、`ethtool`、`socat`、`tc`、`touch`、`crictl` 命令
- [警告] 如果 API 伺服器、控制器管理器、排程程式的其他引數標誌包含一些無效選項
- [警告] 如果與 https://API.AdvertiseAddress:API.BindPort 的連線透過代理
- [警告] 如果服務子網的連線透過代理（僅檢查第一個地址）
- [警告] 如果 Pod 子網的連線透過代理（僅檢查第一個地址）
<!-- 
- If external etcd is provided:
  - [Error] if etcd version is older than the minimum required version
  - [Error] if etcd certificates or keys are specified, but not provided
- If external etcd is NOT provided (and thus local etcd will be installed):
  - [Error] if ports 2379 is used
  - [Error] if Etcd.DataDir folder already exists and it is not empty
- If authorization mode is ABAC:
  - [Error] if abac_policy.json does not exist
- If authorization mode is WebHook
  - [Error] if webhook_authz.conf does not exist
-->
- 如果提供了外部 etcd：
  - [錯誤] 如果 etcd 版本低於最低要求版本
  - [錯誤] 如果指定了 etcd 證書或金鑰，但無法找到
- 如果未提供外部 etcd（因此將安裝本地 etcd）：
  - [錯誤] 如果埠 2379 已被佔用
  - [錯誤] 如果 Etcd.DataDir 資料夾已經存在並且不為空
- 如果授權模式為 ABAC：
  - [錯誤] 如果 abac_policy.json 不存在
- 如果授權方式為 Webhook
  - [錯誤] 如果 webhook_authz.conf 不存在

<!-- Please note that: -->
請注意：

<!--  
1. Preflight checks can be invoked individually with the [`kubeadm init phase preflight`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-preflight) command
-->
1. 可以使用 [`kubeadm init phase preflight`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-preflight)
   命令單獨觸發預檢。

<!--
### Generate the necessary certificates
-->
### 生成必要的證書  {#generate-the-necessary-certificate}

<!-- Kubeadm generates certificate and private key pairs for different purposes: -->
Kubeadm 生成用於不同目的的證書和私鑰對：

<!-- 
 - A self signed certificate authority for the Kubernetes cluster saved into `ca.crt` file and `ca.key` private key file 
 - A serving certificate for the API server, generated using `ca.crt` as the CA, and saved into `apiserver.crt` file with
   its private key `apiserver.key`. This certificate should contain following alternative names:
     - The Kubernetes service's internal clusterIP (the first address in the services CIDR, e.g. `10.96.0.1` if service subnet is `10.96.0.0/12`)
     - Kubernetes DNS names, e.g.  `kubernetes.default.svc.cluster.local` if `--service-dns-domain` flag value is `cluster.local`, plus default DNS names `kubernetes.default.svc`, `kubernetes.default`, `kubernetes`
     - The node-name
     - The `--apiserver-advertise-address`
     - Additional alternative names specified by the user
 - A client certificate for the API server to connect to the kubelets securely, generated using `ca.crt` as the CA and saved into
   `apiserver-kubelet-client.crt` file with its private key `apiserver-kubelet-client.key`.
   This certificate should be in the `system:masters` organization
 - A private key for signing ServiceAccount Tokens saved into `sa.key` file along with its public key `sa.pub`
 - A certificate authority for the front proxy saved into `front-proxy-ca.crt` file with its key `front-proxy-ca.key`
 - A client cert for the front proxy client, generated using `front-proxy-ca.crt` as the CA and saved into `front-proxy-client.crt` file
   with its private key`front-proxy-client.key`
-->
- Kubernetes 叢集的自簽名證書頒發機構會儲存到 `ca.crt` 檔案和 `ca.key` 私鑰檔案中
- 用於 API 伺服器的服務證書，使用 `ca.crt` 作為 CA 生成，並將證書儲存到 `apiserver.crt`
  檔案中，私鑰儲存到 `apiserver.key` 檔案中
  該證書應包含以下備用名稱：

  - Kubernetes 服務的內部 clusterIP（服務 CIDR 的第一個地址。
    例如：如果服務的子網是 `10.96.0.0/12`，則為 `10.96.0.1`）
  - Kubernetes DNS 名稱，例如：如果 `--service-dns-domain` 標誌值是 `cluster.local`，
    則為 `kubernetes.default.svc.cluster.local`；
    加上預設的 DNS 名稱 `kubernetes.default.svc`、`kubernetes.default` 和 `kubernetes`，
  - 節點名稱
  - `--apiserver-advertise-address`
  - 使用者指定的其他備用名稱 

- 用於 API 伺服器安全連線到 kubelet 的客戶端證書，使用 `ca.crt` 作為 CA 生成，
  並儲存到 `apiserver-kubelet-client.crt`，私鑰儲存到 `apiserver-kubelet-client.key`
  檔案中。該證書應該在 `system:masters` 組織中。
- 用於簽名 ServiceAccount 令牌的私鑰儲存到 `sa.key` 檔案中，公鑰儲存到 `sa.pub` 檔案中
- 用於前端代理的證書頒發機構儲存到 `front-proxy-ca.crt` 檔案中，私鑰儲存到
  `front-proxy-ca.key` 檔案中
- 前端代理客戶端的客戶端證書，使用 `front-proxy-ca.crt` 作為 CA 生成，並儲存到
  `front-proxy-client.crt` 檔案中，私鑰儲存到 `front-proxy-client.key` 檔案中

<!-- 
Certificates are stored by default in `/etc/kubernetes/pki`, but this directory is configurable using the `--cert-dir` flag. 
-->
證書預設情況下儲存在 `/etc/kubernetes/pki` 中，但是該目錄可以使用 `--cert-dir` 標誌進行配置。

<!--
Please note that:
-->
請注意：

<!-- 
1. If a given certificate and private key pair both exist, and its content is evaluated compliant with the above specs, the existing files will
   be used and the generation phase for the given certificate skipped. This means the user can, for example, copy an existing CA to
   `/etc/kubernetes/pki/ca.{crt,key}`, and then kubeadm will use those files for signing the rest of the certs.
   See also [using custom certificates](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#custom-certificates)
2. Only for the CA, it is possible to provide the `ca.crt` file but not the `ca.key` file, if all other certificates and kubeconfig files
   already are in place kubeadm recognize this condition and activates the ExternalCA , which also implies the `csrsigner`controller in
   controller-manager won't be started
3. If kubeadm is running in [external CA mode](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#external-ca-mode);
   all the certificates must be provided by the user, because kubeadm cannot generate them by itself
4. In case of kubeadm is executed in the `--dry-run` mode, certificates files are written in a temporary folder
5. Certificate generation can be invoked individually with the [`kubeadm init phase certs all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-certs) command
-->
1. 如果證書和私鑰對都存在，並且其內容經過評估符合上述規範，將使用現有檔案，
   並且跳過給定證書的生成階段。
   這意味著使用者可以將現有的 CA 複製到 `/etc/kubernetes/pki/ca.{crt,key}`，
   kubeadm 將使用這些檔案對其餘證書進行簽名。
   請參閱[使用自定義證書](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#custom-certificates)。
2. 僅對 CA 來說，如果所有其他證書和 kubeconfig 檔案都已就位，則可以只提供 `ca.crt` 檔案，
   而不提供 `ca.key` 檔案。
   kubeadm 能夠識別出這種情況並啟用 ExternalCA，這也意味著了控制器管理器中的
   `csrsigner` 控制器將不會啟動
3. 如果 kubeadm 在
   [外部 CA 模式](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#external-ca-mode)
   下執行，所有證書必須由使用者提供，因為 kubeadm 無法自行生成它們。
4. 如果在 `--dry-run` 模式下執行 kubeadm，證書檔案將寫入一個臨時資料夾中
5. 可以使用 [`kubeadm init phase certs all`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-certs) 
   命令單獨生成證書。

<!--
### Generate kubeconfig files for control plane components
-->
### 為控制平面元件生成 kubeconfig 檔案  {#generate-kubeconfig-files-for-control-plane-components}

<!-- 
Kubeadm generates kubeconfig files with identities for control plane components:
-->
Kubeadm 生成具有用於控制平面元件身份標識的 kubeconfig 檔案：

<!--  
- A kubeconfig file for the kubelet to use during TLS bootstrap - /etc/kubernetes/bootstrap-kubelet.conf. Inside this file there is a bootstrap-token or embedded client certificates for authenticating this node with the cluster.
  This client cert should:
    - Be in the `system:nodes` organization, as required by the [Node Authorization](/docs/reference/access-authn-authz/node/) module
    - Have the Common Name (CN) `system:node:<hostname-lowercased>`
- A kubeconfig file for controller-manager, `/etc/kubernetes/controller-manager.conf`; inside this file is embedded a client
  certificate with controller-manager identity. This client cert should have the CN `system:kube-controller-manager`, as defined
by default [RBAC core components roles](/docs/reference/access-authn-authz/rbac/#core-component-roles)
- A kubeconfig file for scheduler, `/etc/kubernetes/scheduler.conf`; inside this file is embedded a client certificate with scheduler identity.
  This client cert should have the CN `system:kube-scheduler`, as defined by default [RBAC core components roles](/docs/reference/access-authn-authz/rbac/#core-component-roles)
-->
- 供 kubelet 在 TLS 引導期間使用的 kubeconfig 檔案 —— `/etc/kubernetes/bootstrap-kubelet.conf`。
  在此檔案中，有一個引導令牌或內嵌的客戶端證書，向叢集表明此節點身份。
  此客戶端證書應：

  - 根據[節點鑑權](/zh-cn/docs/reference/access-authn-authz/node/)模組的要求，屬於 `system:nodes` 組織
  - 具有通用名稱（CN）：`system:node:<小寫主機名>`

- 控制器管理器的 kubeconfig 檔案 —— `/etc/kubernetes/controller-manager.conf`；
  在此檔案中嵌入了一個具有控制器管理器身份標識的客戶端證書。
  此客戶端證書應具有 CN：`system:kube-controller-manager`，
  該 CN 由 [RBAC 核心元件角色](/zh-cn/docs/reference/access-authn-authz/rbac/#core-component-roles)
  預設定義的。

- 排程器的 kubeconfig 檔案 —— `/etc/kubernetes/scheduler.conf`；
  此檔案中嵌入了具有排程器身份標識的客戶端證書。此客戶端證書應具有 CN：`system:kube-scheduler`，
  該 CN 由 [RBAC 核心元件角色](/zh-cn/docs/reference/access-authn-authz/rbac/#core-component-roles)
  預設定義的。

<!-- 
Additionally, a kubeconfig file for kubeadm itself and the admin is generated and saved into the `/etc/kubernetes/admin.conf` file.
The "admin" here is defined as the actual person(s) that is administering the cluster and wants to have full control (**root**) over the cluster.
The embedded client certificate for admin should be in the `system:masters` organization, as defined by default
[RBAC user facing role bindings](/docs/reference/access-authn-authz/rbac/#user-facing-roles). It should also include a
CN. Kubeadm uses the `kubernetes-admin` CN.
-->
另外，用於 kubeadm 本身和 admin 的 kubeconfig 檔案也被生成並儲存到
`/etc/kubernetes/admin.conf` 檔案中。
此處的 admin 定義為正在管理叢集並希望完全控制叢集（**root**）的實際人員。
內嵌的 admin 客戶端證書應是  `system:masters` 組織的成員，
這一組織名由預設的 [RBAC 面向使用者的角色繫結](/zh-cn/docs/reference/access-authn-authz/rbac/#user-facing-roles)
定義。它還應包括一個 CN。kubeadm 使用 `kubernetes-admin` CN。

<!-- Please note that: -->
請注意：

<!--  
1. `ca.crt` certificate is embedded in all the kubeconfig files.
2. If a given kubeconfig file exists, and its content is evaluated compliant with the above specs, the existing file will be used and the generation phase for the given kubeconfig skipped
3. If kubeadm is running in [ExternalCA mode](/docs/reference/setup-tools/kubeadm/kubeadm-init/#external-ca-mode), all the required kubeconfig must be provided by the user as well, because kubeadm cannot generate any of them by itself
4. In case of kubeadm is executed in the `--dry-run` mode, kubeconfig files are written in a temporary folder
5. Kubeconfig files generation can be invoked individually with the [`kubeadm init phase kubeconfig all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-kubeconfig) command
-->
1. `ca.crt` 證書內嵌在所有 kubeconfig 檔案中。
2. 如果給定的 kubeconfig 檔案存在且其內容經過評估符合上述規範，則 kubeadm 將使用現有檔案，
   並跳過給定 kubeconfig 的生成階段
3. 如果 kubeadm 以 [ExternalCA 模式](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#external-ca-mode)
   執行，則所有必需的 kubeconfig 也必須由使用者提供，因為 kubeadm 不能自己生成
4. 如果在 `--dry-run` 模式下執行 kubeadm，則 kubeconfig 檔案將寫入一個臨時資料夾中
5. 可以使用
   [`kubeadm init phase kubeconfig all`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-kubeconfig)
   命令分別生成 kubeconfig 檔案。

<!--
### Generate static Pod manifests for control plane components
-->
### 為控制平面元件生成靜態 Pod 清單  {#generate-static-pod-manifests-for-control-plane-components}

<!--  
Kubeadm writes static Pod manifest files for control plane components to `/etc/kubernetes/manifests`. The kubelet watches this directory for Pods to create on startup.
-->
Kubeadm 將用於控制平面元件的靜態 Pod 清單檔案寫入 `/etc/kubernetes/manifests` 目錄。
Kubelet 啟動後會監視這個目錄以便建立 Pod。

<!-- Static Pod manifest share a set of common properties: -->
靜態 Pod 清單有一些共同的屬性：

<!--  
- All static Pods are deployed on `kube-system` namespace
- All static Pods get `tier:control-plane` and `component:{component-name}` labels
- All static Pods use the `system-node-critical` priority class
- `hostNetwork: true` is set on all static Pods to allow control plane startup before a network is configured; as a consequence:
  * The `address` that the controller-manager and the scheduler use to refer the API server is `127.0.0.1`
  * If using a local etcd server, `etcd-servers` address will be set to `127.0.0.1:2379`
- Leader election is enabled for both the controller-manager and the scheduler
- Controller-manager and the scheduler will reference kubeconfig files with their respective, unique identities
- All static Pods get any extra flags specified by the user as described in [passing custom arguments to control plane components](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)
- All static Pods get any extra Volumes specified by the user (Host path)
-->
- 所有靜態 Pod 都部署在 `kube-system` 名字空間
- 所有靜態 Pod 都打上 `tier:ontrol-plane` 和 `component:{元件名稱}` 標籤
- 所有靜態 Pod 均使用 `system-node-critical` 優先順序
- 所有靜態 Pod 都設定了 `hostNetwork:true`，使得控制平面在配置網路之前啟動；結果導致：

  * 控制器管理器和排程器用來呼叫 API 伺服器的地址為 127.0.0.1。
  * 如果使用本地 etcd 伺服器，則 `etcd-servers` 地址將設定為 `127.0.0.1:2379`

- 同時為控制器管理器和排程器啟用了領導者選舉
- 控制器管理器和排程器將引用 kubeconfig 檔案及其各自的唯一標識
- 如[將自定義引數傳遞給控制平面元件](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)
  中所述，所有靜態 Pod 都會獲得使用者指定的額外標誌
- 所有靜態 Pod 都會獲得使用者指定的額外卷（主機路徑）

<!-- Please note that: -->
請注意：

<!--  
1. All images will be pulled from k8s.gcr.io by default. See [using custom images](/docs/reference/setup-tools/kubeadm/kubeadm-init/#custom-images) for customizing the image repository
2. In case of kubeadm is executed in the `-dry-run` mode, static Pods files are written in a temporary folder
3. Static Pod manifest generation for control plane components can be invoked individually with the [`kubeadm init phase control-plane all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-control-plane) command
-->
1. 所有映象預設從 k8s.gcr.io 拉取。 
   關於自定義映象倉庫，請參閱
   [使用自定義映象](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#custom-images)。
2. 如果在 `--dry-run` 模式下執行 kubeadm，則靜態 Pod 檔案寫入一個臨時資料夾中。
3. 可以使用 [`kubeadm init phase control-plane all`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-control-plane) 
   命令分別生成主控元件的靜態 Pod 清單。

<!--
#### API server

The static Pod manifest for the API server is affected by following parameters provided by the users: 
-->
#### API 伺服器  {#api-server}

API 伺服器的靜態 Pod 清單會受到使用者提供的以下引數的影響:

<!--  
 - The `apiserver-advertise-address` and `apiserver-bind-port` to bind to; if not provided, those value defaults to the IP address of
   the default network interface on the machine and port 6443
 - The `service-cluster-ip-range` to use for services
 - If an external etcd server is specified, the `etcd-servers` address and related TLS settings (`etcd-cafile`, `etcd-certfile`, `etcd-keyfile`);
   if an external etcd server is not be provided, a local etcd will be used (via host network)
 - If a cloud provider is specified, the corresponding `--cloud-provider` is configured, together with the  `--cloud-config` path
   if such file exists (this is experimental, alpha and will be removed in a future version)
-->
- 要繫結的 `apiserver-advertise-address` 和 `apiserver-bind-port`；
  如果未提供，則這些值預設為機器上預設網路介面的 IP 地址和 6443 埠。
- `service-cluster-ip-range` 給 service 使用
- 如果指定了外部 etcd 伺服器，則應指定 `etcd-servers` 地址和相關的 TLS 設定
  （`etcd-cafile`，`etcd-certfile`，`etcd-keyfile`）；
  如果未提供外部 etcd 伺服器，則將使用本地 etcd（透過主機網路）
- 如果指定了雲提供商，則配置相應的 `--cloud-provider`，如果該路徑存在，則配置 `--cloud-config`
  （這是實驗性的，是 Alpha 版本，將在以後的版本中刪除）

<!-- Other API server flags that are set unconditionally are: -->
無條件設定的其他 API 伺服器標誌有：

<!--  
 - `--insecure-port=0` to avoid insecure connections to the api server
 - `--enable-bootstrap-token-auth=true` to enable the `BootstrapTokenAuthenticator` authentication module.
   See [TLS Bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/) for more details
 - `--allow-privileged` to `true` (required e.g. by kube proxy)
 - `--requestheader-client-ca-file` to `front-proxy-ca.crt`
-->
- `--insecure-port=0` 禁止到 API 伺服器不安全的連線
- `--enable-bootstrap-token-auth=true` 啟用 `BootstrapTokenAuthenticator` 身份驗證模組。
  更多細節請參見 [TLS 引導](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)。
- `--allow-privileged` 設為 `true`（諸如 kube-proxy 這些元件有此要求）
- `--requestheader-client-ca-file` 設為 `front-proxy-ca.crt`

<!--
 - `--enable-admission-plugins` to:
    - [`NamespaceLifecycle`](/docs/reference/access-authn-authz/admission-controllers/#namespacelifecycle) e.g. to avoid deletion of
      system reserved namespaces
    - [`LimitRanger`](/docs/reference/access-authn-authz/admission-controllers/#limitranger) and [`ResourceQuota`](/docs/reference/access-authn-authz/admission-controllers/#resourcequota) to enforce limits on namespaces
    - [`ServiceAccount`](/docs/reference/access-authn-authz/admission-controllers/#serviceaccount) to enforce service account automation
    - [`PersistentVolumeLabel`](/docs/reference/access-authn-authz/admission-controllers/#persistentvolumelabel) attaches region or zone labels to
      PersistentVolumes as defined by the cloud provider (This admission controller is deprecated and will be removed in a future version.
      It is not deployed by kubeadm by default with v1.9 onwards when not explicitly opting into using `gce` or `aws` as cloud providers)
    - [`DefaultStorageClass`](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass) to enforce default storage class on `PersistentVolumeClaim` objects
    - [`DefaultTolerationSeconds`](/docs/reference/access-authn-authz/admission-controllers/#defaulttolerationseconds)
    - [`NodeRestriction`](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) to limit what a kubelet can modify
      (e.g. only pods on this node)
-->
- `--enable-admission-plugins` 設為：
  - [`NamespaceLifecycle`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#namespacelifecycle) 
    例如，避免刪除系統保留的名字空間
  - [`LimitRanger`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#limitranger) 和
    [`ResourceQuota`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#resourcequota)
    對名字空間實施限制
  - [`ServiceAccount`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#serviceaccount)
    實施服務賬戶自動化
  - [`PersistentVolumeLabel`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#persistentvolumelabel) 
    將區域（Region）或區（Zone）標籤附加到由雲提供商定義的 PersistentVolumes
    （此准入控制器已被棄用並將在以後的版本中刪除）。
    如果未明確選擇使用 `gce` 或 `aws` 作為雲提供商，則預設情況下，v1.9 以後的版本 kubeadm 都不會部署。
  - [`DefaultStorageClass`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass) 
    在 `PersistentVolumeClaim` 物件上強制使用預設儲存型別
  - [`DefaultTolerationSeconds`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaulttolerationseconds)
  - [`NodeRestriction`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction) 
    限制 kubelet 可以修改的內容（例如，僅此節點上的 pod）
<!--
 - `--kubelet-preferred-address-types` to `InternalIP,ExternalIP,Hostname;` this makes `kubectl logs` and other API server-kubelet
   communication work in environments where the hostnames of the nodes aren't resolvable
 - Flags for using certificates generated in previous steps:
    - `--client-ca-file` to `ca.crt`
    - `--tls-cert-file` to `apiserver.crt`
    - `--tls-private-key-file` to `apiserver.key`
    - `--kubelet-client-certificate` to `apiserver-kubelet-client.crt`
    - `--kubelet-client-key` to `apiserver-kubelet-client.key`
    - `--service-account-key-file` to `sa.pub`
    - `--requestheader-client-ca-file` to`front-proxy-ca.crt`
    - `--proxy-client-cert-file` to `front-proxy-client.crt`
    - `--proxy-client-key-file` to `front-proxy-client.key`
 - Other flags for securing the front proxy ([API Aggregation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)) communications:
    - `--requestheader-username-headers=X-Remote-User`
    - `--requestheader-group-headers=X-Remote-Group`
    - `--requestheader-extra-headers-prefix=X-Remote-Extra-`
    - `--requestheader-allowed-names=front-proxy-client`
-->
- `--kubelet-preferred-address-types` 設為 `InternalIP,ExternalIP,Hostname;` 
  這使得在節點的主機名無法解析的環境中，`kubectl log` 和 API 伺服器與 kubelet
  的其他通訊可以工作
- 使用在前面步驟中生成的證書的標誌：

  - `--client-ca-file` 設為 `ca.crt`
  - `--tls-cert-file` 設為 `apiserver.crt`
  - `--tls-private-key-file` 設為 `apiserver.key`
  - `--kubelet-client-certificate` 設為 `apiserver-kubelet-client.crt`
  - `--kubelet-client-key` 設為 `apiserver-kubelet-client.key`
  - `--service-account-key-file` 設為 `sa.pub`
  - `--requestheader-client-ca-file` 設為 `front-proxy-ca.crt`
  - `--proxy-client-cert-file` 設為 `front-proxy-client.crt`
  - `--proxy-client-key-file` 設為 `front-proxy-client.key`

- 其他用於保護前端代理（
  [API 聚合層](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)）
  通訊的標誌:

  - `--requestheader-username-headers=X-Remote-User`
  - `--requestheader-group-headers=X-Remote-Group`
  - `--requestheader-extra-headers-prefix=X-Remote-Extra-`
  - `--requestheader-allowed-names=front-proxy-client`

<!--
#### Controller manager
-->
#### 控制器管理器  {#controller-manager}

<!-- 
The static Pod manifest for the controller manager is affected by following parameters provided by the users: 
-->
控制器管理器的靜態 Pod 清單受使用者提供的以下引數的影響:

<!-- 
- If kubeadm is invoked specifying a `--pod-network-cidr`, the subnet manager feature required for some CNI network plugins is enabled by
   setting:
   - `--allocate-node-cidrs=true`
   - `--cluster-cidr` and `--node-cidr-mask-size` flags according to the given CIDR
 - If a cloud provider is specified, the corresponding `--cloud-provider` is specified, together with the  `--cloud-config` path
   if such configuration file exists (this is experimental, alpha and will be removed in a future version)
-->
- 如果呼叫 kubeadm 時指定了 `--pod-network-cidr` 引數，則可以透過以下方式啟用
  某些 CNI 網路外掛所需的子網管理器功能：
  - 設定 `--allocate-node-cidrs=true`
  - 根據給定 CIDR 設定 `--cluster-cidr` 和 `--node-cidr-mask-size` 標誌
- 如果指定了雲提供商，則指定相應的 `--cloud-provider`，如果存在這樣的配置檔案，
  則指定 `--cloud-config` 路徑（此為試驗性功能，是 Alpha 版本，將在以後的版本中刪除）。

<!-- Other flags that are set unconditionally are: -->
其他無條件設定的標誌包括：

<!--  
 - `--controllers` enabling all the default controllers plus `BootstrapSigner` and `TokenCleaner` controllers for TLS bootstrap.
   See [TLS Bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/) for more details
 - `--use-service-account-credentials` to `true`
 - Flags for using certificates generated in previous steps:
    - `--root-ca-file` to `ca.crt`
    - `--cluster-signing-cert-file` to `ca.crt`, if External CA mode is disabled, otherwise to `""`
    - `--cluster-signing-key-file` to `ca.key`, if External CA mode is disabled, otherwise to `""`
    - `--service-account-private-key-file` to `sa.key`
-->
- `--controllers` 為 TLS 載入程式啟用所有預設控制器以及 `BootstrapSigner` 和
  `TokenCleaner` 控制器。詳細資訊請參閱
  [TLS 引導](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
- `--use-service-account-credentials` 設為 `true`
- 使用先前步驟中生成的證書的標誌：

  -`--root-ca-file` 設為 `ca.crt`
  - 如果禁用了 External CA 模式，則 `--cluster-signing-cert-file` 設為 `ca.crt`，否則設為 `""`
  - 如果禁用了 External CA 模式，則 `--cluster-signing-key-file` 設為 `ca.key`，否則設為 `""`
  - `--service-account-private-key-file` 設為 `sa.key`

<!--
#### Scheduler

The static Pod manifest for the scheduler is not affected by parameters provided by the users. 
-->
#### 排程器  {#scheduler}

排程器的靜態 Pod 清單不受使用者提供的引數的影響。

<!--
### Generate static Pod manifest for local etcd
-->
### 為本地 etcd 生成靜態 Pod 清單  {#generate-static-pod-manifest-for-local-etcd}

<!--  
If the user specified an external etcd this step will be skipped, otherwise kubeadm generates a static Pod manifest file for creating
a local etcd instance running in a Pod with following attributes:
-->
如果使用者指定了外部 etcd，則將跳過此步驟，否則 kubeadm 會生成靜態 Pod 清單檔案，
以建立在 Pod 中執行的具有以下屬性的本地 etcd 例項：

<!--  
- listen on `localhost:2379` and use `HostNetwork=true`
- make a `hostPath` mount out from the `dataDir` to the host's filesystem
- Any extra flags specified by the user
-->
- 在 `localhost:2379` 上監聽並使用 `HostNetwork=true`
- 將 `hostPath` 從 `dataDir` 掛載到主機的檔案系統
- 使用者指定的任何其他標誌

<!-- Please note that: -->
請注意：

<!--  
1. The etcd image will be pulled from `k8s.gcr.io` by default. See [using custom images](/docs/reference/setup-tools/kubeadm/kubeadm-init/#custom-images) for customizing the image repository
2. in case of kubeadm is executed in the `--dry-run` mode, the etcd static Pod manifest is written in a temporary folder
3. Static Pod manifest generation for local etcd can be invoked individually with the [`kubeadm init phase etcd local`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-etcd) command
-->
1. etcd 映象預設從 `k8s.gcr.io` 拉取。有關自定義映象倉庫，請參閱
   [使用自定義映象](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#custom-images)。
2. 如果 kubeadm 以 `--dry-run` 模式執行，etcd 靜態 Pod 清單將寫入一個臨時資料夾。
3. 可以使用
   ['kubeadm init phase etcd local'](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-etcd)
   命令單獨為本地 etcd 生成靜態 Pod 清單

<!--
### Wait for the control plane to come up
-->
### 等待控制平面啟動  {#wait-for-the-control-plane-to-come-up}

<!--  
kubeadm waits (upto 4m0s) until `localhost:6443/healthz` (kube-apiserver liveness) returns `ok`. However in order to detect
deadlock conditions, kubeadm fails fast if `localhost:10255/healthz` (kubelet liveness) or
`localhost:10255/healthz/syncloop` (kubelet readiness) don't return `ok` within 40s and 60s respectively.
-->
kubeadm 等待（最多 4m0s），直到 `localhost:6443/healthz`（kube-apiserver 存活）返回 `ok`。 
但是為了檢測死鎖條件，如果 `localhost:10255/healthz`（kubelet 存活）或
`localhost:10255/healthz/syncloop`（kubelet 就緒）未能在 40s 和 60s 內未返回 `ok`，
則 kubeadm 會快速失敗。

<!--  
kubeadm relies on the kubelet to pull the control plane images and run them properly as static Pods.
After the control plane is up, kubeadm completes the tasks described in following paragraphs.
-->
kubeadm 依靠 kubelet 拉取控制平面鏡像並將其作為靜態 Pod 正確執行。
控制平面啟動後，kubeadm 將完成以下段落中描述的任務。

<!--
### Save the kubeadm ClusterConfiguration in a ConfigMap for later reference
-->
### 將 kubeadm ClusterConfiguration 儲存在 ConfigMap 中以供以後參考  {#save-the-kubeadm-clusterConfiguration-in-a-configMap-for-later-reference}

<!-- 
kubeadm saves the configuration passed to `kubeadm init` in a ConfigMap named `kubeadm-config` under `kube-system` namespace. 
-->
kubeadm 將傳遞給 `kubeadm init` 的配置儲存在 `kube-system` 名字空間下名為
`kubeadm-config` 的 ConfigMap 中。

<!--  
This will ensure that kubeadm actions executed in future (e.g `kubeadm upgrade`) will be able to determine the actual/current cluster
state and make new decisions based on that data.
-->
這將確保將來執行的 kubeadm 操作（例如 `kubeadm upgrade`）將能夠確定實際/當前叢集狀態，
並根據該資料做出新的決策。

<!-- Please note that: -->
請注意：

<!-- 
1. Before saving the ClusterConfiguration, sensitive information like the token is stripped from the configuration
2. Upload of control plane ndoe configuration can be invoked individually with the [`kubeadm init phase upload-config`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-upload-config) command
-->
1. 在儲存 ClusterConfiguration 之前，從配置中刪除令牌等敏感資訊。
2. 可以使用
   [`kubeadm init phase upload-config`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-upload-config) 
   命令單獨上傳主控節點配置。

<!--
### Mark the node as control-plane
-->
### 將節點標記為控制平面  {#mark-the-node-as-control-plane}

<!--
As soon as the control plane is available, kubeadm executes following actions:
-->
一旦控制平面可用，kubeadm 將執行以下操作：

<!-- 
- Labels the node as control-plane with `node-role.kubernetes.io/control-plane=""`
- Taints the node with `node-role.kubernetes.io/master:NoSchedule` and `node-role.kubernetes.io/control-plane:NoSchedule`
-->
- 給節點打上 `node-role.kubernetes.io/control-plane=""` 標籤，標記其為控制平面
- 給節點打上 `node-role.kubernetes.io/master:NoSchedule` 和 `node-role.kubernetes.io/control-plane:NoSchedule` 汙點

<!-- Please note that: -->
請注意：

<!-- 
1. The `node-role.kubernetes.io/master` taint is deprecated and will be removed in kubeadm version 1.25
1. Mark control-plane phase can be invoked individually with the [`kubeadm init phase mark-control-plane`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-mark-control-plane) command
-->
1. `node-role.kubernetes.io/master` 汙點是已廢棄的，將會在 kubeadm 1.25 版本中移除
1. 可以使用 [`kubeadm init phase mark-control-plane`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-mark-control-plane) 
  命令單獨觸發控制平面標記

<!--
### Configure TLS-Bootstrapping for node joining
-->
### 為即將加入的節點加入 TLS 啟動引導  {#configure-tls-bootstrapping-for-node-joining}

<!--
Kubeadm uses [Authenticating with Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) for joining new nodes to an
existing cluster; for more details see also [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/cluster-lifecycle/bootstrap-discovery.md).
-->

Kubeadm 使用[引導令牌認證](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)
將新節點連線到現有叢集；
更多的詳細資訊，請參見
[設計提案](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/cluster-lifecycle/bootstrap-discovery.md)。

<!-- 
`kubeadm init` ensures that everything is properly configured for this process, and this includes following steps as well as
setting API server and controller flags as already described in previous paragraphs.
-->
`kubeadm init` 確保為該過程正確配置了所有內容，這包括以下步驟以及設定 API 伺服器
和控制器標誌，如前幾段所述。

<!-- Please note that: -->
請注意：

<!-- 
1. TLS bootstrapping for nodes can be configured with the [`kubeadm init phase bootstrap-token`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-bootstrap-token)
   command, executing all the configuration steps described in following paragraphs; alternatively, each step can be invoked individually
-->
1. 可以使用
   [`kubeadm init phase bootstrap-token`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-bootstrap-token) 
   命令配置節點的 TLS 引導，執行以下段落中描述的所有配置步驟；
   或者每個步驟都單獨觸發。

<!--
#### Create a bootstrap token
-->
#### 建立引導令牌  {#create-a-bootstrap-token}

<!--  
`kubeadm init` create a first bootstrap token, either generated automatically or provided by the user with the `--token` flag; as documented
in bootstrap token specification, token should be saved as secrets with name `bootstrap-token-<token-id>` under `kube-system` namespace.
-->
`kubeadm init` 建立第一個引導令牌，該令牌是自動生成的或由使用者提供的 `--token`
標誌的值；如引導令牌規範中記錄的那樣，
令牌應儲存在 `kube-system` 名字空間下名為 `bootstrap-token-<令牌-id>`
的 Secret 中。

<!--
Please note that:
-->
請注意：

<!--  
1. The default token created by `kubeadm init` will be used to validate temporary user during TLS bootstrap process; those users will
   be member of  `system:bootstrappers:kubeadm:default-node-token` group
2. The token has a limited validity, default 24 hours (the interval may be changed with the `—token-ttl` flag)
3. Additional tokens can be created with the [`kubeadm token`](/docs/reference/setup-tools/kubeadm/kubeadm-token/) command, that provide as well other useful functions
   for token management
-->
1. 由 `kubeadm init` 建立的預設令牌將用於在 TLS 引導過程中驗證臨時使用者；
   這些使用者會成為 `system:bootstrappers:kubeadm:default-node-token` 組的成員。
2. 令牌的有效期有限，預設為 24 小時（間隔可以透過 `-token-ttl` 標誌進行更改）
3. 可以使用 [`kubeadm token`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-token/)
   命令建立其他令牌，這些令牌還提供其他有用的令牌管理功能

<!--
#### Allow joining nodes to call CSR API
-->
#### 允許加入的節點呼叫 CSR API  {#allow-joining-nodes-to-call-csr-api}

<!--
Kubeadm ensures that users in  `system:bootstrappers:kubeadm:default-node-token` group are able to access the certificate signing API.
-->
Kubeadm 確保 `system:bootstrappers:kubeadm:default-node-token` 組中的使用者
能夠訪問證書籤名 API。

<!-- 
This is implemented by creating a ClusterRoleBinding named `kubeadm:kubelet-bootstrap` between the group above and the default
RBAC role `system:node-bootstrapper`.
-->
這是透過在上述組與預設 RBAC 角色 `system:node-bootstrapper` 之間建立名為
`kubeadm:kubelet-bootstrap` 的 ClusterRoleBinding 來實現的。

<!--
#### Setup auto approval for new bootstrap tokens
-->
#### 為新的引導令牌設定自動批准  {#setup-auto-approval-for-new-bootstrap-tokens}

<!--
Kubeadm ensures that the Bootstrap Token will get its CSR request automatically approved by the csrapprover controller.
-->
Kubeadm 確保 csrapprover 控制器自動批准引導令牌的 CSR 請求。

<!-- 
This is implemented by creating ClusterRoleBinding named `kubeadm:node-autoapprove-bootstrap` between
the  `system:bootstrappers:kubeadm:default-node-token` group and the default role `system:certificates.k8s.io:certificatesigningrequests:nodeclient`.
-->
這是透過在 `system:bootstrappers:kubeadm:default-node-token` 使用者組和
`system:certificates.k8s.io:certificatesigningrequests:nodeclient` 預設角色之間
建立名為 `kubeadm:node-autoapprove-bootstrap` 的 ClusterRoleBinding 來實現的。

<!-- 
The role `system:certificates.k8s.io:certificatesigningrequests:nodeclient` should be created as well, granting
POST permission to `/apis/certificates.k8s.io/certificatesigningrequests/nodeclient`.
-->
還應建立 `system:certificates.k8s.io:certificatesigningrequests:nodeclient` 角色，
授予對 `/apis/certificates.k8s.io/certificatesigningrequests/nodeclient`
執行 POST 的許可權。

<!--
#### Setup nodes certificate rotation with auto approval
-->
#### 透過自動批准設定節點證書輪換 {#setup-nodes-certificate-rotation-with-auto-approval} 

<!-- 
Kubeadm ensures that certificate rotation is enabled for nodes, and that new certificate request for nodes will get its CSR request
automatically approved by the csrapprover controller. 
-->
Kubeadm 確保節點啟用了證書輪換，csrapprover 控制器將自動批准節點的
新證書的 CSR 請求。

<!-- 
This is implemented by creating ClusterRoleBinding named `kubeadm:node-autoapprove-certificate-rotation` between the  `system:nodes` group
and the default role `system:certificates.k8s.io:certificatesigningrequests:selfnodeclient`.
-->
這是透過在 `system:nodes` 組和
`system:certificates.k8s.io:certificatesigningrequests:selfnodeclient`
預設角色之間建立名為 `kubeadm:node-autoapprove-certificate-rotation` 的
ClusterRoleBinding 來實現的。

<!--
#### Create the public cluster-info ConfigMap
-->
#### 建立公共 cluster-info ConfigMap

<!--
This phase creates the `cluster-info` ConfigMap in the `kube-public` namespace.
-->
本步驟在 `kube-public` 名字空間中建立名為 `cluster-info` 的 ConfigMap。

<!--  
Additionally it creates a Role and a RoleBinding granting access to the ConfigMap for unauthenticated users
(i.e. users in RBAC group `system:unauthenticated`).
-->
另外，它建立一個 Role 和一個 RoleBinding，為未經身份驗證的使用者授予對 ConfigMap
的訪問許可權（即 RBAC 組 `system:unauthenticated` 中的使用者）。

<!--
Please note that:
-->
請注意：

<!--  
1. The access to the `cluster-info` ConfigMap _is not_ rate-limited. This may or may not be a problem if you expose your cluster's API server
to the internet; worst-case scenario here is a DoS attack where an attacker uses all the in-flight requests the kube-apiserver
can handle to serving the `cluster-info` ConfigMap.
-->
1. 對 `cluster-info` ConfigMap 的訪問 _不受_ 速率限制。
   如果你把 API 伺服器暴露到外網，這可能是一個問題，也可能不是；
   這裡最壞的情況是 DoS 攻擊，攻擊者使用 kube-apiserver 能夠處理的所有動態請求
   來為 `cluster-info` ConfigMap 提供服務。

<!--
### Install addons
-->
### 安裝外掛  {##install-addons}

<!--
Kubeadm installs the internal DNS server and the kube-proxy addon components via the API server.
-->
Kubeadm 透過 API 伺服器安裝內部 DNS 伺服器和 kube-proxy 外掛。

<!--
Please note that:
-->
請注意：

<!-- 
1. This phase can be invoked individually with the [`kubeadm init phase addon all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon) command. 
-->
1. 此步驟可以呼叫
   ['kubeadm init phase addon all'](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon)
   命令單獨執行。

<!--
#### proxy

A ServiceAccount for `kube-proxy` is created in the `kube-system` namespace; then kube-proxy is deployed as a DaemonSet: 
-->
#### 代理  {#proxy}

在 `kube-system` 名字空間中建立一個用於 `kube-proxy` 的 ServiceAccount；
然後以 DaemonSet 的方式部署 kube-proxy：

<!--  
- The credentials (`ca.crt` and `token`) to the control plane come from the ServiceAccount
- The location (URL) of the API server comes from a ConfigMap
- The `kube-proxy` ServiceAccount is bound to the privileges in the `system:node-proxier` ClusterRole
-->
- 主控節點憑據（`ca.crt` 和 `token`）來自 ServiceAccount
- API 伺服器節點的位置（URL）來自 ConfigMap
- `kube-proxy` 的 ServiceAccount 綁定了 `system:node-proxier` ClusterRole
  中的特權

#### DNS

<!--  
- The CoreDNS service is named `kube-dns`. This is done to prevent any interruption
  in service when the user is switching the cluster DNS from kube-dns to CoreDNS,
  the `--config` method described [here](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon)
- A ServiceAccount for CoreDNS is created in the `kube-system` namespace.
- The `coredns` ServiceAccount is bound to the privileges in the `system:coredns` ClusterRole
-->
- CoreDNS 服務的名稱為 `kube-dns`。這樣做是為了防止當用戶將叢集 DNS 從 kube-dns
  切換到 CoreDNS 時出現服務中斷。`--config` 方法在
  [這裡](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon)
  有描述。
- 在 `kube-system` 名字空間中建立 CoreDNS 的 ServiceAccount
- `coredns` 的 ServiceAccount 綁定了 `system:coredns` ClusterRole 中的特權

<!--
In Kubernetes version 1.21, support for using `kube-dns` with kubeadm was removed.
You can use CoreDNS with kubeadm even when the related Service is named `kube-dns`.
-->
在 Kubernetes 1.21 版本中，kubeadm 對 `kube-dns` 的支援被移除。
你可以在 kubeadm 使用 CoreDNS，即使相關的 Service 名字仍然是 `kube-dns`。

<!--
## kubeadm join phases internal design
-->
## kubeadm join 步驟內部設計  {#kubeadm-join-phases-internal-design}

<!-- 
Similarly to `kubeadm init`, also `kubeadm join` internal workflow consists of a sequence of atomic work tasks to perform. 
-->
與 `kubeadm init` 類似，`kubeadm join` 內部工作流由一系列待執行的原子工作任務組成。

<!-- 
This is split into discovery (having the Node trust the Kubernetes Master) and TLS bootstrap (having the Kubernetes Master trust the Node). 
-->
這分為發現（讓該節點信任 Kubernetes 的主控節點）和 TLS 引導
（讓 Kubernetes 的主控節點信任該節點）。

<!-- 
see [Authenticating with Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) or the corresponding [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/cluster-lifecycle/bootstrap-discovery.md). 
-->
請參閱[使用引導令牌進行身份驗證](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)
或相應的[設計提案](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/cluster-lifecycle/bootstrap-discovery.md)。

<!--
### Preflight checks
-->
### 預檢  {#preflight-checks}

<!-- 
`kubeadm` executes a set of preflight checks before starting the join, with the aim to verify preconditions and avoid common
cluster startup problems.
-->
`kubeadm` 在開始執行之前執行一組預檢，目的是驗證先決條件，避免常見的叢集啟動問題。

<!-- Please note that: -->
請注意：

<!--  
1. `kubeadm join` preflight checks are basically a subset `kubeadm init` preflight checks
1. Starting from 1.24, kubeadm uses crictl to communicate to all known CRI endpoints.
1. Starting from 1.9, kubeadm provides support for joining nodes running on Windows; in that case, linux specific controls are skipped.
1. In any case the user can skip specific preflight checks (or eventually all preflight checks) with the `--ignore-preflight-errors` option.
-->
1. `kubeadm join` 預檢基本上是 `kubeadm init` 預檢的一個子集
2. 從 1.24 開始，kubeadm 使用 crictl 與所有已知的 CRI 端點進行通訊。
3. 從 1.9 開始，kubeadm 支援加入在 Windows 上執行的節點；在這種情況下，
   將跳過 Linux 特定的控制引數。
4. 在任何情況下，使用者都可以透過 `--ignore-preflight-errors` 選項跳過
   特定的預檢（或者進而跳過所有預檢）。

<!--
### Discovery cluster-info
-->
### 發現 cluster-info  {#discovery-cluster-info}

<!--  
There are 2 main schemes for discovery. The first is to use a shared token along with the IP address of the API server.
The second is to provide a file (that is a subset of the standard kubeconfig file).
-->
主要有兩種發現方案。第一種是使用一個共享令牌以及 API 伺服器的 IP 地址。
第二種是提供一個檔案（它是標準 kubeconfig 檔案的子集）。

<!--
#### Shared token discovery
-->
#### 共享令牌發現  {#shared-token-discovery}

<!--  
If `kubeadm join` is invoked with `--discovery-token`, token discovery is used; in this case the node basically retrieves
the cluster CA certificates from the  `cluster-info` ConfigMap in the `kube-public` namespace.
-->
如果帶 `--discovery-token` 引數呼叫 `kubeadm join`，則使用了令牌發現功能；
在這種情況下，節點基本上從 `kube-public` 名字空間中的 `cluster-info` ConfigMap
中檢索叢集 CA 證書。

<!-- In order to prevent "man in the middle" attacks, several steps are taken: -->
為了防止“中間人”攻擊，採取了以下步驟：

<!--  
- First, the CA certificate is retrieved via insecure connection (this is possible because `kubeadm init` granted access to  `cluster-info` users for `system:unauthenticated` )
- Then the CA certificate goes trough following validation steps:
  - Basic validation: using the token ID against a JWT signature
  - Pub key validation: using provided `--discovery-token-ca-cert-hash`. This value is available in the output of `kubeadm init` or can
    be calculated using standard tools (the hash is calculated over the bytes of the Subject Public Key Info (SPKI) object as in RFC7469).
    The `--discovery-token-ca-cert-hash flag` may be repeated multiple times to allow more than one public key.
  - As a additional validation, the CA certificate is retrieved via secure connection and then compared with the CA retrieved initially
-->
- 首先，透過不安全連線檢索 CA 證書（這是可能的，因為 `kubeadm init` 授予
  `system:unauthenticated` 的使用者對 `cluster-info` 訪問許可權）
- 然後 CA 證書透過以下驗證步驟：
  - 基本驗證：使用令牌 ID 而不是 JWT 簽名
  - 公鑰驗證：使用提供的 `--discovery-token-ca-cert-hash`。這個值來自 `kubeadm init` 的輸出，
    或者可以使用標準工具計算（雜湊值是按 RFC7469 中主體公鑰資訊（SPKI）物件的位元組計算的）
    `--discovery-token-ca-cert-hash` 標誌可以重複多次，以允許多個公鑰。
  - 作為附加驗證，透過安全連線檢索 CA 證書，然後與初始檢索的 CA 進行比較

<!-- Please note that: -->
請注意：

<!--  
1.  Pub key validation can be skipped passing `--discovery-token-unsafe-skip-ca-verification` flag; This weakens the kubeadm security
    model since others can potentially impersonate the Kubernetes Master.
-->
1. 透過 `--discovery-token-unsafe-skip-ca-verification` 標誌可以跳過公鑰驗證；
   這削弱了 kubeadm 安全模型，因為其他人可能冒充 Kubernetes 主控節點。

<!--
#### File/https discovery
-->
#### 檔案/HTTPS 發現  {#file-or-https-discovery}

<!-- 
If `kubeadm join` is invoked with `--discovery-file`, file discovery is used; this file can be a local file or downloaded via an HTTPS URL; in case of HTTPS, the host installed CA bundle is used to verify the connection. 
-->
如果帶 `--discovery-file` 引數呼叫 `kubeadm join`，則使用檔案發現功能；
該檔案可以是本地檔案或透過 HTTPS URL 下載；對於 HTTPS，主機安裝的 CA 包
用於驗證連線。

<!--  
With file discovery, the cluster CA certificates is provided into the file itself; in fact, the discovery file is a kubeconfig
file with only `server` and `certificate-authority-data` attributes set, as described in [`kubeadm join`](/docs/reference/setup-tools/kubeadm/kubeadm-join/#file-or-https-based-discovery) reference doc;
when the connection with the cluster is established, kubeadm try to access the `cluster-info` ConfigMap, and if available, uses it.
-->
透過檔案發現，叢集 CA 證書是檔案本身提供；事實上，這個發現檔案是一個 kubeconfig 檔案，
只設置了 `server` 和 `certificate-authority-data` 屬性，
如 [`kubeadm join`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/#file-or-https-based-discovery)
參考文件中所述，當與叢集建立連線時，kubeadm 嘗試訪問 `cluster-info` ConfigMap，
如果可用，就使用它。

<!--
## TLS Bootstrap
-->
## TLS 引導  {#tls-boostrap}

<!--  
Once the cluster info are known, the file `bootstrap-kubelet.conf` is written, thus allowing kubelet to do TLS Bootstrapping.
-->
知道叢集資訊後，kubeadm 將寫入檔案 `bootstrap-kubelet.conf`，從而允許 kubelet 執行
TLS 引導。

<!--  
The TLS bootstrap mechanism uses the shared token to temporarily authenticate with the Kubernetes API server to submit a certificate
signing request (CSR) for a locally created key pair.
-->
TLS 引導機制使用共享令牌對 Kubernetes API 伺服器進行臨時身份驗證，以便
為本地建立的金鑰對提交證書籤名請求（CSR）。

<!--  
The request is then automatically approved and the operation completes saving `ca.crt` file and `kubelet.conf` file to be used
by kubelet for joining the cluster, while`bootstrap-kubelet.conf` is deleted.
-->
該請求會被自動批准，並且該操作儲存 `ca.crt` 檔案和 `kubelet.conf` 檔案，用於
kubelet 加入叢集，同時刪除 `bootstrap-kubelet.conf`。

<!-- Please note that: -->
請注意：

<!--  
- The temporary authentication is validated against the token saved during the `kubeadm init` process (or with additional tokens
  created with `kubeadm token`)
- The temporary authentication resolve to a user member of `system:bootstrappers:kubeadm:default-node-token` group which was granted
  access to CSR api during the `kubeadm init` process
- The automatic CSR approval is managed by the csrapprover controller, according with configuration done the `kubeadm init` process
-->
- 臨時身份驗證根據 `kubeadm init` 過程中儲存的令牌進行驗證（或者使用 `kubeadm token`
  建立的其他令牌）
- 臨時身份驗證解析到 `system:bootstrappers:kubeadm:default-node-token` 組的一個使用者成員，
  該成員在 `kubeadm init` 過程中被授予對 CSR API 的訪問權
- 根據 `kubeadm init` 過程的配置，自動 CSR 審批由 csrapprover 控制器管理

