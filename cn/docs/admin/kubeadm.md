---
cn-approver:
- tianshapjq
assignees:
- mikedanese
- luxas
- errordeveloper
- jbeda
title: kubeadm 设置工具参考指南
---
<!--
---
assignees:
- mikedanese
- luxas
- errordeveloper
- jbeda
title: kubeadm Setup Tool Reference Guide
---
-->

<!--
This document provides information on how to use kubeadm's advanced options.

Running `kubeadm init` bootstraps a Kubernetes cluster. This consists of the
following steps:
-->
本文档提供有关如何使用 kubeadm 高级选项的信息。

运行 `kubeadm init` 引导一个 Kubernetes 集群。这包括了以下步骤：

<!--
1. kubeadm runs a series of pre-flight checks to validate the system state
   before making changes. Some checks only trigger warnings, others are
   considered errors and will exit kubeadm until the problem is corrected or the
   user specifies `--skip-preflight-checks`.
-->
1. 在进行更改之前，kubeadm 运行一系列检查以验证系统状态。一些检查只会触发警告，有些检查会被视为错误并会退出 kubeadm，直到问题得到解决或用户指定了 `--skip-preflight-checks`。

<!--
1. kubeadm generates a token that additional nodes can use to register
   themselves with the master in future.  Optionally, the user can provide a
   token.
-->
1. kubeadm 将生成一个 token，以便其它 node 可以用来注册到 master 中。用户也可以选择自己提供一个 token。

<!--
1. kubeadm generates a self-signed CA to provision identities for each component
   (including nodes) in the cluster.  It also generates client certificates to
   be used by various components.  If the user has provided their own CA by
   dropping it in the cert directory (configured via `--cert-dir`, by default
   `/etc/kubernetes/pki`), this step is skipped.
-->
1. kubeadm 将生成一个自签名 CA 来为每个组件设置身份（包括 node）。它也生成客户端证书以便各种组件可以使用。如果用户已经提供了自己的 CA 并将其放入 cert 目录（通过 `--cert-dir` 配置，默认路径为 `/etc/kubernetes/pki`），则跳过此步骤。

<!--
1. Outputting a kubeconfig file for the kubelet to use to connect to the API
   server, as well as an additional kubeconfig file for administration.
-->
1. 输出一个 kubeconfig 文件以便 kubelet 能够使用这个文件来连接到 API server，以及一个额外的 kubeconfig 文件以作管理用途。

<!--
1. kubeadm generates Kubernetes static Pod manifests for the API server,
   controller manager and scheduler.  It places them in
   `/etc/kubernetes/manifests`. The kubelet watches this directory for Pods to
   create on startup. These are the core components of Kubernetes. Once they are
   up and running kubeadm can set up and manage any additional components.
-->
1. kubeadm 将会为 API server、controller manager 和 scheduler 生成 Kubernetes 的静态 Pod manifest 文件，并将这些文件放入 `/etc/kubernetes/manifests` 中。Kubelet 将会监控这个目录，以便在启动时创建 pod。这些都是 Kubernetes 的关键组件，一旦它们启动并正常运行后，kubeadm 就能启动和管理其它额外的组件了。

<!--
1. kubeadm "taints" the master node so that only control plane components will
   run there.  It also sets up the RBAC authorization system and writes a
   special ConfigMap that is used to bootstrap trust with the kubelets.
-->
1. kubeadm 将会给 master 节点 "taint" 标签，以让控制平面组件只运行在这个节点上。它还建立了 RBAC 授权系统，并创建一个特殊的 ConfigMap 用来引导与 kubelet 的互信连接。

<!--
1. kubeadm installs add-on components via the API server.  Right now this is
   the internal DNS server and the kube-proxy DaemonSet.
-->
1. kubeadm 通过 API server 安装插件组件。目前这些组件有内部的 DNS server 和 kube-proxy DaemonSet。

<!--
Running `kubeadm join` on each node in the cluster consists of the following
steps:
-->
在集群的各 node 上运行 `kubeadm join` 包含以下步骤：

<!--
1. kubeadm downloads root CA information from the API server.  It uses the token
   to verify the authenticity of that data.
-->
1. kubeadm 从 API server 下载根 CA 信息。它使用 token 来验证数据的真实性。

<!--
1. kubeadm creates a local key pair.  It prepares a certificate signing request
   (CSR) and sends that off to the API server for signing.  The bootstrap token
   is used to authenticate.  The control plane will sign this CSR requested
   automatically.
-->
1. kubeadm 创建一个本地密钥对。它准备一个证书签名请求（CSR）并将其发送到 API server 进行签名。bootstrap token 用于验证。控制平面将自动签署这个 CSR 请求。

<!--
1. kubeadm configures the local kubelet to connect to the API server
-->
1. kubeadm 配置本地 kubelet 以连接到 API server。

<!--
## Usage
-->
## 使用

<!--
Fields that support multiple values do so either with comma separation, or by
specifying the flag multiple times.

The kubeadm command line interface is currently in **beta**.  We are aiming to
not break any scripted use of the main `kubeadm init` and `kubeadm join`.  The
single exception here is the format of the kubeadm config file as detailed
below.  That format is still considered alpha and may change.
-->
支持多个值的字段要么用逗号分隔，要么多次指定这个参数。

kubeadm 命令行接口目前处于 **beta** 阶段，我们致力于不破坏 `kubeadm init` 和 `kubeadm join` 脚本的使用。但是以下的 kubeadm 配置文件可能是一个例外，因为这个文件格式目前仍然是 alpha 阶段并且很可能会发生改变。

### `kubeadm init`

<!--
It is usually sufficient to run `kubeadm init` without any flags, but in some
cases you might like to override the default behaviour. Here we specify all the
flags that can be used to customise the Kubernetes installation.
-->
通常情况下，不需要添加其它参数直接运行 `kubeadm init` 已经足够了，但是在一些情况下您可能想要重写默认行为。以下我们列出能够用来自定义 Kubernetes 安装的所有参数。

- `--apiserver-advertise-address`

<!--
This is the address the API Server will advertise to other members of the
cluster.  This is also the address used to construct the suggested `kubeadm
join` line at the end of the init process.  If not set (or set to 0.0.0.0) then
IP for the default interface will be used.
-->
这是 API server 用来告知集群中其它成员的地址，这也是在 init 流程的时候用来构建 `kubeadm join` 命令行的地址。如果不设置（或者设置为 0.0.0.0）那么将使用默认接口的 IP 地址。

<!--
This address is also added to the certifcate that the API Server uses.
-->
该地址也被添加到 API Server 使用的证书中。

- `--apiserver-bind-port`

<!--
The port that the API server will bind on.  This defaults to 6443.
-->
API server 将绑定的端口。默认为 6443。

- `--apiserver-cert-extra-sans`

<!--
Additional hostnames or IP addresses that should be added to the Subject
Alternate Name section for the certificate that the API Server will use.  If you
expose the API Server through a load balancer and public DNS you could specify
this with
-->
一些额外的 hostname 或者 IP 地址，应添加到 API Server 将使用到的证书中的 Subject Alternate Name 章节。如果您通过负载均衡和公共 DNS 来暴露 API Server 服务，那么您可以指定如下

```
--apiserver-cert-extra-sans=kubernetes.example.com,kube.example.com,10.100.245.1
```

- `--cert-dir`

<!--
The path where to save and store the certificates.  The default is
"/etc/kubernetes/pki".
-->
存储证书的路径。默认为 "/etc/kubernetes/pki"。

- `--config`

<!--
A kubeadm specific [config file](#config-file).  This can be used to specify an
extended set of options including passing arbitrary command line flags to the
control plane components.

**Note**: When providing configuration values using _both_ a configuration file
and flags, the file will take precedence. For example, if a file exists with:
-->
kubeadm 指定的 [配置文件](#config-file)。这可以用来指定一个扩展的选项集，包括传递任意命令行标志到控制平面组件。

**注意**：如果使用配置文件 _和_ 参数来提供配置值，那么将优先使用文件。例如，如果存在以下配置文件：

```yaml
apiVersion: kubeadm.k8s.io/v1alpha1
kind: MasterConfiguration
token: 1234
```

<!--
and the user ran `kubeadm init --config file.yaml --token 5678`,
the chosen token value will be `1234`.
-->
并且用户运行了 `kubeadm init --config file.yaml --token 5678` 命令，那么 token 值将为 `1234`。


- `--kubernetes-version` (default 'latest') the kubernetes version to initialise

<!--
The **v1.6** version of kubeadm only supports building clusters that are at
least **v1.6.0**.  There are many reasons for this including kubeadm's use of
RBAC, the Bootstrap Token system, and enhancements to the Certificates API. With
this flag you can try any future version of Kubernetes.  Check [releases
page](https://github.com/kubernetes/kubernetes/releases) for a full list of
available versions.
-->
**v1.6** 版本的 kubeadm 只支持至少 **v1.6.0** 版本的集群构建。这有很多原因，包括 kubeadm 对 RBAC 的使用，Bootstrap Token 系统和对 Certificates API 的增强。通过这个参数您可以尝试 Kubernetes 的更新的版本。参阅 [发布页面](https://github.com/kubernetes/kubernetes/releases) 来获得完整的可用版本列表。

- `--pod-network-cidr`

<!--
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
对于某些网络解决方案，Kubernetes master 也可以为每个节点分配网络范围（CIDR），这包括一些云提供商和 flannel。通过 `--pod-network-cidr` 参数指定的子网范围将被分解并发送给每个 node。这个范围应该使用最小的 /16，以让 controller-manager 能够给集群中的每个 node 分配 /24 的子网。如果您是通过 [这个 manifest 文件](https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml) 来使用 flannel，那么您应该使用 `--pod-network-cidr=10.244.0.0/16`。大部分基于 CNI 的网络解决方案都不需要这个参数。

<!--
- `--service-cidr` (default '10.96.0.0/12')
-->
- `--service-cidr` (默认 '10.96.0.0/12')

<!--
You can use the `--service-cidr` flag to override the subnet Kubernetes uses to
assign pods IP addresses. If you do, you will also need to update the
`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` file to reflect this
change else DNS will not function correctly.
-->
您可以通过使用 `--service-cidr` 参数来覆盖 Kubernetes 用来分配 pod IP 地址的子网。如果您这么做了，那么您还需要更新 `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` 文件来反映这个修改，否则 DNS 将无法正常工作。

<!--
- `--service-dns-domain` (default 'cluster.local')
-->
- `--service-dns-domain` (默认 'cluster.local')

<!--
By default, `kubeadm init` deploys a cluster that assigns services with DNS
names `<service_name>.<namespace>.svc.cluster.local`. You can use the
`--service-dns-domain` to change the DNS name suffix. Again, you will need to
update the `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` file
accordingly else DNS will not function correctly.
-->
默认情况下，`kubeadm init` 部署的集群会给服务分配 DNS 名称，格式为 `<service_name>.<namespace>.svc.cluster.local`。您可以使用 `--service-dns-domain` 来修改这个 DNS 名称的后缀。同样地，您也需要根据修改更新 `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` 文件，否则 DNS 将无法正常工作。

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
**注意**：

- `--skip-preflight-checks`

<!--
By default, kubeadm runs a series of preflight checks to validate the system
before making any changes. Advanced users can use this flag to bypass these if
necessary.
-->
默认情况下，kubeadm 在修改前会进行一系列的 preflight 检查来验证系统。如果需要的话，高级用户可以使用这个参数来跳过这些检查。

- `--token`

<!--
By default, `kubeadm init` automatically generates the token used to initialise
each new node. If you would like to manually specify this token, you can use the
`--token` flag. The token must be of the format `[a-z0-9]{6}\.[a-z0-9]{16}`.  A
compatible random token can be generated `kubeadm token generate`.  Tokens can
be managed through the API after the cluster is created.  See the [section on
managing tokens](#manage-tokens) below.
-->
默认情况下，`kubeadm init` 会自动生成用来初始化每个新 node 的 token。如果您想要手动指定这个 token，您可以使用这个 `--token` 参数。token 的格式必须是 `[a-z0-9]{6}\.[a-z0-9]{16}`。可以通过 `kubeadm token generate` 来生成一个兼容的随机 token。集群创建后，token 也能通过 API 进行管理。参阅下面的 [管理 token 章节](#manage-tokens)。

- `--token-ttl`

<!--
This sets an expiration time for the token.  This is specified as a duration
from the current time.  After this time the token will no longer be valid and
will be removed. A value of 0 specifies that the token never expires.  0 is the
default.  See the [section on managing tokens](#manage-tokens) below.
-->
这个参数设置 token 的过期时间。这是从当前时间开始计算的一个持续时间。在这段时间之后，令牌将不再有效并被删除。值为 0 表示令牌永不过期。默认值是 0。参阅下面的 [管理 token 章节](#manage-tokens)。

### `kubeadm join`

<!--
When joining a kubeadm initialized cluster, we need to establish bidirectional
trust. This is split into discovery (having the Node trust the Kubernetes
master) and TLS bootstrap (having the Kubernetes master trust the Node).
-->
当把一个 node 添加到已初始化完毕的集群中时，我们需要建立一个双向的互信机制。这被划分为 discovery（让 Node 相信 Kubernetes master）和 TLS bootstrap（让 Kubernetes master 相信 Node）两个过程。

<!--
There are 2 main schemes for discovery. The first is to use a shared token along
with the IP address of the API server. The second is to provide a file (a subset
of the standard kubeconfig file). This file can be a local file or downloaded
via an HTTPS URL. The forms are `kubeadm join --discovery-token
abcdef.1234567890abcdef 1.2.3.4:6443`, `kubeadm join --discovery-file
path/to/file.conf` or `kubeadm join --discovery-file https://url/file.conf`.
Only one form can be used. If the discovery information is loaded from a URL,
HTTPS must be used and the host installed CA bundle is used to verify the
connection.
-->
对于 discovery 有两个主要方案。第一个是使用一个共享的 token，并附带上 API server 的 IP 地址。第二个是提供一个文件（标准 kubeconfig 文件的子集），这个文件可以使一个本地文件或者是通过 HTTPS URL 下载的文件。格式是 `kubeadm join --discovery-token abcdef.1234567890abcdef 1.2.3.4:6443`，`kubeadm join --discovery-file path/to/file.conf` 或者 `kubeadm join --discovery-file https://url/file.conf`。只能使用一种格式。一旦从 URL 加载了 discovery 信息，则必须使用 HTTPS 并且安装了 CA bundle 的主机将被用来验证连接。

<!--
The TLS bootstrap mechanism is also driven via a shared token. This is used to
temporarily authenticate with the Kubernetes master to submit a certificate
signing request (CSR) for a locally created key pair. By default kubeadm will
set up the Kubernetes master to automatically approve these signing requests.
This token is passed in with the `--tls-bootstrap-token abcdef.1234567890abcdef`
flag.
-->
TLS bootstrap 机制也是通过共享 token 来驱动的。这用于临时向 Kubernetes 主机进行身份验证，以提交本地创建的密钥对的证书签名请求（CSR）。默认情况下，kubeadm 将设置 Kubernetes master 自动批准这些签名请求。这个 token 是通过 `--tls-bootstrap-token abcdef.1234567890abcdef` 参数传入的。

<!--
Often times the same token is use for both parts. In this case, the `--token` flag
can be used instead of specifying the each token individually.
-->
多数情况下两者使用的都是同样的 token。这种情况下，可以使用 `--token` 参数，而不用分别指定每个 token。

<!--
Here's an example on how to use it:
-->
以下是一个如何使用的示例：

`kubeadm join --token=abcdef.1234567890abcdef 192.168.1.1:6443`

<!--
Specific options:
-->
特定选项：

- `--config`

<!--
Extended options a specified in the [kubeadm specific config file](#config-file).
-->
扩展在 [kubeadm 特定配置文件](#config-file) 中的选项。

- `--skip-preflight-checks`

<!--
By default, kubeadm runs a series of preflight checks to validate the system
before making any changes. Advanced users can use this flag to bypass these if
necessary.
-->
默认情况下，kubeadm 在修改前会进行一系列的 preflight 检查来验证系统。如果需要的话，高级用户可以使用这个参数来跳过这些检查。

- `--discovery-file`

<!--
A local file path or HTTPS URL.  The file specified must be a kubeconfig file
with nothing but an unnamed cluster entry.  This is used to find both the
location of the API server to join along with a root CA bundle to use when
talking to that server.
-->
一个本地文件或者 HTTPS URL。指定的文件必须是一个 kubeconfig 文件，文件只能包含一个未命名的集群条目。这用来找到将要加入的 API server 的地址以及在与 server 交互时需要使用的根 CA bundle。

<!--
This might look something like this:
-->
这可能看起来像这样：

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

- `--discovery-token`

<!--
The discovery token is used along with the address of the API server (as an
unnamed argument) to download and verify information about the cluster.  The
most critical part of the cluster information is the root CA bundle used to
verify the identity of the server during subsequent TLS connections.
-->
discovery token 要配合 API server 的地址（作为一个未命名参数）一起使用，以下载并且验证集群信息。集群信息的关键部分是根 CA bundle，其用来在后续的 TLS 连接中验证 server 的身份信息。

- `--tls-bootstrap-token`

<!--
The token used to authenticate to the API server for the purposes of TLS
bootstrapping.
-->
该 token 用来在 TLS 引导的时候验证 API server 信息。

- `--token=<token>`

<!--
Often times the same token is used for both `--discovery-token` and
`--tls-bootstrap-token`.  This option specifies the same token for both.  Other
flags override this flag if present.
-->
多数情况下 `--discovery-token` 和 `--tls-bootstrap-token` 都使用同一个 token。这个选项就是给这两者指定同一个 token。如果提供其它选项则会覆盖这个选项。

<!--
## Using kubeadm with a configuration file {#config-file}
-->
## 通过配置文件使用 kubeadm {#config-file}

<!--
**WARNING:** While kubeadm command line interface is in beta, the config file is
still considered alpha and may change in future versions.
-->
**警告：** 目前 kubeadm 的命令行接口处于 beta 阶段，所以配置文件目前仍然处于 alpha 阶段并且在以后的版本中可能会出现改动。

<!--
It's possible to configure kubeadm with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options.  This file is passed in to the `--config` option on
both `kubeadm init` and `kubeadm join`.
-->
可以用配置文件而不是命令来配置 kubeadm 行标志，一些更高级的功能可能只作为配置文件选项。在 `kubeadm init` 和 `kubeadm join` 上，这个文件通过 `--config` 选项传入。

<!--
### Sample Master Configuration
-->
### Master 配置示例

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
networking:
  dnsDomain: <string>
  serviceSubnet: <cidr>
  podSubnet: <cidr>
kubernetesVersion: <string>
cloudProvider: <string>
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
```
<!--
In addition, if authorizationMode is set to `ABAC`, you should write the config to `/etc/kubernetes/abac_policy.json`.
However, if authorizationMode is set to `Webhook`, you should write the config to `/etc/kubernetes/webhook_authz.conf`.
-->
另外，如果 authorizationMode 设置为 `ABAC`，那么您应该在 `/etc/kubernetes/abac_policy.json` 编写配置文件。
但是，如果 authorizationMode 设置为 `Webhook`，那么您应该在 `/etc/kubernetes/webhook_authz.conf` 编写配置文件。

<!--
### Sample Node Configuration
-->
### Node 配置示例

```yaml
apiVersion: kubeadm.k8s.io/v1alpha1
kind: NodeConfiguration
caCertPath: <path|string>
discoveryFile: <path|string>
discoveryToken: <string>
discoveryTokenAPIServers:
- <address|string>
- <address|string>
tlsBootstrapToken: <string>
```

<!--
## Securing your installation even more
-->
## 更安全的安装

<!--
The defaults for kubeadm may not work for everyone. This section documents how to tighten up a kubeadm install
at the cost of some usability.
-->
kubeadm 的默认设置可能不适用于所有人。本节介绍如何定制 kubeadm 的安装，这可能会导致一些可用性的损失。

<!--
### Turning off auto-approval of Node Client Certificates
-->
### 关闭 Node 客户端证书的自动批准

<!--
By default, there is an CSR auto-approver enabled that basically approves any client certificate request
for a kubelet when a Bootstrap Token was used when authenticating. If you don't want the cluster to
automatically approve kubelet client certs, you can turn it off by executing this command:
-->
默认情况下，CSR 自动批准是启用状态，当使用 Bootstrap Token 进行身份验证时，基本上批准任何对于 kubelet 客户端证书的请求。如果您不希望集群自动批准 kubelet 客户端证书，您可以通过执行以下命令关闭它：

```console
$ kubectl delete clusterrole kubeadm:node-autoapprove-bootstrap
```

<!--
After that, `kubeadm join` will block until the admin has manually approved the CSR in flight:
-->
之后，`kubeadm join` 将被阻止，直到管理员手动批准了在等待批准的 CSR：

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

<!--
Only after `kubectl certificate approve` has been run, `kubeadm join` can proceed.
-->
只有在运行 `kubectl certificate approve` 之后，`kubeadm join` 才能继续执行。

<!--
### Turning off public access to the cluster-info ConfigMap
-->
### 关闭集群信息 ConfigMap 的公开访问

<!--
In order to achieve the joining flow using the token as the only piece of validation information, a
public ConfigMap with some data needed for validation of the master's identity is exposed publicly by
default. While there is no private data in this ConfigMap, some users are sensitive and wish to turn
it off regardless. Doing so will disable the ability to use the `--discovery-token` flag of the
`kubeadm join` flow. Here are the steps to do so:

Fetch the `cluster-info` file from the API Server:
-->
为了使用 token 作为唯一验证信息来实现 join 流程，默认情况下会公开一个具有验证 master 身份所需数据的公共 ConfigMap。 虽然 ConfigMap 中没有私人数据，但有些用户是敏感的，不管怎样都希望将其关闭。这样做会禁用 `kubeadm join` 过程中的 `--discovery-token` 选项。以下是实现的步骤：

从 API server 抓取 `集群信息` 文件：

```console
$ kubectl -n kube-public get cm cluster-info -oyaml | grep "kubeconfig:" -A11 | grep "apiVersion" -A10 | sed "s/    //" | tee cluster-info.yaml
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

<!--
You can then use the `cluster-info.yaml` file as an argument to `kubeadm join --discovery-file`.

Turning of public access to the `cluster-info` ConfigMap:
-->
然后您可以使用这个 `cluster-info.yaml` 文件作为 `kubeadm join --discovery-file` 的参数。

```console
$ kubectl -n kube-public delete rolebinding kubeadm:bootstrap-signer-clusterinfo
```

<!--
These command should be run after `kubeadm init` but before `kubeadm join`.
-->
这些命令应该在 `kubeadm join` 之前 `kubeadm init` 之后运行。

<!--
## Managing Tokens {#manage-tokens}
-->
## 管理 Token {#manage-tokens}

<!--
You can use the `kubeadm` tool to manage tokens on a running cluster.  It will
automatically grab the default admin credentials on a master from a `kubeadm`
created cluster (`/etc/kubernetes/admin.conf`).  You can specify an alternate
kubeconfig file for credentials with the `--kubeconfig` to the following
commands.
-->
您可以使用 `kubeadm` 工具管理正在运行在集群上的令牌。它会自动从 `kubeadm` 创建的集群获取 master 的默认管理员凭证（`/etc/kubernetes/admin.conf`）。您可以使用 `--kubeconfig` 为以下命令指定备用 kubeconfig 文件以获取凭证。

<!--
* `kubeadm token list` Lists the tokens along with when they expire and what the
  approved usages are.
-->
* `kubeadm token list` 列出令牌和它们何时到期以及批准的用法。
<!--
* `kubeadm token create` Creates a new token.
    * `--description` Set the description on the new token.
    * `--ttl duration` Set expiration time of the token as a delta from "now".
      Default is 0 for no expiration. The unit of the duration is seconds.
    * `--usages` Set the ways that the token can be used.  The default is
      `signing,authentication`.  These are the usages as described above.
-->
* `kubeadm token create` 创建一个新的 token。
    * `--description` 给新的 token 设置描述。
    * `--ttl duration` 从 "现在" 开始计时，以增量的方式给 token 设置到期时间。默认为0，表示永不过期。时间单位是秒。
    * `--usages` 设置 token 能够被使用的方式。默认是 `signing,authentication`。 这些使用方式已在上述章节列出。
<!--
* `kubeadm token delete <token id>|<token id>.<token secret>` Delete a token.
  The token can either be identified with just an ID or with the entire token
  value.  Only the ID is used; the token is still deleted if the secret does not
  match.
-->
* `kubeadm token delete <token id>|<token id>.<token secret>` 删除一个 token。这个 token 可以只使用 ID 也可以使用整个 token 值作为身份标识。只有 ID 被使用；如果 secret 不匹配 token 依然会被删除。

<!--
In addition, you can use the `kubeadm token generate` command to locally creates
a new token.  This token is of the correct form for specifying with the
`--token` argument to `kubeadm init`.
-->
另外，您可以使用 `kubeadm token generate` 命令在本地创建一个新的 token。这个 token 是用 `kubeadm init` 中 `--token` 参数的正确形式。

<!--
For the gory details on how the tokens are implemented (including managing them
outside of kubeadm) see the [Bootstrap Token
docs](/docs/admin/bootstrap-tokens/).
-->
有关 token 是如何实现的（也包括在 kubeadm 之外管理它们），请参阅 [Bootstrap Token 文档](/docs/admin/bootstrap-tokens/)。

<!--
## Automating kubeadm
-->
### 自动化 kubeadm

<!--
Rather than copying the token you obtained from `kubeadm init` to each node, as
in the [basic kubeadm tutorial](/docs/admin/kubeadm/), you can
parallelize the token distribution for easier automation. To implement this
automation, you must know the IP address that the master will have after it is
started.
-->
您可以将令牌分发并行化，以实现更简单的自动化，而不是像在 [kubeadm 基础教程](/docs/admin/kubeadm/) 中那样将从 `kubeadm init` 获得的令牌复制到每个节点。 要实现这种自动化，您必须知道 master 启动后的 IP 地址。

<!--
1.  Generate a token. This token must have the form  `<6 character string>.<16
    character string>`.  More formally, it must match the regex:
    `[a-z0-9]{6}\.[a-z0-9]{16}`.

    kubeadm can generate a token for you:
-->
1.  生成一个 token。这个 token 必须满足格式 `<6 character string>.<16 character string>`。更正式地，它必须匹配正则表达式：
    `[a-z0-9]{6}\.[a-z0-9]{16}`.

    kubeadm 可以为您生成这样的一个 token：

    ```bash
    kubeadm token generate
    ```

<!--
1. Start both the master node and the worker nodes concurrently with this token.
   As they come up they should find each other and form the cluster.  The same
   `--token` argument can be used on both `kubeadm init` and `kubeadm join`.
-->
1. 使用此令牌同时启动 master 和 node 节点。当他们启动后，他们应该能够找到彼此并形成集群。在 `kubeadm init` 和 `kubeadm join` 上都可以使用相同的 `--token` 参数。

<!--
Once the cluster is up, you can grab the admin credentials from the master node
at `/etc/kubernetes/admin.conf` and use that to talk to the cluster.
-->
集群启动后，您可以从 master 节点的 `/etc/kubernetes/admin.conf` 获取管理凭证，并用它来与集群进行通信。

<!--
## Use Kubeadm with other CRI runtimes
-->
在其它 CRI 运行时（runtime）上使用 kubeadm

<!--
Since [Kubernetes 1.6 release](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md#node-components-1), Kubernetes container runtimes have been transferred to using CRI by default. Currently, the build-in container runtime is Docker which is enabled by build-in `dockershim` in `kubelet`.
-->
从 [Kubernetes 1.6 release](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md#node-components-1) 版本开始，Kubernetes 容器运行时已经默认转移到使用 CRI 上了。目前，内置的容器运行时是 Docker，通过 `kubelet` 中内置的 `dockershim` 来启用。

<!--
Using other CRI based runtimes with kubeadm is very simple, and currently supported runtimes are:
-->
在 kubeadm 中使用其他基于 CRI 的运行时非常简单，目前支持的运行时为：

- [cri-o](https://github.com/kubernetes-incubator/cri-o)
- [frakti](https://github.com/kubernetes/frakti)
- [rkt](https://github.com/kubernetes-incubator/rktlet)

<!--
After you have successfully installed `kubeadm` and `kubelet`, please follow these two steps:

1. Install runtime shim on every node. You will need to follow the installation document in the runtime shim project listing above.

2. Configure kubelet to use remote CRI runtime. Please remember to change `RUNTIME_ENDPOINT` to your own value like `/var/run/{your_runtime}.sock`:
-->
成功安装 `kubeadm` 和 `kubelet` 后，请按照以下两个步骤操作：

1. 在每个节点上安装运行时 shim（runtime shim）。您可以按照上面的运行时 shim 项目列表中的安装文档进行安装。

2. 配置 kubelet 来使用远程 CRI 运行时。记得修改 `RUNTIME_ENDPOINT` 为您的自定义值，例如 `/var/run/{your_runtime}.sock`:

```shell
  $ cat > /etc/systemd/system/kubelet.service.d/20-cri.conf <<EOF
Environment="KUBELET_EXTRA_ARGS=--container-runtime=remote --container-runtime-endpoint=$RUNTIME_ENDPOINT --feature-gates=AllAlpha=true"
EOF
  $ systemctl daemon-reload
```

<!--
Now `kubelet` is ready to use the specified CRI runtime, and you can continue with `kubeadm init` and `kubeadm join` workflow to deploy Kubernetes cluster.
-->
这样 `kubelet` 就能够使用指定的 CRI 运行时了，然后您就可以继续 `kubeadm init` 和 `kubeadm join` 流程来部署 Kubernetes 集群。

<!--
## Running kubeadm without an internet connection
-->
## 没有互联网连接的情况下运行 kubeadm

<!--
All of the control plane components run in Pods started by the kubelet and
the following images are required for the cluster works will be automatically
pulled by the kubelet if they don't exist locally while `kubeadm init` is initializing
your master:
-->
所有的控制平面组件运行在由 kubelet 启动的 Pod 上，并且下面的镜像对于集群工作是必需的，当 `kubeadm init` 正在初始化您的 master 时，如果这些镜像在本地不存在，那么 kubelet 将会自动去拉取：

<!--
| Image Name | v1.6 release branch version | v1.7 release branch version
-->
| 镜像名称   |    v1.6 release 分之版本    | v1.7 release 分支版本
|---|---|---|
| gcr.io/google_containers/kube-apiserver-${ARCH} | v1.6.x | v1.7.x
| gcr.io/google_containers/kube-controller-manager-${ARCH} | v1.6.x | v1.7.x
| gcr.io/google_containers/kube-scheduler-${ARCH} | v1.6.x | v1.7.x
| gcr.io/google_containers/kube-proxy-${ARCH} | v1.6.x | v1.7.x
| gcr.io/google_containers/etcd-${ARCH} | 3.0.17 | 3.0.17
| gcr.io/google_containers/pause-${ARCH} | 3.0 | 3.0
| gcr.io/google_containers/k8s-dns-sidecar-${ARCH} | 1.14.1 | 1.14.4
| gcr.io/google_containers/k8s-dns-kube-dns-${ARCH} | 1.14.1 | 1.14.4
| gcr.io/google_containers/k8s-dns-dnsmasq-nanny-${ARCH} | 1.14.1 | 1.14.4

<!--
Here `v1.7.x` means the "latest patch release of the v1.7 branch".

`${ARCH}` can be one of: `amd64`, `arm`, `arm64`, `ppc64le` or `s390x`.
-->
这里的 `v1.7.x` 表示 "v1.7 分支的最新补丁版本"。

`${ARCH}` 可以是这些值之一：`amd64`, `arm`, `arm64`, `ppc64le` 或者 `s390x`。

<!--
## Managing the kubeadm drop-in file for the kubelet
-->
## 管理 kubeadm 中用于配置 kubelet 的插入文件 

<!--
The kubeadm deb package ships with configuration for how the kubelet should
be run. Note that the `kubeadm` CLI command will never touch this drop-in file.
This drop-in file belongs to the kubeadm deb/rpm package.

This is what it looks like in v1.7:
-->
kubeadm 包中包含用于配置 kubelet 如何运行的配置文件。需要注意的是，`kubeadm` CLI 命令永远不会涉及到这个插入文件（drop-in file）。这个插入文件属于 kubeadm deb/rpm 包。

这是在 v1.7 版本中的样子：

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
-->
以下是详细分解：

<!--
* `--kubeconfig=/etc/kubernetes/kubelet.conf` points to the kubeconfig file that
   tells the kubelet where the API server is. This file also has the kubelet's
   credentials.
* `--require-kubeconfig=true` the kubelet should fail fast if the kubeconfig file
   is not present. This makes the kubelet crashloop during the time the service is
   started until `kubeadm init` is run.
* `--pod-manifest-path=/etc/kubernetes/manifests` specifies from where to read
   Static Pod manifests used for spinning up the control plane
* `--allow-privileged=true` allows this kubelet to run privileged Pods
* `--network-plugin=cni` uses CNI networking
* `--cni-conf-dir=/etc/cni/net.d` specifies where to look for the
   [CNI spec file(s)](https://github.com/containernetworking/cni/blob/master/SPEC.md)
-->
* `--kubeconfig=/etc/kubernetes/kubelet.conf` 指向 kubeconfig 文件，以告诉 kubelet API server 的地址。这个文件也包含了 kubelet 的证书。
* `--require-kubeconfig=true` 如果 kubeconfig 文件不存在那么 kubelet 将会立即失败。这将导致 kubelet 服务在启动后出现重复崩溃，直到运行了 `kubeadm init`。
* `--pod-manifest-path=/etc/kubernetes/manifests` 指定从哪里读取静态 Pod 的 manifest 文件，这些静态 Pod 是用来启动控制平面的
* `--allow-privileged=true` 允许 kubelet 运行特权 Pod（privileged Pods）
* `--network-plugin=cni` 使用 CNI 网络
* `--cni-conf-dir=/etc/cni/net.d` 指定在哪里查找 [CNI spec 文件](https://github.com/containernetworking/cni/blob/master/SPEC.md)
<!--
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
-->
* `--cni-bin-dir=/opt/cni/bin` 指定在哪里查找真正的 CNI 二进制文件
* `--cluster-dns=10.96.0.10` 在 Pod 的 `/etc/resolv.conf` 中使用这个集群内部的 DNS 服务来作为 `nameserver` 入口
* `--cluster-domain=cluster.local` 在 Pod 的 `/etc/resolv.conf` 中使用这个集群内部的 DNS 域来作为 `search` 入口
* `--client-ca-file=/etc/kubernetes/pki/ca.crt` 使用此 CA 证书来验证对 Kubelet API 的请求
* `--authorization-mode=Webhook` 验证对 Kubelet API 的请求，该请求通过向 API server `POST` 一个 `SubjectAccessReview` 来实现对 Kubelet API 的请求
* `--cadvisor-port=0` 将禁用 cAdvisor 监听 `0.0.0.0:4194` 的默认行为。cAdvisor 将继续运行在 kubelet 内部并且能够通过 `https://{node-ip}:10250/stats/` 访问它的 API。如果您想要 cAdvisor 监听更多的端口，请运行：

   ```
   sed -e "/cadvisor-port=0/d" -i /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
   systemctl daemon-reload
   systemctl restart kubelet
   ```

<!--
## Cloudprovider integrations (experimental)
-->
## 集成云提供商（实验性）

<!--
Enabling specific cloud providers is a common request. This currently requires
manual configuration and is therefore not yet fully supported. If you wish to do
so, edit the kubeadm drop-in for the kubelet service
(`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`) on all nodes,
including the master. If your cloud provider requires any extra packages
installed on the host, for example for volume mounting/unmounting, install those
packages.
-->
启用特定的云提供商是一个常见的要求。目前这需要手动配置，因此还没有完全支持。如果您想这样做，请在所有节点（包括 master 节点）上编辑 kubelet 服务的 kubeadm 插入（drop-in）文件(`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`)。如果您的云提供商需要在主机上安装任何额外的软件包（例如为了卷的安装和卸载），请安装这些软件包。

<!--
Specify the `--cloud-provider` flag for the kubelet and set it to the cloud of your
choice. If your cloudprovider requires a configuration file, create the file
`/etc/kubernetes/cloud-config` on every node. The exact format and content of
that file depends on the requirements imposed by your cloud provider. If you use
the `/etc/kubernetes/cloud-config` file, you must append it to the kubelet
arguments as follows: `--cloud-config=/etc/kubernetes/cloud-config`
-->
为 kubelet 指定 `--cloud-provider` 参数，并将其设置为您选择的云。如果您的云提供商需要配置文件，请在每个节点上创建文件 `/etc/kubernetes/cloud-config`。 该文件的确切格式和内容取决于您的云提供商施加的要求。如果使用 `/etc/kubernetes/cloud-config` 文件，则必须将其附加到 kubelet 参数中，如：`--cloud-config=/etc/kubernetes/cloud-config`

<!--
Note that there is most likely other per-provider configuration that may be needed
(IAM roles for AWS) that is currently underdocumented.
-->
请注意，目前很可能存在没有记录在案的其他提供商的个性配置（例如 AWS 的 IAM 角色）。

<!--
Next, specify the cloud provider in the kubeadm config file.  Create a file called
`kubeadm.conf` with the following contents:
-->
接下来，在 kubeadm 配置文件中指定云提供商。使用以下内容创建一个名为 `kubeadm.conf` 的文件：

``` yaml
kind: MasterConfiguration
apiVersion: kubeadm.k8s.io/v1alpha1
cloudProvider: <cloud provider>
```

<!--
Lastly, run `kubeadm init --config=kubeadm.conf` to bootstrap your cluster with
the cloud provider.
-->
最后，运行 `kubeadm init --config = kubeadm.conf` 来引导云提供商的集群。

<!--
This workflow is not yet fully supported, however we hope to make it extremely
easy to spin up clusters with cloud providers in the future. (See [this
proposal](https://github.com/kubernetes/community/pull/128) for more
information) The [Kubelet Dynamic
Settings](https://github.com/kubernetes/kubernetes/pull/29459) feature may also
help to fully automate this process in the future.
-->
这个工作流程还没有完全支持，但是我们希望将来可以非常容易地与云提供商建立集群，有关详细信息，请参阅 [本提案](https://github.com/kubernetes/community/pull/128)。[Kubelet 动态设置](https://github.com/kubernetes/kubernetes/pull/29459) 特性也可能有助于将来完全自动化这个流程。

<!--
## Environment variables
-->
## 环境变量

<!--
There are some environment variables that modify the way that kubeadm works.
Most users will have no need to set these. These environment variables are a
short-term solution, eventually they will be integrated in the kubeadm
configuration file.
-->
有一些环境变量可以修改 kubeadm 的工作方式。大多数用户将不需要设置这些环境变量。这些环境变量是一个短期的解决方案，最终它们将被集成到 kubeadm 配置文件中。

<!--
**Note:** These environment variables are deprecated and will stop functioning in v1.8!
-->
**注意：** 这些环境变量已被弃用，并将在 v1.8 停止运作！

<!--
| Variable | Default | Description |
| --- | --- | --- |
| `KUBE_KUBERNETES_DIR` | `/etc/kubernetes` | Where most configuration files are written to and read from |
| `KUBE_HYPERKUBE_IMAGE` | | If set, use a single hyperkube image with this name. If not set, individual images per server component will be used. |
| `KUBE_ETCD_IMAGE` | `gcr.io/google_containers/etcd-<arch>:3.0.17` | The etcd container image to use. |
| `KUBE_REPO_PREFIX` | `gcr.io/google_containers` | The image prefix for all images that are used. |
-->
|   变量   | 默认值  |    描述     |
| --- | --- | --- |
| `KUBE_KUBERNETES_DIR` | `/etc/kubernetes` | 大部分配置文件写入和读取的位置 |
| `KUBE_HYPERKUBE_IMAGE` | | 如果设置，使用具有此名称的单个 hyperkube 镜像。如果未设置，则将使用每个服务器组件的单个镜像。 |
| `KUBE_ETCD_IMAGE` | `gcr.io/google_containers/etcd-<arch>:3.0.17` | 将要使用的 etcd 容器镜像。 |
| `KUBE_REPO_PREFIX` | `gcr.io/google_containers` | 使用的所有镜像的前缀。 |

<!--
If `KUBE_KUBERNETES_DIR` is specified, you may need to rewrite the arguments of the kubelet.
(e.g. --kubeconfig, --pod-manifest-path)

If `KUBE_REPO_PREFIX` is specified, you may need to set the kubelet flag
`--pod-infra-container-image` which specifies which pause image to use.

Defaults to `gcr.io/google_containers/pause-${ARCH}:3.0` where `${ARCH}`
can be one of `amd64`, `arm`, `arm64`, `ppc64le` or `s390x`.
-->
如果指定了 `KUBE_KUBERNETES_DIR`，则可能需要重写 kubelet 的参数（例如 --kubeconfig，--pod-manifest-path）。

如果指定了 `KUBE_REPO_PREFIX`，则可能需要将设置 kubelet 的参数 `--pod-infra-container-image`，该参数指定要使用哪个 pause 镜像。

`gcr.io/google_containers/pause-${ARCH}:3.0` 中的 `${ARCH}` 的默认值可以是 `amd64`、`arm`、`arm64`、`ppc64le` 或者 `s390x` 中的一个。

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

For example, if your kube master node IP address is 10.18.17.16 and you have a
proxy which supports both http/https on 10.18.17.16 port 8080, you can use the
following command:
-->
如果要通过 http 代理使用 kubeadm，则可能需要将其配置为支持 http_proxy，https_proxy 或 no_proxy。

例如，如果您的kube master 节点 IP 地址为 10.18.17.16，并且您有一个同时支持 10.18.17.16 上 8080 端口上的 http/https 的代理，则可以使用以下命令：

```bash
export PROXY_PORT=8080
export PROXY_IP=10.18.17.16
export http_proxy=http://$PROXY_IP:$PROXY_PORT
export HTTP_PROXY=$http_proxy
export https_proxy=$http_proxy
export HTTPS_PROXY=$http_proxy
export no_proxy="localhost,127.0.0.1,localaddress,.localdomain.com,example.com,10.18.17.16"
```

<!--
Remember to change `proxy_ip` and add a kube master node IP address to
`no_proxy`.
-->
请记得修改 `proxy_ip` 并将 kube master 节点 IP 地址添加到 `no_proxy`。

<!--
## Using custom certificates
-->
## 使用自定义证书

<!--
By default kubeadm will generate all the certificates needed for a cluster to run.
You can override this behaviour by providing your own certificates.

To do so, you must place them in whatever directory is specified by the
`--cert-dir` flag or `CertificatesDir` configuration file key. By default this
is `/etc/kubernetes/pki`.
-->
默认情况下，kubeadm 将生成集群运行所需的所有证书。您可以通过提供自己的证书来覆盖此行为。

为此，您必须将它们放置在 `--cert-dir` 参数或 `CertificatesDir` 配置文件密钥所指定的目录中。默认目录为 `/etc/kubernetes/pki`。

<!--
If a given certificate and private key pair both exist, kubeadm will skip the
generation step and those files will be validated and used for the prescribed
use-case.

This means you can, for example, prepopulate `/etc/kubernetes/pki/ca.crt`
and `/etc/kubernetes/pki/ca.key` with an existing CA, which then will be used
for signing the rest of the certs.
-->
如果给定的证书和私钥对都存在，kubeadm 会跳过生成步骤，这些文件将被验证并用于规定的用例。

这意味着你可以用一个现有的 CA 预填充 `/etc/kubernetes/pki/ca.crt` 和 `/etc/kubernetes/pki/ca.key`，然后用它来签署其余的证书。

<!--
## Releases and release notes
-->
## 发布版本和发布须知

<!--
If you already have kubeadm installed and want to upgrade, run `apt-get update
&& apt-get upgrade` or `yum update` to get the latest version of kubeadm.
-->
如果你已经安装了 kubeadm 并想升级，运行 `apt-get update && apt-get upgrade` 或者 `yum update` 来获取最新版本的 kubeadm。

<!--
Refer to the
[CHANGELOG.md](https://git.k8s.io/kubeadm/CHANGELOG.md)
for more information.
-->
参阅 [CHANGELOG.md](https://git.k8s.io/kubeadm/CHANGELOG.md) 来获得更多信息。
