---
title: Namespaceの最小および最大CPU制約を設定する
content_type: task
weight: 40
---


<!-- overview -->

このページでは、コンテナとPodが{{< glossary_tooltip text="Namespace" term_id="namespace" >}}内で使用するCPUリソースの最小値と最大値を設定する方法を説明します。
最小および最大のCPU値は[LimitRange](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)オブジェクトで指定します。
PodがそのLimitRangeによって課される制約を満たさない場合、そのNamespace内ではPodを作成できません。




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

クラスター内でNamespaceを作成できる権限が必要です。

クラスター内の各Nodeには、Pod用に少なくとも1.0 CPUが利用可能である必要があります。
Kubernetesにおける「1 CPU」の意味については、[CPUの意味](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)を参照してください。


<!-- steps -->

## Namespaceの作成 {#create-a-namespace}

この演習で作成するリソースをクラスター内の他のリソースから分離するために、Namespaceを作成します。

```shell
kubectl create namespace constraints-cpu-example
```

## LimitRangeとPodの作成 {#create-a-limitrange-and-a-pod}


次に、例として{{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}のマニフェストを示します。

{{% code_sample file="admin/resource/cpu-constraints.yaml" %}}

LimitRangeを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints.yaml --namespace=constraints-cpu-example
```

LimitRangeの詳細情報を表示します:

```shell
kubectl get limitrange cpu-min-max-demo-lr --output=yaml --namespace=constraints-cpu-example
```

出力には、期待どおり最小および最大のCPU制約が表示されます。
ただし、LimitRangeの設定ファイルでデフォルト値を指定していないにもかかわらず、それらの値が自動的に作成されている点に注目してください。

```yaml
limits:
- default:
    cpu: 800m
  defaultRequest:
    cpu: 800m
  max:
    cpu: 800m
  min:
    cpu: 200m
  type: Container
```

これで、constraints-cpu-example Namespace内でPodを作成するたびに(またはKubernetes APIの別のクライアントが同等のPodを作成するたびに)、Kubernetesは次の手順を実行します:

* そのPod内のコンテナがCPUリクエストやCPU制限を指定していない場合、コントロールプレーンはそのコンテナにデフォルトのCPUリクエストとCPU制限を割り当てます。

* そのPod内のすべてのコンテナが、200ミリCPU以上のCPUリクエストを指定していることを検証します。

* そのPod内のすべてのコンテナが、800ミリCPU以下のCPU制限を指定していることを検証します。

{{< note >}}
`LimitRange`オブジェクトを作成するときには、HugePagesやGPUに対する制限も指定できます。
ただし、これらのリソースに対して`default`と`defaultRequest`の両方を指定する場合は、2つの値を同じにする必要があります。
{{< /note >}}

コンテナを1つ持つPodのマニフェストを次に示します。
このコンテナのマニフェストでは、CPU要求が500ミリCPU、CPU制限が800ミリCPUとして指定されています。
これらは、このNamespaceのLimitRangeによって課される最小および最大のCPU制約を満たしています。

{{% code_sample file="admin/resource/cpu-constraints-pod.yaml" %}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod.yaml --namespace=constraints-cpu-example
```

Podが実行中であり、そのコンテナが正常であることを検証します:

```shell
kubectl get pod constraints-cpu-demo --namespace=constraints-cpu-example
```

Podの詳細情報を表示します:

```shell
kubectl get pod constraints-cpu-demo --output=yaml --namespace=constraints-cpu-example
```

出力には、Pod内の唯一のコンテナがCPUリクエストとして500ミリCPU、CPU制限として800ミリCPUを持っていることが示されています。
これらは、LimitRangeによって課されている制約を満たしています。

```yaml
resources:
  limits:
    cpu: 800m
  requests:
    cpu: 500m
```

## Podを削除する {#delete-the-pod}

```shell
kubectl delete pod constraints-cpu-demo --namespace=constraints-cpu-example
```

## 最大CPU制約を超えるPodを作成する試み{#attempt-to-create-a-pod-that-exceeds-the-maximum-cpu-constraint}

コンテナを1つ持つPodのマニフェストを次に示します。
このコンテナでは、CPUリクエストを500ミリCPU、CPU制限を1.5 CPUとして指定しています。

{{% code_sample file="admin/resource/cpu-constraints-pod-2.yaml" %}}

このPodを作成を試みます。

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-2.yaml --namespace=constraints-cpu-example
```

出力から、このPodが作成されていないことがわかります。
これは、許容されないコンテナが定義されているためです。
このコンテナは、CPU制限が大きすぎるために許容されません:

```
Error from server (Forbidden): error when creating "examples/admin/resource/cpu-constraints-pod-2.yaml":
pods "constraints-cpu-demo-2" is forbidden: maximum cpu usage per Container is 800m, but limit is 1500m.
```

## 最小CPUリクエストを満たさないPodを作成する試み{#attempt-to-create-a-pod-that-does-not-meet-the-minimum-cpu-request}

コンテナを1つ持つPodのマニフェストを次に示します。
このコンテナでは、CPUリクエストを100ミリCPU、CPU制限を800ミリCPUとして指定しています。

{{% code_sample file="admin/resource/cpu-constraints-pod-3.yaml" %}}

このPodの作成を試みます。

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-3.yaml --namespace=constraints-cpu-example
```

出力から、このPodが作成されていないことがわかります。
これは、許容されないコンテナが定義されているためです。
このコンテナは、強制されている最小値よりも低いCPUリクエストを指定しているために許容されません:

```
Error from server (Forbidden): error when creating "examples/admin/resource/cpu-constraints-pod-3.yaml":
pods "constraints-cpu-demo-3" is forbidden: minimum cpu usage per Container is 200m, but request is 100m.
```

## CPUリクエストや制限を指定しないPodを作成する試み{#create-a-pod-that-does-not-specify-any-cpu-request-or-limit}

次に、CPUリクエストもCPU制限も一切指定しないPodを作成する例を見てみます。
コンテナを1つ持つPodのマニフェストを次に示します。
このコンテナでは、CPUリクエストもCPU制限も指定していません。

{{% code_sample file="admin/resource/cpu-constraints-pod-4.yaml" %}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-4.yaml --namespace=constraints-cpu-example
```

Podの詳細情報を表示します:

```
kubectl get pod constraints-cpu-demo-4 --namespace=constraints-cpu-example --output=yaml
```

出力から、このPod内の1つだけのコンテナが、CPUリクエストとして800ミリCPU、CPU制限として800ミリCPUを持っていることがわかります。
では、このコンテナはどのようにしてこれらの値を持つようになったのでしょうか。

```yaml
resources:
  limits:
    cpu: 800m
  requests:
    cpu: 800m
```

このコンテナ自身ではCPUリクエストとCPU制限を指定していないため、コントロールプレーンはこのNamespaceのLimitRangeに設定されている[デフォルトのCPUリクエストとCPU制限](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)を適用しました。

この時点で、あなたのPodが実行されている場合もあれば、されていない場合もあります。
このタスクの前提条件として、各Nodeで少なくとも1 CPUが使用可能である必要がある点を思い出してください。
各Nodeが1 CPUしか持たない場合、どのNodeにも800ミリCPUのリクエストを満たすだけの割り当て可能なCPUがない可能性があります。
一方で、2 CPUを持つNodeを使用している場合は、800ミリCPUのリクエストを満たすのに十分なCPUを確保できる可能性が高いでしょう。

Podを削除します:

```
kubectl delete pod constraints-cpu-demo-4 --namespace=constraints-cpu-example
```

## 最小および最大CPU制約の適用{#enforcement-of-minimum-and-maximum-cpu-constraints}

最小および最大のCPU制約は、LimitRangeによってNamespaceに対して課されますが、それらが適用されるのはPodが作成または更新されるときだけです。
LimitRangeを変更しても、すでに作成済みのPodには影響しません。

## 最小および最大CPU制約を設定する理由{#motivation-for-minimum-and-maximum-cpu-constraints}

クラスター管理者として、あなたはPodが使用できるCPUリソースに制限を設けたい場合があります。
例えば:

* クラスター内の各Nodeが2 CPUを持っている場合。この場合、2 CPUを超えてリクエストするPodは受け入れたくありません。なぜならクラスター内のどのNodeもそのリクエストを満たすことができないためです。

* 1つのクラスターを本番部門と開発部門で共有している場合。本番ワークロードには最大3 CPUまで使用できるようにし、一方で開発ワークロードは1 CPUに制限したいとします。この場合、本番用と開発用に別々のNamespaceを作成し、それぞれのNamespaceに対してCPU制約を適用します。

## クリーンアップ {#clean-up}

Namespaceを削除します:

```shell
kubectl delete namespace constraints-cpu-example
```



## {{% heading "whatsnext" %}}

### クラスター管理者向け {#for-cluster-administrators}

* [Namespaceのデフォルトのメモリー要求と制限を設定する](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [NamespaceのデフォルトCPU要求と制限を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [Namespaceに対する最小および最大メモリー制約の構成](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [NamespaceのメモリーおよびCPUクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [NamespaceのPodクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [APIオブジェクトのクォータを設定する](/docs/tasks/administer-cluster/quota-api-object/)

### アプリケーション開発者向け {#for-app-developers}

* [コンテナおよびPodへのメモリーリソースの割り当て](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [コンテナおよびPodへのCPUリソースの割り当て](/docs/tasks/configure-pod-container/assign-cpu-resource/)
* [PodレベルのCPUおよびメモリーリソースの割り当て](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
* [PodにQuality of Serviceを設定する](/docs/tasks/configure-pod-container/quality-service-pod/)
