---
title: クラスターへのアクセス
weight: 20
content_type: concept
---

<!-- overview -->

このセクションでは、クラスターとやり取りするための複数の方法について説明します。

<!-- body -->

## kubectlで初めてアクセスする {#accessing-for-the-first-time-with-kubectl}

Kubernetes APIに初めてアクセスする際は、Kubernetes CLIの`kubectl`を使用することをおすすめします。

クラスターにアクセスするには、クラスターの接続先とアクセス用の認証情報が必要です。
通常、[入門ガイド](/docs/setup/)に従って進めると、自動的にセットアップされます。
または、他の誰かがクラスターをセットアップ済みで、認証情報と接続先が提供されている場合もあります。

以下のコマンドで、kubectlが認識している接続先と認証情報を確認してください:

```shell
kubectl config view
```

多くの[例](/ja/docs/reference/kubectl/quick-reference/)で`kubectl`の基本的な使い方を紹介しており、完全なドキュメントは[kubectlリファレンス](/ja/docs/reference/kubectl/)で確認できます。

## REST APIに直接アクセスする {#directly-accessing-the-rest-api}

kubectlは、APIサーバーの接続先を特定し、認証処理を行います。
curlやwget、ブラウザなどのHTTPクライアントでREST APIに直接アクセスしたい場合、接続先を特定して認証する方法がいくつかあります:

- kubectlをプロキシモードで実行する。
  - 推奨される方法です。
  - 保存済みのAPIサーバーの接続先を使用します。
  - 自己署名証明書を使用して、APIサーバーの身元を検証します。MITM攻撃は不可能です。
  - APIサーバーに対して認証を行います。
  - 将来的には、クライアント側で高度な負荷分散やフェイルオーバーを行う可能性があります。
- HTTPクライアントに接続先と認証情報を直接提供する。
  - 代替の方法です。
  - プロキシを使用すると正しく動作しない一部のクライアントコードでも動作します。
  - MITM攻撃を防ぐために、ルート証明書をブラウザにインポートする必要があります。

### kubectl proxyの使用 {#using-kubectl-proxy}

以下のコマンドを実行すると、kubectlがリバースプロキシとして機能するモードで動作します。
APIサーバーの接続先の特定と認証を処理します。
以下のように実行します:

```shell
kubectl proxy --port=8080
```

詳細については、[kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy)を参照してください。

その後、curl、wget、またはブラウザでAPIにアクセスできます。
IPv6の場合は、localhostを[::1]に置き換えてください:

```shell
curl http://localhost:8080/api/
```

出力は以下のようになります:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

### kubectl proxyを使用しない場合 {#without-kubectl-proxy}

`kubectl apply`と`kubectl describe secret...`を使用して、デフォルトのサービスアカウント用のトークンをgrep/cutで作成します:

まず、デフォルトのServiceAccount用のトークンを要求するSecretを作成します:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: default-token
  annotations:
    kubernetes.io/service-account.name: default
type: kubernetes.io/service-account-token
EOF
```

次に、トークンコントローラーがSecretにトークンを設定するまで待ちます:

```shell
while ! kubectl describe secret default-token | grep -E '^token' >/dev/null; do
  echo "waiting for token..." >&2
  sleep 1
done
```

生成されたトークンを取得して、使用します:

```shell
APISERVER=$(kubectl config view --minify | grep server | cut -f 2- -d ":" | tr -d " ")
TOKEN=$(kubectl describe secret default-token | grep -E '^token' | cut -f2 -d':' | tr -d " ")

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

出力は以下のようになります:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

`jsonpath`を使用する場合:

```shell
APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
TOKEN=$(kubectl get secret default-token -o jsonpath='{.data.token}' | base64 --decode)

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

出力は以下のようになります:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

上記の例では、`--insecure`フラグを使用しているため、MITM攻撃を受ける可能性があります。
kubectlがクラスターにアクセスする際は、保存済みのルート証明書とクライアント証明書を使用してサーバーにアクセスします(これらは、`~/.kube`ディレクトリにインストールされています)。
通常、クラスター証明書は自己署名されているため、HTTPクライアントでルート証明書を使用するには、特別な設定が必要になる場合があります。

一部のクラスターでは、APIサーバーが認証を必要としない場合があります。
localhostで提供されていたり、ファイアウォールで保護されている場合などです。
このような、認証を必要としない構成を行うための標準的な方法はありません。
クラスター管理者がアクセス制御を設定する方法については、[APIへのアクセスコントロール](/docs/concepts/security/controlling-access)を参照してください。

## プログラムによるAPIアクセス {#programmatic-access-to-the-api}

Kubernetesは、[Go](#go-client)と[Python](#python-client)のクライアントライブラリを公式にサポートしています。

### Goクライアント {#go-client}

* ライブラリを取得するには、次のコマンドを実行します: `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>`。
  詳細なインストール手順については、[INSTALL.md](https://github.com/kubernetes/client-go/blob/master/INSTALL.md#for-the-casual-user)を参照してください。
  サポートされているバージョンについては、[https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go#compatibility-matrix)を参照してください。
* client-goクライアントを使用してアプリケーションを作成します。
  client-goは独自のAPIオブジェクトを定義しているため、必要に応じて、メインリポジトリではなくclient-goからAPI定義をインポートしてください。
  例: `import "k8s.io/client-go/kubernetes"`が正しい形です。

Goクライアントは、kubectl CLIと同じ[kubeconfigファイル](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)を使用して、APIサーバーの接続先の特定と認証を行うことができます。
こちらの[例](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go)を参照してください。

クラスター内で、アプリケーションがPodとしてデプロイされている場合は、[次のセクション](#accessing-the-api-from-a-pod)を参照してください。

### Pythonクライアント {#python-client}

[Pythonクライアント](https://github.com/kubernetes-client/python)を使用するには、次のコマンドを実行します:
`pip install kubernetes`。
その他のインストールオプションについては、[Pythonクライアントライブラリページ](https://github.com/kubernetes-client/python)を参照してください。

Pythonクライアントは、kubectl CLIと同じ[kubeconfigファイル](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)を使用して、APIサーバーの接続先の特定と認証を行うことができます。
こちらの[例](https://github.com/kubernetes-client/python/tree/master/examples)を参照してください。

### その他の言語 {#other-languages}

その他の言語でAPIにアクセスするための[クライアントライブラリ](/docs/reference/using-api/client-libraries/)もあります。
認証方法については、各ライブラリのドキュメントを参照してください。

## PodからAPIにアクセスする {#accessing-the-api-from-a-pod}

PodからAPIにアクセスする場合、APIサーバーの接続先の特定と認証は多少異なります。

詳細については、[PodからAPIにアクセスする](/docs/tasks/run-application/access-api-from-pod/)を参照してください。

## クラスター上で実行されているサービスにアクセスする {#accessing-services-running-on-the-cluster}

前のセクションでは、Kubernetes APIサーバーへの接続方法について説明しました。
Kubernetesクラスター上で実行されている他のサービスへの接続については、[クラスターサービスへのアクセス](/docs/tasks/access-application-cluster/access-cluster-services/)を参照してください。

## リダイレクトのリクエスト {#requesting-redirects}

リダイレクト機能は非推奨となり、削除されました。
代わりに、プロキシを使用してください(以下を参照)。

## 様々なプロキシ {#many-proxies}

Kubernetesを使用する際に見かける可能性のあるプロキシがいくつかあります:

1. [kubectl proxy](#directly-accessing-the-rest-api):

   - ユーザーのデスクトップまたはPod内で実行されます
   - localhostアドレスからKubernetes APIサーバーへプロキシします
   - クライアントからプロキシへの通信では、HTTPを使用します
   - プロキシからAPIサーバーへの通信では、HTTPSを使用します
   - APIサーバーの接続先を特定します
   - 認証ヘッダーを追加します

1. [APIサーバープロキシ](/docs/tasks/access-application-cluster/access-cluster-services/#discovering-builtin-services):

   - APIサーバーに組み込まれた踏み台サーバーです
   - クラスター外のユーザーを、通常では到達できないクラスターIPに接続します
   - APIサーバーのプロセス内で実行されます
   - クライアントからプロキシへの通信では、HTTPS(または、APIサーバーがHTTPを使うように設定されている場合はHTTP)を使用します
   - プロキシからターゲットへの通信では、利用可能な情報に基づいてプロキシが選択したHTTPまたはHTTPSを使用します
   - ノード、Pod、またはServiceへのアクセスに使用できます
   - Serviceにアクセスする際に負荷分散を行います

1. [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

   - 各ノード上で実行されます
   - UDPとTCPをプロキシします
   - HTTPを解釈しません
   - 負荷分散を提供します
   - Serviceへのアクセスにのみ使用されます

1. APIサーバー前段のプロキシ/ロードバランサー:

   - クラスターによって、存在の有無や実装方法が異なります(例: nginx)
   - すべてのクライアントと1つ以上のAPIサーバーの間に位置します
   - 複数のAPIサーバーがある場合、ロードバランサーとして機能します

1. 外部サービスのクラウドロードバランサー:

   - 一部のクラウドプロバイダーによって提供されます(例: AWS ELB、Google Cloud Load Balancer)
   - Kubernetesサービスのタイプが`LoadBalancer`の場合、自動的に作成されます
   - UDP/TCPのみを使用します
   - クラウドプロバイダーによって実装が異なります

Kubernetesユーザーは通常、最初の2つのタイプ以外について気にする必要はありません。
残りのタイプは、通常は、クラスター管理者によって適切に設定されます。
