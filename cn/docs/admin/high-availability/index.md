---
title: 构建高可用集群
---


## 简介


本文描述了如何构建一个高可用（high-availability, HA）的Kubernetes集群。这是一个非常高级的主题。

对于仅希望使用Kubernetes进行试验的用户，推荐使用更简单的配置工具进行搭建，例如：
[Minikube](/docs/getting-started-guides/minikube/)，或者尝试使用[Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) 来运行Kubernetes。

此外，当前在我们的端到端（e2e）测试环境中，没有对Kubernetes高可用的支持进行连续测试。我们将会增加这个连续测试项，但当前对单节点master的安装测试得更加严格。

* TOC
{:toc}

## 概览


搭建一个正真可靠，高度可用的分布式系统需要若干步骤。这类似于穿上内衣，裤子，皮带，背带，另一套内衣和另一套裤子。我们会详细介绍每一个步骤，但先在这里给出一个总结来帮助指导用户。


相关步骤如下：

   * [创建可靠的组成节点，共同形成我们的高可用主节点实现。](#可靠的节点)
   * [使用etcd集群，搭建一个冗余的，可靠的存储层。](#建立一个冗余的，可靠的存储层)
   * [启动具有备份和负载均衡能力的Kubernetes API 服务](#复制的API服务)
   * [搭建运行master选举的Kubernetes scheduler和controller-manager守护程序](#进行master选举的组件)
  
系统完成时看起来应该像这样：

![High availability Kubernetes diagram](/images/docs/ha.svg)


## 初始配置


本文假设你正在搭建一个3节点的主节点集群，每个节点上都运行者某种Linux系统。

指南中的示例使用Debian发行版，但它们应该可以被轻松移植到其他发行版上。

同样的，不管在公有云还是私有云亦或是裸机上，这个配置都应该可以运行。


从一个现成的单主节点集群开始是实现一个高可用Kubernetes集群的最简单的方法。这篇指导 [https://get.k8s.io](https://get.k8s.io) 描述了在多种平台上方便的安装一个单主节点集群的方法。

## 可靠的节点


我们在每个主节点上都将运行数个实现Kubernetes API的进程。使他们可靠的第一步是保证在发生故障时，每一个进程都可以自动重启。为了实现这个目标，我们需要安装一个进程监视器。我们选择了在每个工作者节点上都会运行的`kubelet`进程。这会带来便利性，因为我们使用了容器来分发我们的二进制文件，所以我们能够为每一个守护程序建立资源限制并省查它们的资源消耗。当然，我们也需要一些手段来监控kubelete本身（在此监测监控者本身是一个有趣的话题）。对于Debian系统我们选择了monit，但也有许多可替代的工具。例如在基于systemd的系统上（如RHEL, CentOS），你可以运行 'systemctl enable kubelet'。


如果你是从标准的Kubernetes安装扩展而来，那么`kubelet`二进制文件应该已经存在于你的系统中。你可以运行`which kubelet`来判断是否确实安装了这个二进制文件。如果没有安装的话，你应该手动安装 [kubelet binary](https://storage.googleapis.com/kubernetes-release/release/v0.19.3/bin/linux/amd64/kubelet), 
[kubelet init file](http://releases.k8s.io/{{page.githubbranch}}/cluster/saltbase/salt/kubelet/initd) 和 [default-kubelet](/docs/admin/high-availability/default-kubelet)脚本。

如果使用monit，你还需要安装monit守护程序（`apt-get install monit`）以及[monit-kubelet](/docs/admin/high-availability/monit-kubelet) 和
[monit-docker](/docs/admin/high-availability/monit-docker) 配置。

在使用systemd的系统上，你可以执行 `systemctl enable kubelet` 和 `systemctl enable docker`。


## 建立一个冗余的，可靠的存储层


高可用方案的中心基础是一个冗余的，可靠的存储层。高可用的头条规则是保护数据。不管发生了什么，不管什么着了火，只要还有数据，你就可以重建。如果丢掉了数据，你就完了。


集群化的etcd已经把你存储的数据复制到了你集群中的所有主节点实例上。这意味着如果要想丢失数据，三个节点的物理（或虚拟）硬盘需要全部同时故障。这种情况发生的概率是比较低的，所以对于许多人来说，运行一个复制的etcd集群可能已经足够的可靠了。你可以将集群数量从3个增大到5个来增加集群的可靠性。如果那样还不够，你可以添加[更多的可靠性到你的存储层](#更加可靠的存储)。


### 集群化etcd


集群化etcd的完整细节超出了本文范围，你可以在[etcd clustering page](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/clustering.md)找到许多详细内容。这个例子仅走查一个简单的集群建立过程，使用etcd内置的发现功能来构建我们的集群。


首先，调用etcd发现服务来创建一个新令牌:

```shell
curl https://discovery.etcd.io/new?size=3
```


在每个节点上，拷贝 [etcd.yaml](/docs/admin/high-availability/etcd.yaml) 文件到`/etc/kubernetes/manifests/etcd.yaml`。


每个节点上的kubelet会动态的监控这个文件夹的内容，并且会按照`etcd.yaml`里对pod的定义创建一个`etcd`服务的实例。


请注意，你应该使用上文中获取的令牌URL替换全部三个节点上`etcd.yaml`中的`${DISCOVERY_TOKEN}`项。同时还应该将每个节点上的 `${NODE_NAME}`替换为一个不同的名字（例如：`node-1`），并将 `${NODE_IP}`替换为正确的IP地址。


#### 验证你的集群


如果已经将这个文件拷贝到所有三个节点，你应该已经搭建起了一个集群化的etcd。你可以在主节点上进行验证：
```shell
kubectl exec < pod_name > etcdctl member list
```

和

```shell
kubectl exec < pod_name > etcdctl cluster-health
```


你也可以在一个节点上运行 `etcdctl set foo bar`，在另一个节点上运行`etcdctl get foo`来验证集群是否工作正常。


### 更加可靠的存储


当然，如果你对增加数据的可靠性感兴趣，这里还有一些更深入的选项可以使etcd把它的数据存放在比常规硬盘更可靠的地方（裤带和背带，ftw!）。


如果你使用云服务，那么你的提供商通常会为你提供这个特性，例如Google Cloud Platform上的 [Persistent Disk](https://cloud.google.com/compute/docs/disks/persistent-disks) 。它们是可以挂载到你的虚拟机中的块设备持久化存储。其他的云服务提供商提供了类似的解决方案。


如果运行于物理机之上，你仍然可以使用iSCSI或者NFS接口通过网络来连接冗余存储。
此外，你还可以运行一个集群文件系统，比如Gluster或者Ceph。最后，你还可以在你的每个物理机器上运行RAID矩阵。


不管你选择如何实现，如果已经选择了使用其中的一个选项，那么你应该保证你的存储被挂载到了每一台机器上。如果你的存储在集群中的三个主节点之间共享，那么你应该在存储上为每一个节点创建一个不同的文件夹。对于所有的这些指导，我们都假设这个存储被挂载到你机器上的`/var/etcd/data`路径。


## 复制的API服务


在正确搭建复制的etcd之后，我们还需要使用kubelet安装apiserver。




首先，你需要创建初始的日志文件，这样Docker才会挂载一个文件而不是一个文件夹：
```shell
touch /var/log/kube-apiserver.log
```

接下来，你需要在每个节点上创建一个`/srv/kubernetes/`文件夹。这个文件夹包含：

   * basic_auth.csv  - 基本认证的用户名和密码
   * ca.crt - CA证书
   * known_tokens.csv - 实体（例如kubelet）用来和apiserver通信的令牌
   * kubecfg.crt - 客户端证书，公钥
   * kubecfg.key - 客户端证书，私钥
   * server.cert - 服务端证书，公钥
   * server.key - 服务端证书，私钥


创建这个文件夹最简单的方法可以是从一个工作正常的集群的主节点拷贝，或者你也可以手动生成它们。


### 启动API服务


一旦这些文件已经存在了，拷贝 [kube-apiserver.yaml](/docs/admin/high-availability/kube-apiserver.yaml) 到每个主节点的 `/etc/kubernetes/manifests/`文件夹。


kubelet会监控这个文件夹，并且会按照文件里对pod的定义创建一个`kube-apiserver`容器。


### 负载均衡


现在，你应该有3个全部正常工作的apiserver了。如果搭建了网络负载均衡器，你应该能够通过那个负载均衡器访问你的集群，并且看到负载在apiserver实例间分发。设置负载均衡器依赖于你的平台的实际情况，例如对于Google Cloud Platform的指导可以在[这里](https://cloud.google.com/compute/docs/load-balancing/)找到。


请注意，如果使用了身份认证，你可能需要重新生成你的证书，除每个节点的IP地址外额外包含负载均衡器的IP地址。


对于部署在集群中的pods， `kubernetes`服务/dns名称应该自动的为主节点提供了负载均衡的endpoint。


对于使用API的外部用户（如命令行运行的`kubectl`，持续集成管道或其他客户端）你会希望将他们配置成为访问外部负载均衡器的地址。


## 进行Master选举的组件


到目前为止，我们已经搭建了状态存储，也搭建好了API服务，但我们还没有运行任何真正改变集群状态的服务，比如controller manager和scheduler。为了可靠的实现这个目标，我们希望在同一时间只有一个参与者在修改集群状态。但是我们希望复制这些参与者的实例以防某个机器宕机。要做到这一点，我们打算在API中使用一个lease-lock来执行master选举。我们会对每一个scheduler和controller-manager使用`--leader-elect`标志，从而在API中使用一个租约来保证同一时间只有一个scheduler和controller-manager的实例正在运行。


scheduler和controller-manager可以配置为只和位于它们相同节点（即127.0.0.1）上的API服务通信，也可以配置为使用API服务的负载均衡器的IP地址。不管它们如何配置，当使用`--leader-elect` 时scheduler和controller-manager都将完成上文提到的leader选举过程。


为了防止访问API服务失败，选举出的leader不能通过更新租约来选举一个新的leader。当scheduler和controller-manager通过127.0.0.1访问API服务，而相同节点上的API服务不可用时，这一点相当重要。


### 安装配置文件


首先，在每个节点上创建空白日志文件，这样Docker就会挂载这些文件而不是创建一个新文件夹：

```shell
touch /var/log/kube-scheduler.log
touch /var/log/kube-controller-manager.log
```


接下来，在每个节点上配置scheduler和controller manager pods的描述文件。拷贝 [kube-scheduler.yaml](/docs/admin/high-availability/kube-scheduler.yaml) 和 [kube-controller-manager.yaml](/docs/admin/high-availability/kube-controller-manager.yaml) 到`/etc/kubernetes/manifests/` 文件夹。


## 结尾


此时，你已经完成了master组件的配置（耶！），但你还需要添加工作者节点（噗！）。


如果你有一个现成的集群，你只需要在每个节点上简单的重新配置你的kubeletes连接到负载均衡的endpoint并重启它们。


如果你搭建的是一个全新的集群，你将需要在每个工作节点上安装kubelet和kube-proxy，并设置 `--apiserver`指向复制的endpoint。