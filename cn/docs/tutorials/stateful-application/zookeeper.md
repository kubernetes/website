---
approvers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton

title: 运行 ZooKeeper， 一个 CP 分布式系统
---

{% capture overview %}

本教程展示了在 Kubernetes 上使用 [PodDisruptionBudgets](/docs/admin/disruptions/#specifying-a-poddisruptionbudget) 和 [PodAntiAffinity](/docs/user-guide/node-selection/#inter-pod-affinity-and-anti-affinity-beta-feature) 特性运行 [Apache Zookeeper](https://zookeeper.apache.org)。
{% endcapture %}

{% capture prerequisites %}

在开始本教程前，你应该熟悉以下 Kubernetes 概念。

* [Pods](/docs/user-guide/pods/single-container/)
* [Cluster DNS](/docs/concepts/services-networking/dns-pod-service/)
* [Headless Services](/docs/concepts/services-networking/service/#headless-services)
* [PersistentVolumes](/docs/concepts/storage/volumes/)
* [PersistentVolume Provisioning](http://releases.k8s.io/{{page.githubbranch}}/examples/persistent-volume-provisioning/)
* [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)
* [StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/)
* [PodDisruptionBudgets](/docs/admin/disruptions/#specifying-a-poddisruptionbudget)
* [PodAntiAffinity](/docs/user-guide/node-selection/#inter-pod-affinity-and-anti-affinity-beta-feature)
* [kubectl CLI](/docs/user-guide/kubectl)



你需要一个至少包含四个节点的集群，每个节点至少 2 CPUs 和  4 GiB 内存。在本教程中你将会 cordon 和 drain 集群的节点。**这意味着集群节点上所有的 Pods 将会被终止并移除。这些节点也会暂时变为不可调度。**在本教程中你应该使用一个独占的集群，或者保证你造成的干扰不会影响其它租户。


本教程假设你的集群配置为动态的提供 PersistentVolumes。如果你的集群没有配置成这样，在开始本教程前，你需要手动准备三个 20 GiB 的卷。
{% endcapture %}

{% capture objectives %}

在学习本教程后，你将熟悉下列内容。

* 如何使用 StatefulSet 部署一个 ZooKeeper ensemble。
* 如何使用 ConfigMaps 一致性配置 ensemble。
* 如何在 ensemble 中 分布 ZooKeeper 服务的部署。
* 如何在计划维护中使用 PodDisruptionBudgets 确保服务可用性。
{% endcapture %}

{% capture lessoncontent %}


### ZooKeeper 基础


[Apache ZooKeeper](https://zookeeper.apache.org/doc/current/) 是一个分布式的开源协调服务，用于分布式系统。ZooKeeper 允许你读取、写入数据和发现数据更新。数据按层次结构组织在文件系统中，并复制到 ensemble（一个 ZooKeeper 服务的集合） 中所有的 ZooKeeper 服务。对数据的所有操作都是原子的和顺序一致的。ZooKeeper 通过 [Zab](https://pdfs.semanticscholar.org/b02c/6b00bd5dbdbd951fddb00b906c82fa80f0b3.pdf) 一致性协议在 ensemble 的所有服务之间复制一个状态机来确保这个特性。


ensemble 使用 Zab 协议选举一个 leader，在选举出 leader 前不能写入数据。一旦选举出了 leader，ensemble 使用 Zab 保证所有写入被复制到一个 quorum，然后这些写入操作才会被确认并对客户端可用。如果没有遵照加权 quorums，一个 quorum 表示包含当前 leader 的 ensemble 的多数成员。例如，如果 ensemble 有3个服务，一个包含 leader 的成员和另一个服务就组成了一个 quorum。如果 ensemble 不能达成一个 quorum，数据将不能被写入。


ZooKeeper 在内存中保存它们的整个状态机，但是每个改变都被写入一个在存储介质上的持久 WAL（Write Ahead Log）。当一个服务故障时，它能够通过回放 WAL 恢复之前的状态。为了防止 WAL 无限制的增长，ZooKeeper 服务会定期的将内存状态快照保存到存储介质。这些快照能够直接加载到内存中，所有在这个快照之前的 WAL 条目都可以被安全的丢弃。 


## 创建一个 ZooKeeper Ensemble


下面的清单包含一个 [Headless Service](/docs/user-guide/services/#headless-services)，一个 [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)，一个 [PodDisruptionBudget](/docs/admin/disruptions/#specifying-a-poddisruptionbudget) 和 一个 [StatefulSet](/docs/concepts/abstractions/controllers/statefulsets/)。

{% include code.html language="yaml" file="zookeeper.yaml" ghlink="/docs/tutorials/stateful-application/zookeeper.yaml" %}


打开一个命令行终端，使用 [`kubectl create`](/docs/user-guide/kubectl/{{page.version}}/#create) 创建这个清单。

```shell
kubectl create -f https://k8s.io/docs/tutorials/stateful-application/zookeeper.yaml
```


这个操作创建了 `zk-headless` Headless Service、`zk-config` ConfigMap、`zk-budget` PodDisruptionBudget 和 `zk` StatefulSet。

```shell
service "zk-headless" created
configmap "zk-config" created
poddisruptionbudget "zk-budget" created
statefulset "zk" created
```


使用 [`kubectl get`](/docs/user-guide/kubectl/{{page.version}}/#get) 查看 StatefulSet 控制器创建的 Pods。

```shell
kubectl get pods -w -l app=zk
```


一旦  `zk-2` Pod 变成 Running 和 Ready 状态，使用 `CRTL-C` 结束 kubectl。

```shell
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


StatefulSet 控制器创建了3个 Pods，每个 Pod 包含一个 [ZooKeeper 3.4.9](http://www-us.apache.org/dist/zookeeper/zookeeper-3.4.9/) 服务。


### 促成 Leader 选举


由于在匿名网络中没有用于选举 leader 的终止算法，Zab 要求显式的进行成员关系配置，以执行 leader 选举。Ensemble 中的每个服务都需要具有一个独一无二的标识符，所有的服务均需要知道标识符的全集，并且每个标志都需要和一个网络地址相关联。


使用 [`kubectl exec`](/docs/user-guide/kubectl/{{page.version}}/#exec) 获取 `zk` StatefulSet 中 Pods 的主机名。

```shell
for i in 0 1 2; do kubectl exec zk-$i -- hostname; done
```


StatefulSet 控制器基于每个 Pod 的序号索引为它们各自提供一个唯一的主机名。主机名采用 `<statefulset name>-<ordinal index>` 的形式。由于 `zk` StatefulSet 的 `replicas` 字段设置为3，这个 Set 的控制器将创建3个 Pods，主机名为：`zk-0`、`zk-1` 和 `zk-2`。

```shell
zk-0
zk-1
zk-2
```


ZooKeeper ensemble 中的服务使用自然数作为唯一标识符，每个服务的标识符都保存在服务的数据目录中一个名为 `myid` 的文件里。


检查每个服务的 `myid` 文件的内容。

```shell
for i in 0 1 2; do echo "myid zk-$i";kubectl exec zk-$i -- cat /var/lib/zookeeper/data/myid; done
```


由于标识符为自然数并且序号索引是非负整数，你可以在序号上加 1 来生成一个标识符。

```shell
myid zk-0
1
myid zk-1
2
myid zk-2
3
```


获取 `zk` StatefulSet 中每个 Pod 的 FQDN (Fully Qualified Domain Name，正式域名)。

```shell
for i in 0 1 2; do kubectl exec zk-$i -- hostname -f; done
```


`zk-headless` Service 为所有 Pods 创建了一个 domain：`zk-headless.default.svc.cluster.local`。

```shell
zk-0.zk-headless.default.svc.cluster.local
zk-1.zk-headless.default.svc.cluster.local
zk-2.zk-headless.default.svc.cluster.local
```


[Kubernetes DNS](/docs/concepts/services-networking/dns-pod-service/) 中的 A 记录将 FQDNs 解析成为 Pods 的 IP 地址。如果 Pods 被调度，这个 A 记录将会使用 Pods 的新 IP 地址更新，但 A 记录的名称不会改变。


ZooKeeper 在一个名为 `zoo.cfg` 的文件中保存它的应用配置。使用 `kubectl exec` 在  `zk-0` Pod 中查看 `zoo.cfg` 文件的内容。

```
kubectl exec zk-0 -- cat /opt/zookeeper/conf/zoo.cfg
```


文件底部为 `server.1`、`server.2` 和 `server.3`，其中的 `1`、`2`和`3`分别对应 ZooKeeper 服务的 `myid` 文件中的标识符。它们被设置为  `zk` StatefulSet 中的 Pods 的 FQDNs。

```shell
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
server.1=zk-0.zk-headless.default.svc.cluster.local:2888:3888
server.2=zk-1.zk-headless.default.svc.cluster.local:2888:3888
server.3=zk-2.zk-headless.default.svc.cluster.local:2888:3888
```


### 达成一致


 一致性协议要求每个参与者的标识符唯一。在 Zab 协议里任何两个参与者都不应该声明相同的唯一标识符。对于让系统中的进程协商哪些进程已经提交了哪些数据而言，这是必须的。如果有两个 Pods 使用相同的序号启动，这两个 ZooKeeper 服务会将自己识别为相同的服务。


当你创建 `zk` StatefulSet 时，StatefulSet 控制器按照 Pods 的序号索引顺序的创建每个 Pod。在创建下一个 Pod 前会等待每个 Pod 变成 Running 和 Ready 状态。
```shell
kubectl get pods -w -l app=zk
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


每个 Pod 的 A 记录仅在 Pod 变成 Ready状态时被录入。因此，ZooKeeper 服务的 FQDNs 只会解析到一个 endpoint，而那个 endpoint 将会是一个唯一的 ZooKeeper 服务，这个服务声明了配置在它的 `myid` 文件中的标识符。

```shell
zk-0.zk-headless.default.svc.cluster.local
zk-1.zk-headless.default.svc.cluster.local
zk-2.zk-headless.default.svc.cluster.local
```


这保证了 ZooKeepers 的 `zoo.cfg` 文件中的 `servers` 属性代表了一个正确配置的 ensemble。

```shell
server.1=zk-0.zk-headless.default.svc.cluster.local:2888:3888
server.2=zk-1.zk-headless.default.svc.cluster.local:2888:3888
server.3=zk-2.zk-headless.default.svc.cluster.local:2888:3888
```


当服务使用 Zab 协议尝试提交一个值的时候，它们会达成一致并成功提交这个值（如果 leader 选举成功并且至少有两个 Pods 处于 Running 和 Ready状态），或者将会失败（如果没有满足上述条件中的任意一条）。当一个服务承认另一个服务的代写时不会有状态产生。


### Ensemble 健康检查


最基本的健康检查是向一个 ZooKeeper 服务写入一些数据，然后从另一个服务读取这些数据。


使用 `zkCli.sh` 脚本在 `zk-0` Pod 上写入 `world` 到路径 `/hello`。

```shell
kubectl exec zk-0 zkCli.sh create /hello world
```


这将会把 `world` 写入 ensemble 的 `/hello` 路径。

```shell
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
Created /hello
```


从 `zk-1` Pod 获取数据。

```shell
kubectl exec zk-1 zkCli.sh get /hello
```


你在 `zk-0` 创建的数据在 ensemble 中所有的服务上都是可用的。

```shell
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


### 准备持久存储


如同在 [ZooKeeper 基础](#zookeeper-basics) 一节所提到的，ZooKeeper 提交所有的条目到一个持久 WAL，并周期性的将内存快照写入存储介质。对于使用一致性协议实现一个复制状态机的应用来说，使用 WALs 提供持久化是一种常用的技术，对于普通的存储应用也是如此。


使用 [`kubectl delete`](/docs/user-guide/kubectl/{{page.version}}/#delete) 删除 `zk` StatefulSet。

```shell
kubectl delete statefulset zk
statefulset "zk" deleted
```


观察 StatefulSet 中的 Pods 变为终止状态。

```shell
get pods -w -l app=zk
```


当 `zk-0` 完全终止时，使用 `CRTL-C` 结束 kubectl。

```shell
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

重新应用 `zookeeper.yaml` 中的代码清单。 

```shell
kubectl apply -f https://k8s.io/docs/tutorials/stateful-application/zookeeper.yaml
```


`zk` StatefulSet 将会被创建。由于清单中的其他 API 对象已经存在，所以它们不会被修改。

```shell
statefulset "zk" created
Error from server (AlreadyExists): error when creating "zookeeper.yaml": services "zk-headless" already exists
Error from server (AlreadyExists): error when creating "zookeeper.yaml": configmaps "zk-config" already exists
Error from server (AlreadyExists): error when creating "zookeeper.yaml": poddisruptionbudgets.policy "zk-budget" already exists
```


观察 StatefulSet 控制器重建 StatefulSet 的 Pods。

```shell
kubectl get pods -w -l app=zk
```


一旦 `zk-2` Pod 处于 Running 和 Ready 状态，使用 `CRTL-C` 停止 kubectl命令。

```shell
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


从 `zk-2` Pod 中获取你在[健康检查](#sanity-testing-the-ensemble)中输入的值。

```shell
kubectl exec zk-2 zkCli.sh get /hello
```


尽管 `zk` StatefulSet 中所有的 Pods 都已经被终止并重建过，ensemble 仍然使用原来的数值提供服务。

```shell
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


`zk` StatefulSet 的 `spec` 中的 `volumeClaimTemplates` 字段标识了将要为每个 Pod 准备的 PersistentVolume。

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



StatefulSet 控制器为 StatefulSet 中的每个 Pod 生成一个 PersistentVolumeClaim。


获取 StatefulSet 的 PersistentVolumeClaims。

```shell
kubectl get pvc -l app=zk
```


当 StatefulSet 重新创建它的 Pods时，Pods 的 PersistentVolumes 会被重新挂载。

```shell
NAME           STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
datadir-zk-0   Bound     pvc-bed742cd-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
datadir-zk-1   Bound     pvc-bedd27d2-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
datadir-zk-2   Bound     pvc-bee0817e-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
```


StatefulSet 的容器 `template` 中的 `volumeMounts` 一节使得 PersistentVolumes 被挂载到 ZooKeeper 服务的数据目录。

```shell
volumeMounts:
        - name: datadir
          mountPath: /var/lib/zookeeper
```

当 `zk` StatefulSet 中的一个 Pod 被（重新）调度时，它总是拥有相同的 PersistentVolume，挂载到 ZooKeeper 服务的数据目录。即使在 Pods 被重新调度时，所有对 ZooKeeper 服务的 WALs 的写入和它们的全部快照都仍然是持久的。


## 确保一致性配置


如同在 [促成 leader 选举](#facilitating-leader-election) 和 [达成一致](#achieving-consensus) 小节中提到的，ZooKeeper ensemble 中的服务需要一致性的配置来选举一个 leader 并形成一个 quorum。它们还需要 Zab 协议的一致性配置来保证这个协议在网络中正确的工作。你可以使用 ConfigMaps 达到目的。


获取 `zk-config` 的 ConfigMap。

```shell
 kubectl get cm zk-config -o yaml
apiVersion: v1
data:
  client.cnxns: "60"
  ensemble: zk-0;zk-1;zk-2
  init: "10"
  jvm.heap: 2G
  purge.interval: "0"
  snap.retain: "3"
  sync: "5"
  tick: "2000"
```


`zk` StatefulSet 的 `template` 中的 `env` 字段读取 ConfigMap 到环境变量中。这些变量将被注入到容器的运行环境里。

```yaml
env:
        - name : ZK_ENSEMBLE
          valueFrom:
            configMapKeyRef:
              name: zk-config
              key: ensemble
        - name : ZK_HEAP_SIZE
          valueFrom:
            configMapKeyRef:
                name: zk-config
                key: jvm.heap
        - name : ZK_TICK_TIME
          valueFrom:
            configMapKeyRef:
                name: zk-config
                key: tick
        - name : ZK_INIT_LIMIT
          valueFrom:
            configMapKeyRef:
                name: zk-config
                key: init
        - name : ZK_SYNC_LIMIT
          valueFrom:
            configMapKeyRef:
                name: zk-config
                key: tick
        - name : ZK_MAX_CLIENT_CNXNS
          valueFrom:
            configMapKeyRef:
                name: zk-config
                key: client.cnxns
        - name: ZK_SNAP_RETAIN_COUNT
          valueFrom:
            configMapKeyRef:
                name: zk-config
                key: snap.retain
        - name: ZK_PURGE_INTERVAL
          valueFrom:
            configMapKeyRef:
                name: zk-config
                key: purge.interval
```


在启动 ZooKeeper 服务进程前，容器的入口点调用了一个 bash 脚本：`zkGenConfig.sh`。这个 bash 脚本从提供的环境变量中生成了 ZooKeeper 的配置文件。

```yaml
 command:
        - sh
        - -c
        - zkGenConfig.sh && zkServer.sh start-foreground
```


检查 `zk` StatefulSet 中所有 Pods 的环境变量。

```shell
for i in 0 1 2; do kubectl exec zk-$i env | grep ZK_*;echo""; done
```


所有从 `zk-config` 取得的参数都包含完全相同的值。这将允许 `zkGenConfig.sh` 脚本为 ensemble 中所有的 ZooKeeper 服务创建一致性的配置。

```shell
ZK_ENSEMBLE=zk-0;zk-1;zk-2
ZK_HEAP_SIZE=2G
ZK_TICK_TIME=2000
ZK_INIT_LIMIT=10
ZK_SYNC_LIMIT=2000
ZK_MAX_CLIENT_CNXNS=60
ZK_SNAP_RETAIN_COUNT=3
ZK_PURGE_INTERVAL=0
ZK_CLIENT_PORT=2181
ZK_SERVER_PORT=2888
ZK_ELECTION_PORT=3888
ZK_USER=zookeeper
ZK_DATA_DIR=/var/lib/zookeeper/data
ZK_DATA_LOG_DIR=/var/lib/zookeeper/log
ZK_LOG_DIR=/var/log/zookeeper

ZK_ENSEMBLE=zk-0;zk-1;zk-2
ZK_HEAP_SIZE=2G
ZK_TICK_TIME=2000
ZK_INIT_LIMIT=10
ZK_SYNC_LIMIT=2000
ZK_MAX_CLIENT_CNXNS=60
ZK_SNAP_RETAIN_COUNT=3
ZK_PURGE_INTERVAL=0
ZK_CLIENT_PORT=2181
ZK_SERVER_PORT=2888
ZK_ELECTION_PORT=3888
ZK_USER=zookeeper
ZK_DATA_DIR=/var/lib/zookeeper/data
ZK_DATA_LOG_DIR=/var/lib/zookeeper/log
ZK_LOG_DIR=/var/log/zookeeper

ZK_ENSEMBLE=zk-0;zk-1;zk-2
ZK_HEAP_SIZE=2G
ZK_TICK_TIME=2000
ZK_INIT_LIMIT=10
ZK_SYNC_LIMIT=2000
ZK_MAX_CLIENT_CNXNS=60
ZK_SNAP_RETAIN_COUNT=3
ZK_PURGE_INTERVAL=0
ZK_CLIENT_PORT=2181
ZK_SERVER_PORT=2888
ZK_ELECTION_PORT=3888
ZK_USER=zookeeper
ZK_DATA_DIR=/var/lib/zookeeper/data
ZK_DATA_LOG_DIR=/var/lib/zookeeper/log
ZK_LOG_DIR=/var/log/zookeeper
```


### 配置日志


`zkGenConfig.sh` 脚本产生的一个文件控制了 ZooKeeper 的日志行为。ZooKeeper 使用了 [Log4j](http://logging.apache.org/log4j/2.x/) 并默认使用基于文件大小和时间的滚动文件追加器作为日志配置。
从 `zk` StatefulSet 的一个 Pods 中获取日志配置。

```shell
kubectl exec zk-0 cat /usr/etc/zookeeper/log4j.properties
```


下面的日志配置会使 ZooKeeper 进程将其所有的日志写入标志输出文件流中。

```shell
zookeeper.root.logger=CONSOLE
zookeeper.console.threshold=INFO
log4j.rootLogger=${zookeeper.root.logger}
log4j.appender.CONSOLE=org.apache.log4j.ConsoleAppender
log4j.appender.CONSOLE.Threshold=${zookeeper.console.threshold}
log4j.appender.CONSOLE.layout=org.apache.log4j.PatternLayout
log4j.appender.CONSOLE.layout.ConversionPattern=%d{ISO8601} [myid:%X{myid}] - %-5p [%t:%C{1}@%L] - %m%n
```


这是在容器里安全记录日志的最简单的方法。由于应用的日志被写入标准输出，Kubernetes 将会为你处理日志轮转。Kubernetes 还实现了一个智能保存策略，保证写入标准输出和标准错误流的应用日志不会耗尽本地存储媒介。


使用 [`kubectl logs`](/docs/user-guide/kubectl/{{page.version}}/#logs) 从一个 Pod 中取回最后几行日志。

```shell
kubectl logs zk-0 --tail 20
```


使用 `kubectl logs` 或者从 Kubernetes Dashboard 可以查看写入到标准输出和标准错误流中的应用日志。

```shell
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




### 配置非特权用户


在容器中允许应用以特权用户运行这条最佳实践是值得商讨的。如果你的组织要求应用以非特权用户运行，你可以使用 [SecurityContext](/docs/tasks/configure-pod-container/security-context/) 控制运行容器入口点的用户。


`zk` StatefulSet 的 Pod 的 `template` 包含了一个 SecurityContext。

```yaml
securityContext:
  runAsUser: 1000
  fsGroup: 1000
```


在 Pods 容器内部，UID 1000 对应用户 zookeeper，GID 1000对应用户组 zookeeper。


从 `zk-0` Pod 获取 ZooKeeper 进程信息。

```shell
kubectl exec zk-0 -- ps -elf
```


由于 `securityContext` 对象的 `runAsUser` 字段被设置为1000而不是 root，ZooKeeper进程将以 zookeeper 用户运行。

```shell
F S UID        PID  PPID  C PRI  NI ADDR SZ WCHAN  STIME TTY          TIME CMD
4 S zookeep+     1     0  0  80   0 -  1127 -      20:46 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
0 S zookeep+    27     1  0  80   0 - 1155556 -    20:46 ?        00:00:19 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```


默认情况下，当 Pod 的 PersistentVolume 被挂载到 ZooKeeper 服务的数据目录时，它只能被 root 用户访问。这个配置将阻止 ZooKeeper 进程写入它的 WAL 及保存快照。


在 `zk-0` Pod 上获取 ZooKeeper 数据目录的文件权限。

```shell
kubectl exec -ti zk-0 -- ls -ld /var/lib/zookeeper/data
```


由于 `securityContext` 对象的 `fsGroup` 字段设置为1000，Pods 的 PersistentVolumes 的所有权属于 zookeeper 用户组，因而 ZooKeeper 进程能够成功的读写数据。

```shell
drwxr-sr-x 3 zookeeper zookeeper 4096 Dec  5 20:45 /var/lib/zookeeper/data
```


## 管理 ZooKeeper 进程


[ZooKeeper documentation](https://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_supervision) 文档指出“你将需要一个监管程序用于管理每个 ZooKeeper 服务进程（JVM）”。在分布式系统中，使用一个看门狗（监管程序）来重启故障进程是一种常用的模式。


### 处理进程故障


[Restart Policies](/docs/user-guide/pod-states/#restartpolicy) 控制 Kubernetes 如何处理一个 Pod 中容器入口点的进程故障。对于 StatefulSet 中的 Pods 来说，Always 是唯一合适的 RestartPolicy，这也是默认值。你应该**绝不**覆盖 stateful 应用的默认策略。


检查 `zk-0` Pod 中运行的 ZooKeeper 服务的进程树。

```shell
kubectl exec zk-0 -- ps -ef
```


作为容器入口点的命令的 PID 为 1，Zookeeper 进程是入口点的子进程，PID 为23。


```
UID        PID  PPID  C STIME TTY          TIME CMD
zookeep+     1     0  0 15:03 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
zookeep+    27     1  0 15:03 ?        00:00:03 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```


在一个终端观察 `zk` StatefulSet 中的 Pods。

```shell
kubectl get pod -w -l app=zk
```


在另一个终端杀掉 Pod `zk-0` 中的 ZooKeeper 进程。

```shell
 kubectl exec zk-0 -- pkill java
```



ZooKeeper 进程的终结导致了它父进程的终止。由于容器的 RestartPolicy 是 Always，父进程被重启。


```shell
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   0          21m
zk-1      1/1       Running   0          20m
zk-2      1/1       Running   0          19m
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Error     0          29m
zk-0      0/1       Running   1         29m
zk-0      1/1       Running   1         29m
```


如果你的应用使用一个脚本（例如 zkServer.sh）来启动一个实现了应用业务逻辑的进程，这个脚本必须和子进程一起结束。这保证了当实现应用业务逻辑的进程故障时，Kubernetes 会重启这个应用的容器。





你的应用配置为自动重启故障进程，但这对于保持一个分布式系统的健康来说是不够的。许多场景下，一个系统进程可以是活动状态但不响应请求，或者是不健康状态。你应该使用 liveness probes 来通知 Kubernetes 你的应用进程处于不健康状态，需要被重启。



`zk` StatefulSet 的 Pod 的 `template` 一节指定了一个 liveness probe。


```yaml
 livenessProbe:
          exec:
            command:
            - "zkOk.sh"
          initialDelaySeconds: 15
          timeoutSeconds: 5
```


这个探针调用一个简单的 bash 脚本，使用 ZooKeeper 的四字缩写 `ruok` 来测试服务的健康状态。


```bash
ZK_CLIENT_PORT=${ZK_CLIENT_PORT:-2181}
OK=$(echo ruok | nc 127.0.0.1 $ZK_CLIENT_PORT)
if [ "$OK" == "imok" ]; then
    exit 0
else
    exit 1
fi
```


在一个终端窗口观察 `zk` StatefulSet 中的 Pods。


```shell
kubectl get pod -w -l app=zk
```


在另一个窗口中，从 Pod `zk-0` 的文件系统中删除 `zkOk.sh` 脚本。


```shell
kubectl exec zk-0 -- rm /opt/zookeeper/bin/zkOk.sh
```


当 ZooKeeper 进程的 liveness probe 失败时，Kubernetes 将会为你自动重启这个进程，从而保证 ensemble 中不健康状态的进程都被重启。


```shell
kubectl get pod -w -l app=zk
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   0          1h
zk-1      1/1       Running   0          1h
zk-2      1/1       Running   0          1h
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Running   0          1h
zk-0      0/1       Running   1         1h
zk-0      1/1       Running   1         1h
```


### 可读性测试



可读性不同于存活性。如果一个进程是存活的，它是可调度和健康的。如果一个进程是就绪的，它应该能够处理输入。存活性是可读性的必要非充分条件。在许多场景下，特别是初始化和终止过程中，一个进程可以是存活但没有就绪。


如果你指定了一个可读性探针，Kubernetes将保证在可读性检查通过之前，你的应用不会接收到网络流量。


对于一个 ZooKeeper 服务来说，存活性实现了可读性。因此 `zookeeper.yaml` 清单中的可读性探针和存活性探针完全相同。


```yaml
 readinessProbe:
          exec:
            command:
            - "zkOk.sh"
          initialDelaySeconds: 15
          timeoutSeconds: 5
```



虽然存活性探针和可读性探针是相同的，但同时指定它们两者仍然重要。这保证了 ZooKeeper ensemble 中唯一健康的服务能够接收网络流量。



## 容忍节点故障


ZooKeeper 需要一个服务的 quorum 来成功的提交数据变动。对于一个 3 个服务的 ensemble，必须有两个是健康的写入才能成功。在基于 quorum 的系统里，成员被部署在故障域之间以保证可用性。为了防止由于某台机器断连引起服务中断，最佳实践是防止应用的多个示例在相同的机器上共存。


默认情况下，Kubernetes 可以把 StatefulSet 的 Pods 部署在相同节点上。对于你创建的 3 个服务的 ensemble 来说，如果有两个服务并存于相同的节点上并且该节点发生故障时，你的 ZooKeeper 服务客户端将不能使用服务，至少一个 Pods 被重新调度后才能恢复。


你应该总是提供额外的容量以允许关键系统进程在节点故障时能够被重新调度。如果你这样做了，服务故障就只会持续到 Kubernetes 调度器重新调度 ZooKeeper 服务之前。但是，如果希望你的服务在容忍节点故障时无停服时间，你应该设置 `podAntiAffinity`。


获取 `zk` Stateful Set 中的 Pods 的节点。

```shell{% raw %}
for i in 0 1 2; do kubectl get pod zk-$i --template {{.spec.nodeName}}; echo ""; done
``` {% endraw %}


`zk` StatefulSe 中所有的 Pods 都被部署在不同的节点。

```shell
kubernetes-minion-group-cxpk
kubernetes-minion-group-a5aq
kubernetes-minion-group-2g2d
```


这是因为 `zk` StatefulSet 中的  Pods 指定了 PodAntiAffinity。

```yaml
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: "app"
                    operator: In
                    values: 
                    - zk-headless
              topologyKey: "kubernetes.io/hostname"
```


`requiredDuringSchedulingRequiredDuringExecution` 告诉 Kubernetes 调度器，在以 `topologyKey` 指定的域中，绝对不要把 `zk-headless` 的两个 Pods 调度到相同的节点。`topologyKey` 
`kubernetes.io/hostname` 表示这个域是一个单独的节点。使用不同的 rules、labels 和 selectors，你能够通过这种技术把你的 ensemble 在物理、网络和电力故障域之间分布。


## 存活管理


**在本节中你将会 cordon 和 drain 节点。如果你是在一个共享的集群里使用本教程，请保证不会影响到其他租户**


上一小节展示了如何在节点之间分散 Pods 以在计划外的节点故障时存活。但是你也需要为计划内维护引起的临时节点故障做准备。


获取你集群中的节点。

```shell
kubectl get nodes
```


使用 [`kubectl cordon`](/docs/user-guide/kubectl/{{page.version}}/#cordon) cordon 你的集群中除4个节点以外的所有节点。

```shell{% raw %}
kubectl cordon < node name >
```{% endraw %}


获取 `zk-budget` PodDisruptionBudget。

```shell
kubectl get poddisruptionbudget zk-budget
```


`min-available` 字段指示 Kubernetes 在任何时候，`zk` StatefulSet 至少有两个 Pods 必须是可用的。

```yaml
NAME        MIN-AVAILABLE   ALLOWED-DISRUPTIONS   AGE
zk-budget   2               1                     1h

```


在一个终端观察 `zk` StatefulSet 中的 Pods。

```shell
kubectl get pods -w -l app=zk
```


在另一个终端获取 Pods 当前调度的节点。

```shell{% raw %}
for i in 0 1 2; do kubectl get pod zk-$i --template {{.spec.nodeName}}; echo ""; done
kubernetes-minion-group-pb41
kubernetes-minion-group-ixsl
kubernetes-minion-group-i4c4
{% endraw %}
```

使用 [`kubectl drain`](/docs/user-guide/kubectl/{{page.version}}/#drain) 来 cordon 和 drain `zk-0` Pod 调度的节点。

```shell {% raw %}
kubectl drain $(kubectl get pod zk-0 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-local-data
node "kubernetes-minion-group-pb41" cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-minion-group-pb41, kube-proxy-kubernetes-minion-group-pb41; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-o5elz
pod "zk-0" deleted
node "kubernetes-minion-group-pb41" drained
{% endraw %}
```


由于你的集群中有4个节点, `kubectl drain` 执行成功，`zk-0 被调度到其它节点。

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


在第一个终端持续观察 StatefulSet 的 Pods并 drain `zk-1` 调度的节点。

```shell{% raw %}
kubectl drain $(kubectl get pod zk-1 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-local-data "kubernetes-minion-group-ixsl" cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-minion-group-ixsl, kube-proxy-kubernetes-minion-group-ixsl; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-voc74
pod "zk-1" deleted
node "kubernetes-minion-group-ixsl" drained
{% endraw %}
```


`zk-1` Pod 不能被调度。由于 `zk` StatefulSet 包含了一个防止 Pods 共存的 PodAntiAffinity 规则，而且只有两个节点可用于调度，这个 Pod 将保持在 Pending 状态。

```shell
kubectl get pods -w -l app=zk
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
zk-1      1/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
```


继续观察 stateful set 的 Pods 并 drain `zk-2` 调度的节点。

```shell{% raw %}
kubectl drain $(kubectl get pod zk-2 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-local-data
node "kubernetes-minion-group-i4c4" cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-minion-group-i4c4, kube-proxy-kubernetes-minion-group-i4c4; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog
WARNING: Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog; Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-minion-group-i4c4, kube-proxy-kubernetes-minion-group-i4c4
There are pending pods when an error occurred: Cannot evict pod as it would violate the pod's disruption budget.
pod/zk-2
{% endraw %}
```


使用 `CRTL-C` 终止 kubectl。


你不能 drain 第三个节点，因为删除 `zk-2` 将和 `zk-budget` 冲突。然而这个节点仍然保持 cordoned。


使用 `zkCli.sh` 从 `zk-0` 取回你的健康检查中输入的数值。

```shell
kubectl exec zk-0 zkCli.sh get /hello
```


由于遵守了 PodDisruptionBudget，服务仍然可用。

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


使用 [`kubectl uncordon`](/docs/user-guide/kubectl/{{page.version}}/#uncordon) 来取消对第一个节点的隔离。

```shell
kubectl uncordon kubernetes-minion-group-pb41
node "kubernetes-minion-group-pb41" uncordoned
```


`zk-1` 被重新调度到了这个节点。等待 `zk-1` 变为 Running 和 Ready 状态。

```shell
kubectl get pods -w -l app=zk
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
zk-1      1/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         12m
zk-1      0/1       ContainerCreating   0         12m
zk-1      0/1       Running   0         13m
zk-1      1/1       Running   0         13m
```


尝试 drain  `zk-2` 调度的节点。

```shell{% raw %}
kubectl drain $(kubectl get pod zk-2 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-local-data
node "kubernetes-minion-group-i4c4" already cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-minion-group-i4c4, kube-proxy-kubernetes-minion-group-i4c4; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog
pod "heapster-v1.2.0-2604621511-wht1r" deleted
pod "zk-2" deleted
node "kubernetes-minion-group-i4c4" drained
{% endraw %}
```


这次 `kubectl drain` 执行成功。


Uncordon 第二个节点以允许 `zk-2` 被重新调度。

```shell
kubectl uncordon kubernetes-minion-group-ixsl
node "kubernetes-minion-group-ixsl" uncordoned
```


你可以同时使用 `kubectl drain` 和 PodDisruptionBudgets 来保证你的服务在维护过程中仍然可用。如果使用 drain 来隔离节点并在此之前删除 pods 使节点进入离线维护状态，如果服务表达了 disruption budget，这个 budget 将被遵守。你应该总是为关键服务分配额外容量，这样它们的 Pods 就能够迅速的重新调度。

{% endcapture %}

{% capture cleanup %}

* 使用 `kubectl uncordon` 解除你集群中所有节点的隔离。
* 你需要删除在本教程中使用的 PersistentVolumes 的持久存储媒介。请遵循必须的步骤，基于你的环境、存储配置和准备方法，保证回收所有的存储。
{% endcapture %}
{% include templates/tutorial.md %}
