---
title: Operating etcd clusters for Kubernetes
content_type: task
weight: 270
---

<!-- overview -->

{{< glossary_definition term_id="etcd" length="all" prepend="etcd is a ">}}

## {{% heading "prerequisites" %}}

You need to have a Kubernetes cluster, and the kubectl command-line tool must
be configured to communicate with your cluster. It is recommended to run this
task on a cluster with at least two nodes that are not acting as control plane
nodes . If you do not already have a cluster, you can create one by using
[minikube](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/).

<!-- steps -->

## 前提条件

* etcdは、奇数のメンバーを持つクラスタとして実行します。

* etcdはリーダーベースの分散システムです。
* リーダーが定期的に全てのフォロワーにハートビートを送信し、クラスタの安定性を維持することが重要です。

* リソース不足が発生しないようにします。

  クラスタのパフォーマンスと安定性は、ネットワークとディスクのI/Oに敏感です。
  リソース不足はハートビートのタイムアウトを引き起こし、クラスタの不安定化につながる可能性があります。
  不安定なetcdは、リーダーが選出されていないことを意味します。
  そのような状況下では、クラスタは現在の状態に変更を加えることができません。
  これは、新しいポッドがスケジュールされないことを意味します。

* Kubernetesクラスタの安定性には、etcdクラスタの安定性が不可欠です。
  したがって、etcdクラスタは専用のマシンまたは[保証されたリソース要件](https://etcd.io/docs/current/op-guide/hardware/)を持つ隔離された環境で実行してください。

* 本番環境で実行するために推奨される最低限のetcdバージョンは `3.4.22` 以降あるいは `3.5.6` 以降です。

## リソース要件

限られたリソースでetcdを運用するのは、テスト目的にのみ適しています。
本番環境でのデプロイには、高度なハードウェア構成が必要です。
本番環境でetcdをデプロイする前に、
[リソース要件](https://etcd.io/docs/current/op-guide/hardware/#example-hardware-configurations)を確認してください。

## etcdクラスタの起動

このセクションでは、単一ノードおよびマルチノードetcdクラスタの起動について説明します。

### 単一ノードetcdクラスタ

単一ノードetcdクラスタは、テスト目的でのみ使用してください。

1. 以下を実行します:

   ```sh
   etcd --listen-client-urls=http://$PRIVATE_IP:2379 \
      --advertise-client-urls=http://$PRIVATE_IP:2379
   ```

2. Kubernetes APIサーバーをフラグ `--etcd-servers=$PRIVATE_IP:2379` で起動します。

   `PRIVATE_IP`があなたのetcdクライアントIPに設定されていることを確認してください。

### マルチノードetcdクラスタ

耐久性と高可用性のために、本番環境ではマルチノードクラスタとしてetcdを実行し、定期的にバックアップを取ります。
本番環境では5つのメンバーによるクラスタが推奨されます。
詳細は[FAQドキュメント](https://etcd.io/docs/current/faq/#what-is-failure-tolerance)を参照してください。

etcdクラスタは、あらかじめ定義されたメンバーの情報、または自動的な検出や構成を通じて設定されます。
クラスタリングに関する詳細は、[etcdクラスタリングドキュメント](https://etcd.io/docs/current/op-guide/clustering/)を参照してください。

例として、次のクライアントURLで実行される5つのメンバーによるetcdクラスタを考えてみます。
5つのURLは、`http://$IP1:2379`、`http://$IP2:2379`、`http://$IP3:2379`、`http://$IP4:2379`、および`http://$IP5:2379`です。Kubernetes APIサーバーを起動するには、

1. 以下を実行します:

   ```shell
   etcd --listen-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379 --advertise-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379
   ```

2. フラグ `--etcd-servers=$IP1:2379,$IP2:2379,$IP3:2379,$IP4:2379,$IP5:2379` を使ってKubernetes APIサーバーを起動します。

   `IP<n>`変数がクライアントのIPアドレスに設定されていることを確認してください。

### ロードバランサーを使用したマルチノードetcdクラスタ

ロードバランシングされたetcdクラスタを実行するには、次の手順に従います。

1. etcdクラスタを設定します。
2. etcdクラスタの前にロードバランサーを設定します。例えば、ロードバランサーのアドレスを `$LB` とします。
3. フラグ `--etcd-servers=$LB:2379` を使ってKubernetes APIサーバーを起動します。

## etcdクラスタのセキュリティ強化

etcdへのアクセスはクラスタ内でのルート権限に相当するため、理想的にはAPIサーバーのみがアクセスできるようにするべきです。
データの機密性を考慮して、etcdクラスタへのアクセス権を必要とするノードのみに付与することが推奨されます。

etcdをセキュアにするためには、ファイアウォールのルールを設定するか、etcdによって提供されるセキュリティ機能を使用します。
etcdのセキュリティ機能はx509公開鍵基盤（PKI）に依存します。
開始するためには、キーと証明書のペアを生成して、セキュアな通信チャンネルを確立します。
例えば、etcdメンバー間の通信をセキュアにするために`peer.key`と`peer.cert`のキーペアを使用し、
etcdとそのクライアント間の通信をセキュアにするために`client.key`と`client.cert`を使用します。
クライアント認証用のキーペアとCAファイルを生成するための[サンプルスクリプト](https://github.com/coreos/etcd/tree/master/hack/tls-setup)はetcdプロジェクトによって提供されています。

### 通信のセキュリティ強化

セキュアなピア通信を持つetcdを構成するためには、`--peer-key-file=peer.key`および`--peer-cert-file=peer.cert`フラグを指定し、URLスキーマとしてHTTPSを使用します。

同様に、セキュアなクライアント通信を持つetcdを構成するためには、`--key-file=k8sclient.key`および`--cert-file=k8sclient.cert`フラグを指定し、URLスキーマとしてHTTPSを使用します。セキュアな通信を使用するクライアントコマンドの例は以下の通りです:

```
ETCDCTL_API=3 etcdctl --endpoints 10.2.0.9:2379 \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  member list
```

### etcdクラスタへのアクセス制限

セキュアな通信を構成した後、etcdクラスタへのアクセスをKubernetes APIサーバーのみに制限します。
これを行うためにはTLS認証を使用します。

例えば、CA`etcd.ca`によって信頼されるキーペア`k8sclient.key`と`k8sclient.cert`を考えてみます。
`--client-cert-auth`とTLSを使用してetcdが構成されている場合、etcdは`--trusted-ca-file`フラグで渡されたCAまたはシステムのCAを使用してクライアントからの証明書を検証します。
`--client-cert-auth=true`および`--trusted-ca-file=etcd.ca`フラグを指定することで、証明書`k8sclient.cert`を持つクライアントのみにアクセスを制限します。

etcdが正しく構成されると、有効な証明書を持つクライアントのみがアクセスできます。
Kubernetes APIサーバーにアクセス権を与えるためには、`--etcd-certfile=k8sclient.cert`、`--etcd-keyfile=k8sclient.key`および`--etcd-cafile=ca.cert`フラグで構成します。

{{< note >}}
Kubernetesによるetcd認証は現在サポートされていません。
詳細については関連するIssue
[Support Basic Auth for Etcd v2](https://github.com/kubernetes/kubernetes/issues/23398)を参照してください。
{{< /note >}}

## 障害が発生したetcdメンバーの交換

etcdクラスタは、一部のメンバーの障害を許容することで高可用性を実現します。
しかし、クラスタの全体的な状態を改善するためには、障害が発生したメンバーを直ちに交換することが重要です。
複数のメンバーに障害が発生した場合は、一つずつ交換します。
障害が発生したメンバーを交換するには、メンバーを削除し、新しいメンバーを追加するという二つのステップがあります。

etcdは内部でユニークなメンバーIDを保持していますが、人的なミスを避けるためにも各メンバーにはユニークな名前を使用することが推奨されます。例えば、3つのメンバーのetcdクラスタを考えてみましょう。URLが `member1=http://10.0.0.1`、`member2=http://10.0.0.2`、そして `member3=http://10.0.0.3` だとします。`member1` に障害が発生した場合、`member4=http://10.0.0.4` で交換します。

1. 障害が発生した`member1`のメンバーIDを取得します:

   ```shell
   etcdctl --endpoints=http://10.0.0.2,http://10.0.0.3 member list
   ```

   次のメッセージが表示されます:

   ```console
   8211f1d0f64f3269, started, member1, http://10.0.0.1:2380, http://10.0.0.1:2379
   91bc3c398fb3c146, started, member2, http://10.0.0.2:2380, http://10.0.0.2:2379
   fd422379fda50e48, started, member3, http://10.0.0.3:2380, http://10.0.0.3:2379
   ```

2. 以下のいずれかを行います:

   1. 各Kubernetes APIサーバーが全てのetcdメンバーと通信するように構成されている場合、
    `--etcd-servers` フラグから障害が発生したメンバーを削除し、各Kubernetes APIサーバーを再起動します。
   2. 各Kubernetes APIサーバーが単一のetcdメンバーと通信している場合、
    障害が発生したetcdと通信しているKubernetes APIサーバーを停止します。

3. 壊れたノード上のetcdサーバーを停止します。
   Kubernetes APIサーバー以外のクライアントからetcdにトラフィックが流れている可能性があり、
   データディレクトリへの書き込みを防ぐためにすべてのトラフィックを停止することが望ましいです。

4. メンバーを削除します:

   ```shell
   etcdctl member remove 8211f1d0f64f3269
   ```

   次のメッセージが表示されます:

   ```console
   Removed member 8211f1d0f64f3269 from cluster
   ```

5. 新しいメンバーを追加します:

   ```shell
   etcdctl member add member4 --peer-urls=http://10.0.0.4:2380
   ```

   次のメッセージが表示されます:

   ```console
   Member 2be1eb8f84b7f63e added to cluster ef37ad9dc622a7c4
   ```

6. IP`10.0.0.4` のマシン上で新たに追加されたメンバーを起動します:

   ```shell
   export ETCD_NAME="member4"
   export ETCD_INITIAL_CLUSTER="member2=http://10.0.0.2:2380,member3=http://10.0.0.3:2380,member4=http://10.0.0.4:2380"
   export ETCD_INITIAL_CLUSTER_STATE=existing
   etcd [flags]
   ```

7. 以下のいずれかを行います:

   1. 各Kubernetes APIサーバーが全てのetcdメンバーと通信するように構成されている場合、
    `--etcd-servers` フラグに新たに追加されたメンバーを加え、各Kubernetes APIサーバーを再起動します。
   2. 各Kubernetes APIサーバーが単一のetcdメンバーと通信している場合、
    ステップ2で停止したKubernetes APIサーバーを起動します。
    その後、Kubernetes APIサーバークライアントを再度構成して、停止されたKubernetes APIサーバーへのリクエストをルーティングします。
    これはロードバランサーを構成することで、多くの場合行われます。

クラスタの再構成に関する詳細については、[etcd再構成ドキュメント](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)を参照してください。

## Backing up an etcd cluster

All Kubernetes objects are stored on etcd. Periodically backing up the etcd
cluster data is important to recover Kubernetes clusters under disaster
scenarios, such as losing all control plane nodes. The snapshot file contains
all the Kubernetes states and critical information. In order to keep the
sensitive Kubernetes data safe, encrypt the snapshot files.

Backing up an etcd cluster can be accomplished in two ways: etcd built-in
snapshot and volume snapshot.

### Built-in snapshot

etcd supports built-in snapshot. A snapshot may either be taken from a live
member with the `etcdctl snapshot save` command or by copying the
`member/snap/db` file from an etcd
[data directory](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)
that is not currently used by an etcd process. Taking the snapshot will
not affect the performance of the member.

Below is an example for taking a snapshot of the keyspace served by
`$ENDPOINT` to the file `snapshot.db`:

```shell
ETCDCTL_API=3 etcdctl --endpoints $ENDPOINT snapshot save snapshot.db
```

Verify the snapshot:

```shell
ETCDCTL_API=3 etcdctl --write-out=table snapshot status snapshot.db
```

```console
+----------+----------+------------+------------+
|   HASH   | REVISION | TOTAL KEYS | TOTAL SIZE |
+----------+----------+------------+------------+
| fe01cf57 |       10 |          7 | 2.1 MB     |
+----------+----------+------------+------------+
```

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

## Scaling out etcd clusters

Scaling out etcd clusters increases availability by trading off performance.
Scaling does not increase cluster performance nor capability. A general rule
is not to scale out or in etcd clusters. Do not configure any auto scaling
groups for etcd clusters. It is highly recommended to always run a static
five-member etcd cluster for production Kubernetes clusters at any officially
supported scale.

A reasonable scaling is to upgrade a three-member cluster to a five-member
one, when more reliability is desired. See
[etcd reconfiguration documentation](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)
for information on how to add members into an existing cluster.

## Restoring an etcd cluster

etcd supports restoring from snapshots that are taken from an etcd process of
the [major.minor](http://semver.org/) version. Restoring a version from a
different patch version of etcd also is supported. A restore operation is
employed to recover the data of a failed cluster.

Before starting the restore operation, a snapshot file must be present. It can
either be a snapshot file from a previous backup operation, or from a remaining
[data directory](https://etcd.io/docs/current/op-guide/configuration/#--data-dir).

Here is an example:

```shell
ETCDCTL_API=3 etcdctl --endpoints 10.2.0.9:2379 snapshot restore snapshot.db
```

Another example for restoring using `etcdctl` options:

```shell
ETCDCTL_API=3 etcdctl --data-dir <data-dir-location> snapshot restore snapshot.db
```
where `<data-dir-location>` is a directory that will be created during the restore process.

Yet another example would be to first export the `ETCDCTL_API` environment variable:

```shell
export ETCDCTL_API=3
etcdctl --data-dir <data-dir-location> snapshot restore snapshot.db
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

## Upgrading etcd clusters


For more details on etcd upgrade, please refer to the [etcd upgrades](https://etcd.io/docs/latest/upgrades/) documentation.

{{< note >}}
Before you start an upgrade, please back up your etcd cluster first.
{{< /note >}}

## Maintaining etcd clusters

For more details on etcd maintenance, please refer to the [etcd maintenance](https://etcd.io/docs/latest/op-guide/maintenance/) documentation.

{{% thirdparty-content single="true" %}}

{{< note >}}
Defragmentation is an expensive operation, so it should be executed as infrequent
as possible. On the other hand, it's also necessary to make sure any etcd member
will not run out of the storage quota. The Kubernetes project recommends that when
you perform defragmentation, you use a tool such as [etcd-defrag](https://github.com/ahrtr/etcd-defrag).

You can also run the defragmentation tool as a Kubernetes CronJob, to make sure that
defragmentation happens regularly. See [`etcd-defrag-cronjob.yaml`](https://github.com/ahrtr/etcd-defrag/blob/main/doc/etcd-defrag-cronjob.yaml)
for details.
{{< /note >}}
