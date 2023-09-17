---
title: Kubernetes Secretの適切な使用方法
description: >
  クラスター管理者とアプリケーション開発者向けの適切なSecret管理の原則と実践方法。
content_type: concept
weight: 70
---

<!-- overview -->

{{<glossary_definition prepend="Kubernetesでは、Secretは次のようなオブジェクトです。" term_id="secret" length="all">}}

以下の適切な使用方法は、クラスター管理者とアプリケーション開発者の両方を対象としています。
これらのガイドラインに従って、Secretオブジェクト内の機密情報のセキュリティを向上させ、Secretの効果的な管理を行ってください。

<!-- body -->

## クラスター管理者

このセクションでは、クラスター管理者がクラスター内の機密情報のセキュリティを強化するために使用できる適切な方法を提供します。

### データ保存時の暗号化を構成する

デフォルトでは、Secretオブジェクトは{{<glossary_tooltip term_id="etcd" text="etcd">}}内で暗号化されていない状態で保存されます。
`etcd`内のSecretデータを暗号化するように構成する必要があります。
手順については、[機密データ保存時の暗号化](/docs/tasks/administer-cluster/encrypt-data/)を参照してください。

### Secretへの最小特権アクセスを構成する {#least-privilege-secrets}

Kubernetesの{{<glossary_tooltip term_id="rbac" text="ロールベースアクセス制御">}} [(RBAC)](/docs/reference/access-authn-authz/rbac/)などのアクセス制御メカニズムを計画する際、`Secret`オブジェクトへのアクセスに関する以下のガイドラインを考慮してください。
また、[RBACの適切な使用方法](/docs/concepts/security/rbac-good-practices)の他のガイドラインにも従ってください。

- **コンポーネント**: `watch`または`list`アクセスを、最上位の特権を持つシステムレベルのコンポーネントのみに制限してください。コンポーネントの通常の動作が必要とする場合にのみ、Secretへの`get`アクセスを許可してください。
- **ユーザー**: Secretへの`get`、`watch`、`list`アクセスを制限してください。`etcd`へのアクセスはクラスター管理者にのみ許可し、読み取り専用アクセスも許可してください。特定の注釈を持つSecretへのアクセスを制限するなど、より複雑なアクセス制御については、サードパーティの認証メカニズムを検討してください。

{{< caution >}}
Secretへの`list`アクセスを暗黙的に許可すると、サブジェクトがSecretの内容を取得できるようになります。
{{< /caution >}}

Secretを使用するPodを作成できるユーザーは、そのSecretの値も見ることができます。
クラスターのポリシーがユーザーにSecretを直接読むことを許可しない場合でも、同じユーザーがSecretを公開するPodを実行するアクセスを持つかもしれません。
このようなアクセスを持つユーザーによるSecretデータの意図的または偶発的な公開の影響を検出または制限することができます。
いくつかの推奨事項には以下があります:

* 短寿命のSecretを使用する
* 特定のイベントに対してアラートを出す監査ルールを実装する(例:単一ユーザーによる複数のSecretの同時読み取り)

### etcdの管理ポリシーを改善する

使用しなくなった場合には、`etcd`が使用する永続ストレージを削除するかシュレッダーで処理してください。

複数の`etcd`インスタンスがある場合、インスタンス間の通信を暗号化されたSSL/TLS通信に設定して、転送中のSecretデータを保護してください。

### 外部Secretへのアクセスを構成する

{{% thirdparty-content %}}

外部のSecretストアプロバイダーを使用して機密データをクラスターの外部に保存し、その情報にアクセスするようにPodを構成できます。
[Kubernetes Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/)は、kubeletが外部ストアからSecretを取得し、データにアクセスすることを許可された特定のPodにSecretをボリュームとしてマウントするDaemonSetです。

サポートされているプロバイダーの一覧については、[Secret Store CSI Driverのプロバイダー](https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver)を参照してください。

## 開発者

このセクションでは、Kubernetesリソースの作成と展開時に機密データのセキュリティを向上させるための開発者向けの適切な使用方法を提供します。

### 特定のコンテナへのSecretアクセスを制限する

Pod内で複数のコンテナを定義し、そのうち1つのコンテナだけがSecretへのアクセスを必要とする場合、他のコンテナがそのSecretにアクセスできないようにボリュームマウントや環境変数の設定を行ってください。

### 読み取り後にSecretデータを保護する

アプリケーションは、環境変数やボリュームから機密情報を読み取った後も、その値を保護する必要があります。
例えば、アプリケーションは機密情報を平文でログに記録したり、信頼できない第三者に送信したりしないようにする必要があります。

### Secretマニフェストの共有を避ける
Secretを{{< glossary_tooltip text="マニフェスト" term_id="manifest" >}}を介して設定し、秘密データをBase64でエンコードしている場合、このファイルを共有したりソースリポジトリにチェックインしたりすると、その秘密はマニフェストを読むことのできる全員に公開されます。

{{< caution >}}
Base64エンコードは暗号化方法ではなく、平文と同じく機密性を提供しません。
{{< /caution >}}
