---
title: ノードのセットアップの検証
weight: 30
---


## ノード適合テスト

*ノード適合テスト* は、システムの検証とノードに対する機能テストを提供するコンテナ型のテストフレームワークです。このテストは、ノードがKubernetesの最小要件を満たしているかどうかを検証するもので、テストに合格したノードはKubernetesクラスターに参加する資格があることになります。

## ノードの前提条件

適合テストを実行するにはノードは通常のKubernetesノードと同じ前提条件を満たしている必要があります。 最低でもノードに以下のデーモンがインストールされている必要があります:

* コンテナランタイム (Docker)
* Kubelet

## ノード適合テストの実行

ノード適合テストを実行するには、以下の手順に従います:

1. kubeletの`--kubeconfig`オプションの値を調べます。例:`--kubeconfig=/var/lib/kubelet/config.yaml`。
   このテストフレームワークはKubeletのテスト用にローカルコントロールプレーンを起動するため、APIサーバーのURLとして`http://localhost:8080`を使用します。
   他にも使用できるkubeletコマンドラインパラメーターがいくつかあります:

   * `--cloud-provider`: `--cloud-provider=gce`を指定している場合は、テストを実行する前にこのフラグを取り除いてください。

2. 以下のコマンドでノード適合テストを実行します:

```shell
# $CONFIG_DIRはKubeletのPodのマニフェストパスです。
# $LOG_DIRはテスト出力のパスです。
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  registry.k8s.io/node-test:0.2
```

## 他アーキテクチャ向けのノード適合テストの実行

Kubernetesは他のアーキテクチャ用のノード適合テストのdockerイメージを提供しています:

  Arch  |       Image       |
--------|:-----------------:|
 amd64  |  node-test-amd64  |
  arm   |    node-test-arm  |
 arm64  |  node-test-arm64  |

## 選択したテストの実行

特定のテストを実行するには、環境変数`FOCUS`を実行したいテストの正規表現で上書きします。

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # MirrorPodテストのみを実行します
  registry.k8s.io/node-test:0.2
```

特定のテストをスキップするには、環境変数`SKIP`をスキップしたいテストの正規表現で上書きします。

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # MirrorPodテスト以外のすべてのノード適合テストを実行します
  registry.k8s.io/node-test:0.2
```

ノード適合テストは、[node e2e test](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md)のコンテナ化されたバージョンです。
デフォルトでは、すべての適合テストが実行されます。

理論的には、コンテナを構成し必要なボリュームを適切にマウントすれば、どのノードのe2eテストも実行できます。しかし、不適合テストを実行するためにはより複雑な設定が必要となるため、**適合テストのみを実行することを強く推奨します**。

## 注意事項

* このテストでは、ノード適合テストイメージや機能テストで使用されるコンテナのイメージなど、いくつかのdockerイメージがノード上に残ります。
* このテストでは、ノード上にデッドコンテナが残ります。これらのコンテナは機能テスト中に作成されます。
