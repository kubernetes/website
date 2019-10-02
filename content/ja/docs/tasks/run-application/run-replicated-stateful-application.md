---
title: レプリカを持つステートフルアプリケーションを実行する
content_template: templates/tutorial
weight: 30
---

{{% capture overview %}}

このページでは、[StatefulSet](/ja/docs/concepts/workloads/controllers/statefulset/)
コントローラーを使用して、レプリカを持つステートフルアプリケーションを実行する方法を説明します。
ここでの例は、非同期レプリケーションを行う複数のスレーブを持つ、単一マスターのMySQLです。

**この例は本番環境向けの構成ではない**ことに注意してください。
具体的には、MySQLの設定が安全ではないデフォルトのままとなっています。
これはKubernetesでステートフルアプリケーションを実行するための一般的なパターンに焦点を当てるためです。

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* {{< include "default-storage-class-prereqs.md" >}}
* このチュートリアルは、あなたが[PersistentVolume](/docs/concepts/storage/persistent-volumes/)
  と[StatefulSet](/ja/docs/concepts/workloads/controllers/statefulset/)、
  さらには[Pod](/ja/docs/concepts/workloads/pods/pod/)、
  [Service](/docs/concepts/services-networking/service/)、
  [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)などの
  他のコアな概念に精通していることを前提としています。
* MySQLに関する知識は記事の理解に役立ちますが、
  このチュートリアルは他のシステムにも役立つ一般的なパターンを提示することを目的としています。

{{% /capture %}}

{{% capture objectives %}}

* StatefulSetコントローラーを使用して、レプリカを持つMySQLトポロジーをデプロイします。
* MySQLクライアントトラフィックを送信します。
* ダウンタイムに対する耐性を観察します。
* StatefulSetをスケールアップおよびスケールダウンします。

{{% /capture %}}

{{% capture lessoncontent %}}

## MySQLをデプロイする

このMySQLのデプロイの例は、1つのConfigMap、2つのService、および1つのStatefulSetから構成されます。

### ConfigMap

次のYAML設定ファイルからConfigMapを作成します。

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-configmap.yaml
```

{{< codenew file="application/mysql/mysql-configmap.yaml" >}}

このConfigMapは、MySQLマスターとスレーブの設定を独立して制御するために、
それぞれの`my.cnf`を上書きする内容を提供します。
この場合、マスターはスレーブにレプリケーションログを提供するようにし、
スレーブはレプリケーション以外の書き込みを拒否するようにします。

ConfigMap自体に特別なことはありませんが、ConfigMapの各部分は異なるPodに適用されます。
各Podは、StatefulSetコントローラーから提供される情報に基づいて、
初期化時にConfigMapのどの部分を見るかを決定します。

### Services

以下のYAML設定ファイルからServiceを作成します。

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-services.yaml
```

{{< codenew file="application/mysql/mysql-services.yaml" >}}

ヘッドレスサービスは、StatefulSetコントローラーが
StatefulSetの一部であるPodごとに作成するDNSエントリーのベースエントリーを提供します。
この例ではヘッドレスサービスの名前は`mysql`なので、同じKubernetesクラスタの
同じ名前空間内の他のPodは、`<pod-name>.mysql`を名前解決することでPodにアクセスできます。

`mysql-read`と呼ばれるクライアントサービスは、独自のクラスタIPを持つ通常のServiceであり、
Ready状態のすべてのMySQL Podに接続を分散します。
Serviceのエンドポイントには、MySQLマスターとすべてのスレーブが含まれる可能性があります。

読み込みクエリーのみが、負荷分散されるクライアントサービスを使用できることに注意してください。
MySQLマスターは1つしかいないため、クライアントが書き込みを実行するためには、
(ヘッドレスサービス内のDNSエントリーを介して)MySQLのマスターPodに直接接続する必要があります。

### StatefulSet

最後に、次のYAML設定ファイルからStatefulSetを作成します。

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-statefulset.yaml
```

{{< codenew file="application/mysql/mysql-statefulset.yaml" >}}

次のコマンドを実行して起動の進行状況を確認できます。

```shell
kubectl get pods -l app=mysql --watch
```

しばらくすると、3つのPodすべてがRunning状態になるはずです。

```
NAME      READY     STATUS    RESTARTS   AGE
mysql-0   2/2       Running   0          2m
mysql-1   2/2       Running   0          1m
mysql-2   2/2       Running   0          1m
```

**Ctrl+C**を押してウォッチをキャンセルします。
起動が進行しない場合は、[始める前に](#始める前に)で説明されているように、
PersistentVolumeの動的プロビジョニング機能が有効になっていることを確認してください。

このマニフェストでは、StatefulSetの一部としてステートフルなPodを管理するためにさまざまな手法を使用しています。
次のセクションでは、これらの手法のいくつかに焦点を当て、StatefulSetがPodを作成するときに何が起こるかを説明します。

## ステートフルなPodの初期化を理解する

StatefulSetコントローラーは、序数インデックスの順にPodを一度に1つずつ起動します。
各PodがReady状態を報告するまで待機してから、その次のPodの起動が開始されます。

さらに、コントローラーは各Podに `<statefulset-name>-<ordinal-index>`という形式の一意で不変の名前を割り当てます。
この例の場合、Podの名前は`mysql-0`、`mysql-1`、そして`mysql-2`となります。

上記のStatefulSetマニフェスト内のPodテンプレートは、これらのプロパティーを利用して、
MySQLレプリケーションの起動を順序正しく実行します。

### 構成を生成する

Podスペック内のコンテナを起動する前に、Podは最初に
[初期化コンテナ](/ja/docs/concepts/workloads/pods/init-containers/)を定義された順序で実行します。

最初の初期化コンテナは`init-mysql`という名前で、序数インデックスに基づいて特別なMySQL設定ファイルを生成します。

スクリプトは、`hostname`コマンドによって返されるPod名の末尾から抽出することによって、自身の序数インデックスを特定します。
それから、序数を(予約された値を避けるために数値オフセット付きで)MySQLの`conf.d`ディレクトリーの`server-id.cnf`というファイルに保存します。
これは、StatefulSetコントローラーによって提供される一意で不変のIDを、同じ特性を必要とするMySQLサーバーIDの領域に変換します。

さらに、`init-mysql`コンテナ内のスクリプトは、`master.cnf`または`slave.cnf`のいずれかを、
ConfigMapから内容を`conf.d`にコピーすることによって適用します。
このトポロジー例は単一のMySQLマスターと任意の数のスレーブで構成されているため、
スクリプトは単に序数の`0`がマスターになるように、それ以外のすべてがスレーブになるように割り当てます。
StatefulSetコントローラーによる
[デプロイ順序の保証](/ja/docs/concepts/workloads/controllers/statefulset/#デプロイとスケーリングの保証)と組み合わせると、
スレーブが作成される前にMySQLマスターがReady状態になるため、スレーブはレプリケーションを開始できます。

### 既存データをクローンする

一般に、新しいPodがセットにスレーブとして参加するときは、
MySQLマスターにはすでにデータがあるかもしれないと想定する必要があります。
また、レプリケーションログが期間の先頭まで全て揃っていない場合も想定する必要があります。
これらの控えめな仮定は、実行中のStatefulSetのサイズを初期サイズに固定するのではなく、
時間の経過とともにスケールアップまたはスケールダウンできるようにするために重要です。

2番目の初期化コンテナは`clone-mysql`という名前で、スレーブPodが空のPersistentVolumeで最初に起動したときに、
クローン操作を実行します。
つまり、実行中の別のPodから既存のデータをすべてコピーするので、
そのローカル状態はマスターからレプリケーションを開始するのに十分な一貫性があります。

MySQL自体はこれを行うためのメカニズムを提供していないため、この例ではPercona XtraBackupという人気のあるオープンソースツールを使用しています。
クローンの実行中は、ソースとなるMySQLサーバーのパフォーマンスが低下する可能性があります。
MySQLマスターへの影響を最小限に抑えるために、スクリプトは各Podに序数インデックスが自分より1低いPodからクローンするように指示します。
StatefulSetコントローラーは、`N+1`のPodを開始する前には必ず`N`のPodがReady状態であることを保証するので、この方法が機能します。

### レプリケーションを開始する

初期化コンテナが正常に完了すると、通常のコンテナが実行されます。
MySQLのPodは実際に`mysqld`サーバーを実行する`mysql`コンテナと、
[サイドカー](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns)
として機能する`xtrabackup`コンテナから成ります。

`xtrabackup`サイドカーはクローンされたデータファイルを見て、
スレーブ上でMySQLレプリケーションを初期化する必要があるかどうかを決定します。
もし必要がある場合、`mysqld`が準備できるのを待ってから、
XtraBackupクローンファイルから抽出されたレプリケーションパラメーターで`CHANGE MASTER TO`と`START SLAVE`コマンドを実行します。

スレーブがレプリケーションを開始すると、スレーブはMySQLマスターを記憶し、
サーバーが再起動した場合または接続が停止した場合に、自動的に再接続します。
また、スレーブはその不変のDNS名(`mysql-0.mysql`)でマスターを探すため、
再スケジュールされたために新しいPod IPを取得したとしても、自動的にマスターを見つけます。

最後に、レプリケーションを開始した後、`xtrabackup`コンテナはデータのクローンを要求する他のPodからの接続を待ち受けます。
StatefulSetがスケールアップした場合や、次のPodがPersistentVolumeClaimを失ってクローンをやり直す必要がある場合に備えて、
このサーバーは無期限に起動したままになります。

## クライアントトラフィックを送信する

テストクエリーをMySQLマスター(ホスト名 `mysql-0.mysql`)に送信するには、
`mysql:5.7`イメージを使って一時的なコンテナーを実行し、`mysql`クライアントバイナリーを実行します。

```shell
kubectl run mysql-client --image=mysql:5.7 -i --rm --restart=Never --\
  mysql -h mysql-0.mysql <<EOF
CREATE DATABASE test;
CREATE TABLE test.messages (message VARCHAR(250));
INSERT INTO test.messages VALUES ('hello');
EOF
```

Ready状態を報告したいずれかのサーバーにテストクエリーを送信するには、ホスト名`mysql-read`を使用します。

```shell
kubectl run mysql-client --image=mysql:5.7 -i -t --rm --restart=Never --\
  mysql -h mysql-read -e "SELECT * FROM test.messages"
```

次のような出力が得られるはずです。

```
Waiting for pod default/mysql-client to be running, status is Pending, pod ready: false
+---------+
| message |
+---------+
| hello   |
+---------+
pod "mysql-client" deleted
```

`mysql-read`サービスがサーバー間で接続を分散させることを実証するために、
ループで`SELECT @@server_id`を実行することができます。

```shell
kubectl run mysql-client-loop --image=mysql:5.7 -i -t --rm --restart=Never --\
  bash -ic "while sleep 1; do mysql -h mysql-read -e 'SELECT @@server_id,NOW()'; done"
```

接続の試行ごとに異なるエンドポイントが選択される可能性があるため、
報告される`@@server_id`はランダムに変更されるはずです。

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

ループを止めたいときは**Ctrl+C**を押すことができますが、別のウィンドウで実行したままにしておくことで、
次の手順の効果を確認できます。

## PodとNodeのダウンタイムをシミュレーションする

単一のサーバーではなくスレーブのプールから読み取りを行うことによって可用性が高まっていることを実証するため、
Podを強制的にReadyではない状態にする間、上記の`SELECT @@server_id`ループを実行したままにしてください。

### Readiness Probeを壊す

`mysql`コンテナに対する
[readiness probe](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/#define-readiness-probes)
は、`mysql -h 127.0.0.1 -e 'SELECT 1'`コマンドを実行することで、サーバーが起動していてクエリーが実行できることを確認します。

このreadiness probeを失敗させる1つの方法は、そのコマンドを壊すことです。

```shell
kubectl exec mysql-2 -c mysql -- mv /usr/bin/mysql /usr/bin/mysql.off
```

ここでは、`mysql-2` Podの実際のコンテナのファイルシステムにアクセスし、
`mysql`コマンドの名前を変更してreadiness probeがコマンドを見つけられないようにしています。
数秒後、Podはそのコンテナの1つがReadyではないと報告するはずです。以下を実行して確認できます。

```shell
kubectl get pod mysql-2
```

`READY`列の`1/2`を見てください。

```
NAME      READY     STATUS    RESTARTS   AGE
mysql-2   1/2       Running   0          3m
```

この時点で、`SELECT @@server_id`ループは実行され続け、しかしもう`102`が報告されないことが確認できるはずです。
`init-mysql`スクリプトが`server-id`を`100+$ordinal`として定義したことを思い出して下さい。
そのため、サーバーID`102`はPodの`mysql-2`に対応します。

それではPodを修復しましょう。すると数秒後にループ出力に再び現れるはずです。

```shell
kubectl exec mysql-2 -c mysql -- mv /usr/bin/mysql.off /usr/bin/mysql
```

### Podを削除する

StatefulSetは、Podが削除された場合にPodを再作成します。
これはReplicaSetがステートレスなPodに対して行うのと同様です。

```shell
kubectl delete pod mysql-2
```

StatefulSetコントローラーは`mysql-2` Podがもう存在しないことに気付き、
同じ名前で同じPersistentVolumeClaimにリンクされた新しいPodを作成します。
サーバーID`102`がしばらくの間ループ出力から消えて、また元に戻るのが確認できるはずです。

### ノードをdrainする

Kubernetesクラスタに複数のノードがある場合は、
[drain](/docs/reference/generated/kubectl/kubectl-commands/#drain)を発行して
ノードのダウンタイム(例えばノードのアップグレード時など)をシミュレートできます。

まず、あるMySQL Podがどのノード上にいるかを確認します。

```shell
kubectl get pod mysql-2 -o wide
```

ノード名が最後の列に表示されるはずです。

```
NAME      READY     STATUS    RESTARTS   AGE       IP            NODE
mysql-2   2/2       Running   0          15m       10.244.5.27   kubernetes-minion-group-9l2t
```

その後、次のコマンドを実行してノードをdrainします。
これにより、新しいPodがそのノードにスケジュールされないようにcordonされ、そして既存のPodは強制退去されます。
`<node-name>`は前のステップで確認したノードの名前に置き換えてください。

この操作はノード上の他のアプリケーションに影響を与える可能性があるため、
**テストクラスタでのみこの操作を実行**するのが最善です。

```shell
kubectl drain <node-name> --force --delete-local-data --ignore-daemonsets
```

Podが別のノードに再スケジュールされる様子を確認しましょう。

```shell
kubectl get pod mysql-2 -o wide --watch
```

次のような出力が見られるはずです。

```
NAME      READY   STATUS          RESTARTS   AGE       IP            NODE
mysql-2   2/2     Terminating     0          15m       10.244.1.56   kubernetes-minion-group-9l2t
[...]
mysql-2   0/2     Pending         0          0s        <none>        kubernetes-minion-group-fjlm
mysql-2   0/2     Init:0/2        0          0s        <none>        kubernetes-minion-group-fjlm
mysql-2   0/2     Init:1/2        0          20s       10.244.5.32   kubernetes-minion-group-fjlm
mysql-2   0/2     PodInitializing 0          21s       10.244.5.32   kubernetes-minion-group-fjlm
mysql-2   1/2     Running         0          22s       10.244.5.32   kubernetes-minion-group-fjlm
mysql-2   2/2     Running         0          30s       10.244.5.32   kubernetes-minion-group-fjlm
```

また、サーバーID`102`が`SELECT @@server_id`ループの出力からしばらくの消えて、
そして戻ることが確認できるはずです。

それでは、ノードをuncordonして正常な状態に戻しましょう。

```shell
kubectl uncordon <node-name>
```

## スレーブの数をスケーリングする

MySQLレプリケーションでは、スレーブを追加することで読み取りクエリーのキャパシティーをスケールできます。
StatefulSetを使用している場合、単一のコマンドでこれを実行できます。

```shell
kubectl scale statefulset mysql  --replicas=5
```

次のコマンドを実行して、新しいPodが起動してくるのを確認します。

```shell
kubectl get pods -l app=mysql --watch
```

新しいPodが起動すると、サーバーID`103`と`104`が`SELECT @@server_id`ループの出力に現れます。

また、これらの新しいサーバーが、これらのサーバーが存在する前に追加したデータを持っていることを確認することもできます。

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

元の状態へのスケールダウンもシームレスに可能です。

```shell
kubectl scale statefulset mysql --replicas=3
```

ただし、スケールアップすると新しいPersistentVolumeClaimが自動的に作成されますが、
スケールダウンしてもこれらのPVCは自動的には削除されないことに注意して下さい。
このため、初期化されたPVCをそのまま置いておいくことで再スケールアップを速くしたり、
PVを削除する前にデータを抽出するといった選択が可能になります。

次のコマンドを実行してこのことを確認できます。

```shell
kubectl get pvc -l app=mysql
```

StatefulSetを3にスケールダウンしたにもかかわらず、5つのPVCすべてがまだ存在しています。

```
NAME           STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
data-mysql-0   Bound     pvc-8acbf5dc-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-1   Bound     pvc-8ad39820-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-2   Bound     pvc-8ad69a6d-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-3   Bound     pvc-50043c45-b1c5-11e6-93fa-42010a800002   10Gi       RWO           2m
data-mysql-4   Bound     pvc-500a9957-b1c5-11e6-93fa-42010a800002   10Gi       RWO           2m
```

余分なPVCを再利用するつもりがないのであれば、削除することができます。

```shell
kubectl delete pvc data-mysql-3
kubectl delete pvc data-mysql-4
```

{{% /capture %}}

{{% capture cleanup %}}

1. `SELECT @@server_id`ループを実行している端末で**Ctrl+C**を押すか、
   別の端末から次のコマンドを実行して、ループをキャンセルします。

   ```shell
   kubectl delete pod mysql-client-loop --now
   ```

1. StatefulSetを削除します。これによってPodの終了も開始されます。

   ```shell
   kubectl delete statefulset mysql
   ```

1. Podが消えたことを確認します。
   Podが終了処理が完了するのには少し時間がかかるかもしれません。

   ```shell
   kubectl get pods -l app=mysql
   ```

   上記のコマンドから以下の出力が戻れば、Podが終了したことがわかります。

   ```
   No resources found.
   ```

1. ConfigMap、Services、およびPersistentVolumeClaimを削除します。

   ```shell
   kubectl delete configmap,service,pvc -l app=mysql
   ```

1. PersistentVolumeを手動でプロビジョニングした場合は、それらを手動で削除し、
   また、下層にあるリソースも解放する必要があります。
   動的プロビジョニング機能を使用した場合は、PersistentVolumeClaimを削除すれば、自動的にPersistentVolumeも削除されます。
   一部の動的プロビジョナー(EBSやPDなど)は、PersistentVolumeを削除すると同時に下層にあるリソースも解放します。

{{% /capture %}}

{{% capture whatsnext %}}

* その他のステートフルアプリケーションの例は、[Helm Charts repository](https://github.com/kubernetes/charts)を見てください。

{{% /capture %}}



