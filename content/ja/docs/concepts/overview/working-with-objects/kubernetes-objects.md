---
title: Kubernetesオブジェクトを理解する
content_type: concept
weight: 10
card:
  name: concepts
  weight: 40
---

<!-- overview -->
このページでは、KubernetesオブジェクトがKubernetes APIでどのように表現されているか、またそれらを`.yaml`フォーマットでどのように表現するかを説明します。


<!-- body -->
## Kubernetesオブジェクトを理解する {#kubernetes-objects}

*Kubernetesオブジェクト* は、Kubernetes上で永続的なエンティティです。Kubernetesはこれらのエンティティを使い、クラスターの状態を表現します。具体的に言うと、下記のような内容が表現できます:

* どのようなコンテナ化されたアプリケーションが稼働しているか(またそれらはどのノード上で動いているか)
* それらのアプリケーションから利用可能なリソース
* アプリケーションがどのように振る舞うかのポリシー、例えば再起動、アップグレード、耐障害性ポリシーなど

Kubernetesオブジェクトは「意図の記録」です。一度オブジェクトを作成すると、Kubernetesは常にそのオブジェクトが存在し続けるように動きます。オブジェクトを作成することで、Kubernetesに対し効果的にあなたのクラスターのワークロードがこのようになっていて欲しいと伝えているのです。これが、あなたのクラスターの**望ましい状態**です。

Kubernetesオブジェクトを操作するには、作成、変更、または削除に関わらず[Kubernetes API](/ja/docs/concepts/overview/kubernetes-api/)を使う必要があるでしょう。例えば`kubectl`コマンドラインインターフェースを使った場合、このCLIが処理に必要なKubernetes API命令を、あなたに代わり発行します。あなたのプログラムから[クライアントライブラリ](/docs/reference/using-api/client-libraries/)を利用し、直接Kubernetes APIを利用することも可能です。

### オブジェクトのspec(仕様)とstatus(状態)

ほとんどのKubernetesオブジェクトは、オブジェクトの設定を管理する２つの入れ子になったオブジェクトのフィールドを持っています。それはオブジェクト *`spec`* とオブジェクト *`status`* です。`spec`を持っているオブジェクトに関しては、オブジェクト作成時に`spec`を設定する必要があり、望ましい状態としてオブジェクトに持たせたい特徴を記述する必要があります。

`status` オブジェクトはオブジェクトの *現在の状態* を示し、その情報はKubernetesシステムとそのコンポーネントにより提供、更新されます。Kubernetes{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}は、あなたから指定された望ましい状態と現在の状態が一致するよう常にかつ積極的に管理をします。

例えば、KubernetesのDeploymentはクラスター上で稼働するアプリケーションを表現するオブジェクトです。Deploymentを作成するとき、アプリケーションの複製を３つ稼働させるようDeploymentのspecで指定するかもしれません。KubernetesはDeploymentのspecを読み取り、指定されたアプリケーションを３つ起動し、現在の状態がspecに一致するようにします。もしこれらのインスタンスでどれかが落ちた場合(statusが変わる)、Kubernetesはspecと、statusの違いに反応し、修正しようとします。この場合は、落ちたインスタンスの代わりのインスタンスを立ち上げます。

spec、status、metadataに関するさらなる情報は、[Kubernetes API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md)をご確認ください。

### Kubernetesオブジェクトを記述する

Kubernetesでオブジェクトを作成する場合、オブジェクトの基本的な情報(例えば名前)と共に、望ましい状態を記述したオブジェクトのspecを渡さなければいけません。KubernetesAPIを利用しオブジェクトを作成する場合(直接APIを呼ぶか、`kubectl`を利用するかに関わらず)、APIリクエストはそれらの情報をJSON形式でリクエストのBody部に含んでいなければなりません。

ここで、KubernetesのDeploymentに必要なフィールドとオブジェクトのspecを記載した`.yaml`ファイルの例を示します:

{{< codenew file="application/deployment.yaml" >}}

上に示した`.yaml`ファイルを利用してDeploymentを作成するには、`kubectl`コマンドラインインターフェースに含まれている[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply)コマンドに`.yaml`ファイルを引数に指定し、実行します。ここで例を示します:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml --record
```

出力結果は、下記に似た形になります:

```
deployment.apps/nginx-deployment created
```

### 必須フィールド

Kubernetesオブジェクトを`.yaml`ファイルに記載して作成する場合、下記に示すフィールドに値をセットしておく必要があります:

* `apiVersion` - どのバージョンのKubernetesAPIを利用してオブジェクトを作成するか
* `kind` - どの種類のオブジェクトを作成するか
* `metadata` - オブジェクトを一意に特定するための情報、文字列の`name`、`UID`、また任意の`namespace`が該当する
* `spec` - オブジェクトの望ましい状態

`spec`の正確なフォーマットは、Kubernetesオブジェクトごとに異なり、オブジェクトごとに特有な入れ子のフィールドを持っています。[Kubernetes API リファレンス](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)が、Kubernetesで作成できる全てのオブジェクトに関するspecのフォーマットを探すのに役立ちます。
例えば、`Pod`オブジェクトに関する`spec`のフォーマットは[PodSpec v1 core](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)を、また`Deployment`オブジェクトに関する`spec`のフォーマットは[DeploymentSpec v1 apps](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deploymentspec-v1-apps)をご確認ください。



## {{% heading "whatsnext" %}}



* [Kubernetes API overview](/docs/reference/using-api/api-overview/)はこのページでは取り上げていない他のAPIについて説明します。
* 最も重要、かつ基本的なKubernetesオブジェクト群を学びましょう、例えば、[Pod](/ja/docs/concepts/workloads/pods/)です。
* Kubernetesの[コントローラー](/docs/concepts/architecture/controller/)を学びましょう。


