---
title: 存储
cn-assignees:
- Tony-CCIE
---

<!--
---
title: Storage
---
-->
{% capture overview %}
<!-- This page explains how to install and configure persistent storage on a cluster. -->

本页面阐述了如何在 Kubernetes 集群上安装和配置持久化存储。

{% endcapture %}
{% capture prerequisites %}
<!-- This page assumes you have a working Juju deployed cluster. -->

本文前提假设你已经通过 Juju 部署好了一个 Kubernetes 集群
{% endcapture %}

{% capture steps %}

<!--
## Ceph Persistent Volumes

The Canonical Distribution of Kubernetes allows you to connect with durable
storage devices such as [Ceph](http://ceph.com). When paired with the
[Juju Storage](https://jujucharms.com/docs/2.0/charms-storage) feature you
can add durable storage easily and across clouds.
-->
## Ceph 持久卷

Canonical 的 Kubernetes 发行版允许你连接到持久化存储设备，例如 [Ceph](http://ceph.com)。配合 [Juju Storage](https://jujucharms.com/docs/2.0/charms-storage)功能可轻松跨越云端添加持久化存储。

<!--
Deploy a minimum of three ceph-mon and three ceph-osd units.
-->
部署至少三个 ceph-mon 和 ceph-osd 单元。

```
juju deploy cs:ceph-mon -n 3
juju deploy cs:ceph-osd -n 3
```

<!--
Relate the units together:
-->
与这些单元建立起关联。

```
juju add-relation ceph-mon ceph-osd
```

<!--
List the storage pools available to Juju for your cloud:

    juju storage-pools

Output:
-->
列出您云上对 Juju 可用的存储池：

    juju storage-pools

输出：

```
Name     Provider  Attrs
ebs      ebs       
ebs-ssd  ebs       volume-type=ssd
loop     loop      
rootfs   rootfs    
tmpfs    tmpfs
```

<!--
> **Note**: This listing is for the Amazon Web Services public cloud.
> Different clouds may have different pool names.
-->
> **注意**: 此列表适用于 Amazon Web Services 公有云。
> 不同的云拥有不同的 pool 名字。

<!--
Add a storage pool to the ceph-osd charm by NAME,SIZE,COUNT:
-->
通过 NAME, SIZE, COUNT 添加存储池到 ceph-osh charm 中：

```
juju add-storage ceph-osd/0 osd-devices=ebs,10G,1
juju add-storage ceph-osd/1 osd-devices=ebs,10G,1
juju add-storage ceph-osd/2 osd-devices=ebs,10G,1
```

<!--
Next relate the storage cluster with the Kubernetes cluster:
-->
接下来将存储集群与 Kubernetes 集群相关联：

```
juju add-relation kubernetes-master ceph-mon
```

<!--
We are now ready to enlist
[Persistent Volumes](/docs/concepts/storage/persistent-volumes/)
in Kubernetes which our workloads can consume via Persistent Volume (PV) claims.
-->
我们现在准备在 Kubernetes 中引入[持久卷](/docs/concepts/storage/persistent-volumes/)，工作负载可以通过持久卷 (PV) 声明进行消耗。

```
juju run-action kubernetes-master/0 create-rbd-pv name=test size=50
```

<!--
This example created a "test" Rados Block Device (rbd) in the size of 50 MB.

Use watch on your Kubernetes cluster like the following, you should see the PV
become enlisted and be marked as available:

    watch kubectl get pv

Output:
-->
这个示例中创建了50 MB 大小的 “test" Rados 块设备 (rbd)。

在您的 Kubernetes 集群上使用 watch 命令，如下所示，您应该看到 PV 已经标记为可用：

    watch kubectl get pv

输出：

```
NAME CAPACITY   ACCESSMODES   STATUS    CLAIM              REASON    AGE

test   50M          RWO       Available                              10s
```

<!--
To consume these Persistent Volumes, your pods will need an associated
Persistent Volume Claim with them, and is outside the scope of this README. See the
[Persistent Volumes](/docs/concepts/storage/persistent-volumes/)
documentation for more information.
-->
要使用这些持久卷，您的 pod 需要一个相关的持久卷声明，超出了本篇 README 的范围。有关更多信息，请参阅 [持久卷](/docs/concepts/storage/persistent-volumes/)文档。

{% endcapture %}

{% include templates/task.md %}
