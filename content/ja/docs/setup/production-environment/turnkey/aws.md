---
title: AWS EC2上でKubernetesを動かす
content_template: templates/task
---

{{% capture overview %}}

このページでは、AWS上へKubernetesクラスターをインストールする方法について説明します。

{{% /capture %}}

{{% capture prerequisites %}}

AWS上でKubernetesクラスターを作成するには、AWSからアクセスキーIDおよびシークレットアクセスキーを入手する必要があります。

### サポートされているプロダクショングレードのツール

* [conjure-up](/docs/getting-started-guides/ubuntu/)はUbuntu上でネイティブなAWSインテグレーションを用いてKubernetesクラスターを作成するオープンソースのインストーラーです。

* [Kubernetes Operations](https://github.com/kubernetes/kops) - プロダクショングレードなインストール、アップグレード、マネジメントが可能です。AWS上のDebian、Ubuntu, CentOS, RHELをサポートします。

* [CoreOS Tectonic](https://coreos.com/tectonic/)はAWS上のContainer Linuxノードを含むKubernetesクラスターを作成できる、オープンソースの[Tectonic Installer](https://github.com/coreos/tectonic-installer)を含みます。

* CoreOSから生まれKubernetes IncubatorがメンテナンスしているCLIツール[kube-aws](https://github.com/kubernetes-incubator/kube-aws)は、AWSツール (EC2, CloudFormation, Auto Scaling) を使用し[Container Linux](https://coreos.com/why/)ノードを含むKubernetesクラスターを作成および管理できます。

* [KubeOne](https://github.com/kubermatic/kubeone) is an open source cluster lifecycle management tool that creates, upgrades and manages Kubernetes Highly-Available clusters.

{{% /capture %}}

{{% capture steps %}}

## クラスターの始まり

### コマンドライン管理ツール: kubectl

クラスターの起動スクリプトによってワークステーション上に`kubernetes`ディレクトリが作成されます。もしくは、Kubernetesの最新リリースを[こちら](https://github.com/kubernetes/kubernetes/releases)からダウンロードできます。

次に、kubectlにアクセスするために`PATH`へ適切なバイナリフォルダーを追加します:

```shell
# macOS
export PATH=<path/to/kubernetes-directory>/platforms/darwin/amd64:$PATH

# Linux
export PATH=<path/to/kubernetes-directory>/platforms/linux/amd64:$PATH
```

ツールに関する最新のドキュメントページはこちらです: [kubectl manual](/docs/user-guide/kubectl/)

デフォルトでは、`kubectl`はクラスターの起動中に生成された`kubeconfig`ファイルをAPIに対する認証に使用します。
詳細な情報は、[kubeconfig files](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)を参照してください。

### 例

See [a simple nginx example](/docs/tasks/run-application/run-stateless-application-deployment/) to try out your new cluster.

The "Guestbook" application is another popular example to get started with Kubernetes: [guestbook example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/)

For more complete applications, please look in the [examples directory](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/)

## クラスターのスケーリング

Adding and removing nodes through `kubectl` is not supported. You can still scale the amount of nodes manually through adjustments of the 'Desired' and 'Max' properties within the [Auto Scaling Group](http://docs.aws.amazon.com/autoscaling/latest/userguide/as-manual-scaling.html), which was created during the installation.

## クラスターの解体

Make sure the environment variables you used to provision your cluster are still exported, then call the following script inside the
`kubernetes` directory:

```shell
cluster/kube-down.sh
```

## サポートレベル


IaaS Provider        | Config. Mgmt | OS            | Networking  | Docs                                          | Conforms | Support Level
-------------------- | ------------ | ------------- | ----------  | --------------------------------------------- | ---------| ----------------------------
AWS                  | kops         | Debian        | k8s (VPC)   | [docs](https://github.com/kubernetes/kops)    |          | Community ([@justinsb](https://github.com/justinsb))
AWS                  | CoreOS       | CoreOS        | flannel     | [docs](/docs/getting-started-guides/aws)      |          | Community
AWS                  | Juju         | Ubuntu        | flannel, calico, canal     | [docs](/docs/getting-started-guides/ubuntu)      | 100%     | Commercial, Community
AWS                  | KubeOne         | Ubuntu, CoreOS, CentOS   | canal, weavenet     | [docs](https://github.com/kubermatic/kubeone)      | 100%    | Commercial, Community

## 参考文献

Please see the [Kubernetes docs](/ja/docs/) for more details on administering
and using a Kubernetes cluster.

{{% /capture %}}
