---
title: 使用 Cilium 提供 NetworkPolicy
content_type: task
weight: 30
---

<!--
reviewers:
- danwent
- aanm
title: Use Cilium for NetworkPolicy
content_type: task
weight: 30
-->

<!-- overview -->
<!--
This page shows how to use Cilium for NetworkPolicy.

For background on Cilium, read the [Introduction to Cilium](https://docs.cilium.io/en/stable/overview/intro).
-->
本页展示如何使用 Cilium 提供 NetworkPolicy。

关于 Cilium 的背景知识，请阅读 [Cilium 介绍](https://docs.cilium.io/en/stable/overview/intro)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Deploying Cilium on Minikube for Basic Testing

To get familiar with Cilium easily you can follow the
[Cilium Kubernetes Getting Started Guide](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/)
to perform a basic DaemonSet installation of Cilium in minikube.

To start minikube, minimal version required is >= v1.5.2, run the with the
following arguments:
-->
## 在 Minikube 上部署 Cilium 用于基本测试   {#deploying-cilium-on-minikube-for-basic-testing}

为了轻松熟悉 Cilium，你可以根据
[Cilium Kubernetes 入门指南](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/s)
在 minikube 中执行一个 Cilium 的基本 DaemonSet 安装。

要启动 minikube，需要的最低版本为 1.5.2，使用下面的参数运行：

```shell
minikube version
```
```
minikube version: v1.5.2
```

```shell
minikube start --network-plugin=cni
```

<!--
For minikube you can install Cilium using its CLI tool. To do so, first download the latest
version of the CLI with the following command:
-->
对于 minikube 你可以使用 Cilium 的 CLI 工具安装它。
为此，先用以下命令下载最新版本的 CLI：

```shell
curl -LO https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-amd64.tar.gz
```

<!--
Then extract the downloaded file to your `/usr/local/bin` directory with the following command:
-->
然后用以下命令将下载的文件解压缩到你的 `/usr/local/bin` 目录：

```shell
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz
```

<!--
After running the above commands, you can now install Cilium with the following command:
-->
运行上述命令后，你现在可以用以下命令安装 Cilium：

```shell
cilium install
```

<!--
Cilium will then automatically detect the cluster configuration and create and
install the appropriate components for a successful installation.
The components are:

- Certificate Authority (CA) in Secret `cilium-ca` and certificates for Hubble (Cilium's observability layer).
- Service accounts.
- Cluster roles.
- ConfigMap.
- Agent DaemonSet and an Operator Deployment.
-->
随后 Cilium 将自动检测集群配置，并创建和安装合适的组件以成功完成安装。
这些组件为：

- Secret `cilium-ca` 中的证书机构 (CA) 和 Hubble（Cilium 的可观测层）所用的证书。
- 服务账号。
- 集群角色。
- ConfigMap。
- Agent DaemonSet 和 Operator Deployment。

<!--
After the installation, you can view the overall status of the Cilium deployment with the `cilium status` command.
See the expected output of the `status` command
[here](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/#validate-the-installation). 
-->
安装之后，你可以用 `cilium status` 命令查看 Cilium Deployment 的整体状态。
[在此处](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/#validate-the-installation)查看
`status` 命令的预期输出。

<!--
The remainder of the Getting Started Guide explains how to enforce both L3/L4
(i.e., IP address + port) security policies, as well as L7 (e.g., HTTP) security
policies using an example application.
-->
入门指南其余的部分用一个示例应用说明了如何强制执行 L3/L4（即 IP 地址 + 端口）的安全策略以及
L7 （如 HTTP）的安全策略。

<!--
## Deploying Cilium for Production Use

For detailed instructions around deploying Cilium for production, see:
[Cilium Kubernetes Installation Guide](https://docs.cilium.io/en/stable/network/kubernetes/concepts/)
This documentation includes detailed requirements, instructions and example
production DaemonSet files.
 -->
## 部署 Cilium 用于生产用途   {#deployment-cilium-for-production-use}

关于部署 Cilium 用于生产的详细说明，请参见
[Cilium Kubernetes 安装指南](https://docs.cilium.io/en/stable/network/kubernetes/concepts/)。
此文档包括详细的需求、说明和生产用途 DaemonSet 文件示例。

<!-- discussion -->

<!--
##  Understanding Cilium components

Deploying a cluster with Cilium adds Pods to the `kube-system` namespace. To see
this list of Pods run:
-->
## 了解 Cilium 组件   {#understanding-cilium-components}

部署使用 Cilium 的集群会添加 Pod 到 `kube-system` 命名空间。要查看 Pod 列表，运行：

```shell
kubectl get pods --namespace=kube-system -l k8s-app=cilium
```

<!--
You'll see a list of Pods similar to this:
-->
你将看到像这样的 Pod 列表：

```console
NAME           READY   STATUS    RESTARTS   AGE
cilium-kkdhz   1/1     Running   0          3m23s
...
```

<!--
A `cilium` Pod runs on each node in your cluster and enforces network policy
on the traffic to/from Pods on that node using Linux BPF.
-->
你的集群中的每个节点上都会运行一个 `cilium` Pod，通过使用 Linux BPF
针对该节点上的 Pod 的入站、出站流量实施网络策略控制。

## {{% heading "whatsnext" %}}

<!--
Once your cluster is running, you can follow the
[Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
to try out Kubernetes NetworkPolicy with Cilium.
Have fun, and if you have questions, contact us using the
[Cilium Slack Channel](https://cilium.herokuapp.com/).
-->
集群运行后，
你可以按照[声明网络策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)试用基于
Cilium 的 Kubernetes NetworkPolicy。玩得开心，如果你有任何疑问，请到
[Cilium Slack 频道](https://cilium.herokuapp.com/)联系我们。

