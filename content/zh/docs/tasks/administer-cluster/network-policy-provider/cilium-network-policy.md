---
title: 使用 Cilium 提供 NetworkPolicy
content_type: task
weight: 20
---

<!--
reviewers:
- danwent
- aanm
title: Use Cilium for NetworkPolicy
content_type: task
weight: 20
-->

<!-- overview -->
<!--
This page shows how to use Cilium for NetworkPolicy.

For background on Cilium, read the [Introduction to Cilium](https://docs.cilium.io/en/stable/intro).
-->
本页展示如何使用 Cilium 提供 NetworkPolicy。

关于 Cilium 的背景知识，请阅读 [Cilium 介绍](https://docs.cilium.io/en/stable/intro)。

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
## 在 Minikube 上部署 Cilium 用于基本测试

为了轻松熟悉 Cilium 你可以根据
[Cilium Kubernetes 入门指南](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/s)
在 minikube 中执行一个 cilium 的基本 DaemonSet 安装。

要启动 minikube，需要的最低版本为 1.5.2，使用下面的参数运行：

```shell
minikube version
```
```
minikube version: v1.5.2
```

```shell
minikube start --network-plugin=cni --memory=4096
```

<!--
For minikube you can install Cilium using its CLI tool. Cilium will
automatically detect the cluster configuration and will install the appropriate
components for a successful installation:
-->
对于 minikube 你可以使用 Cilium 的 CLI 工具安装它。
Cilium 将自动检测集群配置并为成功的集群部署选择合适的组件。

```shell
curl -LO https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-amd64.tar.gz
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz
cilium install
```
```
🔮 Auto-detected Kubernetes kind: minikube
✨ Running "minikube" validation checks
✅ Detected minikube version "1.20.0"
ℹ️  Cilium version not set, using default version "v1.10.0"
🔮 Auto-detected cluster name: minikube
🔮 Auto-detected IPAM mode: cluster-pool
🔮 Auto-detected datapath mode: tunnel
🔑 Generating CA...
2021/05/27 02:54:44 [INFO] generate received request
2021/05/27 02:54:44 [INFO] received CSR
2021/05/27 02:54:44 [INFO] generating key: ecdsa-256
2021/05/27 02:54:44 [INFO] encoded CSR
2021/05/27 02:54:44 [INFO] signed certificate with serial number 48713764918856674401136471229482703021230538642
🔑 Generating certificates for Hubble...
2021/05/27 02:54:44 [INFO] generate received request
2021/05/27 02:54:44 [INFO] received CSR
2021/05/27 02:54:44 [INFO] generating key: ecdsa-256
2021/05/27 02:54:44 [INFO] encoded CSR
2021/05/27 02:54:44 [INFO] signed certificate with serial number 3514109734025784310086389188421560613333279574
🚀 Creating Service accounts...
🚀 Creating Cluster roles...
🚀 Creating ConfigMap...
🚀 Creating Agent DaemonSet...
🚀 Creating Operator Deployment...
⌛ Waiting for Cilium to be installed...
```

<!--
The remainder of the Getting Started Guide explains how to enforce both L3/L4
(i.e., IP address + port) security policies, as well as L7 (e.g., HTTP) security
policies using an example application.
-->
入门指南其余的部分用一个示例应用说明了如何强制执行 L3/L4（即 IP 地址+端口）的安全策略
以及L7 （如 HTTP）的安全策略。

<!--
## Deploying Cilium for Production Use

For detailed instructions around deploying Cilium for production, see:
[Cilium Kubernetes Installation Guide](https://docs.cilium.io/en/stable/concepts/kubernetes/intro/)
This documentation includes detailed requirements, instructions and example
production DaemonSet files.
 -->
## 部署 Cilium 用于生产用途

关于部署 Cilium 用于生产的详细说明，请见
[Cilium Kubernetes 安装指南](https://docs.cilium.io/en/stable/concepts/kubernetes/intro/)
此文档包括详细的需求、说明和生产用途 DaemonSet 文件示例。

<!-- discussion -->

<!--
##  Understanding Cilium components

Deploying a cluster with Cilium adds Pods to the `kube-system` namespace. To see
this list of Pods run:
 -->
##  了解 Cilium 组件

部署使用 Cilium 的集群会添加 Pods 到 `kube-system` 命名空间。要查看 Pod 列表，运行：

```shell
kubectl get pods --namespace=kube-system -l k8s-app=cilium
```

<!-- You'll see a list of Pods similar to this: -->
你将看到像这样的 Pods 列表：

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
集群运行后，你可以按照
[声明网络策略](/zh/docs/tasks/administer-cluster/declare-network-policy/)
试用基于 Cilium 的 Kubernetes NetworkPolicy。
玩得开心，如果你有任何疑问，请到 [Cilium Slack 频道](https://cilium.herokuapp.com/)
联系我们。

