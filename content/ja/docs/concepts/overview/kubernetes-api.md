---
reviewers:
title: Kubernetes API
content_type: concept
weight: 30
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

APIエンドポイント、リソースタイプ、サンプルについては[APIリファレンス](/docs/reference/kubernetes-api/)で説明しています。

<!-- body -->

## APIの変更

成功を収めているシステムはすべて、新しいユースケースの出現や既存の変化に応じて成長し、変化する必要があります。
したがって、Kubernetesには、Kubernetes APIを継続的に変更および拡張できる設計機能があります。
Kubernetesプロジェクトは、既存のクライアントとの互換性を破壊しないこと、およびその互換性を一定期間維持して、他のプロジェクトが適応する機会を提供することを目的としています。

基本的に、新しいAPIリソースと新しいリソースフィールドは追加することができます。
リソースまたはフィールドを削除するには、[API非推奨ポリシー](/docs/reference/using-api/deprecation-policy/)に従ってください。

互換性のある変更の構成要素とAPIの変更方法については、[APIの変更](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme)で詳しく説明しています。


## OpenAPI 仕様 {#api-specification}

完全なAPIの詳細は、[OpenAPI](https://www.openapis.org/)を使用して文書化されています。

Kubernetes APIサーバーは、`/openapi/v2`エンドポイントを介してOpenAPI仕様を提供します。
次のように要求ヘッダーを使用して、応答フォーマットを要求できます。


<table>
  <thead>
     <tr>
        <th>Header</th>
        <th style="min-width: 50%;">Possible values</th>
        <th>Notes</th>
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
  <caption>OpenAPI v2クエリの有効なリクエストヘッダー値</caption>
</table>


Kubernetesは、他の手段として主にクラスター間の連携用途向けのAPIに、Protocol buffersをベースにしたシリアライズフォーマットを実装しており、そのフォーマットの概要は[デザイン提案](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md)に記載されています。また各スキーマのIDFファイルは、APIオブジェクトを定義しているGoパッケージ内に配置されています。

## APIバージョニング

フィールドの削除やリソース表現の再構成を簡単に行えるようにするため、Kubernetesは複数のAPIバージョンをサポートしており、`/api/v1`や`/apis/rbac.authorization.k8s.io/v1alpha1`のように、それぞれ異なるAPIのパスが割り当てられています。

APIが、システムリソースと動作について明確かつ一貫したビューを提供し、サポート終了、実験的なAPIへのアクセス制御を有効にするために、リソースまたはフィールドレベルではなく、APIレベルでバージョンが行われます。

JSONとProtocol Buffersのシリアライズスキーマも、スキーマ変更に関して同じガイドラインに従います。ここから以下の説明は、双方のフォーマットをカバーしています。

APIとソフトウエアのバージョニングは、間接的にしか関連していないことに注意してください。[APIとリリースバージョニング提案](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md)で、APIとソフトウェアのバージョニングの関連について記載しています。

異なるバージョンのAPIでは、安定性やサポートのレベルも変わります。各レベルの詳細な条件は、[APIの変更](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions)に記載されています。下記に簡潔にまとめます:

- アルファレベル(版):
  - バージョン名に`alpha`を含みます(例、`v1alpha1`)。
  - バグが多いかもしれません。アルファ機能の有効化がバグを顕在化させるかもしれません。デフォルトでは無効となっています。
  - アルファ機能のサポートは、いつでも通知無しに取りやめられる可能性があります。
  - ソフトウェアリリース後、APIが通知無しに互換性が無い形で変更される可能性があります。
  - バグが増えるリスク、また長期サポートが無いことから、短期間のテスト用クラスターでの利用を推奨します。
- ベータレベル(版):
  - バージョン名に`beta`を含みます(例、`v2beta3`)。
  - コードは十分にテストされています。ベータ機能の有効化は安全だと考えられます。デフォルトで有効化されています。
  - 全体的な機能のサポートは取りやめられませんが、詳細は変更される可能性があります。
  - オブジェクトのスキーマ、意味はその後のベータ、安定版リリースで互換性が無い形で変更される可能性があります。その場合、次のバージョンへアップデートするための手順を提供します。その手順ではAPIオブジェクトの削除、修正、再作成が必要になるかもしれません。修正のプロセスは多少の検討が必要になるかもしれません。これは、この機能を利用しているアプリケーションでダウンタイムが必要になる可能性があるためです。
  - 今後のリリースで、互換性の無い変更が行われる可能性があるため、ビジネスクリティカルな場面以外での利用を推奨します。もし複数のクラスターを持っており、それぞれ個別にアップグレードが可能な場合、この制限の影響を緩和できるかもしれません。
  - **是非ベータ機能を試して、フィードバックをください！ベータから安定版になってしまうと、より多くの変更を加えることが難しくなってしまいます。**
- 安定版:
  - バージョン名は`vX`のようになっており、`X`は整数です。
  - 安定版の機能は、今後のリリースバージョンにも適用されます。

## APIグループ {#api-groups}

APIの拡張を簡易に行えるようにするため、Kubernetesは[*APIグループ*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md)を実装しました。
APIグループは、RESTのパスとシリアライズされたオブジェクトの`apiVersion`フィールドで指定されます。

クラスターにはいくつかのAPIグループがあります:

1. *core* グループ(*legacy group* とも呼ばれます)は、`/api/v1`というRESTのパスで、`apiVersion: v1`を使います。

1. 名前付きのグループは、`/apis/$GROUP_NAME/$VERSION`というRESTのパスで、`apiVersion: $GROUP_NAME/$VERSION`(例、`apiVersion: batch/v1`)を使います。Kubernetesの[APIリファレンス](/docs/reference/kubernetes-api/)にすべての使用可能なAPIグループのリストがあります。

[カスタムリソース](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)でAPIを拡張するために、2つの方法があります:

1. [カスタムリソース定義](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)は、APIサーバーが選択したリソースAPIを提供する方法を宣言的に定義できます。
1. [独自の拡張APIサーバーを実装](/docs/tasks/extend-kubernetes/setup-extension-api-server/)し、[アグリゲーター](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)を使用してクライアントに対してシームレスにすることもできます。

## APIグループの有効化、無効化

いくつかのリソースとAPIグループはデフォルトで有効になっています。それらは、kube-apiserverのコマンドラインオプションとしてAPIサーバーの`--runtime-config`設定で、有効化、無効化できます。

`--runtime-config`は、カンマ区切りの複数の値を設定可能です。例えば、batch/v1を無効化する場合、`--runtime-config=batch/v1=false`をセットし、batch/v2alpha1を有効化する場合、`--runtime-config=batch/v2alpha1`をセットします。このフラグは、APIサーバーのランタイム設定を表すkey=valueのペアを、カンマ区切りで指定したセットを指定可能です。

{{< note >}}APIグループ、リソースの有効化、無効化は、`--runtime-config`の変更を反映するため、kube-apiserverとkube-controller-managerの再起動が必要です。{{< /note >}}

## 永続性

KubernetesはAPIリソースの観点からシリアル化された状態を{{< glossary_tooltip term_id="etcd" >}}に書き込むことで保存します。


## {{% heading "whatsnext" %}}

[APIアクセスの制御](/docs/reference/access-authn-authz/controlling-access/)は、クラスターがAPIアクセスの認証と承認を管理する方法を説明しています。

全体的なAPI規則は、[API規則](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#api-conventions)の資料で説明されています。

APIエンドポイント、リソースタイプ、サンプルについては、[APIリファレンス](/docs/reference/kubernetes-api/)をご覧ください。
