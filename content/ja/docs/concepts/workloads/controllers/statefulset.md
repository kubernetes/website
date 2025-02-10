---
reviewers:
title: StatefulSet
content_type: concept
weight: 30
---

<!-- overview -->

StatefulSetはステートフルなアプリケーションを管理するためのワークロードAPIです。

{{< glossary_definition term_id="statefulset" length="all" >}}


<!-- body -->

## StatefulSetの使用

StatefulSetは下記の1つ以上の項目を要求するアプリケーションにおいて最適です。

* 安定した一意のネットワーク識別子
* 安定した永続ストレージ
* 規則的で安全なデプロイとスケーリング
* 規則的で自動化されたローリングアップデート

上記において安定とは、Podのスケジュール(または再スケジュール)をまたいでも永続的であることと同義です。
もしアプリケーションが安定したネットワーク識別子と規則的なデプロイや削除、スケーリングを全く要求しない場合、ユーザーはステートレスなレプリカのセットを提供するワークロードを使ってアプリケーションをデプロイするべきです。
[Deployment](/ja/docs/concepts/workloads/controllers/deployment/)や[ReplicaSet](/ja/docs/concepts/workloads/controllers/replicaset/)のようなコントローラーはこのようなステートレスな要求に対して最適です。

## 制限事項

* 提供されたPodのストレージは、要求された`storage class`にもとづいて[PersistentVolume Provisioner](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/README.md)によってプロビジョンされるか、管理者によって事前にプロビジョンされなくてはなりません。
* StatefulSetの削除もしくはスケールダウンをすることにより、StatefulSetに関連したボリュームは削除*されません* 。 これはデータ安全性のためで、関連するStatefulSetのリソース全てを自動的に削除するよりもたいてい有効です。
* StatefulSetは現在、Podのネットワークアイデンティティーに責務をもつために[Headless Service](/ja/docs/concepts/services-networking/service/#headless-service)を要求します。ユーザーはこのServiceを作成する責任があります。
* StatefulSetは、StatefulSetが削除されたときにPodの停止を行うことを保証していません。StatefulSetにおいて、規則的で安全なPodの停止を行う場合、削除のために事前にそのStatefulSetの数を0にスケールダウンさせることが可能です。
* デフォルト設定の[Pod管理ポリシー](#pod-management-policies) (`OrderedReady`)によって[ローリングアップデート](#rolling-updates)を行う場合、[修復のための手動介入](#forced-rollback)を要求するようなブロークンな状態に遷移させることが可能です。

## コンポーネント

下記の例は、StatefulSetのコンポーネントのデモンストレーションとなります。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx # .spec.template.metadata.labelsの値と一致する必要があります
  serviceName: "nginx"
  replicas: 3 # by default is 1
  template:
    metadata:
      labels:
        app: nginx # .spec.selector.matchLabelsの値と一致する必要があります
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: registry.k8s.io/nginx-slim:0.8
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "my-storage-class"
      resources:
        requests:
          storage: 1Gi
```

上記の例では、

* nginxという名前のHeadlessServiceは、ネットワークドメインをコントロールするために使われます。
* webという名前のStatefulSetは、specで3つのnginxコンテナのレプリカを持ち、そのコンテナはそれぞれ別のPodで稼働するように設定されています。
* volumeClaimTemplatesは、PersistentVolumeプロビジョナーによってプロビジョンされた[PersistentVolume](/ja/docs/concepts/storage/persistent-volumes/)を使って安定したストレージを提供します。

StatefulSetの名前は有効な[名前](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)である必要があります。

## Podセレクター
ユーザーは、StatefulSetの`.spec.template.metadata.labels`のラベルと一致させるため、StatefulSetの`.spec.selector`フィールドをセットしなくてはなりません。Kubernetes1.8以前では、`.spec.selector`フィールドは省略された場合デフォルト値になります。Kubernetes1.8とそれ以降のバージョンでは、ラベルに一致するPodセレクターの指定がない場合はStatefulSetの作成時にバリデーションエラーになります。

## Podアイデンティティー
StatefulSetのPodは、順番を示す番号、安定したネットワークアイデンティティー、安定したストレージからなる一意なアイデンティティーを持ちます。
そのアイデンティティーはどのNode上にスケジュール(もしくは再スケジュール)されるかに関わらず、そのPodに紐付きます。

### 順序インデックス

N個のレプリカをもったStatefulSetにおいて、StatefulSet内の各Podは、0からはじまりN-1までの整数値を順番に割り当てられ、そのStatefulSetにおいては一意となります。

### 安定したネットワークID

StatefulSet内の各Podは、そのStatefulSet名とPodの順序番号から派生してホストネームが割り当てられます。
作成されたホストネームの形式は`$(StatefulSet名)-$(順序番号)`となります。先ほどの上記の例では、`web-0,web-1,web-2`という3つのPodが作成されます。
StatefulSetは、Podのドメインをコントロールするために[Headless Service](/ja/docs/concepts/services-networking/service/#headless-service)を使うことができます。
このHeadless Serviceによって管理されたドメインは`$(Service名).$(ネームスペース).svc.cluster.local`形式となり、"cluster.local"というのはそのクラスターのドメインとなります。
各Podが作成されると、Podは`$(Pod名).$(管理するServiceドメイン名)`に一致するDNSサブドメインを取得し、管理するServiceはStatefulSetの`serviceName`で定義されます。

クラスターでのDNSの設定方法によっては、新たに起動されたPodのDNS名をすぐに検索できない場合があります。
この動作は、クラスター内の他のクライアントが、Podが作成される前にそのPodのホスト名に対するクエリーをすでに送信していた場合に発生する可能性があります。
(DNSでは通常)ネガティブキャッシュは、Podの起動後でも、少なくとも数秒間、以前に失敗したルックアップの結果が記憶され、再利用されることを意味します。

Podが作成された後、速やかにPodを検出する必要がある場合は、いくつかのオプションがあります。

- DNSルックアップに依存するのではなく、Kubernetes APIに直接(例えばwatchを使って)問い合わせる。
- Kubernetes DNS プロバイダーのキャッシュ時間を短縮する(これは現在30秒キャッシュされるようになっているCoreDNSのConfigMapを編集することを意味しています。)。

[制限事項](#制限事項)セクションで言及したように、ユーザーはPodのネットワークアイデンティティーのために[Headless Service](/ja/docs/concepts/services-networking/service/#headless-service)を作成する責任があります。

ここで、クラスタードメイン、Service名、StatefulSet名の選択と、それらがStatefulSetのPodのDNS名にどう影響するかの例をあげます。

Cluster Domain | Service (ns/name) | StatefulSet (ns/name)  | StatefulSet Domain  | Pod DNS | Pod Hostname |
-------------- | ----------------- | ----------------- | -------------- | ------- | ------------ |
 cluster.local | default/nginx     | default/web       | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local | foo/nginx         | foo/web           | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local    | foo/nginx         | foo/web           | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

{{< note >}}
クラスタードメインは[その他の設定](/ja/docs/concepts/services-networking/dns-pod-service/)がされない限り、`cluster.local`にセットされます。
{{< /note >}}

### 安定したストレージ

StatefulSetで定義された各VolumeClaimTemplateに対して、各Podは1つのPersistentVolumeClaimを受け取ります。上記のnginxの例において、各Podは`my-storage-class`というStorageClassをもち、1GiBのストレージ容量を持った単一のPersistentVolumeを受け取ります。もしStorageClassが指定されていない場合、デフォルトのStorageClassが使用されます。PodがNode上にスケジュール(もしくは再スケジュール)されたとき、その`volumeMounts`はPersistentVolume Claimに関連したPersistentVolumeをマウントします。
注意点として、PodのPersistentVolume Claimと関連したPersistentVolumeは、PodやStatefulSetが削除されたときに削除されません。
削除する場合は手動で行わなければなりません。

### Podのネームラベル

StatefulSet {{< glossary_tooltip text="コントローラー" term_id="controller" >}} がPodを作成したとき、Podの名前として、`statefulset.kubernetes.io/pod-name`にラベルを追加します。このラベルによってユーザーはServiceにStatefulSet内の指定したPodを割り当てることができます。

## デプロイとスケーリングの保証

* N個のレプリカをもつStatefulSetにおいて、Podがデプロイされるとき、それらのPodは{0..N-1}の番号で順番に作成されます。
* Podが削除されるとき、それらのPodは{N-1..0}の番号で降順に削除されます。
* Podに対してスケーリングオプションが適用される前に、そのPodの前の順番の全てのPodがRunningかつReady状態になっていなくてはなりません。
* Podが停止される前に、そのPodの番号より大きい番号を持つの全てのPodは完全にシャットダウンされていなくてはなりません。

StatefulSetは`pod.Spec.TerminationGracePeriodSeconds`を0に指定すべきではありません。これは不安全で、やらないことを強く推奨します。さらなる説明としては、[StatefulSetのPodの強制削除](/ja/docs/tasks/run-application/force-delete-stateful-set-pod/)を参照してください。

上記の例のnginxが作成されたとき、3つのPodは`web-0`、`web-1`、`web-2`の順番でデプロイされます。`web-1`は`web-0`が[RunningかつReady状態](/ja/docs/concepts/workloads/pods/pod-lifecycle/)になるまでは決してデプロイされないのと、同様に`web-2`は`web-1`がRunningかつReady状態にならないとデプロイされません。もし`web-0`が`web-1`がRunningかつReady状態になった後だが、`web-2`が起動する前に失敗した場合、`web-2`は`web-0`の再起動が成功し、RunningかつReady状態にならないと再起動されません。

もしユーザーが`replicas=1`といったようにStatefulSetにパッチをあてることにより、デプロイされたものをスケールすることになった場合、`web-2`は最初に停止されます。`web-1`は`web-2`が完全にシャットダウンされ削除されるまでは、停止されません。もし`web-0`が、`web-2`が完全に停止され削除された後だが、`web-1`の停止の前に失敗した場合、`web-1`は`web-0`がRunningかつReady状態になるまでは停止されません。

### Podの管理ポリシー
Kubernetes1.7とそれ以降のバージョンでは、StatefulSetは`.spec.podManagementPolicy`フィールドを介して、Podの一意性とアイデンティティーを保証します。

#### OrderedReadyなPod管理

`OrderedReady`なPod管理はStatefulSetにおいてデフォルトです。これは[デプロイとスケーリングの保証](#deployment-and-scaling-guarantees)に記載されている項目の振る舞いを実装します。

#### 並行なPod管理

`Parallel`なPod管理は、StatefulSetコントローラーに対して、他のPodが起動や停止される前にそのPodが完全に起動し準備完了になるか停止するのを待つことなく、Podが並行に起動もしくは停止するように指示します。

## アップデートストラテジー

Kubernetes1.7とそれ以降のバージョンにおいて、StatefulSetの`.spec.updateStrategy`フィールドで、コンテナの自動のローリングアップデートの設定やラベル、リソースのリクエストとリミットや、StatefulSet内のPodのアノテーションを指定できます。

### OnDelete

`OnDelete`というアップデートストラテジーは、レガシーな(Kubernetes1.6以前)振る舞いとなります。StatefulSetの`.spec.updateStrategy.type`が`OnDelete`にセットされていたとき、そのStatefulSetコントローラーはStatefulSet内でPodを自動的に更新しません。StatefulSetの`.spec.template`項目の修正を反映した新しいPodの作成をコントローラーに支持するためには、ユーザーは手動でPodを削除しなければなりません。

### RollingUpdate

`RollingUpdate`というアップデートストラテジーは、StatefulSet内のPodに対する自動化されたローリングアップデートの機能を実装します。これは`.spec.updateStrategy`フィールドが未指定の場合のデフォルトのストラテジーです。StatefulSetの`.spec.updateStrategy.type`が`RollingUpdate`にセットされたとき、そのStatefulSetコントローラーは、StatefulSet内のPodを削除し、再作成します。これはPodの停止(Podの番号の降順)と同じ順番で、一度に1つのPodを更新します。コントローラーは、その前のPodの状態がRunningかつReady状態になるまで次のPodの更新を待ちます。

#### パーティション

`RollingUpdate`というアップデートストラテジーは、`.spec.updateStrategy.rollingUpdate.partition`を指定することにより、パーティションに分けることができます。もしパーティションが指定されていたとき、そのパーティションの値と等しいか、大きい番号を持つPodが更新されます。パーティションの値より小さい番号を持つPodは更新されず、たとえそれらのPodが削除されたとしても、それらのPodは以前のバージョンで再作成されます。もしStatefulSetの`.spec.updateStrategy.rollingUpdate.partition`が、`.spec.replicas`より大きい場合、`.spec.template`への更新はPodに反映されません。
多くのケースの場合、ユーザーはパーティションを使う必要はありませんが、もし一部の更新を行う場合や、カナリー版のバージョンをロールアウトする場合や、段階的ロールアウトを行う場合に最適です。

#### 強制ロールバック

デフォルトの[Pod管理ポリシー](#pod-management-policies)(`OrderedReady`)による[ローリングアップデート](#rolling-updates)を行う際、修復のために手作業が必要な状態にすることが可能です。

もしユーザーが、決してRunningかつReady状態にならないような設定になるようにPodテンプレートを更新した場合(例えば、不正なバイナリや、アプリケーションレベルの設定エラーなど)、StatefulSetはロールアウトを停止し、待機します。

この状態では、Podテンプレートを正常な状態に戻すだけでは不十分です。[既知の問題](https://github.com/kubernetes/kubernetes/issues/67250)によって、StatefulSetは元の正常な状態へ戻す前に、壊れたPodがReady状態(決して起こりえない)に戻るのを待ち続けます。

そのテンプレートを戻したあと、ユーザーはまたStatefulSetが異常状態で稼働しようとしていたPodをすべて削除する必要があります。StatefulSetはその戻されたテンプレートを使ってPodの再作成を始めます。


## {{% heading "whatsnext" %}}


* [ステートフルなアプリケーションのデプロイ](/ja/docs/tutorials/stateful-application/basic-stateful-set/)の例を参考にしてください。
* [StatefulSetを使ったCassandraのデプロイ](/ja/docs/tutorials/stateful-application/cassandra/)の例を参考にしてください。
* [レプリカを持つステートフルアプリケーションを実行する](/ja/docs/tasks/run-application/run-replicated-stateful-application/)の例を参考にしてください。
