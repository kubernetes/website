---
reviewers:
title: Kubernetes API
content_type: concept
weight: 40
description: >
  Kubernetes APIを使用すると、Kubernetes内のオブジェクトの状態をクエリで操作できます。
  Kubernetesのコントロールプレーンの中核は、APIサーバーとそれが公開するHTTP APIです。ユーザー、クラスターのさまざまな部分、および外部コンポーネントはすべて、APIサーバーを介して互いに通信します。
card:
  name: concepts
  weight: 30
---

<!-- overview -->

Kubernetesの中核である {{< glossary_tooltip text="control plane" term_id="control-plane" >}}は{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} です。
APIサーバーは、エンドユーザー、クラスターのさまざまな部分、および外部コンポーネントが相互に通信できるようにするHTTP APIを公開します。

Kubernetes APIを使用すると、Kubernetes API内のオブジェクトの状態をクエリで操作できます（例：Pod、Namespace、ConfigMap、Events）。

ほとんどの操作は、APIを使用している[kubectl](/ja/docs/reference/kubectl/)コマンドラインインターフェースもしくは[kubeadm](/docs/reference/setup-tools/kubeadm/)のような別のコマンドラインツールを通して実行できます。
RESTコールを利用して直接APIにアクセスすることも可能です。

Kubernetes APIを利用してアプリケーションを書いているのであれば、[client libraries](/docs/reference/using-api/client-libraries/)の利用を考えてみてください。

<!-- body -->

## OpenAPI 仕様 {#api-specification}

完全なAPIの詳細は、[OpenAPI](https://www.openapis.org/)を使用して文書化されています。

### OpenAPI V2

Kubernetes APIサーバーは、`/openapi/v2`エンドポイントを介してOpenAPI v2仕様を提供します。
次のように要求ヘッダーを使用して、応答フォーマットを要求できます。


<table>
  <caption style="display:none">OpenAPI v2クエリの有効なリクエストヘッダー値</caption>
  <thead>
     <tr>
        <th>ヘッダー</th>
        <th style="min-width: 50%;">取りうる値</th>
        <th>備考</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>このヘッダーを使わないことも可能</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v2@v1.0+protobuf</code></td>
        <td><em>主にクラスター内での使用</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>デフォルト</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><code>application/json</code>を提供</td>
     </tr>
  </tbody>
</table>


Kubernetesは、他の手段として主にクラスター間の連携用途向けのAPIに、Protocol buffersをベースにしたシリアライズフォーマットを実装しています。このフォーマットに関しては、[Kubernetes Protobuf serialization](https://github.com/kubernetes/design-proposals-archive/blob/main/api-machinery/protobuf.md)デザイン提案を参照してください。また、各スキーマのInterface Definition Language（IDL）ファイルは、APIオブジェクトを定義しているGoパッケージ内に配置されています。

### OpenAPI V3

{{< feature-state state="beta"  for_k8s_version="v1.24" >}}

Kubernetes {{< param "version" >}}では、OpenAPI v3によるAPI仕様をベータサポートとして提供しています。これは、デフォルトで有効化されているベータ機能です。kube-apiserverの`OpenAPIV3`という[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)を切ることにより、このベータ機能を無効化することができます。

`/openapi/v3`が、全ての利用可能なグループやバージョンの一覧を閲覧するためのディスカバリーエンドポイントとして提供されています。このエンドポイントは、JSONのみを返却します。利用可能なグループやバージョンは、次のような形式で提供されます。

```yaml
{
    "paths": {
        ...,
        "api/v1": {
            "serverRelativeURL": "/openapi/v3/api/v1?hash=CC0E9BFD992D8C59AEC98A1E2336F899E8318D3CF4C68944C3DEC640AF5AB52D864AC50DAA8D145B3494F75FA3CFF939FCBDDA431DAD3CA79738B297795818CF"
        },
        "apis/admissionregistration.k8s.io/v1": {
            "serverRelativeURL": "/openapi/v3/apis/admissionregistration.k8s.io/v1?hash=E19CC93A116982CE5422FC42B590A8AFAD92CDE9AE4D59B5CAAD568F083AD07946E6CB5817531680BCE6E215C16973CD39003B0425F3477CFD854E89A9DB6597"
        },
        ....
    }
}
```
<!-- for editors: intentionally use yaml instead of json here, to prevent syntax highlight error. -->

クライアントサイドのキャッシングを改善するために、相対URLはイミュータブルな(不変の)OpenAPI記述を指しています。
また、APIサーバーも、同様の目的で適切なHTTPキャッシュヘッダー(`Expires`には1年先の日付、`Cache-Control`には`immutable`)をセットします。廃止されたURLが使用された場合、APIサーバーは最新のURLへのリダイレクトを返します。

Kubernetes APIサーバーは、`/openapi/v3/apis/<group>/<version>?hash=<hash>`のエンドポイントにて、KubernetesのグループバージョンごとにOpenAPI v3仕様を公開しています。

受理されるリクエストヘッダーについては、以下の表の通りです。

<table>
  <caption style="display:none">OpenAPI v3において有効なリクエストヘッダー</caption>
  <thead>
     <tr>
        <th>ヘッダー</th>
        <th style="min-width: 50%;">取りうる値</th>
        <th>備考</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>このヘッダーを使わないことも可能</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v3@v1.0+protobuf</code></td>
        <td><em>主にクラスター内での使用</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>デフォルト</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em></em><code>application/json</code>を提供</td>
     </tr>
  </tbody>
</table>

## 永続性

KubernetesはAPIリソースの観点からシリアル化された状態を{{< glossary_tooltip term_id="etcd" >}}に書き込むことで保存します。

## APIグループとバージョニング

フィールドの削除やリソース表現の再構成を簡単に行えるようにするため、Kubernetesは複数のAPIバージョンをサポートしており、`/api/v1`や`/apis/rbac.authorization.k8s.io/v1alpha1`のように、それぞれ異なるAPIのパスが割り当てられています。

APIが、システムリソースと動作について明確かつ一貫したビューを提供し、サポート終了、実験的なAPIへのアクセス制御を有効にするために、リソースまたはフィールドレベルではなく、APIレベルでバージョンが行われます。

APIの発展や拡張を簡易に行えるようにするため、Kubernetesは[有効もしくは無効](/docs/reference/using-api/#enabling-or-disabling)を行える[APIグループ](/docs/reference/using-api/#api-groups)を実装しました。

APIリソースは、APIグループ、リソースタイプ、ネームスペース（namespacedリソースのための）、名前によって区別されます。APIサーバーは、APIバージョン間の変換を透過的に処理します。すべてのバージョンの違いは、実際のところ同じ永続データとして表現されます。APIサーバーは、同じ基本的なデータを複数のAPIバージョンで提供することができます。

例えば、同じリソースで`v1`と`v1beta1`の2つのバージョンが有ることを考えてみます。
`v1beta1`バージョンのAPIを利用しオブジェクトを最初に作成したとして、`v1beta1`バージョンが非推奨となり削除されるまで、`v1beta1`もしくは`v1`どちらのAPIバージョンを利用してもオブジェクトのread、update、deleteができます。
その時点では、`v1` APIを使用してオブジェクトの修正やアクセスを継続することが可能です。

## APIの変更

成功を収めているシステムはすべて、新しいユースケースの出現や既存の変化に応じて成長し、変化する必要があります。
したがって、Kubernetesには、Kubernetes APIを継続的に変更および拡張できる設計機能があります。
Kubernetesプロジェクトは、既存のクライアントとの互換性を破壊 _しないこと_ 、およびその互換性を一定期間維持して、他のプロジェクトが適応する機会を提供することを目的としています。

基本的に、新しいAPIリソースと新しいリソースフィールドは追加することができます。
リソースまたはフィールドを削除するには、[API非推奨ポリシー](/docs/reference/using-api/deprecation-policy/)に従ってください。

Kubernetesは、通常はAPIバージョン`v1`として、公式のKubernetes APIが一度一般提供(GA)に達した場合、互換性を維持することを強く確約します。
さらに、Kubernetesは、公式Kubernetes APIの _beta_ APIバージョン経由で永続化されたデータとの互換性を維持します。
そして、機能が安定したときにGA APIバージョン経由でデータを変換してアクセスできることを保証します。

beta APIを採用した場合、APIが卒業(Graduate)したら、後続のbetaまたはstable APIに移行する必要があります。
これを行うのに最適な時期は、オブジェクトが両方のAPIバージョンから同時にアクセスできるbeta APIの非推奨期間中です。
beta APIが非推奨期間を終えて提供されなくなったら、代替APIバージョンを使用する必要があります。

{{< note >}}
Kubernetesは、 _alpha_ APIバージョンについても互換性の維持に注力しますが、いくつかの事情により不可である場合もあります。
alpha APIバージョンを使っている場合、クラスターをアップグレードする時にKubernetesのリリースノートを確認してください。
APIが互換性のない方法で変更された場合は、アップグレードをする前に既存のalphaオブジェクトをすべて削除する必要があります。
{{< /note >}}

APIバージョンレベルの定義に関する詳細は[APIバージョンのリファレンス](/docs/reference/using-api/#api-versioning)を参照してください。

## APIの拡張

Kubernetes APIは2つの方法で拡張できます。

1. [カスタムリソース](/ja/docs/concepts/extend-kubernetes/api-extension/custom-resources/)は、APIサーバーが選択したリソースAPIをどのように提供するかを宣言的に定義します。
1. [アグリゲーションレイヤー](/ja/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)を実装することでKubernetes APIを拡張することもできます。


## {{% heading "whatsnext" %}}

- 自分自身で[カスタムリソース定義](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)を追加してKubernetes APIを拡張する方法について学んでください。
- [Kubernetes APIのアクセス制御](/docs/concepts/security/controlling-access/)では、クラスターがAPIアクセスの認証と承認を管理する方法を説明しています。
- [APIリファレンス](/ja/docs/reference/kubernetes-api/)を読んで、APIエンドポイント、リソースタイプやサンプルについて学んでください。
- [APIの変更](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme)から、互換性のある変更とは何か, どのようにAPIを変更するかについて学んでください。
