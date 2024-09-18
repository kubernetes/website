---
title: "kubectlのトラブルシューティング"
content_type: task
weight: 10
---

<!-- overview -->

このドキュメントは、{{<glossary_tooltip text="kubectl" term_id="kubectl">}}関連の問題の調査と診断に関するものです。
`kubectl`へのアクセスやクラスターへの接続で問題に直面した場合、このドキュメントではさまざまな一般的なシナリオや考えられる解決策を概説し、問題の特定と対処するのに役立ちます。

<!-- body -->

## {{% heading "prerequisites" %}}

* Kubernetesクラスターが必要です。
* `kubectl`もインストールする必要があります。[ツールのインストール](/ja/docs/tasks/tools/#kubectl)を参照してください。

## kubectlセットアップを検証する

`kubectl`がローカルマシンに正しくインストールされ、構成されていることを確認してください。
`kubectl`バージョンが最新であり、クラスターと互換性があることを確認してください。

kubectlバージョンを確認します:

```shell
kubectl version
```

以下のような出力が表示されます:

```console
Client Version: version.Info{Major:"1", Minor:"27", GitVersion:"v1.27.4",GitCommit:"fa3d7990104d7c1f16943a67f11b154b71f6a132", GitTreeState:"clean",BuildDate:"2023-07-19T12:20:54Z", GoVersion:"go1.20.6", Compiler:"gc", Platform:"linux/amd64"}
Kustomize Version: v5.0.1
Server Version: version.Info{Major:"1", Minor:"27", GitVersion:"v1.27.3",GitCommit:"25b4e43193bcda6c7328a6d147b1fb73a33f1598", GitTreeState:"clean",BuildDate:"2023-06-14T09:47:40Z", GoVersion:"go1.20.5", Compiler:"gc", Platform:"linux/amd64"}

```

`Server Version`ではなく`Unable to connect to the server: dial tcp <server-ip>:8443: i/o timeout`と表示された場合、クラスターとのkubectl接続のトラブルシューティングを行う必要があります。

[kubectlのインストールについての公式ドキュメント](/ja/docs/tasks/tools/#kubectl)に従ってkubectlがインストールされていること、環境変数`$PATH`が適切に設定されていることを確認してください。

## kubeconfigを確認する

`kubectl`がKubernetesクラスターに接続するためには`kubeconfig`ファイルが必要です。
`kubeconfig`ファイルは通常`~/.kube/config`ディレクトリに配置されています。
有効な`kubeconfig`ファイルがあることを確認してください。
`kubeconfig`ファイルがない場合、Kubernetes管理者から入手するか、Kubernetesコントロールプレーンの`/etc/kubernetes/admin.conf`ディレクトリからコピーすることができます。
Kubernetesクラスターをクラウドプラットフォームにデプロイし、`kubeconfig`ファイルを紛失した場合は、クラウドプロバイダーのツールを使用してファイルを再生成できます。
`kubeconfig`ファイルの再生成については、クラウドプロバイダーのドキュメントを参照してください。

環境変数`$KUBECONFIG`が正しく設定されていることを確認してください。
環境変数`$KUBECONFIG`を設定するか、`kubectl`で`--kubeconfig`パラメーターを使用して、`kubeconfig`ファイルのディレクトリを指定できます。

## VPNの接続性を確認する

Kubernetesクラスターにアクセスするために仮想プライベートネットワーク(VPN)を使用している場合は、VPN接続がアクティブで安定していることを確認してください。
しばしば、VPNの切断がクラスターへの接続の問題につながることがあります。
VPNに再接続して、クラスターに再度アクセスしてみてください。

## 認証と認可

トークンベースの認証を使用していて、kubectlが認証トークンや認証サーバーのアドレスに関するエラーを返している場合は、Kubernetesの認証トークンと認証サーバーのアドレスが正しく設定されていることを確認してください。

kubectlが認可に関するエラーを返している場合は、有効なユーザー資格情報を使用していることを確認してください。
また、リクエストしたリソースにアクセスする権限があることを確認してください。

## コンテキストを検証する

Kubernetesは[複数のクラスターとコンテキスト](/ja/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)をサポートしています。
クラスターとやり取りするために正しいコンテキストを使用していることを確認してください。

使用可能なコンテキストの一覧を表示します:

```shell
kubectl config get-contexts
```

適切なコンテキストに切り替えます:

```shell
kubectl config use-context <context-name>
```

## APIサーバーとロードバランサー

{{<glossary_tooltip text="kube-apiserver" term_id="kube-apiserver">}}サーバーは、Kubernetesクラスターの中心的なコンポーネントです。
APIサーバーや、APIサーバーの前段にあるロードバランサーに到達できない、または応答しない場合、クラスターとのやり取りができません。

APIサーバーのホストに到達可能かどうかを確認するために`ping`コマンドを使用します。
クラスターネットワークの接続性とファイアウォールを確認してください。
クラウドプロバイダーを使用してクラスターをデプロイしている場合は、クラスターのAPIサーバーに対して、クラウドプロバイダーのヘルスチェックのステータスを確認してください。

(使用している場合)ロードバランサーのステータスを確認し、ロードバランサーが正常であり、APIサーバーにトラフィックを転送していることを確認してください。

## TLSの問題
* 追加ツールが必要です - `base64`および`openssl`バージョン3.0以上。

KubernetesのAPIサーバーは、デフォルトではHTTPSリクエストのみを処理します。
TLSの問題は、証明書の有効期限切れやトラストチェーンの有効性など、さまざまな原因で発生する可能性があります。

TLS証明書は、`~/.kube/config`ディレクトリにあるkubeconfigファイルに含まれています。
`certificate-authority`属性にはCA証明書が、`client-certificate`属性にはクライアント証明書が含まれています。

これらの証明書の有効期限を確認します:

```shell
kubectl config view --flatten --output 'jsonpath={.clusters[0].cluster.certificate-authority-data}' | base64 -d | openssl x509 -noout -dates
```

出力:
```console
notBefore=Feb 13 05:57:47 2024 GMT
notAfter=Feb 10 06:02:47 2034 GMT
```

```shell
kubectl config view --flatten --output 'jsonpath={.users[0].user.client-certificate-data}'| base64 -d | openssl x509 -noout -dates
```

出力:
```console
notBefore=Feb 13 05:57:47 2024 GMT
notAfter=Feb 12 06:02:50 2025 GMT
```

## kubectlヘルパーを検証する

一部のkubectl認証ヘルパーは、Kubernetesクラスターへの容易なアクセスを提供します。
そのようなヘルパーを使用して接続性の問題が発生している場合は、必要な構成がまだ存在していることを確認してください。

認証の詳細についてはkubectl構成を確認します:

```shell
kubectl config view
```

以前にヘルパーツール(`kubectl-oidc-login`など)を使用していた場合は、そのツールがまだインストールされ正しく構成されていることを確認してください。
