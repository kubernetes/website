---
title: 网络插件
content_type: concept
weight: 10
---
<!--
title: Network Plugins
content_type: concept
weight: 10
-->


<!-- overview -->

<!-- 
Kubernetes {{< skew currentVersion >}} supports [Container Network Interface](https://github.com/containernetworking/cni)
(CNI) plugins for cluster networking. You must use a CNI plugin that is compatible with your cluster and that suits your needs. Different plugins are available (both open- and closed- source) in the wider Kubernetes ecosystem. 
-->
Kubernetes {{< skew currentVersion >}} 支持[容器网络接口](https://github.com/containernetworking/cni) (CNI) 集群网络插件。
你必须使用和你的集群相兼容并且满足你的需求的 CNI 插件。
在更广泛的 Kubernetes 生态系统中你可以使用不同的插件（开源和闭源）。

<!-- 
You must use a CNI plugin that is compatible with the 
[v0.4.0](https://github.com/containernetworking/cni/blob/spec-v0.4.0/SPEC.md) or later
releases of the CNI specification. The Kubernetes project recommends using a plugin that is
compatible with the [v1.0.0](https://github.com/containernetworking/cni/blob/spec-v1.0.0/SPEC.md)
CNI specification (plugins can be compatible with multiple spec versions). 
-->
你必须使用与 [v0.4.0](https://github.com/containernetworking/cni/blob/spec-v0.4.0/SPEC.md)
或更高版本的 CNI 规范相符合的 CNI 插件。
Kubernetes 推荐使用一个兼容 [v1.0.0](https://github.com/containernetworking/cni/blob/spec-v1.0.0/SPEC.md)
CNI 规范的插件（插件可以兼容多个规范版本）。

<!-- body -->

<!--
## Installation

A CNI plugin is required to implement the [Kubernetes network model](/docs/concepts/services-networking/#the-kubernetes-network-model). The CRI manages its own CNI plugins. There are two Kubelet command line parameters to keep in mind when using plugins:

* `cni-bin-dir`: Kubelet probes this directory for plugins on startup
* `network-plugin`: The network plugin to use from `cni-bin-dir`.  It must match the name reported by a plugin probed from the plugin directory.  For CNI plugins, this is "cni".
-->
## 安装

CNI 插件需要实现 [Kubernetes 网络模型](/zh/docs/concepts/services-networking/#the-kubernetes-network-model)。
CRI 管理它自己的 CNI 插件。
在使用插件时，需要记住两个 kubelet 命令行参数：

* `cni-bin-dir`： kubelet 在启动时探测这个目录中的插件
* `network-plugin`： 要使用的网络插件来自 `cni-bin-dir`。
  它必须与从插件目录探测到的插件报告的名称匹配。
  对于 CNI 插件，其值为 "cni"。

<!--
## Network Plugin Requirements

Besides providing the [`NetworkPlugin` interface](https://github.com/kubernetes/kubernetes/tree/{{< param "fullversion" >}}/pkg/kubelet/dockershim/network/plugins.go) to configure and clean up pod networking, the plugin may also need specific support for kube-proxy.  The iptables proxy obviously depends on iptables, and the plugin may need to ensure that container traffic is made available to iptables.  For example, if the plugin connects containers to a Linux bridge, the plugin must set the `net/bridge/bridge-nf-call-iptables` sysctl to `1` to ensure that the iptables proxy functions correctly.  If the plugin does not use a Linux bridge (but instead something like Open vSwitch or some other mechanism) it should ensure container traffic is appropriately routed for the proxy.

By default if no kubelet network plugin is specified, the `noop` plugin is used, which sets `net/bridge/bridge-nf-call-iptables=1` to ensure simple configurations (like Docker with a bridge) work correctly with the iptables proxy.
-->
## 网络插件要求

除了提供
[`NetworkPlugin` 接口](https://github.com/kubernetes/kubernetes/tree/{{< param "fullversion" >}}/pkg/kubelet/dockershim/network/plugins.go)
来配置和清理 Pod 网络之外，该插件还可能需要对 kube-proxy 的特定支持。
iptables 代理显然依赖于 iptables，插件可能需要确保 iptables 能够监控容器的网络通信。
例如，如果插件将容器连接到 Linux 网桥，插件必须将 `net/bridge/bridge-nf-call-iptables`
系统参数设置为`1`，以确保 iptables 代理正常工作。
如果插件不使用 Linux 网桥（而是类似于 Open vSwitch 或者其它一些机制），
它应该确保为代理对容器通信执行正确的路由。

默认情况下，如果未指定 kubelet 网络插件，则使用 `noop` 插件，
该插件设置 `net/bridge/bridge-nf-call-iptables=1`，以确保简单的配置
（如带网桥的 Docker ）与 iptables 代理正常工作。

<!--
### CNI

The CNI plugin is selected by passing Kubelet the `--network-plugin=cni` command-line option.  Kubelet reads a file from `--cni-conf-dir` (default `/etc/cni/net.d`) and uses the CNI configuration from that file to set up each pod's network.  The CNI configuration file must match the [CNI specification](https://github.com/containernetworking/cni/blob/master/SPEC.md#network-configuration), and any required CNI plugins referenced by the configuration must be present in `--cni-bin-dir` (default `/opt/cni/bin`).

If there are multiple CNI configuration files in the directory, the kubelet uses the configuration file that comes first by name in lexicographic order.

In addition to the CNI plugin specified by the configuration file, Kubernetes requires the standard CNI [`lo`](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go) plugin, at minimum version 0.2.0
-->
### CNI

通过给 Kubelet 传递 `--network-plugin=cni` 命令行选项可以选择 CNI 插件。
Kubelet 从 `--cni-conf-dir` （默认是 `/etc/cni/net.d`） 读取文件并使用
该文件中的 CNI 配置来设置各个 Pod 的网络。
CNI 配置文件必须与
[CNI 规约](https://github.com/containernetworking/cni/blob/master/SPEC.md#network-configuration)
匹配，并且配置所引用的所有所需的 CNI 插件都应存在于
`--cni-bin-dir`（默认是 `/opt/cni/bin`）下。

如果这个目录中有多个 CNI 配置文件，kubelet 将会使用按文件名的字典顺序排列
的第一个作为配置文件。

除了配置文件指定的 CNI 插件外，Kubernetes 还需要标准的 CNI
[`lo`](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go)
插件，最低版本是0.2.0。

<!--
#### Support hostPort

The CNI networking plugin supports `hostPort`. You can use the official [portmap](https://github.com/containernetworking/plugins/tree/master/plugins/meta/portmap)
plugin offered by the CNI plugin team or use your own plugin with portMapping functionality.

If you want to enable `hostPort` support, you must specify `portMappings capability` in your `cni-conf-dir`.
For example:
-->
#### 支持 hostPort

CNI 网络插件支持 `hostPort`。 你可以使用官方
[portmap](https://github.com/containernetworking/plugins/tree/master/plugins/meta/portmap)
插件，它由 CNI 插件团队提供，或者使用你自己的带有 portMapping 功能的插件。

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

**Experimental Feature**

The CNI networking plugin also supports pod ingress and egress traffic shaping. You can use the official [bandwidth](https://github.com/containernetworking/plugins/tree/master/plugins/meta/bandwidth)
plugin offered by the CNI plugin team or use your own plugin with bandwidth control functionality.

If you want to enable traffic shaping support, you must add the `bandwidth` plugin to your CNI configuration file
(default `/etc/cni/net.d`) and ensure that the binary is included in your CNI bin dir (default `/opt/cni/bin`).
-->
#### 支持流量整形

**实验功能**

CNI 网络插件还支持 pod 入口和出口流量整形。
你可以使用 CNI 插件团队提供的
[bandwidth](https://github.com/containernetworking/plugins/tree/master/plugins/meta/bandwidth)
插件，也可以使用你自己的具有带宽控制功能的插件。

如果你想要启用流量整形支持，你必须将 `bandwidth` 插件添加到 CNI 配置文件
（默认是 `/etc/cni/net.d`）并保证该可执行文件包含在你的 CNI 的 bin
文件夹内 (默认为 `/opt/cni/bin`)。

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
现在，你可以将 `kubernetes.io/ingress-bandwidth` 和 `kubernetes.io/egress-bandwidth`
注解添加到 pod 中。例如：

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
## Usage Summary

* `--network-plugin=cni` specifies that we use the `cni` network plugin with actual CNI plugin binaries located in `--cni-bin-dir` (default `/opt/cni/bin`) and CNI plugin configuration located in `--cni-conf-dir` (default `/etc/cni/net.d`).
-->
## 用法总结

* `--network-plugin=cni` 用来表明我们要使用 `cni` 网络插件，实际的 CNI 插件
  可执行文件位于 `--cni-bin-dir`（默认是 `/opt/cni/bin`）下， CNI 插件配置位于
  `--cni-conf-dir`（默认是 `/etc/cni/net.d`）下。

## {{% heading "whatsnext" %}}



