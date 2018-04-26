---
cn-approvers:
- xiaosuiba
title: 构建高可用集群
---
<!--
title: Building High-Availability Clusters
-->

<!--
## Introduction

This document describes how to build a high-availability (HA) Kubernetes cluster.  This is a fairly advanced topic.
Users who merely want to experiment with Kubernetes are encouraged to use configurations that are simpler to set up such
as [Minikube](/docs/getting-started-guides/minikube/)
or try [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) for hosted Kubernetes.

Also, at this time high availability support for Kubernetes is not continuously tested in our end-to-end (e2e) testing.  We will
be working to add this continuous testing, but for now the single-node master installations are more heavily tested.
-->
## 简介

本文介绍了如何构建一个高可用（high-availability, HA）的 Kubernetes 集群。这是一个相当高级的话题。我们鼓励只想尝试性使用 Kubernetes 的用户使用更简单的配置，例如 [Minikube](/docs/getting-started-guides/minikube/)，或者尝试 [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) 提供的托管 Kubernetes 集群。

此外，目前我们并没有在端到端（e2e）测试中对 Kubernetes 的高可用性支持进行连续测试。我们正在努力添加这个持续测试项，但现在对单节点 master 安装方式测试得更加严格。

* TOC
{:toc}

<!--
## Overview

Setting up a truly reliable, highly available distributed system requires a number of steps. It is akin to
wearing underwear, pants, a belt, suspenders, another pair of underwear, and another pair of pants.  We go into each
of these steps in detail, but a summary is given here to help guide and orient the user.

The steps involved are as follows:

   * [Creating the reliable constituent nodes that collectively form our HA master implementation.](#reliable-nodes)
   * [Setting up a redundant, reliable storage layer with clustered etcd.](#establishing-a-redundant-reliable-data-storage-layer)
   * [Starting replicated, load balanced Kubernetes API servers](#replicated-api-servers)
   * [Setting up master-elected Kubernetes scheduler and controller-manager daemons](#master-elected-components)

Here's what the system should look like when it's finished:

![High availability Kubernetes diagram](/images/docs/ha.svg)
-->
## 概述

建立一个真正可靠的、高可用的分布式系统需要多个步骤。它类似于穿着内裤、裤子、腰带、吊带、另一条内裤和另一条裤子。我们将对每个步骤进行详细介绍，但是这里给出一个总结，用于帮助指导和引导用户。

涉及的步骤如下：

   * [创建可靠的组成节点，共同构成高可用 master 实现](#可靠的节点)
   * [建立一个冗余的、使用可靠存储层的 etcd 集群。](#建立一个冗余的，可靠的数据存储层)
   * [设置主选举（master-elected）的 Kubernetes scheduler 和 controller-manager 守护进程](#主选举组件)

这是系统完成时应该看起来的样子：

![高可用 Kubernetes 示意图](/images/docs/ha.svg)

<!--
## Initial set-up

The remainder of this guide assumes that you are setting up a 3-node clustered master, where each machine is running some flavor of Linux.
Examples in the guide are given for Debian distributions, but they should be easily adaptable to other distributions.
Likewise, this set up should work whether you are running in a public or private cloud provider, or if you are running
on bare metal.

The easiest way to implement an HA Kubernetes cluster is to start with an existing single-master cluster.  The
instructions at [https://get.k8s.io](https://get.k8s.io)
describe easy installation for single-master clusters on a variety of platforms.
-->
## 初始设置

本指南的其余部分假设您正在设置一个 3 节点的集群 master，其中的每台机器上都运行着某种 Linux。本指南中的例子针对 Debian 发行版，但他们应该很容易的用于其他发行版上。
同样的，无论是在公有/私有云服务提供商上，还是在裸机上运行集群，这些设置都应该可以工作。

实现高可用 Kubernetes 集群最简单的方法是从一个现有的单 master 集群开始。[https://get.k8s.io](https://get.k8s.io) 处的说明描述了在各种平台上安装单 master 集群的简单方法。

<!--
## Reliable nodes

On each master node, we are going to run a number of processes that implement the Kubernetes API.  The first step in making these reliable is
to make sure that each automatically restarts when it fails.  To achieve this, we need to install a process watcher.  We choose to use
the `kubelet` that we run on each of the worker nodes.  This is convenient, since we can use containers to distribute our binaries, we can
establish resource limits, and introspect the resource usage of each daemon.  Of course, we also need something to monitor the kubelet
itself (insert who watches the watcher jokes here).  For Debian systems, we choose monit, but there are a number of alternate
choices. For example, on systemd-based systems (e.g. RHEL, CentOS), you can run 'systemctl enable kubelet'.
-->
## 可靠的节点

在每个 master 节点上，我们都将运行一些实现 Kubernetes API 的进程。为了使这些进程可靠，第一步是保证在它们故障之后能够自动重启。为了实现这一点，我们需要安装一个进程监视器。我们选择使用每个工作节点上都会运行的 `kubelet`。这很方便，因为我们可以使用容器来分发我们的二进制文件、建立资源限额并审视每个守护进程的资源使用情况。当然，我们也需要一些机制来监控 kubelet 本身（在此插入一个"谁在监视监视者"的笑话）。对于 Debian 系统，我们选择 monit，但也存在一些替代的选择。例如，在基于 systemd 的系统（例如 RHEL，CentOS）上，您可以运行 'systemctl enable kubelet'。

<!--
If you are extending from a standard Kubernetes installation, the `kubelet` binary should already be present on your system.  You can run
`which kubelet` to determine if the binary is in fact installed.  If it is not installed,
you should install the [kubelet binary](https://storage.googleapis.com/kubernetes-release/release/v0.19.3/bin/linux/amd64/kubelet) and [default-kubelet](/docs/admin/high-availability/default-kubelet)
scripts.

If you are using monit, you should also install the monit daemon (`apt-get install monit`) and the [monit-kubelet](/docs/admin/high-availability/monit-kubelet) and
[monit-docker](/docs/admin/high-availability/monit-docker) configs.

On systemd systems you `systemctl enable kubelet` and `systemctl enable docker`.
-->
如果您是从标准 Kubernetes 安装扩展而来，那么 `kubelet` 二进制文件应该已经存在于您的系统之中。您可以运行 `which kubelet` 来确定此文件是否已经安装。如果没有，您应该安装 [kubelet 二进制文件](https://storage.googleapis.com/kubernetes-release/release/v0.19.3/bin/linux/amd64/kubelet) 和 [default-kubelet](/docs/admin/high-availability/default-kubelet) 脚本。

如果您正在使用 monit，您还应该安装 monit 守护进程（`apt-get install monit`）和 [monit-kubelet](/docs/admin/high-availability/monit-kubelet) 以及 [monit-docker](/docs/admin/high-availability/monit-docker) 配置。

在 systemd 系统中，您应该执行 `systemctl enable kubelet` 和 `systemctl enable docker`。

<!--
## Establishing a redundant, reliable data storage layer

The central foundation of a highly available solution is a redundant, reliable storage layer.  The number one rule of high-availability is
to protect the data.  Whatever else happens, whatever catches on fire, if you have the data, you can rebuild.  If you lose the data, you're
done.

Clustered etcd already replicates your storage to all master instances in your cluster.  This means that to lose data, all three nodes would need
to have their physical (or virtual) disks fail at the same time.  The probability that this occurs is relatively low, so for many people
running a replicated etcd cluster is likely reliable enough.  You can add additional reliability by increasing the
size of the cluster from three to five nodes.  If that is still insufficient, you can add
[even more redundancy to your storage layer](#even-more-reliable-storage).
-->
## 建立一个冗余的，可靠的数据存储层

高可用性解决方案的核心基础是冗余，可靠的存储层。高可用性的头号规则是保护数据。无论发生什么事情，如果你有数据，你还可以重建。如果失去了数据，你就完了。

集群化的 etcd 已将您的存储复制到了集群中的所有 master 实例上。这意味着要丢失数据，需要让全部三个节点的物理（或虚拟）磁盘同时失效。发生这种情况的可能性相对较低。所以对很多人来说，运行复制的 etcd 集群可能已经足够可靠了。如果仍然不够，您还可以添加 [更多的冗余存储层](#更可靠的存储)

<!--
### Clustering etcd

The full details of clustering etcd are beyond the scope of this document, lots of details are given on the
[etcd clustering page](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/clustering.md).  This example walks through
a simple cluster set up, using etcd's built in discovery to build our cluster.

First, hit the etcd discovery service to create a new token:
-->
### 集群化的 etcd

建立 etcd 集群的完整细节超出了本文的范围，[etcd 集群页面](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/clustering.md) 给出了大量的细节。本示例演练了一个简单集群的设置，使用 etcd 内置的发现机制来构建我们的集群。

首先，访问 etcd discovery 服务来创建一个新的令牌：

```shell
curl https://discovery.etcd.io/new?size=3
```

<!--
On each node, copy the [etcd.yaml](/docs/admin/high-availability/etcd.yaml) file into `/etc/kubernetes/manifests/etcd.yaml`

The kubelet on each node actively monitors the contents of that directory, and it will create an instance of the `etcd`
server from the definition of the pod specified in `etcd.yaml`.

Note that in `etcd.yaml` you should substitute the token URL you got above for `${DISCOVERY_TOKEN}` on all three machines,
and you should substitute a different name (e.g. `node-1`) for `${NODE_NAME}` and the correct IP address
for `${NODE_IP}` on each machine.
-->
在每个节点上，将 [etcd.yaml](/docs/admin/high-availability/etcd.yaml) 文件复制到 `/etc/kubernetes/manifests/etcd.yaml` 中

每个节点上的 kubelet 会主动监视该目录的内容，并会按照 `etcd.yaml` 中对 pod 的定义创建一个 `etcd` 服务实例。

请注意，您应该将所有机中上 `etcd.yaml` 中的 `${DISCOVERY_TOKEN}` 替换为上面获得的令牌 URL，并将 `${NODE_NAME}` 替换为一个不同的名称（例如 `node-1`），以及将 `${NODE_IP}` 替换为每个机器的正确 IP 地址。 

<!--
#### Validating your cluster

Once you copy this into all three nodes, you should have a clustered etcd set up.  You can validate on master with
-->
#### 验证您的集群

一旦将其复制到所有三个节点中，您应该建立起了一个集群化的 etcd。您可以在 master 上这样验证：

```shell
kubectl exec < pod_name > etcdctl member list
```

<!--
and
-->
以及：

```shell
kubectl exec < pod_name > etcdctl cluster-health
```

<!--
You can also validate that this is working with `etcdctl set foo bar` on one node, and `etcdctl get foo`
on a different node.
-->
您还可以通过在一个节点上运行 `etcdctl set foo bar` 并在另一个节点上运行 `etcdctl get foo` 来验证其是否工作正常。

<!--
### Even more reliable storage

Of course, if you are interested in increased data reliability, there are further options which make the place where etcd
installs its data even more reliable than regular disks (belts *and* suspenders, ftw!).

If you use a cloud provider, then they usually provide this
for you, for example [Persistent Disk](https://cloud.google.com/compute/docs/disks/persistent-disks) on the Google Cloud Platform.  These
are block-device persistent storage that can be mounted onto your virtual machine. Other cloud providers provide similar solutions.
-->
### 更可靠的存储

当然，如果您对提高数据可靠性感兴趣，还有其他选项可以让您找到比在普通磁盘上安装 etcd 数据更可靠的位置（皮带*和*吊带，ftw！）。

如果您使用云服务提供商，那么他们通常会提供此服务，例如 Google Cloud Platform 上的 [Persistent Disk](https://cloud.google.com/compute/docs/disks/persistent-disks)。这是一种可以挂载到虚拟机上的块设备持久性存储。其他云服务提供商也提供了类似的解决方案。

<!--
If you are running on physical machines, you can also use network attached redundant storage using an iSCSI or NFS interface.
Alternatively, you can run a clustered file system like Gluster or Ceph.  Finally, you can also run a RAID array on each physical machine.

Regardless of how you choose to implement it, if you chose to use one of these options, you should make sure that your storage is mounted
to each machine.  If your storage is shared between the three masters in your cluster, you should create a different directory on the storage
for each node.  Throughout these instructions, we assume that this storage is mounted to your machine in `/var/etcd/data`.
-->
如果您在物理机器上运行，则可以使用通过网络连接的 iSCSI 或 NFS 接口的冗余存储。或者，您可以运行 Gluster 或 Ceph 等集群文件系统。最后，您还可以在每台物理机器上运行 RAID 阵列。

无论您选择如何实现，如果您选择使用这些选项之一，则应确保您的存储已挂载到每台机器上。如果您的存储在集群中的三个 master 之间共享，则应该在存储上为每个节点创建一个不同的目录。在所有的介绍中，我们都将假设这个存储被挂载到您机器中的 `/var/etcd/data` 目录。

<!--
## Replicated API Servers

Once you have replicated etcd set up correctly, we will also install the apiserver using the kubelet.

### Installing configuration files

First you need to create the initial log file, so that Docker mounts a file instead of a directory:
-->
## 复制的 API Server

一旦正确的设置好了复制的 etcd 集群，我们将使用 kubelet 安装 apiserver。

### 安装配置文件

首先，您需要创建初始日志文件，以便 Docker 挂载一个文件而不是目录：

```shell
touch /var/log/kube-apiserver.log
```

<!--
Next, you need to create a `/srv/kubernetes/` directory on each node.  This directory includes:

   * basic_auth.csv  - basic auth user and password
   * ca.crt - Certificate Authority cert
   * known_tokens.csv - tokens that entities (e.g. the kubelet) can use to talk to the apiserver
   * kubecfg.crt - Client certificate, public key
   * kubecfg.key - Client certificate, private key
   * server.cert - Server certificate, public key
   * server.key - Server certificate, private key

The easiest way to create this directory, may be to copy it from the master node of a working cluster, or you can manually generate these files yourself.
-->
接下来，您在每个节点上创建一个 `/srv/kubernetes/` 目录。这个目录包含：

   * basic_auth.csv  - basic auth 用户名和密码
   * ca.crt - 证书颁发机构证书（Certificate Authority cert）
   * known_tokens.csv - 实体（例如 kubelet） 用于同 apiserver 通信的令牌
   * kubecfg.crt - 客户端证书，公钥
   * kubecfg.key - 客户端证书，私钥
   * server.cert - 服务器证书，公钥
   * server.key - 服务器证书，私钥

创建此目录的最简单方法可能是从一个工作集群的 master 节点复制它们，或者您可以自己手动生成这些文件。

<!--
### Starting the API Server

Once these files exist, copy the [kube-apiserver.yaml](/docs/admin/high-availability/kube-apiserver.yaml) into `/etc/kubernetes/manifests/` on each master node.

The kubelet monitors this directory, and will automatically create an instance of the `kube-apiserver` container using the pod definition specified
in the file.
-->
### 启动 API Server

一旦创建了这些文件，请将 [kube-apiserver.yaml](/docs/admin/high-availability/kube-apiserver.yaml) 复制到每个 master 节点的 `/etc/kubernetes/manifests/` 目录下。

kubelet 监视这个目录，并且会使用文件中指定的 pod 定义自动创建一个 `kube-apiserver` 的容器实例。

<!--
### Load balancing

At this point, you should have 3 apiservers all working correctly.  If you set up a network load balancer, you should
be able to access your cluster via that load balancer, and see traffic balancing between the apiserver instances.  Setting
up a load balancer will depend on the specifics of your platform, for example instructions for the Google Cloud
Platform can be found [here](https://cloud.google.com/compute/docs/load-balancing/).
-->
### 负载均衡

此时，您应该有 3 个全部正常工作的 apiserver。如果您设置了一个网络负载均衡器，你就可以通过它访问您的集群，并平衡各个 apiserver 实例的流量。负载均衡器的配置取决于您的平台的具体情况，例如，Google Cloud Platform 的相关说明可以在 [这里](https://cloud.google.com/compute/docs/load-balancing/) 找到。

<!--
Note, if you are using authentication, you may need to regenerate your certificate to include the IP address of the balancer,
in addition to the IP addresses of the individual nodes.

For pods that you deploy into the cluster, the `kubernetes` service/dns name should provide a load balanced endpoint for the master automatically.

For external users of the API (e.g. the `kubectl` command line interface, continuous build pipelines, or other clients) you will want to configure
them to talk to the external load balancer's IP address.
-->
请注意，如果您启用了身份验证，可能需要重新生成证书，在每个独立节点的 IP 地址外，还应包含负载均衡器的IP地址。

对于部署到集群中的 pod 来说，`kubernetes` service/dns 名称自动的提供了一个 master 的负载均衡 endpoint。

对于 API 的外部用户（例如 `kubectl` 命令行接口、持续构建管道或其它客户端），您应该配置它们使用外部负载均衡器 IP 地址同 API 进行通信。

<!--
### Endpoint reconciler

As mentioned in the previous section, the apiserver is exposed through a
service called `kubernetes`. The endpoints for this service correspond to
the apiserver replicas that we just deployed.

Since updating endpoints and services requires the apiserver to be up, there
is special code in the apiserver to let it update its own endpoints directly.
This code is called the "reconciler," because it reconciles the list of
endpoints stored in etcd, and the list of endpoints that are actually up
and running.
-->
### Endpoint reconciler

如前一节所述，apiserver 通过一个名为 `kubernetes` 的 service 进行公开。这个 service 的 endpoint 对应于我们刚刚部署的 apiserver 集群。

由于更新 endpoint 和 service 需要 apiserver 启动，apiserver 中有特殊的代码可以使其直接更新自己的 endpoint。这个代码被称为“reconciler（协调器）”，因为它会对存储在 etcd 中及正在运行的 endpoint 列表进行协调。

<!--
Prior Kubernetes 1.9, the reconciler expects you to provide the
number of endpoints (i.e., the number of apiserver replicas) through
a command-line flag (e.g. `--apiserver-count=3`). If more replicas
are available, the reconciler trims down the list of endpoints.
As a result, if a node running a replica of the apiserver crashes
and gets replaced, the list of endpoints is eventually updated.
However, until the replica gets replaced, its endpoint stays in
the list. During that time, a fraction of the API requests sent
to the `kubernetes` service will fail, because they will be sent
to a down endpoint.

This is why the previous section advises you to deploy a load
balancer, and access the API through that load balancer. The
load balancer will directly assess the health of the apiserver
replicas, and make sure that requests are not sent to crashed
instances.
-->
在 Kubernetes 1.9 版本之前，reconciler 希望您通过一个命令行参数（例如 `--apiserver-count=3`）提供 endpoint 的数量（意即 apiserver 的副本数）。如果有更多可用的副本，reconciler 将对 endpoint 列表进行截取。因此，如果一个运行 apiserver 副本的节点宕机并被替换，endpoint 列表将最终被更新。然而，在副本被替换前，它的 endpoint 都将留存在列表中。在此期间，一小部分发送到 `kubernetes` service 的 API 请求将会失败，因为它们会被发送到一个未运行的 endpoint。

这就是上一节建议您部署负载均衡器并通过它访问 API 的原因。这个 负载均衡器将直接评估 apiserver 的健康状态，确保请求不会发送到崩溃的示例。

<!--
If you do not add the `--apiserver-count` flag, the value defaults to 1.
Your cluster will work correctly, but each apiserver replica will
continuously try to add itself to the list of endpoints while removing
the other ones, causing a lot of extraneous updates in kube-proxy
and other components.

Starting with Kubernetes 1.9, a new reconciler implementation is available.
It uses a *lease* that is regularly renewed by each apiserver
replica. When a replica is down, it stops renewing its lease, and
the other replicas notice that the lease expired and remove it
from the list of endpoints. You can switch to the new reconciler
by adding the flag `--endpoint-reconciler-type=lease` when starting
your apiserver replicas.
-->
如果您不添加 `--apiserver-count` 参数，其值将默认为 1。您的集群将会正常工作，但每个 apiserver 副本都会持续尝试在删除其它 endpoint 时将自己添加到列表中，这将在 kube-proxy 和其他组件中产生大量无用的更新。

从  Kubernetes 1.9 版本开始，有了一个新的 reconciler 实现。它使用了一个被每个 apiserver 副本定期更新的*租约*。当副本宕机时，它会停止更新自己的租约，其他副本注意到这个租约过期并从 endpoint 列表中将其删除。您可以在启动 apiserver 副本时，通过添加 `--endpoint-reconciler-type=lease` 参数来切换到新的 reconciler。

<!--
If you want to know more, you can check the following resources:
- [issue kubernetes/kuberenetes#22609](https://github.com/kubernetes/kubernetes/issues/22609),
  which gives additional context
- [master/reconcilers/mastercount.go](https://github.com/kubernetes/kubernetes/blob/dd9981d038012c120525c9e6df98b3beb3ef19e1/pkg/master/reconcilers/mastercount.go#L63),
  the implementation of the master count reconciler
- [PR kubernetes/kubernetes#51698](https://github.com/kubernetes/kubernetes/pull/51698),
  which adds support for the lease reconciler
-->
如果您希望了解更多信息，可以查看以下资源：
- [issue kubernetes/kuberenetes#22609](https://github.com/kubernetes/kubernetes/issues/22609)，给出了更多的上下文。
- [master/reconcilers/mastercount.go](https://github.com/kubernetes/kubernetes/blob/dd9981d038012c120525c9e6df98b3beb3ef19e1/pkg/master/reconcilers/mastercount.go#L63)，基于 master 计数的 reconciler 实现。
- [PR kubernetes/kubernetes#51698](https://github.com/kubernetes/kubernetes/pull/51698)，添加了对基于租约的 reconciler 的支持。

<!--
## Master elected components

So far we have set up state storage, and we have set up the API server, but we haven't run anything that actually modifies
cluster state, such as the controller manager and scheduler.  To achieve this reliably, we only want to have one actor modifying state at a time, but we want replicated
instances of these actors, in case a machine dies.  To achieve this, we are going to use a lease-lock in the API to perform
master election.  We will use the `--leader-elect` flag for each scheduler and controller-manager, using a lease in the API will ensure that only 1 instance of the scheduler and controller-manager are running at once.
-->
## 主选举的组件

到目前为止，我们已经建立起了状态存储，并且已经建立了 API server，但我们还没有运行任何实际修改集群状态的内容，例如 controller manager 和 scheduler。为了可靠的实现这一点，我们每次只希望一个 actor 修改状态，但是我们希望复制这些 actor 实例，以防止有机器宕机。为了达到这个目的，我们将在 API 中使用一个租约锁来执行主选举（master election）。我们将对每个 scheduler 和 controller manager 使用 `--leader-elect` 参数，以在 API 中使用租约来确保同一时间只有一个 scheduler 和 controller-manager 实例运行。

<!--
The scheduler and controller-manager can be configured to talk to the API server that is on the same node (i.e. 127.0.0.1), or it can be configured to communicate using the load balanced IP address of the API servers. Regardless of how they are configured, the scheduler and controller-manager will complete the leader election process mentioned above when using the `--leader-elect` flag.

In case of a failure accessing the API server, the elected leader will not be able to renew the lease, causing a new leader to be elected. This is especially relevant when configuring the scheduler and controller-manager to access the API server via 127.0.0.1, and the API server on the same node is unavailable.
-->
scheduler 和 controller-manager 可以配置为和相同节点（意即 127.0.0.1）上的 API server 进行通信，或者也可以配置为使用 API server 的负载均衡器地址。不管如何配置它们，当使用 `--leader-elect` 参数时，scheduler 和 controller-manager 都将完成上文提到的主选举过程。

当无法访问 API server 时，选举的 leader 无法更新其租约，这将导致选举产生新的 leader。在 scheduler 和 controller-manager 通过 127.0.0.1 访问 API server 并且相同节点上的 API server 宕机时，这一点显得尤为重要。

<!--
### Installing configuration files

First, create empty log files on each node, so that Docker will mount the files not make new directories:
-->
### 安装配置文件

首先，在每个节点上创建空的日志文件，这样 Docker 将挂载一个文件而不是创建新目录：

```shell
touch /var/log/kube-scheduler.log
touch /var/log/kube-controller-manager.log
```

<!--
Next, set up the descriptions of the scheduler and controller manager pods on each node by copying [kube-scheduler.yaml](/docs/admin/high-availability/kube-scheduler.yaml) and [kube-controller-manager.yaml](/docs/admin/high-availability/kube-controller-manager.yaml) into the `/etc/kubernetes/manifests/` directory.
-->
接下来，通过复制  [kube-scheduler.yaml](/docs/admin/high-availability/kube-scheduler.yaml) 和 [kube-controller-manager.yaml](/docs/admin/high-availability/kube-controller-manager.yaml) 到 `/etc/kubernetes/manifests/` 目录来建立每个节点的 scheduler 和 controller manager 的 pod 的配置描述文件。

<!--
## Conclusion

At this point, you are done (yeah!) with the master components, but you still need to add worker nodes (boo!).

If you have an existing cluster, this is as simple as reconfiguring your kubelets to talk to the load-balanced endpoint, and
restarting the kubelets on each node.

If you are turning up a fresh cluster, you will need to install the kubelet and kube-proxy on each worker node, and
set the `--apiserver` flag to your replicated endpoint.
-->
## 结论

目前，您已经完成了 master 组件的配置（耶！），但您仍然需要添加工作节点（噗！）。

如果您有一个存在的集群，这就很简单，只需要重新配置 kubelet 与负载均衡器的 endpoint 通信，并重启每个节点上的 kubelet。

如果您建立的是一个新集群，您将需要在每个工作节点上安装 kubelet 和 kube-proxy，并且将 `--apiserver` 参数设置为您的复制的 endpoint。
