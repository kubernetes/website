---
title: Web UI (Dashboard)
content_type: concept
weight: 10
card:
  name: tasks
  weight: 30
  title: Web UIダッシュボードを使用する
---

<!-- overview -->

ダッシュボードは、WebベースのKubernetesユーザーインターフェースです。
ダッシュボードを使用して、コンテナ化されたアプリケーションをKubernetesクラスターにデプロイしたり、
コンテナ化されたアプリケーションをトラブルシューティングしたり、クラスターリソースを管理したりすることができます。
ダッシュボードを使用して、クラスター上で実行されているアプリケーションの概要を把握したり、
個々のKubernetesリソース(Deployments、Jobs、DaemonSetsなど)を作成または修正したりすることができます。
たとえば、Deploymentのスケール、ローリングアップデートの開始、Podの再起動、
デプロイウィザードを使用した新しいアプリケーションのデプロイなどが可能です。

ダッシュボードでは、クラスター内のKubernetesリソースの状態や、発生した可能性のあるエラーに関する情報も提供されます。

![Kubernetes Dashboard UI](/images/docs/ui-dashboard.png)



<!-- body -->

## ダッシュボードUIのデプロイ

ダッシュボードUIはデフォルトではデプロイされていません。デプロイするには、以下のコマンドを実行します:

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0/aio/deploy/recommended.yaml
```

## ダッシュボードUIへのアクセス


クラスターデータを保護するために、ダッシュボードはデフォルトで最小限のRBAC構成でデプロイします。
現在、ダッシュボードはBearer Tokenによるログインのみをサポートしています。
このデモ用のトークンを作成するには、
[サンプルユーザーの作成](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md)ガイドに従ってください。

{{< warning >}}
チュートリアルで作成されたサンプルユーザーには管理者権限が与えられ、教育目的のみに使用されます。
{{< /warning >}}

### コマンドラインプロキシ
以下のコマンドを実行することで、kubectlコマンドラインツールを使ってダッシュボードにアクセスすることができます:

```
kubectl proxy
```

kubectlは、ダッシュボードを http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/ で利用できるようにします。

UIはコマンドを実行しているマシンから _のみ_ アクセスできます。オプションについては`kubectl proxy --help`を参照してください。

{{< note >}}
Kubeconfigの認証方法は、外部IDプロバイダーやx509証明書ベースの認証には対応していません。
{{< /note >}}

## ウェルカムビュー

空のクラスターでダッシュボードにアクセスすると、ウェルカムページが表示されます。
このページには、このドキュメントへのリンクと、最初のアプリケーションをデプロイするためのボタンが含まれています。
さらに、クラスターの`kube-system`[名前空間](/docs/tasks/administer-cluster/namespaces/)でデフォルトで実行されているシステムアプリケーション、たとえばダッシュボード自体を見ることができます。

![Kubernetes Dashboard welcome page](/images/docs/ui-dashboard-zerostate.png)

## コンテナ化されたアプリケーションのデプロイ

ダッシュボードを使用すると、簡単なウィザードでコンテナ化されたアプリケーションをDeploymentとオプションのServiceとして作成してデプロイすることができます。
アプリケーションの詳細を手動で指定するか、アプリケーションの設定を含むYAMLまたはJSONファイルをアップロードすることができます。

任意のページの右上にある**CREATE**ボタンをクリックして開始します。

### アプリケーションの詳細の指定

デプロイウィザードでは、以下の情報を入力する必要があります:

- **App name** (必須): アプリケーションの名前です。
  その名前の[label](/ja/docs/concepts/overview/working-with-objects/labels/)は、デプロイされるDeploymentとServiceに追加されます。

  アプリケーション名は、選択したKubernetes[名前空間](/docs/tasks/administer-cluster/namespaces/)内で一意である必要があります。
  小文字で始まり、小文字または数字で終わり、小文字、数字、ダッシュ(-)のみを含む必要があります。文字数は24文字に制限されています。先頭と末尾のスペースは無視されます。

- **Container image** (必須): 任意のレジストリ上の公開Docker[コンテナイメージ](/docs/concepts/containers/images/)、またはプライベートイメージ(一般的にはGoogle Container RegistryやDocker Hub上でホストされている)のURLです。
  コンテナイメージの指定はコロンで終わらせる必要があります。

  クラスター全体で必要な数のPodを維持するために、[Deployment](/ja/docs/concepts/workloads/controllers/deployment/)が作成されます。

- **Service** (任意): アプリケーションのいくつかの部分(たとえばフロントエンド)では、
  [Service](/ja/docs/concepts/services-networking/service/)をクラスター外の外部、おそらくパブリックIPアドレス(外部サービス)に公開したいと思うかもしれません。
  
  {{< note >}}
  外部サービスの場合は、そのために1つ以上のポートを開放する必要があるでしょう。
  {{< /note >}}

  クラスター内部からしか見えないその他のサービスは、内部サービスと呼ばれます。

  サービスの種類にかかわらず、サービスを作成し、コンテナがポート(受信)をリッスンする場合は、
  2つのポートを指定する必要があります。
  サービスは、ポート(受信)をコンテナから見たターゲットポートにマッピングして作成されます。
  このサービスは、デプロイされたPodにルーティングされます。サポートされるプロトコルはTCPとUDPです。
  このサービスの内部DNS名は、上記のアプリケーション名として指定した値になります。

必要に応じて、**高度なオプション**セクションを展開して、より多くの設定を指定することができます:

- **Description**: ここで入力したテキストは、
  [アノテーション](/ja/docs/concepts/overview/working-with-objects/annotations/)としてDeploymentに追加され、アプリケーションの詳細に表示されます。

- **Labels**: アプリケーションに使用するデフォルトの[ラベル](/ja/docs/concepts/overview/working-with-objects/labels/)は、アプリケーション名とバージョンです。
  リリース、環境、ティア、パーティション、リリーストラックなど、Deployment、Service(存在する場合)、Podに適用する追加のラベルを指定できます。

  例:

   ```conf
   release=1.0
   tier=frontend
   environment=pod
   track=stable
   ```

- **Namespace**: Kubernetesは、同じ物理クラスターを基盤とする複数の仮想クラスターをサポートしています。
  これらの仮想クラスターは[名前空間](/docs/tasks/administer-cluster/namespaces/) と呼ばれます。
  これにより、リソースを論理的に名前のついたグループに分割することができます。

  ダッシュボードでは、利用可能なすべての名前空間がドロップダウンリストに表示され、新しい名前空間を作成することができます。
  名前空間名には、最大63文字の英数字とダッシュ(-)を含めることができますが、大文字を含めることはできません。
  名前空間名は数字だけで構成されるべきではありません。
  名前が10などの数値として設定されている場合、Podはデフォルトの名前空間に配置されます。

  名前空間の作成に成功した場合は、デフォルトで選択されます。
  作成に失敗した場合は、最初の名前空間が選択されます。

- **Image Pull Secret**:
  指定されたDockerコンテナイメージが非公開の場合、
  [pull secret](/ja/docs/concepts/configuration/secret/)の認証情報が必要になる場合があります。

  ダッシュボードでは、利用可能なすべてのSecretがドロップダウンリストに表示され、新しいSecretを作成できます。
  Secret名は DNSドメイン名の構文に従う必要があります。たとえば、`new.image-pull.secret`です。
  Secretの内容はbase64エンコードされ、[`.dockercfg`](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)ファイルで指定されている必要があります。
  Secret名は最大253文字で構成されます。

  イメージプルシークレットの作成に成功した場合は、デフォルトで選択されています。作成に失敗した場合は、シークレットは適用されません。

- **CPU requirement (cores)**と**Memory requirement (MiB)**:
  コンテナの最小[リソース制限](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)を指定することができます。デフォルトでは、PodはCPUとメモリの制限がない状態で実行されます。

- **Run command**と**Run command arguments**:
  デフォルトでは、コンテナは指定されたDockerイメージのデフォルトの[entrypointコマンド](/docs/tasks/inject-data-application/define-command-argument-container/)を実行します。
  コマンドのオプションと引数を使ってデフォルトを上書きすることができます。

- **Run as privileged**: この設定は、[特権コンテナ](/ja/docs/concepts/workloads/pods/pod/#privileged-mode-for-pod-containers)内のプロセスが、ホスト上でrootとして実行されているプロセスと同等であるかどうかを決定します。特権コンテナは、
  ネットワークスタックの操作やデバイスへのアクセスなどの機能を利用できます。

- **Environment variables**: Kubernetesは[環境変数](/ja/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)を介してServiceを公開しています。
  環境変数を作成したり、環境変数の値を使ってコマンドに引数を渡したりすることができます。
  環境変数の値はServiceを見つけるためにアプリケーションで利用できます。
  値は`$(VAR_NAME)`構文を使用して他の変数を参照できます。

### YAMLまたはJSONファイルのアップロード

Kubernetesは宣言的な設定をサポートしています。
このスタイルでは、すべての設定は Kubernetes [API](/ja/docs/concepts/overview/kubernetes-api/)リソーススキーマを使用してYAMLまたは JSON設定ファイルに格納されます。

デプロイウィザードでアプリケーションの詳細を指定する代わりに、
YAMLまたはJSONファイルでアプリケーションを定義し、ダッシュボードを使用してファイルをアップロードできます。

## ダッシュボードの使用
以下のセクションでは、Kubernetes Dashboard UIのビュー、それらが提供するものとその使用方法について説明します。

### ナビゲーション

クラスターにKubernetesオブジェクトが定義されている場合、ダッシュボードではそれらのオブジェクトが初期表示されます。
デフォルトでは _default_ 名前空間のオブジェクトのみが表示されますが、これはナビゲーションメニューにある名前空間セレクターで変更できます。

ダッシュボードにはほとんどのKubernetesオブジェクトの種類が表示され、いくつかのメニューカテゴリーにグループ化されています。

#### 管理者の概要
クラスターと名前空間の管理者向けに、ダッシュボードにはノード、名前空間、永続ボリュームが一覧表示され、それらの詳細ビューが用意されています。
ノードリストビューには、すべてのノードにわたって集計されたCPUとメモリーのメトリクスが表示されます。
詳細ビューには、ノードのメトリクス、仕様、ステータス、割り当てられたリソース、イベント、ノード上で実行されているPodが表示されます。

#### ワークロード

選択した名前空間で実行されているすべてのアプリケーションを表示します。
このビューでは、アプリケーションがワークロードの種類(例：Deployment、ReplicaSet、StatefulSetなど)ごとに一覧表示され、各ワークロードの種類を個別に表示することができます。
リストには、ReplicaSetの準備ができたPodの数やPodの現在のメモリ使用量など、ワークロードに関する実用的な情報がまとめられています。

ワークロードの詳細ビューには、ステータスや仕様情報、オブジェクト間の表面関係が表示されます。
たとえば、ReplicaSetが制御しているPodや、新しいReplicaSet、DeploymentのためのHorizontal Pod Autoscalerなどです。

#### Service
外部の世界にサービスを公開し、クラスター内でサービスを発見できるようにするKubernetesリソースを表示します。
そのため、ServiceとIngressのビューには、それらが対象とするPod、クラスター接続の内部エンドポイント、外部ユーザーの外部エンドポイントが表示されます。

#### ストレージ

ストレージビューには、アプリケーションがデータを保存するために使用するPersistentVolumeClaimリソースが表示されます。

#### ConfigMapとSecret

クラスターで実行されているアプリケーションのライブ設定に使用されているすべてのKubernetesリソースを表示します。
このビューでは、設定オブジェクトの編集と管理が可能で、デフォルトで非表示になっているSecretを表示します。

#### ログビューアー

Podのリストと詳細ページは、ダッシュボードに組み込まれたログビューアーにリンクしています。
このビューアーでは、単一のPodに属するコンテナからログをドリルダウンすることができます。

![Logs viewer](/images/docs/ui-dashboard-logs-view.png)


## {{% heading "whatsnext" %}}

詳細については[Kubernetes Dashboardプロジェクトページ](https://github.com/kubernetes/dashboard)をご覧ください。
