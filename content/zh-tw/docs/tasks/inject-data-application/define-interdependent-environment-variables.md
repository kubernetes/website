---
title: 定義相互依賴的環境變數
content_type: task
weight: 20
---
<!-- 
title: Define Dependent Environment Variables
-->

<!-- overview -->

<!-- 
This page shows how to define dependent environment variables for a container
in a Kubernetes Pod.
-->
本頁展示瞭如何為 Kubernetes Pod 中的容器定義相互依賴的環境變數。

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}


<!-- steps -->

<!-- 
## Define an environment dependent variable for a container

When you create a Pod, you can set dependent environment variables for the containers that run in the Pod. To set dependent environment variables, you can use $(VAR_NAME) in the `value` of `env` in the configuration file.

In this exercise, you create a Pod that runs one container. The configuration
file for the Pod defines a dependent environment variable with common usage defined. Here is the configuration manifest for the
Pod:
-->
## 為容器定義相互依賴的環境變數   {#define-an-environment-dependent-variable-for-a-container}

當建立一個 Pod 時，你可以為執行在 Pod 中的容器設定相互依賴的環境變數。 
設定相互依賴的環境變數，你就可以在配置清單檔案的 `env` 的 `value` 中使用 $(VAR_NAME)。

在本練習中，你會建立一個單容器的 Pod。
此 Pod 的配置檔案定義了一個已定義常用用法的相互依賴的環境變數。
下面是 Pod 的配置清單：

{{< codenew file="pods/inject/dependent-envars.yaml" >}}

<!-- 1. Create a Pod based on that manifest: -->
1. 依據清單建立 Pod：
    ```shell
    kubectl apply -f https://k8s.io/examples/pods/inject/dependent-envars.yaml
    ```
    ```
    pod/dependent-envars-demo created
    ```
    <!-- 2. List the running Pods: -->
2. 列出執行的 Pod：

    ```shell
    kubectl get pods dependent-envars-demo
    ```
    ```
    NAME                      READY     STATUS    RESTARTS   AGE
    dependent-envars-demo     1/1       Running   0          9s
    ```

    <!-- 3. Check the logs for the container running in your Pod: -->
3. 檢查 Pod 中執行容器的日誌：

    ```shell
    kubectl logs pod/dependent-envars-demo
    ```
    ```

    UNCHANGED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
    SERVICE_ADDRESS=https://172.17.0.1:80
    ESCAPED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
    ```

<!-- 
As shown above, you have defined the correct dependency reference of `SERVICE_ADDRESS`, bad dependency reference of `UNCHANGED_REFERENCE` and skip dependent references of `ESCAPED_REFERENCE`.

When an environment variable is already defined when being referenced,
the reference can be correctly resolved, such as in the `SERVICE_ADDRESS` case.
-->
如上所示，你已經定義了 `SERVICE_ADDRESS` 的正確依賴引用，
`UNCHANGED_REFERENCE` 的錯誤依賴引用，
並跳過了 `ESCAPED_REFERENCE` 的依賴引用。

如果環境變數被引用時已事先定義，則引用可以正確解析，
比如 `SERVICE_ADDRESS` 的例子。

<!-- 
When the environment variable is undefined or only includes some variables, the undefined environment variable is treated as a normal string, such as `UNCHANGED_REFERENCE`. Note that incorrectly parsed environment variables, in general, will not block the container from starting.

The `$(VAR_NAME)` syntax can be escaped with a double `$`, ie: `$$(VAR_NAME)`.
Escaped references are never expanded, regardless of whether the referenced variable
is defined or not. This can be seen from the `ESCAPED_REFERENCE` case above.
-->
當環境變數未定義或僅包含部分變數時，未定義的變數會被當做普通字串對待，
比如 `UNCHANGED_REFERENCE` 的例子。
注意，解析不正確的環境變數通常不會阻止容器啟動。

`$(VAR_NAME)` 這樣的語法可以用兩個 `$` 轉義，既：`$$(VAR_NAME)`。
無論引用的變數是否定義，轉義的引用永遠不會展開。
這一點可以從上面 `ESCAPED_REFERENCE` 的例子得到印證。

## {{% heading "whatsnext" %}}


<!--
* Learn more about [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* See [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).
-->
* 進一步瞭解[環境變數](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* 參閱 [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).

