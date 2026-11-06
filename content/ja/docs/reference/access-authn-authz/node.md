---
title: Node認可の使用
content_type: concept
weight: 34
---

<!-- overview -->
Node認可は、kubeletからのAPIリクエストを認可するための専用の認可モードです。

<!-- body -->
## 概要 {#overview}

Node認可機能により、kubeletは次のようなAPI操作を実行できます。

読み取り操作:

* Service
* Endpoint
* Node
* Pod
* kubeletのノードに割り当てられたPodに関連するSecret、ConfigMap、PersistentVolumeClaim、PersistentVolume

{{< feature-state feature_gate_name="AuthorizeNodeWithSelectors" >}}

kubeletが読み取れるのは、自身のNodeオブジェクトと、自身のノードに割り当てられたPodに限られます。

書き込み操作:

* NodeおよびNodeのステータス（kubeletが自身のNodeのみを変更できるようにするには、`NodeRestriction`アドミッションプラグインを有効にします）
* PodおよびPodのステータス（kubeletが自身に割り当てられたPodのみを変更できるようにするには、`NodeRestriction`アドミッションプラグインを有効にします）
* Event

認証関連の操作:

* TLSブートストラップのための[CertificateSigningRequests API](/docs/reference/access-authn-authz/certificate-signing-requests/)への読み取りおよび書き込みアクセス
* 委任された認証および認可の確認に使用するTokenReviewとSubjectAccessReviewの作成

今後のリリースでは、kubeletが正しく動作するために必要な最小限の権限を維持するため、Node認可機能が権限を追加または削除する可能性があります。

Node認可機能による認可を受けるには、kubeletのクレデンシャルで、`system:nodes`グループに属し、ユーザー名が`system:node:<nodeName>`であることを示す必要があります。
このグループ名とユーザー名の形式は、[kubelet TLSブートストラップ](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)で各kubeletに作成されるIDと一致します。

`<nodeName>`の値は、kubeletが登録したノード名と正確に一致する必要があります。
デフォルトでは、これは`hostname`が返すホスト名です。または、[kubeletのオプション](/docs/reference/command-line-tools-reference/kubelet/)である`--hostname-override`で上書きできます。
ただし、kubeletの`--cloud-provider`オプションを使用する場合、ホスト名はクラウドプロバイダーによって決定され、ローカルの`hostname`や`--hostname-override`オプションが無視されることがあります。
kubeletがホスト名を決定する方法の詳細については、[kubeletオプションのリファレンス](/docs/reference/command-line-tools-reference/kubelet/)を参照してください。

Node認可機能を有効にするには、`Node`認可機能を含むファイルを`--authorization-config`フラグで指定して、{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}を起動します。例:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AuthorizationConfiguration
authorizers:
  ...
  - type: Node
  ...
```

または、`Node`を含むカンマ区切りの認可モード一覧を`--authorization-mode`フラグに設定して、{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}を起動します。例:

```shell
kube-apiserver --authorization-mode=...,Node --other-options --more-options
```

kubeletが書き込み可能なAPIオブジェクトを制限するには、`--enable-admission-plugins=...,NodeRestriction,...`を指定してapiserverを起動し、[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers#noderestriction)アドミッションプラグインを有効にします。

## ServiceAccountトークンのaudience制限 {#service-account-token-audience-restriction}

{{< feature-state feature_gate_name="ServiceAccountNodeAudienceRestriction" >}}

`ServiceAccountNodeAudienceRestriction`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)が有効で、`NodeRestriction`アドミッションプラグインが有効な場合、kubeletがリクエストできるServiceAccountトークンは、そのノードで実行されているPodからすでに参照されているaudienceに限られます。
これにより、侵害されたノードが任意のaudience向けのトークンを取得することを防ぎます。

許可されるaudienceは、Podの仕様から決定されます。

- デフォルトのAPIサーバーaudience（空、またはAPIサーバーに設定されたaudience）。
- 投影されたServiceAccountトークンボリュームソースに設定されたaudience。
- Podが使用するCSIドライバーの`spec.tokenRequests`に設定されたaudience。インラインCSIボリューム、PersistentVolumeClaimを使用するボリューム、エフェメラルボリュームのいずれを介して使用する場合も対象です。

これは、[イメージクレデンシャルプロバイダー用のServiceAccountトークン](/docs/tasks/administer-cluster/kubelet-credential-provider/#service-account-token-for-image-pulls)を使用する場合に特に関係します。この場合、kubeletはPodに代わって、レジストリー固有のaudienceを持つトークンをリクエストします。

### RBACを使用して追加のaudienceを許可する {#allowing-additional-audiences}

Podの仕様で参照されているaudience以外についても、kubeletにトークンのリクエストを許可できます。
kubeletがPodの仕様にないaudienceを指定してトークンをリクエストすると、NodeRestrictionアドミッションプラグインは、次の属性を使ってkubeletが認可されているかどうかを確認します。

| 属性 | 値 |
| ---------- | ----- |
| Verb | `request-serviceaccounts-token-audience` |
| APIグループ | （空文字列。コアAPIグループを意味します） |
| Resource | リクエストされたaudienceの値 |
| Name | ServiceAccount名 |
| Namespace | ServiceAccountのNamespace |

標準のRBACルールを使用して、これらの確認を認可できます。
`resources`フィールドは許可するaudienceを制御し、`resourceNames`フィールドはルールを適用するServiceAccountを制御します。

特定のServiceAccountに対して、kubeletが`my-registry-audience`というaudienceをリクエストできるようにする例:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-audience-my-registry
rules:
- verbs: ["request-serviceaccounts-token-audience"]
  apiGroups: [""]
  resources: ["my-registry-audience"]
  resourceNames: ["my-service-account"]
```

`resourceNames`を省略すると、すべてのServiceAccountについてそのaudienceが許可されます。
`resources`にワイルドカード（`"*"`）を指定すると、すべてのaudienceが許可されます。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-audience-unrestricted
rules:
- verbs: ["request-serviceaccounts-token-audience"]
  apiGroups: [""]
  resources: ["*"]  # すべてのaudience
  # resourceNamesを指定しない場合、すべてのServiceAccountが対象
```

すべてのkubeletに適用するには、ClusterRoleを`system:nodes`グループにバインドします。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: node-audience-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: node-audience-my-registry
subjects:
- kind: Group
  name: system:nodes
  apiGroup: rbac.authorization.k8s.io
```

{{< note >}}
この制限はNodeRestrictionアドミッションプラグインの一部であり、ノードID（kubelet）にのみ適用されます。
`TokenRequest` APIを呼び出す他の主体がリクエストできるaudienceは制限しません。
他の呼び出し元を制限する必要がある場合は、[ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/)の使用を検討してください。
{{< /note >}}

## 移行に関する考慮事項 {#migration-considerations}

### `system:nodes`グループに属さないkubelet {#kubelets-outside-the-system-nodes-group}

`system:nodes`グループに属さないkubeletは、`Node`認可モードによる認可を受けません。
その場合、現在それらを認可している仕組みを引き続き使用する必要があります。
ノードアドミッションプラグインは、これらのkubeletからのリクエストを制限しません。

### 区別できるユーザー名を持たないkubelet {#kubelets-with-undifferentiated-usernames}

一部のデプロイメントでは、kubeletのクレデンシャルは`system:nodes`グループに属しているものの、`system:node:...`形式のユーザー名を持たないため、どのノードに対応するのか特定できない場合があります。
このようなkubeletは`Node`認可モードによる認可を受けないため、現在それらを認可している仕組みを引き続き使用する必要があります。

`NodeRestriction`アドミッションプラグインは、デフォルトのノード識別子の実装でノードIDと判定されないため、このようなkubeletからのリクエストを無視します。
