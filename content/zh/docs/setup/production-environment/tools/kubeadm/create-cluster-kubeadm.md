---
reviewers:
- sig-cluster-lifecycle
title: 使用 kubeadm 创建集群
content_type: task
weight: 30
---

<!-- ---
reviewers:
- sig-cluster-lifecycle
title: Creating a cluster with kubeadm
content_type: task
weight: 30
--- -->

<!-- overview -->

<!--
<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">Using `kubeadm`, you can create a minimum viable Kubernetes cluster that conforms to best practices. In fact, you can use `kubeadm` to set up a cluster that will pass the [Kubernetes Conformance tests](https://kubernetes.io/blog/2017/10/software-conformance-certification).
`kubeadm` also supports other cluster
lifecycle functions, such as [bootstrap tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) and cluster upgrades.
-->
<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">使用 `kubeadm`，你
能创建一个符合最佳实践的最小化 Kubernetes 集群。事实上，你可以使用 `kubeadm` 配置一个通过 [Kubernetes 一致性测试](https://kubernetes.io/blog/2017/10/software-conformance-certification) 的集群。
`kubeadm` 还支持其他集群生命周期功能，
例如 [启动引导令牌](/zh/docs/reference/access-authn-authz/bootstrap-tokens/) 和集群升级。

<!--
The `kubeadm` tool is good if you need:

- A simple way for you to try out Kubernetes, possibly for the first time.
- A way for existing users to automate setting up a cluster and test their application.
- A building block in other ecosystem and/or installer tools with a larger
  scope.
-->
kubeadm 工具很棒，如果你需要：

- 一个尝试 Kubernetes 的简单方法。
- 一个现有用户可以自动设置集群并测试其应用程序的途径。
- 其他具有更大范围的生态系统和/或安装工具中的构建模块。

<!--
You can install and use `kubeadm` on various machines: your laptop, a set
of cloud servers, a Raspberry Pi, and more. Whether you're deploying into the
cloud or on-premises, you can integrate `kubeadm` into provisioning systems such
as Ansible or Terraform.
-->
你可以在各种机器上安装和使用 `kubeadm`：笔记本电脑，
一组云服务器，Raspberry Pi 等。无论是部署到云还是本地，
你都可以将 `kubeadm` 集成到预配置系统中，例如 Ansible 或 Terraform。



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
- 用作控制平面节点的计算机上至少有2个 CPU。
- 集群中所有计算机之间具有完全的网络连接。你可以使用公共网络或专用网络。

<!--
You also need to use a version of `kubeadm` that can deploy the version
of Kubernetes that you want to use in your new cluster.
-->
你还需要使用可以在新集群中部署特定 Kubernetes 版本对应的 `kubeadm`。


<!--
[Kubernetes' version and version skew support policy](/docs/setup/release/version-skew-policy/#supported-versions) applies to `kubeadm` as well as to Kubernetes overall.
Check that policy to learn about what versions of Kubernetes and `kubeadm`
are supported. This page is written for Kubernetes {{< param "version" >}}.
-->
[Kubernetes 版本及版本倾斜支持策略](/zh/docs/setup/release/version-skew-policy/#supported-versions) 适用于 `kubeadm` 以及整个 Kubernetes。
查阅该策略以了解支持哪些版本的 Kubernetes 和 `kubeadm`。
该页面是为 Kubernetes {{< param "version" >}} 编写的。

<!--
The `kubeadm` tool's overall feature state is General Availability (GA). Some sub-features are
still under active development. The implementation of creating the cluster may change
slightly as the tool evolves, but the overall implementation should be pretty stable.
-->
`kubeadm` 工具的整体功能状态为一般可用性（GA）。一些子功能仍在积极开发中。
随着工具的发展，创建集群的实现可能会略有变化，但总体实现应相当稳定。

<!--
Any commands under `kubeadm alpha` are, by definition, supported on an alpha level.
-->
{{< note >}}
根据定义，在 `kubeadm alpha` 下的所有命令均在 alpha 级别上受支持。
{{< /note >}}



<!-- steps -->

<!--
## Objectives
-->
## 目标

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
## 操作指南

<!--
### Installing kubeadm on your hosts
-->
### 在你的主机上安装 kubeadm

<!--
See ["Installing kubeadm"](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
-->
查看 ["安装 kubeadm"](/zh/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)。

<!--
If you have already installed kubeadm, run `apt-get update &&
apt-get upgrade` or `yum update` to get the latest version of kubeadm.

When you upgrade, the kubelet restarts every few seconds as it waits in a crashloop for
kubeadm to tell it what to do. This crashloop is expected and normal.
After you initialize your control-plane, the kubelet runs normally.
-->
{{< note >}}
如果你已经安装了kubeadm，执行 `apt-get update &&
apt-get upgrade` 或 `yum update` 以获取 kubeadm 的最新版本。

升级时，kubelet 每隔几秒钟重新启动一次，
在 crashloop 状态中等待 kubeadm 发布指令。crashloop 状态是正常现象。
初始化控制平面后，kubelet 将正常运行。
{{< /note >}}

<!--
### Initializing your control-plane node
-->
### 初始化控制平面节点

<!--
The control-plane node is the machine where the control plane components run, including
{{< glossary_tooltip term_id="etcd" >}} (the cluster database) and the
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
(which the {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} command line tool
communicates with).
-->
控制平面节点是运行控制平面组件的机器，
包括 {{< glossary_tooltip term_id="etcd" >}} （集群数据库）
和 {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
（命令行工具 {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} 与之通信）。

<!--
1. (Recommended) If you have plans to upgrade this single control-plane `kubeadm` cluster
to high availability you should specify the `--control-plane-endpoint` to set the shared endpoint
for all control-plane nodes. Such an endpoint can be either a DNS name or an IP address of a load-balancer.
1. Choose a Pod network add-on, and verify whether it requires any arguments to
be passed to `kubeadm init`. Depending on which
third-party provider you choose, you might need to set the `--pod-network-cidr` to
a provider-specific value. See [Installing a Pod network add-on](#pod-network).
1. (Optional) Since version 1.14, `kubeadm` tries to detect the container runtime on Linux
by using a list of well known domain socket paths. To use different container runtime or
if there are more than one installed on the provisioned node, specify the `--cri-socket`
argument to `kubeadm init`. See [Installing runtime](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).
1. (Optional) Unless otherwise specified, `kubeadm` uses the network interface associated
with the default gateway to set the advertise address for this particular control-plane node's API server.
To use a different network interface, specify the `--apiserver-advertise-address=<ip-address>` argument
to `kubeadm init`. To deploy an IPv6 Kubernetes cluster using IPv6 addressing, you
must specify an IPv6 address, for example `--apiserver-advertise-address=fd00::101`
1. (Optional) Run `kubeadm config images pull` prior to `kubeadm init` to verify
connectivity to the gcr.io container image registry.
-->
1. （推荐）如果计划将单个控制平面 kubeadm 集群升级成高可用，
你应该指定 `--control-plane-endpoint` 为所有控制平面节点设置共享端点。
端点可以是负载均衡器的 DNS 名称或 IP 地址。
1. 选择一个Pod网络插件，并验证是否需要为 `kubeadm init` 传递参数。
根据你选择的第三方网络插件，你可能需要设置 `--pod-network-cidr` 的值。
请参阅 [安装Pod网络附加组件](#pod-network)。
1. （可选）从版本1.14开始，`kubeadm` 尝试使用一系列众所周知的域套接字路径来检测 Linux 上的容器运行时。
要使用不同的容器运行时，
或者如果在预配置的节点上安装了多个容器，请为 `kubeadm init` 指定 `--cri-socket` 参数。
请参阅[安装运行时](/zh/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)。
1. （可选）除非另有说明，否则 `kubeadm` 使用与默认网关关联的网络接口来设置此控制平面节点 API server 的广播地址。
要使用其他网络接口，请为 `kubeadm init` 设置 `--apiserver-advertise-address=<ip-address>` 参数。
要部署使用 IPv6 地址的 Kubernetes 集群，
必须指定一个 IPv6 地址，例如 `--apiserver-advertise-address=fd00::101`
1. （可选）在 `kubeadm init` 之前运行 `kubeadm config images pull`，以验证与 gcr.io 容器镜像仓库的连通性。


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
### 关于 apiserver-advertise-address 和 ControlPlaneEndpoint 的注意事项

<!--
While `--apiserver-advertise-address` can be used to set the advertise address for this particular
control-plane node's API server, `--control-plane-endpoint` can be used to set the shared endpoint
for all control-plane nodes.
-->
`--apiserver-advertise-address`  可用于为控制平面节点的 API server 设置广播地址，
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

```
192.168.0.102 cluster-endpoint
```

<!--
Where `192.168.0.102` is the IP address of this node and `cluster-endpoint` is a custom DNS name that maps to this IP.
This will allow you to pass `--control-plane-endpoint=cluster-endpoint` to `kubeadm init` and pass the same DNS name to
`kubeadm join`. Later you can modify `cluster-endpoint` to point to the address of your load-balancer in an
high availability scenario.
-->
其中 `192.168.0.102` 是此节点的 IP 地址，`cluster-endpoint` 是映射到该 IP 的自定义 DNS 名称。
这将允许你将 `--control-plane-endpoint=cluster-endpoint` 传递给 `kubeadm init`，并将相同的 DNS 名称传递给 `kubeadm join`。
稍后你可以修改 `cluster-endpoint` 以指向高可用性方案中的负载均衡器的地址。

<!--
Turning a single control plane cluster created without `--control-plane-endpoint` into a highly available cluster
is not supported by kubeadm.
-->
kubeadm 不支持将没有 `--control-plane-endpoint` 参数的单个控制平面集群转换为高可用性集群。

<!--
### More information
-->
### 更多信息

<!--
For more information about `kubeadm init` arguments, see the [kubeadm reference guide](/docs/reference/setup-tools/kubeadm/).
-->
有关 `kubeadm init` 参数的更多信息，请参见 [kubeadm 参考指南](/zh/docs/reference/setup-tools/kubeadm/)。

<!--
To configure `kubeadm init` with a configuration file see [Using kubeadm init with a configuration file](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).
-->
要使用配置文件配置 `kubeadm init` 命令，请参见[带配置文件使用 kubeadm init](/zh/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)。

<!--
To customize control plane components, including optional IPv6 assignment to liveness probe for control plane components and etcd server, provide extra arguments to each component as documented in [custom arguments](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).
-->
要自定义控制平面组件，包括可选的对控制平面组件和 etcd 服务器的活动探针提供 IPv6 支持，请参阅[自定义参数](/zh/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)。

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
`kubeadm init` 首先运行一系列预检查以确保机器
准备运行 Kubernetes。这些预检查会显示警告并在错误时退出。然后 `kubeadm init`
下载并安装集群控制平面组件。这可能会需要几分钟。
完成之后你应该看到：

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
请参阅 [kubeadm 参考指南](/zh/docs/reference/setup-tools/kubeadm/kubeadm-token/)。


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
本节包含有关网络设置和部署顺序的重要信息。
在继续之前，请仔细阅读所有建议。

<!--
**You must deploy a
{{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}
(CNI) based Pod network add-on so that your Pods can communicate with each other.
Cluster DNS (CoreDNS) will not start up before a network is installed.**
-->
**你必须部署一个基于 Pod 网络插件的
{{< glossary_tooltip text="容器网络接口" term_id="cni" >}}
(CNI)，以便你的 Pod 可以相互通信。
在安装网络之前，集群 DNS (CoreDNS) 将不会启动。**

<!--
- Take care that your Pod network must not overlap with any of the host
  networks: you are likely to see problems if there is any overlap.
  (If you find a collision between your network plugin's preferred Pod
  network and some of your host networks, you should think of a suitable
  CIDR block to use instead, then use that during `kubeadm init` with
  `--pod-network-cidr` and as a replacement in your network plugin's YAML).
-->
- 注意你的 Pod 网络不得与任何主机网络重叠：
  如果有重叠，你很可能会遇到问题。
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
- 默认情况下，`kubeadm` 将集群设置为使用和强制使用 [RBAC](/zh/docs/reference/access-authn-authz/rbac/)（基于角色的访问控制）。
  确保你的 Pod 网络插件支持 RBAC，以及用于部署它的 manifests 也是如此。

<!--
- If you want to use IPv6--either dual-stack, or single-stack IPv6 only
  networking--for your cluster, make sure that your Pod network plugin
  supports IPv6.
  IPv6 support was added to CNI in [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0).
-->
- 如果要为集群使用 IPv6（双协议栈或仅单协议栈 IPv6 网络），
  请确保你的Pod网络插件支持 IPv6。
  IPv6 支持已在 CNI [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0) 版本中添加。
{{< /caution >}}

<!--
Currently Calico is the only CNI plugin that the kubeadm project performs e2e tests against.
If you find an issue related to a CNI plugin you should log a ticket in its respective issue
tracker instead of the kubeadm or kubernetes issue trackers.
-->
{{< note >}}
目前 Calico 是 kubeadm 项目中执行 e2e 测试的唯一 CNI 插件。
如果你发现与 CNI 插件相关的问题，应在其各自的问题跟踪器中记录而不是在 kubeadm 或 kubernetes 问题跟踪器中记录。
{{< /note >}}

<!--
Several external projects provide Kubernetes Pod networks using CNI, some of which also
support [Network Policy](/docs/concepts/services-networking/network-policies/).
-->
一些外部项目为 Kubernetes 提供使用 CNI 的 Pod 网络，其中一些还支持[网络策略](/zh/docs/concepts/services-networking/network-policies/)。

<!--
See a list of add-ons that implement the
[Kubernetes networking model](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model).
-->
请参阅实现 [Kubernetes 网络模型](/zh/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model) 的附加组件列表。

<!--
You can install a Pod network add-on with the following command on the
control-plane node or a node that has the kubeconfig credentials:
-->
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
安装 Pod 网络后，您可以通过在 `kubectl get pods --all-namespaces` 输出中检查 CoreDNS Pod 是否 `Running` 来确认其是否正常运行。
一旦 CoreDNS Pod 启用并运行，你就可以继续加入节点。

<!--
If your network is not working or CoreDNS is not in the `Running` state, check out the
[troubleshooting guide](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)
for `kubeadm`.
-->
如果您的网络无法正常工作或CoreDNS不在“运行中”状态，请查看 `kubeadm` 的[故障排除指南](/zh/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)。


<!--
### Control plane node isolation
-->
### 控制平面节点隔离

<!--
By default, your cluster will not schedule Pods on the control-plane node for security
reasons. If you want to be able to schedule Pods on the control-plane node, for example for a
single-machine Kubernetes cluster for development, run:
-->
默认情况下，出于安全原因，你的集群不会在控制平面节点上调度 Pod。
如果你希望能够在控制平面节点上调度 Pod，
例如用于开发的单机 Kubernetes 集群，请运行：

```bash
kubectl taint nodes --all node-role.kubernetes.io/master-
```
<!--
With output looking something like:
-->
输出看起来像：

```
node "test-01" untainted
taint "node-role.kubernetes.io/master:" not found
taint "node-role.kubernetes.io/master:" not found
```

<!--
This will remove the `node-role.kubernetes.io/master` taint from any nodes that
have it, including the control-plane node, meaning that the scheduler will then be able
to schedule Pods everywhere.
-->
这将从任何拥有 `node-role.kubernetes.io/master` taint 标记的节点中移除该标记，
包括控制平面节点，这意味着调度程序将能够在任何地方调度 Pods。


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
* Run the command that was output by `kubeadm init`. For example:
-->
* SSH 到机器
* 成为 root （例如 `sudo su -`）
* 运行 `kubeadm init` 输出的命令。例如：

```bash
kubeadm join --token <token> <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:<hash>
```

<!--
If you do not have the token, you can get it by running the following command on the control-plane node:
-->
如果没有令牌，可以通过在控制平面节点上运行以下命令来获取令牌：


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
默认情况下，令牌会在24小时后过期。如果要在当前令牌过期后将节点加入集群，
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
If you don't have the value of `--discovery-token-ca-cert-hash`, you can get it by running the following command chain on the control-plane node:
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

<!--
To specify an IPv6 tuple for `<control-plane-host>:<control-plane-port>`, IPv6 address must be enclosed in square brackets, for example: `[fd00::101]:2073`.
-->
{{< note >}}
要为 `<control-plane-host>:<control-plane-port>` 指定 IPv6 元组，必须将 IPv6 地址括在方括号中，例如：`[fd00::101]:2073`
{{< /note >}}

<!--
The output should look something like:
-->
输出应类似于：

```
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

<!--
### (Optional) Controlling your cluster from machines other than the control-plane node
-->
### （可选）从控制平面节点以外的计算机控制集群

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
<!--
The example above assumes SSH access is enabled for root. If that is not the
case, you can copy the `admin.conf` file to be accessible by some other user
and `scp` using that other user instead.

The `admin.conf` file gives the user _superuser_ privileges over the cluster.
This file should be used sparingly. For normal users, it's recommended to
generate an unique credential to which you grant privileges. You can do
this with the `kubeadm alpha kubeconfig user --client-name <CN>`
command. That command will print out a KubeConfig file to STDOUT which you
should save to a file and distribute to your user. After that, grant
privileges by using `kubectl create (cluster)rolebinding`.
-->
{{< note >}}
上面的示例假定为 root 用户启用了SSH访问。如果不是这种情况，
你可以使用 `scp` 将 admin.conf 文件复制给其他允许访问的用户。

admin.conf 文件为用户提供了对集群的超级用户特权。
该文件应谨慎使用。对于普通用户，建议生成一个你为其授予特权的唯一证书。
你可以使用 `kubeadm alpha kubeconfig user --client-name <CN>` 命令执行此操作。
该命令会将 KubeConfig 文件打印到 STDOUT，你应该将其保存到文件并分发给用户。
之后，使用 `kubectl create (cluster)rolebinding` 授予特权。
{{< /note >}}

<!--
### (Optional) Proxying API Server to localhost
-->
### （可选）将API服务器代理到本地主机

<!--
If you want to connect to the API Server from outside the cluster you can use
`kubectl proxy`:
-->
如果要从集群外部连接到 API 服务器，则可以使用 `kubectl proxy`：

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```
<!--
You can now access the API Server locally at `http://localhost:8001/api/v1`
-->
你现在可以在本地访问API服务器 http://localhost:8001/api/v1

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
如果你在集群中使用了一次性服务器进行测试，则可以关闭这些服务器，而无需进一步清理。你可以使用 `kubectl config delete-cluster` 删除对集群的本地引用。

<!--
However, if you want to deprovision your cluster more cleanly, you should
first [drain the node](/docs/reference/generated/kubectl/kubectl-commands#drain)
and make sure that the node is empty, then deconfigure the node.
-->
但是，如果要更干净地取消配置群集，
则应首先[清空节点](/docs/reference/generated/kubectl/kubectl-commands#drain)并确保该节点为空，
然后取消配置该节点。


<!--
### Remove the node
-->
### 删除节点

<!--
Talking to the control-plane node with the appropriate credentials, run:
-->
使用适当的凭证与控制平面节点通信，运行：

```bash
kubectl drain <node name> --delete-local-data --force --ignore-daemonsets
```

<!--
Before removing the node, reset the state installed by `kubeadm`:
-->
在删除节点之前，请重置 `kubeadm` 安装的状态：

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
-->
现在删除节点：

```bash
kubectl delete node <node name>
```

<!--
If you wish to start over simply run `kubeadm init` or `kubeadm join` with the
appropriate arguments.
-->
如果你想重新开始，只需运行 `kubeadm init` 或 `kubeadm join` 并加上适当的参数。

<!--
### Clean up the control plane
-->
### 清理控制平面

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
有关此子命令及其选项的更多信息，请参见[`kubeadm reset`](/zh/docs/reference/setup-tools/kubeadm/kubeadm-reset/)参考文档。


<!-- discussion -->

<!--
## What's next {#whats-next}
-->
## 下一步 {#whats-next}

<!--
* Verify that your cluster is running properly with [Sonobuoy](https://github.com/heptio/sonobuoy)
* <a id="lifecycle" />See [Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
  for details about upgrading your cluster using `kubeadm`.
* Learn about advanced `kubeadm` usage in the [kubeadm reference documentation](/docs/reference/setup-tools/kubeadm)
* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/reference/kubectl/overview/).
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
* 使用 [Sonobuoy](https://github.com/heptio/sonobuoy) 验证集群是否正常运行
* <a id="lifecycle" />有关使用kubeadm升级集群的详细信息，请参阅[升级 kubeadm 集群](/zh/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。
* 在[kubeadm 参考文档](/zh/docs/reference/setup-tools/kubeadm)中了解有关高级 `kubeadm` 用法的信息
* 了解有关Kubernetes[概念](/zh/docs/concepts/)和[`kubectl`](/zh/docs/reference/kubectl/overview/)的更多信息。
* 有关Pod网络附加组件的更多列表，请参见[集群网络](/zh/docs/concepts/cluster-administration/networking/)页面。
* <a id="other-addons" />请参阅[附加组件列表](/zh/docs/concepts/cluster-administration/addons/)以探索其他附加组件，
  包括用于 Kubernetes 集群的日志记录，监视，网络策略，可视化和控制的工具。
* 配置集群如何处理集群事件的日志以及
   在Pods中运行的应用程序。
  有关所涉及内容的概述，请参见[日志架构](/zh/docs/concepts/cluster-administration/logging/)。

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
* 有关 bugs, 访问 [kubeadm GitHub issue tracker](https://github.com/kubernetes/kubeadm/issues)
* 有关支持, 访问
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/) Slack 频道
* General SIG 集群生命周期开发 Slack 频道:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG 集群生命周期 [SIG information](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
* SIG 集群生命周期邮件列表:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)


<!--
## Version skew policy {#version-skew-policy}
-->
## 版本倾斜政策 {#version-skew-policy}

<!--
The `kubeadm` tool of version v{{< skew latestVersion >}} may deploy clusters with a control plane of version v{{< skew latestVersion >}} or v{{< skew prevMinorVersion >}}.
`kubeadm` v{{< skew latestVersion >}} can also upgrade an existing kubeadm-created cluster of version v{{< skew prevMinorVersion >}}.
-->
版本 v{{< skew latestVersion >}} 的kubeadm 工具可以使用版本 v{{< skew latestVersion >}} 或 v{{< skew prevMinorVersion >}} 的控制平面部署集群。kubeadm v{{< skew latestVersion >}} 还可以升级现有的 kubeadm 创建的 v{{< skew prevMinorVersion >}} 版本的集群。

<!--
Due to that we can't see into the future, kubeadm CLI v{{< skew latestVersion >}} may or may not be able to deploy v{{< skew nextMinorVersion >}} clusters.
-->
由于没有未来，kubeadm CLI v{{< skew latestVersion >}} 可能会或可能无法部署 v{{< skew nextMinorVersion >}} 集群。

<!--
These resources provide more information on supported version skew between kubelets and the control plane, and other Kubernetes components:
-->
这些资源提供了有关 kubelet 与控制平面以及其他 Kubernetes 组件之间受支持的版本倾斜的更多信息：

<!--
* Kubernetes [version and version-skew policy](/docs/setup/release/version-skew-policy/)
* Kubeadm-specific [installation guide](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl)
-->
* Kubernetes [版本和版本偏斜政策](/zh/docs/setup/release/version-skew-policy/)
* Kubeadm-specific [安装指南](/zh/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl)


<!--
## Limitations {#limitations}
-->
## 局限性 {#limitations}

<!--
### Cluster resilience {#resilience}
-->
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
解决方法:

<!--
* Regularly [back up etcd](https://coreos.com/etcd/docs/latest/admin_guide.html). The
  etcd data directory configured by kubeadm is at `/var/lib/etcd` on the control-plane node.
-->
* 定期[备份 etcd](https://coreos.com/etcd/docs/latest/admin_guide.html)。
  kubeadm 配置的 etcd 数据目录位于控制平面节点上的 `/var/lib/etcd` 中。

<!--
* Use multiple control-plane nodes. You can read
  [Options for Highly Available topology](/docs/setup/production-environment/tools/kubeadm/ha-topology/) to pick a cluster
  topology that provides [high-availability](/docs/setup/production-environment/tools/kubeadm/high-availability/).
-->
* 使用多个控制平面节点。你可以阅读
  [可选的高可用性拓扑](/zh/docs/setup/production-environment/tools/kubeadm/ha-topology/) 选择集群拓扑提供的
  [高可用性](/zh/docs/setup/production-environment/tools/kubeadm/high-availability/).

<!--
### Platform compatibility {#multi-platform}
-->
### 平台兼容性 {#multi-platform}

<!--
kubeadm deb/rpm packages and binaries are built for amd64, arm (32-bit), arm64, ppc64le, and s390x
following the [multi-platform
proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/multi-platform.md).
-->
kubeadm deb/rpm 软件包和二进制文件是为 amd64，arm (32-bit)，arm64，ppc64le 和 s390x 构建的遵循[多平台提案](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/multi-platform.md)。

<!--
Multiplatform container images for the control plane and addons are also supported since v1.12.
-->
从 v1.12 开始还支持用于控制平面和附加组件的多平台容器镜像。

<!--
Only some of the network providers offer solutions for all platforms. Please consult the list of
network providers above or the documentation from each provider to figure out whether the provider
supports your chosen platform.
-->
只有一些网络提供商为所有平台提供解决方案。请查阅上方的
网络提供商清单或每个提供商的文档以确定提供商是否
支持你选择的平台。

<!--
## Troubleshooting {#troubleshooting}
-->
## 故障排除 {#troubleshooting}

<!--
If you are running into difficulties with kubeadm, please consult our [troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).
-->

如果你在使用 kubeadm 时遇到困难，请查阅我们的[故障排除文档](/zh/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)。
