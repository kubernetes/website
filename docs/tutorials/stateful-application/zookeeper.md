---
assignees:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Running ZooKeeper, A CP Distributed System
---

{% capture overview %}
This tutorial demonstrates [Apache Zookeeper](https://zookeeper.apache.org) on 
Kubernetes using [StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/), 
[PodDisruptionBudgets](/docs/admin/disruptions/#specifying-a-poddisruptionbudget), 
and [PodAntiAffinity](/docs/user-guide/node-selection/#inter-pod-affinity-and-anti-affinity-beta-feature).
{% endcapture %}

{% capture prerequisites %}

Before starting this tutorial, you should be familiar with the following 
Kubernetes concepts.

* [Pods](/docs/user-guide/pods/single-container/)
* [Cluster DNS](/docs/concepts/services-networking/dns-pod-service/)
* [Headless Services](/docs/concepts/services-networking/service/#headless-services)
* [PersistentVolumes](/docs/concepts/storage/volumes/)
* [PersistentVolume Provisioning](http://releases.k8s.io/{{page.githubbranch}}/examples/persistent-volume-provisioning/)
* [ConfigMaps](/docs/tasks/configure-pod-container/configmap/)
* [StatefulSets](/docs/concepts/abstractions/controllers/statefulsets/)
* [PodDisruptionBudgets](/docs/admin/disruptions/#specifying-a-poddisruptionbudget)
* [PodAntiAffinity](/docs/user-guide/node-selection/#inter-pod-affinity-and-anti-affinity-beta-feature)
* [kubectl CLI](/docs/user-guide/kubectl)

You will require a cluster with at least four nodes, and each node will require
at least 2 CPUs and 4 GiB of memory. In this tutorial you will cordon and 
drain the cluster's nodes. **This means that all Pods on the cluster's nodes 
will be terminated and evicted, and the nodes will, temporarily, become 
unschedulable.** You should use a dedicated cluster for this tutorial, or you 
should ensure that the disruption you cause will not interfere with other 
tenants.

This tutorial assumes that your cluster is configured to dynamically provision 
PersistentVolumes. If your cluster is not configured to do so, you
will have to manually provision three 20 GiB volumes prior to starting this 
tutorial.
{% endcapture %}

{% capture objectives %}
After this tutorial, you will know the following.

* How to deploy a ZooKeeper ensemble using StatefulSet.
* How to consistently configure the ensemble using ConfigMaps.
* How to spread the deployment of ZooKeeper servers in the ensemble.
* How to use PodDisruptionBudgets to ensure service availability during planned maintenance.
{% endcapture %}

{% capture lessoncontent %}

### ZooKeeper Basics

[Apache ZooKeeper](https://zookeeper.apache.org/doc/current/) is a 
distributed, open-source coordination service for distributed applications.
ZooKeeper allows you to read, write, and observe updates to data. Data are 
organized in a file system like hierarchy and replicated to all ZooKeeper 
servers in the ensemble (a set of ZooKeeper servers). All operations on data 
are atomic and sequentially consistent. ZooKeeper ensures this by using the 
[Zab](https://pdfs.semanticscholar.org/b02c/6b00bd5dbdbd951fddb00b906c82fa80f0b3.pdf) 
consensus protocol to replicate a state machine across all servers in the ensemble.

The ensemble uses the Zab protocol to elect a leader, and
data can not be written until a leader is elected. Once a leader is 
elected, the ensemble uses Zab to ensure that all writes are replicated to a 
quorum before they are acknowledged and made visible to clients. Without respect
to weighted quorums, a quorum is a majority component of the ensemble containing 
the current leader. For instance, if the ensemble has three servers, a component 
that contains the leader and one other server constitutes a quorum. If the 
ensemble can not achieve a quorum, data can not be written.

ZooKeeper servers keep their entire state machine in memory, but every mutation 
is written to a durable WAL (Write Ahead Log) on storage media. When a server 
crashes, it can recover its previous state by replaying the WAL. In order to 
prevent the WAL from growing without bound, ZooKeeper servers will periodically 
snapshot their in memory state to storage media. These snapshots can be loaded 
directly into memory, and all WAL entries that preceded the snapshot may be 
safely discarded.

## Creating a ZooKeeper Ensemble

The manifest below contains a 
[Headless Service](/docs/user-guide/services/#headless-services), 
a [ConfigMap](/docs/tasks/configure-pod-container/configmap/), 
a [PodDisruptionBudget](/docs/admin/disruptions/#specifying-a-poddisruptionbudget), 
and a [StatefulSet](/docs/concepts/abstractions/controllers/statefulsets/). 

{% include code.html language="yaml" file="zookeeper.yaml" ghlink="/docs/tutorials/stateful-application/zookeeper.yaml" %}

Open a command terminal, and use 
[`kubectl create`](/docs/user-guide/kubectl/{{page.version}}/#create) to create the 
manifest.

```shell
kubectl create -f https://k8s.io/docs/tutorials/stateful-application/zookeeper.yaml
```

This creates the `zk-headless` Headless Service, the `zk-config` ConfigMap, 
the `zk-budget` PodDisruptionBudget, and the `zk` StatefulSet.

```shell
service "zk-headless" created
configmap "zk-config" created
poddisruptionbudget "zk-budget" created
statefulset "zk" created
```

Use [`kubectl get`](/docs/user-guide/kubectl/{{page.version}}/#get)  to watch the
StatefulSet controller create the StatefulSet's Pods.

```shell
kubectl get pods -w -l app=zk
```

Once the `zk-2` Pod is Running and Ready, use `CRTL-C` to  terminate kubectl.

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

The StatefulSet controller creates three Pods, and each Pod has a container with 
a [ZooKeeper 3.4.9](http://www-us.apache.org/dist/zookeeper/zookeeper-3.4.9/) server.

### Facilitating Leader Election

As there is no terminating algorithm for electing a leader in an anonymous 
network, Zab requires explicit membership configuration in order to perform 
leader election. Each server in the ensemble needs to have a unique 
identifier, all servers need to know the global set of identifiers, and each
identifier needs to be associated with a network address.

Use [`kubectl exec`](/docs/user-guide/kubectl/{{page.version}}/#exec) to get the hostnames 
of the Pods in the `zk` StatefulSet.

```shell
for i in 0 1 2; do kubectl exec zk-$i -- hostname; done
```

The StatefulSet controller provides each Pod with a unique hostname based on its 
ordinal index. The hostnames take the form `<statefulset name>-<ordinal index>`. 
As the `replicas` field of the `zk` StatefulSet is set to `3`, the Set's 
controller creates three Pods with their hostnames set to `zk-0`, `zk-1`, and 
`zk-2`. 

```shell
zk-0
zk-1
zk-2
```

The servers in a ZooKeeper ensemble use natural numbers as unique identifiers, and 
each server's identifier is stored in a file called `myid` in the server's 
data directory. 

Examine the contents of the `myid` file for each server.

```shell
for i in 0 1 2; do echo "myid zk-$i";kubectl exec zk-$i -- cat /var/lib/zookeeper/data/myid; done
```

As the identifiers are natural numbers and the ordinal indices are non-negative 
integers, you can generate an identifier by adding one to the ordinal.

```shell
myid zk-0
1
myid zk-1
2
myid zk-2
3
```

Get the FQDN (Fully Qualified Domain Name) of each Pod in the `zk` StatefulSet.

```shell
for i in 0 1 2; do kubectl exec zk-$i -- hostname -f; done
```

The `zk-headless` Service creates a domain for all of the Pods, 
`zk-headless.default.svc.cluster.local`.

```shell
zk-0.zk-headless.default.svc.cluster.local
zk-1.zk-headless.default.svc.cluster.local
zk-2.zk-headless.default.svc.cluster.local
```

The A records in [Kubernetes DNS](/docs/concepts/services-networking/dns-pod-service/) resolve the FQDNs to the Pods' IP addresses. 
If the Pods are rescheduled, the A records will be updated with the Pods' new IP 
addresses, but the A record's names will not change.

ZooKeeper stores its application configuration in a file named `zoo.cfg`. Use 
`kubectl exec` to view the contents of the `zoo.cfg` file in the `zk-0` Pod.

```
kubectl exec zk-0 -- cat /opt/zookeeper/conf/zoo.cfg
```

For the `server.1`, `server.2`, and `server.3` properties at the bottom of
the file, the `1`, `2`, and `3` correspond to the identifiers in the
ZooKeeper servers' `myid` files. They are set to the FQDNs for the Pods in 
the `zk` StatefulSet. 

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
autopurge.purgeInteval=0
server.1=zk-0.zk-headless.default.svc.cluster.local:2888:3888
server.2=zk-1.zk-headless.default.svc.cluster.local:2888:3888
server.3=zk-2.zk-headless.default.svc.cluster.local:2888:3888
```

### Achieving Consensus

Consensus protocols require that the identifiers of each participant be 
unique. No two participants in the Zab protocol should claim the same unique 
identifier. This is necessary to allow the processes in the system to agree on 
which processes have committed which data. If two Pods were launched with the 
same ordinal, two ZooKeeper servers would both identify themselves as the same
 server.

When you created the `zk` StatefulSet, the StatefulSet's controller created 
each Pod sequentially, in the order defined by the Pods' ordinal indices, and it 
waited for each Pod to be Running and Ready before creating the next Pod. 

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

The A records for each Pod are only entered when the Pod becomes Ready. Therefore,
the FQDNs of the ZooKeeper servers will only resolve to a single endpoint, and that
endpoint will be the unique ZooKeeper server claiming the identity configured 
in its `myid` file.

```shell
zk-0.zk-headless.default.svc.cluster.local
zk-1.zk-headless.default.svc.cluster.local
zk-2.zk-headless.default.svc.cluster.local
```

This ensures that the `servers` properties in the ZooKeepers' `zoo.cfg` files 
represents a correctly configured ensemble.

```shell
server.1=zk-0.zk-headless.default.svc.cluster.local:2888:3888
server.2=zk-1.zk-headless.default.svc.cluster.local:2888:3888
server.3=zk-2.zk-headless.default.svc.cluster.local:2888:3888
```

When the servers use the Zab protocol to attempt to commit a value, they will 
either achieve consensus and commit the value (if leader election has succeeded 
and at least two of the Pods are Running and Ready), or they will fail to do so 
(if either of the aforementioned conditions are not met). No state will arise 
where one server acknowledges a write on behalf of another.

### Sanity Testing the Ensemble

The most basic sanity test is to write some data to one ZooKeeper server and 
to read the data from another. 

Use the `zkCli.sh` script to write `world` to the path `/hello` on the `zk-0` Pod.

```shell
kubectl exec zk-0 zkCli.sh create /hello world
```

This will write `world` to the `/hello` path in the ensemble.

```shell
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
Created /hello
```

Get the data from the `zk-1` Pod.

```shell
kubectl exec zk-1 zkCli.sh get /hello
```

The data that you created on `zk-0` is available on all of the servers in the 
ensemble.

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

### Providing Durable Storage

As mentioned in the [ZooKeeper Basics](#zookeeper-basics) section,
ZooKeeper commits all entries to a durable WAL, and periodically writes snapshots 
in memory state, to storage media. Using WALs to provide durability is a common 
technique for applications that use consensus protocols to achieve a replicated
state machine and for storage applications in general.

Use [`kubectl delete`](/docs/user-guide/kubectl/{{page.version}}/#delete) to delete the 
`zk` StatefulSet.

```shell
kubectl delete statefulset zk
statefulset "zk" deleted
```

Watch the termination of the Pods in the StatefulSet.

```shell
get pods -w -l app=zk
```

When `zk-0` if fully terminated, use `CRTL-C` to terminate kubectl.

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
Reapply the manifest in `zookeeper.yaml`.

```shell
kubectl apply -f https://k8s.io/docs/tutorials/stateful-application/zookeeper.yaml
```

The `zk` StatefulSet will be created, but, as they already exist, the other API 
Objects in the manifest will not be modified.

```shell
statefulset "zk" created
Error from server (AlreadyExists): error when creating "zookeeper.yaml": services "zk-headless" already exists
Error from server (AlreadyExists): error when creating "zookeeper.yaml": configmaps "zk-config" already exists
Error from server (AlreadyExists): error when creating "zookeeper.yaml": poddisruptionbudgets.policy "zk-budget" already exists
```

Watch the StatefulSet controller recreate the StatefulSet's Pods.

```shell
kubectl get pods -w -l app=zk
```

Once the `zk-2` Pod is Running and Ready, use `CRTL-C` to terminate kubectl.

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

Get the value you entered during the [sanity test](#sanity-testing-the-ensemble), 
from the `zk-2` Pod.

```shell
kubectl exec zk-2 zkCli.sh get /hello
```

Even though all of the Pods in the `zk` StatefulSet have been terminated and 
recreated, the ensemble still serves the original value.

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

The `volumeClaimTemplates` field, of the `zk` StatefulSet's `spec`, specifies a 
PersistentVolume that will be provisioned for each Pod. 

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


The StatefulSet controller generates a PersistentVolumeClaim for each Pod in 
the StatefulSet. 

Get the StatefulSet's PersistentVolumeClaims.

```shell
kubectl get pvc -l app=zk
```

When the StatefulSet recreated its Pods, the Pods' PersistentVolumes were 
remounted.

```shell
NAME           STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
datadir-zk-0   Bound     pvc-bed742cd-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
datadir-zk-1   Bound     pvc-bedd27d2-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
datadir-zk-2   Bound     pvc-bee0817e-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
```

The `volumeMounts` section of the StatefulSet's container `template` causes the
PersistentVolumes to be mounted to the ZooKeeper servers' data directories.

```shell
volumeMounts:
        - name: datadir
          mountPath: /var/lib/zookeeper
```

When a Pod in the `zk` StatefulSet is (re)scheduled, it will always have the 
same PersistentVolume mounted to the ZooKeeper server's data directory. 
Even when the Pods are rescheduled, all of the writes made to the ZooKeeper 
servers' WALs, and all of their snapshots, remain durable.

## Ensuring Consistent Configuration

As noted in the [Facilitating Leader Election](#facilitating-leader-election) and
[Achieving Consensus](#achieving-consensus) sections, the servers in a 
ZooKeeper ensemble require consistent configuration in order to elect a leader 
and form a quorum. They also require consistent configuration of the Zab protocol
in order for the protocol to work correctly over a network. You can use 
ConfigMaps to achieve this. 

Get the `zk-config` ConfigMap.

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

The `env` field of the `zk` StatefulSet's Pod `template` reads the ConfigMap 
into environment variables. These variables are injected into the containers 
environment.

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

The entry point of the container invokes a bash script, `zkGenConfig.sh`, prior to
launching the ZooKeeper server process. This bash script generates the 
ZooKeeper configuration files from the supplied environment variables.

```yaml
 command:
        - sh
        - -c
        - zkGenConfig.sh && zkServer.sh start-foreground
```

Examine the environment of all of the Pods in the `zk` StatefulSet.

```shell
for i in 0 1 2; do kubectl exec zk-$i env | grep ZK_*;echo""; done
```

All of the variables populated from `zk-config` contain identical values. This 
allows the `zkGenConfig.sh` script to create consistent configurations for all 
of the ZooKeeper servers in the ensemble.

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

### Configuring Logging

One of the files generated by the `zkGenConfig.sh` script controls ZooKeeper's logging. 
ZooKeeper uses [Log4j](http://logging.apache.org/log4j/2.x/), and, by default, 
it uses a time and size based rolling file appender for its logging configuration. 
Get the logging configuration from one of Pods in the `zk` StatefulSet.

```shell
kubectl exec zk-0 cat /usr/etc/zookeeper/log4j.properties
```

The logging configuration below will cause the ZooKeeper process to write all 
of its logs to the standard output file stream.

```shell
zookeeper.root.logger=CONSOLE
zookeeper.console.threshold=INFO
log4j.rootLogger=${zookeeper.root.logger}
log4j.appender.CONSOLE=org.apache.log4j.ConsoleAppender
log4j.appender.CONSOLE.Threshold=${zookeeper.console.threshold}
log4j.appender.CONSOLE.layout=org.apache.log4j.PatternLayout
log4j.appender.CONSOLE.layout.ConversionPattern=%d{ISO8601} [myid:%X{myid}] - %-5p [%t:%C{1}@%L] - %m%n
```

This is the simplest possible way to safely log inside the container. As the 
application's logs are being written to standard out, Kubernetes will handle 
log rotation for you. Kubernetes also implements a sane retention policy that 
ensures application logs written to standard out and standard error do not 
exhaust local storage media.

Use [`kubectl logs`](/docs/user-guide/kubectl/{{page.version}}/#logs) to retrieve the last 
few log lines from one of the Pods.

```shell
kubectl logs zk-0 --tail 20
```

Application logs that are written to standard out or standard error are viewable 
using `kubectl logs` and from the Kubernetes Dashboard.

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

Kubernetes also supports more powerful, but more complex, logging integrations 
with [Logging Using Stackdriver](/docs/tasks/debug-application-cluster/logging-stackdriver/) 
and [Logging Using Elasticsearch and Kibana](/docs/tasks/debug-application-cluster/logging-elasticsearch-kibana/).
For cluster level log shipping and aggregation, you should consider deploying a
[sidecar](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html) 
container to rotate and ship your logs.

### Configuring a Non-Privileged User

The best practices with respect to allowing an application to run as a privileged 
user inside of a container are a matter of debate. If your organization requires 
that applications be run as a non-privileged user you can use a 
[SecurityContext](/docs/tasks/configure-pod-container/security-context/) to control the user that 
the entry point runs as.

The `zk` StatefulSet's Pod `template` contains a SecurityContext.

```yaml
securityContext:
  runAsUser: 1000
  fsGroup: 1000
```

In the Pods' containers, UID 1000 corresponds to the zookeeper user and GID 1000 
corresponds to the zookeeper group.

Get the ZooKeeper process information from the `zk-0` Pod.

```shell
kubectl exec zk-0 -- ps -elf
```

As the `runAsUser` field of the `securityContext` object is set to 1000, 
instead of running as root, the ZooKeeper process runs as the zookeeper user.

```shell
F S UID        PID  PPID  C PRI  NI ADDR SZ WCHAN  STIME TTY          TIME CMD
4 S zookeep+     1     0  0  80   0 -  1127 -      20:46 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
0 S zookeep+    27     1  0  80   0 - 1155556 -    20:46 ?        00:00:19 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```

By default, when the Pod's PersistentVolume is mounted to the ZooKeeper server's 
data directory, it is only accessible by the root user. This configuration 
prevents the ZooKeeper process from writing to its WAL and storing its snapshots.

Get the file permissions of the ZooKeeper data directory on the `zk-0` Pod.

```shell
kubectl exec -ti zk-0 -- ls -ld /var/lib/zookeeper/data
```

As the `fsGroup` field of the `securityContext` object is set to 1000, 
the ownership of the Pods' PersistentVolumes is set to the zookeeper group, 
and the ZooKeeper process is able to successfully read and write its data.

```shell
drwxr-sr-x 3 zookeeper zookeeper 4096 Dec  5 20:45 /var/lib/zookeeper/data
```

## Managing the ZooKeeper Process

The [ZooKeeper documentation](https://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_supervision) 
documentation indicates that "You will want to have a supervisory process that 
manages each of your ZooKeeper server processes (JVM)." Utilizing a watchdog 
(supervisory process) to restart failed processes in a distributed system is a 
common pattern. When deploying an application in Kubernetes, rather than using 
an external utility as a supervisory process, you should use Kubernetes as the 
watchdog for your application.

### Handling Process Failure 


[Restart Policies](/docs/user-guide/pod-states/#restartpolicy) control how 
Kubernetes handles process failures for the entry point of the container in a Pod.
For Pods in a StatefulSet, the only appropriate RestartPolicy is Always, and this
is the default value. For stateful applications you should **never** override 
the default policy.


Examine the process tree for the ZooKeeper server running in the `zk-0` Pod.

```shell
kubectl exec zk-0 -- ps -ef
```

The command used as the container's entry point has PID 1, and 
the ZooKeeper process, a child of the entry point, has PID 23.


```
UID        PID  PPID  C STIME TTY          TIME CMD
zookeep+     1     0  0 15:03 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
zookeep+    27     1  0 15:03 ?        00:00:03 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```


In one terminal watch the Pods in the `zk` StatefulSet.

```shell
kubectl get pod -w -l app=zk
```


In another terminal, kill the ZooKeeper process in Pod `zk-0`.

```shell
 kubectl exec zk-0 -- pkill java
```


The death of the ZooKeeper process caused its parent process to terminate. As 
the RestartPolicy of the container is Always, the parent process was relaunched. 


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


If your application uses a script (such as zkServer.sh) to launch the process 
that implements the application's business logic, the script must terminate with the
child process. This ensures that Kubernetes will restart the application's
container when the process implementing the application's business logic fails. 


### Testing for Liveness


Configuring your application to restart failed processes is not sufficient to 
keep a distributed system healthy. There are many scenarios where 
a system's processes can be both alive and unresponsive, or otherwise 
unhealthy. You should use liveness probes in order to notify Kubernetes 
that your application's processes are unhealthy and should be restarted.


The Pod `template` for the `zk` StatefulSet specifies a liveness probe.


```yaml
 livenessProbe:
          exec:
            command:
            - "zkOk.sh"
          initialDelaySeconds: 15
          timeoutSeconds: 5
```


The probe calls a simple bash script that uses the ZooKeeper `ruok` four letter 
word to test the server's health.


```bash
ZK_CLIENT_PORT=${ZK_CLIENT_PORT:-2181}
OK=$(echo ruok | nc 127.0.0.1 $ZK_CLIENT_PORT)
if [ "$OK" == "imok" ]; then
    exit 0
else
    exit 1
fi
```


In one terminal window, watch the Pods in the `zk` StatefulSet.


```shell
kubectl get pod -w -l app=zk
```


In another window, delete the `zkOk.sh` script from the file system of Pod `zk-0`.


```shell
kubectl exec zk-0 -- rm /opt/zookeeper/bin/zkOk.sh
```


When the liveness probe for the ZooKeeper process fails, Kubernetes will 
automatically restart the process for you, ensuring that unhealthy processes in
the ensemble are restarted.


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


### Testing for Readiness


Readiness is not the same as liveness. If a process is alive, it is scheduled 
and healthy. If a process is ready, it is able to process input. Liveness is 
a necessary, but not sufficient, condition for readiness. There are many cases,
particularly during initialization and termination, when a process can be 
alive but not ready.


If you specify a readiness probe, Kubernetes will ensure that your application's
processes will not receive network traffic until their readiness checks pass.


For a ZooKeeper server, liveness implies readiness.  Therefore, the readiness 
probe from the `zookeeper.yaml` manifest is identical to the liveness probe. 


```yaml
 readinessProbe:
          exec:
            command:
            - "zkOk.sh"
          initialDelaySeconds: 15
          timeoutSeconds: 5
```


Even though the liveness and readiness probes are identical, it is important 
to specify both. This ensures that only healthy servers in the ZooKeeper 
ensemble receive network traffic.


## Tolerating Node Failure

ZooKeeper needs a quorum of servers in order to successfully commit mutations 
to data. For a three server ensemble, two servers must be healthy in order for 
writes to succeed. In quorum based systems, members are deployed across failure 
domains to ensure availability. In order to avoid an outage, due to the loss of an 
individual machine, best practices preclude co-locating multiple instances of the 
application on the same machine.

By default, Kubernetes may co-locate Pods in a StatefulSet on the same node. 
For the three server ensemble you created, if two servers reside on the same
node, and that node fails, the clients of your ZooKeeper service will experience
an outage until at least one of the Pods can be rescheduled. 

You should always provision additional capacity to allow the processes of critical
systems to be rescheduled in the event of node failures. If you do so, then the 
outage will only last until the Kubernetes scheduler reschedules one of the ZooKeeper 
servers. However, if you want your service to tolerate node failures with no downtime,
you should set `podAntiAffinity`.

Get the nodes for Pods in the `zk` Stateful Set.

```shell{% raw %}
for i in 0 1 2; do kubectl get pod zk-$i --template {{.spec.nodeName}}; echo ""; done
``` {% endraw %}

All of the Pods in the `zk` StatefulSet are deployed on different nodes.

```shell
kubernetes-minion-group-cxpk
kubernetes-minion-group-a5aq
kubernetes-minion-group-2g2d
```

This is because the Pods in the `zk` StatefulSet have a PodAntiAffinity specified.

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

The `requiredDuringSchedulingRequiredDuringExecution` field tells the 
Kubernetes Scheduler that it should never co-locate two Pods from the `zk-headless`
Service in the domain defined by the `topologyKey`. The `topologyKey`
`kubernetes.io/hostname` indicates that the domain is an individual node. Using 
different rules, labels, and selectors, you can extend this technique to spread 
your ensemble across physical, network, and power failure domains.

## Surviving Maintenance

**In this section you will cordon and drain nodes. If you are using this tutorial
on a shared cluster, be sure that this will not adversely affect other tenants.**

The previous section showed you how to spread your Pods across nodes to survive 
unplanned node failures, but you also need to plan for temporary node failures 
that occur due to planned maintenance.

Get the nodes in your cluster.

```shell
kubectl get nodes
```

Use [`kubectl cordon`](/docs/user-guide/kubectl/{{page.version}}/#cordon) to 
cordon all but four of the nodes in your cluster.

```shell{% raw %}
kubectl cordon < node name >
```{% endraw %}

Get the `zk-budget` PodDisruptionBudget.

```shell
kubectl get poddisruptionbudget zk-budget
```

The `min-available` field indicates to Kubernetes that at least two Pods from 
`zk` StatefulSet must be available at any time. 

```yaml
NAME        MIN-AVAILABLE   ALLOWED-DISRUPTIONS   AGE
zk-budget   2               1                     1h

```

In one terminal, watch the Pods in the `zk` StatefulSet.

```shell
kubectl get pods -w -l app=zk
```

In another terminal, get the nodes that the Pods are currently scheduled on.

```shell{% raw %}
for i in 0 1 2; do kubectl get pod zk-$i --template {{.spec.nodeName}}; echo ""; done
kubernetes-minion-group-pb41
kubernetes-minion-group-ixsl
kubernetes-minion-group-i4c4
{% endraw %}
```

Use [`kubectl drain`](/docs/user-guide/kubectl/{{page.version}}/#drain) to cordon and 
drain the node on which the `zk-0` Pod is scheduled.

```shell {% raw %}
kubectl drain $(kubectl get pod zk-0 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-local-data
node "kubernetes-minion-group-pb41" cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-minion-group-pb41, kube-proxy-kubernetes-minion-group-pb41; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-o5elz
pod "zk-0" deleted
node "kubernetes-minion-group-pb41" drained
{% endraw %}```

As there are four nodes in your cluster, `kubectl drain`, succeeds and the 
`zk-0` is rescheduled to another node.

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

Keep watching the StatefulSet's Pods in the first terminal and drain the node on which 
`zk-1` is scheduled.

```shell{% raw %}
kubectl drain $(kubectl get pod zk-1 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-local-data "kubernetes-minion-group-ixsl" cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-minion-group-ixsl, kube-proxy-kubernetes-minion-group-ixsl; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-voc74
pod "zk-1" deleted
node "kubernetes-minion-group-ixsl" drained
{% endraw %}```

The `zk-1` Pod can not be scheduled. As the `zk` StatefulSet contains a 
PodAntiAffinity rule preventing co-location of the Pods, and  as only 
two nodes are schedulable, the Pod will remain in a Pending state.

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

Continue to watch the Pods of the stateful set, and drain the node on which 
`zk-2` is scheduled.

```shell{% raw %}
kubectl drain $(kubectl get pod zk-2 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-local-data
node "kubernetes-minion-group-i4c4" cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-minion-group-i4c4, kube-proxy-kubernetes-minion-group-i4c4; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog
WARNING: Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog; Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-minion-group-i4c4, kube-proxy-kubernetes-minion-group-i4c4
There are pending pods when an error occurred: Cannot evict pod as it would violate the pod's disruption budget.
pod/zk-2
{% endraw %}```

Use `CRTL-C` to terminate to kubectl. 

You can not drain the third node because evicting `zk-2` would violate `zk-budget`. However, 
the node will remain cordoned.

Use `zkCli.sh` to retrieve the value you entered during the sanity test from `zk-0`.

```shell
kubectl exec zk-0 zkCli.sh get /hello
```

The service is still available because its PodDisruptionBudget is respected.

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

Use [`kubectl uncordon`](/docs/user-guide/kubectl/{{page.version}}/#uncordon) to uncordon the first node.

```shell
kubectl uncordon kubernetes-minion-group-pb41
node "kubernetes-minion-group-pb41" uncordoned
```

`zk-1` is rescheduled on this node. Wait until `zk-1` is Running and Ready.

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

Attempt to drain the node on which `zk-2` is scheduled.

```shell{% raw %}
kubectl drain $(kubectl get pod zk-2 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-local-data
node "kubernetes-minion-group-i4c4" already cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-minion-group-i4c4, kube-proxy-kubernetes-minion-group-i4c4; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog
pod "heapster-v1.2.0-2604621511-wht1r" deleted
pod "zk-2" deleted
node "kubernetes-minion-group-i4c4" drained
{% endraw %}```

This time `kubectl drain` succeeds.

Uncordon the second node to allow `zk-2` to be rescheduled.

```shell
kubectl uncordon kubernetes-minion-group-ixsl
node "kubernetes-minion-group-ixsl" uncordoned
```

You can use `kubectl drain` in conjunction with PodDisruptionBudgets to ensure that your service
remains available during maintenance. If drain is used to cordon nodes and evict pods prior to 
taking the node offline for maintenance, services that express a disruption budget will have that 
budget respected. You should always allocate additional capacity for critical services so that 
their Pods can be immediately rescheduled.

{% endcapture %}

{% capture cleanup %}
* Use `kubectl uncordon` to uncordon all the nodes in your cluster.
* You will need to delete the persistent storage media for the PersistentVolumes
used in this tutorial. Follow the necessary steps, based on your environment, 
storage configuration, and provisioning method, to ensure that all storage is 
reclaimed.
{% endcapture %}
{% include templates/tutorial.md %}
