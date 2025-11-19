---
title: 操作 Kubernetes 中的 etcd 集羣
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
你在按照本頁所述的步驟部署、管理、備份或恢復 etcd 之前，
你需要先理解運行 etcd 集羣的一般期望。更多細節參閱 [etcd 文檔](https://etcd.io/docs/)。

<!--
Key details include:

* The minimum recommended etcd versions to run in production are `3.4.22+` and `3.5.6+`.

* etcd is a leader-based distributed system. Ensure that the leader
  periodically send heartbeats on time to all followers to keep the cluster
  stable.

* You should run etcd as a cluster with an odd number of members.
-->
關鍵要點包括：

* 在生產環境中運行的 etcd 最低推薦版本爲 `3.4.22+` 和 `3.5.6+`。

* etcd 是一個基於主節點（Leader-Based）的分佈式系統。確保主節點定期向所有從節點發送心跳，以保持集羣穩定。

* 你運行的 etcd 集羣成員個數應爲奇數。

<!--
* Aim to ensure that no resource starvation occurs.

  Performance and stability of the cluster is sensitive to network and disk
  I/O. Any resource starvation can lead to heartbeat timeout, causing instability
  of the cluster. An unstable etcd indicates that no leader is elected. Under
  such circumstances, a cluster cannot make any changes to its current state,
  which implies no new pods can be scheduled.
-->
* 確保不發生資源不足。

  集羣的性能和穩定性對網絡和磁盤 I/O 非常敏感。任何資源匱乏都會導致心跳超時，
  從而導致集羣的不穩定。不穩定的情況表明沒有選出任何主節點。
  在這種情況下，集羣不能對其當前狀態進行任何更改，這意味着不能調度新的 Pod。

<!--
### Resource requirements for etcd

Operating etcd with limited resources is suitable only for testing purposes.
For deploying in production, advanced hardware configuration is required.
Before deploying etcd in production, see
[resource requirement reference](https://etcd.io/docs/current/op-guide/hardware/#example-hardware-configurations).
-->
## etcd 資源需求    {#resource-requirements-for-etcd}

使用有限的資源運行 etcd 只適合測試目的。在生產環境中部署 etcd，你需要有先進的硬件配置。
在生產中部署 etcd 之前，請查閱[所需資源參考文檔](https://etcd.io/docs/current/op-guide/hardware/#example-hardware-configurations)。

<!--
Keeping etcd clusters stable is critical to the stability of Kubernetes
clusters. Therefore, run etcd clusters on dedicated machines or isolated
environments for [guaranteed resource requirements](https://etcd.io/docs/current/op-guide/hardware/).

### Tools

Depending on which specific outcome you're working on, you will need the `etcdctl` tool or the
`etcdutl` tool (you may need both).
-->
保持 etcd 集羣的穩定對 Kubernetes 集羣的穩定性至關重要。
因此，請在專用機器或隔離環境上運行 etcd 集羣，
以滿足[所需資源需求](https://etcd.io/docs/current/op-guide/hardware/)。

### 工具   {#tools}

根據你想要達成的具體結果，你將需要安裝 `etcdctl` 工具或 `etcdutl` 工具（可能兩個工具都需要）。

<!-- steps -->

<!--
## Understanding etcdctl and etcdutl

`etcdctl` and `etcdutl` are command-line tools used to interact with etcd clusters, but they serve different purposes:

- `etcdctl`: This is the primary command-line client for interacting with etcd over a
network. It is used for day-to-day operations such as managing keys and values,
administering the cluster, checking health, and more.
-->
## 瞭解 etcdctl 和 etcdutl   {#understanding-etcdctl-and-etcdutl}

`etcdctl` 和 `etcdutl` 是用於與 etcd 集羣交互的命令行工具，但它們有不同的用途：

- `etcdctl`：這是通過網絡與 etcd 交互的主要命令行客戶端。
  它用於日常操作，比如管理鍵值對、管理集羣、檢查健康狀態等。

<!--
- `etcdutl`: This is an administration utility designed to operate directly on etcd data
files, including migrating data between etcd versions, defragmenting the database,
restoring snapshots, and validating data consistency. For network operations, `etcdctl`
should be used.

For more information on `etcdutl`, you can refer to the [etcd recovery documentation](https://etcd.io/docs/v3.5/op-guide/recovery/).
-->
- `etcdutl`：這是一個被設計用來直接操作 etcd 數據文件的管理工具，
  包括跨 etcd 版本遷移數據、數據庫碎片整理、恢復快照和驗證數據一致性等操作。
  對於網絡操作，你應使用 `etcdctl`。

有關 `etcdutl` 細節，請參閱 [etcd 恢復文檔](https://etcd.io/docs/v3.5/op-guide/recovery/)。

<!--
## Starting etcd clusters

This section covers starting a single-node and multi-node etcd cluster.

This guide assumes that `etcd` is already installed.
-->
## 啓動 etcd 集羣    {#starting-etcd-clusters}

本節介紹如何啓動單節點和多節點 etcd 集羣。

本指南假定 `etcd` 已經安裝好了。

<!--
### Single-node etcd cluster

Use a single-node etcd cluster only for testing purposes.

1. Run the following:
-->
### 單節點 etcd 集羣    {#single-node-etcd-cluster}

只爲測試目的使用單節點 etcd 集羣。

1. 運行以下命令：

   ```sh
   etcd --listen-client-urls=http://$PRIVATE_IP:2379 \
      --advertise-client-urls=http://$PRIVATE_IP:2379
   ```

<!--
2. Start the Kubernetes API server with the flag
   `--etcd-servers=$PRIVATE_IP:2379`.

   Make sure `PRIVATE_IP` is set to your etcd client IP.
-->
2. 使用參數 `--etcd-servers=$PRIVATE_IP:2379` 啓動 Kubernetes API 服務器。

   確保將 `PRIVATE_IP` 設置爲 etcd 客戶端 IP。

<!--
### Multi-node etcd cluster
-->
### 多節點 etcd 集羣    {#multi-node-etcd-cluster}

<!--
For durability and high availability, run etcd as a multi-node cluster in
production and back it up periodically. A five-member cluster is recommended
in production. For more information, see
[FAQ documentation](https://etcd.io/docs/current/faq/#what-is-failure-tolerance).
-->
出於耐用性和高可用性考量，在生產環境中應以多節點集羣的方式運行 etcd，並且定期備份。
建議在生產環境中使用五個成員的集羣。
有關該內容的更多信息，請參閱[常見問題文檔](https://etcd.io/docs/current/faq/#what-is-failure-tolerance)。

<!--
As you're using Kubernetes, you have the option to run etcd as a container inside
one or more Pods. The `kubeadm` tool sets up etcd
{{< glossary_tooltip text="static pods" term_id="static-pod" >}} by default, or
you can deploy a
[separate cluster](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
and instruct kubeadm to use that etcd cluster as the control plane's backing store.
-->
由於你正在使用 Kubernetes，你可以選擇在一個或多個 Pod 內以容器形式運行 etcd。
`kubeadm` 工具默認會安裝 etcd 的{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}}，
或者你可以部署一個[獨立的集羣](/zh-cn/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)並指示
kubeadm 將該 etcd 集羣用作控制平面的後端存儲。

<!--
You configure an etcd cluster either by static member information or by dynamic
discovery. For more information on clustering, see
[etcd clustering documentation](https://etcd.io/docs/current/op-guide/clustering/).
-->
你可以通過靜態成員信息或動態發現的方式配置 etcd 集羣。
有關集羣的詳細信息，請參閱
[etcd 集羣文檔](https://etcd.io/docs/current/op-guide/clustering/)。

<!--
For an example, consider a five-member etcd cluster running with the following
client URLs: `http://$IP1:2379`, `http://$IP2:2379`, `http://$IP3:2379`,
`http://$IP4:2379`, and `http://$IP5:2379`. To start a Kubernetes API server:
-->
例如，考慮運行以下客戶端 URL 的五個成員的 etcd 集羣：`http://$IP1:2379`、
`http://$IP2:2379`、`http://$IP3:2379`、`http://$IP4:2379` 和 `http://$IP5:2379`。
要啓動 Kubernetes API 服務器：

<!--
1. Run the following:
-->
1. 運行以下命令：

   ```shell
   etcd --listen-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379 --advertise-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379
   ```

<!--
2. Start the Kubernetes API servers with the flag
   `--etcd-servers=$IP1:2379,$IP2:2379,$IP3:2379,$IP4:2379,$IP5:2379`.

   Make sure the `IP<n>` variables are set to your client IP addresses.
-->
2. 使用參數 `--etcd-servers=$IP1:2379,$IP2:2379,$IP3:2379,$IP4:2379,$IP5:2379`
   啓動 Kubernetes API 服務器。

   確保將 `IP<n>` 變量設置爲客戶端 IP 地址。

<!--
### Multi-node etcd cluster with load balancer

To run a load balancing etcd cluster:

1. Set up an etcd cluster.
2. Configure a load balancer in front of the etcd cluster.
   For example, let the address of the load balancer be `$LB`.
3. Start Kubernetes API Servers with the flag `--etcd-servers=$LB:2379`.
-->
### 使用負載均衡器的多節點 etcd 集羣    {#multi-node-etcd-cluster-with-load-balancer}

要運行負載均衡的 etcd 集羣：

1. 建立一個 etcd 集羣。
2. 在 etcd 集羣前面配置負載均衡器。例如，讓負載均衡器的地址爲 `$LB`。
3. 使用參數 `--etcd-servers=$LB:2379` 啓動 Kubernetes API 服務器。

<!--
## Securing etcd clusters
-->
## 加固 etcd 集羣    {#securing-etcd-clusters}

<!--
Access to etcd is equivalent to root permission in the cluster so ideally only
the API server should have access to it. Considering the sensitivity of the
data, it is recommended to grant permission to only those nodes that require
access to etcd clusters.
-->
對 etcd 的訪問相當於集羣中的 root 權限，因此理想情況下只有 API 服務器才能訪問它。
考慮到數據的敏感性，建議只向需要訪問 etcd 集羣的節點授予權限。

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
想要確保 etcd 的安全，可以設置防火牆規則或使用 etcd 提供的安全特性，這些安全特性依賴於 x509 公鑰基礎設施（PKI）。
首先，通過生成密鑰和證書對來建立安全的通信通道。
例如，使用密鑰對 `peer.key` 和 `peer.cert` 來保護 etcd 成員之間的通信，
而 `client.key` 和 `client.cert` 用於保護 etcd 與其客戶端之間的通信。
請參閱 etcd 項目提供的[示例腳本](https://github.com/coreos/etcd/tree/master/hack/tls-setup)，
以生成用於客戶端身份驗證的密鑰對和 CA 文件。

<!--
### Securing communication
-->
### 安全通信    {#securing-communication}

<!--
To configure etcd with secure peer communication, specify flags
`--peer-key-file=peer.key` and `--peer-cert-file=peer.cert`, and use HTTPS as
the URL schema.
-->
若要使用安全對等通信對 etcd 進行配置，請指定參數 `--peer-key-file=peer.key`
和 `--peer-cert-file=peer.cert`，並使用 HTTPS 作爲 URL 模式。

<!--
Similarly, to configure etcd with secure client communication, specify flags
`--key=k8sclient.key` and `--cert=k8sclient.cert`, and use HTTPS as
the URL schema. Here is an example on a client command that uses secure
communication:
-->
類似地，要使用安全客戶端通信對 etcd 進行配置，請指定參數 `--key=k8sclient.key`
和 `--cert=k8sclient.cert`，並使用 HTTPS 作爲 URL 模式。
使用安全通信的客戶端命令的示例：

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
### 限制 etcd 集羣的訪問    {#limiting-access-of-etcd-clusters}

<!--
After configuring secure communication, restrict the access of the etcd cluster to
only the Kubernetes API servers using TLS authentication.
-->
配置安全通信後，使用 TLS 身份驗證來限制只有 Kubernetes API 服務器可以訪問 etcd 集羣。

<!--
For example, consider key pairs `k8sclient.key` and `k8sclient.cert` that are
trusted by the CA `etcd.ca`. When etcd is configured with `--client-cert-auth`
along with TLS, it verifies the certificates from clients by using system CAs
or the CA passed in by `--trusted-ca-file` flag. Specifying flags
`--client-cert-auth=true` and `--trusted-ca-file=etcd.ca` will restrict the
access to clients with the certificate `k8sclient.cert`.
-->
例如，考慮由 CA `etcd.ca` 信任的密鑰對 `k8sclient.key` 和 `k8sclient.cert`。
當 etcd 配置爲 `--client-cert-auth` 和 TLS 時，它使用系統 CA 或由 `--trusted-ca-file`
參數傳入的 CA 驗證來自客戶端的證書。指定參數 `--client-cert-auth=true` 和
`--trusted-ca-file=etcd.ca` 將限制對具有證書 `k8sclient.cert` 的客戶端的訪問。

<!--
Once etcd is configured correctly, only clients with valid certificates can
access it. To give Kubernetes API servers the access, configure them with the
flags `--etcd-certfile=k8sclient.cert`, `--etcd-keyfile=k8sclient.key` and
`--etcd-cafile=ca.cert`.
-->
一旦正確配置了 etcd，只有具有有效證書的客戶端才能訪問它。要讓 Kubernetes API 服務器訪問，
可以使用參數 `--etcd-certfile=k8sclient.cert`、`--etcd-keyfile=k8sclient.key`
和 `--etcd-cafile=ca.cert` 配置。

{{< note >}}
<!--
etcd authentication is not planned for Kubernetes.
-->
Kubernetes 沒有爲 etcd 提供身份驗證的計劃。
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
etcd 集羣通過容忍少數成員故障實現高可用性。
但是，要改善集羣的整體健康狀況，請立即替換失敗的成員。當多個成員失敗時，逐個替換它們。
替換失敗成員需要兩個步驟：刪除失敗成員和添加新成員。

<!--
Though etcd keeps unique member IDs internally, it is recommended to use a
unique name for each member to avoid human errors. For example, consider a
three-member etcd cluster. Let the URLs be, `member1=http://10.0.0.1`,
`member2=http://10.0.0.2`, and `member3=http://10.0.0.3`. When `member1` fails,
replace it with `member4=http://10.0.0.4`.
-->
雖然 etcd 在內部保留唯一的成員 ID，但建議爲每個成員使用唯一的名稱，以避免人爲錯誤。
例如，考慮一個三成員的 etcd 集羣。假定 URL 分別爲：`member1=http://10.0.0.1`、`member2=http://10.0.0.2`
和 `member3=http://10.0.0.3`。當 `member1` 失敗時，將其替換爲 `member4=http://10.0.0.4`。

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
   顯示以下信息：

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
2. 執行以下操作之一：

   1. 如果每個 Kubernetes API 服務器都配置爲與所有 etcd 成員通信，
      請從 `--etcd-servers` 標誌中移除刪除失敗的成員，然後重新啓動每個 Kubernetes API 服務器。
   2. 如果每個 Kubernetes API 服務器都與單個 etcd 成員通信，
      則停止與失敗的 etcd 通信的 Kubernetes API 服務器。

<!-- 
1. Stop the etcd server on the broken node. It is possible that other 
   clients besides the Kubernetes API server are causing traffic to etcd 
   and it is desirable to stop all traffic to prevent writes to the data
   directory.
-->
3. 停止故障節點上的 etcd 服務器。除了 Kubernetes API 服務器之外的其他客戶端可能會造成流向 etcd 的流量，
   可以停止所有流量以防止寫入數據目錄。

<!--
1. Remove the failed member:
-->
4. 移除失敗的成員：

   ```shell
   etcdctl member remove 8211f1d0f64f3269
   ```

   <!--
   The following message is displayed:
   -->
   顯示以下信息：

   ```console
   Removed member 8211f1d0f64f3269 from cluster
   ```

<!--
1. Add the new member:
-->
5. 增加新成員：

   ```shell
   etcdctl member add member4 --peer-urls=http://10.0.0.4:2380
   ```

   <!--
   The following message is displayed:
   -->
   顯示以下信息：

   ```console
   Member 2be1eb8f84b7f63e added to cluster ef37ad9dc622a7c4
   ```

<!--
1. Start the newly added member on a machine with the IP `10.0.0.4`:
-->
6. 在 IP 爲 `10.0.0.4` 的機器上啓動新增加的成員：

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
7. 執行以下操作之一：

   1. 如果每個 Kubernetes API 服務器都配置爲與所有 etcd 成員通信，
      則將新增的成員添加到 `--etcd-servers` 標誌，然後重新啓動每個 Kubernetes API 服務器。
   2. 如果每個 Kubernetes API 服務器都與單個 etcd 成員通信，請啓動在第 2 步中停止的 Kubernetes API 服務器。
      然後配置 Kubernetes API 服務器客戶端以再次將請求路由到已停止的 Kubernetes API 服務器。
      這通常可以通過配置負載均衡器來完成。

<!--
For more information on cluster reconfiguration, see
[etcd reconfiguration documentation](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member).
-->
有關集羣重新配置的詳細信息，請參閱
[etcd 重構文檔](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)。

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
## 備份 etcd 集羣    {#backing-up-an-etcd-cluster}

所有 Kubernetes 對象都存儲在 etcd 中。
定期備份 etcd 集羣數據對於在災難場景（例如丟失所有控制平面節點）下恢復 Kubernetes 集羣非常重要。
快照文件包含所有 Kubernetes 狀態和關鍵信息。爲了保證敏感的 Kubernetes 數據的安全，可以對快照文件進行加密。

備份 etcd 集羣可以通過兩種方式完成：etcd 內置快照和卷快照。

<!--
### Built-in snapshot
-->
### 內置快照    {#built-in-snapshot}

<!--
etcd supports built-in snapshot. A snapshot may either be created from a live
member with the `etcdctl snapshot save` command or by copying the
`member/snap/db` file from an etcd
[data directory](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)
that is not currently used by an etcd process. Creating the snapshot will
not affect the performance of the member.
-->
etcd 支持內置快照。快照可以從使用 `etcdctl snapshot save` 命令的活動成員中創建，
也可以通過從目前沒有被 etcd 進程使用的 etcd [數據目錄](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)
中拷貝 `member/snap/db` 文件。創建快照並不會影響 etcd 成員的性能。

<!--
Below is an example for creating a snapshot of the keyspace served by
`$ENDPOINT` to the file `snapshot.db`:
-->
下面是一個示例，用於創建 `$ENDPOINT` 所提供的鍵空間的快照到文件 `snapshot.db`：

```shell
ETCDCTL_API=3 etcdctl --endpoints $ENDPOINT snapshot save snapshot.db
```

<!--
Verify the snapshot:
-->
驗證快照:

<!--
Use etcdutl
-->
{{< tabs name="etcd_verify_snapshot" >}}
{{% tab name="使用 etcdutl" %}}
   <!--
   The below example depicts the usage of the `etcdutl` tool for verifying a snapshot:
   -->
   下面的例子展示瞭如何使用 `etcdutl` 工具來驗證快照：

   ```shell
   etcdutl --write-out=table snapshot status snapshot.db 
   ```

   <!--
   This should generate an output resembling the example provided below:
   -->
   此命令應該生成類似於下例的輸出：

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
{{% tab name="使用 etcdctl（已棄用）" %}}

   {{< note >}}
   <!--
   The usage of `etcdctl snapshot status` has been **deprecated** since etcd v3.5.x and is slated for removal from etcd v3.6.
   It is recommended to utilize [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md) instead.
   -->
   自 etcd v3.5.x 起，`etcdctl snapshot status` 的使用已被 **棄用**，
   並計劃在 etcd v3.6 中移除。建議改用 [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md)。
   {{< /note >}}

   <!--
   The below example depicts the usage of the `etcdctl` tool for verifying a snapshot:
   -->
   下面的例子展示瞭如何使用 `etcdctl` 工具來驗證快照：

   ```shell
   export ETCDCTL_API=3
   etcdctl --write-out=table snapshot status snapshot.db
   ```

   <!--
   This should generate an output resembling the example provided below:
   -->
   此命令應該生成類似於下例的輸出：

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
如果 etcd 運行在支持備份的存儲卷（如 Amazon Elastic Block
存儲）上，則可以通過創建存儲卷的快照來備份 etcd 數據。

<!--
### Snapshot using etcdctl options
-->
### 使用 etcdctl 選項的快照    {#snapshot-using-etcdctl-options}

<!--
We can also create the snapshot using various options given by etcdctl. For example: 
-->
我們還可以使用 etcdctl 提供的各種選項來製作快照。例如：

```shell
ETCDCTL_API=3 etcdctl -h 
```

<!--
will list various options available from etcdctl. For example, you can create a snapshot by specifying
the endpoint, certificates and key as shown below:
-->
列出 etcdctl 可用的各種選項。例如，你可以通過指定端點、證書和密鑰來製作快照，如下所示：

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
## Scaling out etcd clusters
-->
## 爲 etcd 集羣擴容    {#scaling-out-etcd-clusters}

<!--
Scaling out etcd clusters increases availability by trading off performance.
Scaling does not increase cluster performance nor capability. A general rule
is not to scale out or in etcd clusters. Do not configure any auto scaling
groups for etcd clusters. It is strongly recommended to always run a static
five-member etcd cluster for production Kubernetes clusters at any officially
supported scale.
-->
通過交換性能，對 etcd 集羣擴容可以提高可用性。縮放不會提高集羣性能和能力。
一般情況下不要擴大或縮小 etcd 集羣的集合。不要爲 etcd 集羣配置任何自動縮放組。
強烈建議始終在任何官方支持的規模上運行生產 Kubernetes 集羣時使用靜態的五成員 etcd 集羣。

<!--
A reasonable scaling is to upgrade a three-member cluster to a five-member
one, when more reliability is desired. See
[etcd reconfiguration documentation](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)
for information on how to add members into an existing cluster.
-->
合理的擴展是在需要更高可靠性的情況下，將三成員集羣升級爲五成員集羣。
請參閱 [etcd 重構文檔](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)
以瞭解如何將成員添加到現有集羣中的信息。

<!--
## Restoring an etcd cluster
-->
## 恢復 etcd 集羣    {#restoring-an-etcd-cluster}

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
如果集羣中正在運行任何 API 服務器，則不應嘗試還原 etcd 的實例。相反，請按照以下步驟還原 etcd：

- 停止**所有** API 服務器實例
- 爲所有 etcd 實例恢復狀態
- 重啓所有 API 服務器實例

我們還建議重啓所有組件（例如 `kube-scheduler`、`kube-controller-manager`、`kubelet`），
以確保它們不會依賴一些過時的數據。請注意，實際中還原會花費一些時間。
在還原過程中，關鍵組件將丟失領導鎖並自行重啓。
{{< /caution >}}

<!--
etcd supports restoring from snapshots that are taken from an etcd process of
the [major.minor](https://semver.org/) version. Restoring a version from a
different patch version of etcd is also supported. A restore operation is
employed to recover the data of a failed cluster.
-->
etcd 支持從 [major.minor](https://semver.org/) 或其他不同 patch 版本的 etcd 進程中獲取的快照進行恢復。
還原操作用於恢復失敗的集羣的數據。

<!--
Before starting the restore operation, a snapshot file must be present. It can
either be a snapshot file from a previous backup operation, or from a remaining
[data directory](https://etcd.io/docs/current/op-guide/configuration/#--data-dir).
-->
在啓動還原操作之前，必須有一個快照文件。它可以是來自以前備份操作的快照文件，
也可以是來自剩餘[數據目錄](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)的快照文件。

{{< tabs name="etcd_restore" >}}
{{% tab name="使用 etcdutl" %}}
   <!--
   When restoring the cluster using [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md),
   use the `--data-dir` option to specify to which folder the cluster should be restored:
   -->
   在使用 [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md)
   恢復集羣時，使用 `--data-dir` 選項來指定集羣應被恢復到哪個文件夾。

   ```shell
   etcdutl --data-dir <data-dir-location> snapshot restore snapshot.db
   ```

   <!--
   where `<data-dir-location>` is a directory that will be created during the restore process.
   -->
   其中 `<data-dir-location>` 是將在恢復過程中創建的目錄。

{{% /tab %}}
{{% tab name="使用 etcdctl（已棄用）" %}}

   {{< note >}}
   <!--
   The usage of `etcdctl` for restoring has been **deprecated** since etcd v3.5.x and is slated for removal from etcd v3.6.
   It is recommended to utilize [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md) instead.
   -->
   自 etcd v3.5.x 起，使用 `etcdctl` 進行恢復的功能已被 **棄用**，並計劃在 etcd v3.6 中移除。
   建議改用 [`etcdutl`](https://github.com/etcd-io/etcd/blob/main/etcdutl/README.md)。

   {{< /note >}}

   <!--
   The below example depicts the usage of the `etcdctl` tool for the restore operation:
   -->
   下面的例子展示瞭如何使用 `etcdctl` 工具執行恢復操作：

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
   如果 `<data-dir-location>` 與之前的文件夾相同，請先刪除此文件夾並停止 etcd 進程，再恢復集羣。
   否則，在恢復後更改 etcd 配置並重啓 etcd 進程將使用新的數據目錄：
   首先將 `/etc/kubernetes/manifests/etcd.yaml` 中 `name: etcd-data` 對應條目的
   `volumes.hostPath.path` 改爲 `<data-dir-location>`，
   然後執行 `kubectl -n kube-system delete pod <name-of-etcd-pod>` 或 `systemctl restart kubelet.service`（或兩段命令都執行）。

{{% /tab %}}
{{< /tabs >}}

<!--
When restoring the cluster, use the `--data-dir` option to specify to which folder the cluster should be restored:
-->
在恢復集羣時，使用 `--data-dir` 選項來指定集羣應被恢復到哪個文件夾。

```shell
etcdutl --data-dir <data-dir-location> snapshot restore snapshot.db
```

<!--
where `<data-dir-location>` is a directory that will be created during the restore process.

The below example depicts the usage of the `etcdctl` tool for the restore operation:
-->
其中 `<data-dir-location>` 是將在恢復過程中創建的目錄。

下面示例展示瞭如何使用 `etcdctl` 工具執行恢復操作：

{{< note >}}
<!--
The usage of `etcdctl` for restoring has been deprecated since etcd v3.5.x and may be removed from a future etcd release.
-->
自 etcd v3.5.x 版本起，使用 `etcdctl` 進行恢復的功能已被棄用，未來的可能會在 etcd 版本中被移除。
{{< /note >}}

```shell
export ETCDCTL_API=3
etcdctl --data-dir <data-dir-location> snapshot restore snapshot.db
```

<!--
If `<data-dir-location>` is the same folder as before, delete it and stop the etcd process before restoring the cluster. Otherwise, change etcd configuration and restart the etcd process after restoration to have it use the new data directory.
-->
如果 `<data-dir-location>` 與之前的文件夾相同，請先刪除此文件夾並停止 etcd 進程，再恢復集羣。
否則，需要在恢復後更改 etcd 配置並重新啓動 etcd 進程才能使用新的數據目錄。

<!--
For more information and examples on restoring a cluster from a snapshot file, see
[etcd disaster recovery documentation](https://etcd.io/docs/current/op-guide/recovery/#restoring-a-cluster).
-->
有關從快照文件還原集羣的詳細信息和示例，請參閱
[etcd 災難恢復文檔](https://etcd.io/docs/current/op-guide/recovery/#restoring-a-cluster)。

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
如果還原的集羣的訪問 URL 與前一個集羣不同，則必須相應地重新配置 Kubernetes API 服務器。
在本例中，使用參數 `--etcd-servers=$NEW_ETCD_CLUSTER` 而不是參數 `--etcd-servers=$OLD_ETCD_CLUSTER`
重新啓動 Kubernetes API 服務器。用相應的 IP 地址替換 `$NEW_ETCD_CLUSTER` 和 `$OLD_ETCD_CLUSTER`。
如果在 etcd 集羣前面使用負載均衡，則可能需要更新負載均衡器。

<!--
If the majority of etcd members have permanently failed, the etcd cluster is
considered failed. In this scenario, Kubernetes cannot make any changes to its
current state. Although the scheduled pods might continue to run, no new pods
can be scheduled. In such cases, recover the etcd cluster and potentially
reconfigure Kubernetes API servers to fix the issue.
-->
如果大多數 etcd 成員永久失敗，則認爲 etcd 集羣失敗。在這種情況下，Kubernetes 不能對其當前狀態進行任何更改。
雖然已調度的 Pod 可能繼續運行，但新的 Pod 無法調度。在這種情況下，
恢復 etcd 集羣並可能需要重新配置 Kubernetes API 服務器以修復問題。

<!--
## Upgrading etcd clusters
-->
## 升級 etcd 集羣    {#upgrading-etcd-clusters}

{{< caution >}}
<!--
Before you start an upgrade, back up your etcd cluster first.
-->
在開始升級之前，請先備份你的 etcd 集羣。
{{< /caution >}}

<!--
For details on etcd upgrade, refer to the [etcd upgrades](https://etcd.io/docs/latest/upgrades/) documentation.
-->
有關 etcd 升級的細節，請參閱 [etcd 升級](https://etcd.io/docs/latest/upgrades/)文檔。

<!--
## Maintaining etcd clusters

For more details on etcd maintenance, please refer to the [etcd maintenance](https://etcd.io/docs/latest/op-guide/maintenance/) documentation.
-->
## 維護 etcd 集羣    {#maintaining-etcd-clusters}

有關 etcd 維護的更多詳細信息，請參閱 [etcd 維護](https://etcd.io/docs/latest/op-guide/maintenance/)文檔。

<!--
### Cluster defragmentation
-->
### 集羣碎片整理   {#cluster-defragmentation}

{{% thirdparty-content single="true" %}}

<!--
Defragmentation is an expensive operation, so it should be executed as infrequently
as possible. On the other hand, it's also necessary to make sure any etcd member
will not exceed the storage quota. The Kubernetes project recommends that when
you perform defragmentation, you use a tool such as [etcd-defrag](https://github.com/ahrtr/etcd-defrag).
-->
碎片整理是一種昂貴的操作，因此應儘可能少地執行此操作。
另一方面，也有必要確保任何 etcd 成員都不會超過存儲配額。
Kubernetes 項目建議在執行碎片整理時，
使用諸如 [etcd-defrag](https://github.com/ahrtr/etcd-defrag) 之類的工具。

<!--
You can also run the defragmentation tool as a Kubernetes CronJob, to make sure that
defragmentation happens regularly. See [`etcd-defrag-cronjob.yaml`](https://github.com/ahrtr/etcd-defrag/blob/main/doc/etcd-defrag-cronjob.yaml)
for details.
-->
你還可以將碎片整理工具作爲 Kubernetes CronJob 運行，以確保定期進行碎片整理。
有關詳細信息，請參閱
[`etcd-defrag-cronjob.yaml`](https://github.com/ahrtr/etcd-defrag/blob/main/doc/etcd-defrag-cronjob.yaml)。
