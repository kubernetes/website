---
title: 为容器设置环境变量
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
本页将展示如何为 Kubernetes Pod 下的容器设置环境变量。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Define an environment variable for a container
-->
## 为容器设置一个环境变量   {#define-an-env-variable-for-a-container}

<!--
When you create a Pod, you can set environment variables for the containers
that run in the Pod. To set environment variables, include the `env` or
`envFrom` field in the configuration file.
-->
创建 Pod 时，可以为其下的容器设置环境变量。通过配置文件的 `env` 或者 `envFrom` 字段来设置环境变量。

<!--
The `env` and `envFrom` fields have different effects.

`env`
: allows you to set environment variables for a container, specifying a value directly for each variable that you name.
-->
`env` 和 `envFrom` 字段具有不同的效果。

`env`
：可以为容器设置环境变量，直接为你所给的每个变量指定一个值。

<!--
`envFrom`
: allows you to set environment variables for a container by referencing either a ConfigMap or a Secret.
 When you use `envFrom`, all the key-value pairs in the referenced ConfigMap or Secret
 are set as environment variables for the container.
 You can also specify a common prefix string.
-->
`envFrom`
：你可以通过引用 ConfigMap 或 Secret 来设置容器的环境变量。
使用 `envFrom` 时，引用的 ConfigMap 或 Secret 中的所有键值对都被设置为容器的环境变量。
你也可以指定一个通用的前缀字符串。

<!--
You can read more about [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables)
and [Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/#configure-all-key-value-pairs-in-a-secret-as-container-environment-variables).

This page explains how to use `env`.
-->
你可以阅读有关 [ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables)
和 [Secret](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#configure-all-key-value-pairs-in-a-secret-as-container-environment-variables)
的更多信息。

本页介绍如何使用 `env`。

<!--
In this exercise, you create a Pod that runs one container. The configuration
file for the Pod defines an environment variable with name `DEMO_GREETING` and
value `"Hello from the environment"`. Here is the configuration manifest for the
Pod:
-->
本示例中，将创建一个只包含单个容器的 Pod。此 Pod 的配置文件中设置环境变量的名称为 `DEMO_GREETING`，
其值为 `"Hello from the environment"`。下面是此 Pod 的配置清单：

{{% code_sample file="pods/inject/envars.yaml" %}}

<!--
1. Create a Pod based on that manifest:
-->
1. 基于配置清单创建一个 Pod：

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/inject/envars.yaml
    ```

<!--
1. List the running Pods:
-->
2. 获取正在运行的 Pod 信息：

    ```shell
    kubectl get pods -l purpose=demonstrate-envars
    ```

    <!--
    The output is similar to this:
    -->
    查询结果应为：

    ```
    NAME            READY     STATUS    RESTARTS   AGE
    envar-demo      1/1       Running   0          9s
    ```

<!--
1. List the Pod's container environment variables:
-->
3. 列出 Pod 容器的环境变量：

    ```shell
    kubectl exec envar-demo -- printenv
    ```
    
    <!--
    The output is similar to this:
    -->
    打印结果应为：

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
通过 `env` 或 `envFrom` 字段设置的环境变量将覆盖容器镜像中指定的所有环境变量。
{{< /note >}}

{{< note >}}
<!--
Environment variables may reference each other, however ordering is important.
Variables making use of others defined in the same context must come later in
the list. Similarly, avoid circular references.
-->
环境变量可以互相引用，但是顺序很重要。
使用在相同上下文中定义的其他变量的变量必须在列表的后面。
同样，请避免使用循环引用。
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
## 在配置中使用环境变量   {#using-env-var-inside-of-your-config}

你在 Pod 的配置中定义的、位于 `.spec.containers[*].env[*]` 下的环境变量
可以在配置的其他地方使用，例如可用在为 Pod 的容器设置的命令和参数中。
在下面的示例配置中，环境变量 `GREETING`、`HONORIFIC` 和 `NAME` 分别设置为 `Warm greetings to`、
`The Most Honorable` 和 `Kubernetes`。
环境变量 `MESSAGE` 将所有这些环境变量的集合组合起来，
然后再传递给容器 `env-print-demo` 的 CLI 参数中使用。

<!--
Environment variable names consist of letters, numbers, underscores,
dots, or hyphens, but the first character cannot be a digit.
If the `RelaxedEnvironmentVariableValidation` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled,
all [printable ASCII characters](https://www.ascii-code.com/characters/printable-characters) except "=" may be used for environment variable names.
-->
环境变量名由字母、数字、下划线、点或连字符组成，但第一个字符不能是数字。
如果启用了 `RelaxedEnvironmentVariableValidation` 特性门控，
则所有可打印的 ASCII 字符（"=" 除外）都可以用于环境变量名。

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
创建后，命令 `echo Warm greetings to The Most Honorable Kubernetes` 将在容器中运行。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Learn about [using secrets as environment variables](/docs/concepts/configuration/secret/#using-secrets-as-environment-variables).
* See [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).
-->
* 进一步了解[环境变量](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* 进一步了解[通过环境变量来使用 Secret](/zh-cn/docs/concepts/configuration/secret/#using-secrets-as-environment-variables)
* 关于 [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core) 资源的信息。

