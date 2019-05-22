---
reviewers:
title: Kubernetes API
content_template: templates/concept
weight: 30
card: 
  name: concepts
  weight: 30
---

{{% capture overview %}}

全般的なAPIの規則は、[API規則ドキュメント](https://git.k8s.io/community/contributors/devel/api-conventions.md)に記載されています。

APIエンドポイント、リソースタイプ、そしてサンプルは[APIリファレンス](/docs/reference)に記載されています。

APIへの外部からのアクセスは、[APIアクセス制御ドキュメント](/docs/reference/access-authn-authz/controlling-access/)に記載されています。

Kubernetes APIは、システムの宣言的設定スキーマの基礎としても機能します。[kubectl](/docs/reference/kubectl/overview/)コマンドラインツールから、APIオブジェクトを作成、更新、削除、取得することが出来ます。 

また、Kubernetesは、シリアライズされた状態を(現在は[etcd](https://coreos.com/docs/distributed-configuration/getting-started-with-etcd/)に)APIリソースの単位で保存しています。

Kubernetesそれ自身は複数のコンポーネントから構成されており、APIを介して連携しています。

{{% /capture %}}

{{% capture body %}}

## APIの変更

我々の経験上、成功を収めているどのようなシステムも、新しいユースケースへの対応、既存の変更に合わせ、成長し変わっていく必要があります。したがって、Kubernetesにも継続的に変化、成長することを期待しています。一方で、長期間にわたり、既存のクライアントとの互換性を損なわないようにする予定です。一般的に、新しいAPIリソースとリソースフィールドは頻繁に追加されることが予想されます。リソース、フィールドの削除は、[API廃止ポリシー](/docs/reference/using-api/deprecation-policy/)への準拠を必要とします。

何が互換性のある変更を意味するか、またAPIをどのように変更するかは、[API変更ドキュメント](https://git.k8s.io/community/contributors/devel/api_changes.md)に詳解されています。

## OpenAPIとSwaggerの定義

完全なAPIの詳細は、[OpenAPI](https://www.openapis.org/)に記載されています。

Kubernetes 1.10から、KubernetesAPIサーバーは`/openapi/v2`のエンドポイントを通じて、OpenAPI仕様を提供しています。
リクエストフォーマットは、HTTPヘッダーを下記のように設定することで指定されます:

ヘッダ | 設定可能な値
------ | ---------------
Accept | `application/json`, `application/com.github.proto-openapi.spec.v2@v1.0+protobuf` （デフォルトのcontent-typeは、`*/*`に対して`application/json`か、もしくはこのヘッダーを送信しません）
Accept-Encoding | `gzip` （このヘッダーを送信しないことも許容されています）

1.14より前のバージョンでは、フォーマット分離エンドポイント（`/swagger.json`, `/swagger-2.0.0.json`, `/swagger-2.0.0.pb-v1`, `/swagger-2.0.0.pb-v1.gz`）が、OpenAPI仕様を違うフォーマットで提供しています。これらのエンドポイントは非推奨となっており、Kubernetes1.14で削除される予定です。

**OpenAPI仕様の取得サンプル**:

1.10より前 | Kubernetes1.10以降
----------- | -----------------------------
GET /swagger.json | GET /openapi/v2 **Accept**: application/json
GET /swagger-2.0.0.pb-v1 | GET /openapi/v2 **Accept**: application/com.github.proto-openapi.spec.v2@v1.0+protobuf
GET /swagger-2.0.0.pb-v1.gz | GET /openapi/v2 **Accept**: application/com.github.proto-openapi.spec.v2@v1.0+protobuf **Accept-Encoding**: gzip

Kubernetesは、他の手段として主にクラスター間の連携用途向けのAPIに、Protocol buffersをベースにしたシリアライズフォーマットを実装しており、そのフォーマットの概要は[デザイン提案](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md)に記載されています。また各スキーマのIDFファイルは、APIオブジェクトを定義しているGoパッケージ内に配置されています。

また、1.14より前のバージョンのKubernetesAPIサーバーでは、[Swagger v1.2](http://swagger.io/)をベースにしたKubernetes仕様を、`/swaggerapi`で公開しています。
このエンドポイントは非推奨となっており、Kubernetes1.14で削除される予定です。

## APIバージョニング

フィールドの削除やリソース表現の再構成を簡単に行えるようにするため、Kubernetesは複数のAPIバージョンをサポートしており、`/api/v1`や`/apis/extensions/v1beta1`のように、それぞれ異なるAPIのパスが割り当てられています。

APIが、システムリソースと動作について明確かつ一貫したビューを提供し、サポート終了、実験的なAPIへのアクセス制御を有効にするために、リソースまたはフィールドレベルではなく、APIレベルでバージョンを付けることを選択しました。JSONとProtocol Buffersのシリアライズスキーマも、スキーマ変更に関して同じガイドラインに従います。ここから以下の説明は、双方のフォーマットをカバーしています。

APIとソフトウエアのバージョニングは、間接的にしか関連していないことに注意してください。[APIとリリースバージョニング提案](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md)で、APIとソフトウェアのバージョニングの関連について記載しています。

異なるバージョンのAPIは、異なるレベル（版）の安定性とサポートを持っています。それぞれのレベル（版）の基準は、[API変更ドキュメント](https://git.k8s.io/community/contributors/devel/api_changes.md#alpha-beta-and-stable-versions)に詳細が記載されています。下記に簡潔にまとめます:

- アルファレベル（版）:
  - バージョン名に`alpha`を含みます（例、`v1alpha1`）。
  - バグが多いかもしれません。アルファ機能の有効化がバグを顕在化させるかもしれません。デフォルトでは無効となっています。
  - アルファ機能のサポートは、いつでも通知無しに取りやめられる可能性があります。
  - ソフトウェアリリース後、APIが通知無しに互換性が無い形で変更される可能性があります。
  - バグが増えるリスク、また長期サポートが無いことから、短期間のテスト用クラスターでの利用を推奨します。
- ベータレベル（版）:
  - バージョン名に`beta`を含みます（例、`v2beta3`）。
  - コードは十分にテストされています。ベータ機能の有効化は安全だと考えられます。デフォルトで有効化されています。
  - 全体的な機能のサポートは取りやめられませんが、詳細は変更される可能性があります。
  - オブジェクトのスキーマ、意味はその後のベータ、安定版リリースで互換性が無い形で変更される可能性があります。その場合、次のバージョンへアップデートするための手順を提供します。その手順ではAPIオブジェクトの削除、修正、再作成が必要になるかもしれません。修正のプロセスは多少の検討が必要になるかもしれません。これは、この機能を利用しているアプリケーションでダウンタイムが必要になる可能性があるためです。
  - 今後のリリースで、互換性の無い変更が行われる可能性があるため、ビジネスクリティカルな場面以外での利用を推奨します。もし複数のクラスターを持っており、それぞれ個別にアップグレードが可能な場合、この制限の影響を緩和できるかもしれません。
  - **是非ベータ機能を試して、フィードバックをください！ベータから安定版になってしまうと、より多くの変更を加えることが難しくなってしまいます。**
- 安定版:
  - バージョン名は`vX`のようになっており、`X`は整数です。
  - 安定版の機能は、今後のリリースバージョンにも適用されます。

## APIグループ

KubernetesAPIの拡張を簡易に行えるようにするため、[*APIグループ*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md)を実装しました。
APIグループは、RESTのパスとシリアライズされたオブジェクトの`apiVersion`フィールドで指定されます。

現在、いくつかのAPIグループが利用されています:

1. *core* グループ（度々、*legacy group* と呼ばれます）は、`/api/v1`というRESTのパスで、`apiVersion: v1`を使います。

1. 名前付きのグループは、`/apis/$GROUP_NAME/$VERSION`というRESTのパスで、`apiVersion: $GROUP_NAME/$VERSION`（例、`apiVersion: batch/v1`）を使います。サポートされているAPIグループの全リストは、[Kubernetes APIリファレンス](/docs/reference/)を参照してください。

[カスタムリソース](/docs/concepts/api-extension/custom-resources/)でAPIを拡張するために、2つの方法がサポートされています:

1. [カスタムリソース定義](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)は、とても基本的なCRUDが必要なユーザー向けです。
1. 独自のAPIサーバーを実装可能な、フルセットのKubernetes APIが必要なユーザーは、[アグリゲーター](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/)を使い、クライアントにシームレスな形で拡張を行います。

## APIグループの有効化

いくつかのリソースとAPIグループはデフォルトで有効になっています。それらは、APIサーバーの`--runtime-config`設定で、有効化、無効化できます。`--runtime-config`は、カンマ区切りの複数の値を設定可能です。例えば、batch/v1を無効化する場合、`--runtime-config=batch/v1=false`をセットし、batch/v2alpha1を有効化する場合、`--runtime-config=batch/v2alpha1`をセットします。このフラグは、APIサーバーのランタイム設定を表すkey=valueのペアを、カンマ区切りで指定したセットを指定可能です。

重要: APIグループ、リソースの有効化、無効化は、`--runtime-config`の変更を反映するため、APIサーバーとコントローラーマネージャーの再起動が必要です。

## APIグループのリソースの有効化

DaemonSets、Deployments、HorizontalPodAutoscalers、Ingresses、JobsReplicaSets、そしてReplicaSetsはデフォルトで有効です。
その他の拡張リソースは、APIサーバーの`--runtime-config`を設定することで有効化できます。`--runtime-config`はカンマ区切りの複数の値を設定可能です。例えば、deploymentsとingressを無効化する場合、`--runtime-config=extensions/v1beta1/deployments=false,extensions/v1beta1/ingresses=false`と設定します。

{{% /capture %}}
