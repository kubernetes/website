---
title: Deploymentを作成するためにkubectlを使う
weight: 10
---

## {{% heading "目的" %}}

* アプリケーションのデプロイについて学ぶ。
* kubectlを使って、Kubernetes上にはじめてのアプリケーションをデプロイする。

## KubernetesのDeployments

{{% alert %}}
_Deploymentは、アプリケーションのインスタンスを作成および更新する責務があります。_
{{% /alert %}}

{{< note >}}
このチュートリアルでは、AMD64アーキテクチャを必要とするコンテナを使用します。異なるCPUアーキテクチャのコンピュータでminikubeを使用する場合は、AMD64をエミュレートできるドライバでminikubeを使用してみてください。例えば、Docker Desktopドライバはこれが可能です。
{{< /note >}}

[実行中のKubernetesクラスター](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/)を入手すると、その上にコンテナ化アプリケーションをデプロイすることができます。そのためには、Kubernetesの**Deployment**の設定を作成します。DeploymentはKubernetesにあなたのアプリケーションのインスタンスを作成し、更新する方法を指示します。Deploymentを作成すると、KubernetesコントロールプレーンはDeployment内に含まれるアプリケーションインスタンスをクラスター内の個々のノードで実行するようにスケジュールします。

アプリケーションインスタンスが作成されると、Kubernetes Deploymentコントローラーは、それらのインスタンスを継続的に監視します。インスタンスをホストしているノードが停止、削除された場合、Deploymentコントローラーはそのインスタンスをクラスター内の別のノード上のインスタンスと置き換えます。**これは、マシンの故障やメンテナンスに対処するためのセルフヒーリングの仕組みを提供しています。**

オーケストレーションが登場する前の世界では、インストールスクリプトを使用してアプリケーションを起動することはよくありましたが、マシン障害が発生した場合に復旧する事はできませんでした。アプリケーションのインスタンスを作成し、それらをノード間で実行し続けることで、Kubernetes Deploymentsはアプリケーションの管理に根本的に異なるアプローチを提供します。

## Kubernetes上にはじめてのアプリケーションをデプロイする

{{% alert %}}
_Kubernetesにデプロイするには、アプリケーションをサポートされているコンテナ形式のいずれかにパッケージ化する必要があります。_
{{% /alert %}}

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_02_first_app.svg" class="diagram-medium" >}}

Kubernetesのコマンドラインインターフェースである[kubectl](/docs/reference/kubectl/)を使用して、Deploymentを作成、管理できます。`kubectl`はKubernetes APIを使用してクラスターと対話します。このモジュールでは、Kubernetesクラスターでアプリケーションを実行するDeploymentを作成するために必要な、最も一般的な`kubectl`コマンドについて学びます。

Deploymentを作成するときは、アプリケーションのコンテナイメージと実行するレプリカの数を指定する必要があります。Deploymentを更新することで、あとでその情報を変更できます。ブートキャンプの[Module 5](/docs/tutorials/kubernetes-basics/scale/scale-intro/)と[Module 6](/docs/tutorials/kubernetes-basics/update/update-intro/)では、Deploymentをどのようにスケール、更新できるかについて説明します。

最初のDeploymentには、NGINXを使用して全てのリクエストをエコーバックする、Dockerコンテナにパッケージされたhello-nodeアプリケーションを使用します。(まだhello-nodeアプリケーションを作成して、コンテナを使用してデプロイしていない場合、[Hello Minikube tutorial](/ja/docs/tutorials/hello-minikube/)の通りにやってみましょう。)

kubectlもインストールされている必要があります。インストールが必要な場合は、[ツールのインストール](/docs/tasks/tools/#kubectl)からインストールしてください。

Deploymentが何であるかがわかったので、最初のアプリケーションをデプロイしましょう！

### kubectlの基本

kubectlコマンドの一般的な書式は`kubectl action resource`です。

これは指定された_resource_（`node`, `deployment`など）に対して指定された_action_（`create`, `describe`, `delete`など）を実行します。指定可能なパラメータに関する追加情報を取得するために、サブコマンドの後に`--help`を使うこともできます（例:`kubectl get nodes --help`）。

`kubectl version`コマンドを実行して、kubectl がクラスタと通信できるように設定されていることを確認してください。

kubectlがインストールされていて、クライアントとサーバーの両方のバージョンを確認できることを確認してください。

クラスタ内のノードを表示するには、`kubectl get nodes`コマンドを実行します。

利用可能なノードが表示されます。後で、KubernetesはNodeの利用可能なリソースに基づいてアプリケーションをデプロイする場所を選択します。

### アプリケーションをデプロイする

最初のアプリケーションを`kubectl create deployment`コマンドでKubernetesにデプロイしてみましょう。デプロイ名とアプリケーションイメージの場所を指定する必要があります（Docker Hub外でホストされているイメージはリポジトリの完全なURLを含める必要があります）。

```shell
kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
```

素晴らしい！deploymentを作成して、最初のアプリケーションをデプロイしました。これによっていくつかのことが実行されました。

* アプリケーションのインスタンスを実行可能な適切なノードを探しました（利用可能なノードは１つしかない）。
* アプリケーションをそのノードで実行するためのスケジュールを行いました。
* 必要な場合にインスタンスを新しいノードで再スケジュールするような設定を行いました。

deploymentの一覧を得るには`kubectl get deployments`コマンドを使います。

```shell
kubectl get deployments
```

アプリケーションの単一のインスタンスを実行しているdeploymentが１つあることが分かります。インスタンスはノード上のコンテナ内で実行されています。

### アプリケーションを見る

Kubernetes内部で動作している[Pod](/docs/concepts/workloads/pods/)は、プライベートに隔離されたネットワーク上で動作しています。デフォルトでは、同じKubernetesクラスタ内の他のPodやServiceからは見えますが、そのネットワークの外からは見えません。`kubectl`を使用する場合、アプリケーションと通信するためにAPIエンドポイントを通じてやりとりしています。

アプリケーションをKubernetesクラスタの外部に公開するための他のオプションについては、後ほど[Module 4](/docs/tutorials/kubernetes-basics/expose/)で説明します。また、これは基本的なチュートリアルであるため、ここでは`Pods`とは何かについては詳しく説明しません。

`kubectl proxy`コマンドによって、通信をクラスタ全体のプライベートネットワークに転送するプロキシを作成することができます。プロキシはcontrol-Cキーを押すことで終了させることができ、実行中は何も出力されません。

**プロキシを実行するにはもう一つターミナルウィンドウを開く必要があります。**

```shell
kubectl proxy
```

ホスト（端末）とKubernetesクラスタ間の接続ができました。プロキシによって端末からAPIへの直接アクセスが可能となります。 

プロキシエンドポイントを通してホストされている全てのAPIを確認することができます。例えば、`curl`コマンドを使って、APIを通じて直接バージョンを調べることができます：

```shell
curl http://localhost:8001/version
```

{{< note >}}
ポート8001にアクセスできない場合は、上で起動した`kube proxy`がもう一つのターミナルで実行されていることを確認してください。
{{< /note >}}

APIサーバーはPod名に基づいて各Pod用のエンドポイントを自動的に作成し、プロキシからもアクセスできるようにします。

まずPod名を取得する必要があるので、環境変数`POD_NAME`に格納しておきます。

```shell
export POD_NAME=$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')
echo Name of the Pod: $POD_NAME
```

以下を実行することで、プロキシされたAPIを通してPodにアクセスすることができます。

```shell
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME:8080/proxy/
```

プロキシを使わずに新しいdeploymentにアクセスするには、[Module 4](/docs/tutorials/kubernetes-basics/expose/)で説明するServiceが必要となります。

## {{% heading "次のページ" %}}

* チュートリアル [Podとノードについて](/docs/tutorials/kubernetes-basics/explore/explore-intro/)
* [Deployments](/docs/concepts/workloads/controllers/deployment/)について詳しく学ぶ