---
title: 网络插件
content_template: templates/concept
weight: 10
---


{{% capture overview %}}

{{< feature-state state="alpha" >}}
<!--
{{< warning >}}Alpha features change rapidly. {{< /warning >}}
-->
{{< warning >}}Alpha 特性迅速变化。{{< /warning >}}

<!--
Network plugins in Kubernetes come in a few flavors:

* CNI plugins: adhere to the appc/CNI specification, designed for interoperability.
* Kubenet plugin: implements basic `cbr0` using the `bridge` and `host-local` CNI plugins
-->
Kubernetes中的网络插件有几种类型：

* CNI 插件： 遵守 appc/CNI 规约，为互操作性设计。
* Kubenet 插件：使用 `bridge` 和 `host-local` CNI 插件实现了基本的 `cbr0`。

{{% /capture %}}

{{% capture body %}}

<!--
## Installation

The kubelet has a single default network plugin, and a default network common to the entire cluster. It probes for plugins when it starts up, remembers what it found, and executes the selected plugin at appropriate times in the pod lifecycle (this is only true for Docker, as rkt manages its own CNI plugins). There are two Kubelet command line parameters to keep in mind when using plugins:

* `cni-bin-dir`: Kubelet probes this directory for plugins on startup
* `network-plugin`: The network plugin to use from `cni-bin-dir`.  It must match the name reported by a plugin probed from the plugin directory.  For CNI plugins, this is simply "cni".
-->
## 安装

kubelet 有一个单独的默认网络插件，以及一个对整个集群通用的默认网络。
它在启动时探测插件，记住找到的内容，并在 pod 生命周期的适当时间执行所选插件（这仅适用于 Docker，因为 rkt 管理自己的 CNI 插件）。
在使用插件时，需要记住两个 Kubelet 命令行参数：

* `cni-bin-dir`： Kubelet 在启动时探测这个目录中的插件
* `network-plugin`： 要使用的网络插件来自 `cni-bin-dir`。它必须与从插件目录探测到的插件报告的名称匹配。对于 CNI 插件，其值为 "cni"。

<!--
## Network Plugin Requirements

Besides providing the [`NetworkPlugin` interface](https://github.com/kubernetes/kubernetes/tree/{{< param "fullversion" >}}/pkg/kubelet/dockershim/network/plugins.go) to configure and clean up pod networking, the plugin may also need specific support for kube-proxy.  The iptables proxy obviously depends on iptables, and the plugin may need to ensure that container traffic is made available to iptables.  For example, if the plugin connects containers to a Linux bridge, the plugin must set the `net/bridge/bridge-nf-call-iptables` sysctl to `1` to ensure that the iptables proxy functions correctly.  If the plugin does not use a Linux bridge (but instead something like Open vSwitch or some other mechanism) it should ensure container traffic is appropriately routed for the proxy.

By default if no kubelet network plugin is specified, the `noop` plugin is used, which sets `net/bridge/bridge-nf-call-iptables=1` to ensure simple configurations (like Docker with a bridge) work correctly with the iptables proxy.
-->
## 网络插件要求

除了提供[`NetworkPlugin` 接口](https://github.com/kubernetes/kubernetes/tree/{{< param "fullversion" >}}/pkg/kubelet/dockershim/network/plugins.go)来配置和清理 pod 网络之外，该插件还可能需要对 kube-proxy 的特定支持。
iptables 代理显然依赖于 iptables，插件可能需要确保 iptables 能够监控容器的网络通信。
例如，如果插件将容器连接到 Linux 网桥，插件必须将 `net/bridge/bridge-nf-call-iptables` 系统参数设置为`1`，以确保 iptables 代理正常工作。
如果插件不使用 Linux 网桥（而是类似于 Open vSwitch 或者其它一些机制），它应该确保为代理对容器通信执行正确的路由。

默认情况下，如果未指定 kubelet 网络插件，则使用 `noop` 插件，该插件设置 `net/bridge/bridge-nf-call-iptables=1`，以确保简单的配置（如带网桥的 Docker ）与 iptables 代理正常工作。

<!--
### CNI

The CNI plugin is selected by passing Kubelet the `--network-plugin=cni` command-line option.  Kubelet reads a file from `--cni-conf-dir` (default `/etc/cni/net.d`) and uses the CNI configuration from that file to set up each pod's network.  The CNI configuration file must match the [CNI specification](https://github.com/containernetworking/cni/blob/master/SPEC.md#network-configuration), and any required CNI plugins referenced by the configuration must be present in `--cni-bin-dir` (default `/opt/cni/bin`).

If there are multiple CNI configuration files in the directory, the first one in lexicographic order of file name is used.

In addition to the CNI plugin specified by the configuration file, Kubernetes requires the standard CNI [`lo`](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go) plugin, at minimum version 0.2.0
-->
### CNI

通过给 Kubelet 传递 `--network-plugin=cni` 命令行选项来选择 CNI 插件。
Kubelet 从 `--cni-conf-dir` （默认是 `/etc/cni/net.d`） 读取文件并使用该文件中的 CNI 配置来设置每个 pod 的网络。
CNI 配置文件必须与 [CNI 规约](https://github.com/containernetworking/cni/blob/master/SPEC.md#network-configuration)匹配，并且配置引用的任何所需的 CNI 插件都必须存在于 `--cni-bin-dir`（默认是 `/opt/cni/bin`）。

如果这个目录中有多个 CNI 配置文件，则使用按文件名的字典顺序排列的第一个配置文件。

除了配置文件指定的 CNI 插件外，Kubernetes 还需要标准的 CNI [`lo`](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go) 插件，最低版本是0.2.0。

<!--
#### Support hostPort

The CNI networking plugin supports `hostPort`. You can use the official [portmap](https://github.com/containernetworking/plugins/tree/master/plugins/meta/portmap)
plugin offered by the CNI plugin team or use your own plugin with portMapping functionality.

If you want to enable `hostPort` support, you must specify `portMappings capability` in your `cni-conf-dir`.
For example:
-->
#### 支持 hostPort

CNI 网络插件支持 `hostPort`。 您可以使用官方 [portmap](https://github.com/containernetworking/plugins/tree/master/plugins/meta/portmap)
插件，它由 CNI 插件团队提供，或者使用您自己的带有 portMapping 功能的插件。

如果你想要启动 `hostPort` 支持，则必须在 `cni-conf-dir` 指定 `portMappings capability`。
例如：

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.3.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "portmap",
      "capabilities": {"portMappings": true}
    }
  ]
}
```

<!--
#### Support traffic shaping

The CNI networking plugin also supports pod ingress and egress traffic shaping. You can use the official [bandwidth](https://github.com/containernetworking/plugins/tree/master/plugins/meta/bandwidth)
plugin offered by the CNI plugin team or use your own plugin with bandwidth control functionality.

If you want to enable traffic shaping support, you must add a `bandwidth` plugin to your CNI configuration file
(default `/etc/cni/net.d`).
-->
#### 支持流量整形

CNI 网络插件还支持 pod 入口和出口流量整形。
您可以使用 CNI 插件团队提供的 [bandwidth](https://github.com/containernetworking/plugins/tree/master/plugins/meta/bandwidth) 插件，
也可以使用您自己的具有带宽控制功能的插件。

如果您想要启用流量整形支持，你必须将 `bandwidth` 插件添加到 CNI 配置文件
（默认是 `/etc/cni/net.d`）。

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.3.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "bandwidth",
      "capabilities": {"bandwidth": true}
    }
  ]
}
```

<!--
Now you can add the `kubernetes.io/ingress-bandwidth` and `kubernetes.io/egress-bandwidth` annotations to your pod.
For example:
-->
现在，您可以将 `kubernetes.io/ingress-bandwidth` 和 `kubernetes.io/egress-bandwidth` 注解添加到 pod 中。
例如：

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubernetes.io/ingress-bandwidth: 1M
    kubernetes.io/egress-bandwidth: 1M
...
```

<!--
### kubenet

Kubenet is a very basic, simple network plugin, on Linux only.  It does not, of itself, implement more advanced features like cross-node networking or network policy.  It is typically used together with a cloud provider that sets up routing rules for communication between nodes, or in single-node environments.

Kubenet creates a Linux bridge named `cbr0` and creates a veth pair for each pod with the host end of each pair connected to `cbr0`.  The pod end of the pair is assigned an IP address allocated from a range assigned to the node either through configuration or by the controller-manager.  `cbr0` is assigned an MTU matching the smallest MTU of an enabled normal interface on the host.

The plugin requires a few things:

* The standard CNI `bridge`, `lo` and `host-local` plugins are required, at minimum version 0.2.0. Kubenet will first search for them in `/opt/cni/bin`. Specify `cni-bin-dir` to supply additional search path. The first found match will take effect.
* Kubelet must be run with the `--network-plugin=kubenet` argument to enable the plugin
* Kubelet should also be run with the `--non-masquerade-cidr=<clusterCidr>` argument to ensure traffic to IPs outside this range will use IP masquerade.
* The node must be assigned an IP subnet through either the `--pod-cidr` kubelet command-line option or the `--allocate-node-cidrs=true --cluster-cidr=<cidr>` controller-manager command-line options.
-->
### kubenet

Kubenet 是一个非常基本的、简单的网络插件，仅适用于 Linux。
它本身并不实现更高级的功能，如跨节点网络或网络策略。
它通常与云驱动一起使用，云驱动为节点间或单节点环境中的通信设置路由规则。

Kubenet 创建名为 `cbr0` 的网桥，并为每个 pod 创建了一个 veth 对，每个 pod 的主机端都连接到 `cbr0`。
这个 veth 对的 pod 端会被分配一个 IP 地址，该 IP 地址隶属于节点所被分配的 IP 地址范围内。节点的 IP 地址范围则通过配置或控制器管理器来设置。
`cbr0` 被分配一个 MTU，该 MTU 匹配主机上已启用的正常接口的最小 MTU。

使用此插件还需要一些其他条件：

* 需要标准的 CNI `bridge`、`lo` 以及 `host-local` 插件，最低版本是0.2.0。Kubenet 首先在 `/opt/cni/bin` 中搜索它们。 指定 `cni-bin-dir` 以提供其它的搜索路径。首次找到的匹配将生效。
* Kubelet 必须和 `--network-plugin=kubenet` 参数一起运行，才能启用该插件。
* Kubelet 还应该和 `--non-masquerade-cidr=<clusterCidr>` 参数一起运行，以确保超出此范围的 IP 流量将使用 IP 伪装。
* 节点必须被分配一个 IP 子网，通过kubelet 命令行的 `--pod-cidr` 选项或控制器管理器的命令行选项 `--allocate-node-cidrs=true --cluster-cidr=<cidr>` 来设置。

<!--
### Customizing the MTU (with kubenet)

The MTU should always be configured correctly to get the best networking performance.  Network plugins will usually try
to infer a sensible MTU, but sometimes the logic will not result in an optimal MTU.  For example, if the
Docker bridge or another interface has a small MTU, kubenet will currently select that MTU.  Or if you are
using IPSEC encapsulation, the MTU must be reduced, and this calculation is out-of-scope for
most network plugins.

Where needed, you can specify the MTU explicitly with the `network-plugin-mtu` kubelet option.  For example,
on AWS the `eth0` MTU is typically 9001, so you might specify `--network-plugin-mtu=9001`.  If you're using IPSEC you
might reduce it to allow for encapsulation overhead e.g. `--network-plugin-mtu=8873`.

This option is provided to the network-plugin; currently **only kubenet supports `network-plugin-mtu`**.
-->
### 自定义 MTU（使用 kubenet）

要获得最佳的网络性能，必须确保 MTU 的取值配置正确。
网络插件通常会尝试推断出一个合理的 MTU，但有时候这个逻辑不会产生一个最优的 MTU。
例如，如果 Docker 网桥或其他接口有一个小的 MTU, kubenet 当前将选择该 MTU。
或者如果您正在使用 IPSEC 封装，则必须减少 MTU，并且这种计算超出了大多数网络插件的能力范围。

如果需要，您可以使用 `network-plugin-mtu` kubelet 选项显式的指定 MTU。
例如：在 AWS 上 `eth0` MTU 通常是 9001，因此您可以指定 `--network-plugin-mtu=9001`。
如果您正在使用 IPSEC ，您可以减少它以允许封装开销，例如 `--network-plugin-mtu=8873`。

此选项会传递给网络插件； 当前 **仅 kubenet 支持 `network-plugin-mtu`**。

<!--
## Usage Summary

* `--network-plugin=cni` specifies that we use the `cni` network plugin with actual CNI plugin binaries located in `--cni-bin-dir` (default `/opt/cni/bin`) and CNI plugin configuration located in `--cni-conf-dir` (default `/etc/cni/net.d`).
* `--network-plugin=kubenet` specifies that we use the `kubenet` network plugin with CNI `bridge` and `host-local` plugins placed in `/opt/cni/bin` or `cni-bin-dir`.
* `--network-plugin-mtu=9001` specifies the MTU to use, currently only used by the `kubenet` network plugin.
-->
## 使用总结

* `--network-plugin=cni` 用来表明我们要使用 `cni` 网络插件，实际的 CNI 插件可执行文件位于 `--cni-bin-dir`（默认是 `/opt/cni/bin`）下， CNI 插件配置位于 `--cni-conf-dir`（默认是 `/etc/cni/net.d`）下。
* `--network-plugin=kubenet` 用来表明我们要使用 `kubenet` 网络插件，CNI `bridge` 和 `host-local` 插件位于 `/opt/cni/bin` 或 `cni-bin-dir` 中。
* `--network-plugin-mtu=9001` 指定了我们使用的 MTU，当前仅被 `kubenet` 网络插件使用。

{{% /capture %}}

{{% capture whatsnext %}}

{{% /capture %}}
