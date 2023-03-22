---
title: Kubernetes APIへのアクセスコントロール
content_type: concept
weight: 50
---

<!-- overview -->
このページではKubernetes APIへのアクセスコントロールの概要を説明します。


<!-- body -->
[Kubernetes API](/ja/docs/concepts/overview/kubernetes-api/)には`kubectl`やクライアントライブラリ、あるいはRESTリクエストを用いてアクセスします。
APIアクセスには、人間のユーザーと[Kubernetesサービスアカウント](/docs/tasks/configure-pod-container/configure-service-account/)の両方が認証可能です。
リクエストがAPIに到達すると、次の図のようにいくつかの段階を経ます。

![Kubernetes APIリクエストの処理手順図](/images/docs/admin/access-control-overview.svg)

## トランスポート層のセキュリティ {#transport-security}
一般的なKubernetesクラスターでは、APIはTLSで保護された443番ポートで提供されます。
APIサーバーは証明書を提示します。
この証明書は、プライベート認証局(CA)を用いて署名することも、一般に認知されているCAと連携した公開鍵基盤に基づき署名することも可能です。

クラスターがプライベート認証局を使用している場合、接続を信頼し、傍受されていないと確信できるように、クライアント上の`~/.kube/config`に設定されたそのCA証明書のコピーが必要です。

クライアントは、この段階でTLSクライアント証明書を提示することができます。

## 認証 {#authentication}
TLSが確立されると、HTTPリクエストは認証のステップに移行します。
これは図中のステップ**1**に該当します。
クラスター作成スクリプトまたはクラスター管理者は、1つまたは複数のAuthenticatorモジュールを実行するようにAPIサーバーを設定します。
Authenticatorについては、[認証](/ja/docs/reference/access-authn-authz/authentication/)で詳しく説明されています。

認証ステップへの入力はHTTPリクエスト全体ですが、通常はヘッダとクライアント証明書の両方、またはどちらかを調べます。

認証モジュールには、クライアント証明書、パスワード、プレーントークン、ブートストラップトークン、JSON Web Tokens(サービスアカウントに使用)などがあります。

複数の認証モジュールを指定することができ、その場合、1つの認証モジュールが成功するまで、それぞれを順番に試行します。

認証できない場合、HTTPステータスコード401で拒否されます。
そうでなければ、ユーザーは特定の`username`として認証され、そのユーザー名は後続のステップでの判断に使用できるようになります。
また、ユーザーのグループメンバーシップを提供する認証機関と、提供しない認証機関があります。

Kubernetesはアクセスコントロールの決定やリクエストログにユーザー名を使用しますが、`User`オブジェクトを持たず、ユーザー名やその他のユーザーに関する情報をAPIはに保存しません。

## 認可 {#authorization}

リクエストが特定のユーザーからのものであると認証された後、そのリクエストは認可される必要があります。
これは図のステップ**2**に該当します。

リクエストには、リクエスト者のユーザー名、リクエストされたアクション、そのアクションによって影響を受けるオブジェクトを含める必要があります。
既存のポリシーで、ユーザーが要求されたアクションを完了するための権限を持っていると宣言されている場合、リクエストは承認されます。

例えば、Bobが以下のようなポリシーを持っている場合、彼は名前空間`projectCaribou`内のPodのみを読むことができます。

```json
{
    "apiVersion": "abac.authorization.kubernetes.io/v1beta1",
    "kind": "Policy",
    "spec": {
        "user": "bob",
        "namespace": "projectCaribou",
        "resource": "pods",
        "readonly": true
    }
}
```
Bobが次のようなリクエストをした場合、Bobは名前空間`projectCaribou`のオブジェクトを読むことが許可されているので、このリクエストは認可されます。

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "projectCaribou",
      "verb": "get",
      "group": "unicorn.example.org",
      "resource": "pods"
    }
  }
}
```
Bobが名前空間`projectCaribou`のオブジェクトに書き込み(`create`または`update`)のリクエストをした場合、承認は拒否されます。
また、もしBobが`projectFish`のような別の名前空間にあるオブジェクトを読み込む(`get`)リクエストをした場合も、承認は拒否されます。

Kubernetesの認可では、組織全体またはクラウドプロバイダー全体の既存のアクセスコントロールシステムと対話するために、共通のREST属性を使用する必要があります。
これらのコントロールシステムは、Kubernetes API以外のAPIとやり取りする可能性があるため、REST形式を使用することが重要です。

Kubernetesは、ABACモード、RBACモード、Webhookモードなど、複数の認可モジュールをサポートしています。
管理者はクラスターを作成する際に、APIサーバーで使用する認証モジュールを設定します。
複数の認可モジュールが設定されている場合、Kubernetesは各モジュールをチェックし、いずれかのモジュールがリクエストを認可した場合、リクエストを続行することができます。
すべてのモジュールがリクエストを拒否した場合、リクエストは拒否されます(HTTPステータスコード403)。

サポートされている認可モジュールを使用したポリシー作成の詳細を含む、Kubernetesの認可については、[認可](/docs/reference/access-authn-authz/authorization/)を参照してください。


## アドミッションコントロール {#admission-control}
アドミッションコントロールモジュールは、リクエストを変更したり拒否したりすることができるソフトウェアモジュールです。
認可モジュールが利用できる属性に加えて、アドミッションコントロールモジュールは、作成または修正されるオブジェクトのコンテンツにアクセスすることができます。

アドミッションコントローラーは、オブジェクトの作成、変更、削除、または接続(プロキシ)を行うリクエストに対して動作します。
アドミッションコントローラーは、単にオブジェクトを読み取るだけのリクエストには動作しません。
複数のアドミッションコントローラーが設定されている場合は、順番に呼び出されます。

これは図中のステップ**3**に該当します。

認証・認可モジュールとは異なり、いずれかのアドミッションコントローラーモジュールが拒否した場合、リクエストは即座に拒否されます。

オブジェクトを拒否するだけでなく、アドミッションコントローラーは、フィールドに複雑なデフォルトを設定することもできます。

利用可能なアドミッションコントロールモジュールは、[アドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/)に記載されています。

リクエストがすべてのアドミッションコントローラーを通過すると、対応するAPIオブジェクトの検証ルーチンを使って検証され、オブジェクトストアに書き込まれます(図のステップ**4**に該当します)。

## 監査 {#auditing}

Kubernetesの監査は、クラスター内の一連のアクションを文書化した、セキュリティに関連する時系列の記録を提供します。
クラスターは、ユーザー、Kubernetes APIを使用するアプリケーション、およびコントロールプレーン自身によって生成されるアクティビティを監査します。

詳しくは[監査](/ja/docs/tasks/debug/debug-cluster/audit/)をご覧ください。

## APIサーバーのIPとポート {#api-server-ports-and-ips}

これまでの説明は、APIサーバーのセキュアポートに送信されるリクエストに適用されます(典型的なケース)。
APIサーバーは、実際には2つのポートでサービスを提供することができます。


デフォルトでは、Kubernetes APIサーバーは2つのポートでHTTPを提供します。

  1. `localhost`ポート:

      - テストとブートストラップ用で、マスターノードの他のコンポーネント(スケジューラー、コントローラーマネージャー)がAPIと通信するためのものです。
      - TLSは使用しません。
      - デフォルトポートは8080です。
      - デフォルトのIPはlocalhostですが、`--insecure-bind-address`フラグで変更することができます。
      - リクエストは認証と認可のモジュールを**バイパス**します。
      - リクエストは、アドミッションコントロールモジュールによって処理されます。
      - ホストにアクセスする必要があるため、保護されています。

  2. “セキュアポート”:

      - 可能な限りこちらを使用してください。
      - TLSを使用します。証明書は`--tls-cert-file`フラグで、鍵は`--tls-private-key-file`フラグで設定します。
      - デフォルトポートは6443です。`--secure-port`フラグで変更することができます。
      - デフォルトのIPは、最初の非localhostのネットワークインターフェースです。`--bind-address`フラグで変更することができます。
      - リクエストは、認証・認可モジュールによって処理されます。
      - リクエストは、アドミッションコントロールモジュールによって処理されます。
      - 認証・認可モジュールが実行されます。

## {{% heading "whatsnext" %}}

認証、認可、APIアクセスコントロールに関する詳しいドキュメントはこちらをご覧ください。

- [認証](/ja/docs/reference/access-authn-authz/authentication/)
   - [ブートストラップトークンでの認証](/docs/reference/access-authn-authz/bootstrap-tokens/)
- [アドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/)
   - [動的アドミッションコントロール](/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [認可](/docs/reference/access-authn-authz/authorization/)
   - [ロールに基づいたアクセスコントロール](/ja/docs/reference/access-authn-authz/rbac/)
   - [属性に基づいたアクセスコントロール](/docs/reference/access-authn-authz/abac/)
   - [Nodeの認可](/docs/reference/access-authn-authz/node/)
   - [Webhookの認可](/docs/reference/access-authn-authz/webhook/)
- [証明書の署名要求](/docs/reference/access-authn-authz/certificate-signing-requests/)
   - [CSRの承認](/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection)と[証明書の署名](/docs/reference/access-authn-authz/certificate-signing-requests/#signing)を含む
- サービスアカウント
  - [Developer guide](/docs/tasks/configure-pod-container/configure-service-account/)
  - [Administration](/docs/reference/access-authn-authz/service-accounts-admin/)

以下についても知ることができます。
- PodがAPIクレデンシャルを取得するために[Secrets](/ja/docs/concepts/configuration/secret/#service-accounts-automatically-create-and-attach-secrets-with-api-credentials)を使用する方法について。
