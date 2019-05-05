---
title: 升级
content_template: templates/task
---

<!-- ---
title: Upgrades
content_template: templates/task
--- -->

{{% capture overview %}}
<!-- This page will outline how to manage and execute a Kubernetes upgrade. -->
本页将展示如何进行 Kubernetes 集群升级。
{{% /capture %}}

{{% capture prerequisites %}}
<!-- This page assumes you have a working deployed cluster. -->
本页假定你有一个 juju 部署的集群。

{{< warning >}}

<!-- You should always back up all your data before attempting an upgrade.
Don't forget to include the workload inside your cluster!
Refer to the [backup documentation](/docs/getting-started-guides/ubuntu/backups). -->

在进行升级之前，你应当备份所有的数据。
不要忘记对集群内的工作负载进行数据备份！
参见[备份文档](/docs/getting-started-guides/ubuntu/backups)。

{{< /warning >}}

{{% /capture %}}

{{% capture steps %}}

<!-- ## Patch kubernetes upgrades for example 1.9.0 -> 1.9.1 -->
## 对集群进行补丁版本升级，例如，1.9.0 -> 1.9.1

<!-- Clusters are transparently upgraded to the latest Kubernetes patch release.
To be clear, a cluster deployed using the 1.9/stable channel
will transparently receive unattended upgrades for the 1.9.X Kubernetes
releases.
The upgrade causes no disruption to the operation of the cluster and requires
no intervention from a cluster administrator.
Each patch release is evaluated by the
Canonical Kubernetes Distribution team.
Once a patch release passes internal testing and is deemed safe for upgrade,
it is packaged in snap format and pushed to the stable channel. -->

集群透明地升级到最新的 Kubernetes 补丁版本。
需要澄清的是，用 1.9/stable 通道部署的集群将会透明地、自动更新到 Kubernetes 1.9.X 最新版。
升级的过程对集群的运行没有影响，也不需要集群维护人员的干预。
每一个补丁版本都由 Canonical Kubernetes 发布小组审核评估。
一旦补丁版本通过了内部测试，认为可以安全用于集群升级，
将会被打包成 snap 格式，发布到稳定版通道上。

<!-- ## Upgrading a minor Kubernetes release for example 1.8.1 -> 1.9.0 -->
## 对集群进行次版本升级，例如，1.8.1 -> 1.9.0

<!-- The Kubernetes charms follow the Kubernetes releases. Please consult
your support plan on the upgrade frequency. Important operational considerations
and changes in behaviour will always be documented in the release notes. -->

Kubernetes charms 遵循的是 Kubernetes 发行版本。
请咨询了解 support 计划在升级频率方面的相关信息。
重要的运维考虑以及行为上的改变都会记录在发布通知里。

<!-- ### Upgrade etcd -->
### 升级 etcd

<!-- Backing up etcd requires an export and snapshot, refer to the
[backup documentation](/docs/getting-started-guides/ubuntu/backups) to create a snapshot.
After the snapshot, upgrade the etcd service with: -->

备份 etcd 需要导出和快照操作，参见[备份文档](/docs/getting-started-guides/ubuntu/backups)了解如何创建快照。
在做完快照后，用下面的命令升级 etcd 服务：

    juju upgrade-charm etcd

<!-- This will handle upgrades between minor versions of etcd.
Instructions on how to upgrade from 2.x to 3.x can be found
[here](https://github.com/juju-solutions/bundle-canonical-kubernetes/wiki/Etcd-2.3-to-3.x-upgrade)
in the juju-solutions wiki. -->

命令将会负责 etcd 的次版本升级。
在 [juju 解决方案的 wiki](https://github.com/juju-solutions/bundle-canonical-kubernetes/wiki/Etcd-2.3-to-3.x-upgrade) 里
可以了解如何将 etcd 从 2.x 升级到 3.x。

<!-- ### Upgrade kubeapi-load-balancer -->
### 升级 kubeapi-load-balancer

<!-- The Kubernetes Charms are generally all updated and released at the same time. A core part of a cluster on Ubuntu is the kubeapi-load-balancer component. Incorrect or missing changes there can have an effect on API availability and access controls. To ensure API service continuity for the master and workers when they are updated, this upgrade needs to precede them. -->

Kubernetes Charms 通常是同时更新、发布。
Ubuntu 集群的核心部分是 kubeapi-load-balancer 组件。
错误或遗失修改可能会导致 API 可用性和访问控制方面的问题。
为了保证 API 服务在集群升级期间还能为主节点和工作节点服务，也需要对它们进行升级。

<!-- To upgrade the charm run: -->

升级命令：

    juju upgrade-charm kubeapi-load-balancer

<!-- ### Upgrade Kubernetes -->
### 升级 Kubernetes

<!-- The Kubernetes Charms use snap channels to drive payloads.
The channels are defined by `X.Y/channel` where `X.Y` is the `major.minor` release
of Kubernetes (for example 1.9) and `channel` is one of the four following channels: -->

Kubernetes Charms 使用 snap 通道来驱动负荷。
这些通道定义的格式为 `X.Y/channel`，其中，`X.Y` 是 Kubernetes `主.次` 发行版（例如，1.9）
而 `channel` 的取值范围如下：

<!-- | Channel name        | Description  |
| ------------------- | ------------ |
| stable              | The latest stable released patch version of Kubernetes |
| candidate           | Release candidate releases of Kubernetes |
| beta                | Latest alpha or beta of Kubernetes for that minor release |
| edge                | Nightly builds of that minor release of Kubernetes | -->

| 通道名               | 描述  |
| ------------------- | ------------ |
| stable              | Kubernetes 的最新稳定发行版 |
| candidate           | Kubernetes 的发行候选版 |
| beta                | Kubernetes 次发行版的最新 alpha 或 beta 版 |
| edge                | Kubernetes 次发行版的每日构建版 |


<!-- If a release isn't available, the next highest channel is used.
For example, 1.9/beta will load `/candidate` or `/stable` depending on availability of release.
Development versions of Kubernetes are available in the edge channel for each minor release.
There is no guarantee that edge snaps will work with the current charms. -->

如果发行版还不可用，就会使用下一个最高通道的版本。
例如，1.9/beta 会根据发行版的可用性加载 `/candidate` 或 `/stable` 版本。
Kubernetes 的开发版本会根据每个次版本，发布到 edge 通道上。
但不会保证 edge snap 能够和当前的 charms 一起工作。

<!-- ### Master Upgrades -->
### 主节点升级

<!-- First you need to upgrade the masters: -->

首先需要对主节点进行升级：

    juju upgrade-charm kubernetes-master

{{< note >}}

<!-- Always upgrade the masters before the workers. -->

永远在工作节点升级之前，升级主节点。

{{< /note >}}

<!-- Once the latest charm is deployed, the channel for Kubernetes can be selected by issuing the following: -->

在部署完最新的 charm 之后，可以通过下面的命令行来选择通道：

    juju config kubernetes-master channel=1.x/stable

<!-- Where `x` is the minor version of Kubernetes. For example, `1.9/stable`. See above for Channel definitions.
Once you've configured kubernetes-master with the appropriate channel, run the upgrade action on each master: -->

其中，`x` 是 Kubernetes 的次版本号。例如，`1.9/stable`。
参阅前面对通道的定义。
将 kubernetes-master 配置到合适的通道上后，
再在每个主节点上运行下面的升级命令：

    juju run-action kubernetes-master/0 upgrade
    juju run-action kubernetes-master/1 upgrade
    ...

<!-- ### Worker Upgrades -->
### 工作节点升级

<!-- Two methods of upgrading workers are supported.
[Blue/Green Deployment](http://martinfowler.com/bliki/BlueGreenDeployment.html)
and upgrade-in-place. Both methods are provided for operational flexibility and both
are supported and tested. Blue/Green will require more hardware up front than in-place,
but is a safer upgrade route. -->

现有所支持的升级工作节点的方法有两种，[蓝/绿部署](http://martinfowler.com/bliki/BlueGreenDeployment.html)
和就地升级。提供两种方法可以带来运维上的灵活性，而这两种方法也都被支持和测试。
相比于就地升级，蓝/绿部署需要更多的硬件资源，但也更为安全可靠。

<!-- #### Blue/green worker upgrade -->
#### 蓝/绿工作节点升级

<!-- Given a deployment where the workers are named kubernetes-alpha. -->

假定一个部署里面所有的工作节点都叫 kubernetes-alpha。

<!-- Deploy new workers: -->

部署新的工作节点：

    juju deploy kubernetes-alpha

<!-- Pause the old workers so your workload migrates: -->

暂停旧的工作节点，然后迁移工作负载：

    juju run-action kubernetes-alpha/# pause

<!-- Verify old workloads have migrated with: -->

验证所迁移的工作负载：

    kubectl get pod -o wide

<!-- Tear down old workers with: -->

销毁就有的工作节点：

    juju remove-application kubernetes-alpha

<!-- #### In place worker upgrade -->
#### 就地工作节点升级

    juju upgrade-charm kubernetes-worker
    juju config kubernetes-worker channel=1.x/stable

<!-- Where `x` is the minor version of Kubernetes. For example, `1.9/stable`.
See above for Channel definitions. Once you've configured kubernetes-worker with the appropriate channel,
run the upgrade action on each worker: -->

其中，`x` 是 Kubernetes 的次版本号。例如，`1.9/stable`。
参阅前面对通道的定义。将 kubernetes-worker 配置到合适的通道上后，
再在每个工作节点上运行下面的升级命令：

    juju run-action kubernetes-worker/0 upgrade
    juju run-action kubernetes-worker/1 upgrade
    ...

<!-- ### Verify upgrade -->
### 验证升级

<!-- `kubectl version` should return the newer version. -->

`kubectl version` 将会返回新的版本号。

<!-- It is recommended to rerun a [cluster validation](/docs/getting-started-guides/ubuntu/validation)
to ensure that the cluster upgrade has successfully completed. -->

建议重新运行[集群验证](/docs/getting-started-guides/ubuntu/validation)确认集群升级成功完成。

<!-- ### Upgrade Flannel -->
### 升级 Flannel

<!-- Upgrading flannel can be done at any time, it is independent of Kubernetes upgrades.
Be advised that networking is interrupted during the upgrade. You can initiate a flannel upgrade with: -->

可以在任何时候升级 flannel，它的升级可以和 Kubernetes 升级分开进行。
需要注意的是，在升级过程中，网络会受到影响。
可以通过下面的命令行发起升级：

    juju upgrade-charm flannel

<!-- ### Upgrade easyrsa -->
### 升级 easyrsa

<!-- Upgrading easyrsa can be done at any time, it is independent of Kubernetes upgrades.
Upgrading easyrsa should result in zero downtime as it is not a running service: -->

可以在任何时候升级 easyrsa，它的升级可以和 Kubernetes 升级分开进行。
升级 easyrsa 会有停机时间，因为不是运行服务：

    juju upgrade-charm easyrsa

{{% /capture %}}
