---
title: 通過環境變量將 Pod 信息呈現給容器
content_type: task
weight: 30
---
<!--
title: Expose Pod Information to Containers Through Environment Variables
content_type: task
weight: 30
-->
<!-- overview -->

<!--
This page shows how a Pod can use environment variables to expose information
about itself to containers running in the Pod, using the _downward API_.
You can use environment variables to expose Pod fields, container fields, or both.
-->
此頁面展示 Pod 如何使用 **downward API** 通過環境變量把自身的信息呈現給 Pod 中運行的容器。
你可以使用環境變量來呈現 Pod 的字段、容器字段或兩者。

<!--
In Kubernetes, there are two ways to expose Pod and container fields to a running container:

* _Environment variables_, as explained in this task
* [Volume files](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Together, these two ways of exposing Pod and container fields are called the
downward API.

As Services are the primary mode of communication between containerized applications managed by Kubernetes, 
it is helpful to be able to discover them at runtime. 

Read more about accessing Services [here](/docs/tutorials/services/connect-applications-service/#accessing-the-service).
-->
在 Kubernetes 中有兩種方式可以將 Pod 和容器字段呈現給運行中的容器：

* 如本任務所述的**環境變量**
* [卷文件](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

這兩種呈現 Pod 和容器字段的方式統稱爲 downward API。

Service 是 Kubernetes 管理的容器化應用之間的主要通信模式，因此在運行時能發現這些 Service 是很有幫助的。

在[這裏](/zh-cn/docs/tutorials/services/connect-applications-service/#accessing-the-service)
閱讀更多關於訪問 Service 的信息。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Use Pod fields as values for environment variables

In this part of exercise, you create a Pod that has one container, and you
project Pod-level fields into the running container as environment variables.
-->
## 用 Pod 字段作爲環境變量的值   {#use-pod-fields-as-values-for-env-var}

在這部分練習中，你將創建一個包含一個容器的 Pod。並將 Pod 級別的字段作爲環境變量投射到正在運行的容器中。

{{% code_sample file="pods/inject/dapi-envars-pod.yaml" %}}

<!--
In that manifest, you can see five environment variables. The `env`
field is an array of
environment variable definitions.
The first element in the array specifies that the `MY_NODE_NAME` environment
variable gets its value from the Pod's `spec.nodeName` field. Similarly, the
other environment variables get their names from Pod fields.
-->
這個清單中，你可以看到五個環境變量。`env` 字段定義了一組環境變量。
數組中第一個元素指定 `MY_NODE_NAME` 這個環境變量從 Pod 的 `spec.nodeName` 字段獲取變量值。
同樣，其它環境變量也是從 Pod 的字段獲取它們的變量值。

{{< note >}}
<!--
The fields in this example are Pod fields. They are not fields of the
container in the Pod.
-->
本示例中的字段是 Pod 字段，不是 Pod 中 Container 的字段。
{{< /note >}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-pod.yaml
```

<!--
Verify that the Container in the Pod is running:
-->
驗證 Pod 中的容器運行正常：

```shell
# 如果新創建的 Pod 還是處於不健康狀態，請重新運行此命令幾次。
kubectl get pods
```

<!--
View the container's logs:
-->
查看容器日誌：

```shell
kubectl logs dapi-envars-fieldref
```

<!--
The output shows the values of selected environment variables:
-->
輸出信息顯示了所選擇的環境變量的值：

```
minikube
dapi-envars-fieldref
default
172.17.0.4
default
```

<!--
To see why these values are in the log, look at the `command` and `args` fields
in the configuration file. When the container starts, it writes the values of
five environment variables to stdout. It repeats this every ten seconds.

Next, get a shell into the container that is running in your Pod:
-->
要了解爲什麼這些值出現在日誌中，請查看配置文件中的 `command` 和 `args` 字段。
當容器啓動時，它將五個環境變量的值寫入標準輸出。每十秒重複執行一次。

接下來，進入 Pod 中運行的容器，打開一個 Shell：

```shell
kubectl exec -it dapi-envars-fieldref -- sh
```

<!--
In your shell, view the environment variables:
-->
在 Shell 中，查看環境變量：

```shell
# 在容器內的 `shell` 中運行
printenv
```

<!--
The output shows that certain environment variables have been assigned the
values of Pod fields:
-->
輸出信息顯示環境變量已經設置爲 Pod 字段的值。

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

<!--
## Use container fields as values for environment variables

In the preceding exercise, you used information from Pod-level fields as the values
for environment variables.
In this next exercise, you are going to pass fields that are part of the Pod
definition, but taken from the specific
[container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
rather than from the Pod overall.

Here is a manifest for another Pod that again has just one container:
-->
## 使用容器字段作爲環境變量的值    {#use-container-fields-as-value-for-env-var}

前面的練習中，你將 Pod 級別的字段作爲環境變量的值。
接下來這個練習中，你將傳遞屬於 Pod 定義的字段，但這些字段取自特定容器而不是整個 Pod。

這裏是只包含一個容器的 Pod 的清單：

{{% code_sample file="pods/inject/dapi-envars-container.yaml" %}}

<!--
In this manifest, you can see four environment variables. The `env`
field is an array of
environment variable definitions.
The first element in the array specifies that the `MY_CPU_REQUEST` environment
variable gets its value from the `requests.cpu` field of a container named
`test-container`. Similarly, the other environment variables get their values
from fields that are specific to this container.

Create the Pod:
-->
這個清單中，你可以看到四個環境變量。`env` 字段定義了一組環境變量。
數組中第一個元素指定 `MY_CPU_REQUEST` 這個環境變量從容器的 `requests.cpu`
字段獲取變量值。同樣，其它的環境變量也是從特定於這個容器的字段中獲取它們的變量值。

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-container.yaml
```

<!--
Verify that the container in the Pod is running:
-->
驗證 Pod 中的容器運行正常：

```shell
# 如果新創建的 Pod 還是處於不健康狀態，請重新運行此命令幾次。
kubectl get pods
```

<!--
View the container's logs:
-->
查看容器日誌：

```shell
kubectl logs dapi-envars-resourcefieldref
```

<!--
The output shows the values of selected environment variables:
-->
輸出信息顯示了所選擇的環境變量的值：

```
1
1
33554432
67108864
```

## {{% heading "whatsnext" %}}

<!--
* Read [Defining Environment Variables for a Container](/docs/tasks/inject-data-application/define-environment-variable-container/)
* Read the [`spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
  API definition for Pod. This includes the definition of Container (part of Pod).
* Read the list of [available fields](/docs/concepts/workloads/pods/downward-api/#available-fields) that you
  can expose using the downward API.
-->
* 閱讀[給容器定義環境變量](/zh-cn/docs/tasks/inject-data-application/define-environment-variable-container/)
* 閱讀 Pod 的 [`spec`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
  API 包括容器（Pod 的一部分）的定義。
* 閱讀可以使用 downward API 呈現的[可用字段](/zh-cn/docs/concepts/workloads/pods/downward-api/#available-fields)列表。

<!--
Read about Pods, containers and environment variables in the legacy API reference:

* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
-->
在舊版 API 參考中閱讀有關 Pod、容器和環境變量的信息：

* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
