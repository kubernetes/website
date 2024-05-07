---
title: 实现细节
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
`kubeadm init` 和 `kubeadm join` 结合在一起为从头开始创建最基本的 Kubernetes
集群提供了良好的用户体验，这与最佳实践一致。
但是，kubeadm **如何**做到这一点可能并不明显。

<!-- 
This document provides additional details on what happens under the hood, with the aim of sharing
knowledge on the best practices for a Kubernetes cluster.
-->
本文档提供了更多幕后的详细信息，旨在分享有关 Kubernetes 集群最佳实践的知识。

<!-- body -->

<!--
## Core design principles
-->
## 核心设计原则    {#core-design-principles}

<!--
The cluster that `kubeadm init` and `kubeadm join` set up should be:
-->
`kubeadm init` 和 `kubeadm join` 设置的集群该是：

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
- **安全的**：它应采用最新的最佳实践，例如：
  - 实施 RBAC 访问控制
  - 使用节点鉴权机制（Node Authorizer）
  - 在控制平面组件之间使用安全通信
  - 在 API 服务器和 kubelet 之间使用安全通信
  - 锁定 kubelet API
  - 锁定对系统组件（例如 kube-proxy 和 CoreDNS）的 API 的访问
  - 锁定启动引导令牌（Bootstrap Token）可以访问的内容
<!--
- **User-friendly**: The user should not have to run anything more than a couple of commands:
  - `kubeadm init`
  - `export KUBECONFIG=/etc/kubernetes/admin.conf`
  - `kubectl apply -f <network-of-choice.yaml>`
  - `kubeadm join --token <token> <endpoint>:<port>`
- **Extendable**:
  - It should _not_ favor any particular network provider. Configuring the cluster network is out-of-scope
  - It should provide the possibility to use a config file for customizing various parameters
-->
- **用户友好**：用户只需要运行几个命令即可：
  - `kubeadm init`
  - `export KUBECONFIG=/etc/kubernetes/admin.conf`
  - `kubectl apply -f <所选网络.yaml>`
  - `kubeadm join --token <令牌> <端点>:<端口>`
- **可扩展的**：
  - **不**应偏向任何特定的网络提供商，不涉及配置集群网络
  - 应该可以使用配置文件来自定义各种参数

<!--
## Constants and well-known values and paths
-->
## 常量以及众所周知的值和路径  {#constants-and-well-known-values-and-paths}

<!-- 
In order to reduce complexity and to simplify development of higher level tools that build on top of kubeadm, it uses a
limited set of constant values for well-known paths and file names.
-->
为了降低复杂性并简化基于 kubeadm 的高级工具的开发，对于众所周知的路径和文件名，
kubeadm 使用了一组有限的常量值。

<!--  
The Kubernetes directory `/etc/kubernetes` is a constant in the application, since it is clearly the given path
in a majority of cases, and the most intuitive location; other constant paths and file names are:
-->
Kubernetes 目录 `/etc/kubernetes` 在应用程序中是一个常量，
因为在大多数情况下它显然是给定的路径，并且是最直观的位置；其他路径常量和文件名有：

<!--  
- `/etc/kubernetes/manifests` as the path where the kubelet should look for static Pod manifests.
  Names of static Pod manifests are:
-->
- `/etc/kubernetes/manifests` 作为 kubelet 查找静态 Pod 清单的路径。静态 Pod 清单的名称为：

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
- `/etc/kubernetes/` 作为带有控制平面组件身份标识的 kubeconfig 文件的路径。kubeconfig 文件的名称为：
  - `kubelet.conf`（在 TLS 引导时名称为 `bootstrap-kubelet.conf`）
  - `controller-manager.conf`
  - `scheduler.conf`
  - `admin.conf` 用于集群管理员和 kubeadm 本身
  - `super-admin.conf` 用于可以绕过 RBAC 的集群超级管理员

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
- 证书和密钥文件的名称：
  - `ca.crt`、`ca.key` 用于 Kubernetes 证书颁发机构
  - `apiserver.crt`、`apiserver.key` 用于 API 服务器证书
  - `apiserver-kubelet-client.crt`、`apiserver-kubelet-client.key`
    用于 API 服务器安全地连接到 kubelet 的客户端证书
  - `sa.pub`、`sa.key` 用于控制器管理器签署 ServiceAccount 时使用的密钥
  - `front-proxy-ca.crt`、`front-proxy-ca.key` 用于前端代理证书颁发机构
  - `front-proxy-client.crt`、`front-proxy-client.key` 用于前端代理客户端

<!--
## kubeadm init workflow internal design
-->
## kubeadm init 工作流程内部设计  {#kubeadm-init-workflow-internal-design}

<!--  
The `kubeadm init` consists of a sequence of atomic work tasks to perform,
as described in the `kubeadm init` [internal workflow](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow).
-->
`kubeadm init` [内部工作流程](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow)
包含一系列要执行的原子性工作任务，如 `kubeadm init` 中所述。

<!--  
The [`kubeadm init phase`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/) command allows
users to invoke each task individually, and ultimately offers a reusable and composable
API/toolbox that can be used by other Kubernetes bootstrap tools, by any IT automation tool or by
an advanced user for creating custom clusters.
-->
[`kubeadm init phase`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/)
命令允许用户分别调用每个任务，并最终提供可重用且可组合的 API 或工具箱，
其他 Kubernetes 引导工具、任何 IT 自动化工具和高级用户都可以使用它来创建自定义集群。

<!--
### Preflight checks
-->
### 预检  {#preflight-checks}

<!-- 
Kubeadm executes a set of preflight checks before starting the init, with the aim to verify
preconditions and avoid common cluster startup problems.
The user can skip specific preflight checks or all of them with the `--ignore-preflight-errors` option.
-->
kubeadm 在启动 init 之前执行一组预检，目的是验证先决条件并避免常见的集群启动问题。
用户可以使用 `--ignore-preflight-errors` 选项跳过特定的预检或全部检查。

<!--  
- [Warning] if the Kubernetes version to use (specified with the `--kubernetes-version` flag) is
  at least one minor version higher than the kubeadm CLI version.
- Kubernetes system requirements:
  - if running on linux:
    - [Error] if Kernel is older than the minimum required version
    - [Error] if required cgroups subsystem aren't set up
- [Error] if the CRI endpoint does not answer
-->
- [警告] 如果要使用的 Kubernetes 版本（由 `--kubernetes-version` 标志指定）比 kubeadm CLI
  版本至少高一个小版本。
- Kubernetes 系统要求：
  - 如果在 Linux 上运行：
    - [错误] 如果内核早于最低要求的版本
    - [错误] 如果未设置所需的 Cgroups 子系统
- [错误] 如果 CRI 端点未应答
<!--  
- [Error] if user is not root
- [Error] if the machine hostname is not a valid DNS subdomain
- [Warning] if the host name cannot be reached via network lookup
- [Error] if kubelet version is lower that the minimum kubelet version supported by kubeadm (current minor -1)
- [Error] if kubelet version is at least one minor higher than the required controlplane version (unsupported version skew)
- [Warning] if kubelet service does not exist or if it is disabled
- [Warning] if firewalld is active
-->
- [错误] 如果用户不是 root 用户
- [错误] 如果机器主机名不是有效的 DNS 子域
- [警告] 如果通过网络查找无法访问主机名
- [错误] 如果 kubelet 版本低于 kubeadm 支持的最低 kubelet 版本（当前小版本 -1）
- [错误] 如果 kubelet 版本比所需的控制平面板版本至少高一个小版本（不支持的版本偏差）
- [警告] 如果 kubelet 服务不存在或已被禁用
- [警告] 如果 firewalld 处于活动状态
<!--
- [Error] if API server bindPort or ports 10250/10251/10252 are used
- [Error] if `/etc/kubernetes/manifest` folder already exists and it is not empty
- [Error] if swap is on
- [Error] if `conntrack`, `ip`, `iptables`, `mount`, `nsenter` commands are not present in the command path
-->
- [错误] 如果 API 服务器绑定的端口或 10250/10251/10252 端口已被占用
- [错误] 如果 `/etc/kubernetes/manifest` 文件夹已经存在并且不为空
- [错误] 如果启用了交换分区
- [错误] 如果命令路径中没有 `conntrack`、`ip`、`iptables`、`mount`、`nsenter` 命令
<!--
- [Warning] if `ebtables`, `ethtool`, `socat`, `tc`, `touch`, `crictl` commands are not present in the command path
- [Warning] if extra arg flags for API server, controller manager, scheduler contains some invalid options
- [Warning] if connection to https://API.AdvertiseAddress:API.BindPort goes through proxy
- [Warning] if connection to services subnet goes through proxy (only first address checked)
- [Warning] if connection to Pods subnet goes through proxy (only first address checked)
-->
- [警告] 如果命令路径中没有 `ebtables`、`ethtool`、`socat`、`tc`、`touch`、`crictl` 命令
- [警告] 如果 API 服务器、控制器管理器、调度程序的其他参数标志包含一些无效选项
- [警告] 如果与 https://API.AdvertiseAddress:API.BindPort 的连接通过代理
- [警告] 如果服务子网的连接通过代理（仅检查第一个地址）
- [警告] 如果 Pod 子网的连接通过代理（仅检查第一个地址）
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
  - [错误] 如果 etcd 版本低于最低要求版本
  - [错误] 如果指定了 etcd 证书或密钥，但无法找到
- 如果未提供外部 etcd（因此将安装本地 etcd）：
  - [错误] 如果端口 2379 已被占用
  - [错误] 如果 Etcd.DataDir 文件夹已经存在并且不为空
- 如果授权模式为 ABAC：
  - [错误] 如果 abac_policy.json 不存在
- 如果授权方式为 Webhook
  - [错误] 如果 webhook_authz.conf 不存在

{{< note >}}
<!--
Preflight checks can be invoked individually with the
[`kubeadm init phase preflight`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-preflight)
command.
-->
可以使用 [`kubeadm init phase preflight`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-preflight)
命令单独触发预检。
{{< /note >}}

<!--
### Generate the necessary certificates
-->
### 生成必要的证书  {#generate-the-necessary-certificate}

<!--
Kubeadm generates certificate and private key pairs for different purposes:

- A self signed certificate authority for the Kubernetes cluster saved into `ca.crt` file and
  `ca.key` private key file
-->
kubeadm 生成用于不同目的的证书和私钥对：

- Kubernetes 集群的自签名证书颁发机构会保存到 `ca.crt` 文件和 `ca.key` 私钥文件中

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
- 用于 API 服务器的服务证书，使用 `ca.crt` 作为 CA 生成，并将证书保存到 `apiserver.crt`
  文件中，私钥保存到 `apiserver.key` 文件中。该证书应包含以下备用名称：

  - Kubernetes 服务的内部 clusterIP（服务 CIDR 的第一个地址。
    例如：如果服务的子网是 `10.96.0.0/12`，则为 `10.96.0.1`）
  - Kubernetes DNS 名称，例如：如果 `--service-dns-domain` 标志值是 `cluster.local`，
    则为 `kubernetes.default.svc.cluster.local`；
    加上默认的 DNS 名称 `kubernetes.default.svc`、`kubernetes.default` 和 `kubernetes`
  - 节点名称
  - `--apiserver-advertise-address`
  - 用户指定的其他备用名称

<!--
- A client certificate for the API server to connect to the kubelets securely, generated using
  `ca.crt` as the CA and saved into `apiserver-kubelet-client.crt` file with its private key
  `apiserver-kubelet-client.key`.
  This certificate should be in the `system:masters` organization

- A private key for signing ServiceAccount Tokens saved into `sa.key` file along with its public key `sa.pub`
-->
- 用于 API 服务器安全连接到 kubelet 的客户端证书，使用 `ca.crt` 作为 CA 生成，
  并保存到 `apiserver-kubelet-client.crt`，私钥保存到 `apiserver-kubelet-client.key`
  文件中。该证书应该在 `system:masters` 组织中。

- 用于签名 ServiceAccount 令牌的私钥保存到 `sa.key` 文件中，公钥保存到 `sa.pub` 文件中。

<!--
- A certificate authority for the front proxy saved into `front-proxy-ca.crt` file with its key
  `front-proxy-ca.key`

- A client certificate for the front proxy client, generated using `front-proxy-ca.crt` as the CA and
  saved into `front-proxy-client.crt` file with its private key`front-proxy-client.key`
-->
- 用于前端代理的证书颁发机构保存到 `front-proxy-ca.crt` 文件中，私钥保存到
  `front-proxy-ca.key` 文件中

- 前端代理客户端的客户端证书，使用 `front-proxy-ca.crt` 作为 CA 生成，并保存到
  `front-proxy-client.crt` 文件中，私钥保存到 `front-proxy-client.key` 文件中

<!-- 
Certificates are stored by default in `/etc/kubernetes/pki`, but this directory is configurable
using the `--cert-dir` flag.
-->
证书默认情况下存储在 `/etc/kubernetes/pki` 中，但是该目录可以使用 `--cert-dir` 标志进行配置。

<!--
Please note that:
-->
请注意：

<!-- 
1. If a given certificate and private key pair both exist, and their content is evaluated to be compliant with the above specs, the existing files will
   be used and the generation phase for the given certificate will be skipped. This means the user can, for example, copy an existing CA to
   `/etc/kubernetes/pki/ca.{crt,key}`, and then kubeadm will use those files for signing the rest of the certs.
   See also [using custom certificates](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#custom-certificates)
1. For the CA, it is possible to provide the `ca.crt` file but not the `ca.key` file. If all other certificates and kubeconfig files
   are already in place, kubeadm recognizes this condition and activates the ExternalCA, which also implies the `csrsigner` controller in
   controller-manager won't be started
-->
1. 如果证书和私钥对都存在，并且其内容经过评估符合上述规范，将使用现有文件，
   并且跳过给定证书的生成阶段。
   这意味着用户可以将现有的 CA 复制到 `/etc/kubernetes/pki/ca.{crt,key}`，
   kubeadm 将使用这些文件对其余证书进行签名。
   请参阅[使用自定义证书](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#custom-certificates)。
2. 仅对 CA 来说，如果所有其他证书和 kubeconfig 文件都已就位，则可以只提供 `ca.crt` 文件，
   而不提供 `ca.key` 文件。
   kubeadm 能够识别出这种情况并启用 ExternalCA，这也意味着了控制器管理器中的
   `csrsigner` 控制器将不会启动。
<!--
1. If kubeadm is running in [external CA mode](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#external-ca-mode);
   all the certificates must be provided by the user, because kubeadm cannot generate them by itself
1. In case kubeadm is executed in the `--dry-run` mode, certificate files are written in a temporary folder
1. Certificate generation can be invoked individually with the
   [`kubeadm init phase certs all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-certs) command
-->
3. 如果 kubeadm 在[外部 CA 模式](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#external-ca-mode)
   下运行，所有证书必须由用户提供，因为 kubeadm 无法自行生成证书。
4. 如果在 `--dry-run` 模式下执行 kubeadm，证书文件将写入一个临时文件夹中。
5. 可以使用 [`kubeadm init phase certs all`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-certs)
   命令单独生成证书。

<!--
### Generate kubeconfig files for control plane components
-->
### 为控制平面组件生成 kubeconfig 文件  {#generate-kubeconfig-files-for-control-plane-components}

<!-- 
Kubeadm generates kubeconfig files with identities for control plane components:
-->
kubeadm 生成具有用于控制平面组件身份标识的 kubeconfig 文件：

<!--  
- A kubeconfig file for the kubelet to use during TLS bootstrap -
  /etc/kubernetes/bootstrap-kubelet.conf. Inside this file, there is a bootstrap-token or embedded
  client certificates for authenticating this node with the cluster.

  This client certificate should:

  - Be in the `system:nodes` organization, as required by the
    [Node Authorization](/docs/reference/access-authn-authz/node/) module
  - Have the Common Name (CN) `system:node:<hostname-lowercased>`
-->
- 供 kubelet 在 TLS 引导期间使用的 kubeconfig 文件 —— `/etc/kubernetes/bootstrap-kubelet.conf`。
  在此文件中，有一个引导令牌或内嵌的客户端证书，向集群表明此节点身份。

  此客户端证书应：

  - 根据[节点鉴权](/zh-cn/docs/reference/access-authn-authz/node/)模块的要求，属于 `system:nodes` 组织
  - 具有通用名称（CN）：`system:node:<小写主机名>`

<!--
- A kubeconfig file for controller-manager, `/etc/kubernetes/controller-manager.conf`; inside this
  file is embedded a client certificate with controller-manager identity. This client certificate should
  have the CN `system:kube-controller-manager`, as defined by default
  [RBAC core components roles](/docs/reference/access-authn-authz/rbac/#core-component-roles)
-->
- 控制器管理器的 kubeconfig 文件 —— `/etc/kubernetes/controller-manager.conf`；
  在此文件中嵌入了一个具有控制器管理器身份标识的客户端证书。
  此客户端证书应具有 CN：`system:kube-controller-manager`，
  该 CN 由 [RBAC 核心组件角色](/zh-cn/docs/reference/access-authn-authz/rbac/#core-component-roles)
  默认定义的。

<!--
- A kubeconfig file for scheduler, `/etc/kubernetes/scheduler.conf`; inside this file is embedded
  a client certificate with scheduler identity.
  This client certificate should have the CN `system:kube-scheduler`, as defined by default
  [RBAC core components roles](/docs/reference/access-authn-authz/rbac/#core-component-roles)
-->
- 调度器的 kubeconfig 文件 —— `/etc/kubernetes/scheduler.conf`；
  此文件中嵌入了具有调度器身份标识的客户端证书。此客户端证书应具有 CN：`system:kube-scheduler`，
  该 CN 由 [RBAC 核心组件角色](/zh-cn/docs/reference/access-authn-authz/rbac/#core-component-roles)
  默认定义的。

<!-- 
Additionally, a kubeconfig file for kubeadm as an administrative entity is generated and stored
in `/etc/kubernetes/admin.conf`. This file includes a certificate with
`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. `kubeadm:cluster-admins`
is a group managed by kubeadm. It is bound to the `cluster-admin` ClusterRole during `kubeadm init`,
by using the `super-admin.conf` file, which does not require RBAC.
This `admin.conf` file must remain on control plane nodes and should not be shared with additional users.
-->
此外，还会生成将 kubeadm 作为管理实体的 kubeconfig 文件并将其保存到 `/etc/kubernetes/admin.conf` 中。
该文件包含一个带有 `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`
的证书。`kubeadm:cluster-admins` 是一个由 kubeadm 管理的组，
它在 `kubeadm init` 期间通过使用 `super-admin.conf` 文件绑定到
`cluster-admin` ClusterRole，不需要 RBAC。
此 `admin.conf` 文件必须保留在控制平面节点上，并且不得与其他用户共享。

<!--
During `kubeadm init` another kubeconfig file is generated and stored in `/etc/kubernetes/super-admin.conf`.
This file includes a certificate with `Subject: O = system:masters, CN = kubernetes-super-admin`.
`system:masters` is a superuser group that bypasses RBAC and makes `super-admin.conf` useful in case
of an emergency where a cluster is locked due to RBAC misconfiguration.
The `super-admin.conf` file must be stored in a safe location and should not be shared with additional users.
-->
在 `kubeadm init` 期间，会生成另一个 kubeconfig 文件并将其存储在 `/etc/kubernetes/super-admin.conf` 中。
该文件包含一个带有 `Subject: O = system:masters, CN = kubernetes-super-admin` 的证书。
`system:masters` 是一个绕过 RBAC 的超级用户组，使 `super-admin.conf`
在紧急情况下非常有用，因为 RBAC 配置错误导致集群被锁定。
`super-admin.conf` 文件可以存储在安全位置，并且不会与其他用户共享。

<!--
See [RBAC user facing role bindings](/docs/reference/access-authn-authz/rbac/#user-facing-roles)
for additional information on RBAC and built-in ClusterRoles and groups.
-->
有关 RBAC 和内置 ClusterRoles 和组的其他信息，
请参阅[面向用户的 RBAC 角色绑定](/zh-cn/docs/reference/access-authn-authz/rbac/#user-facing-roles)。

<!--
Please note that:
-->
请注意：

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
1. `ca.crt` 证书内嵌在所有 kubeconfig 文件中。
2. 如果给定的 kubeconfig 文件存在且其内容经过评估符合上述规范，则 kubeadm 将使用现有文件，
   并跳过给定 kubeconfig 的生成阶段。
3. 如果 kubeadm 以 [ExternalCA 模式](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#external-ca-mode)
   运行，则所有必需的 kubeconfig 也必须由用户提供，因为 kubeadm 不能自己生成。
4. 如果在 `--dry-run` 模式下执行 kubeadm，则 kubeconfig 文件将写入一个临时文件夹中。
5. 可以使用
   [`kubeadm init phase kubeconfig all`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-kubeconfig)
   命令分别生成 kubeconfig 文件。

<!--
### Generate static Pod manifests for control plane components
-->
### 为控制平面组件生成静态 Pod 清单  {#generate-static-pod-manifests-for-control-plane-components}

<!--  
Kubeadm writes static Pod manifest files for control plane components to
`/etc/kubernetes/manifests`. The kubelet watches this directory for Pods to be created on startup.
-->
kubeadm 将用于控制平面组件的静态 Pod 清单文件写入 `/etc/kubernetes/manifests` 目录。
kubelet 启动后会监视这个目录以便创建 Pod。

<!--
Static Pod manifest share a set of common properties:
-->
静态 Pod 清单有一些共同的属性：

<!--  
- All static Pods are deployed on `kube-system` namespace
- All static Pods get `tier:control-plane` and `component:{component-name}` labels
- All static Pods use the `system-node-critical` priority class
- `hostNetwork: true` is set on all static Pods to allow control plane startup before a network is
  configured; as a consequence:

  * The `address` that the controller-manager and the scheduler use to refer to the API server is `127.0.0.1`
  * If the etcd server is set up locally, the `etcd-server` address will be set to `127.0.0.1:2379`
-->
- 所有静态 Pod 都部署在 `kube-system` 名字空间
- 所有静态 Pod 都打上 `tier:control-plane` 和 `component:{组件名称}` 标签
- 所有静态 Pod 均使用 `system-node-critical` 优先级
- 所有静态 Pod 都设置了 `hostNetwork:true`，使得控制平面在配置网络之前启动；结果导致：

  * 控制器管理器和调度器用来调用 API 服务器的地址为 `127.0.0.1`
  * 如果在本地设置 etcd 服务器，`etcd-servers` 地址将被设置为 `127.0.0.1:2379`

<!--
- Leader election is enabled for both the controller-manager and the scheduler
- Controller-manager and the scheduler will reference kubeconfig files with their respective, unique identities
- All static Pods get any extra flags specified by the user as described in
  [passing custom arguments to control plane components](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)
- All static Pods get any extra Volumes specified by the user (Host path)
-->
- 同时为控制器管理器和调度器启用了领导者选举
- 控制器管理器和调度器将引用 kubeconfig 文件及其各自的唯一标识
- 如[将自定义参数传递给控制平面组件](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)
  中所述，所有静态 Pod 都会获得用户指定的额外标志
- 所有静态 Pod 都会获得用户指定的额外卷（主机路径）

<!--
Please note that:
-->
请注意：

<!--  
1. All images will be pulled from registry.k8s.io by default.
   See [using custom images](/docs/reference/setup-tools/kubeadm/kubeadm-init/#custom-images)
   for customizing the image repository
1. In case kubeadm is executed in the `--dry-run` mode, static Pod files are written in a
   temporary folder
1. Static Pod manifest generation for control plane components can be invoked individually with
   the [`kubeadm init phase control-plane all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-control-plane) command
-->
1. 所有镜像默认从 registry.k8s.io 拉取。关于自定义镜像仓库，
   请参阅[使用自定义镜像](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#custom-images)。
2. 如果在 `--dry-run` 模式下执行 kubeadm，则静态 Pod 文件写入一个临时文件夹中。
3. 可以使用 [`kubeadm init phase control-plane all`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-control-plane)
   命令分别生成主控组件的静态 Pod 清单。

<!--
#### API server

The static Pod manifest for the API server is affected by the following parameters provided by the users:
-->
#### API 服务器  {#api-server}

API 服务器的静态 Pod 清单会受到用户提供的以下参数的影响：

<!--  
- The `apiserver-advertise-address` and `apiserver-bind-port` to bind to; if not provided, those
  values default to the IP address of the default network interface on the machine and port 6443
- The `service-cluster-ip-range` to use for services
-->
- 要绑定的 `apiserver-advertise-address` 和 `apiserver-bind-port`；
  如果未提供，则这些值默认为机器上默认网络接口的 IP 地址和 6443 端口。
- `service-cluster-ip-range` 给 Service 使用
<!--
- If an external etcd server is specified, the `etcd-servers` address and related TLS settings
  (`etcd-cafile`, `etcd-certfile`, `etcd-keyfile`);
  if an external etcd server is not provided, a local etcd will be used (via host network)
- If a cloud provider is specified, the corresponding `--cloud-provider` parameter is configured together
  with the `--cloud-config` path if such file exists (this is experimental, alpha and will be
  removed in a future version)
-->
- 如果指定了外部 etcd 服务器，则应指定 `etcd-servers` 地址和相关的 TLS 设置
  （`etcd-cafile`、`etcd-certfile`、`etcd-keyfile`）；
  如果未提供外部 etcd 服务器，则将使用本地 etcd（通过主机网络）
- 如果指定了云提供商，则配置相应的 `--cloud-provider` 参数，如果该路径存在，则配置 `--cloud-config`
  （这是实验性的，是 Alpha 版本，将在以后的版本中删除）

<!--
Other API server flags that are set unconditionally are:
-->
无条件设置的其他 API 服务器标志有：

<!--  
- `--insecure-port=0` to avoid insecure connections to the api server
- `--enable-bootstrap-token-auth=true` to enable the `BootstrapTokenAuthenticator` authentication module.
  See [TLS Bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/) for more details
- `--allow-privileged` to `true` (required e.g. by kube proxy)
- `--requestheader-client-ca-file` to `front-proxy-ca.crt`
-->
- `--insecure-port=0` 禁止到 API 服务器不安全的连接
- `--enable-bootstrap-token-auth=true` 启用 `BootstrapTokenAuthenticator` 身份验证模块。
  更多细节请参见 [TLS 引导](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)。
- `--allow-privileged` 设为 `true`（诸如 kube-proxy 这些组件有此要求）
- `--requestheader-client-ca-file` 设为 `front-proxy-ca.crt`

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
- `--enable-admission-plugins` 设为：

  - [`NamespaceLifecycle`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#namespacelifecycle)
    例如，避免删除系统保留的名字空间
  - [`LimitRanger`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#limitranger) 和
    [`ResourceQuota`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#resourcequota)
    对名字空间实施限制
  - [`ServiceAccount`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#serviceaccount)
    实施服务账户自动化

  <!--
  - [`PersistentVolumeLabel`](/docs/reference/access-authn-authz/admission-controllers/#persistentvolumelabel)
    attaches region or zone labels to PersistentVolumes as defined by the cloud provider (This
    admission controller is deprecated and will be removed in a future version.
    It is not deployed by kubeadm by default with v1.9 onwards when not explicitly opting into
    using `gce` or `aws` as cloud providers)
  -->
  - [`PersistentVolumeLabel`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#persistentvolumelabel)
    将区域（Region）或区（Zone）标签附加到由云提供商定义的 PersistentVolumes
    （此准入控制器已被弃用并将在以后的版本中删除）。
    如果未明确选择使用 `gce` 或 `aws` 作为云提供商，则默认情况下，v1.9 以后的版本 kubeadm 都不会部署。

  <!--
  - [`DefaultStorageClass`](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
    to enforce default storage class on `PersistentVolumeClaim` objects
  - [`DefaultTolerationSeconds`](/docs/reference/access-authn-authz/admission-controllers/#defaulttolerationseconds)
  - [`NodeRestriction`](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
    to limit what a kubelet can modify (e.g. only pods on this node)
  -->
  - [`DefaultStorageClass`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
    在 `PersistentVolumeClaim` 对象上强制使用默认存储类型
  - [`DefaultTolerationSeconds`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaulttolerationseconds)
  - [`NodeRestriction`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
    限制 kubelet 可以修改的内容（例如，仅此节点上的 Pod）

<!--
- `--kubelet-preferred-address-types` to `InternalIP,ExternalIP,Hostname;` this makes `kubectl
  logs` and other API server-kubelet communication work in environments where the hostnames of the
  nodes aren't resolvable
-->
- `--kubelet-preferred-address-types` 设为 `InternalIP,ExternalIP,Hostname;`
  这使得在节点的主机名无法解析的环境中，`kubectl log` 和 API 服务器与 kubelet
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
- 使用在前面步骤中生成的证书的标志：

  - `--client-ca-file` 设为 `ca.crt`
  - `--tls-cert-file` 设为 `apiserver.crt`
  - `--tls-private-key-file` 设为 `apiserver.key`
  - `--kubelet-client-certificate` 设为 `apiserver-kubelet-client.crt`
  - `--kubelet-client-key` 设为 `apiserver-kubelet-client.key`
  - `--service-account-key-file` 设为 `sa.pub`
  - `--requestheader-client-ca-file` 设为 `front-proxy-ca.crt`
  - `--proxy-client-cert-file` 设为 `front-proxy-client.crt`
  - `--proxy-client-key-file` 设为 `front-proxy-client.key`

<!--
- Other flags for securing the front proxy
  ([API Aggregation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/))
  communications:

  - `--requestheader-username-headers=X-Remote-User`
  - `--requestheader-group-headers=X-Remote-Group`
  - `--requestheader-extra-headers-prefix=X-Remote-Extra-`
  - `--requestheader-allowed-names=front-proxy-client`
-->
- 其他用于保护前端代理（
  [API 聚合层](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)）
  通信的标志：

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
控制器管理器的静态 Pod 清单受用户提供的以下参数的影响：

<!-- 
- If kubeadm is invoked specifying a `--pod-network-cidr`, the subnet manager feature required for
  some CNI network plugins is enabled by setting:

  - `--allocate-node-cidrs=true`
  - `--cluster-cidr` and `--node-cidr-mask-size` flags according to the given CIDR
-->
- 如果调用 kubeadm 时指定了 `--pod-network-cidr` 参数，
  则可以通过以下方式启用某些 CNI 网络插件所需的子网管理器功能：

  - 设置 `--allocate-node-cidrs=true`
  - 根据给定 CIDR 设置 `--cluster-cidr` 和 `--node-cidr-mask-size` 标志

<!--
- If a cloud provider is specified, the corresponding `--cloud-provider` is specified together
  with the `--cloud-config` path if such configuration file exists (this is experimental, alpha
  and will be removed in a future version)
-->
- 如果指定了云提供商，则指定相应的 `--cloud-provider`，如果存在这样的配置文件，
  则指定 `--cloud-config` 路径（此为试验性功能，是 Alpha 版本，将在以后的版本中删除）。

<!--
Other flags that are set unconditionally are:
-->
其他无条件设置的标志包括：

<!--  
- `--controllers` enabling all the default controllers plus `BootstrapSigner` and `TokenCleaner`
  controllers for TLS bootstrap. See [TLS Bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
  for more details.

- `--use-service-account-credentials` to `true`
-->
- `--controllers` 为 TLS 引导程序启用所有默认控制器以及 `BootstrapSigner` 和
  `TokenCleaner` 控制器。详细信息请参阅
  [TLS 引导](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)

- `--use-service-account-credentials` 设为 `true`

<!--
- Flags for using certificates generated in previous steps:

  - `--root-ca-file` to `ca.crt`
  - `--cluster-signing-cert-file` to `ca.crt`, if External CA mode is disabled, otherwise to `""`
  - `--cluster-signing-key-file` to `ca.key`, if External CA mode is disabled, otherwise to `""`
  - `--service-account-private-key-file` to `sa.key`
-->
- 使用先前步骤中生成的证书的标志：

  - `--root-ca-file` 设为 `ca.crt`
  - 如果禁用了 External CA 模式，则 `--cluster-signing-cert-file` 设为 `ca.crt`，否则设为 `""`
  - 如果禁用了 External CA 模式，则 `--cluster-signing-key-file` 设为 `ca.key`，否则设为 `""`
  - `--service-account-private-key-file` 设为 `sa.key`

<!--
#### Scheduler

The static Pod manifest for the scheduler is not affected by parameters provided by the users.
-->
#### 调度器  {#scheduler}

调度器的静态 Pod 清单不受用户提供的参数的影响。

<!--
### Generate static Pod manifest for local etcd
-->
### 为本地 etcd 生成静态 Pod 清单  {#generate-static-pod-manifest-for-local-etcd}

<!--  
If you specified an external etcd, this step will be skipped, otherwise kubeadm generates a
static Pod manifest file for creating a local etcd instance running in a Pod with following attributes:
-->
如果你指定的是外部 etcd，则应跳过此步骤，否则 kubeadm 会生成静态 Pod 清单文件，
以创建在 Pod 中运行的、具有以下属性的本地 etcd 实例：

<!--  
- listen on `localhost:2379` and use `HostNetwork=true`
- make a `hostPath` mount out from the `dataDir` to the host's filesystem
- Any extra flags specified by the user
-->
- 在 `localhost:2379` 上监听并使用 `HostNetwork=true`
- 将 `hostPath` 从 `dataDir` 挂载到主机的文件系统
- 用户指定的任何其他标志

<!--
Please note that:
-->
请注意：

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
1. etcd 容器镜像默认从 `registry.gcr.io` 拉取。有关自定义镜像仓库，
   请参阅[使用自定义镜像](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#custom-images)。
2. 如果你以 `--dry-run` 模式执行 kubeadm 命令，etcd 的静态 Pod 清单将被写入一个临时文件夹。
3. 你可以使用 ['kubeadm init phase etcd local'](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-etcd)
   命令为本地 etcd 直接调用静态 Pod 清单生成逻辑。

<!--
### Wait for the control plane to come up
-->
### 等待控制平面启动  {#wait-for-the-control-plane-to-come-up}

<!--  
kubeadm waits (upto 4m0s) until `localhost:6443/healthz` (kube-apiserver liveness) returns `ok`.
However, in order to detect deadlock conditions, kubeadm fails fast if `localhost:10255/healthz`
(kubelet liveness) or `localhost:10255/healthz/syncloop` (kubelet readiness) don't return `ok`
within 40s and 60s respectively.
-->
kubeadm 等待（最多 4m0s），直到 `localhost:6443/healthz`（kube-apiserver 存活）返回 `ok`。
但是为了检测死锁条件，如果 `localhost:10255/healthz`（kubelet 存活）或
`localhost:10255/healthz/syncloop`（kubelet 就绪）未能在 40s 和 60s 内未返回 `ok`，
则 kubeadm 会快速失败。

<!--  
kubeadm relies on the kubelet to pull the control plane images and run them properly as static Pods.
After the control plane is up, kubeadm completes the tasks described in following paragraphs.
-->
kubeadm 依靠 kubelet 拉取控制平面镜像并将其作为静态 Pod 正确运行。
控制平面启动后，kubeadm 将完成以下段落中描述的任务。

<!--
### Save the kubeadm ClusterConfiguration in a ConfigMap for later reference
-->
### 将 kubeadm ClusterConfiguration 保存在 ConfigMap 中以供以后参考  {#save-the-kubeadm-clusterconfiguration-in-a-configmap-for-later-reference}

<!-- 
kubeadm saves the configuration passed to `kubeadm init` in a ConfigMap named `kubeadm-config`
under `kube-system` namespace.
-->
kubeadm 将传递给 `kubeadm init` 的配置保存在 `kube-system` 名字空间下名为
`kubeadm-config` 的 ConfigMap 中。

<!--  
This will ensure that kubeadm actions executed in future (e.g `kubeadm upgrade`) will be able to
determine the actual/current cluster state and make new decisions based on that data.
-->
这将确保将来执行的 kubeadm 操作（例如 `kubeadm upgrade`）将能够确定实际/当前集群状态，
并根据该数据做出新的决策。

<!--
Please note that:
-->
请注意：

<!-- 
1. Before saving the ClusterConfiguration, sensitive information like the token is stripped from the configuration
1. Upload of control plane node configuration can be invoked individually with the command
   [`kubeadm init phase upload-config`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-upload-config).
-->
1. 在保存 ClusterConfiguration 之前，从配置中删除令牌等敏感信息。
2. 可以使用 [`kubeadm init phase upload-config`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-upload-config)
   命令单独上传主控节点配置。

<!--
### Mark the node as control-plane
-->
### 将节点标记为控制平面  {#mark-the-node-as-control-plane}

<!--
As soon as the control plane is available, kubeadm executes the following actions:
-->
一旦控制平面可用，kubeadm 将执行以下操作：

<!-- 
- Labels the node as control-plane with `node-role.kubernetes.io/control-plane=""`
- Taints the node with `node-role.kubernetes.io/control-plane:NoSchedule`

Please note that the phase to mark the control-plane phase can be invoked
individually with the [`kubeadm init phase mark-control-plane`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-mark-control-plane) command.
-->
- 给节点打上 `node-role.kubernetes.io/control-plane=""` 标签，标记其为控制平面
- 给节点打上 `node-role.kubernetes.io/control-plane:NoSchedule` 污点

请注意，标记控制面的这个阶段可以单独通过
[`kubeadm init phase mark-control-plane`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-mark-control-plane)
命令来实现。

<!--
### Configure TLS-Bootstrapping for node joining
-->
### 为即将加入的节点加入 TLS 启动引导  {#configure-tls-bootstrapping-for-node-joining}

<!--
Kubeadm uses [Authenticating with Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/)
for joining new nodes to an existing cluster; for more details see also
[design proposal](https://git.k8s.io/design-proposals-archive/cluster-lifecycle/bootstrap-discovery.md).
-->
kubeadm 使用[引导令牌认证](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)
将新节点连接到现有集群；更多的详细信息，
请参见[设计提案](https://git.k8s.io/design-proposals-archive/cluster-lifecycle/bootstrap-discovery.md)。

<!-- 
`kubeadm init` ensures that everything is properly configured for this process, and this includes
following steps as well as setting API server and controller flags as already described in
previous paragraphs.
-->
`kubeadm init` 确保为该过程正确配置了所有内容，这包括以下步骤以及设置 API
服务器和控制器标志，如前几段所述。

{{< note >}}
<!--
TLS bootstrapping for nodes can be configured with the command
[`kubeadm init phase bootstrap-token`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-bootstrap-token),
executing all the configuration steps described in following paragraphs;
alternatively, each step can be invoked individually.
-->
可以使用 [`kubeadm init phase bootstrap-token`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-bootstrap-token)
命令配置节点的 TLS 引导，执行以下段落中描述的所有配置步骤；
或者也可以单独执行各个步骤。
{{< /note >}}

<!--
#### Create a bootstrap token
-->
#### 创建引导令牌  {#create-a-bootstrap-token}

<!--  
`kubeadm init` creates a first bootstrap token, either generated automatically or provided by the
user with the `--token` flag; as documented in bootstrap token specification, token should be
saved as a secret with name `bootstrap-token-<token-id>` under `kube-system` namespace.
-->
`kubeadm init` 创建第一个引导令牌，该令牌是自动生成的或由用户提供的 `--token`
标志的值；如引导令牌规范文档中所述，令牌应保存在 `kube-system` 名字空间下名为
`bootstrap-token-<令牌 ID>` 的 Secret 中。

<!--
Please note that:
-->
请注意：

<!--  
1. The default token created by `kubeadm init` will be used to validate temporary user during TLS
   bootstrap process; those users will be member of
  `system:bootstrappers:kubeadm:default-node-token` group
1. The token has a limited validity, default 24 hours (the interval may be changed with the `—token-ttl` flag)
1. Additional tokens can be created with the [`kubeadm token`](/docs/reference/setup-tools/kubeadm/kubeadm-token/)
   command, that provide other useful functions for token management as well.
-->
1. 由 `kubeadm init` 创建的默认令牌将用于在 TLS 引导过程中验证临时用户；
   这些用户会成为 `system:bootstrappers:kubeadm:default-node-token` 组的成员。
2. 令牌的有效期有限，默认为 24 小时（间隔可以通过 `-token-ttl` 标志进行更改）。
3. 可以使用 [`kubeadm token`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-token/)
   命令创建其他令牌，这些令牌还提供其他有用的令牌管理功能。

<!--
#### Allow joining nodes to call CSR API
-->
#### 允许加入的节点调用 CSR API  {#allow-joining-nodes-to-call-csr-api}

<!--
Kubeadm ensures that users in `system:bootstrappers:kubeadm:default-node-token` group are able to
access the certificate signing API.
-->
kubeadm 确保 `system:bootstrappers:kubeadm:default-node-token` 组中的用户能够访问证书签名 API。

<!-- 
This is implemented by creating a ClusterRoleBinding named `kubeadm:kubelet-bootstrap` between the
group above and the default RBAC role `system:node-bootstrapper`.
-->
这是通过在上述组与默认 RBAC 角色 `system:node-bootstrapper` 之间创建名为
`kubeadm:kubelet-bootstrap` 的 ClusterRoleBinding 来实现的。

<!--
#### Set up auto approval for new bootstrap tokens
-->
#### 为新的引导令牌设置自动批准  {#setup-auto-approval-for-new-bootstrap-tokens}

<!--
Kubeadm ensures that the Bootstrap Token will get its CSR request automatically approved by the
csrapprover controller.
-->
kubeadm 确保 csrapprover 控制器自动批准引导令牌的 CSR 请求。

<!-- 
This is implemented by creating ClusterRoleBinding named `kubeadm:node-autoapprove-bootstrap`
between the `system:bootstrappers:kubeadm:default-node-token` group and the default role
`system:certificates.k8s.io:certificatesigningrequests:nodeclient`.
-->
这是通过在 `system:bootstrappers:kubeadm:default-node-token` 用户组和
`system:certificates.k8s.io:certificatesigningrequests:nodeclient` 默认角色之间
创建名为 `kubeadm:node-autoapprove-bootstrap` 的 ClusterRoleBinding 来实现的。

<!-- 
The role `system:certificates.k8s.io:certificatesigningrequests:nodeclient` should be created as
well, granting POST permission to
`/apis/certificates.k8s.io/certificatesigningrequests/nodeclient`.
-->
还应创建 `system:certificates.k8s.io:certificatesigningrequests:nodeclient` 角色，
授予对 `/apis/certificates.k8s.io/certificatesigningrequests/nodeclient`
执行 POST 的权限。

<!--
#### Set up nodes certificate rotation with auto approval
-->
#### 通过自动批准设置节点证书轮换 {#setup-nodes-certificate-rotation-with-auto-approval}

<!-- 
Kubeadm ensures that certificate rotation is enabled for nodes, and that a new certificate request
for nodes will get its CSR request automatically approved by the csrapprover controller.
-->
kubeadm 确保节点启用了证书轮换，csrapprover 控制器将自动批准节点的新证书的 CSR 请求。

<!-- 
This is implemented by creating ClusterRoleBinding named
`kubeadm:node-autoapprove-certificate-rotation` between the `system:nodes` group and the default
role `system:certificates.k8s.io:certificatesigningrequests:selfnodeclient`.
-->
这是通过在 `system:nodes` 组和
`system:certificates.k8s.io:certificatesigningrequests:selfnodeclient`
默认角色之间创建名为 `kubeadm:node-autoapprove-certificate-rotation` 的
ClusterRoleBinding 来实现的。

<!--
#### Create the public cluster-info ConfigMap
-->
#### 创建公共 cluster-info ConfigMap   {#create-the-public-cluster-info-configmap}

<!--
This phase creates the `cluster-info` ConfigMap in the `kube-public` namespace.
-->
本步骤在 `kube-public` 名字空间中创建名为 `cluster-info` 的 ConfigMap。

<!--  
Additionally, it creates a Role and a RoleBinding granting access to the ConfigMap for
unauthenticated users (i.e. users in RBAC group `system:unauthenticated`).
-->
另外，它创建一个 Role 和一个 RoleBinding，为未经身份验证的用户授予对 ConfigMap
的访问权限（即 RBAC 组 `system:unauthenticated` 中的用户）。

{{< note >}}
<!--
The access to the `cluster-info` ConfigMap _is not_ rate-limited. This may or may not be a
problem if you expose your cluster's API server to the internet; worst-case scenario here is a
DoS attack where an attacker uses all the in-flight requests the kube-apiserver can handle to
serve the `cluster-info` ConfigMap.
-->
对 `cluster-info` ConfigMap 的访问**不受**速率限制。
如果你把 API 服务器暴露到外网，这可能是一个问题，也可能不是；
这里最坏的情况是 DoS 攻击，攻击者使用 kube-apiserver 可处理的所有当前请求来为
`cluster-info` ConfigMap 提供服务。
{{< /note >}}

<!--
### Install addons
-->
### 安装插件  {#install-addons}

<!--
Kubeadm installs the internal DNS server and the kube-proxy addon components via the API server.
-->
kubeadm 通过 API 服务器安装内部 DNS 服务器和 kube-proxy 插件。

{{< note >}}
<!--
This phase can be invoked individually with the command
[`kubeadm init phase addon all`](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon).
-->
此步骤可以通过 ['kubeadm init phase addon all'](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon)
命令单独执行。
{{< /note >}}

<!--
#### proxy

A ServiceAccount for `kube-proxy` is created in the `kube-system` namespace; then kube-proxy is
deployed as a DaemonSet:
-->
#### 代理  {#proxy}

在 `kube-system` 名字空间中创建一个用于 `kube-proxy` 的 ServiceAccount；
然后以 DaemonSet 的方式部署 kube-proxy：

<!--  
- The credentials (`ca.crt` and `token`) to the control plane come from the ServiceAccount
- The location (URL) of the API server comes from a ConfigMap
- The `kube-proxy` ServiceAccount is bound to the privileges in the `system:node-proxier` ClusterRole
-->
- 主控节点凭据（`ca.crt` 和 `token`）来自 ServiceAccount
- API 服务器节点的位置（URL）来自 ConfigMap
- `kube-proxy` 的 ServiceAccount 绑定了 `system:node-proxier` ClusterRole 中的特权

#### DNS

<!--  
- The CoreDNS service is named `kube-dns`. This is done to prevent any interruption
  in service when the user is switching the cluster DNS from kube-dns to CoreDNS
  through the `--config` method described [here](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon).

- A ServiceAccount for CoreDNS is created in the `kube-system` namespace.

- The `coredns` ServiceAccount is bound to the privileges in the `system:coredns` ClusterRole
-->
- CoreDNS Service 的名称为 `kube-dns`。
  这样做是为了防止当用户通过[此处](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon)描述的
  `--config` 方法将集群 DNS 从 kube-dns 切换到 CoreDNS 时出现服务中断。

- 在 `kube-system` 名字空间中创建 CoreDNS 的 ServiceAccount

- `coredns` 的 ServiceAccount 绑定了 `system:coredns` ClusterRole 中的特权

<!--
In Kubernetes version 1.21, support for using `kube-dns` with kubeadm was removed.
You can use CoreDNS with kubeadm even when the related Service is named `kube-dns`.
-->
在 Kubernetes 1.21 版本中，kubeadm 对 `kube-dns` 的支持被移除。
你可以在 kubeadm 使用 CoreDNS，即使相关的 Service 名字仍然是 `kube-dns`。

<!--
## kubeadm join phases internal design
-->
## kubeadm join 步骤内部设计  {#kubeadm-join-phases-internal-design}

<!-- 
Similarly to `kubeadm init`, also `kubeadm join` internal workflow consists of a sequence of
atomic work tasks to perform.
-->
与 `kubeadm init` 类似，`kubeadm join` 内部工作流由一系列待执行的原子工作任务组成。

<!-- 
This is split into discovery (having the Node trust the Kubernetes Master) and TLS bootstrap
(having the Kubernetes Master trust the Node).
-->
这分为发现（让该节点信任 Kubernetes 的主控节点）和 TLS 引导
（让 Kubernetes 的主控节点信任该节点）。

<!-- 
see [Authenticating with Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/)
or the corresponding [design proposal](https://git.k8s.io/design-proposals-archive/cluster-lifecycle/bootstrap-discovery.md).
-->
请参阅[使用引导令牌进行身份验证](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)
或相应的[设计提案](https://git.k8s.io/design-proposals-archive/cluster-lifecycle/bootstrap-discovery.md)。

<!--
### Preflight checks
-->
### 预检  {#preflight-checks}

<!-- 
`kubeadm` executes a set of preflight checks before starting the join, with the aim to verify
preconditions and avoid common cluster startup problems.
-->
`kubeadm` 在开始执行之前执行一组预检，目的是验证先决条件，避免常见的集群启动问题。

<!--
Please note that:
-->
请注意：

<!--  
1. `kubeadm join` preflight checks are basically a subset of `kubeadm init` preflight checks
1. Starting from 1.24, kubeadm uses crictl to communicate to all known CRI endpoints.
1. Starting from 1.9, kubeadm provides support for joining nodes running on Windows; in that case,
   linux specific controls are skipped.
1. In any case the user can skip specific preflight checks (or eventually all preflight checks)
   with the `--ignore-preflight-errors` option.
-->
1. `kubeadm join` 预检基本上是 `kubeadm init` 预检的一个子集。
2. 从 1.24 开始，kubeadm 使用 crictl 与所有已知的 CRI 端点进行通信。
3. 从 1.9 开始，kubeadm 支持加入在 Windows 上运行的节点；在这种情况下，
   将跳过 Linux 特定的控制参数。
4. 在任何情况下，用户都可以通过 `--ignore-preflight-errors`
   选项跳过特定的预检（或者进而跳过所有预检）。

<!--
### Discovery cluster-info
-->
### 发现 cluster-info  {#discovery-cluster-info}

<!--  
There are 2 main schemes for discovery. The first is to use a shared token along with the IP
address of the API server.
The second is to provide a file (that is a subset of the standard kubeconfig file).
-->
主要有两种发现方案。第一种是使用一个共享令牌以及 API 服务器的 IP 地址。
第二种是提供一个文件（它是标准 kubeconfig 文件的子集）。

<!--
#### Shared token discovery
-->
#### 共享令牌发现  {#shared-token-discovery}

<!--  
If `kubeadm join` is invoked with `--discovery-token`, token discovery is used; in this case the
node basically retrieves the cluster CA certificates from the `cluster-info` ConfigMap in the
`kube-public` namespace.
-->
如果带 `--discovery-token` 参数调用 `kubeadm join`，则使用了令牌发现功能；
在这种情况下，节点基本上从 `kube-public` 名字空间中的 `cluster-info` ConfigMap
中检索集群 CA 证书。

<!--
In order to prevent "man in the middle" attacks, several steps are taken:
-->
为了防止“中间人”攻击，采取了以下步骤：

<!--  
- First, the CA certificate is retrieved via insecure connection (this is possible because
  `kubeadm init` is granted access to `cluster-info` users for `system:unauthenticated`)

- Then the CA certificate goes through following validation steps:
-->
- 首先，通过不安全连接检索 CA 证书（这是可能的，因为 `kubeadm init` 授予
  `system:unauthenticated` 的用户对 `cluster-info` 访问权限）。

- 然后 CA 证书通过以下验证步骤：

  <!--
  - Basic validation: using the token ID against a JWT signature
  - Pub key validation: using provided `--discovery-token-ca-cert-hash`. This value is available
    in the output of `kubeadm init` or can be calculated using standard tools (the hash is
    calculated over the bytes of the Subject Public Key Info (SPKI) object as in RFC7469). The
    `--discovery-token-ca-cert-hash flag` may be repeated multiple times to allow more than one public key.
  - As an additional validation, the CA certificate is retrieved via secure connection and then
    compared with the CA retrieved initially
  -->
  - 基本验证：使用令牌 ID 而不是 JWT 签名
  - 公钥验证：使用提供的 `--discovery-token-ca-cert-hash`。这个值来自 `kubeadm init` 的输出，
    或者可以使用标准工具计算（哈希值是按 RFC7469 中主体公钥信息（SPKI）对象的字节计算的）
    `--discovery-token-ca-cert-hash` 标志可以重复多次，以允许多个公钥。
  - 作为附加验证，通过安全连接检索 CA 证书，然后与初始检索的 CA 进行比较。

{{< note >}}
<!--
Pub key validation can be skipped passing `--discovery-token-unsafe-skip-ca-verification` flag;
This weakens the kubeadm security model since others can potentially impersonate the Kubernetes Master.
-->
通过设置 `--discovery-token-unsafe-skip-ca-verification` 标志可以跳过公钥验证；
这样做会削弱 kubeadm 安全模型，因为其他人可能冒充 Kubernetes 主控节点。
{{< /note >}}

<!--
#### File/https discovery
-->
#### 文件/HTTPS 发现  {#file-or-https-discovery}

<!-- 
If `kubeadm join` is invoked with `--discovery-file`, file discovery is used; this file can be a
local file or downloaded via an HTTPS URL; in case of HTTPS, the host installed CA bundle is used
to verify the connection.
-->
如果带 `--discovery-file` 参数调用 `kubeadm join`，则使用文件发现功能；
该文件可以是本地文件或通过 HTTPS URL 下载；对于 HTTPS，主机安装的 CA 包用于验证连接。

<!--  
With file discovery, the cluster CA certificate is provided into the file itself; in fact, the
discovery file is a kubeconfig file with only `server` and `certificate-authority-data` attributes
set, as described in the [`kubeadm join`](/docs/reference/setup-tools/kubeadm/kubeadm-join/#file-or-https-based-discovery)
reference doc; when the connection with the cluster is established, kubeadm tries to access the
`cluster-info` ConfigMap, and if available, uses it.
-->
通过文件发现，集群 CA 证书是文件本身提供；事实上，这个发现文件是一个 kubeconfig 文件，
只设置了 `server` 和 `certificate-authority-data` 属性，
如 [`kubeadm join`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/#file-or-https-based-discovery)
参考文档中所述，当与集群建立连接时，kubeadm 尝试访问 `cluster-info` ConfigMap，
如果可用，就使用它。

<!--
## TLS Bootstrap
-->
## TLS 引导  {#tls-boostrap}

<!--  
Once the cluster info is known, the file `bootstrap-kubelet.conf` is written, thus allowing
kubelet to do TLS Bootstrapping.
-->
知道集群信息后，kubeadm 将写入文件 `bootstrap-kubelet.conf`，从而允许 kubelet 执行
TLS 引导。

<!--  
The TLS bootstrap mechanism uses the shared token to temporarily authenticate with the Kubernetes
API server to submit a certificate signing request (CSR) for a locally created key pair.
-->
TLS 引导机制使用共享令牌对 Kubernetes API 服务器进行临时身份验证，
以便为本地创建的密钥对提交证书签名请求（CSR）。

<!--  
The request is then automatically approved and the operation completes saving `ca.crt` file and
`kubelet.conf` file to be used by the kubelet for joining the cluster, while `bootstrap-kubelet.conf`
is deleted.
-->
该请求会被自动批准，并且该操作保存 `ca.crt` 文件和 `kubelet.conf` 文件，用于
kubelet 加入集群，同时删除 `bootstrap-kubelet.conf`。

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
- 临时身份验证根据 `kubeadm init` 过程中保存的令牌进行验证（或者使用 `kubeadm token` 命令创建的其他令牌）
- 临时身份验证解析到 `system:bootstrappers:kubeadm:default-node-token` 组的一个用户成员，
  该成员在 `kubeadm init` 过程中被授予对 CSR API 的访问权
- 自动的 CSR 审批由 csrapprover 控制器基于 `kubeadm init` 过程中给出的配置来管理
{{< /note >}}
