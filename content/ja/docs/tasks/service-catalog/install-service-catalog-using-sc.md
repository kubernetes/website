---
title: SCを使用したサービスカタログのインストール
content_type: task
---

<!-- overview -->
{{< glossary_definition term_id="service-catalog" length="all" prepend="サービスカタログは" >}}

GCPの[Service Catalog Installer](https://github.com/GoogleCloudPlatform/k8s-service-catalog#installation)ツールを使うと、Kubernetesクラスター上にサービスカタログを簡単にインストール・アンインストールして、Google Cloudのプロジェクトに紐付けることもできます。

サービスカタログ自体は、Google Cloudだけではなく、どのような種類のマネージドサービスでも動作します。

## {{% heading "prerequisites" %}}

* [サービスカタログ](/docs/concepts/extend-kubernetes/service-catalog/)の基本概念を理解してください。
* [Go 1.6+](https://golang.org/dl/)をインストールして、`GOPATH`を設定してください。
* SSLに関するファイルを生成するために必要な[cfssl](https://github.com/cloudflare/cfssl)ツールをインストールしてください。
* サービスカタログを使用するには、Kubernetesクラスターのバージョンが1.7以降である必要があります。
* [kubectlのインストールおよびセットアップ](/ja/docs/tasks/tools/install-kubectl/)を参考に、v1.7以降のkubectlをインストールし、設定を行ってください。
* サービスカタログをインストールするためには、kubectlのユーザーが*cluster-admin*ロールにバインドされている必要があります。正しくバインドされていることを確認するには、次のコマンドを実行します。

        kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=<user-name>

<!-- steps -->
## ローカル環境に`sc`をインストールする

インストーラーは、ローカルのコンピューター上で`sc`と呼ばれるCLIツールとして実行します。

`go get`を使用してインストールします。

```shell
go get github.com/GoogleCloudPlatform/k8s-service-catalog/installer/cmd/sc
```

これで、`sc`が`GOPATH/bin`ディレクトリー内にインストールされたはずです。

## Kubernetesクラスターにサービスカタログをインストールする

まず、すべての依存関係がインストールされていることを確認します。次のコマンドを実行してください。

```shell
sc check
```

チェックが成功したら、次のように表示されるはずです。

```
Dependency check passed. You are good to go.
```

次に、バックアップに使用したい`storageclass`を指定して、installコマンドを実行します。

```shell
sc install --etcd-backup-storageclass "standard"
```

## サービスカタログのアンインストール

Kubernetesクラスターからサービスカタログをアンインストールしたい場合は、`sc`ツールを使って次のコマンドを実行します。

```shell
sc uninstall
```

## {{% heading "whatsnext" %}}

* [サービスブローカーのサンプル](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers)を読む。
* [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog)プロジェクトを探索する。
