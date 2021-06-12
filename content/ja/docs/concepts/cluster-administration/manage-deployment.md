---
reviewers:
- 
title: リソースの管理
content_type: concept
weight: 40
---

<!-- overview -->

アプリケーションをデプロイし、Serviceを介して外部に公開できました。さて、どうしますか？Kubernetesは、スケーリングや更新など、アプリケーションのデプロイを管理するための多くのツールを提供します。
我々が取り上げる機能についての詳細は[設定ファイル](/ja/docs/concepts/configuration/overview/)と[ラベル](/ja/docs/concepts/overview/working-with-objects/labels/)について詳細に説明します。




<!-- body -->

## リソースの設定を管理する

多くのアプリケーションではDeploymentやServiceなど複数のリソースの作成を要求します。複数のリソースの管理は、同一のファイルにひとまとめにしてグループ化すると簡単になります(YAMLファイル内で`---`で区切る)。
例えば:

{{< codenew file="application/nginx-app.yaml" >}}

複数のリソースは単一のリソースと同様の方法で作成できます。

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```shell
service/my-nginx-svc created
deployment.apps/my-nginx created
```

リソースは、ファイル内に記述されている順番通りに作成されます。そのため、Serviceを最初に指定するのが理想です。スケジューラーがServiceに関連するPodを、Deploymentなどのコントローラーによって作成されるときに確実に拡散できるようにするためです。

`kubectl apply`もまた、複数の`-f`による引数指定を許可しています。

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

個別のファイルに加えて、-fの引数としてディレクトリ名も指定できます:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/
```

`kubectl`は`.yaml`、`.yml`、`.json`といったサフィックスの付くファイルを読み込みます。

同じマイクロサービス、アプリケーションティアーのリソースは同一のファイルにまとめ、アプリケーションに関するファイルをグループ化するために、それらのファイルを同一のディレクトリに配備するのを推奨します。アプリケーションのティアーがDNSを通じて互いにバインドされると、アプリケーションスタックの全てのコンポーネントをひとまとめにして簡単にデプロイできます。

リソースの設定ソースとして、URLも指定できます。githubから取得した設定ファイルから直接手軽にデプロイができます:

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/application/nginx/nginx-deployment.yaml
```

```shell
deployment.apps/my-nginx created
```

## kubectlによる一括操作

`kubectl`が一括して実行できる操作はリソースの作成のみではありません。作成済みのリソースの削除などの他の操作を実行するために、設定ファイルからリソース名を取得することができます。

```shell
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
```

```shell
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

2つのリソースだけを削除する場合には、コマンドラインでリソース/名前というシンタックスを使うことで簡単に指定できます。

```shell
kubectl delete deployments/my-nginx services/my-nginx-svc
```

さらに多くのリソースに対する操作では、リソースをラベルでフィルターするために`-l`や`--selector`を使ってセレクター(ラベルクエリ)を指定するのが簡単です:

```shell
kubectl delete deployment,services -l app=nginx
```

```shell
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

`kubectl`は同様のシンタックスでリソース名を出力するので、`$()`や`xargs`を使ってパイプで操作するのが容易です:

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service)
```

```shell
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

上記のコマンドで、最初に`examples/application/nginx/`配下でリソースを作成し、`-o name`という出力フォーマットにより、作成されたリソースの名前を表示します(各リソースをresource/nameという形式で表示)。そして"service"のみ`grep`し、`kubectl get`を使って表示させます。

あるディレクトリ内の複数のサブディレクトリをまたいでリソースを管理するような場合、`--filename,-f`フラグと合わせて`--recursive`や`-R`を指定することでサブディレクトリに対しても再帰的に操作が可能です。

例えば、開発環境用に必要な全ての{{< glossary_tooltip text="マニフェスト" term_id="manifest" >}}をリソースタイプによって整理している`project/k8s/development`というディレクトリがあると仮定します。

```
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

デフォルトでは、`project/k8s/development`における一括操作は、どのサブディレクトリも処理せず、ディレクトリの第1階層で処理が止まります。下記のコマンドによってこのディレクトリ配下でリソースを作成しようとすると、エラーが発生します。

```shell
kubectl apply -f project/k8s/development
```

```shell
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

代わりに、下記のように`--filename,-f`フラグと合わせて`--recursive`や`-R`を指定してください:

```shell
kubectl apply -f project/k8s/development --recursive
```

```shell
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

`--recursive`フラグは`kubectl {create,get,delete,describe,rollout}`などのような`--filename,-f`フラグを扱うどの操作でも有効です。

また、`--recursive`フラグは複数の`-f`フラグの引数を指定しても有効です。

```shell
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
```

```shell
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

`kubectl`についてさらに知りたい場合は、[kubectlの概要](/docs/reference/kubectl/overview/)を参照してください。

## ラベルを有効に使う

これまで取り上げた例では、リソースに対して最大1つのラベルを適用してきました。リソースのセットを他のセットと区別するために、複数のラベルが必要な状況があります。

例えば、異なるアプリケーション間では、異なる`app`ラベルを使用したり、[ゲストブックの例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/)のようなマルチティアーのアプリケーションでは、各ティアーを区別する必要があります。frontendというティアーでは下記のラベルを持ちます。:

```yaml
     labels:
        app: guestbook
        tier: frontend
```

Redisマスターやスレーブでは異なる`tier`ラベルを持ち、加えて`role`ラベルも持つことでしょう。:

```yaml
     labels:
        app: guestbook
        tier: backend
        role: master
```

そして

```yaml
     labels:
        app: guestbook
        tier: backend
        role: slave
```

ラベルを使用すると、ラベルで指定された任意の次元に沿ってリソースを分割できます。

```shell
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
```

```shell
NAME                           READY     STATUS    RESTARTS   AGE       APP         TIER       ROLE
guestbook-fe-4nlpb             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-ght6d             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-jpy62             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1       Running   0          1m        guestbook   backend    master
guestbook-redis-slave-2q2yf    1/1       Running   0          1m        guestbook   backend    slave
guestbook-redis-slave-qgazl    1/1       Running   0          1m        guestbook   backend    slave
my-nginx-divi2                 1/1       Running   0          29m       nginx       <none>     <none>
my-nginx-o0ef1                 1/1       Running   0          29m       nginx       <none>     <none>
```

```shell
kubectl get pods -lapp=guestbook,role=slave
```
```shell
NAME                          READY     STATUS    RESTARTS   AGE
guestbook-redis-slave-2q2yf   1/1       Running   0          3m
guestbook-redis-slave-qgazl   1/1       Running   0          3m
```

## Canary deployments カナリアデプロイ

複数のラベルが必要な他の状況として、異なるリリース間でのDeploymentや、同一コンポーネントの設定を区別することが挙げられます。よく知られたプラクティスとして、本番環境の実際のトラフィックを受け付けるようにするために、新しいリリースを完全にロールアウトする前に、新しい*カナリア版*のアプリケーションを過去のリリースと合わせてデプロイする方法があります。

例えば、異なるリリースバージョンを分けるために`track`ラベルを使用できます。

主要な安定板のリリースでは`track`ラベルに`stable`という値をつけることがあるでしょう。:

```yaml
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

そして2つの異なるPodのセットを上書きしないようにするため、`track`ラベルに異なる値を持つ(例: `canary`)ようなguestbookフロントエンドの新しいリリースを作成できます。

```yaml
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

frontend Serviceは、トラフィックを両方のアプリケーションにリダイレクトさせるために、両方のアプリケーションに共通したラベルのサブセットを選択して両方のレプリカを扱えるようにします。:

```yaml
  selector:
     app: guestbook
     tier: frontend
```

安定版とカナリア版リリースで本番環境の実際のトラフィックを転送する割合を決めるため、双方のレプリカ数を変更できます(このケースでは3対1)。
最新版のリリースをしても大丈夫な場合、安定版のトラックを新しいアプリケーションにして、カナリア版を削除します。

さらに具体的な例については、[tutorial of deploying Ghost](https://github.com/kelseyhightower/talks/tree/master/kubecon-eu-2016/demo#deploy-a-canary)を参照してください。

## ラベルの更新

新しいリソースを作成する前に、既存のPodと他のリソースのラベルの変更が必要な状況があります。これは`kubectl label`で実行できます。
例えば、全てのnginx Podを frontendティアーとしてラベル付けするには、下記のコマンドを実行するのみです。

```shell
kubectl label pods -l app=nginx tier=fe
```

```shell
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

これは最初に"app=nginx"というラベルのついたPodをフィルターし、そのPodに対して"tier=fe"というラベルを追加します。
ラベル付けしたPodを確認するには、下記のコマンドを実行してください。

```shell
kubectl get pods -l app=nginx -L tier
```
```shell
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

このコマンドでは"app=nginx"というラベルのついた全てのPodを出力し、Podのtierという項目も表示します(`-L`または`--label-columns`で指定)。

さらなる情報は、[ラベル](/docs/concepts/overview/working-with-objects/labels/)や[kubectl label](/docs/reference/generated/kubectl/kubectl-commands/#label)を参照してください。

## アノテーションの更新

リソースに対してアノテーションを割り当てたい状況があります。アノテーションは、ツール、ライブラリなどのAPIクライアントによって取得するための任意の非識別メタデータです。アノテーションの割り当ては`kubectl annotate`で可能です。例:

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

さらなる情報は、[アノテーション](/docs/concepts/overview/working-with-objects/annotations/) や、[kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands/#annotate)を参照してください。

## アプリケーションのスケール

アプリケーションの負荷が増減するとき、`kubectl`を使って簡単にスケールできます。例えば、nginxのレプリカを3から1に減らす場合、下記を実行します:

```shell
kubectl scale deployment/my-nginx --replicas=1
```
```shell
deployment.apps/my-nginx scaled
```

実行すると、Deploymentによって管理されるPod数が1となります。

```shell
kubectl get pods -l app=nginx
```
```shell
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

システムに対してnginxのレプリカ数を自動で選択させるには、下記のように1から3の範囲で指定します。:

```shell
kubectl autoscale deployment/my-nginx --min=1 --max=3
```
```shell
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

実行すると、nginxのレプリカは必要に応じて自動でスケールアップ、スケールダウンします。

さらなる情報は、[kubectl scale](/docs/reference/generated/kubectl/kubectl-commands/#scale)、[kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale) and [horizontal pod autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/)を参照してください。


## リソースの直接的アップデート

場合によっては、作成したリソースに対して処理を中断させずに更新を行う必要があります。

### kubectl apply

開発者が設定するリソースをコードとして管理しバージョニングも行えるように、設定ファイルのセットをソースによって管理する方法が推奨されています。
この場合、クラスターに対して設定の変更をプッシュするために[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply)を使用できます。

このコマンドは、リソース設定の過去のバージョンと、今適用した変更を比較し、差分に現れないプロパティーに対して上書き変更することなくクラスターに適用させます。

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
deployment.apps/my-nginx configured
```

注意として、前回の変更適用時からの設定の変更内容を決めるため、`kubectl apply`はリソースに対してアノテーションを割り当てます。変更が実施されると`kubectl apply`は、1つ前の設定内容と、今回変更しようとする入力内容と、現在のリソースの設定との3つの間で変更内容の差分をとります。

現在、リソースはこのアノテーションなしで作成されました。そのため、最初の`kubectl paply`の実行においては、与えられたにゅうチョクト、現在のリソースの設定の2つの間の差分が取られ、フォールバックします。この最初の実行の間、リソースが作成された時にプロパティーセットの削除を検知できません。この理由により、プロパティーの削除はされません。

`kubectl apply`の実行後の全ての呼び出しや、`kubectl replace`や`kubectl edit`などの設定を変更する他のコマンドではアノテーションを更新します。`kubectl apply`した後の全ての呼び出しにおいて3-wayの差分取得によってプロパティの検知と削除を実施します。

### kubectl edit

その他に、`kubectl edit`によってリソースの更新もできます。:

```shell
kubectl edit deployment/my-nginx
```

このコマンドは、最初にリソースを`get`し、テキストエディタでリソースを編集し、更新されたバージョンでリソースを`apply`します。:

```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# yamlファイルを編集し、ファイルを保存します。

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```

このコマンドによってより重大な変更を簡単に行えます。注意として、あなたの`EDITOR`や`KUBE_EDITOR`といった環境変数も指定できます。

さらなる情報は、[kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit)を参照してください。

### kubectl patch

APIオブジェクトの更新には`kubectl patch`を使うことができます。このコマンドはJSON patch、JSON merge patch、戦略的merge patchをサポートしています。
[kubectl patchを使ったAPIオブジェクトの更新](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)や[kubectl patch](/docs/reference/generated/kubectl/kubectl-commands/#patch)を参照してください。

## 破壊的なアップデート

一度初期化された後、更新できないようなリソースフィールドの更新が必要な場合や、Deploymentによって作成され、壊れている状態のPodを修正するなど、再帰的な変更を即座に行いたい場合があります。このようなフィールドを変更するため、リソースの削除と再作成を行う`replace --force`を使用してください。このケースでは、シンプルに元の設定ファイルを修正するのみです。:

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```
```shell
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```

## サービス停止なしでアプリケーションを更新する

ある時点で、前述したカナリアデプロイのシナリオにおいて、新しいイメージやイメージタグを指定することによって、デプロイされたアプリケーションを更新が必要な場合があります。`kubectl`ではいくつかの更新操作をサポートしており、それぞれの操作が異なるシナリオに対して適用可能です。

ここでは、Deploymentを使ってアプリケーションの作成と更新についてガイドします。

まずnginxのバージョン1.14.2を稼働させていると仮定します。:

```shell
kubectl create deployment my-nginx --image=nginx:1.14.2
```
```shell
deployment.apps/my-nginx created
```

レプリカ数を3にします(新旧のリビジョンは混在します)。:
```shell
kubectl scale deployment my-nginx --current-replicas=1 --replicas=3
```
```
deployment.apps/my-nginx scaled
```

バージョン1.16.1に更新するには、上述したkubectlコマンドを使って`.spec.template.spec.containers[0].image`の値を`nginx:1.14.2`から`nginx:1.16.1`に変更するだけでできます。

```shell
kubectl edit deployment/my-nginx
```

できました!Deploymentはデプロイされたnginxのアプリケーションを宣言的にプログレッシブに更新します。更新途中では、決まった数の古いレプリカのみダウンし、一定数の新しいレプリカが希望するPod数以上作成されても良いことを保証します。詳細について学ぶには[Deployment page](/docs/concepts/workloads/controllers/deployment/)を参照してください。



## {{% heading "whatsnext" %}}

- [アプリケーションの調査とデバッグのための`kubectl`の使用方法](/docs/tasks/debug-application-cluster/debug-application-introspection/)について学んでください。
- [設定のベストプラクティスとTIPS](/ja/docs/concepts/configuration/overview/)を参照してください。

