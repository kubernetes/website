---
title: Podトポロジー分散制約
content_type: concept
weight: 40
---


<!-- overview -->

_トポロジー分散制約_ を使用するとリージョン、ゾーン、ノードおよびその他のユーザー定義されたトポロジー領域などの障害ドメインをまたがって、クラスター内の{{< glossary_tooltip text="Pod" term_id="Pod" >}}がどのように分散されるかを制御できます。
これにより、高可用性と効率的なリソース活用を実現できます。

[クラスターレベルの制約](#cluster-level-default-constraints)をデフォルトとして設定するか、個々のワークロードに対してトポロジー分散制約を設定できます。

<!-- body -->

## 動機

最大20ノードのクラスターがあり、使用するレプリカ数を自動的にスケーリングする{{< glossary_tooltip text="ワークロード" term_id="workload" >}}を実行したいとします。
このワークロードには、2つのPodが存在する場合もあれば、15のPodが存在する場合もあります。
Podが2つだけの場合、単一ノードの障害でワークロードがオフラインになるリスクがあるため、同じノードで両方のPodを実行したくありません。

この基本的な使用方法に加えて、高可用性とクラスターの利用率を向上させるための高度な使用方法があります。

スケールアップしてより多くのPodを実行すると、また別の懸念事項が重要になります。
5つのPodを実行する3つのノードがあるとします。
ノードは該当数のレプリカを実行するために十分なキャパシティを持っていますが、このワークロードとやり取りするクライアントは3つの異なるデータセンター(またはインフラストラクチャゾーン)に分散されています。
単一ノードの障害についての懸念は減りましたが、レイテンシーが予想よりも高く、異なるゾーン間でネットワークトラフィックを送信する際にネットワークコストがかかっていることに気づきます。

通常の運用では、各インフラストラクチャゾーンに同数のレプリカを[スケジュール](/ja/docs/concepts/scheduling-eviction/)し、問題が発生した場合はクラスターが自己修復するようにしたいと考えるでしょう。

Podトポロジー分散制約は、このようなシナリオに対処するための手段を提供します。

## `topologySpreadConstraints`フィールド {#topologyspreadconstraints-field}

Pod APIには、`spec.topologySpreadConstraints`フィールドが含まれています。
このフィールドの使用方法は次のようになります:

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  # トポロジー分散制約を設定
  topologySpreadConstraints:
    - maxSkew: <integer>
      minDomains: <integer> # オプション
      topologyKey: <string>
      whenUnsatisfiable: <string>
      labelSelector: <object>
      matchLabelKeys: <list> # オプション; v1.27以降ベータ
      nodeAffinityPolicy: [Honor|Ignore] # オプション; v1.26以降ベータ
      nodeTaintsPolicy: [Honor|Ignore] # オプション; v1.26以降ベータ
  ### 他のPodのフィールドはここにあります
```

`kubectl explain Pod.spec.topologySpreadConstraints`を実行するか、PodのAPIリファレンスの[scheduling](/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling)セクションを参照して、このフィールドについて詳しく読むことができます。

### 分散制約の定義

クラスター全体の既存のPodに対して、新しいPodをどのように配置するかをkube-schedulerに指示するために、1つまたは複数の`topologySpreadConstraints`エントリを定義できます。
これらのフィールドは次の通りです:

- **maxSkew**は、Podが不均等に分散される程度を表します。
  このフィールドは必須であり、0より大きい数値を指定する必要があります。
  このフィールドのセマンティクスは、`whenUnsatisfiable`の値によって異なります:

  - `whenUnsatisfiable: DoNotSchedule`を選択した場合、`maxSkew`は対象トポロジー内の一致するPodの数と、_グローバル最小値_(適格ドメイン内の一致するPodの最小数、または適格ドメインの数がMinDomainsより少ない場合は0)の間で許容される最大の差を定義します。
    例えば、3つのゾーンがあり、それぞれ2、2、1つの一致するPodがあり`MaxSkew`が1に設定されている場合、グローバル最小値は1です。
  - `whenUnsatisfiable: ScheduleAnyway`を選択した場合、スケジューラーはスキューの削減に役立つトポロジーを優先します。

- **minDomains**は、適格ドメインの最小数を示します。
  このフィールドはオプションです。
  ドメインとは、特定のトポロジーのインスタンスを指します。
  適格ドメインとは、ノードセレクターに一致するノードのドメインを指します。

  <!-- OK to remove this note once v1.29 Kubernetes is out of support -->
  {{< note >}}
  Kubernetes v1.30以前では、`minDomains`フィールドは、`MinDomainsInPodTopologySpread`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates-removed/)が有効になっている場合のみ利用可能でした(v1.28以降はデフォルト)。
  より古いKubernetesクラスターでは、明示的に無効になっているか、フィールドが利用できない場合があります。
  {{< /note >}}

  - `minDomains`の値を指定する場合、その値は0より大きくする必要があります。
    `minDomains`は、`whenUnsatisfiable: DoNotSchedule`と組み合わせてのみ指定できます。
  - トポロジーキーに一致する適格ドメインの数が`minDomains`より少ない場合、Podトポロジー分散はグローバル最小値を0として扱い、`skew`の計算を行います。
    グローバル最小値は、適格ドメイン内の一致するPodの最小数であり、適格ドメインの数が`minDomains`より少ない場合は0になります。
  - トポロジーキーに一致する適格ドメインの数が`minDomains`と等しいかそれ以上の場合、この値はスケジューリングに影響しません。
  - `minDomains`を指定しない場合、制約は`minDomains`が1であるかのように動作します。

- **topologyKey**は[ノードラベル](#node-labels)のキーです。
  このキーと同じ値を持つノードは、同じトポロジー内にあると見なされます。
  トポロジー内の各インスタンス(つまり、<key, value>ペア)をドメインと呼びます。
  スケジューラーは、各ドメインに均等な数のPodを配置しようとします。
  また、適格ドメインはnodeAffinityPolicyとnodeTaintsPolicyの要件を満たすノードのドメインとして定義します。

- **whenUnsatisfiable**は、Podが分散制約を満たさない場合の処理方法を示します:
  - `DoNotSchedule`(デフォルト)は、スケジューラーにスケジュールしないように指示します。
  - `ScheduleAnyway`は、スケジューラーにスキューを最小化するノードを優先してスケジュールするよう指示します。

- **labelSelector**は、一致するPodを見つけるために使用されます。
  このラベルセレクターに一致するPodは、対応するトポロジードメイン内のPodの数を決定するためにカウントされます。
  詳細については、[ラベルセレクター](/ja/docs/concepts/overview/working-with-objects/labels/#label-selectors)を参照してください。

- **matchLabelKeys**は、分散を計算するPodを選択するためのPodラベルキーのリストです。
  このキーは、Podラベルから値を検索するために使用され、これらのkey-valueラベルは`labelSelector`とAND演算され、新しいPodのために分散が計算される既存のPodのグループを選択します。
  同じキーは`matchLabelKeys`と`labelSelector`の両方に存在してはいけません。
  `labelSelector`が設定されていない場合は、`matchLabelKeys`を設定することはできません。
  Podラベルに存在しないキーは無視されます。
  nullまたは空のリストは、`labelSelector`に対してのみ一致します。

  `matchLabelKeys`を使用すると、異なるリビジョン間で`pod.spec`を更新する必要がありません。
  コントローラー/オペレーターは、異なるリビジョンに対して同じラベルキーを異なる値に設定するだけです。
  スケジューラーは、`matchLabelKeys`に基づいて値を自動的に推定します。
  例えばDeploymentを構成する場合、Deploymentコントローラーによって自動的に追加される[pod-template-hash](/ja/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label)をキーとするラベルを使用して、単一のDeployment内の異なるリビジョンを区別できます。

  ```yaml
      topologySpreadConstraints:
          - maxSkew: 1
            topologyKey: kubernetes.io/hostname
            whenUnsatisfiable: DoNotSchedule
            labelSelector:
              matchLabels:
                app: foo
            matchLabelKeys:
              - pod-template-hash
  ```

  {{< note >}}
  `matchLabelKeys`フィールドは、ベータレベルのフィールドであり、1.27でデフォルトで有効になっています。
  `MatchLabelKeysInPodTopologySpread`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を無効にすることで無効にできます。
  {{< /note >}}

- **nodeAffinityPolicy**は、Podのトポロジー分散スキューを計算する際に、PodのnodeAffinity/nodeSelectorをどのように扱うかを示します。
  オプションは次の通りです:
  - Honor: nodeAffinity/nodeSelectorに一致するノードのみが計算に含まれます。
  - Ignore: nodeAffinity/nodeSelectorは無視されます。
    すべてのノードが計算に含まれます。

  この値がnullの場合、動作はHonorポリシーと同等です。

  {{< note >}}
  `nodeAffinityPolicy`はベータレベルのフィールドであり、1.26でデフォルトで有効になっています。
  `NodeInclusionPolicyInPodTopologySpread`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を無効にすることで無効にできます。
  {{< /note >}}

- **nodeTaintsPolicy**は、Podのトポロジー分散スキューを計算する際に、ノードのtaintをどのように扱うかを示します。
  オプションは次の通りです:
  - Honor: taintのないノード、新しいPodがtolerationを持つtaintされたノードが含まれます。
  - Ignore: ノードのtaintは無視されます。
    すべてのノードが含まれます。

  この値がnullの場合、動作はIgnoreポリシーと同等です。

  {{< note >}}
  `nodeTaintsPolicy`はベータレベルのフィールドであり、1.26でデフォルトで有効になっています。
  `NodeInclusionPolicyInPodTopologySpread`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を無効にすることで無効にできます。
  {{< /note >}}

Podに`topologySpreadConstraints`が複数定義されている場合、これらの制約は論理AND演算を使用して結合され、kube-schedulerは新しいPodに対して構成された制約をすべて満たすノードを探します。

### ノードラベル {#node-labels}

トポロジー分散制約は、ノードラベルを使用して、各{{< glossary_tooltip text="ノード" term_id="node" >}}がどのトポロジードメインに属するかを識別します。
例えば、ノードには次のようなラベルがあるかもしれません:
```yaml
  region: us-east-1
  zone: us-east-1a
```

{{< note >}}
簡潔にするため、この例では[well-known](/docs/reference/labels-annotations-taints/)ラベルキーの`topology.kubernetes.io/zone`と`topology.kubernetes.io/region`は使用していません。
ただし、ここで使用されている`region`および`zone`といったプライベート(修飾されていない)ラベルキーよりも、これらの登録済みラベルキーが推奨されます。

異なるコンテキスト間でのプライベートラベルキーの意味について、信頼できる前提として扱うことはできません。
{{< /note >}}


次のラベルを持つ4ノードのクラスターがあるとします:

```
NAME    STATUS   ROLES    AGE     VERSION   LABELS
node1   Ready    <none>   4m26s   v1.16.0   node=node1,zone=zoneA
node2   Ready    <none>   3m58s   v1.16.0   node=node2,zone=zoneA
node3   Ready    <none>   3m17s   v1.16.0   node=node3,zone=zoneB
node4   Ready    <none>   2m43s   v1.16.0   node=node4,zone=zoneB
```

クラスターは論理的には以下のように表されます:

{{<mermaid>}}
graph TB
    subgraph "zoneB"
        n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        n1(Node1)
        n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

## 一貫性

グループ内のすべてのPodに同じトポロジー分散制約を適用する必要があります。 

通常、Deploymentなどのワークロードコントローラーを使用している場合、Podテンプレートがこれを自動的に処理します。
異なる分散制約を混在させると、KubernetesはフィールドのAPI定義に従いますが、その動作は混乱しやすくなりトラブルシューティングがより困難になる可能性があります。

トポロジードメイン(例えばクラウドプロバイダーのリージョン)内のすべてのノードに、一貫してラベルが付与されていることを保証するメカニズムが必要です。
手動でノードにラベルを付与する必要がないように、多くのクラスターは`kubernetes.io/hostname`のようなwell-knownラベルを自動的に設定します。
ご自身のクラスターがこれをサポートしているかどうかを確認してください。

## トポロジー分散制約の例

### 例: 単一のトポロジー分散制約 {#example-one-topologyspreadconstraint}

4ノードのクラスターがあり、`foo: bar`というラベルの付いた3つのPodがそれぞれ node1、node2、node3に配置されているとします:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

新しいPodを既存のPodとゾーン全体に均等に分散したい場合は、次のようなマニフェストを使用できます:

{{% code_sample file="pods/topology-spread-constraints/one-constraint.yaml" %}}

このマニフェストでは、`topologyKey: zone`は`zone: <任意の値>`というラベルが付いたノードにのみ均等に分散が適用されることを意味します(ラベル`zone`がないノードはスキップされます)。
`whenUnsatisfiable: DoNotSchedule`フィールドは、スケジューラーが制約を満たせない場合に、新しいPodを保留状態にするようにスケジューラーに指示します。

スケジューラーがこの新しいPodをゾーン`A`に配置した場合、Podの分布は`[3, 1]`になります。
これは実際のスキューが2(`3 - 1`として計算)であることを意味し、`maxSkew: 1`に違反します。
この例の制約とコンテキストを満たすためには、新しいPodはゾーン`B`のノードにのみ配置される必要があります:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        p4(mypod) --> n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

または

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        p4(mypod) --> n3
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

Podの仕様を調整することで、様々な要件に対応できます:

- `maxSkew`をより大きい値(例えば`2`)に変更すると、新しいPodをゾーン`A`に配置できるようになります。
- `topologyKey`を`node`に変更すると、ゾーン単位ではなくノード単位でPodを均等に分散させるようになります。
  上記の例では、`maxSkew`が`1`のままである場合、新しいPodは`node4`にのみ配置可能です。
- `whenUnsatisfiable: DoNotSchedule`を`whenUnsatisfiable: ScheduleAnyway`に変更すると、新しいPodが常にスケジュール可能になります(他のスケジュールAPIが満たされていると仮定)。
  ただし、一致するPodが少ないトポロジードメインに配置されることが好ましいです。
  (この設定は、リソース使用率などの他の内部スケジューリング優先度と共に正規化されることに注意してください)。

### 例: 複数のトポロジー分散制約 {#example-multiple-topologyspreadconstraints}

これは前の例に基づいています。
4ノードのクラスターがあり、`foo: bar`というラベルの付いた3つのPodがそれぞれ node1、node2、node3に配置されているとします:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

2つのトポロジー分散制約を組み合わせて、ノードとゾーンの両方でPodの分散を制御できます:

{{% code_sample file="pods/topology-spread-constraints/two-constraints.yaml" %}}

この場合、最初の制約に一致させるために、新しいPodはゾーン`B`のノードにのみ配置できます。
一方、2番目の制約に関しては、新しいPodは`node4`にのみスケジュールできます。
スケジューラーは、定義されたすべての制約を満たすオプションのみを考慮するため、有効な配置は`node4`のみです。

### 例: トポロジー分散制約の競合 {#example-conflicting-topologyspreadconstraints}

複数の制約は競合する可能性があります。
2つのゾーンにまたがる3ノードのクラスターがあるとします:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p4(Pod) --> n3(Node3)
        p5(Pod) --> n3
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n1
        p3(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3,p4,p5 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

**この**クラスターに[`two-constraints.yaml`](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/topology-spread-constraints/two-constraints.yaml)(前の例のマニフェスト)を適用すると、Pod `mypod`が`Pending`状態のままであることがわかります。
これは、最初の制約を満たすために、Pod `mypod`はゾーン`B`にしか配置できないのに対して、2番目の制約に関しては、Pod `mypod`はノード`node2`にしかスケジュールできないために発生します。
2つの制約の共通部分として空集合が返され、スケジューラーはPodを配置できません。

この状況を克服するためには、`maxSkew`の値を増やすか、制約の1つを`whenUnsatisfiable: ScheduleAnyway`に変更します。
状況によっては、バグ修正のロールアウトが進まない理由をトラブルシューティングする場合などで、既存のPodを手動で削除することもあります。

#### ノードアフィニティとノードセレクターとの相互作用

新しいPodに`spec.nodeSelector`または`spec.affinity.nodeAffinity`が定義されている場合、スケジューラーは一致しないノードをスキュー計算からスキップします。

### 例: ノードアフィニティを使用したトポロジー分散制約 {#example-topologyspreadconstraints-with-nodeaffinity}

ゾーンAからCにまたがる5ノードクラスターがあるとします:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n1,n2,n3,n4,p1,p2,p3 k8s;
class p4 plain;
class zoneA,zoneB cluster;
{{< /mermaid >}}

{{<mermaid>}}
graph BT
    subgraph "zoneC"
        n5(Node5)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n5 k8s;
class zoneC cluster;
{{< /mermaid >}}

そして、ゾーン`C`を除外する必要があることがわかっているとします。
この場合、以下のようにマニフェストを作成して、Pod `mypod`をゾーン`C`ではなくゾーン`B`に配置することができます。
同様に、Kubernetesは`spec.nodeSelector`を尊重します。

{{% code_sample file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" %}}

## 暗黙的な規則

ここで注目すべき暗黙的な規則がいくつかあります:

- 新しいPodと同じNamespaceを持つPodのみが一致する候補となります。

- スケジューラーは、すべての`topologySpreadConstraints[*].topologyKey`が同時に存在するノードのみを考慮します。
  これらの`topologyKeys`のいずれかが欠落しているノードはバイパスされます。
  これは次のことを意味します:

  1. これらのバイパスされたノードにあるPodは`maxSkew`の計算に影響しません。
      上記の[例](#example-conflicting-topologyspreadconstraints)では、ノード`node1`に"zone"ラベルがない場合、2つのPodは無視され、新しいPodはゾーン`A`にスケジュールされます。
  2. 新しいPodがこれらのノードにスケジュールされる可能性はありません。
     上記の例では、ノード`node5`に**誤字のある**ラベル`zone-typo: zoneC`がある(かつ`zone`ラベルが設定されていない)とします。
     `node5`がクラスターに参加しても、バイパスされ、このワークロードのPodはそのノードにスケジュールされません。

- 新しいPodの`topologySpreadConstraints[*].labelSelector`が自身のラベルと一致しない場合に何が起こるかに注意してください。
  上記の例では、新しいPodのラベルを削除しても、すでに制約が満たされているため、ゾーン`B`のノードに配置できます。
  ただしその配置後、クラスターの不均衡の度合いは変わらず、ゾーン`A`には`foo: bar`というラベルが付いた2つのPodがあり、ゾーン`B`には`foo: bar`というラベルが付いた1つのPodがあります。
  これが期待する動作ではない場合、ワークロードの`topologySpreadConstraints[*].labelSelector`を更新して、Podテンプレート内のラベルと一致するようにします。

## クラスターレベルのデフォルト制約 {#cluster-level-default-constraints}

クラスターにはデフォルトのトポロジー分散制約を設定することができます。
デフォルトのトポロジー分散制約は、次の場合にのみPodに適用されます:

- `.spec.topologySpreadConstraints`に制約が定義されていない。
- PodがService、ReplicaSet、StatefulSet、またはReplicationControllerに属している。

デフォルトの制約は、[スケジューリングプロファイル](/ja/docs/reference/scheduling/config/#profiles)の`PodTopologySpread`プラグイン引数の一部として設定できます。
制約は、[上記のAPI](#topologyspreadconstraints-field)と同じように指定されますが、`labelSelector`は空である必要があります。
Podが属するService、ReplicaSet、StatefulSet、またはReplicationControllerから計算されたセレクターが使用されます。

設定例は次のようになります:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints:
            - maxSkew: 1
              topologyKey: topology.kubernetes.io/zone
              whenUnsatisfiable: ScheduleAnyway
          defaultingType: List
```
### ビルトインのデフォルト制約 {#internal-default-constraints}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Podトポロジー分散のためのクラスターレベルのデフォルト制約を構成しない場合、kube-schedulerは次のデフォルトのトポロジー制約を指定したかのように動作します:

```yaml
defaultConstraints:
  - maxSkew: 3
    topologyKey: "kubernetes.io/hostname"
    whenUnsatisfiable: ScheduleAnyway
  - maxSkew: 5
    topologyKey: "topology.kubernetes.io/zone"
    whenUnsatisfiable: ScheduleAnyway
```

また、同等の動作を提供する従来の`SelectorSpread`プラグインは、デフォルトで無効になっています。

{{< note >}}
`PodTopologySpread`プラグインは、分散制約で指定されていないトポロジーキーを持つノードにスコアをつけません。
これにより、デフォルトのトポロジー制約を使用する場合、従来の`SelectorSpread`プラグインと比較して、デフォルトの動作が異なる場合があります。

ノードに`kubernetes.io/hostname`と`topology.kubernetes.io/zone`ラベルの**両方**が設定されることを想定していない場合、Kubernetesのデフォルトを使用する代わりに独自の制約を定義してください。
{{< /note >}}

クラスターにデフォルトのPod分散制約を使用したくない場合は、`PodTopologySpread`プラグイン構成の`defaultingType`を`List`に設定し、`defaultConstraints`を空のままにすることで、これらのデフォルトを無効にできます:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints: []
          defaultingType: List
```

## podAffinityとpodAntiAffinityとの比較 {#comparison-with-podaffinity-podantiaffinity}

Kubernetesでは、[Pod間のアフィニティとアンチアフィニティ](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)によって、Podがより密集させるか分散させるかといった、Podが互いにどのようにスケジュールされるかを制御できます。

`podAffinity`
: Podを引き付けます。
  適切なトポロジードメインに任意の数のPodを配置できます。

`podAntiAffinity`
: Podを遠ざけます。
  `requiredDuringSchedulingIgnoredDuringExecution`モードに設定すると、単一のトポロジードメインには1つのPodしかスケジュールできません。
  `preferredDuringSchedulingIgnoredDuringExecution`モードに設定すると、この制約を強制できません。

より細かい制御を行うには、トポロジー分散制約を指定して、異なるトポロジードメインにPodを分散させることで、高可用性やコスト削減を実現できます。
またワークロードのローリングアップデートやレプリカのスムーズなスケールアウトにも役立ちます。

詳しくは、Podのトポロジー分散制約に関する機能強化提案の[Motivation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/895-pod-topology-spread#motivation)セクションを参照してください。

## 既知の制限

- Podの削除後も、制約が満たされていることは保証されません。
  例えば、Deploymentのスケールダウンによって、Podの分布が不均衡になる可能性があります。

  Podの分布をリバランスするには、[Descheduler](https://github.com/kubernetes-sigs/descheduler)などのツールを使用できます。
- taintされたノードに一致するPodは優先されます。
  [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)を参照してください。
- スケジューラーは、クラスター内のすべてのゾーンやその他のトポロジードメインを事前に把握しているわけではありません。
  これらはクラスター内の既存のノードから決定されます。
  オートスケールされるクラスターでは、ノードプール(またはノードグループ)が0ノードにスケールされ、クラスターがスケールアップすることを期待している場合に問題が発生する可能性があります。
  この場合、トポロジードメインはその中に少なくとも1つのノードが存在するまで考慮されないためです。

  これを回避するためには、Podのトポロジー分散制約を認識し、全体のトポロジードメインの集合も認識しているノードオートスケーラーを使用することができます。

## {{% heading "whatsnext" %}}

- ブログ記事[Introducing PodTopologySpread](/blog/2020/05/introducing-podtopologyspread/)では、いくつかの高度な使用例を含め、`maxSkew`について詳しく説明しています。
- PodのAPIリファレンスの[scheduling](/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling)セクションを読んでください。
