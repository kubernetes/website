---
layout: blog
title: '使用 Microk8s 在 Linux 上本地运行 Kubernetes'
date: 2019-11-26
slug: running-kubernetes-locally-on-linux-with-microk8s
---
<!--
title: 'Running Kubernetes locally on Linux with Microk8s'                                                           
date: 2019-11-26
-->

<!--
**Authors**: [Ihor Dvoretskyi](https://twitter.com/idvoretskyi), Developer Advocate, Cloud Native Computing Foundation; [Carmine Rimi](https://twitter.com/carminerimi)
-->
**作者**: [Ihor Dvoretskyi](https://twitter.com/idvoretskyi)，开发支持者，云原生计算基金会；[Carmine Rimi](https://twitter.com/carminerimi)
<!--
This article, the second in a [series](/blog/2019/03/28/running-kubernetes-locally-on-linux-with-minikube-now-with-kubernetes-1.14-support/) about local deployment options on Linux, and covers [MicroK8s](https://microk8s.io/). Microk8s is the click-and-run solution for deploying a Kubernetes cluster locally, originally developed by Canonical, the publisher of Ubuntu.
-->
本文是关于 Linux 上的本地部署选项[系列](https://twitter.com/idvoretskyi)的第二篇，涵盖了 [MicroK8s](https://microk8s.io/)。Microk8s 是本地部署 Kubernetes 集群的 'click-and-run' 方案，最初由 Ubuntu 的发布者 Canonical 开发。
<!--
While Minikube usually spins up a local virtual machine (VM) for the Kubernetes cluster, MicroK8s doesn’t require a VM. It uses [snap](https://snapcraft.io/) packages, an application packaging and isolation technology.
-->
虽然 Minikube 通常为 Kubernetes 集群创建一个本地虚拟机（VM），但是 MicroK8s 不需要 VM。它使用[snap](https://snapcraft.io/) 包，这是一种应用程序打包和隔离技术。
<!--
This difference has its pros and cons. Here we’ll discuss a few of the interesting differences, and comparing the benefits of a VM based approach with the benefits of a non-VM approach. One of the first factors is cross-platform portability. While a Minikube VM is portable across operating systems - it supports not only Linux, but Windows, macOS, and even FreeBSD - Microk8s requires Linux, and only on those distributions [that support snaps](https://snapcraft.io/docs/installing-snapd). Most popular Linux distributions are supported. 
-->
这种差异有其优点和缺点。在这里，我们将讨论一些有趣的区别，并且基于 VM 的方法和非 VM 方法的好处。第一个因素是跨平台的移植性。虽然 Minikube VM 可以跨操作系统移植——它不仅支持 Linux，还支持 Windows、macOS、甚至 FreeBSD，但 Microk8s 需要 Linux，而且只在[那些支持 snaps](https://snapcraft.io/docs/installing-snapd) 的发行版上。支持大多数流行的 Linux 发行版。
<!--
Another factor to consider is resource consumption. While a VM appliance gives you greater portability, it does mean you’ll consume more resources to run the VM, primarily because the VM ships a complete operating system, and runs on top of a hypervisor. You’ll consume more disk space when the VM is dormant. You’ll consume more RAM and CPU while it is running. Since Microk8s doesn’t require spinning up a virtual machine you’ll have more resources to run your workloads and other applications. Given its smaller footprint, MicroK8s is ideal for IoT devices - you can even use it on a Raspberry Pi device!
-->
另一个考虑到的因素是资源消耗。虽然 VM 设备为您提供了更好的可移植性，但它确实意味着您将消耗更多资源来运行 VM，这主要是因为 VM 提供了一个完整的操作系统，并且运行在管理程序之上。当 VM 处于休眠时你将消耗更多的磁盘空间。当它运行时，你将会消耗更多的 RAM 和 CPU。因为 Microk8s 不需要创建虚拟机，你将会有更多的资源去运行你的工作负载和其他设备。考虑到所占用的空间更小，MicroK8s 是物联网设备的理想选择-你甚至可以在 Paspberry Pi 和设备上使用它！
<!--
Finally, the projects appear to follow a different release cadence and strategy. MicroK8s, and snaps in general provide [channels](https://snapcraft.io/docs/channels) that allow you to consume beta and release candidate versions of new releases of Kubernetes, as well as the previous stable release. Microk8s generally releases the stable release of upstream Kubernetes almost immediately.
-->
最后，项目似乎遵循了不同的发布节奏和策略。Microk8s 和 snaps 通常提供[渠道](https://snapcraft.io/docs/channels)允许你使用测试版和发布 KUbernetes 新版本的候选版本，同样也提供先前稳定版本。Microk8s 通常几乎立刻发布 Kubernetes 上游的稳定版本。
<!--
But wait, there’s more! Minikube and MicroK8s both started as single-node clusters. Essentially, they allow you to create a Kubernetes cluster with a single worker node. That is about to change - there’s an early alpha release of MicroK8s that includes clustering. With this capability, you can create Kubernetes clusters with as many worker nodes as you wish. This is effectively an un-opinionated option for creating a cluster - the developer must create the network connectivity between the nodes, as well as integrate with other infrastructure that may be required, like an external load-balancer. In summary, MicroK8s offers a quick and easy way to turn a handful of computers or VMs into a multi-node Kubernetes cluster. We’ll write more about this kind of architecture in a future article.
-->
但是等等，还有更多！Minikube 和 Microk8s 都是作为单节点集群启动的。本质上来说，它们允许你用单个工作节点创建 Kubernetes 集群。这种情况即将改变 - MicroK8s 早期的 alpha 版本包括集群。有了这个能力，你可以创建正如你希望多的工作节点的 KUbernetes 集群。对于创建集群来说，这是一个没有主见的选项 - 开发者在节点之间创建网络连接和集成了其他所需要的基础设施，比如一个外部的负载均衡。总的来说，MicroK8s 提供了一种快速简易的方法，使得少量的计算机和虚拟机变成一个多节点的 Kubernetes 集群。以后我们将撰写更多这种体系结构的文章。
<!--
## Disclaimer

This is not an official guide to MicroK8s. You may find detailed information on running and using MicroK8s on it's official [webpage](https://microk8s.io/docs/), where different use cases, operating systems, environments, etc. are covered. Instead, the purpose of this post is to provide clear and easy guidelines for running MicroK8s on Linux.
-->
## 免责声明 

这不是 MicroK8s 官方介绍文档。你可以在它的官方[网页](https://microk8s.io/docs/)查询运行和使用 MicroK8s 的详情信息，其中覆盖了不同的用例，操作系统，环境等。相反，这篇文章的意图是提供在 Linux 上运行 MicroK8s 清晰易懂的指南。
<!--
## Prerequisites

A Linux distribution that [supports snaps](https://snapcraft.io/docs/installing-snapd), is required. In this guide, we’ll use Ubuntu 18.04 LTS, it supports snaps out-of-the-box.
If you are interested in running Microk8s on Windows or Mac, you should check out [Multipass](https://multipass.run) to stand up a quick Ubuntu VM as the official way to run virtual Ubuntu on your system.
-->
## 前提条件 

一个[支持 snaps](https://snapcraft.io/docs/installing-snapd) 的 Linux 发行版是被需要的。这篇指南，我们将会用支持 snaps 且即开即用的 Ubuntu 18.04 LTS。如果你对运行在 Windows 或者 Mac 上的 MicroK8s 感兴趣，你应该检查[多通道](https://multipass.run)，安装一个快速的 Ubuntu VM，作为在你的系统上运行虚拟机 Ubuntu 的官方方式。
<!--
## MicroK8s installation

MicroK8s installation is straightforward:
-->
## MicroK8s 安装

简洁的 MicroK8s 安装：
```shell
sudo snap install microk8s --classic
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/001-install.png">}}</center>
<!--
The command above installs a local single-node Kubernetes cluster in seconds. Once the command execution is finished, your Kubernetes cluster is up and running.

You may verify the MicroK8s status with the following command:
-->
以上的命令将会在几秒内安装一个本地单节点的 Kubernetes 集群。一旦命令执行结束，你的 Kubernetes 集群将会启动并运行。
```shell
sudo microk8s.status
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/002-status.png">}}</center>

<!--
## Using microk8s

Using MicroK8s is as straightforward as installing it. MicroK8s itself includes a `kubectl` binary, which can be accessed by running the `microk8s.kubectl` command. As an example: 
-->
## 使用 microk8s
使用 MicrosK8s 就像和安装它一样便捷。MicroK8s 本身包括一个 `kubectl` 库，该库可以通过执行 `microk8s.kubectl` 命令去访问。例如：
```shell
microk8s.kubectl get nodes
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/003-nodes.png">}}</center>

<!--
While using the prefix `microk8s.kubectl` allows for a parallel install of another system-wide kubectl without impact, you can easily get rid of it by using the `snap alias` command:
-->
当使用前缀 `microk8s.kubectl` 时，允许在没有影响的情况下并行地安装另一个系统级的 kubectl，你可以便捷地使用 `snap alias` 命令摆脱它：
```shell
sudo snap alias microk8s.kubectl kubectl
```
<!--
This will allow you to simply use `kubectl` after. You can revert this change using the `snap unalias` command.
-->
<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/004-alias.png">}}</center>

这将允许你以后便捷地使用 `kubectl`，你可以用 `snap unalias`命令恢复这个改变。
```shell
kubectl get nodes
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/005-nodes.png">}}</center>

<!--
## MicroK8s addons

One of the biggest benefits of using Microk8s is the fact that it also supports various add-ons and extensions. What is even more important is they are shipped out of the box, the user just has to enable them.

The full list of extensions can be checked by running the `microk8s.status` command:
-->
## MicroK8s 插件
使用 MicroK8s 其中最大的好处之一事实上是也支持各种各样的插件和扩展。更重要的是它们是开箱即用的，用户仅仅需要启动它们。通过运行 `microk8s.status` 命令检查出扩展的完整列表。
```
sudo microk8s.status
```
<!--
As of the time of writing this article, the following add-ons are supported:
-->
截至到写这篇文章为止，MicroK8s 已支持以下插件：

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/006-status.png">}}</center>

<!--
More add-ons are being created and contributed by the community all the time, it definitely helps to check often!
-->
社区创建和贡献了越来越多的插件，经常检查他们是十分有帮助的。
<!--
## Release channels
-->
## 发布渠道
```shell
sudo snap info microk8s
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/010-releases.png">}}</center>

<!--
## Installing the sample application

In this tutorial we’ll use NGINX as a sample application ([the official Docker Hub image](https://hub.docker.com/_/nginx)).

It will be installed as a Kubernetes deployment:
-->
## 安装简单的应用 

在这篇指南中我将会用 NGINX 作为一个示例应用程序（[官方 Docker Hub 镜像](https://hub.docker.com/_/nginx)）。

```shell
kubectl create deployment nginx --image=nginx
```
<!--
To verify the installation, let’s run the following:
-->
为了检查安装，让我们运行以下命令：
```shell
kubectl get deployments
```

```shell
kubectl get pods
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/007-deployments.png">}}</center>

<!--
Also, we can retrieve the full output of all available objects within our Kubernetes cluster:
-->
我们也可以检索出 Kubernetes 集群中所有可用对象的完整输出。
```shell
kubectl get all --all-namespaces
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/008-all.png">}}</center>

<!--
## Uninstalling MicroK8s

Uninstalling your microk8s cluster is so easy as uninstalling the snap:
-->
## 卸载 MircroK8s

卸载您的 microk8s 集群与卸载 Snap 同样便捷。
```shell
sudo snap remove microk8s
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/009-remove.png">}}</center>

<!--
## Screencast
-->
## 截屏视频
[![asciicast](https://asciinema.org/a/263394.svg)](https://asciinema.org/a/263394)


