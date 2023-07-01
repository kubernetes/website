---
title: 迁移多副本的控制面以使用云控制器管理器
linkTitle: 迁移多副本的控制面以使用云控制器管理器
content_type: task
weight: 250
---

<!--
reviewers:
- jpbetz
- cheftako
title: Migrate Replicated Control Plane To Use Cloud Controller Manager
linkTitle: "Migrate Replicated Control Plane To Use Cloud Controller Manager"
content_type: task
weight: 250
-->

<!-- overview -->

{{< glossary_definition term_id="cloud-controller-manager" length="all">}}

<!--
## Background

As part of the [cloud provider extraction effort](/blog/2019/04/17/the-future-of-cloud-providers-in-kubernetes/),
all cloud specific controllers must be moved out of the `kube-controller-manager`. 
All existing clusters that run cloud controllers in the `kube-controller-manager`
must migrate to instead run the controllers in a cloud provider specific
`cloud-controller-manager`.

Leader Migration provides a mechanism in which HA clusters can safely migrate "cloud
specific" controllers between the `kube-controller-manager` and the
`cloud-controller-manager` via a shared resource lock between the two components
while upgrading the replicated control plane. For a single-node control plane, or if
unavailability of controller managers can be tolerated during the upgrade, Leader
Migration is not needed and this guide can be ignored.
-->
## 背景

作为[云驱动提取工作](/blog/2019/04/17/the-future-of-cloud-providers-in-kubernetes/)
的一部分，所有特定于云的控制器都必须移出 `kube-controller-manager`。
所有在 `kube-controller-manager` 中运行云控制器的现有集群必须迁移到特定于云厂商的
`cloud-controller-manager` 中运行这些控制器。

领导者迁移（Leader Migration）提供了一种机制，使得 HA 集群可以通过这两个组件之间共享资源锁，
在升级多副本的控制平面时，安全地将“特定于云”的控制器从 `kube-controller-manager` 迁移到
`cloud-controller-manager`。
对于单节点控制平面，或者在升级过程中可以容忍控制器管理器不可用的情况，则不需要领导者迁移，
亦可以忽略本指南。

<!--
Leader Migration can be enabled by setting `--enable-leader-migration` on
`kube-controller-manager` or `cloud-controller-manager`. Leader Migration only
applies during the upgrade and can be safely disabled or left enabled after the
upgrade is complete.

This guide walks you through the manual process of upgrading the control plane from
`kube-controller-manager` with built-in cloud provider to running both
`kube-controller-manager` and `cloud-controller-manager`. If you use a tool to deploy
and manage the cluster, please refer to the documentation of the tool and the cloud
provider for specific instructions of the migration.
-->
领导者迁移可以通过在 `kube-controller-manager` 或 `cloud-controller-manager` 上设置
`--enable-leader-migration` 来启用。
领导者迁移仅在升级期间适用，并且在升级完成后可以安全地禁用或保持启用状态。

本指南将引导你手动将控制平面从内置的云驱动的 `kube-controller-manager` 升级为
同时运行 `kube-controller-manager` 和 `cloud-controller-manager`。
如果使用某种工具来部署和管理集群，请参阅对应工具和云驱动的文档以获取迁移的具体说明。

## {{% heading "prerequisites" %}}

<!--
It is assumed that the control plane is running Kubernetes version N and to be
upgraded to version N + 1. Although it is possible to migrate within the same
version, ideally the migration should be performed as part of an upgrade so that
changes of configuration can be aligned to each release. The exact versions of N and
N + 1 depend on each cloud provider. For example, if a cloud provider builds a
`cloud-controller-manager` to work with Kubernetes 1.24, then N can be 1.23 and N + 1
can be 1.24.

The control plane nodes should run `kube-controller-manager` with Leader Election
enabled, which is the default. As of version N, an in-tree cloud provider must be set
with `--cloud-provider` flag and `cloud-controller-manager` should not yet be
deployed.
-->
假定控制平面正在运行 Kubernetes 版本 N，要升级到版本 N+1。
尽管可以在同一版本内进行迁移，但理想情况下，迁移应作为升级的一部分执行，
以便可以配置的变更可以与发布版本变化对应起来。
N 和 N+1 的确切版本值取决于各个云厂商。例如，如果云厂商构建了一个可与 Kubernetes 1.24
配合使用的 `cloud-controller-manager`，则 N 可以为 1.23，N+1 可以为 1.24。

控制平面节点应运行 `kube-controller-manager` 并启用领导者选举，这也是默认设置。
在版本 N 中，树内云驱动必须设置 `--cloud-provider` 标志，而且 `cloud-controller-manager`
应该尚未部署。

<!--
The out-of-tree cloud provider must have built a `cloud-controller-manager` with
Leader Migration implementation. If the cloud provider imports
`k8s.io/cloud-provider` and `k8s.io/controller-manager` of version v0.21.0 or later,
Leader Migration will be available. However, for version before v0.22.0, Leader
Migration is alpha and requires feature gate `ControllerManagerLeaderMigration` to be
enabled in `cloud-controller-manager`.

This guide assumes that kubelet of each control plane node starts
`kube-controller-manager` and `cloud-controller-manager` as static pods defined by
their manifests. If the components run in a different setting, please adjust the
steps accordingly.

For authorization, this guide assumes that the cluster uses RBAC. If another
authorization mode grants permissions to `kube-controller-manager` and
`cloud-controller-manager` components, please grant the needed access in a way that
matches the mode.
-->
树外云驱动必须已经构建了一个实现了领导者迁移的 `cloud-controller-manager`。
如果云驱动导入了 v0.21.0 或更高版本的 `k8s.io/cloud-provider` 和 `k8s.io/controller-manager`，
则可以进行领导者迁移。
但是，对 v0.22.0 以下的版本，领导者迁移是一项 Alpha 阶段功能，需要在 `cloud-controller-manager`
中启用特性门控 `ControllerManagerLeaderMigration`。

本指南假定每个控制平面节点的 kubelet 以静态 Pod 的形式启动 `kube-controller-manager`
和 `cloud-controller-manager`，静态 Pod 的定义在清单文件中。
如果组件以其他设置运行，请相应地调整这里的步骤。

关于鉴权，本指南假定集群使用 RBAC。如果其他鉴权模式授予 `kube-controller-manager`
和 `cloud-controller-manager` 组件权限，请以与该模式匹配的方式授予所需的访问权限。

<!-- steps -->

<!--
### Grant access to Migration Lease

The default permissions of the controller manager allow only accesses to their main
Lease. In order for the migration to work, accesses to another Lease are required.

You can grant `kube-controller-manager` full access to the leases API by modifying 
the `system::leader-locking-kube-controller-manager` role. This task guide assumes
that the name of the migration lease is `cloud-provider-extraction-migration`.

`kubectl patch -n kube-system role 'system::leader-locking-kube-controller-manager' -p '{"rules": [ {"apiGroups":[ "coordination.k8s.io"], "resources": ["leases"], "resourceNames": ["cloud-provider-extraction-migration"], "verbs": ["create", "list", "get", "update"] } ]}' --type=merge`

Do the same to the `system::leader-locking-cloud-controller-manager` role.

`kubectl patch -n kube-system role 'system::leader-locking-cloud-controller-manager' -p '{"rules": [ {"apiGroups":[ "coordination.k8s.io"], "resources": ["leases"], "resourceNames": ["cloud-provider-extraction-migration"], "verbs": ["create", "list", "get", "update"] } ]}' --type=merge`
-->
### 授予访问迁移租约的权限

控制器管理器的默认权限仅允许访问其主租约（Lease）对象。为了使迁移正常进行，
需要授权它访问其他 Lease 对象。

你可以通过修改 `system::leader-locking-kube-controller-manager` 角色来授予
`kube-controller-manager` 对 Lease API 的完全访问权限。
本任务指南假定迁移 Lease 的名称为 `cloud-provider-extraction-migration`。

```shell
kubectl patch -n kube-system role 'system::leader-locking-kube-controller-manager' -p '{"rules": [ {"apiGroups":[ "coordination.k8s.io"], "resources": ["leases"], "resourceNames": ["cloud-provider-extraction-migration"], "verbs": ["create", "list", "get", "update"] } ]}' --type=merge
```

对 `system::leader-locking-cloud-controller-manager` 角色执行相同的操作。

```shell
kubectl patch -n kube-system role 'system::leader-locking-cloud-controller-manager' -p '{"rules": [ {"apiGroups":[ "coordination.k8s.io"], "resources": ["leases"], "resourceNames": ["cloud-provider-extraction-migration"], "verbs": ["create", "list", "get", "update"] } ]}' --type=merge
```

<!--
### Initial Leader Migration configuration

Leader Migration optionally takes a configuration file representing the state of
controller-to-manager assignment. At this moment, with in-tree cloud provider,
`kube-controller-manager` runs `route`, `service`, and `cloud-node-lifecycle`. The
following example configuration shows the assignment.

Leader Migration can be enabled without a configuration. Please see
[Default Configuration](#default-configuration) for details.
-->
### 初始领导者迁移配置

领导者迁移可以选择使用一个表示如何将控制器分配给不同管理器的配置文件。
目前，对于树内云驱动，`kube-controller-manager` 运行 `route`、`service` 和
`cloud-node-lifecycle`。以下示例配置显示的是这种分配。

领导者迁移可以不指定配置的情况下启用。请参阅[默认配置](#default-configuration) 
以获取更多详细信息。

```yaml
kind: LeaderMigrationConfiguration
apiVersion: controllermanager.config.k8s.io/v1
leaderName: cloud-provider-extraction-migration
controllerLeaders:
  - name: route
    component: kube-controller-manager
  - name: service
    component: kube-controller-manager
  - name: cloud-node-lifecycle
    component: kube-controller-manager
```

<!--
Alternatively, because the controllers can run under either controller managers,
setting `component` to `*` for both sides makes the configuration file consistent
between both parties of the migration.
-->
或者，由于控制器可以在任一控制器管理器下运行，因此将双方的 `component` 设置为 `*`
可以使迁移双方的配置文件保持一致。

```yaml
# 通配符版本
kind: LeaderMigrationConfiguration
apiVersion: controllermanager.config.k8s.io/v1
leaderName: cloud-provider-extraction-migration
controllerLeaders:
  - name: route
    component: *
  - name: service
    component: *
  - name: cloud-node-lifecycle
    component: *
```

<!--
On each control plane node, save the content to `/etc/leadermigration.conf`, and
update the manifest of `kube-controller-manager` so that the file is mounted inside
the container at the same location. Also, update the same manifest to add the
following arguments:

- `--enable-leader-migration` to enable Leader Migration on the controller manager
- `--leader-migration-config=/etc/leadermigration.conf` to set configuration file

Restart `kube-controller-manager` on each node. At this moment,
`kube-controller-manager` has leader migration enabled and is ready for the
migration.
-->
在每个控制平面节点上，请将如上内容保存到 `/etc/leadermigration.conf` 中，
并更新 `kube-controller-manager` 清单，以便将文件挂载到容器内的同一位置。
另外，请更新同一清单，添加以下参数：

- `--enable-leader-migration` 在控制器管理器上启用领导者迁移
- `--leader-migration-config=/etc/leadermigration.conf` 设置配置文件

在每个节点上重新启动 `kube-controller-manager`。这时，`kube-controller-manager`
已启用领导者迁移，为迁移准备就绪。

<!--
### Deploy Cloud Controller Manager

In version N + 1, the desired state of controller-to-manager assignment can be
represented by a new configuration file, shown as follows. Please note `component`
field of each `controllerLeaders` changing from `kube-controller-manager` to
`cloud-controller-manager`. Alternatively, use the wildcard version mentioned above,
which has the same effect.
-->
### 部署云控制器管理器

在版本 N+1 中，如何将控制器分配给不同管理器的预期分配状态可以由新的配置文件表示，
如下所示。请注意，各个 `controllerLeaders` 的 `component` 字段从 `kube-controller-manager`
更改为 `cloud-controller-manager`。
或者，使用上面提到的通配符版本，它具有相同的效果。

```yaml
kind: LeaderMigrationConfiguration
apiVersion: controllermanager.config.k8s.io/v1
leaderName: cloud-provider-extraction-migration
controllerLeaders:
  - name: route
    component: cloud-controller-manager
  - name: service
    component: cloud-controller-manager
  - name: cloud-node-lifecycle
    component: cloud-controller-manager
```

<!--
When creating control plane nodes of version N + 1, the content should be deployed to
`/etc/leadermigration.conf`. The manifest of `cloud-controller-manager` should be
updated to mount the configuration file in the same manner as
`kube-controller-manager` of version N. Similarly, add `--enable-leader-migration`
and `--leader-migration-config=/etc/leadermigration.conf` to the arguments of
`cloud-controller-manager`.

Create a new control plane node of version N + 1 with the updated
`cloud-controller-manager` manifest, and with the `--cloud-provider` flag set to
`external` for `kube-controller-manager`. `kube-controller-manager` of version N + 1
MUST NOT have Leader Migration enabled because, with an external cloud provider, it
does not run the migrated controllers anymore, and thus it is not involved in the
migration.

Please refer to [Cloud Controller Manager Administration](/docs/tasks/administer-cluster/running-cloud-controller/)
for more detail on how to deploy `cloud-controller-manager`.
-->
当创建版本 N+1 的控制平面节点时，应将如上内容写入到 `/etc/leadermigration.conf`。
你需要更新 `cloud-controller-manager` 的清单，以与版本 N 的 `kube-controller-manager`
相同的方式挂载配置文件。
类似地，添加 `--enable-leader-migration`
和 `--leader-migration-config=/etc/leadermigration.conf` 到 `cloud-controller-manager`
的参数中。

使用已更新的 `cloud-controller-manager` 清单创建一个新的 N+1 版本的控制平面节点，
同时设置 `kube-controller-manager` 的 `--cloud-provider` 标志为 `external`。
版本为 N+1 的 `kube-controller-manager` 不能启用领导者迁移，
因为在使用外部云驱动的情况下，它不再运行已迁移的控制器，因此不参与迁移。

请参阅[云控制器管理器管理](/zh-cn/docs/tasks/administer-cluster/running-cloud-controller/) 
了解有关如何部署 `cloud-controller-manager` 的更多细节。

<!--
### Upgrade Control Plane

The control plane now contains nodes of both version N and N + 1. The nodes of
version N run `kube-controller-manager` only, and these of version N + 1 run both
`kube-controller-manager` and `cloud-controller-manager`. The migrated controllers,
as specified in the configuration, are running under either `kube-controller-manager`
of version N or `cloud-controller-manager` of version N + 1 depending on which
controller manager holds the migration lease. No controller will ever be running
under both controller managers at any time.

In a rolling manner, create a new control plane node of version N + 1 and bring down
one of version N until the control plane contains only nodes of version N + 1.
If a rollback from version N + 1 to N is required, add nodes of version N with Leader
Migration enabled for `kube-controller-manager` back to the control plane, replacing
one of version N + 1 each time until there are only nodes of version N.
-->
### 升级控制平面

现在，控制平面同时包含 N 和 N+1 版本的节点。
版本 N 的节点仅运行 `kube-controller-manager`，而版本 N+1 的节点同时运行
`kube-controller-manager` 和 `cloud-controller-manager`。
根据配置所指定，已迁移的控制器在版本 N 的 `kube-controller-manager` 或版本
N+1 的 `cloud-controller-manager` 下运行，具体取决于哪个控制器管理器拥有迁移租约对象。
任何时候都不会有同一个控制器在两个控制器管理器下运行。

以滚动的方式创建一个新的版本为 N+1 的控制平面节点，并将版本 N 中的一个关闭，
直到控制平面仅包含版本为 N+1 的节点。
如果需要从 N+1 版本回滚到 N 版本，则将 `kube-controller-manager` 启用了领导者迁移的、
且版本为 N 的节点添加回控制平面，每次替换 N+1 版本中的一个，直到只有版本 N 的节点为止。

<!--
### (Optional) Disable Leader Migration {#disable-leader-migration}

Now that the control plane has been upgraded to run both `kube-controller-manager`
and `cloud-controller-manager` of version N + 1, Leader Migration has finished its
job and can be safely disabled to save one Lease resource. It is safe to re-enable
Leader Migration for the rollback in the future.

In a rolling manager, update manifest of `cloud-controller-manager` to unset both 
`--enable-leader-migration` and `--leader-migration-config=` flag, also remove the
mount of `/etc/leadermigration.conf`, and finally remove `/etc/leadermigration.conf`. 
To re-enable Leader Migration, recreate the configuration file and add its mount and
the flags that enable Leader Migration back to `cloud-controller-manager`.
-->
### （可选）禁用领导者迁移 {#disable-leader-migration}

现在，控制平面已经完成升级，同时运行版本 N+1 的 `kube-controller-manager`
和 `cloud-controller-manager`。领导者迁移的任务已经结束，可以被安全地禁用以节省一个
Lease 资源。在将来可以安全地重新启用领导者迁移，以完成回滚。

在滚动管理器中，更新 `cloud-controller-manager` 的清单以同时取消设置
`--enable-leader-migration` 和 `--leader-migration-config=` 标志，并删除
`/etc/leadermigration.conf` 的挂载，最后删除 `/etc/leadermigration.conf`。
要重新启用领导者迁移，请重新创建配置文件，并将其挂载和启用领导者迁移的标志添加回到
`cloud-controller-manager`。

<!--
### Default Configuration

Starting Kubernetes 1.22, Leader Migration provides a default configuration suitable
for the default controller-to-manager assignment.
The default configuration can be enabled by setting `--enable-leader-migration` but
without `--leader-migration-config=`.

For `kube-controller-manager` and `cloud-controller-manager`, if there are no flags
that enable any in-tree cloud provider or change ownership of controllers, the
default configuration can be used to avoid manual creation of the configuration file.
-->
### 默认配置 {#default-configuration}

从 Kubernetes 1.22 开始，领导者迁移提供了一个默认配置，它适用于控制器与管理器间默认的分配关系。
可以通过设置 `--enable-leader-migration`，但不设置 `--leader-migration-config=`
来启用默认配置。

对于 `kube-controller-manager` 和 `cloud-controller-manager`，如果没有用参数来启用树内云驱动或者改变控制器属主，
则可以使用默认配置来避免手动创建配置文件。

<!--
### Special case: migrating the Node IPAM controller {#node-ipam-controller-migration}

If your cloud provider provides an implementation of Node IPAM controller, you should
switch to the implementation in `cloud-controller-manager`. Disable Node IPAM
controller in `kube-controller-manager` of version N + 1 by adding
`--controllers=*,-nodeipam` to its flags. Then add `nodeipam` to the list of migrated
controllers.
-->
### 特殊情况：迁移节点 IPAM 控制器 {#node-ipam-controller-migration}

如果你的云供应商提供了节点 IPAM 控制器的实现，你应该切换到 `cloud-controller-manager` 中的实现。
通过在其标志中添加 `--controllers=*,-nodeipam` 来禁用 N+1 版本的 `kube-controller-manager` 中的节点 IPAM 控制器。
然后将 `nodeipam` 添加到迁移的控制器列表中。

```yaml
# 通配符版本，带有 nodeipam
kind: LeaderMigrationConfiguration
apiVersion: controllermanager.config.k8s.io/v1
leaderName: cloud-provider-extraction-migration
controllerLeaders:
  - name: route
    component: *
  - name: service
    component: *
  - name: cloud-node-lifecycle
    component: *
  - name: nodeipam
-   component: *
```

## {{% heading "whatsnext" %}}
<!--
- Read the [Controller Manager Leader Migration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cloud-provider/2436-controller-manager-leader-migration)
  enhancement proposal.
-->
- 阅读[领导者迁移控制器管理器](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cloud-provider/2436-controller-manager-leader-migration)
  改进建议提案。

