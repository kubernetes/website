---
title: 高可用性トポロジーのためのオプション
content_type: concept
weight: 50
---

<!-- overview -->

このページでは、高可用性(HA)Kubernetesクラスターのトポロジーを設定するための2つのオプションについて説明します。

HAクラスターは次の方法で設定できます。

- 積層コントロールプレーンノードを使用する方法。こちらの場合、etcdノードはコントロールプレーンノードと同じ場所で動作します。
- 外部のetcdノードを使用する方法。こちらの場合、etcdがコントロールプレーンとは分離されたノードで動作します。

HAクラスターをセットアップする前に、各トポロジーの利点と欠点について注意深く考慮する必要があります。

{{< note >}}
kubeadmは、etcdクラスターを静的に起動します。
詳細については、etcd[クラスタリングガイド](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static)をご覧ください。
{{< /note >}}

<!-- body -->

## 積層etcdトポロジー

積層HAクラスターは、コントロールプレーンのコンポーネントを実行する、kubeadmで管理されたノードで構成されるクラスターの上に、etcdにより提供される分散データストレージクラスターがあるような[トポロジー](https://en.wikipedia.org/wiki/Network_topology)です。

各コントロールプレーンノードは、`kube-apiserver`、`kube-scheduler`、および`kube-controller-manager`を実行します。`kube-apiserver` はロードバランサーを用いてワーカーノードに公開されます。

各コントロールプレーンノードはローカルのetcdメンバーを作り、このetcdメンバーはそのノードの`kube-apiserver`とだけ通信します。ローカルの`kube-controller-manager`と`kube-scheduler`のインスタンスも同様です。

このトポロジーは、同じノード上のコントロールプレーンとetcdのメンバーを結合します。外部のetcdノードを使用するクラスターよりはセットアップがシンプルで、レプリケーションの管理もシンプルです。

しかし、積層クラスターには、結合による故障のリスクがあります。1つのノードがダウンすると、etcdメンバーとコントロールプレーンのインスタンスの両方が失われ、冗長性が損なわれます。より多くのコントロールプレーンノードを追加することで、このリスクは緩和できます。

そのため、HAクラスターのためには、最低でも3台の積層コントロールプレーンノードを実行しなければなりません。

これがkubeadmのデフォルトのトポロジーです。`kubeadm init`や`kubeadm join --control-place`を実行すると、ローカルのetcdメンバーがコントロールプレーンノード上に自動的に作成されます。

![積層etcdトポロジー](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)

## 外部のetcdトポロジー

外部のetcdを持つHAクラスターは、コントロールプレーンコンポーネントを実行するノードで構成されるクラスターの外部に、etcdにより提供される分散データストレージクラスターがあるような[トポロジー](https://en.wikipedia.org/wiki/Network_topology)です。

積層etcdトポロジーと同様に、外部のetcdトポロジーにおける各コントロールプレーンノードは、`kube-apiserver`、`kube-scheduler`、および`kube-controller-manager`のインスタンスを実行します。そして、`kube-apiserver`は、ロードバランサーを使用してワーカーノードに公開されます。しかし、etcdメンバーは異なるホスト上で動作しており、各etcdホストは各コントロールプレーンノードの`kube-api-server`と通信します。

このトポロジーは、コントロールプレーンとetcdメンバーを疎結合にします。そのため、コントロールプレーンインスタンスまたはetcdメンバーを失うことによる影響は少なく、積層HAトポロジーほどクラスターの冗長性に影響しないHAセットアップが実現します。

しかし、このトポロジーでは積層HAトポロジーの2倍の数のホストを必要とします。このトポロジーのHAクラスターのためには、最低でもコントロールプレーンのために3台のホストが、etcdノードのために3台のホストがそれぞれ必要です。

![外部のetcdトポロジー](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)



## {{% heading "whatsnext" %}}


- [kubeadmを使用した高可用性クラスターの作成](/ja/docs/setup/production-environment/tools/kubeadm/high-availability/)


