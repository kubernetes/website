---
title: コンテナおよびPodへのメモリーリソースの割り当て
content_type: task
weight: 10
---

<!-- overview -->

このページでは、メモリーの *要求* と *制限* をコンテナに割り当てる方法について示します。コンテナは要求されたメモリーを確保することを保証しますが、その制限を超えるメモリーの使用は許可されません。




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

クラスターの各ノードには、少なくとも300MiBのメモリーが必要になります。

このページのいくつかの手順では、クラスターにて[metrics-server](https://github.com/kubernetes-incubator/metrics-server)サービスを実行する必要があります。すでにmetrics-serverが動作している場合、これらの手順をスキップできます。

Minikubeを動作させている場合、以下のコマンドによりmetrics-serverを有効にできます:

```shell
minikube addons enable metrics-server
```

metrics-serverが実行されているか、もしくはリソースメトリクスAPI (`metrics.k8s.io`) の別のプロバイダが実行されていることを確認するには、以下のコマンドを実行してください:

```shell
kubectl get apiservices
```

リソースメトリクスAPIが利用可能であれば、出力には `metrics.k8s.io` への参照が含まれます。

```shell
NAME
v1beta1.metrics.k8s.io
```



<!-- steps -->

## namespaceの作成

この練習で作成するリソースがクラスター内で分離されるよう、namespaceを作成します。

```shell
kubectl create namespace mem-example
```

## メモリーの要求と制限を指定する

コンテナにメモリーの要求を指定するには、コンテナのリソースマニフェストに`resources:requests`フィールドを追記します。メモリーの制限を指定するには、`resources:limits`を追記します。

この練習では、一つのコンテナをもつPodを作成します。コンテナに100MiBのメモリー要求と200MiBのメモリー制限を与えます。Podの設定ファイルは次のようになります:

{{% codenew file="pods/resource/memory-request-limit.yaml" %}}

設定ファイルの`args`セクションでは、コンテナ起動時の引数を与えます。`"--vm-bytes", "150M"`という引数では、コンテナに150MiBのメモリーを割り当てます。

Podを作成してください:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit.yaml --namespace=mem-example
```

Podのコンテナが起動していることを検証してください:

```shell
kubectl get pod memory-demo --namespace=mem-example
```

Podの詳細な情報を確認してください:

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

この出力では、Pod内の一つのコンテナに100MiBのメモリー要求と200MiBのメモリー制限があることを示しています。

```yaml
...
resources:
  limits:
    memory: 200Mi
  requests:
    memory: 100Mi
...
```

`kubectl top`を実行し、Podのメトリクスを取得してください:

```shell
kubectl top pod memory-demo --namespace=mem-example
```

この出力では、Podが約162,900,000バイト(約150MiB)のメモリーを使用していることを示しています。Podの100MiBの要求を超えていますが、200MiBの制限には収まっています。

```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

Podを削除してください:

```shell
kubectl delete pod memory-demo --namespace=mem-example
```

## コンテナのメモリー制限を超える

ノードに利用可能なメモリーがある場合、コンテナはメモリー要求を超えることができます。しかしながら、メモリー制限を超えて使用することは許可されません。コンテナが制限を超えてメモリーを確保しようとした場合、そのコンテナは終了候補となります。コンテナが制限を超えてメモリーを消費し続ける場合、コンテナは終了されます。終了したコンテナを再起動できる場合、ほかのランタイムの失敗時と同様に、kubeletがコンテナを再起動させます。

この練習では、制限を超えてメモリーを確保しようとするPodを作成します。以下に50MiBのメモリー要求と100MiBのメモリー制限を与えたコンテナを持つ、Podの設定ファイルを示します:

{{% codenew file="pods/resource/memory-request-limit-2.yaml" %}}

設定ファイルの`args`セクションでは、コンテナに250MiBのメモリーを割り当てており、これは100MiBの制限を十分に超えています。

Podを作成してください:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-2.yaml --namespace=mem-example
```

Podの詳細な情報を確認してください:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

この時点で、コンテナは起動中か強制終了されているでしょう。コンテナが強制終了されるまで上記のコマンドをくり返し実行してください:

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

コンテナステータスの詳細な情報を取得してください:

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

この出力では、コンテナがメモリー不足 (OOM) により強制終了されたことを示しています。

```shell
lastState:
   terminated:
     containerID: docker://65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

この練習のコンテナはkubeletによって再起動されます。次のコマンドを数回くり返し実行し、コンテナが強制終了と再起動を続けていることを確認してください:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

この出力では、コンテナが強制終了され、再起動され、再度強制終了および再起動が続いていることを示しています:

```
kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          37s
```
```

kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-2   1/1       Running   2          40s
```

Podの履歴について詳細な情報を確認してください:

```
kubectl describe pod memory-demo-2 --namespace=mem-example
```

この出力では、コンテナの開始とその失敗が繰り返されていることを示しています:

```
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container
```

クラスターのノードの詳細な情報を確認してください:

```
kubectl describe nodes
```

この出力には、メモリー不足の状態のためコンテナが強制終了された記録が含まれます:

```
Warning OOMKilling Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

Podを削除してください:

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```

## ノードよりも大きいメモリー要求を指定する

メモリー要求と制限はコンテナと関連づけられていますが、Podにメモリー要求と制限が与えられていると考えるとわかりやすいでしょう。Podのメモリー要求は、Pod内のすべてのコンテナのメモリー要求の合計となります。同様に、Podのメモリー制限は、Pod内のすべてのコンテナのメモリー制限の合計となります。

Podのスケジューリングは要求に基づいています。Podはノード上で動作するうえで、そのメモリー要求に対してノードに十分利用可能なメモリーがある場合のみスケジュールされます。

この練習では、クラスター内のノードのキャパシティを超える大きさのメモリー要求を与えたPodを作成します。以下に1000GiBのメモリー要求を与えた一つのコンテナを持つ、Podの設定ファイルを示します。これは、クラスター内のノードのキャパシティを超える可能性があります。

{{% codenew file="pods/resource/memory-request-limit-3.yaml" %}}

Podを作成してください:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-3.yaml --namespace=mem-example
```
Podの状態を確認してください:

```shell
kubectl get pod memory-demo-3 --namespace=mem-example
```

この出力では、Podのステータスが待機中であることを示しています。つまり、Podがどのノードに対しても実行するようスケジュールされておらず、いつまでも待機状態のままであることを表しています:

```
kubectl get pod memory-demo-3 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-3   0/1       Pending   0          25s
```

イベントを含むPodの詳細な情報を確認してください:

```shell
kubectl describe pod memory-demo-3 --namespace=mem-example
```

この出力では、ノードのメモリー不足のためコンテナがスケジュールされないことを示しています:

```shell
Events:
  ...  Reason            Message
       ------            -------
  ...  FailedScheduling  No nodes are available that match all of the following predicates:: Insufficient memory (3).
```

## メモリーの単位

メモリーリソースはバイト単位で示されます。メモリーをE、P、T、G、M、K、Ei、Pi、Ti、Gi、Mi、Kiという接尾辞とともに、整数型または固定小数点整数で表現できます。たとえば、以下はおおよそ同じ値を表します:

```shell
128974848, 129e6, 129M , 123Mi
```

Podを削除してください:

```shell
kubectl delete pod memory-demo-3 --namespace=mem-example
```

## メモリー制限を指定しない場合

コンテナのメモリー制限を指定しない場合、次のいずれかの状態となります:

* コンテナのメモリー使用量に上限がない状態となります。コンテナは実行中のノードで利用可能なすべてのメモリーを使用でき、その後OOM Killerが呼び出される可能性があります。さらに、OOM killの場合、リソース制限のないコンテナは強制終了される可能性が高くなります。

* メモリー制限を与えられたnamespaceでコンテナを実行されると、コンテナにはデフォルトの制限値が自動的に指定されます。クラスターの管理者は[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)によってメモリー制限のデフォルト値を指定できます。

## メモリー要求と制限のモチベーション

クラスターで動作するコンテナにメモリー要求と制限を設定することで、クラスターのノードで利用可能なメモリーリソースを効率的に使用することができます。Podのメモリー要求を低く保つことで、Podがスケジュールされやすくなります。メモリー要求よりも大きい制限を与えることで、次の2つを実現できます:

* Podは利用可能なメモリーを、突発的な活動(バースト)に使用することができます。
* バースト中のPodのメモリー使用量は、適切な量に制限されます。

## クリーンアップ

namespaceを削除してください。これにより、今回のタスクで作成したすべてのPodが削除されます:

```shell
kubectl delete namespace mem-example
```



## {{% heading "whatsnext" %}}


### アプリケーション開発者向け

* [コンテナとPodにCPUリソースを割り当てる](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [PodのQuality of Serviceを設定する](/docs/tasks/configure-pod-container/quality-service-pod/)

### クラスター管理者向け

* [Namespaceにメモリー要求および制限のデフォルト値を設定する](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [NamespaceにCPU要求および制限のデフォルト値を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Namespaceに最小および最大メモリー量の制約を設定する](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Namespaceに最小および最大のCPU使用量の制約を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [NamespaceにメモリーおよびCPUのクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [NamespaceにPodのクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [APIオブジェクトのクォータを設定する](/docs/tasks/administer-cluster/quota-api-object/)





