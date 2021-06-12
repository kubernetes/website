---
title: 認証
content_type: concept
weight: 10
---

<!-- overview -->
このページでは、認証の概要について説明します。


<!-- body -->
## Kubernetesにおけるユーザー

すべてのKubernetesクラスターには、2種類のユーザーがあります。Kubernetesによって管理されるサービスアカウントと、通常のユーザーです。

クラスターから独立したサービスは通常のユーザーを以下の方法で管理することを想定されています。

- 秘密鍵を配布する管理者
- KeystoneやGoogle Accountsのようなユーザーストア
- ユーザー名とパスワードのリストを持つファイル

これを考慮すると、 _Kubernetesは通常のユーザーアカウントを表すオブジェクトを持ちません。_ APIコールを介して、通常のユーザーをクラスターに追加することはできません。

APIコールを介して通常のユーザーを追加できませんが、クラスターの認証局(CA)に署名された有効な証明書で表すユーザーは認証済みと判断されます。この構成では、Kubernetesは証明書の‘subject’内にある一般的な名前フィールド(例えば、“/CN=bob”)からユーザー名を特定します。そこから、ロールベースアクセス制御(RBAC)サブシステムは、ユーザーがあるリソースにおける特定の操作を実行するために認証済みかどうか特定します。詳細は、 [証明書要求](/docs/reference/access-authn-authz/certificate-signing-requests/#normal-user)内の通常のユーザーの題目を参照してください。

対照的に、サービスアカウントはKubernetes APIによって管理されるユーザーです。サービスアカウントは特定の名前空間にバインドされており、APIサーバーによって自動的に作成されるか、APIコールによって手動で作成されます。サービスアカウントは、`Secrets`として保存された資格情報の集合に紐付けられています。これをPodにマウントすることで、クラスター内のプロセスがKubernetes APIと通信できるようにします。

APIリクエストは、通常のユーザーかサービスアカウントに紐付けられているか、[匿名リクエスト](#anonymous-requests)として扱われます。つまり、ワークステーションで`kubectl`を入力する人間のユーザーから、ノード上の`kubelets`やコントロールプレーンのメンバーまで、クラスター内外の全てのプロセスは、APIサーバーへのリクエストを行う際に認証を行うか匿名ユーザーとして扱われる必要があります。

## 認証戦略

Kubernetesは、クライアント証明書、Bearerトークン、認証プロキシー、HTTP Basic認証を使い、認証プラグインを通してAPIリクエストを認証します。APIサーバーにHTTPリクエストが送信されると、プラグインは以下の属性をリクエストに関連付けようとします。

* ユーザー名: エンドユーザーを識別する文字列です。一般的にな値は、`kube-admin`や`jane@example.com`です。
* UID: エンドユーザーを識別する文字列であり、ユーザー名よりも一貫性と一意性を持たせようとするものです。
* グループ: 各要素がユーザーの役割を示すような意味を持つ文字列の集合です。`system:masters`や`devops-team`といった値が一般的です。
* 追加フィールド: 認証者が有用と思われる追加情報を保持する文字列のリストに対する、文字列のマップです。

すべての値は認証システムに対して非透過であり、[認可機能](/docs/reference/access-authn-authz/authorization/)が解釈した場合にのみ意味を持ちます。


一度に複数の認証方法を有効にすることができます。通常は、以下のように少なくとも2つの方法を使用するべきです。

 - サービスアカウント用のサービスアカウントトークン
 - ユーザー認証のための、少なくとも1つの他の方法

複数の認証モジュールが有効化されている場合、リクエストの認証に成功した最初のモジュールが、評価が簡略化します。APIサーバーは、認証の実行順序を保証しません。

`system:authenticated`グループには、すべての認証済みユーザーのグループのリストが含まれます。

他の認証プロトコル(LDAP、SAML、Kerberos、X509スキームなど)との統合は、[認証プロキシー](#authenticating-proxy)や[認証Webhook](#webhook-token-authentication)を使用して実施できます。


### X509クライアント証明書

クライアント証明書認証は、APIサーバーに`--client-ca-file=SOMEFILE`オプションを渡すことで有効になります。参照されるファイルには、APIサーバーに提示されたクライアント証明書を検証するために使用する1つ以上の認証局が含まれている必要があります。クライアント証明書が提示され、検証された場合、サブジェクトのCommon Nameがリクエストのユーザー名として使用されます。Kubernetes1.4時点では、クライアント証明書は、証明書のOrganizationフィールドを使用して、ユーザーのグループメンバーシップを示すこともできます。あるユーザーに対して複数のグループメンバーシップを含めるには、証明書に複数のOrganizationフィールドを含めます。

例えば、証明書署名要求を生成するために、`openssl`コマンドラインツールを使用します。

``` bash
openssl req -new -key jbeda.pem -out jbeda-csr.pem -subj "/CN=jbeda/O=app1/O=app2"
```

これにより、"app1"と"app2"の2つのグループに属するユーザー名"jbeda"の証明書署名要求が作成されます。

クライアント証明書の生成方法については、[証明書の管理](/docs/concepts/cluster-administration/certificates/)を参照してください。

### 静的なトークンファイル

コマンドラインで`--token-auth-file=SOMEFILE`オプションを指定すると、APIサーバーはファイルからBearerトークンを読み込みます。現在のところ、トークンの有効期限は無く、APIサーバーを再起動しない限りトークンのリストを変更することはできません。

トークンファイルは、トークン、ユーザー名、ユーザーUIDの少なくとも3つの列を持つcsvファイルで、その後にオプションでグループ名が付きます。

{{< note >}}
複数のグループがある場合はダブルクォートで囲む必要があります。

```conf
token,user,uid,"group1,group2,group3"
```
{{< /note >}}

#### リクエストにBearerトークンを含める {#putting-a-bearer-token-in-a-request}

HTTPクライアントからBearerトークン認証を利用する場合、APIサーバーは`Bearer THETOKEN`という値を持つ`Authorization`ヘッダーを待ち受けます。Bearerトークンは、HTTPのエンコーディングとクォート機能を利用してHTTPヘッダーの値に入れることができる文字列でなければなりません。例えば、Bearerトークンが`31ada4fd-adec-460c-809a-9e56ceb75269`であれば、HTTPのヘッダを以下のようにします。

```http
Authorization: Bearer 31ada4fd-adec-460c-809a-9e56ceb75269
```

### ブートストラップトークン

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

新しいクラスタの効率的なブートストラップを可能にするために、Kubernetesには*ブートストラップトークン*と呼ばれる動的に管理されたBearerトークンタイプが含まれています。これらのトークンは、`kube-system`名前空間にSecretsとして格納され、動的に管理したり作成したりすることができます。コントローラーマネージャーには、TokenCleanerコントローラーが含まれており、ブートストラップトークンの有効期限が切れると削除します。

トークンの形式は`[a-z0-9]{6}.[a-z0-9]{16}`です。最初のコンポーネントはトークンIDであり、第2のコンポーネントはToken Secretです。以下のように、トークンをHTTPヘッダーに指定します。

```http
Authorization: Bearer 781292.db7bc3a58fc5f07e
```

APIサーバーの`--enable-bootstrap-token-auth`フラグで、Bootstrap Token Authenticatorを有効にする必要があります。TokenCleanerコントローラーを有効にするには、コントローラーマネージャーの`--controllers`フラグを使います。`--controllers=*,tokencleaner`のようにして行います。クラスターをブートストラップするために`kubeadm`を使用している場合は、`kubeadm`がこれを代行してくれます。

認証機能は`system:bootstrap:<Token ID>`という名前で認証します。これは`system:bootstrappers`グループに含まれます。名前とグループは意図的に制限されており、ユーザーがブートストラップ後にこれらのトークンを使わないようにしています。ユーザー名とグループは、クラスタのブートストラップをサポートする適切な認可ポリシーを作成するために使用され、`kubeadm`によって使用されます。

ブートストラップトークンの認証機能やコントローラーについての詳細な説明、`kubeadm`でこれらのトークンを管理する方法については、[ブートストラップトークン](/docs/reference/access-authn-authz/bootstrap-tokens/)を参照してください。

### サービスアカウントトークン

サービスアカウントは、自動的に有効化される認証機能で、署名されたBearerトークンを使ってリクエストを検証します。このプラグインは、オプションとして2つのフラグを取ります。

* `--service-account-key-file`: Bearerトークンに署名するためのPEMエンコードされた鍵を含むファイルです。指定しない場合は、APIサーバーのTLS秘密鍵が使われます。
* `--service-account-lookup`: 有効にすると、APIから削除されたトークンは取り消されます。

サービスアカウントは通常、APIサーバーによって自動的に作成され、`ServiceAccount`[Admission Controller](/docs/reference/access-authn-authz/admission-controllers/)を介してクラスター内のPodに関連付けられます。Bearerトークンは、Podのよく知られた場所にマウントされ、これによりクラスター内のプロセスがAPIサーバー通信できるようになります。アカウントは`PodSpec`の`serviceAccountName`フィールドを使って、明示的にPodに関連付けることができます。

{{< note >}}
自動で行われるため、通常`serviceAccountName`は省略します。
{{< /note >}}

```yaml
apiVersion: apps/v1 # このapiVersionは、Kubernetes1.9時点で適切です
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: default
spec:
  replicas: 3
  template:
    metadata:
    # ...
    spec:
      serviceAccountName: bob-the-bot
      containers:
      - name: nginx
        image: nginx:1.14.2
```

サービスアカウントのBearerトークンは、クラスター外で使用するために完全に有効であり、Kubernetes APIと通信したい長期的なジョブのアイデンティティを作成するために使用することができます。サービスアカウントを手動で作成するには、単に`kubectl create serviceaccount (NAME)`コマンドを使用します。これにより、現在の名前空間にサービスアカウントと関連するSecretが作成されます。


```bash
kubectl create serviceaccount jenkins
```

```none
serviceaccount "jenkins" created
```

以下のように、関連するSecretを確認できます。

```bash
kubectl get serviceaccounts jenkins -o yaml
```

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  # ...
secrets:
- name: jenkins-token-1yvwg
```

作成されたSecretは、APIサーバーのパブリック認証局と署名されたJSON Web Token(JWT)を保持します。

```bash
kubectl get secret jenkins-token-1yvwg -o yaml
```

```yaml
apiVersion: v1
data:
  ca.crt: (base64でエンコードされたAPIサーバーの認証局)
  namespace: ZGVmYXVsdA==
  token: (base64でエンコードされたBearerトークン)
kind: Secret
metadata:
  # ...
type: kubernetes.io/service-account-token
```

{{< note >}}
Secretは常にbase64でエンコードされるため、これらの値もbase64でエンコードされています。
{{< /note >}}

署名されたJWTは、与えられたサービスアカウントとして認証するためのBearerトークンとして使用できます。トークンをリクエストに含める方法については、[リクエストにBearerトークンを含める](#putting-a-bearer-token-in-a-request)を参照してください。通常、これらのSecretはAPIサーバーへのクラスタ内アクセス用にPodにマウントされますが、クラスター外からも使用することができます。

サービスアカウントは、ユーザー名`system:serviceaccount:(NAMESPACE):(SERVICEACCOUNT)`で認証され、グループ`system:serviceaccounts`と`system:serviceaccounts:(NAMESPACE)`に割り当てられます。

警告: サービスアカウントトークンはSecretに保持されているため、Secretにアクセスできるユーザーは誰でもサービスアカウントとして認証することができます。サービスアカウントに権限を付与したり、Secretの読み取り機能を付与したりする際には注意が必要です。

### OpenID Connectトークン
[OpenID Connect](https://openid.net/connect/)は、Azure Active Directory、Salesforce、Googleなど、いくつかのOAuth2プロバイダーでサポートされているOAuth2の一種です。
このプロトコルのOAuth2の主な拡張機能は、[ID Token](https://openid.net/specs/openid-connect-core-1_0.html#IDToken)と呼ばれる、アクセストークンとアクセストークンと一緒に返される追加フィールドです。
このトークンは、ユーザーの電子メールなどのよく知られたフィールドを持つJSON Web Token(JWT)であり、サーバーによって署名されています。トークンをリクエストに含める方法については、[リクエストにBearerトークンを含める](#putting-a-bearer-token-in-a-request)を参照してください。

![Kubernetes OpenID Connect Flow](/images/docs/admin/k8s_oidc_login.svg)

1.  IDプロバイダーにログインします
2.  IDプロバイダーは、`access_token`、`id_token`、`refresh_token`を提供します
3.  `kubectl`を使う場合は、`--token`フラグで`id_token`を使うか、`kubeconfig`に直接追加してください
4.  `kubectl`は、`id_token`をAuthorizationと呼ばれるヘッダーでAPIサーバーに送ります
5.  APIサーバーは、設定で指定された証明書と照合することで、JWT署名が有効であることを確認します
6.  `id_token`の有効期限が切れていないことを確認します
7.  ユーザーが認可されていることを確認します
8.  認可されると、APIサーバーは`kubectl`にレスポンスを返します
9.  `kubectl`はユーザーにフィードバックを提供します

自分が誰であるかを確認するために必要なデータはすべて`id_token`の中にあるので、KubernetesはIDプロバイダーと通信する必要がありません。すべてのリクエストがステートレスであるモデルでは、これは非常に認証のためのスケーラブルなソリューションを提供します。一方で、以下のようにいくつか課題があります。

1. Kubernetesには、認証プロセスを起動するための"Webインターフェース"がありません。クレデンシャルを収集するためのブラウザやインターフェースがないため、まずIDプロバイダに認証を行う必要があります。
2. `id_token`は、取り消すことができません。これは証明書のようなもので、有効期限が短い(数分のみ)必要があるので、数分ごとに新しいトークンを取得しなければならないのは非常に面倒です。
3. Kubernetesダッシュボードへの認証において、`kubectl proxy`コマンドや`id_token`を注入するリバースプロキシーを使う以外に、簡単な方法はありません。


#### APIサーバーの設定

プラグインを有効にするには、APIサーバーで以下のフラグを設定します。

| パラメーター | 説明 | 例 | 必須か |
| --------- | ----------- | ------- | ------- |
| `--oidc-issuer-url` | APIサーバーが公開署名鍵を発見できるようにするプロバイダーのURLです。 `https://`スキームを使用するURLのみが受け入れられます。これは通常、"https://accounts.google.com"や"https://login.salesforce.com"のようにパスを持たないプロバイダのディスカバリーURLです。このURLは、`.well-known/openid-configuration`の下のレベルを指す必要があります。 | ディスカバリーURLが`https://accounts.google.com/.well-known/openid-configuration`である場合、値は`https://accounts.google.com`とします。 | はい |
| `--oidc-client-id` | すべてのトークンが発行されなければならないクライアントIDです。 | kubernetes | はい |
| `--oidc-username-claim` | ユーザー名として使用するJWTのクレームを指定します。デフォルトでは`sub`が使用されますが、これはエンドユーザーの一意の識別子であることが期待されます。管理者はプロバイダーに応じて`email`や`name`などの他のクレームを選択することができます。ただし、他のプラグインとの名前の衝突を防ぐために、`email`以外のクレームには、プレフィックスとして発行者のURLが付けられます。 | sub | いいえ |
| `--oidc-username-prefix` | 既存の名前(`system:`ユーザーなど)との衝突を防ぐために、ユーザー名の前にプレフィックスを付加します。例えば`oidc:`という値は、`oidc:jane.doe`のようなユーザー名を生成します。このフラグが指定されておらず、`--oidc-username-claim`が`email`以外の値である場合、プレフィックスのデフォルトは`(Issuer URL)#`で、`(Issuer URL)`は`--oidc-issuer-url`の値です。すべてのプレフィックスを無効にするためには、`-`という値を使用できます。 | `oidc:` | いいえ |
| `--oidc-groups-claim` | ユーザーのグループとして使用するJWTのクレームです。クレームがある場合は、文字列の配列である必要があります。 | groups | いいえ |
| `--oidc-groups-prefix` | 既存の名前(`system:`グループなど)との衝突を防ぐために、グループ名の前にプレフィックスを付加します。例えば`oidc:`という値は、`oidc:engineering`や`oidc:infra`のようなグループ名を生成します。 | `oidc:` | いいえ |
| `--oidc-required-claim` | IDトークンの中の必須クレームを記述するkey=valueのペアです。設定されている場合、クレームが一致する値でIDトークンに存在することが検証されます。このフラグを繰り返して複数のクレームを指定します。 | `claim=value` | いいえ |
| `--oidc-ca-file` | IDプロバイダーのWeb証明書に署名した認証局の証明書へのパスです。デフォルトはホストのルート認証局が指定されます。 | `/etc/kubernetes/ssl/kc-ca.pem` | いいえ |

重要なのは、APIサーバーはOAuth2クライアントではなく、ある単一の発行者を信頼するようにしか設定できないことです。これにより、サードパーティーに発行されたクレデンシャルを信頼せずに、Googleのようなパブリックプロバイダーを使用することができます。複数のOAuthクライアントを利用したい管理者は、`azp`クレームをサポートしているプロバイダや、あるクライアントが別のクライアントに代わってトークンを発行できるような仕組みを検討する必要があります。

KubernetesはOpenID Connect IDプロバイダーを提供していません。既存のパブリックなOpenID Connect IDプロバイダー(Googleや[その他](https://connect2id.com/products/nimbus-oauth-openid-connect-sdk/openid-connect-providers)など)を使用できます。もしくは、CoreOS [dex](https://github.com/coreos/dex)、[Keycloak](https://github.com/keycloak/keycloak)、CloudFoundry[UAA](https://github.com/cloudfoundry/uaa)、Tremolo Securityの[OpenUnison](https://github.com/tremolosecurity/openunison)など、独自のIDプロバイダーを実行することもできます。

IDプロバイダーがKubernetesと連携するためには、以下のことが必要です。

1.  すべてではないが、[OpenID Connect Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html）をサポートしていること
2.  廃れていない暗号を用いたTLSで実行されていること
3.  認証局が署名した証明書を持っていること(認証局が商用ではない場合や、自己署名の場合も可)

上述の要件#3、認証局署名付き証明書を必要とすることについて、注意事項があります。GoogleやMicrosoftなどのクラウドプロバイダーではなく、独自のIDプロバイダーをデプロイする場合は、たとえ自己署名されていても、`CA`フラグが`TRUE`に設定されている証明書によって署名されたIDプロバイダーのWebサーバー証明書を持っていなければなりません。これは、Go言語のTLSクライアント実装が、証明書検証に関する標準に対して非常に厳格であるためです。認証局をお持ちでない場合は、CoreOSチームの[このスクリプト](https://github.com/coreos/dex/blob/1ee5920c54f5926d6468d2607c728b71cfe98092/examples/k8s/gencert.sh)を使用して、シンプルな認証局と署名付きの証明書と鍵のペアを作成することができます。
または、[この類似のスクリプト](https://raw.githubusercontent.com/TremoloSecurity/openunison-qs-kubernetes/master/src/main/bash/makessl.sh)を使って、より寿命が長く、よりキーサイズの大きいSHA256証明書を生成できます。

特定のシステム用のセットアップ手順は、以下を参照してください。

- [UAA](https://docs.cloudfoundry.org/concepts/architecture/uaa.html)
- [Dex](https://dexidp.io/docs/kubernetes/)
- [OpenUnison](https://www.tremolosecurity.com/orchestra-k8s/)

#### kubectlの使用

##### 選択肢1 - OIDC認証機能

最初の選択肢は、kubectlの`oidc`認証機能を利用することです。これはすべてのリクエストのBearerトークンとして`id_token`を設定し、有効期限が切れるとトークンを更新します。プロバイダーにログインした後、kubectlを使って`id_token`、`refresh_token`、`client_id`、`client_secret`を追加してプラグインを設定します。

リフレッシュトークンのレスポンスの一部として`id_token`を返さないプロバイダーは、このプラグインではサポートされていないので、以下の"選択肢2"を使用してください。

```bash
kubectl config set-credentials USER_NAME \
   --auth-provider=oidc \
   --auth-provider-arg=idp-issuer-url=( issuer url ) \
   --auth-provider-arg=client-id=( your client id ) \
   --auth-provider-arg=client-secret=( your client secret ) \
   --auth-provider-arg=refresh-token=( your refresh token ) \
   --auth-provider-arg=idp-certificate-authority=( path to your ca certificate ) \
   --auth-provider-arg=id-token=( your id_token )
```

例として、IDプロバイダーに認証した後に以下のコマンドを実行します。

```bash
kubectl config set-credentials mmosley  \
        --auth-provider=oidc  \
        --auth-provider-arg=idp-issuer-url=https://oidcidp.tremolo.lan:8443/auth/idp/OidcIdP  \
        --auth-provider-arg=client-id=kubernetes  \
        --auth-provider-arg=client-secret=1db158f6-177d-4d9c-8a8b-d36869918ec5  \
        --auth-provider-arg=refresh-token=q1bKLFOyUiosTfawzA93TzZIDzH2TNa2SMm0zEiPKTUwME6BkEo6Sql5yUWVBSWpKUGphaWpxSVAfekBOZbBhaEW+VlFUeVRGcluyVF5JT4+haZmPsluFoFu5XkpXk5BXqHega4GAXlF+ma+vmYpFcHe5eZR+slBFpZKtQA= \
        --auth-provider-arg=idp-certificate-authority=/root/ca.pem \
        --auth-provider-arg=id-token=eyJraWQiOiJDTj1vaWRjaWRwLnRyZW1vbG8ubGFuLCBPVT1EZW1vLCBPPVRybWVvbG8gU2VjdXJpdHksIEw9QXJsaW5ndG9uLCBTVD1WaXJnaW5pYSwgQz1VUy1DTj1rdWJlLWNhLTEyMDIxNDc5MjEwMzYwNzMyMTUyIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL29pZGNpZHAudHJlbW9sby5sYW46ODQ0My9hdXRoL2lkcC9PaWRjSWRQIiwiYXVkIjoia3ViZXJuZXRlcyIsImV4cCI6MTQ4MzU0OTUxMSwianRpIjoiMm96US15TXdFcHV4WDlHZUhQdy1hZyIsImlhdCI6MTQ4MzU0OTQ1MSwibmJmIjoxNDgzNTQ5MzMxLCJzdWIiOiI0YWViMzdiYS1iNjQ1LTQ4ZmQtYWIzMC0xYTAxZWU0MWUyMTgifQ.w6p4J_6qQ1HzTG9nrEOrubxIMb9K5hzcMPxc9IxPx2K4xO9l-oFiUw93daH3m5pluP6K7eOE6txBuRVfEcpJSwlelsOsW8gb8VJcnzMS9EnZpeA0tW_p-mnkFc3VcfyXuhe5R3G7aa5d8uHv70yJ9Y3-UhjiN9EhpMdfPAoEB9fYKKkJRzF7utTTIPGrSaSU6d2pcpfYKaxIwePzEkT4DfcQthoZdy9ucNvvLoi1DIC-UocFD8HLs8LYKEqSxQvOcvnThbObJ9af71EwmuE21fO5KzMW20KtAeget1gnldOosPtz1G5EwvaQ401-RPQzPGMVBld0_zMCAwZttJ4knw
```

これは以下のような構成になります。

```yaml
users:
- name: mmosley
  user:
    auth-provider:
      config:
        client-id: kubernetes
        client-secret: 1db158f6-177d-4d9c-8a8b-d36869918ec5
        id-token: eyJraWQiOiJDTj1vaWRjaWRwLnRyZW1vbG8ubGFuLCBPVT1EZW1vLCBPPVRybWVvbG8gU2VjdXJpdHksIEw9QXJsaW5ndG9uLCBTVD1WaXJnaW5pYSwgQz1VUy1DTj1rdWJlLWNhLTEyMDIxNDc5MjEwMzYwNzMyMTUyIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL29pZGNpZHAudHJlbW9sby5sYW46ODQ0My9hdXRoL2lkcC9PaWRjSWRQIiwiYXVkIjoia3ViZXJuZXRlcyIsImV4cCI6MTQ4MzU0OTUxMSwianRpIjoiMm96US15TXdFcHV4WDlHZUhQdy1hZyIsImlhdCI6MTQ4MzU0OTQ1MSwibmJmIjoxNDgzNTQ5MzMxLCJzdWIiOiI0YWViMzdiYS1iNjQ1LTQ4ZmQtYWIzMC0xYTAxZWU0MWUyMTgifQ.w6p4J_6qQ1HzTG9nrEOrubxIMb9K5hzcMPxc9IxPx2K4xO9l-oFiUw93daH3m5pluP6K7eOE6txBuRVfEcpJSwlelsOsW8gb8VJcnzMS9EnZpeA0tW_p-mnkFc3VcfyXuhe5R3G7aa5d8uHv70yJ9Y3-UhjiN9EhpMdfPAoEB9fYKKkJRzF7utTTIPGrSaSU6d2pcpfYKaxIwePzEkT4DfcQthoZdy9ucNvvLoi1DIC-UocFD8HLs8LYKEqSxQvOcvnThbObJ9af71EwmuE21fO5KzMW20KtAeget1gnldOosPtz1G5EwvaQ401-RPQzPGMVBld0_zMCAwZttJ4knw
        idp-certificate-authority: /root/ca.pem
        idp-issuer-url: https://oidcidp.tremolo.lan:8443/auth/idp/OidcIdP
        refresh-token: q1bKLFOyUiosTfawzA93TzZIDzH2TNa2SMm0zEiPKTUwME6BkEo6Sql5yUWVBSWpKUGphaWpxSVAfekBOZbBhaEW+VlFUeVRGcluyVF5JT4+haZmPsluFoFu5XkpXk5BXq
      name: oidc
```
`id_token`の有効期限が切れると、`kubectl`は`refresh_token`と`client_secret`を用いて`id_token`の更新しようとします。`refresh_token`と`id_token`の新しい値は、`.kube/config`に格納されます。

##### 選択肢2 - `--token`オプションの使用

`kubectl`コマンドでは、`--token`オプションを使ってトークンを渡すことができる。以下のように、このオプションに`id_token`をコピーして貼り付けるだけです。

```bash
kubectl --token=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL21sYi50cmVtb2xvLmxhbjo4MDQzL2F1dGgvaWRwL29pZGMiLCJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNDc0NTk2NjY5LCJqdGkiOiI2RDUzNXoxUEpFNjJOR3QxaWVyYm9RIiwiaWF0IjoxNDc0NTk2MzY5LCJuYmYiOjE0NzQ1OTYyNDksInN1YiI6Im13aW5kdSIsInVzZXJfcm9sZSI6WyJ1c2VycyIsIm5ldy1uYW1lc3BhY2Utdmlld2VyIl0sImVtYWlsIjoibXdpbmR1QG5vbW9yZWplZGkuY29tIn0.f2As579n9VNoaKzoF-dOQGmXkFKf1FMyNV0-va_B63jn-_n9LGSCca_6IVMP8pO-Zb4KvRqGyTP0r3HkHxYy5c81AnIh8ijarruczl-TK_yF5akjSTHFZD-0gRzlevBDiH8Q79NAr-ky0P4iIXS8lY9Vnjch5MF74Zx0c3alKJHJUnnpjIACByfF2SCaYzbWFMUNat-K1PaUk5-ujMBG7yYnr95xD-63n8CO8teGUAAEMx6zRjzfhnhbzX-ajwZLGwGUBT4WqjMs70-6a7_8gZmLZb2az1cZynkFRj2BaCkVT3A2RrjeEwZEtGXlMqKJ1_I2ulrOVsYx01_yD35-rw get nodes
```


### Webhookトークン認証 {#webhook-token-authentication}

Webhook認証は、Bearerトークンを検証するためのフックです。

* `--authentication-token-webhook-config-file`: リモートのWebhookサービスへのアクセス方法を記述した設定ファイルです
* `--authentication-token-webhook-cache-ttl`: 認証をキャッシュする時間を決定します。デフォルトは2分です

設定ファイルは、[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)のファイル形式を使用します。
ファイル内で、`clusters`はリモートサービスを、`users`はAPIサーバーのWebhookを指します。例えば、以下のようになります。

```yaml
# Kubernetes APIのバージョン
apiVersion: v1
# APIオブジェクトの種類
kind: Config
# clustersは、リモートサービスを指します。
clusters:
  - name: name-of-remote-authn-service
    cluster:
      certificate-authority: /path/to/ca.pem         # リモートサービスを検証するためのCA
      server: https://authn.example.com/authenticate # クエリするリモートサービスのURL。'https'を使用する必要があります。

# usersは、APIサーバーのWebhook設定を指します。
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # Webhookプラグインを使うための証明書
      client-key: /path/to/key.pem          # 証明書に合致する鍵

# kubeconfigファイルにはコンテキストが必要です。APIサーバー用のものを用意してください。
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authn-service
    user: name-of-api-sever
  name: webhook
```

クライアントが[上記](#putting-a-bearer-token-in-a-request)のようにBearerトークンを使用してAPIサーバーとの認証を試みた場合、認証Webhookはトークンを含むJSONでシリアライズされた`authentication.k8s.io/v1beta1` `TokenReview`オブジェクトをリモートサービスにPOSTします。Kubernetesはそのようなヘッダーが不足しているリクエストを作成しようとはしません。

Webhook APIオブジェクトは、他のKubernetes APIオブジェクトと同じように、[Versioning Compatibility Rule](/docs/concepts/overview/kubernetes-api/)に従うことに注意してください。実装者は、ベータオブジェクトで保証される互換性が緩いことに注意し、正しいデシリアライゼーションが使用されるようにリクエストの"apiVersion"フィールドを確認する必要があります。さらにAPIサーバーは、API拡張グループ`authentication.k8s.io/v1beta1`を有効にしなければなりません(`--runtime config=authentication.k8s.io/v1beta1=true`)。

POSTボディは、以下の形式になります。

```json
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "spec": {
    "token": "(Bearerトークン)"
  }
}
```

リモートサービスはログインの成功を示すために、リクエストの`status`フィールドを埋めることが期待されます。レスポンスボディの`spec`フィールドは無視され、省略することができます。Bearerトークンの検証に成功すると、以下のようにBearerトークンが返されます。

```json
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      "username": "janedoe@example.com",
      "uid": "42",
      "groups": [
        "developers",
        "qa"
      ],
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    }
  }
}
```

リクエストに失敗した場合は、以下のように返されます。

```json
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false
  }
}
```

HTTPステータスコードは、追加のエラーコンテキストを提供するために使うことができます。


### 認証プロキシー {#authenticating-proxy}

APIサーバーは、`X-Remote-User`のようにリクエストヘッダの値からユーザーを識別するように設定することができます。
これは、リクエストヘッダの値を設定する認証プロキシーと組み合わせて使用するために設計です。

* `--requestheader-username-headers`: 必須であり、大文字小文字を区別しません。ユーザーのIDをチェックするためのヘッダー名を順番に指定します。値を含む最初のヘッダーが、ユーザー名として使われます。
* `--requestheader-group-headers`: バージョン1.6以降で任意であり、大文字小文字を区別しません。"X-Remote-Group"を推奨します。ユーザーのグループをチェックするためのヘッダー名を順番に指定します。指定されたヘッダーの全ての値が、グループ名として使われます。
* `--requestheader-extra-headers-prefix` バージョン1.6以降で任意であり、大文字小文字を区別しません。"X-Remote-Extra-"を推奨します。ユーザーに関する追加情報を判断するために検索するヘッダーのプレフィックスです。通常、設定された認可プラグインによって使用されます。指定されたプレフィックスのいずれかで始まるヘッダーは、プレフィックスが削除されます。ヘッダー名の残りの部分は小文字化され[パーセントデコーディング](https://tools.ietf.org/html/rfc3986#section-2.1)されて追加のキーとなり、ヘッダーの値が追加の値となります。

{{< note >}}
1.11.3(および1.10.7、1.9.11)よりも前のバージョンでは、追加のキーには[HTTPヘッダーラベルで使用可能な文字](https://tools.ietf.org/html/rfc7230#section-3.2.6)のみを含めることができました。
{{< /note >}}

例えば、このような設定を行います。

```
--requestheader-username-headers=X-Remote-User
--requestheader-group-headers=X-Remote-Group
--requestheader-extra-headers-prefix=X-Remote-Extra-
```

以下のようなリクエストを考えます。

```http
GET / HTTP/1.1
X-Remote-User: fido
X-Remote-Group: dogs
X-Remote-Group: dachshunds
X-Remote-Extra-Acme.com%2Fproject: some-project
X-Remote-Extra-Scopes: openid
X-Remote-Extra-Scopes: profile
```

このリクエストは、このユーザー情報を取得します。

```yaml
name: fido
groups:
- dogs
- dachshunds
extra:
  acme.com/project:
  - some-project
  scopes:
  - openid
  - profile
```

ヘッダーのスプーフィングを防ぐため、認証プロキシーはリクエストヘッダーがチェックされる前に、指定された認証局に対する検証のために有効なクライアント証明書をAPIサーバーへ提示する必要があります。


* `--requestheader-client-ca-file`: 必須です。PEMエンコードされた証明書バンドルです。有効なクライアント証明書を提示し、リクエストヘッダーでユーザー名がチェックされる前に、指定されたファイル内の認証局に対して検証する必要があります。
* `--requestheader-allowed-names`: 任意です。Common Name(CN)の値のリストです。設定されている場合、リクエストヘッダーでユーザー名がチェックされる前に、指定されたリストのCNを持つ有効なクライアント証明書を提示する必要があります。空の場合は、任意のCNが許可されます。


## 匿名リクエスト {#anonymous-requests}

この機能を有効にすると、他の設定された認証方法で拒否されなかったリクエストは匿名リクエストとして扱われ、 `system:anonymous`というユーザー名と`system:unauthenticated`というグループが与えられます。

例えば、トークン認証が設定されており、匿名アクセスが有効になっているサーバー上で、無効なBearerトークンを提供するリクエストは`401 Unauthorized`エラーを受け取ります。Bearerトークンを提供しないリクエストは匿名リクエストとして扱われます。

バージョン1.5.1から1.5.xでは、匿名アクセスはデフォルトでは無効になっており、APIサーバーに `--anonymous-auth=true`オプションを渡すことで有効にすることができます。

バージョン1.6以降では、`AlwaysAllow`以外の認証モードが使用されている場合、匿名アクセスがデフォルトで有効であり、`--anonymous-auth=false`オプションをAPIサーバーに渡すことで無効にできます。
1.6以降、ABACおよびRBAC認可機能は、`system:anonymous`ユーザーまたは`system:unauthenticated`グループの明示的な認証を必要とするようになったため、`*`ユーザーまたは`*`グループへのアクセスを許可する従来のポリシールールには匿名ユーザーは含まれません。

## ユーザーの偽装

ユーザーは偽装ヘッダーを使って別のユーザーとして振る舞うことができます。これにより、リクエストが認証したユーザー情報を手動で上書きすることが可能です。例えば、管理者はこの機能を使って一時的に別のユーザーに偽装、リクエストが拒否されたかどうかを確認することで認可ポリシーをデバッグすることができます。

偽装リクエストは最初にリクエスト中のユーザーとして認証を行い、次に偽装ユーザー情報に切り替えます。

* ユーザーは、認証情報と偽装ヘッダーを使ってAPIコールを行います。
* APIサーバーはユーザーを認証します。
* APIサーバーは、認証されたユーザーが偽装した権限を持っていることを確認します。
* リクエストされたユーザー情報は、偽装した値に置き換えられます。
* リクエストが評価され、認可は偽装されたユーザー情報に基づいて実行されます。

偽装リクエストを実行する際には、以下のHTTPヘッダを使用することができます。

* `Impersonate-User`: ユーザー名を指定します。このユーザーとして振る舞います。
* `Impersonate-Group`: グループ名を指定します。このグループとして振る舞います。複数回指定して複数のグループを設定することができます。任意であり、"Impersonate-User"が必要です。
* `Impersonate-Extra-( extra name )`: 追加フィールドをユーザーに関連付けるために使用される動的なヘッダーです。任意であり、"Impersonate-User"が必要です。一貫して保存されるためには、`( extra name )`は小文字である必要があり、[HTTPヘッダーラベルで使用可能な文字](https://tools.ietf.org/html/rfc7230#section-3.2.6)以外の文字は、UTF-8であり、[パーセントエンコーディング](https://tools.ietf.org/html/rfc3986#section-2.1)されている必要があります.

{{< note >}}
1.11.3(および1.10.7、1.9.11)よりも前のバージョンでは、`( extra name )`には[HTTPヘッダーラベルで使用可能な文字](https://tools.ietf.org/html/rfc7230#section-3.2.6)のみを含めることができました。
{{< /note >}}

以下が、ヘッダーの例です。

```http
Impersonate-User: jane.doe@example.com
Impersonate-Group: developers
Impersonate-Group: admins
Impersonate-Extra-dn: cn=jane,ou=engineers,dc=example,dc=com
Impersonate-Extra-acme.com%2Fproject: some-project
Impersonate-Extra-scopes: view
Impersonate-Extra-scopes: development
```

`kubectl`を使う場合は、`--as`フラグに`Impersonate-User`ヘッダーを、`--as-group`フラグに`Impersonate-Group`ヘッダーを設定します。


```bash
kubectl drain mynode
```

```none
Error from server (Forbidden): User "clark" cannot get nodes at the cluster scope. (get nodes mynode)
```

`--as`フラグと`--as-group`フラグを設定します。

```bash
kubectl drain mynode --as=superman --as-group=system:masters
```

```none
node/mynode cordoned
node/mynode drained
```

ユーザー、グループ、または追加フィールドを偽装するために、偽装ユーザーは偽装される属性の種類("user"、"group"など)に対して、"偽装した"操作を行う能力を持っている必要があります。RBAC認可プラグインが有効なクラスターの場合、以下のClusterRoleは、ユーザーとグループの偽装ヘッダーを設定するために必要なルールを網羅しています。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonator
rules:
- apiGroups: [""]
  resources: ["users", "groups", "serviceaccounts"]
  verbs: ["impersonate"]
```

追加フィールドは、"userextras"リソースのサブリソースとして評価されます。ユーザーが追加フィールド"scopes"に偽装ヘッダーを使用できるようにするには、ユーザーに以下のようなロールを付与する必要があります。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: scopes-impersonator
rules:
# "Impersonate-Extra-scopes"ヘッダーを設定できます。
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes"]
  verbs: ["impersonate"]
```

偽装ヘッダーの値は、リソースが取り得る`resourceNames`の集合を制限することで、管理することもできます。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: limited-impersonator
rules:
# "jane.doe@example.com"というユーザーを偽装できます。
- apiGroups: [""]
  resources: ["users"]
  verbs: ["impersonate"]
  resourceNames: ["jane.doe@example.com"]

# "developers"と"admins"というグループを偽装できます。
- apiGroups: [""]
  resources: ["groups"]
  verbs: ["impersonate"]
  resourceNames: ["developers","admins"]

# "view"と"development"を値に持つ"scopes"という追加フィールドを偽装できます。
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes"]
  verbs: ["impersonate"]
  resourceNames: ["view", "development"]
```

## client-goクレデンシャルプラグイン

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

`k8s.io/client-go`と、それを使用する`kubectl`や`kubelet`のようなツールは、外部コマンドを実行してユーザーの認証情報を受け取ることができます。

この機能は`k8s.io/client-go`がネイティブにサポートしていない認証プロトコル(LDAP、Kerberos、OAuth2、SAMLなど)とクライアントサイドで統合するためのものです。プラグインはプロトコル固有のロジックを実装し、使用する不透明なクレデンシャルを返します。ほとんどすべてのクレデンシャルプラグインのユースケースでは、クライアントプラグインが生成するクレデンシャルフォーマットを解釈するために、[Webhookトークン認証](#webhook-token-authentication)をサポートするサーバーサイドコンポーネントが必要です。

### 使用例

ある組織は、LDAPクレデンシャルをユーザー固有の署名済みトークンと交換する外部サービスを実行すると仮定します。このサービスは、トークンを検証するために[Webhookトークン認証](#webhook-token-authentication)リクエストに応答することもできます。ユーザーはワークステーションにクレデンシャルプラグインをインストールする必要があります。

以下のようにして、APIに対して認証を行います。

* ユーザーは`kubectl`コマンドを発行します。
* クレデンシャルプラグインは、LDAPクレデンシャルの入力をユーザーに要求し、クレデンシャルを外部サービスとトークンと交換します。
* クレデンシャルプラグインはトークンを`client-go`に返します。これはAPIサーバーに対するBearerトークンとして使用されます。
* APIサーバーは、[Webhookトークン認証](#webhook-token-authentication)を使用して、`TokenReview`を外部サービスに送信します。
* 外部サービスはトークンの署名を検証し、ユーザーのユーザー名とグループを返します。

### 設定

クレデンシャルプラグインの設定は、userフィールドの一部として[kubectlの設定ファイル](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)で行います。

```yaml
apiVersion: v1
kind: Config
users:
- name: my-user
  user:
    exec:
      # 実行するコマンドです。必須です。
      command: "example-client-go-exec-plugin"

      # ExecCredentialsリソースをデコードする際に使用するAPIのバージョン。必須です。
      #
      # プラグインが返すAPIのバージョンは、ここに記載されているバージョンと一致しなければなりません
      #
      # 複数のバージョンをサポートするツール(client.authentication.k8s.io/v1alpha1など)と統合するには、
      # 環境変数を設定するか、execプラグインが期待するバージョンを示す引数をツールに渡します。
      apiVersion: "client.authentication.k8s.io/v1beta1"

      # プラグインを実行する際に設定する環境変数です。任意です。
      env:
      - name: "FOO"
        value: "bar"

      # プラグインを実行する際に渡す引数です。任意です。
      args:
      - "arg1"
      - "arg2"
clusters:
- name: my-cluster
  cluster:
    server: "https://172.17.4.100:6443"
    certificate-authority: "/etc/kubernetes/ca.pem"
contexts:
- name: my-cluster
  context:
    cluster: my-cluster
    user: my-user
current-context: my-cluster
```

相対的なコマンドパスは、設定ファイルのディレクトリーからの相対的なものとして解釈されます。KUBECONFIGが`/home/jane/kubeconfig`に設定されていて、execコマンドが`./bin/example-client-go-exec-plugin`の場合、バイナリー`/home/jane/bin/example-client-go-exec-plugin`が実行されます。

```yaml
- name: my-user
  user:
    exec:
      # kubeconfigのディレクトリーへの相対パス
      command: "./bin/example-client-go-exec-plugin"
      apiVersion: "client.authentication.k8s.io/v1beta1"
```

### 入出力フォーマット

実行されたコマンドは`ExecCredential`オブジェクトを`stdout`に出力します。`k8s.io/client-go`は`status`で返された認証情報を用いて、Kubernetes APIに対して認証を行ういます。

対話的なセッションから実行する場合、`stdin`はプラグインに直接公開されます。プラグインは[TTYチェック](https://godoc.org/golang.org/x/crypto/ssh/terminal#IsTerminal)を使って、対話的にユーザーにプロンプトを出すことが適切かどうかを判断する必要があります。

Bearerトークンのクレデンシャルを使用するために、プラグインは`ExecCredential`のステータスにトークンを返します。

```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token"
  }
}
```

あるいは、PEMエンコードされたクライアント証明書と鍵を返して、TLSクライアント認証を使用することもできます。
プラグインが後続の呼び出しで異なる証明書と鍵を返すと、`k8s.io/client-go`はサーバーとの既存の接続を閉じて、新しいTLSハンドシェイクを強制します

指定された場合、`clientKeyData`と`clientCertificateData`両方が存在しなければなりません。

`clientCertificateData`には、サーバーに送信するための中間証明書を含めることができます。

```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "clientCertificateData": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
    "clientKeyData": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
  }
}
```

オプションで、レスポンスにはRFC3339のタイムスタンプとしてフォーマットされたクレデンシャルの有効期限を含めることができます。有効期限の有無には、以下のような影響あります。

- 有効期限が含まれている場合、BearerトークンとTLSクレデンシャルは有効期限に達するまで、またはサーバーがHTTPステータスコード401で応答したとき、またはプロセスが終了するまでキャッシュされます。
- 有効期限が省略された場合、BearerトークンとTLSクレデンシャルはサーバーがHTTPステータスコード401で応答したとき、またはプロセスが終了するまでキャッシュされます。

```json
{
  "apiVersion": "client.authentication.k8s.io/v1beta1",
  "kind": "ExecCredential",
  "status": {
    "token": "my-bearer-token",
    "expirationTimestamp": "2018-03-05T17:30:20-08:00"
  }
}
```
