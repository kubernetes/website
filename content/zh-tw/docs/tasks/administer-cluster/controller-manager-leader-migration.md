---
title: 遷移多副本的控制面以使用雲控制器管理器
linkTitle: 遷移多副本的控制面以使用雲控制器管理器
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

作爲[雲驅動提取工作](/blog/2019/04/17/the-future-of-cloud-providers-in-kubernetes/)
的一部分，所有特定於雲的控制器都必須移出 `kube-controller-manager`。
所有在 `kube-controller-manager` 中運行雲控制器的現有叢集必須遷移到特定於雲廠商的
`cloud-controller-manager` 中運行這些控制器。

領導者遷移（Leader Migration）提供了一種機制，使得 HA 叢集可以通過這兩個組件之間共享資源鎖，
在升級多副本的控制平面時，安全地將“特定於雲”的控制器從 `kube-controller-manager` 遷移到
`cloud-controller-manager`。
對於單節點控制平面，或者在升級過程中可以容忍控制器管理器不可用的情況，則不需要領導者遷移，
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
領導者遷移可以通過在 `kube-controller-manager` 或 `cloud-controller-manager` 上設置
`--enable-leader-migration` 來啓用。
領導者遷移僅在升級期間適用，並且在升級完成後可以安全地禁用或保持啓用狀態。

本指南將引導你手動將控制平面從內置的雲驅動的 `kube-controller-manager` 升級爲
同時運行 `kube-controller-manager` 和 `cloud-controller-manager`。
如果使用某種工具來部署和管理叢集，請參閱對應工具和雲驅動的文檔以獲取遷移的具體說明。

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
假定控制平面正在運行 Kubernetes 版本 N，要升級到版本 N+1。
儘管可以在同一版本內進行遷移，但理想情況下，遷移應作爲升級的一部分執行，
以便可以設定的變更可以與發佈版本變化對應起來。
N 和 N+1 的確切版本值取決於各個雲廠商。例如，如果雲廠商構建了一個可與 Kubernetes 1.24
配合使用的 `cloud-controller-manager`，則 N 可以爲 1.23，N+1 可以爲 1.24。

控制平面節點應運行 `kube-controller-manager` 並啓用領導者選舉，這也是預設設置。
在版本 N 中，樹內雲驅動必須設置 `--cloud-provider` 標誌，而且 `cloud-controller-manager`
應該尚未部署。

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
樹外雲驅動必須已經構建了一個實現了領導者遷移的 `cloud-controller-manager`。
如果雲驅動導入了 v0.21.0 或更高版本的 `k8s.io/cloud-provider` 和 `k8s.io/controller-manager`，
則可以進行領導者遷移。
但是，對 v0.22.0 以下的版本，領導者遷移是一項 Alpha 階段功能，需要在 `cloud-controller-manager`
中啓用特性門控 `ControllerManagerLeaderMigration`。

本指南假定每個控制平面節點的 kubelet 以靜態 Pod 的形式啓動 `kube-controller-manager`
和 `cloud-controller-manager`，靜態 Pod 的定義在清單檔案中。
如果組件以其他設置運行，請相應地調整這裏的步驟。

關於鑑權，本指南假定叢集使用 RBAC。如果其他鑑權模式授予 `kube-controller-manager`
和 `cloud-controller-manager` 組件權限，請以與該模式匹配的方式授予所需的訪問權限。

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
### 授予訪問遷移租約的權限

控制器管理器的預設權限僅允許訪問其主租約（Lease）對象。爲了使遷移正常進行，
需要授權它訪問其他 Lease 對象。

你可以通過修改 `system::leader-locking-kube-controller-manager` 角色來授予
`kube-controller-manager` 對 Lease API 的完全訪問權限。
本任務指南假定遷移 Lease 的名稱爲 `cloud-provider-extraction-migration`。

```shell
kubectl patch -n kube-system role 'system::leader-locking-kube-controller-manager' -p '{"rules": [ {"apiGroups":[ "coordination.k8s.io"], "resources": ["leases"], "resourceNames": ["cloud-provider-extraction-migration"], "verbs": ["create", "list", "get", "update"] } ]}' --type=merge
```

對 `system::leader-locking-cloud-controller-manager` 角色執行相同的操作。

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
### 初始領導者遷移設定

領導者遷移可以選擇使用一個表示如何將控制器分配給不同管理器的設定檔案。
目前，對於樹內雲驅動，`kube-controller-manager` 運行 `route`、`service` 和
`cloud-node-lifecycle`。以下示例設定顯示的是這種分配。

領導者遷移可以不指定設定的情況下啓用。請參閱[預設設定](#default-configuration) 
以獲取更多詳細資訊。

```yaml
kind: LeaderMigrationConfiguration
apiVersion: controllermanager.config.k8s.io/v1
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
Alternatively, because the controllers can run under either controller managers,
setting `component` to `*` for both sides makes the configuration file consistent
between both parties of the migration.
-->
或者，由於控制器可以在任一控制器管理器下運行，因此將雙方的 `component` 設置爲 `*`
可以使遷移雙方的設定檔案保持一致。

```yaml
# 通配符版本
kind: LeaderMigrationConfiguration
apiVersion: controllermanager.config.k8s.io/v1
leaderName: cloud-provider-extraction-migration
resourceLock: leases
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
在每個控制平面節點上，請將如上內容保存到 `/etc/leadermigration.conf` 中，
並更新 `kube-controller-manager` 清單，以便將檔案掛載到容器內的同一位置。
另外，請更新同一清單，添加以下參數：

- `--enable-leader-migration` 在控制器管理器上啓用領導者遷移
- `--leader-migration-config=/etc/leadermigration.conf` 設置設定檔案

在每個節點上重新啓動 `kube-controller-manager`。這時，`kube-controller-manager`
已啓用領導者遷移，爲遷移準備就緒。

<!--
### Deploy Cloud Controller Manager

In version N + 1, the desired state of controller-to-manager assignment can be
represented by a new configuration file, shown as follows. Please note `component`
field of each `controllerLeaders` changing from `kube-controller-manager` to
`cloud-controller-manager`. Alternatively, use the wildcard version mentioned above,
which has the same effect.
-->
### 部署雲控制器管理器

在版本 N+1 中，如何將控制器分配給不同管理器的預期分配狀態可以由新的設定檔案表示，
如下所示。請注意，各個 `controllerLeaders` 的 `component` 字段從 `kube-controller-manager`
更改爲 `cloud-controller-manager`。
或者，使用上面提到的通配符版本，它具有相同的效果。

```yaml
kind: LeaderMigrationConfiguration
apiVersion: controllermanager.config.k8s.io/v1
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
當創建版本 N+1 的控制平面節點時，應將如上內容寫入到 `/etc/leadermigration.conf`。
你需要更新 `cloud-controller-manager` 的清單，以與版本 N 的 `kube-controller-manager`
相同的方式掛載設定檔案。
類似地，添加 `--enable-leader-migration`
和 `--leader-migration-config=/etc/leadermigration.conf` 到 `cloud-controller-manager`
的參數中。

使用已更新的 `cloud-controller-manager` 清單創建一個新的 N+1 版本的控制平面節點，
同時設置 `kube-controller-manager` 的 `--cloud-provider` 標誌爲 `external`。
版本爲 N+1 的 `kube-controller-manager` 不能啓用領導者遷移，
因爲在使用外部雲驅動的情況下，它不再運行已遷移的控制器，因此不參與遷移。

請參閱[雲控制器管理器管理](/zh-cn/docs/tasks/administer-cluster/running-cloud-controller/) 
瞭解有關如何部署 `cloud-controller-manager` 的更多細節。

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
### 升級控制平面

現在，控制平面同時包含 N 和 N+1 版本的節點。
版本 N 的節點僅運行 `kube-controller-manager`，而版本 N+1 的節點同時運行
`kube-controller-manager` 和 `cloud-controller-manager`。
根據設定所指定，已遷移的控制器在版本 N 的 `kube-controller-manager` 或版本
N+1 的 `cloud-controller-manager` 下運行，具體取決於哪個控制器管理器擁有遷移租約對象。
任何時候都不會有同一個控制器在兩個控制器管理器下運行。

以滾動的方式創建一個新的版本爲 N+1 的控制平面節點，並將版本 N 中的一個關閉，
直到控制平面僅包含版本爲 N+1 的節點。
如果需要從 N+1 版本回滾到 N 版本，則將 `kube-controller-manager` 啓用了領導者遷移的、
且版本爲 N 的節點添加回控制平面，每次替換 N+1 版本中的一個，直到只有版本 N 的節點爲止。

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
### （可選）禁用領導者遷移 {#disable-leader-migration}

現在，控制平面已經完成升級，同時運行版本 N+1 的 `kube-controller-manager`
和 `cloud-controller-manager`。領導者遷移的任務已經結束，可以被安全地禁用以節省一個
Lease 資源。在將來可以安全地重新啓用領導者遷移，以完成回滾。

在滾動管理器中，更新 `cloud-controller-manager` 的清單以同時取消設置
`--enable-leader-migration` 和 `--leader-migration-config=` 標誌，並刪除
`/etc/leadermigration.conf` 的掛載，最後刪除 `/etc/leadermigration.conf`。
要重新啓用領導者遷移，請重新創建設定檔案，並將其掛載和啓用領導者遷移的標誌添加回到
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
### 預設設定 {#default-configuration}

從 Kubernetes 1.22 開始，領導者遷移提供了一個預設設定，它適用於控制器與管理器間預設的分配關係。
可以通過設置 `--enable-leader-migration`，但不設置 `--leader-migration-config=`
來啓用預設設定。

對於 `kube-controller-manager` 和 `cloud-controller-manager`，如果沒有用參數來啓用樹內雲驅動或者改變控制器屬主，
則可以使用預設設定來避免手動創建設定檔案。

<!--
### Special case: migrating the Node IPAM controller {#node-ipam-controller-migration}

If your cloud provider provides an implementation of Node IPAM controller, you should
switch to the implementation in `cloud-controller-manager`. Disable Node IPAM
controller in `kube-controller-manager` of version N + 1 by adding
`--controllers=*,-nodeipam` to its flags. Then add `nodeipam` to the list of migrated
controllers.
-->
### 特殊情況：遷移節點 IPAM 控制器 {#node-ipam-controller-migration}

如果你的雲供應商提供了節點 IPAM 控制器的實現，你應該切換到 `cloud-controller-manager` 中的實現。
通過在其標誌中添加 `--controllers=*,-nodeipam` 來禁用 N+1 版本的 `kube-controller-manager` 中的節點 IPAM 控制器。
然後將 `nodeipam` 添加到遷移的控制器列表中。

```yaml
# 通配符版本，帶有 nodeipam
kind: LeaderMigrationConfiguration
apiVersion: controllermanager.config.k8s.io/v1
leaderName: cloud-provider-extraction-migration
resourceLock: leases
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
- 閱讀[領導者遷移控制器管理器](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cloud-provider/2436-controller-manager-leader-migration)
  改進建議提案。

