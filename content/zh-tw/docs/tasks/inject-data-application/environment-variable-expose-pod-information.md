---
title: 透過環境變數將 Pod 資訊呈現給容器
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
about itself to Containers running in the Pod. Environment variables can expose
Pod fields and Container fields.
-->
此頁面展示 Pod 如何使用環境變數把自己的資訊呈現給 Pod 中執行的容器。
環境變數可以呈現 Pod 的欄位和容器欄位。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Downward API

<!--
There are two ways to expose Pod and Container fields to a running Container:

* Environment variables
* [Volume Files](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#the-downward-api)

Together, these two ways of exposing Pod and Container fields are called the
*Downward API*.
-->

有兩種方式可以將 Pod 和 Container 欄位呈現給執行中的容器：

* 環境變數
* [卷檔案](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#the-downward-api)

這兩種呈現 Pod 和 Container 欄位的方式統稱為 *Downward API*。

<!--
## Use Pod fields as values for environment variables

In this exercise, you create a Pod that has one Container. Here is the
configuration file for the Pod:
-->
## 用 Pod 欄位作為環境變數的值

在這個練習中，你將建立一個包含一個容器的 Pod。這是該 Pod 的配置檔案：

{{< codenew file="pods/inject/dapi-envars-pod.yaml" >}}

<!--
In the configuration file, you can see five environment variables. The `env`
field is an array of
[EnvVars](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core).
The first element in the array specifies that the `MY_NODE_NAME` environment
variable gets its value from the Pod's `spec.nodeName` field. Similarly, the
other environment variables get their names from Pod fields.
-->
這個配置檔案中，你可以看到五個環境變數。`env` 欄位是一個
[EnvVars](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core).
物件的陣列。
陣列中第一個元素指定 `MY_NODE_NAME` 這個環境變數從 Pod 的 `spec.nodeName` 欄位獲取變數值。
同樣，其它環境變數也是從 Pod 的欄位獲取它們的變數值。

<!--
The fields in this example are Pod fields. They are not fields of the
Container in the Pod.
-->
{{< note >}}
本示例中的欄位是 Pod 欄位，不是 Pod 中 Container 的欄位。
{{< /note >}}

<!--
Create the Pod:
-->
建立Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-pod.yaml
```

<!--
Verify that the Container in the Pod is running:
-->
驗證 Pod 中的容器執行正常：

```
kubectl get pods
```

<!--
View the Container's logs:
-->
檢視容器日誌：

```
kubectl logs dapi-envars-fieldref
```

<!--
The output shows the values of selected environment variables:
-->
輸出資訊顯示了所選擇的環境變數的值：

```
minikube
dapi-envars-fieldref
default
172.17.0.4
default
```

<!--
To see why these values are in the log, look at the `command` and `args` fields
in the configuration file. When the Container starts, it writes the values of
five environment variables to stdout. It repeats this every ten seconds.

Next, get a shell into the Container that is running in your Pod:
-->
要了解為什麼這些值在日誌中，請檢視配置檔案中的`command` 和 `args`欄位。
當容器啟動時，它將五個環境變數的值寫入 stdout。每十秒重複執行一次。

接下來，透過開啟一個 Shell 進入 Pod 中執行的容器：

```
kubectl exec -it dapi-envars-fieldref -- sh
```

<!--
In your shell, view the environment variables:
-->
在 Shell 中，檢視環境變數：

```
/# printenv
```

<!--
The output shows that certain environment variables have been assigned the
values of Pod fields:
-->
輸出資訊顯示環境變數已經設定為 Pod 欄位的值。

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
## Use Container fields as values for environment variables

In the preceding exercise, you used Pod fields as the values for environment
variables. In this next exercise, you use Container fields as the values for
environment variables. Here is the configuration file for a Pod that has one
container:
-->
## 用 Container 欄位作為環境變數的值

前面的練習中，你將 Pod 欄位作為環境變數的值。
接下來這個練習中，你將用 Container 欄位作為環境變數的值。這裡是包含一個容器的 Pod 的配置檔案：

{{< codenew file="pods/inject/dapi-envars-container.yaml" >}}

<!--
In the configuration file, you can see four environment variables. The `env`
field is an array of
[EnvVars](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core).
The first element in the array specifies that the `MY_CPU_REQUEST` environment
variable gets its value from the `requests.cpu` field of a Container named
`test-container`. Similarly, the other environment variables get their values
from Container fields.

The fields in this example are Pod fields. They are not fields of the
Container in the Pod.

Create the Pod:
-->
這個配置檔案中，你可以看到四個環境變數。`env` 欄位是一個
[EnvVars](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core).
物件的陣列。陣列中第一個元素指定 `MY_CPU_REQUEST` 這個環境變數從 Container 的 `requests.cpu`
欄位獲取變數值。同樣，其它環境變數也是從 Container 的欄位獲取它們的變數值。

{{< note >}}
本例中使用的是 Container 的欄位而不是 Pod 的欄位。
{{< /note >}}

建立Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-container.yaml
```

<!--
Verify that the Container in the Pod is running:
-->
驗證 Pod 中的容器執行正常：

```
kubectl get pods
```

<!--
View the Container's logs:
-->
檢視容器日誌：

```
kubectl logs dapi-envars-resourcefieldref
```

<!--
The output shows the values of selected environment variables:
-->
輸出資訊顯示了所選擇的環境變數的值：

```
1
1
33554432
67108864
```

## {{% heading "whatsnext" %}}

<!--
* [Defining Environment Variables for a Container](/docs/tasks/inject-data-application/define-environment-variable-container/)
* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
-->

* [給容器定義環境變數](/zh-cn/docs/tasks/inject-data-application/define-environment-variable-container/)
* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)

