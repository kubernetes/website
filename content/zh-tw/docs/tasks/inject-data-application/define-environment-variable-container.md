---
title: 為容器設定環境變數
content_type: task
weight: 20
---

<!--
title: Define Environment Variables for a Container
content_type: task
weight: 20
-->

<!-- overview -->

<!--
This page shows how to define environment variables for a container
in a Kubernetes Pod. 
-->
本頁將展示如何為 kubernetes Pod 下的容器設定環境變數。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Define an environment variable for a container
-->
## 為容器設定一個環境變數

<!--
When you create a Pod, you can set environment variables for the containers
that run in the Pod. To set environment variables, include the `env` or
`envFrom` field in the configuration file.
-->
建立 Pod 時，可以為其下的容器設定環境變數。透過配置檔案的 `env` 或者 `envFrom` 欄位來設定環境變數。

<!--
In this exercise, you create a Pod that runs one container. The configuration
file for the Pod defines an environment variable with name `DEMO_GREETING` and
value `"Hello from the environment"`. Here is the configuration manifest for the
Pod:
-->
本示例中，將建立一個只包含單個容器的 Pod。Pod 的配置檔案中設定環境變數的名稱為 `DEMO_GREETING`，
其值為 `"Hello from the environment"`。下面是 Pod 的配置清單：

{{< codenew file="pods/inject/envars.yaml" >}}

<!--
1. Create a Pod based on that manifest:
-->
1. 基於配置清單建立一個 Pod：

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/inject/envars.yaml
    ```

<!--
1. List the running Pods:
-->
2. 獲取一下當前正在執行的 Pods 資訊：

    ```shell
    kubectl get pods -l purpose=demonstrate-envars
    ```

    <!--
    The output is similar to this:
    -->
    查詢結果應為：

    ```
    NAME            READY     STATUS    RESTARTS   AGE
    envar-demo      1/1       Running   0          9s
    ```

<!--
1. List the Pod's container environment variables:
-->
3. 列出 Pod 容器的環境變數：

    ```shell
    kubectl exec envar-demo -- printenv
    ```
    
    <!--
    The output is similar to this:
    -->
    列印結果應為：

    ```
    NODE_VERSION=4.4.2
    EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
    HOSTNAME=envar-demo
    ...
    DEMO_GREETING=Hello from the environment
    DEMO_FAREWELL=Such a sweet sorrow
    ```

<!--
{{< note >}}
The environment variables set using the `env` or `envFrom` field
override any environment variables specified in the container image.
{{< /note >}}
-->
{{< note >}}
透過 `env` 或 `envFrom` 欄位設定的環境變數將覆蓋容器映象中指定的所有環境變數。
{{< /note >}}

<!--
{{< note >}}
Environment variables may reference each other, however ordering is important.
Variables making use of others defined in the same context must come later in
the list. Similarly, avoid circular references.
{{< /note >}}
-->
{{< note >}}
環境變數可以互相引用，但是順序很重要。
使用在相同上下文中定義的其他變數的變數必須在列表的後面。
同樣，請避免使用迴圈引用。
{{< /note >}}

<!--
## Using environment variables inside of your config

Environment variables that you define in a Pod's configuration can be used
elsewhere in the configuration, for example in commands and arguments that
you set for the Pod's containers.
In the example configuration below, the `GREETING`, `HONORIFIC`, and
`NAME` environment variables are set to `Warm greetings to`, `The Most
Honorable`, and `Kubernetes`, respectively. Those environment variables
are then used in the CLI arguments passed to the `env-print-demo`
container.
-->
## 在配置中使用環境變數

你在 Pod 的配置中定義的環境變數可以在配置的其他地方使用，
例如可用在為 Pod 的容器設定的命令和引數中。
在下面的示例配置中，環境變數 `GREETING` ，`HONORIFIC` 和 `NAME` 分別設定為 `Warm greetings to` ，
`The Most Honorable` 和 `Kubernetes`。然後這些環境變數在傳遞給容器 `env-print-demo` 的 CLI 引數中使用。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: print-greeting
spec:
  containers:
  - name: env-print-demo
    image: bash
    env:
    - name: GREETING
      value: "Warm greetings to"
    - name: HONORIFIC
      value: "The Most Honorable"
    - name: NAME
      value: "Kubernetes"
    command: ["echo"]
    args: ["$(GREETING) $(HONORIFIC) $(NAME)"]
```

<!--
Upon creation, the command `echo Warm greetings to The Most Honorable Kubernetes` is run on the container.
-->
建立後，命令 `echo Warm greetings to The Most Honorable Kubernetes` 將在容器中執行。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Learn about [using secrets as environment variables](/docs/user-guide/secrets/#using-secrets-as-environment-variables).
* See [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).
-->

* 進一步瞭解[環境變數](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* 進一步瞭解[透過環境變數來使用 Secret](/zh-cn/docs/concepts/configuration/secret/#using-secrets-as-environment-variables)
* 關於 [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core) 資源的資訊。

