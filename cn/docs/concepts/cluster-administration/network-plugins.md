<!--
---
assignees:
- dcbw
- freehan
- thockin
title: Network Plugins
redirect_from:
- "/docs/admin/network-plugins/"
- "/docs/admin/network-plugins.html"
---
-->
---
assignees:
- dcbw
- freehan
- thockin
title: 网络插件
redirect_from:
- "/docs/admin/network-plugins/"
- "/docs/admin/network-plugins.html"
---

<!--
* TOC
{:toc}

__Disclaimer__: Network plugins are in alpha. Its contents will change rapidly.

Network plugins in Kubernetes come in a few flavors:

* CNI plugins: adhere to the appc/CNI specification, designed for interoperability.
* Kubenet plugin: implements basic `cbr0` using the `bridge` and `host-local` CNI plugins
-->
* TOC
{:toc}

__免责声明__: 网络插件还处于Alpha测试版。其内容会经常发生变化。

Kubernetes中的网络插件会带有一些特点：

* CNI plugins: 遵守appc/CNI规范，旨在实现互操作性。
* Kubenet plugins: 基于`cbr0`，使用CNI的`bridge`和`host-local`插件

<!--
## Installation

The kubelet has a single default network plugin, and a default network common to the entire cluster. It probes for plugins when it starts up, remembers what it found, and executes the selected plugin at appropriate times in the pod lifecycle (this is only true for docker, as rkt manages its own CNI plugins). There are two Kubelet command line parameters to keep in mind when using plugins:

* `network-plugin-dir`: Kubelet probes this directory for plugins on startup
* `network-plugin`: The network plugin to use from `network-plugin-dir`.  It must match the name reported by a plugin probed from the plugin directory.  For CNI plugins, this is simply "cni".
-->
## 安装

kubelet拥有单一默认的网络插件，并且是整个集群通用的默认网络。当它在启用时检测插件，记忆发现的内容，并在pod生命周期中适当地执行选定的插件（这对于docker来说是正确的，因为rkt管理自己的CNI插件）。当使用插件时，请记住两个kubelet命令行参数：

*  `network-plugin-dir`: kubelet在启动时检测这个插件目录。
*  `network-plugin`: `network-plugin-dir`要使用的网络插件。它必须与插件目录中检测的插件名相匹配。对于CNI网络，就匹配"cni"。

<!--
## Network Plugin Requirements

Besides providing the [`NetworkPlugin` interface](https://github.com/kubernetes/kubernetes/tree/{{page.fullversion}}/pkg/kubelet/network/plugins.go) to configure and clean up pod networking, the plugin may also need specific support for kube-proxy.  The iptables proxy obviously depends on iptables, and the plugin may need to ensure that container traffic is made available to iptables.  For example, if the plugin connects containers to a Linux bridge, the plugin must set the `net/bridge/bridge-nf-call-iptables` sysctl to `1` to ensure that the iptables proxy functions correctly.  If the plugin does not use a Linux bridge (but instead something like Open vSwitch or some other mechanism) it should ensure container traffic is appropriately routed for the proxy.

By default if no kubelet network plugin is specified, the `noop` plugin is used, which sets `net/bridge/bridge-nf-call-iptables=1` to ensure simple configurations (like docker with a bridge) work correctly with the iptables proxy.
-->
## 网络插件要求

除了提供[`NetworkPlugin`接口](https://github.com/kubernetes/kubernetes/tree/{{page.fullversion}}/pkg/kubelet/network/plugins.go)去配置和清理pod网络，此插件还需要对kube-proxy有特定的支持。iptables代理显然依赖于iptables，以确保容器的流量可用于iptables。例如，如果插件将容器连接到Linux网桥，插件必须设置`net/bridge/bridge-nf-call-iptables` sysctl为1，以确保iptables代理功能正常。如果插件不使用Linux网桥（而是像Open vSwitch或其他机制）,就应该确保容器流量正确地路由到代理。

默认情况下，如果没有指定kubelet网络插件。则使用`noop`插件，设置`net/bridge-nf-call-iptables=1`以确保简单的配置（如类似docker的网桥）可与iptables代理正常工作。

<!--
### CNI

The CNI plugin is selected by passing Kubelet the `--network-plugin=cni` command-line option.  Kubelet reads a file from `--cni-conf-dir` (default `/etc/cni/net.d`) and uses the CNI configuration from that file to set up each pod's network.  The CNI configuration file must match the [CNI specification](https://github.com/containernetworking/cni/blob/master/SPEC.md#network-configuration), and any required CNI plugins referenced by the configuration must be present in `--cni-bin-dir` (default `/opt/cni/bin`).

If there are multiple CNI configuration files in the directory, the first one in lexicographic order of file name is used.
-->
### CNI

通过kubelet的`--network-plugin=cni`命令行选择项来选择CNI插件。kubelet从`--cni-conf-dir`（默认为`/etc/cni/net.d`）中读取文件，并使用该文件中的CNI配置去设置每个pod网络。CNI配置文件必须与[CNI](https://github.com/containernetworking/cni/blob/master/SPEC.md#network-configuration)相匹配，并且任何所需的CNI插件的配置必须引用目前的`--cni-bin-dir`(默认为`/opt/cni/bin`)。	

如果目录中有多个CNI配置文件，则使用按文件名字典序列中的第一个。

<!--
In addition to the CNI plugin specified by the configuration file, Kubernetes requires the standard CNI [`lo`](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go) plugin, at minimum version 0.2.0

Limitation: Due to [#31307](https://github.com/kubernetes/kubernetes/issues/31307), `HostPort` won't work with CNI networking plugin at the moment. That means all `hostPort` attribute in pod would be simply ignored.
-->
除了由配置文件指定的CNI插件以外，Kubernetes需要标准的CNI[`lo`](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go)插件，最低版本为0.2.0。

限制：由于[#31307](https://github.com/kubernetes/kubernetes/issues/31307),目前`HostPort`不能使用CNI网络插件。这意味着pod中所有`HostPort`属性将被简单地忽略。

<!--
### kubenet

Kubenet is a very basic, simple network plugin, on Linux only.  It does not, of itself, implement more advanced features like cross-node networking or network policy.  It is typically used together with a cloud provider that sets up routing rules for communication between nodes, or in single-node environments.
-->
### kubenet

kubenet是一个在Linux上非常基本，简单的网络插件。它本身不会实现更高级的功能，如跨node网络或网络策略。它通常与云提供商一起使用，为跨nodes或者单node环境通信设置路由规则。

<!--
Kubenet creates a Linux bridge named `cbr0` and creates a veth pair for each pod with the host end of each pair connected to `cbr0`.  The pod end of the pair is assigned an IP address allocated from a range assigned to the node either through configuration or by the controller-manager.  `cbr0` is assigned an MTU matching the smallest MTU of an enabled normal interface on the host.
-->

kubenet创建名为`cbr0`的Linux网桥，为每一个pod创建veth设备对，并将每一对的主机端连接到`cbr0`。每一对pod端会通过配置或控制器管理而分配到指定的IP地址，`cbr0`会分配的一个匹配主机接口上开启的最小的MTU。

<!--
The plugin requires a few things:

* The standard CNI `bridge`, `lo` and `host-local` plugins are required, at minimum version 0.2.0. Kubenet will first search for them in `/opt/cni/bin`. Specify `network-plugin-dir` to supply additional search path. The first found match will take effect.
* Kubelet must be run with the `--network-plugin=kubenet` argument to enable the plugin
* Kubelet should also be run with the `--non-masquerade-cidr=<clusterCidr>` argument to ensure traffic to IPs outside this range will use IP masquerade.
* The node must be assigned an IP subnet through either the `--pod-cidr` kubelet command-line option or the `--allocate-node-cidrs=true --cluster-cidr=<cidr>` controller-manager command-line options.
-->
此插件需要做一些事：

* 标准CNI需要插件 `网桥`,`lo`和`host-local`，其最低的版本为0.2.0。kubenet首先在`/opt/cni/bin`中搜索。指定`network-plugin-dir`以支持额外的搜索路径。第一个发现匹配的将被生效。
* kubelet必须运行`--network-plugin=kubenet`参数，以开启插件。
* kubelet也可以运行`--non-masquerade-cidr=<clusterCidr>`参数，向该IP段之外的IP地址发送的流量将使用IP masquerade技术。
* node必须被分配到一个IP子网，无论`--pod-cidr`命令行选项或是`--allcate-node-cidrs=true --cluster-cidr=<cidr>`控制管理命令行选项。

<!--
### Customizing the MTU (with kubenet)

The MTU should always be configured correctly to get the best networking performance.  Network plugins will usually try
to infer a sensible MTU, but sometimes the logic will not result in an optimal MTU.  For example, if the
Docker bridge or another interface has a small MTU, kubenet will currently select that MTU.  Or if you are
using IPSEC encapsulation, the MTU must be reduced, and this calculation is out-of-scope for
most network plugins.
-->
### 定制MTU（使用kubenet)

正确的配置MTU才能获得最佳的网络性能。网络插件通常会尝试去推断出合理的MTU，但有时的逻辑，推断不出最优的MTU。例如，如果Docker网桥或其他具有小MTU的接口，kubenet将会选择当前的MTU。如果你使用IPSEC封装，MTU必会被减少，此计算对于大多数的网络插件来说都不合适。

<!--
Where needed, you can specify the MTU explicitly with the `network-plugin-mtu` kubelet option.  For example,
on AWS the `eth0` MTU is typically 9001, so you might specify `--network-plugin-mtu=9001`.  If you're using IPSEC you
might reduce it to allow for encapsulation overhead e.g. `--network-plugin-mtu=8873`.

This option is provided to the network-plugin; currently **only kubenet supports `network-plugin-mtu`**.
-->
在需要的地方，你可以使用kuelet的`network-plugin-mtu`选项指定MTU，例如，在AWS上，`eth0`MTU通常为9001，你也可以指定`--network-plugin-mtu=9001`。如果你使用IPSEC，可以为了封装开销而减少MTU，例如`--network-plugin-mtu=8873`。

只有网络插件提供此选项，目前**只有kubenet支持`network-plugin-mtu`**。

<!--
## Usage Summary

* `--network-plugin=cni` specifies that we use the `cni` network plugin with actual CNI plugin binaries located in `--cni-bin-dir` (default `/opt/cni/bin`) and CNI plugin configuration located in `--cni-conf-dir` (default `/etc/cni/net.d`).
* `--network-plugin=kubenet` specifies that we use the `kubenet` network plugin with CNI `bridge` and `host-local` plugins placed in `/opt/cni/bin` or `network-plugin-dir`.
* `--network-plugin-mtu=9001` specifies the MTU to use, currently only used by the `kubenet` network plugin.
-->
## 用法总结

* `--network-plugin=cni`规定了`cni`网络插件的使用，CNI插件二进制文件位于`--cni-bin-dir`（默认是`/opt/cni/bin`），其配置位于`--cni-conf-dir`（默认是/etc/cni/net.d）。
* `--network-plugin=kubenet`规定了`kubenet`网络插件的使用，CNI的`bridge`和`host-local`插件，位于`/opt/cni/bin`或`network-plugin-dir`
* `--network-plugin-mtu=9001`规定MTU的使用，目前只能在`kubenet`网络插件中使用。


