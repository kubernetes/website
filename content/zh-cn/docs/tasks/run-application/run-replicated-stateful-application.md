---
title: 运行一个有状态的应用程序
content_type: tutorial
weight: 30
---
<!--
reviewers:
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Run a Replicated Stateful Application
content_type: tutorial
weight: 30
-->

<!-- overview -->

<!--
This page shows how to run a replicated stateful application using a
{{< glossary_tooltip term_id="statefulset" >}}.
This application is a replicated MySQL database. The example topology has a
single primary server and multiple replicas, using asynchronous row-based
replication.
-->
本页展示如何使用 {{< glossary_tooltip term_id="statefulset" >}}
控制器运行一个有状态的应用程序。此例是多副本的 MySQL 数据库。
示例应用的拓扑结构有一个主服务器和多个副本，使用异步的基于行（Row-Based）
的数据复制。

{{< note >}}
<!--
**This is not a production configuration**. MySQL settings remain on insecure defaults to keep the focus
on general patterns for running stateful applications in Kubernetes.
-->
**这一配置不适合生产环境。**
MySQL 设置都使用的是不安全的默认值，这是因为我们想把重点放在 Kubernetes
中运行有状态应用程序的一般模式上。
{{< /note >}}

## {{% heading "prerequisites" %}}

- {{< include "task-tutorial-prereqs.md" >}}
- {{< include "default-storage-class-prereqs.md" >}}
<!--
- This tutorial assumes you are familiar with
  [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
  and [StatefulSets](/docs/concepts/workloads/controllers/statefulset/),
  as well as other core concepts like [Pods](/docs/concepts/workloads/pods/),
  [Services](/docs/concepts/services-networking/service/), and
  [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
- Some familiarity with MySQL helps, but this tutorial aims to present
  general patterns that should be useful for other systems.
- You are using the default namespace or another namespace that does not contain any conflicting objects.
-->
- 本教程假定你熟悉
  [PersistentVolumes](/zh-cn/docs/concepts/storage/persistent-volumes/)
  与 [StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/)，
  以及其他核心概念，例如 [Pod](/zh-cn/docs/concepts/workloads/pods/)、
  [Service](/zh-cn/docs/concepts/services-networking/service/)与
  [ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)。
- 熟悉 MySQL 会有所帮助，但是本教程旨在介绍对其他系统应该有用的常规模式。
- 你正在使用默认命名空间或不包含任何冲突对象的另一个命名空间。

## {{% heading "objectives" %}}

<!--
- Deploy a replicated MySQL topology with a StatefulSet.
- Send MySQL client traffic.
- Observe resistance to downtime.
- Scale the StatefulSet up and down.
-->
- 使用 StatefulSet 部署多副本 MySQL 拓扑架构。
- 发送 MySQL 客户端请求。
- 观察对宕机的抵抗力。
- 扩缩 StatefulSet 的规模。

<!-- lessoncontent -->

<!--
## Deploy MySQL

The example MySQL deployment consists of a ConfigMap, two Services,
and a StatefulSet.
-->
## 部署 MySQL  {#deploy-mysql}

MySQL 示例部署包含一个 ConfigMap、两个 Service 与一个 StatefulSet。

<!--
### Create a ConfigMap {#configmap}

Create the ConfigMap from the following YAML configuration file:
-->
### 创建一个 ConfigMap   {#configmap}

使用以下的 YAML 配置文件创建 ConfigMap ：

{{% code_sample file="application/mysql/mysql-configmap.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-configmap.yaml
```

<!--
This ConfigMap provides `my.cnf` overrides that let you independently control
configuration on the primary MySQL server and its replicas.
In this case, you want the primary server to be able to serve replication logs to replicas
and you want replicas to reject any writes that don't come via replication.
-->
这个 ConfigMap 提供 `my.cnf` 覆盖设置，使你可以独立控制 MySQL 主服务器和副本服务器的配置。
在这里，你希望主服务器能够将复制日志提供给副本服务器，
并且希望副本服务器拒绝任何不是通过复制进行的写操作。

<!--
There's nothing special about the ConfigMap itself that causes different
portions to apply to different Pods.
Each Pod decides which portion to look at as it's initializing,
based on information provided by the StatefulSet controller.
-->
ConfigMap 本身没有什么特别之处，因而也不会出现不同部分应用于不同的 Pod 的情况。
每个 Pod 都会在初始化时基于 StatefulSet 控制器提供的信息决定要查看的部分。

<!--
### Create Services {#services}

Create the Services from the following YAML configuration file: 
-->
### 创建 Service  {#services}

使用以下 YAML 配置文件创建服务：

{{% code_sample file="application/mysql/mysql-services.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-services.yaml
```

<!--
The headless Service provides a home for the DNS entries that the StatefulSet
{{< glossary_tooltip text="controllers" term_id="controller" >}} creates for each
Pod that's part of the set.
Because the headless Service is named `mysql`, the Pods are accessible by
resolving `<pod-name>.mysql` from within any other Pod in the same Kubernetes
cluster and namespace.
-->
这个无头 Service 给 StatefulSet {{< glossary_tooltip text="控制器" term_id="controller" >}}
为集合中每个 Pod 创建的 DNS 条目提供了一个宿主。
因为无头服务名为 `mysql`，所以可以通过在同一 Kubernetes 集群和命名空间中的任何其他 Pod
内解析 `<Pod 名称>.mysql` 来访问 Pod。

<!--
The client Service, called `mysql-read`, is a normal Service with its own
cluster IP that distributes connections across all MySQL Pods that report
being Ready. The set of potential endpoints includes the primary MySQL server and all
replicas.
-->
客户端 Service 称为 `mysql-read`，是一种常规 Service，具有其自己的集群 IP。
该集群 IP 在报告就绪的所有 MySQL Pod 之间分配连接。
可能的端点集合包括 MySQL 主节点和所有副本节点。

<!--
Note that only read queries can use the load-balanced client Service.
Because there is only one primary MySQL server, clients should connect directly to the
primary MySQL Pod (through its DNS entry within the headless Service) to execute
writes.
-->
请注意，只有读查询才能使用负载平衡的客户端 Service。
因为只有一个 MySQL 主服务器，所以客户端应直接连接到 MySQL 主服务器 Pod
（通过其在无头 Service 中的 DNS 条目）以执行写入操作。

<!--
### Create the StatefulSet {#statefulset}

Finally, create the StatefulSet from the following YAML configuration file:
-->
### 创建 StatefulSet {#statefulset}

最后，使用以下 YAML 配置文件创建 StatefulSet：

{{% code_sample file="application/mysql/mysql-statefulset.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-statefulset.yaml
```

<!--
You can watch the startup progress by running: 
-->
你可以通过运行以下命令查看启动进度：

```shell
kubectl get pods -l app=mysql --watch
```

<!--
After a while, you should see all 3 Pods become `Running`: 
-->
一段时间后，你应该看到所有 3 个 Pod 进入 `Running` 状态：

```
NAME      READY     STATUS    RESTARTS   AGE
mysql-0   2/2       Running   0          2m
mysql-1   2/2       Running   0          1m
mysql-2   2/2       Running   0          1m
```

<!--
Press **Ctrl+C** to cancel the watch.
-->
输入 **Ctrl+C** 结束监视操作。

{{< note >}}
<!--
If you don't see any progress, make sure you have a dynamic PersistentVolume
provisioner enabled, as mentioned in the [prerequisites](#before-you-begin).
-->
如果你看不到任何进度，确保已启用[前提条件](#准备开始)中提到的动态
PersistentVolume 制备器。
{{< /note >}}

<!--
This manifest uses a variety of techniques for managing stateful Pods as part of
a StatefulSet. The next section highlights some of these techniques to explain
what happens as the StatefulSet creates Pods. 
-->
此清单使用多种技术来管理作为 StatefulSet 的一部分的有状态 Pod。
下一节重点介绍其中的一些技巧，以解释 StatefulSet 创建 Pod 时发生的状况。

<!--
## Understanding stateful Pod initialization 

The StatefulSet controller starts Pods one at a time, in order by their
ordinal index.
It waits until each Pod reports being Ready before starting the next one. 
-->
## 了解有状态的 Pod 初始化   {#understanding-stateful-pod-init}

StatefulSet 控制器按序数索引顺序地每次启动一个 Pod。
它一直等到每个 Pod 报告就绪才再启动下一个 Pod。

<!--
In addition, the controller assigns each Pod a unique, stable name of the form
`<statefulset-name>-<ordinal-index>`, which results in Pods named `mysql-0`,
`mysql-1`, and `mysql-2`. 
-->
此外，控制器为每个 Pod 分配一个唯一、稳定的名称，形如 `<statefulset 名称>-<序数索引>`，
其结果是 Pod 名为 `mysql-0`、`mysql-1` 和 `mysql-2`。

<!--
The Pod template in the above StatefulSet manifest takes advantage of these
properties to perform orderly startup of MySQL replication. 
-->
上述 StatefulSet 清单中的 Pod 模板利用这些属性来执行 MySQL 副本的有序启动。

<!--
### Generating configuration 

Before starting any of the containers in the Pod spec, the Pod first runs any
[init Containers](/docs/concepts/workloads/pods/init-containers/)
in the order defined. 
-->
### 生成配置   {#generating-config}

在启动 Pod 规约中的任何容器之前，Pod 首先按顺序运行所有的
[Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)。

<!--
The first init container, named `init-mysql`, generates special MySQL config
files based on the ordinal index. 
-->
第一个名为 `init-mysql` 的 Init 容器根据序号索引生成特殊的 MySQL 配置文件。

<!--
The script determines its own ordinal index by extracting it from the end of
the Pod name, which is returned by the `hostname` command.
Then it saves the ordinal (with a numeric offset to avoid reserved values)
into a file called `server-id.cnf` in the MySQL `conf.d` directory.
This translates the unique, stable identity provided by the StatefulSet
into the domain of MySQL server IDs, which require the same properties. 
-->
该脚本通过从 Pod 名称的末尾提取索引来确定自己的序号索引，而 Pod 名称由 `hostname` 命令返回。
然后将序数（带有数字偏移量以避免保留值）保存到 MySQL `conf.d` 目录中的文件 `server-id.cnf`。
这一操作将 StatefulSet 所提供的唯一、稳定的标识转换为 MySQL 服务器 ID，
而这些 ID 也是需要唯一性、稳定性保证的。

<!--
The script in the `init-mysql` container also applies either `primary.cnf` or
`replica.cnf` from the ConfigMap by copying the contents into `conf.d`.
Because the example topology consists of a single primary MySQL server and any number of
replicas, the script assigns ordinal `0` to be the primary server, and everyone
else to be replicas. 

Combined with the StatefulSet controller's
[deployment order guarantee](/docs/concepts/workloads/controllers/statefulset/#deployment-and-scaling-guarantees),
this ensures the primary MySQL server is Ready before creating replicas, so they can begin
replicating.
-->
通过将内容复制到 `conf.d` 中，`init-mysql` 容器中的脚本也可以应用 ConfigMap 中的
`primary.cnf` 或 `replica.cnf`。
由于示例部署结构由单个 MySQL 主节点和任意数量的副本节点组成，
因此脚本仅将序数 `0` 指定为主节点，而将其他所有节点指定为副本节点。

与 StatefulSet
控制器的[部署顺序保证](/zh-cn/docs/concepts/workloads/controllers/statefulset/#deployment-and-scaling-guarantees)相结合，
可以确保 MySQL 主服务器在创建副本服务器之前已准备就绪，以便它们可以开始复制。

<!--
### Cloning existing data 

In general, when a new Pod joins the set as a replica, it must assume the primary MySQL
server might already have data on it. It also must assume that the replication
logs might not go all the way back to the beginning of time. 
-->
### 克隆现有数据   {#cloning-existing-data}

通常，当新 Pod 作为副本节点加入集合时，必须假定 MySQL 主节点可能已经有数据。
还必须假设复制日志可能不会一直追溯到时间的开始。

<!--
These conservative assumptions are the key to allow a running StatefulSet
to scale up and down over time, rather than being fixed at its initial size. 
-->
这些保守的假设是允许正在运行的 StatefulSet 随时间扩大和缩小而不是固定在其初始大小的关键。

<!--
The second init container, named `clone-mysql`, performs a clone operation on
a replica Pod the first time it starts up on an empty PersistentVolume.
That means it copies all existing data from another running Pod,
so its local state is consistent enough to begin replicating from the primary server.
-->
第二个名为 `clone-mysql` 的 Init 容器，第一次在带有空 PersistentVolume 的副本 Pod
上启动时，会在从属 Pod 上执行克隆操作。
这意味着它将从另一个运行中的 Pod 复制所有现有数据，使此其本地状态足够一致，
从而可以开始从主服务器复制。

<!--
MySQL itself does not provide a mechanism to do this, so the example uses a
popular open-source tool called Percona XtraBackup.
During the clone, the source MySQL server might suffer reduced performance.
To minimize impact on the primary MySQL server, the script instructs each Pod to clone
from the Pod whose ordinal index is one lower.
This works because the StatefulSet controller always ensures Pod `N` is
Ready before starting Pod `N+1`. 
-->
MySQL 本身不提供执行此操作的机制，因此本示例使用了一种流行的开源工具 Percona XtraBackup。
在克隆期间，源 MySQL 服务器性能可能会受到影响。
为了最大程度地减少对 MySQL 主服务器的影响，该脚本指示每个 Pod 从序号较低的 Pod 中克隆。
可以这样做的原因是 StatefulSet 控制器始终确保在启动 Pod `N+1` 之前 Pod `N` 已准备就绪。

<!--
### Starting replication 

After the init containers complete successfully, the regular containers run.
The MySQL Pods consist of a `mysql` container that runs the actual `mysqld`
server, and an `xtrabackup` container that acts as a
[sidecar](/blog/2015/06/the-distributed-system-toolkit-patterns).
-->
### 开始复制   {#starting-replication}

Init 容器成功完成后，应用容器将运行。MySQL Pod 由运行实际 `mysqld` 服务的 `mysql`
容器和充当[辅助工具](/blog/2015/06/the-distributed-system-toolkit-patterns)的
xtrabackup 容器组成。

<!--
The `xtrabackup` sidecar looks at the cloned data files and determines if
it's necessary to initialize MySQL replication on the replica.
If so, it waits for `mysqld` to be ready and then executes the
`CHANGE MASTER TO` and `START SLAVE` commands with replication parameters
extracted from the XtraBackup clone files. 
-->
`xtrabackup` sidecar 容器查看克隆的数据文件，并确定是否有必要在副本服务器上初始化 MySQL 复制。
如果是这样，它将等待 `mysqld` 准备就绪，然后使用从 XtraBackup 克隆文件中提取的复制参数执行
`CHANGE MASTER TO` 和 `START SLAVE` 命令。

<!--
Once a replica begins replication, it remembers its primary MySQL server and
reconnects automatically if the server restarts or the connection dies.
Also, because replicas look for the primary server at its stable DNS name
(`mysql-0.mysql`), they automatically find the primary server even if it gets a new
Pod IP due to being rescheduled. 
-->
一旦副本服务器开始复制后，它会记住其 MySQL 主服务器，并且如果服务器重新启动或连接中断也会自动重新连接。
另外，因为副本服务器会以其稳定的 DNS 名称查找主服务器（`mysql-0.mysql`），
即使由于重新调度而获得新的 Pod IP，它们也会自动找到主服务器。

<!--
Lastly, after starting replication, the `xtrabackup` container listens for
connections from other Pods requesting a data clone.
This server remains up indefinitely in case the StatefulSet scales up, or in
case the next Pod loses its PersistentVolumeClaim and needs to redo the clone. 
-->
最后，开始复制后，`xtrabackup` 容器监听来自其他 Pod 的连接，处理其数据克隆请求。
如果 StatefulSet 扩大规模，或者下一个 Pod 失去其 PersistentVolumeClaim 并需要重新克隆，
则此服务器将无限期保持运行。

<!--
## Sending client traffic 

You can send test queries to the primary MySQL server (hostname `mysql-0.mysql`)
by running a temporary container with the `mysql:5.7` image and running the
`mysql` client binary. 
-->
## 发送客户端请求   {#sending-client-traffic}

你可以通过运行带有 `mysql:5.7` 镜像的临时容器并运行 `mysql` 客户端二进制文件，
将测试查询发送到 MySQL 主服务器（主机名 `mysql-0.mysql`）。

```shell
kubectl run mysql-client --image=mysql:5.7 -i --rm --restart=Never --\
  mysql -h mysql-0.mysql <<EOF
CREATE DATABASE test;
CREATE TABLE test.messages (message VARCHAR(250));
INSERT INTO test.messages VALUES ('hello');
EOF
```

<!--
Use the hostname `mysql-read` to send test queries to any server that reports
being Ready: 
-->
使用主机名 `mysql-read` 将测试查询发送到任何报告为就绪的服务器：

```shell
kubectl run mysql-client --image=mysql:5.7 -i -t --rm --restart=Never --\
  mysql -h mysql-read -e "SELECT * FROM test.messages"
```

<!--
You should get output like this: 
-->
你应该获得如下输出：

```
Waiting for pod default/mysql-client to be running, status is Pending, pod ready: false
+---------+
| message |
+---------+
| hello   |
+---------+
pod "mysql-client" deleted
```

<!--
To demonstrate that the `mysql-read` Service distributes connections across
servers, you can run `SELECT @@server_id` in a loop: 
-->
为了演示 `mysql-read` 服务在服务器之间分配连接，你可以在循环中运行 `SELECT @@server_id`：

```shell
kubectl run mysql-client-loop --image=mysql:5.7 -i -t --rm --restart=Never --\
  bash -ic "while sleep 1; do mysql -h mysql-read -e 'SELECT @@server_id,NOW()'; done"
```

<!--
You should see the reported `@@server_id` change randomly, because a different
endpoint might be selected upon each connection attempt: 
-->
你应该看到报告的 `@@server_id` 发生随机变化，因为每次尝试连接时都可能选择了不同的端点：

```
+-------------+---------------------+
| @@server_id | NOW()               |
+-------------+---------------------+
|         100 | 2006-01-02 15:04:05 |
+-------------+---------------------+
+-------------+---------------------+
| @@server_id | NOW()               |
+-------------+---------------------+
|         102 | 2006-01-02 15:04:06 |
+-------------+---------------------+
+-------------+---------------------+
| @@server_id | NOW()               |
+-------------+---------------------+
|         101 | 2006-01-02 15:04:07 |
+-------------+---------------------+
```

<!--
You can press **Ctrl+C** when you want to stop the loop, but it's useful to keep
it running in another window so you can see the effects of the following steps. 
-->
要停止循环时可以按 **Ctrl+C** ，但是让它在另一个窗口中运行非常有用，
这样你就可以看到以下步骤的效果。

<!--
## Simulate Pod and Node failure {#simulate-pod-and-node-downtime}

To demonstrate the increased availability of reading from the pool of replicas
instead of a single server, keep the `SELECT @@server_id` loop from above
running while you force a Pod out of the Ready state. 
-->
## 模拟 Pod 和 Node 失效   {#simulate-pod-and-node-downtime}

为了证明从副本节点缓存而不是单个服务器读取数据的可用性提高，请在使 Pod 退出 Ready
状态时，保持上述 `SELECT @@server_id` 循环一直运行。

<!--
### Break the Readiness probe

The [readiness probe](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-readiness-probes)
for the `mysql` container runs the command `mysql -h 127.0.0.1 -e 'SELECT 1'`
to make sure the server is up and able to execute queries.
-->
### 破坏就绪态探测   {#break-readiness-probe}

`mysql` 容器的[就绪态探测](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-readiness-probes)
运行命令 `mysql -h 127.0.0.1 -e 'SELECT 1'`，以确保服务器已启动并能够执行查询。

<!--
One way to force this readiness probe to fail is to break that command: 
-->
迫使就绪态探测失败的一种方法就是中止该命令：

```shell
kubectl exec mysql-2 -c mysql -- mv /usr/bin/mysql /usr/bin/mysql.off
```

<!--
This reaches into the actual container's filesystem for Pod `mysql-2` and
renames the `mysql` command so the readiness probe can't find it.
After a few seconds, the Pod should report one of its containers as not Ready,
which you can check by running: 
-->
此命令会进入 Pod `mysql-2` 的实际容器文件系统，重命名 `mysql` 命令，导致就绪态探测无法找到它。
几秒钟后， Pod 会报告其中一个容器未就绪。你可以通过运行以下命令进行检查：

```shell
kubectl get pod mysql-2
```

<!--
Look for `1/2` in the `READY` column: 
-->
在 `READY` 列中查找 `1/2`：

```
NAME      READY     STATUS    RESTARTS   AGE
mysql-2   1/2       Running   0          3m
```

<!--
At this point, you should see your `SELECT @@server_id` loop continue to run,
although it never reports `102` anymore.
Recall that the `init-mysql` script defined `server-id` as `100 + $ordinal`,
so server ID `102` corresponds to Pod `mysql-2`. 
-->
此时，你应该会看到 `SELECT @@server_id` 循环继续运行，尽管它不再报告 `102`。
回想一下，`init-mysql` 脚本将 `server-id` 定义为 `100 + $ordinal`，
因此服务器 ID `102` 对应于 Pod `mysql-2`。

<!--
Now repair the Pod and it should reappear in the loop output
after a few seconds: 
-->
现在修复 Pod，几秒钟后它应该重新出现在循环输出中：

```shell
kubectl exec mysql-2 -c mysql -- mv /usr/bin/mysql.off /usr/bin/mysql
```

<!--
### Delete Pods 

The StatefulSet also recreates Pods if they're deleted, similar to what a
ReplicaSet does for stateless Pods.
-->
### 删除 Pod   {#delete-pods}

如果删除了 Pod，则 StatefulSet 还会重新创建 Pod，类似于 ReplicaSet 对无状态 Pod 所做的操作。

```shell
kubectl delete pod mysql-2
```

<!--
The StatefulSet controller notices that no `mysql-2` Pod exists anymore,
and creates a new one with the same name and linked to the same
PersistentVolumeClaim.
You should see server ID `102` disappear from the loop output for a while
and then return on its own.
-->
StatefulSet 控制器注意到不再存在 `mysql-2` Pod，于是创建一个具有相同名称并链接到相同
PersistentVolumeClaim 的新 Pod。
你应该看到服务器 ID `102` 从循环输出中消失了一段时间，然后又自行出现。

<!--
### Drain a Node 

If your Kubernetes cluster has multiple Nodes, you can simulate Node downtime
(such as when Nodes are upgraded) by issuing a
[drain](/docs/reference/generated/kubectl/kubectl-commands/#drain).
-->
### 腾空节点   {#drain-a-node}

如果你的 Kubernetes 集群具有多个节点，则可以通过发出以下
[drain](/docs/reference/generated/kubectl/kubectl-commands/#drain)
命令来模拟节点停机（就好像节点在被升级）。

<!--
First determine which Node one of the MySQL Pods is on: 
-->
首先确定 MySQL Pod 之一在哪个节点上：

```shell
kubectl get pod mysql-2 -o wide
```

<!--
The Node name should show up in the last column: 
-->
节点名称应显示在最后一列中：

```
NAME      READY     STATUS    RESTARTS   AGE       IP            NODE
mysql-2   2/2       Running   0          15m       10.244.5.27   kubernetes-node-9l2t
```

<!--
Then, drain the Node by running the following command, which cordons it so
no new Pods may schedule there, and then evicts any existing Pods.
Replace `<node-name>` with the name of the Node you found in the last step. 
-->
接下来，通过运行以下命令腾空节点，该命令将其保护起来，以使新的 Pod 不能调度到该节点，
然后逐出所有现有的 Pod。将 `<节点名称>` 替换为在上一步中找到的节点名称。

{{< caution >}}
<!--
Draining a Node can impact other workloads and applications
running on the same node. Only perform the following step in a test
cluster.
-->
腾空一个 Node 可能影响到在该节点上运行的其他负载和应用。
只应在测试集群上执行下列步骤。
{{< /caution >}}

<!--
```shell
# See above advice about impact on other workloads
kubectl drain <node-name> --force --delete-emptydir-data --ignore-daemonsets
```
-->

```shell
# 关于对其他负载的影响，参见前文建议
kubectl drain <节点名称> --force --delete-local-data --ignore-daemonsets
```

<!--
Now you can watch as the Pod reschedules on a different Node: 
-->
现在，你可以监视 Pod 被重新调度到其他节点上：

```shell
kubectl get pod mysql-2 -o wide --watch
```

<!--
It should look something like this: 
-->
它看起来应该像这样：

```
NAME      READY   STATUS          RESTARTS   AGE       IP            NODE
mysql-2   2/2     Terminating     0          15m       10.244.1.56   kubernetes-node-9l2t
[...]
mysql-2   0/2     Pending         0          0s        <none>        kubernetes-node-fjlm
mysql-2   0/2     Init:0/2        0          0s        <none>        kubernetes-node-fjlm
mysql-2   0/2     Init:1/2        0          20s       10.244.5.32   kubernetes-node-fjlm
mysql-2   0/2     PodInitializing 0          21s       10.244.5.32   kubernetes-node-fjlm
mysql-2   1/2     Running         0          22s       10.244.5.32   kubernetes-node-fjlm
mysql-2   2/2     Running         0          30s       10.244.5.32   kubernetes-node-fjlm
```

<!--
And again, you should see server ID `102` disappear from the
`SELECT @@server_id` loop output for a while and then return. 
-->
再次，你应该看到服务器 ID `102` 从 `SELECT @@server_id`
循环输出中消失一段时间，然后再次出现。

<!--
Now uncordon the Node to return it to a normal state: 

```shell
kubectl uncordon <node-name>
```
-->
现在去掉节点保护（Uncordon），使其恢复为正常模式：

```shell
kubectl uncordon <节点名称>
```

<!--
## Scaling the number of replicas

When you use MySQL replication, you can scale your read query capacity by
adding replicas.
For a StatefulSet, you can achieve this with a single command:
-->
## 扩展副本节点数量    {#scaling-number-of-replicas}

使用 MySQL 复制时，你可以通过添加副本节点来扩展读取查询的能力。
对于 StatefulSet，你可以使用单个命令实现此目的：

```shell
kubectl scale statefulset mysql --replicas=5
```

<!--
Watch the new Pods come up by running: 
-->
运行下面的命令，监视新的 Pod 启动：

```shell
kubectl get pods -l app=mysql --watch
```

<!--
Once they're up, you should see server IDs `103` and `104` start appearing in
the `SELECT @@server_id` loop output.

You can also verify that these new servers have the data you added before they
existed: 
-->
一旦 Pod 启动，你应该看到服务器 ID `103` 和 `104` 开始出现在 `SELECT @@server_id`
循环输出中。

你还可以验证这些新服务器在存在之前已添加了数据：

```shell
kubectl run mysql-client --image=mysql:5.7 -i -t --rm --restart=Never --\
  mysql -h mysql-3.mysql -e "SELECT * FROM test.messages"
```

```
Waiting for pod default/mysql-client to be running, status is Pending, pod ready: false
+---------+
| message |
+---------+
| hello   |
+---------+
pod "mysql-client" deleted
```

<!--
Scaling back down is also seamless: 
-->
向下缩容操作也是很平滑的：

```shell
kubectl scale statefulset mysql --replicas=3
```

{{< note >}}
<!--
Although scaling up creates new PersistentVolumeClaims
automatically, scaling down does not automatically delete these PVCs.

This gives you the choice to keep those initialized PVCs around to make
scaling back up quicker, or to extract data before deleting them. 
-->
扩容操作会自动创建新的 PersistentVolumeClaim，但是缩容时不会自动删除这些 PVC。
这使你可以选择保留那些已被初始化的 PVC，以加速再次扩容，或者在删除它们之前提取数据。
{{< /note >}}

<!--
You can see this by running: 
-->
你可以通过运行以下命令查看此效果：

```shell
kubectl get pvc -l app=mysql
```

<!--
Which shows that all 5 PVCs still exist, despite having scaled the
StatefulSet down to 3: 
-->
这表明，尽管将 StatefulSet 缩小为 3，所有 5 个 PVC 仍然存在：

```
NAME           STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
data-mysql-0   Bound     pvc-8acbf5dc-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-1   Bound     pvc-8ad39820-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-2   Bound     pvc-8ad69a6d-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-3   Bound     pvc-50043c45-b1c5-11e6-93fa-42010a800002   10Gi       RWO           2m
data-mysql-4   Bound     pvc-500a9957-b1c5-11e6-93fa-42010a800002   10Gi       RWO           2m
```

<!--
If you don't intend to reuse the extra PVCs, you can delete them: 
-->
如果你不打算重复使用多余的 PVC，则可以删除它们：

```shell
kubectl delete pvc data-mysql-3
kubectl delete pvc data-mysql-4
```

## {{% heading "cleanup" %}}

<!--
1. Cancel the `SELECT @@server_id` loop by pressing **Ctrl+C** in its terminal,
   or running the following from another terminal: 
-->
1. 通过在终端上按 **Ctrl+C** 取消 `SELECT @@server_id` 循环，或从另一个终端运行以下命令：

   ```shell
   kubectl delete pod mysql-client-loop --now
   ```

<!--
1. Delete the StatefulSet. This also begins terminating the Pods. 
-->
2. 删除 StatefulSet。这也会开始终止 Pod。

   ```shell
   kubectl delete statefulset mysql
   ```

<!--
1. Verify that the Pods disappear.
   They might take some time to finish terminating. 
-->
3. 验证 Pod 消失。它们可能需要一些时间才能完成终止。

   ```shell
   kubectl get pods -l app=mysql
   ```

   <!--
   You'll know the Pods have terminated when the above returns:
   -->
   当上述命令返回如下内容时，你就知道 Pod 已终止：

   ```
   No resources found.
   ```

<!--
1. Delete the ConfigMap, Services, and PersistentVolumeClaims. 
-->
4. 删除 ConfigMap、Service 和 PersistentVolumeClaim。

   ```shell
   kubectl delete configmap,service,pvc -l app=mysql
   ```

<!--
1. If you manually provisioned PersistentVolumes, you also need to manually
   delete them, as well as release the underlying resources.
   If you used a dynamic provisioner, it automatically deletes the
   PersistentVolumes when it sees that you deleted the PersistentVolumeClaims.
   Some dynamic provisioners (such as those for EBS and PD) also release the
   underlying resources upon deleting the PersistentVolumes. 
-->
5. 如果你手动制备 PersistentVolume，则还需要手动删除它们，并释放下层资源。
   如果你使用了动态制备器，当得知你删除 PersistentVolumeClaim 时，它将自动删除 PersistentVolume。
   一些动态制备器（例如用于 EBS 和 PD 的制备器）也会在删除 PersistentVolume 时释放下层资源。

## {{% heading "whatsnext" %}}

<!--
- Learn more about [scaling a StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
- Learn more about [debugging a StatefulSet](/docs/tasks/debug/debug-application/debug-statefulset/).
- Learn more about [deleting a StatefulSet](/docs/tasks/run-application/delete-stateful-set/).
- Learn more about [force deleting StatefulSet Pods](/docs/tasks/run-application/force-delete-stateful-set-pod/).
- Look in the [Helm Charts repository](https://artifacthub.io/)
  for other stateful application examples.
-->
- 进一步了解[为 StatefulSet 扩缩容](/zh-cn/docs/tasks/run-application/scale-stateful-set/)；
- 进一步了解[调试 StatefulSet](/zh-cn/docs/tasks/debug/debug-application/debug-statefulset/)；
- 进一步了解[删除 StatefulSet](/zh-cn/docs/tasks/run-application/delete-stateful-set/)；
- 进一步了解[强制删除 StatefulSet Pod](/zh-cn/docs/tasks/run-application/force-delete-stateful-set-pod/)；
- 在 [Helm Charts 仓库](https://artifacthub.io/)中查找其他有状态的应用程序示例。
