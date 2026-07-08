---
title: ReplicationController
api_metadata:
- apiVersion: "v1"
  kind: "ReplicationController"
content_type: concept
weight: 90
description: >-
  水平スケーリング可能なワークロードを管理するためのレガシーAPI。
  DeploymentおよびReplicaSet APIに置き換えられています。
---

<!-- overview -->

{{< note >}}
現在では、レプリケーションを設定するための推奨方法は、[`ReplicaSet`](/docs/concepts/workloads/controllers/replicaset/)を構成する[`Deployment`](/docs/concepts/workloads/controllers/deployment/)を使用することです。
{{< /note >}}

_ReplicationController_ は、常に指定した数のPodレプリカが実行されていることを保証します。
つまり、ReplicationControllerは、単一のPodまたは同質な複数のPodが常に稼働し、利用可能であることを保証します。

<!-- body -->

## ReplicationControllerの動作 {#how-a-replicationcontroller-works}

Podが多すぎる場合、ReplicationControllerは余分なPodを終了します。
Podが少なすぎる場合、ReplicationControllerはさらにPodを起動します。
手動で作成したPodとは異なり、ReplicationControllerによって管理されるPodは、障害が発生したり、削除されたり、終了されたりすると自動的に置き換えられます。
たとえば、カーネルのアップグレードなどの破壊的なメンテナンスの後には、Podはノード上で再作成されます。
このため、アプリケーションが単一のPodのみを必要とする場合でも、ReplicationControllerを使用するべきです。
ReplicationControllerはプロセススーパーバイザーに似ていますが、単一ノード上の個々のプロセスを監視する代わりに、ReplicationControllerは複数のノード上の複数のPodを監視します。

ReplicationControllerは、議論の中では「rc」と略されることが多く、kubectlコマンドのショートカットとしても使われます。

単純なケースとしては、ReplicationControllerオブジェクトを1つ作成し、Podインスタンスを1つ無期限に実行し続けることができます。
より複雑なユースケースとしては、Webサーバーなどで、複数の同一レプリカを実行することができます。

## ReplicationControllerの実行例 {#running-an-example-replicationcontroller}

このReplicationController設定の例では、nginx Webサーバーの3つのコピーを実行します。

{{% code_sample file="controllers/replication.yaml" %}}

サンプルファイルをダウンロードして、次のコマンドを実行することで、サンプルジョブを実行できます:

```shell
kubectl apply -f https://k8s.io/examples/controllers/replication.yaml
```

出力は次のようになります:

```
replicationcontroller/nginx created
```

次のコマンドを使用して、ReplicationControllerのステータスを確認します:

```shell
kubectl describe replicationcontrollers/nginx
```

出力は次のようになります:

```
Name:        nginx
Namespace:   default
Selector:    app=nginx
Labels:      app=nginx
Annotations:    <none>
Replicas:    3 current / 3 desired
Pods Status: 0 Running / 3 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:       app=nginx
  Containers:
   nginx:
    Image:              nginx
    Port:               80/TCP
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen       LastSeen     Count    From                        SubobjectPath    Type      Reason              Message
  ---------       --------     -----    ----                        -------------    ----      ------              -------
  20s             20s          1        {replication-controller }                    Normal    SuccessfulCreate    Created pod: nginx-qrm3m
  20s             20s          1        {replication-controller }                    Normal    SuccessfulCreate    Created pod: nginx-3ntk0
  20s             20s          1        {replication-controller }                    Normal    SuccessfulCreate    Created pod: nginx-4ok8v
```

ここでは、3つのPodが作成されていますが、おそらくイメージを取得中であるため、まだ実行状態にはなっていません。
少し経ってから同じコマンドを実行すると、次のような出力が得られます:

```shell
Pods Status:    3 Running / 0 Waiting / 0 Succeeded / 0 Failed
```

ReplicationControllerに属するすべてのPodをプログラムで処理しやすい形式でリストするには、次のようなコマンドを使用できます:

```shell
pods=$(kubectl get pods --selector=app=nginx --output=jsonpath={.items..metadata.name})
echo $pods
```

出力は次のようになります:

```
nginx-3ntk0 nginx-4ok8v nginx-qrm3m
```

ここで、セレクターは、ReplicationControllerのセレクター(`kubectl describe`の出力で確認できます)と同じで、`replication.yaml`では異なる形式で記述されています。
`--output=jsonpath`オプションは、返されたリスト内の各Podから名前を取得する式を指定します。

## ReplicationControllerマニフェストの記述 {#writing-a-replicationcontroller-manifest}

他のすべてのKubernetes設定と同様に、ReplicationControllerには`apiVersion`、`kind`、`metadata`フィールドが必要です。

コントロールプレーンがReplicationControllerの新しいPodを作成する際、ReplicationControllerの`.metadata.name`が、それらのPodを命名する際の基準の一部になります。
ReplicationControllerの名前は有効な[DNSサブドメイン](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)の値である必要がありますが、これはPodのホスト名に予期しない結果をもたらす可能性があります。
互換性を最大限に保つために、名前は[DNSラベル](/docs/concepts/overview/working-with-objects/names#dns-label-names)に準じた、より厳格なルールに従うことをお勧めします。

設定ファイルの操作に関する一般的な情報については、[オブジェクト管理](/docs/concepts/overview/working-with-objects/object-management/)を参照してください。

また、ReplicationControllerには[`.spec`セクション](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)も必要です。

### Podテンプレート {#pod-template}

`.spec.template`は`.spec`の唯一の必須フィールドです。

`.spec.template`は[Podテンプレート](/docs/concepts/workloads/pods/#pod-templates)です。
{{< glossary_tooltip text="Pod" term_id="pod" >}}とまったく同じスキーマを持ちますが、ネストされている点や、`apiVersion`や`kind`を持たない点が異なります。

Podの必須フィールドに加えて、ReplicationController内のPodテンプレートは適切なラベルと適切な再起動ポリシーを指定する必要があります。
ラベルについては、他のコントローラーと重複しないようにしてください。
詳しくは、[Podセレクター](#pod-selector)を参照してください。

[`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)には`Always`のみが許可されており、指定されていない場合、デフォルトで`Always`になります。

ローカルコンテナの再起動については、ReplicationControllerは[Kubelet](/docs/reference/command-line-tools-reference/kubelet/)などのノード上のエージェントに委任します。

### ReplicationControllerのラベル {#labels-on-the-replicationcontroller}

ReplicationController自体もラベル(`.metadata.labels`)を持つことができます。
通常、これらは`.spec.template.metadata.labels`と同じに設定します。
`.metadata.labels`が指定されていない場合、デフォルトで`.spec.template.metadata.labels`になります。
ただし、これらは異なる値に設定することが可能で、`.metadata.labels`はReplicationControllerの動作には影響しません。

### Podセレクター {#pod-selector}

`.spec.selector`フィールドは[ラベルセレクター](/docs/concepts/overview/working-with-objects/labels/#label-selectors)です。
ReplicationControllerは、セレクターに一致するラベルを持つすべてのPodを管理します。
ReplicationController自身が作成したPodか、他の人やプロセスが作成したPodかを区別しません。
これにより、実行中のPodに影響を与えることなく、ReplicationControllerを置き換えることができます。

指定されている場合、`.spec.template.metadata.labels`は`.spec.selector`と等しい必要があり、そうでない場合はAPIによって拒否されます。
もし、`.spec.selector`が指定されていない場合は、デフォルトで`.spec.template.metadata.labels`に設定されます。

また、通常は、このセレクターに一致するラベルを持つPodを、直接、または別のReplicationControllerを通して、またはJobなどの別のコントローラーで作成しないでください。
もし作成すると、ReplicationControllerは他のPodを自身が作成したPodであるとみなしてしまいます。
Kubernetesはこのような操作を制限しません。

複数のコントローラーのセレクターが重複してしまった場合、削除を自分で管理する必要があります([下記](#working-with-replicationcontrollers)を参照)。

### 複数のレプリカ {#multiple-replicas}

`.spec.replicas`を、同時に実行したいPodの数に設定することで、同時に実行すべきPodの数を指定できます。
任意の時点で実行されているPod数は、レプリカ数の増減直後や、Podの正常なシャットダウンと代替Podの早期起動が重なった場合などに、指定した数と多少異なることがあります。

`.spec.replicas`を指定しない場合、デフォルトは1に設定されます。

## ReplicationControllerの操作 {#working-with-replicationcontrollers}

### ReplicationControllerとそのPodの削除 {#deleting-a-replicationcontroller-and-its-pods}

ReplicationControllerとそのすべてのPodを削除するには、[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete)を使用します。
Kubectlは、ReplicationControllerをゼロにスケールし、各Podを削除するのを待ってから、ReplicationController自体を削除します。
このkubectlコマンドが中断された場合、再起動できます。

REST APIまたは[クライアントライブラリ](/docs/reference/using-api/client-libraries)を使用する場合は、明示的に手順を実行する必要があります(レプリカを0にスケール後、Pod削除を待機し、ReplicationControllerを削除する)。

### ReplicationControllerのみの削除 {#deleting-only-a-replicationcontroller}

Podに影響を与えることなく、ReplicationControllerを削除することが可能です。

kubectlを使用して、[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete)に`--cascade=orphan`オプションを指定します。

REST APIまたは[クライアントライブラリ](/docs/reference/using-api/client-libraries)を使用する場合は、ReplicationControllerオブジェクトを削除できます。

元のコントローラーが削除されたら、新しいReplicationControllerを作成して置き換えることができます。
新旧の`.spec.selector`が同じである限り、新しいコントローラーは古いPodを引き継ぎます。
ただし、既存のPodを新しい異なるPodテンプレートに合わせて更新することはしません。
制御された方法でPodを新しい仕様に更新するには、[ローリングアップデート](#rolling-updates)を使用します。

### ReplicationControllerからPodを分離する {#isolating-pods-from-a-replicationcontroller}

Podのラベルを変更することで、ReplicationControllerの管理対象から外すことができます。
この手法は、デバッグやデータ復旧の目的で、Podをサービスから削除するために使用できます。
この方法で削除されたPodは、自動的に置き換えられます(レプリカ数も変更されていないと仮定)。

## 一般的な使用パターン {#common-usage-patterns}

### 再スケジューリング {#rescheduling}

前述のとおり、実行し続けたいPodが1つでも1000でも、ReplicationControllerは、ノード障害やPodの終了(たとえば、別の制御エージェントによる操作など)が発生した場合でも、指定された数のPodが存在することを保証します。

### スケーリング {#scaling}

ReplicationControllerは、手動またはオートスケーリング制御エージェントによって、`replicas`フィールドを更新することで、レプリカ数を増減させることができます。

### ローリングアップデート {#rolling-updates}

ReplicationControllerは、Podを1つずつ置き換えることで、サービスへのローリングアップデートを容易にするように設計されています。

[#1353](https://issue.k8s.io/1353)で説明されているように、推奨されるアプローチは、1つのレプリカで新しいReplicationControllerを作成し、新しいコントローラー(+1)と古いコントローラー(-1)を1つずつスケールし、古いコントローラーが0レプリカに達したら削除することです。
これにより、予期しない障害に左右されることなく、Podのセットが予測どおりに更新されます。

理想的には、ローリングアップデートコントローラーはアプリケーションの準備状態を考慮し、常に十分な数のPodが実際にサービスを提供できる状態にあることを保証します。

2つのReplicationControllerは、Podのプライマリコンテナのイメージタグなど、少なくとも1つのラベルで区別できるPodを作成する必要があります。
ローリングアップデートのきっかけになるのは、通常はイメージの更新が原因であるためです。

### 複数のリリーストラック {#multiple-release-tracks}

ローリングアップデート中にアプリケーションの複数のリリースを実行するのに加えて、複数のリリーストラックを用いて、複数のリリースを長期間、あるいは継続的に実行することも一般的です。
トラックはラベルで区別されます。

たとえば、とあるサービスが`tier in (frontend), environment in (prod)`の条件を満たすラベルを持つ、すべてのPodを対象にしているとします。
このティアを構成する10個のレプリケートされたPodがあるとします。
ただし、このコンポーネントの新しいバージョンを「カナリア」リリースしたいとします。
大部分のレプリカについて、`replicas`を9に設定し、ラベル`tier=frontend, environment=prod, track=stable`を持つReplicationControllerを設定し、
カナリア用に`replicas`を1に設定し、ラベル`tier=frontend, environment=prod, track=canary`を持つ別のReplicationControllerを設定できます。
これで、サービスはカナリアと非カナリアの両方のPodをカバーします。
一方で、ReplicationControllerを個別に操作して、テストしたり、結果を監視したりすることもできます。

### ReplicationControllerとサービスの併用 {#using-replicationcontrollers-with-services}

複数のReplicationControllerを単一のサービスの背後に配置して、たとえば、一部のトラフィックが古いバージョンに送られ、一部が新しいバージョンに送られるようにすることができます。

ReplicationControllerは自ら終了することはありませんが、サービスほど長く存在し続けることは想定されていません。
サービスは、複数のReplicationControllerによって制御されるPodで構成される場合があり、1つのサービスの存続期間中に多くのReplicationControllerが作成・破棄されることが想定されます(たとえば、サービスを実行するPodを更新する場合など)。
サービス自体とそのクライアントは、サービスのPodを維持しているReplicationControllerについて意識する必要はありません。

## レプリケーション用のプログラムの記述 {#writing-programs-for-replication}

ReplicationControllerによって作成されたPodは、交換可能で意味的に同一であることを意図していますが、時間の経過とともに構成が不均一になる可能性があります。
これは、レプリケートされたステートレスなサーバーに適していることは明らかですが、ReplicationControllerは、マスター選出、シャーディング、ワーカープールアプリケーションなど可用性維持のためにも使用できます。
このようなアプリケーションでは、アンチパターンと見なされる各Podの構成の静的/1回限りのカスタマイズではなく、[RabbitMQワークキュー](https://www.rabbitmq.com/tutorials/tutorial-two-python.html)などの動的なワーク割り当てメカニズムを使用する必要があります。
実行されるPodのカスタマイズ、たとえばリソースの垂直オートサイジング(cpuやメモリなど)は、ReplicationController自体と同様に、別のオンラインコントローラープロセスによって実行される必要があります。

## ReplicationControllerの責任 {#responsibilities-of-a-replicationcontroller}

ReplicationControllerは、ラベルセレクターに一致するPodが目的の数だけ存在し、それらが動作していることを保証します。
現在は、終了したPodのみがカウントから除外されます。
将来的には、[readiness](https://issue.k8s.io/620)やシステムから利用可能なその他の情報が考慮される可能性があり、置き換えポリシーに対してより多くの制御を追加する可能性があります。
また、外部クライアントが任意の洗練された置き換えポリシーやスケールダウンポリシーを実装するために使用できるイベントを発行する予定です。

ReplicationControllerは、常にこの限定された責任のみを持ちます。
ReplicationController自身が、Readiness ProbeやLiveness Probeを実行することはありません。
オートスケーリングを実行するのではなく、([#492](https://issue.k8s.io/492)で議論されているように)外部のオートスケーラーによって制御され、そのオートスケーラーが`replicas`フィールドを変更することを想定しています。
ReplicationControllerにスケジューリングポリシー(たとえば、[spreading](https://issue.k8s.io/367#issuecomment-48428019))を追加することはありません。
また、制御しているPodが現在指定されているテンプレートと一致することを検証すべきではありません。
それは、オートサイジングやその他の自動化されたプロセスを妨げるためです。
同様に、完了期限、順序依存関係、設定の展開、その他の機能は別の場所に属します。
一括でのPod作成のメカニズムを分離することさえ計画しています([#170](https://issue.k8s.io/170))。

ReplicationControllerは、組み合わせ可能なビルディングブロックのプリミティブとして意図されています。
将来的には、ユーザーの利便性のために、ReplicationControllerやその他の補完的なプリミティブの上に、より高レベルのAPIやツールが構築されることを期待しています。
現在kubectlでサポートされている「マクロ」操作(run、scale)は、これの概念実証の例です。
たとえば、ReplicationController、オートスケーラー、サービス、スケジューリングポリシー、カナリアなどを管理する[Asgard](https://netflixtechblog.com/asgard-web-based-cloud-management-and-deployment-2c9fc4e4d3a1)のようなものが想定されます。

## APIオブジェクト {#api-object}

ReplicationControllerは、Kubernetes REST APIのトップレベルリソースです。
APIオブジェクトの詳細については、以下を参照してください:
[ReplicationController APIオブジェクト](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replicationcontroller-v1-core)。

## ReplicationControllerの代替 {#alternatives-to-replicationcontroller}

### ReplicaSet

[`ReplicaSet`](/docs/concepts/workloads/controllers/replicaset/)は、新しい[集合ベースのラベルセレクター](/docs/concepts/overview/working-with-objects/labels/#set-based-requirement)をサポートする次世代のReplicationControllerです。
主に[Deployment](/docs/concepts/workloads/controllers/deployment/)によって、Pod作成、削除、更新を調整するメカニズムとして使用されます。
カスタムの更新オーケストレーションが必要な場合や、更新がまったく必要ない場合を除き、ReplicaSetを直接使用するのではなく、Deploymentを使用することをお勧めします。

### Deployment(推奨) {#deployment-recommended}

[`Deployment`](/docs/concepts/workloads/controllers/deployment/)は、基盤となるReplicaSetとそのPodを更新する、より高レベルのAPIオブジェクトです。
Deploymentは宣言的で、サーバー側で動作し、追加機能を持つため、ローリングアップデート機能が必要な場合には推奨されます。

### ベアPod {#bare-pods}

ユーザーが直接Podを作成した場合とは異なり、ReplicationControllerは、ノード障害やカーネルアップグレードなどの破壊的なノードメンテナンスなど、何らかの理由で削除または終了されたPodを置き換えます。
このため、アプリケーションが単一のPodのみを必要とする場合でも、ReplicationControllerを使用することを推奨します。
プロセススーパーバイザーと同様に考えてください。
ただし、単一ノード上の個々のプロセスではなく、複数のノード上の複数のPodを監視する点が異なります。
ReplicationControllerは、ローカルコンテナの再起動をkubeletなどのノード上のエージェントに委任します。

### Job {#job}

自ら終了することが期待されるPod(つまり、バッチジョブ)には、ReplicationControllerの代わりに[`Job`](/docs/concepts/workloads/controllers/job/)を使用してください。

### DaemonSet {#daemonset}

マシン監視やマシンログなど、マシンレベルの機能を提供するPodには、ReplicationControllerの代わりに[`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/)を使用してください。
これらのPodは、マシンの稼働期間に結び付けられた存続期間を持ちます。
Podは、他のPodが起動する前にマシン上で実行されている必要があり、マシンが再起動またはシャットダウンの準備ができたときに安全に終了できます。

## {{% heading "whatsnext" %}}

* [Pod](/docs/concepts/workloads/pods)について学ぶ。
* ReplicationControllerの代替である[Deployment](/docs/concepts/workloads/controllers/deployment/)について学ぶ。
* `ReplicationController`はKubernetes REST APIの一部です。
  レプリケーションコントローラーのAPIを理解するには、{{< api-reference page="workload-resources/replication-controller-v1" >}}オブジェクト定義を読んでください。
