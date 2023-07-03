---
title: RBAC認可を使用する
content_type: concept
weight: 70
---

<!-- overview -->
Role Based Access Control(RBAC)は、組織内の個々のユーザーのRoleをベースに、コンピューターまたはネットワークリソースへのアクセスを制御する方法です。


<!-- body -->
RBAC認可は{{< glossary_tooltip term_id="api-group" >}} `rbac.authorization.k8s.io`を使用して認可の決定を行い、Kubernetes APIを介して動的にポリシーを構成できるようにします。

RBACを有効にするには、以下の例のように{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}の`--authorization-mode` フラグをコンマ区切りの`RBAC`を含むリストでスタートします。

```shell
kube-apiserver --authorization-mode=Example,RBAC --other-options --more-options
```

## APIオブジェクト{#api-overview}

RBAC APIは4種類のKubernetesオブジェクト(_Role_、 _ClusterRole_、  _RoleBinding_ そして _ClusterRoleBinding_)を宣言します。他のKubernetesオブジェクトのように`kubectl`のようなツールを使って、[オブジェクトを記述](https://kubernetes.io/ja/docs/concepts/overview/working-with-objects/kubernetes-objects/#kubernetes-objects)、または変更できます。

{{< caution >}}
これらのオブジェクトは設計上、アクセス制限を課します。学んできたように変更を行っている場合、
[特権エスカレーション防止とブートストラップ](#特権昇格の防止とブートストラップ)
を参照し、これらの制限がどのようにいつかの変更を防止するのかを理解しましょう。
{{< /caution >}}

### RoleとClusterRole

RBACの _Role_ または _ClusterRole_ には、一連の権限を表すルールが含まれて言います。
権限は完全な追加方式です(「deny」のルールはありません)。

Roleは常に特定の{{< glossary_tooltip text="namespace" term_id="namespace" >}}で権限を設定します。
つまり、Roleを作成する時は、Roleが属するNamespaceを指定する必要があります。

対照的にClusterRoleは、Namespaceに属さないリソースです。Kubernetesオブジェクトは常にNamespaceに属するか、属さないかのいずれかである必要があり、リソースは異なる名前(RoleとClusterRole)を持っています。つまり、両方であることは不可能です。

ClusterRolesにはいくつかの用途があります。ClusterRoleを利用して、以下のことができます。

1. Namespaceに属するリソースに対する権限を定義し、個々のNamespace内で付与する
2. Namespaceに属するリソースに対する権限を定義し、すべてのNamespaceにわたって付与する
3. クラスター単位でスコープされているリソースに対するアクセス許可を定義する

NamespaceでRoleを定義する場合は、Roleを使用します。クラスター全体でRoleを定義する場合は、ClusterRoleを使用します

#### Roleの例

以下はNamespace「default」にあるRoleの例で、
{{< glossary_tooltip text="Pod" term_id="pod" >}}への読み取りアクセス権の付与に使用できます。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # "" はコアのAPIグループを示します
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

#### ClusterRoleの例

ClusterRoleを使用してRoleと同じ権限を付与できます。
ClusterRolesはクラスター単位でスコープされているため、以下へのアクセスの許可もできます。

* クラスター単位でスコープされているリソースに({{< glossary_tooltip text="node" term_id="node" >}}など)
* 非リソースエンドポイントに(`/healthz`など)
* すべてのNamespaceに渡ってNamespaceに属するリソースに(Podなど)。
  例えば、ClusterRoleを使用して特定のユーザーに`kubectl get pods --all-namespaces`の実行を許可できます。

以下は特定のNamespace、またはすべてのNamespace([バインド](#rolebindingとclusterrolebinding)方法によります)で{{< glossary_tooltip text="secrets" term_id="secret" >}}への読み取りアクセス権を付与するClusterRoleの例です。


```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  # 「namespace」はClusterRolesがNamespaceに属していないため、省略されています
  name: secret-reader
rules:
- apiGroups: [""]
  #
  # HTTPレベルでの、Secretにアクセスするリソースの名前
  # オブジェクトは"secrets"
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
```

RoleまたはClusterRoleオブジェクトの名前は有効な
[パスセグメント名](https://kubernetes.io/ja/docs/concepts/overview/working-with-objects/names/)である必要があります。

### RoleBindingとClusterRoleBinding

RoleBindingはRoleで定義された権限をユーザーまたはユーザのセットに付与します。
RoleBindingは*subjects* (ユーザー、グループ、サービスアカウント)のリストと、付与されるRoleへの参照を保持します。
RoleBindingは特定のNamespace内の権限を付与しますが、ClusterRoleBindingはクラスター全体にアクセスする権限を付与します。

RoleBindingは、同じNamespace内の任意のRoleを参照できます。
または、RoleBindingはClusterRoleを参照し、そのClusterRoleをRoleBindingのNamespaceにバインドできます。
ClusterRoleをクラスター内のすべてのNamespaceにバインドする場合は、ClusterRoleBindingを使用します。

RoleBindingまたはClusterRoleBindingオブジェクトは有効な
[パスセグメント名](https://kubernetes.io/ja/docs/concepts/overview/working-with-objects/names/)である必要があります。

#### RoleBindingの例 {#rolebinding-example}

以下はNamespace「default」内でユーザー「jane」に「pod-reader」のRoleを付与するRoleBindingの例です。
これにより、「jane」にNamespace「default」のポッドの読み取り許可されます。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# このRoleBindingは「jane」にNamespace「default」のポッドの読み取りを許可する
# そのNamespaceでRole「pod-reader」を既に持っている必要があります。
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
# 一つ以上の「subject」を指定する必要があります
- kind: User
  name: jane # 「name」は大文字と小文字が区別されます
  apiGroup: rbac.authorization.k8s.io
roleRef:
  # 「roleRef」はRole/ClusterRoleへのバインドを指定します
  kind: Role #RoleまたはClusterRoleである必要があります
  name: pod-reader # これはバインドしたいRole名またはClusterRole名とマッチする必要があります
  apiGroup: rbac.authorization.k8s.io
```

RoleBindingはClusterRoleを参照し、ClusterRoleで定義されている権限をRoleBinding内のNamespaceのリソースに権限付与もできます。この種類の参照を利用すると、クラスター全体で共通のRoleのセットを定義して、それらを複数のNamespace内での再利用できます。

例えば、以下のRoleBindingがClusterRoleを参照している場合でも、
「dave」(大文字と小文字が区別されるsubject)はRoleBindingのNamespace(メタデータ内)が「development」のため、Namespace「development」のSecretsのみの読み取りができます。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# このRoleBindingは「dave」にNamespace「development」のSecretsの読み取りを許可する
# ClusterRole「secret-reader」を既に持っている必要があります。
kind: RoleBinding
metadata:
  name: read-secrets
  #
  # RoleBindingのNamespaceが、どこの権限が付与されるかを決定する。
  # これはNamespace「development」内の権限のみ付与する。
  namespace: development
subjects:
- kind: User
  name: dave # nameは大文字、小文字を区別する
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

#### ClusterRoleBindingの例

クラスター全体に権限を付与するには、ClusterRoleBindingを使用できます。
以下のClusterRoleBindingはグループ「manager」のすべてのユーザーに
Secretsの読み取りを許可します。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# このClusterRoleBindingはグループ「manager」のすべてのユーザーに任意のNamespaceのSecretsの読み取りを許可します。
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: manager # nameは大文字、小文字を区別します
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

Bindingを作成後は、それが参照するRoleまたはClusterRoleを変更できません。
Bindingの`roleRef`を変更しようとすると、バリデーションエラーが発生します。Bindingの`roleRef`を変更する場合は、Bindingのオブジェクトを削除して、代わりのオブジェクトを作成する必要があります。

この制限には２つの理由があります。

1. `roleRef`をイミュータブルにすることで、誰かに既存のオブジェクトに対する`update`権限を付与します。それにより、subjectsに付与されたRoleの変更ができなくても、subjectsのリストを管理できるようになります。
2. 異なるRoleへのBindingは根本的に異なるBindingです。
`roleRef`を変更するためにBindingの削除/再作成を要求することによって、(すべての既存のsubjectsを確認せずに、roleRefだけを誤って変更できるようにするのとは対照的に)Binding内のsubjectsのリストのすべてが意図された新しいRoleが付与されることを担保します。

`kubectl auth reconcile` コマンドラインユーティリティーはRBACオブジェクトを含んだマニフェストファイルを作成または更新します。また、それらが参照しているRoleへの変更を要求されると、Bindingオブジェクトの削除と再作成を取り扱います。
詳細は[command usage and examples](#kubectl-auth-reconcile)を確認してください。

### リソースを参照する

KubernetesのAPIでは、ほとんどのリソースはPodであれば`pods`のように、オブジェクト名の文字列表現を使用して表されます。RBACは、関連するAPIエンドポイントのURLに表示されるものとまったく同じ名前を使用するリソースを参照します。
一部のKubernetes APIには、Podのログなどの
_subresource_　が含まれます。Podのログのリクエストは次のようになります。

```http
GET /api/v1/namespaces/{namespace}/pods/{name}/log
```

この場合、`pods` はPodリソースのNamespaceに属するリソースであり、`log`は`pods`のサブリソースです。これをRBACRoleで表すには、スラッシュ(`/`)を使用してリソースとサブリソースを区切ります。サブジェクトへの`pods`の読み込みと各Podの`log`サブリソースへのアクセスを許可するには、次のように記述します。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-and-pod-logs-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list"]
```

`resourceNames`リストを通じて、特定のリクエストのリソースを名前で参照することもできます。
指定すると、リクエストをリソースの個々のインスタンスに制限できます。
以下は対象を`get`または`my-configmap`と名付けられた
{{< glossary_tooltip term_id="ConfigMap" >}}を`update`のみに制限する例です。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: configmap-updater
rules:
- apiGroups: [""]
  #
  # HTTPレベルでの、ConfigMapにアクセスするリソースの名前
  # オブジェクトは"configmaps"
  resources: ["configmaps"]
  resourceNames: ["my-configmap"]
  verbs: ["update", "get"]
```

{{< note >}}
`resourceNames`で`create`または`deletecollection`のリクエストを制限することはできません。この制限は`create`の場合、認証時にオブジェクト名がわからないためです。
{{< /note >}}


### 集約ClusterRole

複数のClusterRoleを一つのClusterRoleに _集約_ できます。
クラスターコントロールプレーンの一部として実行されるコントローラーは、`aggregationRule`セットを持つClusterRoleオブジェクトを監視します。`aggregationRule`はコントローラーが、このオブジェクトの`rules`フィールドに結合する必要のある他のClusterRoleオブジェクトを一致させるために使用するラベル{{< glossary_tooltip text="selector" term_id="selector" >}}を定義します。

以下に、集約されたClusterRoleの例を示します。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.example.com/aggregate-to-monitoring: "true"
rules: [] # コントロールプレーンは自動的にルールを入力します
```
既存の集約されたClusterRoleのラベルセレクターと一致する新しいClusterRoleを作成すると、その変更をトリガーに、集約されたClusterRoleに新しいルールが追加されます。
`rbac.example.com/aggregate-to-monitoring: true`ラベルが付けられた別のClusterRoleを作成して、ClusterRole「monitoring」にルールを追加する例を以下に示します。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-endpoints
  labels:
    rbac.example.com/aggregate-to-monitoring: "true"
# ClusterRole「monitoring-endpoints」を作成すると、
# 以下のルールがClusterRole「monitoring」に追加されます
rules:
- apiGroups: [""]
  resources: ["services", "endpoints", "pods"]
  verbs: ["get", "list", "watch"]
```

[デフォルトのユーザー向けRole](#デフォルトroleとclusterrolebinding)はClusterRoleの集約を使用します。これによりクラスター管理者として、 デフォルトroleを拡張するため、{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}または集約されたAPIサーバーなどによって提供されたルールをカスタムリソースに含めることができます。

例えば、次のClusterRoleでは、「admin」と「edit」のデフォルトのRoleでCronTabという名前のカスタムリソースを管理できますが、「view」のRoleではCronTabリソースに対して読み取りアクションのみを実行できます。CronTabオブジェクトは、APIサーバーから見たURLで`"crontabs"`と名前が付けられていると想定できます。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aggregate-cron-tabs-edit
  labels:
    # デフォルトRoleの「admin」と「edit」にこれらの権限を追加する。
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: aggregate-cron-tabs-view
  labels:
    # デフォルトRoleの「view」にこれらの権限を追加します。
    rbac.authorization.k8s.io/aggregate-to-view: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch"]
```

#### Roleの例

次の例は、RoleオブジェクトまたはClusterRoleオブジェクトからの抜粋であり、`rules`セクションのみを示しています。

`"pods"`の読み取りを許可する
{{< glossary_tooltip text="API Group" term_id="api-group" >}}。

```yaml
rules:
- apiGroups: [""]
  #
  # HTTPレベルでの、Podにアクセスするリソースの名前
  # オブジェクトは"pods"
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

APIグループ`" extensions "`と `" apps "` の両方で、Deploymentsへの読み取り/書き込みを許可します。
(HTTPレベルでURLのリソース部分に`"deployments"`を持つオブジェクトで)

```yaml
rules:
- apiGroups: ["extensions", "apps"]
  #
  # HTTPレベルでの、Deploymentにアクセスするリソースの名前
  # オブジェクトは"deployments"
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

コアAPIグループのPodの読み取り、および`"batch"`または`"extensions"`APIグループのJobリソースの読み取りまたは書き込みを許可します。


```yaml
rules:
- apiGroups: [""]
  #
  # HTTPレベルでの、Podにアクセスするリソースの名前
  # オブジェクトは"pods"
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["batch", "extensions"]
  #
  # HTTPレベルでの、Jobにアクセスするリソースの名前
  # オブジェクトは"jobs"
  resources: ["jobs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

「my-config」という名前のConfigMapの読み取りを許可します(
単一のNamespace内の単一のConfigMapに制限するRoleBinding)

```yaml
rules:
- apiGroups: [""]
  #
  # HTTPレベルでの、ConfigMapにアクセスするリソースの名前
  # オブジェクトは"configmaps"
  resources: ["configmaps"]
  resourceNames: ["my-config"]
  verbs: ["get"]
```


コアグループ内のリソース `"nodes"`の読み取りを許可します(Nodeはクラスタースコープであり、ClusterRoleBindingが効果的であるため、ClusterRoleにバインドされている必要があります)。

```yaml
rules:
- apiGroups: [""]
  #
  # HTTPレベルでの、Nodeにアクセスするリソースの名前
  # オブジェクトは"nodes"
  resources: ["nodes"]
  verbs: ["get", "list", "watch"]
```

非リソースエンドポイント `/ healthz`およびすべてのサブパス(ClusterRoleBindingが効果的であるため、ClusterRoleにバインドされている必要があります)のGETおよびPOSTリクエストを許可します。

```yaml
rules:
- nonResourceURLs: ["/healthz", "/healthz/*"] # nonResourceURLの「*」はサフィックスグロブマッチです
  verbs: ["get", "post"]
```

### subjectsを参照する

RoleBindingまたはClusterRoleBindingは、Roleをsubjectsにバインドします。subjectsはグループ、ユーザー、または{{< glossary_tooltip text="ServiceAccounts" term_id="service-account" >}}にすることができます。

Kubernetesはユーザー名を文字列として表します。
これらは次のようにできます。「alice」などの単純な名前。「bob@example.com」のような電子メール形式の名前。または文字列として表される数値のユーザーID。 認証が必要な形式のユーザー名を生成するように[認証モジュール](https://kubernetes.io/ja/docs/reference/access-authn-authz/authentication/)を構成するかどうかは、クラスター管理者が決定します。

{{< caution >}}
プレフィックス`system:`はKubernetesシステムで使用するために予約されているため、誤って`system:`で始まる名前のユーザーまたはグループが存在しないようにする必要があります。
この特別なプレフィックスを除いて、RBAC承認システムでは、ユーザー名の形式は問いません。
{{< /caution >}}

Kubernetesでは、Authenticatorモジュールがグループ情報を提供します。
ユーザーと同様に、グループは文字列として表され、その文字列には、プレフィックス`system:`が予約されていることを除いて、フォーマット要件はありません。

[ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/)の名前はプレフィックス`system:serviceaccount:`が付いており、名前のプレフィックス`system:serviceaccounts:`が付いているグループに属しています。

{{< note >}}
- `system:serviceaccount:` (単数)は、サービスアカウントのユーザー名のプレフィックスです。
- `system:serviceaccounts:`(複数)は、サービスアカウントグループのプレフィックスです。
{{< /note >}}

#### RoleBindingの例 {#role-binding-examples}

次の例は`RoleBinding`、`subjects`セクションのみを示す抜粋です。

`alice@example.com`という名前のユーザーの場合。

```yaml
subjects:
- kind: User
  name: "alice@example.com"
  apiGroup: rbac.authorization.k8s.io
```

`frontend-admins`という名前のグループの場合。

```yaml
subjects:
- kind: Group
  name: "frontend-admins"
  apiGroup: rbac.authorization.k8s.io
```

Namespace「kube-system」のデフォルトのサービスアカウントの場合。

```yaml
subjects:
- kind: ServiceAccount
  name: default
  namespace: kube-system
```

Namespace「qa」の全てのサービスアカウントの場合。

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts:qa
  apiGroup: rbac.authorization.k8s.io
```

任意のNamespaceの全てのサービスアカウントの場合。

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts
  apiGroup: rbac.authorization.k8s.io
```

すべての認証済みユーザーの場合。

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
```

認証されていないすべてのユーザーの場合。

```yaml
subjects:
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

すべてのユーザーの場合。

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

## デフォルトRoleとClusterRoleBinding

APIサーバーは、デフォルトのClusterRoleオブジェクトとClusterRoleBindingオブジェクトのセットを作成します。
これらの多くにはプレフィックス`system:`が付いています。これは、リソースがクラスターコントロールプレーンによって直接管理されることを示しています。
デフォルトのすべてのClusterRoleおよびClusterRoleBindingには、ラベル`kubernetes.io/bootstrapping=rbac-defaults`が付いています。

{{< caution >}}
プレフィックスとして`system:`を含む名前で、ClusterRolesおよびClusterRoleBindingsを変更する場合は注意してください。
これらのリソースを変更すると、クラスターが機能しなくなる可能性があります。
{{< /caution >}}

### 自動調整

起動するたびに、APIサーバーはデフォルトのClusterRoleを不足している権限で更新し、
デフォルトのClusterRoleBindingを不足しているsubjectsで更新します。
これにより、誤った変更をクラスターが修復できるようになり、新しいKubernetesリリースで権限とsubjectsが変更されても、
RoleとRoleBindingを最新の状態に保つことができます。

この調整を無効化するには`rbac.authorization.kubernetes.io/autoupdate`をデフォルトのClusterRoleまたはRoleBindingのアノテーションを`false`に設定します。
デフォルトの権限と subjectsがないと、クラスターが機能しなくなる可能性があることに注意してください。

RBAC authorizerが有効な場合、自動調整はデフォルトで有効になっています。

### APIディスカバリーRole {#discovery-roles}

デフォルトのRoleBindingでは、認証されていないユーザーと認証されたユーザーが、パブリックアクセスが安全であると見なされるAPI情報(CustomResourceDefinitionを含む)の読み取りを認可しています。匿名の非認証アクセスを無効にするには、APIサーバー構成に`--anonymous-auth=false` 追加します。

`kubectl`の実行によってこれらのRoleの構成を表示するには。

```shell
kubectl get clusterroles system:discovery -o yaml
```

{{< note >}}
ClusterRoleを編集すると、変更が[自動調整](#自動調整)によるAPIサーバーの再起動時に上書きされます。この上書きを回避するにはRoleを手動で編集しないか、自動調整を無効にします。
{{< /note >}}

<table>
<caption>Kubernetes RBAC APIディスカバリーRole</caption>
<colgroup><col width="25%" /><col width="25%" /><col /></colgroup>
<tr>
<th>デフォルトのClusterRole</th>
<th>デフォルトのClusterRoleBinding</th>
<th>説明</th>
</tr>
<tr>
<td><b>system:basic-user</b></td>
<td><b>system:authenticated</b> group</td>
<td>ユーザーに、自身に関する基本情報への読み取り専用アクセスを許可します。v1.14より前は、このRoleはデフォルトで<tt>system:unauthenticated</tt>にもバインドされていました。</td>
</tr>
<tr>
<td><b>system:discovery</b></td>
<td><b>system:authenticated</b> group</td>
<td>APIレベルのディスカバリーとネゴシエーションに必要なAPIディスカバリーエンドポイントへの読み取り専用アクセスを許可します。v1.14より前は、このRoleはデフォルトで<tt>system:unauthenticated</tt>にもバインドされていました。</td>
</tr>
<tr>
<td><b>system:public-info-viewer</b></td>
<td><b>system:authenticated</b> and <b>system:unauthenticated</b> groups</td>
<td>クラスターに関する機密情報以外への読み取り専用アクセスを許可します。Kubernetes v1.14で導入されました。</td>
</tr>
</table>

### ユーザー向けRole

一部のデフォルトClusterRolesにはプレフィックス`system:`が付いていません。これらは、ユーザー向けのroleを想定しています。それらは、スーパーユーザのRole(`cluster-admin`)、ClusterRoleBindingsを使用してクラスター全体に付与されることを意図しているRole、そしてRoleBindings(`admin`, `edit`, `view`)を使用して、特定のNamespace内に付与されることを意図しているRoleを含んでいます。

ユーザー向けのClusterRolesは[ClusterRoleの集約](#集約clusterrole)を使用して、管理者がこれらのClusterRolesにカスタムリソースのルールを含めることができるようにします。ルールを`admin`、`edit`、または`view` Roleに追加するには、次のラベルの一つ以上でClusterRoleを作成します。

```yaml
metadata:
  labels:
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
    rbac.authorization.k8s.io/aggregate-to-view: "true"
```

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>デフォルトのClusterRole</th>
<th>デフォルトのClusterRoleBinding</th>
<th>説明</th>
</tr>
<tr>
<td><b>cluster-admin</b></td>
<td><b>system:masters</b> group</td>
<td>スーパーユーザーが任意のリソースで任意のアクションを実行できるようにします。
<b>ClusterRoleBinding</b>で使用すると、クラスター内およびすべてのNamespace内のすべてのリソースを完全に制御できます。
<b>RoleBinding</b>で使用すると、Namespace自体を含む、RoleBindingのNamespace内のすべてのリソースを完全に制御できます。</td>
</tr>
<tr>
<td><b>admin</b></td>
<td>None</td>
<td><b>RoleBinding</b>を使用してNamespace内で付与することを想定した、管理者アクセスを許可します。
<b>RoleBinding</b>で使用した場合、Namespace内にRoleとRoleBindingを作成する機能を含め、Namespaceのほとんどのリソースへの読み取り/書き込みアクセスを許可します。
このRoleは、リソースクォータまたはNamespace自体への書き込みアクセスを許可しません。</td>
</tr>
<tr>
<td><b>edit</b></td>
<td>None</td>
<td>Namespace内のほとんどのオブジェクトへの読み取り/書き込みアクセスを許可します。

このRoleは、RoleまたはRoleBindingの表示または変更を許可しません。
ただし、このRoleでは、Secretsにアクセスして、Namespace内の任意のServiceAccountとしてPodsを実行できるため、Namespace内の任意のServiceAccountのAPIアクセスレベルを取得するために使用できます。</td>
</tr>
<tr>
<td><b>view</b></td>
<td>None</td>
<td>Namespace内のほとんどのオブジェクトを表示するための読み取り専用アクセスを許可します。
RoleまたはRoleBindingは表示できません。

Secretsの内容を読み取るとNamespaceのServiceAccountのクレデンシャルにアクセスできるため、このRoleではSecretsの表示は許可されません。これにより、Namespace内の任意のServiceAccountとしてAPIアクセスが許可されます(特権昇格の形式)。</td>
</tr>
</table>

### コアコンポーネントのRole

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>デフォルトのClusterRole</th>
<th>デフォルトのClusterRoleBinding</th>
<th>説明</th>
</tr>
<tr>
<td><b>system:kube-scheduler</b></td>
<td><b>system:kube-scheduler</b> user</td>
<td>{{< glossary_tooltip term_id="kube-scheduler" text="scheduler" >}}コンポーネントが必要とするリソースへのアクセスを許可します。</td>
</tr>
<tr>
<td><b>system:volume-scheduler</b></td>
<td><b>system:kube-scheduler</b> user</td>
<td>kube-scheduleコンポーネントが必要とするリソースへのアクセスを許可します。</td>
</tr>
<tr>
<td><b>system:kube-controller-manager</b></td>
<td><b>system:kube-controller-manager</b> user</td>
<td>{{< glossary_tooltip term_id="kube-controller-manager" text="controller manager" >}}コンポーネントが必要とするリソースへのアクセスを許可します。
個々のコントローラーに必要な権限については、<a href="#controller-roles">組み込みコントローラーのRoleで詳しく説明しています</a>。</td>
</tr>
<tr>
<td><b>system:node</b></td>
<td>None</td>
<td><b>すべてのsecretへの読み取りアクセス、すべてのポッドステータスオブジェクトへの書き込みアクセスなど、</b>kubeletが必要とするリソースへのアクセスを許可します。

<tt>system:node</tt>Roleの代わりに<a href="/docs/reference/access-authn-authz/node/">Node authorizer</a>と <a href="/docs/reference/access-authn-authz/admission-controllers/#noderestriction">NodeRestriction admission plugin</a>を使用し、それらで実行するようにスケジュールされたPodに基づいてkubeletへのAPIアクセスを許可する必要があります。

<tt>system:node</tt>のRoleは、V1.8より前のバージョンからアップグレードしたKubernetesクラスターとの互換性のためだけに存在します。
</td>
</tr>
<tr>
<td><b>system:node-proxier</b></td>
<td><b>system:kube-proxy</b> user</td>
<td>{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}コンポーネントが必要とするリソースへのアクセスを許可します。</td>
</tr>
</table>

### 他のコンポーネントのRole

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>デフォルトのClusterRole</th>
<th>デフォルトのClusterRoleBinding</th>
<th>説明</th>
</tr>
<tr>
<td><b>system:auth-delegator</b></td>
<td>None</td>
<td>委任された認証と認可のチェックを許可します。
これは一般に、認証と認可を統合するためにアドオンAPIサーバーで使用されます。</td>
</tr>
<tr>
<td><b>system:heapster</b></td>
<td>None</td>
<td><a href="https://github.com/kubernetes/heapster">Heapster</a>コンポーネントのRole(非推奨)。</td>
</tr>
<tr>
<td><b>system:kube-aggregator</b></td>
<td>None</td>
<td><a href="https://github.com/kubernetes/kube-aggregator">kube-aggregator</a>コンポーネントのRole。</td>
</tr>
<tr>
<td><b>system:kube-dns</b></td>
<td><b><b>kube-system</b>Namespaceのサービスアカウントkube-dns</b></td>
<td><a href="/ja/docs/concepts/services-networking/dns-pod-service/">kube-dns</a>コンポーネントのRole。</td>
</tr>
<tr>
<td><b>system:kubelet-api-admin</b></td>
<td>None</td>
<td>kubelet APIへのフルアクセスを許可します。</td>
</tr>
<tr>
<td><b>system:node-bootstrapper</b></td>
<td>None</td>
<td><a href="/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/">kubelet TLS bootstrapping</a>の実行に必要なリソースへのアクセスを許可します。</td>
</tr>
<tr>
<td><b>system:node-problem-detector</b></td>
<td>None</td>
<td><a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a>コンポーネントのRole。</td>
</tr>
<tr>
<td><b>system:persistent-volume-provisioner</b></td>
<td>None</td>
<td>ほとんどの<a href="/ja/docs/concepts/storage/persistent-volumes/#dynamic">dynamic volume provisioners</a>が必要とするリソースへのアクセスを許可します。</td>
</tr>
</table>

### 組み込みコントローラーのRole {#controller-roles}

Kubernetes {{< glossary_tooltip term_id="kube-controller-manager" text="controller manager" >}}は、Kubernetesコントロールプレーンに組み込まれている{{< glossary_tooltip term_id="controller" text="controllers" >}}を実行します。
`--use-service-account-credentials`を指定して呼び出すと、kube-controller-manager個別のサービスアカウントを使用して各コントローラーを起動します。
組み込みコントローラーごとに、プレフィックス`system:controller:`付きの対応するRoleが存在します。
コントローラーマネージャーが`--use-service-account-credentials`で開始されていない場合、コントローラーマネージャーは、関連するすべてのRoleを付与する必要がある自身のクレデンシャルを使用して、すべてのコントロールループを実行します。
これらのRoleは次のとおりです。

* `system:controller:attachdetach-controller`
* `system:controller:certificate-controller`
* `system:controller:clusterrole-aggregation-controller`
* `system:controller:cronjob-controller`
* `system:controller:daemon-set-controller`
* `system:controller:deployment-controller`
* `system:controller:disruption-controller`
* `system:controller:endpoint-controller`
* `system:controller:expand-controller`
* `system:controller:generic-garbage-collector`
* `system:controller:horizontal-pod-autoscaler`
* `system:controller:job-controller`
* `system:controller:namespace-controller`
* `system:controller:node-controller`
* `system:controller:persistent-volume-binder`
* `system:controller:pod-garbage-collector`
* `system:controller:pv-protection-controller`
* `system:controller:pvc-protection-controller`
* `system:controller:replicaset-controller`
* `system:controller:replication-controller`
* `system:controller:resourcequota-controller`
* `system:controller:root-ca-cert-publisher`
* `system:controller:route-controller`
* `system:controller:service-account-controller`
* `system:controller:service-controller`
* `system:controller:statefulset-controller`
* `system:controller:ttl-controller`

## 特権昇格の防止とブートストラップ

RBAC APIは、RoleまたはRoleBindingを編集することにより、ユーザーが特権を昇格するのを防ぎます。
これはAPIレベルで適用されるため、RBAC authorizerが使用されていない場合でも適用されます。

### Roleの作成または更新に関する制限

次の項目1つ以上が当てはまる場合にのみ、Roleを作成/更新できます。

1. 変更対象のオブジェクトと同じスコープで、Roleに含まれるすべての権限を既に持っている(ClusterRoleの場合はクラスター全体。Roleの場合は、同じNamespace内またはクラスター全体)。
2. `rbac.authorization.k8s.io`APIグループの` roles`または`clusterroles`リソースで` escalate` verbを実行する明示的な権限が付与されている。

たとえば、 `user-1`にクラスター全体でSecretsを一覧表示する権限がない場合、それらにその権限を含むClusterRoleを作成できません。
ユーザーがRoleを作成/更新できるようにするには、以下のいずれかを実施します。

1. 必要に応じて、RoleオブジェクトまたはClusterRoleオブジェクトを作成/更新できるRoleを付与する。
2. 作成/更新するRoleに特定の権限を含む権限を付与する。
    * 暗黙的に、これらの権限を付与することにより(自分自身が付与されていない権限でRoleまたはClusterRoleを作成または変更しようとすると、APIリクエストは禁止されます)。
    * または、`rbac.authorization.k8s.io`APIグループの` roles`または `clusterroles`リソースで` escalate` verbを実行する権限を与えることにより、 `Role`または` ClusterRole`で権限を指定することを明示的に許可する

### RoleBindingの作成または更新に関する制限

参照されるRoleに含まれるすべての権限を(RoleBindingと同じスコープで)すでに持っている場合、
*または*参照されたRoleで`bind` verbを実行する認可されている場合のみ、RoleBindingを作成/更新できます。
たとえば、 `user-1`にクラスター全体でSecretsを一覧表示する権限がない場合、ClusterRoleBindingを作成してもRoleにその権限を付与できません。
ユーザーがRoleBindingを作成/更新できるようにするには、以下のいずれかを実施します。

1. 必要に応じて、RoleBindingまたはClusterRoleBindingオブジェクトを作成/更新できるようにする役割を付与する。
2. 特定の役割をバインドするために必要なアクセス許可を付与する。
    * 暗黙的に、Roleに含まれる権限を付与することによって。
    * 明示的に、特定のRole(またはClusterRole)で `bind` verbを実行する許可を与えることによって。

たとえば、このClusterRoleとRoleBindingを使用すると、 `user-1`は他のユーザーにNamespace` user-1-namespace`の `admin`、` edit`、および `view`Roleを付与します。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: role-grantor
rules:
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["rolebindings"]
  verbs: ["create"]
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["clusterroles"]
  verbs: ["bind"]
  resourceNames: ["admin","edit","view"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: role-grantor-binding
  namespace: user-1-namespace
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: role-grantor
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: user-1
```

最初のRoleとRoleBindingをブートストラップするときは、最初のユーザーがまだ持っていない権限を付与する必要があります。
初期RoleとRoleBindingをブートストラップするには、以下のいずれかを実施します。

* 「system：masters」グループのクレデンシャルを使用します。このグループは、デフォルトのBindingによって「cluster-admin」スーパーユーザーRoleにバインドされています。
* APIサーバーが安全でないポート(`--insecure-port`)を有効にして実行されている場合、そのポートを介してのAPI呼び出しもできます。これにより、認証や認可が実行されません。

## コマンドラインユーティリティー

### `kubectl create role`

以下に、単一のNamespace内で権限を定義するRoleオブジェクトをいくつか例として作成します。

* ユーザーがポッドで `get`、` watch`、および `list`を実行できるように「pod-reader」という名前のRoleを作成します。

    ```shell
    kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
    ```

* resourceNamesを指定して、「pod-reader」という名前のRoleを作成します。

    ```shell
    kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* apiGroupsを指定して「foo」という名前のRoleを作成します。

    ```shell
    kubectl create role foo --verb=get,list,watch --resource=replicasets.apps
    ```

* サブリソースの権限を持つ「foo」という名前のRoleを作成します。
* Create a Role named "foo" with subresource permissions:

    ```shell
    kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
    ```
* 特定の名前のリソースを取得/更新する権限を持つ「my-component-lease-holder」という名前のRoleを作成します。

    ```shell
    kubectl create role my-component-lease-holder --verb=get,list,watch,update --resource=lease --resource-name=my-component
    ```

### `kubectl create clusterrole`

以下にClusterRoleをいくつか例として作成します。

* ユーザーがポッドに対して`get`、` watch`、および `list`を実行できるようにする「pod-reader」という名前のClusterRoleを作成します。

    ```shell
    kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
    ```

* resourceNamesを指定して、「pod-reader」という名前のClusterRoleを作成します。

    ```shell
    kubectl create clusterrole pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* apiGroupsを指定して「foo」という名前のClusterRoleを作成します。

    ```shell
    kubectl create clusterrole foo --verb=get,list,watch --resource=replicasets.apps
    ```

* サブリソースの権限を持つ「foo」という名前のClusterRoleを作成します。

    ```shell
    kubectl create clusterrole foo --verb=get,list,watch --resource=pods,pods/status
    ```

* nonResourceURLを指定して「foo」という名前のClusterRoleを作成します。

    ```shell
    kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*
    ```

* aggregationRuleを指定して、「monitoring」という名前のClusterRoleを作成します。

    ```shell
    kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
    ```

### `kubectl create rolebinding`

以下に、特定のNamespace内でRoleまたはClusterRoleをいくつか例として付与します。

* Namespace「acme」内で、「admin」ClusterRoleの権限を「bob」という名前のユーザーに付与します。

    ```shell
    kubectl create rolebinding bob-admin-binding --clusterrole=admin --user=bob --namespace=acme
    ```

* Namespace「acme」内で、ClusterRole「view」へのアクセス許可を「myapp」というNamespace「acme」のサービスアカウントに付与します。

    ```shell
    kubectl create rolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme
    ```

* Namespace「acme」内で、ClusterRole「view」へのアクセス許可を「myapp」というNamespace「myappnamespace」のサービスアカウントに付与します。

    ```shell
    kubectl create rolebinding myappnamespace-myapp-view-binding --clusterrole=view --serviceaccount=myappnamespace:myapp --namespace=acme
    ```

### `kubectl create clusterrolebinding`

以下に、クラスター全体(すべてのNamespace)にClusterRoleをいくつか例として付与します。

* クラスター全体で、ClusterRole「cluster-admin」へのアクセス許可を「root」という名前のユーザーに付与します。

    ```shell
    kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root
    ```

* クラスター全体で、ClusterRole「system：node-proxier」へのアクセス許可を「system：kube-proxy」という名前のユーザーに付与します。

    ```shell
    kubectl create clusterrolebinding kube-proxy-binding --clusterrole=system:node-proxier --user=system:kube-proxy
    ```

* クラスター全体で、ClusterRole「view」へのアクセス許可を、Namespace「acme」の「myapp」という名前のサービスアカウントに付与します。

    ```shell
    kubectl create clusterrolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp
    ```

### `kubectl auth reconcile` {#kubectl-auth-reconcile}

マニフェストファイルから `rbac.authorization.k8s.io/v1`APIオブジェクトを作成または更新します。

欠落しているオブジェクトが作成され、必要に応じて、Namespaceに属するオブジェクト用にオブジェクトを含むNamespaceが作成されます。

既存のRoleが更新され、入力オブジェクトに権限が含まれるようになります。
`--remove-extra-permissions`が指定されている場合は、余分な権限を削除します。

既存のBindingが更新され、入力オブジェクトにsubjectsが含まれるようになります。
`--remove-extra-subjects`が指定されている場合は、余分な件名を削除します。

以下、例として。

* RBACオブジェクトのマニフェストファイルをテストとして適用し、行われる変更を表示します。

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml --dry-run=client
    ```

* RBACオブジェクトのマニフェストファイルを適用し、(Role内の)追加のアクセス許可と(Binding内の)追加のsubjectsを保持します。

    ```shell
    kubectl auth reconcile -f my-rbac-rules.yaml
    ```

* RBACオブジェクトのマニフェストファイルを適用し、(Role内の)余分なアクセス許可と(Binding内の)余分なsubjectsを削除します。

## ServiceAccount権限 {#service-account-permissions}

デフォルトのRBACポリシーは、コントロールプレーンコンポーネント、ノード、
およびコントローラーをスコープとして権限を付与しますが、 Namespace`kube-system`外のサービスアカウントには*no permissions*で付与します
(すべての認証されたユーザーに与えられたディスカバリー権限に関わらず)。

これにより、必要に応じて特定のServiceAccountに特定のRoleを付与できます。
きめ細かいRoleBindingはセキュリティを強化しますが、管理にはより多くの労力が必要です。
より広範な権限は、不必要な(そして潜在的にエスカレートする)APIアクセスをServiceAccountsに与える可能性がありますが、管理が簡単です。

アプローチを最も安全なものから最も安全でないものの順に並べると、次のとおりです。

1. アプリケーション固有のサービスアカウントにRoleを付与する(ベストプラクティス)
    これには、アプリケーションがpodのspec、そして作成するサービスアカウント(API、アプリケーションマニフェスト、 `kubectl create serviceaccount`などを介して）で`serviceAccountName`を指定する必要があります。
    たとえば、「my-namespace」内の読み取り専用権限を「my-sa」サービスアカウントに付与します。

    ```shell
    kubectl create rolebinding my-sa-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:my-sa \
      --namespace=my-namespace
    ```

2. あるNamespaceのサービスアカウント「default」にRoleを付与します

    アプリケーションが `serviceAccountName`を指定しない場合、サービスアカウント「default」を使用します。

    {{< note >}}
  サービスアカウント「default」に付与された権限は、`serviceAccountName`を指定しないNamespace内のすべてのポッドで利用できます。
    {{< /note >}}

    たとえば、「my-namespace」内の読み取り専用権限をサービスアカウント「default」に付与します。

    ```shell
    kubectl create rolebinding default-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:default \
      --namespace=my-namespace
    ```

    多くの[アドオン](/ja/docs/concepts/cluster-administration/addons/)は、
    Namespace`kube-system`のサービスアカウント「default」として実行されます。
    これらのアドオンをスーパーユーザーアクセスでの実行を許可するには、Namespace`kube-system`のサービスアカウント「default」のcluster-admin権限を付与します。

    {{< caution >}}
    これを有効にすると、 Namespace`kube-systemにクラスターのAPIへのスーパーユーザーアクセス許可するSecretsが含まれます。
    {{< /caution >}}

    ```shell
    kubectl create clusterrolebinding add-on-cluster-admin \
      --clusterrole=cluster-admin \
      --serviceaccount=kube-system:default
    ```

3. Namespace内のすべてのサービスアカウントにRoleを付与します

    Namespace内のすべてのアプリケーションにRoleを持たせたい場合は、使用するサービスアカウントに関係なく、
    そのNamespaceのサービスアカウントグループにRoleを付与できます。

    たとえば、「my-namespace」内の読み取り専用アクセス許可を、そのNamespace内のすべてのサービスアカウントに付与します。

    ```shell
    kubectl create rolebinding serviceaccounts-view \
      --clusterrole=view \
      --group=system:serviceaccounts:my-namespace \
      --namespace=my-namespace
    ```

4. クラスター全体のすべてのサービスアカウントに制限されたRoleを付与します(お勧めしません)

    Namespaceごとのアクセス許可を管理したくない場合は、すべてのサービスアカウントにクラスター全体の役割を付与できます。

    たとえば、クラスター内のすべてのサービスアカウントに、すべてのNamespaceで読み取り専用のアクセス許可を付与します。

    ```shell
    kubectl create clusterrolebinding serviceaccounts-view \
      --clusterrole=view \
     --group=system:serviceaccounts
    ```

5. クラスター全体のすべてのサービスアカウントへのスーパーユーザーアクセスを許可します。(強くお勧めしません)

    権限の分割をまったく考慮しない場合は、すべてのサービスアカウントにスーパーユーザーアクセスを許可できます。

    {{< warning >}}
    これにより、すべてのアプリケーションにクラスターへのフルアクセスが許可され、Secretsの読み取りアクセス権(または任意のポッドを作成する機能)を持つユーザーに、クラスターへのフルアクセスが許可されます。
    {{< /warning >}}

    ```shell
    kubectl create clusterrolebinding serviceaccounts-cluster-admin \
      --clusterrole=cluster-admin \
      --group=system:serviceaccounts
    ```

## ABACからアップグレードする

以前は古いバージョンのKubernetesを実行していたクラスターは、すべてのサービスアカウントに完全なAPIアクセスを許可するなど、permissiveなABACポリシーを使用することがよくありました。

デフォルトのRBACポリシーは、コントロールプレーンコンポーネント、ノード、
およびコントローラーをスコープとして権限を付与しますが、 Namespace`kube-system`外のサービスアカウントには*no permissions*で付与します
(すべての認証されたユーザーに与えられたディスカバリー権限に関わらず)。

これははるかに安全ですが、API権限を自動的に受け取ることを期待している既存のワークロードを混乱させる可能性があります。
この移行を管理するための2つのアプローチは次のとおりです。

### 並行認可


RBACとABACの両方のauthorizerを実行し、[legacy ABAC policy](/docs/reference/access-authn-authz/abac/#policy-file-format)を含むポリシーファイルを指定します。

```
--authorization-mode=...,RBAC,ABAC --authorization-policy-file=mypolicy.json
```

最初のコマンドラインオプションを詳細に説明すると、Nodeなどの以前のauthorizerが
要求を拒否すると、RBAC authorizerはAPI要求を認可しようとします。 RBACの場合
また、そのAPI要求を拒否すると、ABAC authorizerが実行されます。これにより、すべてのリクエストが
RBACまたはABACポリシーの*いずれか*で許可されます。

RBACコンポーネントのログレベルが5以上でkube-apiserverを実行した場合(`--vmodule = rbac * = 5`または` --v = 5`)、APIサーバーログでRBACの拒否を確認できます(プレフィックスは「RBAC」)。
その情報を使用して、どのRoleをどのユーザー、グループ、またはサービスアカウントに付与する必要があるかを判断できます。

[サービスアカウントに付与されたRole](#service-account-permissions)を取得し、
ワークロードがサーバーログにRBACの拒否メッセージがない状態で実行されている場合は、ABAC authorizerを削除できます。

### Permissive RBAC権限

RBACRoleBindingを使用して、permissive ABACポリシーを複製できます。

{{< warning >}}
次のポリシーでは、**すべて**のサービスアカウントがクラスター管理者としてふるまうことを許可しています。
コンテナで実行されているアプリケーションは、サービスアカウントのクレデンシャルを自動的に受け取ります。
secretsの表示や権限の変更など、APIに対して任意のアクションを実行できます。
これは推奨されるポリシーではありません。

```shell
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```
{{< /warning >}}

RBACの使用に移行後、クラスターが情報セキュリティのニーズを確実に満たすように、アクセスコントロールを調整する必要があります。
