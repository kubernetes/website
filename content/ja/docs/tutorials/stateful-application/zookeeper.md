---
title: 分散システムコーディネーターZooKeeperの実行
content_type: tutorial
weight: 40
---

<!-- overview -->
このチュートリアルでは、[StatefulSet](/ja/docs/concepts/workloads/controllers/statefulset/)、[PodDisruptionBudgets](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budget)、[Podアンチアフィニティ](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)を使って、Kubernetes上での[Apache Zookeeper](https://zookeeper.apache.org)の実行をデモンストレーションします。

## {{% heading "prerequisites" %}}

このチュートリアルを始める前に、以下のKubernetesの概念について理解しておく必要があります。

- [Pod](/ja/docs/concepts/workloads/pods/)
- [クラスターDNS](/ja/docs/concepts/services-networking/dns-pod-service/)
- [Headless Service](/ja/docs/concepts/services-networking/service/#headless-service)
- [PersistentVolume](/ja/docs/concepts/storage/volumes/)
- [PersistentVolume Provisioning](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/)
- [StatefulSet](/ja/docs/concepts/workloads/controllers/statefulset/)
- [PodDisruptionBudgets](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budget)
- [Podアンチアフィニティ](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
- [kubectl CLI](/docs/reference/kubectl/kubectl/)

少なくとも4つのノードのクラスターが必要で、各ノードは少なくとも2つのCPUと4GiBのメモリが必須です。このチュートリアルでは、クラスターのノードをcordonおよびdrainします。
**つまり、クラスターがそのノードの全てのPodを終了して退去させ、ノードが一時的にスケジュールできなくなる、ということです。**
このチュートリアル専用のクラスターを使うか、起こした破壊がほかのテナントに干渉しない確証を得ることをお勧めします。

このチュートリアルでは、クラスターがPersistentVolumeの動的なプロビジョニングが行われるように設定されていることを前提としています。
クラスターがそのように設定されていない場合、チュートリアルを始める前に20GiBのボリュームを3つ、手動でプロビジョニングする必要があります。

## {{% heading "objectives" %}}

このチュートリアルを終えると、以下の知識を得られます。

- StatefulSetを使ってZooKeeperアンサンブルをデプロイする方法。
- アンサンブルを一貫して設定する方法。
- ZooKeeperサーバーのデプロイをアンサンブルに広げる方法。
- 計画されたメンテナンス中もサービスが利用可能であることを保証するためにPodDisruptionBudgetsを使う方法。

<!-- lessoncontent -->

### ZooKeeper

[Apache ZooKeeper](https://zookeeper.apache.org/doc/current/)は、分散アプリケーションのための、分散型オープンソースコーディネーションサービスです。
ZooKeeperでは、データの読み書き、および更新の監視ができます。
データは階層化されてファイルシステム内に編成され、アンサンブル(ZooKeeperサーバーのセット)内の全てのZooKeeperサーバーに複製されます。
データへの全ての操作はアトミックかつ逐次的に一貫性を持ちます。
ZooKeeperは、アンサンブル内の全てのサーバー間でステートマシンを複製するために[Zab](https://pdfs.semanticscholar.org/b02c/6b00bd5dbdbd951fddb00b906c82fa80f0b3.pdf)合意プロトコルを使ってこれを保証します。

アンサンブルはリーダーを選出するのにZabプロトコルを使い、選出が完了するまでデータを書き出しません。
完了すると、アンサンブルは複製するのにZabを使い、書き込みが承認されてクライアントに可視化されるより前に、全ての書き込みをクォーラムに複製することを保証します。
重み付けされたクォーラムでなければ、クォーラムは現在のリーダーを含むアンサンブルの過半数を占めるコンポーネントです。
例えばアンサンブルが3つのサーバーを持つ時、リーダーとそれ以外のもう1つのサーバーを含むコンポーネントが、クォーラムを構成します。
アンサンブルがクォーラムに達しない場合、アンサンブルはデータを書き出せません。

ZooKeeperサーバー群はそれらの全てのステートマシンをメモリに保持し、それぞれの変化をストレージメディア上の永続的なWAL(Write Ahead Log)に書き出します。
サーバーがクラッシュした時には、WALをリプレーすることで以前のステートに回復できます。
WALを際限のない増加から防ぐために、ZooKeeperサーバーは、メモリステートにあるものをストレージメディアに定期的にスナップショットします。
これらのスナップショットはメモリに直接読み込むことができ、スナップショットより前の全てのWALエントリは破棄され得ます。

## ZooKeeperアンサンブルの作成

以下のマニフェストは[Headless Service](/ja/docs/concepts/services-networking/service/#headless-services)、[Service](/ja/docs/concepts/services-networking/service/)、[PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets)、[StatefulSet](/ja/docs/concepts/workloads/controllers/statefulset/)を含んでいます。

{{% codenew file="application/zookeeper/zookeeper.yaml" %}}

ターミナルを開き、マニフェストを作成するために
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply)コマンドを使います。

```shell
kubectl apply -f https://k8s.io/examples/application/zookeeper/zookeeper.yaml
```

これは`zk-hs` Headless Service、`zk-cs` Service、`zk-pdb` PodDisruptionBudget、 `zk` StatefulSetを作成します。

```
service/zk-hs created
service/zk-cs created
poddisruptionbudget.policy/zk-pdb created
statefulset.apps/zk created
```

StatefulSetのPodを作成するStatefulSetコントローラーを監視するため、[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get)を使います。

```shell
kubectl get pods -w -l app=zk
```

`zk-2` PodがRunningおよびReadyになったら、`CTRL-C`でkubectlを終了してください。

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

StatefulSetコントローラーが3つのPodを作成し、各Podは[ZooKeeper](https://archive.apache.org/dist/zookeeper/stable/)サーバー付きのコンテナを持ちます。

### リーダーの選出のファシリテート {#facilitating-leader-election}

匿名のネットワークにおいてリーダー選出を終了するアルゴリズムがないので、Zabはリーダー選出のための明示的なメンバーシップ設定を要します。
アンサンブルの各サーバーはユニーク識別子を持つ必要があり、全てのサーバーは識別子のグローバルセットを知っている必要があり、各識別子はネットワークアドレスと関連付けられている必要があります。

`zk` StatefulSetのPodのホスト名を取得するために[`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec)を使います。

```shell
for i in 0 1 2; do kubectl exec zk-$i -- hostname; done
```

StatefulSetコントローラーは各Podに、その順序インデックスに基づくユニークなホスト名を提供します。
ホスト名は`<statefulset名>-<順序インデックス>`という形をとります。
`zk` StatefulSetの`replicas`フィールドが`3`にセットされているので、このセットのコントローラーは、ホスト名にそれぞれ`zk-0`、`zk-1`、`zk-2`が付いた3つのPodを作成します。

```
zk-0
zk-1
zk-2
```

ZooKeeperアンサンブルのサーバーは、ユニーク識別子として自然数を使い、それぞれのサーバーの識別子をサーバーのデータディレクトリ内の`myid`というファイルに格納します。

各サーバーの`myid`ファイルの内容を調べるには、以下のコマンドを使います。

```shell
for i in 0 1 2; do echo "myid zk-$i";kubectl exec zk-$i -- cat /var/lib/zookeeper/data/myid; done
```

識別子が自然数で順序インデックスは正の整数なので、順序に1を加算することで識別子を生成できます。

```
myid zk-0
1
myid zk-1
2
myid zk-2
3
```

`zk` StatefulSet内の各Podの完全修飾ドメイン名(FQDN)を取得するには、以下のコマンドを使います。

```shell
for i in 0 1 2; do kubectl exec zk-$i -- hostname -f; done
```

`zk-hs` Serviceは、全Podのためのドメイン`zk-hs.default.svc.cluster.local`を作成します。

```
zk-0.zk-hs.default.svc.cluster.local
zk-1.zk-hs.default.svc.cluster.local
zk-2.zk-hs.default.svc.cluster.local
```

[Kubernetes DNS](/ja/docs/concepts/services-networking/dns-pod-service/)のAレコードは、FQDNをPodのIPアドレスに解決します。
KubernetesがPodを再スケジュールした場合、AレコードはPodの新しいIPアドレスに更新されますが、Aレコードの名前は変更されません。

ZooKeeperはそのアプリケーション設定を`zoo.cfg`という名前のファイルに格納します。
`zk-0` Pod内の`zoo.cfg`ファイルの内容を見るには、`kubectl exec`を使います。

```shell
kubectl exec zk-0 -- cat /opt/zookeeper/conf/zoo.cfg
```

ファイル末尾にある`server.1`、`server.2`、`server.3`のプロパティの、`1`、`2`、`3`はZooKeeperサーバーの`myid`ファイル内の識別子に対応します。
これらは`zk` StatefulSet内のPodのFQDNにセットされます。

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

### 合意形成 {#achieving-consensus}

合意(consensus)プロトコルは、各参加者の識別子がユニークであることを要件としています。
Zabプロトコル内で同じユニーク識別子を主張する2つの参加者はないものとします。
これは、システム内のプロセスが、どのプロセスがどのデータをコミットしたかを同意できるようにするために必須です。
2つのPodが同じ順序値で起動されたなら、2つのZooKeeperサーバーはどちらもそれら自身を同じサーバーとして認識してしまうでしょう。

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

各PodのAレコードは、PodがReadyになった時に記入されます。そのため、ZooKeeperサーバー群のFQDNはある1つのエンドポイント、すなわち`myid`ファイルで設定された識別子を主張するユニークなZooKeeperサーバーに解決されます。

```
zk-0.zk-hs.default.svc.cluster.local
zk-1.zk-hs.default.svc.cluster.local
zk-2.zk-hs.default.svc.cluster.local
```

これは、ZooKeeperの`zoo.cfg`ファイル内の`servers`プロパティが正しく設定されたアンサンブルを表していることを保証します。

```
server.1=zk-0.zk-hs.default.svc.cluster.local:2888:3888
server.2=zk-1.zk-hs.default.svc.cluster.local:2888:3888
server.3=zk-2.zk-hs.default.svc.cluster.local:2888:3888
```

サーバーが値のコミットを試みるためにZabプロトコルを使う時、(リーダー選出が成功していて、少なくともPodのうちの2つがRunningおよびReadyならば)それぞれのサーバーは双方の合意をとって値をコミット、あるいは、(もし双方の状態が合わなければ)それを行うことに失敗します。
あるサーバーが別のサーバーを代行して書き込みを承認する状態は発生しません。

### アンサンブルの健全性テスト {#sanity-testing-the-ensemble}

最も基本的な健全性テストは、データを1つのZooKeeperサーバーに書き込み、そのデータを別のサーバーで読み取ることです。

以下のコマンドは、`world`をアンサンブル内の`zk-0` Podのパス`/hello`に書き込むのに、`zkCli.sh`スクリプトを実行します。

```shell
kubectl exec zk-0 -- zkCli.sh create /hello world
```

```
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
Created /hello
```

`zk-1` Podからデータを取得するには、以下のコマンドを使います。

```shell
kubectl exec zk-1 -- zkCli.sh get /hello
```

`zk-0`に作成したデータは、アンサンブル内の全てのサーバーで利用できます。

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

### 永続的なストレージの提供

[ZooKeeperの概要](#zookeeper)のセクションで言及したように、
ZooKeeperは全てのエントリを永続的なWALにコミットし、定期的にメモリ状態のスナップショットをストレージメディアに書き出します。
永続性を提供するためにWALを使用するのは、複製されたステートマシンを立てるために合意プロトコルを使うアプリケーションでよくあるテクニックです。

`zk` StatefulSetを削除するために、[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete)コマンドを使います。

```shell
kubectl delete statefulset zk
```

```
statefulset.apps "zk" deleted
```

StatefulSet内のPodの終了を観察します。

```shell
kubectl get pods -w -l app=zk
```

`zk-0`が完全に終了したら、`CTRL-C`でkubectlを終了します。

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

`zookeeper.yaml`のマニフェストを再適用します。

```shell
kubectl apply -f https://k8s.io/examples/application/zookeeper/zookeeper.yaml
```

これは`zk` StatefulSetオブジェクトを作成しますが、マニフェストのその他のAPIオブジェクトはすでに存在しているので変更されません。

StatefulSetコントローラーがStatefulSetのPodを再作成するのを見てみます。

```shell
kubectl get pods -w -l app=zk
```

`zk-2` PodがRunningおよびReadyになったら、`CTRL-C`でkubectlを終了します。

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

[健全性テスト](#sanity-testing-the-ensemble)で入力した値を`zk-2` Podから取得するには、以下のコマンドを使います。

```shell
kubectl exec zk-2 zkCli.sh get /hello
```

`zk` StatefulSet内の全てのPodを終了して再作成したにもかかわらず、アンサンブルは元の値をなおも供給します。

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

`zk` StatefulSetの`spec`の`volumeClaimTemplates`フィールドは、各PodにプロビジョニングされるPersistentVolumeを指定します。

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

`StatefulSet`コントローラーは、`StatefulSet`内の各Podのために`PersistentVolumeClaim`を生成します。

`StatefulSet`の`PersistentVolumeClaims`を取得するために、以下のコマンドを使います。

```shell
kubectl get pvc -l app=zk
```

`StatefulSet`がそのPodを再作成した時、`StatefulSet`はPodのPersistentVolumeを再マウントします。

```
NAME           STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
datadir-zk-0   Bound     pvc-bed742cd-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
datadir-zk-1   Bound     pvc-bedd27d2-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
datadir-zk-2   Bound     pvc-bee0817e-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
```

`StatefulSet`のコンテナ`template`の`volumeMounts`セクションは、ZooKeeperサーバーのデータディレクトリにあるPersistentVolumeをマウントします。

```yaml
volumeMounts:
- name: datadir
  mountPath: /var/lib/zookeeper
```

`zk` `StatefulSet`内のPodが(再)スケジュールされると、ZooKeeperサーバーのデータディレクトリにマウントされた同じ`PersistentVolume`を常に得ます。
Podが再スケジュールされたとしても、全ての書き込みはZooKeeperサーバーのWALおよび全スナップショットに行われ、永続性は残ります。

## 一貫性のある設定の保証

[リーダーの選出のファシリテート](#facilitating-leader-election)および[合意形成](#achieving-consensus)のセクションで記したように、ZooKeeperのアンサンブル内のサーバー群は、リーダーを選出しクォーラムを形成するための一貫性のある設定を必要とします。
また、プロトコルがネットワーク越しで正しく動作するために、Zabプロトコルの一貫性のある設定も必要です。
この例では、設定を直接マニフェストに埋め込むことで一貫性のある設定を達成します。

`zk` StatefulSetを取得しましょう。

```shell
kubectl get sts zk -o yaml
```

```
…
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
…
```

このcommandでは、ZooKeeperサーバーを開始するためにコマンドラインパラメータで設定を渡しています。
設定をアンサンブルへ渡すのには環境変数を使うこともできます。

### ログの設定

`zkGenConfig.sh`スクリプトで生成されたファイルの1つは、ZooKeeperのログを制御します。
ZooKeeperは[Log4j](https://logging.apache.org/log4j/2.x/)を使い、デフォルトではログの設定に基づいて、ログ設定に時間およびサイズベースでのローリングファイルアペンダー(ログのローテーション)を使用します。

`zk` `StatefulSet`内のPodの1つからログ設定を取得するには、以下のコマンドを使います。

```shell
kubectl exec zk-0 cat /usr/etc/zookeeper/log4j.properties
```

以下のログ設定は、ZooKeeperにログの全てを標準出力ファイルストリームに書き出す処理をさせます。

```
zookeeper.root.logger=CONSOLE
zookeeper.console.threshold=INFO
log4j.rootLogger=${zookeeper.root.logger}
log4j.appender.CONSOLE=org.apache.log4j.ConsoleAppender
log4j.appender.CONSOLE.Threshold=${zookeeper.console.threshold}
log4j.appender.CONSOLE.layout=org.apache.log4j.PatternLayout
log4j.appender.CONSOLE.layout.ConversionPattern=%d{ISO8601} [myid:%X{myid}] - %-5p [%t:%C{1}@%L] - %m%n
```

これはログコンテナ内のログを安全にとるための、最もシンプルと思われる方法です。
アプリケーションはログを標準出力に書き出し、Kubernetesがログのローテーションを処理してくれます。
Kubernetesは、標準出力と標準エラー出力に書き出されるアプリケーションのログがローカルストレージメディアを使い尽くさないことを保証する、健全維持ポリシーも実装しています。

Podの1つから末尾20行を取得するために、[`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands/#logs)を使ってみます。

```shell
kubectl logs zk-0 --tail 20
```

`kubectl logs`を利用するか、Kubernetes Dashboardから、標準出力または標準エラーに書き出されたアプリケーションログを参照できます。

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

Kubernetesは多くのログソリューションを統合しています。
クラスターおよびアプリケーションに最も適合するログソリューションを選べます。
クラスターレベルのロギングとアグリゲーションとして、ログをローテートおよび輸送するための[サイドカーコンテナ](/ja/docs/concepts/cluster-administration/logging#sidecar-container-with-logging-agent)をデプロイすることを検討してください。

### 非特権ユーザーの設定

コンテナ内で特権ユーザーとしての実行をアプリケーションに許可するベストプラクティスは、議論の的です。
アプリケーションが非特権ユーザーとして動作することを組織で必須としているなら、エントリポイントがそのユーザーとして実行できるユーザーを制御する[セキュリティコンテキスト](/ja/docs/tasks/configure-pod-container/security-context/)を利用できます。

`zk` `StatefulSet`のPod `template`は、`SecurityContext`を含んでいます。

```yaml
securityContext:
  runAsUser: 1000
  fsGroup: 1000
```

Podのコンテナ内で、UID 1000はzookeeperユーザーに、GID 1000はzookeeperグループにそれぞれ相当します。

`zk-0` PodからのZooKeeperプロセス情報を取得してみましょう。

```shell
kubectl exec zk-0 -- ps -elf
```

`securityContext`オブジェクトの`runAsUser`フィールドが1000にセットされているとおり、ZooKeeperプロセスは、rootとして実行される代わりにzookeeperユーザーとして実行されています。

```
F S UID        PID  PPID  C PRI  NI ADDR SZ WCHAN  STIME TTY          TIME CMD
4 S zookeep+     1     0  0  80   0 -  1127 -      20:46 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
0 S zookeep+    27     1  0  80   0 - 1155556 -    20:46 ?        00:00:19 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```

デフォルトでは、PodのPersistentVolumeがZooKeeperサーバーのデータディレクトリにマウントされている時、rootユーザーのみがそこにアクセス可能です。
この設定はZooKeeperのプロセスがそのWALに書き込んだりスナップショットに格納したりするのを妨げることになります。

`zk-0` PodのZooKeeperデータディレクトリのファイルパーミッションを取得するには、以下のコマンドを使います。

```shell
kubectl exec -ti zk-0 -- ls -ld /var/lib/zookeeper/data
```

`securityContext`オブジェクトの`fsGroup`フィールドが1000にセットされているので、PodのPersistentVolumeの所有権はzookeeperグループにセットされ、ZooKeeperのプロセスがそのデータを読み書きできるようになります。

```
drwxr-sr-x 3 zookeeper zookeeper 4096 Dec  5 20:45 /var/lib/zookeeper/data
```

## ZooKeeperプロセスの管理

[ZooKeeperドキュメント](https://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_supervision)では、「You will want to have a supervisory process that manages each of your ZooKeeper server processes (JVM).(各ZooKeeperサーバープロセス(JVM)を管理する監督プロセスを持ちたくなります)」と述べています。
分散型システム内で失敗したプロセスを再起動するのにwatchdog(監督プロセス)を使うのは、典型的パターンです。
アプリケーションをKubernetesにデプロイする時には、監督プロセスのような外部ユーティリティを使うよりもむしろ、アプリケーションのwatchdogとしてKubernetesを使うべきです。

### アンサンブルのアップデート

`zk` `StatefulSet`は`RollingUpdate`アップデート戦略を使うように設定されています。
サーバーに割り当てられる`cpus`の数を更新するのに、`kubectl patch`を利用できます。


```shell
kubectl patch sts zk --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/resources/requests/cpu", "value":"0.3"}]'
```

```
statefulset.apps/zk patched
```

更新の状況を見るには、`kubectl rollout status`を使います。

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

これはPod群を終了し、逆の順番で1つずつそれらを新しい設定で再作成します。
これはクォーラムがローリングアップデート中に維持されることを保証します。

履歴や過去の設定を見るには、`kubectl rollout history`コマンドを使います。

```shell
kubectl rollout history sts/zk
```

出力は次のようになります:

```
statefulsets "zk"
REVISION
1
2
```

変更をロールバックするには、`kubectl rollout undo`コマンドを使います。

```shell
kubectl rollout undo sts/zk
```

出力は次のようになります:

```
statefulset.apps/zk rolled back
```

### プロセスの失敗の取り扱い

[再起動ポリシー](/ja/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)は、Pod内のコンテナのエントリポイントへのプロセスの失敗をKubernetesがどのように取り扱うかを制御します。
`StatefulSet`内のPodにおいて唯一妥当な`RestartPolicy`はAlwaysで、これはデフォルト値です。
ステートフルなアプリケーションでは、このデフォルトポリシーの上書きは**絶対にすべきではありません**。

`zk-0` Pod内で実行されているZooKeeperサーバーのプロセスツリーを調査するには、以下のコマンドを使います。

```shell
kubectl exec zk-0 -- ps -ef
```

コンテナのエントリポイントとして使われるコマンドはPID 1、エントリポイントの子であるZooKeeperプロセスはPID 27となっています。

```
UID        PID  PPID  C STIME TTY          TIME CMD
zookeep+     1     0  0 15:03 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
zookeep+    27     1  0 15:03 ?        00:00:03 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```

別のターミナルで、以下のコマンドを使って`zk` `StatefulSet`内のPodを見てみます。

```shell
kubectl get pod -w -l app=zk
```


別のターミナルで、以下のコマンドを使ってPod `zk-0`内のZooKeeperプロセスを終了します。

```shell
kubectl exec zk-0 -- pkill java
```

ZooKeeperプロセスの終了は、その親プロセスの終了を引き起こします。
コンテナの`RestartPolicy`はAlwaysなので、親プロセスが再起動(restart)されます。

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

アプリケーションが、そのビジネスロジックを実装するプロセスを立ち上げるのにスクリプト(`zkServer.sh`など)を使っている場合、スクリプトは子プロセスとともに終了する必要があります。
これは、Kubernetesがアプリケーションのコンテナを、そのビジネスロジックを実装しているプロセスが失敗した時に再起動することを保証します。

### 生存性(liveness)テスト

失敗したプロセスを再起動するための設定をアプリケーションに施すのは、分散型システムの健全さを保つのに十分ではありません。
システムのプロセスが生きていることもあれば無反応なこともあり、あるいはそうでなく不健全という状況もあります。
アプリケーションのプロセスが不健全で再起動すべきであることをKubernetesに通知するには、liveness probeを使うのがよいでしょう。

`zk` `StatefulSet`のPod `template`でliveness probeを指定します。

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

プローブはサーバーの健全さをテストするのに、ZooKeeperの`ruok` 4文字コマンドを使うbashスクリプトを呼び出します。

```
OK=$(echo ruok | nc 127.0.0.1 $1)
if [ "$OK" == "imok" ]; then
    exit 0
else
    exit 1
fi
```

ターミナルウィンドウで、`zk` StatefulSet内のPodを見るのに以下のコマンドを使います。

```shell
kubectl get pod -w -l app=zk
```

別のウィンドウで、Pod `zk-0`のファイルシステムから`zookeeper-ready`スクリプトを削除するために以下のコマンドを使います。

```shell
kubectl exec zk-0 -- rm /opt/zookeeper/bin/zookeeper-ready
```

ZooKeeperプロセスの失敗のためにliveness probeを使う時、アンサンブル内の不健全なプロセスが再起動されることを保証するために、Kubernetesは自動的にプロセスを再起動します。

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

### 準備性(readiness)テスト

準備性は生存性と同じではありません。
プロセスが生きているのであれば、スケジュールされ健全です。
プロセスの準備ができたら、入力を処理できます。
生存性はなくてはならないものですが、準備性の状態には十分ではありません。
プロセスは生きてはいるが準備はできていない時、特に初期化および終了の間がそのケースに相当します。

readiness probeを指定するとKubernetesは、準備性チェックに合格するまで、アプリケーションのプロセスがネットワークトラフィックを受け取らないことを保証します。

ZooKeeperサーバーにとって、健全性は準備性を意味します。
そのため、`zookeeper.yaml`マニフェストからのreadiness probeは、liveness probeと同一です。

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

liveness probeとreadiness probeが同一だとしても、両方を指定することが重要です。
これは、ZooKeeperアンサンブル内の健全なサーバーだけがネットワークトラフィックを受け取ることを保証します。

## ノードの失敗の許容

ZooKeeperはデータの変更を正しくコミットするのにサーバーのクォーラムを必要とします。
3つのサーバーのアンサンブルにおいては、書き込みの成功のために2つのサーバーは健全でなければなりません。
クォーラムベースのシステムにおいて、可用性を保証するために、メンバーは障害ドメインにデプロイされます。
個々のマシンの損失による障害を避けるためのベストプラクティスは、同じマシン上でアプリケーションの複数のインスタンスがコロケート(同じ場所に配置)されないようにすることです。

デフォルトでKubernetesは、同じノードの`StatefulSet`にPodをコロケートします。
3つのサーバーアンサンブルを作成していたとして、2つのサーバーが同じノードにあり、そのノードが障害を起こした場合、ZooKeeperサービスのクライアントは、少なくともPodの1つが再スケジュールされるまで障害に見舞われることになります。

クリティカルシステムのプロセスがノードの失敗イベントで再スケジュールできるよう、追加のキャパシティを常にプロビジョンしておくべきです。
そうしておけば、障害は単にKubernetesのスケジューラーがZooKeeperのサーバーの1つを再スケジュールするまでの辛抱です。
ただし、ダウンタイムなしでノードの障害への耐性をサービスに持たせたいなら、`podAntiAffinity`をセットすべきです。

`zk` `StatefulSet`内のPodのノードを取得するには、以下のコマンドを使います。

```shell
for i in 0 1 2; do kubectl get pod zk-$i --template {{.spec.nodeName}}; echo ""; done
```

`zk` `StatefulSet`内の全てのPodは、別々のノードにデプロイされます。

```
kubernetes-node-cxpk
kubernetes-node-a5aq
kubernetes-node-2g2d
```

これは`zk` `StatefulSet`内のPodに`PodAntiAffinity`の指定があるからです。

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

`requiredDuringSchedulingIgnoredDuringExecution`フィールドは、`topologyKey`で定義されたドメイン内で`app`ラベルの値が`zk`の2つのPodが絶対にコロケートすべきでないことを、Kubernetes Schedulerに指示します。
`topologyKey`の`kubernetes.io/hostname`は、ドメインが固有ノードであることを示しています。
異なるルール、ラベル、セレクターを使って、物理・ネットワーク・電源といった障害ドメイン全体に広がるアンサンブルにこのテクニックを広げることができます。

## メンテナンス時の存続

このセクションでは、ノードをcordon(スケジュール不可化)およびdorain(解放)します。もし共有クラスターでこのチュートリアルを試しているのであれば、これがほかのテナントに有害な影響を及ぼさないことを確認してください。

前のセクションでは、計画外のノード障害に備えてどのようにPodをノード全体に広げるかを示しましたが、計画されたメンテナンスのため引き起こされる一時的なノード障害に対して計画する必要もあります。

クラスター内のノードを取得するために、以下のコマンドを使います。

```shell
kubectl get nodes
```

このチュートリアルでは、4つのノードのあるクラスターを仮定しています。
クラスターが4つよりも多くある場合には、4つのノード以外全てをcordonするために[`kubectl cordon`](/docs/reference/generated/kubectl/kubectl-commands/#cordon)を使ってください。
ノードを4つに制約することで、以下のメンテナンスシミュレーションにおいてzookeeper Podをスケジュールした時に、KubernetesがアフィニティとPodDisruptionBudget制約に遭遇することを保証します。

```shell
kubectl cordon <ノード名>
```

`zk-pdb`の`PodDisruptionBudget`を取得するために、以下のコマンドを使います。

```shell
kubectl get pdb zk-pdb
```

`max-unavailable`フィールドは、`zk` `StatefulSet`の最大で1つのPodがいつでも利用できなくなる可能性があるということを、Kubernetesに指示します。

```
NAME      MIN-AVAILABLE   MAX-UNAVAILABLE   ALLOWED-DISRUPTIONS   AGE
zk-pdb    N/A             1                 1
```

1つ目のターミナルで、`zk` `StatefulSet`内のPodを見るのに以下のコマンドを使います。

```shell
kubectl get pods -w -l app=zk
```

次に別のターミナルで、Podが現在スケジュールされているノードを取得するために、以下のコマンドを使います。

```shell
for i in 0 1 2; do kubectl get pod zk-$i --template {{.spec.nodeName}}; echo ""; done
```

出力は次のようになります:

```
kubernetes-node-pb41
kubernetes-node-ixsl
kubernetes-node-i4c4
```

`zk-0` Podがスケジュールされているノードをcordonおよびdrainするには、[`kubectl drain`](/docs/reference/generated/kubectl/kubectl-commands/#drain)を使います。


```shell
kubectl drain $(kubectl get pod zk-0 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

出力は次のようになります:

```
node "kubernetes-node-pb41" cordoned

WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-pb41, kube-proxy-kubernetes-node-pb41; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-o5elz
pod "zk-0" deleted
node "kubernetes-node-pb41" drained
```

クラスターに4つのノードがあるので、`kubectl drain`は成功し、`zk-0`が別のノードに再スケジュールされます。

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

最初のターミナルで`StatefulSet`のPodを見守り、`zk-1`がスケジュールされたノードをdrainします。

```shell
kubectl drain $(kubectl get pod zk-1 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

出力は次のようになります:

```
"kubernetes-node-ixsl" cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-ixsl, kube-proxy-kubernetes-node-ixsl; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-voc74
pod "zk-1" deleted
node "kubernetes-node-ixsl" drained
```

`zk` `StatefulSet`がPodのコロケーションを抑止する`PodAntiAffinity`ルールを含んでいるので、`zk-1` Podはスケジュールされず、またスケジュール可能なのは2つのノードだけなので、PodはPendingの状態のままになっています。

```shell
kubectl get pods -w -l app=zk
```

出力は次のようになります:

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
zk-1      1/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
```

StatefulSetのPodを見続け、`zk-2`がスケジュールされているノードをdrainします。

```shell
kubectl drain $(kubectl get pod zk-2 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

出力は次のようになります:

```
node "kubernetes-node-i4c4" cordoned

WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog
WARNING: Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog; Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4
There are pending pods when an error occurred: Cannot evict pod as it would violate the pod's disruption budget.
pod/zk-2
```

kubectlを終了するために`CTRL-C`を押します。

`zk-2`を退去させると`zk-budget`違反になってしまうので、3つ目のノードはdrainできません。ただし、ノードはcordonされたままとなります。

健全性テスト中に入力した値を`zk-0`から取得するには、`zkCli.sh`を使います。

```shell
kubectl exec zk-0 zkCli.sh get /hello
```

`PodDisruptionBudget`が遵守されているので、サービスはまだ利用可能です。

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

最初のノードをuncordon(スケジュール可能化)するには、[`kubectl uncordon`](/docs/reference/generated/kubectl/kubectl-commands/#uncordon)を使います。

```shell
kubectl uncordon kubernetes-node-pb41
```

出力は次のようになります:

```
node "kubernetes-node-pb41" uncordoned
```

`zk-1`はこのノードで再スケジュールされます。`zk-1`がRunningおよびReadyになるまで待ちます。

```shell
kubectl get pods -w -l app=zk
```

出力は次のようになります:

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

試しに`zk-2`がスケジュールされているノードをdrainしてみます。

```shell
kubectl drain $(kubectl get pod zk-2 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

出力は次のようになります:

```
node "kubernetes-node-i4c4" already cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog
pod "heapster-v1.2.0-2604621511-wht1r" deleted
pod "zk-2" deleted
node "kubernetes-node-i4c4" drained
```

今度は`kubectl drain`は成功しました。

`zk-2`の再スケジュールができるように、2つ目のノードをuncordonします。

```shell
kubectl uncordon kubernetes-node-ixsl
```

出力は次のようになります:

```
node "kubernetes-node-ixsl" uncordoned
```

サービスがメンテナンス中も利用可能なままであることを保証するために、`PodDisruptionBudgets`とあわせて`kubectl drain`を利用できます。
メンテナンスでノードがオフラインになる前にノードをcordonして、Podを退去させるのにdrainが使われている場合、Disruption Budget(停止状態の予算)を表すサービスは遵守すべきバジェットを持ちます。
クリティカルサービスでは、Podをすぐに再スケジュールできるよう、追加のキャパティを常に割り当てておくべきです。

## {{% heading "cleanup" %}}

- クラスターの全てのノードをuncordonするために、`kubectl uncordon`を実行してください。
- このチュートリアルで使ったPersistentVolumeの永続的なストレージメディアを削除する必要があります。
  全てのストレージが回収されたことを確実とするために、お使いの環境、ストレージ設定、プロビジョニング方法に基いて必要な手順に従ってください。
