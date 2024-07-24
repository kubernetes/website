---
title: Kubernetes向けetcdクラスターの運用
content_type: task
weight: 270
---

<!-- overview -->

{{< glossary_definition term_id="etcd" length="all" prepend="etcdは">}}

## {{% heading "prerequisites" %}}

Kubernetesクラスターが必要で、kubectlコマンドラインツールがクラスターと通信できるように設定されている必要があります。
コントロールプレーンノード以外に少なくとも2つのノードを持つクラスターで、このガイドに従うことを推奨します。
まだクラスターを用意していない場合は、[minikube](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/)を使用して作成することができます。

<!-- steps -->

## 前提条件

* etcdは、奇数のメンバーを持つクラスターとして実行します。

* etcdはリーダーベースの分散システムです。リーダーが定期的に全てのフォロワーにハートビートを送信し、クラスターの安定性を維持するようにします。

* リソース不足が発生しないようにします。

  クラスターのパフォーマンスと安定性は、ネットワークとディスクのI/Oに敏感です。
  リソース不足はハートビートのタイムアウトを引き起こし、クラスターの不安定化につながる可能性があります。
  不安定なetcdは、リーダーが選出されていないことを意味します。
  そのような状況では、クラスターは現在の状態に変更を加えることができません。
  これは、新しいPodがスケジュールされないことを意味します。

* Kubernetesクラスターの安定性には、etcdクラスターの安定性が不可欠です。
  したがって、etcdクラスターは専用のマシンまたは[保証されたリソース要件](https://etcd.io/docs/current/op-guide/hardware/)を持つ隔離された環境で実行してください。

* 本番環境で実行するために推奨される最低限のetcdバージョンは、`3.4.22`以降あるいは`3.5.6`以降です。

## リソース要件

限られたリソースでetcdを運用するのはテスト目的にのみ適しています。
本番環境へのデプロイには、高度なハードウェア構成が必要です。
本番環境へetcdをデプロイする前に、[リソース要件](https://etcd.io/docs/current/op-guide/hardware/#example-hardware-configurations)を確認してください。

## etcdクラスターの起動

このセクションでは、単一ノードおよびマルチノードetcdクラスターの起動について説明します。

### 単一ノードetcdクラスター

単一ノードetcdクラスターは、テスト目的でのみ使用してください。

1. 以下を実行します:

   ```sh
   etcd --listen-client-urls=http://$PRIVATE_IP:2379 \
      --advertise-client-urls=http://$PRIVATE_IP:2379
   ```

2. Kubernetes APIサーバーをフラグ`--etcd-servers=$PRIVATE_IP:2379`で起動します。

   `PRIVATE_IP`がetcdクライアントIPに設定されていることを確認してください。

### マルチノードetcdクラスター

耐久性と高可用性のために、本番環境ではマルチノードクラスターとしてetcdを実行し、定期的にバックアップを取ります。
本番環境では5つのメンバーによるクラスターが推奨されます。
詳細は[FAQドキュメント](https://etcd.io/docs/current/faq/#what-is-failure-tolerance)を参照してください。

etcdクラスターは、静的なメンバー情報、または動的な検出によって構成されます。
クラスタリングに関する詳細は、[etcdクラスタリングドキュメント](https://etcd.io/docs/current/op-guide/clustering/)を参照してください。

例として、次のクライアントURLで実行される5つのメンバーによるetcdクラスターを考えてみます。
5つのURLは、`http://$IP1:2379`、`http://$IP2:2379`、`http://$IP3:2379`、`http://$IP4:2379`、および`http://$IP5:2379`です。Kubernetes APIサーバーを起動するには、

1. 以下を実行します:

   ```shell
   etcd --listen-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379 --advertise-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379
   ```

2. フラグ`--etcd-servers=$IP1:2379,$IP2:2379,$IP3:2379,$IP4:2379,$IP5:2379`を使ってKubernetes APIサーバーを起動します。

   `IP<n>`変数がクライアントのIPアドレスに設定されていることを確認してください。

### ロードバランサーを使用したマルチノードetcdクラスター

ロードバランシングされたetcdクラスターを実行するには、次の手順に従います。

1. etcdクラスターを設定します。
2. etcdクラスターの前にロードバランサーを設定します。
   例えば、ロードバランサーのアドレスを`$LB`とします。
3. フラグ`--etcd-servers=$LB:2379`を使ってKubernetes APIサーバーを起動します。

## etcdクラスターのセキュリティ確保

etcdへのアクセスはクラスター内でのルート権限に相当するため、理想的にはAPIサーバーのみがアクセスできるようにするべきです。
データの機密性を考慮して、etcdクラスターへのアクセス権を必要とするノードのみに付与することが推奨されます。

etcdをセキュアにするためには、ファイアウォールのルールを設定するか、etcdによって提供されるセキュリティ機能を使用します。
etcdのセキュリティ機能はx509公開鍵基盤(PKI)に依存します。
この機能を使用するには、キーと証明書のペアを生成して、セキュアな通信チャンネルを確立します。
例えば、etcdメンバー間の通信をセキュアにするために`peer.key`と`peer.cert`のキーペアを使用し、etcdとそのクライアント間の通信をセキュアにするために`client.key`と`client.cert`を使用します。
クライアント認証用のキーペアとCAファイルを生成するには、etcdプロジェクトによって提供されている[サンプルスクリプト](https://github.com/coreos/etcd/tree/master/hack/tls-setup)を参照してください。

### 通信のセキュリティ確保

セキュアなピア通信を持つetcdを構成するためには、`--peer-key-file=peer.key`および`--peer-cert-file=peer.cert`フラグを指定し、URLスキーマとしてHTTPSを使用します。

同様に、セキュアなクライアント通信を持つetcdを構成するためには、`--key-file=k8sclient.key`および`--cert-file=k8sclient.cert`フラグを指定し、URLスキーマとしてHTTPSを使用します。
セキュアな通信を使用するクライアントコマンドの例は以下の通りです:

```
ETCDCTL_API=3 etcdctl --endpoints 10.2.0.9:2379 \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  member list
```

### etcdクラスターへのアクセス制限

セキュアな通信を構成した後、TLS認証を使用して、etcdクラスターへのアクセスをKubernetes APIサーバーのみに制限します。

例えば、CA `etcd.ca`によって信頼されるキーペア`k8sclient.key`と`k8sclient.cert`を考えてみます。
`--client-cert-auth`とTLSを使用してetcdが構成されている場合、etcdは`--trusted-ca-file`フラグで渡されたCAまたはシステムのCAを使用してクライアントからの証明書を検証します。
`--client-cert-auth=true`および`--trusted-ca-file=etcd.ca`フラグを指定することで、証明書`k8sclient.cert`を持つクライアントのみにアクセスを制限します。

etcdが正しく構成されると、有効な証明書を持つクライアントのみがアクセスできます。
Kubernetes APIサーバーにアクセス権を与えるためには、`--etcd-certfile=k8sclient.cert`、`--etcd-keyfile=k8sclient.key`および`--etcd-cafile=ca.cert`フラグで構成します。

{{< note >}}
etcd認証は、Kubernetesでは現在サポートされていません。
{{< /note >}}

## 障害が発生したetcdメンバーの交換

etcdクラスターは、一部のメンバーの障害を許容することで高可用性を実現します。
しかし、クラスターの全体的な状態を改善するためには、障害が発生したメンバーを直ちに交換することが重要です。
複数のメンバーに障害が発生した場合は、1つずつ交換します。
障害が発生したメンバーを交換するには、メンバーを削除し、新しいメンバーを追加するという2つのステップがあります。

etcdは内部でユニークなメンバーIDを保持していますが、人的なミスを避けるためにも各メンバーにはユニークな名前を使用することが推奨されます。
例えば、3つのメンバーのetcdクラスターを考えてみましょう。
URLが`member1=http://10.0.0.1`、`member2=http://10.0.0.2`、そして`member3=http://10.0.0.3`だとします。
`member1`に障害が発生した場合、`member4=http://10.0.0.4`で交換します。

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

1. 以下のいずれかを行います:

   1. 各Kubernetes APIサーバーが全てのetcdメンバーと通信するように構成されている場合、`--etcd-servers`フラグから障害が発生したメンバーを削除し、各Kubernetes APIサーバーを再起動します。
   1. 各Kubernetes APIサーバーが単一のetcdメンバーと通信している場合、障害が発生したetcdと通信しているKubernetes APIサーバーを停止します。

1. 壊れたノード上のetcdサーバーを停止します。
   Kubernetes APIサーバー以外のクライアントからetcdにトラフィックが流れている可能性があり、データディレクトリへの書き込みを防ぐためにすべてのトラフィックを停止することが望ましいです。

1. メンバーを削除します:

   ```shell
   etcdctl member remove 8211f1d0f64f3269
   ```

   次のメッセージが表示されます:

   ```console
   Removed member 8211f1d0f64f3269 from cluster
   ```

1. 新しいメンバーを追加します:

   ```shell
   etcdctl member add member4 --peer-urls=http://10.0.0.4:2380
   ```

   次のメッセージが表示されます:

   ```console
   Member 2be1eb8f84b7f63e added to cluster ef37ad9dc622a7c4
   ```

1. IP `10.0.0.4`のマシン上で新たに追加されたメンバーを起動します:

   ```shell
   export ETCD_NAME="member4"
   export ETCD_INITIAL_CLUSTER="member2=http://10.0.0.2:2380,member3=http://10.0.0.3:2380,member4=http://10.0.0.4:2380"
   export ETCD_INITIAL_CLUSTER_STATE=existing
   etcd [flags]
   ```

1. 以下のいずれかを行います:

   1. 各Kubernetes APIサーバーが全てのetcdメンバーと通信するように構成されている場合、`--etcd-servers`フラグに新たに追加されたメンバーを加え、各Kubernetes APIサーバーを再起動します。
   1. 各Kubernetes APIサーバーが単一のetcdメンバーと通信している場合、ステップ2で停止したKubernetes APIサーバーを起動します。
    その後、Kubernetes APIサーバークライアントを再度構成して、停止されたKubernetes APIサーバーへのリクエストをルーティングします。
    これは多くの場合、ロードバランサーを構成することで行われます。

クラスターの再構成に関する詳細については、[etcd再構成ドキュメント](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)を参照してください。

## etcdクラスターのバックアップ

すべてのKubernetesオブジェクトはetcdに保存されています。
定期的にetcdクラスターのデータをバックアップすることは、すべてのコントロールプレーンノードを失うなどの災害シナリオでKubernetesクラスターを復旧するために重要です。
スナップショットファイルには、すべてのKubernetesの状態と重要な情報が含まれています。
機密性の高いKubernetesデータを安全に保つために、スナップショットファイルを暗号化してください。

etcdクラスターのバックアップは、etcdのビルトインスナップショットとボリュームスナップショットの2つの方法で実現できます。

### ビルトインスナップショット

etcdはビルトインスナップショットをサポートしています。
スナップショットは、`etcdctl snapshot save`コマンドを使用してライブメンバーから、あるいはetcdプロセスによって現在使用されていない[データディレクトリ](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)から`member/snap/db`ファイルをコピーして作成できます。
スナップショットを作成しても、メンバーのパフォーマンスに影響はありません。

以下は、`$ENDPOINT`によって提供されるキースペースのスナップショットを`snapshot.db`ファイルに作成する例です:

```shell
ETCDCTL_API=3 etcdctl --endpoints $ENDPOINT snapshot save snapshot.db
```

スナップショットを確認します:

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

### ボリュームスナップショット

etcdがAmazon Elastic Block Storeのようなバックアップをサポートするストレージボリューム上で実行されている場合、ストレージボリュームのスナップショットを作成することによってetcdデータをバックアップします。

### etcdctlオプションを使用したスナップショット

etcdctlによって提供されるさまざまなオプションを使用してスナップショットを作成することもできます。例えば

```shell
ETCDCTL_API=3 etcdctl -h
```

はetcdctlから利用可能なさまざまなオプションを一覧表示します。
例えば、以下のようにエンドポイント、証明書、キーを指定してスナップショットを作成することができます:

```shell
ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=<trusted-ca-file> --cert=<cert-file> --key=<key-file> \
  snapshot save <backup-file-location>
```

ここで、`trusted-ca-file`、`cert-file`、`key-file`はetcd Podの説明から取得できます。

## etcdクラスターのスケールアウト

etcdクラスターのスケールアウトは、パフォーマンスとのトレードオフで可用性を高めます。
スケーリングはクラスターのパフォーマンスや能力を高めるものではありません。
一般的なルールとして、etcdクラスターをスケールアウトまたはスケールインすることはありません。
etcdクラスターに自動スケーリンググループを設定しないでください。
公式にサポートされるどんなスケールの本番環境のKubernetesクラスターにおいても、常に静的な5つのメンバーのetcdクラスターを運用することを強く推奨します。

合理的なスケーリングは、より高い信頼性が求められる場合に、3つのメンバーで構成されるクラスターを5つのメンバーにアップグレードすることです。
既存のクラスターにメンバーを追加する方法については、[etcdの再構成ドキュメント](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)を参照してください。

## etcdクラスターの復元

etcdは、[major.minor](http://semver.org/)バージョンのetcdプロセスから取得されたスナップショットからの復元をサポートしています。
異なるパッチバージョンのetcdからのバージョン復元もサポートされています。
復元操作は、障害が発生したクラスターのデータを回復するために用いられます。

復元操作を開始する前に、スナップショットファイルが存在している必要があります。
これは、以前のバックアップ操作からのスナップショットファイルでも、残っている[データディレクトリ](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)からのスナップショットファイルでも構いません。

クラスターを復元する場合は、`--data-dir`オプションを使用して、クラスターをどのフォルダーに復元するかを指定します:
```shell
ETCDCTL_API=3 etcdctl --data-dir <data-dir-location> snapshot restore snapshot.db
```

ここで、`<data-dir-location>`は復元プロセス中に作成されるディレクトリです。

もう一つの例としては、まず`ETCDCTL_API`環境変数をエクスポートします:

```shell
export ETCDCTL_API=3
etcdctl --data-dir <data-dir-location> snapshot restore snapshot.db
```
`<data-dir-location>`が以前と同じフォルダーである場合は、クラスターを復元する前にそれを削除してetcdプロセスを停止します。そうでない場合は、etcdの構成を変更し、復元後にetcdプロセスを再起動して新しいデータディレクトリを使用するようにします。

スナップショットファイルからクラスターを復元する方法と例についての詳細は、[etcd災害復旧ドキュメント](https://etcd.io/docs/current/op-guide/recovery/#restoring-a-cluster)を参照してください。

復元されたクラスターのアクセスURLが前のクラスターと異なる場合、Kubernetes APIサーバーをそれに応じて再設定する必要があります。
この場合、`--etcd-servers=$OLD_ETCD_CLUSTER`のフラグの代わりに、`--etcd-servers=$NEW_ETCD_CLUSTER`のフラグでKubernetes APIサーバーを再起動します。
`$NEW_ETCD_CLUSTER`と`$OLD_ETCD_CLUSTER`をそれぞれのIPアドレスに置き換えてください。
etcdクラスターの前にロードバランサーを使用している場合、代わりにロードバランサーを更新する必要があるかもしれません。

etcdメンバーの過半数に永続的な障害が発生した場合、etcdクラスターは故障したと見なされます。
このシナリオでは、Kubernetesは現在の状態に対して変更を加えることができません。
スケジュールされたPodは引き続き実行されるかもしれませんが、新しいPodはスケジュールできません。
このような場合、etcdクラスターを復旧し、必要に応じてKubernetes APIサーバーを再設定して問題を修正します。

{{< note >}}
クラスター内でAPIサーバーが実行されている場合、etcdのインスタンスを復元しようとしないでください。
代わりに、以下の手順に従ってetcdを復元してください:

- **すべての**APIサーバーインスタンスを停止
- すべてのetcdインスタンスで状態を復元
- すべてのAPIサーバーインスタンスを再起動

また、`kube-scheduler`、`kube-controller-manager`、`kubelet`などのコンポーネントを再起動することもお勧めします。
これは、これらが古いデータに依存していないことを確認するためです。実際には、復元には少し時間がかかります。
復元中、重要なコンポーネントはリーダーロックを失い、自動的に再起動します。
{{< /note >}}

## etcdクラスターのアップグレード

etcdのアップグレードに関する詳細は、[etcdアップグレード](https://etcd.io/docs/latest/upgrades/)のドキュメントを参照してください。

{{< note >}}
アップグレードを開始する前に、まずetcdクラスターをバックアップしてください。
{{< /note >}}

## etcdクラスターのメンテナンス

etcdのメンテナンスに関する詳細は、[etcdメンテナンス](https://etcd.io/docs/latest/op-guide/maintenance/)のドキュメントを参照してください。

{{% thirdparty-content single="true" %}}

{{< note >}}
デフラグメンテーションはコストがかかる操作のため、できるだけ頻繁に実行しないようにしてください。
一方で、etcdメンバーがストレージのクォータを超えないようにする必要もあります。
Kubernetesプロジェクトでは、デフラグメンテーションを行う際には、[etcd-defrag](https://github.com/ahrtr/etcd-defrag)などのツールを使用することを推奨しています。

また、デフラグメンテーションを定期的に実行するために、KubernetesのCronJobとしてデフラグメンテーションツールを実行することもできます。
詳細は[`etcd-defrag-cronjob.yaml`](https://github.com/ahrtr/etcd-defrag/blob/main/doc/etcd-defrag-cronjob.yaml)を参照してください。
{{< /note >}}
