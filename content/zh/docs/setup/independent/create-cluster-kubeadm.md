---
reviewers:
- sig-cluster-lifecycle
title: 使用 kubeadm 创建只有一个主节点的集群
content_template: templates/task
weight: 30
---

<!--
---
reviewers:
- sig-cluster-lifecycle
title: Creating a single master cluster with kubeadm
content_template: templates/task
weight: 30
---
-->

{{% capture overview %}}

<!--
<img src="https://raw.githubusercontent.com/cncf/artwork/master/kubernetes/certified-kubernetes/versionless/color/certified-kubernetes-color.png" align="right" width="150px">**kubeadm** helps you bootstrap a minimum viable Kubernetes cluster that conforms to best practices.  With kubeadm, your cluster should pass [Kubernetes Conformance tests](https://kubernetes.io/blog/2017/10/software-conformance-certification). Kubeadm also supports other cluster 
lifecycle functions, such as upgrades, downgrade, and managing [bootstrap tokens](/docs/reference/access-authn-authz/bootstrap-tokens/). 
-->
<img src="https://raw.githubusercontent.com/cncf/artwork/master/kubernetes/certified-kubernetes/versionless/color/certified-kubernetes-color.png" align="right" width="150px">**kubeadm** 可以帮助您引导符合最佳实践的最小可行 Kubernetes 集群。使用 kubeadm, 您的集群应通过  [Kubernetes 合规性认证](https://kubernetes.io/blog/2017/10/software-conformance-certification)。Kubeadm 还支持其他集群生命周期的功能，
如升级、降级和管理[引导令牌](/docs/reference/access-authn-authz/bootstrap-tokens/)。

<!--
Because you can install kubeadm on various types of machine (e.g. laptop, server, 
Raspberry Pi, etc.), it's well suited for integration with provisioning systems 
such as Terraform or Ansible.
-->

因为您可以在各种类型的机器（例如笔记本电脑、服务器、树莓派等）上安装 kubeadm，
所以它非常适合与 Terraform 或 Ansible 等配置系统集成。

<!--
kubeadm's simplicity means it can serve a wide range of use cases:

- New users can start with kubeadm to try Kubernetes out for the first time.
- Users familiar with Kubernetes can spin up clusters with kubeadm and test their applications.
- Larger projects can include kubeadm as a building block in a more complex system that can also include other installer tools.
-->

kubeadm 的简单性意味着它可以服务于各种用例：

 - 新用户可以从 kubeadm 开始，第一次尝试 Kubernetes。
 - 熟悉 Kubernetes 的用户可以使用 kubeadm 启动集群并测试他们的应用程序。
 - 较大的项目可以包括 kubeadm 作为更复杂系统中的构建块，也可以包括其他安装工具。

<!--
kubeadm is designed to be a simple way for new users to start trying
Kubernetes out, possibly for the first time, a way for existing users to
test their application on and stitch together a cluster easily, and also to be
a building block in other ecosystem and/or installer tool with a larger
scope.
-->

kubeadm 旨在成为新用户开始尝试 Kubernetes 的一种简单方法，可能这是第一次让
现有用户可以轻松测试应用程序并将其与集群拼接在一起，同时，kubeadm 也可成为其他生态系统中的构建块或者更大范围的安装工具。

<!--
You can install _kubeadm_ very easily on operating systems that support
installing deb or rpm packages. The responsible SIG for kubeadm,
[SIG Cluster Lifecycle](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle), provides these packages pre-built for you,
but you may also build them from source for other OSes.
-->

您可以在支持安装 deb 或 rpm 软件包的操作系统上轻松安装 _kubeadm_ 。 负责 kubeadm 的 SIG——[SIG Cluster Lifecycle](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle)提供了为您预先构建的这些软件包，
但您也可以基于源代码为其它操作系统生成这些软件包。

<!--
### kubeadm Maturity

| Area                      | Maturity Level |
|---------------------------|--------------- |
| Command line UX           | beta           |
| Implementation            | beta           |
| Config file API           | alpha          |
| Self-hosting              | alpha          |
| kubeadm alpha subcommands | alpha          |
| CoreDNS                   | GA             |
| DynamicKubeletConfig      | alpha          |
-->

### kubeadm 成熟度

| 领域                       | 成熟度          |
|---------------------------|--------------- |
| 命令行 UX                  | beta           |
| 执行（Implementation）     | beta           |
| 配置文件 API               | alpha          |
| 自托管 （Self-hosting）    | alpha          |
| kubeadm alpha 子命令       | alpha          |
| CoreDNS                   | GA             |
| DynamicKubeletConfig      | alpha          |


<!--
kubeadm's overall feature state is **Beta** and will soon be graduated to
**General Availability (GA)** during 2018. Some sub-features, like self-hosting
or the configuration file API are still under active development. The
implementation of creating the cluster may change slightly as the tool evolves,
but the overall implementation should be pretty stable. Any commands under
`kubeadm alpha` are by definition, supported on an alpha level.
-->

kubeadm 的整体功能状态是 **Beta**，很快将在 2018年升级为 **正式发布 (GA)**。一些子功能，如自托管或配置文件
API 仍在积极开发中。随着工具的发展，创建集群的实现可能会略有变化，但整体实现应该相当稳定。正如其名字所表达的，`kubeadm alpha` 下的任何命令
都仅按 alpha 特性来支持。

<!--
### Support timeframes

Kubernetes releases are generally supported for nine months, and during that
period a patch release may be issued from the release branch if a severe bug or
security issue is found. Here are the latest Kubernetes releases and the support
timeframe; which also applies to `kubeadm`.
-->


### 支持时间表

每个 Kubernetes 发行版本通常支持九个月，在此期间，如果 Kubernetes 被发现有严重错误或安全问题，可能会从发行分支上发布补丁版本。 
以下是最新的 Kubernetes 版本号和支持时间表；该表也适用于 `kubeadm`。

| Kubernetes 版本号    | 发行月        |     结束月        |
|--------------------|----------------|-------------------|
| v1.6.x             |  2017 年 3 月    |  2017 年 12 月     |
| v1.7.x             |  2017 年 6 月    |  2018年 3 月       |
| v1.8.x             |  2017 年 9 月    |  2018年 6 月       |
| v1.9.x             |  2017 年 12 月   |  2018年 9 月       |
| v1.10.x            |  2018 年 3 月    |  2018年 12 月      |
| v1.11.x            |  2018 年 6 月    |  2019年 3 月       |
| v1.12.x            |  2018 年 9 月    |  2019年 6 月       |

{{% /capture %}}

{{% capture prerequisites %}}

<!--
- One or more machines running a deb/rpm-compatible OS, for example Ubuntu or CentOS
- 2 GB or more of RAM per machine. Any less leaves little room for your
   apps.
- 2 CPUs or more on the master
- Full network connectivity among all machines in the cluster. A public or
   private network is fine.
-->

- 一台或多台机器，其上运行支持 deb / rpm 软件包的操作系统，例如 Ubuntu 或 CentOS。
- 每台机器 2 GB 或更多内存。少一点点内存都会让您的应用运行空间非常局促。
- 主节点上有至少 2 个 CPU。
- 集群中所有计算机之间的网络互联互通，公网或内网都可以。

{{% /capture %}}

{{% capture steps %}}

<!--
## Objectives

* Install a single master Kubernetes cluster or [high availability cluster](https://kubernetes.io/docs/setup/independent/high-availability/)
* Install a Pod network on the cluster so that your Pods can
  talk to each other
-->

## 目标

* 安装只有一个主节点的集群或[高可用集群](https://kubernetes.io/docs/setup/independent/high-availability/)。
* 在集群上安装 Pod 网络，以便您的 Pod 可以相互通信。

<!--
## Instructions

### Installing kubeadm on your hosts

See ["Installing kubeadm"](/docs/setup/independent/install-kubeadm/).

{{< note >}}
**Note:** If you have already installed kubeadm, run `apt-get update &&
apt-get upgrade` or `yum update` to get the latest version of kubeadm.

When you upgrade, the kubelet restarts every few seconds as it waits in a crashloop for
kubeadm to tell it what to do. This crashloop is expected and normal. 
After you initialize your master, the kubelet runs normally.
{{< /note >}}
-->

## 说明

### 在主机上安装 kubeadm

详见["安装 kubeadm"](/docs/setup/independent/install-kubeadm/).

{{< note >}}
**注意:** 如果您已经安装了 kubeadm，请运行 `apt-get update && apt-get upgrade`
或 `yum update` 以获取最新版本的 kubeadm。

当您升级时，kubelet 会每隔几秒钟重新启动一次，
因为它陷入崩溃循环（crashloop）中，等待 kubeadm 告诉它该怎么做。
这个崩溃循环是意料之中的并且是正常的。主节点被初始化后，kubelet 会正常运行。

{{< /note >}}

<!--
### Initializing your master

The master is the machine where the control plane components run, including
etcd (the cluster database) and the API server (which the kubectl CLI
communicates with).

1. Choose a pod network add-on, and verify whether it requires any arguments to 
be passed to kubeadm initialization. Depending on which
third-party provider you choose, you might need to set the `--pod-network-cidr` to
a provider-specific value. See [Installing a pod network add-on](#pod-network).
1. (Optional) Unless otherwise specified, kubeadm uses the network interface associated 
with the default gateway to advertise the master's IP. To use a different 
network interface, specify the `--apiserver-advertise-address=<ip-address>` argument 
to `kubeadm init`. To deploy an IPv6 Kubernetes cluster using IPv6 addressing, you 
must specify an IPv6 address, for example `--apiserver-advertise-address=fd00::101`
1. (Optional) Run `kubeadm config images pull` prior to `kubeadm init` to verify 
connectivity to gcr.io registries.   

Now run:

```bash
kubeadm init <args> 
```
-->

### 初始化主节点

主节点是运行控制平面组件的机器，包括 etcd（集群数据库）和 API 服务器（kubectl CLI 与之通信）。

1. 选择一个 pod 网络加载项，并验证是否需要将任何参数传递给 kubeadm 初始化。
根据您选择的第三方提供商，您可能需要将 `--pod-network-cidr` 设置为特定于提供者的值。
请参阅[安装 pod 网络附加组件](#pod-network)。
1. （可选）除非另有说明，否则 kubeadm 使用与默认网关关联的网络接口来通告主节点 IP。 要使用不同的网络接口，请为
`kubeadm init` 指定 `--apiserver-advertise-address=<ip-address>` 参数。
要使用 IPv6 部署 Kubernetes 集群，必须指定 IPv6 地址，例如 `--apiserver-advertise-address=fd00::101`。
1. （可选）在运行 `kubeadm init` 之前运行 `kubeadm config images pull` 以验证与 gcr.io 镜像仓库的连接。

现在运行:

```bash
kubeadm init <args> 
```
<!--
### More information

For more information about `kubeadm init` arguments, see the [kubeadm reference guide](/docs/reference/setup-tools/kubeadm/kubeadm/).

For a complete list of configuration options, see the [configuration file documentation](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).

To customize control plane components, including optional IPv6 assignment to liveness probe for control plane components and etcd server, provide extra arguments to each component as documented in [custom arguments](/docs/admin/kubeadm#custom-args).

To run `kubeadm init` again, you must first [tear down the cluster](#tear-down).

If you join a node with a different architecture to your cluster, create a separate
Deployment or DaemonSet for `kube-proxy` and `kube-dns` on the node. This is because the Docker images for these
components do not currently support multi-architecture.

`kubeadm init` first runs a series of prechecks to ensure that the machine
is ready to run Kubernetes. These prechecks expose warnings and exit on errors. `kubeadm init`
then downloads and installs the cluster control plane components. This may take several minutes. 
The output should look like:
-->

### 更多信息

更多关于 `kubeadm init` 的参数信息，详见 [kubeadm 参考指南](/docs/reference/setup-tools/kubeadm/kubeadm/)。

有关配置选项的完整列表，请参阅 [配置文件文档](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)。

要自定义控制平面组件，包括可选的 IPv6 分配到控制平面组件和 etcd 服务器的活动探测器，请为[自定义参数](/docs/admin/kubeadm#custom-args)中记录的每个组件提供额外的参数。

要再次运行 `kubeadm init`，必须先[移除集群](#tear-down).

如果您将具有不同体系结构的节点加集群，请在节点上为 `kube-proxy` 和 `kube-dns` 创建单独的 Deployment 或 DaemonSet 。
这是因为这些组件的 Docker 镜像目前不支持多架构。

执行 `kubeadm init` 命令后，首先运行一系列预检，以确保机器已准备好运行 Kubernetes。
这些预先检查会显示警告并退出错误，然后 `kubeadm init` 会下载并安装集群控制平面组件。 这可能会需要几分钟。
输出应如下所示：

```none
[init] Using Kubernetes version: vX.Y.Z
[preflight] Running pre-flight checks
[kubeadm] WARNING: starting in 1.8, tokens expire after 24 hours by default (if you require a non-expiring token use --token-ttl 0)
[certificates] Generated ca certificate and key.
[certificates] Generated apiserver certificate and key.
[certificates] apiserver serving cert is signed for DNS names [kubeadm-master kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 10.138.0.4]
[certificates] Generated apiserver-kubelet-client certificate and key.
[certificates] Generated sa key and public key.
[certificates] Generated front-proxy-ca certificate and key.
[certificates] Generated front-proxy-client certificate and key.
[certificates] Valid certificates and keys now exist in "/etc/kubernetes/pki"
[kubeconfig] Wrote KubeConfig file to disk: "admin.conf"
[kubeconfig] Wrote KubeConfig file to disk: "kubelet.conf"
[kubeconfig] Wrote KubeConfig file to disk: "controller-manager.conf"
[kubeconfig] Wrote KubeConfig file to disk: "scheduler.conf"
[controlplane] Wrote Static Pod manifest for component kube-apiserver to "/etc/kubernetes/manifests/kube-apiserver.yaml"
[controlplane] Wrote Static Pod manifest for component kube-controller-manager to "/etc/kubernetes/manifests/kube-controller-manager.yaml"
[controlplane] Wrote Static Pod manifest for component kube-scheduler to "/etc/kubernetes/manifests/kube-scheduler.yaml"
[etcd] Wrote Static Pod manifest for a local etcd instance to "/etc/kubernetes/manifests/etcd.yaml"
[init] Waiting for the kubelet to boot up the control plane as Static Pods from directory "/etc/kubernetes/manifests"
[init] This often takes around a minute; or longer if the control plane images have to be pulled.
[apiclient] All control plane components are healthy after 39.511972 seconds
[uploadconfig] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[markmaster] Will mark node master as master by adding a label and a taint
[markmaster] Master master tainted and labelled with key/value: node-role.kubernetes.io/master=""
[bootstraptoken] Using token: <token>
[bootstraptoken] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstraptoken] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstraptoken] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes master has initialized successfully!

To start using your cluster, you need to run (as a regular user):

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the addon options listed at:
  /docs/admin/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join --token <token> <master-ip>:<master-port> --discovery-token-ca-cert-hash sha256:<hash>
```

如果您是非 root 用户运行 kubectl，请运行以下命令，这些命令也是 `kubeadm init` 输出的一部分：

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

或者，如果您是 `root` 用户，则可以运行：

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```
<!--
Make a record of the `kubeadm join` command that `kubeadm init` outputs. You
need this command to [join nodes to your cluster](#join-nodes).

The token is used for mutual authentication between the master and the joining
nodes.  The token included here is secret. Keep it safe, because anyone with this
token can add authenticated nodes to your cluster. These tokens can be listed,
created, and deleted with the `kubeadm token` command. See the
[kubeadm reference guide](/docs/reference/setup-tools/kubeadm/kubeadm-token/).
-->

记录 `kubeadm init` 输出结果中的 `kubeadm join` 命令。
您需要执行此命令[将节点添加到您的集群](#join-nodes)。

令牌（token）用于主节点和待加入节点之间的相互认证。
请将这里包含的令牌视为机密数据，保证其安全，因为任何人都可以通过令牌将经过身份验证的节点添加到集群中。
可以使用 `kubeadm token` 命令列出，创建和删除这些令牌。 参见 [kubeadm 参考指南](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

<!--
### Installing a pod network add-on {#pod-network}

{{< caution >}}
**Caution:** This section contains important information about installation and deployment order. Read it carefully before proceeding.
{{< /caution >}}

You must install a pod network add-on so that your pods can communicate with
each other.
-->

### 安装 pod 网络附加组件 {#pod-network}

{{< caution >}}
**注意:** 本节包含有关安装和部署顺序的重要信息。 继续操作之前请仔细阅读。
{{< /caution >}}

您必须安装 pod 网络插件，以便您的 pod 之间可以相互通信。

<!--
**The network must be deployed before any applications. Also, CoreDNS will not start up before a network is installed.
kubeadm only supports Container Network Interface (CNI) based networks (and does not support kubenet).**

Several projects provide Kubernetes pod networks using CNI, some of which also
support [Network Policy](/docs/concepts/services-networking/networkpolicies/). See the [add-ons page](/docs/concepts/cluster-administration/addons/) for a complete list of available network add-ons. 
- IPv6 support was added in [CNI v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0). 
- [CNI bridge](https://github.com/containernetworking/plugins/blob/master/plugins/main/bridge/README.md) and [local-ipam](https://github.com/containernetworking/plugins/blob/master/plugins/ipam/host-local/README.md) are the only supported IPv6 network plugins in Kubernetes version 1.9.

Note that kubeadm sets up a more secure cluster by default and enforces use of [RBAC](/docs/reference/access-authn-authz/rbac/).
Make sure that your network manifest supports RBAC.

You can install a pod network add-on with the following command:

```bash
kubectl apply -f <add-on.yaml>
```
-->

**您必须在开启任何应用程序之前部署网络。 此外，CoreDNS 将不会在安装网络之前启动。kubeadm 仅支持基于容器网络接口（CNI）的网络(并且不支持 kubenet )**

有几个项目使用 CNI 提供 Kubernetes pod 网络，其中一些还支持[网络策略](/docs/concepts/services-networking/networkpolicies/)。
有关可用网络加载项的完整列表，请参阅[插件项页面](/docs/concepts/cluster-administration/addons/)。

- IPv6 的支持被加入到了 [CNI v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0). 
- [CNI 网桥](https://github.com/containernetworking/plugins/blob/master/plugins/main/bridge/README.md) 和 [local-ipam](https://github.com/containernetworking/plugins/blob/master/plugins/ipam/host-local/README.md) 是 Kubernetes 1.9 版本中唯一受支持的 IPv6 
网络插件。

请注意，kubeadm 默认设置更安全的集群并强制使用 [RBAC](/docs/reference/access-authn-authz/rbac/)。
确保您的网络配置支持 RBAC。

您可以使用以下命令安装 pod 网络插件：

```bash
kubectl apply -f <add-on.yaml>
```


每个集群只能安装一个 Pod 网络。

{{< tabs name="tabs-pod-install" >}}
{{% tab name="Choose one..." %}}

请选择其中一个选项卡以查看相应第三方 Pod 网络驱动的安装说明。

{{% /tab %}}

{{% tab name="Calico" %}}
有关使用 Calico 的更多信息，请参阅 [Calico on Kubernetes上的快速入门](https://docs.projectcalico.org/latest/getting-started/kubernetes/)，
[安装 Calico 用于策略和网络](https://docs.projectcalico.org/latest/getting-started/kubernetes/installation/calico)和其他相关资源。

要使 Calico 正常工作，您需要执行 `kubeadm init` 时增加 `--pod-network-cidr=192.168.0.0/16` 参数或更新 `calico.yml` 文件以匹配您的 Pod 网络。
请注意，Calico 仅适用于 `amd64`、`arm64`、`ppc64le` 和 `s390x` 架构。

```shell
kubectl apply -f https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/rbac-kdd.yaml
kubectl apply -f https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/kubernetes-datastore/calico-networking/1.7/calico.yaml
```

{{% /tab %}}



{{% tab name="Canal" %}}
Canal 使用 Calico 作为策略、Flannel 作为网络。 有关 Calico 的内容，请参阅[官方入门指南](https://docs.projectcalico.org/latest/getting-started/kubernetes/installation/flannel)。

为了让 Canal 正常工作， 您需要在执行 `kubeadm init` 时增加 `--pod-network-cidr=10.244.0.0/16` 参数。 注意 Canal 只支持 `amd64` 设备。

```shell
kubectl apply -f https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/canal/rbac.yaml
kubectl apply -f https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/canal/canal.yaml
```

{{% /tab %}}



{{% tab name="Cilium" %}}
有关将 Cilium 与 Kubernetes 一起使用的更多信息，请参阅[关于 Kubernetes 的 Cilium 快速入门](http://docs.cilium.io/en/v1.2/kubernetes/quickinstall/) 和 [适用于 Ciliu m的 kubernetes 安装指南](http://docs.cilium.io/en/v1.2/kubernetes/install/)。

不需要将 `--pod-network-cidr` 选项传递给 `kubeadm init`，但强烈推荐你这么做。

这些命令将通过 etcd 运算器管理的自己的 etcd 以部署 Cilium。

```shell
# 从 Cilium 仓库下载所需的清单
wget https://github.com/cilium/cilium/archive/v1.2.0.zip
unzip v1.2.0.zip
cd cilium-1.2.0/examples/kubernetes/addons/etcd-operator

# 生成并部署 etcd 证书
export CLUSTER_DOMAIN=$(kubectl get ConfigMap --namespace kube-system coredns -o yaml | awk '/kubernetes/ {print $2}')
tls/certs/gen-cert.sh $CLUSTER_DOMAIN
tls/deploy-certs.sh

# 标记具有固定标识标签的 kube-dns
kubectl label -n kube-system pod $(kubectl -n kube-system get pods -l k8s-app=kube-dns -o jsonpath='{range .items[]}{.metadata.name}{" "}{end}') io.cilium.fixed-identity=kube-dns

kubectl create -f ./

# 等待几分钟，让 Cilium、coredns 和 etcd pod 收敛到工作状态
```


{{% /tab %}}


{{% tab name="Flannel" %}}

为了使 `flannel` 正常工作，你必须将选项 `--pod-network-cidr=10.244.0.0/16` 传递给 `kubeadm init`。

通过执行 `sysctl net.bridge.bridge-nf-call-iptables=1` 命令，将 `/proc/sys/net/bridge/bridge-nf-call-iptables` 设置为 `1` 
以便将桥接的 IPv4 流量传递给 iptables 的链。 这是一些 CNI 插件工作的要求，有关详细信息，请参阅[此处](https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#network-plugin-requirements)。

注意 `flannel` 可以运行在 `amd64`、`arm`、`arm64`、`ppc64le`架构的机器上。

```shell
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/bc79dd1505b0c8681ece4de4c0d86c5cd2643275/Documentation/kube-flannel.yml
```

`flannel` 的更多信息, 参见 [CoreOS flannel 在 GitHub 上的仓库](https://github.com/coreos/flannel).
{{% /tab %}}



{{% tab name="Kube-router" %}}
通过执行 `sysctl net.bridge.bridge-nf-call-iptables=1` 命令，将 `/proc/sys/net/bridge/bridge-nf-call-iptables` 设置为 `1` 
以便将桥接的 IPv4 流量传递给 iptables 的链。 这是一些 CNI 插件工作的要求，有关详细信息，请参阅[此处](https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#network-plugin-requirements)。

Kube-router 依靠 kube-controller-manager 为节点分配 pod CIDR。 因此，执行`kubeadm init` 命令需要使用带 `-pod-network-cidr` 选项。

Kube-router 提供 pod 网络、网络策略和基于高性能 IP Virtual Server（IPVS）/ Linux Virtual Server（LVS）的服务代理。

有关使用 kubeadm 使用 Kube-router 设置 Kubernetes 集群的信息，请参阅官方[设置指南](https://github.com/cloudnativelabs/kube-router/blob/master/docs/kubeadm.md).
{{% /tab %}}



{{% tab name="Romana" %}}
通过执行 `sysctl net.bridge.bridge-nf-call-iptables=1` 命令，将 `/proc/sys/net/bridge/bridge-nf-call-iptables` 设置为 `1` 
以便将桥接的 IPv4 流量传递给 iptables 的链。 这是一些 CNI 插件工作的要求，有关详细信息，请参阅[此处](https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#network-plugin-requirements)。

Romana 官方设置指南在[这里](https://github.com/romana/romana/tree/master/containerize#using-kubeadm).

Romana 仅运行在 `amd64` 架构的机器.

```shell
kubectl apply -f https://raw.githubusercontent.com/romana/romana/master/containerize/specs/romana-kubeadm.yml
```
{{% /tab %}}


{{% tab name="Weave Net" %}}
通过执行 `sysctl net.bridge.bridge-nf-call-iptables=1` 命令，将 `/proc/sys/net/bridge/bridge-nf-call-iptables` 设置为 `1` 
以便将桥接的 IPv4 流量传递给 iptables 的链。 这是一些 CNI 插件工作的要求，有关详细信息，请参阅[此处](https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#network-plugin-requirements)。

Weave Net 官方设置指南在[这里](https://www.weave.works/docs/net/latest/kube-addon/).

Weave Net 可以工作在无需任何额外操作的 `amd64`、`arm`、`arm64`和`ppc64le`架构的机器上。
Weave Net 默认设置发夹（hairpin）模式。如果他们不知道自己的 PodIP，Pod 可以通过其服务 IP 地址来访问自身。

```shell
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```
{{% /tab %}}


{{% tab name="JuniperContrail/TungstenFabric" %}}
提供了覆盖 SDN 解决方案、多云网络、混合云网络，同时覆盖底层支持、网络策略实施、网络隔离、服务链和灵活的负载平衡。

有多种灵活的方法可以安装 JuniperContrail / TungstenFabric CNI。

请参考快速入门：[TungstenFabric](https://tungstenfabric.github.io/website/)
{{% /tab %}}
{{< /tabs >}}

<!--
Once a pod network has been installed, you can confirm that it is working by
checking that the CoreDNS pod is Running in the output of `kubectl get pods --all-namespaces`.
And once the CoreDNS pod is up and running, you can continue by joining your nodes.

If your network is not working or CoreDNS is not in the Running state, check
out our [troubleshooting docs](/docs/setup/independent/troubleshooting-kubeadm/).
-->



安装了 pod 网络后，您可以通过在 `kubectl get pods --all-namespaces` 的输出中检查 CoreDNS pod 运行状态来确认它正常工作。
一旦 CoreDNS pod 启动并运行，您可以继续加入您的节点。

如果您的网络无法运行或 CoreDNS 未处于 “正在运行” 状态，请查看我们的[故障排除文档](/docs/setup/independent/troubleshooting-kubeadm/).

<!--
### Master Isolation

By default, your cluster will not schedule pods on the master for security
reasons. If you want to be able to schedule pods on the master, e.g. for a
single-machine Kubernetes cluster for development, run:

```bash
kubectl taint nodes --all node-role.kubernetes.io/master-
```

With output looking something like:

```
node "test-01" untainted
taint "node-role.kubernetes.io/master:" not found
taint "node-role.kubernetes.io/master:" not found
```

This will remove the `node-role.kubernetes.io/master` taint from any nodes that
have it, including the master node, meaning that the scheduler will then be able
to schedule pods everywhere.
-->

### 主节点隔离

默认情况下，出于安全原因，您的集群不会在主节点上调度容器。
如果您希望能够在主节点上安排 pod，例如对于用于开发的单机 Kubernetes 集群，运行：

```bash
kubectl taint nodes --all node-role.kubernetes.io/master-
```

输出与如下类似：

```
node "test-01" untainted
taint "node-role.kubernetes.io/master:" not found
taint "node-role.kubernetes.io/master:" not found
```

这将从拥有 `node-role.kubernetes.io/master` 污点的任何节点（包括主节点）上删除该污点，这意味着调度程序能够将 Pod 调度到任意节点执行。

<!--
### Joining your nodes {#join-nodes}
The nodes are where your workloads (containers and pods, etc) run. To add new nodes to your cluster do the following for each machine:
-->

### 加入您的节点 {#join-nodes}

节点是运行工作负载（容器和容器等）的位置。 要向集群添加新节点，请为每台计算机执行以下操作：

* SSH 到机器
* 切换到 root 用户(例如 `sudo su -`)
* 运行 `kubeadm init` 输出的命令。 例如：

``` bash
kubeadm join --token <token> <master-ip>:<master-port> --discovery-token-ca-cert-hash sha256:<hash>
```

如果您没有令牌，可以通过在主节点上运行以下命令来获取它：

``` bash
kubeadm token list
```

输出类似于：

``` console
TOKEN                    TTL  EXPIRES              USAGES           DESCRIPTION            EXTRA GROUPS
8ewj1p.9r9hcjoqgajrj4gi  23h  2018-06-12T02:51:28Z authentication,  The default bootstrap  system:
                                                   signing          token generated by     bootstrappers:
                                                                    'kubeadm init'.        kubeadm:
                                                                                           default-node-token
```
<!--
By default, tokens expire after 24 hours. If you are joining a node to the cluster after the current token has expired,
you can create a new token by running the following command on the master node:
-->
默认情况下，令牌在24小时后过期。 如果需要在当前令牌过期后将节点加入集群，可以通过在主节点上运行以下命令来创建新令牌：

``` bash
kubeadm token create
```

输出类似于：

``` console
5didvk.d09sbcov8ph2amjw
```
<!--
If you don't have the value of `--discovery-token-ca-cert-hash`, you can get it by running the following command chain on the master node:
-->

如果您没有 `--discovery-token-ca-cert-hash` 的值，则可以通过在主节点上运行以下命令来获取它：

``` bash
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | \
   openssl dgst -sha256 -hex | sed 's/^.* //'
```

输出类似于：

``` console
8cb2de97839780a412b93877f8507ad6c94f73add17d5d7058e91741c9d5ec78
```

{{< note >}}
**注意：** 要为`<master-ip>:<master-port>`指定 IPv6 元组，IPv6 地址必须用方括号括起来，例如：`[fd00::101]:2073`。
{{< /note >}}

输出应该类似于：

```
[preflight] Running pre-flight checks

... (log output of join workflow) ...

Node join complete:
* Certificate signing request sent to master and response
  received.
* Kubelet informed of new secure connection details.

Run 'kubectl get nodes' on the master to see this machine join.
```
<!--
A few seconds later, you should notice this node in the output from `kubectl get
nodes` when run on the master.

### (Optional) Controlling your cluster from machines other than the master

In order to get a kubectl on some other computer (e.g. laptop) to talk to your
cluster, you need to copy the administrator kubeconfig file from your master
to your workstation like this:
-->
几秒钟之后，在主节点上运行时，您应该注意到 `kubectl get nodes` 输出中的包含此节点。

### (可选) 从主节点以外的计算机控制您的集群

为了在其他计算机（例如笔记本电脑）上获取 kubectl 与您的集群通信，
您需要将管理员 kubeconfig 文件从主集群复制到您的工作站，如下所示：

``` bash
scp root@<master ip>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

<!--
{{< note >}}
**Note:** The example above assumes SSH access is enabled for root. If that is not the
case, you can copy the `admin.conf` file to be accessible by some other user
and `scp` using that other user instead.

The `admin.conf` file gives the user _superuser_ privileges over the cluster.
This file should be used sparingly. For normal users, it's recommended to
generate an unique credential to which you whitelist privileges. You can do
this with the `kubeadm alpha phase kubeconfig user --client-name <CN>`
command. That command will print out a KubeConfig file to STDOUT which you
should save to a file and distribute to your user. After that, whitelist
privileges by using `kubectl create (cluster)rolebinding`.
{{< /note >}}
-->
{{< note >}}
**注意:** 上面的示例假定您为 root 启用了 SSH 访问。
如果不是这种情况，您可以复制 `admin.conf` 文件以供其他用户访问，而 `scp` 则可以使用其他用户访问。

`admin.conf` 文件为用户提供了集群上的 _superuser_ 权限。
应谨慎使用此文件。 对于普通用户，建议您生成一个唯一的凭据，并给予白名单特权。 您可以使用 `kubeadm alpha phase kubeconfig user --client-name <CN>` 
命令执行此操作。 
该命令将打印出一个 KubeConfig 文件到标准输出，您应将其保存为文件并分发给您的用户。
之后，使用 `kubectl create（cluster）rolebinding` 命令进行白名单特权绑定。
{{< /note >}}

<!--
### (Optional) Proxying API Server to localhost

If you want to connect to the API Server from outside the cluster you can use
`kubectl proxy`:

```bash
scp root@<master ip>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

You can now access the API Server locally at `http://localhost:8001/api/v1`

## Tear down {#tear-down}

To undo what kubeadm did, you should first [drain the
node](/docs/reference/generated/kubectl/kubectl-commands#drain) and make
sure that the node is empty before shutting it down.

Talking to the master with the appropriate credentials, run:

```bash
kubectl drain <node name> --delete-local-data --force --ignore-daemonsets
kubectl delete node <node name>
```

Then, on the node being removed, reset all kubeadm installed state:

```bash
kubeadm reset
```

If you wish to start over simply run `kubeadm init` or `kubeadm join` with the
appropriate arguments.

More options and information about the
[`kubeadm reset command`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/).
-->
### (可选) 将 API 服务器代理到 localhost

如果要从集群外部连接到 API 服务器，则可以使用 `kubectl proxy`：

```bash
scp root@<master ip>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

您现在可以在本地访问 API 服务器： `http://localhost:8001/api/v1`

## 移除 {#tear-down}

要取消 kubeadm 所做的事情，你应该首先[腾空节点](/docs/reference/generated/kubectl/kubectl-commands#drain) 并确保节点在关闭之前是空的（没有运行任何 pod）。

使用合适的凭据与主节点通信，运行：

```bash
kubectl drain <node name> --delete-local-data --force --ignore-daemonsets
kubectl delete node <node name>
```

然后，在要删除的节点上，重置所有 kubeadm 的安装状态：

```bash
kubeadm reset
```

如果你想重新开始，只需使用适当的参数运行 `kubeadm init` 或 `kubeadm join`。

有关的更多选项和信息，参见
[`kubeadm reset 命令`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/).

## 维护集群 {#lifecycle}

维护 kubeadm 集群的说明（例如升级，降级等）可以在[这里](/docs/tasks/administer-cluster/kubeadm)找到。

## 探索其他附加组件 {#other-addons}

请参阅[附加组件列表](/docs/concepts/cluster-administration/addons/) 以探索其他附加组件，
包括用于记录、监控、网络策略、可视化和控制 Kubernetes 集群的工具。

## 下一步是什么 {#whats-next}

* 使用 [Sonobuoy](https://github.com/heptio/sonobuoy) 验证集群是否正常运行。
* 在 [kubeadm 参考文档](/docs/reference/setup-tools/kubeadm/kubeadm)中了解 kubeadm 的高级用法。
* 了解有关 Kubernetes [concepts](/docs/concepts/) 和 [`kubectl`](/docs/user-guide/kubectl-overview/) 的更多信息。
* 配置日志轮换。您可以使用 **logrotate**。使用 Docker 时，可以为 Docker 守护程序指定日志轮换选项，例如 `--log-driver=json-file --log-opt=max-size=10m --log-opt=max-file=5`。有关详细信息，请参阅[配置 Docker 守护程序并对其进行故障排除](https://docs.docker.com/engine/admin/)。

## Feedback {#feedback}

* 有关 bug，请访问[kubeadm Github 问题跟踪器](https://github.com/kubernetes/kubeadm/issues)
* 如需支持，请访问 kubeadm Slack Channel：
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/)
* 常规 SIG 集群 Lifecycle 开发 Slack Channel：
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG 集群 Lifecycle [SIG information](#TODO)
* SIG 集群 Lifecycle 邮件列表：
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)

<!--
## Maintaining a cluster {#lifecycle}

Instructions for maintaining kubeadm clusters (e.g. upgrades,downgrades, etc.) can be found [here.](/docs/tasks/administer-cluster/kubeadm)

## Explore other add-ons {#other-addons}

See the [list of add-ons](/docs/concepts/cluster-administration/addons/) to explore other add-ons,
including tools for logging, monitoring, network policy, visualization &amp;
control of your Kubernetes cluster.

## What's next {#whats-next}

* Verify that your cluster is running properly with [Sonobuoy](https://github.com/heptio/sonobuoy)
* Learn about kubeadm's advanced usage in the [kubeadm reference documentation](/docs/reference/setup-tools/kubeadm/kubeadm)
* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/user-guide/kubectl-overview/).
* Configure log rotation. You can use **logrotate** for that. When using Docker, you can specify log rotation options for Docker daemon, for example `--log-driver=json-file --log-opt=max-size=10m --log-opt=max-file=5`. See [Configure and troubleshoot the Docker daemon](https://docs.docker.com/engine/admin/) for more details.

## Feedback {#feedback}

* For bugs, visit [kubeadm Github issue tracker](https://github.com/kubernetes/kubeadm/issues)
* For support, visit kubeadm Slack Channel:
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/)
* General SIG Cluster Lifecycle Development Slack Channel:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG Cluster Lifecycle [SIG information](#TODO)
* SIG Cluster Lifecycle Mailing List:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
-->

<!--
## Version skew policy {#version-skew-policy}

The kubeadm CLI tool of version vX.Y may deploy clusters with a control plane of version vX.Y or vX.(Y-1).
kubeadm CLI vX.Y can also upgrade an existing kubeadm-created cluster of version vX.(Y-1).

Due to that we can't see into the future, kubeadm CLI vX.Y may or may not be able to deploy vX.(Y+1) clusters.

Example: kubeadm v1.8 can deploy both v1.7 and v1.8 clusters and upgrade v1.7 kubeadm-created clusters to
v1.8.

Please also check our [installation guide](/docs/setup/independent/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl)
for more information on the version skew between kubelets and the control plane.

## kubeadm works on multiple platforms {#multi-platform}

kubeadm deb/rpm packages and binaries are built for amd64, arm (32-bit), arm64, ppc64le, and s390x
following the [multi-platform
proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/multi-platform.md).

Only some of the network providers offer solutions for all platforms. Please consult the list of
network providers above or the documentation from each provider to figure out whether the provider
supports your chosen platform.

## Limitations {#limitations}

Please note: kubeadm is a work in progress and these limitations will be
addressed in due course.

1. The cluster created here has a single master, with a single etcd database
   running on it. This means that if the master fails, your cluster may lose
   data and may need to be recreated from scratch. Adding HA support
   (multiple etcd servers, multiple API servers, etc) to kubeadm is
   still a work-in-progress.

   Workaround: regularly
   [back up etcd](https://coreos.com/etcd/docs/latest/admin_guide.html). The
   etcd data directory configured by kubeadm is at `/var/lib/etcd` on the master.

## Troubleshooting {#troubleshooting}

If you are running into difficulties with kubeadm, please consult our [troubleshooting docs](/docs/setup/independent/troubleshooting-kubeadm/).
-->
## 版本偏差策略 {#version-skew-policy}

版本 vX.Y 的 kubeadm CLI 工具可以部署具有版本 vX.Y 或 vX.(Y-1)的控制平面的集群。
kubeadm CLI vX.Y 还可以升级现有的 kubeadm 创建的 vX 版本集群（Y-1）。

由于我们无法预知未来，kubeadm CLI vX.Y 可能会也可能无法部署 vX.(Y+1) 的集群。

示例：kubeadm v1.8 可以部署 v1.7 和 v1.8 集群，并将v1.7 kubeadm 创建的集群升级到 v1.8。

另请查看我们的[安装指南](/docs/setup/independent/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl)
以获取有关 kubelet 和控制平面之间的版本偏差的更多信息。

## kubeadm 适用于多个平台 {#multi-platform}

kubeadm 的 deb / rpm 包和二进制文件是为 amd64、arm（32位）、arm64、ppc64le 和 s390x 构建的并
遵循[多平台方案](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/multi-platform.md).

只有部分网络提供商为所有平台提供解决方案。 
请查阅上面的网络提供商列表或每个提供商的文档，以确定提供商是否支持您选择的平台。

## 限制 {#limitations}

请注意：kubeadm 在运行时，这些限制将在适当的时候得到解决。

1. 此处创建的集群有一个主节点，主节点运行一个 etcd 数据库。
这意味着如果主节点出现故障，您的集群可能会丢失数据，可能需要从头开始重新创建,因此向 kubeadm 添加 HA 支持（多个 etcd 服务器，多个 API 服务器等）仍然是一项工作。

   解决方法：定期
   [备份 etcd](https://coreos.com/etcd/docs/latest/admin_guide.html)。由 kubeadm 配置的 etcd 数据目录位于主节点的 `/var/lib/etcd`。

## 故障排除 {#troubleshooting}

如果您遇到 kubeadm 上的困难，请参阅我们的[故障排除文档](/docs/setup/independent/troubleshooting-kubeadm/).
