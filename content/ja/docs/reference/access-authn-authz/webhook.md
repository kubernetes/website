---
title: Webhookモード
content_type: concept
weight: 36
---

<!-- overview -->
WebHookとはHTTPコールバックです。
何かが発生した際に行われるHTTP POSTであり、HTTP POSTによるシンプルなイベント通知です。
WebHookを実装したWebアプリケーションは、特定の事象が発生した際にメッセージをURLへPOSTします。


<!-- body -->
`Webhook`モードを指定すると、Kubernetesはユーザーの権限を決定する際に外部のRESTサービスへ問い合わせを行います。

## 設定ファイルのフォーマット {#configuration-file-format}

`Webhook`モードではHTTP設定用のファイルが必要であり、`--authorization-webhook-config-file=SOME_FILENAME`フラグで指定します。

設定ファイルは[kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)のファイル形式を使用します。
ファイル内において、"users"はAPIサーバーのWebhookを指し、"clusters"はリモートサービスを指します。

HTTPSクライアント認証を使用する設定例:

```yaml
# Kubernetes APIのバージョン
apiVersion: v1
# APIオブジェクトの種類
kind: Config
# clustersはリモートサービスを指します。
clusters:
  - name: name-of-remote-authz-service
    cluster:
      # リモートサービスを検証するためのCA
      certificate-authority: /path/to/ca.pem
      # クエリするリモートサービスのURL。'https'を使用する必要があります。パラメーターを含めることはできません。
      server: https://authz.example.com/authorize

# usersはAPIサーバーのWebhook設定を指します。
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # Webhookプラグインが使用する証明書
      client-key: /path/to/key.pem          # 証明書に対応する鍵

# kubeconfigファイルにはコンテキストが必要です。APIサーバー用のコンテキストを指定します。
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authz-service
    user: name-of-api-server
  name: webhook
```

## リクエストペイロード {#request-payloads}

認可の決定を行う際、APIサーバーはそのアクションを記述したJSONシリアライズされた`authorization.k8s.io/v1beta1` `SubjectAccessReview`オブジェクトをPOSTします。
このオブジェクトには、リクエストを行おうとしているユーザーを説明するフィールドと、アクセスされるリソースに関する詳細、またはリクエストの属性のいずれかが含まれます。

Webhook APIオブジェクトは、他のKubernetes APIオブジェクトと同じ[バージョニング互換性規則](/docs/concepts/overview/kubernetes-api/)の対象となることに注意してください。
実装者は、ベータオブジェクトに対する互換性の保証が緩やかであることに留意し、正しくデシリアライズされるようにリクエストの"apiVersion"フィールドを確認する必要があります。
さらに、APIサーバーは`authorization.k8s.io/v1beta1` API拡張グループを有効にする必要があります(`--runtime-config=authorization.k8s.io/v1beta1=true`)。

リクエストボディの例:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "kittensandponies",
      "verb": "get",
      "group": "unicorn.example.org",
      "resource": "pods"
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ]
  }
}
```

リモートサービスはリクエストの`status`フィールドを設定し、アクセスを許可するか不許可にするかを応答することが期待されます。
レスポンスボディの`spec`フィールドは無視され、省略しても構いません。
アクセスを許可するレスポンスは以下のようになります:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": true
  }
}
```

アクセスを不許可にする方法には2種類あります。

第1の方法はほとんどの場合に推奨される方法であり、認可Webhookがリクエストを許可しない、または「意見なし(no opinion)」であることを示します。
ただし、他に設定されたauthorizerがある場合、それらにリクエストを許可する機会が与えられます。
他にauthorizerがない場合、またはそのいずれもリクエストを許可しなかった場合、リクエストは拒否(forbidden)されます。
Webhookは以下を返します:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": false,
    "reason": "user does not have read access to the namespace"
  }
}
```

第2の方法は即座に拒否し、設定されている他のauthorizerによる評価をショートサーキット(短絡)します。
これは、クラスターの完全なauthorizer設定について詳細な知識を持つWebhookでのみ使用してください。
Webhookは以下を返します:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": false,
    "denied": true,
    "reason": "user does not have read access to the namespace"
  }
}
```

非リソースパスへのアクセスは以下のように送信されます:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "nonResourceAttributes": {
      "path": "/debug",
      "verb": "get"
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ]
  }
}
```

{{< feature-state feature_gate_name="AuthorizeWithSelectors" >}}

認可Webhookを呼び出す際、Kubernetesは認可Webhookへのリクエストにラベルセレクターおよびフィールドセレクターを渡します。
認可Webhookは、必要に応じて、スコープされたフィールドセレクターやラベルセレクターに基づいて認可の決定を行うことができます。

[SubjectAccessReview APIドキュメント](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/)には、これらのフィールドが認可Webhookによってどのように解釈および処理されるべきかについてのガイドラインが記載されています。
具体的には、生のセレクター文字列ではなくパースされた要件(parsed requirements)を使用することや、認識できない演算子を安全に処理する方法などです。

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "verb": "list",
      "group": "",
      "resource": "pods",
      "fieldSelector": {
        "requirements": [
          {"key":"spec.nodeName", "operator":"In", "values":["mynode"]}
        ]
      },
      "labelSelector": {
        "requirements": [
          {"key":"example.com/mykey", "operator":"In", "values":["myvalue"]}
        ]
      }
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ]
  }
}
```

非リソースパスには、`/api`、`/apis`、`/metrics`、`/logs`、`/debug`、`/healthz`、`/livez`、`/openapi/v2`、`/readyz`、および`/version`が含まれます。
クライアントは、サーバー上にどのリソースおよびバージョンが存在するかを検出するために、`/api`、`/api/*`、`/apis`、`/apis/*`、および`/version`へのアクセスを必要とします。
他の非リソースパスへのアクセスは、REST APIへのアクセスを制限することなく不許可にできます。

詳細については、[SubjectAccessReview APIドキュメント](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/)および[webhook.goの実装](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/plugin/pkg/authorizer/webhook/webhook.go)を参照してください。
