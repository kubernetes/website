---
title: 搭建高可用的 Kubernetes Masters
content_type: task
---

<!--
reviewers:
- jszczepkowski
title: Set up High-Availability Kubernetes Masters
content_type: task
-->

<!-- overview -->

{{< feature-state for_k8s_version="1.5" state="alpha" >}}

<!--
You can replicate Kubernetes masters in `kube-up` or `kube-down` scripts for Google Compute Engine.
This document describes how to use kube-up/down scripts to manage highly available (HA) masters and how HA masters are implemented for use with GCE.
-->
你可以在谷歌计算引擎（GCE）的 `kubeup` 或 `kube-down` 脚本中复制 Kubernetes Master。
本文描述了如何使用 kube-up/down 脚本来管理高可用（HA）的 Master，
以及如何使用 GCE 实现高可用控制节点。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->
<!--
## Starting an HA-compatible cluster

To create a new HA-compatible cluster, you must set the following flags in your `kube-up` script:
-->
## 启动一个兼容高可用的集群

要创建一个新的兼容高可用的集群，你必须在 `kubeup` 脚本中设置以下标志:

<!--
* `MULTIZONE=true` - to prevent removal of master replicas kubelets from zones different than server's default zone.
Required if you want to run master replicas in different zones, which is recommended.

* `ENABLE_ETCD_QUORUM_READ=true` - to ensure that reads from all API servers will return most up-to-date data.
If true, reads will be directed to leader etcd replica.
Setting this value to true is optional: reads will be more reliable but will also be slower.

Optionally, you can specify a GCE zone where the first master replica is to be created.
Set the following flag:

* `KUBE_GCE_ZONE=zone` - zone where the first master replica will run.

The following sample command sets up a HA-compatible cluster in the GCE zone europe-west1-b:

```shell
MULTIZONE=true KUBE_GCE_ZONE=europe-west1-b  ENABLE_ETCD_QUORUM_READS=true ./cluster/kube-up.sh
```

Note that the commands above create a cluster with one master;
however, you can add new master replicas to the cluster with subsequent commands.
-->
* `MULTIZONE=true` - 为了防止从不同于服务器的默认区域的区域中删除 kubelets 副本。
  如果你希望在不同的区域运行副本，那么这一项是必需并且推荐的。

* `ENABLE_ETCD_QUORUM_READ=true` - 确保从所有 API 服务器读取数据时将返回最新的数据。
  如果为 true，读操作将被定向到主 etcd 副本。可以选择将这个值设置为 true，
  那么读取将更可靠，但也会更慢。

你还可以指定一个 GCE 区域，在这里创建第一个主节点副本。设置以下标志:

* `KUBE_GCE_ZONE=zone` - 将运行第一个主节点副本的区域。

下面的命令演示在 GCE  europe-west1-b 区域中设置一个兼容高可用的集群:

```shell
MULTIZONE=true KUBE_GCE_ZONE=europe-west1-b  ENABLE_ETCD_QUORUM_READS=true ./cluster/kube-up.sh
```

注意，上面的命令创建一个只有单一主节点的集群;
但是，你可以使用后续命令将新的主节点副本添加到集群中。

<!--
## Adding a new master replica

After you have created an HA-compatible cluster, you can add master replicas to it.
You add master replicas by using a `kube-up` script with the following flags:

* `KUBE_REPLICATE_EXISTING_MASTER=true` - to create a replica of an existing
master.

* `KUBE_GCE_ZONE=zone` - zone where the master replica will run.
Must be in the same region as other replicas' zones.

You don't need to set the `MULTIZONE` or `ENABLE_ETCD_QUORUM_READS` flags,
as those are inherited from when you started your HA-compatible cluster.

The following sample command replicates the master on an existing HA-compatible cluster:

```shell
KUBE_GCE_ZONE=europe-west1-c KUBE_REPLICATE_EXISTING_MASTER=true ./cluster/kube-up.sh
```
-->
## 增加一个新的主节点副本

在创建了兼容高可用的集群之后，可以向其中添加主节点副本。
你可以使用带有如下标记的 `kubeup` 脚本添加主节点副本:

* `KUBE_REPLICATE_EXISTING_MASTER=true` - 创建一个已经存在的主节点的副本。

* `KUBE_GCE_ZONE=zone` -主节点副本将运行的区域。必须与其他副本位于同一区域。

你无需设置 `MULTIZONE` 或 `ENABLE_ETCD_QUORUM_READS` 标志，因为他们可以从兼容高可用的集群中继承。

使用下面的命令可以复制现有兼容高可用的集群上的 Master:

```shell
KUBE_GCE_ZONE=europe-west1-c KUBE_REPLICATE_EXISTING_MASTER=true ./cluster/kube-up.sh
```
<!--
## Removing a master replica

You can remove a master replica from an HA cluster by using a `kube-down` script with the following flags:

* `KUBE_DELETE_NODES=false` - to restrain deletion of kubelets.

* `KUBE_GCE_ZONE=zone` - the zone from where master replica will be removed.

* `KUBE_REPLICA_NAME=replica_name` - (optional) the name of master replica to remove.
If empty: any replica from the given zone will be removed.

The following sample command removes a master replica from an existing HA cluster:

```shell
KUBE_DELETE_NODES=false KUBE_GCE_ZONE=europe-west1-c ./cluster/kube-down.sh
```
-->
## 删除主节点副本

你可以使用一个 `kube-down` 脚本从高可用集群中删除一个主节点副本，并可以使用以下标记:

* `KUBE_DELETE_NODES=false` - 限制删除 kubelets。

* `KUBE_GCE_ZONE=zone` - 将移除主节点副本的区域。

* `KUBE_REPLICA_NAME=replica_name` - （可选）要删除的主节点副本的名称。
如果为空：将删除给定区域中的所有副本。

使用下面的命令可以从一个现有的高可用集群中删除一个 Master副本:

```shell
KUBE_DELETE_NODES=false KUBE_GCE_ZONE=europe-west1-c ./cluster/kube-down.sh
```
<!--
## Handling master replica failures

If one of the master replicas in your HA cluster fails,
the best practice is to remove the replica from your cluster and add a new replica in the same zone.
The following sample commands demonstrate this process:

1. Remove the broken replica:

```shell
KUBE_DELETE_NODES=false KUBE_GCE_ZONE=replica_zone KUBE_REPLICA_NAME=replica_name ./cluster/kube-down.sh
```

<ol start="2"><li>Add a new replica in place of the old one:</li></ol>

```shell
KUBE_GCE_ZONE=replica-zone KUBE_REPLICATE_EXISTING_MASTER=true ./cluster/kube-up.sh
```
-->
## 处理主节点副本失败

如果高可用集群中的一个主节点副本失败，最佳实践是从集群中删除副本，
并在相同的区域中添加一个新副本。
下面的命令演示了这个过程:

1. 删除失败的副本:

```shell
KUBE_DELETE_NODES=false KUBE_GCE_ZONE=replica_zone KUBE_REPLICA_NAME=replica_name ./cluster/kube-down.sh
```

<ol start="2"><li>在原有位置增加一个新副本：</li></ol>

```shell
KUBE_GCE_ZONE=replica-zone KUBE_REPLICATE_EXISTING_MASTER=true ./cluster/kube-up.sh
```
<!--
## Best practices for replicating masters for HA clusters

* Try to place master replicas in different zones. During a zone failure, all masters placed inside the zone will fail.
To survive zone failure, also place nodes in multiple zones
(see [multiple-zones](/docs/setup/best-practices/multiple-zones/) for details).

* Do not use a cluster with two master replicas. Consensus on a two-replica cluster requires both replicas running when changing persistent state.
As a result, both replicas are needed and a failure of any replica turns cluster into majority failure state.
A two-replica cluster is thus inferior, in terms of HA, to a single replica cluster.

* When you add a master replica, cluster state (etcd) is copied to a new instance.
If the cluster is large, it may take a long time to duplicate its state.
This operation may be sped up by migrating etcd data directory, as described [here](https://coreos.com/etcd/docs/latest/admin_guide.html#member-migration)
(we are considering adding support for etcd data dir migration in future).
-->

## 高可用集群复制主节点的最佳实践

* 尝试将主节点副本放置在不同的区域。在某区域故障时，放置在该区域内的所有主机都将失败。
  为了在区域故障中幸免，请同样将工作节点放置在多区域中
  （详情请见[多区域](/zh/docs/setup/best-practices/multiple-zones/)）。

* 不要使用具有两个主节点副本的集群。在双副本集群上达成一致需要在更改持久状态时
  两个副本都处于运行状态。
  因此，两个副本都是需要的，任一副本的失败都会将集群带入多数失败状态。
  因此，就高可用而言，双副本集群不如单个副本集群。

* 添加主节点副本时，集群状态（etcd）会被复制到一个新实例。如果集群很大，
  可能需要很长时间才能复制它的状态。
  这个操作可以通过迁移 etcd 数据存储来加速, 详情参见
  [这里](https://coreos.com/etcd/docs/latest/admin_guide.html#member-migration)
  （我们正在考虑在未来添加对迁移 etcd 数据存储的支持）。

<!-- discussion -->
<!--
## Implementation notes

![ha-master-gce](/images/docs/ha-master-gce.png)
-->
## 实现说明

![ha-master-gce](/images/docs/ha-master-gce.png)

<!--
### Overview

Each of master replicas will run the following components in the following mode:

* etcd instance: all instances will be clustered together using consensus;

* API server: each server will talk to local etcd - all API servers in the cluster will be available;

* controllers, scheduler, and cluster auto-scaler: will use lease mechanism - only one instance of each of them will be active in the cluster;

* add-on manager: each manager will work independently trying to keep add-ons in sync.

In addition, there will be a load balancer in front of API servers that will route external and internal traffic to them.
-->
### 概述

每个主节点副本将以以下模式运行以下组件:

* etcd 实例： 所有实例将会以共识方式组建集群；

* API 服务器： 每个服务器将与本地 etcd 通信——集群中的所有 API 服务器都可用;

* 控制器、调度器和集群自动扩缩器：将使用租约机制 —— 每个集群中只有一个实例是可用的；

* 插件管理器：每个管理器将独立工作，试图保持插件同步。

此外，在 API 服务器前面将有一个负载均衡器，用于将外部和内部通信路由到他们。

<!--
### Load balancing

When starting the second master replica, a load balancer containing the two replicas will be created
and the IP address of the first replica will be promoted to IP address of load balancer.
Similarly, after removal of the penultimate master replica, the load balancer will be removed and its IP address will be assigned to the last remaining replica.
Please note that creation and removal of load balancer are complex operations and it may take some time (~20 minutes) for them to propagate.
-->
### 负载均衡

启动第二个主节点副本时，将创建一个包含两个副本的负载均衡器，
并将第一个副本的 IP 地址提升为负载均衡器的 IP 地址。
类似地，在删除倒数第二个主节点副本之后，将删除负载均衡器，
并将其 IP 地址分配给最后一个剩余的副本。
请注意，创建和删除负载均衡器是复杂的操作，可能需要一些时间（约20分钟）来同步。

<!--
###主节点service & kubelets

Instead of trying to keep an up-to-date list of Kubernetes apiserver in the Kubernetes service,
the system directs all traffic to the external IP:

* in one master cluster the IP points to the single master,

* in multi-master cluster the IP points to the load balancer in-front of the masters.

Similarly, the external IP will be used by kubelets to communicate with master.
-->
### 主节点服务 & kubelets

Kubernetes 并不试图在其服务中保持 apiserver 的列表为最新，
相反，它将将所有访问请求指向外部 IP：

* 在拥有一个主节点的集群中，IP 指向单一的主节点，
* 在拥有多个主节点的集群中，IP 指向主节点前面的负载均衡器。

类似地，kubelets 将使用外部 IP 与主节点通信。

<!--
### Master certificates

Kubernetes generates主节点TLS certificates for the external public IP and local IP for each replica.
There are no certificates for the ephemeral public IP for replicas;
to access a replica via its ephemeral public IP, you must skip TLS verification.
-->
### 主节点证书

Kubernetes 为每个副本的外部公共 IP 和本地 IP 生成主节点 TLS 证书。
副本的临时公共 IP 没有证书；
要通过其临时公共 IP 访问副本，必须跳过 TLS 检查。

<!--
### Clustering etcd

To allow etcd clustering, ports needed to communicate between etcd instances will be opened (for inside cluster communication).
To make such deployment secure, communication between etcd instances is authorized using SSL.
-->
### etcd 集群

为了允许 etcd 组建集群，需开放 etcd 实例之间通信所需的端口（用于集群内部通信）。
为了使这种部署安全，etcd 实例之间的通信使用 SSL 进行鉴权。

<!--
### API server identity
-->
### API 服务器标识

{{< feature-state state="alpha"  for_k8s_version="v1.20" >}}

<!--
The API Server Identity feature is controlled by a
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
and is not enabled by default. You can activate API Server Identity by enabling
the feature gate named `APIServerIdentity` when you start the
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}:
-->
使用 API 服务器标识功能需要启用[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)，
该功能默认不启用。
你可以在启动 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}} 的时候启用特性门控 `APIServerIdentity` 来激活 API 服务器标识：

<!--
```shell
kube-apiserver \
--feature-gates=APIServerIdentity=true \
 # …and other flags as usual
```
-->
```shell
kube-apiserver \
--feature-gates=APIServerIdentity=true \
 # …其他标记照常
```

<!--
During bootstrap, each kube-apiserver assigns a unique ID to itself. The ID is
in the format of `kube-apiserver-{UUID}`. Each kube-apiserver creates a
[Lease](/docs/reference/generated/kubernetes-api/{{< param "version" >}}//#lease-v1-coordination-k8s-io)
in the _kube-system_ {{< glossary_tooltip text="namespaces" term_id="namespace">}}.
-->
在启动引导过程中，每个 kube-apiserver 会给自己分配一个唯一 ID。
该 ID 的格式是 `kube-apiserver-{UUID}`。
每个 kube-apiserver 会在 _kube-system_ {{< glossary_tooltip text="名字空间" term_id="namespace">}} 里创建一个 [`Lease` 对象](/docs/reference/generated/kubernetes-api/{{< param "version" >}}//#lease-v1-coordination-k8s-io)。
<!--
The Lease name is the unique ID for the kube-apiserver. The Lease contains a
label `k8s.io/component=kube-apiserver`. Each kube-apiserver refreshes its
Lease every `IdentityLeaseRenewIntervalSeconds` (defaults to 10s). Each
kube-apiserver also checks all the kube-apiserver identity Leases every
`IdentityLeaseDurationSeconds` (defaults to 3600s), and deletes Leases that
hasn't got refreshed for more than `IdentityLeaseDurationSeconds`.
`IdentityLeaseRenewIntervalSeconds` and `IdentityLeaseDurationSeconds` can be
configured by kube-apiserver flags `identity-lease-renew-interval-seconds`
and `identity-lease-duration-seconds`.
-->
`Lease` 对象的名字是 kube-apiserver 的唯一 ID。
`Lease` 对象包含一个标签 `k8s.io/component=kube-apiserver`。
每个 kube-apiserver 每过 `IdentityLeaseRenewIntervalSeconds`（默认是 10 秒）就会刷新它的 `Lease` 对象。
每个 kube-apiserver 每过 `IdentityLeaseDurationSeconds`（默认是 3600 秒）也会检查所有 kube-apiserver 的标识 `Lease` 对象，
并且会删除超过 `IdentityLeaseDurationSeconds` 时间还没被刷新的 `Lease` 对象。
可以在 kube-apiserver 的 `identity-lease-renew-interval-seconds`
和 `identity-lease-duration-seconds` 标记里配置 `IdentityLeaseRenewIntervalSeconds` 和 `IdentityLeaseDurationSeconds`。

<!--
Enabling this feature is a prerequisite for using features that involve HA API
server coordination (for example, the `StorageVersionAPI` feature gate).
-->
启用该功能是使用 HA API 服务器协调相关功能（例如，`StorageVersionAPI` 特性门控）的前提条件。

<!--
## Additional reading

[Automated HA master deployment - design doc](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/ha_master.md)
-->
## 拓展阅读

[自动化高可用集群部署 - 设计文档](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/ha_master.md)

