---
reviewers:
- timstclair
- deads2k
- liggitt
title: Node 認可の使用
content_type: concept
weight: 34
---

<!-- overview -->

Node 認可は、kubelet から送信される API リクエストを認可するための専用モードです。

<!-- body -->

## 概要

Node authorizer は、kubelet が API 操作を実行できるようにします。これには、以下が含まれます。

読み取り操作:

- services
- endpoints
- nodes
- pods
- kubelet のノードにバインドされた Pod に関連する secrets、configmaps、persistent volume claims、および persistent volumes

{{< feature-state feature_gate_name="AuthorizeNodeWithSelectors" >}}

kubelet が読み取り可能な対象は、自身の Node オブジェクトと、自身のノードにバインドされた Pod に制限されます。

書き込み操作:

- nodes および node status（kubelet が自身のノードのみを変更できるように制限するには、`NodeRestriction` admission plugin を有効にします）
- pods および pod status（kubelet が自身のノードにバインドされた Pod のみを変更できるように制限するには、`NodeRestriction` admission plugin を有効にします）
- events

認証関連の操作:

- TLS ブートストラップのための [CertificateSigningRequests API](/docs/reference/access-authn-authz/certificate-signing-requests/) への読み取りおよび書き込みアクセス
- 委任された認証および認可のチェックを行うための TokenReviews および SubjectAccessReviews の作成

将来のリリースでは、kubelet が正常に動作するために必要な最小限の権限を確保するため、Node authorizer によって権限が追加または削除される可能性があります。

Node authorizer による認可を受けるには、kubelet は自身が `system:nodes` グループに属し、ユーザー名が `system:node:<nodeName>` であることを示す認証情報を使用する必要があります。

このグループ名とユーザー名の形式は、[kubelet TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/) の一環として各 kubelet に作成される ID の形式と一致します。

`<nodeName>` の値は、kubelet によって登録されたノード名と**完全に一致する必要があります**。デフォルトでは、これは `hostname` によって取得されるホスト名です。または、[kubelet オプション](/docs/reference/command-line-tools-reference/kubelet/)の `--hostname-override` によって上書きされます。ただし、kubelet オプション `--cloud-provider` を使用する場合、具体的なホスト名はクラウドプロバイダーによって決定されることがあり、ローカルの `hostname` および `--hostname-override` オプションは無視されます。

kubelet がホスト名を決定する方法の詳細については、[kubelet options reference](/docs/reference/command-line-tools-reference/kubelet/) を参照してください。

Node authorizer を有効にするには、`Node` authorizer を含むファイルを `--authorization-config` フラグで指定して、{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} を起動します。例:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AuthorizationConfiguration
authorizers:
  ...
  - type: Node
  ...
```

または、`Node` を含むカンマ区切りのリストを `--authorization-mode` フラグに指定して、{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} を起動します。例:

```shell
kube-apiserver --authorization-mode=...,Node --other-options --more-options
```

kubelet が書き込み可能な API オブジェクトを制限するには、`--enable-admission-plugins=...,NodeRestriction,...` を指定して apiserver を起動し、[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) admission plugin を有効にします。

## Service account token audience restriction {#service-account-token-audience-restriction}

{{< feature-state feature_gate_name="ServiceAccountNodeAudienceRestriction" >}}

`ServiceAccountNodeAudienceRestriction` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) が有効で、`NodeRestriction` admission plugin がアクティブな場合、kubelet は、そのノードで実行中の Pod によってすでに参照されている audience に対してのみ、service account token を要求できます。これにより、侵害されたノードが任意の audience のトークンを取得することを防ぎます。

許可される audience は Pod の spec に基づいて決定されます。

- デフォルトの API server audience（空の値、または API server に設定された audience）。
- 投影された service account token のボリュームソースに設定された audience。
- Pod が使用するすべての CSI driver の `spec.tokenRequests` に設定された audience。これには、インライン CSI ボリューム、PersistentVolumeClaim に基づくボリューム、一時ボリュームを介して使用される場合が含まれます。

これは、[イメージ認証情報プロバイダー向けの service account token](/docs/tasks/administer-cluster/kubelet-credential-provider/#service-account-token-for-image-pulls) を使用する場合に特に重要です。この場合、kubelet は Pod に代わって、レジストリ固有の audience を持つトークンを要求します。

### RBAC による追加の audience の許可 {#allowing-additional-audiences}

Pod の spec で参照されている audience 以外についても、kubelet にトークンを要求する権限を付与できます。kubelet が Pod の spec に存在しない audience を指定してトークンを要求すると、NodeRestriction admission plugin は、以下の属性を使用して認可チェックを実行し、kubelet が認可されているかどうかを確認します。

| 属性 | 値 |
| --- | --- |
| Verb | `request-serviceaccounts-token-audience` |
| API Group | （空文字列。コア API グループを意味します） |
| Resource | 要求された audience の値 |
| Name | service account 名 |
| Namespace | service account の名前空間 |

標準の RBAC ルールを使用して、これらのチェックを認可できます。`resources` フィールドで許可する audience を制御し、`resourceNames` フィールドでルールの適用対象となる service account を制御します。

たとえば、特定の service account に対して、kubelet が `my-registry-audience` という audience を要求できるようにするには、次のようにします。

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

`resourceNames` を省略すると、すべての service account に対してその audience が許可されます。`resources` にワイルドカード（`"*"`）を使用すると、すべての audience が許可されます。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-audience-unrestricted
rules:
- verbs: ["request-serviceaccounts-token-audience"]
  apiGroups: [""]
  resources: ["*"]  # 任意の audience
  # resourceNames なし: すべての service account
```

すべての kubelet に適用するには、ClusterRole を `system:nodes` グループにバインドします。

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

この制限は NodeRestriction admission plugin の一部であり、ノード ID（kubelet）にのみ適用されます。`TokenRequest` API を呼び出す他のクライアントが要求できる audience は制限されません。他のクライアントも制限する必要がある場合は、[ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) の使用を検討してください。

{{< /note >}}

## 移行に関する考慮事項

### `system:nodes` グループに属していない kubelet

`system:nodes` グループに属していない kubelet は、`Node` 認可モードでは認可されません。そのため、現在それらの kubelet を認可している仕組みを引き続き使用する必要があります。

NodeRestriction admission plugin は、これらの kubelet からのリクエストを制限しません。

### 識別可能なユーザー名を持たない kubelet

一部のデプロイ環境では、kubelet の認証情報によって `system:nodes` グループへの所属は示されているものの、ユーザー名が `system:node:...` 形式ではないため、どのノードに関連付けられているかを特定できない場合があります。

これらの kubelet は `Node` 認可モードでは認可されないため、現在それらを認可している仕組みを引き続き使用する必要があります。

`NodeRestriction` admission plugin は、これらの kubelet からのリクエストを無視します。これは、デフォルトのノード識別子の実装では、それらをノード ID として認識しないためです。
