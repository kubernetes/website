---
title: 使用 Cilium 提供 NetworkPolicy
content_type: task
weight: 20
---

<!-- overview -->
<!--
This page shows how to use Cilium for NetworkPolicy.

For background on Cilium, read the [Introduction to Cilium](https://cilium.readthedocs.io/en/latest/intro).
-->
本页展示如何使用 Cilium 提供 NetworkPolicy。

关于 Cilium 的背景知识，请阅读 [Cilium 介绍](https://cilium.readthedocs.io/en/latest/intro)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Deploying Cilium on Minikube for Basic Testing

To get familiar with Cilium easily you can follow the
[Cilium Kubernetes Getting Started Guide](https://docs.cilium.io/en/latest/gettingstarted/minikube/)
to perform a basic DaemonSet installation of Cilium in minikube.

To start minikube, minimal version required is >= v1.3.1, run the with the
following arguments:
-->
## 在 Minikube 上部署 Cilium 用于基本测试

为了轻松熟悉 Cilium 你可以根据
[Cilium Kubernetes 入门指南](https://docs.cilium.io/en/latest/gettingstarted/minikube/)
在 minikube 中执行一个 cilium 的基本 DaemonSet 安装。

要启动 minikube，需要的最低版本为 1.3.1，使用下面的参数运行：

```shell
minikube version
```
```
minikube version: v1.3.1
```

```shell
minikube start --network-plugin=cni --memory=4096
```

<!--
Mount the BPF filesystem:
-->
挂载 BPF 文件系统：

```shell
minikube ssh -- sudo mount bpffs -t bpf /sys/fs/bpf
```

<!--
For minikube you can deploy this simple ''all-in-one'' YAML file that includes
DaemonSet configurations for Cilium as well as appropriate RBAC settings:
-->
在 minikube 环境中，你可以部署下面的"一体化" YAML 文件，其中包含 Cilium
的 DaemonSet 配置以及适当的 RBAC 配置：


```shell
kubectl create -f https://raw.githubusercontent.com/cilium/cilium/master/examples/kubernetes/cilium.yaml
```

```
configmap/cilium-config created
serviceaccount/cilium created
serviceaccount/cilium-operator created
clusterrole.rbac.authorization.k8s.io/cilium created
clusterrole.rbac.authorization.k8s.io/cilium-operator created
clusterrolebinding.rbac.authorization.k8s.io/cilium created
clusterrolebinding.rbac.authorization.k8s.io/cilium-operator created
daemonset.apps/cilium create
deployment.apps/cilium-operator created
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
[Cilium Kubernetes Installation Guide](https://cilium.readthedocs.io/en/latest/gettingstarted/#installation)
This documentation includes detailed requirements, instructions and example
production DaemonSet files.
 -->
## 部署 Cilium 用于生产用途

关于部署 Cilium 用于生产的详细说明，请见
[Cilium Kubernetes 安装指南](https://cilium.readthedocs.io/en/latest/gettingstarted/#installation)，
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
kubectl get pods --namespace=kube-system
```

<!-- You'll see a list of Pods similar to this: -->
你将看到像这样的 Pods 列表：

```console
NAME            READY   STATUS    RESTARTS   AGE
cilium-6rxbd    1/1     Running   0          1m
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

