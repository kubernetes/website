---
title: コンテナに割り当てるCPUとメモリ容量を変更する
content_type: task
weight: 30
min-kubernetes-server-version: 1.27
---


<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

このページは[Quality of Service](/ja/docs/tasks/configure-pod-container/quality-service-pod/)に馴染みのある読者を前提としています。

このページでは、稼働中のPodやコンテナを再起動することなく、コンテナに割り当てられるCPUやメモリ容量を変更(リサイズ)するための方法を示します。
Kubernetesノードは、PodのContainerに指定した`requests`に基づいてPodにリソースを割り当て、`limits`に基づいてPodのリソース使用量を制限します。

稼働中のPodのリソース割当を変更するには、 `InPlacePodVerticalScaling` [フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効化する必要があります。
代替手法としては、Podを削除した上で、異なるリソース要求を有するPodを[ワークロードコントローラー](/ja/docs/concepts/workloads/controllers/) に作成させることもできます。

稼働中のPodのリソースを変更するために

- Containerの `requests` と `limits` はCPUおよびメモリリソースに対して _可変_ なものとなっています。
- Podステータスの `containerStatuses` における `allocatedResources` フィールドは、PodのContainerに割り当てられたリソースを反映します。
- Podステータスの `containerStatuses` における `resources` フィールドは、稼働中Containerに設定済みの実際のリソース要求(`requests`)とリソース制限(`limits`)を反映しており、これらの値はコンテナランタイムが通知したものです。
- Podステータスの `resize` フィールドは直前の適用待ちのリサイズ要求を示します。
このフィールドの値には次のようなものがあります。
  - `Proposed`: リサイズ要求の受理を表し、リクエストが検証済みかつ記録済み
     であることを示します。
  - `InProgress`: リサイズ要求がノードによって受理され、Podのコンテナに対する
     適用が進行中であることを示します。  
  - `Deferred`: リサイズ要求が現時点では通っていないことを示します。
     他のPodが除去されてノードの資源が開放されたら、リサイズが承認されるかもしれません。
  - `Infeasible`: ノードがリサイズ要求に対応できないことを示すシグナルです。
     Podに対してノードが割り当て可能なリソースの最大値を上回るリサイズ要求がある時に
    発生する可能性があります。


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

クラスターのコントロールプレーンを含む全ノードで`InPlacePodVerticalScaling` [フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)が有効化されている必要があります。

## コンテナリサイズポリシー

リサイズポリシーはPodにおけるコンテナのCPUやメモリリソースを取り扱うためのきめ細かい制御を可能にします。
例えば、アプリケーションを再起動せずにコンテナのCPUリソースのリサイズを行える場合でも、メモリのリサイズについてはアプリケーションとコンテナの再起動が必要となる場合があります。

これを実現するために、ユーザーはContainerの仕様に `resizePolicy` を指定できるようになっています。
以下の再起動ポリシーをCPUやメモリのリサイズの際に指定できます。
* `NotRequired`: 稼働中のコンテナリソースをリサイズします。
* `RestartContainer`: コンテナを再起動させ、再起動時に新しいリソースを適用します。

`resizePolicy[*].restartPolicy` が指定されない場合のデフォルトは、`NotRequired`です。

{{< note >}}
Podの`restartPolicy`が`Never`である場合、Podの全コンテナの再起動ポリシーが`NotRequired`である必要があります。
{{< /note >}}

以下のPodの例は、ContainerのCPUのリサイズは再起動なしで実施させ、メモリのリサイズにはコンテナの再起動を要求するものです。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: qos-demo-5
  namespace: qos-example
spec:
  containers:
  - name: qos-demo-ctr-5
    image: nginx
    resizePolicy:
    - resourceName: cpu
      restartPolicy: NotRequired
    - resourceName: memory
      restartPolicy: RestartContainer
    resources:
      limits:
        memory: "200Mi"
        cpu: "700m"
      requests:
        memory: "200Mi"
        cpu: "700m"
```

{{< note >}}
この例の requests ないしは limits が CPUとメモリの _両方を_ 変化させる場合、
メモリのリサイズが生じるので、コンテナは再起動します。
{{< /note >}}

<!-- steps -->

## リソース要求やリソース制限のあるPodを作成する

リソース要求やリソース制限をPodのコンテナに指定することで、保証(Guaranteed)ないしは バースト可能(Burstable)な[Quality of Service](/ja/docs/tasks/configure-pod-container/quality-service-pod/)クラスのPodを作成することができます。

次のような単一のコンテナを含むPodのマニフェストを考えてみましょう。

{{% code_sample file="pods/qos/qos-pod-5.yaml" %}}

Podを`qos-example` Namespace に作成します。

```shell
kubectl create namespace qos-example
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod-5.yaml
```

このPodは保証QoSクラスに区分され、700mのCPU、200Miのメモリを要求します。

Podの詳細な情報を見てみましょう。

```shell
kubectl get pod qos-demo-5 --output=yaml --namespace=qos-example
```
`resizePolicy[*].restartPolicy`の値がデフォルトの`NotRequired`になっていることに気づいたでしょうか。
これはCPUとメモリがコンテナ稼働中にリサイズできることを示しています。

```yaml
spec:
  containers:
    ...
    resizePolicy:
    - resourceName: cpu
      restartPolicy: NotRequired
    - resourceName: memory
      restartPolicy: NotRequired
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
...
  containerStatuses:
...
    name: qos-demo-ctr-5
    ready: true
...
    allocatedResources:
      cpu: 700m
      memory: 200Mi
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
    restartCount: 0
    started: true
...
  qosClass: Guaranteed
```


## Podのリソースを更新する

要求CPUを0.8CPUに増やしてみます。
これは手動でも指定できますし、[VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)(VPA)などを用いて自動的に検出/適用することもできます。

{{< note >}}
Podのリソース要求やリソース制限を変更して希望の容量に合わせることはできますが、Pod作成時に指定したQoSクラスを変更することはできません。
{{< /note >}}

PodのContainerのCPU要求とCPU制限をいずれも`800m`に指定するパッチを当ててみます。

```shell
kubectl -n qos-example patch pod qos-demo-5 --patch '{"spec":{"containers":[{"name":"qos-demo-ctr-5", "resources":{"requests":{"cpu":"800m"}, "limits":{"cpu":"800m"}}}]}}'
```

Podへのパッチが当たったら、Podの詳細情報を参照してみましょう。

```shell
kubectl get pod qos-demo-5 --output=yaml --namespace=qos-example
```

以下のPod仕様は更新済みのCPU要求とCPU制限を反映しています。

```yaml
spec:
  containers:
    ...
    resources:
      limits:
        cpu: 800m
        memory: 200Mi
      requests:
        cpu: 800m
        memory: 200Mi
...
  containerStatuses:
...
    allocatedResources:
      cpu: 800m
      memory: 200Mi
    resources:
      limits:
        cpu: 800m
        memory: 200Mi
      requests:
        cpu: 800m
        memory: 200Mi
    restartCount: 0
    started: true
```

期待する新しいCPU要求を反映する形で `allocatedResources` の値が更新されていることを確認しておきましょう。
これはノードがCPUリソースの追加要求に対応できたことを示しています。

Containerの状態においてはCPUリソースの値が更新されており、新しいCPUリソースが適用されたことを示しています。
Containerの`restartCount`は変化しておらず、コンテナのCPUリソースがコンテナの再起動なしで変更されたことを示しています。

## クリーンアップ

名前空間を削除しましょう。

```shell
kubectl delete namespace qos-example
```

## {{% heading "whatsnext" %}}


### アプリケーション開発者向け

* [コンテナおよびPodへのメモリーリソースの割り当て](/ja/docs/tasks/configure-pod-container/assign-memory-resource/)

* [コンテナおよびPodへのCPUリソースの割り当て](/ja/docs/tasks/configure-pod-container/assign-cpu-resource/)

### クラスター管理者向け

* [Namespaceのデフォルトのメモリー要求と制限を設定する](/ja/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [NamespaceのデフォルトのCPU要求と制限を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Namespaceに対する最小および最大メモリー制約の構成](/ja/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Namespaceに対する最小および最大CPU制約の構成](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Namespaceに対するメモリとCPUのクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)


