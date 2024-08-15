---
title: ノードとコントロールプレーン間の通信
content_type: concept
weight: 20
aliases:
- master-node-communication
---

<!-- overview -->

本ドキュメントは、{{< glossary_tooltip term_id="kube-apiserver" text="APIサーバー" >}}とKubernetes{{< glossary_tooltip text="クラスター" term_id="cluster" length="all" >}}間の通信経路をまとめたものです。
その目的は、信頼できないネットワーク上(またはクラウドプロバイダー上の完全なパブリックIP)でクラスターが実行できるよう、ユーザーがインストールをカスタマイズしてネットワーク構成を強固にできるようにすることです。

<!-- body -->

## ノードからコントロールプレーンへの通信 {#node-to-control-plane}

Kubernetesには「ハブアンドスポーク」というAPIパターンがあります。ノード(またはノードが実行するPod)からのすべてのAPIの使用は、APIサーバーで終了します。他のコントロールプレーンコンポーネントは、どれもリモートサービスを公開するようには設計されていません。APIサーバーは、1つ以上の形式のクライアント[認証](/ja/docs/reference/access-authn-authz/authentication/)が有効になっている状態で、セキュアなHTTPSポート(通常は443)でリモート接続をリッスンするように設定されています。
特に[匿名リクエスト](/ja/docs/reference/access-authn-authz/authentication/#anonymous-requests)や[サービスアカウントトークン](/ja/docs/reference/access-authn-authz/authentication/#service-account-token)が許可されている場合は、1つ以上の[認可](/docs/reference/access-authn-authz/authorization/)形式を有効にする必要があります。

ノードは、有効なクライアント認証情報とともに、APIサーバーに安全に接続できるように、クラスターのパブリックルート{{< glossary_tooltip text="証明書" term_id="certificate" >}}でプロビジョニングされる必要があります。適切なやり方は、kubeletに提供されるクライアント認証情報が、クライアント証明書の形式であることです。kubeletクライアント証明書の自動プロビジョニングについては、[kubelet TLSブートストラップ](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)を参照してください。

APIサーバーに接続したい{{< glossary_tooltip text="Pod" term_id="pod" >}}は、サービスアカウントを利用することで、安全に接続することができます。これにより、Podのインスタンス化時に、Kubernetesはパブリックルート証明書と有効なBearerトークンを自動的にPodに挿入します。
`kubernetes`サービス(`デフォルト`の名前空間)は、APIサーバー上のHTTPSエンドポイントに(`{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}`経由で)リダイレクトされる仮想IPアドレスで構成されます。

また、コントロールプレーンのコンポーネントは、セキュアなポートを介してAPIサーバーとも通信します。

その結果、ノードやノード上で動作するPodからコントロールプレーンへの接続は、デフォルトでセキュアであり、信頼されていないネットワークやパブリックネットワークを介して実行することができます。

## コントロールプレーンからノードへの通信 {#control-plane-to-node}

コントロールプレーン(APIサーバー)からノードへの主要な通信経路は2つあります。
1つ目は、APIサーバーからクラスター内の各ノードで実行される{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}プロセスへの通信経路です。
2つ目は、APIサーバーの _プロキシ_ 機能を介した、APIサーバーから任意のノード、Pod、またはサービスへの通信経路です。

### APIサーバーからkubeletへの通信 {#api-server-to-kubelet}

APIサーバーからkubeletへの接続は、以下の目的で使用されます:

* Podのログの取得。
* 実行中のPodへのアタッチ(通常は`kubectl`を使用)。
* kubeletのポート転送機能の提供。

これらの接続は、kubeletのHTTPSエンドポイントで終了します。デフォルトでは、APIサーバーはkubeletのサービング証明書を検証しないため、接続は中間者攻撃の対象となり、信頼されていないネットワークやパブリックネットワークを介して実行するのは**安全ではありません**。

この接続を検証するには、`--kubelet-certificate-authority`フラグを使用して、kubeletのサービング証明書を検証するために使用するルート証明書バンドルを、APIサーバーに提供します。

それができない場合は、信頼できないネットワークやパブリックネットワークを介した接続を回避するため、必要に応じてAPIサーバーとkubeletの間で[SSHトンネル](#ssh-tunnels)を使用します。


最後に、kubelet APIを保護するために、[Kubelet認証/認可](/docs/reference/access-authn-authz/kubelet-authn-authz/)を有効にする必要があります。

### APIサーバーからノード、Pod、サービスへの通信 {#api-server-to-nodes-pods-and-services}

APIサーバーからノード、Pod、またはサービスへの接続は、デフォルトで平文のHTTP接続になるため、認証も暗号化もされません。API URL内のノード、Pod、サービス名に`https:`を付けることで、セキュアなHTTPS接続を介して実行できますが、HTTPSエンドポイントから提供された証明書を検証したり、クライアント認証情報を提供したりすることはありません。そのため、接続の暗号化はされますが、完全性の保証はありません。これらの接続を、信頼されていないネットワークやパブリックネットワークを介して実行するのは、**現在のところ安全ではありません**。

### SSHトンネル {#ssh-tunnels}

Kubernetesは、コントロールプレーンからノードへの通信経路を保護するために、[SSHトンネル](https://www.ssh.com/academy/ssh/tunneling)をサポートしています。この構成では、APIサーバーがクラスター内の各ノードへのSSHトンネルを開始(ポート22でリッスンしているSSHサーバーに接続)し、kubelet、ノード、Pod、またはサービス宛てのすべてのトラフィックをトンネル経由で渡します。
このトンネルにより、ノードが稼働するネットワークの外部にトラフィックが公開されないようになります。

{{< note >}}
SSHトンネルは現在非推奨であるため、自分が何をしているのか理解していないのであれば、使用すべきではありません。この通信経路の代替となるものとして、[Konnectivityサービス](#konnectivity-service)があります。
{{< /note >}}

### Konnectivityサービス {#konnectivity-service}

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

SSHトンネルの代替として、Konnectivityサービスは、コントロールプレーンからクラスターへの通信に、TCPレベルのプロキシを提供します。Konnectivityサービスは、コントロールプレーンネットワークのKonnectivityサーバーと、ノードネットワークのKonnectivityエージェントの、2つの部分で構成されています。
Konnectivityエージェントは、Konnectivityサーバーへの接続を開始し、ネットワーク接続を維持します。
Konnectivityサービスを有効にすると、コントロールプレーンからノードへのトラフィックは、すべてこの接続を経由するようになります。

[Konnectivityサービスのセットアップ](/docs/tasks/extend-kubernetes/setup-konnectivity/)に従って、クラスターにKonnectivityサービスをセットアップしてください。

## {{% heading "whatsnext" %}}

* [Kubernetesコントロールプレーンコンポーネント](/ja/docs/concepts/overview/components/#control-plane-components)について読む。
* [HubsとSpokeモデル](https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html#hubs-spokes-and-other-wheel-metaphors)について学習する。
* [クラスターのセキュリティ](/ja/docs/tasks/administer-cluster/securing-a-cluster/)について学習する。
* [Kubernetes API](/ja/docs/concepts/overview/kubernetes-api/)について学習する。
* [Konnectivityサービスを設定する](/docs/tasks/extend-kubernetes/setup-konnectivity/)
* [Port Forwardingを使用してクラスター内のアプリケーションにアクセスする](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* [Podログを調べます](/ja/docs/tasks/debug/debug-application/debug-running-pod/#examine-pod-logs)と[kubectl port-forwardを使用します](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod)について学習する。