---
title: PodにServiceAccountを設定する
content_type: task
weight: 120
---

Kubernetesは、クラスター内で実行されるクライアント、またはクラスターの{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}と何らかの関係を持つクライアントが、{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}に対して認証を行うために、2つの異なる方法を提供しています。

_ServiceAccount_ は、Pod内で実行されるプロセスにアイデンティティを提供し、ServiceAccountオブジェクトにマッピングされます。
APIサーバーに対して認証を行う際、あなたは特定の _ユーザー_ として自分自身を識別します。
Kubernetesはユーザーという概念を認識していますが、Kubernetes自体はUser APIを**持っていません**。

このタスクガイドでは、Kubernetes APIに存在するServiceAccountについて説明します。
このガイドでは、PodにServiceAccountを設定する方法をいくつか示します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## デフォルトのServiceAccountを使用してAPIサーバーにアクセスする {#use-the-default-service-account-to-access-the-api-server}

PodがAPIサーバーに接続する際、Podは特定のServiceAccount(例: `default`)として認証を行います。
それぞれの{{< glossary_tooltip text="名前空間" term_id="namespace" >}}には、常に少なくとも1つのServiceAccountが存在します。

すべてのKubernetes名前空間には、少なくとも1つのServiceAccountが含まれています。
それは、その名前空間のデフォルトのServiceAccountであり、`default`という名前が付けられています。
Podを作成する際にServiceAccountを指定しない場合、Kubernetesは自動的にその名前空間内に、`default`という名前のServiceAccountを割り当てます。

作成したPodの詳細を取得するには、たとえば下記を実行します:

```shell
kubectl get pods/<podname> -o yaml
```

出力には、`spec.serviceAccountName`フィールドが表示されます。
Podを作成する際にこの値を指定しない場合、Kubernetesは自動的にこの値を設定します。

Pod内で実行されているアプリケーションは、自動的にマウントされたServiceAccountの認証情報を使用して、Kubernetes APIにアクセスできます。
詳細については、[クラスターへのアクセス](/docs/tasks/access-application-cluster/access-cluster/)を参照してください。

PodがServiceAccountとして認証を行う場合、そのアクセスレベルは、使用する[認可プラグインとポリシー](/docs/reference/access-authn-authz/authorization/#authorization-modules)に依存します。

ファイナライザーが設定されている場合でも、Podが削除されるとAPI認証情報は自動的に取り消されます。
具体的には、Podに設定された`.metadata.deletionTimestamp`(削除タイムスタンプは通常、**削除**リクエストが受け入れられた時刻にPodの終了猶予期間を加えた時刻です)から60秒後にAPI認証情報が取り消されます。

### API認証情報の自動マウントをオプトアウトする {#opt-out-of-api-credential-automounting}

{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}が、ServiceAccountのAPI認証情報を自動的にマウントしないようにしたい場合、デフォルトの挙動をオプトアウトできます。
ServiceAccountに対して、`automountServiceAccountToken: false`を設定することで、`/var/run/secrets/kubernetes.io/serviceaccount/token`へのAPI認証情報の自動マウントをオプトアウトできます。

例:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
automountServiceAccountToken: false
...
```

また、特定のPodに対してAPI認証情報の自動マウントをオプトアウトすることもできます:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  serviceAccountName: build-robot
  automountServiceAccountToken: false
  ...
```

ServiceAccountとPodの`.spec`の両方が`automountServiceAccountToken`の値を指定している場合、Podの仕様が優先されます。

## 複数のServiceAccountを使用する {#use-multiple-service-accounts}

すべての名前空間には、少なくとも1つのServiceAccountが存在します。
それは、`default`という名前のデフォルトのServiceAccountリソースです。
[現在の名前空間](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference)内のすべてのServiceAccountリソースを次のコマンドで一覧表示できます:

```shell
kubectl get serviceaccounts
```

出力は以下のようになります:

```
NAME      SECRETS    AGE
default   1          1d
```

次のように、追加のServiceAccountオブジェクトを作成できます:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
EOF
```

ServiceAccountオブジェクトの名前は、有効な[DNSサブドメイン名](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)である必要があります。

次のように、ServiceAccountオブジェクトの完全なダンプを取得する場合:

```shell
kubectl get serviceaccounts/build-robot -o yaml
```

出力は以下のようになります:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2019-06-16T00:12:34Z
  name: build-robot
  namespace: default
  resourceVersion: "272500"
  uid: 721ab723-13bc-11e5-aec2-42010af0021e
```

認可プラグインを使用して、[ServiceAccountに権限を設定](/docs/reference/access-authn-authz/rbac/#service-account-permissions)できます。

デフォルト以外のServiceAccountを使用するには、Podの`spec.serviceAccountName`フィールドを、使用したいServiceAccountの名前に設定します。

`serviceAccountName`フィールドは、Podを作成する際、または新しいPodのテンプレート内でのみ設定できます。既に存在するPodの`.spec.serviceAccountName`フィールドは更新できません。

{{< note >}}
`.spec.serviceAccount`フィールドは、`.spec.serviceAccountName`の非推奨のエイリアスです。
ワークロードリソースからこれらのフィールドを削除したい場合は、[Podテンプレート](/docs/concepts/workloads/pods#pod-templates)で両方のフィールドを明示的に空に設定してください。
{{< /note >}}

### クリーンアップ {#cleanup-use-multiple-service-accounts}

上記の例で`build-robot` ServiceAccountを作成した場合、次のコマンドを実行してクリーンアップできます:

```shell
kubectl delete serviceaccount/build-robot
```

## ServiceAccountのAPIトークンを手動で作成する {#manually-create-an-api-token-for-a-serviceaccount}

前述のように、「build-robot」という名前の既存のServiceAccountがあるとします。

`kubectl`を使用して、そのServiceAccountの期限付きAPIトークンを取得できます:
```shell
kubectl create token build-robot
```

このコマンドの出力は、そのServiceAccountとして認証するために使用できるトークンです。`kubectl create token`の`--duration`コマンドライン引数を使用して、特定のトークン期間を要求できます(発行されるトークンの実際の期間は短くなる場合や、長くなる場合もあります)。

{{< feature-state feature_gate_name="ServiceAccountTokenNodeBinding" >}}

kubectl v1.31以降を使用すると、ノードに直接バインドされたServiceAccountトークンを作成できます:

```shell
kubectl create token build-robot --bound-object-kind Node --bound-object-name node-001 --bound-object-uid 123...456
```

トークンは、有効期限が切れるか、関連するノードまたはServiceAccountが削除されるまで有効です。

{{< note >}}
Kubernetes v1.22以前のバージョンでは、Kubernetes APIにアクセスするための長期的な認証情報が自動的に作成されていました。
この古いメカニズムは、実行中のPodにマウントされるトークンSecretの作成に基づいていました。
Kubernetes v{{< skew currentVersion >}}を含む最近のバージョンでは、API認証情報は[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) APIを使用して直接取得され、[projected volume](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)を使用してPodにマウントされます。
この方法で取得されたトークンには有効期限があり、マウント先のPodが削除されると自動的に無効になります。

ServiceAccount用のトークンSecretを手動で作成することも可能です。
例えば、有効期限のないトークンが必要な場合などです。
ただし、APIにアクセスするためのトークンを取得するには、[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)サブリソースを使用することを推奨します。
{{< /note >}}

### ServiceAccount用の長期間有効なAPIトークンを手動で作成する {#manually-create-a-long-lived-api-token-for-a-serviceaccount}

ServiceAccount用のAPIトークンを取得したい場合は、特別なアノテーション`kubernetes.io/service-account.name`を持つ新しいSecretを作成します。

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: build-robot-secret
  annotations:
    kubernetes.io/service-account.name: build-robot
type: kubernetes.io/service-account-token
EOF
```

次のコマンドでSecretを表示する場合:

```shell
kubectl get secret/build-robot-secret -o yaml
```

Secretに「build-robot」ServiceAccount用のAPIトークンが含まれていることが確認できます。

設定したアノテーションにより、コントロールプレーンはそのServiceAccount用のトークンを自動的に生成し、関連するSecretに保存します。
また、コントロールプレーンは削除されたServiceAccount用のトークンをクリーンアップします。

```shell
kubectl describe secrets/build-robot-secret
```

出力は以下のようになります:

```
Name:           build-robot-secret
Namespace:      default
Labels:         <none>
Annotations:    kubernetes.io/service-account.name: build-robot
                kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1338 bytes
namespace:      7 bytes
token:          ...
```

{{< note >}}
`token`の内容はここでは省略されています。

ターミナルやコンピューターの画面が覗き見される可能性がある場所で、`kubernetes.io/service-account-token` Secretの内容を表示しないよう注意してください。
{{< /note >}}

関連するSecretを持つServiceAccountを削除すると、KubernetesコントロールプレーンはそのSecretから長期的なトークンを自動的にクリーンアップします。

{{< note >}}
次のコマンドでServiceAccountを表示する場合:

` kubectl get serviceaccount build-robot -o yaml`

ServiceAccount APIオブジェクトの[`.secrets`](/docs/reference/kubernetes-api/authentication-resources/service-account-v1/)フィールドに`build-robot-secret` Secretは表示されません。
このフィールドには自動生成されたSecretのみが入力されるためです。
{{< /note >}}

## ServiceAccountにImagePullSecretを追加する {#add-imagepullsecrets-to-a-service-account}

まず、[imagePullSecretを作成](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)します。
次に、作成されたことを確認します。
以下は、その例です:

- [PodでのImagePullSecretの指定](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)で説明されているように、imagePullSecretを作成します。

  ```shell
    kubectl create secret docker-registry myregistrykey --docker-server=<レジストリ名> \
            --docker-username=DUMMY_USERNAME --docker-password=DUMMY_DOCKER_PASSWORD \
            --docker-email=DUMMY_DOCKER_EMAIL
  ```

- 作成されたことを確認します。

  ```shell
    kubectl get secrets myregistrykey
  ```

  出力は以下のようになります:

  ```
    NAME             TYPE                              DATA    AGE
    myregistrykey    kubernetes.io/.dockerconfigjson   1       1d
  ```

### ServiceAccountにimage pull secretを追加する {#add-image-pull-secret-to-service-account}

次に、名前空間のデフォルトのServiceAccountを変更して、このSecretをimagePullSecretとして使用するようにします。

```shell
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'
```

オブジェクトを手動で編集することでも同じ結果を得られます:

```shell
kubectl edit serviceaccount/default
```

`sa.yaml`ファイルの出力は以下のようになります:

使用しているテキストエディタが開き、以下のような設定が表示されます:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2021-07-07T22:02:39Z
  name: default
  namespace: default
  resourceVersion: "243024"
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
```

エディタを使用して、`resourceVersion`キーを持つ行を削除し、`imagePullSecrets:`の行を追加して保存します。`uid`の値は変更しないでおきます。

これらの変更を行うと、編集後のServiceAccountは以下のようになります:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2021-07-07T22:02:39Z
  name: default
  namespace: default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
imagePullSecrets:
  - name: myregistrykey
```

### 新しいPodにimagePullSecretが設定されていることを確認する {#verify-that-imagepullsecrets-are-set-for-new-pods}

現在の名前空間に、デフォルトのServiceAccountを使用して新しいPodが作成されると、新しいPodの`spec.imagePullSecrets`フィールドが自動的に設定されます:

```shell
kubectl run nginx --image=<レジストリ名>/nginx --restart=Never
kubectl get pod nginx -o=jsonpath='{.spec.imagePullSecrets[0].name}{"\n"}'
```

出力は以下のようになります:

```
myregistrykey
```

## ServiceAccountトークンボリューム投影 {#serviceaccount-token-volume-projection}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

{{< note >}}
トークンリクエスト投影を有効化して使用するには、`kube-apiserver`に以下の各コマンドライン引数を指定する必要があります:

`--service-account-issuer`
: ServiceAccountトークン発行者の識別子を定義します。
  `--service-account-issuer`引数は複数回指定でき、発行者をダウンタイムなしで変更するのに役立ちます。
  このフラグを複数回指定した場合、最初のものがトークンの生成に使用され、すべてが受け入れ可能な発行者の判定に使用されます。
  `--service-account-issuer`を複数回指定するには、Kubernetes v1.22以降を実行する必要があります。

`--service-account-key-file`
: ServiceAccountトークンの検証に使用される、PEMエンコードされたX.509秘密鍵または公開鍵(RSAまたはECDSA)を含むファイルのパスを指定します。
  指定したファイルには複数の鍵を含めることができ、フラグは異なるファイルで複数回指定できます。
  複数回指定された場合、指定された鍵のいずれかで署名されたトークンは、Kubernetes APIサーバーによって有効と見なされます。

`--service-account-signing-key-file`
: ServiceAccountトークン発行者の現在の秘密鍵を含むファイルのパスを指定します。
  発行者はこの秘密鍵を使用して発行されたIDトークンに署名します。

`--api-audiences`(省略可能)
: ServiceAccountトークンのオーディエンスを定義します。
  ServiceAccountトークン認証機能は、APIに対して使用されるトークンが、これらのオーディエンスの少なくとも1つにバインドされていることを検証します。
  `api-audiences`を複数回指定した場合、指定したオーディエンスのいずれかに対応するトークンは、Kubernetes APIサーバーによって有効と見なされます。
  `--service-account-issuer`コマンドライン引数を指定しても`--api-audiences`を設定しない場合、コントロールプレーンはデフォルトで発行者URLのみを含むオーディエンスリストを使用します。

{{< /note >}}

kubeletも、ServiceAccountトークンをPodに投影できます。
トークンの望ましいプロパティ(オーディエンスや有効期間など)を指定できます。
これらのプロパティは、デフォルトのServiceAccountトークンでは設定 _できません_。
また、PodまたはServiceAccountのいずれかが削除されると、トークンはAPIに対して無効になります。

この挙動は、`ServiceAccountToken`と呼ばれる[projected volume](/docs/concepts/storage/volumes/#projected)タイプを使用してPodの`spec`で設定できます。

この投影ボリュームのトークンは{{<glossary_tooltip term_id="jwt" text="JSON Web Token">}}(JWT)です。
このトークンのJSONペイロードは明確に定義されたスキーマに従い、以下はPodにバインドされたトークンのペイロードの例です:

```yaml
{
  "aud": [  # リクエストされたオーディエンス、または明示的にリクエストされない場合はAPIサーバーのデフォルトオーディエンスと一致
    "https://kubernetes.default.svc"
  ],
  "exp": 1731613413,
  "iat": 1700077413,
  "iss": "https://kubernetes.default.svc",  # --service-account-issuerフラグに渡された最初の値と一致
  "jti": "ea28ed49-2e11-4280-9ec5-bc3d1d84661a", 
  "kubernetes.io": {
    "namespace": "kube-system",
    "node": {
      "name": "127.0.0.1",
      "uid": "58456cb0-dd00-45ed-b797-5578fdceaced"
    },
    "pod": {
      "name": "coredns-69cbfb9798-jv9gn",
      "uid": "778a530c-b3f4-47c0-9cd5-ab018fb64f33"
    },
    "serviceaccount": {
      "name": "coredns",
      "uid": "a087d5a0-e1dd-43ec-93ac-f13d89cd13af"
    },
    "warnafter": 1700081020
  },
  "nbf": 1700077413,
  "sub": "system:serviceaccount:kube-system:coredns"
}
```

### ServiceAccountトークン投影を使用してPodを起動する {#launch-a-pod-using-service-account-token-projection}

オーディエンスが`vault`で、有効期間が2時間のトークンをPodに提供するには、以下のようなPodマニフェストを定義します:

{{% code_sample file="pods/pod-projected-svc-token.yaml" %}}

Podを作成します:

```shell
kubectl create -f https://k8s.io/examples/pods/pod-projected-svc-token.yaml
```

kubeletは、Podに代わってトークンをリクエストして保存し、設定可能なファイルパスでPodがトークンを利用できるようにします。
また、トークンの有効期限が近づくと更新します。
kubeletは、トークンの全生存時間(TTL)の80%を経過した場合、または24時間を経過した場合に、積極的にトークンのローテーションをリクエストします。

トークンがローテーションされた際にトークンを再読み込みするのは、アプリケーション側の責任です。
多くの場合、実際の有効期限を追跡しなくても、定期的に(例えば5分ごとに)トークンを読み込むだけで十分です。

### ServiceAccount発行者の検出 {#service-account-issuer-discovery}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

クラスター内のServiceAccountに対して[トークン投影](#serviceaccount-token-volume-projection)を有効にしている場合、ディスカバリー機能も利用できます。
Kubernetesは、クライアントが _アイデンティティプロバイダー_ として連携できる方法を提供し、1つ以上の外部システムが _リライングパーティ_ として機能できます。

{{< note >}}
発行者URLは[OIDC Discovery仕様](https://openid.net/specs/openid-connect-discovery-1_0.html)に準拠している必要があります。
実際には、これは`https`スキームを使用する必要があり、`{service-account-issuer}/.well-known/openid-configuration`でOpenIDプロバイダー設定を提供する必要があることを意味します。

URLが準拠していない場合、ServiceAccount発行者の検出エンドポイントは登録されず、アクセスできません。
{{< /note >}}

有効にすると、Kubernetes APIサーバーはHTTP経由でOpenIDプロバイダー設定ドキュメントを公開します。
設定ドキュメントは`/.well-known/openid-configuration`で公開されます。
OpenIDプロバイダー設定は、_ディスカバリードキュメント_ と呼ばれることもあります。
Kubernetes APIサーバーは、関連するJSON Web Key Set(JWKS)もHTTP経由で`/openid/v1/jwks`で公開します。

{{< note >}}
`/.well-known/openid-configuration`や`/openid/v1/jwks`で提供される応答は、OIDC互換となるように設計されていますが、厳密にはOIDC準拠ではありません。
これらのドキュメントには、Kubernetes ServiceAccountトークンの検証を実行するために必要なパラメータのみが含まれています。
{{< /note >}}

{{< glossary_tooltip text="RBAC" term_id="rbac">}}を使用するクラスターには、`system:service-account-issuer-discovery`というデフォルトのClusterRoleが含まれています。
デフォルトのClusterRoleBindingは、このロールを`system:serviceaccounts`グループに割り当てます。
すべてのServiceAccountは暗黙的にこのグループに属しています。
これにより、クラスター上で実行されているPodは、マウントされたServiceAccountトークンを介してServiceAccountディスカバリードキュメントにアクセスできます。
管理者は、セキュリティ要件やフェデレーションする予定の外部システムに応じて、さらに`system:authenticated`または`system:unauthenticated`にロールをバインドすることもできます。

JWKS応答には、リライングパーティがKubernetes ServiceAccountトークンを検証するために使用できる公開鍵が含まれています。
リライングパーティは、まずOpenIDプロバイダー設定をクエリし、応答内の`jwks_uri`フィールドを使用してJWKSを見つけます。

多くの場合、Kubernetes APIサーバーはパブリックインターネット上では利用できませんが、APIサーバーからのキャッシュされた応答を提供するパブリックエンドポイントをユーザーまたはサービスプロバイダーが利用可能にすることができます。
これらの場合、APIサーバーに`--service-account-jwks-uri`フラグを渡すことで、OpenIDプロバイダー設定内の`jwks_uri`をオーバーライドして、APIサーバーのアドレスではなくパブリックエンドポイントを指すようにすることができます。
発行者URLと同様に、JWKS URIも`https`スキームを使用する必要があります。

## {{% heading "whatsnext" %}}

以下も参照してください:

- [ServiceAccountのクラスター管理者ガイド](/docs/reference/access-authn-authz/service-accounts-admin/)を読む
- [Kubernetesでの認可](/docs/reference/access-authn-authz/authorization/)について読む
- [Secret](/docs/concepts/configuration/secret/)について読む
  - または、[Secretを使用して認証情報を安全に配布する](/docs/tasks/inject-data-application/distribute-credentials-secure/)方法を学ぶ
  - ただし、ServiceAccountとして認証するためにSecretを使用することは非推奨であることに注意してください。
    推奨される代替方法は[ServiceAccountトークンボリューム投影](#serviceaccount-token-volume-projection)です。
- [projected volume](/docs/tasks/configure-pod-container/configure-projected-volume-storage/)について読む
- OIDCディスカバリーの背景については、[Service Account signing key retrieval](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/1393-oidc-discovery) Kubernetes Enhancement Proposalを読む
- [OIDC Discovery仕様](https://openid.net/specs/openid-connect-discovery-1_0.html)を読む
