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
`kubeadm init` and `kubeadm join` together provide a nice user experience for creating a
bare Kubernetes cluster from scratch, that aligns with the best-practices.
However, it might not be obvious _how_ kubeadm does that.
-->
`kubeadm init` 和 `kubeadm join` 結合在一起爲從頭開始創建最基本的 Kubernetes
叢集提供了良好的使用者體驗，這與最佳實踐一致。
但是，kubeadm **如何**做到這一點可能並不明顯。

<!-- 
This document provides additional details on what happens under the hood, with the aim of sharing
knowledge on the best practices for a Kubernetes cluster.
-->
本文檔提供了更多幕後的詳細信息，旨在分享有關 Kubernetes 叢集最佳實踐的知識。

<!-- body -->

<!--
## Core design principles
-->
## 核心設計原則    {#core-design-principles}

<!--
The cluster that `kubeadm init` and `kubeadm join` set up should be:
-->
`kubeadm init` 和 `kubeadm join` 設置的叢集該是：

<!-- 
- **Secure**: It should adopt latest best-practices like:
  - enforcing RBAC
  - using the Node Authorizer
  - using secure communication between the control plane components
  - using secure communication between the API server and the kubelets
  - lock-down the kubelet API
  - locking down access to the API for system components like the kube-proxy and CoreDNS
  - locking down what a Bootstrap Token can access
-->
- **安全的**：它應採用最新的最佳實踐，例如：
  - 實施 RBAC 訪問控制
  - 使用節點鑑權機制（Node Authorizer）
  - 在控制平面組件之間使用安全通信
  - 在 API 伺服器和 kubelet 之間使用安全通信
  - 鎖定 kubelet API
  - 鎖定對系統組件（例如 kube-proxy 和 CoreDNS）的 API 的訪問
  - 鎖定啓動引導令牌（Bootstrap Token）可以訪問的內容
<!--
- **User-friendly**: The user should not have to run anything more than a couple of commands:
  - `kubeadm init`
  - `export KUBECONFIG=/etc/kubernetes/admin.conf`
  - `kubectl apply -f <network-plugin-of-choice.yaml>`
  - `kubeadm join --token <token> <endpoint>:<port>`
- **Extendable**:
  - It should _not_ favor any particular network provider. Configuring the cluster network is out-of-scope
  - It should provide the possibility to use a config file for customizing various parameters
-->
- **使用者友好**：使用者只需要運行幾個命令即可：
  - `kubeadm init`
  - `export KUBECONFIG=/etc/kubernetes/admin.conf`
  - `kubectl apply -f <所選網絡插件.yaml>`
  - `kubeadm join --token <令牌> <端點>:<端口>`
- **可擴展的**：
  - **不**應偏向任何特定的網路提供商，不涉及設定叢集網路
  - 應該可以使用設定文件來自定義各種參數

<!--
## Constants and well-known values and paths
-->
## 常量以及衆所周知的值和路徑  {#constants-and-well-known-values-and-paths}

<!-- 
In order to reduce complexity and to simplify development of higher level tools that build on top of kubeadm, it uses a
limited set of constant values for well-known paths and file names.
-->
爲了降低複雜性並簡化基於 kubeadm 的高級工具的開發，對於衆所周知的路徑和文件名，
kubeadm 使用了一組有限的常量值。

<!--  
The Kubernetes directory `/etc/kubernetes` is a constant in the application, since it is clearly the given path
in a majority of cases, and the most intuitive location; other constant paths and file names are:
-->
Kubernetes 目錄 `/etc/kubernetes` 在應用程序中是一個常量，
因爲在大多數情況下它顯然是給定的路徑，並且是最直觀的位置；其他路徑常量和文件名有：

<!--  
- `/etc/kubernetes/manifests` as the path where the kubelet should look for static Pod manifests.
  Names of static Pod manifests are:
-->
- `/etc/kubernetes/manifests` 作爲 kubelet 查找靜態 Pod 清單的路徑。
  靜態 Pod 清單的名稱爲：

  - `etcd.yaml`
  - `kube-apiserver.yaml`
  - `kube-controller-manager.yaml`
  - `kube-scheduler.yaml`

<!--
- `/etc/kubernetes/` as the path where kubeconfig files with identities for control plane
  components are stored. Names of kubeconfig files are:

  - `kubelet.conf` (`bootstrap-kubelet.conf` during TLS bootstrap)
  - `controller-manager.conf`
  - `scheduler.conf`
  - `admin.conf` for the cluster admin and kubeadm itself
  - `super-admin.conf` for the cluster super-admin that can bypass RBAC
-->
- `/etc/kubernetes/` 作爲帶有控制平面組件身份標識的 kubeconfig 文件的路徑。
  kubeconfig 文件的名稱爲：

  - `kubelet.conf`（在 TLS 引導時名稱爲 `bootstrap-kubelet.conf`）
  - `controller-manager.conf`
  - `scheduler.conf`
  - `admin.conf` 用於叢集管理員和 kubeadm 本身
  - `super-admin.conf` 用於可以繞過 RBAC 的叢集超級管理員

<!--
- Names of certificates and key files:

  - `ca.crt`, `ca.key` for the Kubernetes certificate authority
  - `apiserver.crt`, `apiserver.key` for the API server certificate
  - `apiserver-kubelet-client.crt`, `apiserver-kubelet-client.key` for the client certificate used
    by the API server to connect to the kubelets securely
  - `sa.pub`, `sa.key` for the key used by the controller manager when signing ServiceAccount
  - `front-proxy-ca.crt`, `front-proxy-ca.key` for the front proxy certificate authority
  - `front-proxy-client.crt`, `front-proxy-client.key` for the front proxy client
-->
- 證書和密鑰文件的名稱：

  - `ca.crt`、`ca.key` 用於 Kubernetes 證書頒發機構
  - `apiserver.crt`、`apiserver.key` 用於 API 伺服器證書
  - `apiserver-kubelet-client.crt`、`apiserver-kubelet-client.key`
    用於 API 伺服器安全地連接到 kubelet 的客戶端證書
  - `sa.pub`、`sa.key` 用於控制器管理器簽署 ServiceAccount 時使用的密鑰
  - `front-proxy-ca.crt`、`front-proxy-ca.key` 用於前端代理證書頒發機構
  - `front-proxy-client.crt`、`front-proxy-client.key` 用於前端代理客戶端

<!--
## The kubeadm configuration file format

Most kubeadm commands support a `--config` flag which allows passing a configuration file from
disk. The configuration file format follows the common Kubernetes API `apiVersion` / `kind` scheme,
but is considered a component configuration format. Several Kubernetes components, such as the kubelet,
also support file-based configuration.
-->
## kubeadm 設定文件格式

大多數 kubeadm 命令支持 `--config` 標誌，允許將磁盤上的設定文件傳遞給命令。
設定文件格式遵循常見的 Kubernetes API `apiVersion` / `kind` 方案，
但被視爲組件設定格式。包括 kubelet 在內的幾個 Kubernetes 組件也支持基於文件的設定。

<!--
Different kubeadm subcommands require a different `kind` of configuration file.
For example, `InitConfiguration` for `kubeadm init`, `JoinConfiguration` for `kubeadm join`, `UpgradeConfiguration` for `kubeadm upgrade` and `ResetConfiguration`
for `kubeadm reset`.
-->
不同的 kubeadm 子命令需要不同 `kind` 的設定文件。
例如，`kubeadm init` 需要 `InitConfiguration`，`kubeadm join` 需要 `JoinConfiguration`，
`kubeadm upgrade` 需要 `UpgradeConfiguration`，而 `kubeadm reset` 需要 `ResetConfiguration`。

<!--
The command `kubeadm config migrate` can be used to migrate an older format configuration
file to a newer (current) configuration format. The kubeadm tool only supports migrating from
deprecated configuration formats to the current format.

See the [kubeadm configuration reference](/docs/reference/config-api/kubeadm-config.v1beta4/) page for more details.
-->
命令 `kubeadm config migrate` 可用於將舊格式的設定文件遷移到更新（當前）的設定格式。
kubeadm 工具僅支持從已棄用的設定格式遷移到當前格式。

更多詳情，請參閱 [kubeadm 設定參考](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)頁面。

<!--
## kubeadm init workflow internal design
-->
## kubeadm init 工作流程內部設計  {#kubeadm-init-workflow-internal-design}

<!--  
The `kubeadm init` consists of a sequence of atomic work tasks to perform,
as described in the `kubeadm init` [internal workflow](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow).
-->
`kubeadm init` [內部工作流程](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow)
包含一系列要執行的原子性工作任務，如 `kubeadm init` 中所述。

<!--  
The [`kubeadm init phase`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/) command allows
users to invoke each task individually, and ultimately offers a reusable and composable
API/toolbox that can be used by other Kubernetes bootstrap tools, by any IT automation tool or by
an advanced user for creating custom clusters.
-->
[`kubeadm init phase`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/)
命令允許使用者分別調用每個任務，並最終提供可重用且可組合的 API 或工具箱，
其他 Kubernetes 引導工具、任何 IT 自動化工具和高級使用者都可以使用它來創建自定義叢集。

<!--
### Preflight checks
-->
### 預檢  {#preflight-checks}

<!-- 
Kubeadm executes a set of preflight checks before starting the init, with the aim to verify
preconditions and avoid common cluster startup problems.
The user can skip specific preflight checks or all of them with the `--ignore-preflight-errors` option.
-->
kubeadm 在啓動 init 之前執行一組預檢，目的是驗證先決條件並避免常見的叢集啓動問題。
使用者可以使用 `--ignore-preflight-errors` 選項跳過特定的預檢或全部檢查。

<!--  
- [Warning] if the Kubernetes version to use (specified with the `--kubernetes-version` flag) is
  at least one minor version higher than the kubeadm CLI version.
- Kubernetes system requirements:
  - if running on linux:
    - [Error] if Kernel is older than the minimum required version
    - [Error] if required cgroups subsystem aren't set up
- [Error] if the CRI endpoint does not answer
-->
- [警告] 如果要使用的 Kubernetes 版本（由 `--kubernetes-version` 標誌指定）比 kubeadm CLI
  版本至少高一個小版本。
- Kubernetes 系統要求：
  - 如果在 Linux 上運行：
    - [錯誤] 如果內核早於最低要求的版本
    - [錯誤] 如果未設置所需的 Cgroups 子系統
- [錯誤] 如果 CRI 端點未應答
<!--  
- [Error] if user is not root
- [Error] if the machine hostname is not a valid DNS subdomain
- [Warning] if the host name cannot be reached via network lookup
- [Error] if kubelet version is lower that the minimum kubelet version supported by kubeadm (current minor -1)
- [Error] if kubelet version is at least one minor higher than the required controlplane version (unsupported version skew)
- [Warning] if kubelet service does not exist or if it is disabled
- [Warning] if firewalld is active
-->
- [錯誤] 如果使用者不是 root 使用者
- [錯誤] 如果機器主機名不是有效的 DNS 子域
- [警告] 如果通過網路查找無法訪問主機名
- [錯誤] 如果 kubelet 版本低於 kubeadm 支持的最低 kubelet 版本（當前小版本 -1）
- [錯誤] 如果 kubelet 版本比所需的控制平面板版本至少高一個小版本（不支持的版本偏差）
- [警告] 如果 kubelet 服務不存在或已被禁用
- [警告] 如果 firewalld 處於活動狀態
<!--
- [Error] if API server bindPort or ports 10250/10251/10252 are used
- [Error] if `/etc/kubernetes/manifest` folder already exists and it is not empty
- [Error] if swap is on
- [Error] if `ip`, `iptables`, `mount`, `nsenter` commands are not present in the command path
-->
- [錯誤] 如果 API 伺服器綁定的端口或 10250/10251/10252 端口已被佔用
- [錯誤] 如果 `/etc/kubernetes/manifest` 文件夾已經存在並且不爲空
- [錯誤] 如果啓用了交換分區
- [錯誤] 如果命令路徑中沒有 `ip`、`iptables`、`mount`、`nsenter` 命令
<!--
- [Warning] if `ethtool`, `tc`, `touch` commands are not present in the command path
- [Warning] if extra arg flags for API server, controller manager, scheduler contains some invalid options
- [Warning] if connection to https://API.AdvertiseAddress:API.BindPort goes through proxy
- [Warning] if connection to services subnet goes through proxy (only first address checked)
- [Warning] if connection to Pods subnet goes through proxy (only first address checked)
-->
- [警告] 如果命令路徑中沒有 `ethtool`、`tc`、`touch` 命令
- [警告] 如果 API 伺服器、控制器管理器、調度程序的其他參數標誌包含一些無效選項
- [警告] 如果與 https://API.AdvertiseAddress:API.BindPort 的連接通過代理
- [警告] 如果服務子網的連接通過代理（僅檢查第一個地址）
- [警告] 如果 Pod 子網的連接通過代理（僅檢查第一個地址）
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
  - [錯誤] 如果指定了 etcd 證書或密鑰，但無法找到
- 如果未提供外部 etcd（因此將安裝本地 etcd）：
  - [錯誤] 如果端口 2379 已被佔用
  - [錯誤] 如果 Etcd.DataDir 文件夾已經存在並且不爲空
- 如果授權模式爲 ABAC：
  - [錯誤] 如果 abac_policy.json 不存在
- 如果授權方式爲 Webhook
  - [錯誤] 如果 webhook_authz.conf 不存在

{{< note >}}
<!--
Preflight checks can be invoked individually with the
[`kubeadm init phase preflight`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-preflight)
command.
-->
可以使用 [`kubeadm init phase preflight`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-preflight)
命令單獨觸發預檢。
{{< /note >}}

<!--
### Generate the necessary certificates
-->
### 生成必要的證書  {#generate-the-necessary-certificate}

<!--
Kubeadm generates certificate and private key pairs for different purposes:

- A self signed certificate authority for the Kubernetes cluster saved into `ca.crt` file and
  `ca.key` private key file
-->
kubeadm 生成用於不同目的的證書和私鑰對：

- Kubernetes 叢集的自簽名證書頒發機構會保存到 `ca.crt` 文件和 `ca.key` 私鑰文件中

<!--
- A serving certificate for the API server, generated using `ca.crt` as the CA, and saved into
  `apiserver.crt` file with its private key `apiserver.key`. This certificate should contain
  the following alternative names:

  - The Kubernetes service's internal clusterIP (the first address in the services CIDR, e.g.
    `10.96.0.1` if service subnet is `10.96.0.0/12`)
  - Kubernetes DNS names, e.g. `kubernetes.default.svc.cluster.local` if `--service-dns-domain`
    flag value is `cluster.local`, plus default DNS names `kubernetes.default.svc`,
    `kubernetes.default`, `kubernetes`
  - The node-name
  - The `--apiserver-advertise-address`
  - Additional alternative names specified by the user
-->
- 用於 API 伺服器的服務證書，使用 `ca.crt` 作爲 CA 生成，並將證書保存到 `apiserver.crt`
  文件中，私鑰保存到 `apiserver.key` 文件中。該證書應包含以下備用名稱：

  - Kubernetes 服務的內部 clusterIP（服務 CIDR 的第一個地址。
    例如：如果服務的子網是 `10.96.0.0/12`，則爲 `10.96.0.1`）
  - Kubernetes DNS 名稱，例如：如果 `--service-dns-domain` 標誌值是 `cluster.local`，
    則爲 `kubernetes.default.svc.cluster.local`；
    加上默認的 DNS 名稱 `kubernetes.default.svc`、`kubernetes.default` 和 `kubernetes`
  - 節點名稱
  - `--apiserver-advertise-address`
  - 使用者指定的其他備用名稱

<!--
- A client certificate for the API server to connect to the kubelets securely, generated using
  `ca.crt` as the CA and saved into `apiserver-kubelet-client.crt` file with its private key
  `apiserver-kubelet-client.key`.
  This certificate should be in the `system:masters` organization

- A private key for signing ServiceAccount Tokens saved into `sa.key` file along with its public key `sa.pub`
-->
- 用於 API 伺服器安全連接到 kubelet 的客戶端證書，使用 `ca.crt` 作爲 CA 生成，
  並保存到 `apiserver-kubelet-client.crt`，私鑰保存到 `apiserver-kubelet-client.key`
  文件中。該證書應該在 `system:masters` 組織中。

- 用於簽名 ServiceAccount 令牌的私鑰保存到 `sa.key` 文件中，公鑰保存到 `sa.pub` 文件中。

<!--
- A certificate authority for the front proxy saved into `front-proxy-ca.crt` file with its key
  `front-proxy-ca.key`

- A client certificate for the front proxy client, generated using `front-proxy-ca.crt` as the CA and
  saved into `front-proxy-client.crt` file with its private key`front-proxy-client.key`
-->
- 用於前端代理的證書頒發機構保存到 `front-proxy-ca.crt` 文件中，私鑰保存到
  `front-proxy-ca.key` 文件中

- 前端代理客戶端的客戶端證書，使用 `front-proxy-ca.crt` 作爲 CA 生成，並保存到
  `front-proxy-client.crt` 文件中，私鑰保存到 `front-proxy-client.key` 文件中

<!-- 
Certificates are stored by default in `/etc/kubernetes/pki`, but this directory is configurable
using the `--cert-dir` flag.
-->
證書默認情況下存儲在 `/etc/kubernetes/pki` 中，但是該目錄可以使用 `--cert-dir` 標誌進行設定。

<!--
Please note that:
-->
請注意：

<!-- 
1. If a given certificate and private key pair both exist, and their content is evaluated to be compliant with the above specs, the existing files will
   be used and the generation phase for the given certificate will be skipped. This means the user can, for example, copy an existing CA to
   `/etc/kubernetes/pki/ca.{crt,key}`, and then kubeadm will use those files for signing the rest of the certs.
   See also [using custom certificates](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#custom-certificates)
1. For the CA, it is possible to provide the `ca.crt` file but not the `ca.key` file. If all other certificates and kubeconfig files
   are already in place, kubeadm recognizes this condition and activates the ExternalCA, which also implies the `csrsigner` controller in
   controller-manager won't be started
-->
1. 如果證書和私鑰對都存在，並且其內容經過評估符合上述規範，將使用現有文件，
   並且跳過給定證書的生成階段。
   這意味着使用者可以將現有的 CA 複製到 `/etc/kubernetes/pki/ca.{crt,key}`，
   kubeadm 將使用這些文件對其餘證書進行簽名。
   請參閱[使用自定義證書](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#custom-certificates)。
2. 僅對 CA 來說，如果所有其他證書和 kubeconfig 文件都已就位，則可以只提供 `ca.crt` 文件，
   而不提供 `ca.key` 文件。
   kubeadm 能夠識別出這種情況並啓用 ExternalCA，這也意味着了控制器管理器中的
   `csrsigner` 控制器將不會啓動。
<!--
1. If kubeadm is running in [external CA mode](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#external-ca-mode);
   all the certificates must be provided by the user, because kubeadm cannot generate them by itself
1. In case kubeadm is executed in the `--dry-run` mode, certificate files are written in a temporary folder
1. Certificate generation can be invoked individually with the
   [`kubeadm init phase certs all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-certs) command
-->
3. 如果 kubeadm 在[外部 CA 模式](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#external-ca-mode)
   下運行，所有證書必須由使用者提供，因爲 kubeadm 無法自行生成證書。
4. 如果在 `--dry-run` 模式下執行 kubeadm，證書文件將寫入一個臨時文件夾中。
5. 可以使用 [`kubeadm init phase certs all`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-certs)
   命令單獨生成證書。

<!--
### Generate kubeconfig files for control plane components
-->
### 爲控制平面組件生成 kubeconfig 文件  {#generate-kubeconfig-files-for-control-plane-components}

<!-- 
Kubeadm generates kubeconfig files with identities for control plane components:
-->
kubeadm 生成具有用於控制平面組件身份標識的 kubeconfig 文件：

<!--  
- A kubeconfig file for the kubelet to use during TLS bootstrap -
  `/etc/kubernetes/bootstrap-kubelet.conf`. Inside this file, there is a bootstrap-token or embedded
  client certificates for authenticating this node with the cluster.

  This client certificate should:

  - Be in the `system:nodes` organization, as required by the
    [Node Authorization](/docs/reference/access-authn-authz/node/) module
  - Have the Common Name (CN) `system:node:<hostname-lowercased>`
-->
- 供 kubelet 在 TLS 引導期間使用的 kubeconfig 文件 —— `/etc/kubernetes/bootstrap-kubelet.conf`。
  在此文件中，有一個引導令牌或內嵌的客戶端證書，向叢集表明此節點身份。

  此客戶端證書應：

  - 根據[節點鑑權](/zh-cn/docs/reference/access-authn-authz/node/)模塊的要求，屬於 `system:nodes` 組織
  - 具有通用名稱（CN）：`system:node:<小寫主機名>`

<!--
- A kubeconfig file for controller-manager, `/etc/kubernetes/controller-manager.conf`; inside this
  file is embedded a client certificate with controller-manager identity. This client certificate should
  have the CN `system:kube-controller-manager`, as defined by default
  [RBAC core components roles](/docs/reference/access-authn-authz/rbac/#core-component-roles)
-->
- 控制器管理器的 kubeconfig 文件 —— `/etc/kubernetes/controller-manager.conf`；
  在此文件中嵌入了一個具有控制器管理器身份標識的客戶端證書。
  此客戶端證書應具有 CN：`system:kube-controller-manager`，
  該 CN 由 [RBAC 核心組件角色](/zh-cn/docs/reference/access-authn-authz/rbac/#core-component-roles)
  默認定義的。

<!--
- A kubeconfig file for scheduler, `/etc/kubernetes/scheduler.conf`; inside this file is embedded
  a client certificate with scheduler identity.
  This client certificate should have the CN `system:kube-scheduler`, as defined by default
  [RBAC core components roles](/docs/reference/access-authn-authz/rbac/#core-component-roles)
-->
- 調度器的 kubeconfig 文件 —— `/etc/kubernetes/scheduler.conf`；
  此文件中嵌入了具有調度器身份標識的客戶端證書。此客戶端證書應具有 CN：`system:kube-scheduler`，
  該 CN 由 [RBAC 核心組件角色](/zh-cn/docs/reference/access-authn-authz/rbac/#core-component-roles)
  默認定義的。

<!-- 
Additionally, a kubeconfig file for kubeadm as an administrative entity is generated and stored
in `/etc/kubernetes/admin.conf`. This file includes a certificate with
`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. `kubeadm:cluster-admins`
is a group managed by kubeadm. It is bound to the `cluster-admin` ClusterRole during `kubeadm init`,
by using the `super-admin.conf` file, which does not require RBAC.
This `admin.conf` file must remain on control plane nodes and should not be shared with additional users.
-->
此外，還會生成將 kubeadm 作爲管理實體的 kubeconfig 文件並將其保存到 `/etc/kubernetes/admin.conf` 中。
該文件包含一個帶有 `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`
的證書。`kubeadm:cluster-admins` 是一個由 kubeadm 管理的組，
它在 `kubeadm init` 期間通過使用 `super-admin.conf` 文件綁定到
`cluster-admin` ClusterRole，不需要 RBAC。
此 `admin.conf` 文件必須保留在控制平面節點上，並且不得與其他使用者共享。

<!--
During `kubeadm init` another kubeconfig file is generated and stored in `/etc/kubernetes/super-admin.conf`.
This file includes a certificate with `Subject: O = system:masters, CN = kubernetes-super-admin`.
`system:masters` is a superuser group that bypasses RBAC and makes `super-admin.conf` useful in case
of an emergency where a cluster is locked due to RBAC misconfiguration.
The `super-admin.conf` file must be stored in a safe location and should not be shared with additional users.
-->
在 `kubeadm init` 期間，會生成另一個 kubeconfig 文件並將其存儲在 `/etc/kubernetes/super-admin.conf` 中。
該文件包含一個帶有 `Subject: O = system:masters, CN = kubernetes-super-admin` 的證書。
`system:masters` 是一個繞過 RBAC 的超級使用者組，使 `super-admin.conf`
在緊急情況下非常有用，因爲 RBAC 設定錯誤導致叢集被鎖定。
`super-admin.conf` 文件可以存儲在安全位置，並且不會與其他使用者共享。

<!--
See [RBAC user facing role bindings](/docs/reference/access-authn-authz/rbac/#user-facing-roles)
for additional information on RBAC and built-in ClusterRoles and groups.
-->
有關 RBAC 和內置 ClusterRoles 和組的其他信息，
請參閱[面向使用者的 RBAC 角色綁定](/zh-cn/docs/reference/access-authn-authz/rbac/#user-facing-roles)。

<!--
You can run [`kubeadm kubeconfig user`](/docs/reference/setup-tools/kubeadm/kubeadm-kubeconfig/#cmd-kubeconfig-user)
to generate kubeconfig files for additional users.
-->
你可以運行 [`kubeadm kubeconfig user`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-kubeconfig/#cmd-kubeconfig-user)
來爲額外的使用者生成 kubeconfig 文件。

{{< caution >}}
<!--
The generated configuration files include an embedded authentication key, and you should treat
them as confidential.
-->
生成的設定文件包含嵌入的認證密鑰，你應當將其視爲機密內容。
{{< /caution >}}

<!--
Also note that:
-->
另外請注意：

<!--  
1. `ca.crt` certificate is embedded in all the kubeconfig files.
1. If a given kubeconfig file exists, and its content is evaluated as compliant with the above specs,
   the existing file will be used and the generation phase for the given kubeconfig will be skipped
1. If kubeadm is running in [ExternalCA mode](/docs/reference/setup-tools/kubeadm/kubeadm-init/#external-ca-mode),
   all the required kubeconfig must be provided by the user as well, because kubeadm cannot
   generate any of them by itself
1. In case kubeadm is executed in the `--dry-run` mode, kubeconfig files are written in a temporary folder
1. Generation of kubeconfig files can be invoked individually with the
   [`kubeadm init phase kubeconfig all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-kubeconfig) command
-->
1. `ca.crt` 證書內嵌在所有 kubeconfig 文件中。
2. 如果給定的 kubeconfig 文件存在且其內容經過評估符合上述規範，則 kubeadm 將使用現有文件，
   並跳過給定 kubeconfig 的生成階段。
3. 如果 kubeadm 以 [ExternalCA 模式](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#external-ca-mode)
   運行，則所有必需的 kubeconfig 也必須由使用者提供，因爲 kubeadm 不能自己生成。
4. 如果在 `--dry-run` 模式下執行 kubeadm，則 kubeconfig 文件將寫入一個臨時文件夾中。
5. 可以使用
   [`kubeadm init phase kubeconfig all`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-kubeconfig)
   命令分別生成 kubeconfig 文件。

<!--
### Generate static Pod manifests for control plane components
-->
### 爲控制平面組件生成靜態 Pod 清單  {#generate-static-pod-manifests-for-control-plane-components}

<!--  
Kubeadm writes static Pod manifest files for control plane components to
`/etc/kubernetes/manifests`. The kubelet watches this directory for Pods to be created on startup.
-->
kubeadm 將用於控制平面組件的靜態 Pod 清單文件寫入 `/etc/kubernetes/manifests` 目錄。
kubelet 啓動後會監視這個目錄以便創建 Pod。

<!--
Static Pod manifest share a set of common properties:
-->
靜態 Pod 清單有一些共同的屬性：

<!--  
- All static Pods are deployed on `kube-system` namespace
- All static Pods get `tier:control-plane` and `component:{component-name}` labels
- All static Pods use the `system-node-critical` priority class
- `hostNetwork: true` is set on all static Pods to allow control plane startup before a network is
  configured; as a consequence:

  * The `address` that the controller-manager and the scheduler use to refer to the API server is `127.0.0.1`
  * If the etcd server is set up locally, the `etcd-server` address will be set to `127.0.0.1:2379`
-->
- 所有靜態 Pod 都部署在 `kube-system` 名字空間
- 所有靜態 Pod 都打上 `tier:control-plane` 和 `component:{組件名稱}` 標籤
- 所有靜態 Pod 均使用 `system-node-critical` 優先級
- 所有靜態 Pod 都設置了 `hostNetwork:true`，使得控制平面在設定網路之前啓動；結果導致：

  * 控制器管理器和調度器用來調用 API 伺服器的地址爲 `127.0.0.1`
  * 如果在本地設置 etcd 伺服器，`etcd-servers` 地址將被設置爲 `127.0.0.1:2379`

<!--
- Leader election is enabled for both the controller-manager and the scheduler
- Controller-manager and the scheduler will reference kubeconfig files with their respective, unique identities
- All static Pods get any extra flags specified by the user as described in
  [passing custom arguments to control plane components](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)
- All static Pods get any extra Volumes specified by the user (Host path)
-->
- 同時爲控制器管理器和調度器啓用了領導者選舉
- 控制器管理器和調度器將引用 kubeconfig 文件及其各自的唯一標識
- 如[將自定義參數傳遞給控制平面組件](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)
  中所述，所有靜態 Pod 都會獲得使用者指定的額外標誌或補丁
- 所有靜態 Pod 都會獲得使用者指定的額外卷（主機路徑）

<!--
Please note that:
-->
請注意：

<!--  
1. All images will be pulled from registry.k8s.io by default.
   See [using custom images](/docs/reference/setup-tools/kubeadm/kubeadm-init/#custom-images)
   for customizing the image repository
1. In case kubeadm is executed in the `--dry-run` mode, static Pod files are written in a
   temporary folder
1. Static Pod manifest generation for control plane components can be invoked individually with
   the [`kubeadm init phase control-plane all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-control-plane) command
-->
1. 所有映像檔默認從 registry.k8s.io 拉取。關於自定義映像檔倉庫，
   請參閱[使用自定義映像檔](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#custom-images)。
2. 如果在 `--dry-run` 模式下執行 kubeadm，則靜態 Pod 文件寫入一個臨時文件夾中。
3. 可以使用 [`kubeadm init phase control-plane all`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-control-plane)
   命令分別生成主控組件的靜態 Pod 清單。

<!--
#### API server

The static Pod manifest for the API server is affected by the following parameters provided by the users:
-->
#### API 伺服器  {#api-server}

API 伺服器的靜態 Pod 清單會受到使用者提供的以下參數的影響：

<!--  
- The `apiserver-advertise-address` and `apiserver-bind-port` to bind to; if not provided, those
  values default to the IP address of the default network interface on the machine and port 6443
- The `service-cluster-ip-range` to use for services
-->
- 要綁定的 `apiserver-advertise-address` 和 `apiserver-bind-port`；
  如果未提供，則這些值默認爲機器上默認網路接口的 IP 地址和 6443 端口。
- `service-cluster-ip-range` 給 Service 使用
<!--
- If an external etcd server is specified, the `etcd-servers` address and related TLS settings
  (`etcd-cafile`, `etcd-certfile`, `etcd-keyfile`);
  if an external etcd server is not provided, a local etcd will be used (via host network)
-->
- 如果指定了外部 etcd 伺服器，則應指定 `etcd-servers` 地址和相關的 TLS 設置
  （`etcd-cafile`、`etcd-certfile`、`etcd-keyfile`）；
  如果未提供外部 etcd 伺服器，則將使用本地 etcd（通過主機網路）

<!--
Other API server flags that are set unconditionally are:
-->
無條件設置的其他 API 伺服器標誌有：

<!--  
- `--insecure-port=0` to avoid insecure connections to the api server
- `--enable-bootstrap-token-auth=true` to enable the `BootstrapTokenAuthenticator` authentication module.
  See [TLS Bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/) for more details
- `--allow-privileged` to `true` (required e.g. by kube proxy)
- `--requestheader-client-ca-file` to `front-proxy-ca.crt`
-->
- `--insecure-port=0` 禁止到 API 伺服器不安全的連接
- `--enable-bootstrap-token-auth=true` 啓用 `BootstrapTokenAuthenticator` 身份驗證模塊。
  更多細節請參見 [TLS 引導](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)。
- `--allow-privileged` 設爲 `true`（諸如 kube-proxy 這些組件有此要求）
- `--requestheader-client-ca-file` 設爲 `front-proxy-ca.crt`

<!--
- `--enable-admission-plugins` to:

  - [`NamespaceLifecycle`](/docs/reference/access-authn-authz/admission-controllers/#namespacelifecycle)
    e.g. to avoid deletion of system reserved namespaces
  - [`LimitRanger`](/docs/reference/access-authn-authz/admission-controllers/#limitranger)
    and [`ResourceQuota`](/docs/reference/access-authn-authz/admission-controllers/#resourcequota)
    to enforce limits on namespaces
  - [`ServiceAccount`](/docs/reference/access-authn-authz/admission-controllers/#serviceaccount)
    to enforce service account automation
-->
- `--enable-admission-plugins` 設爲：

  - [`NamespaceLifecycle`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#namespacelifecycle)
    例如，避免刪除系統保留的名字空間
  - [`LimitRanger`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#limitranger) 和
    [`ResourceQuota`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#resourcequota)
    對名字空間實施限制
  - [`ServiceAccount`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#serviceaccount)
    實施服務賬戶自動化

  <!--
  - [`PersistentVolumeLabel`](/docs/reference/access-authn-authz/admission-controllers/#persistentvolumelabel)
    attaches region or zone labels to PersistentVolumes as defined by the cloud provider (This
    admission controller is deprecated and will be removed in a future version.
    It is not deployed by kubeadm by default with v1.9 onwards when not explicitly opting into
    using `gce` or `aws` as cloud providers)
  -->
  - [`PersistentVolumeLabel`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#persistentvolumelabel)
    將區域（Region）或區（Zone）標籤附加到由雲提供商定義的 PersistentVolumes
    （此准入控制器已被棄用並將在以後的版本中刪除）。
    如果未明確選擇使用 `gce` 或 `aws` 作爲雲提供商，則默認情況下，v1.9 以後的版本 kubeadm 都不會部署。

  <!--
  - [`DefaultStorageClass`](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
    to enforce default storage class on `PersistentVolumeClaim` objects
  - [`DefaultTolerationSeconds`](/docs/reference/access-authn-authz/admission-controllers/#defaulttolerationseconds)
  - [`NodeRestriction`](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
    to limit what a kubelet can modify (e.g. only pods on this node)
  -->
  - [`DefaultStorageClass`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
    在 `PersistentVolumeClaim` 對象上強制使用默認存儲類型
  - [`DefaultTolerationSeconds`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaulttolerationseconds)
  - [`NodeRestriction`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
    限制 kubelet 可以修改的內容（例如，僅此節點上的 Pod）

<!--
- `--kubelet-preferred-address-types` to `InternalIP,ExternalIP,Hostname;` this makes `kubectl
  logs` and other API server-kubelet communication work in environments where the hostnames of the
  nodes aren't resolvable
-->
- `--kubelet-preferred-address-types` 設爲 `InternalIP,ExternalIP,Hostname;`
  這使得在節點的主機名無法解析的環境中，`kubectl log` 和 API 伺服器與 kubelet
  的其他通信可以工作

<!--
- Flags for using certificates generated in previous steps:

  - `--client-ca-file` to `ca.crt`
  - `--tls-cert-file` to `apiserver.crt`
  - `--tls-private-key-file` to `apiserver.key`
  - `--kubelet-client-certificate` to `apiserver-kubelet-client.crt`
  - `--kubelet-client-key` to `apiserver-kubelet-client.key`
  - `--service-account-key-file` to `sa.pub`
  - `--requestheader-client-ca-file` to `front-proxy-ca.crt`
  - `--proxy-client-cert-file` to `front-proxy-client.crt`
  - `--proxy-client-key-file` to `front-proxy-client.key`
-->
- 使用在前面步驟中生成的證書的標誌：

  - `--client-ca-file` 設爲 `ca.crt`
  - `--tls-cert-file` 設爲 `apiserver.crt`
  - `--tls-private-key-file` 設爲 `apiserver.key`
  - `--kubelet-client-certificate` 設爲 `apiserver-kubelet-client.crt`
  - `--kubelet-client-key` 設爲 `apiserver-kubelet-client.key`
  - `--service-account-key-file` 設爲 `sa.pub`
  - `--requestheader-client-ca-file` 設爲 `front-proxy-ca.crt`
  - `--proxy-client-cert-file` 設爲 `front-proxy-client.crt`
  - `--proxy-client-key-file` 設爲 `front-proxy-client.key`

<!--
- Other flags for securing the front proxy
  ([API Aggregation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/))
  communications:
-->
- 其他用於保護前端代理（
  [API 聚合層](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)）
  通信的標誌：

  - `--requestheader-username-headers=X-Remote-User`
  - `--requestheader-group-headers=X-Remote-Group`
  - `--requestheader-extra-headers-prefix=X-Remote-Extra-`
  - `--requestheader-allowed-names=front-proxy-client`

<!--
#### Controller manager
-->
#### 控制器管理器  {#controller-manager}

<!-- 
The static Pod manifest for the controller manager is affected by following parameters provided by
the users:
-->
控制器管理器的靜態 Pod 清單受使用者提供的以下參數的影響：

<!-- 
- If kubeadm is invoked specifying a `--pod-network-cidr`, the subnet manager feature required for
  some CNI network plugins is enabled by setting:

  - `--allocate-node-cidrs=true`
  - `--cluster-cidr` and `--node-cidr-mask-size` flags according to the given CIDR
-->
- 如果調用 kubeadm 時指定了 `--pod-network-cidr` 參數，
  則可以通過以下方式啓用某些 CNI 網路插件所需的子網管理器功能：

  - 設置 `--allocate-node-cidrs=true`
  - 根據給定 CIDR 設置 `--cluster-cidr` 和 `--node-cidr-mask-size` 標誌

<!--
- If a cloud provider is specified, the corresponding `--cloud-provider` is specified together
  with the `--cloud-config` path if such configuration file exists (this is experimental, alpha
  and will be removed in a future version)
-->
- 如果指定了雲提供商，則指定相應的 `--cloud-provider`，如果存在這樣的設定文件，
  則指定 `--cloud-config` 路徑（此爲試驗性特性，是 Alpha 版本，將在以後的版本中刪除）。

<!--
Other flags that are set unconditionally are:
-->
其他無條件設置的標誌包括：

<!--  
- `--controllers` enabling all the default controllers plus `BootstrapSigner` and `TokenCleaner`
  controllers for TLS bootstrap. See [TLS Bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
  for more details.

- `--use-service-account-credentials` to `true`
-->
- `--controllers` 爲 TLS 引導程序啓用所有默認控制器以及 `BootstrapSigner` 和
  `TokenCleaner` 控制器。詳細信息請參閱
  [TLS 引導](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)

- `--use-service-account-credentials` 設爲 `true`

<!--
- Flags for using certificates generated in previous steps:

  - `--root-ca-file` to `ca.crt`
  - `--cluster-signing-cert-file` to `ca.crt`, if External CA mode is disabled, otherwise to `""`
  - `--cluster-signing-key-file` to `ca.key`, if External CA mode is disabled, otherwise to `""`
  - `--service-account-private-key-file` to `sa.key`
-->
- 使用先前步驟中生成的證書的標誌：

  - `--root-ca-file` 設爲 `ca.crt`
  - 如果禁用了 External CA 模式，則 `--cluster-signing-cert-file` 設爲 `ca.crt`，否則設爲 `""`
  - 如果禁用了 External CA 模式，則 `--cluster-signing-key-file` 設爲 `ca.key`，否則設爲 `""`
  - `--service-account-private-key-file` 設爲 `sa.key`

<!--
#### Scheduler

The static Pod manifest for the scheduler is not affected by parameters provided by the user.
-->
#### 調度器  {#scheduler}

調度器的靜態 Pod 清單不受使用者提供的參數的影響。

<!--
### Generate static Pod manifest for local etcd
-->
### 爲本地 etcd 生成靜態 Pod 清單  {#generate-static-pod-manifest-for-local-etcd}

<!--  
If you specified an external etcd, this step will be skipped, otherwise kubeadm generates a
static Pod manifest file for creating a local etcd instance running in a Pod with following attributes:
-->
如果你指定的是外部 etcd，則應跳過此步驟，否則 kubeadm 會生成靜態 Pod 清單文件，
以創建在 Pod 中運行的、具有以下屬性的本地 etcd 實例：

<!--  
- listen on `localhost:2379` and use `HostNetwork=true`
- make a `hostPath` mount out from the `dataDir` to the host's filesystem
- Any extra flags specified by the user
-->
- 在 `localhost:2379` 上監聽並使用 `HostNetwork=true`
- 將 `hostPath` 從 `dataDir` 掛載到主機的文件系統
- 使用者指定的任何其他標誌

<!--
Please note that:
-->
請注意：

<!--  
1. The etcd container image will be pulled from `registry.gcr.io` by default. See
   [using custom images](/docs/reference/setup-tools/kubeadm/kubeadm-init/#custom-images)
   for customizing the image repository.
1. If you run kubeadm in `--dry-run` mode, the etcd static Pod manifest is written
   into a temporary folder.
1. You can directly invoke static Pod manifest generation for local etcd, using the
   [`kubeadm init phase etcd local`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-etcd)
   command.
-->
1. etcd 容器映像檔默認從 `registry.gcr.io` 拉取。有關自定義映像檔倉庫，
   請參閱[使用自定義映像檔](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#custom-images)。
2. 如果你以 `--dry-run` 模式執行 kubeadm 命令，etcd 的靜態 Pod 清單將被寫入一個臨時文件夾。
3. 你可以使用 [`kubeadm init phase etcd local`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-etcd)
   命令爲本地 etcd 直接調用靜態 Pod 清單生成邏輯。

<!--
### Wait for the control plane to come up
-->
### 等待控制平面啓動  {#wait-for-the-control-plane-to-come-up}

<!--  
On control plane nodes, kubeadm waits up to 4 minutes for the control plane components
and the kubelet to be available. It does that by performing a health check on the respective
component `/healthz` or `/livez` endpoints.

After the control plane is up, kubeadm completes the tasks described in following paragraphs.
-->
在控制平面節點上，kubeadm 會等待最多4分鐘，以確保控制平面組件和 kubelet 可用。
它通過檢查相應組件的 `/healthz` 或 `/livez` 端點來進行健康檢查。

控制平面啓動後，kubeadm 將完成以下段落中描述的任務。

<!--
### Save the kubeadm ClusterConfiguration in a ConfigMap for later reference
-->
### 將 kubeadm ClusterConfiguration 保存在 ConfigMap 中以供以後參考  {#save-the-kubeadm-clusterconfiguration-in-a-configmap-for-later-reference}

<!-- 
kubeadm saves the configuration passed to `kubeadm init` in a ConfigMap named `kubeadm-config`
under `kube-system` namespace.
-->
kubeadm 將傳遞給 `kubeadm init` 的設定保存在 `kube-system` 名字空間下名爲
`kubeadm-config` 的 ConfigMap 中。

<!--  
This will ensure that kubeadm actions executed in future (e.g `kubeadm upgrade`) will be able to
determine the actual/current cluster state and make new decisions based on that data.
-->
這將確保將來執行的 kubeadm 操作（例如 `kubeadm upgrade`）將能夠確定實際/當前叢集狀態，
並根據該數據做出新的決策。

<!--
Please note that:
-->
請注意：

<!-- 
1. Before saving the ClusterConfiguration, sensitive information like the token is stripped from the configuration
1. Upload of control plane node configuration can be invoked individually with the command
   [`kubeadm init phase upload-config`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-upload-config).
-->
1. 在保存 ClusterConfiguration 之前，從設定中刪除令牌等敏感信息。
2. 可以使用 [`kubeadm init phase upload-config`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-upload-config)
   命令單獨上傳主控節點設定。

<!--
### Mark the node as control-plane
-->
### 將節點標記爲控制平面  {#mark-the-node-as-control-plane}

<!--
As soon as the control plane is available, kubeadm executes the following actions:
-->
一旦控制平面可用，kubeadm 將執行以下操作：

<!-- 
- Labels the node as control-plane with `node-role.kubernetes.io/control-plane=""`
- Taints the node with `node-role.kubernetes.io/control-plane:NoSchedule`

Please note that the phase to mark the control-plane phase can be invoked
individually with the [`kubeadm init phase mark-control-plane`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-mark-control-plane) command.
-->
- 給節點打上 `node-role.kubernetes.io/control-plane=""` 標籤，標記其爲控制平面
- 給節點打上 `node-role.kubernetes.io/control-plane:NoSchedule` 污點

請注意，標記控制面的這個階段可以單獨通過
[`kubeadm init phase mark-control-plane`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-mark-control-plane)
命令來實現。

<!--
### Configure TLS-Bootstrapping for node joining
-->
### 爲即將加入的節點加入 TLS 啓動引導  {#configure-tls-bootstrapping-for-node-joining}

<!--
Kubeadm uses [Authenticating with Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/)
for joining new nodes to an existing cluster; for more details see also
[design proposal](https://git.k8s.io/design-proposals-archive/cluster-lifecycle/bootstrap-discovery.md).
-->
kubeadm 使用[引導令牌認證](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)
將新節點連接到現有叢集；更多的詳細信息，
請參見[設計提案](https://git.k8s.io/design-proposals-archive/cluster-lifecycle/bootstrap-discovery.md)。

<!-- 
`kubeadm init` ensures that everything is properly configured for this process, and this includes
following steps as well as setting API server and controller flags as already described in
previous paragraphs.
-->
`kubeadm init` 確保爲該過程正確設定了所有內容，這包括以下步驟以及設置 API
伺服器和控制器標誌，如前幾段所述。

{{< note >}}
<!--
TLS bootstrapping for nodes can be configured with the command
[`kubeadm init phase bootstrap-token`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-bootstrap-token),
executing all the configuration steps described in following paragraphs;
alternatively, each step can be invoked individually.
-->
可以使用 [`kubeadm init phase bootstrap-token`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-bootstrap-token)
命令設定節點的 TLS 引導，執行以下段落中描述的所有設定步驟；
或者也可以單獨執行各個步驟。
{{< /note >}}

<!--
#### Create a bootstrap token
-->
#### 創建引導令牌  {#create-a-bootstrap-token}

<!--  
`kubeadm init` creates a first bootstrap token, either generated automatically or provided by the
user with the `--token` flag; as documented in bootstrap token specification, token should be
saved as a secret with name `bootstrap-token-<token-id>` under `kube-system` namespace.
-->
`kubeadm init` 創建第一個引導令牌，該令牌是自動生成的或由使用者提供的 `--token`
標誌的值；如引導令牌規範文檔中所述，令牌應保存在 `kube-system` 名字空間下名爲
`bootstrap-token-<令牌 ID>` 的 Secret 中。

<!--
Please note that:
-->
請注意：

<!--  
1. The default token created by `kubeadm init` will be used to validate temporary user during TLS
   bootstrap process; those users will be member of
  `system:bootstrappers:kubeadm:default-node-token` group
1. The token has a limited validity, default 24 hours (the interval may be changed with the `—token-ttl` flag)
1. Additional tokens can be created with the [`kubeadm token`](/docs/reference/setup-tools/kubeadm/kubeadm-token/)
   command, that provide other useful functions for token management as well.
-->
1. 由 `kubeadm init` 創建的默認令牌將用於在 TLS 引導過程中驗證臨時使用者；
   這些使用者會成爲 `system:bootstrappers:kubeadm:default-node-token` 組的成員。
2. 令牌的有效期有限，默認爲 24 小時（間隔可以通過 `-token-ttl` 標誌進行更改）。
3. 可以使用 [`kubeadm token`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-token/)
   命令創建其他令牌，這些令牌還提供其他有用的令牌管理功能。

<!--
#### Allow joining nodes to call CSR API
-->
#### 允許加入的節點調用 CSR API  {#allow-joining-nodes-to-call-csr-api}

<!--
Kubeadm ensures that users in `system:bootstrappers:kubeadm:default-node-token` group are able to
access the certificate signing API.
-->
kubeadm 確保 `system:bootstrappers:kubeadm:default-node-token` 組中的使用者能夠訪問證書籤名 API。

<!-- 
This is implemented by creating a ClusterRoleBinding named `kubeadm:kubelet-bootstrap` between the
group above and the default RBAC role `system:node-bootstrapper`.
-->
這是通過在上述組與默認 RBAC 角色 `system:node-bootstrapper` 之間創建名爲
`kubeadm:kubelet-bootstrap` 的 ClusterRoleBinding 來實現的。

<!--
#### Set up auto approval for new bootstrap tokens
-->
#### 爲新的引導令牌設置自動批准  {#setup-auto-approval-for-new-bootstrap-tokens}

<!--
Kubeadm ensures that the Bootstrap Token will get its CSR request automatically approved by the
csrapprover controller.
-->
kubeadm 確保 csrapprover 控制器自動批准引導令牌的 CSR 請求。

<!-- 
This is implemented by creating ClusterRoleBinding named `kubeadm:node-autoapprove-bootstrap`
between the `system:bootstrappers:kubeadm:default-node-token` group and the default role
`system:certificates.k8s.io:certificatesigningrequests:nodeclient`.
-->
這是通過在 `system:bootstrappers:kubeadm:default-node-token` 使用者組和
`system:certificates.k8s.io:certificatesigningrequests:nodeclient` 默認角色之間
創建名爲 `kubeadm:node-autoapprove-bootstrap` 的 ClusterRoleBinding 來實現的。

<!-- 
The role `system:certificates.k8s.io:certificatesigningrequests:nodeclient` should be created as
well, granting POST permission to
`/apis/certificates.k8s.io/certificatesigningrequests/nodeclient`.
-->
還應創建 `system:certificates.k8s.io:certificatesigningrequests:nodeclient` 角色，
授予對 `/apis/certificates.k8s.io/certificatesigningrequests/nodeclient`
執行 POST 的權限。

<!--
#### Set up nodes certificate rotation with auto approval
-->
#### 通過自動批准設置節點證書輪換 {#setup-nodes-certificate-rotation-with-auto-approval}

<!-- 
Kubeadm ensures that certificate rotation is enabled for nodes, and that a new certificate request
for nodes will get its CSR request automatically approved by the csrapprover controller.
-->
kubeadm 確保節點啓用了證書輪換，csrapprover 控制器將自動批准節點的新證書的 CSR 請求。

<!-- 
This is implemented by creating ClusterRoleBinding named
`kubeadm:node-autoapprove-certificate-rotation` between the `system:nodes` group and the default
role `system:certificates.k8s.io:certificatesigningrequests:selfnodeclient`.
-->
這是通過在 `system:nodes` 組和
`system:certificates.k8s.io:certificatesigningrequests:selfnodeclient`
默認角色之間創建名爲 `kubeadm:node-autoapprove-certificate-rotation` 的
ClusterRoleBinding 來實現的。

<!--
#### Create the public cluster-info ConfigMap
-->
#### 創建公共 cluster-info ConfigMap   {#create-the-public-cluster-info-configmap}

<!--
This phase creates the `cluster-info` ConfigMap in the `kube-public` namespace.
-->
本步驟在 `kube-public` 名字空間中創建名爲 `cluster-info` 的 ConfigMap。

<!--  
Additionally, it creates a Role and a RoleBinding granting access to the ConfigMap for
unauthenticated users (i.e. users in RBAC group `system:unauthenticated`).
-->
另外，它創建一個 Role 和一個 RoleBinding，爲未經身份驗證的使用者授予對 ConfigMap
的訪問權限（即 RBAC 組 `system:unauthenticated` 中的使用者）。

{{< note >}}
<!--
The access to the `cluster-info` ConfigMap _is not_ rate-limited. This may or may not be a
problem if you expose your cluster's API server to the internet; worst-case scenario here is a
DoS attack where an attacker uses all the in-flight requests the kube-apiserver can handle to
serve the `cluster-info` ConfigMap.
-->
對 `cluster-info` ConfigMap 的訪問**不受**速率限制。
如果你把 API 伺服器暴露到外網，這可能是一個問題，也可能不是；
這裏最壞的情況是 DoS 攻擊，攻擊者使用 kube-apiserver 可處理的所有當前請求來爲
`cluster-info` ConfigMap 提供服務。
{{< /note >}}

<!--
### Install addons
-->
### 安裝插件  {#install-addons}

<!--
Kubeadm installs the internal DNS server and the kube-proxy addon components via the API server.
-->
kubeadm 通過 API 伺服器安裝內部 DNS 伺服器和 kube-proxy 插件。

{{< note >}}
<!--
This phase can be invoked individually with the command
[`kubeadm init phase addon all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon).
-->
此步驟可以通過 [`kubeadm init phase addon all`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon)
命令單獨執行。
{{< /note >}}

<!--
#### proxy

A ServiceAccount for `kube-proxy` is created in the `kube-system` namespace; then kube-proxy is
deployed as a DaemonSet:
-->
#### 代理  {#proxy}

在 `kube-system` 名字空間中創建一個用於 `kube-proxy` 的 ServiceAccount；
然後以 DaemonSet 的方式部署 kube-proxy：

<!--  
- The credentials (`ca.crt` and `token`) to the control plane come from the ServiceAccount
- The location (URL) of the API server comes from a ConfigMap
- The `kube-proxy` ServiceAccount is bound to the privileges in the `system:node-proxier` ClusterRole
-->
- 主控節點憑據（`ca.crt` 和 `token`）來自 ServiceAccount
- API 伺服器節點的位置（URL）來自 ConfigMap
- `kube-proxy` 的 ServiceAccount 綁定了 `system:node-proxier` ClusterRole 中的特權

#### DNS

<!--  
- The CoreDNS service is named `kube-dns` for compatibility reasons with the legacy `kube-dns`
  addon.

- A ServiceAccount for CoreDNS is created in the `kube-system` namespace.

- The `coredns` ServiceAccount is bound to the privileges in the `system:coredns` ClusterRole
-->
- 出於與舊版 `kube-dns` 插件的兼容性考慮，CoreDNS 服務被命名爲 `kube-dns`。

- 在 `kube-system` 名字空間中創建 CoreDNS 的 ServiceAccount

- `coredns` 的 ServiceAccount 綁定了 `system:coredns` ClusterRole 中的特權

<!--
In Kubernetes version 1.21, support for using `kube-dns` with kubeadm was removed.
You can use CoreDNS with kubeadm even when the related Service is named `kube-dns`.
-->
在 Kubernetes 1.21 版本中，kubeadm 對 `kube-dns` 的支持被移除。
你可以在 kubeadm 使用 CoreDNS，即使相關的 Service 名字仍然是 `kube-dns`。

<!--
## kubeadm join phases internal design
-->
## kubeadm join 步驟內部設計  {#kubeadm-join-phases-internal-design}

<!-- 
Similarly to `kubeadm init`, also `kubeadm join` internal workflow consists of a sequence of
atomic work tasks to perform.
-->
與 `kubeadm init` 類似，`kubeadm join` 內部工作流由一系列待執行的原子工作任務組成。

<!-- 
This is split into discovery (having the Node trust the Kubernetes API Server) and TLS bootstrap
(having the Kubernetes API Server trust the Node).
-->
工作流分爲發現（讓該節點信任 Kubernetes 的 API 伺服器）和 TLS 引導
（讓 Kubernetes 的 API 伺服器信任該節點）等步驟。

<!-- 
see [Authenticating with Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/)
or the corresponding [design proposal](https://git.k8s.io/design-proposals-archive/cluster-lifecycle/bootstrap-discovery.md).
-->
請參閱[使用引導令牌進行身份驗證](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)
或相應的[設計提案](https://git.k8s.io/design-proposals-archive/cluster-lifecycle/bootstrap-discovery.md)。

<!--
### Preflight checks
-->
### 預檢  {#preflight-checks}

<!-- 
`kubeadm` executes a set of preflight checks before starting the join, with the aim to verify
preconditions and avoid common cluster startup problems.
-->
`kubeadm` 在開始執行之前執行一組預檢，目的是驗證先決條件，避免常見的叢集啓動問題。

<!--
Also note that:
-->
另外請注意：

<!--  
1. `kubeadm join` preflight checks are basically a subset of `kubeadm init` preflight checks
1. If you are joining a Windows node, Linux specific controls are skipped.
1. In any case the user can skip specific preflight checks (or eventually all preflight checks)
   with the `--ignore-preflight-errors` option.
-->
1. 如果你要加入一個 Windows 節點，工作流將跳過特定於 Linux 的一些控制設置。
2. 在任何情況下，使用者都可以通過 `--ignore-preflight-errors`
   選項跳過特定的預檢（或者進而跳過所有預檢）。

<!--
### Discovery cluster-info
-->
### 發現 cluster-info  {#discovery-cluster-info}

<!--  
There are 2 main schemes for discovery. The first is to use a shared token along with the IP
address of the API server.
The second is to provide a file (that is a subset of the standard kubeconfig file).
-->
主要有兩種發現方案。第一種是使用一個共享令牌以及 API 伺服器的 IP 地址。
第二種是提供一個文件（它是標準 kubeconfig 文件的子集）。

<!--
#### Shared token discovery
-->
#### 共享令牌發現  {#shared-token-discovery}

<!--  
If `kubeadm join` is invoked with `--discovery-token`, token discovery is used; in this case the
node basically retrieves the cluster CA certificates from the `cluster-info` ConfigMap in the
`kube-public` namespace.
-->
如果帶 `--discovery-token` 參數調用 `kubeadm join`，則使用了令牌發現功能；
在這種情況下，節點基本上從 `kube-public` 名字空間中的 `cluster-info` ConfigMap
中檢索叢集 CA 證書。

<!--
In order to prevent "man in the middle" attacks, several steps are taken:
-->
爲了防止“中間人”攻擊，採取了以下步驟：

<!--  
- First, the CA certificate is retrieved via insecure connection (this is possible because
  `kubeadm init` is granted access to `cluster-info` users for `system:unauthenticated`)

- Then the CA certificate goes through following validation steps:
-->
- 首先，通過不安全連接檢索 CA 證書（這是可能的，因爲 `kubeadm init` 授予
  `system:unauthenticated` 的使用者對 `cluster-info` 訪問權限）。

- 然後 CA 證書通過以下驗證步驟：

  <!--
  - Basic validation: using the token ID against a JWT signature
  - Pub key validation: using provided `--discovery-token-ca-cert-hash`. This value is available
    in the output of `kubeadm init` or can be calculated using standard tools (the hash is
    calculated over the bytes of the Subject Public Key Info (SPKI) object as in RFC7469). The
    `--discovery-token-ca-cert-hash flag` may be repeated multiple times to allow more than one public key.
  - As an additional validation, the CA certificate is retrieved via secure connection and then
    compared with the CA retrieved initially
  -->
  - 基本驗證：使用令牌 ID 而不是 JWT 簽名
  - 公鑰驗證：使用提供的 `--discovery-token-ca-cert-hash`。這個值來自 `kubeadm init` 的輸出，
    或者可以使用標準工具計算（哈希值是按 RFC7469 中主體公鑰信息（SPKI）對象的字節計算的）
    `--discovery-token-ca-cert-hash` 標誌可以重複多次，以允許多個公鑰。
  - 作爲附加驗證，通過安全連接檢索 CA 證書，然後與初始檢索的 CA 進行比較。

{{< note >}}
<!--
You can skip CA validation by passing the `--discovery-token-unsafe-skip-ca-verification` flag on the command line.
This weakens the kubeadm security model since others can potentially impersonate the Kubernetes API server.
-->
你可以通過在命令列上指定 `--discovery-token-unsafe-skip-ca-verification`
標誌來跳過 CA 驗證。這會削弱 kubeadm 的安全模型，因爲其他人可能冒充 Kubernetes API 伺服器。
{{< /note >}}

<!--
#### File/https discovery
-->
#### 文件/HTTPS 發現  {#file-or-https-discovery}

<!-- 
If `kubeadm join` is invoked with `--discovery-file`, file discovery is used; this file can be a
local file or downloaded via an HTTPS URL; in case of HTTPS, the host installed CA bundle is used
to verify the connection.
-->
如果帶 `--discovery-file` 參數調用 `kubeadm join`，則使用文件發現功能；
該文件可以是本地文件或通過 HTTPS URL 下載；對於 HTTPS，主機安裝的 CA 包用於驗證連接。

<!--  
With file discovery, the cluster CA certificate is provided into the file itself; in fact, the
discovery file is a kubeconfig file with only `server` and `certificate-authority-data` attributes
set, as described in the [`kubeadm join`](/docs/reference/setup-tools/kubeadm/kubeadm-join/#file-or-https-based-discovery)
reference doc; when the connection with the cluster is established, kubeadm tries to access the
`cluster-info` ConfigMap, and if available, uses it.
-->
通過文件發現，叢集 CA 證書是文件本身提供；事實上，這個發現文件是一個 kubeconfig 文件，
只設置了 `server` 和 `certificate-authority-data` 屬性，
如 [`kubeadm join`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/#file-or-https-based-discovery)
參考文檔中所述，當與叢集建立連接時，kubeadm 嘗試訪問 `cluster-info` ConfigMap，
如果可用，就使用它。

<!--
## TLS Bootstrap
-->
## TLS 引導  {#tls-boostrap}

<!--  
Once the cluster info is known, the file `bootstrap-kubelet.conf` is written, thus allowing
kubelet to do TLS Bootstrapping.
-->
知道叢集信息後，kubeadm 將寫入文件 `bootstrap-kubelet.conf`，從而允許 kubelet 執行
TLS 引導。

<!--  
The TLS bootstrap mechanism uses the shared token to temporarily authenticate with the Kubernetes
API server to submit a certificate signing request (CSR) for a locally created key pair.
-->
TLS 引導機制使用共享令牌對 Kubernetes API 伺服器進行臨時身份驗證，
以便爲本地創建的密鑰對提交證書籤名請求（CSR）。

<!--  
The request is then automatically approved and the operation completes saving `ca.crt` file and
`kubelet.conf` file to be used by the kubelet for joining the cluster, while `bootstrap-kubelet.conf`
is deleted.
-->
該請求會被自動批准，並且該操作保存 `ca.crt` 文件和 `kubelet.conf` 文件，用於
kubelet 加入叢集，同時刪除 `bootstrap-kubelet.conf`。

{{< note >}}
<!--
- The temporary authentication is validated against the token saved during the `kubeadm init`
  process (or with additional tokens created with `kubeadm token` command)
- The temporary authentication resolves to a user member of
  `system:bootstrappers:kubeadm:default-node-token` group which was granted access to the CSR api
  during the `kubeadm init` process
- The automatic CSR approval is managed by the csrapprover controller, according to
  the configuration present in the `kubeadm init` process
-->
- 臨時身份驗證根據 `kubeadm init` 過程中保存的令牌進行驗證（或者使用 `kubeadm token` 命令創建的其他令牌）
- 臨時身份驗證解析到 `system:bootstrappers:kubeadm:default-node-token` 組的一個使用者成員，
  該成員在 `kubeadm init` 過程中被授予對 CSR API 的訪問權
- 自動的 CSR 審批由 csrapprover 控制器基於 `kubeadm init` 過程中給出的設定來管理
{{< /note >}}

<!--
## kubeadm upgrade workflow internal design

`kubeadm upgrade` has sub-commands for handling the upgrade of the Kubernetes cluster created by kubeadm.
You must run `kubeadm upgrade apply` on a control plane node (you can choose which one);
this starts the upgrade process. You then run `kubeadm upgrade node` on all remaining
nodes (both worker nodes and control plane nodes).
-->
## kubeadm 升級工作流的內部設計

`kubeadm upgrade` 包含若干子命令，用來處理由 kubeadm 創建的 Kubernetes 叢集的升級。
你必須在控制平面節點上運行 `kubeadm upgrade apply`（你可以選擇使用哪個節點），以啓動升級過程。
然後，在所有剩餘節點（包括工作節點和控制平面節點）上運行 `kubeadm upgrade node`。

<!--
Both `kubeadm upgrade apply` and `kubeadm upgrade node` have a `phase` subcommand which provides access
to the internal phases of the upgrade process.
See [`kubeadm upgrade phase`](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade-phase/) for more details.

Additional utility upgrade commands are `kubeadm upgrade plan` and `kubeadm upgrade diff`.

All upgrade sub-commands support passing a configuration file.
-->
`kubeadm upgrade apply` 和 `kubeadm upgrade node` 都有一個 `phase` 子命令，
用於提供對升級過程內部階段的訪問。更多詳情，請參閱
[`kubeadm upgrade phase`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-upgrade-phase/)。

額外的實用升級命令包括 `kubeadm upgrade plan` 和 `kubeadm upgrade diff`。

所有升級子命令都支持傳遞設定文件。

<!--
### kubeadm upgrade plan

You can optionally run `kubeadm upgrade plan` before you run `kubeadm upgrade apply`.
The `plan` subcommand checks which versions are available to upgrade
to and validates whether your current cluster is upgradeable.
-->
### kubeadm upgrade plan

你可以選擇在運行 `kubeadm upgrade apply` 之前運行 `kubeadm upgrade plan`。
`plan` 子命令會檢查有哪些版本可以用來升級，並驗證你當前的叢集是否可升級。

<!--
### kubeadm upgrade diff

This shows what differences would be applied to existing static pod manifests for control plane nodes.
A more verbose way to do the same thing is running `kubeadm upgrade apply --dry-run` or
`kubeadm upgrade node --dry-run`.
-->
### kubeadm upgrade diff

這條命令會顯示將對控制平面節點的現有靜態 Pod 清單作哪些修改。
獲得更詳細信息的一種做法是運行 `kubeadm upgrade apply --dry-run`
或 `kubeadm upgrade node --dry-run`。

<!--
### kubeadm upgrade apply

`kubeadm upgrade apply` prepares the cluster for the upgrade of all nodes, and also
upgrades the control plane node where it's run. The steps it performs are:
-->
### kubeadm upgrade apply

`kubeadm upgrade apply` 爲所有節點的升級做準備，同時也會升級運行此命令時所在的控制平面節點。
它所執行的步驟包括：

<!--
- Runs preflight checks similarly to `kubeadm init` and `kubeadm join`, ensuring container images are downloaded
  and the cluster is in a good state to be upgraded.
- Upgrades the control plane manifest files on disk in `/etc/kubernetes/manifests` and waits
  for the kubelet to restart the components if the files have changed.
- Uploads the updated kubeadm and kubelet configurations to the cluster in the `kubeadm-config`
  and the `kubelet-config` ConfigMaps (both in the `kube-system` namespace).
- Writes updated kubelet configuration for this node in `/var/lib/kubelet/config.yaml`,
  and read the node's `/var/lib/kubelet/instance-config.yaml` file
  and patch fields like `containerRuntimeEndpoint`
  from this instance configuration into `/var/lib/kubelet/config.yaml`. 
- Configures bootstrap token and the `cluster-info` ConfigMap for RBAC rules. This is the same as
  in the `kubeadm init` stage and ensures that the cluster continues to support nodes joining with bootstrap tokens.
- Upgrades the kube-proxy and CoreDNS addons conditionally if all existing kube-apiservers in the cluster
  have already been upgraded to the target version.
- Performs any post-upgrade tasks, such as, cleaning up deprecated features which are release specific.
-->
- 類似於 `kubeadm init` 和 `kubeadm join`，運行預檢操作，確保容器映像檔已被下載且叢集處於可升級的良好狀態。
- 升級位於磁盤上 `/etc/kubernetes/manifests` 的控制平面清單文件，並在文件發生更改時等待 kubelet 重啓組件。
- 將更新的 kubeadm 和 kubelet 設定上傳到 `kubeadm-config` 和 `kubelet-config` ConfigMap
  中（都在 `kube-system` 命名空間內）。
- 在 `/var/lib/kubelet/config.yaml` 中爲此節點寫入更新的 kubelet 設定，
  並讀取節點的 `/var/lib/kubelet/instance-config.yaml` 文件以及將此實例設定中的
  `containerRuntimeEndpoint` 等補丁字段寫入 `/var/lib/kubelet/config.yaml`。
- 設定引導令牌和 `cluster-info` ConfigMap 以用於 RBAC 規則。這一操作與 `kubeadm init`
  階段相同，確保叢集繼續支持使用引導令牌加入的節點。
- 如果叢集中所有現有的 kube-apiserver 已經升級到目標版本，則根據情況升級 kube-proxy 和 CoreDNS 插件。
- 執行所有剩下的升級後任務，例如清理特定發佈版本中廢棄的功能。

<!--
### kubeadm upgrade node

`kubeadm upgrade node` upgrades a single control plane or worker node after the cluster upgrade has
started (by running `kubeadm upgrade apply`). The command detects if the node is a control plane node by checking
if the file `/etc/kubernetes/manifests/kube-apiserver.yaml` exists. On finding that file, the kubeadm tool
infers that there is a running kube-apiserver Pod on this node.
-->
### kubeadm upgrade node

`kubeadm upgrade node` 在叢集升級啓動後（通過運行 `kubeadm upgrade apply`）升級單個控制平面或工作節點。
此命令通過檢查文件 `/etc/kubernetes/manifests/kube-apiserver.yaml` 是否存在來檢測節點是否爲控制平面節點。
如果找到該文件，kubeadm 工具會推斷此節點上正在運行 kube-apiserver Pod。

<!--
- Runs preflight checks similarly to `kubeadm upgrade apply`.
- For control plane nodes, upgrades the control plane manifest files on disk in `/etc/kubernetes/manifests`
  and waits for the kubelet to restart the components if the files have changed.
- Writes updated kubelet configuration for this node in `/var/lib/kubelet/config.yaml`,
  and read the node's `/var/lib/kubelet/instance-config.yaml` file and
  patch fields like `containerRuntimeEndpoint`
  from this instance configuration into `/var/lib/kubelet/config.yaml`.
- (For control plane nodes) upgrades the kube-proxy and CoreDNS
  {{< glossary_tooltip text="addons" term_id="addons" >}} conditionally, provided that all existing
  API servers in the cluster have already been upgraded to the target version.
- Performs any post-upgrade tasks, such as cleaning up deprecated features which are release specific.
-->
- 類似於 `kubeadm upgrade apply`，運行預檢操作。
- 對於控制平面節點，升級位於磁盤上 `/etc/kubernetes/manifests` 的控制平面清單文件，
  並在文件發生更改時等待 kubelet 重啓組件。
- 在 `/var/lib/kubelet/config.yaml` 中爲此節點寫入更新的 kubelet 設定，
  並讀取節點的 `/var/lib/kubelet/instance-config.yaml` 文件以及將此實例設定中的
  `containerRuntimeEndpoint` 等補丁字段寫入 `/var/lib/kubelet/config.yaml`。
- （針對控制平面節點）如果叢集中所有現有的 API 伺服器已經升級到目標版本，則根據情況升級
  kube-proxy 和 CoreDNS {{< glossary_tooltip text="插件" term_id="addons" >}}。
- 執行剩下的所有升級後任務，例如清理特定發佈版本中廢棄的特性。

<!--
## kubeadm reset workflow internal design

You can use the `kubeadm reset` subcommand on a node where kubeadm commands previously executed.
This subcommand performs a **best-effort** cleanup of the node.
If certain actions fail you must intervene and perform manual cleanup.
-->
## kubeadm reset 工作流的內部設計

你可以在之前執行過 kubeadm 命令的節點上使用 `kubeadm reset` 子命令。
此子命令對節點執行**盡力而爲**的清理。如果某些操作失敗，你必須介入並執行手動清理。

<!--
The command supports phases.
See [`kubeadm reset phase`](/docs/reference/setup-tools/kubeadm/kubeadm-reset-phase/) for more details.

The command supports a configuration file.

Additionally:
- IPVS, iptables and nftables rules are **not** cleaned up.
- CNI (network plugin) configuration is **not** cleaned up.
- `.kube/` in the user's home directory is **not** cleaned up.
-->
此命令支持多個階段。更多詳情，請參閱
[`kubeadm reset phase`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset-phase/)。

此命令支持設定文件。

另外：

- IPVS、iptables 和 nftables 規則**不會**被清理。
- CNI（網路插件）設定**不會**被清理。
- 使用者主目錄下的 `.kube/` 文件夾**不會**被清理。

<!--
The command has the following stages:
- Runs preflight checks on the node to determine if its healthy.
- For control plane nodes, removes any local etcd member data.
- Stops the kubelet.
- Stops running containers.
- Unmounts any mounted directories in `/var/lib/kubelet`.
- Deletes any files and directories managed by kubeadm in `/var/lib/kubelet` and `/etc/kubernetes`.
-->
此命令包含以下階段：

- 在節點上運行預檢操作，以確定其是否健康。
- 對於控制平面節點，移除本地 etcd 成員的所有數據。
- 停止 kubelet。
- 停止運行中的容器。
- 卸載 `/var/lib/kubelet` 中掛載的任何目錄。
- 刪除 `/var/lib/kubelet` 和 `/etc/kubernetes` 中由 kubeadm 管理的所有文件和目錄。
