---
approvers:
- mikedanese
- luxas
- errordeveloper
- jbeda
title: Kubeadm
notitle: true
---
<!--
# kubeadm Setup Tool Reference Guide

This document provides information on how to use kubeadm's advanced options.

* TOC
{:toc}
-->
# kubeadm 设置工具参考指南

本文档提供有关如何使用 kubeadm 高级选项的信息。

* TOC
{:toc}

<!--
Running `kubeadm init` bootstraps a Kubernetes master node. This consists of the
following steps:

1. kubeadm runs a series of pre-flight checks to validate the system state
   before making changes. Some checks only trigger warnings, others are
   considered errors and will exit kubeadm until the problem is corrected or the
   user specifies `--skip-preflight-checks`.

1. kubeadm generates a token that additional nodes can use to register
   themselves with the master in future.  Optionally, the user can provide a
   token via `--token`, as described in the
   [section on managing tokens](#manage-tokens) below.
-->

运行 `kubeadm init` 引导一个 Kubernetes master 节点。这包括以下步骤：

1. 在引导前，kubeadm 运行一系列例行检查来验证系统状态。一些检查只触发警告，另一些则被认为是错误并导致 kubeadm 退出，直到这些错误被纠正或者用户指定参数 `--skip-preflight-checks`。

2. kubeadm 生成一个令牌，将来其他节点可以借助此令牌向 master 节点注册。或者，用户可以通过标识 `--token` 指定一个令牌，如下所述 [管理令牌部分](#manage-tokens)。

<!--
1. kubeadm generates a self-signed CA to provision identities for each component
   (including nodes) in the cluster.  It also generates client certificates to
   be used by various components.  If the user has provided their own CA by
   dropping it in the cert directory configured via `--cert-dir`
   (`/etc/kubernetes/pki` by default) this step is skipped as described in the
   [section on using custom certificates](#custom-certificates).

1. kubeadm writes kubeconfig files in `/etc/kubernetes/`  for
   the kubelet, the controller-manager and the scheduler to use to connect to the
   API server, each one with their respective identities, as well as an additional
   kubeconfig file for administration.
-->

3. kubeadm 生成一个自签名 CA 来为集群中的每个组件（包括节点）提供身份标识。它也生成各种组件使用的客户端证书。如果用户提供自己的 CA，并将其放在通过参数 `--cert-dir` 指定的目录中（默认路径是 `/etc/kubernetes/pki`），此步骤将被跳过，如 [使用自定义证书](#custom-certificates) 所述。

4. kubeadm 在 `/etc/kubernetes/` 中生成一些 kubeconfig 文件，这些文件用于kubelet、controller-manager 和 scheduler 连接 API 服务，每个文件包含各自组件的身份标识，还有一个用于集群管理的 kubeconfig 文件。

<!--
1. kubeadm generates static Pod manifests for the API server,
   controller manager and scheduler; in case an external etcd is not provided,
   an additional static Pod manifest will be generated for etcd.

   Static Pod manifests are written in `/etc/kubernetes/manifests`; the kubelet
   watches this directory for Pods to create on startup, as described in
   the [section about kubelet drop-in](#kubelet-drop-in).

   Once control plane Pods are up and running kubeadm init sequence can continue.
-->

5. kubeadm 为 API 服务、controller manager 和 scheduler 生成静态 Pod 清单；如果没有提供外部 etcd，将为 etcd 生成一个额外的静态 Pod 清单。

   静态 Pod 清单写在 `/etc/kubernetes/manifests` 中；kubelet 会监视这个目录，让 Pods 在启动时创建，如 [关于kubelet放入](＃kubelet-drop-in) 一节所述。

   一旦 control plane Pods 启动，运行中的 kubeadm init 序列任务就可以继续。

<!--
1. kubeadm "labels" and "taints" the master node so that only control plane
   components will run there.

1. kubeadm makes all the necessary configurations for allowing node joining with the
   [Bootstrap Tokens](https://kubernetes.io/docs/admin/bootstrap-tokens/) and
   [TLS Bootstrap](https://kubernetes.io/docs/admin/kubelet-tls-bootstrapping/)
   mechanism:

   - Write a ConfigMap for making available all the information required
     for joining and set up related RBAC access rules.

   - Ensure access to the CSR signing API for bootstrap tokens.

   - Configure auto approval for new CSR requests.

   See [Securing your installation](#securing-more) for hardening.
-->

6. kubeadm 为 master 节点标识 "labels" 和 "taints"，这样只允许 control plane 组件在此节点运行。

7. kubeadm 做了所有必要的配置以允许节点加入，通过 [Bootstrap Tokens](https://kubernetes.io/docs/admin/bootstrap-tokens/) 和
[TLS引导](https://kubernetes.io/docs/admin/kubelet-tls-bootstrapping/)
 机制：

   - 写一个 ConfigMap 来提供所有需要的信息，用于加入和设置相关的 RBAC 访问规则。

   - 为使用 bootstrap tokens 方式，确保可以访问由 CSR 签名的 API。

   - 为新的 CSR 请求配置自动批准。

   请参见 [安全设置您的安装](#securing-more) 。

<!--
1. kubeadm installs add-on components via the API server.  Right now this is
   the internal DNS server and the kube-proxy DaemonSet.

1. If `kubeadm init` is invoked with the alpha self-hosting feature enabled,
   (`--feature-gates=SelfHosting=true`), the static Pod based control plane will
   be transformed into a [self-hosted control plane](#self-hosting).

Running `kubeadm join` on each node in the cluster consists of the following
steps:
-->

8. kubeadm 通过 API 服务器安装附加组件。这一步需要安装内部的 DNS server 和 kube-proxy DaemonSet。

9. 如果在启用 alpha 自托管功能的情况下调用 kubeadm init，(`--feature-gates=SelfHosting=true`)，基于静态 Pod 的 control plane 将会转化为 [自主 control plane](#self-hosting)。

在集群中的每个节点上运行 `kubeadm join` 包含以下步骤：

<!--
1. kubeadm downloads necessary cluster information from the API server.
   By default, it uses the bootstrap token and the CA key hash to verify the
   authenticity of that data. The root CA can also be discovered directly via a
   file or URL.

1. Once the cluster information are known, kubelet can start the TLS bootstrapping
   process (in v.1.7 this step was managed by kubeadm).

   The TLS bootstrap uses the shared token to temporarily authenticate
   with the Kubernetes Master to submit a certificate signing request (CSR); by
   default the control plane will sign this CSR request automatically.

1. Finally, kubeadm will configure the local kubelet to connect to the API
   server with the definitive identity assigned to the node.
-->

1. kubeadm 从 API server 下载必要的集群信息。默认情况下，它使用 bootstrap token 和 CA 哈希密钥来验证该数据的真实性。也可以通过文件或 URL 直接获取根 CA 。

1. 一旦获知集群信息，kubelet 启动 TLS bootstrap 过程，（在 v.1.7 中这一步由 kubeadm 管理）。

   TLS bootstrap 使用共享 token 临时向 Kubernetes Master 进行身份验证，以便提交证书签名请求（CSR）；control plane 默认会自动签署这个 CSR 请求。

1. 最后，kubeadm 会配置本地 kubelet，为此节点分配唯一的身份标识，并连接到 API server。

<!--
## Usage

Fields that support multiple values do so either with comma separation, or by
specifying the flag multiple times.

The kubeadm command line interface is currently in **beta**.  We are aiming to
not break any scripted use of the main `kubeadm init` and `kubeadm join`.
Exceptions to this are documented below.
-->

## 用法

kubeadm 的字段可以支持多个值，可以使用逗号分隔，也可以多次指定标识。

kubeadm 命令行目前是 **beta** 版。我们的目标是不打破对主命令 `kubeadm init`和 `kubeadm join` 的脚本化的使用。
以下是例外情况。

<!--
### `kubeadm init`

It is usually sufficient to run `kubeadm init` without any flags, but in some
cases you might like to override the default behaviour. Here we specify all the
flags that can be used to customise the Kubernetes installation.

**Options for `kubeadm init`:**
-->

### `kubeadm init`

通常执行 `kubeadm init` 就足够了，但在某些情况下，你可能想覆盖默认的操作。在这，我们指定了所有用于自定义安装 Kubernetes 的标识。

**`kubeadm init` 选项:**

<!--
- `--apiserver-advertise-address`

  This is the address the API Server will advertise to other members of the
  cluster.  This is also the address used to construct the suggested `kubeadm
  join` line at the end of the init process.  If not set (or set to 0.0.0.0) then
  IP for the default interface will be used.

  This address is also added to the certificate that the API Server uses.
-->

- `--apiserver-advertise-address`

  这是通知集群内其他成员 API Server 的地址。这也是在 init 进程结束时，`kubeadm  join` 命令行中建议使用的地址。  如果未设置（或设置为 0.0.0.0），则将使用默认网络接口的 IP。

  该地址也被添加到 API server 使用的证书中。

<!--
- `--apiserver-bind-port`

  The port that the API server will bind on.  This defaults to 6443.

- `--apiserver-cert-extra-sans`

  Additional hostnames or IP addresses that should be added to the Subject
  Alternate Name section for the certificate that the API Server will use.  If you
  expose the API Server through a load balancer and public DNS you could specify
  this with

  ```
  --apiserver-cert-extra-sans=kubernetes.example.com,kube.example.com,10.100.245.1
  ```
-->

- `--apiserver-bind-port`

  API server 绑定的端口。默认是 6443。

- `--apiserver-cert-extra-sans`
  在 API Server 使用的证书中，添加主机名或者 IP 地址作为备用名称。如果通过负载均衡或者公共 DNS 暴露 API Server，您应该指定

  ```
  --apiserver-cert-extra-sans=kubernetes.example.com,kube.example.com,10.100.245.1
  ```
<!--
- `--cert-dir`

  The path where to save and store the certificates.  The default is
  "/etc/kubernetes/pki".

- `--config`

  A kubeadm specific [config file](#config-file).  This can be used to specify an
  extended set of options including passing arbitrary command line flags to the
  control plane components.

  **Note**: Since 1.8, other flags are not allowed alongside `--config` except
  for flags used to define kubeadm behaviour (not configuration) such as
  `--skip-preflight-checks`.
-->

- `--cert-dir`
  保存和存储证书的路径。默认是"/etc/kubernetes/pki"。

- `--config`

  kubeadm 指定 [config file](#config-file)。这可以用来指定一组扩展选项，包括将任意命令行标识传递给 control plane 组件。

    **注意**：从1.8开始，其他的标识不能和 `--config` 一起使用，除了用于定义 kubeadm 行为的标识（不是配置），例如 `--skip-preflight-checks` 。

<!--
- `--dry-run`

   This flag tells kubeadm to don't apply any changes; just output what would be done.

- `--feature-gates`

  A set of key=value pairs that describe feature gates for alpha/experimental
  features. Options are:

    - SelfHosting=true\|false (ALPHA - default=false)

    - StoreCertsInSecrets=true\|false (ALPHA - default=false)

  See [self-hosted control plane](#self-hosting) for more detail.
-->

- `--dry-run`

   这个标识告诉 kubeadm 不应用任何改动；只是输出会做什么。

- `--feature-gates`

  描述 alpha/experimental 功能开关的 key=value 对。选项是：

  - SelfHosting=true\|false (ALPHA - default=false)

  - StoreCertsInSecrets=true\|false (ALPHA - default=false)

  有关更多详细信息，请参见 [self-hosted control plane](#self-hosting)。

<!--
- `--kubernetes-version` (default 'latest') the kubernetes version to initialise

  The **v1.6** version of kubeadm only supports building clusters that are at
  least **v1.6.0**.  There are many reasons for this including kubeadm's use of
  RBAC, the Bootstrap Token system, and enhancements to the Certificates API. With
  this flag you can try any future version of Kubernetes.  Check [releases
  page](https://github.com/kubernetes/kubernetes/releases) for a full list of
  available versions.
-->

- `--kubernetes-version`（默认是 'latest'），初始化的 kubernetes 版本

  kubeadm 的 **v1.6** 版本，只支持构建最低版本为 **v1.6.0** 的集群。这有很多原因，包括 kubeadm 的RBAC，Bootstrap Token 系统和对 Certificates API 的增强支持。有了这个标识，您可以任意尝试 Kubernetes 的未来版本。查看 [releases
  page](https://github.com/kubernetes/kubernetes/releases) 获得完整的版本列表。

<!--
- `--node-name`

  Allow to specify the node name, if something different than O.S. hostname should be used e.g. in case of Amazon EC2 instances.

  The node-name is also added to the certificate that the API Server uses.
-->

- `--node-name`

  如果不同于 O.S，允许指定节点名称。例如在使用 Amazon EC2 实例的情况下，应该使用 hostname。

<!--
- `--pod-network-cidr`

  For certain networking solutions the Kubernetes master can also play a role in
  allocating network ranges (CIDRs) to each node. This includes many cloud
  providers and flannel. You can specify a subnet range that will be broken down
  and handed out to each node with the `--pod-network-cidr` flag. This should be a
  minimum of a /16 so controller-manager is able to assign /24 subnets to each
  node in the cluster. If you are using flannel with [this
  manifest](https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml)
  you should use `--pod-network-cidr=10.244.0.0/16`. Most CNI based networking
  solutions do not require this flag.
-->

- `--pod-network-cidr`

  对于某些网络解决方案，Kubernetes master 也可以在为每个节点分配网络范围（CIDR）方面发挥作用。解决方案包括许多 cloud providers 和 flannel。您可以指定子网范围，将其分段并通过 `--pod-network-cidr` 标识发送给每个节点。使用 /16 作为最小值，这样 controller-manager 能够将 /24 的子网段分配给集群中每个节点。如果您用 [
  manifest](https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml) 创建 flannel，您应该使用 `--pod-network-cidr=10.244.0.0/16`。大多数基于 CNI 的网络解决方案不需要这个标识。

<!--
- `--service-cidr` (default '10.96.0.0/12')

  You can use the `--service-cidr` flag to override the subnet Kubernetes uses to
  assign services IP addresses. If you do, you will also need to update the
  `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` file to reflect this
  change else DNS will not function correctly.
-->

- `--service-cidr` (default '10.96.0.0/12')

  您可以使用 `--service-cidr` 标识覆盖 Kubernetes 使用的服务 IP 地址段。修改后，您还需要更新 `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` 文件，否则DNS将无法正常工作。

<!--
- `--service-dns-domain` (default 'cluster.local')

  By default, `kubeadm init` deploys a cluster that assigns services with DNS
  names `<service_name>.<namespace>.svc.cluster.local`. You can use the
  `--service-dns-domain` to change the DNS name suffix. Again, you will need to
  update the `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` file
  accordingly else DNS will not function correctly.
-->
- `--service-dns-domain`（默认 'cluster.local'）

  默认情况下，`kubeadm init` 部署使用 DNS 名字为 `<service_name>.<namespace>.svc.cluster.local` 的集群。您可以使用 `--service-dns-domain` 改变 DNS 名称后缀。同样也需要更新文件 `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`，否则 DNS 将无法正常工作。

<!--
  **Note**: This flag has an effect (it's needed for the kube-dns Deployment
  manifest and the API Server's serving certificate) but not as you might expect,
  since you will have to modify the arguments to the kubelets in the cluster for
  it to work fully. Specifying DNS parameters using this flag only is not enough.
  Rewriting the kubelet's CLI arguments is out of scope for kubeadm as it should
  be agnostic to how you run the kubelet. However, making all kubelets in the
  cluster pick up information dynamically via the API _is_ in scope and is a
  [planned feature](https://github.com/kubernetes/kubeadm/issues/28) for upcoming
  releases.
-->

  **注意**：这个标识（kube-dns 部署 manifest 和 API server 的服务证书都需要它）会产生一个你可能不期望看到的效果，因为您必须修改集群中的 kubelets 参数才能使其正常工作。仅使用此标识指定 DNS 参数是不够的。重写 kubelet 的 CLI 参数超出了讨论 kubeadm 的范围，因为它不知道您如何运行 kubelet。但是，允许集群内所有的 kubelet 通过 API 动态地获取信息，是即将发布的 [计划功能](https://github.com/kubernetes/kubeadm/issues/28)。

<!--
- `--skip-preflight-checks`

  By default, kubeadm runs a series of preflight checks to validate the system
  before making any changes. Advanced users can use this flag to bypass these if
  necessary.

- `--skip-token-print`

  By default, kubeadm prints the token at the end of the init procedure. Advanced
  users can use this flag to bypass these if necessary.
-->

- `--skip-preflight-checks`

  默认情况下，kubeadm 会在进行任何更改之前运行一系列预检查来验证系统。高级用户可以使用此标识绕过检查。

- `--skip-token-print`

  默认情况下，kubeadm 在 init 过程结束时打印 token。高级用户可以在必要时使用此标识绕过打印。

<!--
- `--token`

  By default, `kubeadm init` automatically generates the token used to initialise
  each new node. If you would like to manually specify this token, you can use the
  `--token` flag. The token must be of the format `[a-z0-9]{6}\.[a-z0-9]{16}`.  A
  compatible random token can be generated `kubeadm token generate`.  Tokens can
  be managed through the API after the cluster is created.  See the [section on
  managing tokens](#manage-tokens) below.
-->

- `--token`

  默认情况下， `kubeadm init` 自动生成用于初始化每个新节点的 token。您可以使用标识 `--token` 手工指定 token。token 的格式必须是 `[a-z0-9]{6}\.[a-z0-9]{16}`。 `kubeadm token generate` 可以生成兼容的随机 token。集群创建后，通过 API 管理 token。请参阅后面的 [token管理部分](#manage-tokens)。

<!--
- `--token-ttl`

  This sets an expiration time for the token.  This is specified as a duration
  from the current time.  After this time the token will no longer be valid and
  will be removed. A value of 0 specifies that the token never expires.  The
  default is 24 hours.  See the [section on managing tokens](#manage-tokens) below.
-->

- `--token-ttl`

  此标识设置 token 的过期时间。指定从当前时间起的持续时长。在这段时间之后，token 将不再有效并被删除。值为 0 指定 token 永不过期。默认是 24 小时。请参阅后面的 [token管理部分](#manage-tokens)。

<!--
### `kubeadm join`

When joining a kubeadm initialized cluster, we need to establish bidirectional
trust. This is split into discovery (having the Node trust the Kubernetes
master) and TLS bootstrap (having the Kubernetes master trust the Node).
-->

### `kubeadm join`

加入 kubeadm 初始化的集群时，需要建立双向的信任连接。这分为 discovery（使节点信任 Kubernetes master）和 TLS bootstrap（让 Kubernetes master 信任节点）。

<!--
There are two main schemes for discovery:

 - **Using a shared token** along with the IP address of the API server and a
   hash of the root CA key:

   `kubeadm join --discovery-token abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234..cdef 1.2.3.4:6443`

 - **Using a file** (a subset of the standard kubeconfig file). This file can
   be a local file or downloaded via an HTTPS URL:

   `kubeadm join --discovery-file path/to/file.conf`

   `kubeadm join --discovery-file https://url/file.conf`
-->

有两种主要的 discovery 方案：

 - **使用共享 token** 以及 API server 的 IP 地址和根 CA 密钥的哈希值：
   `kubeadm join --discovery-token abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234..cdef 1.2.3.4:6443`

 - **使用一个文件**（标准 kubeconfig 文件的子集）。这个文件可以
 是本地文件或通过 HTTPS URL 下载：

   `kubeadm join --discovery-file path/to/file.conf`

   `kubeadm join --discovery-file https://url/file.conf`

<!--
Only one form can be used. If the discovery information is loaded from a URL,
HTTPS must be used and the host installed CA bundle is used to verify the
connection. For details on the security tradeoffs of these mechanisms, see the
[security model] section below.
-->

只可以选择其中一种方案。如果 discovery 信息是从 URL 加载的，必须使用 HTTPS，并使用已安装 CA bundle 的主机来验证连接。有关这些机制的安全权衡的细节，请参阅 [安全模式](#security-model) 部分。

<!--
The TLS bootstrap mechanism is also driven via a shared token. This is used to
temporarily authenticate with the Kubernetes master to submit a certificate
signing request (CSR) for a locally created key pair. By default kubeadm will
set up the Kubernetes master to automatically approve these signing requests.
This token is passed in with the `--tls-bootstrap-token abcdef.1234567890abcdef`
flag.
-->

TLS bootstrap 机制也是通过共享 token 驱动的。这用于临时向 Kubernetes master 进行身份验证，通过本地创建的密钥对来提交证书签名请求（CSR）。默认情况下，kubeadm 设置 Kubernetes master 自动批准这些签名请求。这个 token 是通过 `--tls-bootstrap-token abcdef.1234567890abcdef` 标识传入的。

<!--
Often times the same token is used for both parts. In this case, the `--token` flag
can be used instead of specifying the each token individually.

Here's an example on how to use it:

`kubeadm join --token=abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234..cdef 192.168.1.1:6443`
-->

通常，两个标识可以用相同的 token 。在这种情况下，用标识 `--token` 来代替单独指定每种 token。

这里有一个关于如何使用例子：

`kubeadm join --token=abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234..cdef 192.168.1.1:6443`

<!--
**Options for `kubeadm join`:**

- `--config`

  Extended options are specified in the [kubeadm specific config file](#config-file).
-->

**`kubeadm join`的选项：**

- `--config`

  扩展选项在 [kubeadm指定配置文件](#config-file) 中指定。

<!--
- `--discovery-file`

  A local file path or HTTPS URL.  The file specified must be a kubeconfig file
  with nothing but an unnamed cluster entry.  This is used to find both the
  location of the API server to join along with a root CA bundle to use when
  talking to that server.
-->

- `--discovery-file`
  本地文件路径或 HTTPS URL。该文件必须是 kubeconfig 文件，且只含有一个未命名的集群条目。这用于查找要连接的 API server 的位置以及与该 server 通信时使用的根 CA bundle。

<!--
  This might look something like this:

  ``` yaml
  apiVersion: v1
  clusters:
  - cluster:
      certificate-authority-data: <really long certificate data>
      server: https://10.138.0.2:6443
    name: ""
  contexts: []
  current-context: ""
  kind: Config
  preferences: {}
  users: []
  ```
-->

该文件看起来是这样：

``` yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: <really long certificate data>
    server: https://10.138.0.2:6443
  name: ""
contexts: []
current-context: ""
kind: Config
preferences: {}
users: []
```

<!--
- `--discovery-token`

  The discovery token is used along with the address of the API server (as an
  unnamed argument) to download and verify information about the cluster.  The
  most critical part of the cluster information is the root CA bundle used to
  verify the identity of the server during subsequent TLS connections.
-->

- `--discovery-token`

  discovery token 与 API server 的地址（作为未命名参数）一起使用，以下载和验证有关集群的信息。集群集信息中最关键的部分是根 CA bundle，这用于在后续 TLS 连接期间验证服务器身份。

<!--
- `--discovery-token-ca-cert-hash`

  The CA key hash is used to verify the full root CA certificate discovered during
  token-based bootstrapping. It has the format `sha256:<hex_encoded_hash>`. By
  default, the hash value is returned in the `kubeadm join` command printed at the
  end of `kubeadm init`. It is in a standard format (see
  [RFC7469](https://tools.ietf.org/html/rfc7469#section-2.4)) and can also be
  calculated by 3rd party tools or provisioning systems. For example, using the
  OpenSSL CLI:
  `openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'`

  _Skipping this flag is allowed in Kubernetes 1.8, but makes certain spoofing
  attacks possible._ See the [security model](#security-model) for details.
  Pass `--discovery-token-unsafe-skip-ca-verification` to silence warnings (which
  will become errors in Kubernetes 1.9).
-->

- `--discovery-token-ca-cert-hash`

  CA 密钥哈希用于验证完整的根 CA 证书，该 CA 证书在基于 token 的引导期间被发现。CA 密钥哈希的格式是 `sha256:<hex_encoded_hash>`。默认情况下，哈希值是在 `kubeadm init` 结尾处打印的 `kubeadm join` 命令中返回的。它采用标准格式（请参阅[RFC7469](https://tools.ietf.org/html/rfc7469#section-2.4)），可以通过第三方工具或其他服务系统进行计算得出。例如，使用 OpenSSL 命令行：
  `openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'`

  _在 Kubernetes 1.8 中允许跳过这个标识，但是可能引来某些潜在的攻击。_ 详见 [安全模式](#security-model)。
  传递 `--discovery-token-unsafe-skip-ca-verification` 标识将静默警告（这些警告在 Kubernetes 1.9 中会引起报错）。

<!--
- `--discovery-token-unsafe-skip-ca-verification`

  Disable the warning/error that occurs when `--discovery-token-ca-cert-hash` is
  not provided. Passing this flag is an acknowledgement of the
  [security tradeoffs](#security-model) involved in skipping this verification
  (which may or may not be appropriate in your environment).
-->

- `--discovery-token-unsafe-skip-ca-verification`

  屏蔽未提供 `--discovery-token-ca-cert-hash` 时出现的警告/错误。传递这个标识是对忽略验证的 [安全性权衡](#security-model) 的确认（在您的环境中可能适用也可能不适用）。

<!--
- `--node-name`

  Specify the Node name. The default is to use the OS hostname. This is useful
  on some cloud providers such as AWS. This name is also added to the node's
  TLS certificate.

- `--tls-bootstrap-token`

  The token used to authenticate to the API server for the purposes of TLS
  bootstrapping.
-->

- `--node-name`

  指定节点名称，默认是主机名。这在使用 cloud providers 时有用，比如 AWS。该名称也被加入到节点的 TLS 证书中。

- `--tls-bootstrap-token`

  以 TLS bootstrap 方式验证时，该 token 用于向 API server 进行身份验证。

<!--
- `--token=<token>`

  Often times the same token is used for both `--discovery-token` and
  `--tls-bootstrap-token`.  This option specifies the same token for both.  Other
  flags override this flag if present.

- `--skip-preflight-checks`

  By default, kubeadm runs a series of preflight checks to validate the system
  before making any changes. Advanced users can use this flag to bypass these if
  necessary.
-->

- `--token=<token>`

  通常 `--discovery-token` 和 `--tls-bootstrap-token` 可以用同一个 token。这个选项表示两者使用一个 token。该标识会被提供的其他标识覆盖。

- `--skip-preflight-checks`

  默认情况下，kubeadm 会在进行任何更改之前运行一系列预检检查来验证系统。高级用户可以使用此标识绕过检查。

<!--
### `kubeadm completion`

Output shell completion code for the specified shell (bash or zsh).
-->

### `kubeadm completion`

输出指定 shell（bash或zsh）的 shell 完成码。

<!--
### `kubeadm config`

Kubeadm v1.8.0+ automatically creates a ConfigMap with all the parameters
used during `kubeadm init`.

If you initialized your cluster using kubeadm v1.7.x or lower, you must use
the `kubeadm config upload` command to create this ConfigMap in order
for `kubeadm upgrade` to be able to configure your upgraded cluster correctly.
-->

### `kubeadm config`

Kubeadm v1.8.0+ 会自动创建一个 ConfigMap，其中包含 `kubeadm init` 过程中使用的所有参数。

如果使用 kubeadm v1.7.x 或更低版本初始化群集，则必须使用 `kubeadm config upload` 命令来创建此 ConfigMap，以便 `kubeadm upgrade` 能够正确配置升级后的集群。

<!--
### `kubeadm reset`

Reverts any changes made to this host by `kubeadm init` or `kubeadm join`.
-->

### `kubeadm reset`

恢复由 `kubeadm init` 或 `kubeadm join` 对此主机所做的任何更改。

<!--
### `kubeadm token`

Manage tokens on a running cluster. See [managing tokens](#manage-tokens) below
for further details.
-->

### `kubeadm token`

在正在运行的集群上管理 token。请参阅下面的 [管理token](#manage-tokens)以获取更多详细信息。

<!--
### `kubeadm alpha phases`

**WARNING:** While kubeadm command line interface is in beta, commands under
this entry is still considered alpha and may change in future versions.
-->

### `kubeadm alpha phases`

**警告：** 虽然 kubeadm 命令行接口处于 beta，但此条目下的命令仍被视为 alpha，并可能在将来的版本中更改。

<!--
`kubeadm phase` introduces a set of kubeadm CLI commands allowing to invoke
individually each phase of the kubeadm init sequence; phases provide a reusable
and composable API/toolbox for building your own automated cluster installer.

**Options for `kubeadm phases`:**

Each kubeadm phase exposes a subset of relevant options from `kubeadm init`.
-->

`kubeadm phase` 引入了一套 kubeadm CLI 命令，允许单独调用 kubeadm init 序列任务的每个阶段。这提供了可重用和可组合的 API/toolbox，用于构建您自己的自动集群安装程序。

**`kubeadm phases` 选项：**

每个 kubeadm phase 都暴露了 `kubeadm init` 中相关的选项的一个子集。

<!--
## Using kubeadm with a configuration file {#config-file}

**WARNING:** While kubeadm command line interface is in beta, the config file is
still considered alpha and may change in future versions.

It's possible to configure kubeadm with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options.  This file is passed in to the `--config` option on
both `kubeadm init` and `kubeadm join`.
-->

## kubeadm 使用配置文件  {#config-file}

**警告：** 虽然 kubeadm 命令行接口处于 beta，但配置文件功能仍被视为 alpha 并可能在将来的版本中更改。

可以使用配置文件而不是命令行标识来配置 kubeadm，而一些更高级的功能只能在配置文件选项使用。  这个文件在 kubeadm init 和 kubeadm join 的 `--config` 选项中使用。

<!--
### Sample Master Configuration

```yaml
apiVersion: kubeadm.k8s.io/v1alpha1
kind: MasterConfiguration
api:
  advertiseAddress: <address|string>
  bindPort: <int>
etcd:
  endpoints:
  - <endpoint1|string>
  - <endpoint2|string>
  caFile: <path|string>
  certFile: <path|string>
  keyFile: <path|string>
  dataDir: <path|string>
  extraArgs:
    <argument>: <value|string>
    <argument>: <value|string>
  image: <string>
networking:
  dnsDomain: <string>
  serviceSubnet: <cidr>
  podSubnet: <cidr>
kubernetesVersion: <string>
cloudProvider: <string>
nodeName: <string>
authorizationModes:
- <authorizationMode1|string>
- <authorizationMode2|string>
token: <string>
tokenTTL: <time duration>
selfHosted: <bool>
apiServerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
controllerManagerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
schedulerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
apiServerCertSANs:
- <name1|string>
- <name2|string>
certificatesDir: <string>
imageRepository: <string>
unifiedControlPlaneImage: <string>
featureGates:
  <feature>: <bool>
  <feature>: <bool>
```
In addition, if authorizationMode is set to `ABAC`, you should write the config to `/etc/kubernetes/abac_policy.json`.
However, if authorizationMode is set to `Webhook`, you should write the config to `/etc/kubernetes/webhook_authz.conf`.
-->

### Master 节点配置样例

```yaml
apiVersion: kubeadm.k8s.io/v1alpha1
kind: MasterConfiguration
api:
  advertiseAddress: <address|string>
  bindPort: <int>
etcd:
  endpoints:
  - <endpoint1|string>
  - <endpoint2|string>
  caFile: <path|string>
  certFile: <path|string>
  keyFile: <path|string>
  dataDir: <path|string>
  extraArgs:
    <argument>: <value|string>
    <argument>: <value|string>
  image: <string>
networking:
  dnsDomain: <string>
  serviceSubnet: <cidr>
  podSubnet: <cidr>
kubernetesVersion: <string>
cloudProvider: <string>
nodeName: <string>
authorizationModes:
- <authorizationMode1|string>
- <authorizationMode2|string>
token: <string>
tokenTTL: <time duration>
selfHosted: <bool>
apiServerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
controllerManagerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
schedulerExtraArgs:
  <argument>: <value|string>
  <argument>: <value|string>
apiServerCertSANs:
- <name1|string>
- <name2|string>
certificatesDir: <string>
imageRepository: <string>
unifiedControlPlaneImage: <string>
featureGates:
  <feature>: <bool>
  <feature>: <bool>
```
另外，如果 authorizationMode 设置为 `ABAC`，则应该将配置写入 `/etc/kubernetes/abac_policy.json`。
但是，如果 authorizationMode 设置为 `Webhook`，则应将配置写入 `/etc/kubernetes/webhook_authz.conf`。

<!--
### Sample Node Configuration

```yaml
apiVersion: kubeadm.k8s.io/v1alpha1
kind: NodeConfiguration
caCertPath: <path|string>
discoveryFile: <path|string>
discoveryToken: <string>
discoveryTokenAPIServers:
- <address|string>
- <address|string>
nodeName: <string>
tlsBootstrapToken: <string>
token: <string>
discoveryTokenCACertHashes:
- <SHA-256 hash|string>
- <SHA-256 hash|string>
discoveryTokenUnsafeSkipCAVerification: <bool>
```
-->

### Node 节点样例

```yaml
apiVersion: kubeadm.k8s.io/v1alpha1
kind: NodeConfiguration
caCertPath: <path|string>
discoveryFile: <path|string>
discoveryToken: <string>
discoveryTokenAPIServers:
- <address|string>
- <address|string>
nodeName: <string>
tlsBootstrapToken: <string>
token: <string>
discoveryTokenCACertHashes:
- <SHA-256 hash|string>
- <SHA-256 hash|string>
discoveryTokenUnsafeSkipCAVerification: <bool>
```

<!--
## Securing your installation even more {#securing-more}

The defaults for kubeadm may not work for everyone. This section documents how to tighten up a kubeadm install
at the cost of some usability.
-->

## 进一步保护您的安装集群 {#securing-more}

kubeadm 的默认设置可能不适用所有人。本节介绍如何以某种可用性为代价来强化 kubeadm 安装。

<!--
### Turning off auto-approval of Node Client Certificates

By default, there is a CSR auto-approver enabled that basically approves any client certificate request
for a kubelet when a Bootstrap Token was used when authenticating. If you don't want the cluster to
automatically approve kubelet client certs, you can turn it off by executing this command:

```console
$ kubectl delete clusterrole kubeadm:node-autoapprove-bootstrap
```
-->

### 关闭 Node 节点客户端证书的自动批准

默认情况下，启用 CSR 自动审批，在使用 Bootstrap Token 验证时，基本上会批准任何客户端证书请求。如果您不希望集群自动批准 kubelet 客户端证书，则可以通过执行以下命令将其关闭：

```console
$ kubectl delete clusterrole kubeadm:node-autoapprove-bootstrap
```

<!--
After that, `kubeadm join` will block until the admin has manually approved the CSR in flight:

```console
$ kubectl get csr
NAME                                                   AGE       REQUESTOR                 CONDITION
node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ   18s       system:bootstrap:878f07   Pending

$ kubectl certificate approve node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ
certificatesigningrequest "node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ" approved

$ kubectl get csr
NAME                                                   AGE       REQUESTOR                 CONDITION
node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ   1m        system:bootstrap:878f07   Approved,Issued
```

Only after `kubectl certificate approve` has been run, `kubeadm join` can proceed.
-->

之后，`kubeadm join` 将被阻止，直到管理员手动批准了在请求中的 CSR：

```console
$ kubectl get csr
NAME                                                   AGE       REQUESTOR                 CONDITION
node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ   18s       system:bootstrap:878f07   Pending

$ kubectl certificate approve node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ
certificatesigningrequest "node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ" approved

$ kubectl get csr
NAME                                                   AGE       REQUESTOR                 CONDITION
node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ   1m        system:bootstrap:878f07   Approved,Issued
```

只有在 `kubectl certificate approve` 后，`kubeadm join` 才能继续。

<!--
### Turning off public access to the cluster-info ConfigMap

In order to achieve the joining flow using the token as the only piece of validation information, a
public ConfigMap with some data needed for validation of the master's identity is exposed publicly by
default. While there is no private data in this ConfigMap, some users are sensitive and wish to turn
it off regardless. Doing so will disable the ability to use the `--discovery-token` flag of the
`kubeadm join` flow. Here are the steps to do so:
-->

### 关闭对集群信息 ConfigMap 的公共访问

为了使用 token 作为唯一的验证信息来实现节点加入流程，一个公共 ConfigMap 默认被暴露出来，该 ConfigMap 具有验证 master 身份所需的一些数据。虽然 ConfigMap 中没有私人数据，但有些用户是敏感的，不管怎样，都希望将其关闭。 这样做会禁用使用 `kubeadm join` 时的 `--discovery-token` 标识的功能。以下是这样做的步骤：

<!--
Fetch the `cluster-info` file from the API Server:

```console
$ kubectl -n kube-public get cm cluster-info -o yaml | grep "kubeconfig:" -A11 | grep "apiVersion" -A10 | sed "s/    //" | tee cluster-info.yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: <ca-cert>
    server: https://<ip>:<port>
  name: ""
contexts: []
current-context: ""
kind: Config
preferences: {}
users: []
```

You can then use the `cluster-info.yaml` file as an argument to `kubeadm join --discovery-file`.
-->

从API server 获取 `cluster-info` 文件：

```console
$ kubectl -n kube-public get cm cluster-info -o yaml | grep "kubeconfig:" -A11 | grep "apiVersion" -A10 | sed "s/    //" | tee cluster-info.yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: <ca-cert>
    server: https://<ip>:<port>
  name: ""
contexts: []
current-context: ""
kind: Config
preferences: {}
users: []
```

然后可以使用 `cluster-info.yaml` 文件作为 `kubeadm join --discovery-file` 的参数。

<!--
Turning off public access to the `cluster-info` ConfigMap:

```console
$ kubectl -n kube-public delete rolebinding kubeadm:bootstrap-signer-clusterinfo
```

These commands should be run after `kubeadm init` but before `kubeadm join`.
-->

关闭对集群信息 ConfigMap 的公共访问

```console
$ kubectl -n kube-public delete rolebinding kubeadm:bootstrap-signer-clusterinfo
```

这些命令应该在 `kubeadm init` 之后，`kubeadm join` 之前运行。

<!--
## Managing Tokens {#manage-tokens}

You can use the `kubeadm` tool to manage tokens on a running cluster.  It will
automatically grab the default admin credentials on a master from a `kubeadm`
created cluster (`/etc/kubernetes/admin.conf`).  You can specify an alternate
kubeconfig file for credentials with the `--kubeconfig` to the following
commands.
-->

## 管理 toekn {#manage-tokens}

您可以使用 `kubeadm` 工具管理正在运行的集群上的 token。它会自动从 `kubeadm` 创建的集群中获取 master 的默认管理员凭证（`/etc/kubernetes/admin.conf`）。您可以在以下命令中通过 `--kubeconfig` 标识指定备用 kubeconfig 文件，以此获取凭证。

<!--
* `kubeadm token list` - List tokens (along with their expirations, usages, and groups).

* `kubeadm token create` - Create a new token.

    * `--description <description>`

      Set the human-readable description for the new token.

    * `--ttl <duration>`

      Set the expiration time-to-live of the token relative to the current time.
      Default is 24 hours. A value of 0 means "never expire". The default unit
      of the duration is seconds but other units can be specified (e.g., `15m`, `1h`).
-->

* `kubeadm token list` - 列出 token（包括过期时间，用途和组）。

* `kubeadm token create` - 创建新 token。

    * `--description <description>`

      为新的 token 设置易读的描述信息。

    * `--ttl <duration>`

      设置 token 相对于当前时间的到期生存时间。
      默认是 24 小时。0 值意味着“永不过期”。 时间单位默认是秒，也可以指定其他单位（例如`15m`，`1h`）。

<!--
    * `--usages <usage>[,<usage>...]`

      Set the ways that the token can be used.  The default is
      `signing,authentication`.  These are the usages as described above.

    * `--groups <group>[,<group>...]`

      Add extra bootstrap groups that the new token will authenticate as. Can be
      specified multiple times. Each extra group must start with
      `system:bootstrappers:`. This is an advanced feature meant for custom
      bootstrap scenarios where you want to change how CSR approval works for
      different groups of nodes.
-->

    * `--usages <usage>[,<usage>...]`

    设置 token 使用方式。  默认是 `signing,authentication`。  这些是如上所述的用法。

    * `--groups <group>[,<group>...]`

    添加用来验证新的 token 的额外的 bootstrap 组。可以指定多个。每个额外的组必须以 `system:bootstrappers:` 开头。这是一个高级功能，用于自定义 bootstrap 场景，在这些场景中，您可以为不同的节点组更改 CSR 验证。


<!--
* `kubeadm token delete <token id>|<token id>.<token secret>` - Delete a token.

  The token can either be identified with just an ID or with the
  entire token value.  Only the ID is used; the token is still deleted if the
  secret does not match.
-->

* `kubeadm token delete <token id>|<token id>.<token secret>` - 删除 token。

  token 可以仅用 ID 表示或者用 token 值表示。在只使用 ID 时，如果 secret 不匹配，token 仍然被删除。

<!--
* `kubeadm token generate` - Generate a token locally.

  Locally generate a token but do not create it on the server. This token is of
  the correct form for specifying with the `--token` argument to `kubeadm init`.

For the gory details on how the tokens are implemented (including managing them
outside of kubeadm) see the [Bootstrap Token docs](/docs/admin/bootstrap-tokens/).
-->

* `kubeadm token generate` - 在本地生成一个 token。

  本地生成一个 token，但不要在 server 上创建它。通过在 `kubeadm init` 时指定 `--token` 参数，生成正确的 token 格式。

有关 token 如何实现（包括在kubeadm之外管理它们）的详细信息，请参阅 [Bootstrap Token 文档](/docs/admin/bootstrap-tokens/)。

<!--
## Automating kubeadm

Rather than copying the token you obtained from `kubeadm init` to each node, as
in the [basic kubeadm tutorial](/docs/admin/kubeadm/), you can parallelize the
token distribution for easier automation. To implement this automation, you must
know the IP address that the master will have after it is started.
-->

## 自动化 kubeadm

您可以像在 [基础kubeadm教程](/docs/admin/kubeadm/) 中那样将从 `kubeadm init` 获得的 token 复制到每个节点，不同于上述方式，您可以将 token 分发并行化，以实现更简单的自动化部署。要实现个功能，您必须知道 master 启动后的 IP 地址。

<!--
1.  Generate a token. This token must have the form  `<6 character string>.<16
    character string>`.  More formally, it must match the regex:
    `[a-z0-9]{6}\.[a-z0-9]{16}`.

    kubeadm can generate a token for you:

    ```bash
    kubeadm token generate
    ```

1. Start both the master node and the worker nodes concurrently with this token.
   As they come up they should find each other and form the cluster.  The same
   `--token` argument can be used on both `kubeadm init` and `kubeadm join`.
-->

1. 生成一个 token。该 token 的格式必须遵循 `<6 character string>.<16
character string>`。

    kubeadm 为您生成一个 token:

        ```bash
        kubeadm token generate
        ```

1. 使用此 token 同时启动 master 节点和 worker 节点。
   这些节点在启动时，应该找到彼此并形成集群。在 `kubeadm init` 和 `kubeadm join` 上都可以使用相同的 `--token` 参数。

<!--
Once the cluster is up, you can grab the admin credentials from the master node
at `/etc/kubernetes/admin.conf` and use that to talk to the cluster.

Note that this style of bootstrap has some relaxed security guarantees because
it does not allow the root CA hash to be validated with
`--discovery-token-ca-cert-hash` (since it's not generated when the nodes are
provisioned). For details, see the [security model](#security-model).
-->

一旦集群启动，您可以从 master 上的 `/etc/kubernetes/admin.conf` 中的获取管理凭证，并使用它来与集群进行通信。


请注意，这种引导类型有一些宽松的安全保证，因为它不允许使用 `--discovery-token-ca-cert-hash` 验证根 CA哈希（因为它不是在节点设置时生成的）。有关详细信息，请参阅 [安全模型](#security-model)。

<!--
## Security model
The kubeadm discovery system has several options, each with security tradeoffs.
The right method for your environment depends on how you provision nodes and the
security expectations you have about your network and node lifecycles.
-->

## 安全模型

kubeadm discovery 系统有几个安全权衡的选项。适合环境的正确方法取决于您如何调配节点以及您对网络和节点生命周期的安全期望。

<!--
### Token-based discovery with CA pinning
_This is the default mode in Kubernetes 1.8._ In this mode, kubeadm downloads
the cluster configuration (including root CA) and validates it using the token
as well as validating that the root CA public key matches the provided hash and
that the API server certificate is valid under the root CA.
-->

### 使用固定 CA 的基于 token 的 discovery
_这是Kubernetes 1.8的默认模式。_ 在这种模式下，kubeadm 下载集群配置（包括根 CA），并使用 token 验证它，包括根 CA 公钥与提供的哈希是否匹配，API server 证书在根 CA 下是否有效。

<!--
**Example `kubeadm join` command:**

 - `kubeadm join --discovery-token abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234..cdef 1.2.3.4:6443`

**Advantages:**

 - Allows bootstrapping nodes to securely discover a root of trust for the
   master even if other worker nodes or the network are compromised.

 - Convenient to execute manually since all of the information required fits
   into a single `kubeadm join` command that is easy to copy and paste.
-->

**`kubeadm join` 例子：**

 - `kubeadm join --discovery-token abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234..cdef 1.2.3.4:6443`

**优势：**

 - 即使其他 worker 节点或网络受损，也允许引导新节点安全地发现 master 节点的信任根。
 - 方便手动执行，因为所有需要的信息都可以放入一个容易复制和粘贴的 `kubeadm join` 命令中。

<!--
**Disadvantages:**

 - The CA hash is not normally known until the master has been provisioned,
   which can make it more difficult to build automated provisioning tools that
   use kubeadm.
-->

**缺点：**

 - 通常，只有在 master 设置完成之后才能知道 CA 哈希，这可能会让使用 kubeadm 的自动配置工具变得更加困难。

<!--
### Token-based discovery without CA pinning
_This was the default in Kubernetes 1.7 and earlier_, but comes with some
important caveats. This mode relies only on the symmetric token to sign
(HMAC-SHA256) the discovery information that establishes the root of trust for
the master. It's still possible in Kubernetes 1.8 and above using the
`--discovery-token-unsafe-skip-ca-verification` flag, but you should consider
using one of the other modes if possible.
-->

### 不使用固定 CA 的基于 token 的 discovery
_这是 Kubernetes 1.7 和更早版本的默认值_，但有一些重要的注意事项。该模式仅依靠对称 toekn（HMAC-SHA256），为 master 建立信任根的 discovery 信息进行签名。在 Kubernetes 1.8 及更高版本中，仍然可以使用 `--discovery-token-unsafe-skip-ca-verification` 标志，但是如果可能的话，您应该考虑使用其他模式之一。

<!--
**Example `kubeadm join` command:**

 - `kubeadm join --discovery-token abcdef.1234567890abcdef --discovery-token-unsafe-skip-ca-verification 1.2.3.4:6443`

**Advantages:**

 - Still protects against many network-level attacks.

 - The token can be generated ahead of time and shared with the master and
   worker nodes, which can then bootstrap in parallel without coordination. This
   allows it to be used in many provisioning scenarios.
-->

**`kubeadm join`命令的例子：**

 - `kubeadm join --discovery-token abcdef.1234567890abcdef --discovery-token-unsafe-skip-ca-verification 1.2.3.4:6443`

**优势：**

 - 可以防止许多网络级别的攻击。

 -  token 可以提前生成并与 master 和 worker 间共享，然后不需要协调的情形下进行并行 bootstrap。这使得它可以在许多供应场景中使用。

<!--
**Disadvantages:**

 - If an attacker is able to steal a bootstrap token via some vulnerability,
   they can use that token (along with network-level access) to impersonate the
   master to other bootstrapping nodes. This may or may not be an appropriate
   tradeoff in your environment.
-->

**缺点：**

 - 如果攻击者能够通过某个漏洞窃取 bootstrap token，那么他们可以使用该 token（使用网络级别的访问），对其他引导的节点冒充 master。这在您的环境中可能需要适当地权衡。

<!--
### File or HTTPS-based discovery
This provides an out-of-band way to establish a root of trust between the master
and bootstrapping nodes.   Consider using this mode if you are building automated provisioning
using kubeadm.

**Example `kubeadm join` commands:**

 - `kubeadm join --discovery-file path/to/file.conf` (local file)

 - `kubeadm join --discovery-file https://url/file.conf` (remote HTTPS URL)
-->

### 基于文件或 HTTPS 的 discovery
这提供了一种外来的方式来建立 master 和 bootstrapping 节点之间的信任根。  如果使用 kubeadm 构建自动配置，请考虑使用此模式。

**`kubeadm join`命令的例子：**

 - `kubeadm join --discovery-file path/to/file.conf` (本地文件)

 - `kubeadm join --discovery-file https://url/file.conf` (远程 HTTPS 地址)

<!--
**Advantages:**

 - Allows bootstrapping nodes to securely discover a root of trust for the
   master even if other worker nodes or the network are compromised.
-->

**优势：**

 - 即使其他工作节点或网络受到威胁，也允许 bootstrapping nodes 安全地发现主节点的信任根。

<!--
**Disadvantages:**

 - Requires that you have some way to carry the discovery information from
   the master to the bootstrapping nodes. This might be possible, for example,
   via your cloud provider or provisioning tool. The information in this file is
   not secret, but HTTPS or equivalent is required to ensure its integrity.

 - Less convenient to use manually since the file is difficult to copy and paste
   between nodes.
-->

**缺点：**

 - 这需要您有一些方法将 discovery 信息从 master 传送到 bootstrapping nodes。这是可能的，例如，通过您的 cloud provider 或配置工具。该文件中的信息不是保密的，但可以使用 HTTPS 或等效的方式来确保其完整性。

  - 由于文件难以在节点之间复制和粘贴，所以手动使用不方便。

<!--
## Use kubeadm with other CRI runtimes

Since [Kubernetes 1.6 release](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md#node-components-1),
Kubernetes container runtimes have been transferred to using CRI by default.
Currently, the built-in container runtime is Docker which is enabled by built-in
`dockershim` in `kubelet`.
-->

## 使用其他 CRI runtimes 的 kubeadm
从 [Kubernetes 1.6 release](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md#node-components-1) 开始，Kubernetes 的容器 runtimes 默认已经转到使用 CRI 。
目前，内置的容器 runtime 是 Docker，它由 `kubelet` 中的内置 `dockershim` 启用。

<!--
Using other CRI based runtimes with kubeadm is very simple, and currently
supported runtimes are:

- [cri-o](https://github.com/kubernetes-incubator/cri-o)
- [frakti](https://github.com/kubernetes/frakti)
- [rkt](https://github.com/kubernetes-incubator/rktlet)
-->

在 kubeadm 中使用其他基于 CRI 的 runtimes 非常简单，目前支持的 runtimes 为：

- [cri-o](https://github.com/kubernetes-incubator/cri-o)
- [frakti](https://github.com/kubernetes/frakti)
- [rkt](https://github.com/kubernetes-incubator/rktlet)

<!--
After you have successfully installed `kubeadm` and `kubelet`, please follow
these two steps:

1. Install runtime shim on every node. You will need to follow the installation
   document in the runtime shim project listing above.

1. Configure kubelet to use remote CRI runtime. Please remember to change
   `RUNTIME_ENDPOINT` to your own value like `/var/run/{your_runtime}.sock`:

```shell
$ cat > /etc/systemd/system/kubelet.service.d/20-cri.conf <<EOF
Environment="KUBELET_EXTRA_ARGS=--container-runtime=remote --container-runtime-endpoint=$RUNTIME_ENDPOINT --feature-gates=AllAlpha=true"
EOF
$ systemctl daemon-reload
```
-->

成功安装 `kubeadm` 和 `kubelet` 后，请按照以下两个步骤操作：

1. 在每个节点上安装运行 runtime shim。您需要参照上面的 runtime shim 项目列表中的安装文档。

1. 配置 kubelet 以使用远程 CRI runtime。请记得像 `/var/run/{your_runtime}.sock` 一样将 `RUNTIME_ENDPOINT` 改成您自己的值：

```shell
$ cat > /etc/systemd/system/kubelet.service.d/20-cri.conf <<EOF
Environment="KUBELET_EXTRA_ARGS=--container-runtime=remote --container-runtime-endpoint=$RUNTIME_ENDPOINT --feature-gates=AllAlpha=true"
EOF
$ systemctl daemon-reload
```

<!--
Now `kubelet` is ready to use the specified CRI runtime, and you can continue
with `kubeadm init` and `kubeadm join` workflow to deploy Kubernetes cluster.
-->

现在 `kubelet ` 已准备好使用指定的 CRI runtime 了，您可以继续使用 `kubeadm init` 和 `kubeadm join` 工作流来部署 Kubernetes 集群。

<!--
## Using custom images {#custom-images}

By default, kubeadm will pull images from `gcr.io/google_containers`, unless
requested kubernetes version is a ci version; in this case
`gcr.io/kubernetes-ci-image` will be used.
-->

## 使用自定义 images {#custom-images}

默认情况下，kubeadm 会从 `gcr.io/google_containers` 中取出 images，除非请求的 kubernetes 版本是 ci 版本; 在这种情况下，将使用 `gcr.io/kubernetes-ci-image` 。

<!--
This behaviour can be overridden by [using kubeadm with a configuration file](#config-file).
Allowed customization are:

- provide an alternative `imageRepository` to be used instead of
  `gcr.io/google_containers` (NB. does not works for ci version)

- provide an `unifiedControlPlaneImage` to be used instead of single image
  for control plane components

- provide an `etcd.image` name to be used
-->

这个行为可以被 [使用 kubeadm 和配置文件](#config-file) 覆盖。
允许自定义如下：

- 提供其他的 `imageRepository` 来代替`gcr.io/google_containers`（注意：不适用于 ci 版本）

- 提供一个 `unifiedControlPlaneImage` 来代替 control plane 组件的单个 image

- 提供一个 `etcd.image` 的名字

<!--
## Running kubeadm without an internet connection

All of the control plane components run in Pods started by the kubelet and
the following images are required for the cluster works will be automatically
pulled by the kubelet if they don't exist locally while `kubeadm init` is initializing
your master:

| Image Name |  v1.7 release branch version | v1.8 release branch version
|---|---|---|
| gcr.io/google_containers/kube-apiserver-${ARCH} | v1.7.x | v1.8.x
| gcr.io/google_containers/kube-controller-manager-${ARCH} | v1.7.x | v1.8.x
| gcr.io/google_containers/kube-scheduler-${ARCH} | v1.7.x | v1.8.x
| gcr.io/google_containers/kube-proxy-${ARCH} | v1.7.x | v1.8.x
| gcr.io/google_containers/etcd-${ARCH} | 3.0.17 | 3.0.17
| gcr.io/google_containers/pause-${ARCH} | 3.0 | 3.0
| gcr.io/google_containers/k8s-dns-sidecar-${ARCH} | 1.14.4 | 1.14.4
| gcr.io/google_containers/k8s-dns-kube-dns-${ARCH} | 1.14.4 | 1.14.4
| gcr.io/google_containers/k8s-dns-dnsmasq-nanny-${ARCH} | 1.14.4 | 1.14.4

Here `v1.7.x` means the "latest patch release of the v1.7 branch".

`${ARCH}` can be one of: `amd64`, `arm`, `arm64`, `ppc64le` or `s390x`.
-->

### 在没有互联网下运行 kubeadm

所有的 control plane 组件都在 kubelet 启动的 Pod 中运行，并且以下 image 对于集群运行是必需的，在 `kubeadm init` 初始化集群时， 如果 image 不在本地，kubelet 会自动拉取它们：


| Image 名字 |  v1.7 发布分支版本 | v1.8 发布分支版本
|---|---|---|
| gcr.io/google_containers/kube-apiserver-${ARCH} | v1.7.x | v1.8.x
| gcr.io/google_containers/kube-controller-manager-${ARCH} | v1.7.x | v1.8.x
| gcr.io/google_containers/kube-scheduler-${ARCH} | v1.7.x | v1.8.x
| gcr.io/google_containers/kube-proxy-${ARCH} | v1.7.x | v1.8.x
| gcr.io/google_containers/etcd-${ARCH} | 3.0.17 | 3.0.17
| gcr.io/google_containers/pause-${ARCH} | 3.0 | 3.0
| gcr.io/google_containers/k8s-dns-sidecar-${ARCH} | 1.14.4 | 1.14.4
| gcr.io/google_containers/k8s-dns-kube-dns-${ARCH} | 1.14.4 | 1.14.4
| gcr.io/google_containers/k8s-dns-dnsmasq-nanny-${ARCH} | 1.14.4 | 1.14.4

<!--
## Managing the kubeadm drop-in file for the kubelet {#kubelet-drop-in}

The kubeadm deb package ships with configuration for how the kubelet should
be run. Note that the `kubeadm` CLI command will never touch this drop-in file.
This drop-in file belongs to the kubeadm deb/rpm package.
-->

## 管理 kubeadm 为 kubelet 生成的插件文件 {#kubelet-drop-in}

kubeadm deb 软件包提供了 kubelet 如何运行的配置。请注意，`kubeadm` CLI 命令永远不会创建这个文件。此插件文件属于 kubeadm deb/rpm 软件包。

<!--
This is what it looks like in v1.7:

```
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--kubeconfig=/etc/kubernetes/kubelet.conf --require-kubeconfig=true"
Environment="KUBELET_SYSTEM_PODS_ARGS=--pod-manifest-path=/etc/kubernetes/manifests --allow-privileged=true"
Environment="KUBELET_NETWORK_ARGS=--network-plugin=cni --cni-conf-dir=/etc/cni/net.d --cni-bin-dir=/opt/cni/bin"
Environment="KUBELET_DNS_ARGS=--cluster-dns=10.96.0.10 --cluster-domain=cluster.local"
Environment="KUBELET_AUTHZ_ARGS=--authorization-mode=Webhook --client-ca-file=/etc/kubernetes/pki/ca.crt"
Environment="KUBELET_CADVISOR_ARGS=--cadvisor-port=0"
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_SYSTEM_PODS_ARGS $KUBELET_NETWORK_ARGS $KUBELET_DNS_ARGS $KUBELET_AUTHZ_ARGS $KUBELET_CADVISOR_ARGS $KUBELET_EXTRA_ARGS
```
-->

这是在 v1.7 中的样子：


```
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--kubeconfig=/etc/kubernetes/kubelet.conf --require-kubeconfig=true"
Environment="KUBELET_SYSTEM_PODS_ARGS=--pod-manifest-path=/etc/kubernetes/manifests --allow-privileged=true"
Environment="KUBELET_NETWORK_ARGS=--network-plugin=cni --cni-conf-dir=/etc/cni/net.d --cni-bin-dir=/opt/cni/bin"
Environment="KUBELET_DNS_ARGS=--cluster-dns=10.96.0.10 --cluster-domain=cluster.local"
Environment="KUBELET_AUTHZ_ARGS=--authorization-mode=Webhook --client-ca-file=/etc/kubernetes/pki/ca.crt"
Environment="KUBELET_CADVISOR_ARGS=--cadvisor-port=0"
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_SYSTEM_PODS_ARGS $KUBELET_NETWORK_ARGS $KUBELET_DNS_ARGS $KUBELET_AUTHZ_ARGS $KUBELET_CADVISOR_ARGS $KUBELET_EXTRA_ARGS
```

<!--
A breakdown of what/why:

* `--kubeconfig=/etc/kubernetes/kubelet.conf` points to the kubeconfig file that
   tells the kubelet where the API server is. This file also has the kubelet's
   credentials.
* `--require-kubeconfig=true` the kubelet should fail fast if the kubeconfig file
   is not present. This makes the kubelet crash loop during the time the service is
   started until `kubeadm init` is run.
* `--pod-manifest-path=/etc/kubernetes/manifests` specifies from where to read
   Static Pod manifests used for spinning up the control plane
* `--allow-privileged=true` allows this kubelet to run privileged Pods
* `--network-plugin=cni` uses CNI networking
* `--cni-conf-dir=/etc/cni/net.d` specifies where to look for the
   [CNI spec file(s)](https://github.com/containernetworking/cni/blob/master/SPEC.md)
* `--cni-bin-dir=/opt/cni/bin` specifies where to look for the actual CNI binaries
* `--cluster-dns=10.96.0.10` use this cluster-internal DNS server for `nameserver`
   entries in Pods' `/etc/resolv.conf`
* `--cluster-domain=cluster.local` uses this cluster-internal DNS domain for
   `search` entries in Pods' `/etc/resolv.conf`
* `--client-ca-file=/etc/kubernetes/pki/ca.crt` authenticates requests to the Kubelet
   API using this CA certificate.
* `--authorization-mode=Webhook` authorizes requests to the Kubelet API by `POST`-ing
   a `SubjectAccessReview` to the API Server
* `--cadvisor-port=0` disables cAdvisor from listening to `0.0.0.0:4194` by default.
   cAdvisor will still be run inside of the kubelet and its API can be accessed at
   `https://{node-ip}:10250/stats/`. If you want to enable cAdvisor to listen on a
   wide-open port, run:

   ```
   sed -e "/cadvisor-port=0/d" -i /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
   systemctl daemon-reload
   systemctl restart kubelet
   ```
-->

各字段解释说明：

* `--kubeconfig=/etc/kubernetes/kubelet.conf` 指向 kubeconfig 文件，告诉 kubelet API server 的地址。该文件也包括 kubelet 的凭证。
* `--require-kubeconfig=true` 如果 kubeconfig 文件不存在，kubelet 启动会迅速失败。这使得 kubelet 在服务启动期间崩溃循环直到 `kubeadm init` 运行。
* `--pod-manifest-path=/etc/kubernetes/manifests` 指定从何处读取用于运转 control plane 的静态 Pod 清单。
* `--allow-privileged=true` 允许这个 kubelet 运行特权 Pods。
* `--network-plugin = cni` 使用 CNI 网络。
* `--cni-conf-dir=/etc/cni/net.d` 指定在哪里查找  [CNI 配置文件](https://github.com/containernetworking/cni/blob/master/SPEC.md)
* `--cni-bin-dir=/opt/cni/bin` 指定在哪里查找实际的 CNI 二进制文件。
* `--cluster-dns=10.96.0.10` 使用这个集群内部的 DNS 服务器作为 Pods 中 `/etc/resolv.conf` 的 `nameserver` 条目。
* `--cluster-domain=cluster.local` 使用这个集群内部的 DNS 域作为 Pods 中的 `/etc/resolv.conf` 的 `search` 条目。
* `--client-ca-file=/etc/kubernetes/pki/ca.crt` 使用此 CA 证书验证对 Kubelet API 的请求。
* `--authorization-mode=Webhook` 通过向 API Server `POST` 一个 `SubjectAccessReview`，授权对 Kubelet API 的请求。
* `--cadvisor-port=0` 在默认情况下禁止 cAdvisor 监听 `0.0.0.0:4194` 。cAdvisor 仍然在 kubelet 内运行，其 API 可以通过 `https://{node-ip}:10250/stats/` 进行访问。如果您希望启用 cAdvisor 并在开放的端口上侦听，运行:

```
sed -e "/cadvisor-port=0/d" -i /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
systemctl daemon-reload
systemctl restart kubelet
```

<!--
## Cloud provider integrations (experimental)

Enabling specific cloud providers is a common request. This currently requires
manual configuration and is therefore not yet fully supported. If you wish to do
so, edit the kubeadm drop-in for the kubelet service
(`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`) on all nodes,
including the master. If your cloud provider requires any extra packages
installed on the host, for example for volume mounting/unmounting, install those
packages.
-->

## Cloud provider 整合 (试验)

启用特定的 Cloud provider 是常见的需求。目前这需要手动配置，因此还没有完全支持。如果您希望这样做，请在所有节点（包括 master 节点）上编辑 kubelet 服务（`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`）。如果您的 Cloud provider 需要在主机上安装任何额外的软件包，例如卷的安装/卸载，请安装这些软件包。

<!--
Specify the `--cloud-provider` flag for the kubelet and set it to the cloud of your
choice. If your cloud provider requires a configuration file, create the file
`/etc/kubernetes/cloud-config` on every node. The exact format and content of
that file depends on the requirements imposed by your cloud provider. If you use
the `/etc/kubernetes/cloud-config` file, you must append it to the kubelet
arguments as follows: `--cloud-config=/etc/kubernetes/cloud-config`
-->

为 kubelet 指定 `--cloud-provider` 标识，并将其设置为您选择的云。如果您的 cloud provider 需要配置文件，请在每个节点上创建文件 `/etc/kubernetes/cloud-config`。该文件的确切格式和内容取决于您的 cloud provider 的要求。如果使用 `/etc/kubernetes/cloud-config` 文件，则必须将其附加到 kubelet 参数中，如下所示：`--cloud-config=/etc/kubernetes/cloud-config`

<!--
Note that there is most likely other per-provider configuration that may be needed
(IAM roles for AWS) that is currently underdocumented.
-->

请注意，每种 provider 很可能需要其他的配置（例如 AWS 的 IAM 角色配置），这些当前未被文档化。

<!--
Next, specify the cloud provider in the kubeadm config file.  Create a file called
`kubeadm.conf` with the following contents:

``` yaml
kind: MasterConfiguration
apiVersion: kubeadm.k8s.io/v1alpha1
cloudProvider: <cloud provider>
```
-->

接下来，在 kubeadm 配置文件中指定 cloud provider。  使用以下内容创建一个名为 `kubeadm.conf` 的文件：

``` yaml
kind: MasterConfiguration
apiVersion: kubeadm.k8s.io/v1alpha1
cloudProvider: <cloud provider>
```

<!--
Lastly, run `kubeadm init --config=kubeadm.conf` to bootstrap your cluster with
the cloud provider.

This workflow is not yet fully supported, however we hope to make it extremely
easy to spin up clusters with cloud providers in the future. (See [this
proposal](https://github.com/kubernetes/community/pull/128) for more
information) The [Kubelet Dynamic
Settings](https://github.com/kubernetes/kubernetes/pull/29459) feature may also
help to fully automate this process in the future.
-->

最后，运行 `kubeadm init --config=kubeadm.conf` 来 bootstrap 您在 cloud provider 上集群。

这个工作流程还不完全受支持，但是我们希望将来可以非常容易地与 cloud providers 建立集群。（有关更多信息，请参阅 [此提案](https://github.com/kubernetes/community/pull/128)）。[Kubelet 动态设置](https://github.com/kubernetes/kubernetes/pull/29459) 功能也可能在将来完全自动化这个过程。


<!--
## Environment variables

**Note:** These environment variables are deprecated and will stop functioning in v1.8!

There are some environment variables that modify the way that kubeadm works.
Most users will have no need to set these. These environment variables are a
short-term solution, eventually they will be integrated in the kubeadm
configuration file.
-->

## 环境变量

**注意：** 这些环境变量已被弃用，并将在 v1.8 停止运作！

有一些环境变量可以修改 kubeadm 的工作方式。大多数用户不需要设置这些。这些环境变量是一个短期解决方案，最终它们将被集成到 kubeadm 配置文件中。

<!--
| Variable               | Default                                       | Description                              |
| ---------------------- | --------------------------------------------- | ---------------------------------------- |
| `KUBE_KUBERNETES_DIR`  | `/etc/kubernetes`                             | Where most configuration files are written to and read from |
| `KUBE_HYPERKUBE_IMAGE` |                                               | If set, use a single hyperkube image with this name. If not set, individual images per server component will be used. |
| `KUBE_ETCD_IMAGE`      | `gcr.io/google_containers/etcd-<arch>:3.0.17` | The etcd container image to use. |
| `KUBE_REPO_PREFIX`     | `gcr.io/google_containers`                    | The image prefix for all images that are used. |
-->

| 变量               | 默认值                                       | 描述                              |
| ---------------------- | --------------------------------------------- | ---------------------------------------- |
| `KUBE_KUBERNETES_DIR`  | `/etc/kubernetes`                             | 大部分配置文件写入和读取的位置。 |
| `KUBE_HYPERKUBE_IMAGE` |                                               | 如果设置，使用 hyperkube image 的名字。如果未设置，则每个服务器组件使用单独的 image。 |
| `KUBE_ETCD_IMAGE`      | `gcr.io/google_containers/etcd-<arch>:3.0.17` | etcd container 的 image 名字。 |
| `KUBE_REPO_PREFIX`     | `gcr.io/google_containers`                    | 所有 image 使用的前缀。 |

<!--
If `KUBE_KUBERNETES_DIR` is specified, you may need to rewrite the arguments of the kubelet.
(e.g. --kubeconfig, --pod-manifest-path)

If `KUBE_REPO_PREFIX` is specified, you may need to set the kubelet flag
`--pod-infra-container-image` which specifies which pause image to use.
-->

如果指定了 `KUBE_KUBERNETES_DIR`，则可能需要重写 kubelet 的参数。（例如，--kubeconfig, --pod-manifest-path）

如果指定了 `KUBE_REPO_PREFIX`，则可能需要为 kubelet 设置标识 `--pod-infra-container-image`，它指定使用的 pause image。

<!--
Defaults to `gcr.io/google_containers/pause-${ARCH}:3.0` where `${ARCH}`
can be one of `amd64`, `arm`, `arm64`, `ppc64le` or `s390x`.

```bash
cat > /etc/systemd/system/kubelet.service.d/20-pod-infra-image.conf <<EOF
[Service]
Environment="KUBELET_EXTRA_ARGS=--pod-infra-container-image=<your-image>"
EOF
systemctl daemon-reload
systemctl restart kubelet
```
-->

默认为  `gcr.io/google_containers/pause-${ARCH}:3.0`，`${ARCH}` 可以是 `amd64`, `arm`, `arm64`, `ppc64le` 或 `s390x` 之一。

```bash
cat > /etc/systemd/system/kubelet.service.d/20-pod-infra-image.conf <<EOF
[Service]
Environment="KUBELET_EXTRA_ARGS=--pod-infra-container-image=<your-image>"
EOF
systemctl daemon-reload
systemctl restart kubelet
```

<!--
If you want to use kubeadm with an http proxy, you may need to configure it to
support http_proxy, https_proxy, or no_proxy.
-->

如果要通过 http 代理使用 kubeadm，则可能需要将其配置成支持 http_proxy，https_proxy 或 no_proxy。

<!--
For example, if your kube master node IP address is 10.18.17.16 and you have a
proxy which supports both http/https on 10.18.17.16 port 8080, you can use the
following command:

```bash
export PROXY_PORT=8080
export PROXY_IP=10.18.17.16
export http_proxy=http://$PROXY_IP:$PROXY_PORT
export HTTP_PROXY=$http_proxy
export https_proxy=$http_proxy
export HTTPS_PROXY=$http_proxy
export no_proxy="localhost,127.0.0.1,localaddress,.localdomain.com,example.com,10.18.17.16"
```

Remember to change `proxy_ip` and add a kube master node IP address to
`no_proxy`.
-->

例如，如果 kube master IP 地址为 10.18.17.16，并且您有一个同时支持在 10.18.17.16 端口 8080 上的 http/https 代理，则可以使用以下命令：

```bash
export PROXY_PORT=8080
export PROXY_IP=10.18.17.16
export http_proxy=http://$PROXY_IP:$PROXY_PORT
export HTTP_PROXY=$http_proxy
export https_proxy=$http_proxy
export HTTPS_PROXY=$http_proxy
export no_proxy="localhost,127.0.0.1,localaddress,.localdomain.com,example.com,10.18.17.16"
```

请记得更改 `proxy_ip` 并将 kube master IP 地址添加到 `no_proxy`。

<!--
## Using custom certificates {#custom-certificates}

By default kubeadm will generate all the certificates needed for a cluster to run.
You can override this behaviour by providing your own certificates.

To do so, you must place them in whatever directory is specified by the
`--cert-dir` flag or `CertificatesDir` configuration file key. By default this
is `/etc/kubernetes/pki`.
-->

## 使用自定义的证书  {#custom-certificates}

默认情况下，kubeadm 生成集群运行所需的所有证书。您可以通过提供自己的证书来覆盖此行为。

为此，您必须将它们放置在 `--cert-dir` 标识或 `CertificatesDir` 配置文件密钥所指定的任何目录中。默认情况下路径是 `/etc/kubernetes/pki`。

<!--
If a given certificate and private key pair both exist, kubeadm will skip the
generation step and those files will be validated and used for the prescribed
use-case.

This means you can, for example, prepopulate `/etc/kubernetes/pki/ca.crt`
and `/etc/kubernetes/pki/ca.key` with an existing CA, which then will be used
for signing the rest of the certs.
-->

如果给定的证书和私钥对都存在，kubeadm 会跳过生成步骤，这些文件将被验证并用于规定的用户实例。

这意味着您可以这样操作，例如，用现有的 CA 预填充 `/etc/kubernetes/pki/ca.crt` 和 `/etc/kubernetes/pki/ca.key`，然后用它来签署其余的证书。

<!--
Only for the CA, it is possible to provide the `ca.crt` file but not the `ca.key`
file; if all other certificates and kubeconfig files already are in place kubeadm
recognise this condition and activates the so called "ExternalCA" mode, which also
implies the csrsignercontroller in controller-manager won't be started.
-->

针对 CA，可以只提供 `ca.crt` 文件，而不需要 `ca.key` 文件；如果所有其他证书和 kubeconfig 文件已经存在，kubeadm 就会识别这种情况并激活所谓的 "ExternalCA" 模式，这也意味着 controller-manager 中的 csrsignercontroller 将不会启动。

<!--
## Self-hosting the Kubernetes control plane  {#self-hosting}
As of 1.8, kubeadm can experimentally create a _self-hosted_ Kubernetes control
plane. This means that key components such as the API server, controller
manager, and scheduler run as [DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/)
configured via the Kubernetes API instead of [static pods](/docs/tasks/administer-cluster/static-pod/)
configured in the kubelet via static files.
-->

## 自托管 Kubernetes control plane {#self-hosting}
从1.8开始，kubeadm 可以通过实验性地创建一个 _self-hosted_ Kubernetes control plane。这意味着 API server，controller manager 和 scheduler 等关键组件都通过 Kubernetes API 作为 [DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/) 运行， 而不是通过在 kubelet 中配置的静态文件 [static pods](/docs/tasks/administer-cluster/static-pod/) 运行。

<!--
Self-hosting is alpha in kubeadm 1.8 but is expected to become the default in
a future version. To create a self-hosted cluster, pass the `--feature-gates=SelfHosting=true`
flag to `kubeadm init`.
-->

自托管在 kubeadm 1.8 中处于 alpha 版，但在未来有望成为版本的默认设置。要创建自托管集群，请将 `--feature-gates=SelfHosting=true` 标识传递给 `kubeadm init`。

<!--
#### Caveats
Kubeadm self-hosting in 1.8 has some important limitations. In particular, a
self-hosted cluster cannot currently recover from a reboot of the master node
without manual intervention. This and other limitations are expected to be
resolved before self-hosting graduates from alpha.
-->

#### 警告
1.8 中的 Kubeadm 自托管有一些重要的限制。特别地，在没有手动介入的情况下，目前的自托管集群无法从 master 的重启中恢复。这将和另外一些限制一起被解决，在自托管从 alpha 版中完全受支持之前。

<!--
By default, self-hosted control plane pods rely on credentials loaded from
[`hostPath`](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath)
volumes. Except for initial creation, these credentials are not managed by
kubeadm. You can use `--feature-gates=StoreCertsInSecrets=true` to enable an
experimental mode where control plane credentials are loaded from Secrets
instead. This requires very careful control over the authentication and
authorization configuration for your cluster, and may not be appropriate for
your environment.
-->

默认情况下，自托管的 control plane pods 依赖于从 [`hostPath`](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath) 卷挂载的凭证。除了初始化创建外，这些凭证不由 kubeadm 管理。您可以使用 `--feature-gates=StoreCertsInSecrets=true` 来启用一个实验模式，在该模式下 control plane 从 Secrets 加载凭证。这需要非常小心地控制集群的身份验证和授权配置，所以这可能不适合您的环境。

<!--
In 1.8, the self-hosted portion of the control plane does not include etcd,
which still runs as a static pod.
-->

在 1.8 中，control plane 的自托管部分不包括 etcd，它仍然作为静态的 pod 运行。

<!--
#### Process
The self-hosting bootstrap process is documented in [the kubeadm 1.8 design
document](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.8.md#optional-self-hosting).
In summary, `kubeadm init --feature-gates=SelfHosting=true` works as follows:
-->

#### 过程
自托管的 bootstrap 过程记录在 [kubeadm 1.8 设计文档](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.8.md#optional-self-hosting) 中。
简言概之，`kubeadm init --feature-gates=SelfHosting=true` 的工作原理如下：

<!--
  1. As usual, kubeadm creates static pod YAML files in `/etc/kubernetes/manifests/`.

  1. Kubelet loads these files and launches the initial static control plane.
    Kubeadm waits for this initial static control plane to be running and
    healthy. This is identical to the `kubeadm init` process without self-hosting.

  1. Kubeadm uses the static control plane pod manifests to construct a set of
    DaemonSet manifests that will run the self-hosted control plane.

  1. Kubeadm creates DaemonSets in the `kube-system` namespace and waits for the
    resulting pods to be running.

  1. Once the new control plane is running (but not yet active), kubeadm deletes
    the static pod YAML files. This triggers kubelet to stop those static pods.

  1. When the original static control plane stops, the new self-hosted control
    plane is able to bind to listening ports and become active.
-->

  1. 像往常一样，kubeadm 在 `/etc/kubernetes/manifests/` 中创建静态的 pod YAML 文件。

  1. Kubelet 加载这些文件并启动初始静态 control plane。Kubeadm 等待这个最初的 control plane 健康运行。这与没有自托管的 `kubeadm init` 进程相同。

  1. Kubeadm 使用静态 control plane pod manifests 来构建一组运行在自托管 control plane 的 DaemonSet manifests。

  1. Kubeadm 在 `kube-system` 命名空间中创建 DaemonSet，并等待生成的的 Pod 运行。

  1. 一旦新的 control plane 正在运行（但尚未激活），kubeadm 将删除静态 pod YAML文件。这会触发 kubelet 停止那些静态 pods。

  1. 当初始的 control plane 停止时，新的 control plane 能够绑定到侦听端口并激活。

<!--
This process (steps 3-6) can also be triggered with `kubeadm phase selfhosting convert-from-staticpods`.
-->

这个过程（步骤3-6）也可以通过 `kubeadm phase selfhosting convert-from-staticpods` 触发。

<!--
## Customising the control plane with custom arguments {#custom-args}

If you would like to override or extend the behaviour of a control plane component, you can provide
extra arguments to kubeadm. When the component is deployed, it will use these additional arguments _in its
pod command_.
-->

## 使用自定义参数自定义 control plane {#custom-args}

如果您想要覆盖或扩展 control plane 组件的行为，可以为 kubeadm 提供额外的参数。部署组件时，它将在 _在 pod 命令_ 中使用这些附加参数。

<!--
For example, to add flag `--feature-gates=APIResponseCompression=true` to kube-apiserver, your [configuration file](#sample-master-configuration)
will need to look like this:

```
apiVersion: kubeadm.k8s.io/v1alpha1
kind: MasterConfiguration
apiServerExtraArgs:
   feature-gates: APIResponseCompression=true
```

To customise the scheduler or controller-manager, use `schedulerExtraArgs` and `controllerManagerExtraArgs` respectively.

More information on custom arguments can be found here:

- [kube-apiserver](https://kubernetes.io/docs/admin/kube-apiserver/)
- [kube-controller-manager](https://kubernetes.io/docs/admin/kube-controller-manager/)
- [kube-scheduler](https://kubernetes.io/docs/admin/kube-scheduler/)
-->

例如，要向 kube apiserver 添加标识 `--feature-gates=APIResponseCompression=true` ，您的 [配置文件](#sample-master-configuration) 将需要如下所示：

```
apiVersion: kubeadm.k8s.io/v1alpha1
kind: MasterConfiguration
apiServerExtraArgs:
   feature-gates: APIResponseCompression=true
```

要定制 scheduler 或 controller-manager，分别使用 `schedulerExtraArgs`和 `controllerManagerExtraArgs`。

有关自定义参数的更多信息可以在这里找到：

- [kube-apiserver](https://kubernetes.io/docs/admin/kube-apiserver/)
- [kube-controller-manager](https://kubernetes.io/docs/admin/kube-controller-manager/)
- [kube-scheduler](https://kubernetes.io/docs/admin/kube-scheduler/)

<!--
## Releases and release notes

If you already have kubeadm installed and want to upgrade, run `apt-get update
&& apt-get upgrade` or `yum update` to get the latest version of kubeadm.

Refer to the
[CHANGELOG.md](https://git.k8s.io/kubeadm/CHANGELOG.md)
for more information.
-->

## 发布和说明

如果您已经安装了 kubeadm 并且想升级，运行 `apt-get update && apt-get upgrade` 或者 `yum update` 来获取最新版本的 kubeadm。

有关更多信息，请参阅 [CHANGELOG.md](https://git.k8s.io/kubeadm/CHANGELOG.md)。
