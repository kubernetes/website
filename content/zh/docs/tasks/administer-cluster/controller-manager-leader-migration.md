---
title: "将重复的控制平面迁至云控制器管理器"
linkTitle: "将重复的控制平面迁至云控制器管理器"
content_type: task
---

<!--
---
reviewers:
- jpbetz
- cheftako
title: "Migrate Replicated Control Plane To Use Cloud Controller Manager"
linkTitle: "Migrate Replicated Control Plane To Use Cloud Controller Manager"
content_type: task
---
-->

<!-- overview -->

{{< feature-state state="alpha" for_k8s_version="v1.21" >}}

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="云管理控制器是">}}

<!--
## Background

As part of the [cloud provider extraction effort](https://kubernetes.io/blog/2019/04/17/the-future-of-cloud-providers-in-kubernetes/),
all cloud specific controllers must be moved out of the `kube-controller-manager`. 
All existing clusters that run cloud controllers in the `kube-controller-manager` must migrate to instead run the controllers in a cloud provider specific `cloud-controller-manager`.

Leader Migration provides a mechanism in which HA clusters can safely migrate "cloud specific" controllers between 
the `kube-controller-manager` and the `cloud-controller-manager` via a shared resource lock between the two components while upgrading the replicated control plane. 
For a single-node control plane, or if unavailability of controller managers can be tolerated during the upgrade, Leader Migration is not needed and this guide can be ignored.
-->
## 背景
作为[云驱动提取工作](https://kubernetes.io/blog/2019/04/17/the-future-of-cloud-providers-in-kubernetes/)
的一部分，所有特定于云的控制器都必须移出 `kube-controller-manager`。
所有在 `kube-controller-manager` 中运行云控制器的现有集群必须迁移到云驱动特定的 `cloud-controller-manager` 中运行控制器。

领导者迁移提供了一种机制，使得 HA 集群可以通过两个组件之间的共享资源锁定，
安全地将“特定于云”的控制器从 `kube-controller-manager` 和迁移到`cloud-controller-manager`，
同时升级复制的控制平面。
对于单节点控制平面，或者在升级过程中可以容忍控制器管理器不可用的情况，则不需要领导者迁移，并且可以忽略本指南。

<!--
Leader Migration is an alpha feature that is disabled by default and it requires `--enable-leader-migration` to be set on controller managers. 
It can be enabled by setting the feature gate `ControllerManagerLeaderMigration` plus `--enable-leader-migration` on `kube-controller-manager` or `cloud-controller-manager`.
Leader Migration only applies during the upgrade and can be safely disabled or left enabled after the upgrade is complete.

This guide walks you through the manual process of upgrading the control plane from `kube-controller-manager` with 
built-in cloud provider to running both `kube-controller-manager` and `cloud-controller-manager`. 
If you use a tool to administrator the cluster, please refer to the documentation of the tool and the cloud provider for more details.
-->
领导者迁移是一项 Alpha 阶段功能，默认情况下处于禁用状态，它需要设置控制器管理器的 `--enable-leader-migration` 参数。
可以通过在 `kube-controller-manager` 或 `cloud-controller-manager` 上设置特性门控 
`ControllerManagerLeaderMigration` 和 `--enable-leader-migration` 来启用。
领导者迁移仅在升级期间适用，并且可以安全地禁用，也可以在升级完成后保持启用状态。

本指南将引导你手动将控制平面从内置的云驱动的 `kube-controller-manager` 升级为
同时运行 `kube-controller-manager` 和 `cloud-controller-manager`。
如果使用工具来管理群集，请参阅对应工具和云驱动的文档以获取更多详细信息。

## {{% heading "prerequisites" %}}

<!--
It is assumed that the control plane is running Kubernetes version N and to be upgraded to version N + 1. 
Although it is possible to migrate within the same version, ideally the migration should be performed as part of a upgrade so that changes of configuration can be aligned to releases. 
The exact versions of N and N + 1 depend on each cloud provider. For example, if a cloud provider builds a `cloud-controller-manager` to work with Kubernetes 1.22, then N can be 1.21 and N + 1 can be 1.22.

The control plane nodes should run `kube-controller-manager` with Leader Election enabled through `--leader-elect=true`. 
As of version N, an in-tree cloud privider must be set with `--cloud-provider` flag and `cloud-controller-manager` should not yet be deployed.
-->
假定控制平面正在运行 Kubernetes N 版本，并且要升级到 N+1 版本。
尽管可以在同一版本中进行迁移，但理想情况下，迁移应作为升级的一部分执行，以便可以更改配置与发布保持一致。
N 和 N+1的确切版本取决于各个云驱动。例如，如果云驱动构建了一个可与 Kubernetes 1.22 配合使用的 `cloud-controller-manager`，
则 N 可以为 1.21，N+1 可以为 1.22。

控制平面节点应运行 `kube-controller-manager`，并通过 `--leader-elect=true` 启用领导者选举。
从版本 N 开始，树内云驱动必须设置 `--cloud-provider` 标志，而且 `cloud-controller-manager` 尚未部署。

<!--
The out-of-tree cloud provider must have built a `cloud-controller-manager` with Leader Migration implementation. 
If the cloud provider imports `k8s.io/cloud-provider` and `k8s.io/controller-manager` of version v0.21.0 or later, Leader Migration will be avaliable.

This guide assumes that kubelet of each control plane node starts `kube-controller-manager` 
and `cloud-controller-manager` as static pods defined by their manifests. 
If the components run in a different setting, please adjust the steps accordingly.

For authorization, this guide assumes that the cluser uses RBAC. 
If another authorization mode grants permissions to `kube-controller-manager` and `cloud-controller-manager` components, 
please grant the needed access in a way that matches the mode.
-->
树外云驱动必须已经构建了一个实现领导者迁移的 `cloud-controller-manager`。
如果云驱动导入了 v0.21.0 或更高版本的 `k8s.io/cloud-provider` 和 `k8s.io/controller-manager`，
则可以进行领导者迁移。

本指南假定每个控制平面节点的 kubelet 以静态 pod 的形式启动 `kube-controller-manager`
和 `cloud-controller-manager`，静态 pod 的定义在清单文件中。
如果组件以其他设置运行，请相应地调整步骤。

为了获得授权，本指南假定集群使用 RBAC。
如果其他授权模式授予 `kube-controller-manager` 和 `cloud-controller-manager` 组件权限，
请以与该模式匹配的方式授予所需的访问权限。

<!-- steps -->

<!--
### Grant access to Migration Lease

The default permissions of the controller manager allow only accesses to their main Lease.
In order for the migration to work, accesses to another Lease are required.

You can grant `kube-controller-manager` full access to the leases API by modifying 
the `system::leader-locking-kube-controller-manager` role. 
This task guide assumes that the name of the migration lease is `cloud-provider-extraction-migration`.

`kubectl patch -n kube-system role 'system::leader-locking-kube-controller-manager' -p '{"rules": [ {"apiGroups":[ "coordination.k8s.io"], "resources": ["leases"], "resourceNames": ["cloud-provider-extraction-migration"], "verbs": ["create", "list", "get", "update"] } ]}' --type=merge`

Do the same to the `system::leader-locking-cloud-controller-manager` role.

`kubectl patch -n kube-system role 'system::leader-locking-cloud-controller-manager' -p '{"rules": [ {"apiGroups":[ "coordination.k8s.io"], "resources": ["leases"], "resourceNames": ["cloud-provider-extraction-migration"], "verbs": ["create", "list", "get", "update"] } ]}' --type=merge`
-->
### 授予访问迁移 Lease 的权限

控制器管理器的默认权限仅允许访问其主 Lease 对象。为了使迁移正常进行，需要访问其他 Lease 对象。

你可以通过修改 `system::leader-locking-kube-controller-manager` 角色来授予
`kube-controller-manager` 对 Lease API 的完全访问权限。
本任务指南假定迁移 Lease 的名称为 `cloud-provider-extraction-migration`。

`kubectl patch -n kube-system role 'system::leader-locking-kube-controller-manager' -p '{"rules": [ {"apiGroups":[ "coordination.k8s.io"], "resources": ["leases"], "resourceNames": ["cloud-provider-extraction-migration"], "verbs": ["create", "list", "get", "update"] } ]}' --type=merge`

对 `system::leader-locking-cloud-controller-manager` 角色执行相同的操作。

`kubectl patch -n kube-system role 'system::leader-locking-cloud-controller-manager' -p '{"rules": [ {"apiGroups":[ "coordination.k8s.io"], "resources": ["leases"], "resourceNames": ["cloud-provider-extraction-migration"], "verbs": ["create", "list", "get", "update"] } ]}' --type=merge`

<!--
### Initial Leader Migration configuration

Leader Migration requires a configuration file representing the state of controller-to-manager assignment. 
At this moment, with in-tree cloud provider, `kube-controller-manager` runs `route`, `service`, and `cloud-node-lifecycle`. 
The following example configuration shows the assignment.
-->
### 初始领导者迁移配置

领导者迁移需要一个表示控制器到管理器分配状态的配置文件。
目前，对于树内云驱动，`kube-controller-manager` 运行 `route`、`service` 和 `cloud-node-lifecycle`。
以下示例配置显示了分配。

```yaml
kind: LeaderMigrationConfiguration
apiVersion: controllermanager.config.k8s.io/v1alpha1
leaderName: cloud-provider-extraction-migration
resourceLock: leases
controllerLeaders:
  - name: route
    component: kube-controller-manager
  - name: service
    component: kube-controller-manager
  - name: cloud-node-lifecycle
    component: kube-controller-manager
```

<!--
On each control plane node, save the content to `/etc/leadermigration.conf`, 
and update the manifest of `kube-controller-manager` so that the file is mounted inside the container at the same location. 
Also, update the same manifest to add the following arguments:

- `--feature-gates=ControllerManagerLeaderMigration=true` to enable Leader Migration which is an alpha feature
- `--enable-leader-migration` to enable Leader Migration on the controller manager
- `--leader-migration-config=/etc/leadermigration.conf` to set configuration file

Restart `kube-controller-manager` on each node. At this moment, `kube-controller-manager` has leader migration enabled and is ready for the migration.
-->
在每个控制平面节点上，将内容保存到 `/etc/leadermigration.conf` 中，
并更新 `kube-controller-manager` 清单，以便将文件安装在容器内的同一位置。
另外，更新相同的清单，添加以下参数：

- `--feature-gates=ControllerManagerLeaderMigration=true` 启用领导者迁移（这是 Alpha 版功能）
- `--enable-leader-migration` 在控制器管理器上启用领导者迁移
- `--leader-migration-config=/etc/leadermigration.conf` 设置配置文件

在每个节点上重新启动 `kube-controller-manager`。这时，`kube-controller-manager`
已启用领导者迁移，并准备进行迁移。

<!--
### Deploy Cloud Controller Manager

In version N + 1, the desired state of controller-to-manager assignment can be represented by a new configuration file, shown as follows. 
Please note `component` field of each `controllerLeaders` changing from `kube-controller-manager` to `cloud-controller-manager`.
-->
### 部署云控制器管理器

在 N+1 版本中，控制器到管理器分配的期望状态可以由新的配置文件表示，如下所示。
请注意，每个 `controllerLeaders` 的 `component` 字段从 `kube-controller-manager` 更改为 `cloud-controller-manager`。

```yaml
kind: LeaderMigrationConfiguration
apiVersion: controllermanager.config.k8s.io/v1alpha1
leaderName: cloud-provider-extraction-migration
resourceLock: leases
controllerLeaders:
  - name: route
    component: cloud-controller-manager
  - name: service
    component: cloud-controller-manager
  - name: cloud-node-lifecycle
    component: cloud-controller-manager
```

<!--
When creating control plane nodes of version N + 1, the content should be deploy to `/etc/leadermigration.conf`. 
The manifest of `cloud-controller-manager` should be updated to mount the configuration file in 
the same manner as `kube-controller-manager` of version N. Similarly, add `--feature-gates=ControllerManagerLeaderMigration=true`,
`--enable-leader-migration`, and `--leader-migration-config=/etc/leadermigration.conf` to the arguments of `cloud-controller-manager`.

Create a new control plane node of version N + 1 with the updated `cloud-controller-manager` manifest, 
and with the `--cloud-provider` flag unset for `kube-controller-manager`.
`kube-controller-manager` of version N + 1 MUST NOT have Leader Migration enabled because, 
with an external cloud provider, it does not run the migrated controllers anymore and thus it is not involved in the migration.

Please refer to [Cloud Controller Manager Administration](/docs/tasks/administer-cluster/running-cloud-controller/)
for more detail on how to deploy `cloud-controller-manager`.
-->

当创建 N+1 版本的控制平面节点时，应将内容部署到 `/etc/leadermigration.conf`。
应该更新 `cloud-controller-manager` 清单，以与 N 版本的 `kube-controller-manager` 相同的方式挂载配置文件。
类似地，添加 `--feature-gates=ControllerManagerLeaderMigration=true`、`--enable-leader-migration` 
和 `--leader-migration-config=/etc/leadermigration.conf` 到 `cloud-controller-manager` 的参数中。

使用已更新的 `cloud-controller-manager` 清单创建一个新的 N+1 版本的控制平面节点。
并且没有设置 `kube-controller-manager` 的 `--cloud-provider` 标志。
N+1 版本的 `kube-controller-manager` 不能启用领导者迁移，
因为在使用外部云驱动的情况下，它不再运行已迁移的控制器，因此不参与迁移。

请参阅[云控制器管理器管理](/zh/docs/tasks/administer-cluster/running-cloud-controller/) 
了解有关如何部署 `cloud-controller-manager` 的更多细节。

<!--
### Upgrade Control Plane

The control plane now contains nodes of both version N and N + 1. 
The nodes of version N run `kube-controller-manager` only, 
and these of version N + 1 run both `kube-controller-manager` and `cloud-controller-manager`. 
The migrated controllers, as specified in the configuration, are running under either `kube-controller-manager` of 
version N or `cloud-controller-manager` of version N + 1 depending on which controller manager holds the migration lease.
No controller will ever be running under both controller managers at any time.

In a rolling manner, create a new control plane node of version N + 1 and bring down one of version N + 1 until the control plane contains only nodes of version N + 1.
If a rollback from version N + 1 to N is required, add nodes of version N with Leader Migration enabled for `kube-controller-manager` back to the control plane, replacing one of version N + 1 each time until there are only nodes of version N.
-->
### 升级控制平面

现在，控制平面包含 N 和 N+1 版本的节点。
N 版本的节点仅运行 `kube-controller-manager`，而 N+1 版本的节点同时运行
`kube-controller-manager` 和 `cloud-controller-manager`。
根据配置所指定，已迁移的控制器在 N 版本的 `kube-controller-manager` 或 N+1 版本的
`cloud-controller-manager` 下运行，
具体取决于哪个控制器管理器拥有迁移  Lease 对象。任何时候都不存在一个控制器在两个控制器管理器下运行。

以滚动的方式创建一个新的版本为 N+1 的控制平面节点，并将 N+1 版本中的一个关闭，
直到控制平面仅包含版本为 N+1 的节点。
如果需要从 N+1 版本回滚到 N 版本，则将启用了领导者迁移的 `kube-controller-manager`
且版本为 N 的节点添加回控制平面，每次替换 N+1 版本的一个，直到只有 N 版本的节点为止。

<!--
### (Optional) Disable Leader Migration {#disable-leader-migration}

Now that the control plane has been upgraded to run both `kube-controller-manager` and `cloud-controller-manager` of version N + 1, 
Leader Migration has finished its job and can be safely disabled to save one Lease resource. 
It is safe to re-enable Leader Migration for the rollback in the future.

In a rolling manager, update manifest of `cloud-controller-manager` to unset both 
`--enable-leader-migration` and `--leader-migration-config=` flag, 
also remove the mount of `/etc/leadermigration.conf`, and finally remove `/etc/leadermigration.conf`. 
To re-enable Leader Migration, recreate the configuration file and add its mount and the flags that enable Leader Migration back to `cloud-controller-manager`.
-->
### （可选）禁用领导者迁移 {#disable-leader-migration}

现在，控制平面已经升级，可以同时运行 N+1 版本的 `kube-controller-manager` 和 `cloud-controller-manager` 了。
领导者迁移已经完成工作，可以安全地禁用以节省一个 Lease 资源。
在将来可以安全地重新启用领导者迁移以完成回滚。

在滚动管理器中，更新 `cloud-controller-manager` 的清单以同时取消设置 `--enable-leader-migration`
和 `--leader-migration-config=` 标志，并删除 `/etc/leadermigration.conf` 的挂载。 
最后删除 `/etc/leadermigration.conf`。
要重新启用领导者迁移，请重新创建配置文件，并将其挂载和启用领导者迁移的标志添加回到 `cloud-controller-manager`。

## {{% heading "whatsnext" %}}
<!--
- Read the [Controller Manager Leader Migration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cloud-provider/2436-controller-manager-leader-migration) enhancement proposal
-->
- 阅读[领导者迁移控制器管理器](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cloud-provider/2436-controller-manager-leader-migration)改进建议