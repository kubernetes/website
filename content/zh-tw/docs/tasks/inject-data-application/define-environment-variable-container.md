---
title: 爲容器設置環境變量
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
本頁將展示如何爲 Kubernetes Pod 下的容器設置環境變量。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Define an environment variable for a container
-->
## 爲容器設置一個環境變量   {#define-an-env-variable-for-a-container}

<!--
When you create a Pod, you can set environment variables for the containers
that run in the Pod. To set environment variables, include the `env` or
`envFrom` field in the configuration file.
-->
創建 Pod 時，可以爲其下的容器設置環境變量。通過設定文件的 `env` 或者 `envFrom` 字段來設置環境變量。

<!--
The `env` and `envFrom` fields have different effects.

`env`
: allows you to set environment variables for a container, specifying a value directly for each variable that you name.
-->
`env` 和 `envFrom` 字段具有不同的效果。

`env`
：可以爲容器設置環境變量，直接爲你所給的每個變量指定一個值。

<!--
`envFrom`
: allows you to set environment variables for a container by referencing either a ConfigMap or a Secret.
 When you use `envFrom`, all the key-value pairs in the referenced ConfigMap or Secret
 are set as environment variables for the container.
 You can also specify a common prefix string.
-->
`envFrom`
：你可以通過引用 ConfigMap 或 Secret 來設置容器的環境變量。
使用 `envFrom` 時，引用的 ConfigMap 或 Secret 中的所有鍵值對都被設置爲容器的環境變量。
你也可以指定一個通用的前綴字符串。

<!--
You can read more about [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables)
and [Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/#configure-all-key-value-pairs-in-a-secret-as-container-environment-variables).

This page explains how to use `env`.
-->
你可以閱讀有關 [ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables)
和 [Secret](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#configure-all-key-value-pairs-in-a-secret-as-container-environment-variables)
的更多信息。

本頁介紹如何使用 `env`。

<!--
In this exercise, you create a Pod that runs one container. The configuration
file for the Pod defines an environment variable with name `DEMO_GREETING` and
value `"Hello from the environment"`. Here is the configuration manifest for the
Pod:
-->
本示例中，將創建一個只包含單個容器的 Pod。此 Pod 的設定文件中設置環境變量的名稱爲 `DEMO_GREETING`，
其值爲 `"Hello from the environment"`。下面是此 Pod 的設定清單：

{{% code_sample file="pods/inject/envars.yaml" %}}

<!--
1. Create a Pod based on that manifest:
-->
1. 基於設定清單創建一個 Pod：

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/inject/envars.yaml
    ```

<!--
1. List the running Pods:
-->
2. 獲取正在運行的 Pod 信息：

    ```shell
    kubectl get pods -l purpose=demonstrate-envars
    ```

    <!--
    The output is similar to this:
    -->
    查詢結果應爲：

    ```
    NAME            READY     STATUS    RESTARTS   AGE
    envar-demo      1/1       Running   0          9s
    ```

<!--
1. List the Pod's container environment variables:
-->
3. 列出 Pod 容器的環境變量：

    ```shell
    kubectl exec envar-demo -- printenv
    ```
    
    <!--
    The output is similar to this:
    -->
    打印結果應爲：

    ```
    NODE_VERSION=4.4.2
    EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
    HOSTNAME=envar-demo
    ...
    DEMO_GREETING=Hello from the environment
    DEMO_FAREWELL=Such a sweet sorrow
    ```

{{< note >}}
<!--
The environment variables set using the `env` or `envFrom` field
override any environment variables specified in the container image.
-->
通過 `env` 或 `envFrom` 字段設置的環境變量將覆蓋容器映像檔中指定的所有環境變量。
{{< /note >}}

{{< note >}}
<!--
Environment variables may reference each other, however ordering is important.
Variables making use of others defined in the same context must come later in
the list. Similarly, avoid circular references.
-->
環境變量可以互相引用，但是順序很重要。
使用在相同上下文中定義的其他變量的變量必須在列表的後面。
同樣，請避免使用循環引用。
{{< /note >}}

<!--
## Using environment variables inside of your config

Environment variables that you define in a Pod's configuration under 
`.spec.containers[*].env[*]` can be used elsewhere in the configuration, for 
example in commands and arguments that you set for the Pod's containers.
In the example configuration below, the `GREETING`, `HONORIFIC`, and
`NAME` environment variables are set to `Warm greetings to`, `The Most
Honorable`, and `Kubernetes`, respectively. The environment variable 
`MESSAGE` combines the set of all these environment variables and then uses it 
as a CLI argument passed to the `env-print-demo` container.
-->
## 在設定中使用環境變量   {#using-env-var-inside-of-your-config}

你在 Pod 的設定中定義的、位於 `.spec.containers[*].env[*]` 下的環境變量
可以在設定的其他地方使用，例如可用在爲 Pod 的容器設置的命令和參數中。
在下面的示例設定中，環境變量 `GREETING`、`HONORIFIC` 和 `NAME` 分別設置爲 `Warm greetings to`、
`The Most Honorable` 和 `Kubernetes`。
環境變量 `MESSAGE` 將所有這些環境變量的集合組合起來，
然後再傳遞給容器 `env-print-demo` 的 CLI 參數中使用。

<!--
Environment variable names may consist of any [printable ASCII characters](https://www.ascii-code.com/characters/printable-characters) except '='.
-->
環境變量名稱可以由除了 '='
外的任何[可打印的 ASCII](https://www.ascii-code.com/characters/printable-characters)
字符組成。

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
創建後，命令 `echo Warm greetings to The Most Honorable Kubernetes` 將在容器中運行。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Learn about [using secrets as environment variables](/docs/concepts/configuration/secret/#using-secrets-as-environment-variables).
* See [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).
-->
* 進一步瞭解[環境變量](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* 進一步瞭解[通過環境變量來使用 Secret](/zh-cn/docs/concepts/configuration/secret/#using-secrets-as-environment-variables)
* 關於 [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core) 資源的信息。
