---
title: 為 Kubernetes 執行 etcd 叢集
content_type: task
---
<!--
reviewers:
- mml
- wojtek-t
title: Operating etcd clusters for Kubernetes
content_type: task
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
## 先決條件    {#prerequisites}

* 執行的 etcd 叢集個數成員為奇數。

* etcd 是一個 leader-based 分散式系統。確保主節點定期向所有從節點發送心跳，以保持叢集穩定。

* 確保不發生資源不足。

  叢集的效能和穩定性對網路和磁碟 I/O 非常敏感。任何資源匱乏都會導致心跳超時，
  從而導致叢集的不穩定。不穩定的情況表明沒有選出任何主節點。
  在這種情況下，叢集不能對其當前狀態進行任何更改，這意味著不能排程新的 pod。

* 保持 etcd 叢集的穩定對 Kubernetes 叢集的穩定性至關重要。
  因此，請在專用機器或隔離環境上執行 etcd 叢集，以滿足
  [所需資源需求](https://etcd.io/docs/current/op-guide/hardware/)。

* 在生產中執行的 etcd 的最低推薦版本是 `3.2.10+`。

<!--
## Resource requirements

Operating etcd with limited resources is suitable only for testing purposes.
For deploying in production, advanced hardware configuration is required.
Before deploying etcd in production, see
[resource requirement reference](https://etcd.io/docs/current/op-guide/hardware/#example-hardware-configurations).
-->
## 資源需求    {#resource-requirements}

使用有限的資源執行 etcd 只適合測試目的。為了在生產中部署，需要先進的硬體配置。
在生產中部署 etcd 之前，請檢視[所需資源參考文件](https://etcd.io/docs/current/op-guide/hardware/#example-hardware-configurations)。

<!--
## Starting etcd clusters

This section covers starting a single-node and multi-node etcd cluster.
-->
## 啟動 etcd 叢集    {#starting-etcd-clusters}

本節介紹如何啟動單節點和多節點 etcd 叢集。

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
### 單節點 etcd 叢集    {#single-node-etcd-cluster}

只為測試目的使用單節點 etcd 叢集。

1. 執行以下命令：

   ```sh
   etcd --listen-client-urls=http://$PRIVATE_IP:2379 \
      --advertise-client-urls=http://$PRIVATE_IP:2379
   ```

2. 使用引數 `--etcd-servers=$PRIVATE_IP:2379` 啟動 Kubernetes API 伺服器。

   確保將 `PRIVATE_IP` 設定為etcd客戶端 IP。

<!--
### Multi-node etcd cluster
-->
### 多節點 etcd 叢集    {#multi-node-etcd-cluster}

<!--
For durability and high availability, run etcd as a multi-node cluster in
production and back it up periodically. A five-member cluster is recommended
in production. For more information, see
[FAQ documentation](https://etcd.io/docs/current/faq/#what-is-failure-tolerance).
-->
出於耐用性和高可用性考量，在生產環境中應以多節點叢集的方式執行 etcd，並且定期備份。
建議在生產環境中使用五個成員的叢集。
有關該內容的更多資訊，請參閱[常見問題文件](https://etcd.io/docs/current/faq/#what-is-failure-tolerance)。

<!--
Configure an etcd cluster either by static member information or by dynamic
discovery. For more information on clustering, see
[etcd clustering documentation](https://etcd.io/docs/current/op-guide/clustering/).
-->
可以透過靜態成員資訊或動態發現的方式配置 etcd 叢集。
有關叢集的詳細資訊，請參閱
[etcd 叢集文件](https://etcd.io/docs/current/op-guide/clustering/)。

<!--
For an example, consider a five-member etcd cluster running with the following
client URLs: `http://$IP1:2379`, `http://$IP2:2379`, `http://$IP3:2379`,
`http://$IP4:2379`, and `http://$IP5:2379`. To start a Kubernetes API server:
-->
例如，考慮執行以下客戶端 URL 的五個成員的 etcd 叢集：`http://$IP1:2379`、
`http://$IP2:2379`、`http://$IP3:2379`、`http://$IP4:2379` 和 `http://$IP5:2379`。
要啟動 Kubernetes API 伺服器：

<!--
1. Run the following:

   ```shell
   etcd --listen-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379 --advertise-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379
   ```

2. Start the Kubernetes API servers with the flag
   `--etcd-servers=$IP1:2379,$IP2:2379,$IP3:2379,$IP4:2379,$IP5:2379`.

   Make sure the `IP<n>` variables are set to your client IP addresses.
-->
1. 執行以下命令：

   ```shell
   etcd --listen-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379 --advertise-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379
   ```

2. 使用引數 `--etcd-servers=$IP1:2379,$IP2:2379,$IP3:2379,$IP4:2379,$IP5:2379`
   啟動 Kubernetes API 伺服器。

   確保將 `IP<n>` 變數設定為客戶端 IP 地址。

<!--
### Multi-node etcd cluster with load balancer

To run a load balancing etcd cluster:

1. Set up an etcd cluster.
2. Configure a load balancer in front of the etcd cluster.
   For example, let the address of the load balancer be `$LB`.
3. Start Kubernetes API Servers with the flag `--etcd-servers=$LB:2379`.
-->
### 使用負載均衡的多節點 etcd 叢集    {#multi-node-etcd-cluster-with-load-balancer}

要執行負載均衡的 etcd 叢集：

1. 建立一個 etcd 叢集。
2. 在 etcd 叢集前面配置負載均衡器。例如，讓負載均衡器的地址為 `$LB`。
3. 使用引數 `--etcd-servers=$LB:2379` 啟動 Kubernetes API 伺服器。

<!--
## Securing etcd clusters
-->
## 加固 etcd 叢集    {#securing-etcd-clusters}

<!--
Access to etcd is equivalent to root permission in the cluster so ideally only
the API server should have access to it. Considering the sensitivity of the
data, it is recommended to grant permission to only those nodes that require
access to etcd clusters.
-->
對 etcd 的訪問相當於叢集中的 root 許可權，因此理想情況下只有 API 伺服器才能訪問它。
考慮到資料的敏感性，建議只向需要訪問 etcd 叢集的節點授予許可權。

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
想要確保 etcd 的安全，可以設定防火牆規則或使用 etcd 提供的安全特性，這些安全特性依賴於 x509 公鑰基礎設施（PKI）。
首先，透過生成金鑰和證書對來建立安全的通訊通道。
例如，使用金鑰對 `peer.key` 和 `peer.cert` 來保護 etcd 成員之間的通訊，
而 `client.key` 和 `client.cert` 用於保護 etcd 與其客戶端之間的通訊。
請參閱 etcd 專案提供的[示例指令碼](https://github.com/coreos/etcd/tree/master/hack/tls-setup)，
以生成用於客戶端身份驗證的金鑰對和 CA 檔案。

<!--
### Securing communication
-->
### 安全通訊    {#securing-communication}

<!--
To configure etcd with secure peer communication, specify flags
`--peer-key-file=peer.key` and `--peer-cert-file=peer.cert`, and use HTTPS as
the URL schema.
-->
若要使用安全對等通訊對 etcd 進行配置，請指定引數 `--peer-key-file=peer.key`
和 `--peer-cert-file=peer.cert`，並使用 HTTPS 作為 URL 模式。

<!--
Similarly, to configure etcd with secure client communication, specify flags
`--key-file=k8sclient.key` and `--cert-file=k8sclient.cert`, and use HTTPS as
the URL schema. Here is an example on a client command that uses secure
communication:
-->
類似地，要使用安全客戶端通訊對 etcd 進行配置，請指定引數 `--key-file=k8sclient.key`
和 `--cert-file=k8sclient.cert`，並使用 HTTPS 作為 URL 模式。
使用安全通訊的客戶端命令的示例：

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
### 限制 etcd 叢集的訪問    {#limiting-access-of-etcd-clusters}

<!--
After configuring secure communication, restrict the access of etcd cluster to
only the Kubernetes API servers. Use TLS authentication to do so.
-->
配置安全通訊後，限制只有 Kubernetes API 伺服器可以訪問 etcd 叢集。使用 TLS 身份驗證來完成此任務。

<!--
For example, consider key pairs `k8sclient.key` and `k8sclient.cert` that are
trusted by the CA `etcd.ca`. When etcd is configured with `--client-cert-auth`
along with TLS, it verifies the certificates from clients by using system CAs
or the CA passed in by `--trusted-ca-file` flag. Specifying flags
`--client-cert-auth=true` and `--trusted-ca-file=etcd.ca` will restrict the
access to clients with the certificate `k8sclient.cert`.
-->
例如，考慮由 CA `etcd.ca` 信任的金鑰對 `k8sclient.key` 和 `k8sclient.cert`。
當 etcd 配置為 `--client-cert-auth` 和 TLS 時，它使用系統 CA 或由 `--trusted-ca-file`
引數傳入的 CA 驗證來自客戶端的證書。指定引數 `--client-cert-auth=true` 和
`--trusted-ca-file=etcd.ca` 將限制對具有證書 `k8sclient.cert` 的客戶端的訪問。

<!--
Once etcd is configured correctly, only clients with valid certificates can
access it. To give Kubernetes API servers the access, configure them with the
flags `--etcd-certfile=k8sclient.cert`, `--etcd-keyfile=k8sclient.key` and
`--etcd-cafile=ca.cert`.
-->
一旦正確配置了 etcd，只有具有有效證書的客戶端才能訪問它。要讓 Kubernetes API 伺服器訪問，
可以使用引數 `--etcd-certfile=k8sclient.cert`、`--etcd-keyfile=k8sclient.key` 和 `--etcd-cafile=ca.cert` 配置。

<!--
{{< note >}}
etcd authentication is not currently supported by Kubernetes. For more
information, see the related issue
[Support Basic Auth for Etcd v2](https://github.com/kubernetes/kubernetes/issues/23398).
{{< /note >}}
-->
{{< note >}}
Kubernetes 目前不支援 etcd 身份驗證。
想要了解更多資訊，請參閱相關的問題
[支援 etcd v2 的基本認證](https://github.com/kubernetes/kubernetes/issues/23398)。
{{< /note >}}

<!--
## Replacing a failed etcd member
-->
## 替換失敗的 etcd 成員    {#replacing-a-failed-etcd-member}

<!--
etcd cluster achieves high availability by tolerating minor member failures.
However, to improve the overall health of the cluster, replace failed members
immediately. When multiple members fail, replace them one by one. Replacing a
failed member involves two steps: removing the failed member and adding a new
member.
-->
etcd 叢集透過容忍少數成員故障實現高可用性。
但是，要改善叢集的整體健康狀況，請立即替換失敗的成員。當多個成員失敗時，逐個替換它們。
替換失敗成員需要兩個步驟：刪除失敗成員和新增新成員。

<!--
Though etcd keeps unique member IDs internally, it is recommended to use a
unique name for each member to avoid human errors. For example, consider a
three-member etcd cluster. Let the URLs be, `member1=http://10.0.0.1`,
`member2=http://10.0.0.2`, and `member3=http://10.0.0.3`. When `member1` fails,
replace it with `member4=http://10.0.0.4`.
-->
雖然 etcd 在內部保留唯一的成員 ID，但建議為每個成員使用唯一的名稱，以避免人為錯誤。
例如，考慮一個三成員的 etcd 叢集。假定 URL 分別為：`member1=http://10.0.0.1`、`member2=http://10.0.0.2`
和 `member3=http://10.0.0.3`。當 `member1` 失敗時，將其替換為 `member4=http://10.0.0.4`。

<!--
1. Get the member ID of the failed `member1`:
-->
1. 獲取失敗的 `member1` 的成員 ID：

   ```shell
   etcdctl --endpoints=http://10.0.0.2,http://10.0.0.3 member list
   ```

   <!--
   The following message is displayed:
   -->
   顯示以下資訊：

   ```console
   8211f1d0f64f3269, started, member1, http://10.0.0.1:2380, http://10.0.0.1:2379
   91bc3c398fb3c146, started, member2, http://10.0.0.2:2380, http://10.0.0.2:2379
   fd422379fda50e48, started, member3, http://10.0.0.3:2380, http://10.0.0.3:2379
   ```

<!--
2. Remove the failed member:
-->
2. 移除失敗的成員

   ```shell
   etcdctl member remove 8211f1d0f64f3269
   ```

   <!--
   The following message is displayed:
   -->
   顯示以下資訊：

   ```console
   Removed member 8211f1d0f64f3269 from cluster
   ```

<!--
3. Add the new member:
-->
3. 增加新成員：

   ```shell
   etcdctl member add member4 --peer-urls=http://10.0.0.4:2380
   ```

   <!--
   The following message is displayed:
   -->
   顯示以下資訊：

   ```console
   Member 2be1eb8f84b7f63e added to cluster ef37ad9dc622a7c4
   ```

<!--
4. Start the newly added member on a machine with the IP `10.0.0.4`:
-->
4. 在 IP 為 `10.0.0.4` 的機器上啟動新增加的成員：

   ```shell
   export ETCD_NAME="member4"
   export ETCD_INITIAL_CLUSTER="member2=http://10.0.0.2:2380,member3=http://10.0.0.3:2380,member4=http://10.0.0.4:2380"
   export ETCD_INITIAL_CLUSTER_STATE=existing
   etcd [flags]
   ```

<!--
5. Do either of the following:

   1. Update the `--etcd-servers` flag for the Kubernetes API servers to make
      Kubernetes aware of the configuration changes, then restart the
      Kubernetes API servers.
   2. Update the load balancer configuration if a load balancer is used in the
      deployment.
-->
5. 執行以下操作之一：

   1. 更新 Kubernetes API 伺服器的 `--etcd-servers` 引數，使 Kubernetes
      知道配置已更改，然後重新啟動 Kubernetes API 伺服器。
   2. 如果在 deployment 中使用了負載均衡，更新負載均衡配置。

<!--
For more information on cluster reconfiguration, see
[etcd reconfiguration documentation](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member).
-->
有關叢集重新配置的詳細資訊，請參閱
[etcd 重構文件](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)。

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
## 備份 etcd 叢集    {#backing-up-an-etcd-cluster}

所有 Kubernetes 物件都儲存在 etcd 上。定期備份 etcd 叢集資料對於在災難場景（例如丟失所有控制平面節點）下恢復 Kubernetes 叢集非常重要。
快照檔案包含所有 Kubernetes 狀態和關鍵資訊。為了保證敏感的 Kubernetes 資料的安全，可以對快照檔案進行加密。

備份 etcd 叢集可以透過兩種方式完成：etcd 內建快照和卷快照。

<!--
### Built-in snapshot
-->
### 內建快照    {#built-in-snapshot}

<!--
etcd supports built-in snapshot. A snapshot may either be taken from a live
member with the `etcdctl snapshot save` command or by copying the
`member/snap/db` file from an etcd
[data directory](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)
that is not currently used by an etcd process. Taking the snapshot will
not affect the performance of the member.
-->
etcd 支援內建快照。快照可以從使用 `etcdctl snapshot save` 命令的活動成員中獲取，
也可以透過從 etcd [資料目錄](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)
複製 `member/snap/db` 檔案，該 etcd 資料目錄目前沒有被 etcd 程序使用。獲取快照不會影響成員的效能。

<!--
Below is an example for taking a snapshot of the keyspace served by
`$ENDPOINT` to the file `snapshotdb`:
-->
下面是一個示例，用於獲取 `$ENDPOINT` 所提供的鍵空間的快照到檔案 `snapshotdb`：

```shell
ETCDCTL_API=3 etcdctl --endpoints $ENDPOINT snapshot save snapshotdb
```
<!--
Verify the snapshot:
-->
驗證快照:

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
-->
### 卷快照    {#volume-snapshot}

<!--
If etcd is running on a storage volume that supports backup, such as Amazon
Elastic Block Store, back up etcd data by taking a snapshot of the storage
volume.
-->
如果 etcd 執行在支援備份的儲存卷（如 Amazon Elastic Block
儲存）上，則可以透過獲取儲存卷的快照來備份 etcd 資料。

<!--
### Snapshot using etcdctl options
-->
### 使用 etcdctl 選項的快照    {#snapshot-using-etcdctl-options}

<!--
We can also take the snapshot using various options given by etcdctl. For example 
-->
我們還可以使用 etcdctl 提供的各種選項來製作快照。例如：

```shell
ETCDCTL_API=3 etcdctl -h 
```

<!--
will list various options available from etcdctl. For example, you can take a snapshot by specifying
the endpoint, certificates etc as shown below:
-->
列出 etcdctl 可用的各種選項。例如，你可以透過指定端點、證書等來製作快照，如下所示：

```shell
ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=<trusted-ca-file> --cert=<cert-file> --key=<key-file> \
  snapshot save <backup-file-location>
```

<!--
where `trusted-ca-file`, `cert-file` and `key-file` can be obtained from the description of the etcd Pod.
-->
可以從 etcd Pod 的描述中獲得 `trusted-ca-file`、`cert-file` 和 `key-file`。

<!--
## Scaling up etcd clusters
-->
## 為 etcd 叢集擴容    {#scaling-up-etcd-clusters}

<!--
Scaling up etcd clusters increases availability by trading off performance.
Scaling does not increase cluster performance nor capability. A general rule
is not to scale up or down etcd clusters. Do not configure any auto scaling
groups for etcd clusters. It is highly recommended to always run a static
five-member etcd cluster for production Kubernetes clusters at any officially
supported scale.
-->
透過交換效能，對 etcd 叢集擴容可以提高可用性。縮放不會提高叢集效能和能力。
一般情況下不要擴大或縮小 etcd 叢集的集合。不要為 etcd 叢集配置任何自動縮放組。
強烈建議始終在任何官方支援的規模上執行生產 Kubernetes 叢集時使用靜態的五成員 etcd 叢集。

<!--
A reasonable scaling is to upgrade a three-member cluster to a five-member
one, when more reliability is desired. See
[etcd reconfiguration documentation](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)
for information on how to add members into an existing cluster.
-->
合理的擴充套件是在需要更高可靠性的情況下，將三成員叢集升級為五成員叢集。
請參閱 [etcd 重新配置文件](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)
以瞭解如何將成員新增到現有叢集中的資訊。

<!--
## Restoring an etcd cluster
-->
## 恢復 etcd 叢集    {#restoring-an-etcd-cluster}

<!--
etcd supports restoring from snapshots that are taken from an etcd process of
the [major.minor](http://semver.org/) version. Restoring a version from a
different patch version of etcd also is supported. A restore operation is
employed to recover the data of a failed cluster.
-->
etcd 支援從 [major.minor](http://semver.org/) 或其他不同 patch 版本的 etcd 程序中獲取的快照進行恢復。
還原操作用於恢復失敗的叢集的資料。

<!--
Before starting the restore operation, a snapshot file must be present. It can
either be a snapshot file from a previous backup operation, or from a remaining
[data directory](https://etcd.io/docs/current/op-guide/configuration/#--data-dir).
Here is an example:
-->
在啟動還原操作之前，必須有一個快照檔案。它可以是來自以前備份操作的快照檔案，
也可以是來自剩餘[資料目錄](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)的快照檔案。
例如：

```shell
ETCDCTL_API=3 etcdctl --endpoints 10.2.0.9:2379 snapshot restore snapshotdb
```

<!--
Another example for restoring using etcdctl options:
-->
恢復時也可以指定操作選項，例如：

```shell
ETCDCTL_API=3 etcdctl --data-dir <data-dir-location> snapshot restore snapshotdb
```

<!--
For more information and examples on restoring a cluster from a snapshot file, see
[etcd disaster recovery documentation](https://etcd.io/docs/current/op-guide/recovery/#restoring-a-cluster).
-->
有關從快照檔案還原叢集的詳細資訊和示例，請參閱
[etcd 災難恢復文件](https://etcd.io/docs/current/op-guide/recovery/#restoring-a-cluster)。

<!--
If the access URLs of the restored cluster is changed from the previous
cluster, the Kubernetes API server must be reconfigured accordingly. In this
case, restart Kubernetes API servers with the flag
`--etcd-servers=$NEW_ETCD_CLUSTER` instead of the flag
`--etcd-servers=$OLD_ETCD_CLUSTER`. Replace `$NEW_ETCD_CLUSTER` and
`$OLD_ETCD_CLUSTER` with the respective IP addresses. If a load balancer is
used in front of an etcd cluster, you might need to update the load balancer
instead.
-->
如果還原的叢集的訪問 URL 與前一個叢集不同，則必須相應地重新配置 Kubernetes API 伺服器。
在本例中，使用引數 `--etcd-servers=$NEW_ETCD_CLUSTER` 而不是引數 `--etcd-servers=$OLD_ETCD_CLUSTER` 重新啟動 Kubernetes API 伺服器。
用相應的 IP 地址替換 `$NEW_ETCD_CLUSTER` 和 `$OLD_ETCD_CLUSTER`。如果在 etcd 叢集前面使用負載平衡，則可能需要更新負載均衡器。

<!--
If the majority of etcd members have permanently failed, the etcd cluster is
considered failed. In this scenario, Kubernetes cannot make any changes to its
current state. Although the scheduled pods might continue to run, no new pods
can be scheduled. In such cases, recover the etcd cluster and potentially
reconfigure Kubernetes API servers to fix the issue.
-->
如果大多數 etcd 成員永久失敗，則認為 etcd 叢集失敗。在這種情況下，Kubernetes 不能對其當前狀態進行任何更改。
雖然已排程的 pod 可能繼續執行，但新的 pod 無法排程。在這種情況下，恢復 etcd 叢集並可能需要重新配置 Kubernetes API 伺服器以修復問題。

<!--
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
{{< note >}}
如果叢集中正在執行任何 API 伺服器，則不應嘗試還原 etcd 的例項。相反，請按照以下步驟還原 etcd：

- 停止**所有** API 服務例項
- 在所有 etcd 例項中恢復狀態
- 重啟所有 API 服務例項

我們還建議重啟所有元件（例如 `kube-scheduler`、`kube-controller-manager`、`kubelet`），以確保它們不會
依賴一些過時的資料。請注意，實際中還原會花費一些時間。
在還原過程中，關鍵元件將丟失領導鎖並自行重啟。
{{< /note >}}

<!--
## Upgrading etcd clusters
-->
## 升級 etcd 叢集    {#upgrading-etcd-clusters}

<!--
For more details on etcd upgrade, please refer to the [etcd upgrades](https://etcd.io/docs/latest/upgrades/) documentation.
-->
有關 etcd 升級的更多詳細資訊，請參閱 [etcd 升級](https://etcd.io/docs/latest/upgrades/)文件。

<!--
{{< note >}}
Before you start an upgrade, please back up your etcd cluster first.
{{< /note >}}
-->
{{< note >}}
在開始升級之前，請先備份你的 etcd 叢集。
{{< /note >}}

