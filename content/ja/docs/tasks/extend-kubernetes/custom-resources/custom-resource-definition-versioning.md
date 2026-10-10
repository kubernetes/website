---
title: CustomResourceDefinitionのバージョン
content_type: task
weight: 30
min-kubernetes-server-version: v1.16
---

<!-- overview -->
このページでは、[CustomResourceDefinition](/docs/reference/kubernetes-api/extend-resources/custom-resource-definition-v1/)にバージョン情報を追加する方法を説明します。
バージョン情報は、CustomResourceDefinitionの安定性レベルを示したり、API表現間の変換を伴う新しいバージョンへAPIを進化させたりするために使用します。
また、オブジェクトをあるバージョンから別のバージョンにアップグレードする方法についても説明します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

[カスタムリソース](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)についての基本的な理解が必要です。

{{< version-check >}}

<!-- steps -->

## 概要 {#overview}

CustomResourceDefinition APIは、CustomResourceDefinitionの新しいバージョンを導入してアップグレードするためのワークフローを提供します。

CustomResourceDefinitionが作成されると、最初のバージョンがCustomResourceDefinitionの`spec.versions`リストに適切な安定性レベルとバージョン番号で設定されます。
例えば、`v1beta1`は最初のバージョンがまだ安定していないことを示します。
すべてのカスタムリソースオブジェクトは、最初はこのバージョンで保存されます。

CustomResourceDefinitionが作成されると、クライアントは`v1beta1` APIを使い始められます。

後に`v1`などの新しいバージョンを追加する必要が生じることがあります。

新しいバージョンを追加する手順:

1. 変換戦略を選択します。
   カスタムリソースオブジェクトは両方のバージョンで提供できる必要があるため、保存されているバージョンとは異なるバージョンで提供される場合があります。
   これを実現するために、カスタムリソースオブジェクトを保存バージョンと提供バージョンの間で変換する必要がある場合があります。
   変換にスキーマの変更が伴い、カスタムロジックが必要な場合は、Conversion Webhookを使用してください。
   スキーマの変更がない場合は、デフォルトの`None`変換戦略を使用でき、異なるバージョンを提供する際に`apiVersion`フィールドのみが変更されます。
1. Coversion Webhookを使用する場合は、Coversion Webhookを作成してデプロイします。
   詳細は [Webhook Coversion](#webhook-conversion)を参照してください。
1. CustomResourceDefinitionを更新して、`spec.versions`リストに`served:true`を設定した新しいバージョンを追加します。
   また、`spec.conversion`フィールドを選択した変換戦略に設定します。
   Conversion Webhookを使用する場合は、`spec.conversion.webhookClientConfig`フィールドをWebhookを呼び出すように設定します。

新しいバージョンが追加されると、クライアントは段階的に新しいバージョンへ移行できます。
一部のクライアントが古いバージョンを使用し、他のクライアントが新しいバージョンを使用することは問題ありません。

保存されているオブジェクトを新しいバージョンに移行する手順:

1. [既存のオブジェクトを新しい保存バージョンにアップグレードする](#upgrade-existing-objects-to-a-new-stored-version)セクションを参照してください。

オブジェクトを新しい保存バージョンにアップグレードする前、最中、および後でも、クライアントが古いバージョンと新しいバージョンの両方を使用することは安全です。

古いバージョンを削除する手順:

1. すべてのクライアントが新しいバージョンに完全に移行したことを確認します。
   kube-apiserverのログを確認することで、古いバージョンを使用してアクセスしているクライアントを特定できます。
1. 古いバージョンの`served`を`spec.versions`リストで`false`に設定します。
   まだ古いバージョンを使用しているクライアントがある場合、古いバージョンでカスタムリソースオブジェクトにアクセスしようとするとエラーが報告されます。
   その場合は、古いバージョンで`served:true`に戻し、残りのクライアントを新しいバージョンに移行してから、この手順を繰り返してください。
1. [既存のオブジェクトを新しい保存バージョンにアップグレードする](#upgrade-existing-objects-to-a-new-stored-version)手順が完了していることを確認します。
   1. CustomResourceDefinitionの`spec.versions`リストで、新しいバージョンの`storage`が`true`に設定されていることを確認します。
   1. 古いバージョンがCustomResourceDefinitionの`status.storedVersions`にリストされていないことを確認します。
1. CustomResourceDefinitionの`spec.versions`リストから古いバージョンを削除します。
1. Conversion Webhookでの古いバージョンに対する変換サポートを削除します。

## 複数バージョンの指定 {#specify-multiple-versions}

CustomResourceDefinition APIの`versions`フィールドは、開発したカスタムリソースの複数バージョンをサポートするために使用できます。
バージョンごとに異なるスキーマを持つことができ、Conversion Webhookによってカスタムリソースをバージョン間で変換できます。
Webhook Conversionは、適用可能な箇所では[Kubernetes API規約](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-architecture/api-conventions.md)に従ってください。
特に、注意事項と提案についての[API変更ドキュメント](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-architecture/api_changes.md)を参照してください。

{{< note >}}
`apiextensions.k8s.io/v1beta1`では、`versions`の代わりに`version`フィールドがありました。
`version`フィールドは非推奨でオプションですが、空でない場合は`versions`フィールドの最初の項目と一致する必要があります。
{{< /note >}}

この例では、2つのバージョンを持つCustomResourceDefinitionを示します。
最初の例では、すべてのバージョンが同じスキーマを共有し、バージョン間の変換がないことを前提としています。
詳細な説明はYAML内のコメントに記載されています。

{{< tabs name="CustomResourceDefinition_versioning_example_1" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # 名前は以下のspecフィールドと一致する必要があり、<plural>.<group>の形式である必要があります。
  name: crontabs.example.com
spec:
  # REST APIに使用するグループ名: /apis/<group>/<version>
  group: example.com
  # このCustomResourceDefinitionでサポートされるバージョンのリスト
  versions:
  - name: v1beta1
    # 各バージョンはServedフラグで有効/無効を切り替えられます。
    served: true
    # 1つのバージョンのみをストレージバージョンとしてマークする必要があります。
    storage: true
    # スキーマは必須です
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  # conversionセクションはKubernetes 1.13+で導入され、デフォルト値はNone変換(strategyサブフィールドがNoneに設定)です。
  conversion:
    # None変換はすべてのバージョンで同じスキーマを前提とし、カスタムリソースのapiVersionフィールドのみを適切な値に設定します
    strategy: None
  # NamespacedまたはClusterのいずれか
  scope: Namespaced
  names:
    # URLで使用する複数形の名前: /apis/<group>/<version>/<plural>
    plural: crontabs
    # CLIでのエイリアスおよび表示に使用する単数形の名前
    singular: crontab
    # kindは通常、キャメルケースの単数形の型名です。リソースマニフェストでこれを使用します。
    kind: CronTab
    # shortNamesを使用するとCLIでリソースをより短い文字列で指定できます。
    shortNames:
    - ct
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# apiextensions.k8s.io/v1への移行に伴い、v1.16で非推奨になりました。
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # 名前は以下のspecフィールドと一致する必要があり、<plural>.<group>の形式である必要があります。
  name: crontabs.example.com
spec:
  # REST APIに使用するグループ名: /apis/<group>/<version>
  group: example.com
  # このCustomResourceDefinitionでサポートされるバージョンのリスト
  versions:
  - name: v1beta1
    # 各バージョンはServedフラグで有効/無効を切り替えられます。
    served: true
    # 1つのバージョンのみをストレージバージョンとしてマークする必要があります。
    storage: true
  - name: v1
    served: true
    storage: false
  validation:
    openAPIV3Schema:
      type: object
      properties:
        host:
          type: string
        port:
          type: string
  # conversionセクションはKubernetes 1.13+で導入され、デフォルト値はNone変換(strategyサブフィールドがNoneに設定)です。
  conversion:
    # None変換はすべてのバージョンで同じスキーマを前提とし、
    # カスタムリソースのapiVersionフィールドのみを適切な値に設定します。
    strategy: None
  # NamespacedまたはClusterのいずれか
  scope: Namespaced
  names:
    # URLで使用する複数形の名前: /apis/<group>/<version>/<plural>
    plural: crontabs
    # CLIでのエイリアスおよび表示に使用する単数形の名前
    singular: crontab
    # kindは通常、パスカルケースの単数形の型名です。リソースマニフェストでこれを使用します。
    kind: CronTab
    # shortNamesを使用するとCLIでリソースをより短い文字列で指定できます。
    shortNames:
    - ct
```
{{% /tab %}}
{{< /tabs >}}

CustomResourceDefinitionをYAMLファイルに保存し、`kubectl apply`を使用して作成できます。

```shell
kubectl apply -f my-versioned-crontab.yaml
```

作成後、APIサーバーは有効化された各バージョンをHTTP RESTエンドポイントで提供し始めます。
上記の例では、APIバージョンは`/apis/example.com/v1beta1`と`/apis/example.com/v1`で利用できます。

### バージョンの優先順位 {#version-priority}

CustomResourceDefinitionでバージョンが定義される順序に関わらず、kubectlはデフォルトバージョンとして最も優先度の高いバージョンを使用してオブジェクトにアクセスします。
優先度は、_name_ フィールドを解析してバージョン番号、安定性(GA、Beta、Alpha)、およびその安定性レベル内のシーケンスを判断することで決定されます。

バージョンをソートするために使用されるアルゴリズムは、KubernetesプロジェクトがKubernetesバージョンをソートするのと同じ方法でバージョンをソートするよう設計されています。
バージョンは`v`で始まり、その後に数字、オプションの`beta`または`alpha`指定、およびオプションの追加の数値バージョン情報が続きます。
大まかに言えば、バージョン文字列は`v2`または`v2beta1`のようになります。
バージョンは以下のアルゴリズムを使用してソートされます。

- Kubernetesバージョンパターンに従うエントリは、従わないものより先にソートされます。
- Kubernetesバージョンパターンに従うエントリについては、バージョン文字列の数値部分が大きいものから小さいものへとソートされます。
- 最初の数値部分の後に`beta`または`alpha`という文字列が続く場合、それらはその順序でソートされ、`beta`または`alpha`サフィックスのない同等の文字列(GAバージョンと想定)の後に配置されます。
- `beta`または`alpha`の後に別の数字が続く場合、それらの数字も大きいものから小さいものへとソートされます。
- 上記の形式に合わない文字列はアルファベット順にソートされ、数値部分は特別扱いされません。
  以下の例では`foo1`が`foo10`より先にソートされることに注意してください。
  これはKubernetesバージョンパターンに従うエントリの数値部分のソートとは異なります。

次のソート済みバージョンリストを見るとわかりやすいかもしれません。

```none
- v10
- v2
- v1
- v11beta2
- v10beta3
- v3beta1
- v12alpha1
- v11alpha2
- foo1
- foo10
```

[複数バージョンの指定](#specify-multiple-versions)の例では、バージョンのソート順は`v1`の後に`v1beta1`となります。
これにより、提供されたオブジェクトがバージョンを指定しない限り、kubectlコマンドはデフォルトバージョンとして`v1`を使用します。

### バージョンの非推奨化 {#version-deprecation}

{{< feature-state state="stable" for_k8s_version="v1.19" >}}

v1.19以降、CustomResourceDefinitionは定義するリソースの特定バージョンが非推奨であることを示せます。
そのリソースの非推奨バージョンへのAPIリクエストが行われると、APIレスポンスのヘッダーに警告メッセージが返されます。
必要に応じて、リソースの非推奨バージョンごとに警告メッセージをカスタマイズできます。

カスタマイズされた警告メッセージは、非推奨のAPIグループ、バージョン、およびkindを示し、該当する場合は代わりに使用すべきAPIグループ、バージョン、およびkindを示してください。

{{< tabs name="CustomResourceDefinition_versioning_deprecated" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
  name: crontabs.example.com
spec:
  group: example.com
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
  scope: Namespaced
  versions:
  - name: v1alpha1
    served: true
    storage: false
    # カスタムリソースのv1alpha1バージョンが非推奨であることを示します。
    # このバージョンへのAPIリクエストはサーバーレスポンスに警告ヘッダーを受け取ります。
    deprecated: true
    # v1alpha1 APIリクエストを行うAPIクライアントに返されるデフォルトの警告を上書きします。
    deprecationWarning: "example.com/v1alpha1 CronTab is deprecated; see http://example.com/v1alpha1-v1 for instructions to migrate to example.com/v1 CronTab"
    
    schema: ...
  - name: v1beta1
    served: true
    # カスタムリソースのv1beta1バージョンが非推奨であることを示します。
    # このバージョンへのAPIリクエストはサーバーレスポンスに警告ヘッダーを受け取ります。
    # このバージョンにはデフォルトの警告メッセージが返されます。
    deprecated: true
    schema: ...
  - name: v1
    served: true
    storage: true
    schema: ...
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# apiextensions.k8s.io/v1への移行に伴い、v1.16で非推奨になりました。
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: crontabs.example.com
spec:
  group: example.com
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
  scope: Namespaced
  validation: ...
  versions:
  - name: v1alpha1
    served: true
    storage: false
    # カスタムリソースのv1alpha1バージョンが非推奨であることを示します。
    # このバージョンへのAPIリクエストはサーバーレスポンスに警告ヘッダーを受け取ります。
    deprecated: true
    # v1alpha1 APIリクエストを行うAPIクライアントに返されるデフォルトの警告を上書きします。
    deprecationWarning: "example.com/v1alpha1 CronTab is deprecated; see http://example.com/v1alpha1-v1 for instructions to migrate to example.com/v1 CronTab"
  - name: v1beta1
    served: true
    # カスタムリソースのv1beta1バージョンが非推奨であることを示します。
    # このバージョンへのAPIリクエストはサーバーレスポンスに警告ヘッダーを受け取ります。
    # このバージョンにはデフォルトの警告メッセージが返されます。
    deprecated: true
  - name: v1
    served: true
    storage: true
```
{{% /tab %}}
{{< /tabs >}}


### バージョンの削除 {#version-removal}

古いAPIバージョンは、その古いバージョンのカスタムリソースを提供したすべてのクラスターで既存の保存データが新しいAPIバージョンに移行され、古いバージョンがCustomResourceDefinitionの`status.storedVersions`から削除されるまで、CustomResourceDefinitionマニフェストから削除できません。

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
  name: crontabs.example.com
spec:
  group: example.com
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
  scope: Namespaced
  versions:
  - name: v1beta1
    # カスタムリソースのv1beta1バージョンが提供されなくなったことを示します。
    # このバージョンへのAPIリクエストはサーバーレスポンスでnot foundエラーを受け取ります。
    served: false
    schema: ...
  - name: v1
    served: true
    # 新しく提供するバージョンをストレージバージョンとして設定する必要があります。
    storage: true
    schema: ...
```

## Webhook Conversion {#webhook-conversion}

{{< feature-state state="stable" for_k8s_version="v1.16" >}}

{{< note >}}
Webhook Conversionは、Kubernetes 1.15からベータ版として、また1.13からアルファ版として利用できます。
`CustomResourceWebhookConversion`フィーチャーゲートが有効である必要があります。
ベータ機能として多くのクラスターで自動的に有効化されています。
詳細については[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)のドキュメントを参照してください。
{{< /note >}}

上記の例では、バージョン間でNone変換を使用しており、変換時に`apiVersion`フィールドのみを設定し、オブジェクトの残りの部分は変更しません。
APIサーバーは、変換が必要な場合に外部サービスを呼び出すWebhook Conversionもサポートしています。
例えば以下の場合です。

* カスタムリソースが保存バージョンとは異なるバージョンでリクエストされた場合。
* Watchがあるバージョンで作成されたが、変更されたオブジェクトが別のバージョンで保存されている場合。
* カスタムリソースのPUTリクエストがストレージバージョンとは異なるバージョンで行われた場合。

これらすべてのケースをカバーし、APIサーバーによる変換を最適化するために、変換リクエストには外部呼び出しを最小限に抑えるために複数のオブジェクトを含めることができます。
Webhookはこれらの変換を独立して実行する必要があります。

### Conversion Webhookサーバーの作成 {#write-a-conversion-webhook-server}

Kubernetes e2eテストで検証されている[カスタムリソースConversion Webhookサーバー](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/main.go)の実装を参照してください。
このWebhookはAPIサーバーから送信された`ConversionReview`リクエストを処理し、`ConversionResponse`にラップした変換結果を返します。
リクエストには、オブジェクトの順序を変更せずに独立して変換する必要があるカスタムリソースのリストが含まれていることに注意してください。
このサーバーは他の変換にも再利用できるように構成されています。
共通コードのほとんどは[フレームワークファイル](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/converter/framework.go)にあり、異なる変換に対して実装が必要な[1つの関数](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/converter/example_converter.go#L29-L80)のみを残しています。

{{< note >}}
サンプルのConversion Webhookサーバーは`ClientAuth`フィールドを[空](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/config.go#L47-L48)のままにしており、デフォルトは`NoClientCert`です。
つまり、Webhookサーバーはクライアント(おそらくAPIサーバー)の身元を認証しません。
相互TLSやその他の方法でクライアントを認証する必要がある場合は、[APIサーバーの認証](/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers)方法を参照してください。
{{< /note >}}

#### 許可される変更 {#permissible-mutations}

Conversion Webhookは、変換されたオブジェクトの`metadata`内の`labels`と`annotations`以外のものを変更してはなりません。
`name`、`UID`、`namespace`への変更はリジェクトされ、変換を引き起こしたリクエストは失敗します。
その他のすべての変更は無視されます。

### Conversion Webhookサービスのデプロイ {#deploy-the-conversion-webhook-service}

Conversion Webhookのデプロイに関するドキュメントは、[アドミッションWebhookのサービス例](/docs/reference/access-authn-authz/extensible-admission-controllers/#deploy-the-admission-webhook-service)と同じです。
以降のセクションでは、Conversion Webhookサーバーが`default` Namespaceの`example-conversion-webhook-server`という名前のサービスにデプロイされ、`/crdconvert`パスでトラフィックを提供していることを前提としています。

{{< note >}}
WebhookサーバーがKubernetesクラスターにサービスとしてデプロイされている場合、ポート443のサービスを通じて公開する必要があります(サーバー自体は任意のポートを使用できますが、サービスオブジェクトはポート443にマッピングする必要があります)。
サービスに異なるポートを使用すると、APIサーバーとWebhookサービス間の通信が失敗する可能性があります。
{{< /note >}}

### Webhookを使用するためのCustomResourceDefinitionの設定 {#configure-customresourcedefinition-to-use-conversion-webhooks}

`None`変換の例は、`spec`の`conversion`セクションを変更することで、Conversion Webhookを使用するように拡張できます。

{{< tabs name="CustomResourceDefinition_versioning_example_2" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # 名前は以下のspecフィールドと一致する必要があり、<plural>.<group>の形式である必要があります。
  name: crontabs.example.com
spec:
  # REST APIに使用するグループ名: /apis/<group>/<version>
  group: example.com
  # このCustomResourceDefinitionでサポートされるバージョンのリスト
  versions:
  - name: v1beta1
    # 各バージョンはServedフラグで有効/無効を切り替えられます。
    served: true
    # 1つのバージョンのみをストレージバージョンとしてマークする必要があります。
    storage: true
    # トップレベルのスキーマが定義されていない場合、各バージョンが独自のスキーマを定義できます。
    schema:
      openAPIV3Schema:
        type: object
        properties:
          hostPort:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  conversion:
    # Webhookストラテジーは、カスタムリソース間のあらゆる変換に対して外部Webhookを呼び出すようAPIサーバーに指示します。
    strategy: Webhook
    # Webhookは、strategyが`Webhook`の場合に必須であり、APIサーバーが呼び出すWebhookエンドポイントを設定します。
    webhook:
      # conversionReviewVersionsはWebhookが理解/推奨するConversionReviewのバージョンを示します。
      # リストの中でAPIサーバーが理解できる最初のバージョンがWebhookに送信されます。
      # Webhookは受け取ったのと同じバージョンのConversionReviewオブジェクトで応答する必要があります。
      conversionReviewVersions: ["v1","v1beta1"]
      clientConfig:
        service:
          namespace: default
          name: example-conversion-webhook-server
          path: /crdconvert
        caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
  # NamespacedまたはClusterのいずれか
  scope: Namespaced
  names:
    # URLで使用する複数形の名前: /apis/<group>/<version>/<plural>
    plural: crontabs
    # CLIでのエイリアスおよび表示に使用する単数形の名前
    singular: crontab
    # kindは通常、キャメルケースの単数形の型名です。リソースマニフェストでこれを使用します。
    kind: CronTab
    # shortNamesを使用するとCLIでリソースをより短い文字列で指定できます。
    shortNames:
    - ct
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# apiextensions.k8s.io/v1への移行に伴い、v1.16で非推奨になりました。
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # 名前は以下のspecフィールドと一致する必要があり、<plural>.<group>の形式である必要があります。
  name: crontabs.example.com
spec:
  # REST APIに使用するグループ名: /apis/<group>/<version>
  group: example.com
  # 以下のOpenAPIスキーマで指定されていないオブジェクトフィールドを除去します。
  preserveUnknownFields: false
  # このCustomResourceDefinitionでサポートされるバージョンのリスト
  versions:
  - name: v1beta1
    # 各バージョンはServedフラグで有効/無効を切り替えられます。
    served: true
    # 1つのバージョンのみをストレージバージョンとしてマークする必要があります。
    storage: true
    # トップレベルのスキーマが定義されていない場合、各バージョンが独自のスキーマを定義できます。
    schema:
      openAPIV3Schema:
        type: object
        properties:
          hostPort:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  conversion:
    # Webhookストラテジーは、カスタムリソース間のあらゆる変換に対して外部Webhookを呼び出すようAPIサーバーに指示します。
    strategy: Webhook
    # webhookClientConfigは、strategyが`Webhook`の場合に必須であり、APIサーバーが呼び出すWebhookエンドポイントを設定します。
    webhookClientConfig:
      service:
        namespace: default
        name: example-conversion-webhook-server
        path: /crdconvert
      caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
  # NamespacedまたはClusterのいずれか
  scope: Namespaced
  names:
    # URLで使用する複数形の名前: /apis/<group>/<version>/<plural>
    plural: crontabs
    # CLIでのエイリアスおよび表示に使用する単数形の名前
    singular: crontab
    # kindは通常、キャメルケースの単数形の型名です。リソースマニフェストでこれを使用します。
    kind: CronTab
    # shortNamesを使用するとCLIでリソースをより短い文字列で指定できます。
    shortNames:
    - ct
```
{{% /tab %}}
{{< /tabs >}}

CustomResourceDefinitionをYAMLファイルに保存し、`kubectl apply`を使用して適用できます。

```shell
kubectl apply -f my-versioned-crontab-with-conversion.yaml
```

新しい変更を適用する前に、変換サービスが起動して実行されていることを確認してください。

### Webhookへの接続 {#contacting-the-webhook}

APIサーバーがリクエストをConversion Webhookに送信すべきと判断すると、Webhookへの接続方法を知る必要があります。
これはWebhook設定の`webhookClientConfig`スタンザで指定します。

Conversion WebhookはURLまたはサービスへの参照を通じて呼び出すことができ、オプションでTLS接続の検証に使用するカスタムCAバンドルを含めることができます。

### URL {#url}

`url`はWebhookの場所を標準的なURL形式(`scheme://host:port/path`)で指定します。

`host`はクラスター内で実行中のサービスを参照しないようにしてください。
代わりに`service`フィールドを指定してサービスへの参照を使用してください。
ホストは一部のAPIサーバーでは外部DNSを通じて解決される場合があります(つまり、`kube-apiserver`はレイヤー違反になるためクラスター内DNSを解決できません)。
`host`はIPアドレスでも構いません。

`localhost`または`127.0.0.1`を`host`として使用することは、このWebhookを必要とする可能性のあるAPIサーバーを実行するすべてのホストで、このWebhookを実行するよう細心の注意を払わない限りリスクがあります。
このような構成は、ポータビリティ(移植性)が損なわれたり、新しいクラスター環境で即座に実行することが難しくなったりする可能性があります。

スキームは"https"である必要があります。
URLは"https://"で始まる必要があります。

ユーザー認証またはBasic認証(例えば、"user:password@")の使用は許可されていません。
フラグメント("#...")およびクエリパラメーター("?...")も許可されていません。

以下は、URLを呼び出すように設定されたConversion Webhookの例です(TLS証明書はシステムの信頼ルートを使用して検証されるため、caBundleは指定していません)。

{{< tabs name="CustomResourceDefinition_versioning_example_3" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhook:
      clientConfig:
        url: "https://my-webhook.example.com:9443/my-webhook-path"
...
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# apiextensions.k8s.io/v1への移行に伴い、v1.16で非推奨になりました。
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhookClientConfig:
      url: "https://my-webhook.example.com:9443/my-webhook-path"
...
```
{{% /tab %}}
{{< /tabs >}}

### サービスへの参照 {#service-reference}

`webhookClientConfig`内の`service`スタンザは、Conversion Webhookのサービスへの参照です。
Webhookがクラスター内で実行されている場合は、`url`の代わりに`service`を使用してください。
サービスのNamespaceと名前は必須です。
ポートはオプションで、デフォルトは443です。
パスはオプションで、デフォルトは"/"です。

以下は、サブパス"/my-path"のポート"1234"でサービスを呼び出し、カスタムCAバンドルを使用してServerName `my-service-name.my-service-namespace.svc`に対するTLS接続を検証するように設定されたWebhookの例です。

{{< tabs name="CustomResourceDefinition_versioning_example_4" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhook:
      clientConfig:
        service:
          namespace: my-service-namespace
          name: my-service-name
          path: /my-path
          port: 1234
        caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
...
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# apiextensions.k8s.io/v1への移行に伴い、v1.16で非推奨になりました。
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhookClientConfig:
      service:
        namespace: my-service-namespace
        name: my-service-name
        path: /my-path
        port: 1234
      caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
...
```
{{% /tab %}}
{{< /tabs >}}

## Webhookのリクエストとレスポンス {#webhook-request-and-response}

### リクエスト {#request}

Webhookには`Content-Type: application/json`を持つPOSTリクエストが送信され、`apiextensions.k8s.io` APIグループの`ConversionReview` APIオブジェクトがJSONとしてシリアライズされたものがボディとして含まれます。

WebhookはCustomResourceDefinitionの`conversionReviewVersions`フィールドを使用して、受け入れる`ConversionReview`オブジェクトのバージョンを指定できます。

{{< tabs name="conversionReviewVersions" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhook:
      conversionReviewVersions: ["v1", "v1beta1"]
      ...
```

`conversionReviewVersions`は`apiextensions.k8s.io/v1`カスタムリソース定義を作成する際の必須フィールドです。
Webhookは現在および1つ前のAPIサーバーが理解できる`ConversionReview`バージョンを少なくとも1つサポートする必要があります。
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# apiextensions.k8s.io/v1への移行に伴い、v1.16で非推奨になりました。
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    conversionReviewVersions: ["v1", "v1beta1"]
    ...
```

`conversionReviewVersions`が指定されない場合、`apiextensions.k8s.io/v1beta1`カスタムリソース定義を作成する際のデフォルトは`v1beta1`です。
{{% /tab %}}
{{< /tabs >}}

APIサーバーは`conversionReviewVersions`リストの中でサポートする最初の`ConversionReview`バージョンを送信します。
リスト内のバージョンがAPIサーバーでサポートされていない場合、カスタムリソース定義は作成できません。
以前に作成されたConversion Webhook設定にAPIサーバーが送信できる`ConversionReview`バージョンのいずれもサポートされていない場合、Webhookの呼び出しは失敗します。

この例では、`CronTab`オブジェクトを`example.com/v1`に変換するリクエストの`ConversionReview`オブジェクトに含まれるデータを示します。

{{< tabs name="ConversionReview_request" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "request": {
    # この変換呼び出しを一意に識別するランダムなuid
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    
    # オブジェクトを変換すべきAPIグループとバージョン
    "desiredAPIVersion": "example.com/v1",
    
    # 変換するオブジェクトのリスト。
    # 1つまたは複数のバージョン、1つまたは複数のオブジェクトを含む場合があります。
    "objects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "hostPort": "localhost:1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "hostPort": "example.com:2345"
      }
    ]
  }
}
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
{
  # apiextensions.k8s.io/v1への移行に伴い、v1.16で非推奨になりました。
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "request": {
    # この変換呼び出しを一意に識別するランダムなuid
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    
    # オブジェクトを変換すべきAPIグループとバージョン
    "desiredAPIVersion": "example.com/v1",
    
    # 変換するオブジェクトのリスト。
    # 1つまたは複数のバージョンの1つまたは複数のオブジェクトを含む場合があります。
    "objects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "hostPort": "localhost:1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "hostPort": "example.com:2345"
      }
    ]
  }
}
```
{{% /tab %}}
{{< /tabs >}}

### レスポンス {#response}

WebhookはHTTPステータスコード200、`Content-Type: application/json`、および`ConversionReview`オブジェクト(送信されたのと同じバージョン)を含むボディで応答します。
このオブジェクトは`response`スタンザが設定され、JSONにシリアライズされています。

変換が成功した場合、Webhookは以下のフィールドを含む`response`スタンザを返す必要があります:
* Webhookに送信された`request.uid`からコピーされた`uid`
* `{"status":"Success"}`に設定された`result`
* `request.objects`のすべてのオブジェクトを`request.desiredAPIVersion`に変換したものを含む`convertedObjects`

Webhookからの最小限の成功レスポンスの例:

{{< tabs name="ConversionReview_response_success" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "response": {
    # <request.uid>と一致する必要があります。
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    "result": {
      "status": "Success"
    },
    # オブジェクトはrequest.objectsの順序と一致し、apiVersionが<request.desiredAPIVersion>に設定されている必要があります。
    # kind、metadata.uid、metadata.name、metadata.namespaceフィールドはWebhookによって変更してはなりません。
    # metadata.labelsとmetadata.annotationsフィールドはWebhookによって変更できます。
    # Webhookによるmetadataフィールドのその他すべての変更は無視されます。
    "convertedObjects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "host": "localhost",
        "port": "1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "host": "example.com",
        "port": "2345"
      }
    ]
  }
}
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
{
  # apiextensions.k8s.io/v1への移行に伴い、v1.16で非推奨になりました。
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "response": {
    # <request.uid>と一致する必要があります。
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    "result": {
      "status": "Failed"
    },
    # オブジェクトはrequest.objectsの順序と一致し、apiVersionが<request.desiredAPIVersion>に設定されている必要があります。
    # kind、metadata.uid、metadata.name、metadata.namespaceフィールドはWebhookによって変更してはなりません。
    # metadata.labelsとmetadata.annotationsフィールドはWebhookによって変更できます。
    # Webhookによるmetadataフィールドのその他すべての変更は無視されます。
    "convertedObjects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "host": "localhost",
        "port": "1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "host": "example.com",
        "port": "2345"
      }
    ]
  }
}
```
{{% /tab %}}
{{< /tabs >}}

変換が失敗した場合、Webhookは以下のフィールドを含む`response`スタンザを返す必要があります:
* Webhookに送信された`request.uid`からコピーされた`uid`
* `{"status":"Failed"}`に設定された`result`

{{< warning >}}
変換の失敗は、リソースの更新や削除を含む、カスタムリソースへの読み取りおよび書き込みアクセスを妨げる可能性があります。
変換の失敗はできる限り避け、バリデーション制約を強制するために使用しないでください(代わりに検証スキーマやWebhookアドミッションを使用してください)。
{{< /warning >}}

変換リクエストの失敗を示すWebhookからのレスポンスの例(オプションのメッセージ付き):
{{< tabs name="ConversionReview_response_failure" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "response": {
    "uid": "<value from request.uid>",
    "result": {
      "status": "Failed",
      "message": "hostPort could not be parsed into a separate host and port"
    }
  }
}
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
{
  # apiextensions.k8s.io/v1への移行に伴い、v1.16で非推奨になりました。
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "response": {
    "uid": "<value from request.uid>",
    "result": {
      "status": "Failed",
      "message": "hostPort could not be parsed into a separate host and port"
    }
  }
}
```
{{% /tab %}}
{{< /tabs >}}

## バージョン管理されたCustomResourceDefinitionオブジェクトの書き込み、読み取り、更新 {#writing-reading-and-updating-versioned-customresourcedefinition-objects}

オブジェクトが書き込まれると、書き込み時にストレージバージョンとして指定されているバージョンで保存されます。
ストレージバージョンが変更されても、既存のオブジェクトは自動的に変換されません。
ただし、新しく作成または更新されたオブジェクトは新しいストレージバージョンで書き込まれます。
オブジェクトによっては、現在提供されていないバージョンで書き込まれたままになっている可能性があります。

オブジェクトを読み取る際は、パスの一部としてバージョンを指定します。
現在提供されているバージョンであれば、任意のバージョンでオブジェクトをリクエストできます。
オブジェクトの保存バージョンとは異なるバージョンを指定した場合、Kubernetesはリクエストしたバージョンでオブジェクトを返しますが、保存されているオブジェクトはディスク上で変更されません。

読み取りリクエストを提供する際に返されるオブジェクトに何が起きるかは、CRDの`spec.conversion`に何が指定されているかによります:
- デフォルトの`strategy`値`None`が指定されている場合、オブジェクトへの変更は`apiVersion`文字列の変更と、[不明なフィールドのプルーニング](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning)(設定に依存)のみです。
保存バージョンとリクエストバージョン間でスキーマが異なる場合、この方法では適切な結果が得られない可能性が高いことに注意してください。
特に、バージョン間で同じデータが異なるフィールドで表現されている場合は、このストラテジーを使用しないでください。
- [Webhook Conversion](#webhook-conversion)が指定されている場合は、そのメカニズムが変換を制御します。

既存のオブジェクトを更新すると、現在のストレージバージョンで書き直されます。
これが、あるバージョンから別のバージョンにオブジェクトが変更される唯一の方法です。

これを説明するために、以下の仮想的な一連のイベントを考えてみましょう:

1. ストレージバージョンは`v1beta1`です。
   オブジェクトを作成します。
   バージョン`v1beta1`で保存されます。
2. CustomResourceDefinitionに`v1`バージョンを追加して、ストレージバージョンとして指定します。
   ここでは`v1`と`v1beta1`のスキーマが同一であり、これはKubernetesエコシステムでAPIを安定版に昇格させる際の通常のケースです。
3. オブジェクトをバージョン`v1beta1`で読み取り、次にバージョン`v1`で再度読み取ります。
   返された両方のオブジェクトはapiVersionフィールドを除いて同一です。
4. 新しいオブジェクトを作成します。
   バージョン`v1`で保存されます。
   これで2つのオブジェクトがあり、一方は`v1beta1`で、もう一方は`v1`です。
5. 最初のオブジェクトを更新します。
   現在のストレージバージョンが`v1`であるため、バージョン`v1`で保存されます。

### 過去のストレージバージョン {#previous-storage-versions}

APIサーバーは、ストレージバージョンとしてマークされたことがあるすべてのバージョンをステータスフィールドの`storedVersions`に記録します。
オブジェクトは、ストレージバージョンとして指定されたことがある任意のバージョンで保存されている場合があります。
ストレージバージョンであったことがないバージョンのオブジェクトはストレージに存在できません。

## 既存のオブジェクトを新しい保存バージョンにアップグレードする {#upgrade-existing-objects-to-a-new-stored-version}

バージョンを非推奨化してサポートを終了する場合は、ストレージアップグレード手順を選択してください。

*オプション1:* Storage Version Migratorを使用する

1. [Storage Version Migrator](https://github.com/kubernetes-sigs/kube-storage-version-migrator)を実行します。
2. CustomResourceDefinitionの`status.storedVersions`フィールドから古いバージョンを削除します。

*オプション2:* 既存のオブジェクトを新しい保存バージョンに手動でアップグレードする

以下は`v1beta1`から`v1`へのアップグレード手順の例です。

1. CustomResourceDefinitionファイルで`v1`をストレージに設定し、kubectlを使用して適用します。
   `storedVersions`は`v1beta1, v1`になります。
2. 既存のすべてのオブジェクトをリストアップして同じ内容で書き込むアップグレード手順を作成します。
   これによりバックエンドが現在のストレージバージョン(`v1`)でオブジェクトを書き込むよう強制されます。
3. CustomResourceDefinitionの`status.storedVersions`フィールドから`v1beta1`を削除します。

{{< note >}}
`kubectl`を使用してCRDオブジェクトの`status`サブリソースにパッチを当てる方法の例を以下に示します:
```bash
kubectl patch customresourcedefinitions <CRD_Name> --subresource='status' --type='merge' -p '{"status":{"storedVersions":["v1"]}}'
```
{{< /note >}}
