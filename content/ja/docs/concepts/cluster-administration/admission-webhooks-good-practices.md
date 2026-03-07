---
title: Admission Webhookのグッドプラクティス
description: >
  KubernetesにおけるAdmission Webhookの設計とデプロイに関する推奨事項。
content_type: concept
weight: 60
---

<!-- overview -->

このページでは、Kubernetesにおける _Admission Webhook_ の設計に関するグッドプラクティスと考慮事項について説明します。
この情報は、Admission Webhookサーバーを運用するクラスター管理者や、APIリクエストを変更または検証するサードパーティアプリケーションを対象としています。

このページを読む前に、以下の概念について理解していることを確認してください。

* [Admissionコントローラー](/docs/reference/access-authn-authz/admission-controllers/)
* [Admission Webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)

<!-- body -->

## 適切なWebhook設計の重要性 {#why-good-webhook-design-matters}

Admission制御は、Kubernetes APIに対して作成、更新、または削除リクエストが送信されたときに発生します。
Admissionコントローラーは、定義した特定の基準に一致するリクエストをインターセプトします。
これらのリクエストは、Mutating Admission WebhookまたはValidating Admission Webhookに送信されます。
これらのWebhookは、オブジェクト仕様において特定のフィールドが存在することや、特定の許可された値を持つことを保証するために記述されることが多いです。

WebhookはKubernetes APIを拡張するための強力なメカニズムです。
設計が不適切なWebhookは、クラスター内のオブジェクトに対して大きな制御権を持つため、ワークロードの中断を引き起こすことがよくあります。
他のAPI拡張メカニズムと同様に、Webhookはすべてのワークロード、他のWebhook、アドオン、プラグインとの互換性を大規模にテストすることが困難です。

さらに、Kubernetesはリリースごとに、新機能の追加、ベータまたは安定版ステータスへの昇格、非推奨化によってAPIを変更します。
安定版のKubernetes APIでさえ変更される可能性があります。
例えば、`Pod` APIはv1.29で[サイドカーコンテナ](/docs/concepts/workloads/pods/sidecar-containers/)機能を追加するために変更されました。
Kubernetes APIの変更によってKubernetesオブジェクトが破損状態になることはまれですが、以前のバージョンのAPIで正常に動作していたWebhookが、そのAPIのより新しい変更に対応できなくなる場合があります。
これにより、クラスターを新しいバージョンにアップグレードした後に予期しない動作が発生する可能性があります。

このページでは、一般的なWebhookの障害シナリオと、Webhookを慎重かつ丁寧に設計・実装することでそれらを回避する方法について説明します。

## Admission Webhookを使用しているかどうかの確認 {#identify-admission-webhooks}

自分でAdmission Webhookを運用していない場合でも、クラスターで実行しているサードパーティアプリケーションがMutatingまたはValidating Admission Webhookを使用している可能性があります。

クラスターにMutating Admission Webhookが存在するかどうかを確認するには、以下のコマンドを実行してください:

```shell
kubectl get mutatingwebhookconfigurations
```
出力には、クラスター内のMutating Admissionコントローラーが一覧表示されます。

クラスターにValidating Admission Webhookが存在するかどうかを確認するには、以下のコマンドを実行してください:

```shell
kubectl get validatingwebhookconfigurations
```
出力には、クラスター内のValidating Admissionコントローラーが一覧表示されます。

## Admission制御メカニズムの選択 {#choose-admission-mechanism}

Kubernetesには、複数のAdmission制御およびポリシー適用オプションが含まれています。
特定のオプションを使用するタイミングを理解することで、レイテンシーやパフォーマンスの改善、管理オーバーヘッドの削減、バージョンアップグレード時の問題の回避に役立ちます。
以下の表は、Admission時にリソースをミューテーションまたはバリデーションするためのメカニズムを示しています。

<!-- This table is HTML because it uses unordered lists for readability. -->
<table>
  <caption>KubernetesにおけるMutatingおよびValidating Admission制御</caption>
  <thead>
    <tr>
      <th>メカニズム</th>
      <th>説明</th>
      <th>ユースケース</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="/docs/reference/access-authn-authz/extensible-admission-controllers/">Mutating Admission Webhook</a></td>
      <td>Admission前にAPIリクエストをインターセプトし、カスタムロジックを使用して必要に応じて変更します。</td>
      <td><ul>
        <li>リソースのAdmission前に行う必要がある重要な変更を行う。</li>
        <li>外部APIの呼び出しなど、高度なロジックを必要とする複雑な変更を行う。</li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/docs/reference/access-authn-authz/mutating-admission-policy/">Mutating Admission Policy</a></td>
      <td>Admission前にAPIリクエストをインターセプトし、Common Expression Language(CEL)式を使用して必要に応じて変更します。</td>
      <td><ul>
        <li>リソースのAdmission前に行う必要がある重要な変更を行う。</li>
        <li>ラベルやレプリカ数の調整など、単純な変更を行う。</li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/docs/reference/access-authn-authz/extensible-admission-controllers/">Validating Admission Webhook</a></td>
      <td>Admission前にAPIリクエストをインターセプトし、複雑なポリシー宣言に対してバリデーションします。</td>
      <td><ul>
        <li>リソースのAdmission前に重要な設定をバリデーションする。</li>
        <li>Admission前に複雑なポリシーロジックを適用する。</li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/docs/reference/access-authn-authz/validating-admission-policy/">Validating Admission Policy</a></td>
      <td>Admission前にAPIリクエストをインターセプトし、CEL式に対してバリデーションします。</td>
      <td><ul>
        <li>リソースのAdmission前に重要な設定をバリデーションする。</li>
        <li>CEL式を使用してポリシーロジックを適用する。</li>
      </ul></td>
    </tr>
  </tbody>
</table>

一般的に、拡張可能な方法でロジックを宣言または設定したい場合は、_Webhook_ Admission制御を使用してください。
Webhookサーバーの運用オーバーヘッドなしで、より単純なロジックを宣言したい場合は、組み込みのCELベースのAdmission制御を使用してください。
Kubernetesプロジェクトでは、可能な場合はCELベースのAdmission制御を使用することを推奨しています。

### CustomResourceDefinitionには組み込みのバリデーションとデフォルト値設定を使用する {#no-crd-validation-defaulting}

{{< glossary_tooltip text="CustomResourceDefinition" term_id="customresourcedefinition" >}}を使用している場合、CustomResourceの仕様の値をバリデーションしたり、フィールドのデフォルト値を設定したりするためにAdmission Webhookを使用しないでください。
KubernetesではCustomResourceDefinitionを作成する際に、バリデーションルールとデフォルトフィールド値を定義できます。

詳細については、以下のリソースを参照してください。

* [バリデーションルール](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
* [デフォルト値設定](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#defaulting)

## パフォーマンスとレイテンシー {#performance-latency}

このセクションでは、パフォーマンスの改善とレイテンシーの削減に関する推奨事項を説明します。
要約すると、以下の通りです:

* Webhookを統合し、WebhookあたりのAPI呼び出し数を制限する。
* 監査ログを使用して、同じアクションを繰り返し実行するWebhookを確認する。
* Webhookの可用性のためにロードバランシングを使用する。
* 各Webhookに小さなタイムアウト値を設定する。
* Webhook設計時にクラスターの可用性要件を考慮する。

### 低レイテンシーのAdmission Webhookを設計する {#design-admission-webhooks-low-latency}

Mutating Admission Webhookは順番に呼び出されます。
Mutating Webhookの設定によっては、一部のWebhookが複数回呼び出される場合があります。
Mutating Webhookの呼び出しのたびに、Admissionプロセスにレイテンシーが加わります。
これは、並列で呼び出されるValidating Webhookとは異なります。

Mutating Webhookを設計する際は、レイテンシーの要件と許容範囲を考慮してください。
クラスター内のMutating Webhookが多いほど、レイテンシーが増加する可能性が高まります。

レイテンシーを削減するために、以下を検討してください:

* 異なるオブジェクトに対して同様のミューテーションを実行するWebhookを統合する。
* Mutating Webhookサーバーロジック内のAPI呼び出し数を削減する。
* 各Mutating Webhookのマッチ条件を制限し、特定のAPIリクエストでトリガーされるWebhookの数を減らす。
* 小さなWebhookは一つののサーバーと設定にまとめて、順序管理や整理をしやすくする。

### 競合するコントローラーによるループを防止する {#prevent-loops-competing-controllers}

Webhookが行うミューテーションと競合する可能性のある、クラスター内で実行されている他のコンポーネントを考慮してください。
例えば、Webhookがラベルを追加し、別のコントローラーがそのラベルを削除する場合、Webhookが再度呼び出されます。
これによりループの発生につながります。

これらのループを検出するには、以下を試してください:

1.  クラスターの監査ポリシーを更新して、監査イベントをログに記録します。
    以下のパラメーターを使用してください:

      * `level`: `RequestResponse`
      * `verbs`: `["patch"]`
      * `omitStages`: `RequestReceived`

    Webhookがミューテーションする特定のリソースに対してイベントを作成するように監査ルールを設定します。

1.  同じパッチが同じオブジェクトに複数回適用されたり、オブジェクトのフィールドが複数回更新と復元を繰り返したりしていないか、監査イベントを確認します。

### 小さなタイムアウト値を設定する {#small-timeout}

Admission Webhookは、APIリクエストのレイテンシーに影響を与えるため、可能な限り迅速に(通常ミリ秒単位で)評価する必要があります。
Webhookには小さなタイムアウトを使用してください。

詳細については、[タイムアウト](/docs/reference/access-authn-authz/extensible-admission-controllers/#timeouts)を参照してください。

### ロードバランサーを使用してWebhookの可用性を確保する {#load-balancer-webhook}

Admission Webhookは、高可用性とパフォーマンス上の利点を提供するために、何らかの形式のロードバランシングを活用する必要があります。
Webhookがクラスター内で実行されている場合、`ClusterIP`タイプのServiceの背後で複数のWebhookバックエンドを実行できます。

### 高可用性のデプロイメントモデルを使用する {#ha-deployment}

Webhookを設計する際は、クラスターの可用性要件を考慮してください。
例えば、ノードのダウンタイムやゾーン障害が発生した場合、Kubernetesはロードバランサーが利用可能なゾーンやノードにトラフィックを再ルーティングできるように、Podを`NotReady`としてマークします。
これらのPodへの更新がMutating Webhookをトリガーする可能性があります。
影響を受けるPodの数によっては、Mutating Webhookサーバーがタイムアウトしたり、Podの処理に遅延が発生したりするリスクがあります。
その結果、必要なタイミングでトラフィックを素早く切り替えられなくなる可能性があります。

前述の例のような状況を念頭に置いて、Webhookを実装してください。
Kubernetesが避けられない障害に対応する際に発生する操作は、Webhookの対象から外してください。

## リクエストフィルタリング {#request-filtering}

このセクションでは、特定のWebhookをトリガーするリクエストのフィルタリングに関する推奨事項について説明します。
要約すると、以下の通りです:

* システムコンポーネントや読み取り専用のリクエストを除くよう、Webhookのスコープを絞り込む。
* Webhookを特定の名前空間に制限する。
* マッチ条件を使用して、きめ細かいリクエストフィルタリングを行う。
* オブジェクトのすべてのバージョンにマッチさせる。

### 各Webhookのスコープを制限する {#webhook-limit-scope}

Admission Webhookは、APIリクエストが対応するWebhook設定に一致した場合にのみ呼び出されます。
各Webhookのスコープを制限して、Webhookサーバーへの不要な呼び出しを減らしてください。
以下のスコープ制限を検討してください:

* `kube-system`名前空間のオブジェクトにマッチさせることを避けてください。
  `kube-system`名前空間で独自のPodを実行している場合は、[`objectSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-objectselector)を使用して、重要なワークロードのミューテーションを避けてください。
* `kube-node-lease`システム名前空間にLeaseオブジェクトとして存在するノードリースをミューテーションしないでください。
  ノードリースをミューテーションすると、ノードのアップグレードの失敗につながる可能性があります。
  この名前空間のLeaseオブジェクトにバリデーション制御を適用するのは、その制御がクラスターをリスクにさらさないと確信できる場合のみにしてください。
* TokenReviewやSubjectAccessReviewオブジェクトをミューテーションしないでください。
  これらは常に読み取り専用のリクエストです。
  これらのオブジェクトを変更すると、クラスターが破損する可能性があります。
* [`namespaceSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector)を使用して、各Webhookを特定の名前空間に制限してください。

### マッチ条件を使用して特定のリクエストをフィルタリングする {#filter-match-conditions}

Admissionコントローラーは、特定の基準を満たすリクエストにマッチさせるために使用可能な複数のフィールドをサポートしています。
例えば、`namespaceSelector`を使用して、特定の名前空間を対象とするリクエストをフィルタリングできます。

よりきめ細かいリクエストフィルタリングには、Webhook設定の`matchConditions`フィールドを使用してください。
このフィールドでは、リクエストがAdmission Webhookをトリガーするために`true`と評価される必要がある複数のCEL式を記述できます。
`matchConditions`を使用すると、Webhookサーバーへの呼び出し数を大幅に削減できる場合があります。

詳細については、[リクエストのマッチング: `matchConditions`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchconditions)を参照してください。

### APIのすべてのバージョンにマッチさせる {#match-all-versions}

デフォルトでは、Admission Webhookは指定されたリソースに影響するすべてのAPIバージョンで実行されます。
Webhook設定の`matchPolicy`フィールドがこの動作を制御します。
`matchPolicy`フィールドに`Equivalent`の値を指定するか、フィールドを省略して、Webhookが任意のAPIバージョンで実行されるようにしてください。

詳細については、[リクエストのマッチング: `matchPolicy`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy)を参照してください。

## ミューテーションのスコープとフィールドの考慮事項 {#mutation-scope-considerations}

このセクションでは、ミューテーションのスコープと、オブジェクトフィールドを扱う際の注意点についての推奨事項について説明します。
要約すると、以下の通りです:

* パッチが必要なフィールドのみをパッチする。
* 配列の値を上書きしない。
* 可能な限り、ミューテーションにおける副作用を避ける。
* 自己ミューテーションを避ける。
* 失敗時はリクエストを拒否せず、最終状態をバリデーションする。
* 将来のバージョンでのフィールド更新を計画する。
* Webhookの自己トリガーを防止する。
* イミュータブルなオブジェクトを変更しない。

### 必要なフィールドのみをパッチする {#patch-required-fields}

Admission Webhookサーバーは、特定のKubernetes APIリクエストに対する処理内容をHTTPレスポンスで返します。
このレスポンスはAdmissionReviewオブジェクトです。
Mutating Webhookは、レスポンス内の`patchType`フィールドと`patch`フィールドを使用して、Admissionを許可する前にミューテーションする特定のフィールドを追加できます。
変更が必要なフィールドのみを変更するようにしてください。

例えば、`web-server` Deploymentが少なくとも3つのレプリカを持つことを保証するように設定されたMutating Webhookを考えてみてください。
Deploymentオブジェクトの作成リクエストがWebhook設定に一致した場合、Webhookは`spec.replicas`フィールドの値のみを更新する必要があります。

### 配列の値を上書きしない {#dont-overwrite-arrays}

Kubernetesオブジェクト仕様のフィールドには、配列が含まれる場合があります。
一部の配列はkey:valueペアを含み(コンテナ仕様の`envVar`フィールドなど)、他の配列はキーなしです(Pod仕様の`readinessGates`フィールドなど)。
配列フィールドの値の順序が重要な場合があります。
例えば、コンテナ仕様の`args`フィールドの引数の順序は、コンテナに影響を与える可能性があります。

配列を変更する際は、以下を考慮してください:

* 必要な値を誤って置き換えることを避けるため、可能な限り、`replace`の代わりに`add` JSONPatch操作を使用してください。
* key:valueペアを使用しない配列をセットとして扱ってください。
* 変更するフィールドの値が特定の順序である必要がないことを確認してください。
* 絶対に必要な場合を除き、既存のkey:valueペアを上書きしないでください。
* ラベルフィールドを変更する際は注意してください。
  誤った変更により、ラベルセレクターが壊れ、意図しない挙動が発生する可能性があります。

### 副作用を避ける {#avoid-side-effects}

Webhookは、送信されたAdmissionReviewの内容に対してのみ動作し、それ以外の箇所への変更を行わないようにしてください。
これらの追加の変更は _副作用_ と呼ばれ、適切に調整されない場合、Admission中に競合を引き起こす可能性があります。
Webhookに副作用がない場合、`.webhooks[].sideEffects`フィールドを`None`に設定する必要があります。

Admissionの評価中に副作用が必要な場合、`dryRun`が`true`に設定されたAdmissionReviewオブジェクトの処理時には副作用を抑制する必要があり、`.webhooks[].sideEffects`フィールドを`NoneOnDryRun`に設定する必要があります。

詳細については、[副作用](/docs/reference/access-authn-authz/extensible-admission-controllers/#side-effects)を参照してください。

### 自己ミューテーションを避ける {#avoid-self-mutation}

クラスター内で実行されているWebhookは、自身のPodの起動に必要なリソースをインターセプトするように設定されている場合、自身のDeploymentに対してデッドロックを引き起こす可能性があります。

例えば、Mutating Admission Webhookが、特定のラベル(`env: prod`など)がPodに設定されている場合にのみPodの**create**リクエストを許可するように設定されているとします。
Webhookサーバーは、`env`ラベルを設定していないDeploymentで実行されています。

Webhookサーバーのpodを実行しているノードが異常になった場合、Webhook Deploymentは別のノードにPodを再スケジュールしようとします。
しかし、`env`ラベルが設定されていないため、既存のWebhookサーバーがリクエストを拒否します。
その結果、移行が行えなくなります。

Webhookが実行されている名前空間を[`namespaceSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector)で除外してください。

### 依存関係のループを避ける {#avoid-dependency-loops}

以下のようなシナリオで、依存関係のループが発生する可能性があります:

* 2つのWebhookが互いのPodをチェックしている場合。
  両方のWebhookが同時に利用不可になると、どちらのWebhookも起動できません。
* Webhookが、Webhook自身が依存しているネットワークプラグインやストレージプラグインなどのクラスターアドオンコンポーネントをインターセプトしている場合。
  Webhookと依存するアドオンの両方が利用不可になると、どちらのコンポーネントも機能しなくなります。

これらの依存関係のループを避けるには、以下を試してください:

* 依存関係の導入を避けるために、[ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/)を使用してください。
* Webhookが他のWebhookをバリデーションまたはミューテーションすることを防止してください。
  Webhookのトリガーから[特定の名前空間を除外する](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector)ことを検討してください。
* [`objectSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-objectselector)を使用して、Webhookが依存するアドオンに作用することを防止してください。

### 失敗時は拒否せず、最終状態をバリデーションする {#fail-open-validate-final-state}

Mutating Admission Webhookは`failurePolicy`設定フィールドをサポートしています。
このフィールドは、Webhookが失敗した場合に、APIサーバーがリクエストを許可するか拒否するかを示します。
Webhookの失敗は、タイムアウトやサーバーロジックのエラーによって発生する可能性があります。

デフォルトでは、Admission Webhookは`failurePolicy`フィールドをFailに設定します。
この場合、Webhookが失敗した場合、APIサーバーはリクエストを拒否します。
しかし、デフォルトでリクエストを拒否すると、Webhookのダウンタイム中、ポリシーに準拠したリクエストが拒否される可能性があります。

Mutating Webhookの`failurePolicy`フィールドをIgnoreに設定して、エラー時でもリクエストを通すようにしてください。
バリデーションコントローラーを使用して、リクエストの状態がポリシーに準拠していることを確認してください。

このアプローチには以下の利点があります:

* Mutating Webhookのダウンタイムが、ポリシーに準拠したリソースのデプロイに影響しない。
* ポリシーの適用がValidating Admission制御中に行われる。
* Mutating Webhookがクラスター内の他のコントローラーに干渉しない。

### 将来的なフィールド更新を計画する {#plan-future-field-updates}

一般的に、Kubernetes APIが将来のバージョンで変更される可能性があるという前提でWebhookを設計してください。
APIの安定性を当然のものとして扱うサーバーを記述しないでください。
例えば、Kubernetesにおけるサイドカーコンテナのリリースにより、Pod APIに`restartPolicy`フィールドが追加されました。

### Webhookの自己トリガーを防止する {#prevent-webhook-self-trigger}

広範なAPIリクエストに応答するMutating Webhookは、意図せず自身をトリガーする可能性があります。
例えば、クラスター内のすべてのリクエストに応答するWebhookを考えてみてください。
Webhookをすべてのミューテーションに対してEventオブジェクトを作成するように設定した場合、自身のEventオブジェクト作成リクエストにも応答してしまいます。

これを避けるには、Webhookが作成するリソースに一意のラベルを設定することを検討してください。
Webhookのマッチ条件からこのラベルを除外してください。

### イミュータブルなオブジェクトを変更しない {#dont-change-immutable-objects}

APIサーバー内の一部のKubernetesオブジェクトは変更できません。
例えば、{{< glossary_tooltip text="静的Pod" term_id="static-pod" >}}をデプロイすると、ノード上のkubeletは静的Podを追跡するため、APIサーバーに{{< glossary_tooltip text="ミラーPod" term_id="mirror-pod" >}}を作成します。
しかし、ミラーPodへの変更は静的Podには反映されません。

Admission中にこれらのオブジェクトをミューテーションしようとしないでください。
すべてのミラーPodには`kubernetes.io/config.mirror`アノテーションが付与されています。
アノテーションを無視するセキュリティリスクを軽減しつつ、ミラーPodを除外するには、静的Podが特定の名前空間でのみ実行されるようにしてください。

## Mutating Webhookの順序と冪等性 {#ordering-idempotence}

このセクションでは、Webhookの順序と冪等なWebhookの設計に関する推奨事項を説明します。
要約すると、以下の通りです:

* 特定の実行順序に依存しない。
* Admission前にミューテーションをバリデーションする。
* 他のコントローラーによるミューテーションの上書きを確認する。
* 個々のWebhookだけでなく、Mutating Webhookのセット全体が冪等であることを確認する。

### Mutating Webhookの呼び出し順序に依存しない {#dont-rely-webhook-order}

Mutating Admission Webhookは一貫した順序で実行されません。
さまざまな要因により、特定のWebhookが呼び出されるタイミングが変わる可能性があります。
Webhookがadmissionプロセスの特定のポイントで実行されることに依存しないでください。
他のWebhookが変更後のオブジェクトをさらにミューテーションする可能性があります。

以下の推奨事項は、意図しない変更のリスクを最小限に抑えるのに役立つ可能性があります:

* [Admission前にミューテーションをバリデーションする](#validate-mutations)
* 再呼び出しポリシーを使用して、他のプラグインによるオブジェクトの変更を監視し、必要に応じてWebhookを再実行する。
  詳細については、[再呼び出しポリシー](/docs/reference/access-authn-authz/extensible-admission-controllers/#reinvocation-policy)を参照してください。

### クラスター内のMutating Webhookが冪等であることを確認する {#ensure-mutating-webhook-idempotent}

すべてのMutating Admission Webhookは _冪等_ である必要があります。
Webhookは、すでに変更したオブジェクトに対して、元の変更を超える追加の変更を行わずに実行できる必要があります。

さらに、クラスター内のすべてのMutating Webhookは、全体として捉えたときに冪等である必要があります。
Admission制御のミューテーションフェーズが終了した後、すべての個々のMutating Webhookがオブジェクトに対して追加の変更を行わずに実行できる必要があります。

環境によっては、大規模に冪等性を確保することが困難な場合があります。
以下の推奨事項が役立つかもしれません:

* Validating Admissionコントローラーを使用して、重要なワークロードの最終状態を検証する。
* ステージングクラスターでデプロイメントをテストして、同じWebhookによってオブジェクトが複数回変更されていないか確認する。
* 各Mutating Webhookのスコープが具体的かつ限定的であることを確認する。

以下の例は、冪等なミューテーションロジックを示しています:

1. Podの**create**リクエストに対して、Podの`.spec.securityContext.runAsNonRoot`フィールドをtrueに設定する。

1. Podの**create**リクエストに対して、コンテナの`.spec.containers[].resources.limits`フィールドが設定されていない場合、デフォルトのリソース制限を設定する。

1. Podの**create**リクエストに対して、`foo-sidecar`という名前のコンテナがまだ存在しない場合、`foo-sidecar`という名前のサイドカーコンテナを注入する。

これらのケースでは、Webhookは安全に再呼び出しできるか、すでにフィールドが設定されているオブジェクトを許可できます。

以下の例は、冪等でないミューテーションロジックを示しています:

1. Podの**create**リクエストに対して、現在のタイムスタンプをサフィックスとした`foo-sidecar`という名前のサイドカーコンテナを注入する(`foo-sidecar-19700101-000000`など)。

   Webhookを再呼び出しすると、同じサイドカーが毎回異なるコンテナ名でPodに複数回注入される可能性があります。
   同様に、ユーザーが提供したPodにすでにサイドカーが存在する場合、Webhookは重複するコンテナを注入する可能性があります。

1. Podの**create**/**update**リクエストに対して、Podに`env`ラベルが設定されている場合は拒否し、そうでなければ`env: prod`ラベルをPodに追加する。

   Webhookを再呼び出しすると、Webhookは自身の出力に対して失敗します。

1. Podの**create**リクエストに対して、`foo-sidecar`コンテナが存在するかどうかを確認せずに、`foo-sidecar`という名前のサイドカーコンテナを追加する。

   Webhookを再呼び出しすると、Pod内にコンテナが重複し、リクエストが無効になってAPIサーバーに拒否されます。

## ミューテーションのテストとバリデーション {#mutation-testing-validation}

このセクションでは、Mutating Webhookのテストとミューテーションされたオブジェクトのバリデーションに関する推奨事項について説明します。
要約すると、以下の通りです:

* ステージング環境でWebhookをテストする。
* バリデーションに違反するミューテーションを避ける。
* マイナーバージョンのアップグレードで回帰と競合をテストする。
* Admission前にミューテーションされたオブジェクトをバリデーションする。

### ステージング環境でWebhookをテストする {#test-in-staging-environments}

堅牢なテストは、新規または更新されたWebhookのリリースサイクルの中核となる部分です。
可能であれば、クラスターのWebhookへの変更を、本番クラスターに近いステージング環境でテストしてください。
少なくとも、[minikube](https://minikube.sigs.k8s.io/docs/)や[kind](https://kind.sigs.k8s.io/)などのツールを使用して、Webhookの変更用の小さなテストクラスターを作成することを検討してください。

### ミューテーションがバリデーションに違反しないことを確認する {#ensure-mutations-dont-violate-validations}

Mutating Webhookは、Admission前にオブジェクトに適用されるバリデーションを壊してはなりません。
例えば、PodのデフォルトCPUリクエストを特定の値に設定するMutating Webhookを考えてみてください。
そのPodのCPU制限がミューテーションされたリクエストよりも低い値に設定されている場合、PodはAdmissionに失敗します。

すべてのMutating Webhookを、クラスターで実行されるバリデーションに対してテストしてください。

### マイナーバージョンのアップグレードをテストして一貫した動作を確認する {#test-minor-version-upgrades}

本番クラスターを新しいマイナーバージョンにアップグレードする前に、ステージング環境でWebhookとワークロードをテストしてください。
結果を比較して、アップグレード後もWebhookが期待通りに機能し続けることを確認してください。

さらに、API変更に関する情報を得るために、以下のリソースを活用してください:

* [Kubernetesリリースノート](/releases/)
* [Kubernetesブログ](/blog/)

### Admission前にミューテーションをバリデーションする {#validate-mutations}

Mutating Webhookは、Validating Webhookが実行される前にすべて完了します。
ミューテーションがオブジェクトに適用される安定した順序はありません。
その結果、後から実行されるMutating Webhookによってミューテーションが上書きされる可能性があります。

ValidatingAdmissionWebhookやValidatingAdmissionPolicyなどのValidating Admissionコントローラーをクラスターに追加して、ミューテーションが引き続き存在することを確認してください。
例えば、特定のInitコンテナをサイドカーコンテナとして実行するために`restartPolicy: Always`フィールドを挿入するMutating Webhookを考えてみてください。
すべてのミューテーションが完了した後、それらのInitコンテナが`restartPolicy: Always`の設定を保持していることを確認するValidating Webhookを実行できます。

詳細については、以下のリソースを参照してください:

* [Validating Admissionポリシー](/docs/reference/access-authn-authz/validating-admission-policy/)
* [ValidatingAdmissionWebhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)

## Mutating Webhookのデプロイ {#mutating-webhook-deployment}

このセクションでは、Mutating Admission Webhookのデプロイに関する推奨事項について説明します。
要約すると、以下の通りです:

* Webhook設定を段階的にロールアウトし、名前空間ごとに問題を監視する。
* Webhook設定リソースの編集アクセス権限を制限する。
* Webhookサーバーがクラスター内にある場合は、その名前空間へのアクセスを制限する。

### Mutating Webhookのインストールと有効化 {#install-enable-mutating-webhook}

Mutating Webhookをクラスターにデプロイする準備ができたら、以下の手順で作業を進めてください。

1.  Webhookサーバーをインストールして起動する。
1.  MutatingWebhookConfigurationマニフェストの`failurePolicy`フィールドをIgnoreに設定する。
    これにより、設定が誤ったWebhookによる中断を回避できます。
1.  MutatingWebhookConfigurationマニフェストの`namespaceSelector`フィールドをテスト用の名前空間に設定する。
1.  MutatingWebhookConfigurationをクラスターにデプロイする。

テスト用の名前空間でWebhookを監視して問題がないか確認し、その後他の名前空間にロールアウトしてください。
Webhookがインターセプトする意図のないAPIリクエストをインターセプトしてしまった場合は、ロールアウトを一時停止してWebhook設定のスコープを調整してください。

### Mutating Webhookへの編集アクセス権限を制限する {#limit-edit-access}

Mutating Webhookは強力なKubernetesコントローラーです。
RBACまたは他の認可メカニズムを使用して、Webhook設定とサーバーへのアクセスを制限してください。
RBACの場合、以下のアクセスが信頼できるエンティティにのみ利用可能であることを確認してください。

* 操作: **create**、**update**、**patch**、**delete**、**deletecollection**
* APIグループ: `admissionregistration.k8s.io/v1`
* API種類: MutatingWebhookConfigurations

Mutating Webhookサーバーがクラスター内で実行されている場合は、その名前空間内でのリソースの作成または変更へのアクセスを制限してください。

## 適切な実装の例 {#example-good-implementations}

{{% thirdparty-content %}}

以下のプロジェクトは、「適切な」カスタムWebhookサーバー実装の例です。
Webhookを設計する際の出発点として使用できます。
ただし、これらの例をそのまま使用しないでください。
出発点として使用し、特定の環境で適切に動作するようにWebhookを設計してください。

* [`cert-manager`](https://github.com/cert-manager/cert-manager/tree/master/internal/webhook)
* [Gatekeeper Open Policy Agent(OPA)](https://open-policy-agent.github.io/gatekeeper/website/docs/mutation)

## {{% heading "whatsnext" %}}

* [認証と認可にWebhookを使用する](/docs/reference/access-authn-authz/webhook/)
* [MutatingAdmissionPolicyについて学ぶ](/docs/reference/access-authn-authz/mutating-admission-policy/)
* [ValidatingAdmissionPolicyについて学ぶ](/docs/reference/access-authn-authz/validating-admission-policy/)