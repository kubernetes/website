---
title: ワークロードの管理
content_type: concept
weight: 40
---

<!-- overview -->

アプリケーションをデプロイし、Serviceを介して公開しました。次に何をすべきでしょうか？
Kubernetesには、スケーリングや更新など、アプリケーションのデプロイメントを管理するためのいくつかのツールが用意されています。

<!-- body -->

## リソース構成の整理

多くのアプリケーションでは、Serviceに加えてDeploymentなどの複数のリソースを作成する必要があります。複数のリソースを管理しやすくするために、同じファイル内にまとめて記述することができます(YAMLでは`---`で区切ります)。例えば、以下のように定義します。

{{% code_sample file="application/nginx-app.yaml" %}}

複数のリソースは、単一のリソースと同じ方法で作成できます。

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```none
service/my-nginx-svc created
deployment.apps/my-nginx created
```

リソースはマニフェスト内に記述された順番で作成されます。したがって、Serviceを先に指定するのが望ましいです。これにより、DeploymentなどのコントローラーによってPodが作成される際に、スケジューラーがServiceに関連付けられたPodを適切に分散できるようになります。

また、`kubectl apply`は複数の`-f`引数を受け付けます。

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml \
  -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

同じマイクロサービスやアプリケーションの階層に関連するリソースは、同じファイルにまとめることが推奨されます。また、アプリケーションに関連するすべてのファイルを同じディレクトリに整理することで、管理しやすくなります。アプリケーションの各階層がDNSを使用して相互に接続される場合、スタックのすべてのコンポーネントをまとめてデプロイできます。

さらに、設定ソースとしてURLを指定することも可能です。これにより、ソース管理システム内のマニフェストから直接デプロイする際に便利です。

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

```none
deployment.apps/my-nginx created
```

さらに、ConfigMapを追加するなど、追加のマニフェストを定義することも可能です。

### 外部ツール

このセクションでは、Kubernetes上でワークロードを管理するために一般的に使用されるツールのみを紹介します。
より多くのツールの一覧については、{{< glossary_tooltip text="CNCF" term_id="cncf" >}} Landscapeの
[アプリケーション定義とイメージビルド](https://landscape.cncf.io/guide#app-definition-and-development--application-definition-image-build)を参照してください。

#### Helm {#external-tool-helm}

{{% thirdparty-content single="true" %}}

[Helm](https://helm.sh/)は、あらかじめ設定されたKubernetesリソースのパッケージを管理するためのツールです。これらのパッケージは _Helmチャート_ と呼ばれます。

#### Kustomize {#external-tool-kustomize}

[Kustomize](https://kustomize.io/)は、Kubernetesのマニフェストを処理し、設定オプションを追加・削除・更新するツールです。Kustomizeは単独のバイナリとして利用できるほか、kubectlの[ネイティブ機能](/docs/tasks/manage-kubernetes-objects/kustomization/)としても利用できます。

## kubectlにおける一括操作

リソースの作成だけが`kubectl`による一括操作の対象ではありません。設定ファイルからリソース名を抽出し、他の操作を実行することも可能です。特に、作成したリソースを削除する際に利用できます。

```shell
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
```

```none
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

2つのリソースを対象とする場合、resource/nameの構文を使って、両方のリソースをコマンドラインで指定することができます。

```shell
kubectl delete deployments/my-nginx services/my-nginx-svc
```

さらに多数のリソースを扱う場合は、`-l`または`--selector`を使用してラベルによるフィルタリング(ラベルクエリ)を行う方が簡単です。

```shell
kubectl delete deployment,services -l app=nginx
```

```none
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

### チェーン処理とフィルタリング

`kubectl`は、受け入れるのと同じ構文でリソース名を出力するため、`$()`や`xargs`を使用して操作を連結できます。

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service/)
kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service/ | xargs -i kubectl get '{}'
```

出力は次のようになります。

```none
NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE
my-nginx-svc LoadBalancer 10.0.0.208 <pending> 80/TCP 0s
```

上記のコマンドでは、まず`docs/concepts/cluster-administration/nginx/`内のリソースを作成し、`-o name`出力形式を使用して作成されたリソースを出力します(各リソースをresource/nameの形式で出力します)。次に`grep`を使ってServiceのみを抽出し、それを[`kubectl get`](/docs/reference/kubectl/generated/kubectl_get/)で表示します。

### ローカルファイルに対する再帰的操作

特定のディレクトリ内でリソースを複数のサブディレクトリに整理している場合、`--filename`/`-f`引数とともに`--recursive`または`-R`を指定することで、サブディレクトリ内のリソースにも再帰的に操作を実行できます。

例えば、開発環境に必要なすべての {{< glossary_tooltip text="マニフェスト" term_id="manifest" >}} を保持し、リソースの種類ごとに整理された`project/k8s/development`というディレクトリがあるとします。

```none
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

デフォルトでは、`project/k8s/development`に対して一括操作を実行すると、ディレクトリの最上位レベルで処理が止まり、サブディレクトリ内のリソースは処理されません。そのため、以下のコマンドを使用してこのディレクトリ内のリソースを作成しようとすると、エラーが発生します。

```shell
kubectl apply -f project/k8s/development
```

```none
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

その代わりに、`--filename`/`-f`引数とともに`--recursive`または`-R`を指定してください。

```shell
kubectl apply -f project/k8s/development --recursive
```

```none
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

`--recursive`引数は、`--filename`/`-f`引数を受け付けるすべての操作で使用できます。例えば、`kubectl create`、`kubectl get`、`kubectl delete`、`kubectl describe`、`kubectl rollout`などに適用できます。

また、`--recursive`引数は、複数の`-f`引数が指定された場合にも機能します。

```shell
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
```

```none
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

`kubectl`について詳しく知りたい場合は、[コマンドラインツール(kubectl)](/ja/docs/reference/kubectl/)を参照してください。

## アプリケーションをダウンタイムなしで更新する

デプロイ済みのアプリケーションは、いずれ更新が必要になります。通常は、新しいイメージまたはイメージタグを指定することで更新を行います。`kubectl`には、さまざまな更新操作が用意されており、それぞれ異なるシナリオに適用できます。

アプリケーションの複数のコピーを実行し、_ロールアウト_ を使用して新しい正常なPodへ段階的にトラフィックを移行することで、ダウンタイムなしの更新が可能です。最終的には、すべての実行中のPodが新しいソフトウェアへ更新されます。

このセクションでは、Deploymentを使用してアプリケーションを作成し、更新する方法について説明します。

例えば、nginxのバージョン1.14.2を実行しているとします。

```shell
kubectl create deployment my-nginx --image=nginx:1.14.2
```

```none
deployment.apps/my-nginx created
```

1つのレプリカが存在することを確認します。

```shell
kubectl scale --replicas 1 deployments/my-nginx --subresource='scale' --type='merge' -p '{"spec":{"replicas": 1}}'
```

```none
deployment.apps/my-nginx scaled
```

そして、ロールアウト時にKubernetesが一時的なレプリカをより多く追加できるようにするため、_最大サージ_ を100%に設定します。

```shell
kubectl patch --type='merge' -p '{"spec":{"strategy":{"rollingUpdate":{"maxSurge": "100%" }}}}'
```

```none
deployment.apps/my-nginx patched
```

バージョン1.16.1へ更新するには、`.spec.template.spec.containers[0].image`を`nginx:1.14.2`から`nginx:1.16.1`に変更します。`kubectl edit`を使用してマニフェストを編集します。

```shell
kubectl edit deployment/my-nginx
# 新しいコンテナイメージを使用するようにマニフェストを変更し、変更を保存
```

以上で完了です！Deploymentは、デプロイされたnginxアプリケーションを宣言的に更新し、バックグラウンドで段階的に処理を進めます。これにより、更新中に一定数の古いレプリカのみが停止され、新しいレプリカが必要なPod数を超えて作成されることがないように制御されます。この仕組みの詳細については、[Deployment](/ja/docs/concepts/workloads/controllers/deployment/)を参照してください。

ロールアウトは、DaemonSet、Deployment、StatefulSetに対して使用できます。

### ロールアウトの管理

[`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/)を使用すると、既存のアプリケーションの段階的な更新を管理できます。

例えば、次のように実行できます。

```shell
kubectl apply -f my-deployment.yaml

# ロールアウトの完了を待機
kubectl rollout status deployment/my-deployment --timeout 10m # 10分のタイムアウト
```

または、次のように実行できます。

```shell
kubectl apply -f backing-stateful-component.yaml

# ロールアウトの完了を待たず、ステータスのみを確認
kubectl rollout status statefulsets/backing-stateful-component --watch=false
```

さらに、ロールアウトを一時停止、再開、または取り消すことも可能です。
詳細については、[`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/)を参照してください。

## カナリアデプロイ

<!--TODO: このセクションをカナリアデプロイのタスクとして作成する (#42786) -->

複数のラベルが必要となる別のシナリオとして、同じコンポーネントの異なるリリースや設定を区別する場合があります。
一般的な方法として、新しいアプリケーションリリース(Podテンプレート内のイメージタグで指定)を、以前のリリースと並行して*カナリア*デプロイすることがあります。これにより、新しいリリースが本番環境のトラフィックを受け取りつつ、完全にロールアウトする前に動作を確認できます。

例えば、`track`ラベルを使用して異なるリリースを区別することができます。

プライマリの安定したリリースには、`track`ラベルの値として`stable`を設定します。

```none
name: frontend
replicas: 3
...
labels:
   app: guestbook
   tier: frontend
   track: stable
...
image: gb-frontend:v3
```

その後、`track`ラベルの値を異なる値(例:`canary`)に設定した新しいguestbook frontendのリリースを作成することで、2つのPodセットが重ならないようにすることができます。

```none
name: frontend-canary
replicas: 1
...
labels:
   app: guestbook
   tier: frontend
   track: canary
...
image: gb-frontend:v4
```

フロントエンドのServiceは、両方のレプリカセットにまたがるように、共通のラベルの部分集合(つまり、`track`ラベルを省略)を選択することで、トラフィックを両方のアプリケーションに振り分けることができます。

```yaml
selector:
  app: guestbook
  tier: frontend
```

stableリリースとcanaryリリースのレプリカ数を調整することで、それぞれのリリースが本番トラフィックを受け取る割合(この例では、3:1)を決定できます。新しいリリースに十分な自信が持てたら、stableトラックを新しいアプリケーションリリースに更新し、canaryリリースを削除します。

## アノテーションの更新

リソースにアノテーションを付与したい場合があります。
アノテーションは、ツールやライブラリなどのAPIクライアントが取得できる、識別情報ではない任意のメタデータです。
これを行うには、`kubectl annotate`を使用します。例えば、次のように実行できます。

```shell
kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
kubectl get pods my-nginx-v4-9gw19 -o yaml
```

```shell
apiVersion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```

詳細については、[アノテーション](/ja/docs/concepts/overview/working-with-objects/annotations/)および[kubectl annotate](/docs/reference/kubectl/generated/kubectl_annotate/)を参照してください。

## アプリケーションのスケーリング

アプリケーションの負荷が増減した際には、`kubectl`を使用してスケーリングを行うことができます。
例えば、nginxのレプリカ数を3から1に減らすには、次のように実行します。

```shell
kubectl scale deployment/my-nginx --replicas=1
```

```none
deployment.apps/my-nginx scaled
```

これで、Deploymentによって管理されるPodは1つだけになりました。

```shell
kubectl get pods -l app=my-nginx
```

```none
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

システムに必要に応じてnginxのレプリカ数(1～3の範囲)を自動的に選択させるには、次のコマンドを実行します。

```shell
# これには、コンテナおよびPodのメトリクスの取得元が必要です
kubectl autoscale deployment/my-nginx --min=1 --max=3
```

```none
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

これで、nginxのレプリカ数は必要に応じて自動的にスケールアップおよびスケールダウンされます。

詳しくは、[kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/)、[kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/)、および[水平Pod自動スケーリング](/ja/docs/tasks/run-application/horizontal-pod-autoscale/)のドキュメントを参照してください。

## リソースのインプレース更新

作成したリソースに対して、小規模で影響の少ない更新を行う必要がある場合があります。

### kubectl apply

構成ファイルのセットをソース管理下で管理すること([構成のコード化](https://martinfowler.com/bliki/InfrastructureAsCode.html)を参照)が推奨されています。これにより、構成対象のリソースのコードとともに、構成を保守・バージョン管理することができます。その後、[`kubectl apply`](/docs/reference/kubectl/generated/kubectl_apply/)を使用して、構成の変更をクラスターに反映できます。


このコマンドは、適用しようとしている設定のバージョンと、以前のバージョンを比較し、変更を適用します。指定していないプロパティに対する自動的な変更は上書きされません。

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

```none
deployment.apps/my-nginx configured
```

基盤となる仕組みについて詳しく知りたい場合は、[server-side apply](/docs/reference/using-api/server-side-apply/)を参照してください。

### kubectl edit

あるいは、[`kubectl edit`](/docs/reference/kubectl/generated/kubectl_edit/)を使用してリソースを更新することもできます。

```shell
kubectl edit deployment/my-nginx
```

これは、まずリソースを`get`で取得し、テキストエディターで編集した後、更新されたバージョンを`apply`で適用するのと同等です。

```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# 何らかの編集を行い、ファイルを保存

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```

これにより、より大きな変更を簡単に行うことができます。
なお、`EDITOR`または`KUBE_EDITOR`環境変数を指定することで、使用するエディターを設定できます。

詳しくは、[kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/)を参照してください。

### kubectl patch

[`kubectl patch`](/docs/reference/kubectl/generated/kubectl_patch/)を使用すると、APIオブジェクトをインプレースで更新できます。このサブコマンドは、JSONパッチ、JSONマージパッチ、戦略的マージパッチをサポートしています。

詳細については、[kubectl patchを使用したAPIオブジェクトのインプレース更新](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)を参照してください。

## 破壊的な更新

場合によっては、一度初期化されると更新できないリソースのフィールドを変更する必要があることがあります。また、Deploymentによって作成された異常なPodを修正するなど、即座に再帰的な変更を行いたい場合もあります。そのようなフィールドを変更するには、`replace --force`を使用します。このコマンドは、リソースを削除し再作成することで変更を適用します。この場合、元の設定ファイルを修正して適用できます。

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```

```none
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```

## {{% heading "whatsnext" %}}

- [`kubectl`を使用したアプリケーションの調査とデバッグの方法](/ja/docs/tasks/debug/debug-application/debug-running-pod/)について学ぶ。
