---
title: '使用 Microk8s 在 Linux 上本地執行 Kubernetes'

date: 2019-11-26
---
<!--
---                                           
title: 'Running Kubernetes locally on Linux with Microk8s'                                                           
date: 2019-11-26
---
-->
<!--
**Authors**: [Ihor Dvoretskyi](https://twitter.com/idvoretskyi), Developer Advocate, Cloud Native Computing Foundation; [Carmine Rimi](https://twitter.com/carminerimi)
-->
**作者**: [Ihor Dvoretskyi](https://twitter.com/idvoretskyi)，開發支持者，雲原生計算基金會；[Carmine Rimi](https://twitter.com/carminerimi)
<!--
This article, the second in a [series](/blog/2019/03/28/running-kubernetes-locally-on-linux-with-minikube-now-with-kubernetes-1.14-support/) about local deployment options on Linux, and covers [MicroK8s](https://microk8s.io/). Microk8s is the click-and-run solution for deploying a Kubernetes cluster locally, originally developed by Canonical, the publisher of Ubuntu.
-->
本文是關於 Linux 上的本地部署選項[系列](https://twitter.com/idvoretskyi)的第二篇，涵蓋了 [MicroK8s](https://microk8s.io/)。Microk8s 是本地部署 Kubernetes 叢集的 'click-and-run' 方案，最初由 Ubuntu 的釋出者 Canonical 開發。
<!--
While Minikube usually spins up a local virtual machine (VM) for the Kubernetes cluster, MicroK8s doesn’t require a VM. It uses [snap](https://snapcraft.io/) packages, an application packaging and isolation technology.
-->
雖然 Minikube 通常為 Kubernetes 叢集建立一個本地虛擬機器（VM），但是 MicroK8s 不需要 VM。它使用[snap](https://snapcraft.io/) 包，這是一種應用程式打包和隔離技術。
<!--
This difference has its pros and cons. Here we’ll discuss a few of the interesting differences, and comparing the benefits of a VM based approach with the benefits of a non-VM approach. One of the first factors is cross-platform portability. While a Minikube VM is portable across operating systems - it supports not only Linux, but Windows, macOS, and even FreeBSD - Microk8s requires Linux, and only on those distributions [that support snaps](https://snapcraft.io/docs/installing-snapd). Most popular Linux distributions are supported. 
-->
這種差異有其優點和缺點。在這裡，我們將討論一些有趣的區別，並且基於 VM 的方法和非 VM 方法的好處。第一個因素是跨平臺的移植性。雖然 Minikube VM 可以跨作業系統移植——它不僅支援 Linux，還支援 Windows、macOS、甚至 FreeBSD，但 Microk8s 需要 Linux，而且只在[那些支援 snaps](https://snapcraft.io/docs/installing-snapd) 的發行版上。支援大多數流行的 Linux 發行版。
<!--
Another factor to consider is resource consumption. While a VM appliance gives you greater portability, it does mean you’ll consume more resources to run the VM, primarily because the VM ships a complete operating system, and runs on top of a hypervisor. You’ll consume more disk space when the VM is dormant. You’ll consume more RAM and CPU while it is running. Since Microk8s doesn’t require spinning up a virtual machine you’ll have more resources to run your workloads and other applications. Given its smaller footprint, MicroK8s is ideal for IoT devices - you can even use it on a Raspberry Pi device!
-->
另一個考慮到的因素是資源消耗。雖然 VM 裝置為您提供了更好的可移植性，但它確實意味著您將消耗更多資源來執行 VM，這主要是因為 VM 提供了一個完整的作業系統，並且執行在管理程式之上。當 VM 處於休眠時你將消耗更多的磁碟空間。當它執行時，你將會消耗更多的 RAM 和 CPU。因為 Microk8s 不需要建立虛擬機器，你將會有更多的資源去執行你的工作負載和其他裝置。考慮到所佔用的空間更小，MicroK8s 是物聯網裝置的理想選擇-你甚至可以在 Paspberry Pi 和裝置上使用它！
<!--
Finally, the projects appear to follow a different release cadence and strategy. MicroK8s, and snaps in general provide [channels](https://snapcraft.io/docs/channels) that allow you to consume beta and release candidate versions of new releases of Kubernetes, as well as the previous stable release. Microk8s generally releases the stable release of upstream Kubernetes almost immediately.
-->
最後，專案似乎遵循了不同的釋出節奏和策略。Microk8s 和 snaps 通常提供[渠道](https://snapcraft.io/docs/channels)允許你使用測試版和釋出 KUbernetes 新版本的候選版本，同樣也提供先前穩定版本。Microk8s 通常幾乎立刻釋出 Kubernetes 上游的穩定版本。
<!--
But wait, there’s more! Minikube and MicroK8s both started as single-node clusters. Essentially, they allow you to create a Kubernetes cluster with a single worker node. That is about to change - there’s an early alpha release of MicroK8s that includes clustering. With this capability, you can create Kubernetes clusters with as many worker nodes as you wish. This is effectively an un-opinionated option for creating a cluster - the developer must create the network connectivity between the nodes, as well as integrate with other infrastructure that may be required, like an external load-balancer. In summary, MicroK8s offers a quick and easy way to turn a handful of computers or VMs into a multi-node Kubernetes cluster. We’ll write more about this kind of architecture in a future article.
-->
但是等等，還有更多！Minikube 和 Microk8s 都是作為單節點叢集啟動的。本質上來說，它們允許你用單個工作節點建立 Kubernetes 叢集。這種情況即將改變 - MicroK8s 早期的 alpha 版本包括叢集。有了這個能力，你可以建立正如你希望多的工作節點的 KUbernetes 叢集。對於建立叢集來說，這是一個沒有主見的選項 - 開發者在節點之間建立網路連線和集成了其他所需要的基礎設施，比如一個外部的負載均衡。總的來說，MicroK8s 提供了一種快速簡易的方法，使得少量的計算機和虛擬機器變成一個多節點的 Kubernetes 叢集。以後我們將撰寫更多這種體系結構的文章。
<!--
## Disclaimer

This is not an official guide to MicroK8s. You may find detailed information on running and using MicroK8s on it's official [webpage](https://microk8s.io/docs/), where different use cases, operating systems, environments, etc. are covered. Instead, the purpose of this post is to provide clear and easy guidelines for running MicroK8s on Linux.
-->
## 免責宣告 

這不是 MicroK8s 官方介紹文件。你可以在它的官方[網頁](https://microk8s.io/docs/)查詢執行和使用 MicroK8s 的詳情資訊，其中覆蓋了不同的用例，作業系統，環境等。相反，這篇文章的意圖是提供在 Linux 上執行 MicroK8s 清晰易懂的指南。
<!--
## Prerequisites

A Linux distribution that [supports snaps](https://snapcraft.io/docs/installing-snapd), is required. In this guide, we’ll use Ubuntu 18.04 LTS, it supports snaps out-of-the-box.
If you are interested in running Microk8s on Windows or Mac, you should check out [Multipass](https://multipass.run) to stand up a quick Ubuntu VM as the official way to run virtual Ubuntu on your system.
-->
## 前提條件 

一個[支援 snaps](https://snapcraft.io/docs/installing-snapd) 的 Linux 發行版是被需要的。這篇指南，我們將會用支援 snaps 且即開即用的 Ubuntu 18.04 LTS。如果你對執行在 Windows 或者 Mac 上的 MicroK8s 感興趣，你應該檢查[多通道](https://multipass.run)，安裝一個快速的 Ubuntu VM，作為在你的系統上執行虛擬機器 Ubuntu 的官方方式。
<!--
## MicroK8s installation

MicroK8s installation is straightforward:
-->
## MicroK8s 安裝

簡潔的 MicroK8s 安裝：
```shell
sudo snap install microk8s --classic
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/001-install.png">}}</center>
<!--
The command above installs a local single-node Kubernetes cluster in seconds. Once the command execution is finished, your Kubernetes cluster is up and running.

You may verify the MicroK8s status with the following command:
-->
以上的命令將會在幾秒內安裝一個本地單節點的 Kubernetes 叢集。一旦命令執行結束，你的 Kubernetes 叢集將會啟動並執行。
```shell
sudo microk8s.status
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/002-status.png">}}</center>

<!--
## Using microk8s

Using MicroK8s is as straightforward as installing it. MicroK8s itself includes a `kubectl` binary, which can be accessed by running the `microk8s.kubectl` command. As an example: 
-->
## 使用 microk8s
使用 MicrosK8s 就像和安裝它一樣便捷。MicroK8s 本身包括一個 `kubectl` 庫，該庫可以透過執行 `microk8s.kubectl` 命令去訪問。例如：
```shell
microk8s.kubectl get nodes
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/003-nodes.png">}}</center>

<!--
While using the prefix `microk8s.kubectl` allows for a parallel install of another system-wide kubectl without impact, you can easily get rid of it by using the `snap alias` command:
-->
當使用字首 `microk8s.kubectl` 時，允許在沒有影響的情況下並行地安裝另一個系統級的 kubectl，你可以便捷地使用 `snap alias` 命令擺脫它：
```shell
sudo snap alias microk8s.kubectl kubectl
```
<!--
This will allow you to simply use `kubectl` after. You can revert this change using the `snap unalias` command.
-->
<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/004-alias.png">}}</center>

這將允許你以後便捷地使用 `kubectl`，你可以用 `snap unalias`命令恢復這個改變。
```shell
kubectl get nodes
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/005-nodes.png">}}</center>

<!--
## MicroK8s addons

One of the biggest benefits of using Microk8s is the fact that it also supports various add-ons and extensions. What is even more important is they are shipped out of the box, the user just has to enable them.

The full list of extensions can be checked by running the `microk8s.status` command:
-->
## MicroK8s 外掛
使用 MicroK8s 其中最大的好處之一事實上是也支援各種各樣的外掛和擴充套件。更重要的是它們是開箱即用的，使用者僅僅需要啟動它們。透過執行 `microk8s.status` 命令檢查出擴充套件的完整列表。
```
sudo microk8s.status
```
<!--
As of the time of writing this article, the following add-ons are supported:
-->
截至到寫這篇文章為止，MicroK8s 已支援以下外掛：

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/006-status.png">}}</center>

<!--
More add-ons are being created and contributed by the community all the time, it definitely helps to check often!
-->
社群建立和貢獻了越來越多的外掛，經常檢查他們是十分有幫助的。
<!--
## Release channels
-->
## 釋出渠道
```shell
sudo snap info microk8s
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/010-releases.png">}}</center>

<!--
## Installing the sample application

In this tutorial we’ll use NGINX as a sample application ([the official Docker Hub image](https://hub.docker.com/_/nginx)).

It will be installed as a Kubernetes deployment:
-->
## 安裝簡單的應用 

在這篇指南中我將會用 NGINX 作為一個示例應用程式（[官方 Docker Hub 映象](https://hub.docker.com/_/nginx)）。

```shell
kubectl create deployment nginx --image=nginx
```
<!--
To verify the installation, let’s run the following:
-->
為了檢查安裝，讓我們執行以下命令：
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
我們也可以檢索出 Kubernetes 叢集中所有可用物件的完整輸出。
```shell
kubectl get all --all-namespaces
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/008-all.png">}}</center>

<!--
## Uninstalling MicroK8s

Uninstalling your microk8s cluster is so easy as uninstalling the snap:
-->
## 解除安裝 MircroK8s

解除安裝您的 microk8s 叢集與解除安裝 Snap 同樣便捷。
```shell
sudo snap remove microk8s
```

<center>{{<figure width="600" src="/images/blog/2019-11-05-kubernetes-with-microk8s/009-remove.png">}}</center>

<!--
## Screencast
-->
## 截圖影片
[![asciicast](https://asciinema.org/a/263394.svg)](https://asciinema.org/a/263394)


