---
approvers:
- lavalamp
- thockin
title: 集群管理
content_type: task
---

<!--
This document describes several topics related to the lifecycle of a cluster: creating a new cluster,
upgrading your cluster's
master and worker nodes, performing node maintenance (e.g. kernel upgrades), and upgrading the Kubernetes API version of a
running cluster.
-->
本文描述了和集群生命周期相关的几个主题：创建新集群、更新集群的主控节点和工作节点、
执行节点维护（例如升级内核）以及升级运行中集群的 Kubernetes API 版本。

<!-- body -->

<!--
## Creating and configuring a Cluster

To install Kubernetes on a set of machines, consult one of the existing [Getting Started guides](/docs/setup/) depending on your environment.
-->
## 创建和配置集群

要在一组机器上安装 Kubernetes，请根据你的环境，查阅现有的[入门指南](/zh/docs/setup/)


<!--
## Upgrading a cluster

The current state of cluster upgrades is provider dependent, and some releases may require special care when upgrading. It is recommended that administrators consult both the [release notes](https://git.k8s.io/kubernetes/CHANGELOG/README.md), as well as the version specific upgrade notes prior to upgrading their clusters.
-->
## 升级集群

集群升级当前是配套提供的，某些发布版本在升级时可能需要特殊处理。
推荐管理员在升级他们的集群前，同时查阅
[发行说明](https://git.k8s.io/kubernetes/CHANGELOG.md) 和版本具体升级说明。

<!--
### Upgrading an Azure Kubernetes Service (AKS) cluster

Azure Kubernetes Service enables easy self-service upgrades of the control plane and nodes in your cluster. The process is
currently user-initiated and is described in the [Azure AKS documentation](https://docs.microsoft.com/en-us/azure/aks/upgrade-cluster).
-->
### 升级 Azure Kubernetes Service（AKS）集群

Azure Kubernetes Service 支持自服务式的控制面升级和集群节点升级。
升级过程目前是由用户发起的，具体文档参见
[Azure AKS 文档](https://docs.microsoft.com/en-us/azure/aks/upgrade-cluster)。

<!--
### Upgrading Google Compute Engine clusters

Google Compute Engine Open Source (GCE-OSS) support master upgrades by deleting and
recreating the master, while maintaining the same Persistent Disk (PD) to ensure that data is retained across the
upgrade.
-->
### 升级 Google Compute Engine 集群

Google Compute Engine Open Source（GCE-OSS）通过删除和重建主控节点来支持主控节点升级。
通过维持相同的 Persistent Disk (PD) 以保证在升级过程中保留数据。

<!--
Node upgrades for GCE use a [Managed Instance Group](https://cloud.google.com/compute/docs/instance-groups/), each node
is sequentially destroyed and then recreated with new software.  Any Pods that are running on that node need to be
controlled by a Replication Controller, or manually re-created after the roll out.
-->
GCE 的 节点升级采用[受控实例组](https://cloud.google.com/compute/docs/instance-groups/)，
每个节点将被顺序删除，然后使用新软件重建。
任何运行在那个节点上的 Pod 需要用副本控制器控制，或者在扩容之后手动重建。

<!--
Upgrades on open source Google Compute Engine (GCE) clusters are controlled by the `cluster/gce/upgrade.sh` script.

Get its usage by running `cluster/gce/upgrade.sh -h`.

For example, to upgrade just your master to a specific version (v1.0.2):
-->
开源 Google Compute Engine (GCE) 集群上的升级过程由 `cluster/gce/upgrade.sh` 脚本控制。

运行 `cluster/gce/upgrade.sh -h` 获取使用说明。

例如，只将主控节点升级到一个指定的版本（v1.0.2）：

```shell
cluster/gce/upgrade.sh -M v1.0.2
```

<!--
Alternatively, to upgrade your entire cluster to the latest stable release:
-->
或者，将整个集群升级到最新的稳定版本：

```shell
cluster/gce/upgrade.sh release/stable
```

<!--
### Upgrading Google Kubernetes Engine clusters

Google Kubernetes Engine automatically updates master components (e.g. `kube-apiserver`, `kube-scheduler`) to the latest version. It also handles upgrading the operating system and other components that the master runs on.
-->
### 升级 Google Kubernetes Engine 集群

Google Kubernetes Engine 自动升级主控节点组件（例如 `kube-apiserver`、`kube-scheduler`）至最新版本。
它还负责主控节点运行的操作系统和其它组件的升级。

<!--
The node upgrade process is user-initiated and is described in the [Google Kubernetes Engine documentation](https://cloud.google.com/kubernetes-engine/docs/clusters/upgrade).
-->
节点升级过程由用户发起，[Google Kubernetes Engine 文档](https://cloud.google.com/kubernetes-engine/docs/clusters/upgrade)中有相关描述。

<!--
### Upgrading an Amazon EKS Cluster

Amazon EKS cluster's master components can be upgraded by using eksctl, AWS Management Console, or AWS CLI. The process is user-initiated and is described in the [Amazon EKS documentation](https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html).
-->
### 升级 Amazon EKS 集群

Amazon EKS 集群的主控组件可以使用 eksctl、AWS 管理控制台或者 AWS CLI 来升级。
升级过程由用户发起，具体参看
[Amazon EKS 文档](https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html)。

<!--
### Upgrading an Oracle Cloud Infrastructure Container Engine for Kubernetes (OKE) cluster

Oracle creates and manages a set of master nodes in the Oracle control plane on your behalf (and associated Kubernetes infrastructure such as etcd nodes) to ensure you have a highly available managed Kubernetes control plane. You can also seamlessly upgrade these master nodes to new versions of Kubernetes with zero downtime. These actions are described in the [OKE documentation](https://docs.cloud.oracle.com/iaas/Content/ContEng/Tasks/contengupgradingk8smasternode.htm). 
-->
### 升级 Oracle Cloud Infrastructure 上的 Container Engine for Kubernetes (OKE) 集群

Oracle 在 Oracle 控制面替你创建和管理一组主控节点（及相关的 Kubernetes 基础设施，
如 etcd 节点）。你可以在不停机的情况下无缝升级这些主控节点到新的 Kubernetes 版本。
相关的操作可参考
[OKE 文档](https://docs.cloud.oracle.com/iaas/Content/ContEng/Tasks/contengupgradingk8smasternode.htm)。 

<!--
### Upgrading clusters on other platforms

Different providers, and tools, will manage upgrades differently.  It is recommended that you consult their main documentation regarding upgrades.
-->
### 在其他平台上升级集群

不同的供应商和工具管理升级的过程各不相同。建议你查阅它们有关升级的主要文档。

* [kops](https://github.com/kubernetes/kops)
* [kubespray](https://github.com/kubernetes-incubator/kubespray)
* [CoreOS Tectonic](https://coreos.com/tectonic/docs/latest/admin/upgrade.html)
* [Digital Rebar](https://provision.readthedocs.io/en/tip/doc/content-packages/krib.html)
* ...

<!--
To upgrade a cluster on a platform not mentioned in the above list, check the order of component upgrade on the
[Skewed versions](/docs/setup/release/version-skew-policy/#supported-component-upgrade-order) page.
-->
要在上面列表中没有提及的平台上升级集群时，请参阅
[版本偏差](/zh/docs/setup/release/version-skew-policy/#supported-component-upgrade-order)
页面所讨论的组件升级顺序。

<!--
## Resizing a cluster

If your cluster runs short on resources you can easily add more machines to it if your cluster
is running in [Node self-registration mode](/docs/concepts/architecture/nodes/#self-registration-of-nodes).
If you're using GCE or Google Kubernetes Engine it's done by resizing the Instance Group managing your Nodes.
It can be accomplished by modifying number of instances on
`Compute > Compute Engine > Instance groups > your group > Edit group`
[Google Cloud Console page](https://console.developers.google.com) or using gcloud CLI:
-->
## 调整集群大小

如果集群资源短缺，且集群正运行在
[节点自注册模式](/zh/docs/concepts/architecture/nodes/#self-registration-of-nodes)，
你可以轻松地添加更多的机器。
如果正在使用的是 GCE 或者 Google Kubernetes Engine，添加节点将通过调整管理节点的实例组的大小完成。
在  [Google Cloud 控制台](https://console.developers.google.com) 页面
的 `Compute > Compute Engine > Instance groups > your group > Edit group`
下修改实例数量或使用 gcloud CLI 都可以完成这个任务。

```shell
gcloud compute instance-groups managed resize kubernetes-minion-group --size 42 --zone $ZONE
```

<!--
The Instance Group will take care of putting appropriate image on new machines and starting them,
while the Kubelet will register its Node with the API server to make it available for scheduling.
If you scale the instance group down, system will randomly choose Nodes to kill.
-->
实例组将负责在新机器上放置恰当的镜像并启动它们。
kubelet 将向 API 服务器注册它的节点以使其可以用于调度。
如果你对实例组进行缩容，系统将会随机选取节点来终止。

<!--
In other environments you may need to configure the machine yourself and tell the Kubelet on which machine API server is running.
-->
在其他环境中，你可能需要手动配置机器并告诉 kubelet API 服务器在哪台机器上运行。

<!--
### Cluster autoscaling

If you are using GCE or Google Kubernetes Engine, you can configure your cluster so that it is automatically rescaled based on
pod needs.
-->
### 集群自动伸缩

如果正在使用 GCE 或者 Google Kubernetes Engine，你可以配置你的集群，
使其能够基于 Pod 需求自动重新调整大小。

<!--
As described in [Compute Resource](/docs/concepts/configuration/manage-resources-containers/),
users can reserve how much CPU and memory is allocated to pods.
This information is used by the Kubernetes scheduler to find a place to run the pod. If there is
no node that has enough free capacity (or doesn't match other pod requirements) then the pod has
to wait until some pods are terminated or a new node is added.
-->
如[计算资源](/zh/docs/concepts/configuration/manage-resources-containers/)所述，
用户可以控制预留多少 CPU 和内存来分配给 Pod。
这个信息被 Kubernetes 调度器用来寻找一个运行 Pod 的地方。
如果没有一个节点有足够的空闲容量（或者不能满足 Pod 的其他需求），
这个 Pod 就需要等待某些 Pod 结束，或者一个新的节点被添加。

<!--
Cluster autoscaler looks for the pods that cannot be scheduled and checks if adding a new node, similar
to the other in the cluster, would help. If yes, then it resizes the cluster to accommodate the waiting pods.
-->
集群 Autoscaler 查找不能被调度的 Pod 并检查添加一个新节点（和集群中其它节点类似的）
是否有帮助。如果是的话，它将调整集群的大小以容纳等待调度的 Pod。

<!--
Cluster autoscaler also scales down the cluster if it notices that one or more nodes are not needed anymore for
an extended period of time (10min but it may change in the future).
-->
如果发现在一段延时时间内（默认 10 分钟，将来有可能改变）某些节点不再需要，
集群 Autoscaler 也会缩小集群。

<!--
Cluster autoscaler is configured per instance group (GCE) or node pool (Google Kubernetes Engine).
-->
集群 Autoscaler 基于每个实例组（GCE）或节点池（Google Kubernetes Engine）来配置。

<!--
If you are using GCE then you can either enable it while creating a cluster with kube-up.sh script.
To configure cluster autoscaler you have to set three environment variables:
-->
如果你使用 GCE，那么你可以在使用 kube-up.sh 脚本创建集群的时候启用集群自动扩缩。
要想配置集群 Autoscaler，你需要设置三个环境变量：

<!--
* `KUBE_ENABLE_CLUSTER_AUTOSCALER` - it enables cluster autoscaler if set to true.
* `KUBE_AUTOSCALER_MIN_NODES` - minimum number of nodes in the cluster.
* `KUBE_AUTOSCALER_MAX_NODES` - maximum number of nodes in the cluster.

Example:
-->
* `KUBE_ENABLE_CLUSTER_AUTOSCALER` - 如果设置为 true 将启用集群 Autoscaler。
* `KUBE_AUTOSCALER_MIN_NODES` - 集群的最小节点数量。
* `KUBE_AUTOSCALER_MAX_NODES` - 集群的最大节点数量。

示例：

```shell
KUBE_ENABLE_CLUSTER_AUTOSCALER=true KUBE_AUTOSCALER_MIN_NODES=3 KUBE_AUTOSCALER_MAX_NODES=10 NUM_NODES=5 ./cluster/kube-up.sh
```

<!--
On Google Kubernetes Engine you configure cluster autoscaler either on cluster creation or update or when creating a particular node pool
(which you want to be autoscaled) by passing flags `--enable-autoscaling` `--min-nodes` and `--max-nodes`
to the corresponding `gcloud` commands.

Examples:
-->
在 Google Kubernetes Engine 上，你可以在创建、更新集群或创建一个特别的（你希望自动伸缩的）
节点池时，通过给对应的 `gcloud` 命令传递 `--enable-autoscaling`、`--min-nodes` 和
`--max-nodes` 来配置集群 Autoscaler。

示例：

```shell
gcloud container clusters create mytestcluster --zone=us-central1-b --enable-autoscaling --min-nodes=3 --max-nodes=10 --num-nodes=5
```

```shell
gcloud container clusters update mytestcluster --enable-autoscaling --min-nodes=1 --max-nodes=15
```


<!--
**Cluster autoscaler expects that nodes have not been manually modified (e.g. by adding labels via kubectl) as those properties would not be propagated to the new nodes within the same instance group.**

For more details about how the cluster autoscaler decides whether, when and how
to scale a cluster, please refer to the [FAQ](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
documentation from the autoscaler project.
-->

**集群 Autoscaler 期望节点未被手动修改过（例如通过 kubectl 添加标签），因自行指定的属性
可能不能被传递到相同节点组中的新节点上。**

关于集群 Autoscaler 如何决定是否、合适以及怎样对集群进行缩放的细节，请参考 autoscaler 项目的
[FAQ](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
文档。


<!--
## Maintenance on a Node

If you need to reboot a node (such as for a kernel upgrade, libc upgrade, hardware repair, etc.), and the downtime is
brief, then when the Kubelet restarts, it will attempt to restart the pods scheduled to it.  If the reboot takes longer
(the default time is 5 minutes, controlled by `-pod-eviction-timeout` on the controller-manager),
then the node controller will terminate the pods that are bound to the unavailable node.  If there is a corresponding
replica set (or replication controller), then a new copy of the pod will be started on a different node.  So, in the case where all
pods are replicated, upgrades can be done without special coordination, assuming that not all nodes will go down at the same time.
-->
## 维护节点

如果需要重启节点（例如内核升级、libc 升级、硬件维修等），且停机时间很短时，
kubelet 重启后，将尝试重启调度到节点上的 Pod。如果重启花费较长时间（默认时间为 5 分钟，由
控制器管理器的 `--pod-eviction-timeout` 控制），节点控制器将会结束绑定到这个不可用节点上的 Pod。
如果存在对应的 ReplicaSet（或者 ReplicationController），则将在另一个节点上启动  Pod 的新副本。
所以，如果所有的 Pod 都是多副本的，那么在不是所有节点都同时停机的前提下，升级可以在不需要特殊
调整情况下完成。

<!--
If you want more control over the upgrading process, you may use the following workflow:

Use `kubectl drain` to gracefully terminate all pods on the node while marking the node as unschedulable:
-->
如果你希望对升级过程有更多的控制，可以使用下面的工作流程：

使用 `kubectl drain` 体面地结束节点上的所有 Pod 并同时标记节点为不可调度：

```shell
kubectl drain $NODENAME
```

<!--
This keeps new pods from landing on the node while you are trying to get them off.

For pods with a replica set, the pod will be replaced by a new pod which will be scheduled to a new node. Additionally, if the pod is part of a service, then clients will automatically be redirected to the new pod.
-->
在你试图使节点离线时，这样做将阻止新的 Pod 落到它们上面。

对于有 ReplicaSet 的 Pod 来说，它们将会被新的 Pod 替换并且将被调度到一个新的节点。
此外，如果 Pod 是一个 Service 的一部分，则客户端将被自动重定向到新的 Pod。

<!--
For pods with no replica set, you need to bring up a new copy of the pod, and assuming it is not part of a service, redirect clients to it.

Perform maintenance work on the node.

Make the node schedulable again:
-->
对于没有 ReplicaSet 的 Pod，你需要手动启动 Pod 的新副本，并且
如果它不是 Service 的一部分，你需要手动将客户端重定向到这个 Pod。

在节点上执行维护工作。

重新使节点可调度：

```shell
kubectl uncordon $NODENAME
```

<!--
If you deleted the node's VM instance and created a new one, then a new schedulable node resource will
be created automatically (if you're using a cloud provider that supports
node discovery; currently this is only Google Compute Engine, not including CoreOS on Google Compute Engine using kube-register).
See [Node](/docs/concepts/architecture/nodes/) for more details.
-->
如果删除了节点的虚拟机实例并重新创建，那么一个新的可调度节点资源将被自动创建
（只在你使用支持节点发现的云服务提供商时；当前只有 Google Compute Engine，
不包括在 Google Compute Engine 上使用  kube-register 的 CoreOS）。
相关详细信息，请查阅[节点](/zh/docs/concepts/architecture/nodes/)。

<!--
## Advanced Topics

### Upgrading to a different API version

When a new API version is released, you may need to upgrade a cluster to support the new API version (e.g. switching from 'v1' to 'v2' when 'v2' is launched).
-->
## 高级主题

### 升级到不同的 API 版本

当新的 API 版本发布时，你可能需要升级集群支持新的 API 版本
（例如当 'v2' 发布时从  'v1' 切换到 'v2'）。

<!--
This is an infrequent event, but it requires careful management. There is a sequence of steps to upgrade to a new API version.

   1. Turn on the new API version.
   1. Upgrade the cluster's storage to use the new version.
   1. Upgrade all config files. Identify users of the old API version endpoints.
   1. Update existing objects in the storage to new version by running `cluster/update-storage-objects.sh`.
   1. Turn off the old API version.
-->
这不是一个经常性的事件，但需要谨慎的处理。这里有一系列升级到新 API 版本的步骤。

1. 开启新 API 版本
1. 升级集群存储来使用新版本
1. 升级所有配置文件；识别使用旧 API 版本末端的用户
1. 运行 `cluster/update-storage-objects.sh` 升级存储中的现有对象为新版本
1. 关闭旧 API 版本

<!--
### Turn on or off an API version for your cluster

Specific API versions can be turned on or off by passing `-runtime-config=api/<version>` flag while bringing up the API server. For example: to turn off v1 API, pass `--runtime-config=api/v1=false`.
runtime-config also supports 2 special keys: api/all and api/legacy to control all and legacy APIs respectively.
For example, for turning off all API versions except v1, pass `--runtime-config=api/all=false,api/v1=true`.
For the purposes of these flags, _legacy_ APIs are those APIs which have been explicitly deprecated (e.g. `v1beta3`).
-->
### 打开或关闭集群的 API 版本

可以在启动 API 服务器时传递 `--runtime-config=api/<version>` 标志来打开或关闭特定的 API 版本。
例如：要关闭 v1 API，请传递 `--runtime-config=api/v1=false`。
`runtime-config` 还支持两个特殊键值：`api/all` 和 `api/legacy`，分别控制全部和遗留 API。
例如要关闭除 v1 外全部 API 版本，请传递 `--runtime-config=api/all=false,api/v1=true`。
对于这些标志来说，_遗留（Legacy）_ API 指的是那些被显式废弃的 API（例如  `v1beta3`）。

<!--
### Switching your cluster's storage API version

The objects that are stored to disk for a cluster's internal representation of the Kubernetes resources active in the cluster are written using a particular version of the API.
When the supported API changes, these objects may need to be rewritten in the newer API.  Failure to do this will eventually result in resources that are no longer decodable or usable
by the Kubernetes API server.
-->
### 切换集群存储的 API 版本

存储于磁盘中、用于在集群内部代表 Kubernetes 活跃资源的对象使用特定的 API 版本表达。
当所支持的 API 改变时，这些对象可能需要使用更新的 API 重写。
重写失败将最终导致资源不再能够被 Kubernetes API server 解析或使用。

<!--
### Switching your config files to a new API version

You can use `kubectl convert` command to convert config files between different API versions.
-->
### 切换配置文件到新 API 版本

你可以使用 `kubectl convert` 命令对不同 API 版本的配置文件进行转换。

```shell
kubectl convert -f pod.yaml --output-version v1
```

<!--
For more options, please refer to the usage of [kubectl convert](/docs/reference/generated/kubectl/kubectl-commands#convert) command.
-->
更多选项请参考 [`kubectl convert`](/docs/reference/generated/kubectl/kubectl-commands/#convert)  命令用法。

