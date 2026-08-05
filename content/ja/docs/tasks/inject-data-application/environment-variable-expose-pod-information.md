---
title: 環境変数によりコンテナにPod情報を共有する
content_type: task
weight: 30
---

<!-- overview -->

このページでは、Podが内部で実行しているコンテナに自身の情報を共有する方法を説明します。環境変数ではPodのフィールドとコンテナのフィールドを共有することができます。




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## Downward API {#the-downward-api}

Podとコンテナのフィールドを実行中のコンテナに共有する方法は2つあります:

* 環境変数
* [ボリュームファイル](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#the-downward-api)

これら2つの方法を合わせて、Podとコンテナフィールドを共有する方法を*Downward API*と呼びます。


## Podフィールドを環境変数の値として使用する {#use-pod-fields-as-values-for-environment-variables}

この演習では、1つのコンテナを持つPodを作成します。Podの設定ファイルは次のとおりです:

{{% codenew file="pods/inject/dapi-envars-pod.yaml" %}}

設定ファイルには、5つの環境変数があります。`env`フィールドは[EnvVars](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)の配列です。配列の最初の要素では、環境変数`MY_NODE_NAME`の値をPodの`spec.nodeName`フィールドから取得することを指定します。同様に、他の環境変数もPodのフィールドから名前を取得します。

{{< note >}}
この例のフィールドはPodのフィールドです。これらはPod内のコンテナのフィールドではありません。
{{< /note >}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-pod.yaml
```

Podのコンテナが実行されていることを確認します:

```shell
kubectl get pods
```

コンテナのログを表示します:

```shell
kubectl logs dapi-envars-fieldref
```

出力には、選択した環境変数の値が表示されます:

```
minikube
dapi-envars-fieldref
default
172.17.0.4
default
```

これらの値がログにある理由を確認するには、設定ファイルの`command`および`args`フィールドを確認してください。コンテナが起動すると、5つの環境変数の値が標準出力に書き込まれます。これを10秒ごとに繰り返します。

次に、Podで実行しているコンテナへのシェルを取得します:

```shell
kubectl exec -it dapi-envars-fieldref -- sh
```

シェルで環境変数を表示します:

```shell
/# printenv
```

出力は、特定の環境変数にPodフィールドの値が割り当てられていることを示しています:

```
MY_POD_SERVICE_ACCOUNT=default
...
MY_POD_NAMESPACE=default
MY_POD_IP=172.17.0.4
...
MY_NODE_NAME=minikube
...
MY_POD_NAME=dapi-envars-fieldref
```

## コンテナフィールドを環境変数の値として使用する {#use-container-fields-as-values-for-environment-variables}

前の演習では、環境変数の値としてPodフィールドを使用しました。次の演習では、環境変数の値としてコンテナフィールドを使用します。これは、1つのコンテナを持つPodの設定ファイルです:

{{% codenew file="pods/inject/dapi-envars-container.yaml" %}}

設定ファイルには、4つの環境変数があります。`env`フィールドは[EnvVars](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)の配列です。配列の最初の要素では、環境変数`MY_CPU_REQUEST`の値を`test-container`という名前のコンテナの`requests.cpu`フィールドから取得することを指定します。同様に、他の環境変数もコンテナのフィールドから値を取得します。

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-container.yaml
```

Podのコンテナが実行されていることを確認します:

```shell
kubectl get pods
```

コンテナのログを表示します:

```shell
kubectl logs dapi-envars-resourcefieldref
```

出力には、選択した環境変数の値が表示されます:

```
1
1
33554432
67108864
```



## {{% heading "whatsnext" %}}


* [コンテナの環境変数の定義](/ja/docs/tasks/inject-data-application/define-environment-variable-container/)
* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)


