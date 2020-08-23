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
本页将展示如何为 kubernetes Pod 下的容器设置环境变量。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Define an environment variable for a container
-->
## 为容器设置一个环境变量

<!--
When you create a Pod, you can set environment variables for the containers
that run in the Pod. To set environment variables, include the `env` or
`envFrom` field in the configuration file.
-->
创建 Pod 时，可以为其下的容器设置环境变量。通过配置文件的 `env` 或者 `envFrom` 字段来设置环境变量。

<!--
In this exercise, you create a Pod that runs one container. The configuration
file for the Pod defines an environment variable with name `DEMO_GREETING` and
value `"Hello from the environment"`. Here is the configuration file for the
Pod:
-->
本示例中，将创建一个只包含单个容器的 Pod。Pod 的配置文件中设置环境变量的名称为 `DEMO_GREETING`，
其值为 `"Hello from the environment"`。下面是 Pod 的配置文件内容：

{{< codenew file="pods/inject/envars.yaml" >}}

<!--
1. Create a Pod based on the YAML configuration file:
-->
1. 基于 YAML 文件创建一个 Pod：

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/inject/envars.yaml
    ```

<!--
1. List the running Pods:
-->
1. 获取一下当前正在运行的 Pods 信息：

    ```shell
    kubectl get pods -l purpose=demonstrate-envars
    ```

    <!--
    The output is similar to this:
    -->
    查询结果应为：
    
    ```shell
    NAME            READY     STATUS    RESTARTS   AGE
    envar-demo      1/1       Running   0          9s
    ```

<!--
1. Get a shell to the container running in your Pod:
-->
1. 进入该 Pod 下的容器并打开一个命令终端：
    
    ```shell
    kubectl exec -it envar-demo -- /bin/bash
    ```

<!--
1. In your shell, run the `printenv` command to list the environment variables.
-->
1. 在命令终端中通过执行 `printenv` 打印出环境变量。

    ```shell
    root@envar-demo:/# printenv
    ```
    
    <!--
    The output is similar to this:
    -->
    打印结果应为：
    
    ```shell
    NODE_VERSION=4.4.2
    EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
    HOSTNAME=envar-demo
    ...
    DEMO_GREETING=Hello from the environment
    DEMO_FAREWELL=Such a sweet sorrow
    ```

<!--
1. To exit the shell, enter `exit`.
-->
1. 通过键入 `exit` 退出命令终端。

<!--
{{< note >}}
The environment variables set using the `env` or `envFrom` field
will override any environment variables specified in the container image.
{{< /note >}}
-->
{{< note >}}
通过 `env` 或 `envFrom` 字段设置的环境变量将覆盖容器镜像中指定的所有环境变量。
{{< /note >}}

{{< note >}}
环境变量之间可能出现互相依赖或者循环引用的情况，使用之前需注意引用顺序
{{< /note >}}

<!--
## Using environment variables inside of your config

Environment variables that you define in a Pod's configuration can be used elsewhere in the configuration, for example in commands and arguments that you set for the Pod's containers. In the example configuration below, the `GREETING`, `HONORIFIC`, and `NAME` environment variables are set to `Warm greetings to`, `The Most Honorable`, and `Kubernetes`, respectively. Those environment variables are then used in the CLI arguments passed to the `env-print-demo` container.
-->
## 在配置中使用环境变量

您在 Pod 的配置中定义的环境变量可以在配置的其他地方使用，例如可用在为 Pod 的容器设置的命令和参数中。在下面的示例配置中，环境变量 `GREETING` ，`HONORIFIC` 和 `NAME` 分别设置为 `Warm greetings to` ，`The Most Honorable` 和 `Kubernetes`。然后这些环境变量在传递给容器 `env-print-demo` 的 CLI 参数中使用。

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
* Learn about [using secrets as environment variables](/docs/user-guide/secrets/#using-secrets-as-environment-variables).
* See [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).
-->

* 进一步了解[环境变量](/zh/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* 进一步了解[通过环境变量来使用 Secret](/zh/docs/concepts/configuration/secret/#using-secrets-as-environment-variables)
* 关于 [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core) 资源的信息。

