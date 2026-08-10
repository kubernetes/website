---
title: Ciliumを利用したネットワークポリシーの設定
content_type: task
weight: 30
---

<!-- overview -->
このページでは、Ciliumを利用してネットワークポリシーを設定する方法について説明します。
Ciliumについての詳細は、[Introduction to Cilium](https://docs.cilium.io/en/stable/overview/intro)を参照してください。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## ベーシックなテストのためにMinikubeにCiliumをデプロイする {#deploying-cilium-on-minikube-for-basic-testing}

Ciliumを手軽に試したい場合は、[Cilium Kubernetes Getting Started Guide](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/)に従って、minikube上にCiliumをDaemonSetとして基本構成でインストールできます。

バージョンv1.5.2以上が必要なminikubeを起動するには、次の引数を指定して実行します。

```shell
minikube version
```

```
minikube version: v1.5.2
```

```shell
minikube start --network-plugin=cni
```

minikubeでは、CLIツールを使用してCiliumをインストールできます。
そのためには、まず次のコマンドで最新版のCLIをダウンロードします。

```shell
curl -LO https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-amd64.tar.gz
```

次に、次のコマンドでダウンロードしたファイルを`/usr/local/bin`ディレクトリに展開します。

```shell
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz
```

上記のコマンドを実行した後、次のコマンドでCiliumをインストールできます。

```shell
cilium install
```

Ciliumはクラスターの構成を自動的に検出し、インストールを成功させるために必要な適切なコンポーネントを作成・インストールします。
コンポーネントは次のとおりです。

- Secret `cilium-ca`内の認証局(CA)と、Hubble(Ciliumのオブザーバビリティレイヤー)用の証明書。
- サービスアカウント。
- クラスターロール。
- ConfigMap。
- エージェントのDaemonSetとOperatorのDeployment。

インストール後、`cilium status`コマンドでCiliumデプロイメントの全体的なステータスを確認できます。
`status`コマンドの想定される出力は[こちら](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/#validate-the-installation)を参照してください。

Getting Started Guideの残りの部分では、サンプルアプリケーションを使用して、L3/L4(すなわちIPアドレス+ポート)のセキュリティポリシーと、L7(例えばHTTP)のセキュリティポリシーの両方を適用する方法について説明しています。

## 本番環境向けにCiliumをデプロイする {#deploying-cilium-for-production-use}

本番環境にCiliumをデプロイする際の詳細な手順については、[Cilium Kubernetes Installation Guide](https://docs.cilium.io/en/stable/network/kubernetes/concepts/)を参照してください。
[Cilium Kubernetes Installation Guide](https://docs.cilium.io/en/stable/network/kubernetes/concepts/)
このドキュメントには、詳細な要件、手順、および本番環境向けのDaemonSetファイルの例が含まれています。

<!-- discussion -->

## Ciliumのコンポーネントを理解する {#understanding-cilium-components}

Ciliumを使用してクラスターをデプロイすると、`kube-system` Namespaceに複数のPodが追加されます。
このPodの一覧を確認するには、次を実行します。

```shell
kubectl get pods --namespace=kube-system -l k8s-app=cilium
```

次のように、Podの一覧が表示されます。

```console
NAME           READY   STATUS    RESTARTS   AGE
cilium-kkdhz   1/1     Running   0          3m23s
...
```

`cilium` Podはクラスター内の各ノードで実行され、Linux BPFを使用してそのノード上のPodとの間のトラフィックに対してネットワークポリシーを適用します。

## {{% heading "whatsnext" %}}

クラスターが実行されたら、[ネットワークポリシーを宣言する](/docs/tasks/administer-cluster/declare-network-policy/)に従って、CiliumでKubernetesのNetworkPolicyを試すことができます。
ぜひお楽しみください。
ご質問があれば、[Cilium Slackチャンネル](https://slack.cilium.io/)までお問い合わせください。
