---
title: アプリケーションにDisruption Budget指定する
content_type: task
weight: 110
min-kubernetes-server-version: v1.21
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

このページでは、アプリケーションで同時に発生するDisruptionの数を制限する方法を説明します。
これによりクラスター管理者は、クラスターのノードを管理しながら、高い可用性を実現できます。

## {{% heading "prerequisites" %}}

{{< version-check >}}

- あなたは、高可用性を必要とするKubernetesクラスター上で実行されているアプリケーションの所有者です。
- [レプリケートされたステートレスアプリケーション](/ja/docs/tasks/run-application/run-stateless-application-deployment/)および/または[レプリケートされたステートフルアプリケーション](/ja/docs/tasks/run-application/run-replicated-stateful-application/)のデプロイ方法を知っておく必要があります。
- [Pod Disruption](/ja/docs/concepts/workloads/pods/disruptions/)について読んでいることが望ましいです。
- クラスターの所有者またはサービスプロバイダーが、Pod Disruption Budgetを重んじていることを確認してください。

<!-- steps -->

## PodDisruptionBudgetを使用してアプリケーションを保護する

1. PodDisruptionBudget(PDB)で保護したいアプリケーションを特定します。
1. アプリケーションがDisruptionにどのように反応するかを検討します。
1. PDB定義をYAMLファイルとして作成します。
1. YAMLファイルからPDBオブジェクトを作成します。

<!-- discussion -->

## 保護するアプリケーションを特定する

ビルトインのKubernetesコントローラーのいずれかによって指定されたアプリケーションを保護する場合の最も一般的なユースケースは次の通りです:

- Deployment
- ReplicationController
- ReplicaSet
- StatefulSet

このケースでは、コントーラーの`.spec.selector`をメモし、同じセレクターをPDBの`.spec.selector`に設定します。

バージョン1.15以降では、PDBは[scale subresource](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource)が有効になっているカスタムコントローラーをサポートします。

上記のコントローラーのいずれかによって制御されていないPodや、任意のPodグループでPDBを使用することもできますが、[任意のワークロードと任意のセレクター](#arbitrary-controllers-and-selectors)で説明されているように、いくつかの制限があります。

## アプリケーションがDisruptionにどのように反応するかを検討する

自発的なDisruptionによって短期間に同時に停止できるインスタンス数を決定してください。

- ステートレスフロントエンド:
  - 留意事項: サービス提供能力を10%以上低下させない。
    - 解決策: 例えば、minAvailable 90%のPDBを使用する。
- 単一インスタンスのステートフルアプリケーション:
  - 留意事項: 相談なしにこのアプリケーションを終了しない。
    - 可能な解決策1: PDBを使用せず、偶発的なダウンタイムを許容する。
    - 可能な解決策2: maxUnavailable=0のPDBを設定する。
      クラスター管理者が終了する前に、あなたに相談する必要があることを(Kubernetesの外部で)理解する。
      クラスター管理者から連絡があれば、ダウンタイムに備え、Disruptionの準備ができたことを示すためにPDBを削除する。
      その後、PDBを再作成する。
- Consul、ZooKeeper、etcdのような複数インスタンスのステートフルアプリケーション:
  - 留意事項: インスタンス数をクォーラム以下に減らない、さもなければ書き込みが失敗する。
    - 可能な解決策1: maxUnavailableを1に設定する(アプリケーションの規模が変化する場合に機能する)。
    - 可能な解決策2: minAvailableをクォーラムサイズ(スケールが5の場合は3)に設定する(一度により多くのDisruptionを許可する)。
- 再起動可能なバッチジョブ:
  - 留意事項: 自発的なDisruptionの場合にジョブが完了する必要がある。
    - 可能な解決策: PDBを作成しない。
      Jobコントローラーが代替Podを作成する。

### パーセンテージを指定する場合の丸めロジック

`minAvailable`または`maxUnavailable`の値は整数またはパーセンテージで表すことができます。

- 整数を指定すると、Podの数を表します。
  インスタンスの`minAvailable`を10に設定すると、Disruptionの間も常に10個のPodが利用可能である必要があります。
- パーセンテージを表現する文字列(例. `"50%"`)によってパーセンテージを指定すると、Podの合計パーセンテージを表します。
  例えば、インスタンスの`minAvailable`を`"50%"`に設定すると、Disruptionの間に少なくとも50%のPodが利用可能である必要があります。

パーセンテージを指定すると、Podの数には正確にマッピングされない場合があります。
例えば、7個のPodがあり`minAvailable`が`"50%"`に設定されている場合、利用可能である必要があるPodの数が3個か4個かはすぐにはわかりません。
Kubernetesは最も近い整数に切り上げるため、このケースでは4個のPodが利用可能である必要があります。
パーセンテージとして`maxUnavailable`の値を指定すると、KubernetesはDisruptionされるPodの数を切り上げます。
その結果、定義された`maxUnavailable`のパーセンテージを超えるDisruptionが発生する可能性があります。
この挙動を制御する[コード](https://github.com/kubernetes/kubernetes/blob/23be9587a0f8677eb8091464098881df939c44a9/pkg/controller/disruption/disruption.go#L539)を確認できます。

## PodDisruptionBudgetを定義する

`PodDisruptionBudget`には3つのフィールドがあります:

- `.spec.selector`ラベルセレクターは、適用されるPodのセットを指定します。
  このフィールドは必須です。
- `.spec.minAvailable`は、退避されたPodがない場合であっても、退避後もそのセットで利用可能である必要があるPodの数を記述します。
  `minAvailable`は絶対数またはパーセンテージのいずれかを指定できます。
- `.spec.maxUnavailable`(Kubernetes 1.7以上で利用可能)は、退避後にそのセットで利用できないことを許容するPodの数を記述します。
  絶対数またはパーセンテージのいずれかを指定できます。

{{< note >}}
policy/v1beta1およびpolicy/v1 APIのPodDisruptionBudgetにおいて、空のセレクターの挙動は異なります。
policy/v1beta1では空のセレクターは0個のPodにマッチしますが、policy/v1では空のセレクターはNamespace内のすべてのPodにマッチします。
{{< /note >}}

単一の`PodDisruptionBudget`には、`maxUnavailable`と`minAvailable`のいずれか1つだけを指定できます。
`maxUnavailable`は、コントローラーによって管理されているPodについてのみ、退避を制御するために使用できます。
以下の例において"理想的なレプリカ数"は、`PodDisruptionBudget`によって選択されるPodを管理しているコントローラーの`scale`です。


例1: `minAvailable`が5に設定されている場合、PodDisruptionBudgetの`selector`によって選択されたPodの中で、少なくとも5つ以上の[健全](#healthiness-of-a-pod)なPodが残る限り、退避が許可されます。

例2: `minAvailable`が30%に設定されている場合、少なくとも理想的なレプリカ数の30%が健全である限り、退避が許可されます。

例3: `maxUnavailable`が5に設定されている場合、理想的なレプリカの総数のうち、不健全なレプリカが最大5つである限り、退避が許可されます。

例4: `maxUnavailable`が30%に設定されている場合、不健全なレプリカ数が、最も近い整数に切り上げられた理想的なレプリカの総数の30%を超えない限り、退避が許可されます。
理想的なレプリカの総数が1の場合、その単一のレプリカも退避可能となり、実質的な利用不可率が100%になります。

通常の用途では、単一のバジェットはコントローラーによって管理されるPodのコレクション(例えば、単一のReplicaSetまたはStatefulSet内のPod)に使用されます。

{{< note >}}
Disruption Budgetは、指定された数/パーセンテージのPodが常に利用可能であることを保証しません。
例えば、コレクションに属するPodをホストしているノードが、バジェットで指定された最小サイズに達しているときに障害を起こすと、コレクション内の利用可能なPodの数が指定されたサイズを下回る可能性があります。
バジェットは、あくまで自発的な退避に対する保護を提供するものであり、すべての可用性を失う原因を防ぐことはできません。
{{< /note >}}

`maxUnavailable`を0%または0に設定するか、`minAvailable`を100%またはレプリカ数に設定すると、自発的な退避を一切要求しません。
この設定をReplicaSetのようなワークロードオブジェクトに適用すると、それらのPodが実行されているノードを正常にドレインできなくなります。
退避できないPodが実行されているノードをドレインしようしても、ドレインは完了しません。
これは`PodDisruptionBudget`の仕様上、正しい挙動です。

以下にPodDisruptionBudgetの例を示します。
これらの例は、ラベル`app: zookeeper`を持つPodに一致します。

minAvailableを使用した例:

{{% code_sample file="policy/zookeeper-pod-disruption-budget-minavailable.yaml" %}}

maxUnavailableを使用した例:

{{% code_sample file="policy/zookeeper-pod-disruption-budget-maxunavailable.yaml" %}}

例えば、上記の`zk-pdb`オブジェクトがサイズ3のStatefulSetのPodを選択する場合、どちらの仕様もまったく同じ意味を持ちます。
`maxUnavailable`の使用が推奨されており、これは対応するコントローラーのレプリカ数の変更に自動的に対応するためです。

## PDBオブジェクトを作成する

kubectlを使用してPDBオブジェクトを作成または更新できます。
```shell
kubectl apply -f mypdb.yaml
```

## PDBのステータスを確認する

kubectlを使用してPDBが作成されたことを確認します。

Namespace内に`app: zookeeper`に一致するPodがないと仮定すると、次のようになります:

```shell
kubectl get poddisruptionbudgets
```
```
NAME     MIN AVAILABLE   MAX UNAVAILABLE   ALLOWED DISRUPTIONS   AGE
zk-pdb   2               N/A               0                     7s
```

一致するPod(例えば3つ)があれば、次のように表示されます:

```shell
kubectl get poddisruptionbudgets
```
```
NAME     MIN AVAILABLE   MAX UNAVAILABLE   ALLOWED DISRUPTIONS   AGE
zk-pdb   2               N/A               1                     7s
```

`ALLOWED DISRUPTIONS`の値がゼロ以外である場合、DisruptionコントローラーはPodを確認し、一致するPodをカウントし、PDBのステータスを更新しています。

PDBのステータスについての詳細情報を取得するには、次のコマンドを使用します:

```shell
kubectl get poddisruptionbudgets zk-pdb -o yaml
```
```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  annotations:
…
  creationTimestamp: "2020-03-04T04:22:56Z"
  generation: 1
  name: zk-pdb
…
status:
  currentHealthy: 3
  desiredHealthy: 2
  disruptionsAllowed: 1
  expectedPods: 3
  observedGeneration: 1
```

### Podの健全性 {#healthiness-of-a-pod}

現在の実装では、`type="Ready"`かつ`status="True"`の`.status.conditions`項目を持つPodが健全なPodと見なされます。
これらのPodは、PDBステータスの`.status.currentHealthy`フィールドで追跡されます。

## 不健全なPodの退避ポリシー

{{< feature-state feature_gate_name="PDBUnhealthyPodEvictionPolicy" >}}

アプリケーションを保護するPodDisruptionBudgetは、健全なPodの退避を許可しないことで、`.status.currentHealthy`のPod数が`.status.desiredHealthy`で指定された数を下回らないようにします。
`.spec.unhealthyPodEvictionPolicy`を使用すると、不健全なPodを退避する基準を定義できます。
ポリシーが指定されていない場合のデフォルトの動作は、`IfHealthyBudget`ポリシーに準じます。

ポリシー:

`IfHealthyBudget`
: Podが実行中(`.status.phase="Running"`)であるがまだ健全ではない場合、保護されたアプリケーションが中断されていない(`.status.currentHealthy`が少なくとも`.status.desiredHealthy`と等しい)場合にのみ退避できます。

: このポリシーによって、すでに中断されているアプリケーションで実行中のPodが健全になる可能性が最も高くなります。
  これは、PDBによって保護されている異常なアプリケーションによってノードのドレインがブロックされる悪影響をもたらします。
  具体的には、(バグや設定ミスによって)Podが`CrashLoopBackOff`状態にあるアプリケーション、または`Ready`条件を正しく報告できないPodがあるアプリケーションが該当します。

`AlwaysAllow`
: Podが実行中(`.status.phase="Running"`)であるがまだ健全ではないPodは、中断されているとみなされ、PDBの基準が満たされているかどうかに関係なく退避されます。

: これは、中断されたアプリケーションで実行中のPodが健全にならない可能性があることを意味します。
  このポリシーによって、クラスター管理者はPDBによって保護されている異常なアプリケーションを簡単に退避できます。
  具体的には、(バグや設定ミスによって)Podが`CrashLoopBackOff`状態にあるアプリケーション、または`Ready`条件を正しく報告できないPodがあるアプリケーションが該当します。

{{< note >}}
`Pending`、`Succeeded`、または`Failed`フェーズのPodは常に退避対象と見なされます。
{{< /note >}}


## 任意のワークロードと任意のセレクター {#arbitrary-controllers-and-selectors}

ビルトインのワークロードリソース(Deployment、ReplicaSet、StatefulSet、ReplicationController)、または`scale`[サブリソース](/ja/docs/concepts/extend-kubernetes/api-extension/custom-resources/#advanced-features-and-flexibility)を実装した{{< glossary_tooltip term_id="CustomResourceDefinition" text="カスタムリソース" >}}でのみPDBを使用し、PDBセレクターがPodを所有するリソースのセレクターと完全に一致する場合は、このセクションをスキップできます。

他のリソースや"オペレーター"に制御されるPodまたはベアPodにおいてもPDBを使用することができますが、次の制限があります:

- `.spec.minAvailable`のみ使用でき、`.spec.maxUnavailable`は使用できません
- `.spec.minAvailable`は整数値のみ使用でき、パーセンテージは使用できません

Kubernetesはサポートされている所有リソースがない場合にPodの合計数を導き出せないため、他の可用性構成を使用することはできません。

セレクターを使用して、ワークロードリソースに属するPodのサブセットまたはスーパーセットを選択できます。
退避APIは、複数のPDBにカバーされるPodの退避を許可しないため、ほとんどのユーザーはセレクターの重複を避けるべきです。
重複するPDBの合理的な使用方法の1つは、Podが1つのPDBから別のPDBに移行している場合です。
