---
approvers:
- lavalamp
- thockin
title: 集群管理
---


* TOC
{:toc}


本文描述了和集群生命周期相关的几个主题：创建新集群、更新集群的 master 和 worker 节点、执行节点维护（例如升级内核）以及升级运行中集群的 Kubernetes API 版本。


## 创建和配置集群


要在一组机器上安装 Kubernetes， 请根据您的环境，查阅现有的 [入门指南](/docs/getting-started-guides/) 


## 升级集群


集群升级当前是配套提供的，某些发布版本在升级时可能需要特殊处理。推荐管理员在升级他们的集群前，同时查阅 [发行说明](https://git.k8s.io/kubernetes/CHANGELOG.md) 和版本具体升级说明。


* [升级到 1.6](/docs/admin/upgrade-1-6)


### 升级 Google Compute Engine 集群


Google Compute Engine Open Source (GCE-OSS) 通过删除和重建 master 来支持 master 升级。通过维持相同的 Persistent Disk (PD) 以保证在升级过程中保留数据。


GCE 的 Node 升级采用 [管理实例组](https://cloud.google.com/compute/docs/instance-groups/)，每个节点将被顺序的删除，然后使用新软件重建。任何运行在那个节点上的 Pod 需要用 Replication Controller 控制，或者在扩容之后手动重建。


开源 Google Compute Engine (GCE) 集群上的升级过程由 `cluster/gce/upgrade.sh` 脚本控制。


运行 `cluster/gce/upgrade.sh -h` 获取使用说明。


例如，只将 master 升级到一个指定的版本 (v1.0.2):

```shell
cluster/gce/upgrade.sh -M v1.0.2
```


或者，将整个集群升级到最新的稳定版本：

```shell
cluster/gce/upgrade.sh release/stable
```


### 升级 Google Kubernetes Engine 集群


Google Kubernetes Engine 自动升级 master 组件（例如 `kube-apiserver`、`kube-scheduler`）至最新版本。它还负责 master 运行的操作系统和其它组件。


节点升级过程由用户初始化，[Google Kubernetes Engine 文档](https://cloud.google.com/kubernetes-engine/docs/clusters/upgrade) 里有相关描述。


### 在其他平台上升级集群


不同的供应商和工具管理升级的过程各不相同。建议您查阅它们有关升级的主要文档。

* [kops](https://github.com/kubernetes/kops)
* [kubespray](https://github.com/kubernetes-incubator/kubespray)
* [CoreOS Tectonic](https://coreos.com/tectonic/docs/latest/admin/upgrade.html)
* ...


## 调整集群大小


如果集群资源短缺，您可以轻松的添加更多的机器，如果集群正运行在[节点自注册模式](/docs/admin/node/#self-registration-of-nodes)下的话。如果正在使用的是 GCE 或者 Google Kubernetes Engine，这将通过调整管理节点的实例组的大小完成。在  [Google Cloud Console page](https://console.developers.google.com) 的 `Compute > Compute Engine > Instance groups > your group > Edit group` 下修改实例数量或使用 gcloud CLI 都可以完成这个任务。

```shell
gcloud compute instance-groups managed resize kubernetes-minion-group --size 42 --zone $ZONE
```


实例组将负责在新机器上放置恰当的镜像并启动它们。Kubelet 将向 API server 注册它的节点以使其可以用于调度。如果您对  instance group 进行缩容，系统将会随机选取节点来终止。


在其他环境上，您可能需要手动配置机器并告诉 Kubelet API server 在哪台机器上运行。


### 集群自动伸缩


如果正在使用 GCE 或者 Google Kubernetes Engine，您可以配置您的集群，使其能够基于 pod 需求自动重新调整大小。


如  [Compute Resource](/docs/concepts/configuration/manage-compute-resources-container/) 所述，用户可以控制预留多少 CPU 和内存来分配给 pod。这个信息被 Kubernetes scheduler 用来寻找一个运行 pod 的地方。如果没有一个节点有足够的空闲容量（或者不能满足其他 pod 的需求），这个 pod 就需要等待某些 pod 结束，或者一个新的节点被添加。


集群 autoscaler 查找不能被调度的 pod 并检查添加一个新节点（和集群中其它节点类似的）是否有帮助。如果是的话，它将调整集群的大小以容纳等待调度的 pod。


如果发现在一段延时时间内（默认10分钟，将来有可能改变）某些节点不再需要，集群 autoscaler 也会缩小集群。


集群 autoscaler 在每一个实例组（GCE）或节点池（Google Kubernetes Engine）上配置。


如果您使用 GCE，那么您可以在使用 kube-up.sh 脚本创建集群的时候启用它。要想配置集群 autoscaler，您需要设置三个环境变量：


* `KUBE_ENABLE_CLUSTER_AUTOSCALER` - 如果设置为 true 将启用集群 autoscaler。
* `KUBE_AUTOSCALER_MIN_NODES` - 集群的最小节点数量。
* `KUBE_AUTOSCALER_MAX_NODES` - 集群的最大节点数量。


示例：

```shell
KUBE_ENABLE_CLUSTER_AUTOSCALER=true KUBE_AUTOSCALER_MIN_NODES=3 KUBE_AUTOSCALER_MAX_NODES=10 NUM_NODES=5 ./cluster/kube-up.sh
```


在 Google Kubernetes Engine 上，您可以在创建、更新集群或创建一个特别的节点池（您希望自动伸缩的）时，通过给对应的 `gcloud` 命令传递 `--enable-autoscaling` `--min-nodes` 和 `--max-nodes` 来配置集群 autoscaler。


示例：

```shell
gcloud container clusters create mytestcluster --zone=us-central1-b --enable-autoscaling --min-nodes=3 --max-nodes=10 --num-nodes=5
```

```shell
gcloud container clusters update mytestcluster --enable-autoscaling --min-nodes=1 --max-nodes=15
```


**集群 autoscaler 期望节点未被手动修改过（例如通过 kubectl 添加标签），因为那些属性可能不能被传递到相同节点组中的新节点上。**


## 维护节点


如果需要重启节点（例如内核升级、libc 升级、硬件维修等），且停机时间很短时，当 Kubelet 重启后，它将尝试重启调度到节点上的 pod。如果重启花费较长时间（默认时间为 5 分钟，由 controller-manager 的 `--pod-eviction-timeout` 控制），节点控制器将会结束绑定到这个不可用节点上的 pod。如果存在对应的 replica set（或者 replication controller）时，则将在另一个节点上启动  pod 的新副本。所以，如果所有的 pod 都是复制而来，那么在不是所有节点都同时停机的前提下，升级可以在不需要特殊调整情况下完成。


如果您希望更多的控制升级过程，可以使用下面的工作流程：


使用 `kubectl drain` 优雅的结束节点上的所有 pod 并同时标记节点为不可调度：

```shell
kubectl drain $NODENAME
```


在您正试图使节点离线时，这将阻止新的 pod 落到它们上面。


对于有 replica set 的 pod 来说，它们将会被新的 pod 替换并且将被调度到一个新的节点。此外，如果 pod 是一个 service 的一部分，则客户端将被自动重定向到新的 pod。


对于没有 replica set 的 pod，您需要手动启动 pod 的新副本，并且如果它不是 service 的一部分，您需要手动将客户端重定向到这个 pod。


在节点上执行维护工作。


重新使节点可调度：

```shell
kubectl uncordon $NODENAME
```


如果删除了节点的虚拟机实例并重新创建，那么一个新的可调度节点资源将被自动创建（只在您使用支持节点发现的云服务提供商时；当前只有 Google Compute Engine，不包括在 Google Compute Engine 上使用  kube-register 的 CoreOS）。相关详细信息，请查阅 [节点](/docs/admin/node)。


## 高级主题


### 升级到不同的 API 版本


当新的 API 版本发布时，您可能需要升级集群支持新的 API 版本（例如当 'v2' 发布时从  'v1' 切换到 'v2'）。


这不是一个经常性的事件，但需要谨慎的处理。这里有一系列升级到新 API 版本的步骤。

      1. 开启新 API 版本。
      2. 升级集群存储来使用新版本。
      3. 升级所有配置文件。识别使用旧 API 版本 endpoint 的用户。
      4. 运行 `cluster/update-storage-objects.sh` 升级存储中的现有对象为新版本。
      5. 关闭旧 API 版本。


### 打开或关闭集群的 API 版本


可以在启动 API server 时传递 `--runtime-config=api/<version>` 标志来打开或关闭特定的 API 版本。例如：要关闭 v1 API，请传递 `--runtime-config=api/v1=false`。运行时配置还支持两个特殊键值：api/all 和 api/legacy，分别控制全部和遗留 API。例如要关闭除 v1 外全部 API 版本，请传递 `--runtime-config=api/all=false,api/v1=true`。对于这些标志来说，_legacy_ API 指那些被显式废弃的 API（例如  `v1beta3`）。


### 切换集群存储的 API 版本


存储于磁盘中，用于在集群内部代表 Kubernetes 活跃资源的对象使用特定的 API 版本书写。当支撑的 API 改变时，这些对象可能需要使用更新的 API 重写。重写失败将最终导致资源不再能够被 Kubernetes API server 解析或使用。


`kube-apiserver` 二进制文件的 `KUBE_API_VERSIONS` 环境变量控制了集群支持的 API 版本。列表中的第一个版本被用作集群的存储版本。因此，要设置特定的版本为存储版本，请将其放在 `KUBE_API_VERSIONS` 参数值版本列表的最前面。您需要重启 `kube-apiserver` 二进制以使这个变量的改动生效。


### 切换配置文件为新 API 版本


可以使用 `kubectl convert` 命令对不同 API 版本的配置文件进行转换。

```shell
kubectl convert -f pod.yaml --output-version v1
```


更多选项请参考 [kubectl convert](/docs/user-guide/kubectl/v1.6/#convert)  命令用法。
