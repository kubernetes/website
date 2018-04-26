---
approvers:
- mikedanese
- luxas
- jbeda
title: 实现细节
cn-approvers:
- chentao1596
---
<!--
---
approvers:
- mikedanese
- luxas
- jbeda
title: Implementation details
---
-->
{% capture overview %}
<!--
`kubeadm init` and `kubeadm join` together provides a nice user experience for creating a best-practice but bare Kubernetes cluster from scratch.
However, it might not be obvious _how_ kubeadm does that.
-->
`kubeadm init` 和 `kubeadm join` 为从头开始创建一个 Kubernetes 集群的最佳实践共同提供了一个很好的用户体验。但是，kubeadm _如何_ 做到这一点可能并不明显。

<!--
This document provide additional details on what happen under the hood, with the aim of sharing knowledge on Kubernetes cluster best practices.
-->
本文档提供了有关发生了什么事情的更多详细信息，旨在分享关于 Kubernetes 集群最佳实践的知识。
{% endcapture %}

{% capture body %}
<!--
## Core design principles
-->
## 核心设计原则

<!--
The cluster that `kubeadm init` and `kubeadm join` set up should be:
-->
使用 `kubeadm init` 和 `kubeadm join` 设置的集群应该：
<!--
 - Secure:
   - It should adopt latest best-practices like:
     - enforcing RBAC
     - using the Node Authorizer
     - using secure communication between the control plane components
     - using secure communication between the API server and the kubelets
     - lock-down the kubelet API
     - locking down access to the API for system components like the kube-proxy and kube-dns
     - locking down what a Bootstrap Token can access
     - etc.
-->
 - 安全：
   - 它应该采用最新的最佳做法，如：
     - 强制实施 RBAC
     - 使用节点授权器
     - 控制平面组件之间使用安全通信
     - API​​ server 和 kubelet 之间使用安全通信
     - 锁定 kubelet API
     - 锁定对系统组件（如 kube-proxy 和 kube-dns）的 API 访问权限
     - 锁定引导令牌可以访问的内容
     - 等等
<!--
 - Easy to use:
   - The user should not have to run anything more than a couple of commands:
-->
 - 使用方便：
   - 用户只需运行几个命令即可：
     - `kubeadm init` 
     - `export KUBECONFIG=/etc/kubernetes/admin.conf`
     - `kubectl apply -f <network-of-choice.yaml>`
     - `kubeadm join --token <token> <master-ip>:<master-port>`
<!--
 - Extendable:
   - It should for example _not_ favor any network provider, instead configuring a network is out-of-scope
   - Should provide the possibility to use a config file for customizing various parameters
-->
 - 可扩展：
   - 例如，它 _不_ 应该支持任何网络提供商，相反，配置网络应该是超出了它的范围
   - 应该提供使用配置文件自定义各种参数的可能性

<!--
## Constants and well-known values and paths
-->
## 常量和众所周知的值和路径

<!--
In order to reduce complexity and to simplify development of an on-top-of-kubeadm-implemented deployment solution, kubeadm uses a 
limited set of constants values for well know-known paths and file names.
-->
为了降低复杂性并简化 kubeadm 实施的部署解决方案的开发，kubeadm 使用一组有限的常量值，用于众所周知的路径和文件名。

<!--
The Kubernetes directory `/etc/kubernetes` is a constant in the application, since it is clearly the given path 
in a majority of cases, and the most intuitive location; other constants paths and file names are:
-->
Kubernetes 目录 `/etc/kubernetes`  在应用中是一个常量，因为它明显是大多数情况下的给定路径，也是最直观的位置; 其他常量路径和文件名是：

<!--
- `/etc/kubernetes/manifests` as the path where kubelet should look for static Pod manifests. Names of static Pod manifests are:
-->
- `/etc/kubernetes/manifests` 作为 kubelet 寻找静态 Pod 的路径。静态 Pod 清单的名称是：
    - `etcd.yaml`
    - `kube-apiserver.yaml`
    - `kube-controller-manager.yaml`
    - `kube-scheduler.yaml`
<!--
- `/etc/kubernetes/` as the path where kubeconfig files with identities for control plane components are stored. Names of kubeconfig files are:
    - `kubelet.conf` (`bootstrap-kubelet.conf` during TLS bootstrap)
    - `controller-manager.conf`
    - `scheduler.conf`
    - `admin.conf` for the cluster admin and kubeadm itself
-->
- `/etc/kubernetes/` 作为存储具有控制平面组件标识的 kubeconfig 文件的路径。kubeconfig 文件的名称是：
    - `kubelet.conf` （`bootstrap-kubelet.conf` - 在 TLS 引导期间）
    - `controller-manager.conf`
    - `scheduler.conf`
    - `admin.conf` 用于集群管理员和 kubeadm 本身
<!--
- Names of certificates and key files :
    - `ca.crt`, `ca.key` for the Kubernetes certificate authority
    - `apiserver.crt`, `apiserver.key` for the API server certificate
    - `apiserver-kubelet-client.crt`, `apiserver-kubelet-client.key` for the client certificate used by the API server to connect to the kubelets securely
    - `sa.pub`, `sa.key` for the key used by the controller manager when signing ServiceAccount
    - `front-proxy-ca.crt`, `front-proxy-ca.key` for the front proxy certificate authority
    - `front-proxy-client.crt`, `front-proxy-client.key` for the front proxy client
-->
- 证书和密钥文件的名称：
    - `ca.crt`，`ca.key` 为 Kubernetes 证书颁发机构
    - `apiserver.crt`，`apiserver.key` 用于 API server 证书
    - `apiserver-kubelet-client.crt`，`apiserver-kubelet-client.key` 用于由 API server 安全地连接到 kubelet 的客户端证书
    - `sa.pub`，`sa.key` 用于签署 ServiceAccount 时控制器管理器使用的密钥
    - `front-proxy-ca.crt`，`front-proxy-ca.key` 用于前台代理证书颁发机构
    - `front-proxy-client.crt`，`front-proxy-client.key` 用于前端代理客户端

<!--
## kubeadm init workflow internal design
-->
## kubeadm init 工作流程内部设计

<!--
The `kubeadm init` [internal workflow](kubeadm-init.md/#init-workflow) consists of a sequence of atomic work tasks to perform, 
as described in `kubeadm init`.
-->
`kubeadm init` [内部工作流程](kubeadm-init.md/#init-workflow) 由一系列要执行的原子工作任务组成，如 `kubeadm init` 所述。

<!--
The [`kubeadm alpha phase`](kubeadm-alpha.md) command allows users to invoke individually each task, and ultimately offers a reusable and composable
API/toolbox that can be used by other Kubernetes bootstrap tools, by any IT automation tool or by advanced user 
for creating custom clusters.
-->
[`kubeadm alpha phase`](kubeadm-alpha.md) 命令允许用户单独调用每个任务，并最终提供可重用和可组合的 API/工具箱，可供其他 Kubernetes 引导工具、任何 IT 自动化工具或高级用户创建自定义集群使用。

<!--
### Preflight checks
-->
### 预检检查

<!--
Kubeadm executes a set of preflight checks before starting the init, with the aim to verify preconditions and avoid common cluster startup problems. 
In any case the user can skip specific preflight checks (or eventually all preflight checks) with the `--ignore-preflight-errors` option.
-->
Kubeadm 在启动 init 之前执行一组预检检查，目的是验证先决条件并避免常见的集群启动问题。在任何情况下，用户都可以使用 `--ignore-preflight-errors` 选项跳过特定的预检检查（或最终所有预检检查）。

<!--
- [warning] If the Kubernetes version to use (specified with the `--kubernetes-version` flag) is at least one minor version higher than the kubeadm CLI version
- Kubernetes system requirements:
  - if running on linux:
    - [error] if not Kernel 3.10+ or 4+ with specific KernelSpec
    - [error] if required cgroups subsystem aren't in set up
  - if using docker:
    - [warning/error] if Docker service does not  exists, if it is disabled, if it is not active.
    - [error] if Docker endpoint does not exists or does not work
    - [warning] if docker version >17.03
  - If using other cri engine:
    - [error] if crictl socket does not answer
- [error] if user is not root
- [error] if the machine hostname is not a valid DNS subdomain 
- [warning] if the host name cannot be reached via network lookup
- [error] if kubelet version is lower that the minimum kubelet version supported by kubeadm (current minor -1)
- [error] if kubelet version is at least one minor higher than the required controlplane version (unsupported version skew)
- [warning] if kubelet service does not exists or if it is disabled
- [warning] if firewalld is active
- [error] if API server bindPort or ports 10250/10251/10252 are used
- [Error] if `/etc/kubernetes/manifest` folder already exists and it is not empty
- [Error] if `/proc/sys/net/bridge/bridge-nf-call-iptables` file does not exists/does not contains 1
- [Error] if advertise address is ipv6 and `/proc/sys/net/bridge/bridge-nf-call-ip6tables` does not exists/does not contains 1.
- [Error] if swap is on
- [Error] if `ip`, `iptables`,  `mount`, `nsenter` commands are not present in the command path
- [warning] if `ebtables`, `ethtool`, `socat`, `tc`, `touch`, `crictl` commands are not present in the command path
- [warning] if extra arg flags for API server, controller manager,  scheduler contains some invalid options
- [warning] if connection to https://API.AdvertiseAddress:API.BindPort goes thought proxy
- [warning] if connection to services subnet goes thought proxy (only first address checked)
- [warning] if connection to Pods subnet goes thought proxy (only first address checked)  
- If external etcd is provided: 
  - [Error] if etcd version less than 3.0.14
  - [Error] if etcd certificates or keys are specified, but not provided 
- If external etcd is NOT provided (and thus local etcd will be installed): 
  - [Error] if ports 2379 is used
  - [Error] if Etcd.DataDir folder already exists and it is not empty
- If authorization mode is ABAC:
  - [Error] if abac_policy.json does not exists
- If authorization mode is WebHook
  - [Error] if webhook_authz.conf does not exists
-->
- [警告]如果要使用的 Kubernetes 版本（与 `--kubernetes-version` 标记一起指定）至少比 kubeadm CLI 版本高一个次要版本
- Kubernetes 系统要求：
  - 如果在 Linux 上运行：
    - [错误] 如果不是 Kernel 3.10+ 或具有特定 KernelSpec 的 4+
    - [错误] 如果需要的 cgroups 子系统没有设置
  - 如果使用 docker：
    - [警告/错误] 如果 Docker 服务不存在，如果它被禁用，如果它不是 active 状态
    - [错误] 如果 Docker 端点不存在或不起作用
    - [警告] 如果 docker 版本 > 17.03
  - 如果使用其他 cri 引擎：
    - [错误] 如果 crictl 没有响应
- [错误] 如果用户不是root用户
- [错误] 如果机器主机名不是有效的 DNS 子域
- [警告] 如果通过网络查找无法到达主机名
- [错误] 如果 kubelet 版本低于 kubeadm 支持的最小 kubelet 版本（当前小版本 -1）
- [错误] 如果 kubelet 版本至少比所需的控制平面版本更高一些（不受支持的版本）
- [警告] 如果 kubelet 服务不存在或禁用
- [警告] 如果 firewalld 处于活动状态
- [错误] 如果 API​​ server 的 bindPort 或者 port 10250/10251/10252 已经被使用
- [错误] 如果`/etc/kubernetes/manifest` 文件夹已经存在，并且非空
- [错误] 如果 `/proc/sys/net/bridge/bridge-nf-call-iptables` 文件不存在或者不包含 1
- [错误] 如果发布地址是 ipv6 并且 `/proc/sys/net/bridge/bridge-nf-call-ip6tables` 不存在或者不包含 1
- [错误] 如果 swap 打开
- [错误] 如果 `ip`、`iptables`、`mount` 或者 `nsenter` 命令没有出现在命令路径中
- [警告] 如果 `ebtables`、`ethtool`、`socat`、`tc`、`touch` 和 `crictl` 命令没有出现在命令路径中
- [警告] 如果 API server、Controller-manager、Scheduler 的额外参数中包含一些无效的选项
- [警告] 如果连接到 https://API.AdvertiseAddress:API.BindPort 需要通过代理
- [警告] 如果连接到服务子网需要通过代理（只检查第一个地址）
- [警告] 如果连接到 pod 子网需要通过代理（只检查第一个地址）
- 如果提供外部 etcd：
  - [错误] 如果 etcd 版本低于 3.0.14
  - [错误] 如果指定了 etcd 证书或密钥，但未提供
- 如果不提供外部 etcd（因此将安装本地 etcd）：
  - [错误] 如果使用端口 2379
  - [错误] 如果 Etcd.DataDir 文件夹已经存在并且不是空的
- 如果授权模式是 ABAC：
  - [错误] 如果 abac_policy.json 不存在
- 如果授权模式是 WebHook：
  - [错误] 如果 webhook_authz.conf 不存在

<!--
Please note that:

1. Preflight checks can be invoked individually with the [`kubeadm alpha phase preflight`](kubeadm-alpha.md/#cmd-phase-preflight) command
-->
请注意：

1. 预检检查可以通过 [`kubeadm alpha phase preflight`](kubeadm-alpha.md/#cmd-phase-preflight) 命令单独调用

<!--
### Generate the necessary certificates
-->
### 生成必要的证书

<!--
Kubeadm generates certificate and private key pairs for different purposes:
-->
Kubeadm 为不同目的生成证书和私钥对:

<!--
 - A self signed certificate authority for the Kubernetes cluster saved into `ca.crt` file and `ca.key` private key file
-->
 - Kubernetes 集群的自签名证书颁发机构保存到 `ca.crt` 文件和 `ca.key` 私钥文件中
<!--
 - A serving certificate for the API server, generated using `ca.crt` as the CA, and saved into `apiserver.crt` file with 
   its private key `apiserver.key`. This certificate should contains following alternative names:
     - The Kubernetes service's internal clusterIP (the first address in the services CIDR, e.g. `10.96.0.1` if service subnet is `10.96.0.0/12`)
     - Kubernetes DNS names, e.g.  `kubernetes.default.svc.cluster.local` if `--service-dns-domain` flag value is `cluster.local`, plus default DNS names `kubernetes.default.svc`, `kubernetes.default`, `kubernetes`
     - The node-name
     - The `--apiserver-advertise-address`
     - Additional alternative names specified by the user
-->
 - API server 的服务证书，使用 `ca.crt` 作为 CA 生成，并保存到 `apiserver.crt` 文件中，并带有其私钥 `apiserver.key`。此证书应包含以下其他名称：
     - Kubernetes 服务的内部 clusterIP（服务 CIDR 中的第一个地址，例如，如果服务子网是 `10.96.0.0/12` 则为 `10.96.0.1`）
     - Kubernetes DNS 名称，例如，如果 `--service-dns-domain` 标志的值为 `cluster.local`，则为 `kubernetes.default.svc.cluster.local`，再加上默认的 DNS 名称 `kubernetes.default.svc`、`kubernetes.default` 和 `kubernetes`
     - 节点名称
     - `--apiserver-advertise-address`
     - 由用户指定的其他替代名称
<!--
 - A client certificate for the API server to connect to the kubelets securely, generated using `ca.crt` as the CA and saved into
   `apiserver-kubelet-client.crt` file with its private key `apiserver-kubelet-client.key`. 
   This certificate should be in the `system:masters` organization
-->
 - 用于 API server 的安全连接到 kubelet 的客户端证书，使用 `ca.crt` 作为 CA 生成并使用私钥 `apiserver-kubelet-client.key` 保存到文件 `apiserver-kubelet-client.crt`  中。这个证书应该在 `system:masters` 组织中
<!--
 - A private key for signing ServiceAccount Tokens saved into `sa.key` file along with its public key `sa.pub`
 - A certificate authority for the front proxy saved into `front-proxy-ca.crt` file with its key `front-proxy-ca.key`
 - A client cert for the front proxy client, generate using `front-proxy-ca.crt` as the CA and saved into `front-proxy-client.crt` file 
   with its private key`front-proxy-client.key`
-->
 - 一个用于签名 ServiceAccount 令牌的私钥，该令牌与它的公钥 `sa.pub` 一起保存到 `sa.key` 文件中。
 - 前端代理的证书颁发机构保存到 `front-proxy-ca.crt` 文件中，其密钥为 `front-proxy-ca.key`
 - 前端代理客户端的客户证书，使用 `front-proxy-ca.crt` 作为 CA 生成，并使用其私钥 `front-proxy-client.key` 保存到 `front-proxy-client.crt` 文件中

<!--
Certificates are stored by default in `/etc/kubernetes/pki`, but this directory is configurable using the `--cert-dir` flag.
-->
证书默认存储在 `/etc/kubernetes/pki` 中，但该目录可使用 `--cert-dir`  标志进行配置。

<!--
 Please note that:
-->
请注意：

<!--
1. If a given certificate and private key pair both exist, and its content is evaluated compliant with the above specs, the existing files will 
   be used and the generation phase for the given certificate skipped. This means the user can, for example, copy an existing CA to
   `/etc/kubernetes/pki/ca.{crt,key}`, and then kubeadm will use those files for signing the rest of the certs. 
   See also [using custom certificates](kubeadm-init.md/#custom-certificates)
-->
1. 如果给定的证书和私钥对都存在，并且其内容评估符合上述规范，则将使用现有文件并跳过给定证书的生成阶段。这意味着用户可以将现有 CA 复制到 `/etc/kubernetes/pki/ca.{crt,key}`，然后 kubeadm 将使用这些文件来签署剩余的证书。请参与 [使用自定义证书](kubeadm-init.md/#custom-certificates)
<!--
2. Only for the CA, it is possible to provide the `ca.crt` file but not the `ca.key` file, if all other certificates and kubeconfig files 
   already are in place kubeadm recognize this condition and activates the ExternalCA , which also implies the `csrsigner`controller in
   controller-manager won't be started
-->
2. 只有 CA 可以提供 `ca.crt` 文件，但不提供 `ca.key` 文件，如果所有其他证书和 kubeconfig 文件已就位，kubeadm 会识别此情况并激活 ExternalCA，这也意味着 controller-manager 中的 `csrsigner` 控制器将不会启动
<!--
3. If kubeadm is running in [ExternalCA mode](kubeadm-init.md/#external-ca-mode); all the certificates must be provided by the user, 
   because kubeadm cannot generate them by itself
-->
3. 如果 kubeadm 在 ExternalCA 模式下运行; 所有的证书都必须由用户提供，因为 kubeadm 本身不能生成它们
<!--
4. In case of kubeadm is executed in the `--dry-run` mode, certificates files are written in a temporary folder
-->
4. 在 `--dry-run` 模式中执行 kubeadm 的情况下，证书文件被写入临时文件夹中
<!--
5. Certificate generation can be invoked individually with the [`kubeadm alpha phase certs all`](kubeadm-alpha.md/#cmd-phase-certs) command
-->
5. 使用 [`kubeadm alpha phase certs all`](kubeadm-alpha.md/#cmd-phase-certs) 命令可以单独调用证书生成动作

<!--
### Generate kubeconfig files for control plane components
-->
### 为控制平面组件生成 kubeconfig 文件

<!--
Kubeadm kubeconfig files with identities for control plane components:
-->
具有控制平面组件标识的 Kubeadm kubeconfig 文件：

<!--
- A kubeconfig file for kubelet to use, `/etc/kubernetes/kubelet.conf`; inside this file is embedded a client certificate with kubelet identity.
  This client cert should:
    - Be in the `system:nodes` organization, as required by the [Node Authorization](/docs/admin/authorization/node/) module
    - Have the CN `system:node:<hostname-lowercased>`
-->
- kubelet 使用的 kubeconfig 文件：`/etc/kubernetes/kubelet.conf`; 在这个文件内嵌入一个具有 kubelet 身份的客户端证书。这个客户证书应该：
    - 在 `system:nodes` 组织中，符合 [节点授权](/docs/admin/authorization/node/) 模块的要求
    - 有 CN `system:node:<hostname-lowercased>`
<!--
- A kubeconfig file for controller-manager, `/etc/kubernetes/controller-manager.conf`; inside this file is embedded a client 
  certificate with controller-manager identity. This client cert should have the CN `system:kube-controller-manager`, as defined
by default [RBAC core components roles](/docs/admin/authorization/rbac/#core-component-roles)
-->
- controller-manager 使用的 kubeconfig 文件：`/etc/kubernetes/controller-manager.conf`; 在这个文件内嵌入一个带有 controller-manager 身份的客户端证书。此客户端证书应具有 CN `system:kube-controller-manager`，默认由 [RBAC 核心组件角色](/docs/admin/authorization/rbac/#core-component-roles) 定义
<!--
- A kubeconfig file for scheduler, `/etc/kubernetes/scheduler.conf`; inside this file is embedded a client certificate with scheduler identity.
  This client cert should have the CN `system:kube-scheduler`, as defined by default [RBAC core components roles](/docs/admin/authorization/rbac/#core-component-roles)
-->
- scheduler 使用的 kubeconfig 文件：`/etc/kubernetes/scheduler.conf`; 在这个文件内嵌入一个带有 scheduler 标识的客户端证书。此客户端证书应具有 CN `system:kube-scheduler`，默认由 [RBAC 核心组件角色](/docs/admin/authorization/rbac/#core-component-roles) 定义

<!--
Additionally, a kubeconfig file for kubeadm to use itself and the admin is generated and save into the `/etc/kubernetes/admin.conf` file.
The "admin" here is defined the actual person(s) that is administering the cluster and want to have full control (**root**) over the cluster.
The embedded client certificate for admin should:
-->
此外，生成一个 kubeadm 去使用它自己以及管理员使用的 kubeconfig 文件，并保存到 `/etc/kubernetes/admin.conf` 文件中。这里的 “管理员” 定义了正在管理集群并希望完全控制（**root**）集群的实际人员。管理员的嵌入式客户端证书应该：
<!--
- Be in the `system:masters` organization, as defined by default [RBAC user facing role bindings](/docs/admin/authorization/rbac/#user-facing-roles)
- Include a CN, but that can be anything. Kubeadm uses the `kubernetes-admin` CN
-->
- 在 `system:masters` 组织中，默认由 [RBAC 用户所面对的角色绑定](/docs/admin/authorization/rbac/#user-facing-roles) 定义
- 包括一个 CN，但可以是任何东西。Kubeadm 使用 `kubernetes-admin` CN

<!--
Please note that:

1. `ca.crt` certificate is embedded in all the kubeconfig files.
2. If a given kubeconfig file exists, and its content is evaluated compliant with the above specs, the existing file will be used and the generation phase for the given kubeconfig skipped
3. If kubeadm is running in [ExternalCA mode](kubeadm-init.md/#external-ca-mode), all the required kubeconfig must be provided by the user as well, because kubeadm cannot generate any of them by itself
4. In case of kubeadm is executed in the `--dry-run` mode, kubeconfig files are written in a temporary folder
5. Kubeconfig files generation can be invoked individually with the [`kubeadm alpha phase kubeconfig all`](kubeadm-alpha.md/#cmd-phase-kubeconfig) command
-->
请注意：

1. `ca.crt` 证书嵌入在所有 kubeconfig 文件中。
2. 如果给定的 kubeconfig 文件存在，并且其内容的评估符合上述规范，则将使用现有文件，并跳过给定 kubeconfig 的生成阶段
3. 如果 kubeadm 以 ExternalCA 模式运行，则所有必需的 kubeconfig 也必须由用户提供，因为 kubeadm 本身不能生成它们中的任何一个
4. 如果在 `--dry-run` 模式下执行 kubeadm ，kubeconfig 文件将写入临时文件夹中
5. 使用 [`kubeadm alpha phase kubeconfig all`](kubeadm-alpha.md/#cmd-phase-kubeconfig) 命令可以单独调用 Kubeconfig 文件生成动作

<!--
### Generate static Pod manifests for control plane components
-->
### 为控制平面组件生成静态 Pod 清单

<!--
Kubeadm writes static Pod manifest files for control plane components to `/etc/kubernetes/manifests`; the kubelet watches this directory for Pods to create on startup.
-->
kubeadm 将控制平面组件的静态 Pod 清单文件写入 `/etc/kubernetes/manifests`; Kubelet 会监控这个目录，在启动时创建 pod。

<!--
Static Pod manifest share a set of common properties:
-->
静态 Pod 清单共享一组通用属性：

<!--
- All static Pods are deployed on `kube-system` namespace
- All static Pods gets `tier:control-plane` and `component:{component-name}` labels
- All static Pods gets `scheduler.alpha.kubernetes.io/critical-pod` annotation (this will be moved over to the proper solution 
  of using Pod Priority and Preemption when ready)
-->
- 所有静态 Pod 都部署在 `kube-system` 命名空间上
- 所有静态 Pod 都可以获取 `tier:control-plane` 和 `component:{component-name}` 标记
- 所有的静态 Pod 都会获得 `scheduler.alpha.kubernetes.io/critical-pod` 注解（这将转移到适当的解决方案，即在准备就绪时使用 pod 优先级和抢占）
<!--
- `hostNetwork: true` is set on all static Pods to allow control plane startup before a network is configured; as a consequence: 
  * The `address` that the controller-manager and the scheduler use to refer the API server is `127.0.0.1`
  * If using a local etcd server, `etcd-servers` address  will be set to `127.0.0.1:2379`
-->
- 在所有静态 Pod 上设置 `hostNetwork: true`，以便在网络配置之前允许控制平面启动; 因此：
  * controller-manager 和 scheduler 使用来指代该 API server 的地址为 `127.0.0.1`
  * 如果使用本地 etcd 服务器，`etcd-servers` 地址将被设置为 `127.0.0.1:2379`
<!--
- Leader election is enabled for both the controller-manager and the scheduler
- Controller-manager and the scheduler will reference kubeconfig files with their respective, unique identities
- All static Pods gets any extra flags specified by the user as described in [passing custom arguments to control plane components](kubeadm-init.md/#custom-args)
- All static Pods gets any extra Volumes specified by the user (Host path)
-->
- controller-manager 和 scheduler 均启用选举
- controller-manager 和 scheduler 将引用 kubeconfig 文件及其各自的唯一标识
- 所有静态 Pod 都会获得用户指定的额外标志，如 [将自定义参数传递给控制平面组件](kubeadm-init.md/#custom-args) 所述
- 所有静态 Pod 都会获取用户指定的任何额外卷（主机路径）

<!--
Please note that:

1. All the images, for the  `--kubernetes-version`/current architecture, will be pulled from `gcr.io/google_containers`; 
   In case an alternative image repository or CI image repository is specified this one will be used; In case a specific container image 
   should be used for all control plane components, this one will be used. see [using custom images](kubeadm-init.md/#custom-images) 
   for more details
2. In case of kubeadm is executed in the `--dry-run` mode, static Pods files are written in a temporary folder
3. Static Pod manifest generation for master components can be invoked individually with the [`kubeadm alpha phase controlplane all`](kubeadm-alpha.md/#cmd-phase-controlplane) command
-->
请注意：

1. `--kubernetes-version` 当前体系结构中的所有镜像 将从中 `gcr.io/google_containers` 中拉取; 如果指定了其他镜像仓库库或 CI 镜像仓库，则将使用此仓库; 如果一个特定的容器镜像应该被用于所有控制平面组件，那么这个特定镜像将被使用。请参阅 [使用自定义镜像](kubeadm-init.md/#custom-images) 了解更多详情
2. 如果在 `--dry-run` 模式下执行 kubeadm，则将静态 Pod 文件写入临时文件夹
3. 可以使用 [`kubeadm alpha phase controlplane all`](kubeadm-alpha.md/#cmd-phase-controlplane) 命令单独调用生成主组件的静态 Pod 清单

#### API server

<!--
The static Pod manifest for the API server is affected by following parameters provided by the users:
-->
API server 的静态 Pod 清单受用户提供的以下参数的影响：

<!--
 - The `apiserver-advertise-address` and `apiserver-bind-port` to bind to; if not provided, those value defaults to the IP address of 
   the default network interface on the machine and port 6443
 - The `service-cluster-ip-range` to use for services
 - If an external etcd server is specified, the `etcd-servers` address and related TLS settings (`etcd-cafile`, `etcd-certfile`, `etcd-keyfile`);
   if an external etcd server is not be provided, a local etcd will be used (via host network)
-->
 - 需要指定要绑定到的 `apiserver-advertise-address` 和 `apiserver-bind-port`；如果没有提供，这些值分别默认为机器上默认网络接口的 IP 地址和端口 6443
 - `service-cluster-ip-range` 用于服务
 - 如果指定了外部 etcd 服务器，则要设定 `etcd-servers` 地址和相关的 TLS 设置（`etcd-cafile`、`etcd-certfile`、`etcd-keyfile`）; 如果不提供外部 etcd 服务器，则会使用本地 etcd（通过主机网络）
<!--
 - If a cloud provider is specified, the corresponding `--cloud-provider` is configured, together with  the  `--cloud-config` path
   if such file exists (this is experimental, alpha and will be removed in a future version)
 - If kubeadm is invoked with `--feature-gates=HighAvailability`, the flag `--endpoint-reconciler-type=lease` is set, thus enabling
   automatic reconciliation of endpoints for the internal API server VIP
 - If kubeadm is invoked with `--feature-gates=DynamicKubeletConfig`,  the corresponding feature on API server is activated
   with the `--feature-gates=DynamicKubeletConfig=true` flag
-->
 - 如果指定了云提供商，则要配置相应的 `--cloud-provider`，如果这样的文件存在，还要配置 `--cloud-config` 路径（这是实验性的、alpha 功能，将在未来的版本中删除）
 - 如果 kubeadm 被调用为 `--feature-gates=HighAvailability`，则标志 `--endpoint-reconciler-type=lease` 被设置，从而启用内部 API server VIP 的 endpoints 的自动协调
 - 如果 kubeadm 被调用为 `--feature-gates=DynamicKubeletConfig`，则 API 服务器上的相应功能将通过 `--feature-gates=DynamicKubeletConfig=true` 标志激活

<!--
Other API server flags that are set unconditionally are:
-->
其他无条件设置的 API server 标志是：

<!--
 - `--insecure-port=0` to avoid insecure connections to the api server
 - `--enable-bootstrap-token-auth=true` to enable the `BootstrapTokenAuthenticator` authentication module. see [TLS Bootstrapping](/docs/admin/kubelet-tls-bootstrapping.md) for more details
 - `--allow-privileged` to `true` (required e.g. by kube proxy)
 - `--requestheader-client-ca-file` to `front-proxy-ca.crt`
-->
 - `--insecure-port=0` 避免与 api server 的不安全连接
 - `--enable-bootstrap-token-auth=true` 启用 `BootstrapTokenAuthenticator` 验证模块。有关更多详细信息，请参阅 [TLS 引导](/docs/admin/kubelet-tls-bootstrapping.md)
 - `--allow-privileged` 为 `true` （如 kube proxy 所要求的）
 - `--requestheader-client-ca-file` 为 `front-proxy-ca.crt`
<!--
 - `--admission-control` to:
    - [`Initializers`](/docs/admin/admission-controllers/#initializers-alpha) to enable [Dynamic Admission Control](/docs/admin/extensible-admission-controllers/).
    - [`NamespaceLifecycle`](/docs/admin/admission-controllers/#namespacelifecycle) e.g. to avoid deletion of 
      system reserved namespaces
    - [`LimitRanger`](/docs/admin/admission-controllers/#limitranger) and [`ResourceQuota`](/docs/admin/admission-controllers/#resourcequota) to enforce limits on namespaces
    - [`ServiceAccount`](/docs/admin/admission-controllers/#serviceaccount) to enforce service account automation
    - [`PersistentVolumeLabel`](/docs/admin/admission-controllers/#persistentvolumelabel) attaches region or zone labels to
      PersistentVolumes as defined by the cloud provider (This admission controller is deprecated and will be removed in a future version. 
      It is not deployed by kubeadm by default with v1.9 onwards when not explicitly opting into using `gce` or `aws` as cloud providers)
    - [`DefaultStorageClass`](/docs/admin/admission-controllers/#defaultstorageclass) to enforce default storage class on `PersistentVolumeClaim` objects
    - [`DefaultTolerationSeconds`](/docs/admin/admission-controllers/#defaulttolerationseconds) 
    - [`NodeRestriction`](/docs/admin/admission-controllers/#noderestriction) to limit what a kubelet can modify 
      (e.g. only pods on this node)
-->
 - `--admission-control` 为：
    - [`Initializers`](/docs/admin/admission-controllers/#initializers-alpha) 启用 [动态准入控制](/docs/admin/extensible-admission-controllers/)
    - [`NamespaceLifecycle`](/docs/admin/admission-controllers/#namespacelifecycle) 例如避免删除系统保留的命名空间
    - [`LimitRanger`](/docs/admin/admission-controllers/#limitranger) 和 [`ResourceQuota`](/docs/admin/admission-controllers/#resourcequota) 强制限制命名空间
    - [`ServiceAccount`](/docs/admin/admission-controllers/#serviceaccount) 强制执行服务帐户自动化
    - [`PersistentVolumeLabel`](/docs/admin/admission-controllers/#persistentvolumelabel) 将区域或区域标签附加到由云提供商定义的 PersistentVolumes （此准入控制器已被弃用，并将在未来的版本中被删除。没有明确选择使用 `gce` 或 `aws` 作为云提供商时，它在默认情况下跟 1.9 版本一样，并不是由 kubeadm 部署）
    - [`DefaultStorageClass`](/docs/admin/admission-controllers/#defaultstorageclass) 在 `PersistentVolumeClaim` 对象上强制执行默认存储类
    - [`DefaultTolerationSeconds`](/docs/admin/admission-controllers/#defaulttolerationseconds) 
    - [`NodeRestriction`](/docs/admin/admission-controllers/#noderestriction) 限制 kubelet 可以修改的内容（例如，只有该节点上的 pod）
<!--
 - `--kubelet-preferred-address-types` to `InternalIP,ExternalIP,Hostname;` this makes `kubectl logs` and other API server-kubelet 
   communication work in environments where the hostnames of the nodes aren't resolvable
-->
 - `--kubelet-preferred-address-types` 为 `InternalIP,ExternalIP,Hostname;`，这使得 `kubectl logs` 和其他 api server-kubelet 通信能够在节点主机名不可解析的环境中工作。
<!--
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
-->
 - 使用先前步骤中生成的证书的标志：
     - `--client-ca-file` 为 `ca.crt`
    - `--tls-cert-file` 为 `apiserver.crt`
    - `--tls-private-key-file` 为 `apiserver.key`
    - `--kubelet-client-certificate` 为 `apiserver-kubelet-client.crt`
    - `--kubelet-client-key` 为 `apiserver-kubelet-client.key`
    - `--service-account-key-file` 为 `sa.pub`
    - `--requestheader-client-ca-file`为`front-proxy-ca.crt`
    - `--proxy-client-cert-file` 为 `front-proxy-client.crt`
    - `--proxy-client-key-file` 为 `front-proxy-client.key` 
<!--
 - Other flags for securing the front proxy ([API Aggregation](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/aggregated-api-servers.md)) communications:
-->
 - 用于保护前端代理（[API Aggregation](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/aggregated-api-servers.md)）通信的其他标志：
    - `--requestheader-username-headers=X-Remote-User`
    - `--requestheader-group-headers=X-Remote-Group`
    - `--requestheader-extra-headers-prefix=X-Remote-Extra-`
    - `--requestheader-allowed-names=front-proxy-client`

#### Controller manager

<!--
The static Pod manifest for the API server is affected by following parameters provided by the users:
-->
API server 的静态 Pod 清单受用户提供的以下参数的影响：

<!--
- If kubeadm is invoked specifying a `--pod-network-cidr`, the subnet manager feature required for some CNI network plugins is enabled by 
   setting:
   - `--allocate-node-cidrs=true`
   - `--cluster-cidr` and `--node-cidr-mask-size` flags according to the given CIDR
 - If a cloud provider is specified, the corresponding `--cloud-provider` is specified, together with  the  `--cloud-config` path 
   if such configuration file exists (this is experimental, alpha and will be removed in a future version)
-->
- 如果调用 kubeadm 时指定一个 `--pod-network-cidr`，某些 CNI 网络插件所需的子网管理器功能可以通过设置来启用：
   - `--allocate-node-cidrs=true`
   - `--cluster-cidr` 和 `--node-cidr-mask-size` 根据给定的 CIDR 标志
- 如果指定了云提供商，则要配置相应的 `--cloud-provider`，如果这样的文件存在，还要配置 `--cloud-config` 路径（这是实验性的、alpha 功能，将在未来的版本中删除）

<!--
Other flags that are set unconditionally are:

 - `--controllers` enabling all the default controllers plus `BootstrapSigner` and `TokenCleaner` controllers for TLS bootstrap. 
    see [TLS Bootstrapping](/docs/admin/kubelet-tls-bootstrapping.md) for more details
 - `--use-service-account-credentials` to `true`
 - Flags for using certificates generated in previous steps:
    - `--root-ca-file` to `ca.crt`
    - `--cluster-signing-cert-file` to `ca.crt`, if External CA mode is disabled, otherwise to `""`
    - `--cluster-signing-key-file` to `ca.key`, if External CA mode is disabled, otherwise to `""`
    - `--service-account-private-key-file` to `sa.key`
-->
其他无条件设置的标志是：

 - `--controllers` 为 TLS 引导启用所有默认控制器加上 `BootstrapSigner` 和 `TokenCleaner` 控制器。有关更多详细信息，请参阅 [TLS 引导](/docs/admin/kubelet-tls-bootstrapping.md)
 - `--use-service-account-credentials`为 `true`
 - 使用先前步骤中生成的证书的标志：
    - `--root-ca-file` 为 `ca.crt`
    - `--cluster-signing-cert-file` 为 `ca.crt`，如果外部 CA 模式被禁用，则返回 `""`
    - `--cluster-signing-key-file` 为 `ca.key`，如果外部 CA 模式被禁用，则返回 `""`
    - `--service-account-private-key-file` 为 `sa.key`
 
#### Scheduler

<!--
The static Pod manifest for the scheduler is not affected by parameters provided by the users.
-->
Scheduler 的静态 Pod 清单不受用户提供的参数的影响。

<!--
### Generate static Pod manifest for local etcd
-->
### 为本地 etcd 生成静态 Pod 清单

<!--
If the user specified an external etcd this step will be skipped, otherwise kubeadm generates a static Pod manifest file for creating 
a local etcd instance running in a Pod with following attributes:

- listen on `localhost:2379` and use `HostNetwork=true`
- make a `hostPath` mount out from the `dataDir` to the host's filesystem
- Any extra flags specified by the user
-->
如果用户指定了外部 etcd，则此步骤将被跳过，否则 kubeadm 将生成一个静态的 Pod 清单文件，用于创建在 Pod 中运行的本地 etcd 实例，其中包含以下属性：

- 监听 `localhost:2379` 并使用 `HostNetwork=true`
- 做一个 `hostPath`，从 `dataDir` 挂载到 主机文件系统
- 任何由用户指定的额外标志

<!--
Please note that:

1. The etcd image will be pulled from `gcr.io/google_containers`. In case an alternative image repository is specified this one will be used; 
   In case an alternative image name is specified, this one will be used. see [using custom images](kubeadm-init.md/#custom-images) for more details
2. in case of kubeadm is executed in the `--dry-run` mode, the etcd static Pod manifest is written in a temporary folder
3. Static Pod manifest generation for local etcd can be invoked individually with the [`kubeadm alpha phase etcd local`](kubeadm-alpha.md/#cmd-phase-etcd) command
-->
请注意：

1. etcd 镜像将从中 `gcr.io/google_containers` 中拉取; 如果指定了其他镜像仓库库，则将使用此仓库; 如果一个特定的容器镜像应该被用于所有控制平面组件，那么这个特定镜像将被使用。请参阅 [使用自定义镜像](kubeadm-init.md/#custom-images) 了解更多详情
2. 如果在 `--dry-run` 模式下执行 kubeadm，则将静态 Pod 文件写入临时文件夹
3. 可以使用 [`kubeadm alpha phase etcd local`](kubeadm-alpha.md/#cmd-phase-etcd) 命令为本地 etcd 生成的静态 Pod 清单

<!--
### (optional and alpha in v1.9) Write init kubelet configuration
-->
### （可选，1.9 版本中为 alpha）编写 init kubelet 配置

<!--
If kubeadm is invoked with `--feature-gates=DynamicKubeletConfig`, it writes the kubelet init configuration 
into `/var/lib/kubelet/config/init/kubelet` file.
-->
如果 kubeadm 被调用为 `--feature-gates=DynamicKubeletConfig`，它会将 kubelet init 配置写入 `/var/lib/kubelet/config/init/kubelet` 文件。

<!--
The init configuration is used for starting the kubelet on this specific node, providing an alternative for the kubelet drop-in file; 
such configuration will be replaced by the kubelet base configuration as described in following steps. 
See [set Kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file.md) for additional info.
-->
init 配置用于在此特定节点上启动 kubelet，为 kubelet 插入文件提供替代方案; 这种配置将被以下步骤中所述的 Kubelet 基本配置替代。请参阅 [通过配置文件设置 Kubelet 参数](/docs/tasks/administer-cluster/kubelet-config-file.md) 以获取更多信息。

<!--
Please note that:

1. To make dynamic kubelet configuration work, flag `--dynamic-config-dir=/var/lib/kubelet/config/dynamic` should be specified 
   in `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`
1. Kubelet init configuration can be changed by using kubeadm MasterConfiguration file by setting `.kubeletConfiguration.baseConfig`.
   See [using kubeadm init with a configuration file](kubeadm-init.md/#config-file) for more detail
-->
请注意：

1. 要使动态 kubelet 配置正常工作，应该在 `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` 中指定标志 `--dynamic-config-dir=/var/lib/kubelet/config/dynamic`
1. 通过设置`.kubeletConfiguration.baseConfig`，Kubelet init 配置可以通过使用 kubeadm MasterConfiguration 文件进行修改。请参阅 [在配置文件中使用 kubelet init](kubeadm-init.md/#config-file) 以获取更多信息。

<!--
### Wait for the control plane to come up
-->
### 等待控制平面启动

<!--
This is a critical moment in time for kubeadm clusters.
kubeadm waits until `localhost:6443/healthz` returns `ok`, however in order to detect deadlock conditions, kubeadm fails fast 
if `localhost:10255/healthz` (kubelet liveness) or `localhost:10255/healthz/syncloop` (kubelet readiness) don't return `ok`, 
respectively after 40 and 60 second.
-->
这是 kubeadm 集群的关键时刻。kubeadm 等待 `localhost:6443/healthz` 返回 `ok`，但是为了检测死锁情况，如果`localhost:10255/healthz`（kubelet liveness）或 `localhost:10255/healthz/syncloop`（kubelet readiness）分别在 40 秒和 60 秒后不返回 `ok`，kubeadm 就会快速失败。

<!--
kubeadm relies on the kubelet to pull the control plane images and run them properly as static Pods.
After the control plane is up, kubeadm completes a the tasks described in following paragraphs.
-->
kubeadm 依靠 kubelet 来拉取控制平面镜像，并以静态 Pod 的形式正确运行它们。控制平面启动后，kubeadm 完成以下段落中描述的任务。

<!--
### (optional and alpha in v1.9) Write base kubelet configuration
-->
### （可选，1.9 版本中为 alpha）编写基本 kubelet 配置

<!--
If kubeadm is invoked with `--feature-gates=DynamicKubeletConfig`: 

1. Write the kubelet base configuration into the `kubelet-base-config-v1.9` ConfigMap in the `kube-system` namespace
2. Creates RBAC rules for granting read access to that ConfigMap to all bootstrap tokens and all kubelet instances 
   (that is `system:bootstrappers:kubeadm:default-node-token` and `system:nodes` groups)
3. Enable the dynamic kubelet configuration feature for the initial master node by pointing `Node.spec.configSource` to the newly-created ConfigMap
-->
如果 kubeadm 被调用为 `--feature-gates=DynamicKubeletConfig`：

1. 将 kubelet 基本配置写入命名空间 `kube-system` 的 `kubelet-base-config-v1.9` ConfigMap 中
2. 创建 RBAC 规则来授予该 ConfigMap 对所有引导令牌和所有 kubelet 实例（即组 `system:bootstrappers:kubeadm:default-node-token` 和 `system:nodes`）的读访问权限
3. 通过将 `Node.spec.configSource` 指向新创建的 ConfigMap 来为初始主节点启用动态 kubelet 配置功能

<!--
### Save kubeadm MasterConfiguration in a ConfigMap for later reference
-->
### 将 kubeadm MasterConfiguration 保存在 ConfigMap 中供以后参考

<!--
kubeadm saves the configuration passed to `kubeadm init`, either via flags or the config file, in a ConfigMap 
named `kubeadm-config` under `kube-system` namespace.
-->
kubeadm 将 `kubeadm init` 通过标志或配置文件传递给 ConfigMap 的配置保存在 `kube-system` 命名空间下的 `kubeadm-config` ConfigMap 中。

<!--
This will ensure that kubeadm actions executed in future (e.g `kubeadm upgrade`) will be able to determine the actual/current cluster
state and make new decisions based on that data.
-->
这将确保将来（例如 `kubeadm upgrade`）执行的 kubeadm 行动将能够确定 实际/当前 的集群状态并基于该数据做出新的决定。

<!--
Please note that:

1. Before uploading, sensitive information like e.g. the token are stripped from the configuration 
2. Upload of master configuration can be invoked individually with the [`kubeadm alpha phase upload-config`](kubeadm-alpha.md/#cmd-phase-upload-config) command
3. If you initialized your cluster using kubeadm v1.7.x or lower, you must create manually the master configuration ConfigMap 
   before `kubeadm upgrade` to v1.8 . In order to facilitate this task, the [`kubeadm config upload (from-flags|from-file)`](kubeadm-config.md) 
   was implemented
-->
请注意：

1. 在上传之前，敏感信息（例如令牌）会从配置中删除
2. 主配置的上传可以通过 [`kubeadm alpha phase upload-config`](kubeadm-alpha.md/#cmd-phase-upload-config) 命令单独调用
3. 如果您使用 kubeadm v1.7.x 或更低版本初始化集群，则必须在使用 `kubeadm upgrade` 到 v1.8 之前手动创建 master 的配置 ConfigMap 。为了促进这项任务，[`kubeadm config upload (from-flags|from-file)`](kubeadm-config.md)  已经实施

<!--
### Mark master
-->
### 标记 master

<!--
As soon as the control plane is available, kubeadm executes following actions: 

- Label the master with `node-role.kubernetes.io/master=""` 
- Taints the master with `node-role.kubernetes.io/master:NoSchedule`
-->
一旦控制平面可用，kubeadm 将执行以下操作：

- 用 `node-role.kubernetes.io/master=""` 给 master 增加标签
- 用 `node-role.kubernetes.io/master:NoSchedule` 给 master 增加污点

<!--
Please note that:

1. Mark master phase can be invoked individually with the [`kubeadm alpha phase mark-master`](kubeadm-alpha.md/#cmd-phase-mark-master) command
-->
请注意：

1. 标记 master 阶段可以通过 [`kubeadm alpha phase mark-master`](kubeadm-alpha.md/#cmd-phase-mark-master) 命令单独调用

<!--
### Configure TLS-Bootstrapping for node joining
-->
### 配置 TLS-引导 以加入节点

<!--
Kubeadm uses [Authenticating with Bootstrap Tokens](/docs/admin/bootstrap-tokens/) for joining new nodes to an
existing cluster; for more details see also [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/cluster-lifecycle/bootstrap-discovery.md).
-->
Kubeadm 使用 [引导令牌进行身份验证](/docs/admin/bootstrap-tokens/) 将新节点连接到现有集群; 欲了解更多详情，请参阅 [设计方案](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/cluster-lifecycle/bootstrap-discovery.md)。

<!--
`kubeadm init` ensures that everything is properly configured for this process, and this includes following steps as well as 
setting API server and controller flags as already described in previous paragraphs.
-->
`kubeadm init` 确保为此过程正确配置所有内容，这包括以下步骤以及设置 API server 和控制器标志，如前面几个段落中所述。
<!--
Please note that:

1. TLS bootstrapping for nodes can be configured with the [`kubeadm alpha phase bootstrap-token all`](kubeadm-alpha.md/#cmd-phase-bootstrap-token)  
   command, executing all the configuration steps described in following paragraphs; alternatively, each step can be invoked individually
-->
请注意：

1. 可以使用 [`kubeadm alpha phase bootstrap-token all`](kubeadm-alpha.md/#cmd-phase-bootstrap-token)  命令配置节点的 TLS 引导，执行以下段落中描述的所有配置步骤; 或者，每个步骤都可以单独调用

<!--
#### Create a bootstrap token
-->
#### 创建一个引导令牌

<!--
`kubeadm init` create a first bootstrap token, either generated automatically or provided by the user with the `--token` flag; as documented 
in bootstrap token specification, token should be saved as secrets with name `bootstrap-token-<token-id>` under `kube-system` namespace.
-->
`kubeadm init` 创建第一个引导令牌，可以自动生成或由用户使用 `--token` 标志提供; 在引导令牌规范中，令牌应该保存为命名空间 `kube-system` 下的 `bootstrap-token-<token-id>` secret 中。
<!--
Please note that:

1. The default token created by `kubeadm init` will be used to validate temporary user during TLS bootstrap process; those users will 
   be member of  `system:bootstrappers:kubeadm:default-node-token` group
2. The token has a limited validity, default 24 hours (the interval may be changed with the `—token-ttl` flag)
3. Additional tokens can be created with the [`kubeadm token`](kubeadm-token.md) command, that provide as well other useful functions 
   for token management
-->
请注意：

1. 通过 `kubeadm init` 创建的默认令牌将用于 TLS 在引导过程中验证临时用户；这些用户将成为 `system:bootstrappers:kubeadm:default-node-token` 组的成员
2. 令牌的有效期有限，默认 24 小时（间隔可以使用 `—token-ttl` 标志变更）
3. 额外的令牌可以使用 [`kubeadm token`](kubeadm-token.md) 命令创建，它还可以为令牌管理提供其他有用的功能

<!--
#### Allow joining nodes to call CSR API
-->
#### 允许加入节点来调用 CSR API

<!--
Kubeadm ensure that users in  `system:bootstrappers:kubeadm:default-node-token` group are able to access the certificate signing API.
-->
Kubeadm 确保 `system:bootstrappers:kubeadm:default-node-token` 组中的用户能够访问证书签名 API。

<!--
This is implemented by creating a ClusterRoleBinding named `kubeadm:kubelet-bootstrap` between the group above and the default 
RBAC role `system:node-bootstrapper`.
-->
这是通过在上面的组和默认的 RBAC 角色 `system:node-bootstrapper` 之间创建一个名为 `kubeadm:kubelet-bootstrap` 的 ClusterRoleBinding 来实现的。

<!--
#### Setup auto approval for new bootstrap tokens
-->
#### 为新的引导令牌设置自动批准

<!--
Kubeadm ensures that the Boostrap Token will get its CSR request automatically approved by the csrapprover controller.
-->
Kubeadm 确保引导令牌将获得 csrapprover 控制器自动批准的 CSR 请求。

<!--
This is implemented by creating ClusterRoleBinding named `kubeadm:node-autoapprove-bootstrap` between 
the  `system:bootstrappers:kubeadm:default-node-token` group and the default role `system:certificates.k8s.io:certificatesigningrequests:nodeclient`.
-->
这是通过 `system:bootstrappers:kubeadm:default-node-token` 组和默认的角色 `system:certificates.k8s.io:certificatesigningrequests:nodeclient` 之间创建一个名为 `kubeadm:node-autoapprove-bootstrap` 的 ClusterRoleBinding 来实现的。

<!--
The role `system:certificates.k8s.io:certificatesigningrequests:nodeclient` should be created as well, granting 
POST permission to `/apis/certificates.k8s.io/certificatesigningrequests/nodeclient`.
-->
角色 `system:certificates.k8s.io:certificatesigningrequests:nodeclient` 也应该创建，并授予访问 `/apis/certificates.k8s.io/certificatesigningrequests/nodeclient` 的 POST 权限。

<!--
#### Setup nodes certificate rotation with auto approval
-->
#### 通过自动批准设置节点证书轮换

<!--
Kubeadm ensures that certificate rotation is enabled for nodes, and that new certificate request for nodes will get its CSR request 
automatically approved by the csrapprover controller.
-->
Kubeadm 确保为节点启用证书轮换，并且节点的新证书请求将获得由 csrapprover 控制器自动批准的 CSR 请求。

<!--
This is implemented by creating ClusterRoleBinding named `kubeadm:node-autoapprove-certificate-rotation` between the  `system:nodes` group 
and the default role `system:certificates.k8s.io:certificatesigningrequests:selfnodeclient`.
-->
这是通过 `system:nodes` 组和默认的角色 `system:certificates.k8s.io:certificatesigningrequests:selfnodeclient` 之间创建一个名为 `kubeadm:node-autoapprove-certificate-rotation` 的 ClusterRoleBinding 来实现的。

<!--
#### Create the public cluster-info ConfigMap
-->
#### 创建公共集群信息 ConfigMap

<!--
This phase creates the `cluster-info` ConfigMap in the `kube-public` namespace.
-->
此阶段在 `kube-public` 命名空间中创建 `cluster-info` ConfigMap。

<!--
Additionally it is created a role and a RoleBinding granting access to the ConfigMap for unauthenticated users 
(i.e. users in RBAC group `system:unauthenticated`)
-->
此外，还创建了一个角色和一个 RoleBinding，为未经身份验证的用户授予对 ConfigMap 的访问权（即 RBAC 组中的用户 `system:unauthenticated`）

<!--
Please note that:

1. The access to the `cluster-info` ConfigMap _is not_ rate-limited. This may or may not be a problem if you expose your master 
to the internet; worst-case scenario here is a DoS attack where an attacker uses all the in-flight requests the kube-apiserver 
can handle to serving the `cluster-info` ConfigMap.
-->
请注意：

1. 访问 `cluster-info` ConfigMap _是不_ 受限制的。如果您将您的主机暴露在互联网上，这可能是问题，也可能不是问题；最坏的情况是 DoS 攻击，攻击者使用 Kube-apiserver 可以处理的所有请求来为 `cluster-info` ConfigMap 提供服务。

<!--
### Install addons
-->
### 安装插件

<!--
Kubeadm installs the internal DNS server and the kube-proxy addon components via the API server.
-->
Kubeadm 通过 API server 安装内部 DNS 服务和 kube-proxy 插件组件。
<!--
Please note that: 

1. This phase can be invoked individually with the [`kubeadm alpha phase addon all`](kubeadm-alpha.md/#cmd-phase-addon) command.
-->
请注意：

1. 这个阶段可以通过 [`kubeadm alpha phase addon all`](kubeadm-alpha.md/#cmd-phase-addon) 命令单独调用

<!--
#### proxy
-->
#### 代理

<!--
A ServiceAccount for `kube-proxy` is created in the `kube-system` namespace; then kube-proxy is deployed as a DaemonSet:

- The credentials (`ca.crt` and `token`) to the master come from the ServiceAccount
- The location of the master comes from a ConfigMap
- The `kube-proxy` ServiceAccount is bound to the privileges in the `system:node-proxier` ClusterRole
-->
在命名空间 `kube-system` 下为 `kube-proxy` 创建一个 ServiceAccount；然后使用 DaemonSet 部署 kube-proxy：

- master 的凭证（`ca.crt` 和 `token`）来自 ServiceAccount
- master 的位置来自 ConfigMap
- `kube-proxy` ServiceAccount 绑定到 `system:node-proxier` ClusterRole 中的权限

#### DNS

<!--
A ServiceAccount for `kube-dns` is created in the `kube-system` namespace.
-->
在命名空间 `kube-system` 下为 `kube-dns` 创建一个 ServiceAccount。

<!--
Deploy the kube-dns Deployment and Service:

- It's the upstream kube-dns deployment relatively unmodified
- The `kube-dns` ServiceAccount is bound to the privileges in the `system:kube-dns` ClusterRole
-->
部署 kube-dns 的 Deployment 和 Service：

- 这是相对上游来说没有修改的 kube-dns 部署
- `kube-dns` ServiceAccount 绑定到 `system:kube-dns` ClusterRole 中的权限

<!--
Please note that:

1. If kubeadm is invoked with `--feature-gates=CoreDNS`,  CoreDNS is installed instead of `kube-dns`
-->
请注意：

1. 如果 kubeadm 被调用为 `--feature-gates=CoreDNS`，则会安装 CoreDNS 而不是 kube-dns

<!--
### (Optional and alpha in v1.9) self-hosting
-->
### （可选，v1.9 中是 alpha）自托管

<!--
This phase is performed only if `kubeadm init` is invoked with `—features-gates=selfHosting`
-->
只有在 `kubeadm init` 被调用为 `—features-gates=selfHosting` 才执行此阶段

<!--
The self hosting phase basically replaces static Pods for control plane components with DaemonSets; this is achieved by executing 
following procedure for API server, scheduler and controller manager static Pods:
-->
自托管阶段基本上用 DaemonSet 取代控制平面组件的静态 Pod; 这是通过执行 API server、scheduler 和 controller manager 静态 Pod 的以下过程来实现的：

<!--
- Load the static Pod specification from disk 
- Extract the PodSpec from static Pod manifest file
- Mutate the PodSpec to be compatible with self-hosting, and more in detail:
  - Add node selector attribute targeting nodes with `node-role.kubernetes.io/master=""` label, 
  - Add a toleration for `node-role.kubernetes.io/master:NoSchedule` taint,
  - Set `spec.DNSPolicy` to `ClusterFirstWithHostNet`
- Build a new DaemonSet object for the self-hosted component in question. Use the above mentioned PodSpec
- Create the DaemonSet resource in `kube-system` namespace. Wait until the Pods are running.
- Remove the static Pod manifest file. The kubelet will stop the original static Pod-hosted component that was running
-->
- 从磁盘加载静态 Pod 规格
- 从静态的 Pod 清单文件中提取 PodSpec
- 改变 PodSpec 与自托管兼容，更详细的内容：
  - 为带有 `node-role.kubernetes.io/master=""` 标签的节点增加节点选择器属性
  - 为污点 `node-role.kubernetes.io/master:NoSchedule` 增加一个容忍
  - 设置 `spec.DNSPolicy` 为 `ClusterFirstWithHostNet`
- 为有问题的自托管组件构建一个新的 DaemonSet 对象。使用上面提到的 PodSpec
- 在 `kube-system` 命名空间中创建 DaemonSet 资源。等到 Pod 运行。
- 删除静态的 Pod 清单文件。kubelet 将停止正在运行的原始静态 Pod 托管组件

<!--
Please note that:

1. Self hosting is not yet resilient to node restarts; this can be fixed with external checkpointing or with kubelet checkpointing 
   for the control plane Pods. See [self-hosting](kubeadm-init.md/#self-hosting) for more details.

2. If invoked with `—features-gates=StoreCertsInSecrets`  following additional steps will be executed

   - Creation of `ca`,  `apiserver`,  `apiserver-kubelet-client`, `sa`, `front-proxy-ca`, `front-proxy-client` TLS secrets 
     in `kube-system` namespace with respective certificates and keys.
     Important! storing the CA key in a Secret might have security implications
   - Creation of `schedler.conf` and `controller-manager.conf` secrets in`kube-system` namespace with respective kubeconfig files
   - Mutation of all the Pod specs by replacing host path volumes with projected volumes from the secrets above

3. This phase can be invoked individually with the [`kubeadm alpha phase selfhosting convert-from-staticpods`](kubeadm-alpha.md/#cmd-phase-self-hosting) command.
-->
请注意：

1. 自托管尚未恢复到节点重新启动的能力; 这可以通过外部检查点或控制平面 Pod 的 kubelet 检查点来修正。有关更多详细信息，请参阅 [自托管](kubeadm-init.md/#self-hosting)。

2. 如果被调用为 `—features-gates=StoreCertsInSecrets`，以下附加步骤将被执行

   - 在 `kube-system` 命名空间下使用各自的证书和秘钥创建 `ca`、`apiserver`、`apiserver-kubelet-client`、`sa`、`front-proxy-ca`、`front-proxy-client` TLS secrets 。重要！将 CA 密钥存储在 Secret 中可能会产生安全隐患
   - 使用各自的 kubeconfig 文件在命名空间 `kube-system` 中创建 `schedler.conf` 和 `controller-manager.conf` secret
   - 通过将主机路径卷替换为上述 secret 中的投影卷，对所有 POD 规范进行变更

3. 这个阶段可以通过 [`kubeadm alpha phase selfhosting convert-from-staticpods`](kubeadm-alpha.md/#cmd-phase-self-hosting) 命令单独调用

<!--
## kubeadm join phases internal design
-->
## kubeadm join 阶段的内部设计

<!--
Similarly to `kubeadm init`, also `kubeadm join` internal workflow consists of a sequence of atomic work tasks to perform.
-->
与 `kubeadm init` 类似，`kubeadm join` 内部工作流也是由一系列要执行的原子工作任务组成。

<!--
This is split into discovery (having the Node trust the Kubernetes Master) and TLS bootstrap (having the Kubernetes Master trust the Node).
-->
这分为发现（有 Node 信任 Kubernetes Master）和 TLS 引导（有 Kubernetes Master 信任 Node）。

<!--
see [Authenticating with Bootstrap Tokens](/docs/admin/bootstrap-tokens/) or the corresponding [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/cluster-lifecycle/bootstrap-discovery.md).
-->
请参阅 [使用引导令牌进行身份验证](/docs/admin/bootstrap-tokens/) 或相应的 [设计方案](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/cluster-lifecycle/bootstrap-discovery.md)。


<!--
### Preflight checks
-->
### 预检检查

<!--
`kubeadm` executes a set of preflight checks before starting the join, with the aim to verify preconditions and avoid common 
cluster startup problems. 
-->
kubeadm 在开始连接之前执行一组预检检查，目的是验证先决条件并避免常见的集群启动问题。

<!--
Please note that:

1. `kubeadm join` preflight checks are basically a subset `kubeadm init` preflight checks
1. Starting from 1.9, kubeadm provides better support for CRI-generic functionality; in that case, docker specific controls 
   are skipped or replaced by similar controls for crictl.
1. Starting from 1.9, kubeadm provides support for joining nodes running on Windows; in that case, linux specific controls are skipped.
1. In any case the user can skip specific preflight checks (or eventually all preflight checks) with the `--ignore-preflight-errors` option.
-->
请注意：

1. `kubeadm join` 预检检查基本上是一个 `kubeadm init` 预检检查的子集
1. 从 1.9 开始，kubeadm 为 CRI 泛型功能提供了更好的支持; 在这种情况下，docker 特定的控件将被跳过或替换为 crictl 类似控件
1. 从 1.9 开始，kubeadm 支持加入运行在 Windows 上的节点; 在这种情况下，会跳过 linux 特定的控制
1. 在任何情况下，用户都可以使用该 `--ignore-preflight-errors` 选项跳过特定的预检检查（或最终所有预检检查）

<!--
### Discovery cluster-info
-->
### 发现集群信息
<!--
There are 2 main schemes for discovery. The first is to use a shared token along with the IP address of the API server. 
The second is to provide a file (that is a subset of the standard kubeconfig file). 
-->
有两个主要的发现方案。首先是使用共享令牌以及 API server 的 IP 地址。第二个是提供一个文件（标准 kubeconfig 文件的一个子集）。

<!--
#### Shared token discovery
-->
#### 共享令牌发现

<!--
If `kubeadm join` is invoked with `--discovery-token`, token discovery is used; in this case the node basically retrieves 
the cluster CA certificates from the  `cluster-info` ConfigMap in the `kube-public` namespace.
-->
如果 `kubeadm join` 被调用为 `--discovery-token`，则使用令牌发现; 在这种情况下，节点基本上从命名空间 `kube-public` 下 `cluster-info` ConfigMap 中检索集群 CA 证书 。

<!--
In order to prevent "man in the middle" attacks, several steps are taken:

- First, the CA certificate is retrieved via insecure connection (this is possible because `kubeadm init` granted access to  `cluster-info` users for `system:unauthenticated` )
- Then the CA certificate goes trough following validation steps: 
  - Basic validation: using the token ID against a JWT signature
  - Pub key validation: using provided `--discovery-token-ca-cert-hash`. This value is available in the output of `kubeadm init` or can
    be calculated using standard tools (the hash is calculated over the bytes of the Subject Public Key Info (SPKI) object as in RFC7469). 
    The `--discovery-token-ca-cert-hash flag` may be repeated multiple times to allow more than one public key.
  - As a additional validation, the CA certificate is retrieved via secure connection and then compared with the CA retrieved initially
-->
为了防止 “中间人” 攻击，采取了几个步骤：

- 首先，通过不安全的连接检索 CA 证书（这是可能的，因为 `kubeadm init` 对 `system:unauthenticated` 授予了访问 `cluster-info` 用户的权限）
- 然后 CA 证书通过以下验证步骤：
  - 基本验证：针对 JWT 签名使用令牌 ID
  - 发布密钥验证：使用提供的 `--discovery-token-ca-cert-hash`。此值可在 `kubeadm init` 的输出中获取，也可以使用标准工具计算（散列是在 SPKI（Subject Public Key Info）对象的字节上计算的，如 RFC 7469 中所示）。`--discovery-token-ca-cert-hash` 标志可以重复多次，以允许多个公钥。
  -作为附加验证，CA 证书通过安全连接进行检索，然后与最初检索的 CA 进行比较

<!--
Please note that:

1.  Pub key validation can be skipped passing `--discovery-token-unsafe-skip-ca-verification` flag; This weakens the kubeadm security 
    model since others can potentially impersonate the Kubernetes Master.
-->
请注意：

1. 通过 `--discovery-token-unsafe-skip-ca-verification` 标志可以跳过发布密钥验证; 这削弱了 kubeadm 安全模型，因为其他人可能潜在模仿 Kubernetes Master。

<!--
#### File/https discovery
-->
#### 文件/https 发现

<!--
If `kubeadm join` is invoked with `--discovery-file`, file discovery is used; this file can be a local file or downloaded via an HTTPS URL; in case of HTTPS, the host installed CA bundle is used to verify the connection.
-->
如果 `kubeadm join` 被调用为 `--discovery-file`，则使用文件发现; 此文件可以是本地文件或通过 HTTPS URL 下载; 在 HTTPS 的情况下，主机安装的 CA 用于验证连接。

<!--
With file discovery, the cluster CA certificates is provided into the file itself; in fact, the discovery file is a kubeconfig 
file with only `server` and `certificate-authority-data` attributes set, as described in [`kubeadm join`](/kubeadm-join.md/#file-or-https-based-discovery) reference doc; 
when the connection with the cluster is established, kubeadm try to access the `cluster-info` ConfigMap, and if available, uses it.
-->
通过文件发现，集群 CA 证书被提供到文件本身; 事实上，发现的文件是一个 kubeconfig 文件，其中只设置了 `server` 和 `certificate-authority-data` 属性，如 [`kubeadm join`](/kubeadm-join.md/#file-or-https-based-discovery) 参考文档中所述; 当与集群建立连接时，kubeadm 尝试访问 `cluster-info` ConfigMap，如果可用，则使用它。

<!--
## TLS Bootstrap
-->
## TLS 引导

<!--
Once the cluster info are known, the file `bootstrap-kubelet.conf` is written, thus allowing kubelet to do TLS Bootstrapping 
(conversely until v.1.7 TLS bootstrapping were managed by kubeadm).
-->
一旦知道了集群信息，就会编写文件 `bootstrap-kubelet.conf`，从而允许 kubelet 执行 TLS 引导（相反，直到 v1.7 TLS 引导被 kubeadm 管理）。

<!--
The TLS bootstrap mechanism uses the shared token to temporarily authenticate with the Kubernetes Master to submit a certificate 
signing request (CSR) for a locally created key pair. 
-->
TLS 引导机制使用共享令牌临时向 Kubernetes Master 进行身份验证，以提交本地创建的密钥对的证书签名请求（CSR）。

<!--
The request is then automatically approved and the operation completes saving `ca.crt` file and `kubelet.conf` file to be used 
by kubelet for joining the cluster, while`bootstrap-kubelet.conf` is deleted.
-->
然后自动批准该请求，并且该操作完成保存 `ca.crt` 文件和用于加入集群的 `kubelet.conf` 文件，而 `bootstrap-kubelet.conf` 被删除。

<!--
Please note that:

- The temporary authentication is validated against the token saved during the `kubeadm init` process (or with additional tokens 
  created with `kubeadm token`) 
- The temporary authentication resolve to a user member of  `system:bootstrappers:kubeadm:default-node-token` group which was granted 
  access to CSR api during the `kubeadm init` process
- The automatic CSR approval is managed by the csrapprover controller, according with configuration done the `kubeadm init` process
-->
请注意：

- 临时验证是根据 `kubeadm init` 过程中保存的令牌进行验证的（或者使用 `kubeadm token` 创建的附加令牌）
- 对 `kubeadm init` 过程中被授予访问 CSR api 的 `system:bootstrappers:kubeadm:default-node-token` 组的用户成员的临时身份验证解析
- 自动 CSR 审批由 csrapprover 控制器管理，与 `kubeadm init` 过程的配置相一致

<!--
### (optional and alpha in v1.9) Write init kubelet configuration
-->
### （可选，1.9 版本中为 alpha）编写init kubelet配置

<!--
If kubeadm is invoked with `--feature-gates=DynamicKubeletConfig`: 

1. Read the kubelet base configuration from the `kubelet-base-config-v1.9` ConfigMap in the `kube-system` namespace  using the
   Bootstrap Token credentials, and write it to disk as kubelet init configuration file  `/var/lib/kubelet/config/init/kubelet`
2. As soon as kubelet starts with the Node's own credential (`/etc/kubernetes/kubelet.conf`), update current node configuration 
   specifying that the source for the node/kubelet configuration is the above ConfigMap.
-->
如果 kubeadm 被调用为 `--feature-gates=DynamicKubeletConfig`：

1. 使用引导令牌凭据从 `kube-system` 命名空间中的 `kubelet-base-config-v1.9` ConfigMap 中读取 kubelet 基本配置，并将其写入磁盘，作为 kubelet init 配置文件 `/var/lib/kubelet/config/init/kubelet`
2. 当 kubelet 以节点自己的凭据（`/etc/kubernetes/kubelet.conf`）开始时，更新当前节点配置，指定 node/kubelet 配置的源是上面的 ConfigMap。

<!--
Please note that:

1. To make dynamic kubelet configuration work, flag `--dynamic-config-dir=/var/lib/kubelet/config/dynamic` should be specified in `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`
-->
请注意：

1. 要使动态 kubelet 配置正常工作，应在 `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` 中指定标志 `--dynamic-config-dir=/var/lib/kubelet/config/dynamic`

{% endcapture %}

{% include templates/concept.md %}
