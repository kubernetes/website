---
title: 备份
content_template: templates/task
---

{{% capture overview %}}

<!-- The state of a Kubernetes cluster is kept in the etcd datastore.
This page shows how to backup and restore the etcd shipped with
the Canonical Distribution of Kubernetes. Backing up application specific data,
normally stored in a persistent volume, is outside the scope of this
document. -->
Kubernetes 集群的状态信息保存在 etcd 数据库中。
本文将要展示如何对 Canonical 发行版的 Kubernetes 中所带有的 etcd 进行备份和恢复。
至于如何对通常保存在持久卷上的应用数据进行备份，超出了本文的讨论范围。

{{% /capture %}}

{{% capture prerequisites %}}
<!-- This page assumes you have a working Juju deployed cluster. -->
本文假设您有一个 Juju 部署的集群。
{{% /capture %}}

{{% capture steps %}}
<!-- ## Snapshot etcd data -->
## 快照 etcd 中的数据

<!-- The `snapshot` action of the etcd charm allows the operator to snapshot
a running cluster's data for use in cloning,
backing up, or migrating to a new cluster.

    juju run-action etcd/0 snapshot

This will create a snapshot in `/home/ubuntu/etcd-snapshots` by default. -->

etcd charm 的 `snapshot` 操作能够让操作员给正在运行的集群数据建立快照，快照数据可用于复制、备份或者迁移到一个新的集群中。

    juju run-action etcd/0 snapshot

这条命令会在 `/home/ubuntu/etcd-snapshots` 默认路径下建立一个快照。

<!-- ## Restore etcd data -->
## 恢复 etcd 数据

<!-- The etcd charm is capable of restoring its data from a cluster-data snapshot
via the `restore` action.
This comes with caveats and a very specific path to restore a cluster:
The cluster must be in a state of only having a single member. So it's best to
deploy a new cluster using the etcd charm, without adding any additional units. -->

etcd charm 能够通过 `restore` 操作从一个集群数据快照中恢复集群数据。
这里有些注意事项，而且是恢复集群的唯一办法：集群当前只能有一个成员。
所以最好是使用 etcd charm 来部署一个新的集群，而不必添加任何新的单元。

```
juju deploy etcd new-etcd
```

<!-- The above code snippet will deploy a single unit of etcd, as 'new-etcd' -->
上面的命令将会部署一个单独的 etcd 单元，'new-etcd'。

```
juju run-action etcd/0 restore target=/mnt/etcd-backups
```

<!-- Once the restore action has completed, evaluate the cluster health. If the unit
is healthy, you may resume scaling the application to meet your needs.

- **param** target: destination directory to save the existing data.
- **param** skip-backup: Don't backup any existing data. -->

当恢复操作完成后，评估一下集群的健康状态。如果集群运行良好，就可以按照您的需求来扩展应用程序规模。

- **参数** target: 保存现有数据的目的路径。
- **参数** skip-backup: 不要备份任何现有的数据。


<!-- ## Migrating an etcd cluster
Using the above snapshot and restore operations, migrating etcd is a fairly easy task. -->

## 迁移 etcd 集群
通过使用上述的 `snapshot` 和 `restore` 操作，就能很容易地迁移 etcd 集群。

<!-- **Step 1:** Snapshot your existing cluster. This is encapsulated in the `snapshot` action. -->
**第一步：** 给现有的集群建立快照。这个已经封装在 `snapshot` 操作中。

```
juju run-action etcd/0 snapshot
```

<!-- Results: -->
结果：

```
Action queued with id: b46d5d6f-5625-4320-8cda-b611c6ae580c
```

<!-- **Step 2:** Check the status of the action so you can grab the snapshot and verify
the sum. The `copy.cmd` result output is a copy/paste command for you to download
the exact snapshot that you just created. -->
**第二步：** 检查操作状态，以便您能抓取快照并且验证校验和。
您可以直接使用 `copy.cmd` 中的结果来下载您刚刚创建的快照数据，`copy.cmd` 中的结果可以直接复制/粘贴使用。

<!-- Download the snapshot archive from the unit that created the snapshot and verify the sha256 sum -->
从节点上下载刚刚创建的快照数据并且验证 sha256sum 校验和

```
juju show-action-output b46d5d6f-5625-4320-8cda-b611c6ae580c
```

<!-- Results: -->
结果：

```
results:
  copy:
    cmd: juju scp etcd/0:/home/ubuntu/etcd-snapshots/etcd-snapshot-2016-11-09-02.41.47.tar.gz
      .
  snapshot:
    path: /home/ubuntu/etcd-snapshots/etcd-snapshot-2016-11-09-02.41.47.tar.gz
    sha256: 1dea04627812397c51ee87e313433f3102f617a9cab1d1b79698323f6459953d
    size: 68K
status: completed
```

<!-- Copy the snapshot to the local disk and then check the sha256sum. -->
将数据快照拷到本地，然后检查 sha256sum。

```
juju scp etcd/0:/home/ubuntu/etcd-snapshots/etcd-snapshot-2016-11-09-02.41.47.tar.gz .
sha256sum etcd-snapshot-2016-11-09-02.41.47.tar.gz
```

<!-- **Step 3:** Deploy the new cluster leader, and attach the snapshot: -->
**第三步：** 部署新的集群 leader 节点，并加载快照数据：

```
juju deploy etcd new-etcd --resource snapshot=./etcd-snapshot-2016-11-09-02.41.47.tar.gz
```

<!-- **Step 4:** Reinitialize the master with the data from the resource we just attached in step 3. -->
**第四步：** 使用在第三步中的快照数据来重新初始化 master：

```
juju run-action new-etcd/0 restore
```

{{% /capture %}}

{{% capture discussion %}}
<!-- ## Known Limitations -->
## 已知的局限

<!-- #### Loss of PKI warning -->
#### 丢失 PKI 警告

<!-- If you destroy the leader - identified with the `*` text next to the unit number in status:
all TLS pki will be lost. No PKI migration occurs outside
of the units requesting and registering the certificates. -->

如果销毁了 leader - 在状态栏通过 `*` 来标识，那么所有的 TLS pki 警告都将会丢失。
在请求和注册证书的单元之外，将不会有 PKI 迁移发生。

{{< caution >}}

<!-- **Caution:**  Mismanaging this configuration will result in locking yourself
out of the cluster, and can potentially break existing deployments in very
strange ways relating to x509 validation of certificates, which affects both
servers and clients. -->
**警告：** 如果误管理这项配置，将会导致您无法从外部访问集群，
并且很可能会破坏现有的部署，出现 x509 证书验证相关的异常问题，这些都会对服务器和客户端造成影响。

{{< /caution >}}

<!-- #### Restoring from snapshot on a scaled cluster -->
#### 在一个已经扩展的集群上进行快照数据恢复

<!-- Restoring from a snapshot on a scaled cluster will result in a broken cluster.
Etcd performs clustering during unit turn-up, and state is stored in Etcd itself.
During the snapshot restore phase, a new cluster ID is initialized, and peers
are dropped from the snapshot state to enable snapshot restoration. Please
follow the migration instructions above in the restore action description. -->

在一个已经扩展的集群上进行快照数据恢复，将会导致集群损坏。
etcd 在节点启动时开始集群管理，并且将状态保存在 etcd 中。
在快照数据的恢复阶段，会初始化一个新的集群 ID，并且丢弃其它 peer 节点以保证快照数据的恢复。
请严格遵照上述集群迁移中的恢复操作来进行操作。

{{% /capture %}}
