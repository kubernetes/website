---
title: コンテナおよびPodへのCPUリソースの割り当て
content_type: task
weight: 20
---

<!-- overview -->

このページでは、CPUの *request* と *limit* をコンテナに割り当てる方法について示します。コンテナは設定された制限を超えてCPUを使用することはできません。システムにCPUの空き時間がある場合、コンテナには要求されたCPUを割り当てられます。




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

タスク例を実行するには、クラスターに少なくとも利用可能な1 CPUが必要です。

このページのいくつかの手順では、クラスターにて[metrics-server](https://github.com/kubernetes-incubator/metrics-server)サービスを実行する必要があります。すでにmetrics-serverが動作している場合、これらの手順をスキップできます。

{{< glossary_tooltip term_id="minikube" >}}を動作させている場合、以下のコマンドによりmetrics-serverを有効にできます:

```shell
minikube addons enable metrics-server
```

metrics-serverが実行されているか、もしくはリソースメトリクスAPI (`metrics.k8s.io`) の別のプロバイダーが実行されていることを確認するには、以下のコマンドを実行してください:

```shell
kubectl get apiservices
```

リソースメトリクスAPIが利用可能であれば、出力には `metrics.k8s.io` への参照が含まれます。

```
NAME
v1beta1.metrics.k8s.io
```




<!-- steps -->

## namespaceの作成

この練習で作成するリソースがクラスター内で分離されるよう、{{< glossary_tooltip term_id="namespace" >}}を作成します。

```shell
kubectl create namespace cpu-example
```

## CPUの要求と制限を指定する

コンテナにCPUの要求を指定するには、コンテナのリソースマニフェストに`resources:requests`フィールドを追記します。CPUの制限を指定するには、`resources:limits`を追記します。

この練習では、一つのコンテナをもつPodを作成します。コンテナに0.5 CPUの要求と1 CPUの制限を与えます。Podの設定ファイルは次のようになります:

{{< codenew file="pods/resource/cpu-request-limit.yaml" >}}

設定ファイルの`args`セクションでは、コンテナ起動時の引数を与えます。`-cpus "2"`という引数では、コンテナに2 CPUを割り当てます。

Podを作成してください:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit.yaml --namespace=cpu-example
```

Podのコンテナが起動していることを検証してください:

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

Podの詳細な情報を確認してください:

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

この出力では、Pod内の一つのコンテナに500ミリCPUの要求と1 CPUの制限があることを示しています。

```yaml
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

`kubectl top`を実行し、Podのメトリクスを取得してください:

```shell
kubectl top pod cpu-demo --namespace=cpu-example
```

この出力では、Podが974ミリCPUを使用していることを示しています。Podの設定で指定した1 CPUの制限よりわずかに小さい値です。

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

`-cpu "2"`を設定することで、コンテナが2 CPU利用しようとすることを思い出してください。しかしながら、コンテナは約1 CPUしか使用することができません。コンテナが制限よりも多くのCPUリソースを利用しようとしているため、コンテナのCPUの利用が抑制されています。

{{< note >}}
CPUの使用量が1.0未満である理由の可能性して、ノードに利用可能なCPUリソースが十分にないことが挙げられます。この練習における必要条件として、クラスターに少なくとも利用可能な1 CPUが必要であることを思い出してください。1 CPUのノード上でコンテナを実行させる場合、指定したコンテナのCPU制限にかかわらず、コンテナは1 CPU以上使用することはできません。
{{< /note >}}

## CPUの単位

CPUリソースは *CPU* の単位で示されます。Kubernetesにおいて1つのCPUは次に等しくなります:

* 1 AWS vCPU
* 1 GCPコア
* 1 Azure vCore
* ハイパースレッディングが有効なベアメタルIntelプロセッサーの1スレッド

小数値も利用可能です。0.5 CPUを要求するコンテナには、1 CPUを要求するコンテナの半分のCPUが与えられます。mというミリを表す接尾辞も使用できます。たとえば、100m CPU、100 milliCPU、0.1 CPUはすべて同じです。1m以上の精度は指定できません。

CPUはつねに絶対量として要求され、決して相対量としては要求されません。0.1はシングルコア、デュアルコア、48コアCPUのマシンで同じ量となります。

Podを削除してください:

```shell
kubectl delete pod cpu-demo --namespace=cpu-example
```

## ノードよりも大きいCPU要求を指定する

CPU要求と制限はコンテナと関連づけられていますが、PodにCPU要求と制限が与えられていると考えるとわかりやすいでしょう。PodのCPU要求は、Pod内のすべてのコンテナのCPU要求の合計となります。同様に、PodのCPU制限は、Pod内のすべてのコンテナのCPU制限の合計となります。

Podのスケジューリングはリソースの要求量に基づいています。Podはノード上で動作するうえで、そのCPU要求に対してノードに十分利用可能なCPUリソースがある場合のみスケジュールされます。

この練習では、クラスター内のノードのキャパシティを超える大きさのCPU要求を与えたPodを作成します。以下に100 CPUの要求を与えた一つのコンテナを持つ、Podの設定ファイルを示します。これは、クラスター内のノードのキャパシティを超える可能性があります。

{{< codenew file="pods/resource/cpu-request-limit-2.yaml" >}}

Podを作成してください:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit-2.yaml --namespace=cpu-example
```

Podの状態を確認してください:

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

この出力では、Podのステータスが待機中であることを示しています。つまり、Podがどのノードに対しても実行するようスケジュールされておらず、いつまでも待機状態のままであることを表しています:

```
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

イベントを含むPodの詳細な情報を確認してください:


```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```


この出力では、ノードのCPU不足のためコンテナがスケジュールされないことを示しています:


```
Events:
  Reason                        Message
  ------                        -------
  FailedScheduling      No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```

Podを削除してください:

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```

## CPU制限を指定しない場合

コンテナのCPU制限を指定しない場合、次のいずれかの状態となります:

* コンテナのCPUリソースの使用量に上限がない状態となります。コンテナは実行中のノードで利用可能なすべてのCPUを使用できます。

* CPU制限を与えられたnamespaceでコンテナを実行されると、コンテナにはデフォルトの制限値が自動的に指定されます。クラスターの管理者は[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)によってCPU制限のデフォルト値を指定できます。

## CPU要求と制限のモチベーション

クラスターで動作するコンテナにCPU要求と制限を設定することで、クラスターのノードで利用可能なCPUリソースを効率的に使用することができます。PodのCPU要求を低く保つことで、Podがスケジュールされやすくなります。CPU要求よりも大きい制限を与えることで、次の2つを実現できます:

* Podは利用可能なCPUリソースを、突発的な活動(バースト)に使用することができます。
* バースト中のPodのCPUリソース量は、適切な量に制限されます。


## クリーンアップ

namespaceを削除してください:

```shell
kubectl delete namespace cpu-example
```



## {{% heading "whatsnext" %}}



### アプリケーション開発者向け

* [コンテナおよびPodへのメモリーリソースの割り当て](/ja/docs/tasks/configure-pod-container/assign-memory-resource/)

* [PodのQuality of Serviceを設定する](/docs/tasks/configure-pod-container/quality-service-pod/)

### クラスター管理者向け

* [Namespaceにメモリー要求および制限のデフォルト値を設定する](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [NamespaceにCPU要求および制限のデフォルト値を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Namespaceに最小および最大メモリー量の制約を設定する](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Namespaceに最小および最大のCPU使用量の制約を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [NamespaceにメモリーおよびCPUのクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [NamespaceにPodのクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [APIオブジェクトのクォータを設定する](/docs/tasks/administer-cluster/quota-api-object/)


