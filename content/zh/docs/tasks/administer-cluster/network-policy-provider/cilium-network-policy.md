---
reviewers:
- danwent
title: 使用 Cilium 作为 NetworkPolicy
content_template: templates/task
weight: 20
---

{{% capture overview %}}
<!-- This page shows how to use Cilium for NetworkPolicy.

For background on Cilium, read the [Introduction to Cilium](https://cilium.readthedocs.io/en/latest/intro). -->

本页展示了如何使用 Cilium 作为 NetworkPolicy。

关于 Cilium 的背景知识，请阅读 [Cilium 介绍](https://cilium.readthedocs.io/en/latest/intro)。

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}
<!-- 
## Deploying Cilium on Minikube for Basic Testing

To get familiar with Cilium easily you can follow the
[Cilium Kubernetes Getting Started Guide](https://docs.cilium.io/en/latest/gettingstarted/minikube/)
to perform a basic DaemonSet installation of Cilium in minikube.

Installation in a minikube setup uses a simple ''all-in-one'' YAML
file that includes DaemonSet configurations for Cilium, to connect
to the minikube's etcd instance as well as appropriate RBAC settings:
 -->

## 在 Minikube 上部署 Cilium 用于基本测试

为了轻松熟悉 Cilium 您可以根据[Cilium Kubernetes 入门指南](https://docs.cilium.io/en/latest/gettingstarted/minikube/)在 minikube 中执行一个 cilium 的基本的 DaemonSet 安装。

在 minikube 中的安装配置使用一个简单的“一体化” YAML 文件，包括了 Cilium 的 DaemonSet 配置，连接 minikube 的 etcd 实例，以及适当的 RBAC 设置。

```shell
$ kubectl create -f https://raw.githubusercontent.com/cilium/cilium/master/examples/kubernetes/cilium.yaml
configmap "cilium-config" created
secret "cilium-etcd-secrets" created
serviceaccount "cilium" created
clusterrolebinding "cilium" created
daemonset "cilium" created
clusterrole "cilium" created
```
<!-- 
The remainder of the Getting Started Guide explains how to enforce both L3/L4
(i.e., IP address + port) security policies, as well as L7 (e.g., HTTP) security
policies using an example application.
 -->
入门指南其余的部分用一个示例应用说明了如何强制执行L3/L4（即 IP 地址+端口）的安全策略以及L7 （如 HTTP）的安全策略。

<!-- 
## Deploying Cilium for Production Use

For detailed instructions around deploying Cilium for production, see:
[Cilium Kubernetes Installation Guide](https://cilium.readthedocs.io/en/latest/kubernetes/install/)
This documentation includes detailed requirements, instructions and example
production DaemonSet files.
 -->

## 部署 Cilium 用于生产用途
关于部署 Cilium 用于生产的详细说明，请见[Cilium Kubernetes 安装指南](https://cilium.readthedocs.io/en/latest/kubernetes/install/)
，此文档包括详细的需求、说明和生产用途 DaemonSet 文件示例。

{{% /capture %}}

{{% capture discussion %}}
<!-- 
##  Understanding Cilium components

Deploying a cluster with Cilium adds Pods to the `kube-system` namespace. To see
this list of Pods run:
 -->
##  了解 Cilium 组件

部署使用 Cilium 的集群会添加 Pods 到`kube-system`命名空间。 要查看此Pod列表，运行：

```shell
kubectl get pods --namespace=kube-system
```

<!-- You'll see a list of Pods similar to this: -->
您将看到像这样的 Pods 列表：

```console
NAME            DESIRED   CURRENT   READY     NODE-SELECTOR   AGE
cilium          1         1         1         <none>          2m
...
```
<!-- 
There are two main components to be aware of:

- One `cilium` Pod runs on each node in your cluster and enforces network policy
on the traffic to/from Pods on that node using Linux BPF.
- For production deployments, Cilium should leverage the key-value store cluster
(e.g., etcd) used by Kubernetes, which typically runs on the Kubernetes master nodes.
The [Cilium Kubernetes Installation Guide](https://cilium.readthedocs.io/en/latest/kubernetes/install/)
includes an example DaemonSet which can be customized to point to this key-value
store cluster. The simple ''all-in-one'' DaemonSet for minikube requires no such
configuration because it automatically connects to the minikube's etcd instance.
 -->
有两个主要组件需要注意：

- 在集群中的每个节点上都会运行一个 `cilium` Pod，并利用Linux BPF执行网络策略管理该节点上进出 Pod 的流量。
- 对于生产部署，Cilium 应该复用 Kubernetes 所使用的键值存储集群（如 etcd），其通常在Kubernetes 的 master 节点上运行。
[Cilium Kubernetes安装指南](https://cilium.readthedocs.io/en/latest/kubernetes/install/)
包括了一个示例 DaemonSet，可以自定义指定此键值存储集群。 
简单的 minikube 的“一体化” DaemonSet 不需要这样的配置，因为它会自动连接到 minikube 的 etcd 实例。

{{% /capture %}}

{{% capture whatsnext %}}
<!-- Once your cluster is running, you can follow the
[Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
to try out Kubernetes NetworkPolicy with Cilium.
Have fun, and if you have questions, contact us using the
[Cilium Slack Channel](https://cilium.herokuapp.com/). -->
群集运行后，您可以按照[声明网络策略](/docs/tasks/administer-cluster/declare-network-policy/)
用 Cilium 试用 Kubernetes NetworkPolicy。
玩得开心，如果您有任何疑问，请联系我们
[Cilium Slack Channel](https://cilium.herokuapp.com/)。

{{% /capture %}}

