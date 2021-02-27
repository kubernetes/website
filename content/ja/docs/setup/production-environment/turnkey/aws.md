---
title: AWS EC2上でKubernetesを動かす
content_type: task
---

<!-- overview -->

このページでは、AWS上でKubernetesクラスターをインストールする方法について説明します。



## {{% heading "prerequisites" %}}


AWS上でKubernetesクラスターを作成するには、AWSからアクセスキーIDおよびシークレットアクセスキーを入手する必要があります。

### サポートされているプロダクショングレードのツール

* [conjure-up](https://docs.conjure-up.io/stable/en/cni/k8s-and-aws)はUbuntu上でネイティブなAWSインテグレーションを用いてKubernetesクラスターを作成するオープンソースのインストーラーです。

* [Kubernetes Operations](https://github.com/kubernetes/kops) - プロダクショングレードなKubernetesのインストール、アップグレード、管理が可能です。AWS上のDebian、Ubuntu、CentOS、RHELをサポートしています。

* [kube-aws](https://github.com/kubernetes-incubator/kube-aws) EC2、CloudFormation、Auto Scalingを使用して、[Flatcar Linux](https://www.flatcar-linux.org/)ノードでKubernetesクラスターを作成および管理します。

* [KubeOne](https://github.com/kubermatic/kubeone)は可用性の高いKubernetesクラスターを作成、アップグレード、管理するための、オープンソースのライフサイクル管理ツールです。



<!-- steps -->

## クラスターの始まり

### コマンドライン管理ツール: kubectl

クラスターの起動スクリプトによってワークステーション上に`kubernetes`ディレクトリが作成されます。もしくは、Kubernetesの最新リリースを[こちら](https://github.com/kubernetes/kubernetes/releases)からダウンロードすることも可能です。

次に、kubectlにアクセスするために適切なバイナリフォルダーを`PATH`へ追加します:

```shell
# macOS
export PATH=<path/to/kubernetes-directory>/platforms/darwin/amd64:$PATH

# Linux
export PATH=<path/to/kubernetes-directory>/platforms/linux/amd64:$PATH
```

ツールに関する最新のドキュメントページはこちらです: [kubectl manual](/docs/reference/kubectl/kubectl/)

デフォルトでは、`kubectl`はクラスターの起動中に生成された`kubeconfig`ファイルをAPIに対する認証に使用します。
詳細な情報は、[kubeconfig files](/ja/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)を参照してください。

### 例

新しいクラスターを試すには、[簡単なnginxの例](/ja/docs/tasks/run-application/run-stateless-application-deployment/)を参照してください。

"Guestbook"アプリケーションは、Kubernetesを始めるもう一つのポピュラーな例です: [guestbookの例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/)

より完全なアプリケーションについては、[examplesディレクトリ](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/)を参照してください。

## クラスターのスケーリング

`kubectl`を使用したノードの追加および削除はサポートしていません。インストール中に作成された[Auto Scaling Group](https://docs.aws.amazon.com/autoscaling/latest/userguide/as-manual-scaling.html)内の'Desired'および'Max'プロパティを手動で調整することで、ノード数をスケールさせることができます。

## クラスターの解体

クラスターのプロビジョニングに使用した環境変数がexportされていることを確認してから、`kubernetes`ディレクトリ内で以下のスクリプトを実行してください:

```shell
cluster/kube-down.sh
```

## サポートレベル


IaaS プロバイダー    | 構成管理     | OS            | ネットワーク  | ドキュメント                                  | 適合     | サポートレベル
-------------------- | ------------ | ------------- | ------------  | --------------------------------------------- | ---------| ----------------------------
AWS                  | kops         | Debian        | k8s (VPC)     | [docs](https://github.com/kubernetes/kops)    |          | Community ([@justinsb](https://github.com/justinsb))
AWS                  | CoreOS       | CoreOS        | flannel     | -  |          | Community
AWS                  | Juju         | Ubuntu        | flannel, calico, canal     | - | 100%     | Commercial, Community
AWS                  | KubeOne         | Ubuntu, CoreOS, CentOS   | canal, weavenet     | [docs](https://github.com/kubermatic/kubeone)      | 100%    | Commercial, Community


