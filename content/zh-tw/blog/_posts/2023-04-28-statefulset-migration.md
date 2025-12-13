---
layout: blog
title: "Kubernetes 1.27: StatefulSet 啓動序號簡化了遷移"
date: 2023-04-28
slug: statefulset-start-ordinal
---

<!--
layout: blog
title: "Kubernetes 1.27: StatefulSet Start Ordinal Simplifies Migration"
date: 2023-04-28
slug: statefulset-start-ordinal
-->

<!--
**Author**: Peter Schuurman (Google)
-->
**作者：** Peter Schuurman (Google)

**譯者：** Xin Li (DaoCloud)

<!--
Kubernetes v1.26 introduced a new, alpha-level feature for
[StatefulSets](/docs/concepts/workloads/controllers/statefulset/) that controls
the ordinal numbering of Pod replicas. As of Kubernetes v1.27, this feature is
now beta. Ordinals can start from arbitrary
non-negative numbers. This blog post will discuss how this feature can be
used.
-->
Kubernetes v1.26 爲 [StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/)
引入了一個新的 Alpha 級別特性，可以控制 Pod 副本的序號。
從 Kubernetes v1.27 開始，此特性進級到 Beta 階段。序數可以從任意非負數開始，
這篇博文將討論如何使用此功能。

<!--
## Background

StatefulSets ordinals provide sequential identities for pod replicas. When using
[`OrderedReady` Pod management](/docs/tutorials/stateful-application/basic-stateful-set/#orderedready-pod-management)
Pods are created from ordinal index `0` up to `N-1`.
-->
## 背景

StatefulSet 序號爲 Pod 副本提供順序標識。當使用
[`OrderedReady` Pod 管理策略](/docs/tutorials/stateful-application/basic-stateful-set/#orderedready-pod-management)時，
Pod 是從序號索引 `0` 到 `N-1` 順序創建的。

<!--
With Kubernetes today, orchestrating a StatefulSet migration across clusters is
challenging. Backup and restore solutions exist, but these require the
application to be scaled down to zero replicas prior to migration. In today's
fully connected world, even planned application downtime may not allow you to
meet your business goals. You could use
[Cascading Delete](/docs/tutorials/stateful-application/basic-stateful-set/#cascading-delete)
or
[On Delete](/docs/tutorials/stateful-application/basic-stateful-set/#on-delete)
to migrate individual pods, however this is error prone and tedious to manage.
You lose the self-healing benefit of the StatefulSet controller when your Pods
fail or are evicted.
-->
如今使用 Kubernetes 跨叢集編排 StatefulSet 遷移具有挑戰性。
雖然存在備份和恢復解決方案，但這些解決方案需要在遷移之前將應用程式的副本數縮爲 0。
在當今這個完全互聯的世界中，即使是計劃內的應用停機可能也無法實現你的業務目標。

你可以使用[級聯刪除](/zh-cn/docs/tutorials/stateful-application/basic-stateful-set/#cascading-delete)或
[OnDelete 策略](/zh-cn/docs/tutorials/stateful-application/basic-stateful-set/#on-delete)來遷移單個 Pod，
但是這很容易出錯並且管理起來很乏味。
當你的 Pod 出現故障或被逐出時，你將失去 StatefulSet 控制器的自我修復優勢。

<!--
Kubernetes v1.26 enables a StatefulSet to be responsible for a range of ordinals
within a range {0..N-1} (the ordinals 0, 1, ... up to N-1).
With it, you can scale down a range
{0..k-1} in a source cluster, and scale up the complementary range {k..N-1}
in a destination cluster, while maintaining application availability. This
enables you to retain *at most one* semantics (meaning there is at most one Pod
with a given identity running in a StatefulSet) and
[Rolling Update](/docs/tutorials/stateful-application/basic-stateful-set/#rolling-update)
behavior when orchestrating a migration across clusters.
-->
Kubernetes v1.26 使 StatefulSet 能夠負責 {0..N-1} 範圍內的一系列序數（序數 0、1、... 直到 N-1）。
有了它，你可以縮小源叢集中的範圍 {0..k-1}，並擴大目標叢集中的互補範圍 {k..N-1}，同時保證應用程式可用性。
這使你在編排跨叢集遷移時保留**至多一個**語義（意味着最多有一個具有給定身份的
Pod 在 StatefulSet 中運行）和[滾動更新](/zh-cn/docs/tutorials/stateful-application/basic-stateful-set/#rolling-update）行爲。

<!--
## Why would I want to use this feature?

Say you're running your StatefulSet in one cluster, and need to migrate it out
to a different cluster. There are many reasons why you would need to do this:
 * **Scalability**: Your StatefulSet has scaled too large for your cluster, and
   has started to disrupt the quality of service for other workloads in your
   cluster.
 * **Isolation**: You're running a StatefulSet in a cluster that is accessed 
   by multiple users, and namespace isolation isn't sufficient.
 * **Cluster Configuration**: You want to move your StatefulSet to a different
   cluster to use some environment that is not available on your current
   cluster.
 * **Control Plane Upgrades**: You want to move your StatefulSet to a cluster
   running an upgraded control plane, and can't handle the risk or downtime of
   in-place control plane upgrades.
-->
## 我爲什麼要使用此功能？

假設你在一個叢集中運行 StatefulSet，並且需要將其遷移到另一個叢集。你需要這樣做的原因有很多：

 * **可擴展性**：你的 StatefulSet 對於你的叢集而言規模過大，並且已經開始破壞叢集中其他工作負載的服務質量。
 * **隔離性**：你在一個供多個使用者訪問的叢集中運行 StatefulSet，而命名空間隔離是不夠的。
 * **叢集設定**：你想將 StatefulSet 遷移到另一個叢集，以使用在當前叢集上不存在的某些環境。
 * **控制平面升級**：你想將 StatefulSet 遷移到運行着較高版本控制平面，
   並且無法處承擔就地升級控制平面所產生的風險或預留停機時間。

<!--
## How do I use it?

Enable the `StatefulSetStartOrdinal` feature gate on a cluster, and create a
StatefulSet with a customized `.spec.ordinals.start`.
-->
## 我該如何使用它？

在叢集上啓用 `StatefulSetStartOrdinal` 特性門控，並使用自定義的
`.spec.ordinals.start` 創建一個 StatefulSet。

<!--
## Try it out

In this demo, I'll use the new mechanism to migrate a
StatefulSet from one Kubernetes cluster to another. The
[redis-cluster](https://github.com/bitnami/charts/tree/main/bitnami/redis-cluster)
Bitnami Helm chart will be used to install Redis.
-->
## 試試看吧

在此演示中，我將使用新機制將 StatefulSet 從一個 Kubernetes 叢集遷移到另一個。
[redis-cluster](https://github.com/bitnami/charts/tree/main/bitnami/redis-cluster)
Bitnami Helm chart 將用於安裝 Redis。

<!--
Tools Required:
 * [yq](https://github.com/mikefarah/yq)
 * [helm](https://helm.sh/docs/helm/helm_install/)
-->
所需工具：

 * [yq](https://github.com/mikefarah/yq)
 * [helm](https://helm.sh/docs/helm/helm_install/)

<!--
### Pre-requisites {#demo-pre-requisites}

To do this, I need two Kubernetes clusters that can both access common
networking and storage; I've named my clusters `source` and `destination`.
Specifically, I need:
-->
### 先決條件    {#demo-pre-requisites}

爲此，我需要兩個可以訪問公共網路和儲存的 Kubernetes 叢集；
我已將叢集命名爲 `source` 和 `destination`。具體來說，我需要：

<!--
* The `StatefulSetStartOrdinal` feature gate enabled on both clusters.
* Client configuration for `kubectl` that lets me access both clusters as an
  administrator.
* The same `StorageClass` installed on both clusters, and set as the default
  StorageClass for both clusters. This `StorageClass` should provision
  underlying storage that is accessible from either or both clusters.
* A flat network topology that allows for pods to send and receive packets to
  and from Pods in either clusters. If you are creating clusters on a cloud
  provider, this configuration may be called private cloud or private network.
-->
* 在兩個叢集上都啓用 `StatefulSetStartOrdinal` 特性門控。
* `kubectl` 的客戶端設定允許我以管理員身份訪問這兩個叢集。
* 兩個叢集上都安裝了相同的 `StorageClass`，並設置爲兩個叢集的預設 `StorageClass`。
  這個 `StorageClass` 應該提供可從一個或兩個叢集訪問的底層儲存。
* 一種扁平的網路拓撲，允許 Pod 向任一叢集中的 Pod 發送資料包和從中接收資料包。
  如果你在雲提供商上創建叢集，則此設定可能被稱爲私有云或私有網路。

<!--
1. Create a demo namespace on both clusters:
-->
1. 在兩個叢集上創建一個用於演示的命名空間：

   ```
   kubectl create ns kep-3335
   ```

<!--
2. Deploy a Redis cluster with six replicas in the source cluster:
-->
2. 在 `source` 叢集中部署一個有六個副本的 Redis 叢集：

   ```
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm install redis --namespace kep-3335 \
     bitnami/redis-cluster \
     --set persistence.size=1Gi \
     --set cluster.nodes=6
   ```

<!--
3. Check the replication status in the source cluster:
-->
3. 檢查 `source` 叢集中的副本狀態：

   ```
   kubectl exec -it redis-redis-cluster-0 -- /bin/bash -c \
     "redis-cli -c -h redis-redis-cluster -a $(kubectl get secret redis-redis-cluster -o jsonpath="{.data.redis-password}" | base64 -d) CLUSTER NODES;"
   ```

   ```
   2ce30362c188aabc06f3eee5d92892d95b1da5c3 10.104.0.14:6379@16379 myself,master - 0 1669764411000 3 connected 10923-16383                                                                                                                                              
   7743661f60b6b17b5c71d083260419588b4f2451 10.104.0.16:6379@16379 slave 2ce30362c188aabc06f3eee5d92892d95b1da5c3 0 1669764410000 3 connected                                                                                             
   961f35e37c4eea507cfe12f96e3bfd694b9c21d4 10.104.0.18:6379@16379 slave a8765caed08f3e185cef22bd09edf409dc2bcc61 0 1669764411000 1 connected                                                                                                             
   7136e37d8864db983f334b85d2b094be47c830e5 10.104.0.15:6379@16379 slave 2cff613d763b22c180cd40668da8e452edef3fc8 0 1669764412595 2 connected                                                                                                                    
   a8765caed08f3e185cef22bd09edf409dc2bcc61 10.104.0.19:6379@16379 master - 0 1669764411592 1 connected 0-5460                                                                                                                                                   
   2cff613d763b22c180cd40668da8e452edef3fc8 10.104.0.17:6379@16379 master - 0 1669764410000 2 connected 5461-10922
   ```

<!--
4. Deploy a Redis cluster with zero replicas in the destination cluster:
-->
4. 在 `destination` 叢集中部署一個零副本的 Redis 叢集：

   ```
   helm install redis --namespace kep-3335 \
     bitnami/redis-cluster \
     --set persistence.size=1Gi \
     --set cluster.nodes=0 \
     --set redis.extraEnvVars\[0\].name=REDIS_NODES,redis.extraEnvVars\[0\].value="redis-redis-cluster-headless.kep-3335.svc.cluster.local" \
     --set existingSecret=redis-redis-cluster
   ```

<!--
5. Scale down the `redis-redis-cluster` StatefulSet in the source cluster by 1,
   to remove the replica `redis-redis-cluster-5`:
-->
5. 將源叢集中的 `redis-redis-cluster` StatefulSet 副本數縮小 1，
   以刪除副本 `redis-redis-cluster-5`：

   ```
   kubectl patch sts redis-redis-cluster -p '{"spec": {"replicas": 5}}'
   ```

<!--
6. Migrate dependencies from the source cluster to the destination cluster:

   The following commands copy resources from `source` to `destionation`. Details
   that are not relevant in `destination` cluster are removed (eg: `uid`,
   `resourceVersion`, `status`).

   **Steps for the source cluster**
-->
6. 將依賴從 `source` 叢集遷移到 `destionation` 叢集：
   以下命令將依賴資源從 `source` 複製到 `destionation`，其中與 `destionation`
   叢集無關的詳細資訊已被刪除（例如：`uid`、`resourceVersion`、`status`）。

   <!--
   Note: If using a `StorageClass` with `reclaimPolicy: Delete` configured, you
         should patch the PVs in `source` with `reclaimPolicy: Retain` prior to
         deletion to retain the underlying storage used in `destination`. See
         [Change the Reclaim Policy of a PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/)
         for more details.
   -->

   說明：如果使用設定了 `reclaimPolicy: Delete` 的 `StorageClass`，
        你應該在刪除之前使用 `reclaimPolicy: Retain` 修補 `source` 中的 PV，
        以保留 `destination` 中使用的底層儲存。
        有關詳細資訊，請參閱[更改 PersistentVolume](/zh-cn/docs/tasks/administer-cluster/change-pv-reclaim-policy/)
        的回收策略。
   
   ```
   kubectl get pvc redis-data-redis-redis-cluster-5 -o yaml | yq 'del(.metadata.uid, .metadata.resourceVersion, .metadata.annotations, .metadata.finalizers, .status)' > /tmp/pvc-redis-data-redis-redis-cluster-5.yaml
   kubectl get pv $(yq '.spec.volumeName' /tmp/pvc-redis-data-redis-redis-cluster-5.yaml) -o yaml | yq 'del(.metadata.uid, .metadata.resourceVersion, .metadata.annotations, .metadata.finalizers, .spec.claimRef, .status)' > /tmp/pv-redis-data-redis-redis-cluster-5.yaml
   kubectl get secret redis-redis-cluster -o yaml | yq 'del(.metadata.uid, .metadata.resourceVersion)' > /tmp/secret-redis-redis-cluster.yaml
   ```

   <!--
   **Steps for the destination cluster**

   Note: For the PV/PVC, this procedure only works if the underlying storage system
         that your PVs use can support being copied into `destination`. Storage
         that is associated with a specific node or topology may not be supported.
         Additionally, some storage systems may store addtional metadata about
         volumes outside of a PV object, and may require a more specialized
         sequence to import a volume.
   -->

   **`destination` 叢集中的步驟**

   說明：對於 PV/PVC，此過程僅在你的 PV 使用的底層儲存系統支持複製到 `destination`
        叢集時纔有效。可能不支持與特定節點或拓撲關聯的儲存。此外，某些儲存系統可能會在 PV
        對象之外儲存有關卷的附加元資料，並且可能需要更專門的序列來導入卷。
   
   ```
   kubectl create -f /tmp/pv-redis-data-redis-redis-cluster-5.yaml
   kubectl create -f /tmp/pvc-redis-data-redis-redis-cluster-5.yaml
   kubectl create -f /tmp/secret-redis-redis-cluster.yaml
   ```

<!--
7. Scale up the `redis-redis-cluster` StatefulSet in the destination cluster by
   1, with a start ordinal of 5:
-->
7. 將 `destination` 叢集中的 `redis-redis-cluster` StatefulSet 擴容 1，起始序號爲 5：

   ```
   kubectl patch sts redis-redis-cluster -p '{"spec": {"ordinals": {"start": 5}, "replicas": 1}}'
   ```

<!--
8. Check the replication status in the destination cluster:
-->
8. 檢查 `destination` 叢集中的副本狀態：

   ```
   kubectl exec -it redis-redis-cluster-5 -- /bin/bash -c \
     "redis-cli -c -h redis-redis-cluster -a $(kubectl get secret redis-redis-cluster -o jsonpath="{.data.redis-password}" | base64 -d) CLUSTER NODES;"
   ```

   <!--
   I should see that the new replica (labeled `myself`) has joined the Redis
   cluster (the IP address belongs to a different CIDR block than the
   replicas in the source cluster).
   -->
   我應該看到新副本（標記爲 `myself`）已加入 Redis 叢集（IP
   地址與 `source` 叢集中的副本歸屬於不同的 CIDR 塊）。

   ```
   2cff613d763b22c180cd40668da8e452edef3fc8 10.104.0.17:6379@16379 master - 0 1669766684000 2 connected 5461-10922
   7136e37d8864db983f334b85d2b094be47c830e5 10.108.0.22:6379@16379 myself,slave 2cff613d763b22c180cd40668da8e452edef3fc8 0 1669766685609 2 connected
   2ce30362c188aabc06f3eee5d92892d95b1da5c3 10.104.0.14:6379@16379 master - 0 1669766684000 3 connected 10923-16383
   961f35e37c4eea507cfe12f96e3bfd694b9c21d4 10.104.0.18:6379@16379 slave a8765caed08f3e185cef22bd09edf409dc2bcc61 0 1669766683600 1 connected
   a8765caed08f3e185cef22bd09edf409dc2bcc61 10.104.0.19:6379@16379 master - 0 1669766685000 1 connected 0-5460
   7743661f60b6b17b5c71d083260419588b4f2451 10.104.0.16:6379@16379 slave 2ce30362c188aabc06f3eee5d92892d95b1da5c3 0 1669766686613 3 connected
   ```

<!--
9. Repeat steps #5 to #7 for the remainder of the replicas, until the
   Redis StatefulSet in the source cluster is scaled to 0, and the Redis
   StatefulSet in the destination cluster is healthy with 6 total replicas.
-->
9. 對剩餘的副本重複 #5 到 #7 的步驟，直到 `source` 叢集中的 Redis StatefulSet 副本縮放爲 0，
   並且 `destination` 叢集中的 Redis StatefulSet 健康，總共有 6 個副本。

<!--
## What's Next?

This feature provides a building block for a StatefulSet to be split up across
clusters, but does not prescribe the mechanism as to how the StatefulSet should
be migrated. Migration requires coordination of StatefulSet replicas, along with
orchestration of the storage and network layer. This is dependent on the storage
and connectivity requirements of the application installed by the StatefulSet.
Additionally, many StatefulSets are managed by
[operators](/docs/concepts/extend-kubernetes/operator/), which adds another
layer of complexity to migration.
-->
## 接下來？

此特性爲跨叢集拆分 StatefulSet 提供了一項基本支撐技術，但沒有規定 StatefulSet 的遷移機制。
遷移需要對 StatefulSet 副本的協調，以及對儲存和網路層的編排。這取決於使用 StatefulSet
安裝的應用程式的儲存和網路連接要求。此外，許多 StatefulSet 由
[operator](/zh-cn/docs/concepts/extend-kubernetes/operator/) 管理，這也增加了額外的遷移複雜性。

<!--
If you're interested in building enhancements to make these processes easier,
get involved with
[SIG Multicluster](https://github.com/kubernetes/community/blob/master/sig-multicluster)
to contribute!
-->
如果你有興趣構建增強功能以簡化這些過程，請參與
[SIG Multicluster](https://github.com/kubernetes/community/blob/master/sig-multicluster)
做出貢獻！


