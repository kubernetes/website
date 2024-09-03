---
title: 使用 kubeadm 创建集群
content_type: task
weight: 30
---
<!--
reviewers:
- sig-cluster-lifecycle
title: Creating a cluster with kubeadm
content_type: task
weight: 30
-->

<!-- overview -->

<!--
<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
Using `kubeadm`, you can create a minimum viable Kubernetes cluster that conforms to best practices.
In fact, you can use `kubeadm` to set up a cluster that will pass the
[Kubernetes Conformance tests](/blog/2017/10/software-conformance-certification/).
`kubeadm` also supports other cluster lifecycle functions, such as
[bootstrap tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) and cluster upgrades.
-->
<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
使用 `kubeadm`，你能创建一个符合最佳实践的最小化 Kubernetes 集群。
事实上，你可以使用 `kubeadm` 配置一个通过
[Kubernetes 一致性测试](/blog/2017/10/software-conformance-certification/)的集群。
`kubeadm` 还支持其他集群生命周期功能，
例如[启动引导令牌](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)和集群升级。

<!--
The `kubeadm` tool is good if you need:

- A simple way for you to try out Kubernetes, possibly for the first time.
- A way for existing users to automate setting up a cluster and test their application.
- A building block in other ecosystem and/or installer tools with a larger
  scope.
-->
`kubeadm` 工具很棒，如果你需要：

- 一个尝试 Kubernetes 的简单方法。
- 一个现有用户可以自动设置集群并测试其应用程序的途径。
- 其他具有更大范围的生态系统和/或安装工具中的构建模块。

<!--
You can install and use `kubeadm` on various machines: your laptop, a set
of cloud servers, a Raspberry Pi, and more. Whether you're deploying into the
cloud or on-premises, you can integrate `kubeadm` into provisioning systems such
as Ansible or Terraform.
-->
你可以在各种机器上安装和使用 `kubeadm`：笔记本电脑、一组云服务器、Raspberry Pi 等。
无论是部署到云还是本地，你都可以将 `kubeadm` 集成到 Ansible 或 Terraform 这类预配置系统中。

## {{% heading "prerequisites" %}}

<!--
To follow this guide, you need:

- One or more machines running a deb/rpm-compatible Linux OS; for example: Ubuntu or CentOS.
- 2 GiB or more of RAM per machine--any less leaves little room for your
   apps.
- At least 2 CPUs on the machine that you use as a control-plane node.
- Full network connectivity among all machines in the cluster. You can use either a
  public or a private network.
-->
要遵循本指南，你需要：

- 一台或多台运行兼容 deb/rpm 的 Linux 操作系统的计算机；例如：Ubuntu 或 CentOS。
- 每台机器 2 GB 以上的内存，内存不足时应用会受限制。
- 用作控制平面节点的计算机上至少有 2 个 CPU。
- 集群中所有计算机之间具有完全的网络连接。你可以使用公共网络或专用网络。

<!--
You also need to use a version of `kubeadm` that can deploy the version
of Kubernetes that you want to use in your new cluster.
-->
你还需要使用可以在新集群中部署特定 Kubernetes 版本对应的 `kubeadm`。

<!--
[Kubernetes' version and version skew support policy](/docs/setup/release/version-skew-policy/#supported-versions)
applies to `kubeadm` as well as to Kubernetes overall.
Check that policy to learn about what versions of Kubernetes and `kubeadm`
are supported. This page is written for Kubernetes {{< param "version" >}}.
-->
[Kubernetes 版本及版本偏差策略](/zh-cn/releases/version-skew-policy/#supported-versions)适用于
`kubeadm` 以及整个 Kubernetes。
查阅该策略以了解支持哪些版本的 Kubernetes 和 `kubeadm`。
该页面是为 Kubernetes {{< param "version" >}} 编写的。

<!--
The `kubeadm` tool's overall feature state is General Availability (GA). Some sub-features are
still under active development. The implementation of creating the cluster may change
slightly as the tool evolves, but the overall implementation should be pretty stable.
-->
`kubeadm` 工具的整体功能状态为一般可用性（GA）。一些子功能仍在积极开发中。
随着工具的发展，创建集群的实现可能会略有变化，但总体实现应相当稳定。

{{< note >}}
<!--
Any commands under `kubeadm alpha` are, by definition, supported on an alpha level.
-->
根据定义，在 `kubeadm alpha` 下的所有命令均在 Alpha 级别上受支持。
{{< /note >}}

<!-- steps -->

<!--
## Objectives
-->
## 目标 {#objectives}

<!--
* Install a single control-plane Kubernetes cluster
* Install a Pod network on the cluster so that your Pods can
  talk to each other
-->
* 安装单个控制平面的 Kubernetes 集群
* 在集群上安装 Pod 网络，以便你的 Pod 可以相互连通

<!--
## Instructions
-->
## 操作指南 {#instructions}

<!--
### Preparing the hosts

#### Component installation
-->
### 主机准备  {#preparing-the-hosts}

#### 安装组件   {#component-installation}

<!--
Install a {{< glossary_tooltip term_id="container-runtime" text="container runtime" >}} and kubeadm on all the hosts.
For detailed instructions and other prerequisites, see [Installing kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
-->
在所有主机上安装{{< glossary_tooltip term_id="container-runtime" text="容器运行时" >}}和 kubeadm。
详细说明和其他前提条件，请参见[安装 kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)。

{{< note >}}
<!--
If you have already installed kubeadm, see the first two steps of the
[Upgrading Linux nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes) document for instructions on how to upgrade kubeadm.

When you upgrade, the kubelet restarts every few seconds as it waits in a crashloop for
kubeadm to tell it what to do. This crashloop is expected and normal.
After you initialize your control-plane, the kubelet runs normally.
-->
如果你已经安装了 kubeadm，
请查看[升级 Linux 节点](/zh-cn/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes)文档的前两步，
了解如何升级 kubeadm 的说明。

升级时，kubelet 每隔几秒钟重新启动一次，
在 crashloop 状态中等待 kubeadm 发布指令。crashloop 状态是正常现象。
初始化控制平面后，kubelet 将正常运行。
{{< /note >}}

<!--
#### Network setup

kubeadm similarly to other Kubernetes components tries to find a usable IP on
the network interfaces associated with a default gateway on a host. Such
an IP is then used for the advertising and/or listening performed by a component.
-->
#### 网络设置   {#network-setup}

kubeadm 与其他 Kubernetes 组件类似，会尝试在与主机默认网关关联的网络接口上找到可用的 IP 地址。
这个 IP 地址随后用于由某组件执行的公告和/或监听。

<!--
To find out what this IP is on a Linux host you can use:

```shell
ip route show # Look for a line starting with "default via"
```
-->
要在 Linux 主机上获得此 IP 地址，你可以使用以下命令：

```shell
ip route show # 查找以 "default via" 开头的行
```

{{< note >}}
<!--
If two or more default gateways are present on the host, a Kubernetes component will
try to use the first one it encounters that has a suitable global unicast IP address.
While making this choice, the exact ordering of gateways might vary between different
operating systems and kernel versions.
-->
如果主机上存在两个或多个默认网关，Kubernetes 组件将尝试使用遇到的第一个具有合适全局单播 IP 地址的网关。
在做出这个选择时，网关的确切顺序可能因不同的操作系统和内核版本而有所差异。
{{< /note >}}

<!--
Kubernetes components do not accept custom network interface as an option,
therefore a custom IP address must be passed as a flag to all components instances
that need such a custom configuration.
-->
Kubernetes 组件不接受自定义网络接口作为选项，因此必须将自定义 IP
地址作为标志传递给所有需要此自定义配置的组件实例。

{{< note >}}
<!--
If the host does not have a default gateway and if a custom IP address is not passed
to a Kubernetes component, the component may exit with an error.
-->
如果主机没有默认网关，并且没有将自定义 IP 地址传递给 Kubernetes 组件，此组件可能会因错误而退出。
{{< /note >}}

<!--
To configure the API server advertise address for control plane nodes created with both
`init` and `join`, the flag `--apiserver-advertise-address` can be used.
Preferably, this option can be set in the [kubeadm API](/docs/reference/config-api/kubeadm-config.v1beta4)
as `InitConfiguration.localAPIEndpoint` and `JoinConfiguration.controlPlane.localAPIEndpoint`.
-->
要为使用 `init` 或 `join` 创建的控制平面节点配置 API 服务器的公告地址，
你可以使用 `--apiserver-advertise-address` 标志。
最好在 [kubeadm API](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4)中使用
`InitConfiguration.localAPIEndpoint` 和 `JoinConfiguration.controlPlane.localAPIEndpoint`
来设置此选项。

<!--
For kubelets on all nodes, the `--node-ip` option can be passed in
`.nodeRegistration.kubeletExtraArgs` inside a kubeadm configuration file
(`InitConfiguration` or `JoinConfiguration`).

For dual-stack see
[Dual-stack support with kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support).
-->
对于所有节点上的 kubelet，`--node-ip` 选项可以在 kubeadm 配置文件
（`InitConfiguration` 或 `JoinConfiguration`）的 `.nodeRegistration.kubeletExtraArgs`
中设置。

有关双协议栈细节参见[使用 kubeadm 支持双协议栈](/zh-cn/docs/setup/production-environment/tools/kubeadm/dual-stack-support)。

<!--
The IP addresses that you assign to control plane components become part of their X.509 certificates'
subject alternative name fields. Changing these IP addresses would require
signing new certificates and restarting the affected components, so that the change in
certificate files is reflected. See
[Manual certificate renewal](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal)
for more details on this topic.
-->
你分配给控制平面组件的 IP 地址将成为其 X.509 证书的使用者备用名称字段的一部分。
更改这些 IP 地址将需要签署新的证书并重启受影响的组件，
以便反映证书文件中的变化。有关此主题的更多细节参见
[手动续期证书](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal)。

{{< warning >}}
<!--
The Kubernetes project recommends against this approach (configuring all component instances
with custom IP addresses). Instead, the Kubernetes maintainers recommend to setup the host network,
so that the default gateway IP is the one that Kubernetes components auto-detect and use.
On Linux nodes, you can use commands such as `ip route` to configure networking; your operating
system might also provide higher level network management tools. If your node's default gateway
is a public IP address, you should configure packet filtering or other security measures that
protect the nodes and your cluster.
-->
Kubernetes 项目不推荐此方法（使用自定义 IP 地址配置所有组件实例）。
Kubernetes 维护者建议设置主机网络，使默认网关 IP 成为 Kubernetes 组件自动检测和使用的 IP。
对于 Linux 节点，你可以使用诸如 `ip route` 的命令来配置网络；
你的操作系统可能还提供更高级的网络管理工具。
如果节点的默认网关是公共 IP 地址，你应配置数据包过滤或其他保护节点和集群的安全措施。
{{< /warning >}}

<!--
### Preparing the required container images
-->
### 准备所需的容器镜像 {#preparing-the-required-container-images}

<!--
This step is optional and only applies in case you wish `kubeadm init` and `kubeadm join`
to not download the default container images which are hosted at `registry.k8s.io`.

Kubeadm has commands that can help you pre-pull the required images
when creating a cluster without an internet connection on its nodes.
See [Running kubeadm without an internet connection](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection)
for more details.

Kubeadm allows you to use a custom image repository for the required images.
See [Using custom images](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)
for more details.
-->
这个步骤是可选的，只适用于你希望 `kubeadm init` 和 `kubeadm join` 不去下载存放在
`registry.k8s.io` 上的默认容器镜像的情况。

当你在离线的节点上创建一个集群的时候，kubeadm 有一些命令可以帮助你预拉取所需的镜像。
阅读[离线运行 kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection)
获取更多的详情。

kubeadm 允许你给所需要的镜像指定一个自定义的镜像仓库。
阅读[使用自定义镜像](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)获取更多的详情。

<!--
### Initializing your control-plane node
-->
### 初始化控制平面节点 {#initializing-your-control-plane-node}

<!--
The control-plane node is the machine where the control plane components run, including
{{< glossary_tooltip term_id="etcd" >}} (the cluster database) and the
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
(which the {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} command line tool
communicates with).
-->
控制平面节点是运行控制平面组件的机器，
包括 {{< glossary_tooltip term_id="etcd" >}}（集群数据库）
和 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}
（命令行工具 {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} 与之通信）。

<!--
1. (Recommended) If you have plans to upgrade this single control-plane `kubeadm` cluster
to high availability you should specify the `--control-plane-endpoint` to set the shared endpoint
for all control-plane nodes. Such an endpoint can be either a DNS name or an IP address of a load-balancer.
1. Choose a Pod network add-on, and verify whether it requires any arguments to
be passed to `kubeadm init`. Depending on which
third-party provider you choose, you might need to set the `--pod-network-cidr` to
a provider-specific value. See [Installing a Pod network add-on](#pod-network).
-->
1. （推荐）如果计划将单个控制平面 kubeadm 集群升级成高可用，
   你应该指定 `--control-plane-endpoint` 为所有控制平面节点设置共享端点。
   端点可以是负载均衡器的 DNS 名称或 IP 地址。
2. 选择一个 Pod 网络插件，并验证是否需要为 `kubeadm init` 传递参数。
   根据你选择的第三方网络插件，你可能需要设置 `--pod-network-cidr` 的值。
   请参阅[安装 Pod 网络附加组件](#pod-network)。

<!--
1. (Optional) `kubeadm` tries to detect the container runtime by using a list of well
known endpoints. To use different container runtime or if there are more than one installed
on the provisioned node, specify the `--cri-socket` argument to `kubeadm`. See
[Installing a runtime](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).
-->
3. （可选）`kubeadm` 试图通过使用已知的端点列表来检测容器运行时。
   使用不同的容器运行时或在预配置的节点上安装了多个容器运行时，请为 `kubeadm init` 指定 `--cri-socket` 参数。
   请参阅[安装运行时](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)。

<!--
To initialize the control-plane node run:
-->
要初始化控制平面节点，请运行：

```bash
kubeadm init <args>
```

<!--
### Considerations about apiserver-advertise-address and ControlPlaneEndpoint
-->
### 关于 apiserver-advertise-address 和 ControlPlaneEndpoint 的注意事项 {#considerations-about-apiserver-advertise-address-and-controlplaneendpoint}

<!--
While `--apiserver-advertise-address` can be used to set the advertise address for this particular
control-plane node's API server, `--control-plane-endpoint` can be used to set the shared endpoint
for all control-plane nodes.
-->
`--apiserver-advertise-address` 可用于为控制平面节点的 API 服务器设置广播地址，
`--control-plane-endpoint` 可用于为所有控制平面节点设置共享端点。

<!--
`--control-plane-endpoint` allows both IP addresses and DNS names that can map to IP addresses.
Please contact your network administrator to evaluate possible solutions with respect to such mapping.
-->
`--control-plane-endpoint` 允许 IP 地址和可以映射到 IP 地址的 DNS 名称。
请与你的网络管理员联系，以评估有关此类映射的可能解决方案。

<!--
Here is an example mapping:
-->
这是一个示例映射：

```console
192.168.0.102 cluster-endpoint
```

<!--
Where `192.168.0.102` is the IP address of this node and `cluster-endpoint` is a custom DNS name that maps to this IP.
This will allow you to pass `--control-plane-endpoint=cluster-endpoint` to `kubeadm init` and pass the same DNS name to
`kubeadm join`. Later you can modify `cluster-endpoint` to point to the address of your load-balancer in an
high availability scenario.
-->
其中 `192.168.0.102` 是此节点的 IP 地址，`cluster-endpoint` 是映射到该 IP 的自定义 DNS 名称。
这将允许你将 `--control-plane-endpoint=cluster-endpoint` 传递给 `kubeadm init`，
并将相同的 DNS 名称传递给 `kubeadm join`。稍后你可以修改 `cluster-endpoint`
以指向高可用性方案中的负载均衡器的地址。

<!--
Turning a single control plane cluster created without `--control-plane-endpoint` into a highly available cluster
is not supported by kubeadm.
-->
kubeadm 不支持将没有 `--control-plane-endpoint` 参数的单个控制平面集群转换为高可用性集群。

<!--
### More information
-->
### 更多信息 {#more-information}

<!--
For more information about `kubeadm init` arguments, see the [kubeadm reference guide](/docs/reference/setup-tools/kubeadm/).
-->
有关 `kubeadm init` 参数的更多信息，请参见 [kubeadm 参考指南](/zh-cn/docs/reference/setup-tools/kubeadm/)。

<!--
To configure `kubeadm init` with a configuration file see
[Using kubeadm init with a configuration file](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).
-->
要使用配置文件配置 `kubeadm init` 命令，
请参见[带配置文件使用 kubeadm init](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)。

<!--
To customize control plane components, including optional IPv6 assignment to liveness probe
for control plane components and etcd server, provide extra arguments to each component as documented in
[custom arguments](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).
-->
要自定义控制平面组件，包括可选的对控制平面组件和 etcd 服务器的活动探针提供 IPv6 支持，
请参阅[自定义参数](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)。

<!--
To reconfigure a cluster that has already been created see
[Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).
-->
要重新配置一个已经创建的集群，
请参见[重新配置一个 kubeadm 集群](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure)。

<!--
To run `kubeadm init` again, you must first [tear down the cluster](#tear-down).
-->
要再次运行 `kubeadm init`，你必须首先[卸载集群](#tear-down)。

<!--
If you join a node with a different architecture to your cluster, make sure that your deployed DaemonSets
have container image support for this architecture.
-->
如果将具有不同架构的节点加入集群，
请确保已部署的 DaemonSet 对这种体系结构具有容器镜像支持。

<!--
`kubeadm init` first runs a series of prechecks to ensure that the machine
is ready to run Kubernetes. These prechecks expose warnings and exit on errors. `kubeadm init`
then downloads and installs the cluster control plane components. This may take several minutes.
After it finishes you should see:
-->
`kubeadm init` 首先运行一系列预检查以确保机器为运行 Kubernetes 准备就绪。
这些预检查会显示警告并在错误时退出。然后 `kubeadm init`
下载并安装集群控制平面组件。这可能会需要几分钟。完成之后你应该看到：

```none
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

<!--
To make kubectl work for your non-root user, run these commands, which are
also part of the `kubeadm init` output:
-->
要使非 root 用户可以运行 kubectl，请运行以下命令，
它们也是 `kubeadm init` 输出的一部分：

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

<!--
Alternatively, if you are the `root` user, you can run:
-->
或者，如果你是 `root` 用户，则可以运行：

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

{{< warning >}}
<!--
The kubeconfig file `admin.conf` that `kubeadm init` generates contains a certificate with
`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. The group `kubeadm:cluster-admins`
is bound to the built-in `cluster-admin` ClusterRole.
Do not share the `admin.conf` file with anyone.
-->
`kubeadm init` 生成的 kubeconfig 文件 `admin.conf`
包含一个带有 `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin` 的证书。
`kubeadm:cluster-admins` 组被绑定到内置的 `cluster-admin` ClusterRole 上。
不要与任何人共享 `admin.conf` 文件。

<!--
`kubeadm init` generates another kubeconfig file `super-admin.conf` that contains a certificate with
`Subject: O = system:masters, CN = kubernetes-super-admin`.
`system:masters` is a break-glass, super user group that bypasses the authorization layer (for example RBAC).
Do not share the `super-admin.conf` file with anyone. It is recommended to move the file to a safe location.
-->
`kubeadm init` 生成另一个 kubeconfig 文件 `super-admin.conf`，
其中包含带有 `Subject: O = system:masters, CN = kubernetes-super-admin` 的证书。
`system:masters` 是一个紧急访问、超级用户组，可以绕过授权层（例如 RBAC）。
不要与任何人共享 `super-admin.conf` 文件，建议将其移动到安全位置。

<!--
See
[Generating kubeconfig files for additional users](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)
on how to use `kubeadm kubeconfig user` to generate kubeconfig files for additional users.
-->
有关如何使用 `kubeadm kubeconfig user` 为其他用户生成 kubeconfig
文件，请参阅[为其他用户生成 kubeconfig 文件](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)。
{{< /warning >}}

<!--
Make a record of the `kubeadm join` command that `kubeadm init` outputs. You
need this command to [join nodes to your cluster](#join-nodes).
-->
记录 `kubeadm init` 输出的 `kubeadm join` 命令。
你需要此命令[将节点加入集群](#join-nodes)。

<!--
The token is used for mutual authentication between the control-plane node and the joining
nodes. The token included here is secret. Keep it safe, because anyone with this
token can add authenticated nodes to your cluster. These tokens can be listed,
created, and deleted with the `kubeadm token` command. See the
[kubeadm reference guide](/docs/reference/setup-tools/kubeadm/kubeadm-token/).
-->
令牌用于控制平面节点和加入节点之间的相互身份验证。
这里包含的令牌是密钥。确保它的安全，
因为拥有此令牌的任何人都可以将经过身份验证的节点添加到你的集群中。
可以使用 `kubeadm token` 命令列出，创建和删除这些令牌。
请参阅 [kubeadm 参考指南](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-token/)。

<!--
### Installing a Pod network add-on {#pod-network}
-->
### 安装 Pod 网络附加组件 {#pod-network}

{{< caution >}}
<!--
This section contains important information about networking setup and
deployment order.
Read all of this advice carefully before proceeding.
-->
本节包含有关网络设置和部署顺序的重要信息。在继续之前，请仔细阅读所有建议。

<!--
**You must deploy a
{{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}
(CNI) based Pod network add-on so that your Pods can communicate with each other.
Cluster DNS (CoreDNS) will not start up before a network is installed.**
-->
**你必须部署一个基于 Pod 网络插件的{{< glossary_tooltip text="容器网络接口" term_id="cni" >}}（CNI），
以便你的 Pod 可以相互通信。在安装网络之前，集群 DNS (CoreDNS) 将不会启动。**

<!--
- Take care that your Pod network must not overlap with any of the host
  networks: you are likely to see problems if there is any overlap.
  (If you find a collision between your network plugin's preferred Pod
  network and some of your host networks, you should think of a suitable
  CIDR block to use instead, then use that during `kubeadm init` with
  `--pod-network-cidr` and as a replacement in your network plugin's YAML).
-->
- 注意你的 Pod 网络不得与任何主机网络重叠：如果有重叠，你很可能会遇到问题。
  （如果你发现网络插件的首选 Pod 网络与某些主机网络之间存在冲突，
  则应考虑使用一个合适的 CIDR 块来代替，
  然后在执行 `kubeadm init` 时使用 `--pod-network-cidr` 参数并在你的网络插件的 YAML 中替换它）。

<!--
- By default, `kubeadm` sets up your cluster to use and enforce use of
  [RBAC](/docs/reference/access-authn-authz/rbac/) (role based access
  control).
  Make sure that your Pod network plugin supports RBAC, and so do any manifests
  that you use to deploy it.
-->
- 默认情况下，`kubeadm` 将集群设置为使用和强制使用
  [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)（基于角色的访问控制）。
  确保你的 Pod 网络插件支持 RBAC，以及用于部署它的清单也是如此。

<!--
- If you want to use IPv6--either dual-stack, or single-stack IPv6 only
  networking--for your cluster, make sure that your Pod network plugin
  supports IPv6.
  IPv6 support was added to CNI in [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0).
-->
- 如果要为集群使用 IPv6（双协议栈或仅单协议栈 IPv6 网络），
  请确保你的 Pod 网络插件支持 IPv6。
  IPv6 支持已在 CNI [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0) 版本中添加。
{{< /caution >}}

{{< note >}}
<!--
Kubeadm should be CNI agnostic and the validation of CNI providers is out of the scope of our current e2e testing.
If you find an issue related to a CNI plugin you should log a ticket in its respective issue
tracker instead of the kubeadm or kubernetes issue trackers.
-->
kubeadm 应该是与 CNI 无关的，对 CNI 驱动进行验证目前不在我们的端到端测试范畴之内。
如果你发现与 CNI 插件相关的问题，应在其各自的问题跟踪器中记录而不是在 kubeadm
或 kubernetes 问题跟踪器中记录。
{{< /note >}}

<!--
Several external projects provide Kubernetes Pod networks using CNI, some of which also
support [Network Policy](/docs/concepts/services-networking/network-policies/).
-->
一些外部项目为 Kubernetes 提供使用 CNI 的 Pod 网络，
其中一些还支持[网络策略](/zh-cn/docs/concepts/services-networking/network-policies/)。

<!--
See a list of add-ons that implement the
[Kubernetes networking model](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).
-->
请参阅实现
[Kubernetes 网络模型](/zh-cn/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)的附加组件列表。

<!--
Please refer to the [Installing Addons](/docs/concepts/cluster-administration/addons/#networking-and-network-policy)
page for a non-exhaustive list of networking addons supported by Kubernetes.
You can install a Pod network add-on with the following command on the
control-plane node or a node that has the kubeconfig credentials:
-->
请参阅[安装插件](/zh-cn/docs/concepts/cluster-administration/addons/#networking-and-network-policy)页面，
了解 Kubernetes 支持的网络插件的非详尽列表。
你可以使用以下命令在控制平面节点或具有 kubeconfig 凭据的节点上安装 Pod 网络附加组件：

```bash
kubectl apply -f <add-on.yaml>
```

<!--
You can install only one Pod network per cluster.
-->
每个集群只能安装一个 Pod 网络。

<!--
Once a Pod network has been installed, you can confirm that it is working by
checking that the CoreDNS Pod is `Running` in the output of `kubectl get pods --all-namespaces`.
And once the CoreDNS Pod is up and running, you can continue by joining your nodes.
-->
安装 Pod 网络后，你可以通过在 `kubectl get pods --all-namespaces` 输出中检查
CoreDNS Pod 是否 `Running` 来确认其是否正常运行。
一旦 CoreDNS Pod 启用并运行，你就可以继续加入节点。

<!--
If your network is not working or CoreDNS is not in the `Running` state, check out the
[troubleshooting guide](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)
for `kubeadm`.
-->
如果你的网络无法正常工作或 CoreDNS 不在 `Running` 状态，请查看 `kubeadm`
的[故障排除指南](/zh-cn/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)。

<!--
### Managed node labels
-->
### 托管节点标签   {#managed-node-labels}

<!--
By default, kubeadm enables the [NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
admission controller that restricts what labels can be self-applied by kubelets on node registration.
The admission controller documentation covers what labels are permitted to be used with the kubelet `--node-labels` option.
The `node-role.kubernetes.io/control-plane` label is such a restricted label and kubeadm manually applies it using
a privileged client after a node has been created. To do that manually you can do the same by using `kubectl label`
and ensure it is using a privileged kubeconfig such as the kubeadm managed `/etc/kubernetes/admin.conf`.
-->
默认情况下，kubeadm 启用 [NodeRestriction](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
准入控制器来限制 kubelet 在节点注册时可以应用哪些标签。准入控制器文档描述 kubelet `--node-labels` 选项允许使用哪些标签。
其中 `node-role.kubernetes.io/control-plane` 标签就是这样一个受限制的标签，
kubeadm 在节点创建后使用特权客户端手动应用此标签。
你可以使用一个有特权的 kubeconfig，比如由 kubeadm 管理的 `/etc/kubernetes/admin.conf`，
通过执行 `kubectl label` 来手动完成操作。

<!--
### Control plane node isolation
-->
### 控制平面节点隔离 {#control-plane-node-isolation}

<!--
By default, your cluster will not schedule Pods on the control plane nodes for security
reasons. If you want to be able to schedule Pods on the control plane nodes,
for example for a single machine Kubernetes cluster, run:
-->
默认情况下，出于安全原因，你的集群不会在控制平面节点上调度 Pod。
如果你希望能够在单机 Kubernetes 集群等控制平面节点上调度 Pod，请运行：

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

<!--
The output will look something like:
-->
输出看起来像：

```
node "test-01" untainted
...
```

<!--
This will remove the `node-role.kubernetes.io/control-plane:NoSchedule` taint
from any nodes that have it, including the control plane nodes, meaning that the
scheduler will then be able to schedule Pods everywhere.
-->
这将从任何拥有 `node-role.kubernetes.io/control-plane:NoSchedule`
污点的节点（包括控制平面节点）上移除该污点。
这意味着调度程序将能够在任何地方调度 Pod。

<!--
Additionally, you can execute the following command to remove the
[`node.kubernetes.io/exclude-from-external-load-balancers`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers) label
from the control plane node, which excludes it from the list of backend servers:
-->
此外，你可以执行以下命令从控制平面节点中删除
[`node.kubernetes.io/exclude-from-external-load-balancers`](/zh-cn/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers)
标签，这会将其从后端服务器列表中排除：

```bash
kubectl label nodes --all node.kubernetes.io/exclude-from-external-load-balancers-
```

<!--
### Joining your nodes {#join-nodes}
-->
### 加入节点 {#join-nodes}

<!--
The nodes are where your workloads (containers and Pods, etc) run. To add new nodes to your cluster do the following for each machine:
-->
节点是你的工作负载（容器和 Pod 等）运行的地方。要将新节点添加到集群，请对每台计算机执行以下操作：

<!--
* SSH to the machine
* Become root (e.g. `sudo su -`)
* [Install a runtime](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)
  if needed
* Run the command that was output by `kubeadm init`. For example:
-->
* SSH 到机器
* 成为 root （例如 `sudo su -`）
* 必要时[安装一个运行时](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)
* 运行 `kubeadm init` 输出的命令，例如：

  ```bash
  kubeadm join --token <token> <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:<hash>
  ```

<!--
If you do not have the token, you can get it by running the following command on the control-plane node:
-->
如果你没有令牌，可以通过在控制平面节点上运行以下命令来获取令牌：

```bash
kubeadm token list
```

<!--
The output is similar to this:
-->
输出类似于以下内容：

```console
TOKEN                    TTL  EXPIRES              USAGES           DESCRIPTION            EXTRA GROUPS
8ewj1p.9r9hcjoqgajrj4gi  23h  2018-06-12T02:51:28Z authentication,  The default bootstrap  system:
                                                   signing          token generated by     bootstrappers:
                                                                    'kubeadm init'.        kubeadm:
                                                                                           default-node-token
```

<!--
By default, tokens expire after 24 hours. If you are joining a node to the cluster after the current token has expired,
you can create a new token by running the following command on the control-plane node:
-->
默认情况下，令牌会在 24 小时后过期。如果要在当前令牌过期后将节点加入集群，
则可以通过在控制平面节点上运行以下命令来创建新令牌：

```bash
kubeadm token create
```

<!--
The output is similar to this:
-->
输出类似于以下内容：

```console
5didvk.d09sbcov8ph2amjw
```

<!--
If you don't have the value of `--discovery-token-ca-cert-hash`, you can get it by running the
following command chain on the control-plane node:
-->
如果你没有 `--discovery-token-ca-cert-hash` 的值，则可以通过在控制平面节点上执行以下命令链来获取它：

```bash
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | \
   openssl dgst -sha256 -hex | sed 's/^.* //'
```

<!--
The output is similar to:
-->
输出类似于以下内容：

```console
8cb2de97839780a412b93877f8507ad6c94f73add17d5d7058e91741c9d5ec78
```

{{< note >}}
<!--
To specify an IPv6 tuple for `<control-plane-host>:<control-plane-port>`, IPv6 address must be enclosed in square brackets, for example: `[2001:db8::101]:2073`.
-->
要为 `<control-plane-host>:<control-plane-port>` 指定 IPv6 元组，必须将 IPv6
地址括在方括号中，例如 `[2001:db8::101]:2073`。
{{< /note >}}

<!--
The output should look something like:
-->
输出应类似于：

```console
[preflight] Running pre-flight checks

... (log output of join workflow) ...

Node join complete:
* Certificate signing request sent to control-plane and response
  received.
* Kubelet informed of new secure connection details.

Run 'kubectl get nodes' on control-plane to see this machine join.
```

<!--
A few seconds later, you should notice this node in the output from `kubectl get
nodes` when run on the control-plane node.
-->
几秒钟后，当你在控制平面节点上执行 `kubectl get nodes`，你会注意到该节点出现在输出中。

{{< note >}}
<!--
As the cluster nodes are usually initialized sequentially, the CoreDNS Pods are likely to all run
on the first control-plane node. To provide higher availability, please rebalance the CoreDNS Pods
with `kubectl -n kube-system rollout restart deployment coredns` after at least one new node is joined.
-->
由于集群节点通常是按顺序初始化的，CoreDNS Pod 很可能都运行在第一个控制面节点上。
为了提供更高的可用性，请在加入至少一个新节点后使用
`kubectl -n kube-system rollout restart deployment coredns` 命令，重新平衡这些 CoreDNS Pod。
{{< /note >}}

<!--
### (Optional) Controlling your cluster from machines other than the control-plane node
-->
### （可选）从控制平面节点以外的计算机控制集群 {#optional-controlling-your-cluster-from-machines-other-than-the-control-plane-node}

<!--
In order to get a kubectl on some other computer (e.g. laptop) to talk to your
cluster, you need to copy the administrator kubeconfig file from your control-plane node
to your workstation like this:
-->
为了使 kubectl 在其他计算机（例如笔记本电脑）上与你的集群通信，
你需要将管理员 kubeconfig 文件从控制平面节点复制到工作站，如下所示：

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
<!--
The example above assumes SSH access is enabled for root. If that is not the
case, you can copy the `admin.conf` file to be accessible by some other user
and `scp` using that other user instead.

The `admin.conf` file gives the user _superuser_ privileges over the cluster.
This file should be used sparingly. For normal users, it's recommended to
generate an unique credential to which you grant privileges. You can do
this with the `kubeadm kubeconfig user --client-name <CN>`
command. That command will print out a KubeConfig file to STDOUT which you
should save to a file and distribute to your user. After that, grant
privileges by using `kubectl create (cluster)rolebinding`.
-->
上面的示例假定为 root 用户启用了 SSH 访问。如果不是这种情况，
你可以使用 `scp` 将 `admin.conf` 文件复制给其他允许访问的用户。

admin.conf 文件为用户提供了对集群的超级用户特权。
该文件应谨慎使用。对于普通用户，建议生成一个你为其授予特权的唯一证书。
你可以使用 `kubeadm kubeconfig user --client-name <CN>` 命令执行此操作。
该命令会将 KubeConfig 文件打印到 STDOUT，你应该将其保存到文件并分发给用户。
之后，使用 `kubectl create (cluster)rolebinding` 授予特权。
{{< /note >}}

<!--
### (Optional) Proxying API Server to localhost
-->
### （可选）将 API 服务器代理到本地主机 {#optional-proxying-api-server-to-localhost}

<!--
If you want to connect to the API Server from outside the cluster you can use
`kubectl proxy`:
-->
如果你要从集群外部连接到 API 服务器，则可以使用 `kubectl proxy`：

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

<!--
You can now access the API Server locally at `http://localhost:8001/api/v1`
-->
你现在可以在 `http://localhost:8001/api/v1` 从本地访问 API 服务器。

<!--
## Clean up {#tear-down}
-->
## 清理 {#tear-down}

<!--
If you used disposable servers for your cluster, for testing, you can
switch those off and do no further clean up. You can use
`kubectl config delete-cluster` to delete your local references to the
cluster.
-->
如果你在集群中使用了一次性服务器进行测试，则可以关闭这些服务器，而无需进一步清理。
你可以使用 `kubectl config delete-cluster` 删除对集群的本地引用。

<!--
However, if you want to deprovision your cluster more cleanly, you should
first [drain the node](/docs/reference/generated/kubectl/kubectl-commands#drain)
and make sure that the node is empty, then deconfigure the node.
-->
但是，如果要更干净地取消配置集群，
则应首先[清空节点](/docs/reference/generated/kubectl/kubectl-commands#drain)并确保该节点为空，
然后取消配置该节点。

<!--
### Remove the node
-->
### 移除节点   {#remove-the-node}

<!--
Talking to the control-plane node with the appropriate credentials, run:

```bash
kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
```
-->
使用适当的凭据与控制平面节点通信，运行：

```bash
kubectl drain <节点名称> --delete-emptydir-data --force --ignore-daemonsets
```

<!--
Before removing the node, reset the state installed by `kubeadm`:
-->
在移除节点之前，请重置 `kubeadm` 安装的状态：

```bash
kubeadm reset
```

<!--
The reset process does not reset or clean up iptables rules or IPVS tables. If you wish to reset iptables, you must do so manually:
-->
重置过程不会重置或清除 iptables 规则或 IPVS 表。如果你希望重置 iptables，则必须手动进行：

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

<!--
If you want to reset the IPVS tables, you must run the following command:
-->
如果要重置 IPVS 表，则必须运行以下命令：

```bash
ipvsadm -C
```
<!--
Now remove the node:

```bash
kubectl delete node <node name>
```
-->
现在移除节点：

```bash
kubectl delete node <节点名称>
```

<!--
If you wish to start over, run `kubeadm init` or `kubeadm join` with the
appropriate arguments.
-->
如果你想重新开始，只需运行 `kubeadm init` 或 `kubeadm join` 并加上适当的参数。

<!--
### Clean up the control plane
-->
### 清理控制平面 {#clean-up-the-control-plane}

<!--
You can use `kubeadm reset` on the control plane host to trigger a best-effort
clean up.
-->
你可以在控制平面主机上使用 `kubeadm reset` 来触发尽力而为的清理。

<!--
See the [`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
reference documentation for more information about this subcommand and its
options.
-->
有关此子命令及其选项的更多信息，请参见
[`kubeadm reset`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/) 参考文档。

<!--
## Version skew policy {#version-skew-policy}
-->
## 版本偏差策略 {#version-skew-policy}

<!--
While kubeadm allows version skew against some components that it manages, it is recommended that you
match the kubeadm version with the versions of the control plane components, kube-proxy and kubelet.
-->
虽然 kubeadm 允许所管理的组件有一定程度的版本偏差，
但是建议你将 kubeadm 的版本与控制平面组件、kube-proxy 和 kubelet 的版本相匹配。

<!--
### kubeadm's skew against the Kubernetes version
-->
### kubeadm 中的 Kubernetes 版本偏差 {#kubeadm-s-skew-against-the-kubernetes-version}

<!--
kubeadm can be used with Kubernetes components that are the same version as kubeadm
or one version older. The Kubernetes version can be specified to kubeadm by using the
`--kubernetes-version` flag of `kubeadm init` or the
[`ClusterConfiguration.kubernetesVersion`](/docs/reference/config-api/kubeadm-config.v1beta4/)
field when using `--config`. This option will control the versions
of kube-apiserver, kube-controller-manager, kube-scheduler and kube-proxy.
-->
kubeadm 可以与 Kubernetes 组件一起使用，这些组件的版本与 kubeadm 相同，或者比它大一个版本。
Kubernetes 版本可以通过使用 `--kubeadm init` 的 `--kubernetes-version` 标志或使用 `--config` 时的
[`ClusterConfiguration.kubernetesVersion`](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)
字段指定给 kubeadm。
这个选项将控制 kube-apiserver、kube-controller-manager、kube-scheduler 和 kube-proxy 的版本。

<!--
Example:
* kubeadm is at {{< skew currentVersion >}}
* `kubernetesVersion` must be at {{< skew currentVersion >}} or {{< skew currentVersionAddMinor -1 >}}
-->
例子：

* kubeadm 的版本为 {{< skew currentVersion >}}。
* `kubernetesVersion` 必须为 {{< skew currentVersion >}} 或者 {{< skew currentVersionAddMinor -1 >}}。

<!--
### kubeadm's skew against the kubelet
-->
### kubeadm 中 kubelet 的版本偏差 {#kubeadm-s-skew-against-the-kubelet}

<!--
Similarly to the Kubernetes version, kubeadm can be used with a kubelet version that is
the same version as kubeadm or three version older.
-->
与 Kubernetes 版本类似，kubeadm 可以使用与 kubeadm 相同版本的 kubelet，
或者比 kubeadm 老三个版本的 kubelet。

<!--
Example:
* kubeadm is at {{< skew currentVersion >}}
* kubelet on the host must be at {{< skew currentVersion >}}, {{< skew currentVersionAddMinor -1 >}},
  {{< skew currentVersionAddMinor -2 >}} or {{< skew currentVersionAddMinor -3 >}}
-->
例子：

* kubeadm 的版本为 {{< skew currentVersion >}}。
* 主机上的 kubelet 必须为 {{< skew currentVersion >}}、{{< skew currentVersionAddMinor -1 >}}、
  {{< skew currentVersionAddMinor -2 >}} 或 {{< skew currentVersionAddMinor -3 >}}。

<!--
### kubeadm's skew against kubeadm
-->
### kubeadm 支持的 kubeadm 的版本偏差 {#kubeadm-s-skew-against-kubeadm}

<!--
There are certain limitations on how kubeadm commands can operate on existing nodes or whole clusters
managed by kubeadm.
-->
kubeadm 命令在现有节点或由 kubeadm 管理的整个集群上的操作有一定限制。

<!--
If new nodes are joined to the cluster, the kubeadm binary used for `kubeadm join` must match
the last version of kubeadm used to either create the cluster with `kubeadm init` or to upgrade
the same node with `kubeadm upgrade`. Similar rules apply to the rest of the kubeadm commands
with the exception of `kubeadm upgrade`.
-->
如果新的节点加入到集群中，用于 `kubeadm join` 的 kubeadm 二进制文件必须与用 `kubeadm init`
创建集群或用 `kubeadm upgrade` 升级同一节点时所用的 kubeadm 版本一致。
类似的规则适用于除了 `kubeadm upgrade` 以外的其他 kubeadm 命令。

<!--
Example for `kubeadm join`:
* kubeadm version {{< skew currentVersion >}} was used to create a cluster with `kubeadm init`
* Joining nodes must use a kubeadm binary that is at version {{< skew currentVersion >}}
-->
`kubeadm join` 的例子：

* 使用 `kubeadm init` 创建集群时使用版本为 {{< skew currentVersion >}} 的 kubeadm。
* 添加节点所用的 kubeadm 可执行文件为版本 {{< skew currenttVersion >}}。

<!--
Nodes that are being upgraded must use a version of kubeadm that is the same MINOR
version or one MINOR version newer than the version of kubeadm used for managing the
node.
-->
对于正在升级的节点，所使用的的 kubeadm 必须与管理该节点的 kubeadm 具有相同的
MINOR 版本或比后者新一个 MINOR 版本。

<!--
Example for `kubeadm upgrade`:
* kubeadm version {{< skew currentVersionAddMinor -1 >}} was used to create or upgrade the node
* The version of kubeadm used for upgrading the node must be at {{< skew currentVersionAddMinor -1 >}}
or {{< skew currentVersion >}}
-->
`kubeadm upgrade` 的例子：
* 用于创建或升级节点的 kubeadm 版本为 {{< skew currentVersionAddMinor -1 >}}。
* 用于升级节点的 kubeadm 版本必须为 {{< skew currentVersionAddMinor -1 >}} 或 {{< skew currentVersion >}}。

<!--
To learn more about the version skew between the different Kubernetes component see
the [Version Skew Policy](/releases/version-skew-policy/).
-->
要了解更多关于不同 Kubernetes 组件之间的版本偏差，
请参见[版本偏差策略](/zh-cn/releases/version-skew-policy/)。

<!--
## Limitations {#limitations}

### Cluster resilience {#resilience}
-->
## 局限性 {#limitations}

### 集群弹性 {#resilience}

<!--
The cluster created here has a single control-plane node, with a single etcd database
running on it. This means that if the control-plane node fails, your cluster may lose
data and may need to be recreated from scratch.
-->
此处创建的集群具有单个控制平面节点，运行单个 etcd 数据库。
这意味着如果控制平面节点发生故障，你的集群可能会丢失数据并且可能需要从头开始重新创建。

<!--
Workarounds:
-->
解决方法：

<!--
* Regularly [back up etcd](https://etcd.io/docs/v3.5/op-guide/recovery/). The
  etcd data directory configured by kubeadm is at `/var/lib/etcd` on the control-plane node.
-->
* 定期[备份 etcd](https://etcd.io/docs/v3.5/op-guide/recovery/)。
  kubeadm 配置的 etcd 数据目录位于控制平面节点上的 `/var/lib/etcd` 中。

<!--
* Use multiple control-plane nodes. You can read
  [Options for Highly Available topology](/docs/setup/production-environment/tools/kubeadm/ha-topology/) to pick a cluster
  topology that provides [high-availability](/docs/setup/production-environment/tools/kubeadm/high-availability/).
-->
* 使用多个控制平面节点。你可以阅读
  [可选的高可用性拓扑](/zh-cn/docs/setup/production-environment/tools/kubeadm/ha-topology/)选择集群拓扑提供的
  [高可用性](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)。

<!--
### Platform compatibility {#multi-platform}
-->
### 平台兼容性 {#multi-platform}

<!--
kubeadm deb/rpm packages and binaries are built for amd64, arm (32-bit), arm64, ppc64le, and s390x
following the [multi-platform
proposal](https://git.k8s.io/design-proposals-archive/multi-platform.md).
-->
kubeadm deb/rpm 软件包和二进制文件是为 amd64、arm (32-bit)、arm64、ppc64le 和 s390x
构建的遵循[多平台提案](https://git.k8s.io/design-proposals-archive/multi-platform.md)。

<!--
Multiplatform container images for the control plane and addons are also supported since v1.12.
-->
从 v1.12 开始还支持用于控制平面和附加组件的多平台容器镜像。

<!--
Only some of the network providers offer solutions for all platforms. Please consult the list of
network providers above or the documentation from each provider to figure out whether the provider
supports your chosen platform.
-->
只有一些网络提供商为所有平台提供解决方案。
请查阅上方的网络提供商清单或每个提供商的文档以确定提供商是否支持你选择的平台。

<!--
## Troubleshooting {#troubleshooting}
-->
## 故障排除 {#troubleshooting}

<!--
If you are running into difficulties with kubeadm, please consult our
[troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).
-->
如果你在使用 kubeadm 时遇到困难，
请查阅我们的[故障排除文档](/zh-cn/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)。

<!-- discussion -->

<!--
## What's next {#whats-next}
-->
## 下一步 {#whats-next}

<!--
* Verify that your cluster is running properly with [Sonobuoy](https://github.com/heptio/sonobuoy)
* <a id="lifecycle" />See [Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
  for details about upgrading your cluster using `kubeadm`.
* Learn about advanced `kubeadm` usage in the [kubeadm reference documentation](/docs/reference/setup-tools/kubeadm/)
* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/reference/kubectl/).
* See the [Cluster Networking](/docs/concepts/cluster-administration/networking/) page for a bigger list
  of Pod network add-ons.
* <a id="other-addons" />See the [list of add-ons](/docs/concepts/cluster-administration/addons/) to
  explore other add-ons, including tools for logging, monitoring, network policy, visualization &amp;
  control of your Kubernetes cluster.
* Configure how your cluster handles logs for cluster events and from
  applications running in Pods.
  See [Logging Architecture](/docs/concepts/cluster-administration/logging/) for
  an overview of what is involved.
-->
* 使用 [Sonobuoy](https://github.com/heptio/sonobuoy) 验证集群是否正常运行。
* <a id="lifecycle"/>有关使用 kubeadm 升级集群的详细信息，
  请参阅[升级 kubeadm 集群](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。
* 在 [kubeadm 参考文档](/zh-cn/docs/reference/setup-tools/kubeadm/)中了解有关 `kubeadm` 进阶用法的信息。
* 了解有关 Kubernetes [概念](/zh-cn/docs/concepts/)和 [`kubectl`](/zh-cn/docs/reference/kubectl/)的更多信息。
* 有关 Pod 网络附加组件的更多列表，请参见[集群网络](/zh-cn/docs/concepts/cluster-administration/networking/)页面。
* <a id="other-addons" />请参阅[附加组件列表](/zh-cn/docs/concepts/cluster-administration/addons/)以探索其他附加组件，
  包括用于 Kubernetes 集群的日志记录、监视、网络策略、可视化和控制的工具。
* 配置集群如何处理集群事件的日志以及在 Pod 中运行的应用程序。
  有关所涉及内容的概述，请参见[日志架构](/zh-cn/docs/concepts/cluster-administration/logging/)。

<!--
### Feedback {#feedback}
-->
### 反馈 {#feedback}

<!--
* For bugs, visit the [kubeadm GitHub issue tracker](https://github.com/kubernetes/kubeadm/issues)
* For support, visit the
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/) Slack channel
* General SIG Cluster Lifecycle development Slack channel:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG Cluster Lifecycle [SIG information](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
* SIG Cluster Lifecycle mailing list:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
-->
* 有关漏洞，访问 [kubeadm GitHub issue tracker](https://github.com/kubernetes/kubeadm/issues)
* 有关支持，访问
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/) Slack 频道
* 常规的 SIG Cluster Lifecycle 开发 Slack 频道：
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG Cluster Lifecycle 的 [SIG 资料](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
* SIG Cluster Lifecycle 邮件列表：
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
