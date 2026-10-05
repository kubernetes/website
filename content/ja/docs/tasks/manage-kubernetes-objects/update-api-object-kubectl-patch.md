---
title: kubectl patchを使用してAPIオブジェクトの更新
description: 戦略的マージパッチかJSONマージパッチを用いて、kubectl patchでKubernetes APIオブジェクトをインプレース更新します。
content_type: task
weight: 50
---

<!-- overview -->

このタスクでは、`kubectl patch`を使用してAPIオブジェクトをインプレースで更新する方法を説明します。
このタスクの演習では、戦略的マージパッチとJSONマージパッチを実演します。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## Deploymentを戦略的マージパッチで更新 {#use-a-strategic-merge-patch-to-update-a-deployment}

以下は、2つのレプリカがあるDeployment設定ファイルです。各レプリカは1つのコンテナを持つPodです:

{{% code_sample file="application/deployment-patch.yaml" %}}

Deploymentを作成します:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment-patch.yaml
```

Deploymentに関連するPodを参照します:

```shell
kubectl get pods
```

出力から、Deploymentに2つのPodがあることが確認できます。
`1/1`は、各Podに1つのコンテナがあることを示しています:


```
NAME                        READY     STATUS    RESTARTS   AGE
patch-demo-28633765-670qr   1/1       Running   0          23s
patch-demo-28633765-j5qs3   1/1       Running   0          23s
```

実行中のPodの名前に注目してください。これらのPodは後ほど違う名前のPodと置換されることが確認できます。

現時点では、各Podには1つのnginxイメージのコンテナが実行中です。
これを2つのコンテナにしたいとします: 1つはnginx、もう1つはredisを実行します。

`patch-file.yaml`ファイルを以下の内容で作成します:

```yaml
spec:
  template:
    spec:
      containers:
      - name: patch-demo-ctr-2
        image: redis
```

Deploymentにパッチを適用します:

```shell
kubectl patch deployment patch-demo --patch-file patch-file.yaml
```

パッチを適用したDeploymentを参照します:

```shell
kubectl get deployment patch-demo --output yaml
```

出力から、DeploymentのPodSpecに2つのコンテナが含まれていることが確認できます:

```yaml
containers:
- image: redis
  imagePullPolicy: Always
  name: patch-demo-ctr-2
  ...
- image: nginx
  imagePullPolicy: Always
  name: patch-demo-ctr
  ...
```

パッチを適用したDeploymentに関連するPodを参照します:

```shell
kubectl get pods
```

出力から、以前のPodとは異なる名前になっていることが確認できます。
Deploymentは古いPodを終了させ、更新されたDeploymentのspecに従う2つの新しいPodを作成しました。
`2/2`は2つのコンテナが実行されていることを示しています:

```
NAME                          READY     STATUS    RESTARTS   AGE
patch-demo-1081991389-2wrn5   2/2       Running   0          1m
patch-demo-1081991389-jmg7b   2/2       Running   0          1m
```

patch-demo Podの詳細を確認します:

```shell
kubectl get pod <your-pod-name> --output yaml
```

出力から、Podに2つのコンテナがあることが確認できます: 1つはnginx、もう1つはredisを実行しています:

```
containers:
- image: redis
  ...
- image: nginx
  ...
```

### 戦略的マージパッチについての注意 {#notes-on-the-strategic-merge-patch}

前の演習で適用したパッチは *戦略的マージパッチ* です。パッチが`containers`リストを置き換えなかったことに注目してください。
代わりに、新しいコンテナがリストに追加されました。つまり、パッチ内のリストは既存のリストとマージされたのです。
戦略的マージパッチをリストに対して使用したからといって、常にこのような挙動になるとは限りません。
場合によっては、リストがマージされずに置換される場合もあります。

リストはパッチ戦略によって置換かマージされます。パッチ戦略は、Kubernetesソースコードのフィールドタグ内にある`patchStrategy`キーの値で指定します。
例えば、`PodSpec`構造体の`Containers`フィールドにある`patchStrategy`の値は`merge`に設定されています:

```go
type PodSpec struct {
  ...
  Containers []Container `json:"containers" patchStrategy:"merge" patchMergeKey:"name" ...`
  ...
}
```

パッチ戦略については、[OpenApi spec](https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json)で参照できます:

```yaml
"io.k8s.api.core.v1.PodSpec": {
    ...,
    "containers": {
        "description": "List of containers belonging to the pod.  ...."
    },
    "x-kubernetes-patch-merge-key": "name",
    "x-kubernetes-patch-strategy": "merge"
}
```
<!-- 編集者向け: ここではSyntaxハイライトのエラーを予防するために、jsonではなく意図的にyamlを使用しています。-->

パッチ戦略は[Kubernetes API documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)で参照できます。

`patch-file-tolerations.yaml`ファイルを以下の内容で作成します:

```yaml
spec:
  template:
    spec:
      tolerations:
      - effect: NoSchedule
        key: disktype
        value: ssd
```

Deploymentにパッチを適用します:

```shell
kubectl patch deployment patch-demo --patch-file patch-file-tolerations.yaml
```

パッチを適用したDeploymentを確認する:

```shell
kubectl get deployment patch-demo --output yaml
```

出力から、DeploymentのPodSpecにTolerationが1つだけ含まれていることが確認できます:

```yaml
tolerations:
- effect: NoSchedule
  key: disktype
  value: ssd
```

PodSpecにある`tolerations`リストがマージされたのではなく、置換されたことに注目してください。
これは、PodSpecのTolerationフィールドに`patchStrategy`キーが存在しないためです。
そのため、戦略的マージパッチはデフォルトのパッチ戦略である`replace`を使用します。

```go
type PodSpec struct {
  ...
  Tolerations []Toleration `json:"tolerations,omitempty" protobuf:"bytes,22,opt,name=tolerations"`
  ...
}
```

## DeploymentをJSONマージパッチで更新 {#use-a-json-merge-patch-to-update-a-deployment}

戦略的マージパッチは[JSONマージパッチ](https://tools.ietf.org/html/rfc7386)とは違います。
リストを更新する場合、JSONマージパッチではリストの全要素を指定する必要があります。
既存のリストは新しいリストに置き換えられます。

`kubectl patch`コマンドは`type`パラメータがあり、以下の値のいずれかで設定できます。

<table>
  <tr><th>Parameter value</th><th>Merge type</th></tr>
  <tr><td>json</td><td><a href="https://tools.ietf.org/html/rfc6902">JSON Patch, RFC 6902</a></td></tr>
  <tr><td>merge</td><td><a href="https://tools.ietf.org/html/rfc7386">JSON Merge Patch, RFC 7386</a></td></tr>
  <tr><td>strategic</td><td>Strategic merge patch</td></tr>
</table>

JSONパッチとJSONマージパッチの比較は[JSONパッチとJSONマージパッチ](https://erosb.github.io/post/json-patch-vs-merge-patch/)を参照してください。

`type`パラメータのデフォルト値は`strategic`です。
したがって、前の演習で行ったパッチは戦略的マージパッチになります。

次に、同じDeploymentに対してJSONマージパッチを実行します。
`patch-file-2.yaml`ファイルを以下の内容で作成します:

```yaml
spec:
  template:
    spec:
      containers:
      - name: patch-demo-ctr-3
        image: gcr.io/google-samples/hello-app:2.0
```

パッチコマンドで`type`を`merge`に設定してください:

```shell
kubectl patch deployment patch-demo --type merge --patch-file patch-file-2.yaml
```

パッチを適用したDeploymentを確認する:

```shell
kubectl get deployment patch-demo --output yaml
```

パッチ内で指定した`containers`リストにはコンテナが1つだけあります。
出力から、1つのコンテナのリストが既存の`containers`リストを置き換えていることが確認できます。

```yaml
spec:
  containers:
  - image: gcr.io/google-samples/hello-app:2.0
    ...
    name: patch-demo-ctr-3
```

実行中のPodを一覧表示します:

```shell
kubectl get pods
```

出力から、既存のPodが終了し、新しいPodが作成されたことが確認できます。`1/1`は、各新しいPodがコンテナを1つだけ実行していることを示しています。

```shell
NAME                          READY     STATUS    RESTARTS   AGE
patch-demo-1307768864-69308   1/1       Running   0          1m
patch-demo-1307768864-c86dc   1/1       Running   0          1m
```

## retainKeys戦略を使用した戦略的マージパッチでDeploymentを更新 {#use-strategic-merge-patch-to-update-a-deployment-using-the-retainkeys-strategy}

ここに`RollingUpdate`戦略を使うDeployment用の設定ファイルがあります:

{{% code_sample file="application/deployment-retainkeys.yaml" %}}

Deploymentを作成します:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment-retainkeys.yaml
```

現状では`RollingUpdate`戦略が使用されたDeploymentが作成されます。

`patch-file-no-retainkeys.yaml`ファイルを以下の内容で作成します:

```yaml
spec:
  strategy:
    type: Recreate
```

Deploymentにパッチを適用します:

```shell
kubectl patch deployment retainkeys-demo --type strategic --patch-file patch-file-no-retainkeys.yaml
```

出力から、`spec.strategy.rollingUpdate`に値が定義されている場合、`type`を`Recreate`に設定できないことが確認できます:

```
The Deployment "retainkeys-demo" is invalid: spec.strategy.rollingUpdate: Forbidden: may not be specified when strategy `type` is 'Recreate'
```

`type`の値を更新する際に`spec.strategy.rollingUpdate`の値を削除するには、戦略的マージの`retainKeys`戦略を使用します。

もう1つの`patch-file-retainkeys.yaml`ファイルを以下の内容で作成します:

```yaml
spec:
  strategy:
    $retainKeys:
    - type
    type: Recreate
```

このパッチでは、`strategy`オブジェクトの`type`キーのみを保持したいことを示しています。
そのため、パッチ操作中に`rollingUpdate`は削除されます。

この新しいパッチでDeploymentに再度パッチを適用します:

```shell
kubectl patch deployment retainkeys-demo --type strategic --patch-file patch-file-retainkeys.yaml
```

Deploymentの内容を確認します:

```shell
kubectl get deployment retainkeys-demo --output yaml
```

出力から、Deployment内のstrategyオブジェクトに`rollingUpdate`キーがもう含まれていないことが確認できます:

```yaml
spec:
  strategy:
    type: Recreate
  template:
```

### retainKeys戦略を使用した戦略的マージパッチについての注意 {#notes-on-the-strategic-merge-patch-using-the-retainkeys-strategy}

前の演習で行ったパッチは *retainKeys戦略を使用した戦略的マージパッチ* と呼ばれます。
この方法では、以下の戦略を持つ新しいディレクティブ`$retainKeys`が導入されます:

- 文字列のリストが含まれています。
- 保持する必要があるすべてのフィールドは、`$retainKeys`リストに存在していなければなりません。
- 存在するフィールドは、ライブオブジェクトとマージされます。
- 不足しているフィールドは、パッチ適用時にすべてクリアされます。
- `$retainKeys`リスト内のすべてのフィールドは、パッチに存在するフィールドのスーパーセットであるか、同じでなければなりません。

`retainKeys`ストラテジーはすべてのオブジェクトで機能するわけではありません。
Kubernetesソースコードのフィールドタグにある`patchStrategy`キーの値が`retainKeys`を含む場合にのみ機能します。
例えば、`DeploymentSpec`構造体の`Strategy`フィールドには`retainKeys`の`patchStrategy`があります:

```go
type DeploymentSpec struct {
  ...
  // +patchStrategy=retainKeys
  Strategy DeploymentStrategy `json:"strategy,omitempty" patchStrategy:"retainKeys" ...`
  ...
}
```

`retainKeys`戦略は[OpenApi spec](https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json)でも参照できます:

```yaml
"io.k8s.api.apps.v1.DeploymentSpec": {
    ...,
    "strategy": {
        "$ref": "#/definitions/io.k8s.api.apps.v1.DeploymentStrategy",
        "description": "The deployment strategy to use to replace existing pods with new ones.",
        "x-kubernetes-patch-strategy": "retainKeys"
    },
    ....
}
```
<!-- 編集者向け: ここではSyntaxハイライトのエラーを予防するために、jsonではなく意図的にyamlを使用しています。-->

`retainKeys`戦略は[Kubernetes APIレファレンス](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deploymentspec-v1-apps)を参照できます。

### kubectl patchコマンドのその他の形式 {#alternate-forms-of-the-kubectl-patch-command}

`kubectl patch`コマンドはYAMLとJSONを受け付けます。
パッチを適用する場合、ファイルでもコマンドラインからも受け付けます。

`patch-file.json`ファイルを以下の内容で作成します:

```json
{
   "spec": {
      "template": {
         "spec": {
            "containers": [
               {
                  "name": "patch-demo-ctr-2",
                  "image": "redis"
               }
            ]
         }
      }
   }
}
```

以下のコマンドは同じ動作をします:


```shell
kubectl patch deployment patch-demo --patch-file patch-file.yaml
kubectl patch deployment patch-demo --patch 'spec:\n template:\n  spec:\n   containers:\n   - name: patch-demo-ctr-2\n     image: redis'

kubectl patch deployment patch-demo --patch-file patch-file.json
kubectl patch deployment patch-demo --patch '{"spec": {"template": {"spec": {"containers": [{"name": "patch-demo-ctr-2","image": "redis"}]}}}}'
```

### `kubectl patch`と`--subresource`を使用してオブジェクトのレプリカ数を更新する {#scale-kubectl-patch}

`--subresource=[subresource-name]`フラグは、get、patch、edit、apply、replaceなどのkubectlコマンドと組み合わせて使用することで、指定したリソースの`status`、`scale`、`resize`サブリソースを取得・更新できます。
`status`、`scale`、`resize`のいずれかのサブリソースを持つKubernetes APIリソース(ビルトインおよびCR)であれば、どのリソースに対してもサブリソースを指定可能です。

例えば、Deploymentには`status`サブリソースと`scale`サブリソースがあるため、`kubectl`を使用してDeploymentの`status`サブリソースのみを取得・変更できます。

以下は、2つのレプリカを持つDeploymentのマニフェストです:

{{% code_sample file="application/deployment.yaml" %}}

Deploymentを作成します:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

Deploymentに関連するPodを確認する:

```shell
kubectl get pods -l app=nginx
```

出力から、Deploymentに2つのPodがあることが確認できます。
例:

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-7fb96c846b-22567   1/1     Running   0          47s
nginx-deployment-7fb96c846b-mlgns   1/1     Running   0          47s
```

次に、`--subresource=[subresource-name]`フラグを指定してそのDeploymentにパッチを適用します:

```shell
kubectl patch deployment nginx-deployment --subresource='scale' --type='merge' -p '{"spec":{"replicas":3}}'
```

出力は次のとおりです:

```shell
scale.autoscaling/nginx-deployment patched
```

パッチを適用したDeploymentに関連するPodを確認する:

```shell
kubectl get pods -l app=nginx
```

出力から、新しいPodが1つ作成され、実行中のPodが計3つになったことが確認できます。

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-7fb96c846b-22567   1/1     Running   0          107s
nginx-deployment-7fb96c846b-lxfr2   1/1     Running   0          14s
nginx-deployment-7fb96c846b-mlgns   1/1     Running   0          107s
```

パッチを適用したDeploymentを確認する:

```shell
kubectl get deployment nginx-deployment -o yaml
```

```yaml
...
spec:
  replicas: 3
  ...
status:
  ...
  availableReplicas: 3
  readyReplicas: 3
  replicas: 3
```

{{< note >}}
サポートされていないサブリソースに対して`--subresource`フラグを指定して`kubectl patch`を実行すると、APIサーバーは404 Not Foundエラーを返します。
{{< /note >}}

## まとめ {#summary}

この演習では、`kubectl patch`を使用してDeploymentオブジェクトの現行の設定を変更しました。
Deploymentオブジェクトの作成に最初に使用した設定ファイルは変更していません。
APIオブジェクトを更新するその他のコマンドには、[kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands/#annotate)、[kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit)、[kubectl replace](/docs/reference/generated/kubectl/kubectl-commands/#replace)、[kubectl scale](/docs/reference/generated/kubectl/kubectl-commands/#scale)、[kubectl apply](/docs/reference/generated/kubectl/kubectl-commands/#apply)があります。


{{< note >}}
戦略的マージパッチはカスタムリソースに対してはサポートされていません。
{{< /note >}}


## {{% heading "whatsnext" %}}


* [Kubernetesオブジェクト管理](/docs/concepts/overview/working-with-objects/object-management/)
* [命令型コマンドを利用したKubernetesオブジェクトの管理](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [オブジェクト設定(命令型)を利用したKubernetesオブジェクトの管理](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [オブジェクト設定(宣言型)を利用したKubernetesオブジェクトの管理](/docs/tasks/manage-kubernetes-objects/declarative-config/)


