---
title: PodからKubernetes APIにアクセスする
content_type: task
weight: 120
---

<!-- overview -->

このガイドでは、Pod内からKubernetes APIにアクセスする方法を示します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Pod内からAPIへのアクセス

Podの中からAPIにアクセスする時、APIサーバーの場所の検出と認証は、外部クライアントの場合とは若干異なります。

PodからKubernetes APIを使用する最も簡単な方法は、公式の[クライアントライブラリ](/docs/reference/using-api/client-libraries/)を使用することです。
これらのライブラリは自動的にAPIサーバーを検出して認証できます。

### 公式クライアントライブラリの使用

Podの中からKubernetes APIに接続する推奨された方法として次のものがあります:

- Goクライアントの場合、公式の[Goクライアントライブラリ](https://github.com/kubernetes/client-go/)を使用します。
  `rest.InClusterConfig()`関数はAPIホストの探索と認証を自動的に処理します。
  [ここにあるサンプル](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go)を参照してください。

- Pythonクライアントの場合、公式の[Pythonクライアントライブラリ](https://github.com/kubernetes-client/python/)を使用します。
  `config.load_incluster_config()`関数はAPIホストの探索と認証を自動的に処理します。
  [ここにあるサンプル](https://github.com/kubernetes-client/python/blob/master/examples/in_cluster_config.py)を参照してください。

- 他にも多くのライブラリが利用できます。
  [クライアントライブラリ](/docs/reference/using-api/client-libraries/)のページを参照してください。

いずれの場合も、APIサーバーと安全に通信するために、Podのサービスアカウントの資格情報が使用されます。

### REST APIによる直接アクセス

コンテナは、Pod内での実行中に環境変数`KUBERNETES_SERVICE_HOST`と`KUBERNETES_SERVICE_PORT_HTTPS`を取得することで、Kubernetes APIサーバーのHTTPSのURLを作成することができます。
APIサーバーのクラスター内アドレスは、PodがローカルAPIサーバーのDNS名として`kubernetes.default.svc`を参照できるように、`default` Namespaceの`kubernetes`という名前のServiceにも公開されます。

{{< note >}}
Kubernetesは、APIサーバーがホスト名`kubernetes.default.svc`に対する有効な証明書を持っていることを保証しません。
しかし、コントロールプレーンは`$KUBERNETES_SERVICE_HOST`によって表されるホスト名またはIPアドレスに対する有効な証明書を提示することが期待**されます**。
{{< /note >}}

APIサーバーに対して認証を行う推奨された方法は、[サービスアカウント](/docs/tasks/configure-pod-container/configure-service-account/)の資格情報を使用することです。
既定では、Podはサービスアカウントと関連づけられており、そのサービスアカウントに対する資格情報(トークン)が、そのPod内の各コンテナのファイルシステムツリーの`/var/run/secrets/kubernetes.io/serviceaccount/token`内に配置されます。

利用可能であれば、証明書バンドルが各コンテナのファイルシステムツリーの`/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`に配置され、APIサーバーが提供する証明書を検証するために使用されます。

最後に、NamespaceスコープのAPIの操作に対して使用される既定のNamespaceは、各コンテナの`/var/run/secrets/kubernetes.io/serviceaccount/namespace`にあるファイルに記載されます。

### kubectl proxyの使用

公式のクライアントライブラリを使用せずにAPIを呼び出したい場合は、Pod内の新しいサイドカーコンテナの[コマンド](/docs/tasks/inject-data-application/define-command-argument-container/)として`kubectl proxy`を実行することができます。
こうすることで、`kubectl proxy`がAPIを認証してPodの`localhost`インターフェースに公開するため、Pod内の他のコンテナが直接使用することができます。

### プロキシを使用しない方法

認証トークンを直接APIサーバーに渡すことで、kubectl proxyの使用を避けることも可能です。
内部の証明書によって接続を保護します。

```shell
# 内部のAPIサーバーのホスト名の指定
APISERVER=https://kubernetes.default.svc

# ServiceAccountトークンのパス
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount

# PodのNamespaceの読み込み
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)

# ServiceAccountのBearerトークンを取得
TOKEN=$(cat ${SERVICEACCOUNT}/token)

# 内部の認証局(CA)の参照
CACERT=${SERVICEACCOUNT}/ca.crt

# トークンを用いてAPIの探索
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api
```

次のような出力になります:

```json
{
  "kind": "APIVersions",
  "versions": ["v1"],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```