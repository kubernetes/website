---
title: ノード上へのPodのスケジューリング
content_type: concept
weight: 20
---


<!-- overview -->

{{< glossary_tooltip text="Pod" term_id="pod" >}}を特定の{{< glossary_tooltip text="ノード" term_id="node" >}}で実行するように _制限_ したり、特定のノードで実行することを _優先_ させたりといった制約をかけることができます。
これを実現するためにはいくつかの方法がありますが、推奨されている方法は、すべて[ラベルセレクター](/ja/docs/concepts/overview/working-with-objects/labels/)を使用して選択を容易にすることです。
多くの場合、このような制約を設定する必要はなく、{{< glossary_tooltip text="スケジューラー" term_id="kube-scheduler" >}}が自動的に妥当な配置を行います(例えば、Podを複数のノードに分散させ、空きリソースが十分でないノードにPodを配置しないようにすることができます)。
しかし、例えばSSDが接続されているノードにPodが配置されるようにしたり、多くの通信を行う2つの異なるサービスのPodを同じアベイラビリティーゾーンに配置したりする等、どのノードに配置するかを制御したい状況もあります。

<!-- body -->

Kubernetesが特定のPodの配置場所を選択するために、以下の方法があります:

  * [ノードラベル](#built-in-node-labels)に対してマッチングを行う[nodeSelector](#nodeselector)フィールド
  * [アフィニティとアンチアフィニティ](#affinity-and-anti-affinity)
  * [nodeName](#nodename)フィールド
  * [Podのトポロジー分散制約](#pod-topology-spread-constraints)

## ノードラベル {#built-in-node-labels}

他の多くのKubernetesオブジェクトと同様に、ノードにも[ラベル](/ja/docs/concepts/overview/working-with-objects/labels/)があります。[手動でラベルを付ける](/ja/docs/tasks/configure-pod-container/assign-pods-nodes/#ラベルをNodeに追加する)ことができます。
また、Kubernetesはクラスター内のすべてのノードに対し、いくつかの標準ラベルを付けます。ノードラベルの一覧については[よく使われるラベル、アノテーションとtaint](/docs/reference/labels-annotations-taints/)を参照してください。

{{<note>}}
これらのラベルの値はクラウドプロバイダー固有のもので、信頼性を保証できません。
例えば、`kubernetes.io/hostname`の値はある環境ではノード名と同じになり、他の環境では異なる値になることがあります。
{{</note>}}

### ノードの分離/制限 {#node-isolation-restriction}

ノードにラベルを追加することで、Podを特定のノードまたはノードグループ上でのスケジューリングの対象にすることができます。この機能を使用すると、特定のPodが一定の独立性、安全性、または規制といった属性を持ったノード上でのみ実行されるようにすることができます。

ノード分離するのにラベルを使用する場合、{{<glossary_tooltip text="kubelet" term_id="kubelet">}}が修正できないラベルキーを選択してください。
これにより、侵害されたノードが自身でそれらのラベルを設定することで、スケジューラーがそのノードにワークロードをスケジュールしてしまうのを防ぐことができます。

[`NodeRestriction`アドミッションプラグイン](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)は、kubeletが`node-restriction.kubernetes.io/`というプレフィックスを持つラベルを設定または変更するのを防ぎます。

ラベルプレフィックスをNode分離に利用するには:

1. [ノード認可](/docs/reference/access-authn-authz/node/)を使用していることと、`NodeRestriction` アドミッションプラグインが _有効_ になっていることを確認します。
2. `node-restriction.kubernetes.io/`プレフィックスを持つラベルをノードに追加し、 [nodeSelector](#nodeselector)でそれらのラベルを使用します。
    例えば、`example.com.node-restriction.kubernetes.io/fips=true`や`example.com.node-restriction.kubernetes.io/pci-dss=true`などです。

## nodeSelector {#nodeselector}

`nodeSelector`は、ノード選択制約の中で最もシンプルな推奨形式です。
Podのspec(仕様)に`nodeSelector`フィールドを追加することで、ターゲットノードが持つべき[ノードラベル](#built-in-node-labels)を指定できます。
Kubernetesは指定された各ラベルを持つノードにのみ、Podをスケジューリングします。

詳しい情報については[Podをノードに割り当てる](/ja/docs/tasks/configure-pod-container/assign-pods-nodes/)を参照してください。

## アフィニティとアンチアフィニティ {#affinity-and-anti-affinity}

`nodeSelector`はPodを特定のラベルが付与されたノードに制限する最も簡単な方法です。
アフィニティとアンチアフィニティでは、定義できる制約の種類が拡張されています。
アフィニティとアンチアフィニティのメリットは以下の通りです。

* アフィニティとアンチアフィニティで使われる言語は、より表現力が豊かです。`nodeSelector`は指定されたラベルを全て持つノードを選択するだけです。アフィニティとアンチアフィニティは選択ロジックをより細かく制御することができます。
* ルールが*柔軟*であったり*優先*での指定ができたりするため、一致するノードが見つからない場合でも、スケジューラーはPodをスケジュールします。
* ノード自体のラベルではなく、ノード(または他のトポロジカルドメイン)上で稼働している他のPodのラベルを使ってPodを制約することができます。これにより、ノード上にどのPodを共存させるかのルールを定義することができます。

アフィニティ機能は、2種類のアフィニティで構成されています:

* *ノードアフィニティ*は`nodeSelector`フィールドと同様に機能しますが、より表現力が豊かで、より柔軟にルールを指定することができます。
* *Pod間アフィニティとアンチアフィニティ*は、他のPodのラベルを元に、Podを制約することができます。

### ノードアフィニティ {#node-affinity}

ノードアフィニティは概念的には、ノードのラベルによってPodがどのノードにスケジュールされるかを制限する`nodeSelector`と同様です。

ノードアフィニティには2種類あります:

  * `requiredDuringSchedulingIgnoredDuringExecution`: 
    スケジューラーは、ルールが満たされない限り、Podをスケジュールすることができません。これは`nodeSelector`と同じように機能しますが、より表現力豊かな構文になっています。
  * `preferredDuringSchedulingIgnoredDuringExecution`: 
    スケジューラーは、対応するルールを満たすノードを探そうとします。 一致するノードが見つからなくても、スケジューラーはPodをスケジュールします。

{{<note>}}
上記の2種類にある`IgnoredDuringExecution`は、KubernetesがPodをスケジュールした後にノードラベルが変更されても、Podは実行し続けることを意味します。
{{</note>}}

Podのspec(仕様)にある`.spec.affinity.nodeAffinity`フィールドを使用して、ノードアフィニティを指定することができます。

例えば、次のようなPodのspec(仕様)を考えてみましょう:

{{% codenew file="pods/pod-with-node-affinity.yaml" %}}

この例では、以下のルールが適用されます:

  * ノードには`topology.kubernetes.io/zone`をキーとするラベルが*必要*で、そのラベルの値は`antarctica-east1`または`antarctica-west1`のいずれかでなければなりません。
  * ノードにはキー名が`another-node-label-key`で、値が`another-node-label-value`のラベルを持つことが*望ましい*です。

`operator`フィールドを使用して、Kubernetesがルールを解釈する際に使用できる論理演算子を指定することができます。`In`、`NotIn`、`Exists`、`DoesNotExist`、`Gt`、`Lt`が使用できます。

`NotIn`と`DoesNotExist`を使って、ノードのアンチアフィニティ動作を定義することができます。また、[ノードのTaint](/ja/docs/concepts/scheduling-eviction/taint-and-toleration/)を使用して、特定のノードからPodをはじくこともできます。

{{<note>}}
`nodeSelector`と`nodeAffinity`の両方を指定した場合、*両方の*条件を満たさないとPodはノードにスケジュールされません。

`nodeAffinity`タイプに関連付けられた`nodeSelectorTerms`内に、複数の条件を指定した場合、Podは指定した条件のいずれかを満たしたノードへスケジュールされます(条件はORされます)。

`nodeSelectorTerms`内の条件に関連付けられた1つの`matchExpressions`フィールド内に、複数の条件を指定した場合、Podは全ての条件を満たしたノードへスケジュールされます(条件はANDされます)。
{{</note>}}

詳細については[ノードアフィニティを利用してPodをノードに割り当てる](/ja/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)を参照してください。

#### ノードアフィニティの重み {#node-affinity-weight}

`preferredDuringSchedulingIgnoredDuringExecution`アフィニティタイプの各インスタンスに、1から100の範囲の`weight`を指定できます。
Podの他のスケジューリング要件をすべて満たすノードを見つけると、スケジューラーはそのノードが満たすすべての優先ルールを繰り返し実行し、対応する式の`weight`値を合計に加算します。

最終的な合計は、そのノードの他の優先度関数のスコアに加算されます。合計スコアが最も高いノードが、スケジューラーがPodのスケジューリングを決定する際に優先されます。

例えば、次のようなPodのspec(仕様)を考えてみましょう: 

{{% codenew file="pods/pod-with-affinity-anti-affinity.yaml" %}}

`preferredDuringSchedulingIgnoredDuringExecution`ルールにマッチするノードとして、一つは`label-1:key-1`ラベル、もう一つは`label-2:key-2`ラベルの2つの候補がある場合、スケジューラーは各ノードの`weight`を考慮し、その重みとノードの他のスコアを加え、最終スコアが最も高いノードにPodをスケジューリングします。

{{<note>}}
この例でKubernetesにPodを正常にスケジュールさせるには、`kubernetes.io/os=linux`ラベルを持つ既存のノードが必要です。
{{</note>}}

#### スケジューリングプロファイルごとのノードアフィニティ {#node-affinity-per-scheduling-profile}

{{< feature-state for_k8s_version="v1.20" state="beta" >}}

複数の[スケジューリングプロファイル](/ja/docs/reference/scheduling/config/#multiple-profiles)を設定する場合、プロファイルにノードアフィニティを関連付けることができます。これは、プロファイルが特定のノード群にのみ適用される場合に便利です。[スケジューラーの設定](/ja/docs/reference/scheduling/config/)にある[`NodeAffinity`プラグイン](/ja/docs/reference/scheduling/config/#scheduling-plugins)の`args`フィールドに`addedAffinity`を追加すると実現できます。例えば:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
  - schedulerName: foo-scheduler
    pluginConfig:
      - name: NodeAffinity
        args:
          addedAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
              nodeSelectorTerms:
              - matchExpressions:
                - key: scheduler-profile
                  operator: In
                  values:
                  - foo
```

`addedAffinity`は、Podの仕様(spec)で指定されたノードアフィニティに加え、`.spec.schedulerName`を`foo-scheduler`に設定したすべてのPodに適用されます。つまり、Podにマッチするためには、ノードは`addedAffinity`とPodの`.spec.NodeAffinity`を満たす必要があるのです。

`addedAffinity`はエンドユーザーには見えないので、その動作はエンドユーザーにとって予期しないものになる可能性があります。スケジューラープロファイル名と明確な相関関係のあるノードラベルを使用すべきです。

{{< note >}}
[DaemonSetのPodを作成する](/ja/docs/concepts/workloads/controllers/daemonset/#how-daemon-pods-are-scheduled)DaemonSetコントローラーは、スケジューリングプロファイルをサポートしていません。DaemonSetコントローラーがPodを作成すると、デフォルトのKubernetesスケジューラーがそれらのPodを配置し、DaemonSetコントローラーの`nodeAffinity`ルールに優先して従います。
{{< /note >}}

### Pod間のアフィニティとアンチアフィニティ {#inter-pod-affinity-and-anti-affinity}

Pod間のアフィニティとアンチアフィニティは、ノードのラベルではなく、すでにノード上で稼働している**Pod**のラベルに従って、Podがどのノードにスケジュールされるかを制限できます。

Xはノードや、ラック、クラウドプロバイダーのゾーンやリージョン等を表すトポロジードメインで、YはKubernetesが満たそうとするルールである場合、Pod間のアフィニティとアンチアフィニティのルールは、"XにてルールYを満たすPodがすでに稼働している場合、このPodもXで実行すべき(アンチアフィニティの場合はすべきではない)"という形式です。

これらのルール(Y)は、オプションの関連する名前空間のリストを持つ[ラベルセレクター](/ja/docs/concepts/overview/working-with-objects/labels/#label-selectors)で表現されます。PodはKubernetesの名前空間オブジェクトであるため、Podラベルも暗黙的に名前空間を持ちます。Kubernetesが指定された名前空間でラベルを探すため、Podラベルのラベルセレクターは、名前空間を指定する必要があります。

トポロジードメイン(X)は`topologyKey`で表現され、システムがドメインを示すために使用するノードラベルのキーになります。具体例は[よく知られたラベル、アノテーションとTaint](/docs/reference/labels-annotations-taints/)を参照してください。

{{< note >}}
Pod間アフィニティとアンチアフィニティはかなりの処理量を必要とするため、大規模クラスターでのスケジューリングが大幅に遅くなる可能性があります
そのため、数百台以上のノードから成るクラスターでの使用は推奨されません。
{{< /note >}}

{{< note >}}
Podのアンチアフィニティは、ノードに必ず一貫性の持つラベルが付与されている必要があります。
言い換えると、クラスターの全てのノードが、`topologyKey`に合致する適切なラベルが必要になります。
一部、または全部のノードに`topologyKey`ラベルが指定されていない場合、意図しない挙動に繋がる可能性があります。
{{< /note >}}

#### Pod間のアフィニティとアンチアフィニティの種類 {#types-of-inter-pod-affinity-and-anti-affinity}

[ノードアフィニティ](#node-affinity)と同様に、Podアフィニティとアンチアフィニティにも下記の2種類があります:

  * `requiredDuringSchedulingIgnoredDuringExecution`
  * `preferredDuringSchedulingIgnoredDuringExecution`

例えば、`requiredDuringSchedulingIgnoredDuringExecution`アフィニティを使用して、2つのサービスのPodはお互いのやり取りが多いため、同じクラウドプロバイダーゾーンに併置するようにスケジューラーに指示することができます。
同様に、`preferredDuringSchedulingIgnoredDuringExecution`アンチアフィニティを使用して、あるサービスのPodを複数のクラウドプロバイダーゾーンに分散させることができます。

Pod間アフィニティを使用するには、Pod仕様(spec)の`affinity.podAffinity`フィールドで指定します。Pod間アンチアフィニティを使用するには、Pod仕様(spec)の`affinity.podAntiAffinity`フィールドで指定します。

#### Podアフィニティ使用例 {#an-example-of-a-pod-that-uses-pod-affinity}

次のようなPod仕様(spec)を考えてみましょう:

{{% codenew file="pods/pod-with-pod-affinity.yaml" %}}

この例では、PodアフィニティルールとPodアンチアフィニティルールを1つずつ定義しています。
Podアフィニティルールは"ハード"な`requiredDuringSchedulingIgnoredDuringExecution`を使用し、アンチアフィニティルールは"ソフト"な`preferredDuringSchedulingIgnoredDuringExecution`を使用しています。

アフィニティルールは、スケジューラーがノードにPodをスケジュールできるのは、そのノードが、`security=S1`ラベルを持つ1つ以上の既存のPodと同じゾーンにある場合のみであることを示しています。より正確には、現在Podラベル`security=S1`を持つPodが1つ以上あるノードが、そのゾーン内に少なくとも1つ存在する限り、スケジューラーは`topology.kubernetes.io/zone=V`ラベルを持つノードにPodを配置しなければなりません。

アンチアフィニティルールは、`security=S2`ラベルを持つ1つ以上のPodと同じゾーンにあるノードには、スケジューラーがPodをスケジュールしないようにすることを示しています。より正確には、Podラベル`Security=S2`を持つPodが稼働している他のノードが、同じゾーン内に存在する場合、スケジューラーは`topology.kubernetes.io/zone=R`ラベルを持つノードにはPodを配置しないようにしなければなりません。

Podアフィニティとアンチアフィニティの使用例についてもっと知りたい方は[デザイン案](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md)を参照してください。

Podアフィニティとアンチアフィニティの`operator`フィールドで使用できるのは、`In`、`NotIn`、 `Exists`、 `DoesNotExist`です。

原則として、`topologyKey`には任意のラベルキーが指定できますが、パフォーマンスやセキュリティの観点から、以下の例外があります:

* Podアフィニティとアンチアフィニティでは、`requiredDuringSchedulingIgnoredDuringExecution`と`preferredDuringSchedulingIgnoredDuringExecution`内のどちらも、`topologyKey`フィールドが空であることは許可されていません。
* Podアンチアフィニティルールの`requiredDuringSchedulingIgnoredDuringExecution`では、アドミッションコントローラー`LimitPodHardAntiAffinityTopology`が`topologyKey`を`kubernetes.io/hostname`に制限しています。アドミッションコントローラーを修正または無効化すると、トポロジーのカスタマイズができるようになります。

`labelSelector`と`topologyKey`に加え、`labelSelector`と`topologyKey`と同じレベルの`namespaces`フィールドを使用して、`labelSelector`が合致すべき名前空間のリストを任意に指定することができます。省略または空の場合、`namespaces`がデフォルトで、アフィニティとアンチアフィニティが定義されたPodの名前空間に設定されます。

#### 名前空間セレクター {#namespace-selector}
{{< feature-state for_k8s_version="v1.24" state="stable" >}}

`namespaceSelector`を使用し、ラベルで名前空間の集合に対して検索することによって、名前空間を選択することができます。
アフィニティ項は`namespaceSelector`と`namespaces`フィールドによって選択された名前空間に適用されます。
要注意なのは、空の`namespaceSelector`({})はすべての名前空間にマッチし、nullまたは空の`namespaces`リストとnullの`namespaceSelector`は、ルールが定義されているPodの名前空間にマッチします。

#### 実践的なユースケース {#more-practical-use-cases}

Pod間アフィニティとアンチアフィニティは、ReplicaSet、StatefulSet、Deploymentなどのより高レベルなコレクションと併せて使用するとさらに有用です。これらのルールにより、ワークロードのセットが同じ定義されたトポロジーに併置されるように設定できます。たとえば、2つの関連するPodを同じノードに配置することが好ましい場合です。

例えば、3つのノードで構成されるクラスターを想像してください。そのクラスターを使用してウェブアプリケーションを実行し、さらにインメモリーキャッシュ(Redisなど)を使用します。この例では、ウェブアプリケーションとメモリーキャッシュの間のレイテンシーは実用的な範囲の低さも想定しています。Pod間アフィニティやアンチアフィニティを使って、ウェブサーバーとキャッシュをなるべく同じ場所に配置することができます。

以下のRedisキャッシュのDeploymentの例では、各レプリカはラベル`app=store`が付与されています。`podAntiAffinity`ルールは、`app=store`ラベルを持つ複数のレプリカを単一ノードに配置しないよう、スケジューラーに指示します。これにより、各キャッシュが別々のノードに作成されます。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-cache
spec:
  selector:
    matchLabels:
      app: store
  replicas: 3
  template:
    metadata:
      labels:
        app: store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: redis-server
        image: redis:3.2-alpine
```

次のウェブサーバーのDeployment例では、`app=web-store`ラベルが付与されたレプリカを作成します。Podアフィニティルールは、各レプリカを、`app=store`ラベルが付与されたPodを持つノードに配置するようスケジューラーに指示します。Podアンチアフィニティルールは、1つのノードに複数の`app=web-store`サーバーを配置しないようにスケジューラーに指示します。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
spec:
  selector:
    matchLabels:
      app: web-store
  replicas: 3
  template:
    metadata:
      labels:
        app: web-store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - web-store
            topologyKey: "kubernetes.io/hostname"
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: web-app
        image: nginx:1.16-alpine
```

上記2つのDeploymentが生成されると、以下のようなクラスター構成になり、各ウェブサーバーはキャッシュと同位置に、3つの別々のノードに配置されます。

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| *webserver-1*        |   *webserver-2*     |    *webserver-3*   |
|  *cache-1*           |     *cache-2*       |     *cache-3*      |

全体的な効果として、各キャッシュインスタンスは、同じノード上で実行している単一のクライアントによってアクセスされる可能性が高いです。この方法は、スキュー(負荷の偏り)とレイテンシーの両方を最小化することを目的としています。

Podアンチアフィニティを使用する理由は他にもあります。
この例と同様の方法で、アンチアフィニティを用いて高可用性を実現したStatefulSetの使用例は[ZooKeeperチュートリアル](/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)を参照してください。

## nodeName {#nodename}

`nodeName`はアフィニティや`nodeSelector`よりも直接的なノード選択形式になります。`nodeName`はPod仕様(spec)内のフィールドです。`nodeName`フィールドが空でない場合、スケジューラーはPodを考慮せずに、指定されたノードにあるkubeletがそのノードにPodを配置しようとします。`nodeName`を使用すると、`nodeSelector`やアフィニティおよびアンチアフィニティルールを使用するよりも優先されます。

 `nodeName`を使ってノードを選択する場合の制約は以下の通りです:

-   指定されたノードが存在しない場合、Podは実行されず、場合によっては自動的に削除されることがあります。
-   指定されたノードがPodを収容するためのリソースを持っていない場合、Podの起動は失敗し、OutOfmemoryやOutOfcpuなどの理由が表示されます。
-   クラウド環境におけるノード名は、常に予測可能で安定したものではありません。

{{< note >}}
`nodeName`は、カスタムスケジューラーや、設定済みのスケジューラーをバイパスする必要がある高度なユースケースで使用することを目的としています。
スケジューラーをバイパスすると、割り当てられたノードに過剰なPodの配置をしようとした場合には、Podの起動に失敗することがあります。
[ノードアフィニティ](#node-affinity)または[`nodeSelector`フィールド](#nodeselector)を使用すれば、スケジューラーをバイパスせずに、特定のノードにPodを割り当てることができます。
{{</ note >}}

以下は、`nodeName`フィールドを使用したPod仕様(spec)の例になります:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  nodeName: kube-01
```

上記のPodは`kube-01`というNodeでのみ実行されます。

## Podトポロジー分散制約 {#pod-topology-spread-constraints}

_トポロジー分散制約_ を使って、リージョン、ゾーン、ノードなどの障害ドメイン間、または定義したその他のトポロジードメイン間で、クラスター全体にどのように{{< glossary_tooltip text="Pod" term_id="Pod" >}}を分散させるかを制御することができます。これにより、パフォーマンス、予想される可用性、または全体的な使用率を向上させることができます。

詳しい仕組みについては、[トポロジー分散制約](/docs/concepts/scheduling-eviction/topology-spread-constraints/)を参照してください。

## {{% heading "whatsnext" %}}

* [TaintとToleration](/ja/docs/concepts/scheduling-eviction/taint-and-toleration/)についてもっと読む。
* [ノードアフィニティ](https://git.k8s.io/design-proposals-archive/scheduling/nodeaffinity.md)と[Pod間アフィニティ/アンチアフィニティ](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md)のデザインドキュメントを読む。
* [トポロジーマネージャー](/ja/docs/tasks/administer-cluster/topology-manager/)がノードレベルのリソース割り当ての決定にどのように関与しているかについて学ぶ。
* [nodeSelector](/ja/docs/tasks/configure-pod-container/assign-pods-nodes/)の使用方法について学ぶ。
* [アフィニティとアンチアフィニティ](/ja/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)の使用方法について学ぶ。
