---
title: 運行 ZooKeeper，一個分佈式協調系統
content_type: tutorial
weight: 40
---
<!--
reviewers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Running ZooKeeper, A Distributed System Coordinator
content_type: tutorial
weight: 40
-->

<!-- overview -->

<!--
This tutorial demonstrates running [Apache Zookeeper](https://zookeeper.apache.org) on
Kubernetes using [StatefulSets](/docs/concepts/workloads/controllers/statefulset/),
[PodDisruptionBudgets](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budget),
and [PodAntiAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity).
-->
本教程展示了在 Kubernetes 上使用
[StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/)、
[PodDisruptionBudget](/zh-cn/docs/concepts/workloads/pods/disruptions/#pod-disruption-budget) 和
[PodAntiAffinity](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
特性運行 [Apache Zookeeper](https://zookeeper.apache.org)。

## {{% heading "prerequisites" %}}

<!--
Before starting this tutorial, you should be familiar with the following
Kubernetes concepts.
-->
在開始本教程前，你應該熟悉以下 Kubernetes 概念。

- [Pods](/zh-cn/docs/concepts/workloads/pods/)
- [集羣 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)
- [無頭服務（Headless Service）](/zh-cn/docs/concepts/services-networking/service/#headless-services)
- [PersistentVolumes](/zh-cn/docs/concepts/storage/persistent-volumes/)
- [StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/)
- [PodDisruptionBudget](/zh-cn/docs/concepts/workloads/pods/disruptions/#pod-disruption-budget)
- [PodAntiAffinity](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
- [kubectl CLI](/zh-cn/docs/reference/kubectl/kubectl/)

<!--
You must have a cluster with at least four nodes, and each node requires at least 2 CPUs and 4 GiB of memory.
In this tutorial you will cordon and drain the cluster's nodes. **This means that the cluster will terminate
and evict all Pods on its nodes, and the nodes will temporarily become unschedulable.** You should use a dedicated
cluster for this tutorial, or you should ensure that the disruption you cause will not interfere with other tenants.
-->
你需要一個至少包含四個節點的集羣，每個節點至少 2 個 CPU 和 4 GiB 內存。
在本教程中你將會隔離（Cordon）和騰空（Drain ）集羣的節點。
**這意味着集羣節點上所有的 Pod 將會被終止並移除。這些節點也會暫時變爲不可調度**。
在本教程中你應該使用一個獨佔的集羣，或者保證你造成的干擾不會影響其它租戶。

<!--
This tutorial assumes that you have configured your cluster to dynamically provision
PersistentVolumes. If your cluster is not configured to do so, you
will have to manually provision three 20 GiB volumes before starting this
tutorial.
-->
本教程假設你的集羣已配置爲動態製備 PersistentVolume。
如果你的集羣沒有配置成這樣，在開始本教程前，你需要手動準備三個 20 GiB 的卷。

## {{% heading "objectives" %}}

<!--
After this tutorial, you will know the following.

- How to deploy a ZooKeeper ensemble using StatefulSet.
- How to consistently configure the ensemble.
- How to spread the deployment of ZooKeeper servers in the ensemble.
- How to use PodDisruptionBudgets to ensure service availability during planned maintenance.
-->
在學習本教程後，你將熟悉下列內容。

* 如何使用 StatefulSet 部署一個 ZooKeeper ensemble。
* 如何一致地配置 ensemble。
* 如何在 ensemble 中分佈 ZooKeeper 服務器的部署。
* 如何在計劃維護中使用 PodDisruptionBudget 確保服務可用性。

<!-- lessoncontent -->

<!-- 
### ZooKeeper

[Apache ZooKeeper](https://zookeeper.apache.org/doc/current/) is a
distributed, open-source coordination service for distributed applications.
ZooKeeper allows you to read, write, and observe updates to data. Data are
organized in a file system like hierarchy and replicated to all ZooKeeper
servers in the ensemble (a set of ZooKeeper servers). All operations on data
are atomic and sequentially consistent. ZooKeeper ensures this by using the
[Zab](https://pdfs.semanticscholar.org/b02c/6b00bd5dbdbd951fddb00b906c82fa80f0b3.pdf)
consensus protocol to replicate a state machine across all servers in the ensemble.
-->
### ZooKeeper   {#zookeeper-basics}

[Apache ZooKeeper](https://zookeeper.apache.org/doc/current/)
是一個分佈式的開源協調服務，用於分佈式系統。
ZooKeeper 允許你讀取、寫入數據和發現數據更新。
數據按層次結構組織在文件系統中，並複製到 ensemble（一個 ZooKeeper 服務器的集合） 
中所有的 ZooKeeper 服務器。對數據的所有操作都是原子的和順序一致的。
ZooKeeper 通過
[Zab](https://pdfs.semanticscholar.org/b02c/6b00bd5dbdbd951fddb00b906c82fa80f0b3.pdf)
一致性協議在 ensemble 的所有服務器之間複製一個狀態機來確保這個特性。

<!--
The ensemble uses the Zab protocol to elect a leader, and the ensemble cannot write data until that election is complete.
Once complete, the ensemble uses Zab to ensure that it replicates all writes to a quorum before it acknowledges and makes
them visible to clients. Without respect to weighted quorums, a quorum is a majority component of the ensemble containing
the current leader. For instance, if the ensemble has three servers, a component that contains the leader and one other
server constitutes a quorum. If the ensemble can not achieve a quorum, the ensemble cannot write data.
-->
Ensemble 使用 Zab 協議選舉一個領導者，在選舉出領導者前不能寫入數據。
一旦選舉出了領導者，ensemble 使用 Zab 保證所有寫入被複制到一個 quorum，
然後這些寫入操作纔會被確認並對客戶端可用。
如果沒有遵照加權 quorums，一個 quorum 表示包含當前領導者的 ensemble 的多數成員。
例如，如果 ensemble 有 3 個服務器，一個包含領導者的成員和另一個服務器就組成了一個
quorum。
如果 ensemble 不能達成一個 quorum，數據將不能被寫入。

<!--
ZooKeeper servers keep their entire state machine in memory, and write every mutation to a durable WAL (Write Ahead Log) on storage media. When a server crashes, it can recover its previous state by replaying the WAL. To prevent the WAL from growing without bound, ZooKeeper servers will periodically snapshot them in memory state to storage media. These snapshots can be loaded directly into memory, and all WAL entries that preceded the snapshot may be discarded.
-->
ZooKeeper 在內存中保存它們的整個狀態機，但是每個改變都被寫入一個在存儲介質上的持久
WAL（Write Ahead Log）。
當一個服務器出現故障時，它能夠通過回放 WAL 恢復之前的狀態。
爲了防止 WAL 無限制的增長，ZooKeeper 服務器會定期的將內存狀態快照保存到存儲介質。
這些快照能夠直接加載到內存中，所有在這個快照之前的 WAL 條目都可以被安全的丟棄。

<!--
## Creating a ZooKeeper Ensemble

The manifest below contains a
[Headless Service](/docs/concepts/services-networking/service/#headless-services),
a [Service](/docs/concepts/services-networking/service/),
a [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets),
and a [StatefulSet](/docs/concepts/workloads/controllers/statefulset/).
-->
## 創建一個 ZooKeeper Ensemble

下面的清單包含一個[無頭服務](/zh-cn/docs/concepts/services-networking/service/#headless-services)、
一個 [Service](/zh-cn/docs/concepts/services-networking/service/)、
一個 [PodDisruptionBudget](/zh-cn/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets)
和一個 [StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/)。

{{% code_sample file="application/zookeeper/zookeeper.yaml" %}}

<!--
Open a terminal, and use the
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply) command to create the
manifest.
-->
打開一個命令行終端，使用命令
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply)
創建這個清單。

```shell
kubectl apply -f https://k8s.io/examples/application/zookeeper/zookeeper.yaml
```

<!--
This creates the `zk-hs` Headless Service, the `zk-cs` Service,
the `zk-pdb` PodDisruptionBudget, and the `zk` StatefulSet.
-->
這個操作創建了 `zk-hs` 無頭服務、`zk-cs` 服務、`zk-pdb` PodDisruptionBudget
和 `zk` StatefulSet。

```
service/zk-hs created
service/zk-cs created
poddisruptionbudget.policy/zk-pdb created
statefulset.apps/zk created
```

<!--
Use [`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) to watch the
StatefulSet controller create the StatefulSet's Pods.
-->
使用命令
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get)
查看 StatefulSet 控制器創建的幾個 Pod。

```shell
kubectl get pods -w -l app=zk
```

<!--
Once the `zk-2` Pod is Running and Ready, use `CTRL-C` to terminate kubectl.
-->
一旦 `zk-2` Pod 變成 Running 和 Ready 狀態，請使用 `CRTL-C` 結束 kubectl。

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Pending   0          0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         19s
zk-0      1/1       Running   0         40s
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
zk-1      0/1       ContainerCreating   0         0s
zk-1      0/1       Running   0         18s
zk-1      1/1       Running   0         40s
zk-2      0/1       Pending   0         0s
zk-2      0/1       Pending   0         0s
zk-2      0/1       ContainerCreating   0         0s
zk-2      0/1       Running   0         19s
zk-2      1/1       Running   0         40s
```

<!--
The StatefulSet controller creates three Pods, and each Pod has a container with
a [ZooKeeper](https://www-us.apache.org/dist/zookeeper/stable/) server.
-->
StatefulSet 控制器創建 3 個 Pod，每個 Pod 包含一個
[ZooKeeper](https://archive.apache.org/dist/zookeeper/stable/) 服務容器。

<!--
### Facilitating Leader Election

Because there is no terminating algorithm for electing a leader in an anonymous network, Zab requires
explicit membership configuration to perform leader election. Each server in the ensemble needs to have
a unique identifier, all servers need to know the global set of identifiers, and each identifier needs to be associated with a network address.

Use [`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec) to get the hostnames
of the Pods in the `zk` StatefulSet.
-->
### 促成 Leader 選舉  {#facilitating-leader-election}

由於在匿名網絡中沒有用於選舉 leader 的終止算法，Zab 要求顯式的進行成員關係配置，
以執行 leader 選舉。Ensemble 中的每個服務器都需要具有一個獨一無二的標識符，
所有的服務器均需要知道標識符的全集，並且每個標識符都需要和一個網絡地址相關聯。

使用命令
[`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec)
獲取 `zk` StatefulSet 中 Pod 的主機名。

```shell
for i in 0 1 2; do kubectl exec zk-$i -- hostname; done
```

<!--
The StatefulSet controller provides each Pod with a unique hostname based on its ordinal index.
The hostnames take the form of `<statefulset name>-<ordinal index>`. Because the `replicas`
field of the `zk` StatefulSet is set to `3`, the Set's controller creates three Pods with their
hostnames set to `zk-0`, `zk-1`, and `zk-2`.
-->
StatefulSet 控制器基於每個 Pod 的序號索引爲它們各自提供一個唯一的主機名。
主機名採用 `<statefulset 名稱>-<序數索引>` 的形式。
由於 `zk` StatefulSet 的 `replicas` 字段設置爲 3，這個集合的控制器將創建
3 個 Pod，主機名爲：`zk-0`、`zk-1` 和 `zk-2`。

```
zk-0
zk-1
zk-2
```

<!--
The servers in a ZooKeeper ensemble use natural numbers as unique identifiers, and store each server's identifier in a file called `myid` in the server's data directory.

To examine the contents of the `myid` file for each server use the following command.
-->
ZooKeeper ensemble 中的服務器使用自然數作爲唯一標識符，
每個服務器的標識符都保存在服務器的數據目錄中一個名爲 `myid` 的文件裏。

檢查每個服務器的 `myid` 文件的內容。

```shell
for i in 0 1 2; do echo "myid zk-$i";kubectl exec zk-$i -- cat /var/lib/zookeeper/data/myid; done
```

<!--
Because the identifiers are natural numbers and the ordinal indices are non-negative integers, you can generate an identifier by adding 1 to the ordinal.
-->
由於標識符爲自然數並且序號索引是非負整數，你可以在序號上加 1 來生成一個標識符。

```
myid zk-0
1
myid zk-1
2
myid zk-2
3
```

<!--
To get the Fully Qualified Domain Name (FQDN) of each Pod in the `zk` StatefulSet use the following command.
-->
獲取 `zk` StatefulSet 中每個 Pod 的全限定域名（Fully Qualified Domain Name，FQDN）。

```shell
for i in 0 1 2; do kubectl exec zk-$i -- hostname -f; done
```

<!--
The `zk-hs` Service creates a domain for all of the Pods,
`zk-hs.default.svc.cluster.local`.
-->
`zk-hs` Service 爲所有 Pod 創建了一個域：`zk-hs.default.svc.cluster.local`。

```
zk-0.zk-hs.default.svc.cluster.local
zk-1.zk-hs.default.svc.cluster.local
zk-2.zk-hs.default.svc.cluster.local
```

<!--
The A records in [Kubernetes DNS](/docs/concepts/services-networking/dns-pod-service/) resolve
the FQDNs to the Pods' IP addresses. If Kubernetes reschedules the Pods, it will update the
A records with the Pods' new IP addresses, but the A records names will not change.

ZooKeeper stores its application configuration in a file named `zoo.cfg`. Use `kubectl exec` to view the contents of the `zoo.cfg` file in the `zk-0` Pod.
-->
[Kubernetes DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)
中的 A 記錄將 FQDN 解析成爲 Pod 的 IP 地址。
如果 Kubernetes 重新調度這些 Pod，這個 A 記錄將會使用這些 Pod 的新 IP 地址完成更新，
但 A 記錄的名稱不會改變。

ZooKeeper 在一個名爲 `zoo.cfg` 的文件中保存它的應用配置。
使用 `kubectl exec` 在  `zk-0` Pod 中查看 `zoo.cfg` 文件的內容。

```shell
kubectl exec zk-0 -- cat /opt/zookeeper/conf/zoo.cfg
```

<!--
In the `server.1`, `server.2`, and `server.3` properties at the bottom of
the file, the `1`, `2`, and `3` correspond to the identifiers in the
ZooKeeper servers' `myid` files. They are set to the FQDNs for the Pods in
the `zk` StatefulSet.
-->
文件底部爲 `server.1`、`server.2` 和 `server.3`，其中的 `1`、`2` 和 `3`
分別對應 ZooKeeper 服務器的 `myid` 文件中的標識符。
它們被設置爲 `zk` StatefulSet 中的 Pods 的 FQDNs。

```
clientPort=2181
dataDir=/var/lib/zookeeper/data
dataLogDir=/var/lib/zookeeper/log
tickTime=2000
initLimit=10
syncLimit=2000
maxClientCnxns=60
minSessionTimeout= 4000
maxSessionTimeout= 40000
autopurge.snapRetainCount=3
autopurge.purgeInterval=0
server.1=zk-0.zk-hs.default.svc.cluster.local:2888:3888
server.2=zk-1.zk-hs.default.svc.cluster.local:2888:3888
server.3=zk-2.zk-hs.default.svc.cluster.local:2888:3888
```

<!--
### Achieving consensus

Consensus protocols require that the identifiers of each participant be unique. No two participants
in the Zab protocol should claim the same unique identifier. This is necessary to allow the processes
in the system to agree on which processes have committed which data. If two Pods are launched with
the same ordinal, two ZooKeeper servers would both identify themselves as the same server.
-->
### 達成共識   {#achieving-consensus}

一致性協議要求每個參與者的標識符唯一。
在 Zab 協議裏任何兩個參與者都不應該聲明相同的唯一標識符。
對於讓系統中的進程協商哪些進程已經提交了哪些數據而言，這是必須的。
如果有兩個 Pod 使用相同的序號啓動，這兩個 ZooKeeper
服務器會將自己識別爲相同的服務器。

```shell
kubectl get pods -w -l app=zk
```

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Pending   0          0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         19s
zk-0      1/1       Running   0         40s
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
zk-1      0/1       ContainerCreating   0         0s
zk-1      0/1       Running   0         18s
zk-1      1/1       Running   0         40s
zk-2      0/1       Pending   0         0s
zk-2      0/1       Pending   0         0s
zk-2      0/1       ContainerCreating   0         0s
zk-2      0/1       Running   0         19s
zk-2      1/1       Running   0         40s
```

<!--
The A records for each Pod are entered when the Pod becomes Ready. Therefore,
the FQDNs of the ZooKeeper servers will resolve to a single endpoint, and that
endpoint will be the unique ZooKeeper server claiming the identity configured
in its `myid` file.
-->
每個 Pod 的 A 記錄僅在 Pod 變成 Ready 狀態時被錄入。
因此，ZooKeeper 服務器的 FQDN 只會解析到一個端點，
而那個端點將是申領其 `myid` 文件中所配置標識的唯一 ZooKeeper 服務器。

```
zk-0.zk-hs.default.svc.cluster.local
zk-1.zk-hs.default.svc.cluster.local
zk-2.zk-hs.default.svc.cluster.local
```

<!--
This ensures that the `servers` properties in the ZooKeepers' `zoo.cfg` files
represents a correctly configured ensemble.
-->

這保證了 ZooKeeper 的 `zoo.cfg` 文件中的 `servers` 屬性代表了一個正確配置的 ensemble。

```
server.1=zk-0.zk-hs.default.svc.cluster.local:2888:3888
server.2=zk-1.zk-hs.default.svc.cluster.local:2888:3888
server.3=zk-2.zk-hs.default.svc.cluster.local:2888:3888
```

<!--
When the servers use the Zab protocol to attempt to commit a value, they will either achieve consensus and commit the
value (if leader election has succeeded and at least two of the Pods are Running and Ready), or they will fail to
do so (if either of the conditions are not met). No state will arise where one server acknowledges a write on behalf of another.
-->
當服務器使用 Zab 協議嘗試提交一個值的時候，它們會達成一致併成功提交這個值
（如果領導者選舉成功並且至少有兩個 Pod 處於 Running 和 Ready 狀態），
或者將會失敗（如果沒有滿足上述條件中的任意一條）。
當一個服務器承認另一個服務器的代寫時不會有狀態產生。

<!--
### Sanity Testing the Ensemble

The most basic sanity test is to write data to one ZooKeeper server and
to read the data from another.

The command below executes the `zkCli.sh` script to write `world` to the path `/hello` on the `zk-0` Pod in the ensemble.
-->
### Ensemble 健康檢查

最基本的健康檢查是向一個 ZooKeeper 服務器寫入一些數據，然後從另一個服務器讀取這些數據。

使用 `zkCli.sh` 腳本在 `zk-0` Pod 上寫入 `world` 到路徑 `/hello`。

```shell
kubectl exec zk-0 zkCli.sh create /hello world
```
```
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
Created /hello
```

<!--
To get the data from the `zk-1` Pod use the following command.
-->
使用下面的命令從 `zk-1` Pod 獲取數據。

```shell
kubectl exec zk-1 zkCli.sh get /hello
```

<!--
The data that you created on `zk-0` is available on all the servers in the
ensemble.
-->
你在 `zk-0` 上創建的數據在 ensemble 中所有的服務器上都是可用的。

```
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
world
cZxid = 0x100000002
ctime = Thu Dec 08 15:13:30 UTC 2016
mZxid = 0x100000002
mtime = Thu Dec 08 15:13:30 UTC 2016
pZxid = 0x100000002
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 5
numChildren = 0
```

<!--
### Providing Durable Storage

As mentioned in the [ZooKeeper Basics](#zookeeper-basics) section,
ZooKeeper commits all entries to a durable WAL, and periodically writes snapshots
in memory state, to storage media. Using WALs to provide durability is a common
technique for applications that use consensus protocols to achieve a replicated
state machine.

Use the [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete) command to delete the
`zk` StatefulSet.
-->
### 提供持久存儲

如同在 [ZooKeeper](#zookeeper-basics) 一節所提到的，
ZooKeeper 提交所有的條目到一個持久 WAL，並週期性的將內存快照寫入存儲介質。
對於使用一致性協議實現一個複製狀態機的應用來說，
使用 WAL 提供持久化是一種常用的技術，對於普通的存儲應用也是如此。

使用 [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete)
刪除 `zk` StatefulSet。

```shell
kubectl delete statefulset zk
```

```
statefulset.apps "zk" deleted
```

<!--
Watch the termination of the Pods in the StatefulSet.
-->
觀察 StatefulSet 中的 Pod 變爲終止狀態。

```shell
kubectl get pods -w -l app=zk
```

<!--
When `zk-0` if fully terminated, use `CTRL-C` to terminate kubectl.
-->
當 `zk-0` 完全終止時，使用 `CRTL-C` 結束 kubectl。

```
zk-2      1/1       Terminating   0         9m
zk-0      1/1       Terminating   0         11m
zk-1      1/1       Terminating   0         10m
zk-2      0/1       Terminating   0         9m
zk-2      0/1       Terminating   0         9m
zk-2      0/1       Terminating   0         9m
zk-1      0/1       Terminating   0         10m
zk-1      0/1       Terminating   0         10m
zk-1      0/1       Terminating   0         10m
zk-0      0/1       Terminating   0         11m
zk-0      0/1       Terminating   0         11m
zk-0      0/1       Terminating   0         11m
```

<!--
Reapply the manifest in `zookeeper.yaml`.
-->
重新應用 `zookeeper.yaml` 中的清單。

```shell
kubectl apply -f https://k8s.io/examples/application/zookeeper/zookeeper.yaml
```

<!--
This creates the `zk` StatefulSet object, but the other API objects in the manifest are not modified because they already exist.

Watch the StatefulSet controller recreate the StatefulSet's Pods.
-->
`zk` StatefulSet 將會被創建。由於清單中的其他 API 對象已經存在，所以它們不會被修改。

觀察 StatefulSet 控制器重建 StatefulSet 的 Pod。

```shell
kubectl get pods -w -l app=zk
```

<!--
Once the `zk-2` Pod is Running and Ready, use `CTRL-C` to terminate kubectl.
-->
一旦 `zk-2` Pod 處於 Running 和 Ready 狀態，使用 `CRTL-C` 停止 kubectl 命令。

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Pending   0          0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         19s
zk-0      1/1       Running   0         40s
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
zk-1      0/1       ContainerCreating   0         0s
zk-1      0/1       Running   0         18s
zk-1      1/1       Running   0         40s
zk-2      0/1       Pending   0         0s
zk-2      0/1       Pending   0         0s
zk-2      0/1       ContainerCreating   0         0s
zk-2      0/1       Running   0         19s
zk-2      1/1       Running   0         40s
```

<!--
Use the command below to get the value you entered during the [sanity test](#sanity-testing-the-ensemble),
from the `zk-2` Pod.
-->
從 `zk-2` Pod 中獲取你在[健康檢查](#Ensemble-健康檢查)中輸入的值。

```shell
kubectl exec zk-2 zkCli.sh get /hello
```

<!--
Even though you terminated and recreated all of the Pods in the `zk` StatefulSet, the ensemble still serves the original value.
-->
儘管 `zk` StatefulSet 中所有的 Pod 都已經被終止並重建過，
ensemble 仍然使用原來的數值提供服務。

```
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
world
cZxid = 0x100000002
ctime = Thu Dec 08 15:13:30 UTC 2016
mZxid = 0x100000002
mtime = Thu Dec 08 15:13:30 UTC 2016
pZxid = 0x100000002
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 5
numChildren = 0
```

<!--
The `volumeClaimTemplates` field of the `zk` StatefulSet's `spec` specifies a PersistentVolume provisioned for each Pod.
-->
`zk` StatefulSet 的 `spec` 中的 `volumeClaimTemplates`
字段標識了將要爲每個 Pod 準備的 PersistentVolume。

```yaml
volumeClaimTemplates:
  - metadata:
      name: datadir
      annotations:
        volume.alpha.kubernetes.io/storage-class: anything
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 20Gi
```

<!--
The `StatefulSet` controller generates a `PersistentVolumeClaim` for each Pod in
the `StatefulSet`.

Use the following command to get the `StatefulSet`'s `PersistentVolumeClaims`.
-->
`StatefulSet` 控制器爲 `StatefulSet` 中的每個 Pod 生成一個 `PersistentVolumeClaim`。

獲取 `StatefulSet` 的 `PersistentVolumeClaim`。

```shell
kubectl get pvc -l app=zk
```

<!--
When the `StatefulSet` recreated its Pods, it remounts the Pods' PersistentVolumes.
-->
當 `StatefulSet` 重新創建它的 Pod 時，Pod 的 PersistentVolume 會被重新掛載。

```
NAME           STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
datadir-zk-0   Bound     pvc-bed742cd-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
datadir-zk-1   Bound     pvc-bedd27d2-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
datadir-zk-2   Bound     pvc-bee0817e-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
```

<!--
The `volumeMounts` section of the `StatefulSet`'s container `template` mounts the PersistentVolumes in the ZooKeeper servers' data directories.
-->
StatefulSet 的容器 `template` 中的 `volumeMounts` 一節使得
PersistentVolume 被掛載到 ZooKeeper 服務器的數據目錄。

```yaml
volumeMounts:
- name: datadir
  mountPath: /var/lib/zookeeper
```

<!--
When a Pod in the `zk` `StatefulSet` is (re)scheduled, it will always have the
same `PersistentVolume` mounted to the ZooKeeper server's data directory.
Even when the Pods are rescheduled, all the writes made to the ZooKeeper
servers' WALs, and all their snapshots, remain durable.
-->
當 `zk` `StatefulSet` 中的一個 Pod 被（重新）調度時，它總是擁有相同的 PersistentVolume，
掛載到 ZooKeeper 服務器的數據目錄。
即使在 Pod 被重新調度時，所有對 ZooKeeper 服務器的 WAL 的寫入和它們的全部快照都仍然是持久的。

<!--
## Ensuring consistent configuration

As noted in the [Facilitating Leader Election](#facilitating-leader-election) and
[Achieving Consensus](#achieving-consensus) sections, the servers in a
ZooKeeper ensemble require consistent configuration to elect a leader
and form a quorum. They also require consistent configuration of the Zab protocol
in order for the protocol to work correctly over a network. In our example we
achieve consistent configuration by embedding the configuration directly into
the manifest.

Get the `zk` StatefulSet.
-->
## 確保一致性配置

如同在[促成領導者選舉](#facilitating-leader-election)和[達成一致](#achieving-consensus)
小節中提到的，ZooKeeper ensemble 中的服務器需要一致性的配置來選舉一個領導者並形成一個
quorum。它們還需要 Zab 協議的一致性配置來保證這個協議在網絡中正確的工作。
在這次的示例中，我們通過直接將配置寫入代碼清單中來達到該目的。

獲取 `zk` StatefulSet。

```shell
kubectl get sts zk -o yaml
```
```
    ...
    command:
      - sh
      - -c
      - "start-zookeeper \
        --servers=3 \
        --data_dir=/var/lib/zookeeper/data \
        --data_log_dir=/var/lib/zookeeper/data/log \
        --conf_dir=/opt/zookeeper/conf \
        --client_port=2181 \
        --election_port=3888 \
        --server_port=2888 \
        --tick_time=2000 \
        --init_limit=10 \
        --sync_limit=5 \
        --heap=512M \
        --max_client_cnxns=60 \
        --snap_retain_count=3 \
        --purge_interval=12 \
        --max_session_timeout=40000 \
        --min_session_timeout=4000 \
        --log_level=INFO"
...
```

<!--
The command used to start the ZooKeeper servers passed the configuration as command line parameter.
You can also use environment variables to pass configuration to the ensemble.
-->
用於啓動 ZooKeeper 服務器的命令將這些配置作爲命令行參數傳給了 ensemble。
你也可以通過環境變量來傳入這些配置。

<!--
### Configuring Logging

One of the files generated by the `zkGenConfig.sh` script controls ZooKeeper's logging.
ZooKeeper uses [Log4j](https://logging.apache.org/log4j/2.x/), and, by default,
it uses a time and size based rolling file appender for its logging configuration.

Use the command below to get the logging configuration from one of Pods in the `zk` `StatefulSet`.
-->
### 配置日誌   {#configuring-logging}

`zkGenConfig.sh` 腳本產生的一個文件控制了 ZooKeeper 的日誌行爲。
ZooKeeper 使用了 [Log4j](https://logging.apache.org/log4j/2.x/)
並默認使用基於文件大小和時間的滾動文件追加器作爲日誌配置。

從 `zk` StatefulSet 的一個 Pod 中獲取日誌配置。

```shell
kubectl exec zk-0 cat /usr/etc/zookeeper/log4j.properties
```

<!--
The logging configuration below will cause the ZooKeeper process to write all
of its logs to the standard output file stream.
-->
下面的日誌配置會使 ZooKeeper 進程將其所有的日誌寫入標誌輸出文件流中。

```
zookeeper.root.logger=CONSOLE
zookeeper.console.threshold=INFO
log4j.rootLogger=${zookeeper.root.logger}
log4j.appender.CONSOLE=org.apache.log4j.ConsoleAppender
log4j.appender.CONSOLE.Threshold=${zookeeper.console.threshold}
log4j.appender.CONSOLE.layout=org.apache.log4j.PatternLayout
log4j.appender.CONSOLE.layout.ConversionPattern=%d{ISO8601} [myid:%X{myid}] - %-5p [%t:%C{1}@%L] - %m%n
```

<!--
This is the simplest possible way to safely log inside the container.
Because the applications write logs to standard out, Kubernetes will handle log rotation for you.
Kubernetes also implements a sane retention policy that ensures application logs written to
standard out and standard error do not exhaust local storage media.

Use [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands/#logs) to retrieve the last 20 log lines from one of the Pods.
-->
這是在容器裏安全記錄日誌的最簡單的方法。
由於應用的日誌被寫入標準輸出，Kubernetes 將會爲你處理日誌輪轉。
Kubernetes 還實現了一個智能保存策略，
保證寫入標準輸出和標準錯誤流的應用日誌不會耗盡本地存儲介質。

使用命令 [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands/#logs)
從一個 Pod 中取回最後 20 行日誌。

```shell
kubectl logs zk-0 --tail 20
```

<!--
You can view application logs written to standard out or standard error using `kubectl logs` and from the Kubernetes Dashboard.
-->
使用 `kubectl logs` 或者從 Kubernetes Dashboard 可以查看寫入到標準輸出和標準錯誤流中的應用日誌。

```
2016-12-06 19:34:16,236 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52740
2016-12-06 19:34:16,237 [myid:1] - INFO  [Thread-1136:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52740 (no session established for client)
2016-12-06 19:34:26,155 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52749
2016-12-06 19:34:26,155 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52749
2016-12-06 19:34:26,156 [myid:1] - INFO  [Thread-1137:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52749 (no session established for client)
2016-12-06 19:34:26,222 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52750
2016-12-06 19:34:26,222 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52750
2016-12-06 19:34:26,226 [myid:1] - INFO  [Thread-1138:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52750 (no session established for client)
2016-12-06 19:34:36,151 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52760
2016-12-06 19:34:36,152 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52760
2016-12-06 19:34:36,152 [myid:1] - INFO  [Thread-1139:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52760 (no session established for client)
2016-12-06 19:34:36,230 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52761
2016-12-06 19:34:36,231 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52761
2016-12-06 19:34:36,231 [myid:1] - INFO  [Thread-1140:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52761 (no session established for client)
2016-12-06 19:34:46,149 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52767
2016-12-06 19:34:46,149 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52767
2016-12-06 19:34:46,149 [myid:1] - INFO  [Thread-1141:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52767 (no session established for client)
2016-12-06 19:34:46,230 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52768
2016-12-06 19:34:46,230 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52768
2016-12-06 19:34:46,230 [myid:1] - INFO  [Thread-1142:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52768 (no session established for client)
```

<!--
Kubernetes integrates with many logging solutions. You can choose a logging solution
that best fits your cluster and applications. For cluster-level logging and aggregation,
consider deploying a [sidecar container](/docs/concepts/cluster-administration/logging#sidecar-container-with-logging-agent) to rotate and ship your logs.
-->
Kubernetes 支持與多種日誌方案集成。
你可以選擇一個最適合你的集羣和應用的日誌解決方案。
對於集羣級別的日誌輸出與整合，可以考慮部署一個
[邊車容器](/zh-cn/docs/concepts/cluster-administration/logging#sidecar-container-with-logging-agent)
來輪轉和提供日誌數據。

<!--
### Configuring a non-privileged user

The best practices to allow an application to run as a privileged
user inside of a container are a matter of debate. If your organization requires
that applications run as a non-privileged user you can use a
[SecurityContext](/docs/tasks/configure-pod-container/security-context/) to control the user that
the entry point runs as.

The `zk` `StatefulSet`'s Pod `template` contains a `SecurityContext`.
-->
### 配置非特權用戶

在容器中允許應用以特權用戶運行這條最佳實踐是值得商討的。
如果你的組織要求應用以非特權用戶運行，你可以使用
[SecurityContext](/zh-cn/docs/tasks/configure-pod-container/security-context/)
控制運行容器入口點所使用的用戶。

`zk` StatefulSet 的 Pod 的 `template` 包含了一個 `SecurityContext`。

```yaml
securityContext:
  runAsUser: 1000
  fsGroup: 1000
```

<!--
In the Pods' containers, UID 1000 corresponds to the zookeeper user and GID 1000
corresponds to the zookeeper group.

Get the ZooKeeper process information from the `zk-0` Pod.
-->
在 Pod 的容器內部，UID 1000 對應用戶 zookeeper，GID 1000 對應用戶組 zookeeper。

從 `zk-0` Pod 獲取 ZooKeeper 進程信息。

```shell
kubectl exec zk-0 -- ps -elf
```

<!--
As the `runAsUser` field of the `securityContext` object is set to 1000,
instead of running as root, the ZooKeeper process runs as the zookeeper user.
-->
由於 `securityContext` 對象的 `runAsUser` 字段被設置爲 1000 而不是 root，
ZooKeeper 進程將以 zookeeper 用戶運行。

```
F S UID        PID  PPID  C PRI  NI ADDR SZ WCHAN  STIME TTY          TIME CMD
4 S zookeep+     1     0  0  80   0 -  1127 -      20:46 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
0 S zookeep+    27     1  0  80   0 - 1155556 -    20:46 ?        00:00:19 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```

<!--
By default, when the Pod's PersistentVolumes is mounted to the ZooKeeper server's data directory,
it is only accessible by the root user. This configuration prevents the ZooKeeper process from writing to its WAL and storing its snapshots.

Use the command below to get the file permissions of the ZooKeeper data directory on the `zk-0` Pod.
-->
默認情況下，當 Pod 的 PersistentVolume 被掛載到 ZooKeeper 服務器的數據目錄時，
它只能被 root 用戶訪問。這個配置將阻止 ZooKeeper 進程寫入它的 WAL 及保存快照。

在 `zk-0` Pod 上獲取 ZooKeeper 數據目錄的文件權限。

```shell
kubectl exec -ti zk-0 -- ls -ld /var/lib/zookeeper/data
```

<!--
Because the `fsGroup` field of the `securityContext` object is set to 1000, the ownership of the Pods'
PersistentVolumes is set to the zookeeper group, and the ZooKeeper process is able to read and write its data.
-->
由於 `securityContext` 對象的 `fsGroup` 字段設置爲 1000，
Pod 的 PersistentVolume 的所有權屬於 zookeeper 用戶組，
因而 ZooKeeper 進程能夠成功地讀寫數據。

```
drwxr-sr-x 3 zookeeper zookeeper 4096 Dec  5 20:45 /var/lib/zookeeper/data
```

<!--
## Managing the ZooKeeper Process

The [ZooKeeper documentation](https://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_supervision)
mentions that "You will want to have a supervisory process that
manages each of your ZooKeeper server processes (JVM)." Utilizing a watchdog
(supervisory process) to restart failed processes in a distributed system is a
common pattern. When deploying an application in Kubernetes, rather than using
an external utility as a supervisory process, you should use Kubernetes as the
watchdog for your application.
-->
## 管理 ZooKeeper 進程

[ZooKeeper 文檔](https://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_supervision)
指出 “你將需要一個監管程序用於管理每個 ZooKeeper 服務進程（JVM）”。
在分佈式系統中，使用一個看門狗（監管程序）來重啓故障進程是一種常用的模式。

<!--
### Updating the ensemble

The `zk` `StatefulSet` is configured to use the `RollingUpdate` update strategy.

You can use `kubectl patch` to update the number of `cpus` allocated to the servers.
-->
### 更新 Ensemble

`zk` `StatefulSet` 的更新策略被設置爲了 `RollingUpdate`。

你可以使用 `kubectl patch` 更新分配給每個服務器的 `cpus` 的數量。

```shell
kubectl patch sts zk --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/resources/requests/cpu", "value":"0.3"}]'
```

```
statefulset.apps/zk patched
```

<!--
Use `kubectl rollout status` to watch the status of the update.
-->
使用 `kubectl rollout status` 觀測更新狀態。

```shell
kubectl rollout status sts/zk
```

```
waiting for statefulset rolling update to complete 0 pods at revision zk-5db4499664...
Waiting for 1 pods to be ready...
Waiting for 1 pods to be ready...
waiting for statefulset rolling update to complete 1 pods at revision zk-5db4499664...
Waiting for 1 pods to be ready...
Waiting for 1 pods to be ready...
waiting for statefulset rolling update to complete 2 pods at revision zk-5db4499664...
Waiting for 1 pods to be ready...
Waiting for 1 pods to be ready...
statefulset rolling update complete 3 pods at revision zk-5db4499664...
```

<!--
This terminates the Pods, one at a time, in reverse ordinal order, and recreates them with the new configuration. This ensures that quorum is maintained during a rolling update.

Use the `kubectl rollout history` command to view a history or previous configurations.

The output is similar to this:
-->
這項操作會逆序地依次終止每一個 Pod，並用新的配置重新創建。
這樣做確保了在滾動更新的過程中 quorum 依舊保持工作。

使用 `kubectl rollout history` 命令查看歷史或先前的配置。

```shell
kubectl rollout history sts/zk
```

輸出類似於：

```
statefulsets "zk"
REVISION
1
2
```

<!--
Use the `kubectl rollout undo` command to roll back the modification.

The output is similar to this:
-->
使用 `kubectl rollout undo` 命令撤銷這次的改動。

```shell
kubectl rollout undo sts/zk
```

輸出類似於：

```
statefulset.apps/zk rolled back
```

<!--
### Handling process failure

[Restart Policies](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) control how
Kubernetes handles process failures for the entry point of the container in a Pod.
For Pods in a `StatefulSet`, the only appropriate `RestartPolicy` is Always, and this
is the default value. For stateful applications you should **never** override
the default policy.

Use the following command to examine the process tree for the ZooKeeper server running in the `zk-0` Pod.
-->
### 處理進程故障

[重啓策略](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
控制 Kubernetes 如何處理一個 Pod 中容器入口點的進程故障。
對於 StatefulSet 中的 Pod 來說，Always 是唯一合適的 RestartPolicy，也是默認值。
你應該**絕不**覆蓋有狀態應用的默認策略。

檢查 `zk-0` Pod 中運行的 ZooKeeper 服務器的進程樹。

```shell
kubectl exec zk-0 -- ps -ef
```

<!--
The command used as the container's entry point has PID 1, and
the ZooKeeper process, a child of the entry point, has PID 27.
-->
作爲容器入口點的命令的 PID 爲 1，Zookeeper 進程是入口點的子進程，PID 爲 27。

```
UID        PID  PPID  C STIME TTY          TIME CMD
zookeep+     1     0  0 15:03 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
zookeep+    27     1  0 15:03 ?        00:00:03 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```

<!--
In another terminal watch the Pods in the `zk` `StatefulSet` with the following command.
-->
在一個終端觀察 `zk` `StatefulSet` 中的 Pod。

```shell
kubectl get pod -w -l app=zk
```

<!--
In another terminal, terminate the ZooKeeper process in Pod `zk-0` with the following command.
-->
在另一個終端殺掉 Pod `zk-0` 中的 ZooKeeper 進程。

```shell
 kubectl exec zk-0 -- pkill java
```

<!--
The termination of the ZooKeeper process caused its parent process to terminate. Because the `RestartPolicy` of the container is Always, it restarted the parent process.
-->
ZooKeeper 進程的終結導致了它父進程的終止。由於容器的 `RestartPolicy`
是 Always，所以父進程被重啓。

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   0          21m
zk-1      1/1       Running   0          20m
zk-2      1/1       Running   0          19m
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Error     0          29m
zk-0      0/1       Running   1         29m
zk-0      1/1       Running   1         29m
```

<!--
If your application uses a script (such as `zkServer.sh`) to launch the process
that implements the application's business logic, the script must terminate with the
child process. This ensures that Kubernetes will restart the application's
container when the process implementing the application's business logic fails.
-->
如果你的應用使用一個腳本（例如 `zkServer.sh`）來啓動一個實現了應用業務邏輯的進程，
這個腳本必須和子進程一起結束。這保證了當實現應用業務邏輯的進程故障時，
Kubernetes 會重啓這個應用的容器。

<!--
### Testing for liveness

Configuring your application to restart failed processes is not enough to
keep a distributed system healthy. There are scenarios where
a system's processes can be both alive and unresponsive, or otherwise
unhealthy. You should use liveness probes to notify Kubernetes
that your application's processes are unhealthy and it should restart them.

The Pod `template` for the `zk` `StatefulSet` specifies a liveness probe.
-->
### 存活性測試

你的應用配置爲自動重啓故障進程，但這對於保持一個分佈式系統的健康來說是不夠的。
許多場景下，一個系統進程可以是活動狀態但不響應請求，或者是不健康狀態。
你應該使用存活性探針來通知 Kubernetes 你的應用進程處於不健康狀態，需要被重啓。

`zk` `StatefulSet` 的 Pod 的 `template` 一節指定了一個存活探針。

```yaml
  livenessProbe:
    exec:
      command:
      - sh
      - -c
      - "zookeeper-ready 2181"
    initialDelaySeconds: 15
    timeoutSeconds: 5
```

<!--
The probe calls a bash script that uses the ZooKeeper `ruok` four letter
word to test the server's health.
-->
這個探針調用一個簡單的 Bash 腳本，使用 ZooKeeper 的四字縮寫 `ruok`
來測試服務器的健康狀態。

```
OK=$(echo ruok | nc 127.0.0.1 $1)
if [ "$OK" == "imok" ]; then
    exit 0
else
    exit 1
fi
```

<!--
In one terminal window, use the following command to watch the Pods in the `zk` StatefulSet.
-->
在一個終端窗口中使用下面的命令觀察 `zk` StatefulSet 中的 Pod。

```shell
kubectl get pod -w -l app=zk
```

<!--
In another window, using the following command to delete the `zookeeper-ready` script from the file system of Pod `zk-0`.
-->
在另一個窗口中，從 Pod `zk-0` 的文件系統中刪除 `zookeeper-ready` 腳本。

```shell
kubectl exec zk-0 -- rm /opt/zookeeper/bin/zookeeper-ready
```

<!--
When the liveness probe for the ZooKeeper process fails, Kubernetes will
automatically restart the process for you, ensuring that unhealthy processes in
the ensemble are restarted.
-->
當 ZooKeeper 進程的存活探針探測失敗時，Kubernetes 將會爲你自動重啓這個進程，
從而保證 ensemble 中不健康狀態的進程都被重啓。

```shell
kubectl get pod -w -l app=zk
```

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   0          1h
zk-1      1/1       Running   0          1h
zk-2      1/1       Running   0          1h
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Running   0          1h
zk-0      0/1       Running   1         1h
zk-0      1/1       Running   1         1h
```

<!--
### Testing for readiness

Readiness is not the same as liveness. If a process is alive, it is scheduled
and healthy. If a process is ready, it is able to process input. Liveness is
a necessary, but not sufficient, condition for readiness. There are cases,
particularly during initialization and termination, when a process can be
alive but not ready.
-->
### 就緒性測試

就緒不同於存活。如果一個進程是存活的，它是可調度和健康的。
如果一個進程是就緒的，它應該能夠處理輸入。存活是就緒的必要非充分條件。
在許多場景下，特別是初始化和終止過程中，一個進程可以是存活但沒有就緒的。

<!--
If you specify a readiness probe, Kubernetes will ensure that your application's
processes will not receive network traffic until their readiness checks pass.

For a ZooKeeper server, liveness implies readiness.  Therefore, the readiness
probe from the `zookeeper.yaml` manifest is identical to the liveness probe.
-->
如果你指定了一個就緒探針，Kubernetes 將保證在就緒檢查通過之前，
你的應用不會接收到網絡流量。

對於一個 ZooKeeper 服務器來說，存活即就緒。
因此 `zookeeper.yaml` 清單中的就緒探針和存活探針完全相同。

```yaml
  readinessProbe:
    exec:
      command:
      - sh
      - -c
      - "zookeeper-ready 2181"
    initialDelaySeconds: 15
    timeoutSeconds: 5
```

<!--
Even though the liveness and readiness probes are identical, it is important
to specify both. This ensures that only healthy servers in the ZooKeeper
ensemble receive network traffic.
-->
雖然存活探針和就緒探針是相同的，但同時指定它們兩者仍然重要。
這保證了 ZooKeeper ensemble 中只有健康的服務器能接收網絡流量。

<!--
## Tolerating node failure

ZooKeeper needs a quorum of servers to successfully commit mutations
to data. For a three server ensemble, two servers must be healthy for
writes to succeed. In quorum based systems, members are deployed across failure
domains to ensure availability. To avoid an outage, due to the loss of an
individual machine, best practices preclude co-locating multiple instances of the
application on the same machine.
-->
## 容忍節點故障   {#tolerating-node-failure}

ZooKeeper 需要一個 quorum 來提交數據變動。對於一個擁有 3 個服務器的 ensemble 來說，
必須有兩個服務器是健康的，寫入才能成功。
在基於 quorum 的系統裏，成員被部署在多個故障域中以保證可用性。
爲了防止由於某臺機器斷連引起服務中斷，最佳實踐是防止應用的多個實例在相同的機器上共存。

<!--
By default, Kubernetes may co-locate Pods in a `StatefulSet` on the same node.
For the three server ensemble you created, if two servers are on the same node, and that node fails,
the clients of your ZooKeeper service will experience an outage until at least one of the Pods can be rescheduled.
-->
默認情況下，Kubernetes 可以把 `StatefulSet` 的 Pod 部署在相同節點上。
對於你創建的 3 個服務器的 ensemble 來說，
如果有兩個服務器並存於相同的節點上並且該節點發生故障時，ZooKeeper 服務將中斷，
直至至少其中一個 Pod 被重新調度。

<!--
You should always provision additional capacity to allow the processes of critical
systems to be rescheduled in the event of node failures. If you do so, then the
outage will only last until the Kubernetes scheduler reschedules one of the ZooKeeper
servers. However, if you want your service to tolerate node failures with no downtime,
you should set `podAntiAffinity`.

Use the command below to get the nodes for Pods in the `zk` `StatefulSet`.
-->
你應該總是提供多餘的容量以允許關鍵系統進程在節點故障時能夠被重新調度。
如果你這樣做了，服務故障就只會持續到 Kubernetes 調度器重新調度某個
ZooKeeper 服務器爲止。
但是，如果希望你的服務在容忍節點故障時無停服時間，你應該設置 `podAntiAffinity`。

使用下面的命令獲取 `zk` `StatefulSet` 中的 Pod 的節點。

```shell
for i in 0 1 2; do kubectl get pod zk-$i --template {{.spec.nodeName}}; echo ""; done
```

<!--
All of the Pods in the `zk` `StatefulSet` are deployed on different nodes.
-->
`zk` `StatefulSet` 中所有的 Pod 都被部署在不同的節點。

```
kubernetes-node-cxpk
kubernetes-node-a5aq
kubernetes-node-2g2d
```

<!--
This is because the Pods in the `zk` `StatefulSet` have a `PodAntiAffinity` specified.
-->

這是因爲 `zk` `StatefulSet` 中的 Pod 指定了 `PodAntiAffinity`。

```yaml
affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
            - key: "app"
              operator: In
              values:
                - zk
        topologyKey: "kubernetes.io/hostname"
```

<!--
The `requiredDuringSchedulingIgnoredDuringExecution` field tells the
Kubernetes Scheduler that it should never co-locate two Pods which have `app` label
as `zk` in the domain defined by the `topologyKey`. The `topologyKey`
`kubernetes.io/hostname` indicates that the domain is an individual node. Using
different rules, labels, and selectors, you can extend this technique to spread
your ensemble across physical, network, and power failure domains.
-->
`requiredDuringSchedulingIgnoredDuringExecution` 告訴 Kubernetes 調度器，
在以 `topologyKey` 指定的域中，絕對不要把帶有鍵爲 `app`、值爲 `zk` 的標籤
的兩個 Pod 調度到相同的節點。`topologyKey` `kubernetes.io/hostname` 表示
這個域是一個單獨的節點。
使用不同的規則、標籤和選擇算符，你能夠通過這種技術把你的 ensemble 分佈
在不同的物理、網絡和電力故障域之間。

<!--
## Surviving maintenance

**In this section you will cordon and drain nodes. If you are using this tutorial
on a shared cluster, be sure that this will not adversely affect other tenants.**

The previous section showed you how to spread your Pods across nodes to survive
unplanned node failures, but you also need to plan for temporary node failures
that occur due to planned maintenance.

Use this command to get the nodes in your cluster.
-->
## 節點維護期間保持應用可用

**在本節中你將會隔離（Cordon）和騰空（Drain）節點。
如果你是在一個共享的集羣裏使用本教程，請保證不會影響到其他租戶。**

上一小節展示瞭如何在節點之間分散 Pod 以在計劃外的節點故障時保證服務存活。
但是你也需要爲計劃內維護引起的臨時節點故障做準備。

使用此命令獲取你的集羣中的節點。

```shell
kubectl get nodes
```

<!--
Use [`kubectl cordon`](/docs/reference/generated/kubectl/kubectl-commands/#cordon) to
cordon all but four of the nodes in your cluster.
-->

使用 [`kubectl cordon`](/docs/reference/generated/kubectl/kubectl-commands/#cordon)
隔離你的集羣中除 4 個節點以外的所有節點。

```shell
kubectl cordon <node-name>
```

<!--
Use this command to get the `zk-pdb` `PodDisruptionBudget`.
-->
使用下面的命令獲取 `zk-pdb` `PodDisruptionBudget`。

```shell
kubectl get pdb zk-pdb
```

<!--
The `max-unavailable` field indicates to Kubernetes that at most one Pod from
`zk` `StatefulSet` can be unavailable at any time.
-->
`max-unavailable` 字段指示 Kubernetes 在任何時候，`zk` `StatefulSet`
至多有一個 Pod 是不可用的。

```
NAME      MIN-AVAILABLE   MAX-UNAVAILABLE   ALLOWED-DISRUPTIONS   AGE
zk-pdb    N/A             1                 1
```

<!--
In one terminal, use this command to watch the Pods in the `zk` `StatefulSet`.
-->
在一個終端中，使用下面的命令觀察 `zk` `StatefulSet` 中的 Pod。

```shell
kubectl get pods -w -l app=zk
```

<!--
In another terminal, use this command to get the nodes that the Pods are currently scheduled on.
-->

在另一個終端中，使用下面的命令獲取 Pod 當前調度的節點。

```shell
for i in 0 1 2; do kubectl get pod zk-$i --template {{.spec.nodeName}}; echo ""; done
```

```
kubernetes-node-pb41
kubernetes-node-ixsl
kubernetes-node-i4c4
```

<!--
Use [`kubectl drain`](/docs/reference/generated/kubectl/kubectl-commands/#drain) to cordon and
drain the node on which the `zk-0` Pod is scheduled.

The output is similar to this:
-->

使用 [`kubectl drain`](/docs/reference/generated/kubectl/kubectl-commands/#drain)
來隔離和騰空 `zk-0` Pod 調度所在的節點。

```shell
kubectl drain $(kubectl get pod zk-0 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

輸出類似於：

```
node "kubernetes-node-pb41" cordoned

WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-pb41, kube-proxy-kubernetes-node-pb41; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-o5elz
pod "zk-0" deleted
node "kubernetes-node-pb41" drained
```

<!--
As there are four nodes in your cluster, `kubectl drain`, succeeds and the
`zk-0` is rescheduled to another node.
-->
由於你的集羣中有 4 個節點, `kubectl drain` 執行成功，`zk-0` 被調度到其它節點。

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   2          1h
zk-1      1/1       Running   0          1h
zk-2      1/1       Running   0          1h
NAME      READY     STATUS        RESTARTS   AGE
zk-0      1/1       Terminating   2          2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Pending   0         0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         51s
zk-0      1/1       Running   0         1m
```

<!--
Keep watching the `StatefulSet`'s Pods in the first terminal and drain the node on which
`zk-1` is scheduled.

The output is similar to this:
-->
在第一個終端中持續觀察 `StatefulSet` 的 Pod 並騰空 `zk-1` 調度所在的節點。

```shell
kubectl drain $(kubectl get pod zk-1 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

輸出類似於：

```
kubernetes-node-ixsl" cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-ixsl, kube-proxy-kubernetes-node-ixsl; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-voc74
pod "zk-1" deleted
node "kubernetes-node-ixsl" drained
```

<!--
The `zk-1` Pod cannot be scheduled because the `zk` `StatefulSet` contains a `PodAntiAffinity` rule preventing
co-location of the Pods, and as only two nodes are schedulable, the Pod will remain in a Pending state.

The output is similar to this:
-->
`zk-1` Pod 不能被調度，這是因爲 `zk` `StatefulSet` 包含了一個防止 Pod
共存的 `PodAntiAffinity` 規則，而且只有兩個節點可用於調度，
這個 Pod 將保持在 Pending 狀態。

```shell
kubectl get pods -w -l app=zk
```

輸出類似於：

```
NAME      READY     STATUS              RESTARTS   AGE
zk-0      1/1       Running             2          1h
zk-1      1/1       Running             0          1h
zk-2      1/1       Running             0          1h
NAME      READY     STATUS              RESTARTS   AGE
zk-0      1/1       Terminating         2          2h
zk-0      0/1       Terminating         2          2h
zk-0      0/1       Terminating         2          2h
zk-0      0/1       Terminating         2          2h
zk-0      0/1       Pending             0          0s
zk-0      0/1       Pending             0          0s
zk-0      0/1       ContainerCreating   0          0s
zk-0      0/1       Running             0          51s
zk-0      1/1       Running             0          1m
zk-1      1/1       Terminating         0          2h
zk-1      0/1       Terminating         0          2h
zk-1      0/1       Terminating         0          2h
zk-1      0/1       Terminating         0          2h
zk-1      0/1       Pending             0          0s
zk-1      0/1       Pending             0          0s
```

<!--
Continue to watch the Pods of the StatefulSet, and drain the node on which
`zk-2` is scheduled.

The output is similar to this:
-->
繼續觀察 StatefulSet 中的 Pod 並騰空 `zk-2` 調度所在的節點。

```shell
kubectl drain $(kubectl get pod zk-2 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

輸出類似於：

```
node "kubernetes-node-i4c4" cordoned

WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog
WARNING: Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog; Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4
There are pending pods when an error occurred: Cannot evict pod as it would violate the pod's disruption budget.
pod/zk-2
```

<!--
Use `CTRL-C` to terminate kubectl.

You cannot drain the third node because evicting `zk-2` would violate `zk-budget`. However, the node will remain cordoned.

Use `zkCli.sh` to retrieve the value you entered during the sanity test from `zk-0`.
-->
使用 `CTRL-C` 終止 kubectl。

你不能騰空第三個節點，因爲驅逐 `zk-2` 將和 `zk-budget` 衝突。
然而這個節點仍然處於隔離狀態（Cordoned）。

使用 `zkCli.sh` 從 `zk-0` 取回你的健康檢查中輸入的數值。

```shell
kubectl exec zk-0 zkCli.sh get /hello
```

<!--
The service is still available because its `PodDisruptionBudget` is respected.
-->
由於遵守了 `PodDisruptionBudget`，服務仍然可用。

```
WatchedEvent state:SyncConnected type:None path:null
world
cZxid = 0x200000002
ctime = Wed Dec 07 00:08:59 UTC 2016
mZxid = 0x200000002
mtime = Wed Dec 07 00:08:59 UTC 2016
pZxid = 0x200000002
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 5
numChildren = 0
```

<!--
Use [`kubectl uncordon`](/docs/reference/generated/kubectl/kubectl-commands/#uncordon) to uncordon the first node.

The output is similar to this:
-->
使用 [`kubectl uncordon`](/docs/reference/generated/kubectl/kubectl-commands/#uncordon)
來取消對第一個節點的隔離。

```shell
kubectl uncordon kubernetes-node-pb41
```

輸出類似於：

```
node "kubernetes-node-pb41" uncordoned
```

<!--
`zk-1` is rescheduled on this node. Wait until `zk-1` is Running and Ready.

The output is similar to this:
-->
`zk-1` 被重新調度到了這個節點。等待 `zk-1` 變爲 Running 和 Ready 狀態。

```shell
kubectl get pods -w -l app=zk
```

輸出類似於：

```
NAME      READY     STATUS             RESTARTS  AGE
zk-0      1/1       Running            2         1h
zk-1      1/1       Running            0         1h
zk-2      1/1       Running            0         1h
NAME      READY     STATUS             RESTARTS  AGE
zk-0      1/1       Terminating        2         2h
zk-0      0/1       Terminating        2         2h
zk-0      0/1       Terminating        2         2h
zk-0      0/1       Terminating        2         2h
zk-0      0/1       Pending            0         0s
zk-0      0/1       Pending            0         0s
zk-0      0/1       ContainerCreating  0         0s
zk-0      0/1       Running            0         51s
zk-0      1/1       Running            0         1m
zk-1      1/1       Terminating        0         2h
zk-1      0/1       Terminating        0         2h
zk-1      0/1       Terminating        0         2h
zk-1      0/1       Terminating        0         2h
zk-1      0/1       Pending            0         0s
zk-1      0/1       Pending            0         0s
zk-1      0/1       Pending            0         12m
zk-1      0/1       ContainerCreating  0         12m
zk-1      0/1       Running            0         13m
zk-1      1/1       Running            0         13m
```

<!--
Attempt to drain the node on which `zk-2` is scheduled.
-->
嘗試騰空 `zk-2` 調度所在的節點。

```shell
kubectl drain $(kubectl get pod zk-2 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

<!--
The output is similar to this:
-->
輸出類似於：

```
node "kubernetes-node-i4c4" already cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog
pod "heapster-v1.2.0-2604621511-wht1r" deleted
pod "zk-2" deleted
node "kubernetes-node-i4c4" drained
```

<!--
This time `kubectl drain` succeeds.

Uncordon the second node to allow `zk-2` to be rescheduled.

The output is similar to this:
-->
這次 `kubectl drain` 執行成功。

取消第二個節點的隔離，以允許 `zk-2` 被重新調度。

```shell
kubectl uncordon kubernetes-node-ixsl
```

輸出類似於：

```
node "kubernetes-node-ixsl" uncordoned
```

<!--
You can use `kubectl drain` in conjunction with `PodDisruptionBudgets` to ensure that your services remain available during maintenance.
If drain is used to cordon nodes and evict pods prior to taking the node offline for maintenance,
services that express a disruption budget will have that budget respected.
You should always allocate additional capacity for critical services so that their Pods can be immediately rescheduled.
-->
你可以同時使用 `kubectl drain` 和 `PodDisruptionBudgets` 來保證你的服務在維護過程中仍然可用。
如果使用了騰空操作來隔離節點並在節點離線之前驅逐了 Pod，
那麼設置了干擾預算的服務將會遵守該預算。
你應該總是爲關鍵服務分配額外容量，這樣它們的 Pod 就能夠迅速的重新調度。

## {{% heading "cleanup" %}}

<!--
- Use `kubectl uncordon` to uncordon all the nodes in your cluster.
- You must delete the persistent storage media for the PersistentVolumes used in this tutorial.
  Follow the necessary steps, based on your environment, storage configuration,
  and provisioning method, to ensure that all storage is reclaimed.
-->
* 使用 `kubectl uncordon` 解除你集羣中所有節點的隔離。
* 你需要刪除在本教程中使用的 PersistentVolume 的持久存儲介質。
  請遵循必須的步驟，基於你的環境、存儲配置和製備方法，保證回收所有的存儲。
