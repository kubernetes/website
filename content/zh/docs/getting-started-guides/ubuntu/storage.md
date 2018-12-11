---
title: 存储
content_template: templates/task
---

<!-- ---
title: Storage
content_template: templates/task
--- -->

{{% capture overview %}}

<!-- This page explains how to install and configure persistent storage on a cluster. -->
本文解释了如何在集群中安装和配置持久化存储。

{{% /capture %}}

{{% capture prerequisites %}}

<!-- This page assumes you have a working Juju deployed cluster. -->
本文假设您已经有一个用 Juju 部署、正在运行的集群。

{{% /capture %}}

{{% capture steps %}}

<!-- ## Ceph Persistent Volumes -->
## Ceph 持久卷

<!-- The Canonical Distribution of Kubernetes allows you to connect with durable
storage devices such as [Ceph](http://ceph.com). When paired with the
[Juju Storage](https://jujucharms.com/docs/2.0/charms-storage) feature you
can add durable storage easily and across clouds. -->

Canonical 的 Kubernetes 发行版允许添加持久化存储设备，例如 [Ceph](http://ceph.com)。
配合 [Juju Storage](https://jujucharms.com/docs/2.0/charms-storage)功能，
可以跨云平台，添加持久化存储。

<!-- Deploy a minimum of three ceph-mon and three ceph-osd units. -->

部署一个至少有三个 ceph-mon 和三个 ceph-osd 单元的存储池。

```
juju deploy cs:ceph-mon -n 3
juju deploy cs:ceph-osd -n 3
```

<!-- Relate the units together: -->
关联这些单元：

```
juju add-relation ceph-mon ceph-osd
```

<!-- List the storage pools available to Juju for your cloud: -->
列出云上 Juju 可用的存储池：

    juju storage-pools

<!-- Output: -->
输出：

```
Name     Provider  Attrs
ebs      ebs
ebs-ssd  ebs       volume-type=ssd
loop     loop
rootfs   rootfs
tmpfs    tmpfs
```

{{< note >}}

<!-- This listing is for the Amazon Web Services public cloud.
Different clouds may have different pool names. -->

注意列表使用的是 AWS，不同的云有不同的存储池名称。

{{< /note >}}

<!-- Add a storage pool to the ceph-osd charm by NAME,SIZE,COUNT: -->

以 “名字,大小,数量”的格式往 ceph-osd charm 中添加存储池：

```
juju add-storage ceph-osd/0 osd-devices=ebs,10G,1
juju add-storage ceph-osd/1 osd-devices=ebs,10G,1
juju add-storage ceph-osd/2 osd-devices=ebs,10G,1
```

<!-- Next relate the storage cluster with the Kubernetes cluster: -->
接下来将 Kubernetes 和存储集群相关联：

```
juju add-relation kubernetes-master ceph-mon
```

<!-- We are now ready to enlist
[Persistent Volumes](/docs/concepts/storage/persistent-volumes/)
in Kubernetes which our workloads can consume via Persistent Volume (PV) claims. -->


现在我们可以在 Kubernetes 中列举可用的[持久卷](/docs/concepts/storage/persistent-volumes/)，
集群中的负载可以通过 PVC 申领来使用这些持久卷。

```
juju run-action kubernetes-master/0 create-rbd-pv name=test size=50
```

<!-- This example created a "test" Rados Block Device (rbd) in the size of 50 MB.

Use watch on your Kubernetes cluster like the following, you should see the PV
become enlisted and be marked as available: -->

本例中创建了 50 MB 大小的 “test” Rados 块设备 (rbd)。

在 Kubernetes 集群上使用如下所示的 watch 命令，可以看到 PV 加入列表，并被标记可用的过程：

    watch kubectl get pv

<!-- Output: -->
输出:

```
NAME CAPACITY   ACCESSMODES   STATUS    CLAIM              REASON    AGE

test   50M          RWO       Available                              10s
```

<!-- To consume these Persistent Volumes, your pods will need an associated
Persistent Volume Claim with them, and is outside the scope of this README.
See the [Persistent Volumes](/docs/concepts/storage/persistent-volumes/)
documentation for more information. -->

要使用这些持久卷，pods 需要关联一个持久卷申领，这超出了本文档的讨论范围。
参见[持久卷](/docs/concepts/storage/persistent-volumes/)获取更多信息。

{{% /capture %}}
