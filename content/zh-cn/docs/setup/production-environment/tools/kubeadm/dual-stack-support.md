---
title: 使用 kubeadm 支持双协议栈
content_type: task
weight: 100
min-kubernetes-server-version: 1.21
---
<!--
title: Dual-stack support with kubeadm
content_type: task
weight: 100
min-kubernetes-server-version: 1.21
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
Your Kubernetes cluster includes [dual-stack](/docs/concepts/services-networking/dual-stack/)
networking, which means that cluster networking lets you use either address family.
In a cluster, the control plane can assign both an IPv4 address and an IPv6 address to a single
{{< glossary_tooltip text="Pod" term_id="pod" >}} or a {{< glossary_tooltip text="Service" term_id="service" >}}.
-->
你的集群包含[双协议栈](/zh-cn/docs/concepts/services-networking/dual-stack/)组网支持，
这意味着集群网络允许你在两种地址族间任选其一。在集群中，控制面可以为同一个
{{< glossary_tooltip text="Pod" term_id="pod" >}} 或者
{{< glossary_tooltip text="Service" term_id="service" >}}
同时赋予 IPv4 和 IPv6 地址。

<!-- body -->

## {{% heading "prerequisites" %}}

<!--
You need to have installed the {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}} tool,
following the steps from [Installing kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
-->
你需要已经遵从[安装 kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)
中所给的步骤安装了 {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}} 工具。

<!--
For each server that you want to use as a {{< glossary_tooltip text="node" term_id="node" >}},
make sure it allows IPv6 forwarding. On Linux, you can set this by running run
`sysctl -w net.ipv6.conf.all.forwarding=1` as the root user on each server.
-->
针对你要作为{{< glossary_tooltip text="节点" term_id="node" >}}使用的每台服务器，
确保其允许 IPv6 转发。在 Linux 节点上，你可以通过以 root 用户在每台服务器上运行
`sysctl -w net.ipv6.conf.all.forwarding=1` 来完成设置。

<!--
You need to have an IPv4 and and IPv6 address range to use. Cluster operators typically
use private address ranges for IPv4. For IPv6, a cluster operator typically chooses a global
unicast address block from within `2000::/3`, using a range that is assigned to the operator.
You don't have to route the cluster's IP address ranges to the public internet.

The size of the IP address allocations should be suitable for the number of Pods and
Services that you are planning to run.
-->
你需要一个可以使用的 IPv4 和 IPv6 地址范围。集群操作人员通常对于 IPv4 使用
私有地址范围。对于 IPv6，集群操作人员通常会基于分配给该操作人员的地址范围，
从 `2000::/3` 中选择一个全局的单播地址块。你不需要将集群的 IP 地址范围路由到公众互联网。

所分配的 IP 地址数量应该与你计划运行的 Pod 和 Service 的数量相适应。

{{< note >}}
<!--
If you are upgrading an existing cluster with the `kubeadm upgrade` command,
`kubeadm` does not support making modifications to the pod IP address range
(“cluster CIDR”) nor to the cluster's Service address range (“Service CIDR”).
-->
如果你在使用 `kubeadm upgrade` 命令升级现有的集群，`kubeadm` 不允许更改 Pod
的 IP 地址范围（“集群 CIDR”），也不允许更改集群的服务地址范围（“Service CIDR”）。
{{< /note >}}

<!--
### Create a dual-stack cluster

To create a dual-stack cluster with `kubeadm init` you can pass command line arguments
similar to the following example:
-->
### 创建双协议栈集群   {#create-a-dual-stack-cluster}

要使用 `kubeadm init` 创建一个双协议栈集群，你可以传递与下面的例子类似的命令行参数：

<!--
# These address ranges are examples
-->
```shell
# 这里的地址范围仅作示例使用
kubeadm init --pod-network-cidr=10.244.0.0/16,2001:db8:42:0::/56 --service-cidr=10.96.0.0/16,2001:db8:42:1::/112
```

<!--
To make things clearer, here is an example kubeadm 
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/) 
`kubeadm-config.yaml` for the primary dual-stack control plane node.
-->
为了更便于理解，参看下面的名为 `kubeadm-config.yaml` 的 kubeadm
[配置文件](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)，
该文件用于双协议栈控制面的主控制节点。

```yaml
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16,2001:db8:42:0::/56
  serviceSubnet: 10.96.0.0/16,2001:db8:42:1::/112
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::2"
```

<!--
`advertiseAddress` in InitConfiguration specifies the IP address that the API Server
will advertise it is listening on. The value of `advertiseAddress` equals the
`--apiserver-advertise-address` flag of `kubeadm init`.

Run kubeadm to initiate the dual-stack control plane node:
-->
InitConfiguration 中的 `advertiseAddress` 给出 API 服务器将公告自身要监听的
IP 地址。`advertiseAddress` 的取值与 `kubeadm init` 的标志
`--apiserver-advertise-address` 的取值相同。

运行 kubeadm 来实例化双协议栈控制面节点：

```shell
kubeadm init --config=kubeadm-config.yaml
```

<!--
The kube-controller-manager flags `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6`
are set with default values. See [configure IPv4/IPv6 dual stack](/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack).
-->
kube-controller-manager 标志 `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6`
是使用默认值来设置的。参见[配置 IPv4/IPv6 双协议栈](/zh-cn/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack)。

{{< note >}}
<!--
The `--apiserver-advertise-address` flag does not support dual-stack.
-->
标志 `--apiserver-advertise-address` 不支持双协议栈。
{{< /note >}}

<!--
### Join a node to dual-stack cluster

Before joining a node, make sure that the node has IPv6 routable network interface and allows IPv6 forwarding.

Here is an example kubeadm [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` for joining a worker node to the cluster.
-->
### 向双协议栈集群添加节点   {#join-a-node-to-dual-stack-cluster}

在添加节点之前，请确保该节点具有 IPv6 可路由的网络接口并且启用了 IPv6 转发。

下面的名为 `kubeadm-config.yaml` 的 kubeadm
[配置文件](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)
示例用于向集群中添加工作节点。

<!--
# change auth info above to match the actual token and CA certificate hash for your cluster
-->
```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: JoinConfiguration
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # 请更改上面的认证信息，使之与你的集群中实际使用的令牌和 CA 证书匹配
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::3"
```

<!--
Also, here is an example kubeadm [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` for joining another control plane node to the cluster.
-->
下面的名为 `kubeadm-config.yaml` 的 kubeadm
[配置文件](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)
示例用于向集群中添加另一个控制面节点。

<!--
# change auth info above to match the actual token and CA certificate hash for your cluster
-->
```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
controlPlane:
  localAPIEndpoint:
    advertiseAddress: "10.100.0.2"
    bindPort: 6443
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # 请更改上面的认证信息，使之与你的集群中实际使用的令牌和 CA 证书匹配
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::4"
```

<!--
`advertiseAddress` in JoinConfiguration.controlPlane specifies the IP address that the
API Server will advertise it is listening on. The value of `advertiseAddress` equals
the `--apiserver-advertise-address` flag of `kubeadm join`.
-->
JoinConfiguration.controlPlane 中的 `advertiseAddress` 设定 API 服务器将公告自身要监听的
IP 地址。`advertiseAddress` 的取值与 `kubeadm join` 的标志
`--apiserver-advertise-address` 的取值相同。

```shell
kubeadm join --config=kubeadm-config.yaml
```

<!--
### Create a single-stack cluster
-->
### 创建单协议栈集群    {#create-a-single-stack-cluster}

{{< note >}}
<!--
Dual-stack support doesn't mean that you need to use dual-stack addressing.
You can deploy a single-stack cluster that has the dual-stack networking feature enabled.
-->
双协议栈支持并不意味着你需要使用双协议栈来寻址。
你可以部署一个启用了双协议栈联网特性的单协议栈集群。
{{< /note >}}

<!--
To make things more clear, here is an example kubeadm
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` for the single-stack control plane node.
-->
为了更便于理解，参看下面的名为 `kubeadm-config.yaml` 的 kubeadm
[配置文件](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)示例，
该文件用于单协议栈控制面节点。

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/16
```

## {{% heading "whatsnext" %}}

<!--
* [Validate IPv4/IPv6 dual-stack](/docs/tasks/network/validate-dual-stack) networking
* Read about [Dual-stack](/docs/concepts/services-networking/dual-stack/) cluster networking
* Learn more about the kubeadm [configuration format](/docs/reference/config-api/kubeadm-config.v1beta4/)
-->
* [验证 IPv4/IPv6 双协议栈](/zh-cn/docs/tasks/network/validate-dual-stack)联网
* 阅读[双协议栈](/zh-cn/docs/concepts/services-networking/dual-stack/)集群网络
* 进一步了解 kubeadm [配置格式](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)
