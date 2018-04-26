---
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm join
---
{% capture overview %}
{% endcapture %}

{% capture body %}
{% include_relative generated/kubeadm_join.md %}

<!--
### The joining workflow

`kubeadm join` bootstraps a Kubernetes worker node and joins it to the cluster. 
This action consists of the following steps:
-->
### join 命令的工作流程

`kubeadm join` 命令会初始化一个 Kubernetes 工作 node，并将其加入到集群中。
此动作包括以下步骤：

<!--
1. kubeadm downloads necessary cluster information from the API server.
   By default, it uses the bootstrap token and the CA key hash to verify the
   authenticity of that data. The root CA can also be discovered directly via a
   file or URL.
-->
1. kubeadm 从 API server 下载必要的集群信息。 默认情况下，它使用 bootstrap token
   和 CA 秘钥哈希来验证这些数据的真实性。 根 CA 证书也可以直接通过文件或 URL 被发现。

<!--
1. If kubeadm is invoked with `--feature-gates=DynamicKubeletConfig` enabled,
   it first retrieves the kubelet init configuration from the master and writes it to
   the disk. When kubelet starts up, kubeadm updates the node `Node.spec.configSource` property of the node. 
   See [Set Kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file.md) 
   and [Reconfigure a Node's Kubelet in a Live Cluster](/docs/tasks/administer-cluster/reconfigure-kubelet.md) 
   for more information about Dynamic Kubelet Configuration.
-->
1. 如果 kubeadm 在启用 `--feature-gates=DynamicKubeletConfig` 的情况下被调用，
   它首先会从 master 取回 kubelet 初始配置，并将其写入磁盘。 当 kubelet 启动时，
   kubeadm 会更新 node 的 `Node.spec.configSource` 属性。
   查看 [通过配置文件设置 Kubelet 参数](/docs/tasks/administer-cluster/kubelet-config-file.md)
   和 [在动态集群中重新配置 Node 的 Kubelet](/docs/tasks/administer-cluster/reconfigure-kubelet.md)
   来了解更多关于动态 Kubelet 配置的信息。

<!--
1. Once the cluster information is known, kubelet can start the TLS bootstrapping
   process.
-->
1. 一旦集群信息是已知的，kubelet 就可以启动 TLS 的初始化进程。

<!--
   The TLS bootstrap uses the shared token to temporarily authenticate
   with the Kubernetes API server to submit a certificate signing request (CSR); by
   default the control plane signs this CSR request automatically.
-->
   TLS 初始化使用共享 token 临时地与 Kubernetes API server 进行认证，来提交证书签名请求（CSR）。
   默认情况下，控制平面会自动签署该 CSR 请求。

<!--
1. Finally, kubeadm configures the local kubelet to connect to the API
   server with the definitive identity assigned to the node.
-->
1. 最后，kubeadm 配置本地 kubelet，令其使用明确分配给该 node 的认证凭据与 API server 通信。

<!--
### Discovering what cluster CA to trust

The kubeadm discovery has several options, each with security tradeoffs.
The right method for your environment depends on how you provision nodes and the
security expectations you have about your network and node lifecycles.
-->
### 发现可信的集群 CA

kubeadm discovery 命令有数个选项，每个选项有其安全方面的权衡。
针对您的环境的正确方法取决于您的 node 的供应方式，以及您对网络和 node 生命周期安全性的期望。

<!--
#### Token-based discovery with CA pinning

This is the default mode in Kubernetes 1.8 and above. In this mode, kubeadm downloads
the cluster configuration (including root CA) and validates it using the token
as well as validating that the root CA public key matches the provided hash and
that the API server certificate is valid under the root CA.
-->
#### 包含 CA 的基于 Token 的发现

这是 Kubernetes 1.8 及更高版本中的默认模式。 在该模式中，kubeadm 下载集群配置（包括根 CA 证书），
并使用 token 来验证集群配置，同时也验证根 CA 公钥与提供的哈希是否匹配，以及 API server
在根 CA 下是否合法。



<!--
The CA key hash has the format `sha256:<hex_encoded_hash>`. By default, the hash value is returned in the `kubeadm join` command printed at the end of `kubeadm init` or in the output of `kubeadm token create --print-join-command`. It is in a standard format (see [RFC7469](https://tools.ietf.org/html/rfc7469#section-2.4)) and can also be calculated by 3rd party tools or provisioning systems. For example, using the OpenSSL CLI: 
-->
CA 秘钥哈希格式为 `sha256:<hex_encoded_hash>`。 默认情况下，哈希值由 `kubeadm init`
结尾输出的 `kubeadm join` 命令所返回，或者位于 `kubeadm token create --print-join-command`
的输出中。 它是一种标准格式（参考 [RFC7469](https://tools.ietf.org/html/rfc7469#section-2.4)），
且能够通过第三方工具或配置系统进行计算。 例如，使用 OpenSSL CLI：

```bash
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
```

<!--
**Example `kubeadm join` command:**
-->
**`kubeadm join` 命令示例：**

```bash
kubeadm join --discovery-token abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234..cdef 1.2.3.4:6443
```

<!--
**Advantages:**

 - Allows bootstrapping nodes to securely discover a root of trust for the
   master even if other worker nodes or the network are compromised.
-->
**优势：**

 - 即使在其他 node 或网络受到破坏时，也能够引导 node 安全地发现用于 master 的信任根（root of trust）。

<!--
 - Convenient to execute manually since all of the information required fits
   into a single `kubeadm join` command that is easy to copy and paste.
-->
 - 由于将全部所需信息纳入到唯一的、 方便复制和粘贴的 `kubeadm join` 命令中，
   所以便于手动执行。

<!--
**Disadvantages:**

 - The CA hash is not normally known until the master has been provisioned,
   which can make it more difficult to build automated provisioning tools that
   use kubeadm. By generating your CA in beforehand, you may workaround this
   limitation though.
-->
**缺点：**

 - CA 哈希在 master 供应之前无法感知，这让使用 kubeadm 构建自动化供应工具变得更加困难。
   尽管您可以通过事先生成 CA 来解决这一限制。

<!--
#### Token-based discovery without CA pinning

_This was the default in Kubernetes 1.7 and earlier_, but comes with some
important caveats. This mode relies only on the symmetric token to sign
(HMAC-SHA256) the discovery information that establishes the root of trust for
the master. It's still possible in Kubernetes 1.8 and above using the
`--discovery-token-unsafe-skip-ca-verification` flag, but you should consider
using one of the other modes if possible.
-->
#### 不包含 CA 的基于 Token 的发现

_这是 Kubernetes 1.7 或更早版本中的默认模式_，但是伴随着一些重要的注意事项。
该模式仅依赖对称 token 来签署（HMAC-SHA256）发现信息，这些信息用于建立 master 的信任根。
可以在 Kubernetes 1.8 或更高的版本中使用 `--discovery-token-unsafe-skip-ca-verification`
参数（来启用该模式），但如果可能的话，您应该考虑使用其他模式。

<!--
**Example `kubeadm join` command:**
-->
**`kubeadm join` 命令示例：**

```
kubeadm join --token abcdef.1234567890abcdef --discovery-token-unsafe-skip-ca-verification 1.2.3.4:6443`
```

<!--
**Advantages:**

 - Still protects against many network-level attacks.
-->
**优势：**

 - 仍然能够保护免受许多网络级别的攻击。

<!--
 - The token can be generated ahead of time and shared with the master and
   worker nodes, which can then bootstrap in parallel without coordination. This
   allows it to be used in many provisioning scenarios.
-->
 - token 可以提前生成，并在 master 和工作 node 间共享，然后可以无耦合地并行初始化。
   这使得该模式能够在许多供应场景中使用。

<!--
**Disadvantages:**

 - If an attacker is able to steal a bootstrap token via some vulnerability,
   they can use that token (along with network-level access) to impersonate the
   master to other bootstrapping nodes. This may or may not be an appropriate
   tradeoff in your environment.
-->
**缺点：**

 - 如果攻击者能够通过某些漏洞窃取 bootstrap token，他们就能够使用该 token
   （随着网络级访问）来模拟 master 到其他初始化 node 的行为。 在您的环境中，
   这种折衷（即牺牲这种安全性）可能合适，也可能不合适。

<!--
#### File or HTTPS-based discovery
This provides an out-of-band way to establish a root of trust between the master
and bootstrapping nodes.   Consider using this mode if you are building automated provisioning
using kubeadm.
-->
#### 基于文件或 HTTPS 的发现
该模式提供了一种 “域外（out-of-band）” 方式来建立 master 和 初始化 node 间的信任根。
如果您正使用 kubeadm 构建自动供应，请考虑使用此模式。

<!--
**Example `kubeadm join` commands:**

 - `kubeadm join --discovery-file path/to/file.conf` (local file)

 - `kubeadm join --discovery-file https://url/file.conf` (remote HTTPS URL)
-->
**`kubeadm join` 命令示例：**

 - `kubeadm join --discovery-file path/to/file.conf` (本地文件)

 - `kubeadm join --discovery-file https://url/file.conf` (远程 HTTPS URL)

<!--
**Advantages:**

 - Allows bootstrapping nodes to securely discover a root of trust for the
   master even if the network or other worker nodes are compromised.
-->
**优势：**

 - 即使在其他 node 或网络受到破坏时，也能够引导 node 安全地发现用于 master 的信任根。

<!--
**Disadvantages:**

 - Requires that you have some way to carry the discovery information from
   the master to the bootstrapping nodes. This might be possible, for example,
   via your cloud provider or provisioning tool. The information in this file is
   not secret, but HTTPS or equivalent is required to ensure its integrity.
-->
**缺点：**

 - 要求您有某种方式将发现信息从 master 传递到初始化 node。 例如，这可以通过您的云服务提供商或供应工具来实现。
 该文件中的信息不是机密性的，但是需要 HTTPS 或等效的机制来保证信息的完整性。

<!--
### Securing your installation even more {#securing-more}

The defaults for kubeadm may not work for everyone. This section documents how to tighten up a kubeadm installation
at the cost of some usability.
-->
### 确保您的安装更加安全 {#securing-more}

kubeadm 的默认行为可能不适合每一个人。 本节记录了如何在牺牲某些可用性的情况下，使 kubeadm 安装更加安全。



<!--
#### Turning off auto-approval of node client certificates

By default, there is a CSR auto-approver enabled that basically approves any client certificate request
for a kubelet when a Bootstrap Token was used when authenticating. If you don't want the cluster to
automatically approve kubelet client certs, you can turn it off by executing this command:
-->
#### 关闭 node 客户端证书的自动批准

默认情况下，（Kubernetes）会启用一个 CSR 自动审批器（auto-approver），当使用 Bootstrap Token 进行认证时，
该审批器基本上会批准任何针对 kubelet 的客户端证书请求。 如果您不希望集群自动批准 kubelet 客户端证书，
您可以通过执行以下命令来关闭它：

```console
$ kubectl delete clusterrole kubeadm:node-autoapprove-bootstrap
```

<!--
After that, `kubeadm join` will block until the admin has manually approved the CSR in flight:
-->
在这之后，`kubeadm join` 会阻塞，直到管理员手动批准 CSR。

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
只有在 `kubectl certificate approve` 已经运行后，`kubeadm join` 才可以进行。

<!--
#### Turning off public access to the cluster-info ConfigMap

In order to achieve the joining flow using the token as the only piece of validation information, a
 ConfigMap with some data needed for validation of the master's identity is exposed publicly by
default. While there is no private data in this ConfigMap, some users might wish to turn
it off regardless. Doing so will disable the ability to use the `--discovery-token` flag of the
`kubeadm join` flow. Here are the steps to do so:
-->
#### 关闭 cluster-info ConfigMap 的公共访问权限

为了使用 token 作为唯一的验证信息来实现加入（集群）的流程，默认情况下，用户需要公开暴露一个 ConfigMap，
ConfigMap 中包含了一些 master 身份校验所需的数据。 尽管这个 ConfigMap 中没有个人数据，不管怎样，
一些用户仍然可能希望关闭它（公共访问权限）。 这样做会使用户无法使用 `kubeadm join` 流程中的
`--discovery-token` 参数。 下面是关闭公共访问权限的步骤：


<!--
* Fetch the `cluster-info` file from the API Server:
-->
* 从 API Server 获取 `cluster-info` 文件：

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
* 使用 `cluster-info.yaml` 文件作为 `kubeadm join --discovery-file` 的一个参数。

* 关闭 `cluster-info` ConfigMap 的公共访问权限：

```console
$ kubectl -n kube-public delete rolebinding kubeadm:bootstrap-signer-clusterinfo
```

<!--
These commands should be run after `kubeadm init` but before `kubeadm join`.
-->
这些命令应该在 `kubeadm init` 之后、 `kubeadm join` 之前运行。

<!--
### Using kubeadm join with a configuration file {#config-file}

**Caution:** The config file is
still considered alpha and may change in future versions.
{: .caution}
-->
### 通过配置文件来使用 kubeadm join {#config-file}

**注意：** 配置文件（方式）仍被认为是 alpha 特性，在将来的版本中可能发生变化。
{: .caution}

<!--
It's possible to configure `kubeadm join` with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options.  This file is passed in the `--config` option.
-->
也可以使用配置文件代替命令行参数来配置 `kubeadm join`，并且某些更高级的特性只能够在配置文件的形式下使用。
该配置文件通过 `--config` 参数传入。

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
{% endcapture %}

{% capture whatsnext %}
<!--
* [kubeadm init](kubeadm-init.md) to bootstrap a Kubernetes master node
* [kubeadm token](kubeadm-token.md) to manage tokens for `kubeadm join`
* [kubeadm reset](kubeadm-reset.md) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
-->
* [kubeadm init](kubeadm-init.md) 来初始化一个 Kubernetes master 节点
* [kubeadm token](kubeadm-token.md) 来管理用于 `kubeadm join` 的 token
* [kubeadm reset](kubeadm-reset.md) 来恢复任何通过 `kubeadm init` 或 `kubeadm join` 对主机所做的修改
{% endcapture %}

{% include templates/concept.md %}
