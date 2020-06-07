---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm join
content_template: templates/concept
weight: 30
---
{{% capture overview %}}
<!--
This command initializes a Kubernetes worker node and joins it to the cluster.
-->
此命令用来初始化 Kubernetes 工作节点并将其加入集群。
{{% /capture %}}

{{% capture body %}}
{{< include "generated/kubeadm_join.md" >}}

<!--
### The joining workflow

`kubeadm join` bootstraps a Kubernetes worker node and joins it to the cluster.
This action consists of the following steps:
-->

### 加入流程

`kubeadm join` 初始化 Kubernetes 工作节点并将其加入集群。
该操作过程包含下面几个步骤：

<!--
1. kubeadm downloads necessary cluster information from the API server.
   By default, it uses the bootstrap token and the CA key hash to verify the
   authenticity of that data. The root CA can also be discovered directly via a
   file or URL.
-->
1. kubeadm 从 API 服务器下载必要的集群信息。
   默认情况下，它使用引导令牌和 CA 密钥哈希来验证数据的真实性。
   也可以通过文件或 URL 直接发现根 CA。

    <!-- 1. If kubeadm is invoked with `--feature-gates=DynamicKubeletConfig` enabled,
    it first retrieves the kubelet init configuration from the master and writes it to
    the disk. When kubelet starts up, kubeadm updates the node `Node.spec.configSource` property of the node.
    See [Set Kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/)
    and [Reconfigure a Node's Kubelet in a Live Cluster](/docs/tasks/administer-cluster/reconfigure-kubelet/)
    for more information about Dynamic Kubelet Configuration.
    -->

1. 如果调用 kubeadm 时启用了 `--feature-gates=DynamicKubeletConfig`，它首先从主机上检索 kubelet 初始化配置并将其写入磁盘。
   当 kubelet 启动时，kubeadm 更新节点的 `Node.spec.configSource` 属性。
   进一步了解动态 kubelet 配置 请参考 [使用配置文件设置 Kubelet 参数](/docs/tasks/administer-cluster/kubelet-config-file/) 和 [重新配置集群中节点的 Kubelet](/docs/tasks/administer-cluster/reconfigure-kubelet/)。

    <!-- 1. Once the cluster information is known, kubelet can start the TLS bootstrapping
    process.

    The TLS bootstrap uses the shared token to temporarily authenticate
    with the Kubernetes API server to submit a certificate signing request (CSR); by
    default the control plane signs this CSR request automatically.
    -->

1. 一旦知道集群信息，kubelet 就可以开始 TLS 引导过程。
   TLS 引导程序使用共享令牌与 Kubernetes API 服务器进行临时的身份验证，以提交证书签名请求 (CSR)；
   默认情况下，控制平面自动对该 CSR 请求进行签名。

    <!-- 1. Finally, kubeadm configures the local kubelet to connect to the API
    server with the definitive identity assigned to the node.
    -->

1. 最后，kubeadm 配置本地 kubelet 使用分配给节点的确定标识连接到 API 服务器。

<!--
### Discovering what cluster CA to trust

The kubeadm discovery has several options, each with security tradeoffs.
The right method for your environment depends on how you provision nodes and the
security expectations you have about your network and node lifecycles.
-->

### 发现要信任的集群 CA

Kubeadm 的发现有几个选项，每个选项都有安全性上的优缺点。
适合您的环境的正确方法取决于节点是如何准备的以及您对网络的安全性期望和节点的生命周期特点。

<!--
#### Token-based discovery with CA pinning

This is the default mode in Kubernetes 1.8 and above. In this mode, kubeadm downloads
the cluster configuration (including root CA) and validates it using the token
as well as validating that the root CA public key matches the provided hash and
that the API server certificate is valid under the root CA.
-->

#### 带 CA 锁定模式的基于令牌的发现

这是 Kubernetes 1.8 及以上版本中的默认模式。
在这种模式下，kubeadm 下载集群配置（包括根CA）并使用令牌验证它，并且会验证根 CA 的公钥与所提供的哈希是否匹配，以及 API 服务器证书在根 CA 下是否有效。

<!--
The CA key hash has the format `sha256:<hex_encoded_hash>`. By default, the hash value is returned in the `kubeadm join` command printed at the end of `kubeadm init` or in the output of `kubeadm token create --print-join-command`. It is in a standard format (see [RFC7469](https://tools.ietf.org/html/rfc7469#section-2.4)) and can also be calculated by 3rd party tools or provisioning systems. For example, using the OpenSSL CLI:
-->

CA 键哈希格式为 `sha256:<hex_encoded_hash>`。
默认情况下，在 `kubeadm init` 最后打印的 `kubeadm join` 命令或者 `kubeadm token create --print-join-command` 的输出信息中返回哈希值。
它使用标准格式 (请参考 [RFC7469](https://tools.ietf.org/html/rfc7469#section-2.4)) 并且也能通过第三方工具或者驱动系统进行计算。
例如，使用 OpenSSL CLI：

```bash
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
```
<!--
**Example `kubeadm join` command:**
-->

**`kubeadm join` 命令示例**

```bash
kubeadm join --discovery-token abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234..cdef 1.2.3.4:6443
```

<!--
**Advantages:**

 - Allows bootstrapping nodes to securely discover a root of trust for the
   master even if other worker nodes or the network are compromised.

 - Convenient to execute manually since all of the information required fits
   into a single `kubeadm join` command that is easy to copy and paste.
-->

**优势：**
 - 允许引导节点安全地发现主节点的信任根，即使其他工作节点或网络受到损害。

 - 方便手动执行，因为所需的所有信息都适合于易于复制和粘贴的单个 `kubeadm join` 命令。

<!-- 
**Disadvantages:**

 - The CA hash is not normally known until the master has been provisioned,
   which can make it more difficult to build automated provisioning tools that
   use kubeadm. By generating your CA in beforehand, you may workaround this
   limitation though.
-->

**劣势：**
 - CA 哈希通常在主节点被提供之前是不知道的，这使得构建使用 kubeadm 的自动化配置工具更加困难。
   通过预先生成CA，您可以解决这个限制。

<!--   
#### Token-based discovery without CA pinning

_This was the default in Kubernetes 1.7 and earlier_, but comes with some
important caveats. This mode relies only on the symmetric token to sign
(HMAC-SHA256) the discovery information that establishes the root of trust for
the master. It's still possible in Kubernetes 1.8 and above using the
`--discovery-token-unsafe-skip-ca-verification` flag, but you should consider
using one of the other modes if possible.

**Example `kubeadm join` command:**
-->

#### 无 CA 锁定模式的基于令牌的发现

_这是 Kubernetes 1.7 和早期版本_中的默认设置；使用时要注意一些重要的补充说明。
此模式仅依赖于对称令牌来签名(HMAC-SHA256)发现信息，这些发现信息为主节点建立信任根。
在 Kubernetes 1.8 及以上版本中仍然可以使用 `--discovery-token-unsafe-skip-ca-verification` 参数，但是如果可能的话，您应该考虑使用一种其他模式。

**`kubeadm join` 命令示例**

```
kubeadm join --token abcdef.1234567890abcdef --discovery-token-unsafe-skip-ca-verification 1.2.3.4:6443`
```

<!--
**Advantages:**

 - Still protects against many network-level attacks.

 - The token can be generated ahead of time and shared with the master and
   worker nodes, which can then bootstrap in parallel without coordination. This
   allows it to be used in many provisioning scenarios.
-->

**优势**

 - 仍然可以防止许多网络级攻击。

 - 可以提前生成令牌并与主节点和工作节点共享，这样主节点和工作节点就可以并行引导而无需协调。
   这允许它在许多配置场景中使用。

<!--
**Disadvantages:**

 - If an attacker is able to steal a bootstrap token via some vulnerability,
   they can use that token (along with network-level access) to impersonate the
   master to other bootstrapping nodes. This may or may not be an appropriate
   tradeoff in your environment.
-->

**劣势**

 - 如果攻击者能够通过某些漏洞窃取引导令牌，那么他们可以使用该令牌（连同网络级访问）为其它处于引导过程中的节点提供假冒的主节点。
   在您的环境中，这可能是一个适当的折衷方法，也可能不是。

<!--
#### File or HTTPS-based discovery
This provides an out-of-band way to establish a root of trust between the master
and bootstrapping nodes.   Consider using this mode if you are building automated provisioning
using kubeadm.
-->

#### 基于 HTTPS 或文件发现

这种方案提供了一种带外方式在主节点和引导节点之间建立信任根。
如果使用 kubeadm 构建自动配置，请考虑使用此模式。

<!--
**Example `kubeadm join` commands:**
-->

**`kubeadm join` 命令示例：**
 - `kubeadm join --discovery-file path/to/file.conf` （本地文件）

 - `kubeadm join --discovery-file https://url/file.conf` (远程 HTTPS URL)

<!--
**Advantages:**

 - Allows bootstrapping nodes to securely discover a root of trust for the
   master even if the network or other worker nodes are compromised.
-->

**优势：**

 - 允许引导节点安全地发现主节点的信任根，即使网络或其他工作节点受到损害。

<!--
**Disadvantages:**

 - Requires that you have some way to carry the discovery information from
   the master to the bootstrapping nodes. This might be possible, for example,
   via your cloud provider or provisioning tool. The information in this file is
   not secret, but HTTPS or equivalent is required to ensure its integrity.
-->

**劣势：**

 - 要求您有某种方法将发现信息从主节点传送到引导节点。
   例如，这可以通过云提供商或驱动工具实现。
   该文件中的信息不是加密的，而是需要 HTTPS 或等效文件来保证其完整性。

<!--
### Securing your installation even more {#securing-more}

The defaults for kubeadm may not work for everyone. This section documents how to tighten up a kubeadm installation
at the cost of some usability.
-->

### 确保您的安装更加安全 {#securing-more}

Kubeadm 的默认值可能不适用于所有人。
本节说明如何以牺牲可用性为代价来加强 kubeadm 安装。

<!--
#### Turning off auto-approval of node client certificates

By default, there is a CSR auto-approver enabled that basically approves any client certificate request
for a kubelet when a Bootstrap Token was used when authenticating. If you don't want the cluster to
automatically approve kubelet client certs, you can turn it off by executing this command:
-->

#### 关闭节点客户端证书的自动批准

默认情况下，Kubernetes 启用了 CSR 自动批准器，如果在身份验证时使用 Bootstrap Token，它会批准对 kubelet 的任何客户端证书的请求。
如果不希望集群自动批准kubelet客户端证书，可以通过执行以下命令关闭它：

```console
$ kubectl delete clusterrole kubeadm:node-autoapprove-bootstrap
```
<!--
After that, `kubeadm join` will block until the admin has manually approved the CSR in flight:
-->

关闭后，`kubeadm join` 操作将会被阻断，直到管理员已经手动批准了在途中的 CSR 才会继续：

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

#### Turning off public access to the cluster-info ConfigMap

In order to achieve the joining flow using the token as the only piece of validation information, a
 ConfigMap with some data needed for validation of the master's identity is exposed publicly by
default. While there is no private data in this ConfigMap, some users might wish to turn
it off regardless. Doing so will disable the ability to use the `--discovery-token` flag of the
`kubeadm join` flow. Here are the steps to do so:

* Fetch the `cluster-info` file from the API Server:
-->

只有执行了 `kubectl certificate approve` 后，`kubeadm join` 才会继续。

#### 关闭对集群信息 ConfigMap 的公开访问

为了实现使用令牌作为唯一验证信息的加入工作流，默认情况下会公开带有验证主节点标识所需数据的 ConfigMap。
虽然此 ConfigMap 中没有私有数据，但一些用户可能希望无论如何都关闭它。
这样做需要禁用 `kubeadm join` 工作流的 `--discovery-token` 参数。
以下是实现步骤：

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

<!--
* Use the `cluster-info.yaml` file as an argument to `kubeadm join --discovery-file`.

* Turn off public access to the `cluster-info` ConfigMap:
-->

* 使用 `cluster-info.yaml` 文件作为 `kubeadm join --discovery-file` 参数。

* 关闭 `cluster-info` ConfigMap 的公开访问：

```console
$ kubectl -n kube-public delete rolebinding kubeadm:bootstrap-signer-clusterinfo
```

<!--
These commands should be run after `kubeadm init` but before `kubeadm join`.

### Using kubeadm join with a configuration file {#config-file}
-->

这些命令应该在执行 `kubeadm init` 之后、在`kubeadm join` 之前执行。

### 使用带有配置文件的 kubeadm join

{{< caution >}}
<!--The config file is still considered alpha and may change in future versions.-->
配置文件目前是 alpha 功能，在将来的版本中可能会变动。
{{< /caution >}}

<!--
It's possible to configure `kubeadm join` with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options. This file is passed using the `--config` flag and it must
contain a `JoinConfiguration` structure.

To print the default values of `JoinConfiguration` run the following command:
-->

可以用配置文件替代命令行参数的方法配置 `kubeadm join`，一些高级功能也只有在使用配置文件时才可选用。
该文件通过 `--config` 参数来传递，并且文件中必须包含 `JoinConfiguration` 结构。

执行下面的命令可以查看 `JoinConfiguration` 默认值：

```bash
kubeadm config print-default --api-objects=JoinConfiguration
```

<!--
For details on individual fields in `JoinConfiguration` see [the godoc](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm#JoinConfiguration).
-->

要了解 `JoinConfiguration` 中各个字段的详细信息请参考 [godoc](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm#JoinConfiguration)。
{{% /capture %}}

{{% capture whatsnext %}}
<!--
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes master node
* [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token/) to manage tokens for `kubeadm join`
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
-->
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) 初始化 Kubernetes 主节点
* [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token/) 管理 `kubeadm join` 的令牌
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) 将 `kubeadm init` 或 `kubeadm join` 对主机的更改恢复到之前状态
{{% /capture %}}
