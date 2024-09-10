---
title: 操作 Kubernetes 中的 etcd 集群
content_type: task
weight: 270
---
<!--
reviewers:
- mml
- wojtek-t
- jpbetz
title: Operating etcd clusters for Kubernetes
content_type: task
weight: 270
-->

<!-- overview -->

{{< glossary_definition term_id="etcd" length="all" prepend="etcd 是 ">}}

## {{% heading "prerequisites" %}}

<!--
Before you follow steps in this page to deploy, manage, back up or restore etcd,
you need to understand the typical expectations for operating an etcd cluster.
Refer to the [etcd documentation](https://etcd.io/docs/) for more context.
-->
你在按照本页所述的步骤部署、管理、备份或恢复 etcd 之前，
你需要先理解运行 etcd 集群的一般期望。更多细节参阅 [etcd 文档](https://etcd.io/docs/)。

<!--
Key details include:

* The minimum recommended etcd versions to run in production are `3.4.22+` and `3.5.6+`.

* etcd is a leader-based distributed system. Ensure that the leader
  periodically send heartbeats on time to all followers to keep the cluster
  stable.

* You should run etcd as a cluster with an odd number of members.
-->
关键要点包括：

* 在生产环境中运行的 etcd 最低推荐版本为 `3.4.22+` 和 `3.5.6+`。

* etcd 是一个基于主节点（Leader-Based）的分布式系统。确保主节点定期向所有从节点发送心跳，以保持集群稳定。

* 你运行的 etcd 集群成员个数应为奇数。

<!--
* Aim to ensure that no resource starvation occurs.

  Performance and stability of the cluster is sensitive to network and disk
  I/O. Any resource starvation can lead to heartbeat timeout, causing instability
  of the cluster. An unstable etcd indicates that no leader is elected. Under
  such circumstances, a cluster cannot make any changes to its current state,
  which implies no new pods can be scheduled.
-->
* 确保不发生资源不足。

  集群的性能和稳定性对网络和磁盘 I/O 非常敏感。任何资源匮乏都会导致心跳超时，
  从而导致集群的不稳定。不稳定的情况表明没有选出任何主节点。
  在这种情况下，集群不能对其当前状态进行任何更改，这意味着不能调度新的 Pod。

<!--
### Resource requirements for etcd

Operating etcd with limited resources is suitable only for testing purposes.
For deploying in production, advanced hardware configuration is required.
Before deploying etcd in production, see
[resource requirement reference](https://etcd.io/docs/current/op-guide/hardware/#example-hardware-configurations).
-->
## etcd 资源需求    {#resource-requirements-for-etcd}

使用有限的资源运行 etcd 只适合测试目的。在生产环境中部署 etcd，你需要有先进的硬件配置。
在生产中部署 etcd 之前，请查阅[所需资源参考文档](https://etcd.io/docs/current/op-guide/hardware/#example-hardware-configurations)。

<!--
Keeping etcd clusters stable is critical to the stability of Kubernetes
clusters. Therefore, run etcd clusters on dedicated machines or isolated
environments for [guaranteed resource requirements](https://etcd.io/docs/current/op-guide/hardware/).

### Tools

Depending on which specific outcome you're working on, you will need the `etcdctl` tool or the
`etcdutl` tool (you may need both).
-->
保持 etcd 集群的稳定对 Kubernetes 集群的稳定性至关重要。
因此，请在专用机器或隔离环境上运行 etcd 集群，
以满足[所需资源需求](https://etcd.io/docs/current/op-guide/hardware/)。

### 工具   {#tools}

根据你想要达成的具体结果，你将需要安装 `etcdctl` 工具或 `etcdutl` 工具（可能两个工具都需要）。

<!-- steps -->

<!--
## Understanding etcdctl and etcdutl

`etcdctl` and `etcdutl` are command-line tools used to interact with etcd clusters, but they serve different purposes:

- `etcdctl`: This is the primary command-line client for interacting with etcd over a
network. It is used for day-to-day operations such as managing keys and values,
administering the cluster, checking health, and more.
-->
## 了解 etcdctl 和 etcdutl   {#understanding-etcdctl-and-etcdutl}

`etcdctl` 和 `etcdutl` 是用于与 etcd 集群交互的命令行工具，但它们有不同的用途：

- `etcdctl`：这是通过网络与 etcd 交互的主要命令行客户端。
  它用于日常操作，比如管理键值对、管理集群、检查健康状态等。

<!--
- `etcdutl`: This is an administration utility designed to operate directly on etcd data
files, including migrating data between etcd versions, defragmenting the database,
restoring snapshots, and validating data consistency. For network operations, `etcdctl`
should be used.

For more information on `etcdutl`, you can refer to the [etcd recovery documentation](https://etcd.io/docs/v3.5/op-guide/recovery/).
-->
- `etcdutl`：这是一个被设计用来直接操作 etcd 数据文件的管理工具，
  包括跨 etcd 版本迁移数据、数据库碎片整理、恢复快照和验证数据一致性等操作。
  对于网络操作，你应使用 `etcdctl`。

有关 `etcdutl` 细节，请参阅 [etcd 恢复文档](https://etcd.io/docs/v3.5/op-guide/recovery/)。

<!--
## Starting etcd clusters

This section covers starting a single-node and multi-node etcd cluster.

This guide assumes that `etcd` is already installed.
-->
## 启动 etcd 集群    {#starting-etcd-clusters}

本节介绍如何启动单节点和多节点 etcd 集群。

本指南假定 `etcd` 已经安装好了。

<!--
### Single-node etcd cluster

Use a single-node etcd cluster only for testing purposes.

1. Run the following:
-->
### 单节点 etcd 集群    {#single-node-etcd-cluster}

只为测试目的使用单节点 etcd 集群。

1. 运行以下命令：

   ```sh
   etcd --listen-client-urls=http://$PRIVATE_IP:2379 \
      --advertise-client-urls=http://$PRIVATE_IP:2379
   ```

<!--
2. Start the Kubernetes API server with the flag
   `--etcd-servers=$PRIVATE_IP:2379`.

   Make sure `PRIVATE_IP` is set to your etcd client IP.
-->
2. 使用参数 `--etcd-servers=$PRIVATE_IP:2379` 启动 Kubernetes API 服务器。

   确保将 `PRIVATE_IP` 设置为 etcd 客户端 IP。

<!--
### Multi-node etcd cluster
-->
### 多节点 etcd 集群    {#multi-node-etcd-cluster}

<!--
For durability and high availability, run etcd as a multi-node cluster in
production and back it up periodically. A five-member cluster is recommended
in production. For more information, see
[FAQ documentation](https://etcd.io/docs/current/faq/#what-is-failure-tolerance).
-->
出于耐用性和高可用性考量，在生产环境中应以多节点集群的方式运行 etcd，并且定期备份。
建议在生产环境中使用五个成员的集群。
有关该内容的更多信息，请参阅[常见问题文档](https://etcd.io/docs/current/faq/#what-is-failure-tolerance)。

<!--
As you're using Kubernetes, you have the option to run etcd as a container inside
one or more Pods. The `kubeadm` tool sets up etcd
{{< glossary_tooltip text="static pods" term_id="static-pod" >}} by default, or
you can deploy a
[separate cluster](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
and instruct kubeadm to use that etcd cluster as the control plane's backing store.
-->
由于你正在使用 Kubernetes，你可以选择在一个或多个 Pod 内以容器形式运行 etcd。
`kubeadm` 工具默认会安装 etcd 的{{< glossary_tooltip text="静态 Pod" term_id="static-pod" >}}，
或者你可以部署一个[独立的集群](/zh-cn/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)并指示
kubeadm 将该 etcd 集群用作控制平面的后端存储。

<!--
You configure an etcd cluster either by static member information or by dynamic
discovery. For more information on clustering, see
[etcd clustering documentation](https://etcd.io/docs/current/op-guide/clustering/).
-->
你可以通过静态成员信息或动态发现的方式配置 etcd 集群。
有关集群的详细信息，请参阅
[etcd 集群文档](https://etcd.io/docs/current/op-guide/clustering/)。

<!--
For an example, consider a five-member etcd cluster running with the following
client URLs: `http://$IP1:2379`, `http://$IP2:2379`, `http://$IP3:2379`,
`http://$IP4:2379`, and `http://$IP5:2379`. To start a Kubernetes API server:
-->
例如，考虑运行以下客户端 URL 的五个成员的 etcd 集群：`http://$IP1:2379`、
`http://$IP2:2379`、`http://$IP3:2379`、`http://$IP4:2379` 和 `http://$IP5:2379`。
要启动 Kubernetes API 服务器：

<!--
1. Run the following:
-->
1. 运行以下命令：

   ```shell
   etcd --listen-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379 --advertise-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379
   ```

<!--
2. Start the Kubernetes API servers with the flag
   `--etcd-servers=$IP1:2379,$IP2:2379,$IP3:2379,$IP4:2379,$IP5:2379`.

   Make sure the `IP<n>` variables are set to your client IP addresses.
-->
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
### 使用负载均衡器的多节点 etcd 集群    {#multi-node-etcd-cluster-with-load-balancer}

要运行负载均衡的 etcd 集群：

1. 建立一个 etcd 集群。
2. 在 etcd 集群前面配置负载均衡器。例如，让负载均衡器的地址为 `$LB`。
3. 使用参数 `--etcd-servers=$LB:2379` 启动 Kubernetes API 服务器。

<!--
## Securing etcd clusters
-->
## 加固 etcd 集群    {#securing-etcd-clusters}

<!--
Access to etcd is equivalent to root permission in the cluster so ideally only
the API server should have access to it. Considering the sensitivity of the
data, it is recommended to grant permission to only those nodes that require
access to etcd clusters.
-->
对 etcd 的访问相当于集群中的 root 权限，因此理想情况下只有 API 服务器才能访问它。
考虑到数据的敏感性，建议只向需要访问 etcd 集群的节点授予权限。

<!--
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
想要确保 etcd 的安全，可以设置防火墙规则或使用 etcd 提供的安全特性，这些安全特性依赖于 x509 公钥基础设施（PKI）。
首先，通过生成密钥和证书对来建立安全的通信通道。
例如，使用密钥对 `peer.key` 和 `peer.cert` 来保护 etcd 成员之间的通信，
而 `client.key` 和 `client.cert` 用于保护 etcd 与其客户端之间的通信。
请参阅 etcd 项目提供的[示例脚本](https://github.com/coreos/etcd/tree/master/hack/tls-setup)，
以生成用于客户端身份验证的密钥对和 CA 文件。

<!--
### Securing communication
-->
### 安全通信    {#securing-communication}

<!--
To configure etcd with secure peer communication, specify flags
`--peer-key-file=peer.key` and `--peer-cert-file=peer.cert`, and use HTTPS as
the URL schema.
-->
若要使用安全对等通信对 etcd 进行配置，请指定参数 `--peer-key-file=peer.key`
和 `--peer-cert-file=peer.cert`，并使用 HTTPS 作为 URL 模式。

<!--
Similarly, to configure etcd with secure client communication, specify flags
`--key-file=k8sclient.key` and `--cert-file=k8sclient.cert`, and use HTTPS as
the URL schema. Here is an example on a client command that uses secure
communication:
-->
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
-->
### 限制 etcd 集群的访问    {#limiting-access-of-etcd-clusters}

<!--
After configuring secure communication, restrict the access of the etcd cluster to
only the Kubernetes API servers using TLS authentication.
-->
配置安全通信后，使用 TLS 身份验证来限制只有 Kubernetes API 服务器可以访问 etcd 集群。

<!--
For example, consider key pairs `k8sclient.key` and `k8sclient.cert` that are
trusted by the CA `etcd.ca`. When etcd is configured with `--client-cert-auth`
along with TLS, it verifies the certificates from clients by using system CAs
or the CA passed in by `--trusted-ca-file` flag. Specifying flags
`--client-cert-auth=true` and `--trusted-ca-file=etcd.ca` will restrict the
access to clients with the certificate `k8sclient.cert`.
-->
例如，考虑由 CA `etcd.ca` 信任的密钥对 `k8sclient.key` 和 `k8sclient.cert`。
当 etcd 配置为 `--client-cert-auth` 和 TLS 时，它使用系统 CA 或由 `--trusted-ca-file`
参数传入的 CA 验证来自客户端的证书。指定参数 `--client-cert-auth=true` 和
`--trusted-ca-file=etcd.ca` 将限制对具有证书 `k8sclient.cert` 的客户端的访问。

<!--
Once etcd is configured correctly, only clients with valid certificates can
access it. To give Kubernetes API servers the access, configure them with the
flags `--etcd-certfile=k8sclient.cert`, `--etcd-keyfile=k8sclient.key` and
`--etcd-cafile=ca.cert`.
-->
一旦正确配置了 etcd，只有具有有效证书的客户端才能访问它。要让 Kubernetes API 服务器访问，
可以使用参数 `--etcd-certfile=k8sclient.cert`、`--etcd-keyfile=k8sclient.key` 和 `--etcd-cafile=ca.cert` 配置。

{{< note >}}
<!--
etcd authentication is not planned for Kubernetes.
-->
Kubernetes 没有为 etcd 提供身份验证的计划。
{{< /note >}}

<!--
## Replacing a failed etcd member
-->
## 替换失败的 etcd 成员    {#replacing-a-failed-etcd-member}

<!--
etcd cluster achieves high availability by tolerating minor member failures.
However, to improve the overall health of the cluster, replace failed members
immediately. When multiple members fail, replace them one by one. Replacing a
failed member involves two steps: removing the failed member and adding a new
member.
-->
etcd 集群通过容忍少数成员故障实现高可用性。
但是，要改善集群的整体健康状况，请立即替换失败的成员。当多个成员失败时，逐个替换它们。
替换失败成员需要两个步骤：删除失败成员和添加新成员。

<!--
Though etcd keeps unique member IDs internally, it is recommended to use a
unique name for each member to avoid human errors. For example, consider a
three-member etcd cluster. Let the URLs be, `member1=http://10.0.0.1`,
`member2=http://10.0.0.2`, and `member3=http://10.0.0.3`. When `member1` fails,
replace it with `member4=http://10.0.0.4`.
-->
虽然 etcd 在内部保留唯一的成员 ID，但建议为每个成员使用唯一的名称，以避免人为错误。
例如，考虑一个三成员的 etcd 集群。假定 URL 分别为：`member1=http://10.0.0.1`、`member2=http://10.0.0.2`
和 `member3=http://10.0.0.3`。当 `member1` 失败时，将其替换为 `member4=http://10.0.0.4`。

<!--
1. Get the member ID of the failed `member1`:
-->
1. 获取失败的 `member1` 的成员 ID：

   ```shell
   etcdctl --endpoints=http://10.0.0.2,http://10.0.0.3 member list
   ```

   <!--
   The following message is displayed:
   -->
   显示以下信息：

   ```console
   8211f1d0f64f3269, started, member1, http://10.0.0.1:2380, http://10.0.0.1:2379
   91bc3c398fb3c146, started, member2, http://10.0.0.2:2380, http://10.0.0.2:2379
   fd422379fda50e48, started, member3, http://10.0.0.3:2380, http://10.0.0.3:2379
   ```
<!--
1. Do either of the following:

   1. If each Kubernetes API server is configured to communicate with all etcd
      members, remove the failed member from the `--etcd-servers` flag, then
      restart each Kubernetes API server.
   1. If each Kubernetes API server communicates with a single etcd member,
      then stop the Kubernetes API server that communicates with the failed
      etcd.
-->
2. 执行以下操作之一：

   1. 如果每个 Kubernetes API 服务器都配置为与所有 etcd 成员通信，
      请从 `--etcd-servers` 标志中移除删除失败的成员，然后重新启动每个 Kubernetes API 服务器。
   2. 如果每个 Kubernetes API 服务器都与单个 etcd 成员通信，
      则停止与失败的 etcd 通信的 Kubernetes API 服务器。

<!-- 
1. Stop the etcd server on the broken node. It is possible that other 
   clients besides the Kubernetes API server are causing traffic to etcd 
   and it is desirable to stop all traffic to prevent writes to the data
   directory.
-->
3. 停止故障节点上的 etcd 服务器。除了 Kubernetes API 服务器之外的其他客户端可能会造成流向 etcd 的流量，
   可以停止所有流量以防止写入数据目录。

<!--
1. Remove the failed member:
-->
4. 移除失败的成员：

   ```shell
   etcdctl member remove 8211f1d0f64f3269
   ```

   <!--
   The following message is displayed:
   -->
   显示以下信息：

   ```console
   Removed member 8211f1d0f64f3269 from cluster
   ```

<!--
1. Add the new member:
-->
5. 增加新成员：

   ```shell
   etcdctl member add member4 --peer-urls=http://10.0.0.4:2380
   ```

   <!--
   The following message is displayed:
   -->
   显示以下信息：

   ```console
   Member 2be1eb8f84b7f63e added to cluster ef37ad9dc622a7c4
   ```

<!--
1. Start the newly added member on a machine with the IP `10.0.0.4`:
-->
6. 在 IP 为 `10.0.0.4` 的机器上启动新增加的成员：

   ```shell
   export ETCD_NAME="member4"
   export ETCD_INITIAL_CLUSTER="member2=http://10.0.0.2:2380,member3=http://10.0.0.3:2380,member4=http://10.0.0.4:2380"
   export ETCD_INITIAL_CLUSTER_STATE=existing
   etcd [flags]
   ```

<!--
1. Do either of the following:

   1. If each Kubernetes API server is configured to communicate with all etcd
      members, add the newly added member to the `--etcd-servers` flag, then
      restart each Kubernetes API server.
   1. If each Kubernetes API server communicates with a single etcd member,
      start the Kubernetes API server that was stopped in step 2. Then
      configure Kubernetes API server clients to again route requests to the
      Kubernetes API server that was stopped. This can often be done by
      configuring a load balancer.
-->
7. 执行以下操作之一：

   1. 如果每个 Kubernetes API 服务器都配置为与所有 etcd 成员通信，
      则将新增的成员添加到 `--etcd-servers` 标志，然后重新启动每个 Kubernetes API 服务器。
   2. 如果每个 Kubernetes API 服务器都与单个 etcd 成员通信，请启动在第 2 步中停止的 Kubernetes API 服务器。
      然后配置 Kubernetes API 服务器客户端以再次将请求路由到已停止的 Kubernetes API 服务器。
      这通常可以通过配置负载均衡器来完成。

<!--
For more information on cluster reconfiguration, see
[etcd reconfiguration documentation](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member).
-->
有关集群重新配置的详细信息，请参阅
[etcd 重构文档](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)。

<!--
## Backing up an etcd cluster

All Kubernetes objects are stored in etcd. Periodically backing up the etcd
cluster data is important to recover Kubernetes clusters under disaster
scenarios, such as losing all control plane nodes. The snapshot file contains
all the Kubernetes state and critical information. In order to keep the
sensitive Kubernetes data safe, encrypt the snapshot files.

Backing up an etcd cluster can be accomplished in two ways: etcd built-in
snapshot and volume snapshot.
-->
## 备份 etcd 集群    {#backing-up-an-etcd-cluster}

所有 Kubernetes 对象都存储在 etcd 中。
定期备份 etcd 集群数据对于在灾难场景（例如丢失所有控制平面节点）下恢复 Kubernetes 集群非常重要。
快照文件包含所有 Kubernetes 状态和关键信息。为了保证敏感的 Kubernetes 数据的安全，可以对快照文件进行加密。

备份 etcd 集群可以通过两种方式完成：etcd 内置快照和卷快照。

<!--
### Built-in snapshot
-->
### 内置快照    {#built-in-snapshot}

<!--
etcd supports built-in snapshot. A snapshot may either be created from a live
member with the `etcdctl snapshot save` command or by copying the
`member/snap/db` file from an etcd
[data directory](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)
that is not currently used by an etcd process. Creating the snapshot will
not affect the performance of the member.
-->
etcd 支持内置快照。快照可以从使用 `etcdctl snapshot save` 命令的活动成员中创建，
也可以通过从目前没有被 etcd 进程使用的 etcd [数据目录](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)
中拷贝 `member/snap/db` 文件。创建快照并不会影响 etcd 成员的性能。

<!--
Below is an example for creating a snapshot of the keyspace served by
`$ENDPOINT` to the file `snapshot.db`:
-->
下面是一个示例，用于创建 `$ENDPOINT` 所提供的键空间的快照到文件 `snapshot.db`：

```shell
ETCDCTL_API=3 etcdctl --endpoints $ENDPOINT snapshot save snapshot.db
```

<!--
Verify the snapshot:
-->
验证快照:

<!--
Use etcdutl
-->
{{< tabs name="etcd_verify_snapshot" >}}
{{% tab name="使用 etcdutl" %}}
   <!--
   The below example depicts the usage of the `etcdutl` tool for verifying a snapshot:
   -->
   下面的例子展示了如何使用 `etcdutl` 工具来验证快照：

   ```shell
   etcdutl --write-out=table snapshot status snapshot.db 
   ```

   <!--
   This should generate an output resembling the example provided below:
   -->
   此命令应该生成类似于下例的输出：

   ```console
   +----------+----------+------------+------------+
   |   HASH   | REVISION | TOTAL KEYS | TOTAL SIZE |
   +----------+----------+------------+------------+
   | fe01cf57 |       10 |          7 | 2.1 MB     |
   +----------+----------+------------+------------+
   ```

<!--
Use etcdctl (Deprecated)
-->
{{% /tab %}}
{{% tab name="使用 etcdctl（已弃用）" %}}

   {{< note >}}
   <!--
   The usage of `etcdctl snapshot status` has been **deprecated** since etcd v3.5.x and is slated for removal from etcd v3.6.
   It is recommended to utilize [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md) instead.
   -->
   自 etcd v3.5.x 起，`etcdctl snapshot status` 的使用已被 **弃用**，
   并计划在 etcd v3.6 中移除。建议改用 [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md)。
   {{< /note >}}

   <!--
   The below example depicts the usage of the `etcdctl` tool for verifying a snapshot:
   -->
   下面的例子展示了如何使用 `etcdctl` 工具来验证快照：

   ```shell
   export ETCDCTL_API=3
   etcdctl --write-out=table snapshot status snapshot.db
   ```

   <!--
   This should generate an output resembling the example provided below:
   -->
   此命令应该生成类似于下例的输出：

   ```console
   Deprecated: Use `etcdutl snapshot status` instead.

   +----------+----------+------------+------------+
   |   HASH   | REVISION | TOTAL KEYS | TOTAL SIZE |
   +----------+----------+------------+------------+
   | fe01cf57 |       10 |          7 | 2.1 MB     |
   +----------+----------+------------+------------+
   ```

{{% /tab %}}
{{< /tabs >}}

<!--
### Volume snapshot
-->
### 卷快照    {#volume-snapshot}

<!--
If etcd is running on a storage volume that supports backup, such as Amazon
Elastic Block Store, back up etcd data by creating a snapshot of the storage
volume.
-->
如果 etcd 运行在支持备份的存储卷（如 Amazon Elastic Block
存储）上，则可以通过创建存储卷的快照来备份 etcd 数据。

<!--
### Snapshot using etcdctl options
-->
### 使用 etcdctl 选项的快照    {#snapshot-using-etcdctl-options}

<!--
We can also create the snapshot using various options given by etcdctl. For example: 
-->
我们还可以使用 etcdctl 提供的各种选项来制作快照。例如：

```shell
ETCDCTL_API=3 etcdctl -h 
```

<!--
will list various options available from etcdctl. For example, you can create a snapshot by specifying
the endpoint, certificates and key as shown below:
-->
列出 etcdctl 可用的各种选项。例如，你可以通过指定端点、证书和密钥来制作快照，如下所示：

```shell
ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=<trusted-ca-file> --cert=<cert-file> --key=<key-file> \
  snapshot save <backup-file-location>
```

<!--
where `trusted-ca-file`, `cert-file` and `key-file` can be obtained from the description of the etcd Pod.
-->
可以从 etcd Pod 的描述中获得 `trusted-ca-file`、`cert-file` 和 `key-file`。

<!--
## Scaling out etcd clusters
-->
## 为 etcd 集群扩容    {#scaling-out-etcd-clusters}

<!--
Scaling out etcd clusters increases availability by trading off performance.
Scaling does not increase cluster performance nor capability. A general rule
is not to scale out or in etcd clusters. Do not configure any auto scaling
groups for etcd clusters. It is strongly recommended to always run a static
five-member etcd cluster for production Kubernetes clusters at any officially
supported scale.
-->
通过交换性能，对 etcd 集群扩容可以提高可用性。缩放不会提高集群性能和能力。
一般情况下不要扩大或缩小 etcd 集群的集合。不要为 etcd 集群配置任何自动缩放组。
强烈建议始终在任何官方支持的规模上运行生产 Kubernetes 集群时使用静态的五成员 etcd 集群。

<!--
A reasonable scaling is to upgrade a three-member cluster to a five-member
one, when more reliability is desired. See
[etcd reconfiguration documentation](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)
for information on how to add members into an existing cluster.
-->
合理的扩展是在需要更高可靠性的情况下，将三成员集群升级为五成员集群。
请参阅 [etcd 重构文档](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)
以了解如何将成员添加到现有集群中的信息。

<!--
## Restoring an etcd cluster
-->
## 恢复 etcd 集群    {#restoring-an-etcd-cluster}

{{< caution >}}
<!--
If any API servers are running in your cluster, you should not attempt to
restore instances of etcd. Instead, follow these steps to restore etcd:

- stop *all* API server instances
- restore state in all etcd instances
- restart all API server instances

The Kubernetes project also recommends restarting Kubernetes components (`kube-scheduler`,
`kube-controller-manager`, `kubelet`) to ensure that they don't rely on some
stale data. In practice the restore takes a bit of time.  During the
restoration, critical components will lose leader lock and restart themselves.
-->
如果集群中正在运行任何 API 服务器，则不应尝试还原 etcd 的实例。相反，请按照以下步骤还原 etcd：

- 停止**所有** API 服务器实例
- 为所有 etcd 实例恢复状态
- 重启所有 API 服务器实例

我们还建议重启所有组件（例如 `kube-scheduler`、`kube-controller-manager`、`kubelet`），
以确保它们不会依赖一些过时的数据。请注意，实际中还原会花费一些时间。
在还原过程中，关键组件将丢失领导锁并自行重启。
{{< /caution >}}

<!--
etcd supports restoring from snapshots that are taken from an etcd process of
the [major.minor](http://semver.org/) version. Restoring a version from a
different patch version of etcd is also supported. A restore operation is
employed to recover the data of a failed cluster.
-->
etcd 支持从 [major.minor](http://semver.org/) 或其他不同 patch 版本的 etcd 进程中获取的快照进行恢复。
还原操作用于恢复失败的集群的数据。

<!--
Before starting the restore operation, a snapshot file must be present. It can
either be a snapshot file from a previous backup operation, or from a remaining
[data directory](https://etcd.io/docs/current/op-guide/configuration/#--data-dir).
-->
在启动还原操作之前，必须有一个快照文件。它可以是来自以前备份操作的快照文件，
也可以是来自剩余[数据目录](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)的快照文件。

{{< tabs name="etcd_restore" >}}
{{% tab name="使用 etcdutl" %}}
   <!--
   When restoring the cluster using [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md),
   use the `--data-dir` option to specify to which folder the cluster should be restored:
   -->
   在使用 [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md)
   恢复集群时，使用 `--data-dir` 选项来指定集群应被恢复到哪个文件夹。

   ```shell
   etcdutl --data-dir <data-dir-location> snapshot restore snapshot.db
   ```

   <!--
   where `<data-dir-location>` is a directory that will be created during the restore process.
   -->
   其中 `<data-dir-location>` 是将在恢复过程中创建的目录。

{{% /tab %}}
{{% tab name="使用 etcdctl（已弃用）" %}}

   {{< note >}}
   <!--
   The usage of `etcdctl` for restoring has been **deprecated** since etcd v3.5.x and is slated for removal from etcd v3.6.
   It is recommended to utilize [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md) instead.
   -->
   自 etcd v3.5.x 起，使用 `etcdctl` 进行恢复的功能已被 **弃用**，并计划在 etcd v3.6 中移除。
   建议改用 [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md)。

   {{< /note >}}

   <!--
   The below example depicts the usage of the `etcdctl` tool for the restore operation:
   -->
   下面的例子展示了如何使用 `etcdctl` 工具执行恢复操作：

   ```shell
   export ETCDCTL_API=3
   etcdctl --data-dir <data-dir-location> snapshot restore snapshot.db
   ```

   <!--
   If `<data-dir-location>` is the same folder as before, delete it and stop the etcd process before restoring the cluster. 
   Otherwise, change etcd configuration and restart the etcd process after restoration to have it use the new data directory:
   first change  `/etc/kubernetes/manifests/etcd.yaml`'s `volumes.hostPath.path` for `name: etcd-data`  to `<data-dir-location>`,
   then execute `kubectl -n kube-system delete pod <name-of-etcd-pod>` or `systemctl restart kubelet.service` (or both).
   -->
   如果 `<data-dir-location>` 与之前的文件夹相同，请先删除此文件夹并停止 etcd 进程，再恢复集群。
   否则，在恢复后更改 etcd 配置并重启 etcd 进程将使用新的数据目录：
   首先将 `/etc/kubernetes/manifests/etcd.yaml` 中 `name: etcd-data` 对应条目的
   `volumes.hostPath.path` 改为 `<data-dir-location>`，
   然后执行 `kubectl -n kube-system delete pod <name-of-etcd-pod>` 或 `systemctl restart kubelet.service`（或两段命令都执行）。

{{% /tab %}}
{{< /tabs >}}

<!--
When restoring the cluster, use the `--data-dir` option to specify to which folder the cluster should be restored:
-->
在恢复集群时，使用 `--data-dir` 选项来指定集群应被恢复到哪个文件夹。

```shell
etcdutl --data-dir <data-dir-location> snapshot restore snapshot.db
```

<!--
where `<data-dir-location>` is a directory that will be created during the restore process.

The below example depicts the usage of the `etcdctl` tool for the restore operation:
-->
其中 `<data-dir-location>` 是将在恢复过程中创建的目录。

下面示例展示了如何使用 `etcdctl` 工具执行恢复操作：

{{< note >}}
<!--
The usage of `etcdctl` for restoring has been deprecated since etcd v3.5.x and may be removed from a future etcd release.
-->
自 etcd v3.5.x 版本起，使用 `etcdctl` 进行恢复的功能已被弃用，未来的可能会在 etcd 版本中被移除。
{{< /note >}}

```shell
export ETCDCTL_API=3
etcdctl --data-dir <data-dir-location> snapshot restore snapshot.db
```

<!--
If `<data-dir-location>` is the same folder as before, delete it and stop the etcd process before restoring the cluster. Otherwise, change etcd configuration and restart the etcd process after restoration to have it use the new data directory.
-->
如果 `<data-dir-location>` 与之前的文件夹相同，请先删除此文件夹并停止 etcd 进程，再恢复集群。
否则，需要在恢复后更改 etcd 配置并重新启动 etcd 进程才能使用新的数据目录。

<!--
For more information and examples on restoring a cluster from a snapshot file, see
[etcd disaster recovery documentation](https://etcd.io/docs/current/op-guide/recovery/#restoring-a-cluster).
-->
有关从快照文件还原集群的详细信息和示例，请参阅
[etcd 灾难恢复文档](https://etcd.io/docs/current/op-guide/recovery/#restoring-a-cluster)。

<!--
If the access URLs of the restored cluster are changed from the previous
cluster, the Kubernetes API server must be reconfigured accordingly. In this
case, restart Kubernetes API servers with the flag
`--etcd-servers=$NEW_ETCD_CLUSTER` instead of the flag
`--etcd-servers=$OLD_ETCD_CLUSTER`. Replace `$NEW_ETCD_CLUSTER` and
`$OLD_ETCD_CLUSTER` with the respective IP addresses. If a load balancer is
used in front of an etcd cluster, you might need to update the load balancer
instead.
-->
如果还原的集群的访问 URL 与前一个集群不同，则必须相应地重新配置 Kubernetes API 服务器。
在本例中，使用参数 `--etcd-servers=$NEW_ETCD_CLUSTER` 而不是参数 `--etcd-servers=$OLD_ETCD_CLUSTER`
重新启动 Kubernetes API 服务器。用相应的 IP 地址替换 `$NEW_ETCD_CLUSTER` 和 `$OLD_ETCD_CLUSTER`。
如果在 etcd 集群前面使用负载均衡，则可能需要更新负载均衡器。

<!--
If the majority of etcd members have permanently failed, the etcd cluster is
considered failed. In this scenario, Kubernetes cannot make any changes to its
current state. Although the scheduled pods might continue to run, no new pods
can be scheduled. In such cases, recover the etcd cluster and potentially
reconfigure Kubernetes API servers to fix the issue.
-->
如果大多数 etcd 成员永久失败，则认为 etcd 集群失败。在这种情况下，Kubernetes 不能对其当前状态进行任何更改。
虽然已调度的 Pod 可能继续运行，但新的 Pod 无法调度。在这种情况下，
恢复 etcd 集群并可能需要重新配置 Kubernetes API 服务器以修复问题。

<!--
## Upgrading etcd clusters
-->
## 升级 etcd 集群    {#upgrading-etcd-clusters}

{{< caution >}}
<!--
Before you start an upgrade, back up your etcd cluster first.
-->
在开始升级之前，请先备份你的 etcd 集群。
{{< /caution >}}

<!--
For details on etcd upgrade, refer to the [etcd upgrades](https://etcd.io/docs/latest/upgrades/) documentation.
-->
有关 etcd 升级的细节，请参阅 [etcd 升级](https://etcd.io/docs/latest/upgrades/)文档。

<!--
## Maintaining etcd clusters

For more details on etcd maintenance, please refer to the [etcd maintenance](https://etcd.io/docs/latest/op-guide/maintenance/) documentation.
-->
## 维护 etcd 集群    {#maintaining-etcd-clusters}

有关 etcd 维护的更多详细信息，请参阅 [etcd 维护](https://etcd.io/docs/latest/op-guide/maintenance/)文档。

<!--
### Cluster defragmentation
-->
### 集群碎片整理   {#cluster-defragmentation}

{{% thirdparty-content single="true" %}}

<!--
Defragmentation is an expensive operation, so it should be executed as infrequently
as possible. On the other hand, it's also necessary to make sure any etcd member
will not exceed the storage quota. The Kubernetes project recommends that when
you perform defragmentation, you use a tool such as [etcd-defrag](https://github.com/ahrtr/etcd-defrag).
-->
碎片整理是一种昂贵的操作，因此应尽可能少地执行此操作。
另一方面，也有必要确保任何 etcd 成员都不会超过存储配额。
Kubernetes 项目建议在执行碎片整理时，
使用诸如 [etcd-defrag](https://github.com/ahrtr/etcd-defrag) 之类的工具。

<!--
You can also run the defragmentation tool as a Kubernetes CronJob, to make sure that
defragmentation happens regularly. See [`etcd-defrag-cronjob.yaml`](https://github.com/ahrtr/etcd-defrag/blob/main/doc/etcd-defrag-cronjob.yaml)
for details.
-->
你还可以将碎片整理工具作为 Kubernetes CronJob 运行，以确保定期进行碎片整理。
有关详细信息，请参阅
[`etcd-defrag-cronjob.yaml`](https://github.com/ahrtr/etcd-defrag/blob/main/doc/etcd-defrag-cronjob.yaml)。
