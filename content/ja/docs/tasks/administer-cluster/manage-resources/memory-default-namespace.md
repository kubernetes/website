---
title: ネームスペースのデフォルトのメモリ要求と制限を設定する
content_type: task
weight: 10
---

<!-- overview -->

このページでは、ネームスペースのデフォルト・メモリ要求と制限を設定する方法を説明します。
デフォルトのメモリ制限を持つネームスペースにコンテナが作成され、コンテナが独自のメモリ制限を指定しない場合、コンテナにはデフォルトのメモリ制限が割り当てられます。
Kubernetesは、このトピックで後ほど説明する特定の条件下で、デフォルトのメモリ要求を割り当てます。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

クラスターの各ノードには、最低でも2GiBのメモリが必要です。



<!-- steps -->

## ネームスペースの作成

この演習で作成したリソースがクラスターの他の部分から分離されるように、ネームスペースを作成します。

```shell
kubectl create namespace default-mem-example
```

## LimitRangeとPodの作成

以下は、LimitRangeの設定ファイルです。デフォルトのメモリ要求とデフォルトのメモリ制限を指定しています。

{{< codenew file="admin/resource/memory-defaults.yaml" >}}

default-mem-exampleネームスペースにLimitRangeを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults.yaml --namespace=default-mem-example
```

default-mem-example名前空間でコンテナを作成し、コンテナがメモリ要求とメモリ制限の値を独自に指定しない場合、コンテナにはデフォルトのメモリ要求256MiBとデフォルトのメモリ制限512MiBが与えられます。
以下は、コンテナを1つ持つPodの設定ファイルです。コンテナは、メモリ要求とメモリ制限を指定していません。

{{< codenew file="admin/resource/memory-defaults-pod.yaml" >}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod.yaml --namespace=default-mem-example
```

Podの詳細情報を表示します:

```shell
kubectl get pod default-mem-demo --output=yaml --namespace=default-mem-example
```

出力はPodのコンテナのメモリ要求が256MiBで、メモリ制限が512MiBであることを示しています。
これらはLimitRangeで指定されたデフォルト値です。

```shell
containers:
- image: nginx
  imagePullPolicy: Always
  name: default-mem-demo-ctr
  resources:
    limits:
      memory: 512Mi
    requests:
      memory: 256Mi
```

Podを削除します:

```shell
kubectl delete pod default-mem-demo --namespace=default-mem-example
```

## What if you specify a Container's limit, but not its request?

Here's the configuration file for a Pod that has one Container. The Container
specifies a memory limit, but not a request:

{{< codenew file="admin/resource/memory-defaults-pod-2.yaml" >}}

Create the Pod:


```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-2.yaml --namespace=default-mem-example
```

View detailed information about the Pod:

```shell
kubectl get pod default-mem-demo-2 --output=yaml --namespace=default-mem-example
```

The output shows that the Container's memory request is set to match its memory limit.
Notice that the Container was not assigned the default memory request value of 256Mi.

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

## What if you specify a Container's request, but not its limit?

Here's the configuration file for a Pod that has one Container. The Container
specifies a memory request, but not a limit:

{{< codenew file="admin/resource/memory-defaults-pod-3.yaml" >}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-defaults-pod-3.yaml --namespace=default-mem-example
```

View the Pod's specification:

```shell
kubectl get pod default-mem-demo-3 --output=yaml --namespace=default-mem-example
```

The output shows that the Container's memory request is set to the value specified in the
Container's configuration file. The Container's memory limit is set to 512Mi, which is the
default memory limit for the namespace.

```
resources:
  limits:
    memory: 512Mi
  requests:
    memory: 128Mi
```

## Motivation for default memory limits and requests

If your namespace has a resource quota,
it is helpful to have a default value in place for memory limit.
Here are two of the restrictions that a resource quota imposes on a namespace:

* Every Container that runs in the namespace must have its own memory limit.
* The total amount of memory used by all Containers in the namespace must not exceed a specified limit.

If a Container does not specify its own memory limit, it is given the default limit, and then
it can be allowed to run in a namespace that is restricted by a quota.

## Clean up

Delete your namespace:

```shell
kubectl delete namespace default-mem-example
```



## {{% heading "whatsnext" %}}


### For cluster administrators

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)




