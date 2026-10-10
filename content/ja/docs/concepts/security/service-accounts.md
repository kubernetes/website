---
title: サービスアカウント
description: >
  KubernetesのServicesAccountオブジェクトについて学びます。
api_metadata:
- apiVersion: "v1"
  kind: "ServiceAccount"
content_type: concept
weight: 25
---

<!-- overview -->

このページではKubernetesのServiceAccountオブジェクトについて説明し、どのようにサービスアカウントが機能するか、使用例、制限、代替手段、追加のガイダンスとなるリソースへのリンクを紹介します。

<!-- body -->

## サービスアカウントとは？ {#what-are-service-accounts}

サービスアカウントは、Kubernetesにおいて、Kubernetesクラスター内で固有のアイデンティティを提供する人間以外のアカウントの一種です。
アプリケーションPod、システムコンポーネント、およびクラスター内外のエンティティは、特定のServiceAccountの認証情報を使用してそのServiceAccountとして識別できます。
このアイデンティティは、APIサーバーへの認証やアイデンティティベースのセキュリティポリシーの実装など、さまざまな状況で役立ちます。

サービスアカウントは、APIサーバー内のServiceAccountオブジェクトとして存在します。
サービスアカウントには次の特性があります:

* **Namespaced:** 各サービスアカウントはKubernetesの{{<glossary_tooltip text="namespace" term_id="namespace">}}にバインドされます。
  各namespaceは作成時に[`default` ServiceAccount](#default-service-accounts)を取得します。

* **Lightweight:** サービスアカウントはクラスター内に存在し、Kubernetes APIで定義されています。
  特定のタスクを有効にするためにサービスアカウントを素早く作成できます。

* **Portable:** 複雑なコンテナ化されたワークロードの構成バンドルには、システムのコンポーネントのサービスアカウント定義が含まれる場合があります。
  サービスアカウントの軽量性と名前空間内のアイデンティティは、構成をポータブルにします。

サービスアカウントは、クラスター内の認証された人間のユーザーであるユーザーアカウントとは異なります。
デフォルトでは、KubernetesのAPIサーバーにユーザーアカウントは存在しません。代わりに、APIサーバーはユーザーのアイデンティティを不透明なデータとして扱います。
複数の方法を使用して、ユーザーアカウントとして認証できます。
一部のKubernetesディストリビューションでは、APIサーバーでユーザーアカウントを表すカスタム拡張APIが追加されることがあります。

{{< table caption="サービスアカウントとユーザーの比較" >}}

| 説明 | ServiceAccount | ユーザーまたはグループ |
| --- | --- | --- |
| ロケーション | Kubernetes API (ServiceAccountオブジェクト) | 外部 |
| アクセス制御 | Kubernetes RBACまたはその他の[認可メカニズム](/docs/reference/access-authn-authz/authorization/#authorization-modules) | Kubernetes RBACまたはその他のアイデンティティおよびアクセス管理メカニズム |
| 使用目的 | ワークロード、自動化 | 人間 |

{{< /table >}}

### デフォルトのサービスアカウント {#default-service-accounts}

クラスターを作成すると、Kubernetesはクラスター内の各Namespaceに対して`default`という名前のServiceAccountオブジェクトを自動的に作成します。
各Namespaceの`default`サービスアカウントは、ロールベースのアクセス制御(RBAC)が有効になっている場合、Kubernetesがすべての認証されたプリンシパルに付与する[デフォルトのAPI検出権限](/ja/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings)以外の権限をデフォルトで取得しません。
Namespace内の`default` ServiceAccountオブジェクトを削除すると、{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}が新しいServiceAccountオブジェクトを作成します。

NamespaceにPodをデプロイし、[Podに手動でServiceAccountを割り当て](#assign-to-pod)ない場合、KubernetesはそのNamespaceの`default` ServiceAccountをPodに割り当てます。

## Kubernetesサービスアカウントの使用例 {#use-cases}

一般的なガイドラインとして、次のシナリオでサービスアカウントを使用できます:

* PodがKubernetes APIサーバーと通信する必要がある場合、例えば次のような場合です:
  * Secretに保存されている機密情報への読み取り専用アクセスを提供します。
  * [Namespaceをまたいだアクセス](#cross-namespace)を許可します。例えば、`example` NamespaceのPodが`kube-node-lease` NamespaceのLeaseオブジェクトを読み取り、一覧、監視することを許可します。
* Podが外部のサービスと通信する必要がある場合。例えば、ワークロードのPodには商用クラウドAPIのアイデンティティが必要であり、商用プロバイダーは適切な信頼関係の構成を許可する場合です。
* [`imagePullSecret`を使用してプライベートイメージレジストリに認証する](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)場合。
* 外部サービスがKubernetes APIサーバーと通信する必要がある場合。例えば、CI/CDパイプラインの一部としてクラスターに認証する必要がある場合です。
* クラスター内でサードパーティのセキュリティソフトウェアを使用する場合。さまざまなPodのServiceAccountアイデンティティを使用してこれらのPodを異なるコンテキストにグループ化します。

## サービスアカウントの使用方法 {#how-to-use}

Kubernetesサービスアカウントを使用するには、次の手順を実行します:

1. `kubectl`などのKubernetesクライアントを使用してServiceAccountオブジェクトを作成するか、オブジェクトを定義するマニフェストを使用します。
1. [RBAC](/ja/docs/reference/access-authn-authz/rbac/)などの認可メカニズムを使用してServiceAccountオブジェクトに権限を付与します。
1. Podの作成時にServiceAccountオブジェクトをPodに割り当てます。
   
   外部サービスからのアイデンティティを使用している場合は、[ServiceAccountトークンを取得](#get-a-token)し、そのサービスから使用します。

詳細な手順については、[PodにServiceAccountを割り当てる](/docs/tasks/configure-pod-container/configure-service-account/)を参照してください。

### ServiceAccountに権限を付与する {#grant-permissions}

各ServiceAccountに必要な最小限の権限を付与するために、Kubernetesビルトインの[ロールベースのアクセス制御(RBAC)](/ja/docs/reference/access-authn-authz/rbac/)メカニズムを使用できます。
ServiceAccountにアクセスを付与する*ロール*を作成し、そのロールをServiceAccountに*バインド*します。
RBACを使用すると、ServiceAccountの権限が最小限になるように定義できます。
PodがそのServiceAccountを使用している場合、そのPodは正しく機能するために必要な権限以上の権限を取得しません。

詳細な手順については、[ServiceAccount権限](/ja/docs/reference/access-authn-authz/rbac/#service-account-permissions)を参照してください。

#### ServiceAccountを使用したNamespace間のアクセス {#cross-namespace}

RBACを使用して、クラスターの異なるNamespaceにあるリソースに対して別のNamespaceのServiceAccountがアクションを実行できるようにすることができます。
例えば、`dev` NamespaceにサービスアカウントとPodがあり、そのPodが`maintenance` Namespaceで実行されているJobを見る必要がある場合を考えてみましょう。
Jobオブジェクトをリストする権限を付与するRoleオブジェクトを作成できます。
次に、そのRoleを`maintenance` NamespaceのServiceAccountオブジェクトにバインドするRoleBindingオブジェクトを作成します。
そうすることで、`dev` NamespaceのPodは、そのServiceAccountを使用して`maintenance` NamespaceのJobオブジェクトをリストできます。

### PodにServiceAccountを割り当てる {#assign-to-pod}

ServiceAccountをPodに割り当てるには、Podの仕様にある`spec.serviceAccountName`フィールドを設定します。
Kubernetesは、そのServiceAccountの認証情報をPodに自動的に提供します。
v1.22以降では、Kubernetesは`TokenRequest` APIを使用して有効期間が短く**自動的にローテーションされる**トークンを取得し、そのトークンを[投影ボリューム](/ja/docs/concepts/storage/projected-volumes/#serviceaccounttoken)としてPodにマウントします。

デフォルトではKubernetesは、ServiceAccountが`default` ServiceAccountか指定したカスタムServiceAccountであるかに関わらず、PodにそのServiceAccountの認証情報を提供します。

Kubernetesが指定されたServiceAccountまたは`default` ServiceAccountの認証情報を自動的に注入しないようにするには、Podの使用にある`automountServiceAccountToken`フィールドを`false`に設定します。

<!-- Kubernetes 1.31がリリースされた後、この履歴の詳細は削除しても問題ありません -->

1.22より前のバージョンでは、Kubernetesは有効期間の長い静的なトークンをSecretとしてPodに提供します。

#### ServiceAccount認証情報の手動取得 {#get-a-token}

ServiceAccountを標準以外の場所にマウントするための認証情報、またはAPIサーバー以外の対象向けの認証情報が必要な場合は、次のいずれかの方法を使用します:

* [TokenRequest API](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
  (推奨): 独自の*アプリケーションコード*から短期間のサービスアカウントトークンをリクエストします。
  トークンは自動的に期限切れになり、期限切れ時にローテーションできます。
  Kubernetesに対応していないレガシーアプリケーションがある場合、同じPod内のサイドカーコンテナを使用してこれらのトークンを取得し、アプリケーションワークロードで使用できるようにすることができます。
* [トークン投影ボリューム](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)
  (推奨): Kubernetes v1.20以降では、Podの仕様を使用して、kubeletにサービスアカウントトークンを投影ボリュームとしてPodに追加するように指示します。
  投影トークンは自動的に期限切れになり、kubeletはトークンが期限切れになる前にトークンをローテーションします。
* [サービスアカウントトークンシークレット](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)（Kubernetes v1.24からv1.26ではデフォルトで有効）
  (非推奨): サービスアカウントトークンをKubernetes SecretとしてPodにマウントできます。
  これらのトークンは期限切れになることも、ローテーションされることもありません。
  v1.24以前のバージョンでは、サービスアカウントごとに永続的なトークンが自動的に作成されていました。
  この方法は、静的で有効期間の長い認証情報に関するリスクがあるため、特に大規模な環境では推奨されなくなりました。
  [LegacyServiceAccountTokenNoAutoGenerationフィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates-removed)により、Kubernetesが指定されたServiceAccountに対してこれらのトークンを自動的に作成するのを防止できました。
  このフィーチャーゲートはGAステータスに昇格したため、v1.27では削除されました。
  無期限のサービスアカウントトークンを手動で作成することは引き続き可能ですが、セキュリティ上の影響を考慮する必要があります。

{{< note >}}
Kubernetesクラスターの外部で実行されるアプリケーションの場合は、Secretに保存される有効期間の長いServiceAccountトークンの作成を検討するかもしれません。
これにより認証が可能になりますが、Kubernetesプロジェクトではこのアプローチを避けることを推奨しています。
長期間有効なBearerトークンは、一度漏洩するとトークンが悪用される可能性があるため、セキュリティリスクとなります。
代わりとなる手段を検討してください。
例えば、外部アプリケーションは、十分に保護された秘密鍵 **と** 証明書を使用して認証するか、独自に実装した[Webhook認証](/ja/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)などのカスタムメカニズムを使用して認証することもできます。

また、`TokenRequest`を使用して外部アプリケーションのために有効期間の短いトークンを取得することもできます。
{{< /note >}}

### シークレットへのアクセスを制限する {#enforce-mountable-secrets}

Kubernetesは、ServiceAccountに追加できる`kubernetes.io/enforce-mountable-secrets`というアノテーションを提供しています。
このアノテーションを適用すると、ServiceAccountのシークレットは指定された種類のリソースにのみマウントできるため、クラスターのセキュリティ体制が強化されます。

マニフェストを使用してServiceAccountにアノテーションを追加できます:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    kubernetes.io/enforce-mountable-secrets: "true"
  name: my-serviceaccount
  namespace: my-namespace
```
このアノテーションが"true"に設定されている場合、Kubernetesコントロールプレーンは、このServiceAccountのSecretが特定のマウント制限の対象であることを確認します。

1. Pod内のボリュームとしてマウントされる各Secretの名前は、PodのServiceAccountの`secrets`フィールドに表示される必要があります。
1. Pod内の`envFrom`を使用して参照される各Secretの名前は、PodのServiceAccountの`secrets`フィールドに表示される必要があります。
1. Pod内の`imagePullSecrets`を使用して参照される各Secretの名前は、PodのServiceAccountの`secrets`フィールドに表示される必要があります。  

これらの制限を理解して適用することで、クラスター管理者はより厳格なセキュリティプロファイルを維持し、適切なリソースのみがシークレットにアクセスできるようにします。

## サービスアカウント認証情報の認証 {#authenticating-credentials}

ServiceAccountは、Kubernetes APIサーバーおよび信頼関係が存在する他のシステムに対して、署名された{{<glossary_tooltip term_id="jwt" text="JSON Web Tokens">}} (JWTs) を使用して認証を行います。
トークンの発行方法(`TokenRequest`を使用して時間制限付きで発行されるか、Secretを使用して従来のメカニズムで発行されるか)に応じて、ServiceAccountトークンには有効期限、オーディエンス、トークンが*有効になる*時間などが含まれる場合があります。
ServiceAccountとして機能しているクライアントがKubernetes APIサーバーと通信しようとすると、クライアントはHTTPリクエストに`Authorization: Bearer <token>`ヘッダーを含めます。
APIサーバーは、次のようにしてBearerトークンの有効性を確認します:

1. トークンの署名を確認します。
1. トークンが期限切れかどうかを確認します。
1. トークン要求内のオブジェクト参照が現在有効かどうかを確認します。
1. トークンが現在有効かどうかを確認します。
1. オーディエンス要求を確認します。

TokenRequest APIは、ServiceAccountに _バインドされたトークン_ を生成します。
このバインディングは、そのServiceAccountとして機能しているクライアント(Podなど)のライフタイムにリンクされています。
バインドされたPodのサービスアカウントトークンのJWTスキーマとペイロードの例については、[トークンボリューム投影](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)を参照してください。

`TokenRequest` APIを使用して発行されたトークンの場合、APIサーバーは、そのオブジェクトの {{< glossary_tooltip term_id="uid" text="ユニークID" >}} と一致する、ServiceAccountを使用している特定のオブジェクト参照がまだ存在するかどうかも確認します。
PodにSecretとしてマウントされているレガシートークンの場合、APIサーバーはトークンをSecretと照合します。

認証プロセスの詳細については、[認証](/ja/docs/reference/access-authn-authz/authentication/)を参照してください。

### 独自のコードでサービスアカウントの認証情報を認証する {#authenticating-in-code}

Kubernetesサービスアカウントの認証情報の検証が必要なサービスがある場合、次の方法を使用できます:

* [TokenReview API](/docs/reference/kubernetes-api/authentication-resources/token-review-v1/)
  (推奨)
* OIDC検出

Kubernetesプロジェクトでは、TokenReview APIの使用を推奨しており、この方法ではSecret、ServiceAccount、Pod、NodeなどのAPIオブジェクトにバインドされたトークンが削除されると、そのトークンが無効になります。
例えば、投影されたServiceAccountトークンを含むPodを削除すると、クラスターはただちにそのトークンを無効にし、TokenReviewはただちに失敗します。
代わりにOIDC認証を使用する場合、トークンが有効期限のタイムスタンプに達するまで、クライアントはトークンを有効なものとして扱い続けます。

アプリケーションでは、受け入れるオーディエンスを常に定義し、トークンのオーディエンスがアプリケーションが期待するオーディエンスと一致するかどうかを確認する必要があります。
これにより、トークンのスコープが最小限に抑えられ、アプリケーション内でのみ使用でき、他の場所では使用できないようになります。

## 代替案

* 別のメカニズムを使用して独自のトークンを発行し、[Webhookトークン認証](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)を使用して、独自の検証サービスを使用してBearerトークンを検証します。
* Podに独自のアイデンティティを提供します。
  * [SPIFFE CSIドライバープラグインを使用して、SPIFFE SVID をX.509証明書ペアとしてPodに提供します](https://cert-manager.io/docs/projects/csi-driver-spiffe/)。
    {{% thirdparty-content single="true" %}}
  * [Istioなどのサービスメッシュを使用してPodに証明書を提供します](https://istio.io/latest/docs/tasks/security/cert-management/plugin-ca-cert/)。
* サービスアカウントトークンを使用せずに、クラスター外部からAPIサーバーに認証します:
  * [IDプロバイダーからのOpenID Connect (OIDC)トークンを受け入れるようにAPIサーバーを構成します](/ja/docs/reference/access-authn-authz/authentication/#openid-connect-tokens)。
  * クラウドプロバイダーなどの外部のIdentity
    and Access Management (IAM)サービスを使用して作成されたサービスアカウントまたはユーザーアカウントを使用して、クラスターに認証します。
  * [クライアント証明書でCertificateSigningRequest APIを使用します](/docs/tasks/tls/managing-tls-in-a-cluster/)。
* [イメージレジストリから認証情報を取得するようにkubeletを構成する](/docs/tasks/administer-cluster/kubelet-credential-provider/).
* Device Pluginを使用して仮想Trusted Platform Module (TPM)にアクセスし、秘密鍵を使用した認証を許可します。

## {{% heading "whatsnext" %}}

* [クラスターの管理者としてServiceAccountを管理する](/docs/reference/access-authn-authz/service-accounts-admin/)方法を学ぶ
* [PodにServiceAccountを割り当てる方法](/docs/tasks/configure-pod-container/configure-service-account/)を学ぶ
* [ServiceAccount APIリファレンス](/docs/reference/kubernetes-api/authentication-resources/service-account-v1/)を読む
