---
title: 特定のノード上でのみPodを実行する
content_type: task
weight: 30
---
<!-- overview -->

このページでは、{{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}の一部として、特定の{{<glossary_tooltip term_id="node" text="ノード">}}上でのみ{{<glossary_tooltip term_id="pod" text="Pod">}}を実行する方法を説明します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

## 特定のノードでのみPodを実行する

{{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}を実行したいが、そのデーモンPodをローカルのソリッドステートドライブ(SSD)ストレージを備えたノードでのみ実行する必要があるとします。
例えば、Podがノードにキャッシュサービスを提供し、低遅延のローカルストレージが利用可能な場合にのみキャッシュが有用である場合などです。

### ステップ1: ノードにラベルを追加する

SSDを持つノードに`ssd=true`というラベルを追加します。

```shell
kubectl label nodes example-node-1 example-node-2 ssd=true
```

### ステップ2: マニフェストを作成する

SSDのラベルが付けられた{{<glossary_tooltip term_id="node" text="ノード">}}上にのみデーモンPodを配置する{{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}を作成してみましょう。

次に、`nodeSelector`を使用して、DaemonSetが`ssd`ラベルに`"true"`が設定されたノード上でのみPodを実行するようにします。

{{% code_sample file="controllers/daemonset-label-selector.yaml" %}}

### ステップ3: DaemonSetを作成する

`kubectl create`または`kubectl apply`を使用してマニフェストからDaemonSetを作成します。

別のノードに`ssd=true`というラベルを付けてみましょう。

```shell
kubectl label nodes example-node-3 ssd=true
```

ノードにラベルを付けると、それによってコントロールプレーン(正確にはDaemonSetコントローラー)がトリガーされ、そのノード上で新しいデーモンPodが実行されます。

```shell
kubectl get pods -o wide
```
出力は次のようになります:

```
NAME                              READY     STATUS    RESTARTS   AGE    IP      NODE
<daemonset-name><some-hash-01>    1/1       Running   0          13s    .....   example-node-1
<daemonset-name><some-hash-02>    1/1       Running   0          13s    .....   example-node-2
<daemonset-name><some-hash-03>    1/1       Running   0          5s     .....   example-node-3
```