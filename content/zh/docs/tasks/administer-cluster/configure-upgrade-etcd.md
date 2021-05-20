---
reviewers:
- mml
- wojtek-t
title: 为 Kubernetes 运行 etcd 集群
content_type: task
---
<!--
---
reviewers:
- mml
- wojtek-t
title: Operating etcd clusters for Kubernetes
content_type: task
---
-->

<!-- overview -->
{{< glossary_definition term_id="etcd" length="all" >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

<!--
## Prerequisites

* Run etcd as a cluster of odd members.

* etcd is a leader-based distributed system. Ensure that the leader
  periodically send heartbeats on time to all followers to keep the cluster
  stable.

* Ensure that no resource starvation occurs.

  Performance and stability of the cluster is sensitive to network and disk
  I/O. Any resource starvation can lead to heartbeat timeout, causing instability
  of the cluster. An unstable etcd indicates that no leader is elected. Under
  such circumstances, a cluster cannot make any changes to its current state,
  which implies no new pods can be scheduled.

* Keeping etcd clusters stable is critical to the stability of Kubernetes
  clusters. Therefore, run etcd clusters on dedicated machines or isolated
  environments for [guaranteed resource requirements](https://etcd.io/docs/current/op-guide/hardware/).

* The minimum recommended version of etcd to run in production is `3.2.10+`.
-->
## 先决条件

* 运行的 etcd 集群个数成员为奇数。

* etcd 是一个 leader-based 分布式系统。确保主节点定期向所有从节点发送心跳，以保持集群稳定。

* 确保不发生资源不足。
  
  集群的性能和稳定性对网络和磁盘 I/O 非常敏感。任何资源匮乏都会导致心跳超时，
  从而导致集群的不稳定。不稳定的情况表明没有选出任何主节点。
  在这种情况下，集群不能对其当前状态进行任何更改，这意味着不能调度新的 pod。

* 保持 etcd 集群的稳定对 Kubernetes 集群的稳定性至关重要。
  因此，请在专用机器或隔离环境上运行 etcd 集群，以满足
  [所需资源需求](https://etcd.io/docs/current/op-guide/hardware/)。

* 在生产中运行的 etcd 的最低推荐版本是 `3.2.10+`。
  
<!--
## Resource requirements

Operating etcd with limited resources is suitable only for testing purposes.
For deploying in production, advanced hardware configuration is required.
Before deploying etcd in production, see
[resource requirement reference](https://etcd.io/docs/current/op-guide/hardware/#example-hardware-configurations).

## Starting etcd clusters

This section covers starting a single-node and multi-node etcd cluster. 
-->
## 资源要求

使用有限的资源运行 etcd 只适合测试目的。为了在生产中部署，需要先进的硬件配置。
在生产中部署 etcd 之前，请查看
[所需资源参考文档](https://etcd.io/docs/current/op-guide/hardware/#example-hardware-configurations)。

## 启动 etcd 集群

本节介绍如何启动单节点和多节点 etcd 集群。

<!--
### Single-node etcd cluster

Use a single-node etcd cluster only for testing purpose.

1. Run the following:

   ```sh
   etcd --listen-client-urls=http://$PRIVATE_IP:2379 \
      --advertise-client-urls=http://$PRIVATE_IP:2379
   ```

2. Start the Kubernetes API server with the flag
   `--etcd-servers=$PRIVATE_IP:2379`.

    Make sure `PRIVATE_IP` is set to your etcd client IP.
-->
### 单节点 etcd 集群

只为测试目的使用单节点 etcd 集群。

1. 运行以下命令：

   ```sh
   etcd --listen-client-urls=http://$PRIVATE_IP:2379 \
      --advertise-client-urls=http://$PRIVATE_IP:2379
   ```

2. 使用参数 `--etcd-servers=$PRIVATE_IP:2379` 启动 Kubernetes API 服务器。

   确保将 `PRIVATE_IP` 设置为etcd客户端 IP。

<!--
### Multi-node etcd cluster

For durability and high availability, run etcd as a multi-node cluster in
production and back it up periodically. A five-member cluster is recommended
in production. For more information, see
[FAQ documentation](https://etcd.io/docs/current/faq/#what-is-failure-tolerance).

Configure an etcd cluster either by static member information or by dynamic
discovery. For more information on clustering, see
[etcd clustering documentation](https://etcd.io/docs/current/op-guide/clustering/).

For an example, consider a five-member etcd cluster running with the following
client URLs: `http://$IP1:2379`, `http://$IP2:2379`, `http://$IP3:2379`,
`http://$IP4:2379`, and `http://$IP5:2379`. To start a Kubernetes API server:

1. Run the following:

   ```shell
   etcd --listen-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379 --advertise-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379
   ```

2. Start the Kubernetes API servers with the flag
   `--etcd-servers=$IP1:2379,$IP2:2379,$IP3:2379,$IP4:2379,$IP5:2379`.

   Make sure the `IP<n>` variables are set to your client IP addresses.
-->
### 多节点 etcd 集群

为了耐用性和高可用性，在生产中将以多节点集群的方式运行 etcd，并且定期备份。
建议在生产中使用五个成员的集群。
有关该内容的更多信息，请参阅
[常见问题文档](https://etcd.io/docs/current/faq/#what-is-failure-tolerance)。

可以通过静态成员信息或动态发现的方式配置 etcd 集群。
有关集群的详细信息，请参阅 
[etcd 集群文档](https://etcd.io/docs/current/op-guide/clustering/)。

例如，考虑运行以下客户端 URL 的五个成员的 etcd 集群：`http://$IP1:2379`，
`http://$IP2:2379`，`http://$IP3:2379`，`http://$IP4:2379` 和 `http://$IP5:2379`。
要启动 Kubernetes API 服务器：

1. 运行以下命令：

   ```shell
   etcd --listen-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379 --advertise-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379
   ```

2. 使用参数 `--etcd-servers=$IP1:2379,$IP2:2379,$IP3:2379,$IP4:2379,$IP5:2379` 
   启动 Kubernetes API 服务器。

   确保将 `IP<n>` 变量设置为客户端 IP 地址。

<!--
### Multi-node etcd cluster with load balancer

To run a load balancing etcd cluster:

1. Set up an etcd cluster.
2. Configure a load balancer in front of the etcd cluster.
   For example, let the address of the load balancer be `$LB`.
3. Start Kubernetes API Servers with the flag `--etcd-servers=$LB:2379`.
-->
### 使用负载均衡的多节点 etcd 集群

要运行负载均衡的 etcd 集群：

1. 建立一个 etcd 集群。
2. 在 etcd 集群前面配置负载均衡器。例如，让负载均衡器的地址为 `$LB`。
3. 使用参数 `--etcd-servers=$LB:2379` 启动 Kubernetes API 服务器。

<!--
## Securing etcd clusters

Access to etcd is equivalent to root permission in the cluster so ideally only
the API server should have access to it. Considering the sensitivity of the
data, it is recommended to grant permission to only those nodes that require
access to etcd clusters.

To secure etcd, either set up firewall rules or use the security features
provided by etcd. etcd security features depend on x509 Public Key
Infrastructure (PKI). To begin, establish secure communication channels by
generating a key and certificate pair. For example, use key pairs `peer.key`
and `peer.cert` for securing communication between etcd members, and
`client.key` and `client.cert` for securing communication between etcd and its
clients. See the [example scripts](https://github.com/coreos/etcd/tree/master/hack/tls-setup)
provided by the etcd project to generate key pairs and CA files for client
authentication.
-->
## 安全的 etcd 集群

对 etcd 的访问相当于集群中的 root 权限，因此理想情况下只有 API 服务器才能访问它。
考虑到数据的敏感性，建议只向需要访问 etcd 集群的节点授予权限。

想要确保 etcd 的安全，可以设置防火墙规则或使用 etcd 提供的安全特性，这些安全特性依赖于 x509 公钥基础设施（PKI）。
首先，通过生成密钥和证书对来建立安全的通信通道。
例如，使用密钥对 `peer.key` 和 `peer.cert` 来保护 etcd 成员之间的通信，
而 `client.key` 和 `client.cert` 用于保护 etcd 与其客户端之间的通信。
请参阅 etcd 项目提供的[示例脚本](https://github.com/coreos/etcd/tree/master/hack/tls-setup)，
以生成用于客户端身份验证的密钥对和 CA 文件。

<!--
### Securing communication

To configure etcd with secure peer communication, specify flags
`--peer-key-file=peer.key` and `--peer-cert-file=peer.cert`, and use HTTPS as
the URL schema.

Similarly, to configure etcd with secure client communication, specify flags
`--key-file=k8sclient.key` and `--cert-file=k8sclient.cert`, and use HTTPS as
the URL schema. Here is an example on a client command that uses secure
communication:

```
ETCDCTL_API=3 etcdctl --endpoints 10.2.0.9:2379 \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  member list
```
-->
### 安全通信

若要使用安全对等通信对 etcd 进行配置，请指定参数 `--peer-key-file=peer.key` 
和 `--peer-cert-file=peer.cert`，并使用 HTTPS 作为 URL 模式。

类似地，要使用安全客户端通信对 etcd 进行配置，请指定参数 `--key-file=k8sclient.key` 
和 `--cert-file=k8sclient.cert`，并使用 HTTPS 作为 URL 模式。
使用安全通信的客户端命令的示例：

```
ETCDCTL_API=3 etcdctl --endpoints 10.2.0.9:2379 \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  member list
```

<!--
### Limiting access of etcd clusters

After configuring secure communication, restrict the access of etcd cluster to
only the Kubernetes API servers. Use TLS authentication to do so.

For example, consider key pairs `k8sclient.key` and `k8sclient.cert` that are
trusted by the CA `etcd.ca`. When etcd is configured with `--client-cert-auth`
along with TLS, it verifies the certificates from clients by using system CAs
or the CA passed in by `--trusted-ca-file` flag. Specifying flags
`--client-cert-auth=true` and `--trusted-ca-file=etcd.ca` will restrict the
access to clients with the certificate `k8sclient.cert`.

Once etcd is configured correctly, only clients with valid certificates can
access it. To give Kubernetes API servers the access, configure them with the
flags `--etcd-certfile=k8sclient.cert`,`--etcd-keyfile=k8sclient.key` and
`--etcd-cafile=ca.cert`.

{{< note >}}
etcd authentication is not currently supported by Kubernetes. For more
information, see the related issue
[Support Basic Auth for Etcd v2](https://github.com/kubernetes/kubernetes/issues/23398).
{{< /note >}}
-->
### 限制 etcd 集群的访问

配置安全通信后，将 etcd 集群的访问限制在 Kubernetes API 服务器上。使用 TLS 身份验证来完成此任务。

例如，考虑由 CA `etcd.ca` 信任的密钥对 `k8sclient.key` 和 `k8sclient.cert`。
当 etcd 配置为 `--client-cert-auth` 和 TLS 时，它使用系统 CA 或由 `--trusted-ca-file` 参数传入的 CA 验证来自客户端的证书。
指定参数 `--client-cert-auth=true` 和 `--trusted-ca-file=etcd.ca` 将限制对具有证书 `k8sclient.cert` 的客户端的访问。

一旦正确配置了 etcd，只有具有有效证书的客户端才能访问它。要让 Kubernetes API 服务器访问，
可以使用参数 `--etcd-certfile=k8sclient.cert`,`--etcd-keyfile=k8sclient.key` 和 `--etcd-cafile=ca.cert` 配置。

{{< note >}}
Kubernetes 目前不支持 etcd 身份验证。
想要了解更多信息，请参阅相关的问题
[支持 etcd v2 的基本认证](https://github.com/kubernetes/kubernetes/issues/23398)。
{{< /note >}}

<!--
## Replacing a failed etcd member

etcd cluster achieves high availability by tolerating minor member failures.
However, to improve the overall health of the cluster, replace failed members
immediately. When multiple members fail, replace them one by one. Replacing a
failed member involves two steps: removing the failed member and adding a new
member.

Though etcd keeps unique member IDs internally, it is recommended to use a
unique name for each member to avoid human errors. For example, consider a
three-member etcd cluster. Let the URLs be, `member1=http://10.0.0.1`,
`member2=http://10.0.0.2`, and `member3=http://10.0.0.3`. When `member1` fails,
replace it with `member4=http://10.0.0.4`.

1. Get the member ID of the failed `member1`:

   ```shell
   etcdctl --endpoints=http://10.0.0.2,http://10.0.0.3 member list
   ```

   The following message is displayed:

   ```console
   8211f1d0f64f3269, started, member1, http://10.0.0.1:2380, http://10.0.0.1:2379
   91bc3c398fb3c146, started, member2, http://10.0.0.2:2380, http://10.0.0.2:2379
   fd422379fda50e48, started, member3, http://10.0.0.3:2380, http://10.0.0.3:2379
   ```

2. Remove the failed member:

   ```shell
   etcdctl member remove 8211f1d0f64f3269
   ```

   The following message is displayed:

   ```console
   Removed member 8211f1d0f64f3269 from cluster
   ```

3. Add the new member:

   ```shell
   etcdctl member add member4 --peer-urls=http://10.0.0.4:2380
   ```

   The following message is displayed:

   ```console
   Member 2be1eb8f84b7f63e added to cluster ef37ad9dc622a7c4
   ```

4. Start the newly added member on a machine with the IP `10.0.0.4`:

   ```shell
   export ETCD_NAME="member4"
   export ETCD_INITIAL_CLUSTER="member2=http://10.0.0.2:2380,member3=http://10.0.0.3:2380,member4=http://10.0.0.4:2380"
   export ETCD_INITIAL_CLUSTER_STATE=existing
   etcd [flags]
   ```

5. Do either of the following:

   1. Update the `--etcd-servers` flag for the Kubernetes API servers to make
      Kubernetes aware of the configuration changes, then restart the
      Kubernetes API servers.
   2. Update the load balancer configuration if a load balancer is used in the
      deployment.

For more information on cluster reconfiguration, see
[etcd reconfiguration documentation](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member).
-->
## 替换失败的 etcd 成员

etcd 集群通过容忍少数成员故障实现高可用性。
但是，要改善集群的整体健康状况，请立即替换失败的成员。当多个成员失败时，逐个替换它们。
替换失败成员需要两个步骤：删除失败成员和添加新成员。

虽然 etcd 在内部保留唯一的成员 ID，但建议为每个成员使用唯一的名称，以避免人为错误。
例如，考虑一个三成员的 etcd 集群。让 URL 为：`member1=http://10.0.0.1`， `member2=http://10.0.0.2` 
和 `member3=http://10.0.0.3`。当 `member1` 失败时，将其替换为 `member4=http://10.0.0.4`。

1. 获取失败的 `member1` 的成员 ID：

   ```shell
   etcdctl --endpoints=http://10.0.0.2,http://10.0.0.3 member list
   ```

   显示以下信息：

   ```console
   8211f1d0f64f3269, started, member1, http://10.0.0.1:2380, http://10.0.0.1:2379
   91bc3c398fb3c146, started, member2, http://10.0.0.2:2380, http://10.0.0.2:2379
   fd422379fda50e48, started, member3, http://10.0.0.3:2380, http://10.0.0.3:2379
   ```

2. 移除失败的成员

   ```shell
   etcdctl member remove 8211f1d0f64f3269
   ```

   显示以下信息：

   ```console
   Removed member 8211f1d0f64f3269 from cluster
   ```

3. 增加新成员：

   ```shell
   etcdctl member add member4 --peer-urls=http://10.0.0.4:2380
   ```

   显示以下信息：

   ```console
   Member 2be1eb8f84b7f63e added to cluster ef37ad9dc622a7c4
   ```

4. 在 IP 为 `10.0.0.4` 的机器上启动新增加的成员：

   ```shell
   export ETCD_NAME="member4"
   export ETCD_INITIAL_CLUSTER="member2=http://10.0.0.2:2380,member3=http://10.0.0.3:2380,member4=http://10.0.0.4:2380"
   export ETCD_INITIAL_CLUSTER_STATE=existing
   etcd [flags]
   ```

5. 做以下事情之一：

   1. 更新 Kubernetes API 服务器的 `--etcd-servers` 参数，使 Kubernetes 知道配置进行了更改，然后重新启动 Kubernetes API 服务器。
   2. 如果在 deployment 中使用了负载均衡，更新负载均衡配置。

有关集群重新配置的详细信息，请参阅 [etcd 重构文档](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)。

<!--
## Backing up an etcd cluster

All Kubernetes objects are stored on etcd. Periodically backing up the etcd
cluster data is important to recover Kubernetes clusters under disaster
scenarios, such as losing all control plane nodes. The snapshot file contains
all the Kubernetes states and critical information. In order to keep the
sensitive Kubernetes data safe, encrypt the snapshot files.

Backing up an etcd cluster can be accomplished in two ways: etcd built-in
snapshot and volume snapshot.
-->
## 备份 etcd 集群

所有 Kubernetes 对象都存储在 etcd 上。定期备份 etcd 集群数据对于在灾难场景（例如丢失所有控制平面节点）下恢复 Kubernetes 集群非常重要。
快照文件包含所有 Kubernetes 状态和关键信息。为了保证敏感的 Kubernetes 数据的安全，可以对快照文件进行加密。

备份 etcd 集群可以通过两种方式完成：etcd 内置快照和卷快照。

<!--
### Built-in snapshot

etcd supports built-in snapshot. A snapshot may either be taken from a live
member with the `etcdctl snapshot save` command or by copying the
`member/snap/db` file from an etcd
[data directory](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)
that is not currently used by an etcd process. Taking the snapshot will
not affect the performance of the member.

Below is an example for taking a snapshot of the keyspace served by
`$ENDPOINT` to the file `snapshotdb`:

```shell
ETCDCTL_API=3 etcdctl --endpoints $ENDPOINT snapshot save snapshotdb
```

Verify the snapshot:

```shell
ETCDCTL_API=3 etcdctl --write-out=table snapshot status snapshotdb
```

```console
+----------+----------+------------+------------+
|   HASH   | REVISION | TOTAL KEYS | TOTAL SIZE |
+----------+----------+------------+------------+
| fe01cf57 |       10 |          7 | 2.1 MB     |
+----------+----------+------------+------------+
```
-->
### 内置快照

etcd 支持内置快照。快照可以从使用 `etcdctl snapshot save` 命令的活动成员中获取，
也可以通过从 etcd [数据目录](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)
复制 `member/snap/db` 文件，该 etcd 数据目录目前没有被 etcd 进程使用。获取快照不会影响成员的性能。

下面是一个示例，用于获取 `$ENDPOINT` 所提供的键空间的快照到文件 `snapshotdb`：

```shell
ETCDCTL_API=3 etcdctl --endpoints $ENDPOINT snapshot save snapshotdb
```

验证快照:

```shell
ETCDCTL_API=3 etcdctl --write-out=table snapshot status snapshotdb
```

```console
+----------+----------+------------+------------+
|   HASH   | REVISION | TOTAL KEYS | TOTAL SIZE |
+----------+----------+------------+------------+
| fe01cf57 |       10 |          7 | 2.1 MB     |
+----------+----------+------------+------------+
```

<!--
### Volume snapshot

If etcd is running on a storage volume that supports backup, such as Amazon
Elastic Block Store, back up etcd data by taking a snapshot of the storage
volume.

### Snapshot using etcdctl options

We can also take the snapshot using various options given by etcdctl. For example 

```shell
ETCDCTL_API=3 etcdctl -h 
``` 

will list various options available from etcdctl. For example, you can take a snapshot by specifying
the endpoint, certificates etc as shown below:

```shell
ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=<trusted-ca-file> --cert=<cert-file> --key=<key-file> \
  snapshot save <backup-file-location>
```
where `trusted-ca-file`, `cert-file` and `key-file` can be obtained from the description of the etcd Pod.

## Scaling up etcd clusters

Scaling up etcd clusters increases availability by trading off performance.
Scaling does not increase cluster performance nor capability. A general rule
is not to scale up or down etcd clusters. Do not configure any auto scaling
groups for etcd clusters. It is highly recommended to always run a static
five-member etcd cluster for production Kubernetes clusters at any officially
supported scale.

A reasonable scaling is to upgrade a three-member cluster to a five-member
one, when more reliability is desired. See
[etcd reconfiguration documentation](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)
for information on how to add members into an existing cluster.
-->
### 卷快照

如果 etcd 运行在支持备份的存储卷（如 Amazon Elastic Block 存储）上，则可以通过获取存储卷的快照来备份 etcd 数据。

### 使用 etcdctl 选项的快照

我们还可以使用 etcdctl 提供的各种选项来拍摄快照。例如：

```shell
ETCDCTL_API=3 etcdctl -h 
``` 

列出 etcdctl 可用的各种选项。例如，你可以通过指定端点，证书等来拍摄快照，如下所示：

```shell
ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=<trusted-ca-file> --cert=<cert-file> --key=<key-file> \
  snapshot save <backup-file-location>
```
可以从 etcd Pod 的描述中获得 `trusted-ca-file`, `cert-file` 和 `key-file` 。

## 扩展 etcd 集群

通过交换性能，扩展 etcd 集群可以提高可用性。缩放不会提高集群性能和能力。
一般情况下不要扩大或缩小 etcd 集群的集合。不要为 etcd 集群配置任何自动缩放组。
强烈建议始终在任何官方支持的规模上运行生产 Kubernetes 集群时使用静态的五成员 etcd 集群。

合理的扩展是在需要更高可靠性的情况下，将三成员集群升级为五成员集群。
请参阅 [etcd 重新配置文档](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)
以了解如何将成员添加到现有集群中的信息。

<!--
## Restoring an etcd cluster

etcd supports restoring from snapshots that are taken from an etcd process of
the [major.minor](http://semver.org/) version. Restoring a version from a
different patch version of etcd also is supported. A restore operation is
employed to recover the data of a failed cluster.

Before starting the restore operation, a snapshot file must be present. It can
either be a snapshot file from a previous backup operation, or from a remaining
[data directory]( https://etcd.io/docs/current/op-guide/configuration/#--data-dir).
Here is an example:

```shell
ETCDCTL_API=3 etcdctl --endpoints 10.2.0.9:2379 snapshot restore snapshotdb
```

For more information and examples on restoring a cluster from a snapshot file, see
[etcd disaster recovery documentation](https://etcd.io/docs/current/op-guide/recovery/#restoring-a-cluster).

If the access URLs of the restored cluster is changed from the previous
cluster, the Kubernetes API server must be reconfigured accordingly. In this
case, restart Kubernetes API servers with the flag
`--etcd-servers=$NEW_ETCD_CLUSTER` instead of the flag
`--etcd-servers=$OLD_ETCD_CLUSTER`. Replace `$NEW_ETCD_CLUSTER` and
`$OLD_ETCD_CLUSTER` with the respective IP addresses. If a load balancer is
used in front of an etcd cluster, you might need to update the load balancer
instead.

If the majority of etcd members have permanently failed, the etcd cluster is
considered failed. In this scenario, Kubernetes cannot make any changes to its
current state. Although the scheduled pods might continue to run, no new pods
can be scheduled. In such cases, recover the etcd cluster and potentially
reconfigure Kubernetes API servers to fix the issue.

{{< note >}}
If any API servers are running in your cluster, you should not attempt to
restore instances of etcd. Instead, follow these steps to restore etcd:

- stop *all* API server instances
- restore state in all etcd instances
- restart all API server instances

We also recommend restarting any components (e.g. `kube-scheduler`,
`kube-controller-manager`, `kubelet`) to ensure that they don't rely on some
stale data. Note that in practice, the restore takes a bit of time.  During the
restoration, critical components will lose leader lock and restart themselves.
{{< /note >}}
-->
## 恢复 etcd 集群

etcd 支持从 [major.minor](http://semver.org/) 或其他不同 patch 版本的 etcd 进程中获取的快照进行恢复。
还原操作用于恢复失败的集群的数据。

在启动还原操作之前，必须有一个快照文件。它可以是来自以前备份操作的快照文件，
也可以是来自剩余[数据目录]( https://etcd.io/docs/current/op-guide/configuration/#--data-dir)的快照文件。
例如：

```shell
ETCDCTL_API=3 etcdctl --endpoints 10.2.0.9:2379 snapshot restore snapshotdb
```

有关从快照文件还原集群的详细信息和示例，请参阅 
[etcd 灾难恢复文档](https://etcd.io/docs/current/op-guide/recovery/#restoring-a-cluster)。

如果还原的集群的访问 URL 与前一个集群不同，则必须相应地重新配置 Kubernetes API 服务器。
在本例中，使用参数 `--etcd-servers=$NEW_ETCD_CLUSTER` 而不是参数 `--etcd-servers=$OLD_ETCD_CLUSTER` 重新启动 Kubernetes API 服务器。
用相应的 IP 地址替换 `$NEW_ETCD_CLUSTER` 和 `$OLD_ETCD_CLUSTER`。如果在 etcd 集群前面使用负载平衡，则可能需要更新负载均衡器。

如果大多数 etcd 成员永久失败，则认为 etcd 集群失败。在这种情况下，Kubernetes 不能对其当前状态进行任何更改。
虽然已调度的 pod 可能继续运行，但新的 pod 无法调度。在这种情况下，恢复 etcd 集群并可能需要重新配置 Kubernetes API 服务器以修复问题。

{{< note >}}
如果集群中正在运行任何 API 服务器，则不应尝试还原 etcd 的实例。相反，请按照以下步骤还原 etcd：

- 停止 *所有* API 服务实例
- 在所有 etcd 实例中恢复状态
- 重启所有 API 服务实例

我们还建议重启所有组件（例如 `kube-scheduler`、`kube-controller-manager`、`kubelet`），以确保它们不会
依赖一些过时的数据。请注意，实际中还原会花费一些时间。
在还原过程中，关键组件将丢失领导锁并自行重启。
{{< note >}}