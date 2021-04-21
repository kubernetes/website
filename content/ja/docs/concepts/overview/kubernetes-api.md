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

ほとんどの操作は、APIを使用している[kubectl](/docs/reference/kubectl/overview/)コマンドラインインターフェースもしくは[kubeadm](/docs/reference/setup-tools/kubeadm/)のような別のコマンドラインツールを通して実行できます。
RESTコールを利用して直接APIにアクセスすることも可能です。

Kubernetes APIを利用してアプリケーションを書いているのであれば、[client libraries](/docs/reference/using-api/client-libraries/)のうちひとつの利用を考えてみてください。

<!-- body -->

## OpenAPI 仕様 {#api-specification}

完全なAPIの詳細は、[OpenAPI](https://www.openapis.org/)を使用して文書化されています。

Kubernetes APIサーバーは、`/openapi/v2`エンドポイントを介してOpenAPI仕様を提供します。
次のように要求ヘッダーを使用して、応答フォーマットを要求できます。


<table>
  <caption style="display:none">OpenAPI v2クエリの有効なリクエストヘッダー値</caption>
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
</table>


Kubernetesは、他の手段として主にクラスター間の連携用途向けのAPIに、Protocol buffersをベースにしたシリアライズフォーマットを実装しています。このフォーマットに関しては、[Kubernetes Protobuf serialization](https://github.com/kubernetes/community/blob/master/contributors/des ign-proposals/api-machinery/protobuf.md)デザイン提案を参照してください。また、各スキーマのInterface Definition Language（IDL）ファイルは、APIオブジェクトを定義しているGoパッケージ内に配置されています。

## 永続性

KubernetesはAPIリソースの観点からシリアル化された状態を{{< glossary_tooltip term_id="etcd" >}}に書き込むことで保存します。

## APIグループとバージョニング

フィールドの削除やリソース表現の再構成を簡単に行えるようにするため、Kubernetesは複数のAPIバージョンをサポートしており、`/api/v1`や`/apis/rbac.authorization.k8s.io/v1alpha1`のように、それぞれ異なるAPIのパスが割り当てられています。

APIが、システムリソースと動作について明確かつ一貫したビューを提供し、サポート終了、実験的なAPIへのアクセス制御を有効にするために、リソースまたはフィールドレベルではなく、APIレベルでバージョンが行われます。

APIの発展や拡張を簡易に行えるようにするため、Kubernetesは[有効もしくは無効](/docs/reference/using-api/#enabling-or-disabling)を行える[APIグループ](/docs/reference/using-api/#api-groups)を実装しました。

APIリソースは、APIグループ、リソースタイプ、ネームスペース（namespacedリソースのための）、名前によって区別されます。APIサーバーは、APIバージョン間の変換を透過的に処理します。すべてのバージョンの違いは、実際のところ同じ永続データとして表現されます。APIサーバーは、同じ基本的なデータを複数のAPIバージョンで提供することができます。

例えば、同じリソースで`v1`と`v1beta1`の2つのバージョンが有ることを考えてみます。`v1beta1`バージョンのAPIを利用しオブジェクトを最初に作成したとして、`v1beta1`もしくは`v1`どちらのAPIバージョンを利用してもオブジェクトのread、update、deleteができます。

## APIの変更

成功を収めているシステムはすべて、新しいユースケースの出現や既存の変化に応じて成長し、変化する必要があります。
したがって、Kubernetesには、Kubernetes APIを継続的に変更および拡張できる設計機能があります。
Kubernetesプロジェクトは、既存のクライアントとの互換性を破壊 _しないこと_ 、およびその互換性を一定期間維持して、他のプロジェクトが適応する機会を提供することを目的としています。

基本的に、新しいAPIリソースと新しいリソースフィールドは追加することができます。
リソースまたはフィールドを削除するには、[API非推奨ポリシー](/docs/reference/using-api/deprecation-policy/)に従ってください。

Kubernetesは、公式のKubernetes APIが一度一般提供（GA）に達した場合、通常は`v1`APIバージョンです、互換性を維持することを強い責任があります。さらに、Kubernetesは _beta_ についても可能な限り互換性を維持し続けます。ベータAPIを採用した場合、その機能が安定版になったあとでも、APIを利用してクラスタを操作し続けることができます。

{{< note >}}
Kubernetesは、_alpha_APIバージョンについても互換性の維持に注力しますが、いくつかの事情により不可である場合もあります。アルファAPIバージョンを使っている場合、クラスタのアップグレードやAPIが変更された場合に備えて、Kubernetesのリリースノートを確認してください。
{{< /note >}}

## APIの拡張

Kubernetes APIは2つの方法で拡張できます。

1. [カスタムリソース](/ja/docs/concepts/extend-kubernetes/api-extension/custom-resources/)は、APIサーバーが選択したリソースAPIをどのように提供するかを宣言的に定義します。
1. [アグリゲーションレイヤー](/ja/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)を実装することでKubernetes APIを拡張することもできます。


## {{% heading "whatsnext" %}}

- 自分自身で[カスタムリソース定義](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)を追加してKubernetes APIを拡張する方法について学んでください。
- [Kubernetes APIのアクセス制御 ](/docs/concepts/security/controlling-access/)では、クラスターがAPIアクセスの認証と承認を管理する方法を説明しています。
- [APIリファレンス](/ja/docs/reference/kubernetes-api/)を読んで、APIエンドポイント、リソースタイプやサンプルについて学んでください。
- [APIの変更](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme)から、互換性のある変更とは何か, どのようにAPIを変更するかについて学んでください。
